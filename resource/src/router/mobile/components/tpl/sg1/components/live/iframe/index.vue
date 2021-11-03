<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" :class="$style['iframe-wrap']">
      <iframe
        ref="iframe"
        id="iframe"
        :class="[$style['iframe']]"
        :src="src"
        @load="onLoadiframe"
        allow="geolocation"
        scrolling="auto"
        allowfullscreen="allowfullscreen"
        frameborder="0"
        crossorigin
      />
      <page-loading :is-show="isLoading" />
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
    return {
      isLoading: true,
      src: "https://client-dev.cubechat.asia/"
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig"
    }),
    pageType() {
      return this.$route.params.page;
    },
    headerConfig() {
      // return {
      //   title: this.$route.params.page
      // };
    }
  },
  created() {
    this.$route.params.page;
    let livePagelist = [
      "home",
      "tool",
      "style",
      "contribute",
      "experince",
      "rank"
    ];

    if (!livePagelist.includes(this.pageType)) {
      this.$router.back();
    }
  },
  mounted() {
    this.actionGetExtRedirect({
      api_uri: "/api/platform/v1/view-path",
      method: "get"
    }).then(result => {
      console.log(result);
    });
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage", "actionGetExtRedirect"]),
    onListener(e) {
      console.log(e);
    },
    onLoadiframe() {
      setTimeout(() => {
        this.isLoading = false;
      }, 310);

      window.addEventListener("message", this.onListener);

      const iframe = this.$refs["iframe"];
      iframe.contentWindow.postMessage("test message", "*");
      iframe.contentWindow.postMessage({ data: "data" }, "*");
    }
  }
};
</script>
<style lang="scss" module>
@import "~@/css/variable.scss";

.iframe-wrap {
  height: 100vh;
  width: 100%;
  background-color: #fff;
  transition: margin 0.31s, height 0.31s;
}

.iframe {
  border: none;
  display: block;
  height: 100%;
  margin: 0 auto;
  max-width: $mobile_max_width;
  min-width: 0;
  padding: 0;
  width: 100%;
}
</style>
