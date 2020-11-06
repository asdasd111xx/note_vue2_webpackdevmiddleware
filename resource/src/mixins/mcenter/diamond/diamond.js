import { mapActions, mapGetters } from "vuex";

import EST from "@/lib/EST";
import Vue from "vue";
import axios from "axios";
import bbosRequest from "@/api/bbosRequest";

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

      // banner
      swagBanner: [
        { src: '/static/image/porn1/mcenter/swag/banner_swag.png' },
        { src: '/static/image/porn1/mcenter/swag/banner_swag.png' }],
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
    inputInfo() {
      return [
        {
          key: "target_username",
          title: "转入帐号",
          error: "",
          placeholder: "请输入下线帐号"
        },
      ];
    },
  },
  beforeDestroy() {
    clearInterval(this.updateBalance);
    this.updateBalance = null;
  },
  created() {
    this.actionSetUserBalance();
    this.actionSetSwagBalance();
    this.actionSetSwagConfig().then(() => {

      // 可購買的鑽石/金額列表
      this.rateList = this.swagConfig.rates;
      this.selectedRate(this.rateList[0]);

      // 維護時間
      // this.swagConfig.maintain_end_at
      // this.swagConfig.maintain_start_at
    });

    if (this.loginStatus) {
      this.updateBalance = setInterval(() => {
        this.actionSetUserBalance();
        this.actionSetSwagBalance();
      }, 40000);
    }
  },
  watch: {
    swagBalance(val) {
      this.swagDiamondBalance = +val.balance === 0 ? '0' : val.balance;
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
      this.lockedSubmit = false;
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
    submit() {
      if (!this.isSendSubmit && this.currentSelRate && !this.lockedSubmit) {
        this.isSendSubmit = true;
        bbosRequest({
          method: "put",
          url: this.siteConfig.BBOS_DOMIAN + '/Ext/Swag/Vendor/Transfer',
          reqHeaders: {
            'Vendor': this.memInfo.user.domain,
          },
          params: {
            "lang": "zh-cn",
            amount: this.currentSelRate.amount,
            diamond: this.currentSelRate.diamond,
          },
        }).then((res) => {
          console.log(res)

          this.actionSetGlobalMessage({
            msg: res.msg,
          });

          setTimeout(() => {
            this.isSendSubmit = false;
          }, 1500)
        })
      }
    },
    showDetail(item) {
      this.detailRecoard = item;
    },
    closeDetail() {
      this.detailRecoard = null;
    },
  }
};
