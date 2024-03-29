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

      <template v-if="currentTab == 0">
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
                <template v-if="!isMaintain">
                  {{ formatThousandsCurrency(getDiamondTotal, 0) }}
                </template>
                <template v-else>
                  <span :class="$style['maintain-tip-text']">维护中</span>
                  <img
                    @click="showMaintainInfo"
                    :class="$style['maintain-tip-img']"
                    :src="$getCdnPath('/static/image/sg1/live/ic_tips.png')"
                  />
                </template>
              </div>
              <div :class="$style['account-hr']" />
            </div>

            <div :class="$style['account-item']">
              <div :class="$style['account-img']">
                <img
                  :src="$getCdnPath(`/static/image/sg1/live/icon_gold.png`)"
                />
              </div>
              <div :class="$style['account-title']">
                {{ $text("S_MCENTER_WALLET") }}
              </div>
              <div
                :class="$style['account-num']"
                :style="
                  memAmount && memAmount.length > 9
                    ? { 'font-size': '12px' }
                    : {}
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
                <div @click="toggleSerial">
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
                    :src="
                      $getCdnPath(`/static/image/sg1/live/ic_diamond_s.png`)
                    "
                  />
                </div>
                <div :class="$style['num']" :alt="item.diamond_amount">
                  {{ `${formatThousandsCurrency(item.diamond_amount, 0)}钻` }}
                </div>
                <div :class="$style['price']">
                  {{ `${formatThousandsCurrency(item.cash_amount, 0)}元` }}
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
            @click="submit"
          >
            立即兑换
          </div>
        </div>

        <tips :data="diamondRemind" />
        <page-loading :is-show="isLoading" />
        <maintain-block
          v-if="isShowMaintainInfo"
          :content="maintainInfo"
          @close="handleCloseMaintainInfo"
        />

        <!-- 流水檢查 -->
        <serial-number
          v-if="isSerial"
          ref="serialNumber"
          :handle-close="toggleSerial"
        />
      </template>
      <template v-else>
        <recoard />
      </template>
    </div>
  </mobile-container>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { thousandsCurrency } from "@/lib/thousandsCurrency";
import goLangApiRequest from "@/api/goLangApiRequest";
import maintainBlock from "@/router/mobile/components/common/maintainBlock";
import mobileContainer from "../../../../common/mobileContainer";
import recoard from "./recoard.vue";
import tips from "./tips.vue";
import moment from "moment";
import serialNumber from "@/router/mobile/components/tpl/porn1/components/mcenter/components/withdraw/components/serialNumber";

export default {
  components: {
    tips,
    recoard,
    serialNumber,
    maintainBlock,
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      ),
    mobileContainer
  },
  data() {
    return {
      isLoading: true,
      isMaintain: false,
      diamondTotal: "",
      diamondRemind: [],
      exchangeRateList: [],
      currentSelRate: {},
      lockedSubmit: true,
      currentTab: 0,
      updateBalanceTimer: null,
      isShowMaintainInfo: false,
      maintainInfo: {},
      isSerial: false
    };
  },
  watch: {
    liveMaintain(val) {
      if (val && val.start) {
        this.isMaintain = true;
        this.showMaintainInfo();
      } else {
        this.isMaintain = false;
      }
    }
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig",
      membalance: "getMemBalance",
      memInfo: "getMemInfo",
      liveMaintain: "getLiveMaintain"
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
        title: this.$text("S_MY_DIAMOND"),
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
    },
    getDiamondTotal() {
      if (this.diamondTotal) {
        return `${this.diamondTotal}`;
      } else {
        return `0`;
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.updateBalanceTimer);
    this.updateBalanceTimer = null;
  },
  created() {
    if (!this.loginStatus) {
      this.$router.push("/mobile/login");
    }
    this.init();

    if (this.$route.query.tab) {
      this.setCurrentTab(+this.$route.query.tab);
    }
  },
  mounted() {
    this.getBalance();

    if (this.loginStatus) {
      this.updateBalanceTimer = setInterval(() => {
        this.getBalance();
      }, 40000);
    }
  },
  methods: {
    ...mapActions([
      "actionSetGlobalMessage",
      "actionGetExtRedirect",
      "actionSetUserBalance"
    ]),
    toggleSerial() {
      this.isSerial = !this.isSerial;
    },
    showMaintainInfo() {
      this.isShowMaintainInfo = true;

      const start = moment(this.liveMaintain.start * 1000)
        .add(-12, "hours")
        .format("YYYY-MM-DD HH:mm:ss");
      const end = moment(this.liveMaintain.end * 1000)
        .add(-12, "hours")
        .format("YYYY-MM-DD HH:mm:ss");

      this.maintainInfo = [
        {
          title: "-美东时间-",
          startAt: start,
          endAt: end
        },
        {
          title: "-北京时间-",
          startAt: moment(this.liveMaintain.start * 1000).format(
            "YYYY-MM-DD HH:mm:ss"
          ),
          endAt: moment(this.liveMaintain.end * 1000).format(
            "YYYY-MM-DD HH:mm:ss"
          )
        }
      ];
    },
    handleCloseMaintainInfo() {
      this.isShowMaintainInfo = false;
      this.maintainInfo = null;
    },
    init(refresh = true) {
      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/diamond/remind",
        method: "get"
      }).then(data => {
        if (data && data.result && data.result.remind) {
          this.diamondRemind = data.result.remind;
        } else {
          this.diamondRemind = [];
        }
      });

      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/diamond/exchange-rate",
        method: "get"
      }).then(data => {
        this.isLoading = false;

        if (data && data.result && data.result.exchange_rate_list) {
          this.exchangeRateList = data.result.exchange_rate_list;
          refresh ? this.selectedRate(this.exchangeRateList[0]) : "";
        } else {
          this.exchangeRateList = [];
        }

        // Maintenance
        if (data && data.error_text !== "" && data.error_code !== "116020025") {
          this.actionSetGlobalMessage({
            msg: data.error_text
          });
        }
      });
    },
    getBalance() {
      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/user/diamond-total",
        method: "get"
      }).then(data => {
        if (data && data.result && data.result.diamond_total) {
          this.diamondTotal = data.result.diamond_total;
        } else {
          this.diamondTotal = 0;
        }
      });

      this.actionSetUserBalance();
    },
    setCurrentTab(index) {
      if (index === this.currentTab) {
        return;
      }

      if (+this.$route.query.tab !== index) {
        this.$router.replace({ query: { tab: index } });
      }

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
    submitCheck() {
      if (true) {
      }
    },
    submit() {
      if (this.isLoading || this.isMaintain || this.lockedSubmit) {
        return;
      }
      this.lockedSubmit = true;
      this.isLoading = true;

      this.actionGetExtRedirect({
        api_uri: "/api/platform/v1/diamond/buy/user",
        method: "post",
        data: {
          ...this.currentSelRate,
          ref_id: `${Date.now()}${this.memInfo.user.username}`
        }
      }).then(data => {
        setTimeout(() => {
          this.lockedSubmit = false;
        }, 1500);

        if (data && data.error_text) {
          this.actionSetGlobalMessage({
            msg: data.error_text,
            code: data.error_code
          });
        }

        if (data && data.result && data.result.result !== "ok") {
          this.actionSetGlobalMessage({
            msg: data.msg
          });
        }

        if (data && data.result && data.result.result === "success") {
          this.diamondTotal = data.result.diamond_total;

          this.actionSetGlobalMessage({
            msg: "兑换成功"
          });
        }

        this.init();
        this.isLoading = false;
        this.getBalance();
      });
    },
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
    formatThousandsCurrency(value, point) {
      let _value = Number(value).toFixed(point);
      return thousandsCurrency(_value);
    },
    balanceBack() {
      if (!this.isLoading) {
        this.isLoading = true;

        goLangApiRequest({
          method: "put",
          url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Vendor/Recycle/Balance`
        }).then(res => {
          if (res && res.data) {
            this.actionSetGlobalMessage({
              msg: "一键回收完成"
            });

            setTimeout(() => {
              this.isLoading = false;
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
    border: 2px solid #333333;

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
    background: var(--mcenter_button_color1);
    color: var(--mcenter_button_text_color1);
    font-weight: bold;
    border-radius: 22.5px;

    &.disabled {
      background: var(--mcenter_button_color2);
      color: var(--mcenter_button_text_color2);
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
  color: var(--mcenter_slider_text_color);
  opacity: 0.6;
  width: 50%;

  &.is-current {
    color: var(--mcenter_slider_text_active_color);
    opacity: 1;
  }
}

.active-slider {
  position: absolute;
  width: 40px;
  height: 2px;
  bottom: 1.5px;
  transform: translateX(-50%);
  background: var(--mcenter_slider_underline_active_color);
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
      align-items: center;
      color: #e53266;
      display: flex;
      font-family: microsoft jhenghei, microsoft jhenghei-bold;
      font-size: 16px;
      font-weight: 700;
      height: 24px;
      justify-content: center;
      line-height: 24px;
      opacity: 1;
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
    font-weight: bold;

    > div {
      width: 80px;
      height: 30px;
      line-height: 30px;
      background: var(--mcenter_button_color1);
      border-radius: 12.5px;
      color: var(--mcenter_button_text_color1);
    }

    &.serial {
      > div {
        color: var(--mcenter_main_color);
        background: #ededed;
        border: 1px solid var(--mcenter_border_color);
      }
    }

    &:not(:nth-child(1)) {
    }
  }
}

.maintain-tip-text {
  color: #db6372;
  font-family: Microsoft JhengHei, Microsoft JhengHei-Regular;
  font-size: 12px;
  font-weight: 400;
  text-align: center;
}

.maintain-tip-img {
  height: 12px;
  margin-left: 2px;
  width: 12px;
}
</style>
