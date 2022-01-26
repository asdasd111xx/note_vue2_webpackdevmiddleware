<template>
  <mobile-container :has-footer="hasFooter">
    <div
      slot="content"
      :class="[
        $style['iframe-wrap'],
        {
          [$style['has-header']]: headerConfig.hasHeader
        },
        {
          [$style['has-footer']]: headerConfig.hasFooter
        },
        { [$style['fullScreen']]: isFullScreen }
      ]"
    >
      <div
        v-if="headerConfig.hasHeader"
        id="header"
        :class="[$style['header'], { [$style['fullScreen']]: isFullScreen }]"
      >
        <div
          v-show="isFullScreen"
          :class="$style['close-fullscreen']"
          @click="toggleFullScreen"
        >
          <img :src="$getCdnPath(`/static/image/common/arrow_next.png`)" />
        </div>

        <div :class="[$style['btn-prev']]" @click="headerConfig.onClick">
          <img :src="$getCdnPath(`/static/image/common/btn_back_black.png`)" />
        </div>
        <div v-if="headerConfig.title" :class="[$style.title]">
          {{ contentTitle || headerConfig.title }}
        </div>
        <div v-if="headerConfig.hasFunc" :class="[$style.func]">
          <div @click="toggleFullScreen">全屏</div>
          <!-- <div @click="reload">刷新</div> -->
        </div>
      </div>

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
      <!-- <page-loading :is-show="isLoading" /> -->
    </div>
  </mobile-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "../../common/mobileContainer";
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
      src: "",
      isFullScreen: false,
      contentTitle: "",
      hasFooter: true
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
      const query = this.$route.query;

      this.isFullScreen =
        query.fullscreen === undefined ? false : query.fullscreen === "true";

      this.hasFooter =
        query.hasFooter === undefined ? false : query.hasFooter === "true";

      let baseConfig = {
        hasHeader:
          query.hasHeader === undefined ? false : query.hasHeader === "true",
        hasFooter:
          query.hasFooter === undefined ? false : query.hasFooter === "true",
        prev: query.prev === undefined ? true : query.prev,
        hasFunc: query.func === undefined ? true : query.func === "true",
        title:
          this.contentTitle ||
          query.title ||
          localStorage.getItem("iframe-third-url-title") ||
          ""
      };

      return {
        ...baseConfig,
        onClick: () => {
          this.$router.back();
        }
      };
    }
  },
  watch: {
    "$route.params.page"() {
      this.initPage();
    },
    "$route.query.hasFooter"(value) {
      this.hasFooter = value === undefined ? true : value === "true";
    }
  },
  created() {},
  mounted() {
    this.initPage();
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage", "actionGetExtRedirect"]),
    initPage() {
      let clientUri = "";
      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/view-path",
        method: "get"
      }).then(res => {
        if (res && res.result) {
          const list = res.result;
          Object.keys(list).some(key => {
            if (key === this.pageType) {
              this.liveHomeSrc = list["home"];
              clientUri = list[key];
              return;
            }
          });

          if (localStorage.getItem("live-iframe-event-from")) {
            if (this.pageType === "home") {
              clientUri = localStorage.getItem("live-iframe-event-from");
            }
            localStorage.removeItem("live-iframe-event-from");
          }

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
        }
      });
    },
    toggleFullScreen() {
      this.isFullScreen = !this.isFullScreen;
    },
    toogleFooter(data = {}) {
      const show = data.data === true || data.data === "true";
      if (show) {
        this.$router.push({ query: { hasFooter: "true" } });
      } else {
        this.$router.push({ query: { hasFooter: "false" } });
      }
    },
    redirectLive(target = "home") {
      this.$router.push(`/mobile/live/iframe/${target}?hasFooter=true`);

      switch (target) {
        case "home":
          goLangApiRequest({
            method: "post",
            url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/Customize`,
            params: {
              code: "cubechat_master",
              clientUri: this.liveHomeSrc
              // clientUri: "https://client-dev.cubechat.asia/"
            }
          }).then(res => {
            if (res && res.data && res.data.uri) {
              this.src = res.data.uri;
            }
          });
          return;
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
  height: calc(100vh);
  width: 100%;
  background-color: #fff;
  transition: margin 0.31s, height 0.31s;
  padding-bottom: 1px;
  overflow: hidden;
  -webkit-overflow-scrolling: touch !important;

  &.fullScreen {
    margin-top: unset !important;
    height: 100vh !important;
  }

  &.has-header {
    margin-top: 43px;
  }

  &.has-footer {
    height: calc(100vh - 66px);
  }
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

  -webkit-overflow-scrolling: touch !important;
}

.header {
  margin: 0 auto;
  max-width: $mobile_max_width;
  position: absolute;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 43px;
  padding: 0 17px;
  background: white;
  color: #ffffff;
  text-align: center;
  animation: slide-down 0.31s forwards;

  &.fullScreen {
    animation: slide-up 0.31s forwards;
    top: -43px;
  }
}

@media (orientation: landscape) {
  .header,
  .iframe {
    max-width: $mobile_max_landscape_width !important;
  }
}

.btn-prev {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 12px;
  width: 20px;
  height: 20px;
  margin: auto;
  z-index: 2;
  color: black;

  > img {
    display: block;
    width: 100%;
  }

  > div {
    display: block;
    position: absolute;
    top: 0;
    width: 40px;
    left: 20px;
  }
}

.wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
}

.title {
  color: black;
  font-size: 17px;
  font-weight: 500;
  height: 43px;
  line-height: 43px;
  margin: 0 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 60%;
}

.close-fullscreen {
  z-index: 999;
  position: fixed;
  top: 0;
  margin: 0 auto;
  height: 19px;
  margin: 0 auto;
  left: calc(50% - 15px);
  background: rgba(0, 0, 0, 0.4);
  border-radius: 0 0 5px 5px;
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  > img {
    height: 15px;
    transform: rotate(90deg);
  }
}

.func {
  position: absolute;
  right: 12px;
  top: 0;
  font-size: 14px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;

  > div {
    padding: 0 3px;
    height: 43px;
    line-height: 43px;
  }
}
</style>
