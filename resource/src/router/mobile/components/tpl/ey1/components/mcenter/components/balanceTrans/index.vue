<template>
  <mobile-container :header-config="headerConfig" :has-footer="false">
    <div slot="content" :class="$style['content-wrap']">
      <balanceBack :has-link="false" />
      <balanceTrans :is-show-block-tips.sync="isShowBlockTips" />
      <blockListTips
        v-if="isShowBlockTips"
        type="transfer"
        @close="closeTips"
      />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import balanceBack from "../../../mcenter/components/common/balanceBack";
import balanceTrans from '@/router/mobile/components/tpl/porn1/components/mcenter/components/balanceTrans/components/index';
import blockListTips from "../../../common/blockListTips";
import mobileContainer from "../../../common/mobileContainer";

export default {
  components: {
    mobileContainer,
    blockListTips,
    balanceTrans,
    balanceBack
  },
  data() {
    return {
      isShowBlockTips: false
    }
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      siteConfig: 'getSiteConfig'
    }),
    headerConfig() {
      return {
        title: this.$text("S_transfer", "转帐"),
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        hasHelp: true,
      };
    },
  },
  methods: {
    closeTips() {
      this.isShowBlockTips = false;
      this.$router.back();
    }
  }
};
</script>
<style lang="scss" module>
.content-wrap {
  position: relative;
  min-height: calc(100vh - 60px);
  padding-bottom: 45px;
  background: #eee;
}
</style>
