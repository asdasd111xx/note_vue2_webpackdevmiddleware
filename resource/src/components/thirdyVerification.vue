<template>
  <div>
    <div
      id="TencentCaptcha"
      v-if="[3, 4, 5].includes(captchaType)"
      :class="[
        $style['click-unit'],
        $style['click-unit-captcha'],
        $style[themeTPL],
        { [$style['disable']]: ret === 0 }
      ]"
      @click="showCaptcha"
    >
      <div :class="$style['icon']">
        <img
          :src="
            $getCdnPath(
              `/static/image/common/login/ic_verification_${
                ret === 0 ? 'success' : 'check_gray'
              }.png`
            )
          "
        />
      </div>

      <span v-if="ret === 0" :class="$style['success']">验证成功</span>
      <span v-else>点击按钮进行验证</span>
    </div>
    <div v-if="captchaType === 4" id="vaptcha-container-inline"></div>
    <div v-if="captchaType === 5" id="NECaptcha-container-inline"></div>

    <div
      v-if="showMask"
      :class="$style['pop-mask']"
      @click="showMask = false"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import thirdyVerification from "@/mixins/thirdyVerification";
export default {
  mixins: [thirdyVerification],
  data() {
    return {
      showMask: false
    };
  },
  created() {
    this.initCaptcha();
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
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
  border: 1px solid rgba(128, 128, 128, 0.26);
  border-radius: 3px;
  margin: 5px 0 10px 0;
  &.sg1 {
    border-radius: 20px;
  }

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
