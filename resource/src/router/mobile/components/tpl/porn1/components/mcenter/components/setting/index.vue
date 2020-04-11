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
        prev: true,
        onClick: () => { this.$router.back(); },
        title: this.$text('S_SETTING', '设置'),
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
@import "~@/css/variable.scss";

.container {
  background-color: $main_background_white1;
}
</style>
