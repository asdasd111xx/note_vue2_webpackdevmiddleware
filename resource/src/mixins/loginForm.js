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
      rememberPwd: false,
      username: "",
      isShowPwd: false,
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
      if (!this.username || !this.password) {
        return false;
      }

      return true;
    }
  },
  watch: {
    rememberPwd(val) {
      localStorage.setItem("rememberPwd", val);
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
    this.username = localStorage.getItem("username") || "";
    this.password = localStorage.getItem("password") || "";
    this.rememberPwd = localStorage.getItem("rememberPwd") === "true";
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
    toggleEye() {
      if (this.isShowPwd) {
        document.getElementById("pwd").type = "password";
      } else {
        document.getElementById("pwd").type = "text";
      }

      this.isShowPwd = !this.isShowPwd;
    },
    handleClickLogin() {
      if (!this.username) {
        this.errMsg = "帐号不得为空";
        return;
      }

      if (!this.password) {
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
      this.isLoading = true;

      if (this.isBackEnd) {
        return;
      }

      if (this.memInfo.config.login_security) {
        ajax({
          method: "put",
          url: apis.API_LOGIN_CHECK,
          params: {
            username: this.username
          },
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

      return goLangApiRequest({
        method: "put",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Login`,
        params: {
          lang: "zh-cn",
          ...params
        }
      }).then(res => {
        this.isLoading = false;

        // 重置驗證碼
        if (this.$refs.thirdyCaptchaObj) this.$refs.thirdyCaptchaObj.ret = null;
        this.captcha = "";
        if (res && res.data && res.data.cookie) {
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
              window.location.href = "/mobile/live/iframe/home?hasFooter=true";
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

        // network error
        if (res && res.message) {
          this.errMsg = `网路异常(${res.message})`;
        }

        if (callBackFuc) {
          callBackFuc.reset();
        }
      });
    },
    handleSaveAccont() {
      if (!this.rememberPwd) {
        // localStorage.removeItem("username");
        localStorage.removeItem("password");
        localStorage.removeItem("rememberPwd");
        return;
      }

      localStorage.setItem("username", this.username);
      localStorage.setItem("password", this.password);
      localStorage.setItem("rememberPwd", this.rememberPwd);
    }
  }
};
