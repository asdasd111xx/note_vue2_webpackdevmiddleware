<template>
  <div :class="[$style['game-record-wrap']]">
    <div :class="$style['third-wrap']">
      <span
        v-for="(item, index) in childTitle"
        :key="index"
        :class="[$style['card-item']]"
        >{{ item.name }}
        <span :class="$style[`${item.color}`]">{{ item.item }}</span>
      </span>
    </div>
    <div :class="$style['date-title']">{{ timeTitle }}</div>

    <div v-if="cardContent !== undefined && cardContent.length > 0">
      <div
        v-for="(info, index) in cardContent"
        :key="index"
        :class="$style['info-item']"
      >
        <div :class="$style['item-header']">
          <div :class="$style['game-type-name']">
            {{ info.title }}
          </div>

          <div :class="[$style['payoff']]">
            <span>{{ info.childTitle[0] }}</span>

            <span :class="$style[`${info.childTitle[2]}`]">{{
              info.childTitle[1]
            }}</span>
          </div>
        </div>
        <div :class="$style['game-title']">{{ info.gameName }}</div>
        <div :class="$style['item-content']">
          <div v-for="(childItem, index) in info.list" :key="index">
            <div
              v-if="childItem.item != undefined"
              :class="$style['item-detail']"
            >
              <div :class="$style['item-detail-title']">
                {{ childItem.name }}
              </div>
              {{ childItem.item }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import goLangApiRequest from "@/api/goLangApiRequest";
import { getCookie, setCookie } from "@/lib/cookie";
import { mapGetters } from "vuex";

export default {
  props: {
    setHeaderTitle: {
      type: Function,
      default: () => {}
    },
    gameRecordParams: {
      type: Object,
      default: {}
    },
    timeTitle: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      total: [],
      playGameList: [],
      pagination: []
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      return this[`$style_${this.themeTPL}`] || this.$style_porn1;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    childTitle() {
      //子標題內容
      let strArr = [
        {
          name: "投注金额：",
          item: this.amountFormat(this.total.bet ?? "0.00")
        },
        {
          name: "总有效投注：",
          item: this.amountFormat(this.total.valid_bet ?? "0.00")
        },
        {
          name: "总派彩：",
          item: this.amountFormat(this.total.payoff ?? "0.00"),
          color: this.chooseColor(this.total.payoff)
        },
        {
          name: "笔数：",
          item: this.playGameList.length ?? "0"
        }
      ];
      return strArr;
    },
    cardContent() {
      let data = this.playGameList?.map(info => {
        return {
          title: info.vendor_alias,
          childTitle: ["派彩：", info.payoff, this.chooseColor(info.payoff)],
          gameName: info.game_name,
          list: [
            {
              name: "单量",
              item: info.count,
              show: true
            },
            {
              name: "投注金额",
              item: this.amountFormat(info.bet),
              show: true
            },
            {
              name: "有效投注",
              item: this.amountFormat(info.valid_bet),
              show: true
            }
          ].filter(item => item.show)
        };
      });
      return data;
    }
  },

  mounted() {
    this.getGameRecord();
  },
  methods: {
    chooseColor(val) {
      if (this.themeTPL == "ey1") {
        return val < 0 ? "red" : "black";
      } else {
        return val > 0 ? "red" : "black";
      }
    },
    getGameRecord() {
      //取得會員一級好友注單統計資料 C02.96

      let cid = getCookie("cid");
      if (!cid && this.loginStatus) {
        return;
      }

      return goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Stats/Friends/WagerReport/ByDayGame`,
        params: {
          cid: cid,
          lang: "zh-cn",
          ...this.gameRecordParams
        }
      }).then(res => {
        if (res && res.data && res.data.ret && res.data.ret[0]) {
          this.total = res.data.total ?? [];
          this.pagination = res.data.pagination ?? [];
          this.playGameList = res.data.ret ?? [];
        }
      });
    },
    amountFormat(value) {
      //小數點後2位+千分位
      return `${Number(value)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    }
  }
};
</script>

<style
  lang="scss"
  src="./css/porn1.gameReord.scss"
  module="$style_porn1"
></style>
<style lang="scss" src="./css/ey1.gameReord.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.gameReord.scss" module="$style_sg1"></style>
