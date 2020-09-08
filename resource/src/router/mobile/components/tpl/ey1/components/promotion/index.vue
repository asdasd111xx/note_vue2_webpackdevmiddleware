<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" :class="$style['promotion-wrap']">
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
          <!-- <div :class="$style['latest-wrap']">最新</div> -->
          <div :class="$style['text-wrap']">
            <div :class="$style.time">
              <img
                :src="$getCdnPath('/static/image/_new/promotion/icon_time.png')"
              />
              <span v-if="info.end_time"
                >{{ info.start_time }} ~ {{ info.end_time }}</span
              >
              <span v-else>{{ $text("S_NOW_DATE", "即日起") }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </mobile-container>
</template>
<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import ajax from '@/lib/ajax';
import { API_PROMOTION_LIST } from '@/config/api';
import mobileContainer from '../common/mobileContainer';

export default {
  components: {
    mobileContainer,
    Swiper,
    SwiperSlide
  },
  data() {
    return {
      tabId: 0,
      tabList: [],
      promotionList: []
    };
  },
  created() {
    this.getPromotionList(this.tabId);
  },
  computed: {
    headerConfig() {
      return {
        title: this.$text('S_PROMOTIONS', '优惠活动')
      };
    }
  },
  methods: {
    handleClickTab(tab, index) {
      this.getPromotionList(tab.id);
    },
    getPromotionList(id) {
      this.tabId = id;
      ajax({
        method: 'get',
        url: API_PROMOTION_LIST,
        params: { api_uri: '/api/promotion/list', tab_id: id },
        errorAlert: false
      }).then((response) => {
        this.promotionList = response.ret;
        if (this.tabList.length) {
          return;
        }
        this.tabList = response.tab_list

        // 原為全部優惠
        this.tabList[0].name = "全部"
      });
    },
    onClick({ link, name }) {
      let newWindow = '';
      // 辨別裝置是否為ios寰宇瀏覽器
      const isUBMobile = navigator.userAgent.match(/UBiOS/) !== null && navigator.userAgent.match(/iPhone/) !== null;
      // 暫時用來判斷馬甲包
      const webview = window.location.hostname === 'yaboxxxapp02.com';

      // 請勿移除 window.open 裡的空格
      // 修正在 IOS Safari window.open之後，點上一頁之後會轉圈的問題
      // 此解決方法是點上一頁之後會直接關閉window.open的頁面
      if (!isUBMobile && !webview) {
        newWindow = window.open(' ');
      }
      ajax({
        method: 'get',
        url: '/api/v1/c/link/customize',
        params: { code: 'promotion', client_uri: link },
        errorAlert: isUBMobile || webview,
        success: ({
          result, ret, msg, code
        }) => {
          if (result !== 'ok') {
            if (!isUBMobile && !webview) {
              newWindow.close();
            }
            const errorCode = code || '';
            alert(`${msg} ${errorCode}`);
            return;
          }

          if (webview) {
            window.location.href = ret.uri;
            return;
          }

          if (!isUBMobile) {
            newWindow.location.href = ret.uri;
            return;
          }

          window.open(ret.uri);
          window.document.title = '最新优惠';
          //   window.document.title = name;
        },
        fail: (error) => {
          if (!isUBMobile || !webview) {
            newWindow.alert(`${error.data.msg} ${error.data.code ? `(${error.data.code})` : ''}`);
            newWindow.close();
          }
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

@media (orientation: landscape) {
  .type-wrap {
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
  color: $main_text_color2;

  &.active {
    color: $main_text_color4;
    // border-bottom: solid 1px #be9e7f;
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

.latest-wrap {
  position: absolute;
  background: url("/static/image/_new/promotion/pic_latest.png");
  background-position: 50% 50%;
  background-size: cover;
  top: 6px;
  left: -8px;
  width: 47px;
  height: 25px;
  color: $main_white_color1;
  font-size: 12px;
  text-align: center;
  line-height: 20px;
}

.text-wrap {
  padding: 2px 7px;
}

.time {
  line-height: 13px;
  color: $main_text_color4;
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
</style>
