<template>
  <div :class="['clearfix']">
    <div :class="['swag-banner-wrap']">
      <swiper v-if="options" :options="options">
        <swiper-slide v-for="(info, key) in swagBanner" :key="key">
          <div :class="$style['swag-banner-cell']">
            <img
              :src="$getCdnPath(info.src)"
              :data-info="key"
              @click="$emit('handleLinkToSWAG')"
            />
          </div>
        </swiper-slide>
        <div slot="pagination" class="swiper-pagination" />
      </swiper>
    </div>

    <div :class="$style['swag-balance-wrap']">
      <div :class="$style['swag-balance-item']">
        <img
          :src="
            $getCdnPath('/static/image/porn1/mcenter/swag/ic_wallet_swag.png')
          "
        />
        <div>{{ "SWAG钱包" }}</div>
        <div :class="$style['money']" @click="handleSWAGBalance">
          <template v-if="isMaintainSwag">
            <span :class="$style['maintain-tip-text']">维护中</span>
            <img
              v-if="isMaintainSwag && swagConfig && swagConfig.enable !== 0"
              :class="$style['maintain-tip-img']"
              :src="$getCdnPath('/static/image/porn1/mcenter/swag/ic_tips.png')"
            />
          </template>
          <template v-else>
            {{ swagDiamondBalance }}
          </template>
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
        <div>{{ $text("S_MCENTER_WALLET", "中心钱包") }}</div>
        <div :class="$style['money']">
          {{
            (membalance &&
              membalance.vendor.default &&
              membalance.vendor.default.amount) ||
              "0.00"
          }}
        </div>
      </div>

      <div :class="$style['swag-balance-item']">
        <div :class="[$style['recycle-btn']]" @click="balanceBack()">
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
          v-for="(item, key) in rateList"
          :class="[
            $style['price-cell'],
            { [$style['selected']]: item.amount === currentSelRate.amount }
          ]"
          @click="!item.loading ? selectedRate(item) : {}"
        >
          <template v-if="!item.loading">
            <div :class="$style['price']">{{ `¥ ${item.amount}` }}</div>
            <div :class="$style['num']">
              <img
                :src="
                  $getCdnPath(
                    `/static/image/porn1/mcenter/swag/ic_swag_${
                      item.amount === currentSelRate.amount ? 'h' : 'n'
                    }.png`
                  )
                "
              />
              <div>
                {{ `${item.diamond}` }}
              </div>
            </div>
            <img
              v-if="item.amount === currentSelRate.amount"
              :class="$style['amount-active']"
              src="/static/image/_new/common/select_active.png"
            />
          </template>
          <template v-else>
            <div :class="$style['loading']" />
            <div :class="$style['loading']" />
          </template>
        </div>
      </div>
    </div>

    <div
      v-if="currentSelRate && currentSelRate.amount"
      :class="$style['seleted-tip']"
    >
      {{
        `消费 ¥ ${currentSelRate.amount} 兑换${currentSelRate.diamond}颗SWAG钻石`
      }}
    </div>

    <div :class="[$style['submit-wrap']]">
      <div
        :class="[
          $style['submit-btn'],
          {
            [$style['disabled']]: lockedSubmit || isMaintainSwag
          }
        ]"
        @click="submitCheck"
      >
        立即兑换
      </div>
    </div>
    <tipsDiamond />
    <page-loading :is-show="isLoading" />
    <swag-tips-popup v-if="showTips" />
    <maintain-block
      v-if="maintainInfo"
      :content="maintainInfo"
      @close="handleCloseMaintainInfo"
    />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import mixin from "@/mixins/mcenter/swag/swag";
import tipsDiamond from './tipsDiamond';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import swagTipsPopup from './swagTipsPopup';
import maintainBlock from "@/router/mobile/components/common/maintainBlock";

export default {
  mixins: [mixin],
  components: {
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      ),
    Swiper,
    SwiperSlide,
    tipsDiamond,
    swagTipsPopup,
    maintainBlock
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
    this.initSWAGConfig();
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
    width: 100%;
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
    display: flex;
    justify-content: center;
    align-items: center;
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

  &:not(:nth-child(4n + 1)) {
    margin-left: 6px;
  }

  &.selected {
    border: 1px solid #d1b79c;
    background: linear-gradient(-45deg, #d1b79c 10px, rgba(255, 255, 255, 0) 0);

    .price {
      color: #d1b79c;
    }

    .num {
      color: #36e6d2;
    }

    .amount-active {
      display: block;
      width: 7px;
      height: 5px;
      position: absolute;
      right: 1px;
      bottom: 3px;
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

  .loading {
    margin: 6px 11px;
    background: #eeeeee;
    height: calc(50% - 9px);
  }
}

.seleted-tip {
  font-size: 14px;
  font-family: Microsoft JhengHei, Microsoft JhengHei-Regular;
  font-weight: 400;
  text-align: left;
  color: #d1b79c;
  padding: 12px 17px;
}

.submit-wrap {
  padding: 0 17px;
  .submit-btn {
    text-align: center;
    height: 45px;
    line-height: 45px;
    font-size: 14px;
    color: #ffffff;
    background: linear-gradient(to right, #f9ddbd, #bd9d7d);
    border-radius: 3px;

    &.disabled {
      background: linear-gradient(to right, #e9dacb, #eee5db);
      border-radius: 10px;
    }
  }
}

.maintain-tip-text {
  font-size: 12px;
  font-family: Microsoft JhengHei, Microsoft JhengHei-Regular;
  font-weight: 400;
  text-align: center;
  color: #db6372;
}

.maintain-tip-img {
  width: 12px;
  height: 12px;
}
</style>
