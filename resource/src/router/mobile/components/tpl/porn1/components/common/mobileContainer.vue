<template>
  <div
    id="mobile-container"
    :class="[
      $style.container,
      {
        [$style['has-header']]: hasHeader && !isApp,
        [$style['has-footer']]: hasFooter,
        [$style['has-appTips']]: showApptips
      }
    ]"
    :style="resizeOverFlow ? { 'overflow-y': 'auto' } : {}"
  >
    <appTips :class="[$style['app-tips']]" @toogleAppTips="toogleAppTips" />

    <m-header
      v-if="headerConfig && !isApp"
      :header-config="headerConfig"
      :update-search-status="updateSearchStatus"
      :has-app-tips="showApptips"
    />
    <slot name="content" />
    <m-footer v-if="hasFooter && !isApp && path[1] !== 'agcenter'" />
    <!-- <ele-pop /> -->
    <!-- 會員中心彈窗 -->
    <div
      v-if="popType === 'note' && path[1] === 'agcenter'"
      :class="[$style['note-content'], 'theme-porn1']"
    >
      <agent-note :position="popData" />
      <div :class="$style.mask" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import appTips from "@/router/mobile/components/common/appTips";

export default {
  components: {
    appTips,
    mHeader: () => import(/* webpackChunkName: 'mHeader' */ "./mHeader"),
    mFooter: () => import(/* webpackChunkName: 'mFooter' */ "./mFooter")
    // agentNote: () =>
    //   import(
    //     /* webpackChunkName: 'note' */ "@/router/agent/components/common/note"
    //   )
  },
  data() {
    return {
      UnreadMessageCount: 0,
      showApptips: false
    };
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    toogleAppTips(toogle) {
      this.showApptips = toogle;

      let mobileWrap = document.querySelector("#mobile-wrap"),
        homeTopBg = document.querySelector("#home-top-bg");

      if (toogle) {
        mobileWrap ? (mobileWrap.style = "overflow: hidden") : "";
        homeTopBg ? (homeTopBg.style = "top: 60px") : "";
      } else {
        mobileWrap ? (mobileWrap.style = "") : "";
        homeTopBg ? (homeTopBg.style = "") : "";
      }
    }
  },
  props: {
    headerConfig: {
      type: Object,
      default: null
    },
    hasFooter: {
      type: Boolean,
      default: true
    },
    updateSearchStatus: {
      type: Function,
      default: () => {}
    },
    isApp: {
      type: Boolean,
      default: false
    }
  },
  mounted() {},
  computed: {
    ...mapGetters({
      popType: "getPopType",
      popData: "getPopData",
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig"
    }),
    hasHeader() {
      return this.headerConfig;
    },
    path() {
      return this.$route.path.split("/").filter(path => path);
    },
    resizeOverFlow() {
      switch (this.$route.name) {
        case "home":
        case "mcenter-home":
        case "discover":
        case "gift":
        case "promotion":
        case "service":
          return true;
        default:
          return false;
      }
    }
  }
};
</script>

<style lang="scss" module>
.container {
  min-width: 320px;
  // overflow-y: auto;
  // min-height: calc(100vh); //行動網頁版會有功能列 可視滿版會有滑動問題
}

.has-header {
  padding-top: 43px;
  background-color: #f8f8f8;
}

.has-footer {
  padding-bottom: 65px;
}

.note-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  z-index: 0;
}

.app-tips {
  margin-bottom: 60px;
}

.has-appTips {
  // 60 apptips + 43 header
  padding-top: 103px;
}
</style>
