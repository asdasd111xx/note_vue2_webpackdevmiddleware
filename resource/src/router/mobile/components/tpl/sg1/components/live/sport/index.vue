<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" :class="$style['']">
      sport
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
        title: this.$text("S_SPORTS_SHORT", "体育")
      };
    }
  },
  created() {},
  mounted() {},
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    openLiveStream() {}
  }
};
</script>
<style lang="scss" module>
@import "~@/css/variable.scss";
</style>
