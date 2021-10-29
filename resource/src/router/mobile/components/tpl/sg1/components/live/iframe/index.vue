<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" :class="$style['']">
      iframe-{{ this.$route.params.page }}
    </div>
  </mobile-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "../../common/mobileContainer";
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
    return {};
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig"
    }),
    headerConfig() {
      return {
        title: this.$route.params.page
      };
    }
  },
  created() {},
  mounted() {
    this.actionGetExtRedirect({
      api_uri: "/api/platform/v1/view-path",
      method: "get"
    }).then(result => {
      console.log(result);
    });
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage", "actionGetExtRedirect"])
  }
};
</script>
<style lang="scss" module>
@import "~@/css/variable.scss";
</style>
