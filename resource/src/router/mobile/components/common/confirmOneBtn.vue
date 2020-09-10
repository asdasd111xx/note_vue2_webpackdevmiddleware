<template>
  <transition name="fade">
    <div v-show="isShow" class="dialog">
      <div>
        <div class="confirm-title">
          {{ data.msg }}
        </div>
        <div
          :class="[
            'confirm-btn-wrap',
            {
              ey1: themeTPL === 'ey1'
            }
          ]"
        >
          <div @click="handleClick()">
            {{ data.btnText }}
          </div>
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

.dialog > div {
  background-color: rgba($color: white, $alpha: 1);
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
  width: 80%;
  max-width: 270px;
  min-height: 135px;
  color: black;
  text-align: center;
  font-size: 18px;
  line-height: 24px;
  height: 24px;
  font-weight: 700;
}

.confirm-title {
  padding: 30px;
  display: block;
  width: 100%;
  word-break: break-all;
  color: #414655;
}

.confirm-btn-wrap {
  color: #d1b79c;
  margin-top: 12px;

  &.ey1 {
    color: #e42a30;
  }
}
</style>
