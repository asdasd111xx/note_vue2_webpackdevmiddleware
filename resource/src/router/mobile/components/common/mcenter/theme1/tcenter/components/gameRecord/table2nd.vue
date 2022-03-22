<template>
  <div :class="$style['record-wrap']">
    <div :class="$style['total-block']">
      <span>笔数：{{ counts }}</span>
      <span>有效投注：{{ toCurrency(total.valid_bet) }}</span>
      <span
        >派彩：
        <span :class="{ [$style['is-negative']]: total.payoff > 0 }">{{
          toCurrency(total.payoff)
        }}</span></span
      >
    </div>

    <div
      :class="$style['list-block']"
      :key="data.day"
      v-for="(data, index) in list"
    >
      <div :class="$style['date']">{{ data.day | dateFormat }}</div>
      <div
        :class="$style['card']"
        :key="info.vendor_alias"
        v-for="(info, index) in data.list"
      >
        <div :class="$style['card-title']">
          <span :class="$style['header']">{{ info.vendor_alias }}</span>
          <span
            :class="[
              $style['payout'],
              { [$style['is-negative']]: info.payoff > 0 }
            ]"
            >{{ toCurrency(info.payoff) }}</span
          >
        </div>
        <div>
          <span :class="[$style['game-name'], $style[themeTPL]]">
            {{ info.game_name }}
          </span>
        </div>
        <div :class="$style['bet']">
          <span>单量</span>
          <span>{{ toCurrency(info.count) }}</span>
        </div>
        <div :class="$style['bet']">
          <span>投注金额</span>
          <span>{{ toCurrency(info.bet) }}</span>
        </div>
        <div :class="$style['bet']">
          <span>有效投注</span>
          <span>{{ toCurrency(info.valid_bet) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      siteconfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteconfig.MOBILE_WEB_TPL;
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    total: {
      type: Object,
      default: () => ({})
    },
    counts: {
      type: Number,
      default: null
    }
  },
  methods: {
    toCurrency(num) {
      var parts = num.toString().split(".");
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      return parts.join(".");
    }
  },
  filters: {
    dateFormat(value) {
      return Vue.moment(value).format("MM月DD日");
    }
  }
};
</script>

<style src="./css/table.scss" lang="scss" module></style>
