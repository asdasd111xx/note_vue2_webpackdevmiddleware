<template>
    <mobile-container 
    :header-config="headerConfig" 
    :has-footer="false"
    >
    <div slot="content" class="content-wrap">
    <vipRewardRules />  
    </div>
    </mobile-container>
</template>

<script>
import { mapGetters} from 'vuex';
import { getCookie } from "@/lib/cookie";
import mobileContainer from '../../../common/mobileContainer';
import vipRewardRules from './components/vipRewardRules'
export default {
    components: {
        mobileContainer, 
        vipRewardRules,
    },
    data() {
        return {};
    },
    computed: {
    ...mapGetters({
        loginStatus: 'getLoginStatus'
    }),
    headerConfig() {
        return {
            title: this.$text('S_rewardRules_TEXT', '额度转让 奖励规则'),
            prev: true,
            onClick: () => {
            this.$router.back();
            },
        };
    },
    created() {
      if (getCookie("cid")) {
        return;
      }

      if (!this.loginStatus) {
        this.$router.push("/mobile/login");
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