<template>
    <div id="mobile-wrap" :class="$style['mobile-wrap']">
        <transition name="fade" mode="out-in">
            <router-view />
        </transition>
    </div>
</template>

<style src="@/css/index.scss" lang="scss"></style>
<style lang="scss" module>
@import "~@/css/variable.scss";

.mobile-wrap {
    height: 100%;
    overflow-y: auto;
}

:global {
  .fade-enter-active,
  .fade-leave-active {
    transition-duration: 0.3s;
    transition-property: opacity;
    transition-timing-function: ease;
  }

  .fade-enter,
  .fade-leave-active {
    opacity: 0;
  }
}
</style>
