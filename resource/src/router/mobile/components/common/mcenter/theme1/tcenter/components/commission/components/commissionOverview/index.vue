<template>
  <div>
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
          <div :class="$style.amount">{{ info.amount }}</div>
        </div>

        <!-- 預估返利(第三方) -->
        <template v-if="info.key === 'expected'">
          <div v-show="isSummaryShow[info.key]" :class="$style['detail-wrap']">
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
                {{ summaryContent[index].amount }}
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
              {{ summaryContent[index].start_at | dateFormat }}-{{
                summaryContent[index].end_at | dateFormat
              }}
            </div>

            <div :class="[$style.detail, 'clearfix']">
              <div :class="$style.text">
                {{ $text("S_ACH_VALID_MEMBERS", "有效会员") }}
              </div>
              <div :class="$style.amount">
                {{ summaryContent[index].valid_user }}
                {{ $text("S_PERSON", "人") }}
              </div>
            </div>

            <div :class="[$style.detail, 'clearfix']">
              <div :class="$style.text">
                {{ $text("S_VALID_BET", "有效投注") }}
              </div>
              <div :class="$style.amount">
                {{ summaryContent[index].valid_bet }}
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
                {{ summaryContent[index].profit }}
              </div>
            </div>
            <div :class="[$style.detail, 'clearfix']">
              <div :class="$style.text">
                {{ $text("S_SENT_RAKEBACK", "已派返水") }}
              </div>
              <div :class="$style.amount">
                {{ summaryContent[index].dispatched_rebate }}
              </div>
            </div>
            <div :class="[$style.detail, 'clearfix']">
              <div :class="$style.text">
                {{ $text("S_SENT_PROMOTIONS", "已派优惠") }}
              </div>
              <div :class="$style.amount">
                {{ summaryContent[index].dispatched_offer }}
              </div>
            </div>
            <div :class="[$style.detail, 'clearfix']">
              <div :class="$style.text">
                {{ $text("S_MEM_DEPOSIT", "会员入款") }}
              </div>
              <div :class="$style.amount">
                {{ summaryContent[index].deposit }}
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
                {{ summaryContent[index].withdraw }}
              </div>
            </div>
            <div :class="[$style.detail, 'clearfix']">
              <div :class="$style.text">
                {{ $text("S_PLATFORM_COST", "平台费") }}
              </div>
              <div :class="$style.amount">
                {{ summaryContent[index].vendor_fee }}
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
            summaryContent[index].amount + summaryContent[index].oauthAmount <=
              0
          "
        >
          <div v-show="isSummaryShow[info.key]" :class="$style['detail-wrap']">
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
                {{ summaryContent[index].amount }}
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
                {{ summaryContent[index].oauthAmount }}
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import commissionOverview from "@/mixins/mcenter/commission/commissionOverview";
import { mapGetters } from "vuex";

export default {
  mixins: [commissionOverview],
  data() {
    return {
      isSummaryShow: {
        today: false,
        yesterday: false,
        monthly: false,
        expected: false
      }
    };
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
      const now = new Date();
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
    }
  },
  methods: {
    onClick({ key }) {
      this.isSummaryShow[key] = !this.isSummaryShow[key];
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
