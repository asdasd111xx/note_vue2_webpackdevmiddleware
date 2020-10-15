<template>
  <div :class="$style['record-wrap']">
    <div :class="$style['total-block']">
      <span>笔数：{{ counts }}</span>
      <span>有效投注：{{ total.valid_bet }}</span>
      <span
        >派彩：<span
          v-if="siteconfig.MBILE_WEB_TPL === 'ey1'"
          :class="{ [$style['is-negative']]: total.payoff < 0 }"
          >{{ +total.payoff }}</span
        >
        <span v-else>{{ +total.payoff }}</span></span
      >
    </div>

    <div :class="$style['list-block']" v-for="(data, index) in list">
      <div :class="$style['date']">{{ data.day }}</div>
      <div :class="$style['card']" v-for="(info, index) in data.list">
        <div :class="$style['card-title']">
          <span :class="$style['header']">{{ info.vendor_alias }}</span>
          <span
            :class="[
              $style['payout'],
              { [$style['is-negative']]: info.payoff < 0 },
            ]"
            >{{ +info.payoff }}</span
          >
        </div>
        <div>
          <span :class="$style['game-name']">{{ info.game_name }}</span>
        </div>
        <div :class="$style['bet']">
          <span>单量</span>
          <span>{{ info.count }}</span>
        </div>
        <div :class="$style['bet']">
          <span>投注金额</span>
          <span>{{ info.bet }}</span>
        </div>
        <div :class="$style['bet']">
          <span>有效投注</span>
          <span>{{ info.valid_bet }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      siteconfig: "getSiteConfig",
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
    }
  }
};
</script>

<style src="./css/table.scss" lang="scss" module></style>
