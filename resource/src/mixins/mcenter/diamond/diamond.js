import { mapActions, mapGetters } from "vuex";

import EST from "@/lib/EST";
import Vue from "vue";
import axios from "axios";

export default {
  props: {},
  data() {
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      membalance: "getMemBalance",
    }),
    inputInfo() {
      return [
        {
          key: "target_username",
          title: "转入帐号",
          error: "",
          placeholder: "请输入下线帐号"
        },
        {
          key: "amount",
          title: "转让金额",
          error: "",
          placeholder: `请输入转让金额`
        },
        {
          key: "phone",
          title: "手机号码",
          error: "",
          placeholder: "请输入手机号码",
          maxlength: 11
        },
        {
          key: "keyring",
          title: "获取验证码",
          error: "",
          placeholder: "请输入验证码",
          maxlength: 6
        }
      ];
    },
  },
  beforeDestroy() {
    clearInterval(this.updateBalance);
    this.updateBalance = null;
  },
  created() {

    this.updateBalance = setInterval(() => {
      this.actionSetUserBalance();
    }, 30000);
  },
  watch: {
    membalance() {
      this.getRechargeBalance();
    }
  },
  methods: {
    ...mapActions([
      "actionSetUserBalance",
      "actionSetUserdata",
      "actionSetGlobalMessage",
      "actionVerificationFormData",
    ]),
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

      if (item.key === "amount") {
        const limit = Number(this.rechargeConfig.recharge_limit) || 0;
        const amount = Number(this.formData.amount);

        this.formData.amount = this.formData.amount
          .replace(/[^0-9]/g, "")
          .substring(0, 16);

        if (!amount || amount === 0) {
          errorMessage = "请输入转让金额";
        } else if (limit && amount < limit) {
          errorMessage = "转帐金额低于最低限额";
        } else if (amount > this.maxRechargeBalance) {
          // errorMessage = "馀额不足";
        } else {
          errorMessage = "";
        }
      }

      if (item.key == "target_username") {
        const data = this.pwdResetInfo["username"];
        const re = new RegExp(data.regExp);
        const msg = this.$t(data.errorMsg);

        this.actionVerificationFormData({
          target: "username",
          value: this.formData.target_username
        }).then(val => {
          this.formData.target_username = val;
        });

        if (!re.test(this.formData.target_username)) {
          errorMessage = msg;
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
    getDiamondeRecoard() {
      return axios({
        method: "get",
        url: "/api/v1/c/cash/entry",
        params: {
          start_at: Vue.moment(this.startTime).format(
            "YYYY-MM-DD 00:00:00-04:00"
          ),
          end_at: Vue.moment(this.endTime).format(
            "YYYY-MM-DD 23:59:59-04:00"
          ),
          category: "ingroup_transfer", // 缺鑽石參數
          firstResult: 0 // 每頁起始筆數
          // maxResults: 20, // 每頁顯示幾筆
        }
      })
        .then(res => {
          if (res && res.data && res.data.result === "ok") {
            this.rechargeRecoard = res.data.ret;
          } else {
            this.actionSetGlobalMessage({ msg: res.data.msg });
          }
        })
        .catch(error => {
          this.actionSetGlobalMessage({
            msg: error.response.data.msg
          });
        });
    },
    showDetail(item) {
      this.detailRecoard = item;
    },
    closeDetail() {
      this.detailRecoard = null;
    },
  }
};
