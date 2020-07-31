<template>
  <mobile-container :class="$style.container" :header-config="headerConfig">
    <div slot="content" class="content-wrap"></div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import mobileContainer from '../common/mobileContainer';

export default {
  components: {
    mobileContainer,
  },
  computed: {
    ...mapGetters({
    }),
    headerConfig() {
      return {
        prev: true,
        title: "Gift",
        onClick: () => {
          this.$router.back();
        }
      };
    },
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

div.container {
}
</style>
