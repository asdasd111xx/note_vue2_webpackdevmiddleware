<template>
  <div :class="$style['hot-lobby']">
    <div :class="$style['label-wrap-bg']">
      <div :class="$style['label-block']">
        <div
          v-for="(info, index) in eventTagList"
          :key="`nav-${index}`"
          :class="$style['nav-item']"
        >
          <div
            :class="
              currentTab.name === info.name.toString()
                ? $style['is-current']
                : ''
            "
            @click="changeActivityLabel(info.name)"
          >
            {{ info.name }}
          </div>
        </div>
      </div>
    </div>

    <!-- 遊戲列表 -->
    <div :class="$style['game-item-wrap']">
      <template v-for="(item, index) in eventList">
        <activity-item :event-data="item" :key="'image-' + index" />
      </template>
    </div>

    <!-- 無資料 -->
    <template v-if="eventList && eventList.length <= 0">
      <div :class="$style['empty-wrap']">
        <div :class="$style['empty-icon']" />
        <div>{{ $text("S_NO_GAME", "未查询到相关游戏") }}</div>
      </div>
    </template>

    <!-- <template v-if="isShowSearch">
      <game-search :update-search-status="updateSearchStatus" />
    </template> -->
    <page-loading :is-show="isLoading" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import activityItem from "./components/activityItem";
// import gameSearch from "./components/gameSearch";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import goLangApiRequest from "@/api/goLangApiRequest";
export default {
  components: {
    // gameSearch,
    Swiper,
    SwiperSlide,
    activityItem,
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      )
  },
  props: {
    isShowSearch: {
      type: Boolean,
      default: false
    },
    lobbyName: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      isReceive: false,
      isLoading: true,
      eventList: [],
      eventTagList: [
        {
          name: "全部"
        },
        {
          name: "活动中"
        },
        {
          name: "活动预告"
        },
        {
          name: "结果查询"
        }
      ],
      currentTab: ""
    };
  },
  watch: {},
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig"
    }),
    options() {
      return {
        slidesPerView: "auto",
        slideToClickedSlide: true,
        centeredSlides: true,
        centeredSlidesBounds: true,
        spaceBetween: 5
      };
    },
    $style() {
      return (
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1
      );
    }
  },
  created() {
    // 强档活动
    this.$emit("update:lobbyName", "强档活动");
    this.currentTab = this.$route.query.tab
      ? { name: this.$route.query.tab }
      : {
          name: "全部"
        };
  },
  mounted() {
    if (!this.loginStatus) {
      this.$router.push("/mobile/login");
    }
    this.getActivityList();
    // this.getUserViplevel();
    // this.getGameList();
  },
  methods: {
    updateSearchStatus() {
      this.$emit("update:isShowSearch");
    },
    changeActivityLabel(target) {
      this.eventTagList.find(i => {
        if (i.name === target) {
          this.$router.push({ query: { tab: target } });
          this.currentTab = i;
        }
      });
    },
    getActivityList(searchText = "") {
      if (this.isReceive) return;
      this.isReceive = true;

      const vendor = this.$route.params.vendor || "all";

      let params = {
        kind: "", // 分類代碼 1體育, 2視訊, 3電子, 4彩票, 5棋牌, 6麻將
        // game: false, // 遊戲
        // enable: true, // 啟用
        // firstResult: 0,
        // maxResults: 36,
        // eventFirstResult: 0,
        // eventMaxResults: 0,
        lang: "zh-cn"
      };

      return goLangApiRequest({
        method: "post",
        url:
          this.siteConfig.YABO_GOLANG_API_DOMAIN +
          `/xbb/Vendor/${vendor}/Event`,
        params: params
      })
        .then(res => {
          this.isReceive = false;
          console.log(res);
          if (res && res.status === "000") {
            this.eventList = res.data.ret.events;
          }

          if (res && res.status !== "000") {
            this.actionSetGlobalMessage({
              msg: res.msg,
              code: res.code
            });
          }

          this.isLoading = false;
        })
        .catch(error => {
          this.isReceive = false;
          this.actionSetGlobalMessage(error.response.data.msg);
        });
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.index.scss" module="$style_porn1"></style>
