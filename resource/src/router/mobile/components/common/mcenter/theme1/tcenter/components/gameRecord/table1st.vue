<template>
  <div :class="$style['record-wrap']">
    <div v-if="!hasSearch" :class="$style['total-block']">
      <span>笔数：{{ counts ? counts : 0 }}</span>
      <span
        >有效投注：{{
          total.valid_bet ? toCurrency(total.valid_bet) : "0.00"
        }}</span
      >
      <span
        >派彩：
        <span
          v-if="themetpl() === 'sg1'"
          :class="{ [$style['is-negative']]: total.payoff > 0 }"
          >{{ total.payoff ? toCurrency(total.payoff) : "0.00" }}</span
        >
        <span v-else :class="{ [$style['is-negative']]: total.payoff < 0 }">{{
          +total.payoff ? toCurrency(+total.payoff) : "0.00"
        }}</span></span
      >
    </div>

    <div :class="$style['list-block']">
      <template v-if="!hasSearch">
        <div v-if="inqStart === inqEnd" :class="$style['date']">
          {{ inqStart | dateFormat }}
        </div>
        <div v-else :class="$style['date']">
          {{ inqStart | dateFormat }} ~ {{ inqEnd | dateFormat }}
        </div>
      </template>

      <div
        :class="$style['card']"
        v-for="(info, index) in list"
        @click="$emit('onInquire', info.username)"
        :key="index"
      >
        <div :class="$style['card-title']">
          <span :class="$style['header']">{{ info.username }}</span>
          <span
            v-if="themetpl() === 'sg1'"
            :class="[
              $style['payout'],
              { [$style['is-negative']]: info.payoff > 0 }
            ]"
            >{{ toCurrency(info.payoff) }}</span
          >
          <span
            v-else
            :class="[
              $style['payout'],
              { [$style['is-negative']]: info.payoff < 0 }
            ]"
            >{{ toCurrency(+info.payoff) }}</span
          >
        </div>
        <div>
          <span>投注金额</span>
          <span>{{ toCurrency(info.bet) }}</span>
        </div>
        <div>
          <span>有效投注</span>
          <span>{{ toCurrency(info.valid_bet) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { format } from "date-fns";
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      siteconfig: "getSiteConfig"
    })
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
    },
    inqStart: {
      type: String,
      default: ""
    },
    inqEnd: {
      type: String,
      default: ""
    },
    hasSearch: {
      type: Boolean
    }
  },
  methods: {
    themetpl() {
      return this.siteconfig.MOBILE_WEB_TPL;
    },

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
