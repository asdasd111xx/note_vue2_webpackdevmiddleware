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
import iframeEvent from "@/mixins/iframeEvent";

export default {
  mixins: [iframeEvent],
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
      src: ""
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
  watch: {
    "$route.params.page"() {
      this.initPage();
    }
  },
  created() {},
  mounted() {
    this.initPage();
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage", "actionGetExtRedirect"]),
    initPage() {
      this.isLoading = true;
      if (this.loginStatus) {
        let clientUri = "";
        this.actionGetExtRedirect({
          api_uri: "/api/platform/v1/view-path",
          method: "get"
        }).then(res => {
          const list = res.result;
          if (res && res.result) {
            Object.keys(list).some(key => {
              if (key === this.pageType) {
                clientUri = list[key];
                return;
              }
            });

            goLangApiRequest({
              method: "post",
              url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/Customize`,
              params: {
                code: "cubechat_master",
                clientUri: clientUri
                // clientUri: "https://client-dev.cubechat.asia/"
              }
            }).then(res => {
              if (res && res.data && res.data.uri) {
                this.src = res.data.uri;
              }
              this.isLoading = false;
            });
          } else {
            this.isLoading = false;
          }
        });
      }
    },
    onSendMessage() {
      this.iframeOnSendMessage(e);
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
