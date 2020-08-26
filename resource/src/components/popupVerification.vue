<template>
  <div :class="$style['captcha-popup']">
    <div
      :class="$style['pop-mask']"
      @click="$emit('update:isShowCaptcha', false)"
    />

    <!-- 滑動認證 -->
    <div v-if="captchaType === 2" :class="$style['slide-block']">
      <slide-verification
        :is-enable="true"
        :success-fuc="getSlideData"
        page-status="verify"
      />
      <div
        :class="$style['close']"
        @click="$emit('update:isShowCaptcha', false)"
      >
        关闭
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import slideVerification from "@/components/slideVerification";
import puzzleVerification from "@/components/puzzleVerification";

export default {
  components: {
    slideVerification,
    puzzleVerification
  },
  props: {
    captcha: {
      type: Object || String,
      default: null
    },
    isShowCaptcha: {
      type: Boolean
    }
  },
  data() {
    return {
      info: null
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    captchaType() {
      return this.memInfo.config.default_captcha_type;
    }
  },
  mounted() {
    // 無需驗證 to do 驗證碼
    if (this.captchaType === 0 || this.captchaType === 1) {
      this.$emit("update:captcha", {});
      this.$emit("update:isShowCaptcha", false);
    }

    // 拼圖認證
    if (this.captchaType === 3) {
      this.showPuzzleCaptcha();
    }
  },
  methods: {
    getSlideData(dataInfo) {
      this.$emit("update:captcha", dataInfo.data);

      if (dataInfo.data) {
        this.$emit('update:isShowCaptcha', false)
      }
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

  .close {
    padding: 12px 0;
    margin-top: 40px;
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    color: #d1b79c;
    border-top: 1px solid #f8f8f7;
  }
}
</style>
