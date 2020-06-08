<template>
  <div :class="$style['captcha-popup']">
    <template v-if="captchaType === 2">
      <div :class="$style['slide-block']">
        <slide-verification
          :is-enable="true"
          :success-fuc="getSlideData"
          page-status="verify"
        />
        <div :class="$style['close']">关闭</div>
      </div>
    </template>

    <template v-if="captchaType === 3">
      <puzzle-verification :puzzle-obj.sync="captchaInfo" />
    </template>
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
    captchaObj: {
      type: Object,
      default: {}
    },
    isClose: {
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
    captchaInfo: {
      get() {
        return this.info;
      },
      set(value) {
        this.info = value;
      }
    },
    captchaType() {
      return this.memInfo.config.default_captcha_type;
    }
  },
  methods: {
    getSlideData(dataInfo) {
      console.log(dataInfo);
    }
  }
};
</script>

<style lang="scss" module>
.captcha-popup {
  position: relative;
}

.slide-block {
  width: 290px;
  height: 170px;
  background: #fefefe;

  .close {
    width: 100%;
    text-align: center;
    padding: 12px 0;
    font-size: 18px;
    font-weight: 700;
    color: #d1b79c;
  }
}
</style>
