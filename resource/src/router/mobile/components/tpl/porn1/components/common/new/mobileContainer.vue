<template>
  <div
    :class="[
      $style.container,
      {
        [$style['has-header']]: hasHeader && !isApp,
        [$style['has-footer']]: hasFooter
      }
    ]"
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
import { mapGetters } from 'vuex';
import axios from 'axios'

export default {
  components: {
    mHeader: () => import(/* webpackChunkName: 'mHeader' */ './mHeader'),
    mFooter: () => import(/* webpackChunkName: 'mFooter' */ './mFooter'),
    // elePop: () => import(/* webpackChunkName: 'elePop' */'@/router/web/components/tpl/common/pop')
    // note: () => import(/* webpackChunkName: 'note' */'@/components/mcenter/components/common/note'),
    // agentNote: () => import(/* webpackChunkName: 'note' */'@/router/agent/components/common/note')
  },
  data() {
    return {
      hasUnreadMessage: false
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
      default: () => { }
    },
    isApp: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    if (this.loginStatus) {
      axios({
        method: 'get',
        url: '/api/v1/c/player/messages',
      }).then((res) => {
        const ret = res.data.ret;
        ret.forEach(i => {
          if (i.read === false) {
            this.hasUnreadMessage = true;
          }
        })
      });
    }
  },
  computed: {
    ...mapGetters({
      popType: 'getPopType',
      popData: 'getPopData',
      loginStatus: "getLoginStatus"
    }),
    hasHeader() {
      return this.headerConfig;
    },
    path() {
      return this.$route.path.split('/').filter((path) => path);
    }
  }
};
</script>

<style lang="scss" module>
.container {
  min-width: 320px;
  min-height: calc(100vh);
}

.has-header {
  padding-top: 43px;
}

.has-footer {
  padding-bottom: 45px;
}
</style>
