<template>
  <!-- 提款前提示彈窗 -->
  <transition name="fade">
    <div :class="sliderClass">
      <div :class="$style['wiithdraw-account-header']">
        <div :class="$style['btn-prev']">
          <img
            :src="$getCdnPath(`/static/image/${themeTPL}/common/btn_back.png`)"
            @click="onClose()"
          />
        </div>
        <span :class="$style['title']"> {{ "帐户资料" }}</span>
      </div>

      <div :class="$style['wiithdraw-account-wrap']"></div>
    </div>
  </transition>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';

export default {
  props: {
    column: {
      default: {
        name: {
          default: false
        },
        withdrawPwd: {
          default: false
        },
        phone: {
          default: false
        },
      }
    },
  },
  data() {
    return {
      sliderClass: 'slider',
      name: '',
      withdrawPwd: {
      },
      phone: '',
      keyring: ''
    }
  },
  mounted() {

  },
  computed: {
    ...mapGetters({
      siteConfig: 'getSiteConfig',
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    onClose() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$emit('close');
        }, 280)

      });
      this.sliderClass = 'slider-close slider'
    },
    addMethod(item) {
      console.log(item);
      this.close();
    },
  },
};
</script>

<style lang="scss"  module>
@import "~@/css/variable.scss";

.wiithdraw-account-header {
  background: linear-gradient(#fe2a2a, #b60303);
  border-bottom: 1px solid #eee;
  color: #ffffff;
  height: 43px;
  max-width: $mobile_max_width;
  padding: 0 17px;
  position: fixed;
  text-align: center;
  top: 0;
  width: 100%;
  z-index: 3;

  .title {
    width: 100%;
    text-align: center;
    font-size: 17px;
    font-weight: 700;
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

.wiithdraw-account-wrap {
}
</style>
