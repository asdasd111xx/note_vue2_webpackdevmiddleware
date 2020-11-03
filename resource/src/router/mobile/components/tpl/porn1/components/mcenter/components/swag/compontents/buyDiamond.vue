<template>
  <div :class="['clearfix']">
    <div :class="['swag-banner-wrap']">
      <swiper v-if="options" :options="options">
        <swiper-slide v-for="(info, key) in swagBanner" :key="key">
          <div :class="$style['swag-banner-cell']">
            <img :src="$getCdnPath(info.src)" :data-info="key" />
          </div>
        </swiper-slide>
        <div slot="pagination" class="swiper-pagination" />
      </swiper>
    </div>

    <div :class="$style['swag-balance-wrap']">
      <div :class="$style['swag-balance-item']">
        <img
          :src="
            $getCdnPath(
              '/static/image/porn1/mcenter/balanceTrans/ic_wallet_center.png'
            )
          "
        />
        <div>{{ $text("S_MCENTER_WALLET", "中心钱包") }}</div>
        <div :class="$style['money']">
          {{ membalance.total }}
        </div>
      </div>

      <div :class="$style['swag-balance-item']">
        <img
          :src="
            $getCdnPath(
              '/static/image/porn1/mcenter/balanceTrans/ic_wallet_center.png'
            )
          "
        />
        <div>{{ $text("S_DIAMOND_SWAG", "SWAG钻石") }}</div>
        <div :class="$style['money']">
          {{ membalance.total }}
        </div>
      </div>

      <div :class="$style['swag-balance-item']"></div>
    </div>

    <tipsDiamond />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import mixin from "@/mixins/mcenter/diamond/diamond";
import tipsDiamond from './tipsDiamond';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

export default {
  mixins: [mixin],
  components: {
    Swiper,
    SwiperSlide,
    tipsDiamond
  },
  data() {
    return {
      // banner
      swagBanner: [{ src: '/static/image/porn1/mcenter/swag/banner_swag.png' },
      { src: '/static/image/porn1/mcenter/swag/banner_swag.png' }]
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    options() {
      const hasData = this.swagBanner.length > 1;
      const options = {
        loop: hasData,
        autoplay: { delay: 5000, disableOnInteraction: false },
        pagination: hasData ? { el: '.swiper-pagination', clickable: true } : { el: null }
      };

      return {
        ...options,
        on: {
          click(element) {
          }
        }
      };
    },
  },
  created() {
    // this.getRechargeBalance();
    // this.actionSetRechargeConfig();
  },
  watch: {
  },
  methods: {
  }
};
</script>

<style lang="scss" module>
@import "../css/index.module.scss";

.swag-banner-wrap {
  height: 120px;
}

.swag-banner-cell {
  height: 120px;

  > img {
    height: 100%;
    widows: 100%;
  }
}

.swag-balance-wrap {
}

.swag-balance-item {
  flex: 1;
  font-size: 12px;
  font-weight: 700;
  color: #414655;
  width: 30%;
  text-align: center;
  display: inline-block;
  padding: 0px 4px;
  padding-top: 12px;

  > div {
    display: inline-block;
    padding-top: 3px;
  }

  img {
    width: 13px;
    height: 13px;
    vertical-align: text-bottom;
    display: inline-block;
  }

  .money {
    font-size: 16px;
    font-family: Microsoft JhengHei, Microsoft JhengHei-Bold;
    font-weight: 700;
    text-align: center;
    color: #be9e7f;
  }
}
</style>
