<template>
  <div :class="$style['record-wrap']">
    <div v-if="currentInfo.oauth2" :class="[$style['profit_wrap']]">
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
    </div>
    <template v-if="pathItem === 'detail'">
      <template v-if="friendLayerList.length > 0">
        <div v-if="page === 1" :class="$style['card-wrap']">
          <div v-if="!currentInfo.oauth2" :class="$style['date-total']">
            <span>{{
              `统计至：${titleDateFormat(currentInfo.period)} ${filterDate}`
            }}</span>
          </div>
          <card-item
            :card-item-list="friendLayerList"
            @click-card="enterNextLayer"
          />
          <div :class="$style.tips">
            如需帮助，请<span
              :class="$style['service-btn']"
              @click="$router.push('/mobile/service')"
              >联系客服</span
            >
          </div>
        </div>
      </template>

      <div
        v-if="page === 2 && !currentInfo.oauth2"
        :class="$style['card-wrap']"
      >
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
      </div>

      <div
        v-if="page === 3 && !currentInfo.oauth2"
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
import { mapGetters } from "vuex";
import InfiniteLoading from "vue-infinite-loading";
import commissionDetail from "@/mixins/mcenter/commission/commissionDetail";
import cardItem from "../../../../../tcenterSame/cardItem";
import cardTotal from "../../../../../tcenterSame/cardAllTotal";
import rebateRate from "../../../../../tcenterSame/rebateRate";
import Vue, { nextTick } from "vue";

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
    }
  },

  data() {
    return {
      pathItem: this.$route.params.item ?? "",
      title: this.$route.params.title ?? "",
      childItem: this.$route.query.next ?? "",
      page: 1,
      isSerial: false
    };
  },
  watch: {
    "$route.query.next"(val) {
      if (val === undefined) {
        this.page = 1;
        this.setHeaderTitle(this.rebateDateFormat(this.currentInfo.period));
      } else if (val === "friends") {
        this.page = 2;
        this.setHeaderTitle(
          this.$text(this.levelTrans[this.$route.query.layer])
        );
      } else if (val === "friendGame") {
        this.page = 3;
      }
    }
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
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
              show: true
            },
            {
              name: "有效会员",
              item: this.amountFormat(info.user_count),
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
          item: `总有效投注 ${this.amountFormat(
            this.pageTotal?.valid_bet ?? "0.00"
          )}`
        },
        {
          item: `总损益 ${this.amountFormat(this.pageTotal?.profit ?? "0.00")}`
        },
        {
          item: `笔数 ${this.amountFormat(this.pagination?.total ?? "0.00")}`
        }
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
    },
    threeAmount() {
      return [
        {
          name: "盈亏返利",
          item: this.amountFormat(this.detailList.amount) ?? ""
        },
        {
          name: "有效会员",
          item: this.amountFormat(this.detailList.valid_user) ?? ""
        },
        {
          name: "有效投注",
          item: this.amountFormat(this.detailList.valid_bet) ?? ""
        },
        {
          name: "总损益",
          item: this.amountFormat(this.detailList.profit) ?? ""
        }
      ];
    }
  },
  filters: {
    amountFormat(amount) {
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  },
  methods: {
    toggleSerial() {
      this.isSerial = !this.isSerial;
    },
    enterNextLayer(friend) {
      //進到下一頁的標題(title) 路徑(next)
      let title = "";
      let next = "";

      switch (this.$route.query.next) {
        default:
          title = this.$text(this.levelTrans[friend.depth]);
          next = "friends";
          this.page = 2;
          this.depth = friend.depth;
          this.getRebateFriends(this.depth);

          break;
        case "friends":
          this.page = 3;
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
        this.$router.push({
          params: {
            title: this.title,
            item: this.pathItem
          },
          query: {
            next: next,
            layer: friend.depth
          }
        });
      }, 200);
    },
    rebateDateFormat(date) {
      return Vue.moment(date).format("YYYY-MM-DD");
    }
  }
};
</script>

<style lang="scss" module>
@import "@/css/variable.scss";

.card-wrap {
  padding: 0 13px;
  .date-total {
    width: 100%;
    padding-bottom: 10px;
    color: $main_text_color3;
    border-bottom: 2px solid #eee;
    padding-top: 10px;
    margin-bottom: 10px;
  }
}

//page2、3
.friend-wrap {
  position: relative;
  top: 10px;
}
.card-item-wrap {
  position: relative;
  top: 10px;
}

.no-data {
  padding-top: 40px;
  text-align: center;

  img {
    display: inline-block;
    width: 60px;
    height: 60px;
    margin-bottom: 14px;
  }

  div {
    font-size: 14px;
    color: #a6a9b2;
  }
}

.rebate-rate {
  height: 25px;
  display: flex;
  justify-content: flex-end;
  color: #6aaaf5;
  padding: 9px 2px;
  text-decoration: underline;
}

.main-table {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;

  thead {
    th {
      background-color: #eee;
      color: #676767;
      font-weight: normal;
      font-size: 12px;
      height: 32px;
      line-height: 32px;
    }

    .index {
      width: 15%;
    }

    .first-level {
      width: 23%;
      cursor: pointer;
    }

    .valid-bet {
      width: 31%;
    }

    // commission 目前先隱藏，到時如果顯示，還需要再調Width
    .commission,
    .profit {
      width: 31%;
    }
  }

  tbody {
    tr {
      background: #fff;

      &:nth-child(even) {
        background: #f6f6f6;
      }
    }

    td {
      color: #2d2d2d;
      font-size: 12px;
      text-align: center;
      height: 39px;
      line-height: 39px;

      > div {
        display: block;
        width: 70%;
        margin: 0 auto;
        text-align: right;
      }

      &:nth-child(3),
      &:nth-child(4) {
        color: #676767;
      }
    }
  }
}

.detail-wrap {
  width: 100%;
  margin-top: 13px;

  // 共用
  .detail {
    display: flex;
    justify-content: space-between;
    line-height: 40px;

    .text {
      flex: 1;
    }
  }

  .rebate-wrap,
  .date,
  .list-wrap {
    padding: 0 15px;
    background: #fff;
  }

  // 細部調整
  .rebate-wrap {
    .detail {
      line-height: 23px;

      &:first-of-type {
        padding-top: 10px;
      }

      &:last-of-type {
        padding-bottom: 10px;
      }
    }
    .text {
      color: #6aaaf5;
    }
  }

  .date {
    background: none;
    color: $main_text_color3;
    font-weight: 700;
    font-size: 16px;
    padding: 0 15px;
    height: 32px;
    line-height: 32px;
  }

  .list-wrap {
    min-height: 300px;

    .text {
      color: $main_text_color2;
    }
  }

  .tips {
    padding: 40px 0;
    color: $main_text_color2;
    font-size: 12px;
    text-align: center;

    .service-btn {
      margin-left: 5px;
      color: #6aaaf5;
    }
  }
}

.tips {
  padding: 40px 0;
  color: $main_text_color2;
  font-size: 12px;
  text-align: center;

  .service-btn {
    margin-left: 5px;
    color: #6aaaf5;
  }
}

//threeAmout
.profit_wrap {
  margin-top: 10px;
  padding: 0 13px;
}
.profit_container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-bottom: 10px;
}

.profit_child {
  width: 47%;
  height: 70px;
  margin: 5px;
  background-color: #fff;
  padding: 10px;
  border-radius: 7px;

  .profit_child_name {
    text-align: left;
    color: #a6a9b2;
  }
  .profit_child_item {
    text-align: right;
    margin-top: 15px;

    &.deficit {
      color: #f00;
    }
  }
}

.profit_child_name::before {
  content: "";
  position: relative;
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 3px;
  background: #be9e7f;
  bottom: 1px;
}

.profit_child_item {
  color: #222222;
  font-size: 18px;
}
</style>
