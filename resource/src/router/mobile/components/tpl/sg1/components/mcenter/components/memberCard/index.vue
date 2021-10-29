<template>
  <mobile-container :header-config="headerConfig" :has-footer="false">
    <div slot="content" :class="$style['']">
      <page-loading :is-show="isLoading" />
    </div>
  </mobile-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "@/router/mobile/components/tpl/sg1/components/common/mobileContainer";
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
      personalInfo: {}
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
        }
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
        api_uri: "/api/platform/v1/user/personal-info",
        method: "get"
      }).then(data => {
        this.isLoading = false;
        this.personalInfo = data.result;
      });
    }
  }
};
</script>
<style lang="scss" module>
@import "~@/css/variable.scss";
</style>
