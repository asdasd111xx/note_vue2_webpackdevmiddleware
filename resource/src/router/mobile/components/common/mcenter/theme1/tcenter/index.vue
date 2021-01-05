<template>
  <div>
    <div v-if="tabState" :class="[$style['tab-wrap'], 'clearfix']">
      <div
        v-for="(item, index) in tabItem"
        :key="`tab-${item.key}`"
        :class="[
          $style['tab-item'],
          { [$style['is-current']]: tabCurrent === index }
        ]"
        :style="{ width: `${100 / tabItem.length}%` }"
        @click="setTabCurrent(index)"
      >
        {{ item.text }}
      </div>
    </div>
    <component
      :is="func"
      :set-tab-state="setTabState"
      :set-header-title="setHeaderTitle"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    gameRecord: () =>
      import(
        /* webpackChunkName: 'mcenter_pron1_gameRecord' */ "./components/gameRecord/"
      ),
    management: () =>
      import(
        /* webpackChunkName: 'mcenter_pron1_management' */ "./components/management/"
      ),
    commission: () =>
      import(
        /* webpackChunkName: 'mcenter_pron1_commission' */ "./components/commission"
      ),
    recommendGift: () =>
      import(
        /* webpackChunkName: 'mcenter_pron1_recommendGift' */ "./components/recommendGift"
      )
  },
  props: {
    func: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tabState: true,
      headerConfig: {
        title: this.$text("S_TEAM_CENTER", "我的推广"),
        prev: true,
        onClick: () => {
          if (
            this.func === "management" &&
            this.$route.params.page === "member" &&
            this.$route.params.date
          ) {
            this.$router.push("/mobile/mcenter/tcenter/management/member");
            return;
          }

          if (
            (this.func === "gameRecord" && this.$route.params.page === "bet") ||
            (this.func === "commission" && this.$route.params.page === "detail")
          ) {
            this.$router.back();
            return;
          }

          this.$router.push("/mobile/mcenter");
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    tabItem() {
      return [
        {
          key: "management",
          text: this.$text("S_TEAM_MANAGEMENT", "团队管理"),
          show: true
        },
        {
          key: "gameRecord",
          text: this.$text("S_GAME_RECORD", "游戏记录"),
          show: true
        },
        {
          key: "commission",
          text: this.$text("S_MY_COMMISSION", "我的返利"),
          show: true
        },
        {
          key: "recommendGift",
          text: this.$text("S_RECOMMEND_GIFT", "推荐礼金"),
          show: true
        }
      ].filter(item => item.show);
    },
    tabCurrent() {
      return this.tabItem.findIndex(item =>
        this.$route.path.includes(item.key)
      );
    }
  },
  methods: {
    ...mapActions(["actionChangePage"]),
    setTabCurrent(tabKey) {
      // 點擊類別 & 再次點擊，來預設path以render畫面
      switch (this.tabItem[tabKey].key) {
        // 團隊管理
        case "management":
          this.$router.replace(`/mobile/mcenter/tcenter/management/member`);
          break;

        // 遊戲記錄
        case "gameRecord":
          this.$router.replace("/mobile/mcenter/tcenter/gameRecord/main");
          break;

        // 我的返利
        case "commission":
          this.$router.replace("/mobile/mcenter/tcenter/commission/summary");
          break;

        // 推薦禮金
        case "recommendGift":
          this.$router.replace(`/mobile/mcenter/tcenter/recommendGift`);
          break;
      }
    },
    setTabState(state) {
      this.tabState = state;
    },
    setHeaderTitle(value) {
      this.$set(this.headerConfig, "title", value);
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
