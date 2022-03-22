<template>
  <div :class="$style['popup']">
    <div :class="$style['mask']"></div>
    <div :class="$style['container']">
      <div :class="$style['header']">
        <div @click="close" :class="[$style['prev'], $style[routerTPL]]">
          {{ $text("S_CANCEL", "取消") }}
        </div>

        <div :class="$style['title']">
          挂单银行
        </div>
      </div>

      <div :class="$style['content']">
        <div :class="$style['tab-wrap']">
          <div :class="$style['tab-item']" @click="currentTab = orderBankList">
            挂单银行卡
          </div>
          <div
            v-if="bankList"
            :class="$style['tab-item']"
            @click="currentTab = bankList"
          >
            常用银行卡
          </div>
        </div>
        <div
          v-for="(item, index) in currentTab"
          :key="index"
          :class="$style['cell']"
          @click="handleClickItem(item)"
        >
          {{ item.order ? item.order : item.account }}
          <img
            v-if="item.account === bankSelected"
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
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    bankSelected: {
      type: String,
      default: ""
    },
    bankList: {
      type: Array,
      default: []
    },
    orderBankList: {
      type: Array,
      default: []
    },
    itemFunc: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      activeIndex: 0,
      currentTab: this.orderBankList
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
    handleClickItem(item) {
      this.itemFunc(item);
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
  margin-top: 10px;

  .tab-wrap {
    height: 50px;
    width: 100%;
    background-color: #f5f5f5;
    display: flex;
    align-items: center;
    .tab-item {
      width: 80px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      background-color: #ffffff;
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
</style>
