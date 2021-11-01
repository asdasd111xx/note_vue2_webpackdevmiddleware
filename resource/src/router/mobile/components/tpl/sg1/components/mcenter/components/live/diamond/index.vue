<template>
  <mobile-container :header-config="headerConfig" :has-footer="false">
    <div slot="content" :class="$style['']">
      <div :class="$style['account-wrap']">
        <img :src="$getCdnPath(`/static/image/sg1/live/icon_gold.png`)" />
      </div>
      <div :class="$style['buy-diamond-wrap']">
        <div :class="$style['title']">
          兑换钻石数量
        </div>
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
              <div :class="$style['price']">{{ `¥ ${item.amount}` }}</div>
              <div :class="$style['num']">
                <img
                  :src="
                    $getCdnPath(
                      `/static/image/sg1/mcenter/live/ic_diamond_s.png`
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
                :src="$getCdnPath(`/static/image/common/select_active.png`)"
              />
            </template>
            <template v-else>
              <div :class="$style['loading']" />
              <div :class="$style['loading']" />
            </template>
          </div>
        </div>
      </div>

      <page-loading :is-show="isLoading" />
    </div>
  </mobile-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "../../../../common/mobileContainer";
import openGame from "@/lib/open_game";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  components: {
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
      exchangeRateList: {},
      currentSelRate: {}
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
      });
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
</style>
