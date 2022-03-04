<template>
  <div :class="$style['pop-wrap']">
    <div :class="$style['pop-mask']" />
    <div :class="$style['pop-block']">
      <div :class="$style['content']">
        <div :class="$style['title']">全球数字货币交易所</div>
        <div :class="$style['info-content']">
          <div
            v-for="(item, index) in exchangeList"
            :key="index"
            :class="$style['info-item']"
            @click="getWalletOpenLink(item.url)"
          >
            <div :class="$style['text-block']">
              {{ getExchangeName(item.position_key) }}
            </div>
          </div>
        </div>
      </div>

      <div :class="$style['button-block']">
        <span :class="$style[themeTPL]" @click="$emit('close')">知道了</span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import goLangApiRequest from "@/api/goLangApiRequest";
export default {
  data() {
    return {
      exchangeList: []
    };
  },
  props: {
    allWalletOpenLink: {
      type: Array,
      default: []
    }
  },
  created() {
    this.getWalletAllLink();
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
  methods: {
    getWalletAllLink() {
      this.exchangeList = this.allWalletOpenLink.filter(data => {
        return data.wallet_name === "交易所" && data.client_display;
      });
      console.log(this.exchangeList);
    },
    getWalletTipShowType(value) {
      let type = this.allWalletOpenLink.find(data => {
        return data.position_key === value;
      });
      return type.client_display;
    },
    getWalletOpenLink(value) {
      let newWindow;
      newWindow = window.open(value, "_blank");
    },
    getExchangeName(value) {
      switch (value) {
        case "exchange_huobi":
          return "火币";
        case "exchange_binance":
          return "币安";
        case "exchange_58coin":
          return "58COIN";
        default:
          return "";
      }
    }
  }
};
</script>

<style lang="scss" module>
@import "@/css/variable.scss";

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
  border-radius: 8px;
}

.content {
  padding: 17px 13px;
  color: #000000;
  text-align: center;

  .title {
    color: var(--slider_text_color);
    font-size: 18px;
    font-weight: 700;
  }
}

.info-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.info-item {
  width: 45%;
  height: 43px;
  display: inline-flex;
  border: 1px solid #eee;
  margin: 19px 3px 10px 3px;
  align-items: center;

  .icon-block {
    position: relative;
    width: 27px;
    height: 32px;
    margin-left: 3px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.text-block {
  text-align: center;
  width: 100%;
}
.button-block {
  position: relative;
  display: flex;
  height: 50px;
  align-items: center;
  border-top: 1px solid #f7f8fb;

  span {
    flex: 1;
    text-align: center;
    font-size: 18px;
    font-weight: 700;
    color: #6aaaf5;

    &.sg1 {
      color: #000000;
    }
  }
}
</style>
