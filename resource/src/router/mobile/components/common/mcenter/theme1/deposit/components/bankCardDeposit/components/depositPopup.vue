<template>
  <div
    :class="$style['deposit-popup-wrap']"
    @click.self="$emit('close', false, '')"
  >
    <div :class="$style.wrap">
      <!-- 109/11/12 -->
      <!-- Toby: 上下文字皆不顯示 -->

      <!-- <div :class="$style.title">{{ title }}</div> -->
      <div :class="$style.qrcode">
        <img :src="value" />
      </div>
      <!-- <div :class="$style.tips">
        {{ $text("S_PRESS_DOWNLOAD", "长按下载图片") }}
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    value: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    })
    // $style() {
    //   const style =
    //     this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
    //   return style;
    // }
  }
};
</script>

<style lang="scss" module>
.deposit-popup-wrap {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 200;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
}

.wrap {
  overflow: hidden;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 212px;
  height: 212px;
  margin: auto;
  border-radius: 5px;
  background-color: #161616;
}

.title {
  margin: 11px 0;
  color: #00d96d;
  font-size: 17px;
  text-align: center;
}

.qrcode {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  > img {
    width: 75%;
    height: 75%;
  }
}

.tips {
  margin: 10px 0;
  color: #f4d8af;
  font-size: 14px;
  text-align: center;
}
</style>
