<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content" class="content-wrap">
      <swag />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import mobileContainer from '../../../common/mobileContainer';
import swag from '@/router/mobile/components/tpl/porn1/components/mcenter/components/swag/compontents/';

export default {
  components: {
    mobileContainer,
    swag
  },
  data() {
    return {
    }
  },
  methods: {
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo'
    }),
    headerConfig() {
      return {
        title: this.$text("S_BUY_DIAMOND", "购买钻石"),
        prev: true,
        onClick: () => {
          localStorage.removeItem("tmp_d_1");
          localStorage.removeItem("tmp_d_currentSelRate");
          if (this.$route.query && this.$route.query.prev) {
            let prev = this.$route.query.prev;
            switch (prev) {
              case 'back':
              default:
                this.$router.back();
                return;
            }
          } else {
            this.$router.push('/mobile/mcenter/wallet');
          }
        },
      }
    }
  }
};
</script>

<style lang="scss" module>
.container {
}
</style>
