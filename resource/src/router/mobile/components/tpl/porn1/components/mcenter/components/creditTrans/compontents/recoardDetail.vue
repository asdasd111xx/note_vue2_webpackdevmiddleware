<template>
  <div :class="sliderClass">
    <div :class="$style['detail-header']">
      <div :class="$style['btn-prev']">
        <img
          :src="$getCdnPath('/static/image/_new/common/btn_back.png')"
          @click="onClose()"
        />
      </div>
      <span :class="$style['title']"> 交易详情</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      sliderClass: 'slider',

    }
  },
  methods: {
    onClose() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$emit("close");
        }, 280)

      });
      this.sliderClass = 'slider-close slider'
    }
  },
};
</script>
<style lang="scss"  module>
@import "../css/index.module.scss";

.detail-header {
  z-index: 3;
  width: 100%;
  height: 43px;
  padding: 0 17px;
  background: #fefffe;
  text-align: center;
  position: relative;

  .title {
    font-size: 16px;
    font-family: Source Han Sans CN, Source Han Sans CN-Medium;
    font-weight: 500;
    text-align: center;
    color: #000000;
    line-height: 43px;
  }
}

.btn-prev {
  position: absolute;
  width: 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    width: 20px;
    height: 20px;
  }
}
</style>
