<template>
  <div :class="$style['assign-list-wrap']">
    <div :class="[$style['total-block'], $style['total-block-' + path]]">
      <span>笔数：{{ detailList.length }}</span>
      <span>返利总计：{{ String(allTotal.amount) | amountFormat }}</span>
    </div>

    <div :class="$style['list-block']">
      <div
        :class="$style['card']"
        v-for="(info, index) in controlData"
        :key="'item-' + index"
      >
        <div :class="[$style['card-title']]">
          <template v-if="path">
            <span
              :class="[
                $style['card-name'],
                $style[`state-${commissionState[info.state].key}`],
                $style[`state-${commissionState[info.state].key}-${path}`]
              ]"
              >{{ commissionState[info.state].text }}</span
            >
            <span :class="[$style['card-getNumber']]"
              >返利：{{ info.amount | amountFormat }}</span
            >
          </template>
          <template v-else>
            <span :class="$style['card-name']">{{
              $text("S_COMMISSION_01", "返利")
            }}</span>
            <span :class="[$style['card-getNumber']]">{{
              info.amount | amountFormat
            }}</span>
          </template>
        </div>

        <div :class="[$style['total-gap-' + path]]">
          <span>{{ $text("S_COMPUTE_WAGER_INTERVAL", "结算区间") }}</span>
          <div :class="$style['period']">
            <span>{{ EST(info.start_at) }} </span>
            <span>{{ EST(info.end_at) }} </span>
          </div>
        </div>

        <div :class="[$style['total-gap-' + path]]">
          <span>{{ $text("S_ACH_VALID_MEMBERS", "有效会员") }}</span>
          <span>{{ info.sub_user_count }}</span>
        </div>

        <div v-if="!path">
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
import axios from "axios";
import EST from "@/lib/EST";
import { format, toDate, parseISO } from "date-fns";
import { API_COMMISSIOM_DETAIL_LIST } from "@/config/api";
import { mapActions } from "vuex";
import InfiniteLoading from "vue-infinite-loading";

export default {
  components: {
    InfiniteLoading
  },
  props: {
    currentInfo: {
      type: Object | null,
      required: true
    }
  },
  data() {
    return {
      sort: "",
      order: "",
      commissionState: {
        1: { key: "assigned", text: this.$text("S_ASSIGN_ALREADY", "已派发") }, // 已派發
        3: {
          key: "unqualified",
          text: this.$text("S_UNQUALIFIED_01", "资格不符")
        } // 資格不符
      },
      detailList: [],
      allTotal: {} | null,
      mainNoData: true,
      showInfinite: true,
      isLoading: false,
      maxResults: 10,
      showPage: 0,
      path: this.$route.params.title ?? ""
    };
  },
  mounted() {},
  filters: {
    amountFormat(amount) {
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    dateFormat(date) {
      const toESTDate =
        new Date(parseISO(date)).getTime() +
        (parseISO(date).getTimezoneOffset() / 60) * 3600000 -
        14400000;
      return format(toESTDate, "yyyy-MM-dd");
    }
  },
  computed: {
    controlData() {
      return this.detailList.filter(
        (item, index) => index < this.maxResults * this.showPage
      );
    },
    getDate() {
      let period = String(this.currentInfo.period);
      let yyyy = period.slice(0, 4);
      let mm = period.slice(4, 6);
      let dd = period.slice(6, 8);

      return `${yyyy}-${mm}-${dd}`;
    }
  },
  created() {
    this.getListDetail();
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    EST,
    /**
     * 取得佣金詳細資料列表
     */
    getListDetail() {
      this.showInfinite = false;
      this.isLoading = true;
      this.showPage = 0;
      const params = {
        period: this.currentInfo.period,
        start_at: this.getDate,
        end_at: this.getDate
      };

      // 預設美東時間
      params.start_at += " 00:00:00-04:00";
      params.end_at += " 23:59:59-04:00";

      if (this.sort !== "") {
        params.sort = this.sort;
        params.order = this.order;
      }

      axios({
        method: "get",
        url: API_COMMISSIOM_DETAIL_LIST,
        params: {
          period: this.$route.query.period || params.period,
          start_at: this.$route.query.start_at || params.start_at,
          end_at: this.$route.query.end_at || params.end_at
        }
      })
        .then(response => {
          this.showInfinite = true;

          if (response.data.result !== "ok" || response.data.ret.length === 0) {
            this.allTotal = null;
            this.detailList = [];
            this.mainNoData = true;
            return;
          }

          this.isLoading = false;
          this.allTotal = response.data.total; // 總計
          this.detailList = response.data.ret; // 佣金資料列表
          this.mainNoData = false;
        })
        .catch(error => {
          this.actionSetGlobalMessage({ msg: error.response.data.msg });
        });
    },
    /**
     * 捲動加載
     * @param {object} $state - 套件提供的方法
     * @see { @link https://peachscript.github.io/vue-infinite-loading/#!/ }
     */
    infiniteHandler($state) {
      setTimeout(() => {
        if (this.detailList.length === 0) {
          this.isLoading = false;
          $state.complete();
          return;
        }

        if (this.detailList.length / this.maxResults > this.showPage) {
          this.showPage += 1;
          $state.loaded();

          if (
            Math.ceil(this.detailList.length / this.maxResults) ===
            this.showPage
          ) {
            $state.complete();
          }
        }
      }, 300);
    }
  }
};
</script>

<style lang="scss" module>
@import "@/css/variable.scss";

.assign-list-wrap {
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

  &.total-block-record > span:first-child {
    display: flex;
    justify-content: flex-end;
    order: 2;
  }
  &.total-block-record > span:nth-child(2) {
    display: flex;
  }

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
    align-items: center;
    font-size: 14px;
    // padding-top: 9px;
    padding: 9px 9px 0 12px;

    &.total-gap-record {
      align-items: flex-start;

      > span:first-child {
        color: #a6a9b2;
      }
    }

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

  .period.period {
    display: flex;
    flex-direction: column;
    padding: 0;
  }

  .card-getNumber {
    &.is-negative {
      color: $main_error_color1;
    }
  }

  .state-unqualified {
    color: $main_error_color1;

    &.state-unqualified-record {
      color: #db6372;
    }
  }

  .state-assigned-record {
    color: #6aaaf5;
  }
}
</style>
