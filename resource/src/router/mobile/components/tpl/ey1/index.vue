<template>
  <div
    id="mobile-wrap"
    :class="{ [$style['mobile-wrap']]: $route.name !== 'install' }"
  >
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
    <notification />
    <message
      v-if="globalMessage && $route.name !== 'launch'"
      :msgObj="globalMessage"
    />
  </div>
</template>

<script>
import notification from '@/router/mobile/components/common/notification';
import message from '@/router/mobile/components/common/message2';
import { mapGetters, mapActions } from 'vuex';

export default {
  components: {
    notification,
    message
  },
  data() {
    return {
    };
  },
  mounted() {
    console.log("===ey===")
  },
  computed: {
    ...mapGetters({
      globalMessage: 'getGlobalMessage'
    }),
  },
};
</script>
<style src="@/css/index.scss" lang="scss"></style>
<style lang="scss" module>
@import "~@/css/variable.scss";

.mobile-wrap {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
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
