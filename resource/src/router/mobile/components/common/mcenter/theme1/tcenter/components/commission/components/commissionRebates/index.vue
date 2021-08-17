<template>
  <div>
    <div v-if="path">
      <tcenter-label
        v-if="tabState"
        :child-item="childItem"
        :change-tab="changeTab"
      />
      <!-- 進入返利管理 詳情 -->
      <detail
        :set-tab-state="setTabState"
        :set-header-title="setHeaderTitle"
        v-if="$route.params.item === 'detail'"
        :status="status"
      />
    </div>
    <div v-if="$route.params.item != 'detail'">
      <div
        v-if="immediateData.length > 0"
        :class="[$style['content-wrap'], { [$style.pathwrap]: path }]"
      >
        <div
          v-for="(caculateList, listIndex) in immediateData"
          :key="`caculate-${listIndex}`"
          :class="$style['content-item']"
        >
          <div
            :class="[$style['rebate-header'], { [$style.pathheader]: path }]"
          >
            <template v-if="path">
              <div :class="[$style['rebate-time']]">
                {{ caculateList.period | dateFormatNoTime }}
              </div>
              返利：{{
                caculateList.amount ? commaFormat(caculateList.amount) : "--"
              }}
            </template>
            <template v-else>
              <div>{{ caculateList.period }}</div>
              <div
                v-if="caculateList.state !== 3 && caculateList.self_times !== 0"
              >
                {{ caculateList.start_at | dateFormat }}~{{
                  caculateList.end_at | dateFormat
                }}
              </div>
            </template>
          </div>

          <div :class="[$style['rebate-body'], { [$style.pathbody]: path }]">
            <div
              v-if="
                (path &&
                  caculateList.state !== 3 &&
                  caculateList.self_times !== 0) ||
                  (path && caculateList.state === 3)
              "
              :class="$style['detail-content']"
            >
              <span :class="$style['content-left']">
                结算区间
              </span>
              <div :class="$style['content-right']">
                <div>{{ dateFormatHour(caculateList.start_at) }}</div>
                <div>{{ dateFormatHour(caculateList.end_at) }}</div>
              </div>
            </div>

            <div :class="$style['detail-content']">
              <span :class="$style['content-left']">
                结算方式
              </span>
              <div :class="$style['content-right']">
                {{
                  caculateList.type === 0
                    ? "盈亏返利"
                    : caculateList.type === 1
                    ? "投注返利"
                    : caculateList.type === 2
                    ? "损益返利"
                    : null
                }}
              </div>
            </div>

            <div :class="$style['detail-content']">
              <span :class="$style['content-left']">
                {{ $text("S_VALID_BET", "有效投注") }}
              </span>
              <div :class="$style['content-right']">
                <template v-if="caculateList.sub_valid_bet">
                  {{ commaFormat(caculateList.sub_valid_bet) }}
                </template>

                <template v-else>
                  --
                </template>
              </div>
            </div>

            <div :class="$style['detail-content']">
              <span :class="$style['content-left']">
                损益
              </span>
              <div
                :class="[
                  $style['content-right'],
                  { [$style['is-negative']]: caculateList.sub_profit < 0 }
                ]"
              >
                {{
                  caculateList.sub_profit
                    ? commaFormat(caculateList.sub_profit)
                    : "--"
                }}
              </div>
            </div>

            <div v-if="!path" :class="$style['detail-content']">
              <span :class="$style['content-left']">
                返利
              </span>
              <div :class="$style['content-right']">
                {{
                  caculateList.amount ? commaFormat(caculateList.amount) : "--"
                }}
              </div>
            </div>

            <div :class="$style['detail-content']">
              <span :class="$style['content-left']">
                最低领取金额
              </span>
              <div :class="$style['content-right']">
                {{
                  caculateList.self_min_limit
                    ? commaFormat(caculateList.self_min_limit)
                    : "--"
                }}
              </div>
            </div>

            <div :class="$style['detail-content']">
              <span :class="$style['content-left']">
                可领取次数
              </span>
              <div :class="$style['content-right']">
                <template
                  v-if="
                    caculateList.state === 3 && caculateList.self_times === 0
                  "
                >
                  已达上限
                </template>

                <template v-else>
                  {{ caculateList.self_times }}
                </template>
              </div>
            </div>
          </div>

          <div :class="$style['rebate-btn']">
            <template>
              <button
                v-if="caculateList.state === 1"
                @click="handleRebateProcess(caculateList.type)"
              >
                {{ $t("S_RECEIVE") }}
              </button>

              <button
                v-if="caculateList.state === 3"
                :class="$style['unrebate-btn']"
              >
                {{ $t("S_UNABLE_PASS") }}
              </button>
            </template>
          </div>
        </div>
      </div>

      <div
        v-if="immediateData.length === 0"
        :class="[$style['no-data'], { [$style.pathnodata]: path }]"
      >
        {{ path ? "暂没有可领取的返利" : "暂时没有可领取的返利" }}
      </div>

      <div
        v-if="!path"
        :class="$style['rebate-manual-title']"
        @click="isShowTip = !isShowTip"
      >
        <icon
          :class="$style['title-icon']"
          :name="isShowTip ? 'angle-up' : 'angle-down'"
        />
        <span :class="$style['manual-title']">{{
          $text("S_REAL_DIRECTIONS", "实返说明")
        }}</span>
      </div>

      <div
        v-if="isShowTip"
        :class="[$style['rebate-manual-wrap'], { [$style.pathmanual]: path }]"
      >
        <div v-if="!path" :class="$style['manual-line']" />
        <div :class="[$style['rebate-manual-tip'], { [$style.pathtip]: path }]">
          <div>
            (1) 结算周期自美东时间0点整为计算始点。
          </div>
          <div>
            (2)
            系统于每小时会计算一小时前的返利金额，若未达最低返利金额或可领次数已达上限，当次不提供领取。
          </div>
          <div>
            (3) 周期结算后剩余的返利金额，系统于上午{{
              dispatch_hour
            }}点主动派发。
          </div>
          <div>
            (4)
            另考虑到资料刷新同步或平台维护时，可能造成试算领取存在误差，如有遗漏或偏差敬请见谅。
          </div>
          <div v-show="maintainsList">
            {{ $t("S_CURRENT_PLATFORM") }}：
            <span :class="$style['maintains-list']">{{ maintainsList }}</span>
          </div>
        </div>
      </div>
      <template v-if="isShowPopup">
        <popup
          :is-show-popup.sync="isShowPopup"
          :amount="amountResult"
          :path="path"
          :current-info="currentInfo"
        />
      </template>
    </div>
  </div>
</template>

<script>
import Vue, { nextTick } from "vue";
import mcenter from "@/api/mcenter";
import { format } from "date-fns";
import bbosRequest from "@/api/bbosRequest";
import { mapActions, mapGetters } from "vuex";
import popup from "./components/popup";
import detail from "./components/detail";
import EST from "@/lib/EST";
import tcenterLabel from "../../../../../tcenterSame/tcenterLabel";

export default {
  components: {
    tcenterLabel,
    popup,
    detail,
    eleLoading: () =>
      import(
        /* webpackChunkName: 'eleLoading' */ "@/router/web/components/tpl/common/element/loading/square"
      )
  },
  props: {
    setTabState: {
      type: Function,
      default: () => {}
    },
    setHeaderTitle: {
      type: Function,
      default: () => {}
    },
    tabState: {
      type: Boolean,
      default: true
    },
    setBackFunc: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      togglePopup: false,
      isShowTip: true,
      immediateData: [],
      rebateInitData: {},
      maintainsList: "",
      rebateState: "",
      amountResult: 0,
      dispatch_hour: null,
      title: "real",
      pathItem: this.$route.params.item ?? "", //是否從返利管理來,
      path: this.$route.params.title ?? "", //是否從返利管理來,
      status: true, //傳進詳情 是否顯示箭頭
      currentInfo: {},
      entries: {}
    };
  },
  computed: {
    ...mapGetters({
      systemTime: "getSystemTime",
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo"
    }),
    $style() {
      return (
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1
      );
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    isShowPopup: {
      get() {
        return this.togglePopup;
      },
      set(value) {
        this.togglePopup = value;
      }
    },
    childItem() {
      return [
        { name: "receive", text: this.$text("S_RECEIVE", "领取") },
        { name: "detail", text: this.$text("S_DETAIL", "详情") }
      ];
    }
  },
  filters: {
    dateFormat(date) {
      return EST(Vue.moment(date).format("YYYY-MM-DD HH:mm:ss")) || "--";
    },
    dateFormatNoTime(date) {
      return Vue.moment(date).format("YYYYMMDD");
    }
  },
  created() {
    //刷新導回實時返利領取
    if (this.path && this.pathItem != "receive") {
      if (!this.$route.query.toDetail || this.$route.query.toDetail != "Y") {
        this.$router.replace({
          params: {
            title: this.title,
            item: "receive"
          }
        });
        this.pathItem = "receive";
      }
    }

    this.getImmediateData();
    this.bankRebateMaintains();
    this.actionSetSystemTime();
  },

  methods: {
    ...mapActions(["actionSetSystemTime"]),
    commaFormat(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    bankRebateMaintains() {
      mcenter.bankRebateMaintains({
        success: response => {
          const maintainsList = [];
          response.ret.forEach(maintain => {
            maintainsList.push(maintain.alias);
          });
          this.maintainsList = maintainsList.join("、");
        }
      });
    },
    getImmediateData() {
      bbosRequest({
        method: "get",
        url: this.siteConfig.BBOS_DOMIAN + "/Wage/SelfDispatchInfo",
        reqHeaders: {
          Vendor: this.memInfo.user.domain
        },
        params: { lang: "zh-cn" }
      }).then(response => {
        if (response.status === "000") {
          if (this.themeTPL === "ey1") {
            this.dispatch_hour = response.data.auto_dispatch_hour;
            this.immediateData = response.data.entries;
            this.entries = this.immediateData[0] || "";
          } else {
            this.dispatch_hour = response.data.ret.auto_dispatch_hour;
            this.immediateData = response.data.ret.entries;
            this.entries = response.data.ret?.entries[0] ?? "";
          }
          let total = response.data.total ?? "";

          this.currentInfo = {
            period: this.entries.period,
            start_at: this.entries.start_at,
            end_at: this.entries.end_at,
            type: this.entries.type,
            amount: this.entries.amount,
            show_detail: this.entries.show_detail,
            oauth2: this.entries.oauth2
          };

          // 傳進detail判斷是否顯示查看箭頭
          // 狀態=>可領/已達上限/已領取/計算中
          if (
            this.entries.self_times > 0 ||
            (this.entries.state === 3 && this.entries.self_times === 0) ||
            (!total.valid_bet?.accounting && !this.entries) ||
            total.valid_bet.accounting
          ) {
            this.status = true;
          } else if (!total.accounting && this.entries.amount === 0) {
            //計算完無實返金額
            this.status = false;
          } else {
            this.status = false;
          }

          // 測試資料
          // this.immediateData = [
          //     {
          //         period: "20200421",
          //         start_at: "2020-04-21T12:00:00+0800",
          //         end_at: "2020-04-21T07:15:18+0800",
          //         sub_valid_bet: "14875039.6179",
          //         sub_profit: "0.00",
          //         state: 1,
          //         self_times: 10,
          //         self_min_limit: "10",
          //         type: 1,
          //         amount: "200.00"
          //     }
          // ];
          return;
        }
      });
    },
    handleRebateProcess(type) {
      bbosRequest({
        method: "put",
        url: this.siteConfig.BBOS_DOMIAN + "/Wage/SelfDispatch",
        reqHeaders: {
          Vendor: this.memInfo.user.domain
        },
        params: { lang: "zh-cn", type }
      }).then(response => {
        this.isShowPopup = true;
        this.immediateData = [];
        if (response.status === "000") {
          this.amountResult = response.data.dispatched_amount;
        }
      });
    },
    changeTab(tabKey) {
      if (this.$route.params.item != tabKey.name) {
        this.pathItem = tabKey.name;

        if (this.pathItem === "receive") this.getImmediateData();

        this.$router.replace({
          params: {
            title: this.title,
            item: `${tabKey.name}`
          },
          query: {
            total: "total"
          }
        });
      }
    },
    dateFormatHour(date) {
      if (date) {
        return EST(Vue.moment(date).format("YYYY-MM-DD HH:00:00"));
      }
      return "--";
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.index.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/sg1.index.scss" module="$style_sg1"></style>
<style lang="scss" src="./css/ey1.index.scss" module="$style_ey1"></style>
