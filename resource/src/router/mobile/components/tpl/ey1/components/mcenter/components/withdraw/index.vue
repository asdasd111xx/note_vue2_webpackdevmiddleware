<template>
  <mobile-container :header-config="headerConfig" :has-footer="false">
    <div slot="content" :class="$style['content-wrap']">
      <!-- 額度轉讓連結 false -->
      <balance-back :has-link="false" :back-router="backRouter" />
      <withdraw ref="withdraw" />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ajax from "@/lib/ajax";
import balanceBack from "@/router/mobile/components/tpl/porn1/components/mcenter/components/common/balanceBack";
import mobileContainer from "../../../common/mobileContainer";
import withdraw from "@/router/mobile/components/tpl/porn1/components/mcenter/components/withdraw/components/index";

export default {
  data() {
    return {
      backRouter: "mcenter/withdraw"
    };
  },
  components: {
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      ),
    mobileContainer,
    withdraw,
    balanceBack
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: this.$text("S_WITHDRAWAL_TEXT", "提现"),
        hasHelp: {
          type: "withdraw",
          url: "/mobile/mcenter/help/withdraw",
          func: () => {
            this.saveCurrentValue(true);
          }
        }
      };
    }
  },
  methods: {
    // 暫存目前選擇的銀行卡及金額
    saveCurrentValue(fromRule) {
      localStorage.setItem(
        "tmp_w_selectedCard",
        JSON.stringify(this.$refs.withdraw.selectedCard)
      );
      localStorage.setItem(
        "tmp_w_withdrawCurrency",
        JSON.stringify(this.$refs.withdraw.withdrawCurrency)
      );
      // localStorage.setItem("tmp_w_amount", this.$refs.withdraw.withdrawValue);
      // localStorage.setItem(
      //   "tmp_w_actualAmount",
      //   JSON.stringify(this.$refs.withdraw.actualMoney)
      // );
      localStorage.setItem(
        "tmp_w_withdrawPwd",
        this.$refs.withdraw.withdrawPwd
      );
      if (fromRule) {
        localStorage.setItem("tmp_w_rule", "1");
      }
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
.content-wrap {
  background-color: $main_background_white1;
  color: #414655;
  height: calc(100vh + 43px);
  overflow-y: scroll;
}
</style>
