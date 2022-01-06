<template>
  <div :class="$style['popup']">
    <div :class="$style['mask']"></div>
    <div :class="$style['container']">
      <div :class="$style['header']">
        <div @click="close" :class="$style['prev']">
          {{ $text("S_CANCEL", "取消") }}
        </div>

        <div :class="$style['title']">
          选择银行
        </div>
      </div>

      <div :class="$style['content']">
        <div
          v-for="(item, index) in bankList"
          :key="index"
          :class="$style['cell']"
          @click="handleClickItem(item)"
        >
          {{ item.account }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    bankList: {
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
      activeIndex: 0
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
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
  height: 312px;
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
    color: var(--addcard_popup_prev_text_color);
  }

  .title {
    width: 100%;
    text-align: center;
  }
}

.content {
  background-color: #f8f8f7;
  margin-top: 10px;

  .cell {
    position: relative;
    background-color: #ffffff;
    color: var(--addcard_popup_text_color);
    height: 50px;
    line-height: 50px;
    font-size: 14px;
    padding-left: 23px;
    margin-bottom: 1px;
  }

  .select-icon {
    position: absolute;
    right: 18px;
    top: 50%;
    width: 15px;
    height: 15px;
    color: var(--addcard_popup_check_color);
    transform: translateY(-50%);
  }
}
</style>
