import * as apis from "@/config/api";

import { getCookie, setCookie } from "@/lib/cookie";
import { mapActions, mapGetters } from "vuex";

import ajax from "@/lib/ajax";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  props: {
    redirect: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      captcha: "",
      captchaImg: "",
      checkItem: "",
      errMsg: "",
      isLoading: false,
      password: "",
      mpassword: "",
      rememberPwd: false,
      m_rememberPwd: false,
      username: "",
      phone: "",
      phone_validation_code: "",
      isShowPwd: false,
      m_isShowPwd: false,
      isGetCaptcha: false // 重新取得驗證碼
    };
  },
  computed: {
    ...mapGetters({
      isBackEnd: "getIsBackEnd",
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      version: "getVersion"
    }),
    isSlideAble() {
      // 簡訊驗證登入 0: 關, 1:簡訊, 2:密碼
      if (this.mobileLoginTypeSwitch === 0) {
        if (!this.username || !this.password) {
          return false;
        }
      }

      if (this.mobileLoginTypeSwitch === 1) {
        if (this.currentLogin === "accountlogin") {
          if (this.username === "" || this.password === "") {
            return false;
          }
        } else {
          if (this.phone === "" || this.phone_validation_code === "") {
            return false;
          }
        }
      }

      if (this.mobileLoginTypeSwitch === 2) {
        if (this.currentLogin === "accountlogin") {
          if (this.username === "" || this.password === "") {
            return false;
          }
        } else {
          if (this.phone === "" || this.mpassword === "") {
            return false;
          }
        }
      }

      return true;
    }
  },
  watch: {
    rememberPwd(val) {
      localStorage.setItem("rememberPwd", val);
    },
    m_rememberPwd(val) {
      localStorage.setItem("m_rememberPwd", val);
    }
  },
  beforeCreate() {
    if (this.$route.query.logout) {
      setCookie("cid", "");
      setCookie("y_token", "");
      setCookie("aid", "");
      localStorage.removeItem("aid");

      this.$router.replace("/mobile/login");
    }

    if (!document.querySelector('script[data-name="esabgnixob"]')) {
      this.script = document.createElement("script");
      this.script.setAttribute("type", "text/javascript");
      this.script.setAttribute("data-name", "esabgnixob");

      if (window.location.host.includes("localhost")) {
        this.script.setAttribute(
          "src",
          "https://yb01.66boxing.com/mobile/esabgnixob.js"
        );
      } else {
        this.script.setAttribute("src", "esabgnixob.js");
      }

      document.head.appendChild(this.script);
    }
  },
  created() {
    this.getCaptcha();
    this.phone = localStorage.getItem("mobileusername") || "";
    this.mpassword = localStorage.getItem("mpassword") || "";
    this.username = localStorage.getItem("username") || "";
    this.password = localStorage.getItem("password") || "";
    this.rememberPwd = localStorage.getItem("rememberPwd") === "true";
    this.m_rememberPwd = localStorage.getItem("m_rememberPwd") === "true";
  },
  methods: {
    ...mapActions([
      "actionIsLogin",
      "actionSetGlobalMessage",
      "actionVerificationFormData"
    ]),
    verification(key, value) {
      this.errMsg = "";
      this.actionVerificationFormData({
        target: key,
        value: value
      }).then(val => {
        if (key === "login_password") {
          this.password = val;
          return;
        }
        if (key === "m_login_password") {
          this.mpassword = val;
          return;
        }
        this[key] = val;
      });
    },
    linktoJoin() {
      this.$nextTick(() => {
        this.$router.push("/mobile/joinmember?login=1");
      });
    },
    keyDownSubmit() {
      if (this.memInfo.config.login_captcha_type === 2) {
        return;
      }
      this.handleClickLogin();
    },
    handleClickLogin() {
      if (this.submitBtnLock) {
        return;
      }
      if (this.currentLogin === "accountlogin" && !this.username) {
        this.errMsg = "帐号不得为空";
        return;
      }

      if (this.currentLogin === "accountlogin" && !this.password) {
        this.errMsg = "密码不得为空";
        return;
      }

      if (
        this.currentLogin === "mobilelogin" &&
        this.mobileLoginTypeSwitch === 1 &&
        !this.phone_validation_code
      ) {
        this.errMsg = "未指定验证码";
        return;
      }

      if (this.currentLogin === "mobilelogin" && !this.phone) {
        this.errMsg = "手机号不得为空";
        return;
      }

      if (
        this.currentLogin === "mobilelogin" &&
        this.mobileLoginTypeSwitch === 2 &&
        !this.mpassword
      ) {
        this.errMsg = "密码不得为空";
        return;
      }

      switch (this.memInfo.config.login_captcha_type) {
        // 無驗證
        case 0:
          this.loginCheck();
          break;

        // 數字驗證
        case 1:
          this.loginCheck();
          break;

        // 拼圖驗證
        case 3:
        case 4:
        case 5:
          if (!this.thirdyCaptchaObj) {
            this.errMsg = "请先点击按钮进行验证";
            return;
          }
          this.loginCheck({ captchaText: this.thirdyCaptchaObj });
          this.thirdyData = null;
          break;

        default:
          this.isLoading = false;
          break;
      }
    },
    // 圖形驗證格式
    captchaVerification(val) {
      this.captcha = val.replace(/[\W\_]/g, "");
    },
    /**
     * 取得驗證碼圖片
     * @method getCaptcha
     */
    getCaptcha() {
      if (
        this.isBackEnd ||
        this.isGetCaptcha ||
        this.memInfo.config.login_captcha_type !== 1
      ) {
        return;
      }

      this.isGetCaptcha = true;
      setTimeout(() => {
        this.isGetCaptcha = false;
      }, 800);

      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Captcha`,
        params: {
          lang: "zh-cn"
        }
      }).then(res => {
        if (res.data && res.status === "000") {
          setCookie("aid", res.data.cookie.aid);
          localStorage.setItem("aid", res.data.cookie.aid);

          this.captchaImg = res.data.data;
        }
      });
    },
    loginCheck(loginInfo, callBackFuc) {
      if (this.submitBtnLock) {
        return;
      }
      this.isLoading = true;

      if (this.isBackEnd) {
        return;
      }

      if (this.memInfo.config.login_security) {
        let params = {};
        switch (this.currentLogin) {
          case "accountlogin":
            params = { username: this.username };
            break;
          case "mobilelogin":
            params = { phone: this.phone ? `86-${this.phone}` : "" };
            break;
        }
        ajax({
          method: "put",
          url: apis.API_LOGIN_CHECK,
          params: { ...params },
          errorAlert: false,
          success: res => {
            this.isLoading = false;
            if (res.ret && res.ret.check) {
              this.checkItem = res.ret.check_item;
              return;
            }
            this.login(loginInfo, callBackFuc);
          },
          fail: res => {
            this.isLoading = false;
            this.errMsg = res.data.msg;
            // console.log(res);
          }
        });
        return;
      }
      // this.checkItem = "name";//測試真實姓名
      this.login(loginInfo, callBackFuc);
    },
    /**
     * 會員登入
     * @method login
     */
    login(validate = {}, callBackFuc) {
      if (this.submitBtnLock) {
        return;
      }
      if (this.isBackEnd) {
        return null;
      }
      this.isLoading = true;

      const platform = getCookie("platform");
      let params = {
        username: this.username,
        password: this.password,
        captchaText: this.captcha || validate.captcha,
        host: window.location.host,
        ...validate
      };
      if (this.memInfo.config.login_captcha_type === 1) {
        params["aid"] = getCookie("aid") || localStorage.getItem("aid") || "";
      }

      let params_m = {
        aid: getCookie("aid") || localStorage.getItem("aid") || "",
        captchaText: this.captcha || validate.captcha,
        ...validate
      };

      if (this.phone !== "") {
        params_m["phone"] = `86-${this.phone}`;
      }

      if (this.mobileLoginTypeSwitch === 1) {
        params_m["keyring"] = this.phone_validation_code;
      }
      if (this.mobileLoginTypeSwitch === 2) {
        params_m["password"] = this.mpassword;
      }

      //手機登入submit
      if (this.currentLogin === "mobilelogin") {
        goLangApiRequest({
          method: "put",
          url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Phone/Verify/Login`,
          params: {
            ...params_m
          }
        }).then(res => {
          this.isLoading = false;
          // 重置驗證碼
          if (this.$refs.thirdyCaptchaObj)
            this.$refs.thirdyCaptchaObj.ret = null;
          this.captcha = "";
          if (res && res.data && res.data.cookie) {
            document.activeElement.blur();
            $("input").blur();

            if (res.data.cookie.cid != "") {
              try {
                let cookie = res.data.cookie;
                for (let [key, value] of Object.entries(cookie)) {
                  setCookie(key, value);
                }
              } catch (e) {
                setCookie("cid", res.data.cookie.cid);
              }
              this.handleSaveAccont();
              this.actionIsLogin(true);
              window.RESET_MEM_SETTING();

              if (this.siteConfig.ROUTER_TPL === "sg1") {
                window.location.href =
                  "/mobile/live/iframe/home?hasFooter=true";
                return;
              }

              if (this.redirect) {
                window.location.href = this.redirect;
                return;
              }

              window.location.reload();
              return;
            } else if (
              res.data.redirect &&
              res.data.redirect_url &&
              getCookie("platform") === "h"
            ) {
              localStorage.setItem("redirect_url", res.data.redirect_url);
              this.$router.push("/mobile/home");
            }
          }

          if (res && res.status !== "000") {
            this.getCaptcha();
            this.checkItem = "";
            if (this.memInfo.config.login_captcha_type === 2) {
              this.$refs["slide-verification"].ncReload();
            }
            if (res.msg) {
              this.errMsg = res.msg;
              // msg: "验证码错误"
              if (res.code === "C00024") {
                this.$refs.captcha.focus();
              }
              return;
            }
            this.errMsg = res.status;
          }

          if (callBackFuc) {
            callBackFuc.reset();
          }
        });
      } else {
        //帳號登入submit
        goLangApiRequest({
          method: "put",
          url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Login`,
          params: {
            lang: "zh-cn",
            ...params
          }
        }).then(res => {
          this.isLoading = false;
          // 重置驗證碼
          if (this.$refs.thirdyCaptchaObj)
            this.$refs.thirdyCaptchaObj.ret = null;
          this.captcha = "";
          if (res && res.data && res.data.cookie) {
            document.activeElement.blur();
            $("input").blur();

            if (res.data.cookie.cid != "") {
              try {
                let cookie = res.data.cookie;
                for (let [key, value] of Object.entries(cookie)) {
                  setCookie(key, value);
                }
              } catch (e) {
                setCookie("cid", res.data.cookie.cid);
              }
              this.handleSaveAccont();
              this.actionIsLogin(true);
              window.RESET_MEM_SETTING();

              if (this.siteConfig.ROUTER_TPL === "sg1") {
                window.location.href =
                  "/mobile/live/iframe/home?hasFooter=true";
                return;
              }

              if (this.redirect) {
                window.location.href = this.redirect;
                return;
              }

              window.location.reload();
              return;
            } else if (
              res.data.redirect &&
              res.data.redirect_url &&
              getCookie("platform") === "h"
            ) {
              localStorage.setItem("redirect_url", res.data.redirect_url);
              this.$router.push("/mobile/home");
            }
          }

          if (res.code === "C10004" || res.code === "C10006") {
            //已經登入
            if (this.siteConfig.ROUTER_TPL === "sg1") {
              window.location.href = "/mobile/live/iframe/home?hasFooter=true";
              return;
            }

            if (this.redirect) {
              window.location.href = this.redirect;
              return;
            }
          }

          if (res && res.status !== "000") {
            this.getCaptcha();
            this.checkItem = "";
            if (this.memInfo.config.login_captcha_type === 2) {
              this.$refs["slide-verification"].ncReload();
            }
            if (res.msg) {
              this.errMsg = res.msg;
              // msg: "验证码错误"
              if (res.code === "C00024") {
                this.$refs.captcha.focus();
              }
              return;
            }
            this.errMsg = res.status;
          }

          // network error
          if (res && res.message) {
            this.errMsg = `网路异常(${res.message})`;
          }

          if (callBackFuc) {
            callBackFuc.reset();
          }
        });
      }
    },
    handleSaveAccont() {
      if (!this.rememberPwd) {
        // localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("rememberPwd");
        return;
      }

      if (!this.m_rememberPwd) {
        localStorage.removeItem("password");
        localStorage.removeItem("m_rememberPwd");
        return;
      }

      if (this.currentLogin === "accountlogin") {
        localStorage.setItem("username", this.username);
        localStorage.setItem("password", this.password);
        localStorage.setItem("rememberPwd", this.rememberPwd);
      }

      if (this.currentLogin === "mobilelogin") {
        localStorage.setItem("mobileusername", this.phone);
        localStorage.setItem("mpassword", this.mpassword);
        localStorage.setItem("m_rememberPwd", this.m_rememberPwd);
      }
    }
  }
};
