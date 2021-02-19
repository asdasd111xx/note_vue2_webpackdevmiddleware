import { mapActions, mapGetters } from "vuex";

import { API_MCENTER_USER_CONFIG } from "@/config/api";
import ajax from "@/lib/ajax";
import axios from "axios";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  data() {
    return {
      // 國碼
      phoneHead: "+86",
      phoneHeadOption: [],
      bankList: [],
      currentBank: "",
      isShowPopBankList: false,
      isVerifyPhone: false,
      formData: {
        accountName: "",
        bankId: "",
        province: "",
        city: "",
        branch: "",
        account: "",
        phone: "",
        keyring: ""
      },
      NextStepStatus: false,
      errorMsg: "",
      lockStatus: false,
      time: 0,
      msg: "",
      smsTimer: null,
      toggleCaptcha: false,
      captcha: null
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    isShowCaptcha: {
      get() {
        return this.toggleCaptcha;
      },
      set(value) {
        return (this.toggleCaptcha = value);
      }
    },
    captchaData: {
      get() {
        return this.captcha;
      },
      set(value) {
        return (this.captcha = value);
      }
    },
    username() {
      if (!this.memInfo.user.name) {
        return "";
      }

      return this.memInfo.user.name.slice(0, 1);

      // return this.memInfo.user.name
      //   .split("")
      //   .map((item, index) => {
      //     if (index === 0) {
      //       return item;
      //     }
      //     return "*";
      //   })
      //   .join("");
    },
    checkPhoneVerification() {
      // player_user_bank_phone (會員綁定銀行卡前需手機驗證，0否，1每次，2首次)
      // phone.corfirm (已認證，0未認證/1已認證/2人工驗證)

      let result = null;
      let verifyNum = this.memInfo.config.player_user_bank_phone;
      let isPhoneVerify =
        this.memInfo.phone.phone && this.memInfo.phone.confirm !== 0;

      if (verifyNum === 0 || (verifyNum === 2 && isPhoneVerify)) {
        result = false;
      }

      if (verifyNum === 1 || (verifyNum === 2 && !isPhoneVerify)) {
        result = true;
      }

      return result;
    }
  },
  watch: {
    addBankCardStep() {
      if (this.addBankCardStep === "one") {
        this.formData.phone = "";
        this.formData.keyring = "";
        this.errorMsg = "";
        this.checkData();
      } else if (this.addBankCardStep === "two") {
        this.errorMsg = "";
      }
    },
    captchaData() {
      this.getKeyring();
    },
    "formData.phone"() {
      if (["ey1"].includes(this.themeTPL) || this.formData.phone.length >= 11) {
        this.errorMsg = "";
        this.isVerifyPhone = true;
      } else {
        // this.errorMsg = "手机格式不符合要求";
        this.isVerifyPhone = false;
      }
    }
  },
  created() {
    // 已經有真實姓名時不送該欄位
    if (this.memInfo.user.name) {
      delete this.formData["accountName"];
    }

    if (
      ["porn1", "sg1"].includes(this.themeTPL) ||
      (this.memInfo.config.player_user_bank && ["ey1"].includes(this.themeTPL))
    ) {
      delete this.formData["city"];
      delete this.formData["province"];
    }

    // 推播返回 補齊資料
    if (
      localStorage.getItem("click-notification") &&
      localStorage.getItem("add-bank-form")
    ) {
      const data = JSON.parse(localStorage.getItem("add-bank-form"));
      console.log(data);

      this.NextStepStatus = false;
      this.$emit("update:addBankCardStep", "two");
      this.$nextTick(() => {
        this.formData = { ...data };
        localStorage.removeItem("add-bank-form");
        localStorage.removeItem("click-notification");
      });
    }

    // 國碼
    ajax({
      method: "get",
      url: API_MCENTER_USER_CONFIG,
      errorAlert: false
    }).then(response => {
      if (response && response.result === "ok") {
        this.phoneHeadOption = response.ret.config.phone.country_codes;
      }
    });
  },
  beforeDestroy() {
    if (localStorage.getItem("click-notification")) {
      localStorage.setItem("add-bank-form", JSON.stringify(this.formData));
    }
  },
  methods: {
    ...mapActions([
      "actionSetUserdata",
      "actionVerificationFormData",
      "actionSetGlobalMessage"
    ]),
    sendData() {
      if (this.addBankCardStep === "one" && this.checkPhoneVerification) {
        this.NextStepStatus = false;
        this.$emit("update:addBankCardStep", "two");
        return;
      }

      if (this.lockStatus) {
        return;
      }

      this.lockStatus = true;

      // 已經有真實姓名時不送該欄位
      if (this.memInfo.user.name) {
        delete this.formData["accountName"];
      }

      const params = {
        ...this.formData,
        lang: "zh-cn",
        phone: `${this.phoneHead.replace("+", "")}-${this.formData.phone}`
      };

      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/User/Bank`,
        params
      })
        .then(response => {
          const { status, errorCode, msg } = response;

          if (errorCode !== "00" || status !== "000") {
            this.lockStatus = false;
            this.errorMsg = msg;

            if (this.addBankCardStep === "one") {
              this.msg = msg;
            }
            return;
          }

          this.msg = "绑定成功";
          this.lockStatus = false;
          this.addBankCardStep === "one";

          if (!this.memInfo.user.name) {
            this.actionSetUserdata(true);
          }
        })
        .catch(error => {
          const { msg } = error.response.data;

          this.lockStatus = false;
          this.errorMsg = msg;

          if (this.addBankCardStep === "one") {
            this.msg = msg;
          }
        });

      // ajax({
      //   method: "post",
      //   url: "/api/v1/c/player/user_bank",
      //   errorAlert: false,
      //   params,
      //   success: () => {
      //     this.msg = "绑定成功";
      //     this.lockStatus = false;
      //     this.addBankCardStep === "one";

      //     if (!this.memInfo.user.name) {
      //       this.actionSetUserdata(true);
      //     }
      //   },
      //   fail: error => {
      //     this.lockStatus = false;
      //     this.errorMsg = error.data.msg;

      //     if (this.addBankCardStep === "one") {
      //       this.msg = error.data.msg;
      //     }
      //   }
      // });
    },
    setBank(bank) {
      this.isShowPopBankList = false;
      this.formData.bankId = bank.id;
      this.currentBank = bank.name;
      this.checkData();
    },
    checkData(value, key) {
      if (key === "accountName" && this.memInfo.user.name === "") {
        this.actionVerificationFormData({ target: "name", value: value }).then(
          val => {
            this.formData.accountName = val;
          }
        );
      }

      if (key === "province" || key === "city") {
        this.actionVerificationFormData({ target: "name", value: value }).then(
          val => {
            this.formData[key] = val;
          }
        );
      }

      if (key === "branch") {
        const re = /[^\u3000\u3400-\u4DBF\u4E00-\u9FFF]/g;
        this.formData.branch = value.replace(re, "");
      }

      if (key === "account") {
        this.actionVerificationFormData({
          target: "bankCard",
          value: value
        }).then(val => {
          this.formData.account = val;
        });
      }

      if (key === "keyring") {
        this.actionVerificationFormData({ target: "code", value: value }).then(
          val => {
            this.formData.keyring = val;
          }
        );
      }

      this.NextStepStatus = Object.keys(this.formData).every(key => {
        if (this.addBankCardStep === "one") {
          if (key === "account") {
            return this.formData[key].length > 15;
          }

          if (["ey1"].includes(this.themeTPL)) {
            if (
              !this.memInfo.config.player_user_bank &&
              key === "city" &&
              !this.memInfo.config.player_user_bank &&
              key === "province"
            ) {
              return this.formData[key];
            }
          }

          // 需要填入時才檢查
          if (key === "accountName" && this.memInfo.user.name === "") {
            return this.formData["accountName"];
          }

          if (
            key !== "phone" &&
            key !== "keyring" &&
            key !== "city" &&
            key !== "province"
          ) {
            return this.formData[key];
          }

          return true;
        }

        if (this.addBankCardStep === "two") {
          if (key === "phone" || key === "keyring") {
            this.errorMsg = "";
            return this.formData[key];
          }
          return true;
        }

        return true;
      });
    },
    getBankImage(image_url) {
      return {
        src: image_url,
        error: this.$getCdnPath(
          "/static/image/common/default/bank_card_default.png"
        ),
        loading: this.$getCdnPath(
          "/static/image/common/default/bank_card_default.png"
        )
      };
    },
    showCaptchaPopup() {
      // 按下驗證碼再更新一次驗證碼類型
      this.actionSetUserdata(true).then(() => {
        // 無認證直接呼叫
        if (this.memInfo.config.default_captcha_type === 0) {
          this.getKeyring();
          return;
        }

        // 彈驗證窗並利用Watch captchaData來呼叫 getKeyring()
        this.toggleCaptcha = true;
      });
    },
    getKeyring() {
      if (this.lockStatus || this.smsTimer) {
        return;
      }
      this.lockStatus = true;

      let captchaParams = {};
      captchaParams["captcha_text"] = this.captchaData || "";

      axios({
        method: "post",
        url: "/api/v1/c/player/verify/user_bank/sms",
        data: {
          phone: `${this.phoneHead.replace("+", "")}-${this.formData.phone}`,
          ...captchaParams
        }
      })
        .then(res => {
          this.lockStatus = false;
          this.actionSetGlobalMessage({
            msg: this.$text("S_SEND_CHECK_CODE_VALID_TIME").replace("%s", "5")
          });
          if (res && res.data && res.data.result === "ok") {
            axios({
              method: "get",
              url: "/api/v1/c/player/phone/ttl"
            })
              .then(res => {
                if (res && res.data && res.data.result === "ok") {
                  this.time = res.data.ret;
                  this.smsTimer = setInterval(() => {
                    if (this.time <= 0) {
                      clearInterval(this.smsTimer);
                      this.smsTimer = null;
                      return;
                    }
                    this.time -= 1;
                  }, 1000);
                }
              })
              .catch(error => {
                if (error.response && error.response.status === 429) {
                  this.errorMsg = "操作太频繁，请稍候再试";
                  return;
                }

                if (error.response.data.msg) {
                  this.errorMsg = `${error.response.data.msg}`;
                  return;
                }
              });
          } else {
            if (res.data && res.data.msg) {
              this.errorMsg = res.data.msg;
            } else {
              console.log(res.data);
              this.errorMsg = res.data;
            }
          }
        })
        .catch(error => {
          if (error.response && error.response.status === 429) {
            this.errorMsg = "操作太频繁，请稍候再试";
            return;
          }

          this.lockStatus = false;

          console.log(error.response);
          if (error.response.data && error.response.data.msg) {
            this.errorMsg = error.response.data.msg;
          } else {
            this.errorMsg = error.response.data;
          }
        });
    }
  }
};
