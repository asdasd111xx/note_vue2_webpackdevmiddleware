<template>
  <!-- 實時返利詳情 -->
  <div :class="$style['detail-wrap']">
    <!-- page1 -->
    <template v-if="routeItem === 'detail'">
      <div>
        <div :class="$style['date-total']">
          <span>{{ `统计至：${filterDate(resultDetail.at)}` }}</span>
        </div>
        <div v-for="(item, index) in detailList" :key="`key-${index}`">
          <div :class="$style['process-bar-wrap']">
            <span :class="$style['process-bar-title']">
              {{ item.name }}
            </span>
            <div :class="$style['process-bar-top']">
              <div>
                <span>{{ "当前" }}</span>
                <span :class="$style['current-num']">{{ item.valid }}</span>
              </div>
              <div :class="$style['total-num']">
                <span>{{ item.next }}</span>
                <div :class="$style['caret-right']">
                  <img
                    :src="$getCdnPath('/static/image/common/ic_caretright.png')"
                    alt="caretright"
                  />
                </div>
              </div>
            </div>
            <div :class="$style['process-bar-line']">
              <div
                :class="$style['process-bar-current-line']"
                :style="{
                  width: `${(item.valid / item.next) * 100}%`
                }"
              ></div>
            </div>

            <div :class="$style['process-bar-bottom']">
              <span>{{ "还差" }}</span>
              <span>{{ item.lack }}</span>
            </div>
          </div>
        </div>
        <div>
          <card-item
            :card-item-list="friendLayerList"
            @click-card="enterNextLayer"
          />
        </div>
      </div>
    </template>
    <!-- page2 -->
    <template v-if="routeItem === 'friend'">
      <div :class="$style['friend-wrap']">
        <div>
          <card-total :data="friendBet" />
        </div>

        <div
          v-if="friendNameList !== undefined && friendNameList.length > 0"
          :class="$style['card-item-wrap']"
        >
          <card-item
            :card-item-list="friendNameList"
            @click-card="enterNextLayer"
          />
        </div>
        <div v-else :class="$style['no-data']">
          <img src="/static/image/_new/mcenter/ic_nodata.png" />
          <p>{{ $text("S_NO_DATA_YET", "暂无资料") }}</p>
        </div>
      </div>
    </template>

    <!-- page3 -->
    <template v-if="routeItem === 'friendGame'">
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
    <rebate-rate
      v-if="isSerial"
      :handle-close="toggleSerial"
      :game-rate-result="gameRateResult"
    />
  </div>
</template>

<script>
import Vue, { nextTick } from "vue";
import { mapGetters, mapActions } from "vuex";
import { getCookie } from "@/lib/cookie";
import goLangApiRequest from "@/api/goLangApiRequest";
import cardItem from "../../../../../../tcenterSame/cardItem";
import cardTotal from "../../../../../../tcenterSame/cardAllTotal";
import rebateRate from "../../../../../../tcenterSame/rebateRate";

export default {
  components: {
    cardItem,
    cardTotal,
    rebateRate
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
    status: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      levelTrans: {
        1: "S_FIRST_LEVEL_FRIEND",
        2: "S_SECOND_LEVEL_FRIEND",
        3: "S_THIRD_LEVEL_FRIEND",
        4: "S_FOURTH_LEVEL_FRIEND",
        5: "S_FIFTH_LEVEL_FRIEND"
      },

      isSerial: false,

      //會員id(entryId)
      memberId: "",

      //第幾層好友
      depth: 1,

      cid: getCookie("cid"),

      //---page1---
      //有效投注金額、会员人数
      resultDetail: [],

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
  created() {
    if (!this.cid && this.loginStatus) {
      return;
    }
  },
  mounted() {
    this.getAllDetailList();
  },
  watch: {
    "$route.params.item": {
      handler: function(item) {
        if (item == "detail") {
          this.setHeaderTitle(this.$text("S_TEAM_REBATE", "返利管理"));
          this.setTabState(true);
        }
        this.routeItem = item;
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    $style() {
      return this[`$style_${this.themeTPL}`] || this.$style_porn1;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    detailList() {
      //page1 有效投注金額、会员人数
      return [
        {
          name: "有效投注金额",
          valid: this.amountFormat(this.resultDetail.valid_bet) ?? "0.00",
          lack:
            this.amountFormat(this.resultDetail.lack_sub_valid_bet) ?? "0.00",
          next:
            this.amountFormat(this.resultDetail.next_sub_valid_bet) ?? "0.00"
        },
        {
          name: "有效会员人数",
          valid: this.amountFormat(this.resultDetail.user_count) ?? "0.00",
          lack:
            this.amountFormat(this.resultDetail.lack_sub_user_count) ?? "0.00",
          next:
            this.amountFormat(this.resultDetail.next_sub_user_count) ?? "0.00"
        }
      ];
    },
    friendLayerList() {
      //page1 好友層
      let data = this.resultFriend?.map(info => {
        return {
          title: this.$text(this.levelTrans[info.depth]),
          childTitle: "查看",
          // 傳遞給子元件點擊專用
          paramsValue: { depth: info.depth },
          isClick: true,
          img: this.status,
          list: [
            {
              name: "有效投注",
              item: this.amountFormat(info.valid_bet),
              show: true
            },
            {
              name: "总损益",
              item: this.amountFormat(info.profit),
              show: true
            },
            {
              name: "有效会员",
              item: this.amountFormat(info.user_count),
              show: true
            },
            {
              name: "上期结转",
              item: info.amount > 0 ? "有" : "",
              show: info.amount > 0
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
          item: `总有效投注 ${this.amountFormat(
            this.friendMemberList?.total?.valid_bet ?? "0.00"
          )}`
        },
        {
          item: `总损益 ${this.amountFormat(
            this.friendMemberList?.total?.profit ?? "0.00"
          )}`
        },
        {
          item: `笔数 ${this.amountFormat(
            this.friendMemberList?.pagination?.total ?? "0.00"
          )}`
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
          item: `总有效投注 ${this.amountFormat(
            this.friendGameList?.total?.valid_bet ?? "0.00"
          )}`
        },
        {
          item: `总损益 ${this.amountFormat(
            this.friendGameList?.total?.profit ?? "0.00"
          )}`
        },
        {
          item: `笔数 ${this.amountFormat(
            this.friendGameList?.pagination?.total ?? "0.00"
          )}`
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
    ...mapActions(["actionSetGlobalMessage"]),
    getStatus(value) {
      return value > 0 ? "red" : "black";
    },
    getAllDetailList() {
      //取得今日實時返利詳情
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Wage/RealTime/Detail`,
        params: {
          lang: "zh-cn",
          cid: this.cid
        }
      }).then(res => {
        if (res && res.status === "000") {
          //有效投注金額、会员人数
          this.resultDetail = res.data.ret ?? [];

          //entryId
          this.memberId = this.resultDetail.id;

          //多層級好友
          this.resultFriend = res.data.layer_detail ?? [];
        }
      });
    },
    getFriendsList(depth) {
      //取得特定期數好友有效投注額及佣金列表
      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Wage/Entry/${this.memberId}/Friends`,
        params: {
          lang: "zh-cn",
          cid: this.cid,
          depth: depth
        }
      })
        .then(res => {
          if (res && res.status === "000") {
            this.friendMemberList = res.data ?? [];
          }
        })
        .catch(error => {
          if (error && error.data && error.data.msg) {
            this.actionSetGlobalMessage(error.data.msg);
          }
        });
    },
    getUserGameList(userid) {
      //取得使用者有效投注平台統計
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Wage/Entry/${this.memberId}/Vendor/Validbet/Report`,
        params: {
          lang: "zh-cn",
          cid: this.cid,
          userId: userid
        }
      }).then(res => {
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
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Wage/Entry/${this.memberId}/Layer/Condition`,
        params: {
          lang: "zh-cn",
          cid: this.cid,
          depth: this.depth
        }
      }).then(res => {
        if (res && res.status === "000") {
          //返利比例
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
    enterNextLayer(friend) {
      //進到下一頁的標題(title) 路徑(next)
      let title = "";
      let next = "";
      switch (this.$route.params.item) {
        default:
        case "detail":
          title = this.$text(this.levelTrans[friend.depth]);
          next = "friend";
          if (this.memberId) {
            this.depth = friend.depth;
            this.getFriendsList(this.depth);
          }
          break;
        case "friend":
          title = friend.user;
          next = "friendGame";
          this.getUserGameList(friend.userid);
          this.getFriendGameRateList();
          break;
      }

      clearInterval(this.timer);
      this.timer = null;
      this.timer = setTimeout(() => {
        this.setHeaderTitle(title);
        this.setTabState(false);
        this.$router.push({
          params: {
            title: this.title,
            item: next
          }
        });
      }, 300);
    },
    toggleSerial() {
      this.isSerial = !this.isSerial;
    },
    amountFormat(value) {
      //小數點後2位+千分位
      return `${Number(value)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    },
    filterDate(date) {
      //取當前時間的整點為主來顯示
      return Vue.moment(date).format("YYYY-MM-DD HH:00:00");
    }
  },
  beforeDestroy() {}
};
</script>

<style lang="scss" src="./css/porn1.detail.scss" module="$style_porn1"></style>
