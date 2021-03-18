import { mapGetters } from "vuex";

export default {
  props: {
    pageType: {
      type: "login" | "register" | "friends" | "default",
      required: true
    }
  },
  data() {
    return {
      ret: null,
      showMask: false,
      puzzleCaptcha: null,
      vaptchaObj: null,
      necaptcha: null,
      isInit: false
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo"
    }),
    captchaMode() {
      switch (this.pageType) {
        default:
        case "login":
        case "register":
          return "inline";
        case "friends":
        case "default":
          return "popup";
      }
    },
    captchaType() {
      switch (this.pageType) {
        default:
        case "login":
          return this.memInfo.config.login_captcha_type;
        case "register":
          return this.memInfo.config.register_captcha_type;
        case "friends":
          return this.memInfo.config.friend_captcha_type;
        case "default":
          return this.memInfo.config.default_captcha_type;
      }
    }
  },
  methods: {
    showCaptcha() {
      if (this.ret === 0 || !this.isInit) return;
      if (!(this.puzzleCaptcha || this.vaptchaObj || this.necaptcha)) {
        this.initCaptcha();
        return;
      }
      switch (this.captchaType) {
        // 騰訊拼圖驗證
        case 3:
          this.puzzleCaptcha.show();
          break;
        // vaptcha手繪驗證
        case 4:
          this.vaptchaObj.validate();
          break;
        // 網易行為驗證
        case 5:
          this.necaptcha.popUp();
        default:
          break;
      }
    },
    initCaptcha() {
      let src;
      let callback;
      this.showMask = true;
      console.log(this.pageType, this.captchaType);

      switch (this.captchaType) {
        // 騰訊拼圖驗證
        case 3:
          src = "https://ssl.captcha.qq.com/TCaptcha.js";
          callback = () => {
            this.puzzleCaptchaInit();
          };
          break;

        // vaptcha手繪驗證
        case 4:
          src = "https://v.vaptcha.com/v3.js";
          callback = () => {
            this.vaptchaInit();
          };
          break;
        // 網易行為驗證
        case 5:
          src = "https://cstaticdun.126.net/load.min.js";
          callback = () => {
            this.necCaptchaInit();
          };
          break;

        default:
          return;
      }

      if (
        document.querySelector(
          `script[script-type="third-party-verification-${this.captchaType}"]`
        )
      ) {
        callback();
        return;
      }

      let script = document.createElement("script");
      script.setAttribute("script-type", "third-party-verification");
      script.type = "text/javascript";
      script.src = src;

      if (!("onload" in script)) {
        script.onreadystatechange = function() {
          if (this.readyState !== "complete" && this.readyState !== "loaded")
            return;
          this.onreadystatechange = null;
          callback();
        };
      }

      script.onload = function() {
        this.onload = null;
        callback();
      };

      document.body.appendChild(script);
    },
    puzzleCaptchaInit() {
      this.puzzleCaptcha = new TencentCaptcha("2028894711", res => {
        if (res.ret === 0) {
          const { appid, randstr, ticket, ret } = res;
          this.ret = ret;
          let data = {
            appid: appid,
            randstr: randstr,
            ticket: ticket
          };
          this.$emit("set-captcha", data);
          this.$emit("show-captcha", false);
          this.showMask = false;
        } else {
          this.ret = null;
          this.$emit("set-captcha", null);
          this.$emit("show-captcha", false);
          this.showMask = false;
        }
        return;
      });

      if (this.captchaMode === "popup") {
        this.puzzleCaptcha.show();
      }
      this.isInit = true;
    },
    vaptchaInit() {
      let _self = this;
      if (typeof vaptcha === "undefined") {
        this.initCaptcha();
        return;
      }

      let scene = "";
      switch (this.pageType) {
        case "login":
          scene = 1;
          break;
        case "register":
          scene = 2;
          break;
        case "friends":
          scene = 3;
          break;
        case "default":
          scene = 0;
          break;
      }

      vaptcha({
        vid: "5f9691bd456d5799dec0189a", // 验证单元id
        type: "invisible",
        // embed click invisible
        scene: scene, // 场景值 默认0
        container: `#vaptcha-container-${_self.captchaMode}`, // 容器，可为Element 或者 selector
        offline_server: "", //离线模式服务端地址，若尚未配置离线模式，请填写任意地址即可。
        //可选参数
        lang: "zh-CN" // 语言 默认auto,可选值auto,zh-CN,en,zh-TW,jp
        //https: true, // 使用https 默认 true
        //style: 'dark' //按钮样式 默认dark，可选值 dark,light
        //color: '#57ABFF' //按钮颜色 默认值#57ABFF
      }).then(function(result) {
        _self.isInit = true;
        _self.vaptchaObj = result; //将VAPTCHA验证实例保存到局部变量中
        _self.vaptchaObj.render(); // 调用验证实例 vpObj 的 render 方法加载验证按钮

        if (_self.captchaMode === "popup") {
          _self.vaptchaObj.validate();
        }
        //获取token的方式一：
        //vaptchaObj.renderTokenInput('.login-form')//以form的方式提交数据时，使用此函数向表单添加token值
        //获取token的方式二：
        _self.vaptchaObj.listen("pass", function() {
          _self.ret = 0;
          let data = {
            token: _self.vaptchaObj.getToken(),
            vid: "5f9691bd456d5799dec0189a"
          };
          console.log(_self.vaptchaObj, data);
          _self.$emit("set-captcha", data);
          _self.$emit("show-captcha", false);
          _self.vaptchaObj = null;
        });
        // _self.vaptchaObj.reset(); //重置验证码

        //关闭验证弹窗时触发
        _self.vaptchaObj.listen("close", function() {
          _self.$emit("show-captcha", false);
        });
      });
    },
    necCaptchaInit() {
      let _self = this;
      if (typeof initNECaptcha === "undefined") {
        this.initCaptcha();
        return;
      }

      initNECaptcha(
        {
          // config对象，参数配置
          captchaId: "8b50788c733744ec8028695f31187233",
          element: `#NECaptcha-container-${_self.captchaMode}`,
          mode: "popup",
          width: "320px",
          onVerify(err, result) {
            console.log(err, result);
            if (err) return;
            _self.ret = 0;
            let data = {
              validate: result.validate,
              captchaId: _self.necaptcha.captchaId
            };
            _self.$emit("set-captcha", data);

            setTimeout(() => {
              _self.necaptcha = null;
              _self.$emit("show-captcha", false);
            }, 1000);
          }
        },
        function onload(instance) {
          console.log(instance);
          _self.isInit = true;
          _self.necaptcha = instance;
          if (_self.captchaMode === "popup") {
            _self.necaptcha.popUp();
          }
          // 初始化成功后得到验证实例instance，可以调用实例的方法
        },
        function onerror(err) {
          // 初始化失败后触发该函数，err对象描述当前错误信息
          console.log(err);
          alert(err);
          _self.$emit("show-captcha", false);
        }
      );
    }
  }
};
