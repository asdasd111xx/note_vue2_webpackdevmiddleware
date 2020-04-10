<template>
  <mobile-container :class="$style.container" :header-config="headerConfig">
    <div slot="content" class="content-wrap"></div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import mobileContainer from '../common/new/mobileContainer';

export default {
  components: {
    mobileContainer,

  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo'
    }),
    isAdult() {
      return this.memInfo.config.content_rating && this.memInfo.user.content_rating;
    },
    headerConfig() {
      const name = this.$route.params.page || 'home';

      return {
        prev: true,
        isBackgroundGradient: true,
        hasSearchBtn: name === 'home',
        title: this.$text('S_SERVIEC', '客服'),
        onClick: () => { this.$router.back(); }
      };
    },
  }
};
</script>

<style lang="scss" module>
div.container {
  background-color: white;
}
</style>
