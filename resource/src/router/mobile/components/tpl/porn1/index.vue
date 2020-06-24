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
      v-if="globalMessage"
      :callback="clearMsg"
      :msgObj="globalMessage"
    />
  </div>
</template>

<script>
import notification from './components/notification';
import message from '@/router/mobile/components/tpl/porn1/components/common/new/message2';
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
  watch: {
    globalMessage(val) {
    }
  },
  computed: {
    ...mapGetters({
      globalMessage: 'getGlobalMessage'
    }),
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    clearMsg() {
      if (this.globalMessage && this.globalMessage.code) {
        const code = this.globalMessage.code;
        const callback = this.globalMessage.cb;
        switch (code) {
          // 充值
          case "C50100":
            this.$router.push('/mobile/mcenter/deposit?redirect=home');
            break;
          // 銀行卡
          case "C50099":
            callback ? callback() :
              this.$router.push('/mobile/mcenter/bankCard?redirect=home');
            break;
          // 重新登入
          case "M00001":
            this.$router.push('/mobile/login');
            break;
          default:
            break;
        }
      }
      this.actionSetGlobalMessage(null);
    }
  },
};
</script>
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
