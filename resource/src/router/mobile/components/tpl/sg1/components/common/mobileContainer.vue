<template>
  <div
    id="mobile-container"
    :class="[
      $style.container,
      {
        [$style['has-header']]: hasHeader && !isApp,
        [$style['has-footer']]: hasFooter
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
      v-if="hasFooter && !isApp && path[1] !== 'agcenter'"
      :has-unread-message="hasUnreadMessage"
    />
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
import { getCookie } from "@/lib/cookie";
import { mapGetters, mapActions } from "vuex";
import axios from "axios";

export default {
  components: {
    mHeader: () => import(/* webpackChunkName: 'mHeader' */ "./mHeader"),
    mFooter: () => import(/* webpackChunkName: 'mFooter' */ "./mFooter"),
    agentNote: () =>
      import(
        /* webpackChunkName: 'note' */ "@/router/agent/components/common/note"
      )
  },
  data() {
    return {
      hasUnreadMessage: false
    };
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"])
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
  mounted() {
    if (this.loginStatus && getCookie("cid")) {
      axios({
        method: "get",
        url: "/api/v1/c/player/messages"
      })
        .then(res => {
          if (res && res.data) {
            const data = res.data;
            if (data && res.data.ret) {
              const ret = res.data.ret;
              ret.forEach(i => {
                if (i.read === false) {
                  this.hasUnreadMessage = true;
                }
              });
            }

            if (data && data.msg && data.code) {
              this.actionSetGlobalMessage({ msg: data.msg, code: data.code });
            }
          }
        })
        .catch(e => {
          const data = e.response.data;
          if (data && data.msg && data.code) {
            this.actionSetGlobalMessage({ msg: data.msg, code: data.code });
          }
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
        case "discover":
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
</style>
