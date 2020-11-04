import { mapActions, mapGetters } from "vuex";

import EST from "@/lib/EST";
import Vue from "vue";
import axios from "axios";

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
        { loading: true }
      ],
      currentSelRate: {
        amount: NaN,
        // diamond: '0'
      },
      balanceBackLock: false,
      swagDiamondBalance: '0.00',
      lockedSubmit: true,

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
      swagConfig: "getSwagConfig"
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
      // this.rateList = this.swagConfig.rates;
      // this.selectedRate(this.rateList[0]);

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
    },
    showDetail(item) {
      this.detailRecoard = item;
    },
    closeDetail() {
      this.detailRecoard = null;
    },
  }
};
