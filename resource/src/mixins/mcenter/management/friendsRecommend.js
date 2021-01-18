import { mapActions, mapGetters } from "vuex";

import { API_FIRST_LEVEL_REGISTER } from "@/config/api";
import ajax from "@/lib/ajax";
import axios from "axios";
import isMobile from "@/lib/is_mobile";

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
      texts: {
        username: {
          placeholder: "S_USERNAME_ERROR",
          error: "S_USERNAME_ERROR"
        },
        // 密碼
        password: {
          placeholder: "S_PASSWORD_ERROR_AGENT",
          error: "S_PASSWORD_ERROR_AGENT"
        },
        // 確認密碼
        confirm_password: {
          placeholder: "S_PWD_CONFIRM",
          error: "S_JM_PASSWD_CONFIRM_ERROR"
        },
        // 會員姓名
        name: {
          placeholder: "S_REGISTER_TIPS",
          error: "S_NO_SYMBOL_DIGIT_CHEN"
        }
      },
      allText: {
        // 會員帳號
        username: {
          type: "text",
          maxLength: "20",
          placeholder: "S_NAME",
          tips: "S_USERNAME_ERROR",
          message: "",
          error: false
        },
        // 密碼
        password: {
          type: "password",
          maxLength: "12",
          placeholder: "SS_LOGIN_PW",
          tips: "S_PASSWORD_ERROR",
          message: "",
          error: false
        },
        // 確認密碼
        confirm_password: {
          type: "password",
          maxLength: "12",
          placeholder: "S_PWD_CONFIRM",
          tips: "S_JM_PASSWD_CONFIRM_ERROR",
          message: "",
          error: false
        },
        // 會員姓名
        name: {
          type: "text",
          maxLength: "",
          placeholder: "S_MEMBER_NAME",
          tips: "S_NO_SYMBOL_DIGIT_CHEN",
          message: "S_REGISTER_TIPS",
          error: false
        }
      },
      captchaError: false,
      captchaErrorMsg: "请填写验证码",
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
      memInfo: "getMemInfo"
    })
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage", "actionVerificationFormData"]),

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
        username: /^[a-z1-9][a-z0-9]{3,19}$/,
        password: /^[a-z0-9._\-!@#$&*+=|]{6,12}$/,
        confirm_password: /^[a-z0-9._\-!@#$&*+=|]{6,12}$/
      };
      if (
        key === "username" ||
        key === "password" ||
        key === "confirm_password" ||
        key === "name"
      ) {
        this.actionVerificationFormData({ target: key, value: value }).then(
          val => {
            allValue[key] = val;
            if (reg[key] && !reg[key].test(allValue[key])) {
              allText[key].error = true;
              return;
            }
          }
        );
      }
      if (["password", "confirm_password"].includes(key)) {
        if (allValue.confirm_password) {
          allText.password.error = false;
          allText.confirm_password.error =
            allValue.password !== allValue.confirm_password;
          return;
        }

        allText.password.error = false;
        return;
      }

      if (key === "captcha_text") {
        this.captchaError = false;
        this.captchaErrorMsg = "请填写验证码";
        allValue["captcha_text"] = value.replace(/[\W\_]/g, "");
      } else {
        switch (key) {
          case "username":
            this.texts.username.error = "S_USERNAME_ERROR";
            break;
          case "password":
            this.texts.password.error = "S_PASSWORD_ERROR_AGENT";
            break;
          case "confirm_password":
            this.texts.confirm_password.error = "S_PASSWORD_ERROR_AGENT";
            break;
          case "name":
            this.texts.name.error = "S_NO_SYMBOL_DIGIT_CHEN";
            break;
          default:
            break;
        }

        allText[key].error = false;
      }
    },

    checkInput() {
      // 無認證直接呼叫
      if (this.memInfo.config.friend_captcha_type === 0) {
        this.handleSend();
        return;
      } else {
        this.$validator.validateAll("form-page").then(response => {
          if (!response) {
            // this.msg = this.$text("S_JM_MSG_COMPLETE");
            Object.keys(this.allValue).forEach(key => {
              if (this.allValue[key]) {
                return;
              }
              if (key === "captcha_text") {
                this.captchaError = true;
              } else {
                this.allText[key].error = true;
              }
            });
            return;
          }

          if (
            this.allInput.some(key => this.allText[key].error) ||
            this.captchaError
          ) {
            return;
          }
          if (this.allValue.password !== this.allValue.confirm_password) {
            return;
          }

          this.showCaptchaPopup();
        });
      }
    },
    /**
     * 註冊
     * @method onSubmit
     */
    onSubmit() {
      // 廳主未開放註冊
      if (!this.memInfo.config.infinity_register || !this.isShow) {
        return;
      }

      axios({
        method: "post",
        url: API_FIRST_LEVEL_REGISTER,
        errorAlert: false,
        data: {
          ...this.allValue,
          captcha_text: this.allValue["captcha_text"],
          code: this.agentCode,
          created_by: 2
        }
      }).then(result => {
        if (result.data.result === "ok") {
          this.msg = this.$text("S_CREATE_SECCESS", "新增成功");

          this.isShow = false;
          // if (isMobile()) {
          this.allValue = {
            username: "",
            password: "",
            confirm_password: "",
            name: "",
            captcha_text: ""
          };

          //   return;
          // }

          this.$emit("close");
        } else {
          if (result.data.errors) {
            if (result.data.errors.username) {
              this.texts.username.error = result.data.errors.username;
              this.allText.username.error = true;
            }

            if (result.data.errors.password) {
              this.texts.password.error = result.data.errors.password;
              this.allText.password.error = true;
            }

            if (result.data.errors.confirm_password) {
              this.texts.confirm_password.error =
                result.data.errors.confirm_password;
              this.allText.confirm_password.error = true;
            }

            if (result.data.errors.name) {
              this.texts.name.error = result.data.errors.name;
              this.allText.name.error = true;
            }

            if (result.data.errors.captcha_text) {
              this.captchaErrorMsg = result.data.errors.captcha_text;
              this.captchaError = true;
            }
            return;
          }

          this.msg = result.data.msg;
          return;
        }
      });
      // this.$validator.validateAll("form-page").then(response => {
      //   if (!response) {
      //     this.msg = this.$text("S_JM_MSG_COMPLETE");
      //     Object.keys(this.allValue).forEach(key => {
      //       if (this.allValue[key]) {
      //         return;
      //       }
      //       if (key === "captcha_text") {
      //         this.captchaError = true;
      //       } else {
      //         this.allText[key].error = true;
      //       }
      //     });
      //     return;
      //   }

      //   if (
      //     this.allInput.some(key => this.allText[key].error) ||
      //     this.captchaError
      //   ) {
      //     return;
      //   }
      //   if (this.allValue.password !== this.allValue.confirm_password) {
      //     return;
      //   }

      //   axios({
      //     method: "post",
      //     url: API_FIRST_LEVEL_REGISTER,
      //     errorAlert: false,
      //     data: {
      //       ...this.allValue,
      //       captcha_text: this.allValue["captcha_text"],
      //       code: this.agentCode,
      //       created_by: 2
      //     }
      //   }).then(result => {
      //     if (result.data.result === "ok") {
      //       this.msg = this.$text("S_CREATE_SECCESS", "新增成功");

      //       this.isShow = false;
      //       // if (isMobile()) {
      //       this.allValue = {
      //         username: "",
      //         password: "",
      //         confirm_password: "",
      //         name: "",
      //         captcha_text: ""
      //       };

      //       //   return;
      //       // }

      //       this.$emit("close");
      //     } else {
      //       if (result.data.errors) {
      //         if (result.data.errors.username) {
      //           this.texts.username.error = result.data.errors.username;
      //           this.allText.username.error = true;
      //         }

      //         if (result.data.errors.password) {
      //           this.texts.password.error = result.data.errors.password;
      //           this.allText.password.error = true;
      //         }

      //         if (result.data.errors.confirm_password) {
      //           this.texts.confirm_password.error =
      //             result.data.errors.confirm_password;
      //           this.allText.confirm_password.error = true;
      //         }

      //         if (result.data.errors.name) {
      //           this.texts.name.error = result.data.errors.name;
      //           this.allText.name.error = true;
      //         }

      //         if (result.data.errors.captcha_text) {
      //           this.captchaErrorMsg = result.data.errors.captcha_text;
      //           this.captchaError = true;
      //         }
      //         return;
      //       }

      //       this.msg = result.data.msg;
      //       return;
      //     }
      //   });
      // });
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
