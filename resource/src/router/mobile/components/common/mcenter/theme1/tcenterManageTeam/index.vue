<template>
  <div class="manage-team">
    <!-- 最上層功能列 -->
    <div v-if="tabState" :class="[$style['tab-wrap'], 'clearfix']">
      <div
        v-for="(item, index) in tabItem"
        :key="`tab-${item.key}`"
        :class="[
          $style['tab-item'],
          $style[routerTPL],
          { [$style['is-current']]: tabCurrent === index }
        ]"
        :style="{ width: `${100 / tabItem.length}%` }"
        @click="changeTab(index)"
      >
        {{ item.text }}
      </div>
    </div>
    <component
      :is="currentLayout.vendor"
      :set-header-title="setHeaderTitle"
      :set-tab-state="setTabState"
      :tab-state="tabState"
      :set-back-func="setBackFunc"
    />
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import { mapGetters, mapActions } from "vuex";
export default {
  components: {
    Swiper,
    SwiperSlide,
    newCommission: () =>
      import(
        /* webpackChunkName: 'recordRebate' */ "../tcenter/components/newCommission/index"
      ),
    firstFriends: () =>
      import(
        /* webpackChunkName: 'firstFriends' */ "../tcenter/components/management/components/firstFriends/index"
      ),

    nextLevelCount: () =>
      import(
        /* webpackChunkName: 'commissionOverview' */ "../tcenter/components/management/components/nextLevelCount/index"
      )
  },
  props: {
    setHeaderTitle: {
      type: Function,
      default: () => {}
    },
    setBackFunc: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      tabState: true,
      isShowRebate: true,
      currentLayout: {},
      path: this.$route.params.title ?? ""
    };
  },
  created() {
    this.actionSetUserdata().then(() => {
      if (!this.memInfo.user.show_promotion) {
        this.$router.push("/mobile/mcenter");
      }
    });
    this.currentLayout = { vendor: this.$route.params.title };
  },
  mounted() {
    this.setHeaderTitle(this.$text("S_TEAM_MANAGEMENT", "团队管理"));
  },
  watch: {
    "$route.params.title": {
      handler: function(item) {
        this.path = item;
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      return this[`$style_${this.themeTPL}`] || this.$style_porn1;
    },
    //routerTPL才能區分51＆澳博
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    tabItem() {
      return [
        {
          key: "newCommission",
          item: "today",
          text: "团队概况",
          show: true
        },
        {
          key: "firstFriends",
          item: "today",
          text: "团队报表",
          show: true
        },
        {
          key: "nextLevelCount",
          item: "today-register",
          text: "下级统计",
          show: true
        }
      ].filter(item => item.show);
    },
    tabCurrent() {
      let tab = this.tabItem.findIndex(item =>
        this.$route.path.includes(item.key)
      );
      return tab === -1 ? 0 : tab;
    }
  },
  methods: {
    ...mapActions(["actionChangePage", "actionSetUserdata"]),
    changeTab(tabKey) {
      switch (this.tabItem[tabKey].key) {
        default:
        case "record":
          this.currentLayout = { vendor: "newCommission" };
          break;
        case "firstFriends":
          this.currentLayout = { vendor: "firstFriends" };
          break;
        case "nextLevelCount":
          this.currentLayout = { vendor: "nextLevelCount" };
          break;
      }

      if (this.path != this.tabItem[tabKey].key) {
        this.$router.replace({
          params: {
            title: `${this.tabItem[tabKey].key}`,
            item: `${this.tabItem[tabKey].item}`
          }
        });
      }
    },
    setTabState(state) {
      this.tabState = state;
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
<style lang="scss" scoped>
.manage-team {
  margin-top: 87px;
}
</style>
