<template>
  <div>
    <!-- 返利管理 -->
    <div
      v-if="
        path &&
          routeItem === 'profit' &&
          !$route.query.depth &&
          !$route.query.userId
      "
      :class="[$style['profit']]"
    >
      <!-- page1 -->
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
          <card-item
            :card-item-list="friendLayerList"
            @click-card="enterNextLayer"
          />
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
    <!-- page2 -->
    <template v-if="$route.query.depth === 1 && !$route.query.user">
      <div :class="$style['friend-wrap']">
        <div v-if="friendNameList !== undefined">
          <card-total :data="friendBet" />
        </div>
        <div
          v-if="friendNameList !== undefined"
          :class="$style['card-item-wrap']"
        >
          <card-item
            :card-item-list="friendNameList"
            @click-card="enterNextLayer"
          />
        </div>
        <div v-else :class="$style['no-data']">
          <img
            :src="$getCdnPath(`/static/image/${themeTPL}/mcenter/no_data.png`)"
          />
          <p>{{ $text("S_NO_DATA_YET", "暂无资料") }}</p>
        </div>
      </div>
    </template>

    <!-- page3 -->
    <template v-if="$route.query.userId">
      <div :class="$style['friend-wrap']">
        <div>
          <card-total :data="friendGameBet" />
          <span :class="$style['rebate-rate']" @click="toggleSerial"
            >返利比例</span
          >
        </div>
        <div
          v-if="
            friendGameCategory !== undefined && friendGameCategory.length > 0
          "
          :class="$style['card-item-wrap']"
        >
          <card-item :card-item-list="friendGameCategory" />
        </div>
      </div>
    </template>
    <template>
      <rebate-rate
        v-if="isSerial"
        :handle-close="toggleSerial"
        :game-rate-result="gameRateResult"
      />
    </template>
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
import goLangApiRequest from "@/api/goLangApiRequest";
import { getCookie } from "@/lib/cookie";
import { thousandsCurrency } from "@/lib/thousandsCurrency";
import cardItem from "../../../../../tcenterSame/cardItem";
import cardTotal from "../../../../../tcenterSame/cardAllTotal";
import rebateRate from "../../../../../tcenterSame/rebateRate";
export default {
  mixins: [commissionOverview],
  components: {
    cardItem,
    cardTotal,
    rebateRate
  },
  data() {
    return {
      isSummaryShow: {
        today: false,
        yesterday: false,
        monthly: false,
        expected: false
      },
      isSerial: false,

      //會員id(entryId)
      memberId: "",

      //第幾層好友
      depth: 1,
      cid: getCookie("cid"),
      path: this.$route.params.title ?? "", //是否從返利管理來,
      levelTrans: {
        1: "S_FIRST_LEVEL_FRIEND",
        2: "S_SECOND_LEVEL_FRIEND",
        3: "S_THIRD_LEVEL_FRIEND",
        4: "S_FOURTH_LEVEL_FRIEND",
        5: "S_FIFTH_LEVEL_FRIEND"
      },
      //---page1---
      //有效投注金額、会员人数
      resultDetail: [],
      resultDetailList: {
        at: "",
        valid_bet: 0,
        lack_sub_valid_bet: 0,
        next_sub_valid_bet: 0,
        user_count: 0,
        lack_sub_user_count: 0,
        next_sub_user_count: 0
      },

      //多層級好友
      resultFriend: [],
      title: "real",
      routeItem: this.$route.params.item,

      //---page2---
      friendMemberList: [],

      //---page3---
      friendGameList: [],

      //返利比例
      friendGameRateList: [],
      gameRateResult: []
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
  created() {
    // this.getAllDetailList();
    setTimeout(() => {
      this.getLayerDetail();
    }, 1000);
  },
  watch: {
    "$route.query": {
      handler: function(item) {
        if (item.depth && !item.user) {
          //page2
          this.setHeaderTitle(this.$text(this.levelTrans[item.depth]));
          this.setTabState(false);

          if (
            this.$route.query.current_entry_id ||
            this.memberId ||
            this.memInfo.user.id
          ) {
            // this.getFriendsList(this.depth);
            this.getLayerFriends(this.depth);
          }
        } else if (item.user) {
          //page3
          this.setHeaderTitle(item.user);
          this.setTabState(false);
          // this.getUserGameList();
          this.getLayerFriendGame();
          this.getFriendGameRateList();
        } else {
          this.setHeaderTitle("返利管理");
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
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
              show: false
            },
            {
              name: this.$text("S_ACH_VALID_MEMBERS", "有效会员"),
              item: info.valid_user,
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
              show: false
            },
            {
              name: this.$text("S_SENT_PROMOTIONS", "已派優惠"),
              item: this.amountFormat(info.dispatched_offer),
              key: "discount",
              color: false,
              show: false
            },
            {
              name: this.$text("S_MEM_DEPOSIT_2", "會員存款"),
              item: this.amountFormat(info.deposit),
              key: "deposit",
              color: false,
              show: false
            },
            {
              name: this.$text("S_MEM_WITHDRAW_2", "會員取款"),
              item: this.amountFormat(
                info.withdraw > 0 ? info.withdraw : info.withdraw * -1
              ),
              key: "withdraw",
              color: info.withdraw < 0,
              show: false
            },
            {
              name: this.$text("S_PLATFORM_COST", "平台费"),
              item: this.amountFormat(info.vendor_fee),
              key: "fee",
              color: false,
              show: false
            },
            {
              name: this.$text("S_PREVIOUS_REBATE", "上期结转"),
              item: info.shift_amount
                ? this.$text("S_HAVE", "有")
                : this.$text("S_NONE", "無"),
              key: "previous",
              color: false,
              show: false
            }
          ].filter(i => i.show)
        };
      });
      return data;
    },
    friendLayerList() {
      //page1 好友層
      let layerdata = this.resultFriend?.map(info => {
        return {
          title: this.$text(this.levelTrans[info.depth]),
          childTitle: "查看",
          // 傳遞給子元件點擊專用
          paramsValue: { depth: info.depth },
          isClick: true,
          img: true,
          list: [
            {
              name: "有效投注",
              item: this.formatThousandsCurrency(info.valid_bet),
              show: true
            },
            {
              name: "损益",
              item: this.formatThousandsCurrency(info.profit),
              color: this.chooseColor(info.profit),
              show: true
            },
            {
              name: "有效会员",
              item: info.valid_user,
              show: true
            },
            {
              name: "上期結轉",
              item: info.last_shift == 0 ? "無" : "有",
              show: true
            }
          ].filter(item => item.show)
        };
      });
      return layerdata;
    },
    friendBet() {
      //page2 上方標題
      let strArr = [
        {
          name: "总有效投注：",
          item:
            this.friendMemberList?.total?.current_valid_bet > 0
              ? this.formatThousandsCurrency(
                  this.friendMemberList?.total?.current_valid_bet
                )
              : "--"
        },
        {
          name: "总损益：",
          item: this.friendMemberList?.total?.current_profit
            ? this.friendMemberList?.total?.current_profit != 0
              ? this.formatThousandsCurrency(
                  this.friendMemberList?.total?.current_profit
                )
              : "--"
            : "--",
          color: this.friendMemberList?.total?.current_profit
            ? this.friendMemberList?.total?.current_profit != 0
              ? this.chooseColor(this.friendMemberList?.total?.current_profit)
              : "--"
            : "--"
        },
        {
          name: "笔数：",
          item: this.friendMemberList?.pagination?.total ?? "0"
        }
      ];
      return strArr;
    },
    friendNameList() {
      //page2 好友帳號列表
      let data = this.friendMemberList?.ret?.map(info => {
        return {
          title: info.username,
          childTitle: "查看",
          // 傳遞給子元件點擊專用
          paramsValue: {
            user: info.username,
            userid: info.user_id,
            id: info.id
          },
          isClick: true,
          img: true,
          list: [
            {
              name: "有效投注",
              item: this.formatThousandsCurrency(info.current_valid_bet),
              show: true
            },
            {
              name: "损益",
              item: this.formatThousandsCurrency(info.current_profit),
              color: this.chooseColor(info.profit),
              show: true
            }
          ]
        };
      });
      return data;
    },
    friendGameBet() {
      //page3 上方標題
      let strArr = [
        {
          name: "总有效投注：",
          item:
            this.friendGameList?.total?.valid_bet > 0
              ? this.formatThousandsCurrency(
                  this.friendGameList.total.valid_bet
                )
              : "--"
        },
        {
          name: "总损益：",
          item: this.friendGameList?.total?.profit
            ? this.friendGameList?.total?.profit != 0
              ? this.formatThousandsCurrency(this.friendGameList.total.profit)
              : "--"
            : "--",
          color: this.friendGameList?.total?.profit
            ? this.friendGameList?.total?.profit != 0
              ? this.chooseColor(this.friendGameList.total.profit)
              : "--"
            : "--"
        },
        { name: "笔数：", item: this.friendGameList?.pagination?.total ?? "0" }
      ];
      return strArr;
    },
    friendGameCategory() {
      //page3 好友投注遊戲類別
      let data = this.friendGameList?.ret?.map(info => {
        return {
          title: info.name,
          list: [
            {
              name: "有效投注",
              item: this.formatThousandsCurrency(info.valid_bet),
              show: true
            },
            {
              name: "损益",
              item: this.formatThousandsCurrency(info.profit),
              color: this.chooseColor(info.profit),
              show: true
            }
          ]
        };
      });
      return data;
    },
    friendGameRate() {
      let data = this.gameRateResult?.ret?.map(info => {
        return {
          title: info.key,
          list: [
            {
              name: info.title.alias,
              item: info.title.rate,
              show: true
            }
          ]
        };
      });
      return data;
    }
  },
  methods: {
    //損益 正紅負黑
    chooseColor(val) {
      return val < 0 ? "red" : "black";
    },
    // getAllDetailList() {
    //   //取得今日實時返利詳情
    //   goLangApiRequest({
    //     method: "get",
    //     url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Wage/RealTime/Detail`,
    //     params: {
    //       lang: "zh-cn",
    //       cid: this.cid
    //     }
    //   }).then(res => {
    //     if (res && res.status === "000") {
    //       //有效投注金額、会员人数
    //       this.resultDetail = res.data.ret ?? "";
    //       this.resultDetailList = {
    //         at: this.resultDetail.at,
    //         valid_bet: this.resultDetail.valid_bet,
    //         lack_sub_valid_bet: this.resultDetail.lack_sub_valid_bet,
    //         next_sub_valid_bet: this.resultDetail.next_sub_valid_bet,
    //         user_count: this.resultDetail.user_count,
    //         lack_sub_user_count: this.resultDetail.lack_sub_user_count,
    //         next_sub_user_count: this.resultDetail.next_sub_user_count
    //       };
    //       //entryId
    //       this.memberId = this.resultDetail.id ?? "";

    //       //多層級好友
    //       // this.resultFriend = res.data.layer_detail ?? [];
    //     }
    //   });
    // },
    //Page1取得分級資料c04.48
    getLayerDetail() {
      const summary = this.summaryContent.filter(item => {
        return item.key == "expected";
      });

      let paramData = {
        period: summary[0] ? summary[0].period : "",
        user_id: this.memInfo.user.id
      };
      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Redirect/commission`,
        params: {
          lang: "zh-cn",
          cid: this.cid,
          externalID: "commission",
          api_uri: "/api/wage/detail",
          method: "get",
          ...paramData
        }
      }).then(res => {
        //多層級好友
        this.resultFriend = res.data.return_data?.ret?.depth_details ?? [];
      });
    },
    // getFriendsList(depth) {
    //   //取得特定期數好友有效投注額及佣金列表
    //   goLangApiRequest({
    //     method: "post",
    //     url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Wage/Entry/${this
    //       .$route.query.current_entry_id || this.memberId}/Friends`,
    //     params: {
    //       lang: "zh-cn",
    //       cid: this.cid,
    //       depth: this.$route.query.depth || depth
    //     }
    //   })
    //     .then(res => {
    //       if (res && res.status === "000") {
    //         this.friendMemberList = res.data ?? [];
    //       }
    //     })
    //     .catch(error => {
    //       if (error && error.data && error.data.msg) {
    //         this.actionSetGlobalMessage(error.data.msg);
    //       }
    //     });
    // },

    //Page2取得特定期數好友有效投注額及佣金列表
    getLayerFriends(depth) {
      const summary = this.summaryContent.filter(item => {
        return item.key == "expected";
      });

      let paramData = {
        period: summary[0] ? summary[0].period : "",
        user_id: this.memInfo.user.id,
        depth: this.$route.query.depth || depth
      };
      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Redirect/commission`,
        params: {
          lang: "zh-cn",
          cid: this.cid,
          externalID: "commission",
          api_uri: "/api/wage/depth/detail",
          method: "get",
          ...paramData
        }
      })
        .then(res => {
          if (res && res.status === "000") {
            this.friendMemberList = res.data.return_data ?? [];
          }
        })
        .catch(error => {
          if (error && error.data && error.data.msg) {
            this.actionSetGlobalMessage(error.data.msg);
          }
        });
    },
    getUserGameList() {
      //取得使用者有效投注平台統計
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Wage/Entry/${this
          .$route.query.current_entry_id ||
          this.memberId}/Vendor/Validbet/Report`,
        params: {
          lang: "zh-cn",
          cid: this.cid,
          userId: this.$route.query.userId
        }
      }).then(res => {
        if (res && res.status === "000") {
          //該好友投注所有遊戲
          this.friendGameList = res.data ?? [];
        }
      });
    },
    getLayerFriendGame() {
      // let paramData = {};
      // paramData = this.friendMemberList?.ret?.map(info => {
      //   return {
      //     user_id: info.user_id,
      //     id: info.id
      //   };
      // });

      //Page3 取得返利明細特定好友級數各會員平台貢獻明細
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Redirect/commission`,
        params: {
          lang: "zh-cn",
          cid: this.cid,
          externalID: "commission",
          api_uri: "/api/wage/depth/vendor_detail",
          method: "get",
          user_id: this.$route.query.userId,
          id: this.$route.query.id
        }
      }).then(res => {
        console.log("friendGameListfriendGameList", res);
        if (res && res.status === "000") {
          //該好友投注所有遊戲
          this.friendGameList = res.data ?? [];
        }
      });
    },
    getFriendGameRateList() {
      //取得返利明細特定階層各平台分潤比率
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Wage/Entry/${this
          .$route.query.current_entry_id || this.memberId}/Layer/Condition`,
        params: {
          lang: "zh-cn",
          cid: this.cid,
          depth: this.$route.query.depth || this.depth
        }
      }).then(res => {
        if (res && res.status === "000") {
          //返利比例
          this.gameRateResult = [];
          this.friendGameRateList = res.data ?? [];
          const name = {
            1: "体育",
            2: "视讯",
            3: "电子",
            4: "彩票",
            5: "棋牌",
            6: "麻将"
          };

          //存放類別代號
          let categoryNum = Object.keys(this.friendGameRateList);
          let category = [];

          //存放類別裡的所有子類別key值
          let item = [];
          for (let i = 1; i <= categoryNum.length; i++) {
            category.push(this.friendGameRateList[i]);
            item.push(Object.keys(this.friendGameRateList[i]));
          }

          for (let i = 0; i < item.length; i++) {
            // 存放第i個子類別裡面的子類別key值
            let childCategory = Object.keys(category[i]);
            let arr = [];
            for (let j = 0; j < childCategory.length; j++) {
              arr.push({
                alias: category[i][childCategory[j]].alias,
                rate: category[i][childCategory[j]].rate
              });
            }
            this.gameRateResult.push({
              title: name[categoryNum[i]],
              item: arr
            });
            arr = [];
            childCategory = [];
          }
        }
      });
    },
    formatThousandsCurrency(value) {
      return +value ? thousandsCurrency(value) : "0.00";
    },
    onClick({ key }) {
      this.isSummaryShow[key] = !this.isSummaryShow[key];
    },
    amountFormat(value) {
      let _value = Number(value).toFixed(2);
      return thousandsCurrency(_value);
    },
    dateYearFormat(date) {
      return Vue.moment(new Date(date)).format("YYYY-MM-DD");
    },
    enterNextLayer(friend) {
      //進到下一頁
      let title = "";
      let queryParams = {};

      //go page3
      if (this.$route.query.depth) {
        title = friend.user;
        queryParams = {
          memberId: this.$route.query.memberId || this.memberId,
          depth: this.depth,
          userId: friend.userid,
          user: friend.user,
          id: friend.id
        };
      } else if (!this.$route.query.depth) {
        //go page2
        this.depth = friend.depth;
        queryParams = {
          memberId:
            this.$route.query.memberId || this.memberId || this.memInfo.user.id,
          depth: friend.depth
        };
      }

      clearInterval(this.timer);
      this.timer = null;
      this.timer = setTimeout(() => {
        this.setHeaderTitle(title);
        this.$router.push({
          params: {
            title: "profit"
          },
          query: {
            ...queryParams
          }
        });
      }, 300);
    },
    toggleSerial() {
      this.isSerial = !this.isSerial;
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
