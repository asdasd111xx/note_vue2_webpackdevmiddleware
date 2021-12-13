<template>
  <div :class="$style['popup']">
    <div :class="$style['mask']"></div>
    <div :class="$style['container']">
      <div :class="$style['header']">
        <div @click="close" :class="$style['prev']">
          {{ $text("S_CANCEL", "取消") }}
        </div>

        <div :class="$style['title']">
          {{ headerTitle }}
        </div>
      </div>

      <div :class="$style['content']">
        <div v-if="openType === 'deposit'" :class="$style['total']">
          {{ `总余额(美元)：${currencyData.total_balance}` }}
        </div>
        <div
          v-for="(item, index) in currencyData.currency_list"
          :key="index"
          :class="$style['cell']"
          @click="handleClickItem(item)"
        >
          <div :class="$style['currency']">
            <span>{{ item.currency }}</span
            ><span :class="$style['name']">{{ item.name }}</span>
          </div>
          <div>{{ item.balance }}</div>
        </div>
        <div
          v-if="currencyData.currency_list.length === 0"
          :class="$style['no-coin']"
        >
          币希帐户无余额<span>返回钱包</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    openType: {
      type: String,
      default: ""
    },
    currencyData: {
      type: Object,
      default: {}
    },
    itemFunc: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      activeIndex: 0
    };
  },
  created() {
    console.log(this.currencyData);
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    itemText() {
      switch (this.type) {
        // 目前針對 提現：CGPay-USDT
        case "withdraw-currency":
          return "currency_alias";
          break;

        default:
          break;
      }
    },
    headerTitle() {
      switch (this.openType) {
        case "deposit":
          return "选择充值币种";
        case "withdraw":
          return "选择转出货币";
        default:
          return "";
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
  color: $main_text_color3;
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
  color: $main_text_color3;
  font-size: 17px;
  height: 75px;
  line-height: 75px;

  .prev {
    left: 14px;
    position: absolute;
    text-align: center;
    width: 40px;
    color: #6aaaf5;
  }

  .title {
    width: 100%;
    text-align: center;
  }
}

.content {
  background-color: #f8f8f7;
  margin-top: 10px;

  .total {
    color: #a6a9b2;
    margin-bottom: 5px;
    margin-left: 20px;
    font-size: 12px;
  }
  .cell {
    position: relative;
    background-color: #ffffff;
    color: #414655;
    height: 50px;
    line-height: 50px;
    font-size: 13px;
    margin-bottom: 1px;
    padding: 0 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .currency {
      line-height: 20px;
      display: flex;
      flex-direction: column;
      .name {
        color: #a6a9b2;
      }
    }
  }
  .no-coin {
    background-color: #ffffff;
    padding: 0 20px;
    color: #979797;
    line-height: 50px;

    > span {
      margin-left: 5px;
      color: #6aaaf5;
      border-bottom: 1px solid #6aaaf5;
    }
  }
}
</style>
