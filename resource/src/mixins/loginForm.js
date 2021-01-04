import * as apis from "@/config/api";

import { getCookie, setCookie } from "@/lib/cookie";
import { mapActions, mapGetters } from "vuex";

import ajax from "@/lib/ajax";
import bbosRequest from "@/api/bbosRequest";

export default {
  props: {
    redirect: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      aid: "", // repcatcha
      captcha: "",
      captchaImg: "",
      checkItem: "",
      errMsg: "",
      isLoading: false,
      password: "",
      rememberPwd: false,
      username: "",
      version: "",
      isShowPwd: false,
      isGetCaptcha: false // 重新取得驗證碼
    };
  },
  computed: {
    ...mapGetters({
      isBackEnd: "getIsBackEnd",
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo"
    })
  },
  watch: {
    rememberPwd(val) {
      localStorage.setItem("rememberPwd", val);
    }
  },
  created() {
    this.getCaptcha();
    this.username = localStorage.getItem("username") || "";
    this.password = localStorage.getItem("password") || "";
    this.rememberPwd = localStorage.getItem("rememberPwd") === "true";
    this.version = `${this.siteConfig.VERSION}${getCookie("platform") || ""}`;
  },
  methods: {
    ...mapActions(["actionIsLogin", "actionSetGlobalMessage"]),
    linktoJoin() {
      this.$nextTick(() => {
        this.$router.push("/mobile/joinmember");
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
        this.errMsg = "用户名不得为空";
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
          if (!this.puzzleObj) {
            this.errMsg = "请先点击按钮进行验证";
            return;
          }
          this.loginCheck({ captcha: this.puzzleObj });
          this.puzzleData = null;
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
            console.log(res);
          }
        });
        return;
      }

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
      return bbosRequest({
        method: "put",
        url: this.siteConfig.BBOS_DOMIAN + "/Login",
        reqHeaders: {
          Vendor: this.memInfo.user.domain,
          kind: platform === "H" ? "h" : "pwa"
        },
        params: {
          username: this.username,
          password: this.password.toLowerCase(),
          captcha: this.captcha,
          aid: this.aid || getCookie("aid") || "",
          host: window.location.host,
          ...validate
        }
      }).then(res => {
        this.isLoading = false;

        // 重置驗證碼
        if (this.$refs.puzzleVer) this.$refs.puzzleVer.ret = null;
        this.captcha = "";

        if (
          res &&
          res.data &&
          res.data &&
          res.data.cookie &&
          res.data.cookie.cid
        ) {
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
          if (this.redirect) {
            window.location.href = this.redirect;
            return;
          }
          window.location.reload(true);
          // 登入公告
          // ajax({
          //     method: 'get',
          //     url: apis.API_MEMBER_ANNOUNCEMENT,
          //     errorAlert: false,
          //     success: (response) => {
          //         if (response.result === 'ok') {
          //             response.ret.forEach((post) => {
          //             });
          //         }
          //     }
          // }).then(() => {
          // });

          return;
        }

        if (res && res.status !== "000") {
          this.getCaptcha();

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
    },
    handleSaveAccont() {
      if (!this.rememberPwd) {
        localStorage.removeItem("username");
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
