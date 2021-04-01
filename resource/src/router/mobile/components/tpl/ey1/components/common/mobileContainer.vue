<template>
  <div
    id="mobile-container"
    :class="[
      $style.container,
      {
        [$style['has-header']]: hasHeader && !isApp,
        [$style['has-footer']]: hasFooter && !isHome
      }
    ]"
    :style="resizeOverFlow ? { 'overflow-y': 'auto' } : {}"
  >
    <m-header
      v-if="headerConfig && !isApp"
      :header-config="headerConfig"
      :update-search-status="updateSearchStatus"
      :has-unread-message="hasUnreadMessage"
    />
    <slot name="content" />
    <m-footer
      v-if="hasFooter && !isApp"
      :has-unread-message="hasUnreadMessage"
    />
    <!-- <ele-pop /> -->
    <!-- 會員中心彈窗 -->
    <!-- <div v-if="popType === 'note'" :class="[$style['note-content'], 'theme-porn1']">
            <agent-note v-if="path[1] === 'agcenter'" :position="popData" />
            <note v-else :position="popData" />
        </div> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import { getCookie } from "@/lib/cookie";

export default {
  components: {
    mHeader: () => import(/* webpackChunkName: 'mHeader' */ "./mHeader"),
    mFooter: () => import(/* webpackChunkName: 'mFooter' */ "./mFooter")
    // elePop: () => import(/* webpackChunkName: 'elePop' */'@/router/web/components/tpl/common/pop')
    // note: () => import(/* webpackChunkName: 'note' */'@/components/mcenter/components/common/note'),
    // agentNote: () => import(/* webpackChunkName: 'note' */'@/router/agent/components/common/note')
  },
  data() {
    return {
      hasUnreadMessage: false
    };
  },
  props: {
    headerConfig: {
      type: Object,
      default: null
    },
    isHome: {
      type: Boolean,
      default: false
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
  mounted() {
    if (this.loginStatus && getCookie("cid")) {
      axios({
        method: "get",
        url: "/api/v1/c/player/messages"
      }).then(res => {
        const ret = res.data.ret;
        ret.forEach(i => {
          if (i.read === false) {
            this.hasUnreadMessage = true;
          }
        });
      });
    }
  },
  computed: {
    ...mapGetters({
      popType: "getPopType",
      popData: "getPopData",
      loginStatus: "getLoginStatus"
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
  // min-height: calc(100vh);//行動網頁版會有功能列 可視滿版會有滑動問題
}

.has-header {
  padding-top: 43px;
  background-color: #f8f8f8;
}

.has-footer {
  padding-bottom: 65px;
}
</style>
