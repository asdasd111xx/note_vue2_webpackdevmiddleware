<template>
  <transition name="fade">
    <div v-show="isShow" class="dialog">
      <slot name="msg" />
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    callback: {
      type: Function,
      default: null
    }
  },
  data() {
    return {
      isShow: false
    };
  },
  created() {
    this.isShow = true;
    setTimeout(() => {
      this.isShow = false;
      setTimeout(() => {
        this.$emit('close');
        this.callback && this.callback();
      }, 300);
    }, 2000);
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
}

.dialog /deep/ div {
  background-color: rgba($color: #161616, $alpha: 0.8);
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
  max-width: 200px;
  padding: 15px;
  color: white;
}
</style>
