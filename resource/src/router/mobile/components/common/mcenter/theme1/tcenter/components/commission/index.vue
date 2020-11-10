<template>
  <div>
    <div v-if="page !== 'detail' && isReceive" :class="$style['top-link']">
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

    <div v-if="page === 'record' && hasSearch" class="search-wrap">
      <div :class="$style['search-form']">
        <div :class="[$style['form-row'], 'clearfix']">
          <div :class="$style['form-date-start']">
            <div :class="$style['form-title']">
              {{ $text("S_STARTED_DAY", "起始日") }}
            </div>
            <input v-model="start" type="date" />
            <span>{{ start | dateFormat }}</span>
          </div>
          <div :class="$style['form-date-end']">
            <div :class="$style['form-title']">
              {{ $text("S_END_DAY", "结束日") }}
            </div>
            <input v-model="end" type="date" />
            <span>{{ end | dateFormat }}</span>
          </div>
        </div>

        <div :class="$style['submit-form-row']">
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
      v-if="page === 'detail'"
      :currentInfo="getCommissionInfo"
    />

    <commission-rebates v-if="page === 'rebate'" />
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { format } from "date-fns";
import bbosRequest from "@/api/bbosRequest";
import commission from "@/mixins/mcenter/commission";

export default {
  components: {
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
      ),
  },
  mixins: [commission],
  props: {
    setTabState: {
      type: Function,
      required: true,
    },
    setHeaderTitle: {
      type: Function,
      required: true,
    },
  },
  data() {
    return {
      isReceive: true,
      isShowRebate: true,
      hasSearch: this.$route.params.page === "record",
      commissionInfo: {},
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig",
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    start: {
      get() {
        return format(new Date(this.startTime), "yyyy-MM-dd"); // 格式化成原生 input date 可以使用的格式
      },
      set(date) {
        this.startTime = date;
      },
    },
    end: {
      get() {
        return format(new Date(this.endTime), "yyyy-MM-dd"); // 格式化成原生 input date 可以使用的格式
      },
      set(date) {
        this.endTime = date;
      },
    },
    getCommissionInfo: {
      get() {
        return this.commissionInfo;
      },
      set(data) {
        this.commissionInfo = data;
      },
    },
    page() {
      return this.$route.params.page;
    },
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
  },
  filters: {
    dateFormat(value) {
      if (value) {
        return Vue.moment(value).format("YYYY/MM/DD");
      } else {
        return "";
      }
    },
  },
  created() {
    this.getRebateSwitch();

    // 因 detail 的資料可能為第三方 or 各級好友(從上一個傳下來的data)，統一重整回summary
    if (this.page === "detail") {
      this.$router.push("/mobile/mcenter/tcenter/commission/summary");
    }

    // 重整的時候，根據當下render page
    if (this.page) {
      this.$router.push(`/mobile/mcenter/tcenter/commission/${this.page}`);
      return;
    }

    this.hasSearch = true;
  },
  methods: {
    onClick(page) {
      this.hasSearch = page === "record";
      this.$router.push(`/mobile/mcenter/tcenter/commission/${page}`);
    },
    onInquire() {
      if (this.startTime !== this.endTime) {
        this.onSearch();
        this.hasSearch = false;
      }
    },
    getRebateSwitch() {
      this.isReceive = false;

      // 因開關在此 api 的回傳，所以在入口點先呼叫此 api
      bbosRequest({
        method: "get",
        url: this.siteConfig.BBOS_DOMIAN + "/Wage/SelfDispatchInfo",
        reqHeaders: {
          Vendor: this.memInfo.user.domain,
        },
        params: { lang: "zh-cn" },
      }).then((response) => {
        this.isReceive = true;

        if (response.status === "000") {
          this.isShowRebate = response.data.show_real_time;
          return;
        }
      });
    },
  },
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
