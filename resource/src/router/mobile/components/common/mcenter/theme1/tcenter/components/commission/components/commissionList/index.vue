<template>
  <div :class="$style['commission-list-wrap']">
    <template v-if="!mainNoData">
      <div :class="$style['total-block']">
        <span>笔数：{{ commissionList.length }}</span>
        <span>返利总计：{{ allTotal.amount | amountFormat }}</span>
      </div>

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
              >{{ info.amount | amountFormat }}</span
            >
          </div>

          <div>
            <span>{{ $text("S_COMPUTE_WAGER_INTERVAL", "结算区间") }}</span>
            <span
              >{{ info.start_at | dateFormat }} ~
              {{ info.end_at | dateFormat }}</span
            >
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
      <div :class="$style['no-data']" v-if="showNoData">
        <img src="/static/image/_new/mcenter/no_data.png" />
        <p>{{ $text("S_NO_DATA_YET", "暂无资料") }}</p>
      </div>
    </template>
  </div>
</template>

<script>
import InfiniteLoading from "vue-infinite-loading";
import commissionList from "@/mixins/mcenter/commission/commissionList";

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
    showNoData: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      // displayDetail: []
    };
  },
  methods: {
    onClick(info) {
      if (info.show_detail) {
        this.setTabState(false);
        this.setHeaderTitle(info.period);
        this.$router.push({
          path: "/mobile/mcenter/tcenter/commission/detail",
          query: { period: info.period }
        });
      }

      // if (info.show_detail) {
      //   this.setTabState(false);
      //   this.setHeaderTitle(info.period);
      //   this.$router.push("/mobile/mcenter/tcenter/commission/detail");
      //   return;
      // }

      // if (this.displayDetail.includes(info.id)) {
      //   this.displayDetail = [
      //     ...this.displayDetail.filter(value => value !== info.id)
      //   ];
      //   return;
      // }

      // this.displayDetail = [...this.displayDetail, info.id];
    },
    typeText(type) {
      switch (type) {
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

<style lang="scss" src="./css/index.scss" module></style>
