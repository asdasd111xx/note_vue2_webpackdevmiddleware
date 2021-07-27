import { getCookie, setCookie } from "@/lib/cookie";
import { mapActions, mapGetters } from "vuex";

import { API_FIRST_LEVEL_REGISTER } from "@/config/api";
import axios from "axios";
import bbosRequest from "@/api/bbosRequest";
import goLangApiRequest from "@/api/goLangApiRequest";
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
      allTip: {
        // 會員帳號
        username: {
          title: this.$text("S_NAME"),
          type: "text",
          maxLength: "20",
          placeholder: this.$text("S_USERNAME_ERROR"),
          error: ""
        },
        // 密碼
        password: {
          title: this.$text("SS_LOGIN_PW"),
          type: "password",
          maxLength: "12",
          placeholder: this.$text("S_PASSWORD_PLACEHOLDER_AGENT"),
          error: ""
        },
        // 確認密碼
        confirm_password: {
          title: this.$text("S_PWD_CONFIRM"),
          type: "password",
          maxLength: "12",
          placeholder: this.$text("S_PWD_CONFIRM"),
          error: ""
        },
        // 會員姓名
        name: {
          title: this.$text("S_MEMBER_NAME"),
          type: "text",
          maxLength: "",
          placeholder: this.$text("S_REGISTER_TIPS"),
          error: ""
        }
      },
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
        [this.$style.tips]: this.allTip[key].tips,
        [this.$style.message]: this.allTip[key].message,
        [this.$style.error]: this.allTip[key].error
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
      const regex = new RegExp(joinMemInfo[key].regExp);
      const errorMsg = joinMemInfo[key].errorMsg;

      this.allTip[key].error = "";
      if (["username", "password", "confirm_password", "name"].includes(key)) {
        this.actionVerificationFormData({ target: key, value: value }).then(
          val => {
            this.allValue[key] = val;

            // 1. 密碼只判斷是否符合格式不判斷空
            // 2. 確認密碼只判斷是否相同
            switch (key) {
              case "password":
                this.allTip["password"].error = "";
                this.allTip["confirm_password"].error = "";
                if (
                  this.allValue["password"] &&
                  this.allValue["password"] !==
                    this.allValue["confirm_password"]
                ) {
                  this.allTip["confirm_password"].error = this.$text(
                    "S_JM_PASSWD_CONFIRM_ERROR"
                  );
                }

                if (this.allValue["password"] && !val.match(regex)) {
                  this.allTip[key].error = errorMsg;
                }

                break;

              case "confirm_password":
                this.allTip["confirm_password"].error = "";
                if (
                  this.allValue["password"] !==
                  this.allValue["confirm_password"]
                ) {
                  this.allTip["confirm_password"].error = this.$text(
                    "S_JM_PASSWD_CONFIRM_ERROR"
                  );
                }
                break;

              default:
                if (!this.allValue[key].match(regex)) {
                  this.allTip[key].error = errorMsg;
                }
                break;
            }
          }
        );
      }

      if (
        ["captcha_text"].includes(key) &&
        this.memInfo.config.friend_captcha_type === 1 &&
        allValue["captcha_text"] === ""
      ) {
        this.captchaErrorMsg = this.$text("S_ENABLE_KEYRING", "请输入验证码");
        allValue["captcha_text"] = value.replace(/[\W\_]/g, "");
      }
    },

    checkInput() {
      this.$validator.validateAll("form-page").then(response => {
        if (!response) {
          Object.keys(this.allValue).forEach(key => {
            if (!this.allValue[key]) {
              if (key === "confirm_password") {
                if (
                  this.allValue["password"] !==
                  this.allValue["confirm_password"]
                ) {
                  this.allTip["confirm_password"].error = this.$text(
                    "S_JM_PASSWD_CONFIRM_ERROR"
                  );
                }
              } else {
                if (key === "captcha_text") {
                  this.captchaErrorMsg = joinMemInfo[key].errorMsg;
                } else {
                  this.allTip[key].error = joinMemInfo[key].errorMsg;
                }
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
          if (this.allInput.some(key => this.allTip[key].error)) {
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
              this.allTip.username.error = result.errors.username;
            }

            if (result.errors.password) {
              this.allTip.password.error = result.errors.password;
            }

            if (result.errors.confirm_password) {
              this.allTip.confirm_password.error =
                result.errors.confirm_password;
            }

            if (result.errors.name) {
              this.allTip.name.error = result.errors.name;
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
