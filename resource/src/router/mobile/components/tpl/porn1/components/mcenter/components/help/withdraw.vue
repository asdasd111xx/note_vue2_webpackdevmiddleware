<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content" :class="$style['setting-wrap']"></div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import member from '@/api/member';
import mobileContainer from '../../../common/new/mobileContainer';
export default {
  components: {
    mobileContainer,
  },
  data() {
    return {

    };
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus'
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: '提现教程',
      };
    },
  },
  created() {
    if (!this.loginStatus) {
      this.$router.push("/mobile/home")
    }
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
