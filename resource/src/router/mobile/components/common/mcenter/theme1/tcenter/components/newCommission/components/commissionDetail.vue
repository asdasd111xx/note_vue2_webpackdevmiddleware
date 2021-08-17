<template>
  <div :class="$style['commission-detail-page1']">
    <div :class="$style['commission-detail-header']">
      <div :class="$style['header-prev']" @click="onClick">
        <img :src="$getCdnPath(`/static/image/common/btn_back_black.png`)" />
      </div>
      <div :class="[$style['header-title']]">
        {{ title }}
      </div>
    </div>
    <div :class="[$style['total-wrap']]">
      <span>{{
        `总${detailTypeName[detailType]}人数：${formatToPrice(totalCount)}`
      }}</span>
      <span>{{
        `总${detailTypeName[detailType]}金额：${getNoRoundText(totalAmount)}`
      }}</span>
    </div>
    <div :class="[$style['time-range']]">{{ timeTitle }}</div>

    <div v-if="detailPage === 1">
      <div
        v-for="(friend, index) in allLevelFriendArray"
        :key="index"
        :class="[$style['total-friend-warp']]"
      >
        <div :class="[$style['total-friend-title']]">
          <div :class="[$style['title']]">{{ friend.title }}</div>
          <div
            v-if="friend.total_per_depth.total_count != 0"
            :class="[$style['title-next']]"
            @click="setFriendLevel(index)"
          >
            查看
          </div>
        </div>
        <div
          v-if="friend.total_per_depth.total_count != 0"
          :class="[$style['total-friend-count']]"
        >
          <div :class="[$style['count-title']]">
            {{ `${detailTypeName[detailType]}人数` }}
            <br />
            {{ `${detailTypeName[detailType]}金额` }}
          </div>
          <div :class="[$style['count-content']]">
            {{ `${formatToPrice(friend.total_per_depth.total_count)}` }}
            <br />
            {{ `${getNoRoundText(friend.total_per_depth.total_amount)}` }}
          </div>
        </div>
      </div>
    </div>
    <div v-if="detailPage === 2">
      <div
        v-for="(detail, index) in friendDetailArray"
        :key="index"
        :class="[$style['level-friend-warp']]"
      >
        <div :class="[$style['level-friend-title']]">
          <div :class="[$style['title']]">{{ detail.username }}</div>
        </div>
        <div :class="[$style['level-friend-count']]">
          <div :class="[$style['friend-data']]">
            <div :class="[$style['data-name']]">
              上级好友
            </div>
            <div :class="[$style['data-value']]">{{ detail.uppername }}</div>
          </div>
          <div
            v-if="detailType === 'firstDeposit'"
            :class="[$style['friend-data']]"
          >
            <div :class="[$style['data-name']]">
              充值时间
            </div>
            <div :class="[$style['data-value']]">
              {{ EST(detail.first_deposit_at) }}
            </div>
          </div>
          <div
            v-if="detailType === 'firstDeposit'"
            :class="[$style['friend-data']]"
          >
            <div :class="[$style['data-name']]">
              首存金额
            </div>
            <div :class="[$style['data-value']]">
              {{ detail.first_deposit_amount }}
            </div>
          </div>
          <div v-if="detailType === 'hasBet'" :class="[$style['friend-data']]">
            <div :class="[$style['data-name']]">
              有效投注
            </div>
            <div :class="[$style['data-value']]">
              {{ detail.valid_bet_amount }}
            </div>
          </div>
          <div
            v-if="detailType === 'deposit' || detailType === 'withdraw'"
            :class="[$style['friend-data']]"
          >
            <div :class="[$style['data-name']]">
              {{ detailTypeName[detailType] }}金额
            </div>
            <div :class="[$style['data-value']]">
              {{
                detailType === "deposit"
                  ? detail.deposit_amount
                  : detail.withdraw_amount
              }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import { format } from "date-fns";
import goLangApiRequest from "@/api/goLangApiRequest";
import EST from "@/lib/EST";
export default {
  data() {
    return {
      title: "test",
      detailTypeName: {
        firstDeposit: "首存",
        hasBet: "投注",
        deposit: "充值",
        withdraw: "提现"
      },
      totalCount: 0,
      totalAmount: 0,
      detailSelectFriend: 0,
      allLevelFriendArray: [
        {
          title: "一级好友",
          total_per_depth: { total_count: 0, total_amount: 0 }
        },
        {
          title: "二级好友",
          total_per_depth: { total_count: 0, total_amount: 0 }
        },
        {
          title: "三级好友",
          total_per_depth: { total_count: 0, total_amount: 0 }
        },
        {
          title: "四级好友",
          total_per_depth: { total_count: 0, total_amount: 0 }
        },
        {
          title: "五级好友",
          total_per_depth: { total_count: 0, total_amount: 0 }
        }
      ],
      friendDetailArray: []
    };
  },
  props: {
    setDetailPage: {
      type: Function,
      required: true
    },
    detailPage: {
      type: Number,
      default: 0
    },
    detailType: {
      type: String,
      default: "firstDeposit"
    },
    timeTitle: {
      type: String,
      default: ""
    }
  },
  watch: {
    detailPage() {
      if (this.detailPage === 2) {
        this.title = this.allLevelFriendArray[this.detailSelectFriend].title;
        switch (this.detailType) {
          case "firstDeposit":
            this.getAllFriendsDetail(
              "First/Deposit",
              this.detailSelectFriend + 1
            );
            break;
          case "hasBet":
            this.getAllFriendsDetail("Wager", this.detailSelectFriend + 1);
            break;
          case "deposit":
            this.getAllFriendsDetail("Deposit", this.detailSelectFriend + 1);
            break;
          case "withdraw":
            this.getAllFriendsDetail("Withdraw", this.detailSelectFriend + 1);
            break;
          default:
            break;
        }
      } else {
        this.title = `总${this.detailTypeName[this.detailType]}${
          this.detailType === "firstDeposit" || this.detailType === "hasBet"
            ? "人数"
            : "金额"
        }`;
        switch (this.detailType) {
          case "firstDeposit":
            this.getAllFriendsDetail("First/Deposit", 0);
            break;
          case "hasBet":
            this.getAllFriendsDetail("Wager", 0);
            break;
          case "deposit":
            this.getAllFriendsDetail("Deposit", 0);
            break;
          case "withdraw":
            this.getAllFriendsDetail("Withdraw", 0);
            break;
          default:
            break;
        }
      }
    }
  },
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
    }
  },
  created() {
    this.title = `总${this.detailTypeName[this.detailType]}${
      this.detailType === "firstDeposit" || this.detailType === "hasBet"
        ? "人数"
        : "金额"
    }`;
    switch (this.detailType) {
      case "firstDeposit":
        this.getAllFriendsDetail("First/Deposit", 0);
        break;
      case "hasBet":
        this.getAllFriendsDetail("Wager", 0);
        break;
      case "deposit":
        this.getAllFriendsDetail("Deposit", 0);
        break;
      case "withdraw":
        this.getAllFriendsDetail("Withdraw", 0);
        break;
      default:
        break;
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    onClick() {
      // console.log("back");
      // console.log(this.detailPage);
      this.setDetailPage(this.detailPage - 1);
    },
    setFriendLevel(level) {
      this.setDetailPage(2);
      this.detailSelectFriend = level;
    },
    formatToPrice(value) {
      //千分位
      return `${Number(value)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    },
    getNoRoundText(value) {
      //千分位＋小數點後兩位
      return `${Number(value)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    },
    getAllFriendsDetail(url, level) {
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Stats/Player/Friends/${url}/Detail`,
        params: {
          depth: level ? level : 0,
          startAt:
            this.timeTitle.indexOf(" ~ ") === -1
              ? this.timeTitle
              : this.timeTitle.split(" ~ ")[0],
          endAt:
            this.timeTitle.indexOf(" ~ ") === -1
              ? this.timeTitle
              : this.timeTitle.split(" ~ ")[1],
          lang: "zh-cn"
        }
      }).then(response => {
        if (response.status === "000") {
          if (level === 0) {
            let dataKey = "";
            switch (url) {
              case "First/Deposit":
                dataKey = "first_deposit_total";
                break;
              case "Wager":
                dataKey = "wager_total";
                break;
              case "Deposit":
                dataKey = "deposit_total";
                break;
              case "Withdraw":
                dataKey = "withdraw_total";
                break;
            }
            this.totalCount = response.data[dataKey].total_count;
            this.totalAmount = response.data[dataKey].total_amount;

            this.allLevelFriendArray.forEach((element, index) => {
              element.total_per_depth =
                response.data.total_per_depth[index + 1];
            });
          } else {
            this.totalCount = response.data.total_per_depth[level].total_count;
            this.totalAmount =
              response.data.total_per_depth[level].total_amount;
            let dataKey = "";
            switch (url) {
              case "First/Deposit":
                dataKey = "first_deposit_total";
                break;
              case "Wager":
                dataKey = "wager_total";
                break;
              case "Deposit":
                dataKey = "deposit_total";
                break;
              case "Withdraw":
                dataKey = "withdraw_total";
                break;
            }
            this.friendDetailArray = response.data.ret;

            // let testData = [
            //   {
            //     username: "user3",
            //     first_deposit_amount: "10.00",
            //     uppername: "user2",
            //     first_deposit_at: "2021-03-07 15:26:20"
            //   },
            //   {
            //     username: "user3",
            //     first_deposit_amount: "10.00",
            //     uppername: "user2",
            //     first_deposit_at: "2021-03-07 15:26:20",
            //     valid_bet_amount: "23123"
            //   },
            //   {
            //     username: "user3",
            //     first_deposit_amount: "10.00",
            //     uppername: "user2",
            //     first_deposit_at: "2021-03-07 15:26:20",
            //     deposit_amount: "234234"
            //   }
            // ];
            // this.friendDetailArray = testData;
          }
        }
      });
    },
    //轉美東
    EST
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
