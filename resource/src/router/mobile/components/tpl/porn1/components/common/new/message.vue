<template>
  <div v-show="isShow" :class="styleClass">
    <slot name="msg" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      isShow: true,
      styleClass: "dialog",
    };
  },
  created() {
    setTimeout(() => {
      this.styleClass = "dialog dialog-close"
      setTimeout(() => {
        this.isShow = false;
        this.$emit('close');
      }, 300);
    }, 800);
  },
  methods: {

  }
};
</script>

<style lang="scss">
@import "~@/css/variable.scss";

.dialog {
  animation: fade-in 0.31s;
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

.dialog div {
  background-color: rgba($color: #161616, $alpha: 0.8);
  border-radius: 10px;
  margin-left: auto;
  margin-right: auto;
  max-width: 200px;
  padding: 15px;
  color: white;
}

.dialog-close {
  animation: fade-out 0.31s;
}

@keyframes fade-in {
  0% {
    display: flex;
    opacity: 0;
  }
  100% {
    display: flex;
    opacity: 1;
  }
}

@-webkit-keyframes fade-in {
  0% {
    display: flex;
    opacity: 0;
  }
  100% {
    display: flex;
    opacity: 1;
  }
}

@keyframes fade-out {
  0% {
    display: flex;
    opacity: 1;
  }
  100% {
    display: none;
    opacity: 0;
  }
}

@-webkit-keyframes fade-out {
  0% {
    display: flex;
    opacity: 1;
  }
  100% {
    display: flex;
    opacity: 0;
  }
}
</style>
