<template>
  <div :class="$style['activity-wrap']">
    <div :class="$style['label-wrap-bg']">
      <div :class="$style['label-block']">
        <div
          v-for="(info, index) in eventTagList"
          :key="`nav-${index}`"
          :class="$style['nav-item']"
        >
          <div
            :class="[
              +currentLabel === +info.key ? $style['is-current'] : '',
              $style[siteConfig.MOBILE_WEB_TPL]
            ]"
            @click="changeActivityLabel(info.key)"
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
        <div>{{ $text("S_NO_ACTIVITY", "暂无活动") }}</div>
      </div>
    </template>
    <envelope
      v-if="needShowRedEnvelope"
      @closeEvelope="closeEvelope"
      :redEnvelopeData="redEnvelopeData"
    />
    <page-loading :is-show="isLoading" />
  </div>
</template>

<script>
import activityItem from "./components/activityItem";
import goLangApiRequest from "@/api/goLangApiRequest";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    activityItem,
    envelope: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/home/redEnvelope"
      ),
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      )
  },
  props: {
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
      originEventList: [],
      eventTagList: [
        {
          name: "全部",
          key: 0
        },
        {
          name: "活动中",
          key: 3
        },
        {
          name: "活动预告",
          key: 2
        },
        {
          name: "结果查询",
          key: 4
        }
      ],
      currentLabel: 0,
      needShowRedEnvelope: false,
      redEnvelopeData: {}
    };
  },
  watch: {
    showRedEnvelope() {
      this.needShowRedEnvelope = true;
      this.redEnvelopeData = this.showRedEnvelope;
    }
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig",
      showRedEnvelope: "getShowRedEnvelope"
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
    let title = localStorage.getItem("iframe-third-url-title") || "强档活动";
    this.$emit("update:lobbyName", title);
  },
  mounted() {
    // if (!this.loginStatus) {
    //   this.$router.push("/mobile/login");
    // }
    this.getActivityList();
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    closeEvelope() {
      this.needShowRedEnvelope = false;
      this.actionSetGlobalMessage({
        msg: "红包派发中，到帐后即可畅玩游戏"
      });
    },
    changeActivityLabel(target) {
      if (+target === +this.currentLabel) {
        return;
      }

      this.eventTagList.find(i => {
        if (+i.key === +target) {
          this.currentLabel = target;

          if (+this.$route.query.label !== +target) {
            this.$router.replace({ query: { label: target } });
          }

          if (+target === 0) {
            this.eventList = this.originEventList;
            return;
          }

          this.eventList = this.originEventList.filter(
            i => +i.status === +target
          );
        }
      });
    },
    getActivityList() {
      if (this.isReceive) return;
      this.isReceive = true;

      const vendor = this.$route.params.vendor || "all";
      const kind = this.$route.query.kind || "";
      let params = {
        kind: kind, // 分類代碼 1體育, 2視訊, 3電子, 4彩票, 5棋牌, 6麻將
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
          if (res && res.status === "000") {
            // 1.尚未開始 2.活動預告 3.活動中 4.結果查詢 5.已結束
            // 1,5 不顯示
            if (res.data.ret.events && res.data.ret.events.length > 0) {
              let list = res.data.ret.events;
              this.originEventList = list;
              this.eventList = list.filter(
                i => +i.status !== 1 && +i.status !== 5
              );
            }
          }

          if (res && res.status !== "000") {
            this.actionSetGlobalMessage({
              msg: res.msg,
              code: res.code
            });
          }

          this.changeActivityLabel(this.$route.query.label);
          this.isLoading = false;
        })
        .catch(error => {
          this.isReceive = false;
          if (error && error.data.msg) {
            this.actionSetGlobalMessage(error.data.msg);
          }
        });
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.index.scss" module="$style_porn1"></style>
