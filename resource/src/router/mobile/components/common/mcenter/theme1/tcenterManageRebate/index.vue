<template>
  <div
    class="manage-rebate"
    :style="{
      marginTop: path == 'profit' && $route.query.depth ? '0px' : '87px'
    }"
  >
    <!-- 最上層功能列 -->
    <div v-if="tabState" :class="[$style['tab-wrap'], 'clearfix']">
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
      :tab-state="tabState"
      :set-back-func="setBackFunc"
    />
  </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import { mapGetters, mapActions } from "vuex";
import goLangApiRequest from "@/api/goLangApiRequest";
import axios from "axios";
export default {
  components: {
    Swiper,
    SwiperSlide,
    record: () =>
      import(
        /* webpackChunkName: 'recordRebate' */ "../tcenter/components/commission/"
      ),
    real: () =>
      import(
        /* webpackChunkName: 'realRebate' */ "../tcenter/components/commission/components/commissionRebates/index"
      ),

    profit: () =>
      import(
        /* webpackChunkName: 'commissionOverview' */ "../tcenter/components/commission/components/commissionOverview/index"
      ),
    recommendGift: () =>
      import(
        /* webpackChunkName: 'mcenter_pron1_recommendGift' */ "../tcenter/components/recommendGift"
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
      isShowThirdRebate: true,
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
    this.setHeaderTitle(this.$text("S_TEAM_REBATE", "返利管理"));
  },
  watch: {
    "$route.params.title": {
      handler: function(item) {
        this.path = item;
        this.switchComponent(item);
        this.getRebateSwitch();
        this.getDomainConfig();
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
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
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
          show: this.isShowRebate
        },
        {
          key: "profit",
          item: "profit",
          text: this.$text("S_LOSS_REBATE", "盈虧返利"),
          show: this.isShowThirdRebate
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
      if (this.path != this.tabItem[tabKey].key) {
        this.$router.replace({
          params: {
            title: `${this.tabItem[tabKey].key}`,
            item: `${this.tabItem[tabKey].item}`
          }
        });
      }
    },
    switchComponent(value) {
      this.tabState = true;
      switch (value) {
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
    },
    setTabState(state) {
      this.tabState = state;
    },
    getRebateSwitch() {
      this.isReceive = false;

      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Wage/SelfDispatchInfo`,
        params: { lang: "zh-cn" }
      }).then(response => {
        this.isReceive = true;

        if (response.status === "000") {
          //判斷實時返利開關
          this.isShowRebate = response.data.ret.show_real_time;
          return;
        }
      });
    },
    getDomainConfig() {
      return axios({
        method: "get",
        url: "/api/v2/c/domain-config"
      })
        .then(res => {
          if (res && res.data && res.data.ret) {
            const wage = res.data.ret.wage;

            //判斷第三方返利開關
            this.isShowThirdRebate = wage.some(
              item => item.code === "commission"
            );
          }
        })
        .catch(res => {
          this.actionSetGlobalMessage({
            msg: res.response.data.msg,
            code: res.response.data.code,
            origin: "home"
          });
        });
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
<style lang="scss" scoped>
.manage-rebate {
  margin-top: 87px;
}
</style>
