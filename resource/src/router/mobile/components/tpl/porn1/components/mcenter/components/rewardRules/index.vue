<template>
  <mobile-container :header-config="headerConfig" :has-footer="false">
    <div slot="content" class="content-wrap">
      <vipRewardRules />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { getCookie } from "@/lib/cookie";
import mobileContainer from '../../../common/mobileContainer';
import vipRewardRules from './components/vipRewardRules'
export default {
  components: {
    mobileContainer,
    vipRewardRules,
  },
  computed: {
    ...mapGetters({
      loginStatus: 'getLoginStatus'
    }),
    isApp() {
      let isApp = !!(
        (this.$route.query && this.$route.query.app) ||
        (this.$route.query && this.$route.query.APP)
      );
      return isApp;
    },
    headerConfig() {
      if (!this.isApp) {
        return {
          prev: true,
          onClick: () => {
            this.$router.back();
          },
          title: this.$text('S_rewardRules_TEXT', '额度转让 奖励规则'),
        };
      }
    },
    created() {
      if (!getCookie("cid")) {
        this.$router.back();
      }
    }
  },

}
</script>

<style lang="scss" module>
.content-wrap {
  padding-top: 10px;
  padding-bottom: 30px;
  background: #eee;
  overflow: hidden auto;
}
</style>
