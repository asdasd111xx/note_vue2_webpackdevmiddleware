<template>
  <!-- 團隊管理 -->
  <div v-if="path" :class="[$style['first-friends-table'], $style[themeTPL]]">
    <div
      v-if="!gameRecordPage"
      :class="[
        { [$style['break-crumb']]: firstFriends.depth > 1 },
        { [$style['no-more-friend']]: firstFriends.depth == 1 && searchResult }
      ]"
    >
      <tcenter-label
        v-if="firstFriends.depth < 2 && !searchResult"
        :child-item="allTotalData"
        :change-tab="getTimeRecord"
      />
      <breakcrumb
        v-if="firstFriends.depth >= 2 || searchResult"
        :depth="firstFriends.depth"
        :list="currentSavedFreindList"
        @send-name="clickTargetFriend"
        :search-result="searchResult"
      />

      <custom-date
        v-if="isShowDatePicker"
        :date-range="dateRange"
        @search-date="receiveSearchCustomDate"
        :choose-status="false"
      />
      <!-- 資料列表 -->

      <template
        v-if="firstFriends && firstFriends.list && firstFriends.list.length > 0"
      >
        <div :class="[$style['card-wrap']]">
          <team-manage-card-total
            v-if="!isShowDatePicker && !searchResult"
            :data="manageAllTotalList"
            :change-tab="getTimeRecord"
          />

          <team-manage-card-item
            v-if="!isShowDatePicker && card"
            :search-result="searchResult"
            :card-item-list="teamManageDataList"
            @click-card="enterNextLayer"
            :level="
              $text(
                childLevelTrans[
                  firstFriends.depth == 0
                    ? firstFriends.depth + 1
                    : firstFriends.depth
                ]
              )
            "
            :time-title="timeTitle"
            @go-game-record="enterGameRecord"
          />
        </div>
      </template>

      <div
        v-if="
          firstFriends.list.length === 0 &&
            !isEnterNextLayers &&
            !isShowDatePicker
        "
        :class="$style['no-data-manage-team']"
      >
        <img
          :src="
            $getCdnPath(
              `/static/image/${themeTPL}/mcenter/img_default_no_data.png`
            )
          "
        />
        <p>{{ $text("S_NO_DATA_YET", "暂无资料") }}</p>
      </div>
    </div>

    <!-- 遊戲紀錄 -->
    <div v-if="gameRecordPage">
      <game-record
        :game-record-params="gameRecordParams"
        :time-title="timeTitle"
      />
    </div>

    <infinite-loading
      v-if="showInfinite"
      ref="infiniteLoading"
      @infinite="infiniteHandler"
    >
      <span slot="no-more" />
      <span slot="no-results" />
    </infinite-loading>
  </div>
  <!-- 我的推廣 -->
  <div v-else :class="[$style['first-friends-table'], $style[themeTPL]]">
    <breakcrumb
      v-if="['porn1', 'sg1'].includes(themeTPL) && isEnterNextLayers"
      :depth="firstFriends.depth"
      :list="currentSavedFreindList"
      @click="clickTargetFriend"
    />

    <!-- 資料列表 -->
    <template
      v-if="firstFriends && firstFriends.list && firstFriends.list.length > 0"
    >
      <!-- 鴨博 & 絲瓜 -->
      <div
        v-if="['porn1', 'sg1'].includes(themeTPL)"
        :class="[$style['card-wrap']]"
      >
        <card-total :data="allTotalList" />

        <card-item
          v-for="data in wrappedRenderList"
          :key="data.key"
          :list="data"
          :custom-style="'firstFriend'"
          @click="enterNextLayer"
        />
      </div>
    </template>

    <div
      v-if="firstFriends.list.length === 0 && !isEnterNextLayers"
      :class="$style['no-data']"
    >
      <img src="/static/image/common/mcenter/ic_nodata.png" />
      <p>{{ $text("S_NO_DATA_YET", "暂无资料") }}</p>
    </div>

    <infinite-loading
      v-if="showInfinite"
      ref="infiniteLoading"
      @infinite="infiniteHandler"
    >
      <span slot="no-more" />
      <span slot="no-results" />
    </infinite-loading>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import InfiniteLoading from "vue-infinite-loading";
import firstLevelStatistics from "@/mixins/mcenter/management/firstLevelStatistics";
import breakcrumb from "./components/breakcrumb";
import CardTotal from "./components/cardAllTotal";
import CardItem from "./components/cardItem";
import tcenterLabel from "../../../../../tcenterSame/tcenterLabel";
import teamManageCardItem from "./components/teamManageCardItem";
import gameRecord from "./components/gameRecord";
import customDate from "../../../../../tcenterSame/customDate";
import teamManageCardTotal from "../../../../../tcenterSame/cardAllTotal";

export default {
  props: {
    setTabState: {
      type: Function,
      default: () => {}
    },
    setSubTabState: {
      type: Function,
      default: () => {}
    },
    setHeaderTitle: {
      type: Function,
      default: () => {}
    },
    setBackFunc: {
      type: Function,
      default: () => {}
    }
  },
  components: {
    InfiniteLoading,
    breakcrumb,
    CardTotal,
    CardItem,
    tcenterLabel,
    teamManageCardItem,
    customDate,
    teamManageCardTotal,
    gameRecord,
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      )
  },
  mixins: [firstLevelStatistics],
  data() {
    return {
      isEnterNextLayers: false,
      currentSavedFreindList: [],
      path: this.$route.params.title ?? "",
      pathDay: this.$route.params.item ?? "",

      isShowDatePicker: false,
      title: "firstFriends",
      timeTitle: "",
      gameRecordPage: false, //是否進入遊戲紀錄
      gameRecordParams: { userId: "", startAt: "", endAt: "" }, //遊戲紀錄帶入參數
      searchResult: false, //自訂時間是否搜尋到結果
      saveCustomDate: {}, //儲存自訂的資料
      card: true,
      totalDepth: "",
      friend_name: ""
    };
  },
  created() {
    if (this.path) {
      this.timeTitle = this.startTime;
      this.getTimeRecord(this.allTotalData[0]);
      this.setHeaderTitle(this.$text("S_TEAM_MANAGEMENT", "团队管理"));
    } else {
      this.updateFirstFriends().then(status => {
        if (status === "error") return;

        this.initSavedFriendList();
      });
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    //傳進預設選擇自訂日期區間
    dateRange: {
      get() {
        return { startTime: this.startTime, endTime: this.endTime };
      },
      set(val) {
        return val;
      }
    },
    allTotalList() {
      let strArr = [];
      strArr.push(`笔数：${this.firstFriends.total}`);

      return strArr;
    },
    // 目前 For 鴨博 & 絲瓜: 將資料包裝成陣列來做組件的render
    wrappedRenderList() {
      let data = [];

      // 取决於 this.firstFriends
      //我的推廣 原本資料
      data = this.firstFriends?.list?.map(item => {
        return [
          {
            // 識別用
            key: "username",
            // 顯示用(左)
            alias: item.username,
            // 顯示用(右)
            value:
              item.friend_counts > 0 ? `查看下级(${item.friend_counts}) >` : "",
            // 傳遞給子元件點擊專用
            paramsValue: { id: item.id, alias: item.username },
            isClick: true
          },
          {
            key: "cash_balance",
            alias: "主帐户余额",
            value: this.commaFormat(item.cash.balance)
          },
          {
            key: "status",
            alias: "状态",
            value: this.getStatus(item)
          },
          {
            key: "last_online",
            alias: "最后离线时间",
            value: this.getLastOnline(item)
          },
          {
            key: "register_time",
            alias: "注册时间",
            value: this.dateFormat(item.created_at, "YYYY-MM-DD HH:mm:ss")
          },
          {
            key: "register_method",
            alias: "注册方式",
            value: this.friendsTrans[item.created_by]
          }
        ];
      });

      return data;
    },
    manageAllTotalList() {
      //團隊管理上方資料
      let strArr = [
        {
          name: "总有效投注：",
          item: this.commaFormat(this.firstFriends.alltotal.valid_bet)
        },
        {
          name: "总损益：",
          item: this.commaFormat(this.firstFriends.alltotal.payoff),
          color: this.chooseColor(this.firstFriends.alltotal.payoff)
        },
        {
          name: "充值总额：",
          item: this.commaFormat(this.firstFriends.alltotal.deposit)
        },
        {
          name: "提现总额：",
          item: this.commaFormat(this.firstFriends.alltotal.withdraw)
        },
        { name: "笔数：", item: this.firstFriends.total }
      ];
      return strArr;
    },
    teamManageDataList() {
      let data = [];
      //團隊管理資料
      data = this.firstFriends?.list?.map(info => {
        return {
          title: info.username,
          childTitle:
            this.firstFriends.depth < 5
              ? info.friend_counts > 0
                ? `查看下级(${info.friend_counts})`
                : ""
              : "",
          img: info.friend_counts > 0,
          paramsValue: {
            id: info.id,
            alias: info.username
          },
          isClick: true,
          openButton: true,
          list: [
            {
              name: "总有效投注",
              item: this.commaFormat(info.valid_bet),
              button: true,
              upShow: true
            },
            {
              name: "总损益",
              item: this.commaFormat(info.payoff),
              upShow: true,
              color: this.chooseColor(info.payoff)
            },
            {
              name: "充值总额",
              item: this.commaFormat(info.deposit),
              upShow: true
            },
            {
              name: "提现总额",
              item: this.commaFormat(info.withdraw),
              upShow: true
            },
            {
              name: "主帐户余额",
              item: this.commaFormat(info.cash.balance)
            },
            {
              name: "状态",
              item: this.getStatus(info)
            },
            {
              name: "最后离线时间",
              item: this.getLastOnline(info)
            },
            {
              name: "注册时间",
              item: this.dateFormat(info.created_at, "YYYY-MM-DD HH:mm:ss")
            },
            {
              name: "注册方式",
              item: this.friendsTrans[info.created_by]
            }
          ]
        };
      });
      return data;
    },
    allTotalData() {
      return [
        {
          text: this.$text("S_TODDAY", "今日"),
          name: "today",
          value: 0,
          show: true
        },
        {
          text: this.$text("S_YESTERDAY", "昨日"),
          name: "yesterday",
          value: 1,
          show: true
        },
        {
          text: this.$text("S_THIRTY_DAY", "近30日"),
          name: "month",
          value: 29,
          show: true
        },
        {
          text: this.$text("S_SEARCH_DAY", "搜寻"),
          name: "custom",
          value: 29,
          show: true
        }
      ].filter(item => item.show);
    }
  },
  watch: {
    searchResult(value) {
      if (value) {
        this.setHeaderTitle(this.timeTitle);

        if (this.friend_name) {
          this.setTabState(false);
          this.setBackFunc(() => {
            if (this.firstFriends.depth !== 1) {
              this.firstFriends.depth = 1;
              this.isEnterNextLayers = false;
            }
            this.searchResult = false;
            this.setHeaderTitle(this.$text("S_TEAM_MANAGEMENT", "团队管理"));
            this.setTabState(true);
            this.isShowDatePicker = true;
            this.firstFriends.depth -= 1; //為了可以返回大廳
            this.currentSavedFreindList = [];
          });
        } else {
          this.setBackFunc(() => {
            if (this.firstFriends.depth === 1) {
              this.searchResult = false;

              this.setHeaderTitle(this.$text("S_TEAM_MANAGEMENT", "团队管理"));
              this.setTabState(true);
              this.isShowDatePicker = true;
              this.firstFriends.depth -= 1; //為了可以返回大廳
            } else {
              this.$router.back();
            }
          });
        }
      }
    },
    gameRecordPage(value) {
      if (this.pathDay !== "custom") {
        if (value) {
          this.setBackFunc(() => {
            if (this.gameRecordPage) {
              this.gameRecordPage = false;
              this.firstFriends.depth -= 1;
              //this.setHeaderTitle(this.$text("S_TEAM_MANAGEMENT", "团队管理"));
            } else {
              this.$router.back();
            }
          });
        } else {
          this.setTabState(true);
        }
      }
    },
    "firstFriends.depth"(value) {
      if (value >= 2) {
        this.isEnterNextLayers = true;
        if (!this.path) {
          this.setHeaderTitle(this.depthMapping[value]);
        } else if (!this.gameRecordPage) {
          this.setHeaderTitle("团队报表");
        }

        this.setTabState(false);
        this.setSubTabState(false);

        this.setBackFunc(() => {
          if (this.pathDay === "custom" && this.searchResult) {
            this.gameRecordPage = false;
            this.isEnterNextLayers = false;
            this.card = false;
            this.receiveSearchCustomDate(this.saveCustomDate);
            this.firstFriends.depth -= 1;
          } else if (this.gameRecordPage) {
            this.gameRecordPage = false;
            this.firstFriends.depth -= 1;
          } else {
            if (this.path) {
              //新的團隊報表點進去下一頁返回改成回到一級好友
              this.firstFriends.depth = 1;
              this.setTabState(true);
              this.setSubTabState(true);

              this.getTimeRecord(
                this.allTotalData.find(
                  item => item.name === this.$route.params.item
                )
              );
              this.timeTitle = this.$route.query.time;
              this.setHeaderTitle(this.$text("S_TEAM_MANAGEMENT", "团队管理"));
            } else {
              //選擇的 index 為目前所選的上一個，因需等 API 成功後再執行 remove 的動作，因此減掉2
              const previousIndex = this.currentSavedFreindList.length - 2;
              this.updateFirstFriends({
                friend_id: this.currentSavedFreindList[previousIndex].id
              }).then(status => {
                if (status === "error") return;
                this.removeLastIndexTargets();
              });
            }
          }
        });

        return;
      } else {
        // 上方選項列顯示狀態
        if (!this.gameRecordPage) {
          this.setTabState(true);
          this.setSubTabState(true);
        }
        // 若返回到1級的頁面 or 停留在1級的情況
        this.isEnterNextLayers = false;
        this.searchResult = false;
        // 標題設定
        if (!this.path) {
          this.setHeaderTitle(this.$text("S_TEAM_CENTER", "我的推广"));
        } else {
          this.setHeaderTitle(this.$text("S_TEAM_MANAGEMENT", "团队管理"));
        }

        // 返回鍵事件(同最外層預設一致)
        this.setBackFunc(() => {
          if (this.path) {
            if (this.$route.params.item && this.gameRecordPage) {
              this.setTabState(true);
              this.gameRecordPage = false;
              this.$router.replace(
                "/mobile/mcenter/tcenterManageTeam/firstFriends/custom"
              );
            } else {
              this.$router.back();
            }
          } else {
            if (this.$route.params.date) {
              this.$router.replace("/mobile/mcenter/tcenter/management/member");
            } else {
              this.$router.back();
            }
          }
        });
      }
    }
  },

  methods: {
    /*
     * 點擊下一層級使用
     */
    enterNextLayer(friend) {
      this.searchResult = false;
      this.updateFirstFriends({
        friend_id: friend.id
      }).then(status => {
        if (status === "error") return;

        this.addToSavedFreindList(friend.alias, friend.id);

        // 同步安卓流程用
        if (status === "reload") {
          const previousIndex = this.currentSavedFreindList.length - 2;
          this.updateFirstFriends({
            friend_name: this.friend_name[previousIndex].alias
          }).then(status => {
            if (status === "error") return;

            this.removeLastIndexTargets();
          });
        }
      });
    },
    enterGameRecord(val) {
      this.setHeaderTitle(val.alias);
      this.gameRecordPage = true;
      this.setTabState(false);
      this.gameRecordParams = {
        userId: val.id,
        startAt: Vue.moment(this.startTime).format("YYYY-MM-DD"),
        endAt: Vue.moment(this.endTime).format("YYYY-MM-DD")
      };

      this.totalDepth = this.firstFriends.depth;

      if (this.pathDay == "custom") {
        this.firstFriends.depth += 1;
      } else {
        if (this.firstFriends.depth > 1) {
          this.firstFriends.depth += 1;
        }
      }
    },
    /*
     * 點擊 Breakcrumb 的特定好友
     */
    clickTargetFriend(value) {
      this.updateFirstFriends({ friend_id: value.id }).then(status => {
        if (status === "error") return;

        const removeCount =
          this.currentSavedFreindList.length - 1 - value.index;
        this.removeLastIndexTargets(removeCount);
      });
    },
    /*
     * 初始化遍歷過的好友資料
     */
    initSavedFriendList() {
      this.currentSavedFreindList = [];
      this.currentSavedFreindList.push({
        alias: this.memInfo.user.username
      });
    },
    /*
     * 添加好友資料到儲存的好友列表中
     */
    addToSavedFreindList(alias, id) {
      this.currentSavedFreindList.push({
        alias,
        id
      });
    },
    /*
     * 移除好友列表中 n 個好友資料
     */
    removeLastIndexTargets(removeCount = 1) {
      const totalLength = this.currentSavedFreindList.length - removeCount;

      this.currentSavedFreindList.splice(totalLength);
    },
    getTimeRecord(data) {
      //切換上方時間功能列
      localStorage.removeItem("friend-name");
      this.isShowDatePicker = false;
      this.friend_name = "";

      //自訂義時間區間 顯示上一個的時間區間
      if (data.name != "custom") {
        this.startTime = Vue.moment(this.estToday)
          .add(-data.value, "days")
          .format("YYYY-MM-DD");
        this.endTime = Vue.moment(this.estToday).format("YYYY-MM-DD");

        if (data.name === "yesterday") {
          this.endTime = Vue.moment(this.estToday)
            .add(-data.value, "days")
            .format("YYYY-MM-DD");
        }
      }
      this.setTimeTitle();
      this.searchResult = false;
      this.setTabState(true);
      this.setSubTabState(true);
      if (this.path && this.pathDay != data.name) {
        this.$router.replace({
          params: {
            title: this.title,
            item: `${data.name}`
          },
          query: {
            time: this.timeTitle
          }
        });
        this.pathDay = data.name;
      }

      if (this.pathDay === "custom") {
        this.isShowDatePicker = true;

        return;
      }

      this.updateFirstFriends().then(status => {
        if (status === "error") return;

        this.initSavedFriendList();
      });
    },
    getStatus(info) {
      let str = [];

      info.enable ? str.push("启用") : str.push("停用");
      info.locked ? str.push(" | ", "冻结") : null;
      info.bankrupt ? str.push(" | ", "停权") : null;

      return str;
    },
    getLastOnline(info) {
      if (!info.last_login) {
        return "--";
      } else if (!info.last_login || this.isOnline(info)) {
        return "在线";
      } else {
        return this.dateFormat(info.last_online, "YYYY-MM-DD HH:mm:ss");
      }
    },
    receiveSearchCustomDate(value) {
      this.saveCustomDate = value;

      this.initSavedFriendList();
      //按下自定時間搜尋
      this.startTime = value.inqStart;
      this.endTime = value.inqEnd;
      this.searchResult = false;

      this.friend_name = value.friend_name;
      this.setTimeTitle();

      this.updateFirstFriends({
        friend_name: this.friend_name
      }).then(status => {
        if (status === "error" || status === "reload") {
          this.isShowDatePicker = true;
          this.searchResult = false;
          return;
        }

        if (this.friend_name) {
          this.searchResult = true;
          //為了顯示上方許多好友 把api回傳許多好友帳號存進去
          for (let i = 1; i < this.firstFriends.depth; i++) {
            this.addToSavedFreindList(
              this.firstFriends.friend_chain[i].username,
              ""
            );
          }
        }

        this.card = true;
      });
    },
    chooseColor(val) {
      return val < 0 ? "red" : "black";
    },
    setTimeTitle() {
      if (this.path) {
        if (this.startTime !== this.endTime) {
          this.timeTitle = `${this.startTime} ~ ${this.endTime}`;
        } else {
          this.timeTitle = this.startTime;
        }
      }
    }
  }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
