<template>
  <div>
    <template v-if="path && rebatePathItem !== 'detail'">
      <!-- 返利管理 日期 -->
      <tcenter-label :child-item="allTotalData" :change-tab="getTimeRecord" />
      <commission-list
        v-if="!hasSearch"
        :path="path"
        :time-title="timeTitle"
        :set-tab-state="setTabState"
        :set-header-title="setHeaderTitle"
        :search-info="searchInfo"
        :current-info.sync="commissionInfo"
      />
    </template>
    <div
      v-if="page !== 'detail' && isReceive && !path"
      :class="$style['top-link']"
    >
      <span
        :class="[$style.link, { [$style.active]: page === 'record' }]"
        @click="onClick('record')"
        >{{ $text("S_COMMISSION_SEND_RECORD", "派发记录") }}</span
      >
      <span
        :class="[$style.link, { [$style.active]: page === 'summary' }]"
        @click="onClick('summary')"
        >{{ $text("S_COMMISSION_SUMMARY", "收益概況") }}</span
      >
      <span
        v-if="isShowRebate"
        :class="[$style.link, { [$style.active]: page === 'rebate' }]"
        @click="onClick('rebate')"
        >{{ $text("S_COMMISSION_REBATE", "实时返利") }}</span
      >
    </div>

    <div
      v-if="(page === 'record' && hasSearch) || (path && hasSearch)"
      class="search-wrap"
    >
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

    <commission-overview v-if="page === 'summary'" />
    <commission-list
      v-if="!hasSearch"
      v-show="page === 'record'"
      :set-tab-state="setTabState"
      :set-header-title="setHeaderTitle"
      :search-info="searchInfo"
      :current-info.sync="commissionInfo"
    />

    <commission-detail
      v-if="page === 'detail' || rebatePathItem === 'detail'"
      :current-info="getCommissionInfo"
      :set-header-title="setHeaderTitle"
    />

    <commission-rebates v-if="page === 'rebate'" />
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

export default {
  components: {
    tcenterLabel,
    commissionOverview: () =>
      import(
        /* webpackChunkName: 'commissionOverview' */ "./components/commissionOverview/index"
      ),
    commissionList: () =>
      import(
        /* webpackChunkName: 'commissionList' */ "./components/commissionList/index"
      ),
    commissionDetail: () =>
      import(
        /* webpackChunkName: 'commissionDetail' */ "./components/commissionDetail/index"
      ),
    commissionRebates: () =>
      import(
        /* webpackChunkName: 'commissionRebates' */ "./components/commissionRebates/index"
      )
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
    },
    setBackFunc: {
      type: Function,
      default: () => {}
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
      tabState: true
    };
  },
  // watch: {
  //   "$route.params.item"(val) {
  //     console.log("aaa" + val);
  //     this.setBackFunc(() => {
  //       if (this.$route.params.title === "record") {
  //         if (
  //           this.$route.params.item == "yesterday" ||
  //           this.$route.params.item == "today" ||
  //           this.$route.params.item == "month" ||
  //           this.$route.params.item == "custom"
  //         ) {
  //           return this.$router.replace("/mobile/mcenter/tcenterLobby");
  //         }
  //       }
  //       this.$router.back();
  //     });
  //   }
  // },
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
        this.setHeaderTitle(this.$text("S_TEAM_CENTER", "我的推广"));
      }
    },
    "$route.params.item"() {
      if (this.$route.params.item === "detail") {
        return;
      } else {
        this.setTabState(true);
        this.setHeaderTitle(this.$text("S_TEAM_REBATE", "返利管理"));
      }
    }
  },
  created() {
    if (this.path) {
      this.getTimeRecord(this.allTotalData[0]);
      this.hasSearch = false;
    } else {
      this.hasSearch = true;
    }
    this.getRebateSwitch();

    // 因 detail 的資料可能為第三方 or 各級好友(從上一個傳下來的data)，統一重整回summary
    if (this.page === "detail") {
      this.$router.replace("/mobile/mcenter/tcenter/commission/summary");
    }

    if (this.rebatePathItem === "detail") {
      this.$router.replace("/mobile/mcenter/tcenterManageRebate/record/today");
    }

    // // 重整的時候，根據當下render page
    // if (this.page) {
    //   this.$router.replace(`/mobile/mcenter/tcenter/commission/${this.page}`);
    //   return;
    // }
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
      //返利管理多要顯示日期
      this.manageRebateDate();
    },
    getRebateSwitch() {
      this.isReceive = false;

      // 因開關在此 api 的回傳，所以在入口點先呼叫此 api
      bbosRequest({
        method: "get",
        url: this.siteConfig.BBOS_DOMIAN + "/Wage/SelfDispatchInfo",
        reqHeaders: {
          Vendor: this.memInfo.user.domain
        },
        params: { lang: "zh-cn" }
      }).then(response => {
        this.isReceive = true;

        if (response.status === "000") {
          this.isShowRebate =
            this.themeTPL === "ey1"
              ? response.data.show_real_time
              : response.data.ret.show_real_time;
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
            title: "record",
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
        }
      }
      return;
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
