<template>
  <mobile-container :header-config="headerConfig" :has-footer="false">
    <div slot="content" :class="$style['']">
      <div :class="$style['account-wrap']">
        <img :src="$getCdnPath(`/static/image/sg1/live/icon_gold.png`)" />
      </div>

      <!-- 鑽石列表 -->
      <div :class="$style['buy-diamond-wrap']">
        <div :class="$style['price-wrap']">
          <div
            v-for="(item, key) in exchangeRateList"
            :class="[
              $style['price-cell'],
              { [$style['selected']]: item.amount === currentSelRate.amount }
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
                v-if="item.amount === currentSelRate.amount"
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

      <tipsDiamond />
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
      lockedSubmit: true
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig"
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: this.$text("S_BUY_DIAMOND")
      };
    }
  },
  created() {
    this.init();
  },
  mounted() {},
  methods: {
    ...mapActions(["actionSetGlobalMessage", "actionGetExtRedirect"]),
    init() {
      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/user/diamond-total",
        method: "get"
      }).then(data => {
        this.diamondTotal = data.result;
      });

      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/diamond/remind",
        method: "get"
      }).then(data => {
        this.diamondRemind = data.result;
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
    submitCheck() {},
    selectedRate(target) {
      this.currentSelRate = target;
    },
    formatThousandsCurrency(value) {
      return thousandsCurrency(value);
    }
  }
};
</script>
<style lang="scss" module>
@import "~@/css/variable.scss";

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

  // &.selected {
  //   // border: 1px solid #d1b79c;
  //   // background: linear-gradient(-45deg, #d1b79c 10px, rgba(255, 255, 255, 0) 0);

  //   .price {
  //     color: #333333;
  //   }

  //   .num {
  //     color: #e53266;
  //   }

  //   .amount-active {
  //     display: block;
  //     width: 7px;
  //     height: 5px;
  //     position: absolute;
  //     right: 1px;
  //     bottom: 3px;
  //   }
  // }

  .icon {
    width: 100%;
    height: 15px;
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
    color: #ffffff;
    background: linear-gradient(to right, #f9ddbd, #bd9d7d);
    border-radius: 3px;

    &.disabled {
      background: linear-gradient(to right, #e9dacb, #eee5db);
    }
  }
}
</style>
