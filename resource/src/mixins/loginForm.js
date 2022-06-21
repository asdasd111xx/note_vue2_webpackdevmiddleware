import * as apis from "@/config/api";

import { getCookie, setCookie } from "@/lib/cookie";
import { mapActions, mapGetters } from "vuex";

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
      mobileLoginErrMsg: "",
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
      version: "getVersion",
      loginStatus: "getLoginStatus"
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
    //華為瀏覽器-登入後按返回
    if (navigator.userAgent.includes("HuaweiBrowser")) {
      document.addEventListener("visibilitychange", e => {
        if (e.target.visibilityState === "visible" && this.loginStatus) {
          location.reload();
        }
      });
    }

    if (this.loginStatus) {
      if (this.siteConfig.ROUTER_TPL === "sg1") {
        this.$router.replace("/mobile/live/iframe/home?hasFooter=true");
        return;
      } else {
        this.$router.replace("/mobile");
        return;
      }
    }
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
      this.mobileLoginErrMsg = "";
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
        this.mobileLoginErrMsg = "未指定验证码";
        return;
      }

      if (this.currentLogin === "mobilelogin" && !this.phone) {
        this.mobileLoginErrMsg = "手机号码不得为空";
        return;
      }

      if (
        this.currentLogin === "mobilelogin" &&
        this.mobileLoginTypeSwitch === 2 &&
        !this.mpassword
      ) {
        this.mobileLoginErrMsg = "密码不得为空";
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
            if (this.currentLogin === "accountlogin") {
              this.errMsg = "请先点击按钮进行验证";
            }
            if (this.currentLogin === "mobilelogin") {
              this.mobileLoginErrMsg = "请先点击按钮进行验证";
            }
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

        //個資核實驗證機制（開關 this.memInfo.config.login_security）
        //1.輸入資料正確時api回傳check為flase，接著會直接打login api登入；
        //2.連續輸入資料錯誤達三次回傳check為true，為true時將跳出輸入真實姓名彈窗；
        //3.輸入真實姓名彈窗需一次就輸入正確才能成功登入，若錯誤則帳號會被限制。
        goLangApiRequest({
          method: "put",
          url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Login/Check`,
          params: {
            lang: "zh-cn",
            ...params
          }
        }).then(res => {
          this.isLoading = false;

          if (res.data && res.data.check) {
            this.checkItem = res.data.check_item;
            return;
          }
          this.login(loginInfo, callBackFuc);

          if (res.status !== "000") {
            this.isLoading = false;
            if (this.currentLogin === "accountlogin") {
              this.errMsg = res.data.msg;
            }
            if (this.currentLogin === "mobilelogin") {
              this.mobileLoginErrMsg = res.data.msg;
            }
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
      //個資核實 登入取得滑動驗證captchaobj
      let getSlideObj = localStorage.getItem("slideObj");
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
        captchaText:
          this.captcha || validate.captcha || JSON.parse(getSlideObj),
        host: window.location.host,
        ...validate
      };
      if (this.memInfo.config.login_captcha_type === 1) {
        params["aid"] = getCookie("aid") || localStorage.getItem("aid") || "";
      }

      let params_m = {
        aid: getCookie("aid") || localStorage.getItem("aid") || "",
        captchaText:
          this.captcha || validate.captcha || JSON.parse(getSlideObj),
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
              this.handleSaveMobileAccont();
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
              localStorage.removeItem("slideObj");
            }
            if (res.msg) {
              this.mobileLoginErrMsg = res.msg;
              // msg: "验证码错误"
              if (res.code === "C00024") {
                this.$refs.captcha.focus();
              }

              return;
            }
            this.mobileLoginErrMsg = res.status;
          }

          // network error
          if (res && res.message) {
            this.mobileLoginErrMsg = `网路异常(${res.message})`;
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
              localStorage.removeItem("slideObj");
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

      localStorage.setItem("username", this.username);
      localStorage.setItem("password", this.password);
      localStorage.setItem("rememberPwd", this.rememberPwd);
    },
    handleSaveMobileAccont() {
      if (!this.m_rememberPwd) {
        localStorage.removeItem("password");
        localStorage.removeItem("m_rememberPwd");
        return;
      }

      localStorage.setItem("mobileusername", this.phone);
      localStorage.setItem("mpassword", this.mpassword);
      localStorage.setItem("m_rememberPwd", this.m_rememberPwd);
    }
  }
};
