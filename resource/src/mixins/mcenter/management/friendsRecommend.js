import { getCookie, setCookie } from "@/lib/cookie";
import { mapActions, mapGetters } from "vuex";

import { API_FIRST_LEVEL_REGISTER } from "@/config/api";
import ajax from "@/lib/ajax";
import axios from "axios";
import bbosRequest from "@/api/bbosRequest";
import goLangApiRequest from "@/api/goLangApiRequest";
import isMobile from "@/lib/is_mobile";
import joinMemInfo from "@/config/joinMemInfo";

export default {
  provide() {
    return {
      $validator: this.$validator
    };
  },
  data() {
    return {
      isShow: false,
      isShowEyes: false,
      allInput: ["username", "password", "confirm_password", "name"],
      allText: {
        // 會員帳號
        username: {
          title: "S_NAME",
          type: "text",
          maxLength: "20",
          placeholder: this.$text("S_NAME"),
          error: ""
        },
        // 密碼
        password: {
          title: "SS_LOGIN_PW",
          type: "password",
          maxLength: "12",
          placeholder: this.$text("S_PASSWORD_PLACEHOLDER_AGENT"),
          error: ""
        },
        // 確認密碼
        confirm_password: {
          title: "S_PWD_CONFIRM",
          type: "password",
          maxLength: "12",
          placeholder: this.$text("S_PWD_CONFIRM"),
          error: ""
        },
        // 會員姓名
        name: {
          title: "S_MEMBER_NAME",
          type: "text",
          maxLength: "",
          placeholder: this.$text("S_MEMBER_NAME"),
          error: ""
        }
      },
      captchaError: false,
      captchaErrorMsg: "",
      allValue: {
        username: "",
        password: "",
        confirm_password: "",
        name: "",
        //驗證碼
        captcha_text: ""
      },
      msg: ""
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
  methods: {
    ...mapActions([
      "actionSetGlobalMessage",
      "actionVerificationFormData",
      "actionSetGlobalMessage"
    ]),

    /**
     * 取得 Class
     * @method mainClass
     * @param {String} key - 欄位名稱
     * @returns {Object} Class Object
     */
    mainClass(key) {
      return {
        [this.$style.tips]: this.allText[key].tips,
        [this.$style.message]: this.allText[key].message,
        [this.$style.error]: this.allText[key].error
      };
    },
    /**
     * 輸入驗證
     * @method onInput
     * @param {String} value - 值
     * @param {String} key - 欄位名稱
     */
    onInput(value, key) {
      if (!this.isShow) return;
      const { allValue, allText } = this;
      const reg = {
        username: new RegExp(joinMemInfo["username"].regExp),
        password: new RegExp(joinMemInfo["password"].regExp),
        confirm_password: new RegExp(joinMemInfo["password"].regExp)
      };
      if (["username", "password", "confirm_password", "name"].includes(key)) {
        this.actionVerificationFormData({ target: key, value: value }).then(
          val => {
            allValue[key] = val;
            let errMsg = "";

            if (["confirm_password"].includes(key)) {
              if (!val) {
                allText[key].error = errMsg;
                return;
              }

              if (this.allValue.confirm_password !== this.allValue.password) {
                errMsg = this.$text("S_PASSWD_CONFIRM_ERROR");
              }
            } else if (["password"].includes(key)) {
              if (!val) {
                allText[key].error = errMsg;
                return;
              }

              if (reg[key] && !allValue[key].match(reg[key])) {
                errMsg = joinMemInfo[key].errorMsg;
              }
            } else {
              if (reg[key] && !allValue[key].match(reg[key])) {
                errMsg = joinMemInfo[key].errorMsg;
              }
            }

            allText[key].error = errMsg;
          }
        );
      }

      if (
        ["captcha_text"].includes(key) &&
        this.memInfo.config.friend_captcha_type !== 0 &&
        allValue["captcha_text"] === ""
      ) {
        this.captchaErrorMsg = this.$text("S_ENABLE_KEYRING", "请输入验证码");
        allValue["captcha_text"] = value.replace(/[\W\_]/g, "");
      }
    },

    checkInput() {
      this.$validator.validateAll("form-page").then(response => {
        if (!response) {
          // this.actionSetGlobalMessage({
          //   msg: this.$text("S_JM_MSG_COMPLETE")
          // });

          Object.keys(this.allValue).forEach(key => {
            console.log(key, this.allValue[key]);
            if (!this.allValue[key]) {
              if (key === "captcha_text") {
                this.captchaError = joinMemInfo[key].errorMsg;
              } else {
                this.allText[key].error = joinMemInfo[key].errorMsg;
              }
            }
          });
          return;
        }

        // 無認證直接呼叫
        if (this.memInfo.config.friend_captcha_type === 0) {
          this.handleSend();
          return;
        } else {
          if (this.allInput.some(key => this.allText[key].error)) {
            return;
          }

          this.showCaptchaPopup();
        }
      });
    },
    /**
     * 註冊
     * @method onSubmit
     */
    onSubmit() {
      // 廳主未開放註冊
      if (
        !this.memInfo.config.infinity_register ||
        !this.isShow ||
        this.isSend
      ) {
        return;
      }

      this.isSend = true;
      setTimeout(() => {
        this.isSend = false;
      }, 1200);

      let registFc;

      if (this.themeTPL === "ey1") {
        registFc = axios({
          method: "post",
          url: API_FIRST_LEVEL_REGISTER,
          errorAlert: false,
          data: {
            ...this.allValue,
            captcha_text: this.allValue["captcha_text"],
            code: this.agentCode,
            created_by: 2
          }
        });
      } else {
        registFc = goLangApiRequest({
          method: "post",
          url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/ByUpper`,
          params: {
            ...this.allValue,
            aid: getCookie("aid") || "",
            confirmPassword: this.allValue["confirm_password"],
            captchaText: this.allValue["captcha_text"],
            code: this.agentCode,
            created_by: 2,
            lang: "zh-cn"
          }
        });
      }
      registFc.then(newResult => {
        let result = this.themeTPL === "ey1" ? newResult.data : newResult;

        if (result.result === "ok" || result.status === "000") {
          this.actionSetGlobalMessage({
            msg: this.$text("S_CREATE_SECCESS", "新增成功")
          });
          this.isShow = false;
          this.allValue = {
            username: "",
            password: "",
            confirm_password: "",
            name: "",
            captcha_text: ""
          };

          this.$emit("close");
        } else {
          if (result.errors) {
            if (this.memInfo.config.friend_captcha_type === 1) {
              this.getCaptcha();
            }

            if (result.errors.username) {
              this.allText.username.error = result.errors.username;
            }

            if (result.errors.password) {
              this.allText.password.error = result.errors.password;
            }

            if (result.errors.confirm_password) {
              this.allText.confirm_password.error =
                result.errors.confirm_password;
            }

            if (result.errors.name) {
              this.allText.name.error = result.errors.name;
            }

            if (result.errors.captcha_text) {
              this.captchaErrorMsg = result.errors.captcha_text;
            }
            return;
          }

          this.actionSetGlobalMessage({
            msg: result.msg
          });

          return;
        }
      });
    },

    getCaptcha() {
      if (this.isBackEnd || this.isGetCaptcha) {
        return;
      }

      this.isGetCaptcha = true;
      setTimeout(() => {
        this.isGetCaptcha = false;
      }, 800);

      bbosRequest({
        method: "post",
        url: this.siteConfig.BBOS_DOMIAN + "/Captcha",
        reqHeaders: {
          Vendor: this.memInfo.user.domain
        },
        params: {
          lang: "zh-cn",
          format: "png"
        }
      }).then(res => {
        if (res.data && res.data.data) {
          this.captchaImg = res.data.data;
          this.aid = res.data.cookie.aid;
          setCookie("aid", res.data.cookie.aid);
        }
      });
    },
    onShowPassword() {
      this.isShowEyes = !this.isShowEyes;
      let curType = document.querySelector(`input[data-key="password"]`).type;
      document.querySelector(`input[data-key="password"]`).type =
        curType === "password" ? "text" : "password";
      document.querySelector(`input[data-key="confirm_password"]`).type =
        curType === "password" ? "text" : "password";
    }
  }
};
