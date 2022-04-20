<template>
  <div
    v-if="detailList"
    :class="[$style['detail-list-wrap'], { [$style['no-padding']]: isEmbed }]"
  >
    <div v-for="(info, date) in detailList" :key="date">
      <div :class="$style['detail-date']">{{ date }}</div>
      <div
        v-for="item in info"
        :key="item.id"
        :class="[$style['detail-wrap'], 'clearfix']"
        @click="onClick(item)"
      >
        <div :class="$style['detail-icon']">
          <img
            :src="
              $getCdnPath(
                `/static/image/${
                  routerTPL === 'sg1' ? 'sg1' : 'common'
                }/mcenter/moneyDetail/icon_${getCategory(item)}.png`
              )
            "
          />
        </div>
        <div :class="[$style['detail-info'], 'clearfix']">
          <div :class="$style.wrap">
            <div class="title-wrap">
              <span :class="$style.title">{{ getCategoryName(item) }}</span>
              <span :class="$style.tips">{{ opcodeList[item.opcode] }}</span>
            </div>
            <div :class="$style.time">
              {{ item.created_at | timeFormat }}
            </div>
          </div>
          <div :class="$style.amount">
            {{ formatThousandsCurrency(item.amount) }}
            <img
              :class="$style['right-arrow']"
              :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else :class="$style['no-data-wrap']">
    <img
      :src="$getCdnPath(`/static/image/${themeTPL}/mcenter/${emptyImage}.png`)"
    />
    <div :class="$style.tips">{{ noDataText }}</div>
    <div
      v-if="currentCategory.key === 'deposit'"
      :class="[$style['btn-deposit']]"
      @click="onDeposit"
    >
      立即充值
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { thousandsCurrency } from "@/lib/thousandsCurrency";
import { sendUmeng } from "@/lib/sendUmeng";

export default {
  data() {
    return {
      noDataText:
        this.pageType === "ingroup_transfer"
          ? "暂时没有新的转让记录"
          : "暂时没有新的充值记录",
      emptyImage: "no_data"
    };
  },
  filters: {
    timeFormat(date) {
      return Vue.moment(date)
        .utcOffset(-4)
        .format("HH:mm:ss");
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    isEmbedDetail() {
      // 共用紀錄
      return ["ingroup_transfer", "internal_memo", "paopao"].includes(
        this.pageType
      );
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    isEmbed() {
      return this.$route.name === "mcenter-creditTrans";
    }
  },
  props: {
    currentCategory: {
      type: Object,
      required: true
    },
    opcodeList: {
      type: Object,
      required: true
    },
    detailList: {
      type: Object,
      default: null
    },
    detailInfo: {
      type: Object,
      default: null
    },
    pageType: {
      default: ""
    },
    categoryList: {
      type: Array,
      default: []
    }
  },
  watch: {
    currentCategory() {
      if (this.currentCategory.key === "internal_memo") {
        // this.emptyImage = "img_default_no_data";
        this.noDataText = `暂时没有新的签到彩金`;
      } else {
        if (this.currentCategory.key === "outer") {
          this.noDataText = `暂时没有新的购买记录`;
        } else {
          this.noDataText = `暂时没有新的${this.currentCategory.text}记录`;
        }
        this.emptyImage = "no_data";
      }
    }
  },
  created() {
    //紅包彩金頁面無資料底圖為特例
    if (
      this.currentCategory.key === "internal_memo" &&
      window.location.pathname.indexOf("redJackpot") != -1
    ) {
      this.emptyImage = "img_default_no_data";
      this.noDataText = `暂时没有新的签到彩金`;
    } else {
      if (this.currentCategory.key === "outer") {
        this.noDataText = `暂时没有新的购买记录`;
      } else {
        this.noDataText = `暂时没有新的${this.currentCategory.text}记录`;
      }
      this.emptyImage = "no_data";
    }
  },
  methods: {
    getCategoryName(item) {
      let name = this.currentCategory.text;
      let itemCategory = item.category[0];

      if (!this.currentCategory.key) {
        // 返水,活動歸類在優惠
        if (["activity", "rebate"].includes(item.category[0])) {
          itemCategory = "rebate";
        }

        if (this.categoryList && this.categoryList.length) {
          const target = this.categoryList.find(i => i.tag === itemCategory);

          if (target) {
            name = target.display;
          }
        }
      }

      return name;
    },
    getCategory(item) {
      if (["activity", "rebate"].includes(item.category[0])) {
        return "activity";
      }

      if (this.currentCategory.key === "outer") {
        return "vendor";
      }

      return item.category[0];
    },
    formatThousandsCurrency(value) {
      return thousandsCurrency(value);
    },
    onClick(info) {
      this.$emit("update:detailInfo", info);
      this.$emit("openSlider");
      localStorage.setItem("money-detail-id", info.id);

      if (!this.isEmbedDetail) {
        this.$router.push("/mobile/mcenter/moneyDetail/detail?id=" + info.id);
      }
    },
    onDeposit() {
      if (this.routerTPL === "sg1") {
        sendUmeng(45);
      } else {
        sendUmeng(46);
      }
      this.$router.push("/mobile/mcenter/deposit");
    }
  }
};
</script>

<style lang="scss" src="../css/porn1.list.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/sg1.list.scss" module="$style_sg1"></style>
