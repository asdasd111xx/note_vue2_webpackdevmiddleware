<template>
  <div>
    <div
      id="TencentCaptcha"
      v-if="[3, 4, 5].includes(captchaType)"
      :class="[
        $style['click-unit'],
        $style['click-unit-captcha'],
        { [$style['disable']]: ret === 0 }
      ]"
      @click="showCaptcha"
    >
      <div :class="$style['icon']">
        <img
          :src="
            $getCdnPath(
              `/static/image/common/login/ic_verification_${
                ret === 0 ? 'success' : 'check'
              }.png`
            )
          "
        />
      </div>

      <span v-if="ret === 0" :class="$style['success']">验证成功</span>
      <span v-else>点击按钮进行验证</span>
    </div>
    <div v-if="captchaType === 4" id="vaptcha-container"></div>
    <div v-if="captchaType === 5" id="NECaptcha-container"></div>

    <div
      v-if="showMask"
      :class="$style['pop-mask']"
      @click="showMask = false"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    pageType: {
      type: String,
      default: "login"
    },
    thirdyObj: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      ret: null,
      showMask: false,

      vaptchaObj: {},
      necaptcha: {}
    };
  },
  mounted() {
    console.log(this.captchaType);
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo"
    }),
    captchaType() {
      switch (this.pageType) {
        case "login":
          return this.memInfo.config.login_captcha_type;
        case "register":
          return this.memInfo.config.register_captcha_type;
        case "friend":
          return this.memInfo.config.friend_captcha_type;
        case "default":
          return this.memInfo.config.default_captcha_type;
      }
    }
  },
  methods: {
    showCaptcha() {
      let src;
      let callback;
      this.showMask = true;
      switch (this.captchaType) {
        case 3:
          let captcha = new TencentCaptcha("2028894711", res => {
            if (res.ret === 0) {
              const { appid, randstr, ticket, ret } = res;
              this.ret = ret;
              let data = {
                appid: appid,
                randstr: randstr,
                ticket: ticket
              };
              this.$emit("update:thirdyObj", data);
              this.showMask = false;
            } else {
              this.ret = null;
              this.$emit("update:thirdyObj", null);
              this.showMask = false;
            }
            return;
          });

          captcha.show();
          return;
        //手繪驗證
        case 4:
          src = "https://v.vaptcha.com/v3.js";
          callback = () => {
            this.vaptchaInit();
          };
          break;
        //行為驗證
        case 5:
        default:
          src = "http://cstaticdun.126.net/load.min.js";
          callback = () => {
            this.necCaptchaInit();
          };
          break;
      }

      if (
        document.querySelector('script[script-type="third-party-verification"]')
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
    vaptchaInit() {
      let _self = this;
      vaptcha({
        vid: "5f9691bd456d5799dec0189a", // 验证单元id
        // type: "embed", // 显示类型 点击式
        type: "click",
        scene: 0, // 场景值 默认0
        container: "#vaptcha-container", // 容器，可为Element 或者 selector
        offline_server: "", //离线模式服务端地址，若尚未配置离线模式，请填写任意地址即可。
        //可选参数
        lang: "zh-CN" // 语言 默认auto,可选值auto,zh-CN,en,zh-TW,jp
        //https: true, // 使用https 默认 true
        //style: 'dark' //按钮样式 默认dark，可选值 dark,light
        //color: '#57ABFF' //按钮颜色 默认值#57ABFF
      }).then(function(result) {
        _self.vaptchaObj = result; //将VAPTCHA验证实例保存到局部变量中
        _self.vaptchaObj.render(); // 调用验证实例 vpObj 的 render 方法加载验证按钮

        //获取token的方式一：
        //vaptchaObj.renderTokenInput('.login-form')//以form的方式提交数据时，使用此函数向表单添加token值
        //获取token的方式二：
        _self.vaptchaObj.listen("pass", function() {
          let data = {
            token: _self.vaptchaObj.getToken(),
            vid: "5f9691bd456d5799dec0189a"
          };
          console.log(_self.vaptchaObj, data);
          _self.$emit("update:thirdyObj", data);
          setTimeout(() => {
            _self.vaptchaObj = null;
          }, 1000);
        });

        //关闭验证弹窗时触发
        _self.vaptchaObj.listen("close", function() {
          _self.vaptchaObj.reset(); //重置验证码
          _self.$emit("update:isShowCaptcha", false);
        });
      });
    },
    necCaptchaInit() {
      let _self = this;

      initNECaptcha(
        {
          // config对象，参数配置
          captchaId: "8b50788c733744ec8028695f31187233",
          element: "#NECaptcha-container",
          mode: "popup",
          width: "320px",
          onVerify(err, result) {
            console.log(err, result);
            if (err) return;

            let data = {
              validate: result.validate,
              captchaId: _self.necaptcha.captchaId
            };
            _self.$emit("update:thirdyObj", data);
            setTimeout(() => {
              _self.necaptcha = null;
              _self.$emit("update:isShowCaptcha", false);
            }, 1000);
          }
        },
        function onload(instance) {
          console.log(instance);
          _self.necaptcha = instance;
          _self.necaptcha.popUp();
          // 初始化成功后得到验证实例instance，可以调用实例的方法
        },
        function onerror(err) {
          // 初始化失败后触发该函数，err对象描述当前错误信息
          console.log(err);
          alert(err);
          _self.$emit("update:isShowCaptcha", false);
        }
      );
    }
  }
};
</script>

<style lang="scss" module>
.click-unit {
  position: relative;
  display: flex;
  align-items: center;
  height: 40px;
  background: #fefefe;
  margin-bottom: 11px;
  border: 1px solid rgba(128, 128, 128, 0.26);
  border-radius: 3px;

  &.disable {
    pointer-events: none;
  }

  .icon {
    position: absolute;
    top: calc(50% - 9px);
    left: 0;
    width: 30px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    > img {
      width: 18px;
      height: 18px;
    }
  }
  span {
    padding-left: 38px;
    color: #a5a5a5;

    &.success {
      color: #34d158;
    }
  }
}

.pop-mask {
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.5;
}
</style>
