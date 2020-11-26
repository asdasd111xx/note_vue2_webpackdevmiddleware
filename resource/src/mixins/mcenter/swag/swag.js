import { mapActions, mapGetters } from "vuex";

import EST from '@/lib/EST';
import axios from "axios";
import bbosRequest from "@/api/bbosRequest";
import moment from 'moment';

export default {
  props: {},
  data() {
    return {
      rateList: [
        { loading: true },
        { loading: true },
        { loading: true },
        { loading: true },
        { loading: true },
        { loading: true },
        { loading: true },
        { loading: true }
      ],
      currentSelRate: {
        amount: NaN,
        // diamond: '0'
      },
      balanceBackLock: false,
      swagDiamondBalance: '0',
      lockedSubmit: true,
      isMaintainSwag: false,
      showTips: false,
      estToday: EST(new Date(), '', true),
      maintainInfo: null,
      updateBalanceTimer: null,

      // banner
      swagBanner: [
        { src: '/static/image/porn1/mcenter/swag/banner_swag.png' }],

      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus',
      memInfo: "getMemInfo",
      membalance: "getMemBalance",
      swagBalance: "getSwagBalance",
      swagConfig: "getSwagConfig",
      siteConfig: "getSiteConfig"
    }),
  },
  beforeDestroy() {
    clearInterval(this.updateBalanceTimer);
    this.updateBalanceTimer = null;
  },
  created() {
  },
  watch: {
    swagBalance(val) {
      this.swagDiamondBalance = val.balance;
    },
  },
  methods: {
    ...mapActions([
      "actionSetUserBalance",
      "actionSetUserdata",
      "actionSetGlobalMessage",
      "actionVerificationFormData",
      'actionSetSwagConfig',
      'actionSetSwagBalance'
    ]),
    initSwagConfig(onlyCheckMaintain = false) {
      if (this.loginStatus && !onlyCheckMaintain) {
        this.updateBalance();
      }
      return this.actionSetSwagConfig().then(() => {
        // 永久維護
        if (this.swagConfig && this.swagConfig.enable === 0) {
          this.isMaintainSwag = true;
          if (this.$route.name === 'mcenter-swag') {
            this.actionSetGlobalMessage({
              msg: `SWAG 维护中`,
              style: 'maintain'
            })
          }
        }

        // 區段維護
        const maintain_start_at = moment(this.swagConfig.maintain_start_at).add(-12, 'hours');
        const maintain_end_at = moment(this.swagConfig.maintain_end_at).add(-12, 'hours');
        const now = moment(this.estToday);

        // 現在時間 相差 維護時間
        const isMaintain = now.isBefore(maintain_end_at) && now.isAfter(maintain_start_at);

        if (isMaintain) {
          this.isMaintainSwag = true;
        }

        if (onlyCheckMaintain) {
          return;
        }


        if (this.$route.name === 'mcenter-swag') {
          // 可購買的鑽石/金額列表
          if (this.swagConfig.rates) {
            this.rateList = this.swagConfig.rates;

            let tmp_d_currentSelRate = JSON.parse(localStorage.getItem("tmp_d_currentSelRate"));
            if (tmp_d_currentSelRate && this.rateList.find(i => i.amount === tmp_d_currentSelRate.amount &&
              i.diamond === tmp_d_currentSelRate.diamond)) {
              this.selectedRate(tmp_d_currentSelRate);
            }
            else {
              this.selectedRate(this.rateList[0]);
            }
          }

          if (this.swagConfig.recharge_verify === 1) {
            this.depositCheck();
            return;
          }

          // 驗證手機成功回來
          if (localStorage.getItem("tmp_d_1")) {
            this.submitCheck();
          }

        }
      });
    },
    handleSwagBalance() {
      if (this.isMaintainSwag) {
        if (this.swagConfig.enable === 0) {
          this.actionSetGlobalMessage({
            msg: `鸭博色播 维护中`,
            style: 'maintain'
          })
        } else {
          if (this.maintainInfo) {
            return;
          }

          const start = moment(this.swagConfig.maintain_start_at).add(-12, 'hours')
            .format('YYYY-MM-DD HH:mm:ss');
          const end = moment(this.swagConfig.maintain_end_at).add(-12, 'hours')
            .format('YYYY-MM-DD HH:mm:ss');

          this.maintainInfo = [
            {
              title: '-美东时间-',
              startAt: start,
              endAt: end
            },
            {
              title: '-北京时间-',
              startAt: this.swagConfig.maintain_start_at,
              endAt: this.swagConfig.maintain_end_at
            }
          ]
        }
      }
    },
    handleCloseMaintainInfo() {
      this.maintainInfo = null;
    },
    updateBalance() {
      if (this.loginStatus && this.$route.name !== "home") {
        this.actionSetUserBalance();
        this.actionSetSwagBalance();

        this.updateBalanceTimer = setInterval(() => {
          this.actionSetUserBalance();
          this.actionSetSwagBalance();
        }, 40000);
      }
    },
    balanceBack() {
      if (!this.balanceBackLock) {
        this.balanceBackLock = true;

        axios({
          method: "put",
          url: "/api/v1/c/vendor/recycle/balance",
        })
          .then(res => {
            if (res && res.data && res.data.result === 'ok') {
              this.actionSetGlobalMessage({
                msg: '回收成功',
              });

              setTimeout(() => {
                this.balanceBackLock = false;
              }, 1500)
            }

            this.actionSetUserBalance();
            this.actionSetSwagBalance();
          })
          .catch(res => {
            if (res.response && res.response.data && res.response.data.msg) {
              this.actionSetGlobalMessage({
                msg: res.response.data.msg,
              });

              setTimeout(() => {
                this.balanceBackLock = false;
              }, 1500)
            }
          });
      }
    },
    selectedRate(item) {
      this.currentSelRate = item;
      if (this.swagConfig.enable !== 0) {
        this.lockedSubmit = false;
      }
    },
    verification(item) {
      let errorMessage = "";
      if (item.key === "phone") {
        this.actionVerificationFormData({
          target: "phone",
          value: this.formData.phone
        }).then(val => {
          this.formData.phone = val;
        });

        if (this.formData.phone.length < 11) {
          errorMessage = "手机格式不符合要求";
          this.isVerifyPhone = false;
        } else {
          errorMessage = "";
          this.isVerifyPhone = true;
        }
      }

      this.errorMessage[item.key] = errorMessage;

      // 檢查無錯誤訊息
      let noError = true;
      this.inputInfo.forEach(item => {
        if (this.errorMessage[item.key]) {
          noError = false;
        }
      });

      let hasValue = true;
      this.inputInfo.forEach(item => {
        if (!this.formData[item.key]) {
          hasValue = false;
        }
      });

      this.isVerifyForm = noError && hasValue;
    },
    depositCheck() {
      this.isLoading = true;

      return axios({
        method: 'get',
        url: '/api/v1/c/user-stat/deposit-withdraw',
      }).then(res => {
        this.isLoading = false;

        if (res && res.data) {
          const depositCount = Number(res.data.ret.deposit_count);
          if (depositCount <= 0) {
            this.showTips = true;
            return (false);
          } else {
            return (true);
          }
        }
      }).catch(error => {
        this.actionSetGlobalMessage({
          msg: error.response.msg,
        });
      })
    },
    submitCheck() {
      if (this.isLoading || this.isMaintainSwag || this.lockedSubmit) {
        return;
      }

      this.isLoading = true;

      // 暫存選擇欄位 簡訊驗證
      let tmp_currentSelRate = {};
      let params = {
        amount: this.currentSelRate.amount,
        diamond: this.currentSelRate.diamond,
        keyring: localStorage.getItem("tmp_d_1"), // 手機驗證成功後回傳
      }

      if (localStorage.getItem('tmp_d_currentSelRate')) {
        tmp_currentSelRate = JSON.parse(localStorage.getItem('tmp_d_currentSelRate'));
        params['amount'] = tmp_currentSelRate.amount;
        params['diamond'] = tmp_currentSelRate.diamond;
      } else {
        params['amount'] = this.currentSelRate.amount;
        params['diamond'] = this.currentSelRate.diamond;
      }

      // axios({
      //   method: "get",
      //   url: "/api/outer/v1/c/ext/swag/transfer/check",
      //   params: { ...params, vendor: 'swag' },
      // })
      //   .then(res => {
      //     console.log(res)
      //   })
      //   .catch(error => {
      //     console.log(error)
      //   });

      // 送出前檢查欄位
      return bbosRequest({
        method: "get",
        url: this.siteConfig.BBOS_DOMIAN + '/Ext/Swag/Vendor/Transfer/Check',
        reqHeaders: {
          'Vendor': this.memInfo.user.domain,
        },
        params: { ...params, vendor: 'swag' },
      }).then((res) => {
        console.log(res.data)

        if (res && res.status === '000') {
          let ret = res.data;
          if (ret && ret.verify_data && ret.verify_balance && ret.verify_rates) {
            this.submit(params);
          } else {
            let msg = '';
            let cb = () => { };
            if (!ret.verify_data) {
              msg = '资料异常，请刷新画面或重新选择';
              cb = () => {
                // window.location.reload();
              }
            } else if (!ret.verify_balance) {
              msg = '余额不足，请检查红利帐户或执行一键归户';
            } else if (!ret.verify_balance) {
              msg = '钻石汇率变动';
              this.initSwagConfig();
            }

            this.actionSetGlobalMessage({
              msg: msg,
              cb: cb
            })

            setTimeout(() => {
              this.isLoading = false;
            }, 1500)
          }
        }
      })
    },
    submit(params) {
      if (this.isMaintainSwag || this.lockedSubmit || this.showTips) {
        return;
      }
      this.isLoading = true;

      this.actionSetSwagConfig().then(() => {

        const submitTransfer = () => {
          this.isLoading = true;

          // 手機驗證開關
          if (this.swagConfig &&
            this.swagConfig.phone_verify &&
            +this.swagConfig.phone_verify === 1 &&
            !localStorage.getItem("tmp_d_1")) {
            this.saveCurrentValue();
            this.$router.push(
              "/mobile/mcenter/accountData/phone?redirect=swag"
            );
            return;
          }

          // axios({
          //   method: "put",
          //   url: "/api/v1/c/ext/swag?api_url=/api/outer/v1/c/swag/transfer",
          //   params: params,
          // })
          //   .then(res => {
          //     console.log(res)
          //   })
          //   .catch(error => {
          //     console.log(error)
          //   });

          bbosRequest({
            method: "put",
            url: this.siteConfig.BBOS_DOMIAN + '/Ext/Swag/Vendor/Transfer',
            reqHeaders: {
              'Vendor': this.memInfo.user.domain,
            },
            params: params,
          }).then((res) => {

            if (res && res.status === '000') {

              this.actionSetGlobalMessage({
                msg: '兑换成功',
                code: res.code,
                origin: 'mcenter/swag'
              });
            } else {
              this.actionSetGlobalMessage({
                msg: res.msg,
                code: res.code,
                origin: 'mcenter/swag'
              });

              this.initSwagConfig();
            }

            this.actionSetUserBalance();
            this.actionSetSwagBalance();

            setTimeout(() => {
              this.isLoading = false;
            }, 1500)
          })

          localStorage.removeItem("tmp_d_1");
          localStorage.removeItem("tmp_d_currentSelRate");
        }

        // 充值開關
        if (this.swagConfig.recharge_verify === 1) {
          this.depositCheck().then((check) => {
            if (check) {
              submitTransfer();
            }
          });
        } else {
          submitTransfer();
        }
      });
    },
    showDetail(item) {
      this.detailRecoard = item;
    },
    closeDetail() {
      this.detailRecoard = null;
    },
    saveCurrentValue() {
      localStorage.setItem(
        "tmp_d_currentSelRate",
        JSON.stringify(this.currentSelRate));
    },
  }
};
