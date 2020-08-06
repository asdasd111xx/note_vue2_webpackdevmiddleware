<template>
  <div v-if="isShowPop" :class="$style['pop-wrap']">
    <div
      :class="$style['pop-mask']"
      @click="$emit('update:isShowPop', false)"
    />
    <div :class="$style['pop-block']">

    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    isShowPop: {
      type: Boolean,
      require: true
    },
    walletId: {
      type: Number,
      require: true
    }
  },
  created() {
    console.log(this.walletId);
  },
};
</script>

<style lang="scss" module>
.pop-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 99;
}

.pop-mask {
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.5;
}

.pop-block {
  position: absolute;
  width: 85%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #f8f8f7;
  border-radius: 8px;
}
</style>
