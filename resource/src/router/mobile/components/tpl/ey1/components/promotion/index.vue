<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" :class="$style['promotion-wrap']">
      <div v-if="loginStatus" :class="$style['promotion-gift-wrap']">
        <div
          :class="[$style['promotion-gift'], $style['right']]"
          @click="onGiftClick(giftList[0])"
        >
          <img src="/static/image/ey1/promotion/ic-gift.png" />
          <div v-show="hasNewGift" :class="$style['red-dot']" />
        </div>
        <div
          :class="[$style['promotion-gift'], $style['left']]"
          @click="onGiftClick(giftList[1])"
        >
          <img src="/static/image/ey1/promotion/ic_review.png" />
        </div>
      </div>
      <div :class="$style['type-wrap']">
        <swiper :options="{ slidesPerView: 'auto' }">
          <swiper-slide
            v-for="tab in tabList"
            :key="tab.id"
            :class="[$style['type-btn'], { [$style.active]: tab.id === tabId }]"
          >
            <div @click="getPromotionList(tab.id)">{{ tab.name }}</div>
            <div v-if="tab.id === tabId" :class="$style['tab-slider']" />
          </swiper-slide>
        </swiper>
      </div>

      <div
        v-for="info in promotionList"
        :key="info.id"
        :class="$style.promotion"
        @click="onClick(info)"
      >
        <div :class="$style.wrap">
          <div :class="$style['image-wrap']">
            <img v-lazy="info.image" />
          </div>
          <div :class="$style['text-wrap']">
            <div :class="$style.time">
              <img
                :src="
                  $getCdnPath('/static/image/common/promotion/icon_time.png')
                "
              />
              <span v-if="info.end_time"
                >{{ info.start_time }} ~ {{ info.end_time }}</span
              >
              <span v-else>{{ $text("S_NOW_DATE", "即日起") }}</span>
            </div>
          </div>
        </div>
      </div>
      <popup v-if="isShowPop" @close="closePop" />
    </div>
  </mobile-container>
</template>
<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import { mapGetters, mapActions } from "vuex";
import ajax from "@/lib/ajax";
import { API_PROMOTION_LIST } from "@/config/api";
import mobileContainer from "../common/mobileContainer";
import axios from "axios";
import popup from "@/router/mobile/components/common/home/popup";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  components: {
    mobileContainer,
    Swiper,
    SwiperSlide,
    popup
  },
  data() {
    return {
      tabId: 0,
      tabList: [],
      promotionList: [],
      hasNewGift: false,
      isShowPop: false
    };
  },
  mounted() {
    this.tabId = (this.$route.query && this.$route.query.tab) || 0;
    this.getPromotionList(this.tabId);

    if (localStorage.getItem("do-not-show-home-post") !== "true") {
      this.actionSetPost("2").then(() => {
        if (this.post && this.post.list && this.post.list.length > 0) {
          this.isShowPop = true;
        }
      });
    }

    if (this.loginStatus) {
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Promotion/User/Collect/Count`
      }).then(res => {
        if (res.data && res.status === "000") {
          this.hasNewGift = res.data.count > 0;
        }
      });
    }
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig",
      post: "getPost"
    }),
    giftList() {
      return [
        {
          alias: "self_collect_promotion",
          name: "领取优惠"
        },
        {
          alias: "verify_promotion",
          name: "审核查询"
        }
      ];
    },
    headerConfig() {
      return {
        title: this.$text("S_PROMOTIONS", "优惠活动")
      };
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage", "actionSetPost"]),
    closePop() {
      this.isShowPop = false;
    },
    handleClickTab(tab, index) {
      this.getPromotionList(tab.id);
    },
    getPromotionList(id) {
      this.tabId = +id;
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Promotion/List`,
        params: {
          tabId: id
        }
      }).then(res => {
        if (res && res.data) {
          this.promotionList = res.data.ret;
          if (this.tabList.length) {
            return;
          }
          this.tabList = res.data.tab_list;
          this.tabList[0].name = "全部";
        } else {
          this.tabList = [];
        }
      });
    },
    onGiftClick(target) {
      let url = "";
      localStorage.setItem("iframe-third-url-title", target.name);
      this.$router.push(
        `/mobile/iframe/promotion?alias=${target.alias}&fullscreen=${
          target.alias === "self_collect_promotion" ? "false" : "true"
        }`
      );
    },
    onClick(target) {
      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/Customize`,
        params: {
          code: "promotion",
          clientUri: target.link
        }
      }).then(res => {
        if (res && res.data && res.data.uri) {
          localStorage.setItem("iframe-third-url", res.data.uri);
          localStorage.setItem("iframe-third-url-title", target.name);
          localStorage.setItem(
            "iframe-third-origin",
            `promotion?tab=${this.tabId}`
          );
          this.$router.push(`/mobile/iframe/promotion`);
        }
      });
    }
  }
};
</script>
<style lang="scss" module>
@import "~@/css/variable.scss";
$fixed_spacing_height: 43px;

.promotion-wrap {
  background: #fefffe;
  padding: $fixed_spacing_height 0 10px;
  min-height: calc(100vh - 105px);
}

.type-wrap {
  width: 100%;
  max-width: $mobile_max_width;
  height: $fixed_spacing_height;
  position: fixed;
  top: $fixed_spacing_height;
  background-color: #fefffe;
  border-bottom: 1px solid #eee;
  z-index: 1;
}

.promotion-gift-wrap {
  width: 100%;
  max-width: $mobile_max_width;
  height: 43px;
  position: fixed;
  top: 0;
  z-index: 10;
}

@media (orientation: landscape) {
  .type-wrap,
  .promotion-gift-wrap {
    max-width: $mobile_max_landscape_width !important;
  }
}

.tab-slider {
  position: absolute;
  bottom: 1.5px;
  left: calc(50% - 25px);
  height: 2px;
  background-color: #e42a30;
  width: 50px;
  transition: left 0.31s;
}

.type-btn {
  position: relative;
  flex: 1;
  height: 43px;
  line-height: 43px;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  color: #ffffff;
  &.active {
    color: #5e626d;
  }
}

.promotion {
  position: relative;
  padding: 0 14px;
  margin: 7px 0;
}
.wrap {
  position: relative;
  width: 95%;
  margin: 0 auto;
}
.image-wrap {
  > img {
    display: block;
    width: 100%;
    border-radius: 10px;
  }
}

.text-wrap {
  padding: 2px 7px;
}

.time {
  line-height: 13px;
  color: var(--slider_text_active_color);
  font-size: 10px;

  > img {
    widows: 11px;
    height: 11px;
  }
}

.promotion-gift {
  position: absolute;
  top: 0;
  z-index: 10;
  width: 24px;
  height: 43px;
  display: flex;
  align-items: center;

  > img {
    width: 24px;
    height: 24px;
  }

  &.right {
    right: 14px;
  }

  &.left {
    left: 14px;
  }

  > .red-dot {
    position: absolute;
    right: -4px;
    background: red;
    border-radius: 50%;
    width: 9px;
    height: 9px;
    top: 7px;
    border: 1px solid #ffffff;
  }
}

@media screen and (min-width: $phone) {
  .type-btn {
    font-size: 16px;
  }

  .time {
    font-size: 13px;
  }
}

@media screen and (min-width: $pad) {
  .type-btn {
    font-size: 18px;
  }

  .time {
    font-size: 15px;
  }
}
</style>
