<template>
  <div :class="$style['captcha-popup']">
    <div :class="$style['pop-mask']" @click="$emit('show-captcha', false)" />
    <div v-if="[4].includes(captchaType)" id="vaptcha-container-popup" />
    <div v-if="[5].includes(captchaType)" id="NECaptcha-container-popup" />

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
        @click="$emit('show-captcha', false)"
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
import thirdyVerification from "@/mixins/thirdyVerification";

import axios from "axios";

export default {
  mixins: [thirdyVerification],
  components: {
    slideVerification
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
    })
  },
  created() {
    if ([3, 4, 5].includes(this.captchaType)) {
      this.initCaptcha();
    }
  },
  mounted() {
    switch (this.captchaType) {
      default:
      case 0:
        this.$emit("show-captcha", false);
        return;

      // 圖形驗證
      case 1:
        this.getCaptchaImage();
        break;

      // 滑動驗證
      case 2:
        break;

      //拼圖驗證
      //手繪驗證
      //行為驗證
      case 3:
      case 4:
      case 5:
        // this.showCaptcha();
        break;
    }
  },
  methods: {
    ...mapActions(["actionVerificationFormData"]),
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
      this.$emit("set-captcha", dataInfo.data);

      if (dataInfo.data) {
        this.$emit("show-captcha", false);
      }
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
      // this.$emit("set-captcha", {
      //   captcha: this.captchaText
      //   // aid: getCookie("aid")
      // });
      this.$emit("set-captcha", this.captchaText);
      this.$emit("show-captcha", false);
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
