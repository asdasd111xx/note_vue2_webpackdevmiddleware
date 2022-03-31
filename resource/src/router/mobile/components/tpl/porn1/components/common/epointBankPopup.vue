<template>
  <div :class="$style['popup']">
    <div :class="$style['mask']"></div>
    <div :class="$style['container']">
      <div :class="$style['header']">
        <div @click="close" :class="[$style['prev'], $style[routerTPL]]">
          {{ $text("S_CANCEL", "取消") }}
        </div>
        <div :class="$style['title']">
          {{ openType === "wthdraw" ? "选择银行" : "挂单银行" }}
        </div>
      </div>

      <!-- 從提現頁進來 -->
      <template v-if="openType === 'withdraw'">
        <div :class="$style['content']" :style="'margin-top:10px'">
          <div
            v-for="(item, index) in bankList"
            :key="index"
            :class="$style['cell']"
            @click="handleClickItemCheck(item)"
          >
            {{ item.account }}
            <img
              v-if="item.account === bankSelected.account"
              :class="$style['select-icon']"
              :src="
                $getCdnPath(
                  `/static/image/${themeTPL}/mcenter/balanceTrans/ic_transfer_sel.png`
                )
              "
              alt="sel"
            />
          </div>
        </div>
      </template>

      <!-- 從充值頁進來 -->
      <template v-if="openType === 'deposit'">
        <div :class="$style['content']">
          <div :class="$style['tab-wrap']">
            <div
              v-if="orderCardList.length > 0"
              :class="[
                $style['tab-item'],
                { [$style['active']]: currentTab === 'orderCardList' }
              ]"
              @click="currentTab = 'orderCardList'"
            >
              挂单银行卡
            </div>
            <div
              v-if="bankList.length > 0"
              :class="[
                $style['tab-item'],
                { [$style['active']]: currentTab === 'bankList' }
              ]"
              @click="currentTab = 'bankList'"
            >
              常用银行卡
            </div>
          </div>

          <!-- 挂单银行卡 -->
          <template v-if="currentTab === 'orderCardList'">
            <div
              v-for="(item, index) in orderCardList"
              :key="index"
              :class="$style['cell']"
              @click="handleClickItemCheck(item)"
            >
              {{ item.account }}
              <img
                v-if="item.account === bankSelected.account"
                :class="$style['select-icon']"
                :src="
                  $getCdnPath(
                    `/static/image/${themeTPL}/mcenter/balanceTrans/ic_transfer_sel.png`
                  )
                "
                alt="sel"
              />
            </div>
          </template>

          <!-- 常用银行卡 -->
          <template v-if="currentTab === 'bankList'">
            <div
              v-for="(item, index) in bankList"
              :key="index"
              :class="$style['cell']"
              @click="handleClickItemCheck(item)"
            >
              {{ item.account }}
              <img
                v-if="item.account === bankSelected.account"
                :class="$style['select-icon']"
                :src="
                  $getCdnPath(
                    `/static/image/${themeTPL}/mcenter/balanceTrans/ic_transfer_sel.png`
                  )
                "
                alt="sel"
              />
            </div>
          </template>
          <!-- 掛單銀行卡已達上限彈窗 -->
          <div v-if="isShowPop" :class="$style['pop-wrap']">
            <div :class="$style['pop-mask']" />
            <div :class="$style['pop-block']">
              <div :class="$style['confirm-content']">
                <div :class="$style['title']">
                  挂单银行卡已达上限
                </div>

                <p>您所保留的挂单银行卡已达上限10笔</p>
                <p>新的银行卡将覆盖最旧的银行卡</p>
              </div>

              <div :class="[$style['button-block']]">
                <span @click="isShowPop = false">
                  {{ $text("S_CANCEL", "取消") }}
                </span>

                <span @click="confirmClick">
                  {{ $text("S_CONFIRM_2", "确定") }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  created() {
    if (!this.bankSelected.is_transfer_account) this.currentTab = "bankList";
  },
  props: {
    bankSelected: {
      type: Object,
      default: () => {}
    },
    bankList: {
      type: Array,
      default: () => []
    },
    orderCardList: {
      type: Array,
      default: () => []
    },
    itemFunc: {
      type: Function,
      default: () => {}
    },
    openType: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      currentTab: "orderCardList",
      isShowPop: false
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    // $style() {
    //   return (
    //     this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1
    //   );
    // },
    itemText() {
      switch (this.type) {
        // 目前針對 提現：CGPay-USDT
        case "withdraw-currency":
          return "currency_alias";
          break;

        default:
          break;
      }
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    handleClickItemCheck(item) {
      if (item.account === "新增挂单银行卡") {
        if (this.orderCardList.length === 11) {
          this.isShowPop = true;
          return;
        }
      }
      this.itemFunc(item);
      this.close();
    },
    confirmClick() {
      this.itemFunc({
        account: "新增挂单银行卡",
        is_transfer_account: true
      });
      this.close();
    }
  }
};
</script>

<style lang="scss" module>
@import "@/css/variable";

.popup {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 99;
}

.mask {
  width: 100%;
  height: 100%;
  background: rgba(#000, 0.5);
}

.wrap {
  background-color: rgba(0, 0, 0, 0.8);
  color: var(--slider_text_color);
  height: 100%;
  margin: 0;
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
  max-width: 420px;
}

.container {
  background-color: #f8f8f7;
  border-radius: 20px 20px 0px 0px;
  bottom: 0;
  overflow: hidden;
  position: absolute;
  width: 100%;
}

.header {
  background-color: #ffffff;
  color: var(--slider_text_color);
  font-size: 17px;
  height: 75px;
  line-height: 75px;

  .prev {
    left: 14px;
    position: absolute;
    text-align: center;
    width: 40px;
    // color: var(--addcard_popup_prev_text_color);
    color: #6aaaf5;
    &.prev {
      color: #000;
    }
  }

  .title {
    width: 100%;
    text-align: center;
  }
}

.content {
  background-color: #f8f8f7;

  .tab-wrap {
    height: 50px;
    width: 100%;
    padding: 10px 18px;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    .tab-item {
      padding: 7px 10px;
      margin: 10px 5px;
      text-align: center;
      background-color: #ffffff;
      border: 1px solid #eee;
      border-radius: 3px;
      &.active {
        border: 1px solid #6dabf2;
      }
    }
  }

  .cell {
    position: relative;
    background-color: #ffffff;
    // color: var(--addcard_popup_text_color);
    color: #414655;
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    padding-left: 23px;
    margin-bottom: 1px;
  }

  .select-icon {
    position: absolute;
    right: 18px;
    top: 33%;
    width: 15px;
    height: 15px;
    // color: var(--addcard_popup_check_color);
    color: #6aaaf5;
    transform: translateY(-50%);

    &.sg1 {
      color: #e53266;
    }
  }
}

// Popup Style
.pop-wrap {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  z-index: 99;
}

.pop-mask {
  width: 100%;
  height: 100%;
  background: #000;
  opacity: 0.5;
}

.pop-block {
  position: absolute;
  width: 75%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fefffe;
  border-radius: 20px;

  .confirm-content {
    padding: 17px 18px;
    color: var(--mcenter_slider_text_color);
    text-align: center;

    .title {
      color: var(--mcenter_slider_text_active_color);
      font-size: 18px;
      font-weight: 700;
      margin-bottom: 10px;
    }
    p {
      margin: 0;
    }
  }
}

.button-block {
  position: relative;
  display: flex;
  height: 50px;
  align-items: center;
  border-top: 1px solid #f7f8fb;
  // color: var(--popup_text_color2);
  color: #6aaaf5;

  &::after {
    content: "";
    position: absolute;
    width: 3px;
    height: 100%;
    left: 50%;
    transform: translateX(-50%);
    background: #f7f8fb;
  }

  span {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 700;

    &:nth-child(2) {
      // color: var(--popup_text_color1);
      color: #6aaaf5;
    }
  }
}
</style>
