<template>
  <div :class="$style['captcha-popup']">
    <div
      :class="$style['pop-mask']"
      @click="$emit('update:isShowCaptcha', false)"
    />

    <div v-if="[4].includes(captchaType)" id="vaptcha-container" />
    <div v-if="[5].includes(captchaType)" id="NECaptcha-container" />

    <div v-if="[1, 2].includes(captchaType)" :class="$style['slide-block']">
      <!-- 滑動認證 -->
      <slide-verification
        v-if="captchaType === 2"
        :is-enable="true"
        :success-fuc="getSlideData"
        page-status="verify"
      />
      <!-- 圖形認證 -->
      <div v-else-if="captchaType === 1" :class="$style['captchaText-wrap']">
        <input
          v-model="captchaText"
          :placeholder="'请输入验证码'"
          @input="verification($event.target.value, 'captchaText')"
        />
        <img
          v-if="captchaImg"
          :class="$style['captchaImg']"
          :src="captchaImg"
          height="25"
        />
        <div :class="$style['captchaText-refresh']" @click="getCaptchaImage">
          <img
            :src="
              $getCdnPath('/static/image/common/ic_verification_reform.png')
            "
          />
        </div>
      </div>
      <div
        :class="[
          $style['close'],
          {
            [$style['is-captcha-image']]: captchaType === 1
          }
        ]"
        @click="$emit('update:isShowCaptcha', false)"
      >
        关闭
      </div>
      <div v-if="captchaType === 1" :class="$style['submit']" @click="submit">
        确认送出
      </div>
    </div>
  </div>
</template>

<script>
import { getCookie, setCookie } from "@/lib/cookie";
import { mapGetters, mapActions } from "vuex";
import bbosRequest from "@/api/bbosRequest";
import slideVerification from "@/components/slideVerification";
import thirdyVerification from "@/components/thirdyVerification";

import axios from "axios";

export default {
  components: {
    slideVerification,
    thirdyVerification
  },
  props: {
    captcha: {
      type: Object | String,
      default: null
    },
    isShowCaptcha: {
      type: Boolean
    },
    friend_captcha_type: {
      type: Boolean
    }
  },
  data() {
    return {
      info: null,
      captchaText: "", // 圖形驗證
      isGetCaptchaImg: false,
      captchaImg: "",

      vaptchaObj: {},
      necaptcha: {}
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo"
    }),
    captchaType() {
      return this.friend_captcha_type
        ? this.memInfo.config.friend_captcha_type
        : this.memInfo.config.default_captcha_type;
    }
  },
  mounted() {
    switch (this.captchaType) {
      default:
      case 0:
        this.$emit("update:captcha", {});
        this.$emit("update:isShowCaptcha", false);
        return;

      // 圖形驗證
      case 1:
        this.getCaptchaImage();
        break;

      // 滑動驗證
      case 2:
        break;

      //拼圖驗證
      case 3:
        this.showPuzzleCaptcha();
        break;

      //手繪驗證
      case 4:
      //行為驗證
      case 5:
        this.loadScript();
        break;
    }
  },
  methods: {
    ...mapActions(["actionVerificationFormData"]),
    loadScript() {
      let src;
      let callback;
      switch (this.captchaType) {
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
    getCaptchaImage() {
      if (this.isGetCaptchaImg) {
        return;
      }

      this.isGetCaptchaImg = true;
      axios({
        method: "post",
        url: "/api/v1/captcha"
      }).then(res => {
        setTimeout(() => {
          this.isGetCaptchaImg = false;
        }, 800);
        if (res.data && res.data) {
          this.captchaImg = res.data.ret;
          //   setCookie('aid', res.data.cookie.aid);
        }
      });
    },
    getSlideData(dataInfo) {
      this.$emit("update:captcha", dataInfo.data);

      if (dataInfo.data) {
        this.$emit("update:isShowCaptcha", false);
      }
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
          _self.$emit("update:captcha", data);
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
            _self.$emit("update:captcha", data);
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
    },
    showPuzzleCaptcha() {
      let captcha = new TencentCaptcha("2028894711", res => {
        if (res.ret === 0) {
          const { appid, randstr, ticket, ret } = res;
          let data = {
            appid: appid,
            randstr: randstr,
            ticket: ticket
          };
          this.$emit("update:captcha", data);
        }
        this.$emit("update:isShowCaptcha", false);
        return;
      });

      captcha.show();
    },
    verification(value, key) {
      if (key === "captchaText") {
        this.actionVerificationFormData({
          target: "graphicVerification",
          value: value
        }).then(val => {
          this.captchaText = val;
        });
      }
    },
    submit() {
      //   this.$emit("update:captcha", { captcha: this.captchaText, aid: getCookie('aid') });
      this.$emit("update:captcha", this.captchaText);
      // $emit('update:isShowCaptcha', false)
    }
  }
};
</script>

<style lang="scss" module>
.captcha-popup {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 99;
}

.pop-mask {
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.5;
}

.slide-block {
  position: absolute;
  width: 80%;
  padding: 40px 10px 0px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fefefe;
  border-radius: 8px;
}

.close {
  padding: 12px 0;
  margin-top: 40px;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: #d1b79c;
  border-top: 1px solid #f8f8f7;

  &.is-captcha-image {
    color: #414655;
    display: inline-block;
    width: 48%;
  }
}

.submit {
  padding: 12px 0;
  margin-top: 40px;
  text-align: center;
  font-size: 18px;
  font-weight: 700;
  color: #d1b79c;
  display: inline-block;
  width: 48%;
  border-top: 1px solid #f8f8f7;
  border-left: 1px solid #f8f8f7;
}

.captchaText-wrap {
  height: 48px;
  width: 100%;
  max-width: 275px;
  display: flex;
  align-items: center;
  background: #ffffff;
  border: 1px solid #e3e3e3;
  border-radius: 10px;

  > input {
    border: unset;
    box-shadow: none;
    outline: none;
    width: 80%;
    padding-left: 5px;
    color: #5e626d;
  }

  > .captchaImg {
    width: 70px;
    height: 30px;
    background-color: #000;
  }
}

.captchaText-refresh {
  width: 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 10px;

  > img {
    width: 20px;
    height: 20px;
  }
}
</style>
