<template>
  <mobile-container :header-config="headerConfig" :class="$style.container">
    <div slot="content" :class="$style['content-wrap']"></div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import mobileContainer from '../../../common/new/mobileContainer';
export default {
  components: {
    mobileContainer,
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus'
    }),
    headerConfig() {
      return {
        hasLogo: false,
        hasMemInfo: false,
        hasSearchBtn: false,
        isMCenter: true,
        title: this.$text('S_HELP_CENTER', '帮助中心'),
      };
    },
  },
  created() {

  },
  methods: {
  }
};
</script>

<style lang="scss" module>
.container {
  overflow-y: scroll;
}
</style>
