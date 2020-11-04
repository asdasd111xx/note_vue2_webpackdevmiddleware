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
            $getCdnPath('/static/image/porn1/mcenter/swag/ic_wallet_swag.png')
          "
        />
        <div>{{ $text("S_DIAMOND_SWAG", "SWAG钻石") }}</div>
        <div :class="$style['money']">
          {{ swagData.balance }}
        </div>
      </div>

      <div :class="$style['swag-balance-item']">
        <div
          :class="[
            $style['recycle-btn'],
            balanceBackLock ? $style.disable : ''
          ]"
          @click.self="balanceBack()"
        >
          {{ $text("S_ONE_CLICK_TO_ACCOUNT", "一键回收") }}
        </div>
      </div>
    </div>

    <div :class="$style['buy-diamond-wrap']">
      <div :class="$style['title']">
        兑换钻石数量
      </div>

      <div :class="$style['price-wrap']">
        <div
          v-for="(item, key) in swagData.priceList"
          :class="[
            $style['price-cell'],
            { [$style['selected']]: key === currentSeleted.key }
          ]"
          @click="selectPrice(item)"
        >
          <div :class="$style['price']">{{ `¥ ${item.price}` }}</div>
          <div :class="$style['num']">
            <img
              :src="
                $getCdnPath(
                  `/static/image/porn1/mcenter/swag/ic_swag_${
                    key === currentSeleted.key ? 'h' : 'n'
                  }.png`
                )
              "
            />
            <div>
              {{ `${item.num}` }}
            </div>
          </div>
        </div>
      </div>
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
      { src: '/static/image/porn1/mcenter/swag/banner_swag.png' }],

      balanceBackLock: false,
      currentSeleted: {
        key: 0
      },
      swagData: {
        balance: 0,
        priceList: [{ key: 0, price: '188', num: '100' },
        { key: 1, price: '1880', num: '100' },
        { key: 2, price: '1', num: '1' },
        { key: 3, price: '18', num: '10' }]
      }
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
    selectPrice(item) {
      this.currentSeleted.key = item.key;
    }
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
  width: 100%;
  display: flex;
  align-items: center;
  background: #fefffe;
}

.swag-balance-item {
  flex: 1;
  font-size: 12px;
  font-weight: 700;
  color: #414655;
  text-align: center;
  display: inline-block;
  padding: 12px 4px;

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
    display: block;
  }

  .recycle-btn {
    display: block;
    font-size: 16px;
    font-family: Microsoft JhengHei, Microsoft JhengHei-Bold;
    font-weight: 700;
    text-align: left;
    color: #be9e7f;
    text-align: center;
  }
}

.buy-diamond-wrap {
  width: 100%;
  margin-top: 7px;
  background: #ffffff;
  padding: 8px 17px;

  .title {
    font-size: 14px;
    font-family: Microsoft JhengHei, Microsoft JhengHei-Regular;
    font-weight: 400;
    text-align: left;
    color: #222222;
  }
}

.price-wrap {
  position: relative;
  padding: 0;
  margin-top: 3px;
}

.price-cell {
  font-family: Arial, Arial-Regular;
  font-weight: 400;
  text-align: center;
  position: relative;
  display: inline-block;
  height: 40px;
  background: #ffffff;
  border: 1px solid #eeeeee;
  border-radius: 3px;
  width: calc(25% - 6px);

  &:not(:first-child) {
    margin-left: 6px;
  }

  &.selected {
    border: 1px solid #d1b79c;

    .price {
      color: #d1b79c;
    }

    .num {
      color: #36e6d2;
    }
  }

  .price {
    color: #2d1212;
    font-size: 13px;
  }

  .num {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #aaaaaa;
    font-size: 12px;

    > img {
      width: 12px;
      height: 12px;
      vertical-align: bottom;
    }
  }
}
</style>
