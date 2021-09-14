<template>
  <div>
    <!-- 返利管理 -->
    <div v-if="path" :class="[$style['profit']]">
      <div v-for="(info, index) in profitList" :key="index">
        <div :class="[$style['profit-wrap']]">
          <div :class="[$style['title-wrap']]">
            <span :class="[$style['top-title']]">
              {{ info.overview }}
            </span>
            <div :class="[$style['bottom-title']]">
              <span :class="[$style['profit_date']]"> {{ info.date }}</span>

              <span :class="[$style['profit_day']]"
                >剩余天数{{ info.day }}天</span
              >
            </div>
          </div>

          <div :class="[$style['profit_container']]">
            <div
              v-for="(content, key) in info.list"
              :key="key"
              :class="[$style['profit_child']]"
            >
              <div :class="[$style['profit_child_name']]">
                {{ content.name }}
              </div>
              <div
                :class="[
                  $style['profit_child_item'],
                  { [$style.deficit]: content.color }
                ]"
              >
                {{ content.item }}
              </div>
            </div>
          </div>
          <div :class="$style.tips">
            ※
            {{
              $text("S_EVERY_DAY_UPDATE", {
                replace: [{ target: "%s", value: "6:00" }]
              })
            }}
          </div>
        </div>
      </div>
    </div>
    <!-- 我的推廣 -->
    <div v-if="!path">
      <div :class="[$style['date-wrap'], 'clearfix']">
        <div :class="$style.date">
          {{ $text(`S_${currentMonth}_MONTH`) }}/{{ currentYear }}
        </div>
        <div :class="$style.remainder">
          {{
            $text("S_DAYSLEFT", {
              replace: [{ target: "%s", value: remainderDays }]
            })
          }}
        </div>
      </div>
      <div v-if="summary" :class="$style['summary-wrap']">
        <div
          v-for="(info, index) in summaryTitle"
          :key="`title-${info.key}`"
          :class="$style.wrap"
        >
          <div
            :class="[
              $style['title-wrap'],
              'clearfix',
              {
                [$style['expend']]: isSummaryShow[info.key]
              }
            ]"
            @click="onClick(info)"
          >
            <div :class="$style['btn-arrow']">
              <icon
                v-if="isSummaryShow[info.key]"
                name="chevron-up"
                width="10"
                height="10"
              />
              <icon v-else name="chevron-down" width="10" height="10" />
            </div>
            <div :class="$style.title">{{ info.text }}</div>
            <div :class="$style.amount">{{ amountFormat(info.amount) }}</div>
          </div>

          <!-- 預估返利(第三方) -->
          <template v-if="info.key === 'expected'">
            <div
              v-show="isSummaryShow[info.key]"
              :class="$style['detail-wrap']"
            >
              <div :class="[$style.detail, 'clearfix']">
                <div :class="[$style.text, $style.main]">
                  {{ $text("S_EXPECTED_LOSS_REBATE", "盈亏返利预估") }}
                </div>
                <div
                  :class="[
                    $style.amount,
                    $style.main,
                    { [$style.deficit]: +summaryContent[index].amount < 0 }
                  ]"
                >
                  {{ amountFormat(summaryContent[index].amount) }}
                </div>
              </div>

              <div :class="[$style.detail, 'clearfix']">
                <div :class="[$style.text, $style.main]">
                  {{ $text("S_REBATE_LEVEL", "返利级别") }}
                </div>
                <div :class="[$style.amount, $style.main]">
                  {{ summaryContent[index].rate }} %
                </div>
              </div>

              <div :class="$style['summary-date']">
                {{ dateFormat(summaryContent[index].start_at) }}~{{
                  dateFormat(summaryContent[index].end_at)
                }}
              </div>

              <div :class="[$style.detail, 'clearfix']">
                <div :class="$style.text">
                  {{ $text("S_ACH_VALID_MEMBERS", "有效会员") }}
                </div>
                <div :class="$style.amount">
                  {{ amountFormat(summaryContent[index].valid_user) }}
                  {{ $text("S_PERSON", "人") }}
                </div>
              </div>

              <div :class="[$style.detail, 'clearfix']">
                <div :class="$style.text">
                  {{ $text("S_VALID_BET", "有效投注") }}
                </div>
                <div :class="$style.amount">
                  {{ amountFormat(summaryContent[index].valid_bet) }}
                </div>
              </div>

              <div :class="[$style.detail, 'clearfix']">
                <div :class="$style.text">
                  {{ $text("S_GAME_LOSS", "游戏盈亏") }}
                </div>
                <div
                  :class="[
                    $style.amount,
                    { [$style.deficit]: +summaryContent[index].profit < 0 }
                  ]"
                >
                  {{ amountFormat(summaryContent[index].profit) }}
                </div>
              </div>
              <div :class="[$style.detail, 'clearfix']">
                <div :class="$style.text">
                  {{ $text("S_SENT_RAKEBACK", "已派返水") }}
                </div>
                <div :class="$style.amount">
                  {{ amountFormat(summaryContent[index].dispatched_rebate) }}
                </div>
              </div>
              <div :class="[$style.detail, 'clearfix']">
                <div :class="$style.text">
                  {{ $text("S_SENT_PROMOTIONS", "已派优惠") }}
                </div>
                <div :class="$style.amount">
                  {{ amountFormat(summaryContent[index].dispatched_offer) }}
                </div>
              </div>
              <div :class="[$style.detail, 'clearfix']">
                <div :class="$style.text">
                  {{ $text("S_MEM_DEPOSIT", "会员入款") }}
                </div>
                <div :class="$style.amount">
                  {{ amountFormat(summaryContent[index].deposit) }}
                </div>
              </div>
              <div :class="[$style.detail, 'clearfix']">
                <div :class="$style.text">
                  {{ $text("S_MEM_WITHDRAW", "会员出款") }}
                </div>
                <div
                  :class="[
                    $style.amount,
                    { [$style.deficit]: +summaryContent[index].withdraw < 0 }
                  ]"
                >
                  {{ amountFormat(summaryContent[index].withdraw) }}
                </div>
              </div>
              <div :class="[$style.detail, 'clearfix']">
                <div :class="$style.text">
                  {{ $text("S_PLATFORM_COST", "平台费") }}
                </div>
                <div :class="$style.amount">
                  {{ amountFormat(summaryContent[index].vendor_fee) }}
                </div>
              </div>
              <div
                v-if="summaryContent[index].shift_amount"
                :class="[$style.detail, 'clearfix']"
              >
                <div :class="$style.text">
                  {{ $text("S_SHIFT_AMOUNT", "上期結轉") }}
                </div>
                <div :class="$style.amount">{{ $text("S_HAVE", "有") }}</div>
              </div>
              <div :class="$style.tips">
                ※
                {{
                  $text("S_EVERY_DAY_UPDATE", {
                    replace: [{ target: "%s", value: "6:00" }]
                  })
                }}
              </div>
            </div>
          </template>

          <template
            v-else-if="
              summaryContent[index].amount +
                summaryContent[index].oauthAmount <=
                0
            "
          >
            <div
              v-show="isSummaryShow[info.key]"
              :class="$style['detail-wrap']"
            >
              <div :class="$style['no-data']">
                {{ $text("S_NO_DATA_YET", "暂无资料") }}
              </div>
            </div>
          </template>

          <template v-else>
            <div v-show="isSummaryShow[info.key]">
              <div
                v-if="summaryContent[index].amount"
                :class="[
                  $style['detail-wrap'],
                  {
                    [$style['main']]: info.key === 'monthly'
                  },
                  'clearfix'
                ]"
              >
                <div :class="$style.text">
                  <!-- 唯獨本月已領需要額外+區間 -->
                  <template v-if="info.key === 'monthly'">
                    投注返利({{ monthRange }})
                  </template>

                  <template v-else>
                    {{
                      summaryContent[index].text === ""
                        ? "投注返利"
                        : summaryContent[index].text
                    }}
                  </template>
                </div>

                <div :class="$style.amount">
                  {{ amountFormat(summaryContent[index].amount) }}
                </div>
              </div>

              <div
                v-if="summaryContent[index].oauthAmount"
                :class="[
                  $style['detail-wrap'],
                  {
                    [$style['main']]: info.key === 'monthly'
                  },
                  'clearfix'
                ]"
              >
                <div :class="$style.text">
                  {{ summaryContent[index].oauthText }}
                </div>
                <div :class="$style.amount">
                  {{ amountFormat(summaryContent[index].oauthAmount) }}
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import commissionOverview from "@/mixins/mcenter/commission/commissionOverview";
import { mapGetters } from "vuex";
import EST from "@/lib/EST";
import Vue from "vue";
import { thousandsCurrency } from "@/lib/thousandsCurrency";

export default {
  mixins: [commissionOverview],
  data() {
    return {
      isSummaryShow: {
        today: false,
        yesterday: false,
        monthly: false,
        expected: false
      },
      path: this.$route.params.title ?? "" //是否從返利管理來,
    };
  },
  props: {
    setHeaderTitle: {
      type: Function,
      default: () => {}
    },
    setTabState: {
      type: Function,
      default: () => {}
    },
    setBackFunc: {
      type: Function,
      default: () => {}
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
    },
    monthRange() {
      // Get 目前年/月/日
      const now = EST(new Date(), "", true);
      // console.log(now, new Date());
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let day = now.getDate();

      // 判斷是否月/日 <= 9，補0
      month = month >= 1 && month <= 9 ? "0" + month : month;
      day = day >= 1 && day <= 9 ? "0" + day : day;

      // 取當月最後一天
      const getLastDay = (year, month) => {
        let new_year = year;
        let new_month = month++;
        if (month > 12) {
          new_month -= 12;
          new_year++;
        }
        let last_date = new Date(new_year, new_month, 0).getDate();
        return last_date;
      };

      let firstDate = month + "/" + "01";
      let lastDate = month + "/" + getLastDay(year, month);

      return firstDate + "-" + lastDate;
    },
    profitList() {
      let findExpected = this.summaryContent.filter(function(item) {
        return item.key == "expected";
      });
      let data = findExpected?.map(info => {
        return {
          overview: `盈亏返利概况`,
          date:
            this.dateYearFormat(info.start_at) ===
            this.dateYearFormat(info.end_at)
              ? this.dateYearFormat(info.start_at)
              : `${this.dateYearFormat(info.start_at)} ~ ${this.dateYearFormat(
                  info.end_at
                )}`,
          day: this.remainderDays,
          period: info.period,
          list: [
            {
              name: this.$text("S_EXPECTED_REBATE", "预估返利"),
              item: this.amountFormat(info.amount),
              key: "estimate",
              color: info.amount < 0,
              show: true
            },
            {
              name: this.$text("S_REBATE_LEVEL", "返利级别"),
              item: `${info.rate || 0}%`,
              key: "level",
              color: false,
              show: true
            },
            {
              name: this.$text("S_ACH_VALID_MEMBERS", "有效会员"),
              item: this.amountFormat(info.valid_user),
              key: "member",
              color: false,
              show: true
            },
            {
              name: this.$text("S_VALID_BET", "有效投注"),
              item: this.amountFormat(info.valid_bet),
              key: "bet",
              color: false,
              show: true
            },
            {
              name: this.$text("S_TOTAL_REBATE", "总损益"),
              item: this.amountFormat(info.profit),
              color: info.profit,
              key: "level",
              color: info.profit < 0,
              show: true
            },
            {
              name: this.$text("S_SENT_RAKEBACK", "已派返水"),
              item: this.amountFormat(info.dispatched_rebate),
              key: "sent",
              color: false,
              show: true
            },
            {
              name: this.$text("S_SENT_PROMOTIONS", "已派優惠"),
              item: this.amountFormat(info.dispatched_offer),
              key: "discount",
              color: false,
              show: true
            },
            {
              name: this.$text("S_MEM_DEPOSIT_2", "會員存款"),
              item: this.amountFormat(info.deposit),
              key: "deposit",
              color: false,
              show: true
            },
            {
              name: this.$text("S_MEM_WITHDRAW_2", "會員取款"),
              item: this.amountFormat(
                info.withdraw > 0 ? info.withdraw : info.withdraw * -1
              ),
              key: "withdraw",
              color: info.withdraw < 0,
              show: true
            },
            {
              name: this.$text("S_PLATFORM_COST", "平台费"),
              item: this.amountFormat(info.vendor_fee),
              key: "fee",
              color: false,
              show: true
            },
            {
              name: this.$text("S_PREVIOUS_REBATE", "上期结转"),
              item: info.shift_amount
                ? this.$text("S_HAVE", "有")
                : this.$text("S_NONE", "無"),
              key: "previous",
              color: false,
              show: true
            }
          ].filter(i => i.show)
        };
      });
      return data;
    }
  },
  methods: {
    onClick({ key }) {
      this.isSummaryShow[key] = !this.isSummaryShow[key];
    },
    amountFormat(value) {
      let _value = Number(value).toFixed(2);
      return thousandsCurrency(_value);
    },
    dateYearFormat(date) {
      return Vue.moment(new Date(date)).format("YYYY-MM-DD");
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
