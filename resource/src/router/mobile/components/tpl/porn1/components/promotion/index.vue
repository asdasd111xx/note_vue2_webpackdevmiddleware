<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" :class="$style['promotion-wrap']">
      <div v-if="loginStatus" :class="$style['promotion-gift-wrap']">
        <div
          :class="[$style['promotion-gift'], $style['right']]"
          @click="onGiftClick(giftList[0])"
        >
          <span>{{ giftList[0].name }}</span>
          <div v-show="hasNewGift" :class="$style['red-dot']" />
        </div>

        <div
          :class="[$style['promotion-gift'], $style['left'], $style[routerTPL]]"
          @click="onGiftClick(giftList[1])"
        >
          <span>{{ giftList[1].name }}</span>
        </div>
      </div>
      <div :class="$style['type-wrap']">
        <swiper
          :options="{
            slidesPerView: 'auto',
            slideToClickedSlide: true,
            centeredSlides: true,
            centeredSlidesBounds: true,
            spaceBetween: 20,
            slidesOffsetBefore: 33,
            slidesOffsetAfter: 30
          }"
        >
          <swiper-slide
            v-for="(tab, index) in tabList"
            :key="tab.id"
            :style="[
              tab.name.includes('(') || tab.name.match(/^[A-Za-z]+$/)
                ? { width: tab.name.length * 10 + 'px' }
                : { width: tab.name.length * 16 + 'px' }
            ]"
            :class="[
              $style['type-btn'],
              {
                [$style.active]: tabId === index || tabId === tab.id
              }
            ]"
          >
            <div @click="getPromotionList(tab.id, index)">
              {{ tab.name }}
            </div>
            <div
              v-if="tabId === index || tabId === tab.id"
              :class="[$style['tab-slider']]"
            />
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
import goLangApiRequest from "@/api/goLangApiRequest";
import popup from "@/router/mobile/components/common/home/popup";
import { sendUmeng } from "@/lib/sendUmeng";
import * as siteConfigTest from "@/config/siteConfig/siteConfigTest";
import store from "@/store";

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
  created() {
    sendUmeng(52);
  },
  mounted() {
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
        if (res && res.data) {
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
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    giftList() {
      return [
        {
          alias: "self_collect_promotion",
          name: "自领优惠"
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
    //
    closePop() {
      this.isShowPop = false;
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
        } else {
          this.tabList = [];
        }
      });
    },
    onGiftClick(target) {
      switch (target.name) {
        case "审核查询":
          sendUmeng(53);
          break;
        case "自领优惠":
          sendUmeng(54);
          break;
        default:
          break;
      }
      let url = "";
      localStorage.setItem("iframe-third-url-title", target.name);
      this.$router.push(
        `/mobile/iframe/promotion?alias=${target.alias}&fullscreen=true`
      );
    },
    onClick(target) {
      if (target) {
        sendUmeng(77, `${target.name}_${target.id}`);
        localStorage.setItem(
          "iframe-third-origin",
          `promotion?tab=${this.tabId}`
        );
        this.$router.push({
          path: "/mobile/iframe/promotion",
          query: {
            promoUri: target.link,
            title: target.name
          }
        });
      }

      //   let newWindow = '';
      //   // 辨別裝置是否為ios寰宇瀏覽器
      //   const isUBMobile = navigator.userAgent.match(/UBiOS/) !== null && navigator.userAgent.match(/iPhone/) !== null;
      //   // 暫時用來判斷馬甲包
      //   const webview = window.location.hostname === 'yaboxxxapp02.com';

      //   // 請勿移除 window.open 裡的空格
      //   // 修正在 IOS Safari window.open之後，點上一頁之後會轉圈的問題
      //   // 此解決方法是點上一頁之後會直接關閉window.open的頁面
      //   if (!isUBMobile && !webview) {
      //     newWindow = window.open(' ');
      //   }
      //   ajax({
      //     method: 'get',
      //     url: '/api/v1/c/link/customize',
      //     params: { code: 'promotion', client_uri: link },
      //     errorAlert: isUBMobile || webview,
      //     success: ({
      //       result, ret, msg, code
      //     }) => {
      //       if (result !== 'ok') {
      //         if (!isUBMobile && !webview) {
      //           newWindow.close();
      //         }
      //         const errorCode = code || '';
      //         alert(`${msg} ${errorCode}`);
      //         return;
      //       }

      //       if (webview) {
      //         window.location.href = ret.uri;
      //         return;
      //       }

      //       if (!isUBMobile) {
      //         newWindow.location.href = ret.uri;
      //         return;
      //       }

      //       window.open(ret.uri);
      //       window.document.title = '最新优惠';
      //       //   window.document.title = name;
      //     },
      //     fail: (error) => {
      //       if (!isUBMobile || !webview) {
      //         newWindow.alert(`${error.data.msg} ${error.data.code ? `(${error.data.code})` : ''}`);
      //         newWindow.close();
      //       }
      //     }
      //   });
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
  background-color: var(--slider_underline_active_color);
  width: 50px;
  transition: left 0.31s;
}

.type-btn {
  position: relative;
  // flex: 1;
  height: 43px;
  line-height: 43px;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  color: var(--slider_text_color);
  &.active {
    color: var(--slider_text_active_color);
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

.promotion-bg {
  position: absolute;
  top: 60px;
  right: 0;
  bottom: 0;
  left: 0;
  border-radius: 10px;
  background-color: #5e5450;
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

.promotion-gift {
  position: absolute;
  top: 11px;
  z-index: 10;
  border-radius: 11px;
  width: 70px;
  height: 21px;
  display: flex;
  align-items: center;
  justify-content: center;
  // color: var(--promotion_gift_button_text_color);
  color: #fff;
  // background: var(--promotion_gift_button);
  background: #9ca3bf;
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
    top: 0;
    border: 1px solid #ffffff;
  }
}
</style>
