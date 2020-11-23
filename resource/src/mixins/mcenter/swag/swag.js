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
      isSendSubmit: false,
      isMaintainSwag: false,
      showTips: false,
      estToday: EST(new Date(), '', true),
      maintainInfo: null,

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
    clearInterval(this.updateBalance);
    this.updateBalance = null;
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
    initSwagConfig() {
      if (this.loginStatus) {
        this.updateBalance();
      }

      return this.actionSetSwagConfig().then(() => {
        // 永久維護
        if (this.swagConfig && this.swagConfig.enable === 0) {
          this.isMaintainSwag = true;
          if (this.$route.name === 'mcenter-swag') {
            this.actionSetGlobalMessage({
              msg: `鸭博色播 维护中`,
              style: 'maintain'
            })
          }
        }

        /* 客製維護區間 */
        // 區段維護
        const maintain_start_at = moment(this.swagConfig.maintain_start_at);
        const maintain_end_at = moment(this.swagConfig.maintain_end_at);
        const now = moment(this.estToday);
        // 現在時間 相差 維護時間
        const isMaintain = now.isBefore(maintain_end_at) && now.isAfter(maintain_start_at);

        if (isMaintain) {
          this.isMaintainSwag = true;
        }

        /* 客製維護區間 */

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
              // this.selectedRate(this.rateList[0]);
            }
          }

          // 驗證手機成功回來
          if (this.$route.name === 'mcenter-swag' && localStorage.getItem("tmp_d_1")) {
            this.submit();
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

          const start = moment(this.swagConfig.maintain_start_at).utcOffset(12)
            .format('YYYY-MM-DD HH:mm:ss');
          const end = moment(this.swagConfig.maintain_end_at).utcOffset(12)
            .format('YYYY-MM-DD HH:mm:ss');

          this.maintainInfo = [
            {
              title: '-美东时间-',
              startAt: this.swagConfig.maintain_start_at,
              endAt: this.swagConfig.maintain_end_at
            },
            {
              title: '-北京时间-',
              startAt: start,
              endAt: end
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

        this.updateBalance = setInterval(() => {
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
    submitCheck() {
      if (this.isLoading || this.isMaintainSwag || this.lockedSubmit) {
        return;
      }
      // 送出前檢查欄位
      bbosRequest({
        method: "put",
        url: this.siteConfig.BBOS_DOMIAN + '',
        reqHeaders: {
          'Vendor': this.memInfo.user.domain,
        },
        params: params,
      }).then((res) => {
        this.isLoading = false;

        if (res && res.status === '000') {
        }
      })
    },
    submit() {
      if (this.isLoading || this.isMaintainSwag || this.lockedSubmit) {
        return;
      }
      this.isLoading = true;

      this.actionSetSwagConfig().then(() => {

        // 充值開關
        if (this.swagConfig && this.swagConfig.recharge_verify === 1) {
          this.showTips = true;
          this.isLoading = false;
          return;
        }

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

        // 暫存選擇欄位 簡訊驗證
        let tmp_currentSelRate = {};
        let params = {
          "lang": "zh-cn",
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

        if (!this.isSendSubmit && params['amount'] && !this.lockedSubmit) {
          this.isSendSubmit = true;

          bbosRequest({
            method: "put",
            url: this.siteConfig.BBOS_DOMIAN + '/Ext/Swag/Vendor/Transfer',
            reqHeaders: {
              'Vendor': this.memInfo.user.domain,
            },
            params: params,
          }).then((res) => {
            this.isLoading = false;

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
            }

            this.actionSetUserBalance();
            this.actionSetSwagBalance();

            setTimeout(() => {
              this.isSendSubmit = false;
            }, 1500)
          })

          localStorage.removeItem("tmp_d_1");
          localStorage.removeItem("tmp_d_currentSelRate");
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
