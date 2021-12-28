<template>
  <div :class="$style['record-wrap']">
    <div
      v-if="
        $route.query.third &&
          $route.query.record &&
          !$route.query.depth &&
          !$route.query.userId
      "
      :class="[$style['profit_wrap']]"
    >
      <div :class="[$style['profit_container']]">
        <div
          v-for="(content, key) in threeAmount"
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
      <div>
        <card-item
          :card-item-list="rebatefriendLayerList"
          @click-card="enterNextLayer"
        />
      </div>
    </div>
    <template v-if="$route.params.item === 'detail'">
      <template v-if="friendLayerList.length > 0">
        <div
          v-if="
            $route.query.record && !$route.query.depth && !$route.query.userId
          "
          :class="$style['card-wrap']"
        >
          <div v-if="!$route.query.third" :class="$style['date-total']">
            <span>{{
              `统计至：${titleDateFormat($route.query.totalTime)}`
            }}</span>
          </div>
          <card-item
            :card-item-list="friendLayerList"
            @click-card="enterNextLayer"
          />
        </div>
      </template>

      <!-- page2 -->
      <div
        v-if="$route.query.depth && !$route.query.userId && !$route.query.third"
        :class="$style['card-wrap']"
      >
        <div
          v-if="friendNameList !== undefined && friendNameList.length > 0"
          :class="$style['friend-wrap']"
        >
          <div>
            <card-total :data="friendBet" />
          </div>
          <div :class="$style['card-item-wrap']">
            <card-item
              :card-item-list="friendNameList"
              @click-card="enterNextLayer"
            />
          </div>
        </div>
        <!-- 盈虧返利Page2 好友名單列表 -->
        <div
          v-if="
            rebatefriendNameList !== undefined &&
              rebatefriendNameList.length > 0
          "
          :class="$style['friend-wrap']"
        >
          <div>
            <card-total :data="rebatefriendBet" />
          </div>
          <div :class="$style['card-item-wrap']">
            <card-item
              :card-item-list="rebatefriendNameList"
              @click-card="enterNextLayer"
            />
          </div>
        </div>
        <div v-else :class="$style['no-data']">
          <img
            :src="$getCdnPath(`/static/image/${themeTPL}/mcenter/no_data.png`)"
          />
          <p>{{ $text("S_NO_DATA_YET", "暂无资料") }}</p>
        </div>
      </div>

      <div
        v-if="$route.query.userId && !$route.query.third"
        :class="$style['card-wrap']"
      >
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
      </div>

      <rebate-rate
        v-if="isSerial"
        :handle-close="toggleSerial"
        :game-rate-result="gameRateResult"
      />
    </template>
  </div>
</template>

<script>
import goLangApiRequest from "@/api/goLangApiRequest";
import { mapGetters } from "vuex";
import InfiniteLoading from "vue-infinite-loading";
import commissionDetail from "@/mixins/mcenter/commission/commissionDetail";
import cardItem from "../../../../../tcenterSame/cardItem";
import cardTotal from "../../../../../tcenterSame/cardAllTotal";
import rebateRate from "../../../../../tcenterSame/rebateRate";
import Vue, { nextTick } from "vue";
import { thousandsCurrency } from "@/lib/thousandsCurrency";

export default {
  components: {
    InfiniteLoading,
    cardItem,
    cardTotal,
    rebateRate
  },
  mixins: [commissionDetail],
  props: {
    setHeaderTitle: {
      type: Function,
      required: true
    },
    currentInfo: {
      type: Object,
      required: true
    },
    setTabState: {
      type: Function,
      default: () => {}
    }
  },

  data() {
    return {
      title: this.$route.params.title ?? "",

      page: 1,
      isSerial: false,
      resultFriend: [],
      friendMemberList: [],
      levelTrans: {
        1: "S_FIRST_LEVEL_FRIEND",
        2: "S_SECOND_LEVEL_FRIEND",
        3: "S_THIRD_LEVEL_FRIEND",
        4: "S_FOURTH_LEVEL_FRIEND",
        5: "S_FIFTH_LEVEL_FRIEND"
      }
    };
  },

  watch: {
    "$route.query": {
      handler: function(item) {
        if (item.record) {
          //page1
          this.setHeaderTitle(
            this.$route.query.type != 0
              ? this.rebateDateFormat(this.$route.query.period)
              : this.$route.query.period
          );
          this.setTabState(true);

          if (this.$route.query.third) {
            // 第三方返利只取第三方返利資料
            this.getDetail();
            this.getLayerDetail();
            return;
          }
          this.getSummary();
        } else if (item.depth && !item.user) {
          //page2
          this.setHeaderTitle(this.$text(this.levelTrans[item.depth]));
          this.setTabState(false);
          this.getRebateFriends();
          this.getLayerFriends();
        } else if (item.user) {
          //page3
          this.setHeaderTitle(item.user);
          this.setTabState(false);
          this.getUserGameList();
          this.getFriendGameRateList();
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters({
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
    //盈虧返利 Page1 好友層
    rebatefriendLayerList() {
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
    //盈虧返利page2 上方標題
    rebatefriendBet() {
      let strArr = [
        {
          name: "上期结转有效投注：",
          item:
            this.friendMemberList?.sub_total?.last_valid_bet > 0
              ? this.formatThousandsCurrency(
                  this.friendMemberList?.total?.last_valid_bet
                )
              : "0.00"
        },
        {
          name: "上期结转损益：",
          item:
            this.friendMemberList?.sub_total?.last_profit > 0
              ? this.formatThousandsCurrency(
                  this.friendMemberList?.total?.last_profit
                )
              : "0.00"
        },
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
    //盈虧返利page2 好友帳號列表
    rebatefriendNameList() {
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
    friendLayerList() {
      //page1 好友層
      let data = this.summaryList?.map(info => {
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
              item: this.amountFormat(info.valid_bet),
              show: true
            },
            {
              name: "损益",
              item: this.amountFormat(info.profit),
              color: this.chooseColor(info.profit),
              show: true
            },
            {
              name: "有效会员",
              item: info.user_count,
              show: true
            }
          ].filter(item => item.show)
        };
      });

      return data;
    },
    friendBet() {
      //page2 上方標題
      let strArr = [
        {
          name: "总有效投注：",
          item:
            this.pageTotal?.valid_bet > 0
              ? this.amountFormat(this.pageTotal.valid_bet)
              : "--"
        },
        {
          name: "总损益：",
          item: this.pageTotal?.profit
            ? this.pageTotal?.profit != 0
              ? this.amountFormat(this.pageTotal.profit)
              : "--"
            : "--",
          color: this.pageTotal?.profit
            ? this.pageTotal?.profit != 0
              ? this.chooseColor(this.pageTotal.profit)
              : ""
            : ""
        },
        { name: "笔数：", item: this.pagination.total ?? "0" }
      ];
      return strArr;
    },
    friendNameList() {
      //page2 好友帳號列表
      let data = this.friendsList?.map(info => {
        return {
          title: info.username,
          childTitle: "查看",
          // 傳遞給子元件點擊專用
          paramsValue: { user: info.username, userid: info.user_id },
          isClick: true,
          img: true,
          list: [
            {
              name: "有效投注",
              item: this.amountFormat(info.valid_bet),
              show: true
            },
            {
              name: "损益",
              item: this.amountFormat(info.profit),
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
              ? this.amountFormat(this.friendGameList.total.valid_bet)
              : "0.00"
        },
        {
          name: "总损益：",
          item: this.friendGameList?.total?.profit
            ? this.friendGameList?.total?.profit != 0
              ? this.amountFormat(this.friendGameList.total.profit)
              : "--"
            : "--",
          color: this.friendGameList?.total?.profit
            ? this.friendGameList?.total?.profit != 0
              ? this.chooseColor(this.friendGameList.total.profit)
              : ""
            : ""
        },
        {
          name: "笔数：",
          item: this.friendGameList?.pagination?.total ?? "0"
        }
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
              item: this.amountFormat(info.valid_bet),
              show: true
            },
            {
              name: "损益",
              item: this.amountFormat(info.profit),
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
    },
    threeAmount() {
      return [
        {
          name: this.$text("S_EXPECTED_REBATE", "预估返利"),
          item: this.amountFormat(this.detailList.amount) ?? "",
          key: "estimate",
          color: this.detailList.amount < 0,
          show: true
        },
        {
          name: this.$text("S_REBATE_LEVEL", "返利级别"),
          item: `${this.detailList.rate || 0}%`,
          key: "level",
          color: false,
          show: false
        },
        {
          name: this.$text("S_ACH_VALID_MEMBERS", "有效会员"),
          item: this.amountFormat(this.detailList.valid_user) ?? "",
          key: "member",
          color: false,
          show: true
        },
        {
          name: this.$text("S_VALID_BET", "有效投注"),
          item: this.amountFormat(this.detailList.valid_bet) ?? "",
          key: "bet",
          color: false,
          show: true
        },
        {
          name: this.$text("S_TOTAL_REBATE", "总损益"),
          item: this.amountFormat(this.detailList.profit) ?? "",
          color: this.detailList.profit,
          key: "level",
          color: false,
          show: true
        },
        {
          name: this.$text("S_SENT_RAKEBACK", "已派返水"),
          item: this.amountFormat(this.detailList.dispatched_rebate),
          key: "sent",
          color: false,
          show: false
        },
        {
          name: this.$text("S_SENT_PROMOTIONS", "已派優惠"),
          item: this.amountFormat(this.detailList.dispatched_offer),
          key: "discount",
          color: false,
          show: false
        },
        {
          name: this.$text("S_MEM_DEPOSIT_2", "會員存款"),
          item: this.amountFormat(this.detailList.deposit),
          key: "deposit",
          color: false,
          show: false
        },
        {
          name: this.$text("S_MEM_WITHDRAW_2", "會員取款"),
          item: this.amountFormat(this.detailList.withdraw),
          key: "withdraw",
          color: this.detailList.withdraw < 0,
          show: false
        },
        {
          name: this.$text("S_PLATFORM_COST", "平台费"),
          item: this.amountFormat(this.detailList.vendor_fee),
          key: "fee",
          color: false,
          show: false
        },
        {
          name: this.$text("S_PREVIOUS_REBATE", "上期结转"),
          item: this.detailList.shift_amount
            ? this.$text("S_HAVE", "有")
            : this.$text("S_NONE", "無"),
          key: "previous",
          color: false,
          show: false
        }
      ].filter(i => i.show);
    }
  },
  filters: {
    amountFormat(amount) {
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
  methods: {
    formatThousandsCurrency(value) {
      return +value ? thousandsCurrency(value) : "0.00";
    },
    //盈虧返利Page1 取得盈歸返利分級好友資料c04.48
    getLayerDetail() {
      let paramData = {
        period: this.$route.query.period,
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

        //單一會員重新計算中
        if (res && res.data.status_code == "22007710") {
          this.actionSetGlobalMessage(res.data.status_message);
        }
      });
    },
    //盈虧返利Page2 取得特定期數好友有效投注額及佣金列表
    getLayerFriends(depth) {
      let paramData = {
        period: this.$route.query.period,
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
    toggleSerial() {
      this.isSerial = !this.isSerial;
    },
    //損益 正紅負黑
    chooseColor(val) {
      return val < 0 ? "red" : "black";
    },
    enterNextLayer(friend) {
      //進到下一頁
      let title = "";
      let queryParams = {};

      //第三層
      if (this.$route.query.depth) {
        title = friend.user;
        queryParams = {
          memberId: this.memberId,
          depth: this.$route.query.depth || this.depth,
          userId: friend.userid,
          user: friend.user
        };
      } else if (!this.$route.query.depth) {
        //第二層
        this.depth = friend.depth;
        queryParams = {
          memberId: this.memberId,
          depth: friend.depth
        };
      }

      clearInterval(this.timer);
      this.timer = null;
      this.timer = setTimeout(() => {
        this.setHeaderTitle(title);
        this.$router.push({
          params: {
            title: this.title
          },
          query: {
            ...queryParams,
            inner: "inner",
            period: this.$route.query.period,
            start_at: this.$route.query.start_at,
            end_at: this.$route.query.end_at,
            oauth2_detail: this.$route.query.oauth2_detail,
            type: this.$route.query.type,
            amount: this.$route.query.amount,
            current_entry_id: this.$route.query.current_entry_id,
            show_detail: this.$route.query.show_detail,
            oauth2: this.$route.query.oauth2
          }
        });
      }, 300);
    },
    rebateDateFormat(date) {
      return Vue.moment(date).format("YYYYMMDD");
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
