<template>
  <div v-if="isShowPop" :class="$style['pop-wrap']">
    <div :class="$style['pop-mask']" />
    <div :class="$style['pop-block']">
      <div :class="$style['content']">
        <div :class="$style['title']">全球数字货币交易所</div>

        <div
          v-for="item in list"
          :class="$style['info-item']"
          @click="item.onClick"
        >
          <div :class="$style['icon-block']">
            <img :src="item.iconSrc" :alt="item.alias" />
          </div>

          <div :class="$style['text-block']">
            <div>{{ item.name }}</div>
            <div>{{ item.alias }}</div>
          </div>
        </div>
      </div>

      <div :class="$style['button-block']">
        <span @click="$emit('update:isShowPop', false)">知道了</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isShowPop: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      list: [
        {
          alias: "Huobi Global",
          name: "火币",
          iconSrc: this.$getCdnPath(
            `/static/image/porn1/mcenter/deposit/ic_huobi.png`
          ),
          onClick: () => {
            window.open(
              "https://www.huobi.com/zh-cn/register/?invite_code=hw7j5"
            );
          }
        },
        {
          alias: "Binance",
          name: "币安",
          iconSrc: this.$getCdnPath(
            `/static/image/porn1/mcenter/deposit/ic_binance.png`
          ),
          onClick: () => {
            window.open("https://accounts.binance.com/cn/register");
          }
        }
      ]
    };
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
  background: $main_white_color1;
  border-radius: 8px;
}

.content {
  padding: 17px 13px;
  color: $main_text_color2;
  text-align: center;

  .title {
    color: $main_text_color3;
    font-size: 18px;
    font-weight: 700;
  }
}

.info-item {
  width: 45%;
  height: 43px;
  display: inline-flex;
  text-align: left;
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
    color: #d1b79c;
  }
}
</style>
