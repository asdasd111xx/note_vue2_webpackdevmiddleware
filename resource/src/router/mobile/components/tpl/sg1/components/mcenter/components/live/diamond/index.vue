<template>
  <mobile-container :header-config="headerConfig" :has-footer="false">
    <div slot="content" :class="$style['']">
      <page-loading :is-show="isLoading" />
    </div>
  </mobile-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "../../../../common/mobileContainer";
import openGame from "@/lib/open_game";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  components: {
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      ),
    mobileContainer
  },
  data() {
    return {
      isLoading: true,
      diamondTotal: {},
      diamondRemind: {},
      exchangeRateList: {}
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig"
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: this.$text("S_BUY_DIAMOND")
      };
    }
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    ...mapActions(["actionSetGlobalMessage", "actionGetExtRedirect"]),
    init() {
      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/user/diamond-total",
        method: "get"
      }).then(data => {
        this.diamondTotal = data.result;
      });

      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/diamond/remind",
        method: "get"
      }).then(data => {
        this.diamondRemind = data.result;
      });

      this.actionGetExtRedirect({
        api_uri: " /api/platform/v1/diamond/exchange-rate",
        method: "get"
      }).then(data => {
        this.isLoading = false;
        this.exchangeRateList = data.result;
      });
    }
  }
};
</script>
<style lang="scss" module>
@import "~@/css/variable.scss";
</style>
