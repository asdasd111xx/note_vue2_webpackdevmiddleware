<template>
  <div :class="$style['commission-list-wrap']">
    <div :class="$style['total-block']">
      <span>笔数：{{ commissionList.length }}</span>
      <span>返利总计：{{ allTotal.amount | amountFormat }}</span>
    </div>

    <template v-if="!mainNoData">
      <div :class="$style['list-block']">
        <div
          :class="$style['card']"
          v-for="(info, index) in controlData"
          :key="'item-' + index"
          @click="onClick(info)"
        >
          <div :class="$style['card-title']">
            <span :class="$style['card-name']">{{ info.period }}</span>
            <span
              :class="[
                $style['card-getNumber'],
                { [$style['has-detail']]: info.show_detail }
              ]"
            >
              {{ info.amount | amountFormat }}
            </span>
          </div>

          <div>
            <span>{{ $text("S_COMPUTE_WAGER_INTERVAL", "结算区间") }}</span>
            <div :class="$style['period']">
              <span>{{ EST(info.start_at) }} </span>
              <span>{{ EST(info.end_at) }} </span>
            </div>
          </div>

          <div>
            <span>{{ $text("S_COMPUTE_METHOD", "结算方式") }}</span>
            <span>{{ typeText(info.type) }}</span>
          </div>
        </div>
      </div>

      <infinite-loading
        v-if="showInfinite"
        ref="infiniteLoading"
        @infinite="infiniteHandler"
      >
        <span slot="no-more" />
        <span slot="no-results" />
      </infinite-loading>
    </template>

    <template v-else>
      <div :class="$style['no-data']" v-if="mainNoData">
        <img src="/static/image/_new/mcenter/ic_nodata.png" />
        <p>{{ $text("S_NO_DATA_YET", "暂无资料") }}</p>
      </div>
    </template>
  </div>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";
import commissionList from "@/mixins/mcenter/commission/commissionList";
import { mapGetters } from "vuex";

export default {
  components: {
    InfiniteLoading
  },
  mixins: [commissionList],
  props: {
    setTabState: {
      type: Function,
      required: true
    },
    setHeaderTitle: {
      type: Function,
      required: true
    },
    currentInfo: {
      type: Object | null,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    }
  },
  methods: {
    onClick(info) {
      if (info.show_detail) {
        this.setTabState(false);
        this.setHeaderTitle(info.period);
        this.$emit("update:currentInfo", info);
        this.$router.push({
          path: "/mobile/mcenter/tcenter/commission/detail"
        });
      }
    },
    typeText(type) {
      switch (type) {
        case 0:
          return "盈亏返利";
          break;

        case 1:
          return "投注返利";
          break;

        case 2:
          return "损益返利";
          break;
      }
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
