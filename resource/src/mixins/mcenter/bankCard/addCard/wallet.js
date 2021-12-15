import { getCookie, setCookie } from "@/lib/cookie";
import { mapActions, mapGetters } from "vuex";

import { API_MCENTER_USER_CONFIG } from "@/config/api";
import ajax from "@/lib/ajax";
import axios from "axios";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  data() {
    return {
      time: 0,
      // lockStatus: false,
      isVerifyPhone: false,
      smsTimer: null,
      thirdyCaptchaObj: null,
      NextStepStatus: false,
      isShowCaptcha: false,
      isClickedCaptcha: false
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig",
      domainConfig: "getDomainConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    checkWalletPhoneVerification() {
      // player_user_virtual_bank_phone (會員綁定電子錢包前需手機驗證，0否，1每次，2首次)
      // phone.corfirm (已認證，0未認證/1已認證/2人工驗證)

      let result = null;
      let walletVerifyNum = this.memInfo.config.player_user_virtual_bank_phone;
      let isPhoneVerify =
        this.memInfo.phone.phone && this.memInfo.phone.confirm !== 0;

      if (walletVerifyNum === 0 || (walletVerifyNum === 2 && isPhoneVerify)) {
        result = false;
      }

      if (walletVerifyNum === 1 || (walletVerifyNum === 2 && !isPhoneVerify)) {
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
    thirdyCaptchaObj() {
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
  methods: {
    ...mapActions([
      "actionSetUserdata",
      "actionVerificationFormData",
      "actionSetGlobalMessage",
      "actionSetDomainConfigV2",
      "actionGetToManyRequestMsg"
    ]),
    setCaptcha(obj) {
      this.thirdyCaptchaObj = obj;
    },
    showCaptcha() {
      this.isShowCaptcha = !this.isShowCaptcha;
    },
    showCaptchaPopup() {
      if (this.isClickedCaptcha || this.smsTimer) {
        return;
      }
      this.isClickedCaptcha = true;
      setTimeout(() => {
        this.isClickedCaptcha = false;
      }, 2000);

      const params = [
        this.actionSetUserdata(true),
        this.actionSetDomainConfigV2()
      ];

      Promise.all(params).then(() => {
        // 無認證直接呼叫
        if (this.memInfo.config.default_captcha_type === 0) {
          this.getKeyring();
          return;
        }

        // 彈驗證窗並利用Watch thirdyCaptchaObj 來呼叫 getKeyring()
        this.showCaptcha();
      });
    },
    getKeyring() {
      // if (this.lockStatus || this.smsTimer) {
      //   return;
      // }
      // this.lockStatus = true;

      let captchaParams = {};
      captchaParams["captcha_text"] = this.thirdyCaptchaObj || "";

      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/Verify/User/Virtual/Bank/Sms`,
        params: {
          lang: "zh-cn",
          phone: `${this.phoneHead.replace("+", "")}-${this.formData.phone}`,
          ...captchaParams,
          aid: getCookie("aid") || localStorage.getItem("aid") || ""
        }
      })
        .then(res => {
          this.lockStatus = false;
          if (res && res.status === "000" && res.data === "operate success") {
            if (this.domainConfig && this.domainConfig.auto_keyring) {
            } else {
              this.actionSetGlobalMessage({
                msg: this.$text("S_SEND_CHECK_CODE_VALID_TIME_5")
              });
            }

            goLangApiRequest({
              method: "get",
              url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/Phone/TTL`,
              params: {
                lang: "zh-cn"
              }
            })
              .then(res => {
                if (res && res.status === "000") {
                  this.time = res.data;
                  this.smsTimer = setInterval(() => {
                    if (this.time <= 0) {
                      clearInterval(this.smsTimer);
                      this.smsTimer = null;
                      return;
                    }
                    this.time -= 1;
                  }, 1500);
                } else {
                  if (res && res.status === "506") {
                    this.actionGetToManyRequestMsg(res.msg).then(res => {
                      this.errorMsg = res;
                    });
                  } else if (res.msg) {
                    this.errorMsg = res.msg;
                  }
                }
              })
              .catch(error => {
                if (error.status) {
                  this.errorMsg = `${error.msg}`;
                  return;
                }
              });
          } else {
            if (res && res.status === "506") {
              this.actionGetToManyRequestMsg(res.msg).then(res => {
                this.errorMsg = res;
              });
            } else if (res.msg) {
              this.errorMsg = res.msg;
            }
          }
        })
        .catch(error => {
          this.lockStatus = false;
          // console.log(error);
          if (error.response.data && error.response.data.msg) {
            this.errorMsg = error.response.data.msg;
          } else {
            this.errorMsg = error.response.data;
          }
        });
    },
    checkData(value, key) {
      if (key === "keyring") {
        this.actionVerificationFormData({ target: "code", value: value }).then(
          val => {
            this.formData.keyring = val;
          }
        );
      }

      this.NextStepStatus = Object.keys(this.formData).every(key => {
        if (this.addBankCardStep === "two") {
          if (key === "phone" || key === "keyring") {
            this.errorMsg = "";
            return this.formData[key];
          }
          return true;
        }

        return true;
      });
    }
  }
};
