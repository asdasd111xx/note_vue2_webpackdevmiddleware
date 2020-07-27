<template>
  <transition name="fade">
    <div v-if="isShow" class="loading-wrap" @click="click">
      <div class="loading-item">
        <ele-loading />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  components: {
    eleLoading: () => import(/* webpackChunkName: 'eleLoading' */'@/router/web/components/tpl/common/element/loading/circle')
  },
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    click: {
      type: Function,
      default: () => { }
    }
  },
  data() {
    return {

    };
  },
  created() {

  }
};
</script>

<style lang="scss" scoped>
.loading-wrap {
  position: fixed;
  width: 100%;
  left: 0;
  top: 0;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 500;
  text-align: center;
  background: rgba(0, 0, 0, 0.2);
}

.loading-item {
}
</style>
