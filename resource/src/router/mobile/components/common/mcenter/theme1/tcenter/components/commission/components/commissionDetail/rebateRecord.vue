<template>
  <div :class="$style['record-wrap']">
    <div
      v-if="currentInfo.oauth2 && page == 1"
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
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
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
          item: `总有效投注 ${this.amountFormat(
            this.pageTotal?.valid_bet ?? "0.00"
          )}`
        },
        {
          item: `总损益 ${this.amountFormat(this.pageTotal?.profit ?? "0.00")}`
        },
        {
          item: `笔数 ${this.pagination?.total ?? "0"}`
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
      }, 300);
    },
    rebateDateFormat(date) {
      return Vue.moment(date).format("YYYY-MM-DD");
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
