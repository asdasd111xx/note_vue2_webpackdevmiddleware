<template>
  <mobile-container :header-config="headerConfig" :has-footer="false">
    <div slot="content" :class="$style['content-wrap']">
      <!-- 一件回收 -->
      <!-- 額度轉讓連結 false -->
      <balance-back :has-link="false" />
      <withdraw ref="withdraw" />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ajax from '@/lib/ajax';
import balanceBack from "../../../mcenter/components/common/balanceBack";
import mixin from '@/mixins/mcenter/withdraw';
import mobileContainer from '../../../common/mobileContainer';
import withdraw from '@/router/mobile/components/tpl/porn1/components/mcenter/components/withdraw/components/index'

export default {
  mixins: [mixin],
  data() {
    return {
    }
  },
  components: {
    pageLoading: () => import(/* webpackChunkName: 'pageLoading' */ '@/router/mobile/components/common/pageLoading'),
    mobileContainer,
    withdraw,
    balanceBack
  },
  computed: {
    ...mapGetters({
      siteConfig: 'getSiteConfig',
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: this.$text('S_WITHDRAWAL_TEXT', '提现'),
        hasHelp: {
          type: 'withdraw',
          url: '/mobile/mcenter/help/withdraw',
          func: () => {
            this.saveCurrentValue(true);
          }
        },
      };
    },
  },
  methods: {
    // 暫存目前選擇的銀行卡及金額
    saveCurrentValue(fromRule) {
      localStorage.setItem('tmp_w_selectedCard', this.$refs.withdraw.selectedCard);
      localStorage.setItem('tmp_w_amount', this.$refs.withdraw.withdrawValue);
      if (fromRule) {
        localStorage.setItem('tmp_w_rule', "1");
      }
    },
  },
}
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
@import "@/router/mobile/components/tpl/porn1/components/mcenter/components/balanceTrans/css/index.module.scss";
.content-wrap {
  background-color: $main_background_white1;
  color: #414655;
  min-height: calc(100vh);
}
</style>
