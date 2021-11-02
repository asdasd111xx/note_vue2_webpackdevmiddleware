<template>
  <mobile-container :header-config="headerConfig" :has-footer="false">
    <div slot="content" :class="$style['dianmond-wrap']">
      <div :class="[$style['tab-wrap']]">
        <div
          v-for="(item, index) in tabItem"
          :ref="item.key"
          :key="`tab-${item.key}`"
          :class="[
            $style['tab-item'],
            { [$style['is-current']]: currentTab === index }
          ]"
          @click="setCurrentTab(index)"
        >
          {{ item.text }}
        </div>
        <div
          :class="[$style['active-slider'], $style[themeTPL]]"
          :style="{
            left: `calc(25% + 50% * ${currentTab})`
          }"
        />
      </div>

      <div :class="$style['account-wrap']">
        <div>
          <div :class="$style['account-item']">
            <div :class="$style['account-img']">
              <img
                :src="$getCdnPath(`/static/image/sg1/live/ic_diamond_s.png`)"
              />
            </div>
            <div :class="$style['account-title']">
              {{ $text("S_MY_DIAMOND") }}
            </div>
            <div
              :class="$style['account-num']"
              :style="
                diamondTotal && diamondTotal.length > 9
                  ? { 'font-size': '12px' }
                  : {}
              "
            >
              {{ diamondTotal }}
            </div>
            <div :class="$style['account-hr']" />
          </div>

          <div :class="$style['account-item']">
            <div :class="$style['account-img']">
              <img :src="$getCdnPath(`/static/image/sg1/live/icon_gold.png`)" />
            </div>
            <div :class="$style['account-title']">
              {{ $text("S_MCENTER_WALLET") }}
            </div>
            <div
              :class="$style['account-num']"
              :style="
                memAmount && memAmount.length > 9 ? { 'font-size': '12px' } : {}
              "
            >
              {{ memAmount }}
            </div>
            <div :class="$style['account-hr']" />
          </div>

          <div :class="[$style['account-item'], $style['account-btn-wrap']]">
            <div :class="$style['account-btn']">
              <div @click="balanceBack">
                {{ $text("S_ONE_CLICK_TO_ACCOUNT") }}
              </div>
            </div>

            <div :class="$style['account-btn']">
              <div @click="$router.push('/mobile/mcenter/deposit')">
                {{ $text("S_GO_DEPOSIT") }}
              </div>
            </div>

            <div :class="[$style['account-btn'], $style['serial']]">
              <div>
                {{ $text("S_SERIAL_DETIAL") }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 鑽石列表 -->
      <div :class="$style['buy-diamond-wrap']">
        <div :class="$style['price-wrap']">
          <div
            v-for="(item, key) in exchangeRateList"
            :class="[
              $style['price-cell'],
              {
                [$style['selected']]:
                  item.diamond_amount === currentSelRate.diamond_amount
              }
            ]"
            @click="!item.loading ? selectedRate(item) : {}"
            :key="key"
          >
            <template v-if="!item.loading">
              <div :class="$style['icon']">
                <img
                  :src="$getCdnPath(`/static/image/sg1/live/ic_diamond_s.png`)"
                />
              </div>
              <div :class="$style['num']" :alt="item.diamond_amount">
                {{ `${item.diamond_amount}钻` }}
              </div>
              <div :class="$style['price']">
                {{ `${formatThousandsCurrency(item.cash_amount)}元` }}
              </div>
              <!-- <img
                v-if="item.diamond_amount === currentSelRate.diamond_amount"
                :class="$style['amount-active']"
                :src="$getCdnPath(`/static/image/common/select_active.png`)"
              /> -->
            </template>
            <template v-else>
              <div :class="$style['loading']" />
              <div :class="$style['loading']" />
            </template>
          </div>
        </div>
      </div>

      <div :class="[$style['submit-wrap']]">
        <div
          :class="[
            $style['submit-btn'],
            {
              [$style['disabled']]: lockedSubmit
            }
          ]"
          @click="submitCheck"
        >
          立即兑换
        </div>
      </div>

      <tipsDiamond :data="''" />
      <page-loading :is-show="isLoading" />
    </div>
  </mobile-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "../../../../common/mobileContainer";
import openGame from "@/lib/open_game";
import goLangApiRequest from "@/api/goLangApiRequest";
import { thousandsCurrency } from "@/lib/thousandsCurrency";
import tipsDiamond from "./tipsDiamond.vue";
export default {
  components: {
    tipsDiamond,
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      ),
    mobileContainer
  },
  data() {
    return {
      isLoading: true,
      diamondTotal: {},
      diamondRemind: {},
      exchangeRateList: [],
      currentSelRate: {},
      lockedSubmit: true,
      currentTab: 0,
      balanceBackLock: false,
      updateBalanceTimer: null
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig",
      membalance: "getMemBalance"
    }),
    memAmount() {
      return (
        (this.membalance &&
          this.membalance.vendor.default &&
          this.membalance.vendor.default.amount) ||
        "0.00"
      );
    },
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: this.$text("S_BUY_DIAMOND"),
        hasHelp: {
          type: "diamond",
          url: `/mobile/mcenter/help/deposit`
        }
      };
    },
    themeTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    tabItem() {
      return [
        {
          key: "buy",
          text: this.$text("S_EXCHANGE_DIAMOND", "兑换钻石")
        },
        {
          key: "recoard",
          text: this.$text("S_DIAMOND_RECOARD", "钻石记录")
        }
      ];
    }
  },
  beforeDestroy() {
    clearInterval(this.updateBalanceTimer);
    this.updateBalanceTimer = null;
  },
  created() {
    this.init();
  },
  mounted() {
    if (this.loginStatus) {
      this.updateBalanceTimer = setInterval(() => {
        this.actionSetUserBalance();
      }, 40000);
    }
  },
  methods: {
    ...mapActions([
      "actionSetGlobalMessage",
      "actionGetExtRedirect",
      "actionSetUserBalance"
    ]),
    init() {
      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/user/diamond-total",
        method: "get"
      }).then(data => {
        if (data.result && data.result.diamond_total) {
          this.diamondTotal = data.result.diamond_total;
        } else {
          this.diamondTotal = 0;
        }
      });

      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/diamond/remind",
        method: "get"
      }).then(data => {
        if (data.result && data.result.remind) {
          this.diamondRemind = data.result.remind;
        } else {
          this.diamondRemind = "";
        }
      });

      this.actionGetExtRedirect({
        api_uri: " /api/platform/v1/diamond/exchange-rate",
        method: "get"
      }).then(data => {
        this.isLoading = false;
        this.exchangeRateList = data.result;
        this.exchangeRateList = [
          { diamond_amount: 1, cash_amount: 10 },
          { diamond_amount: 10, cash_amount: 1012350 },
          { diamond_amount: 12, cash_amount: 12456 },
          { diamond_amount: 1512341231236, cash_amount: 11231232223 },
          { diamond_amount: 4561, cash_amount: 10111 }
        ];
      });
    },
    setCurrentTab(index) {
      switch (index) {
        default:
        case 0:
          this.currentTemplate = "buy-diamond";
          this.currentTab = index;
          break;

        case 1:
          this.currentTemplate = "recoard-diamond";
          this.currentTab = index;
          break;
      }
    },
    submitCheck() {},
    selectedRate(target) {
      this.currentSelRate = target;
      this.saveCurrentValue();
      this.lockedSubmit = false;
    },
    saveCurrentValue() {
      localStorage.setItem(
        "tmp_d_currentSelRate",
        JSON.stringify(this.currentSelRate)
      );
    },
    formatThousandsCurrency(value) {
      return thousandsCurrency(value);
    },
    balanceBack() {
      if (!this.balanceBackLock) {
        this.balanceBackLock = true;

        goLangApiRequest({
          method: "put",
          url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Vendor/Recycle/Balance`
        }).then(res => {
          if (res && res.data) {
            this.actionSetGlobalMessage({
              msg: "回收成功"
            });

            setTimeout(() => {
              this.balanceBackLock = false;
            }, 1500);
          }

          this.actionSetUserBalance();
        });
      }
    }
  }
};
</script>
<style lang="scss" module>
@import "~@/css/variable.scss";

.dianmond-wrap {
  position: relative;
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
  background: #ffffff;
  border-radius: 3px;
  border: 1px solid #b1b1b1;
  display: inline-block;
  font-family: Arial, Arial-Regular;
  font-weight: 400;
  height: 64px;
  position: relative;
  margin-bottom: 17px;
  text-align: center;
  width: calc(25% - 6px);

  &:not(:nth-child(4n + 1)) {
    margin-left: 6px;
  }

  &.selected {
    border: 1px solid #333333;

    .amount-active {
      display: block;
      width: 7px;
      height: 5px;
      position: absolute;
      right: 1px;
      bottom: 3px;
    }
  }

  .icon {
    width: 100%;
    height: 17px;
    margin: 0 auto;
    background: #ededed;
    border-radius: 3px 3px 0 0;

    > img {
      width: 15px;
      height: 15px;
    }
  }

  .price {
    color: #333333;
    font-size: 12px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .num {
    background: #ededed;
    color: #e53266;
    font-size: 12px;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;

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

.submit-wrap {
  padding: 0 17px;

  .submit-btn {
    text-align: center;
    height: 45px;
    line-height: 45px;
    font-size: 14px;
    background: #333333;
    color: #d2d2d2;
    border-radius: 22.5px;

    &.disabled {
      background: #d2d2d2;
      color: #ededed;
    }
  }
}

.tab-wrap {
  display: flex;
  background: #fff;
  border-bottom: 2px solid #eee;
  position: fixed;
  width: 100%;
  max-width: $mobile_max_width;
  z-index: 10;
  top: 42px;
}

@media (orientation: landscape) {
  .tab-wrap {
    max-width: $mobile_max_landscape_width !important;
  }
}

.tab-item {
  position: relative;
  height: 42px;
  line-height: 42px;
  text-align: center;
  color: #000000;
  opacity: 0.6;
  width: 50%;

  &.is-current {
    color: #000000;
    opacity: 1;
  }
}

.active-slider {
  position: absolute;
  width: 40px;
  height: 2px;
  bottom: 1.5px;
  transform: translateX(-50%);
  background: #000000;
  left: calc(50% - 20px);
  transition: left 0.31s;
  border-radius: 3px;
}

.account-wrap {
  margin-top: 70px;
  margin-bottom: 10px;
  padding: 0 30px;
  height: 140px;

  > div {
    position: relative;
    width: 100%;
    height: 100%;
    opacity: 1;
    background: linear-gradient(179deg, #f4f4f4 0%, #e8e8e8 100%);
    border-radius: 10px;
  }

  .account-item {
    display: inline-block;
    position: relative;
    text-align: center;
    width: 31%;
    height: 100%;
    padding: 30px 0;

    > .account-img {
      width: 100%;
      height: 23px;
      text-align: center;
      > img {
        width: 23px;
        height: 23px;
      }
    }

    > .account-title {
      height: 24px;
      line-height: 24px;
      opacity: 1;
      font-size: 12px;
      font-family: Microsoft JhengHei, Microsoft JhengHei-Bold;
      font-weight: 700;
      color: #000000;
    }

    > .account-num {
      height: 24px;
      line-height: 24px;
      opacity: 1;
      font-size: 16px;
      font-family: Microsoft JhengHei, Microsoft JhengHei-Bold;
      font-weight: 700;
      color: #e53266;
    }
  }

  .account-hr {
    background: #d2d2d2;
    height: 65px;
    opacity: 1;
    position: absolute;
    right: 0;
    top: 37.5px;
    width: 1px;
  }

  .account-btn-wrap {
    padding: 0;
    position: absolute;
    right: 0;
  }

  .account-btn {
    height: 42px;
    text-align: center;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    > div {
      width: 80px;
      height: 30px;
      line-height: 30px;
      background: #000000;
      border-radius: 12.5px;
      color: #ffffff;
    }

    &.serial {
      > div {
        color: #000000;
        background: #ededed;
        border: 1px solid #000000;
      }
    }

    &:not(:nth-child(1)) {
    }
  }
}
</style>
