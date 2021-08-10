<template>
  <div>
    <div :class="$style['header-option']">
      <img
        v-if="memInfo.config.infinity_register"
        :src="
          `/static/image/${siteConfig.MOBILE_WEB_TPL}/mcenter/tcenter/btn_member_add.png`
        "
        @click="$router.push('/mobile/mcenter/newRecommend?makeFriend=false')"
      />
      <img
        :src="
          `/static/image/${siteConfig.MOBILE_WEB_TPL}/mcenter/tcenter/btn_qrcode.png`
        "
        @click="$router.push('/mobile/mcenter/newRecommend?makeFriend=true')"
      />
    </div>
    <tcenter-label :child-item="allTotalData" :change-tab="getTimeRecord" />
    <div v-if="hasSearch" class="search-wrap">
      <div :class="$style['search-form']">
        <div :class="[$style['form-row'], 'clearfix']">
          <div :class="$style['form-date-start']">
            <div :class="$style['form-title']">
              {{ $text("S_STARTED_DAY", "起始日") }}
            </div>

            <input
              v-model="start"
              ref="startInput"
              :min="fromDate"
              :max="end"
              :id="`start`"
              type="date"
              @input="limitDate('start', $event.target.value)"
            />
            <span>{{ dateFormat(start) }}</span>
          </div>
          <div :class="$style['form-date-end']">
            <div :class="$style['form-title']">
              {{ $text("S_END_DAY", "结束日") }}
            </div>

            <input
              v-model="end"
              ref="endInput"
              :min="start"
              :max="endDate"
              :id="`end`"
              type="date"
              @input="limitDate('end', $event.target.value)"
            />
            <span>{{ dateFormat(end) }}</span>
          </div>
        </div>

        <div :class="[$style['submit-form-row']]">
          <div :class="$style.submit" @click="onInquire">
            {{ $text("S_INQUIRE", "查询") }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="!hasSearch" :class="[$style['time-range']]">{{ timeTitle }}</div>
    <div v-if="isShowRebate && !hasSearch" :class="[$style['all-data']]">
      <div :class="[$style['data-title']]">实时返利统计</div>
      <div :class="[$style['data-content-wrap']]">
        <div
          :class="[$style['data-content']]"
          @click="
            $router.push('/mobile/mcenter/tcenterManageRebate/real/detail')
          "
        >
          <div :class="[$style['title']]">
            有效投注金额
            <img
              :src="`/static/image/common/arrow_next.png`"
              :class="[$style['arrow_next']]"
            />
          </div>
          <div :class="[$style['content']]">{{ realValidBet }}</div>
        </div>
        <div
          :class="[$style['data-content']]"
          @click="
            $router.push('/mobile/mcenter/tcenterManageRebate/real/detail')
          "
        >
          <div :class="[$style['title']]">
            有效会员人数
            <img
              :src="`/static/image/common/arrow_next.png`"
              :class="[$style['arrow_next']]"
            />
          </div>
          <div :class="[$style['content']]">{{ realUserCount }}</div>
        </div>
      </div>
    </div>
    <div v-if="!hasSearch" :class="[$style['all-data']]">
      <div :class="[$style['data-title']]">全部下级统计</div>
      <div :class="[$style['data-content-wrap']]">
        <div
          :class="[$style['data-content']]"
          @click="setDetailType('firstDeposit')"
        >
          <div :class="[$style['title']]">
            总首存人数
            <img
              :src="`/static/image/common/arrow_next.png`"
              :class="[$style['arrow_next']]"
            />
          </div>
          <div :class="[$style['content']]">{{ friendFirstDeposit }}</div>
        </div>
        <div :class="[$style['data-content']]" @click="setDetailType('hasBet')">
          <div :class="[$style['title']]">
            总投注人数
            <img
              :src="`/static/image/common/arrow_next.png`"
              :class="[$style['arrow_next']]"
            />
          </div>
          <div :class="[$style['content']]">{{ friendHasBet }}</div>
        </div>
        <div
          :class="[$style['data-content']]"
          @click="setDetailType('deposit')"
        >
          <div :class="[$style['title']]">
            总充值金额
            <img
              :src="`/static/image/common/arrow_next.png`"
              :class="[$style['arrow_next']]"
            />
          </div>
          <div :class="[$style['content']]">{{ friendDeposit }}</div>
        </div>
        <div
          :class="[$style['data-content']]"
          @click="setDetailType('withdraw')"
        >
          <div :class="[$style['title']]">
            总提现金额
            <img
              :src="`/static/image/common/arrow_next.png`"
              :class="[$style['arrow_next']]"
            />
          </div>
          <div :class="[$style['content']]">{{ friendWithdraw }}</div>
        </div>
        <div :class="[$style['data-content'], [$style['darker']]]">
          <div :class="[$style['title']]">
            总有效投注
          </div>
          <div :class="[$style['content']]">{{ friendValidBet }}</div>
        </div>
        <div :class="[$style['data-content'], [$style['darker']]]">
          <div :class="[$style['title']]">
            总损益
          </div>
          <div :class="[$style['content']]">{{ friendPayoff }}</div>
        </div>
      </div>
    </div>
    <commission-detail
      v-if="detailPage != 0"
      :set-detail-page="setDetailPage"
      :detail-page="detailPage"
      :detail-type="detailType"
      :time-title="timeTitle"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import { format } from "date-fns";
import bbosRequest from "@/api/bbosRequest";
import commission from "@/mixins/mcenter/commission";
import EST from "@/lib/EST";
import tcenterLabel from "../../../tcenterSame/tcenterLabel";
import goLangApiRequest from "@/api/goLangApiRequest";
import commissionDetail from "./components/commissionDetail";

export default {
  components: {
    tcenterLabel,
    commissionDetail
    // commissionOverview: () =>
    //   import(
    //     /* webpackChunkName: 'commissionOverview' */ "../commission/components/commissionOverview/index"
    //   ),
    // commissionList: () =>
    //   import(
    //     /* webpackChunkName: 'commissionList' */ "../commission/components/commissionList/index"
    //   ),
    // commissionDetail: () =>
    //   import(
    //     /* webpackChunkName: 'commissionDetail' */ "../commission/components/commissionDetail/index"
    //   ),
    // commissionRebates: () =>
    //   import(
    //     /* webpackChunkName: 'commissionRebates' */ "../commission/components/commissionRebates/index"
    //   )
  },
  mixins: [commission],
  props: {
    setTabState: {
      type: Function,
      required: true
    },
    setHeaderTitle: {
      type: Function,
      required: true
    }
  },
  data() {
    const now = EST(new Date(), "", true);
    return {
      isReceive: true,
      isShowRebate: true,
      hasSearch: this.$route.params.page === "record",
      commissionInfo: {},
      fromDate: Vue.moment(now)
        .add(-29, "days")
        .format("YYYY-MM-DD"),
      endDate: Vue.moment(now).format("YYYY-MM-DD"),
      pathDay: this.$route.params.item ?? "", //返利管理日期,
      path: this.$route.params.title ?? "", //是否從返利管理來,

      title: "record",
      estToday: EST(new Date(), "", true),
      timeTitle: "",
      tabState: true,
      realValidBet: "",
      realUserCount: "",
      friendFirstDeposit: "",
      friendHasBet: "",
      friendDeposit: "",
      friendWithdraw: "",
      friendValidBet: "",
      friendPayoff: "",
      detailPage: 0,
      detailType: ""
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    start: {
      get() {
        return format(new Date(this.startTime), "yyyy-MM-dd"); // 格式化成原生 input date 可以使用的格式
      },
      set(date) {
        if (!date) {
          return;
        } else {
          this.startTime = date;
        }
      }
    },
    end: {
      get() {
        return format(new Date(this.endTime), "yyyy-MM-dd"); // 格式化成原生 input date 可以使用的格式
      },
      set(date) {
        if (!date) {
          return;
        } else {
          this.endTime = date;
        }
      }
    },
    getCommissionInfo: {
      get() {
        return this.commissionInfo;
      },
      set(data) {
        this.commissionInfo = data;
      }
    },
    page() {
      return this.$route.params.page;
    },
    rebatePathItem: {
      get() {
        return this.$route.params.item;
      },
      set(value) {
        return (this.pathDay = value);
      }
    },
    allTotalData() {
      return [
        {
          text: this.$text("S_TODDAY", "今日"),
          name: "today",
          value: 0,
          show: true
        },
        {
          text: this.$text("S_YESTERDAY", "昨日"),
          name: "yesterday",
          value: 1,
          show: true
        },
        {
          text: this.$text("S_THIRTY_DAY", "近30日"),
          name: "month",
          value: 29,
          show: true
        },
        {
          text: this.$text("S_SEARCH_DAY", "搜寻"),
          name: "custom",
          value: 29,
          show: true
        }
      ].filter(item => item.show);
    }
  },
  watch: {
    startTime() {
      this.endTime =
        this.startTime > this.endTime ? this.startTime : this.endTime;
    },
    "$route.params.page"() {
      if (this.$route.params.page === "detail") {
        return;
      } else {
        this.setTabState(true);
        this.setHeaderTitle("团队管理");
      }
    },
    "$route.params.item"() {
      if (this.$route.params.item === "detail") {
        return;
      } else {
        this.setTabState(true);
        this.setHeaderTitle("团队管理");
      }
    }
  },
  created() {
    this.getTimeRecord(this.allTotalData[0]);
    this.getRebateSwitch();
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    handleClickInqStartDate() {
      const el = this.$refs["startInput"];
      el.click();
    },
    handleClickInqEndDate() {
      const el = this.$refs["endInput"];
      el.click();
    },
    onClick(page) {
      this.hasSearch = page === "record";
      this.$router.replace(`/mobile/mcenter/tcenter/commission/${page}`);
    },
    onInquire() {
      this.onSearch();
      this.hasSearch = false;
      this.manageRebateDate();
      this.getFriendSummary();
    },
    getRebateSwitch() {
      this.isReceive = false;

      // 因開關在此 api 的回傳，所以在入口點先呼叫此 api
      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Wage/SelfDispatchInfo`,
        params: { lang: "zh-cn" }
      }).then(response => {
        this.isReceive = true;

        if (response.status === "000") {
          // let dataArray = [];

          // dataArray = response.data.ret.entries;
          this.isShowRebate = response.data.ret.show_real_time;

          if (this.isShowRebate) {
            this.getRebateData();
            // this.subValidBet = response.data.total.valid_bet.sub_valid_bet
            //   ? this.getNoRoundText(response.data.total.valid_bet.sub_valid_bet)
            //   : "--";

            // this.subUserCount = response.data.total.valid_bet.sub_user_count
            //   ? this.formatToPrice(response.data.total.valid_bet.sub_user_count)
            //   : "--";

            // this.immediateData = dataArray.length > 0 ? dataArray[0] : null;
          }
          return;
        }
      });
    },
    limitDate(key, val) {
      let _value = Vue.moment(val).format("YYYY/MM/DD");
      let _today = Vue.moment(new Date())
        .add(-29, "days")
        .format("YYYY/MM/DD");

      if (_value < _today) {
        this.actionSetGlobalMessage({ msg: "查询记录不能超过30天" });
        this.start = this.endDate;
      } else if (this.end > this.endDate) {
        this.end = this.endDate;
      } else if (this.start > this.end) {
        let endTemp = this.end;
        this.end = this.start > this.endDate ? this.endDate : this.start;
        this.start = endTemp;
      }
    },
    dateFormat(value) {
      if (value) {
        return Vue.moment(value).format("YYYY/MM/DD");
      } else {
        return "";
      }
    },
    getTimeRecord(data) {
      this.start = Vue.moment(this.estToday)
        .add(-data.value, "days")
        .format("YYYY-MM-DD");
      this.end = Vue.moment(this.estToday).format("YYYY-MM-DD");

      if (data.name === "yesterday") {
        this.end = Vue.moment(this.estToday)
          .add(-data.value, "days")
          .format("YYYY-MM-DD");
      }

      if (this.path && this.rebatePathItem != data.name) {
        this.$router.replace({
          params: {
            title: "newCommission",
            item: `${data.name}`
          }
        });
        this.rebateTitle = data.name;
      }

      if (data.name === "custom") {
        this.hasSearch = true;

        return;
      }

      this.onInquire();

      return;
    },
    manageRebateDate() {
      if (this.path) {
        switch (this.rebateTitle) {
          case "today":
          case "yesterday":
            this.timeTitle = this.start;
            break;
          case "month":
          case "custom":
            this.timeTitle = `${this.start} ~ ${this.end}`;
            break;
          default:
            this.timeTitle = this.start;
            break;
        }
      }
      return;
    },
    // 實返資料
    getRebateData() {
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Wage/RealTime/Summary`,
        params: { lang: "zh-cn" }
      }).then(response => {
        if (response.status === "000") {
          this.realValidBet = response.data.user_count;
          this.realUserCount = this.getNoRoundText(response.data.valid_bet);
        }
      });
    },

    // 全部下層統計
    getFriendSummary() {
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Stats/Player/Friends/Summary`,
        params: {
          lang: "zh-cn",
          startAt: this.start,
          endAt: this.end
        }
      }).then(response => {
        if (response.status === "000") {
          this.friendFirstDeposit = response.data.first_deposit;
          this.friendHasBet = response.data.has_bet;
          this.friendDeposit = this.getNoRoundText(response.data.deposit);
          this.friendWithdraw = this.getNoRoundText(response.data.withdraw);
          this.friendValidBet = this.getNoRoundText(response.data.valid_bet);
          this.friendPayoff = this.getNoRoundText(response.data.payoff);
        }
      });
    },
    formatToPrice(value) {
      //千分位
      return `${Number(value)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    },
    getNoRoundText(value) {
      //千分位＋小數點後兩位
      return `${Number(value)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    },
    setDetailType(type) {
      this.detailType = type;
      this.setDetailPage(1);
    },
    setDetailPage(page) {
      this.detailPage = page;
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
