<template>
  <transition name="fade">
    <div v-show="isShow" class="dialog">
      <div>
        <div class="confirm-title">
          <slot name="msg" />
        </div>
        <div class="confirm-btn-wrap">
          <div @click="handleClick('click')">
            取消
          </div>
          <div @click="handleClick('confirm')">
            确定
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      isShow: false
    };
  },
  mounted() {
    this.isShow = true;
  },
  methods: {
    handleClick(type) {
      this.isShow = false;
      setTimeout(() => {
        if (type == "confirm") {
          this.$emit('confirm');
        } else {
          this.$emit('cancel');
        }
      }, 200)
    },
  },
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
  max-width: 300px;
  padding: 10px;
  color: black;
}

.confirm-btn-wrap {
  float: right;
  color: #147efb;
  padding: 3px;

  > div {
    margin: 10px;
    display: inline-block;

    &:first-of-type {
      opacity: 0.8;
    }
  }
}

.confirm-title {
  float: left;
  padding: 3px;
  font-size: 16px;
  display: block;
  width: 100%;
  word-break: break-all;
  line-height: 21px;
}
</style>
