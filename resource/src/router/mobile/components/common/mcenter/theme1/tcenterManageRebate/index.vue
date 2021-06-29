<template>
  <div :class="$style['wrap']">
    <!-- 最上層功能列 -->
    <div v-if="tabState && isInit" :class="[$style['tab-wrap'], 'clearfix']">
      <div
        v-for="(item, index) in tabItem"
        :key="`tab-${item.key}`"
        :class="[
          $style['tab-item'],
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
    record: () =>
      import(
        /* webpackChunkName: 'recordRebate' */ "./components/recordRebate"
      ),
    real: () =>
      import(/* webpackChunkName: 'realRebate' */ "./components/realRebate"),
    profit: () =>
      import(
        /* webpackChunkName: 'profitRebate' */ "./components/profitRebate"
      ),
    recommendGift: () =>
      import(
        /* webpackChunkName: 'mcenter_pron1_recommendGift' */ "../tcenter/components/recommendGift"
      )
  },
  props: {
    setHeaderTitle: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      tabState: true,
      isInit: false,
      currentLayout: {}
    };
  },
  created() {
    this.actionSetUserdata().then(() => {
      this.isInit = true;
      if (!this.memInfo.user.show_promotion) {
        this.$router.push("/mobile/mcenter");
      }
    });
    this.setHeaderTitle(this.$text("S_TEAM_REBATE", "返利管理"));
    this.currentLayout = { vendor: this.$route.params.title };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      return this[`$style_${this.themeTPL}`] || this.$style_porn1;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    setTabState(state) {
      this.tabState = state;
    },
    tabItem() {
      return [
        {
          key: "record",
          item: "today",
          text: this.$text("S_COMMISSION_RECORD", "返利紀錄"),
          show: true
        },
        {
          key: "real",
          item: "receive",
          text: this.$text("S_COMMISSION_REBATE", "實時返利"),
          show: true
        },
        {
          key: "profit",
          item: "profit",
          text: this.$text("S_LOSS_REBATE", "盈虧返利"),
          show: true
        },
        {
          key: "recommendGift",
          item: "today",
          text: this.$text("S_RECOMMEND_GIFT", "推荐礼金"),
          show: this.memInfo.config.festival
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
          this.currentLayout = { vendor: "record" };
          break;
        case "real":
          this.currentLayout = { vendor: "real" };
          break;
        case "profit":
          this.currentLayout = { vendor: "profit" };
          break;
        case "recommendGift":
          this.currentLayout = { vendor: "recommendGift" };
          break;
      }

      this.$router.replace({
        params: {
          title: `${this.tabItem[tabKey].key}`,
          item: `${this.tabItem[tabKey].item}`
        }
      });
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
