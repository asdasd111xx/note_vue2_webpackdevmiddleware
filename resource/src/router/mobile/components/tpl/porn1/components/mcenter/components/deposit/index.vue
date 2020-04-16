<template>
  <mobile-container :header-config="headerConfig" :class="$style.container">
    <div slot="content" :class="$style['content-wrap']">
      <depsoit />
    </div>
  </mobile-container>
</template>

<script>
import depsoit from '@/router/mobile/components/common/mcenter/theme1/deposit';
import mobileContainer from '../../../common/new/mobileContainer';

export default {
  components: {
    depsoit,
    mobileContainer
  },
  computed: {
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: this.$text('S_TRANSDER', '转帐')
      };
    }
  },
};
</script>

<style lang="scss" module>
.content-wrap {
  position: relative;
  padding: 65px 0 45px;
  background: #eee;
  min-height: calc(100vh);
}
</style>
