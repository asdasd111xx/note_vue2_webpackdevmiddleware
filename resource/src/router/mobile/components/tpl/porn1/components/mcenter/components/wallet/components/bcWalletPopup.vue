<template>
  <div :class="$style['popup']">
    <div :class="$style['container']">
      <div :class="$style['header']">
        <div @click="close" :class="$style['prev']">
          <img :src="$getCdnPath(`/static/image/common/btn_back_black.png`)" />
        </div>

        <div :class="$style['title']">
          币希钱包
        </div>
      </div>

      <div :class="$style['content']">
        <div :class="$style['content-title']">
          钱包总余额
          <img
            :class="$style['update-img']"
            :src="$getCdnPath(`/static/image/common/btn_update.png`)"
            alt="update"
          />
        </div>
        <div :class="$style['cell']">
          <div :class="$style['currency']">
            <span>USD</span><span :class="$style['name']">美元</span>
          </div>
          <div>{{ currencyData.total_balance }}</div>
        </div>
        <div :class="$style['content-tip']">
          各资产换算美元后加总，实际金额请至币希查看
        </div>
        <div :class="$style['content-title']">各资产余额</div>
        <div
          v-for="(item, index) in currencyHasMoney"
          :key="index"
          :class="$style['cell']"
        >
          <div :class="$style['currency']">
            <span>{{ item.currency }}</span
            ><span :class="$style['name']">{{ item.name }}</span>
          </div>
          <div>{{ item.balance }}</div>
        </div>
        <div :class="$style['more']" @click="showAll">
          点击查看全部余额
          <i :class="[$style.expand, { [$style.collapse]: isShowAll }]" />
        </div>
        <div v-if="isShowAll">
          <div
            v-for="(item, index) in currencyNoMoney"
            :key="index"
            :class="$style['cell']"
          >
            <div :class="$style['currency']">
              <span>{{ item.currency }}</span
              ><span :class="$style['name']">{{ item.name }}</span>
            </div>
            <div>{{ item.balance }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    currencyData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      activeIndex: 0,
      isShowAll: false
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
    },
    currencyHasMoney() {
      let newArr = [];
      if (this.currencyData.currency_list.length > 0) {
        newArr = this.currencyData.currency_list.filter(coin => {
          return +coin.balance > 0;
        });
        console.log(newArr);
      }
      return newArr;
    },
    currencyNoMoney() {
      let newArr = [];
      if (this.currencyData.currency_list.length > 0) {
        newArr = this.currencyData.currency_list.filter(coin => {
          return +coin.balance === 0;
        });
        console.log(newArr);
      }
      return newArr;
    }
  },
  methods: {
    close() {
      this.$emit("close");
    },
    handleClickItem(item) {
      this.close();
    },
    showAll() {
      this.isShowAll = !this.isShowAll;
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

.container {
  background-color: #f8f8f7;
  border-radius: 20px 20px 0px 0px;
  bottom: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.header {
  margin: 0 auto;
  position: fixed;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 43px;
  padding: 0 15px;
  background: #fefffe;
  text-align: center;
  border-bottom: 1px solid #eee;

  .prev {
    bottom: 0;
    height: 20px;
    left: 12px;
    margin: auto;
    top: 0;
    width: 20px;
    position: absolute;
    z-index: 2;
    > img {
      width: 20px;
      height: 20px;
    }
  }

  .title {
    height: 43px;
    line-height: 43px;
    color: #000000;
    font-size: 17px;
    font-weight: 500;
    margin: 0 auto;
  }
}

.content {
  position: relative;
  top: 43px;
  background-color: #f8f8f7;
  margin-top: 10px;

  .content-title {
    margin-bottom: 10px;
    margin-left: 20px;
    color: #414655;
    font-size: 18px;
    font-weight: 500;
  }
  .content-tip {
    margin-top: 5px;
    margin-left: 20px;
    margin-bottom: 10px;
    color: #a6a9b2;
    font-size: 13px;
  }
  .cell {
    position: relative;
    background-color: #ffffff;
    color: #414655;
    height: 50px;
    line-height: 50px;
    font-size: 15px;
    margin-bottom: 1px;
    padding: 0 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-weight: 500;

    .currency {
      line-height: 20px;
      display: flex;
      flex-direction: column;
      .name {
        font-size: 13px;
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

  .more {
    float: right;
    color: #a6a9b2;
    padding-right: 5px;
    background-color: #ffffff;
    width: 100%;
    text-align: right;
    padding-top: 10px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
}

.update-img {
  width: 24px;
  height: 24px;
  vertical-align: middle;
}

.expand {
  content: "";
  margin-left: 10px;
  right: 20px;
  width: 15px;
  height: 15px;
  background: url("/static/image/common/mcenter/wallet/ic_wallter_details_expand.png")
    center center / 100% 100%;

  &.collapse {
    background: url("/static/image/common/mcenter/wallet/ic_wallter_details_collapse.png")
      center center / 100% 100%;
  }
}
</style>
