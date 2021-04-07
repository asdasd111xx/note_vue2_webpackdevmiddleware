<template>
  <div :class="$style['pop-wrap']">
    <div :class="$style['pop-mask']" />
    <div :class="$style['pop-block']">
      <div :class="$style['content']">
        <div :class="$style['title']">全球数字货币交易所</div>

        <div
          v-for="(item, index) in list"
          :key="index"
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
        <span @click="$emit('close')">知道了</span>
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
      urls: [],
      list: [
        {
          apiParams: "huobi",
          alias: "Huobi Global",
          name: "火币",
          iconSrc: this.$getCdnPath(
            `/static/image/common/mcenter/deposit/ic_huobi.png`
          ),
          onClick: () => {
            // window.open("https://www.huobi.com/zh-cn/register");
            window.open(this.urls[0]);
          }
        }
        // {
        //   alias: "58COIN",
        //   // name: "58COIN",
        //   iconSrc: this.$getCdnPath(
        //     `/static/image/common/mcenter/deposit/ic_58coin.png`
        //   ),
        //   onClick: () => {
        //     // window.open("https://accounts.binance.com/cn/register");
        //     window.open(this.urls[1]);
        //   }
        // }
      ]
    };
  },
  created() {
    this.list.forEach((item, index) => {
      this.getUrl({ urlName: item.apiParams }).then(url => {
        if (!url) return;
        this.urls[index] = url;
      });
    });
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    })
  },
  methods: {
    getUrl({ urlName }) {
      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/External/Url`,
        params: {
          lang: "zh-cn",
          needToken: false,
          urlName
        }
      }).then(res => {
        const { data, status, errorCode } = res;
        if (status !== "000" || errorCode !== "00") {
          return Promise.resolve(false);
        }

        const url = data.uri
          ? data.uri
          : "https://ey.italking.asia:5569/guest.php?gid=eyag";

        return Promise.resolve(url);
      });
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
