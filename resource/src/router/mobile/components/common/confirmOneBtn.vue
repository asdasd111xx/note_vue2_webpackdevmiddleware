<template>
  <transition name="fade">
    <div v-show="isShow" class="dialog">
      <div class="dialog-wrap">
        <div
          class="confirm-title"
          :style="{ padding: data.content ? '20px 10px' : '30px 10px' }"
        >
          {{ data.title }}
        </div>

        <div
          v-if="data.content"
          class="confirm-content"
          v-html="data.content"
        />

        <div :class="['confirm-btn-wrap']" @click="handleClick">
          {{ data.btnText }}
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    data: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      isShow: false
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
  mounted() {
    this.isShow = true;
  },
  methods: {
    handleClick() {
      this.isShow = false;
      setTimeout(() => {
        this.$emit("close");
      }, 200);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.dialog {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 500;
  background-color: rgba(0, 0, 0, 0.4);
}

.dialog-wrap {
  background-color: rgba($color: white, $alpha: 1);
  border-radius: 10px;
  margin: 0 auto;

  width: 80%;
  max-width: 270px;
  min-height: 135px;

  color: black;
  text-align: center;
  font-size: 18px;
  line-height: 24px;
  font-weight: 700;
}

.confirm-title {
  padding: 30px 10px;
  display: block;
  width: 100%;
  word-break: break-all;
  color: #414655;
}

.confirm-content {
  font-size: 14px;
  padding: 0 10px;
  text-align: left;
  color: #a6a9b2;
}

.confirm-btn-wrap {
  // color: var(--popup_text_color1);
  color: #6aaaf5;
  padding: 20px 0;
}
</style>
