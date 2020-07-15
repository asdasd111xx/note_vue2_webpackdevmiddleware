<template>
  <div :class="$style['commission-list-wrap']">
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
          <span :class="$style['card-name']">返利</span>
          <span :class="[$style['card-getNumber']]">{{
            info.amount | amountFormat
          }}</span>
        </div>
        <div>
          <span>{{ $text("S_COMPUTE_WAGER_INTERVAL", "结算区间") }}</span>
          <span
            >{{ info.start_at | dateFormat }} ~
            {{ info.end_at | dateFormat }}</span
          >
        </div>

        <div>
          <span>{{ $text("S_ACH_VALID_MEMBERS", "有效会员") }}</span>
          <span>{{ info.sub_user_count }}</span>
        </div>
        <div>
          <span>{{ $text("S_STATUS", "状态") }}</span>
          <span :class="$style[`state-${commissionState[info.state].key}`]">{{
            commissionState[info.state].text
          }}</span>
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
      displayDetail: []
    };
  },
  methods: {
    onClick(info) {
      if (info.show_detail) {
        this.setDetailData(info);
        this.setTabState(false);
        this.setHeaderTitle(info.period);
        this.$router.push("/mobile/mcenter/tcenter/commission/detail");
        return;
      }

      if (this.displayDetail.includes(info.id)) {
        this.displayDetail = [
          ...this.displayDetail.filter(value => value !== info.id)
        ];
        return;
      }

      this.displayDetail = [...this.displayDetail, info.id];
    }
  }
};
</script>

<style lang="scss" module>
@import "@/css/variable.scss";

.commission-list-wrap {
  position: relative;
  padding: 0 14px;
  width: 100%;
}

.total-block {
  display: flex;
  justify-content: space-between;
  color: $main_text_color3;
  font-size: 12px;
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #eee;

  span {
    flex: 1;

    &:nth-child(2) {
      flex: 1;
      text-align: right;
    }
  }
}

.list-block {
  position: relative;
  margin-top: 10px;
}
.card {
  background: $main_white_color1;
  color: $main_text_color3;
  border-radius: 8px;
  margin-bottom: 9px;

  div {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    // padding-top: 9px;
    padding: 9px 9px 0 12px;

    &:last-of-type {
      padding: 9px 9px 9px 12px;
    }
  }

  .card-title {
    padding: 6px 9px 6px 12px;
    line-height: 21px;
    border-bottom: 1px solid #eee;
  }

  .card-name {
    font-size: 16px;
    font-weight: 700;
  }

  .card-getNumber {
    &.is-negative {
      color: $main_error_color1;
    }
  }

  .state-unqualified {
    color: $main_error_color1;
  }
}
</style>
