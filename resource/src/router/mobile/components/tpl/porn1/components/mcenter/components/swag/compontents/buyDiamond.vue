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
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
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
    this.watchNoticeDate = true;
  },
  methods: {
  }
};
</script>

<style lang="scss" src="../css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/sg1.module.scss" module="$style_sg1"></style>
