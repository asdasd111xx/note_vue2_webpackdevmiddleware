<template>
  <div :class="`casino-wrap ${gameTheme}`">
    <template v-for="slotKey in slotSort">
      <!-- kind = 6 麻將特例移除分類 -->
      <template v-if="slotKey === 'label' && kind !== 6">
        <game-label
          :key="`slot-${slotKey}`"
          :is-label-receive="isLabelReceive"
          :label="paramsData.label.toString()"
          :label-data="labelData"
          :change-game-label="changeGameLabel"
        />
      </template>

      <template v-if="slotKey === 'list'">
        <div
          :key="`slot-${slotKey}`"
          :class="[
            [$style['game-item-wrap']],
            { [$style['game-item-mahjong']]: kind === 6 },
            'clearfix'
          ]"
        >
          <div
            :class="$style['jackpot-wrap']"
            :style="{ display: jackpotData ? 'block' : 'none' }"
          >
            <jackpot :vendor="vendor" @setJackpotData="setJackpotData" />
          </div>
          <template>
            <template v-for="(gameInfo, index) in gameData">
              <template v-if="typeof gameInfo.is_secure === 'undefined'">
                <game-item
                  :key="`game-${gameInfo.vendor}-${index}`"
                  :game-info="gameInfo"
                  :show-vendor="gameShowVendor"
                  :show-jackpot="gameShowJackpot"
                  :show-favor="gameShowFavor"
                  :show-button="gameShowButton"
                  :redirect-card="redirectBankCard"
                  :jackpotData="jackpotData"
                />
              </template>
              <template v-else>
                <!-- 活動入口 -->
                <activity-item
                  :key="`game-${gameInfo.vendor}-${index}`"
                  :event-data="gameInfo"
                  :display-type="'game-lobby'"
                />
              </template>
            </template>
            <!-- 捲動加載 -->
            <infinite-loading
              v-if="showInfinite"
              ref="infiniteLoading"
              @infinite="infiniteHandler"
            >
              <span slot="no-more" />
              <span slot="no-results" />
            </infinite-loading>
          </template>
        </div>
      </template>
    </template>
    <template v-if="gameData.length === 0 && isInit">
      <div :class="$style['empty-wrap']">
        <div :class="$style['empty-icon']" />
        <div>{{ $text("S_NO_GAME", "未查询到相关游戏") }}</div>
      </div>
    </template>
    <game-search
      v-if="isShowSearch"
      :text="paramsData.name"
      :set-search-text="setSearchText"
      :update-search-status="updateSearchStatus"
      :game-data="gameData"
      :game-show-vendor="gameShowVendor"
      :game-show-jackpot="gameShowJackpot"
      :game-show-favor="gameShowFavor"
      :game-show-button="gameShowButton"
    />
    <envelope
      v-if="needShowRedEnvelope"
      @closeEvelope="closeEvelope"
      :redEnvelopeData="redEnvelopeData"
    />
  </div>
</template>

<script>
import { gameType, gameList } from "@/config/api";
import { mapGetters, mapActions } from "vuex";
import ajax from "@/lib/ajax";
import goLangApiRequest from "@/api/goLangApiRequest";
import gameItem from "../gameItem";
import gameLabel from "../gameLabel";
import gameSearch from "../gameSearch";
import InfiniteLoading from "vue-infinite-loading";
import jackpot from "./jackpot";
import activityItem from "../activity/components/activityItem";

/**
 * 共用元件 - 手機網頁版電子遊戲頁共用框 (邏輯共用)
 * @param {Array} [slotSort=['search', 'label', 'list']] - slot 的區塊順序調整
 * @param {String} [searchTheme] - 搜尋框組件樣式
 * @param {String} [labelTheme] - 分類項目組件樣式
 * @param {String} [gameTheme] - 遊戲列表(gameItem)的樣式
 * @param {Boolean} [gameShowVendor=true] - 遊戲列表(gameItem)，是否顯示平台名稱
 * @param {Boolean} [gameShowJackpot=false] - 遊戲列表(gameItem)，是否顯示彩金區塊
 * @param {Boolean} [gameShowFavor=true] - 遊戲列表(gameItem)，是否顯示最愛按鈕
 * @param {Boolean} [gameShowButton=true] - 遊戲列表(gameItem)，是否顯示進入遊戲按鈕
 */
export default {
  components: {
    gameSearch,
    gameLabel,
    gameItem,
    InfiniteLoading,
    jackpot,
    activityItem,
    envelope: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/home/redEnvelope"
      )
  },
  props: {
    kind: {
      type: Number,
      default: 3
    },
    slotSort: {
      type: Array,
      default: () => ["search", "label", "jackpot", "list"]
    },
    searchTheme: {
      type: String,
      default: "1"
    },
    labelTheme: {
      type: String,
      default: "porn1"
    },
    gameTheme: {
      type: String,
      default: "porn1"
    },
    gameShowVendor: {
      type: Boolean,
      default: true
    },
    gameShowJackpot: {
      type: Boolean,
      default: false
    },
    gameShowFavor: {
      type: Boolean,
      default: true
    },
    gameShowButton: {
      type: Boolean,
      default: true
    },
    isShowSearch: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isReceive: false,
      isInit: false,
      showInfinite: false,
      isFavorite: false,
      needShowRedEnvelope: false,
      redEnvelopeData: {},
      paramsData: {
        kind: 3,
        label: "hot",
        enable: true,
        firstResult: 0,
        maxResults: 36,
        name: ""
      },
      searchText: "",
      isLabelReceive: false,
      labelData: [
        {
          label: "all",
          name: this.$t("S_ALL")
        },
        {
          label: "activity",
          name: this.$t("S_IN_PROGRESS_ACTIVITY")
        },
        {
          label: "trial",
          name: this.$t("S_GAME_TRIAL")
        },
        {
          label: "new",
          name: this.$t("S_NEW_GAMES")
        },
        {
          label: "hot",
          name: this.$t("S_HOT")
        }
      ],
      isGameDataReceive: false,
      gameData: [],
      activityData: [],
      hasActivity: false,
      jackpotData: null
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      favoriteGame: "getFavoriteGame",
      showRedEnvelope: "getShowRedEnvelope",
      siteConfig: "getSiteConfig",
      trialList: "getTrialList"
    }),
    vendor() {
      return this.$route.params.vendor === "all"
        ? ""
        : this.$route.params.vendor || "";
    },
    // 依平台篩選出最愛的遊戲列表
    favoriteData() {
      if (this.vendor) {
        this.favoriteGame.filter(element => {
          return element.vendor === this.vendor;
        });
      }
      return this.favoriteGame.filter(element => {
        return element.kind === this.paramsData.kind;
      });
    }
  },
  watch: {
    "$route.query.label"() {
      this.$nextTick(() => {
        this.gameData = [];
        this.updateGameData();
        return;
      });
    },

    vendor() {
      this.paramsData.firstResult = 0;

      if (this.$route.params.type) {
        this.paramsData.label = this.$route.params.type;
      }

      this.getGameLabelList();
    },
    isShowSearch() {
      if (this.isShowSearch) {
        this.gameData = [];
        return;
      }
      this.setSearchText("");
    },
    showRedEnvelope() {
      this.needShowRedEnvelope = true;
      this.redEnvelopeData = this.showRedEnvelope;
    }
  },
  created() {
    this.paramsData.kind = this.kind;
    localStorage.removeItem("is-open-game");
    if (this.loginStatus) {
      this.actionSetFavoriteGame(this.vendor);
    }
    this.getActivityList();
    if (this.loginStatus) {
      this.labelData = this.labelData.filter(i => i.label !== "trial");
      return;
    }
    this.actionGetTrialList().then(() => {
      if (!this.trialList.find(i => i.vendor === this.$route.params.vendor)) {
        this.labelData = this.labelData.filter(i => i.label !== "trial");
      }
    });
  },
  methods: {
    ...mapActions([
      "actionSetFavoriteGame",
      "actionSetGlobalMessage",
      "actionGetTrialList"
    ]),
    setJackpotData(data) {
      if (
        data &&
        ((data.jpGrand && data.jpGrand.length > 0) ||
          (data.jpMinor && data.jpMinor.length > 0) ||
          (data.jpUserList && data.jpUserList.length > 0) ||
          data.jpMajor)
      ) {
        this.jackpotData = data;
      }
    },
    redirectBankCard() {
      return `casino-${this.vendor}-${this.paramsData.label}`;
    },

    /**
     * 取得遊戲平台分類
     */
    getGameLabelList() {
      if (!this.hasActivity) {
        this.labelData = this.labelData.filter(i => i.label !== "activity");
      }

      if (!this.isLabelReceive) {
        // 抓取遊戲導覽清單
        ajax({
          method: "get",
          url: `${gameType}?kind=${this.paramsData.kind}&vendor=${this.vendor}`,
          success: response => {
            this.labelData = this.labelData.concat(response.ret);
          }
        }).then(response => {
          if (this.loginStatus) {
            let favData = { label: "favorite", name: this.$t("S_FAVORITE") };
            this.labelData = this.labelData.concat(favData);
          }
          this.isLabelReceive = true;
        });

        if (this.$route.query.label == "favorite") {
          this.isFavorite = "favorite";
          this.paramsData.label = "favorite";
        }
      }

      // if (
      //   !this.labelData
      //     .concat(response.ret)
      //     .some(item => item.label === this.paramsData.label)
      // ) {
      //   this.paramsData.label = "";
      // }

      if (this.$route.query.label) {
        this.paramsData.label = this.$route.query.label;
        return;
      }

      if (this.$route.params.type) {
        this.paramsData.label = this.$route.params.type;
        return;
      }

      this.updateGameData();
    },
    getActivityList() {
      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Vendor/${this.vendor}/Event`,
        params: {
          lang: "zh-cn",
          kind: 3,
          games: true,
          enable: true,
          firstResult: 0,
          maxResults: 100
        }
      })
        .then(res => {
          if (res && res.status === "000") {
            // 1.尚未開始 2.活動預告 3.活動中 4.結果查詢 5.已結束
            // 1,5 不顯示
            if (res.data.ret.events && res.data.ret.events.length > 0) {
              let result = res.data;
              let activityEvents = result.ret.events.filter(
                i => +i.status === 2 || +i.status === 3 || +i.status === 4
              );

              //  入口圖排序【活動中->活動預告->結果查詢】
              if (activityEvents) {
                // 活動中頁籤只顯示活動中
                if (activityEvents.find(i => +i.status == 3)) {
                  this.hasActivity = true;
                }

                result.ret.events = activityEvents.sort((i, j) => {
                  if (i.status === 3) {
                    return 1;
                  }
                  return i.status - j.status > 0 ? 1 : -1;
                });
              }
              this.activityData = result;
            }
          }

          if (res && res.status !== "000") {
            this.actionSetGlobalMessage({
              msg: res.msg,
              code: res.code
            });
          }

          this.getGameLabelList();
          this.updateGameData();
        })
        .catch(error => {
          if (error && error.data && error.data.msg) {
            this.actionSetGlobalMessage(error.data.msg);
          }
        });
    },
    /**
     * 設定搜尋文字
     * @param {string} value - 搜尋的文字
     */
    setSearchText(value) {
      this.paramsData.firstResult = 0;
      this.paramsData.name = value;
      if (this.isShowSearch && !value) {
        this.gameData = [];
        return;
      }
      this.updateGameData();
    },
    /**
     * 設定遊戲分類
     * @param {string} value - 設定的分類
     */
    changeGameLabel(value) {
      if (+value === +this.paramsData.label) {
        return;
      }

      this.isInit = false;
      this.paramsData = {
        ...this.paramsData,
        label: value,
        firstResult: 0
      };

      this.$router.replace({
        query: {
          label: value
        }
      });

      this.isFavorite = value === "favorite";
      this.getActivityList();

      if (this.loginStatus) {
        this.actionSetFavoriteGame(this.vendor);
      }
    },
    /**
     * 重新取得遊戲資料
     */
    updateGameData() {
      this.showInfinite = false;
      this.isGameDataReceive = false;
      this.gameData = [];

      //非搜尋頁面才篩選“最愛”
      if (this.paramsData.label === "favorite" && !this.isShowSearch) {
        setTimeout(() => {
          let activityEvents =
            this.activityData.ret &&
            this.activityData.ret &&
            this.activityData.ret.events
              ? this.activityData.ret.events
              : [];

          if (activityEvents) {
            activityEvents = activityEvents.filter(i => i.status === 3);
          }

          let list = [];
          if (this.paramsData.firstResult === 0) {
            list.push(...activityEvents);
          }
          list.push(...this.favoriteData);
          this.gameData = list;
          this.isInit = true;
        }, 300);
        return;
      }

      setTimeout(() => {
        this.showInfinite = true;
      }, 300);
    },

    closeEvelope() {
      this.needShowRedEnvelope = false;
      this.actionSetGlobalMessage({
        msg: "红包派发中，到帐后即可畅玩游戏"
      });
    },
    /**
     * 捲動加載
     * @param {object} $state - 套件提供的方法
     * @see { @link https://peachscript.github.io/vue-infinite-loading/#!/ }
     */
    infiniteHandler($state, index = 1) {
      // 防止在切換類別的時候馬上觸發捲動加載，造成有遊戲重複出現的情況
      if (this.isReceive) {
        return;
      }

      this.isReceive = true;

      if (index > 3) {
        return;
      }

      let _params = { ...this.paramsData };
      // 進到搜索頁面，Label = '' 為搜索全部
      if (this.isShowSearch) {
        _params = { ..._params, label: "" };
      }

      const gameApiInfo = {
        url: gameList,
        params: {
          ..._params,
          vendor: this.vendor
        }
      };

      new Promise(resolve => {
        goLangApiRequest({
          method: "post",
          url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Games`,
          errorAlert: false,
          params: {
            ...gameApiInfo.params,
            firstResult: _params["firstResult"],
            maxResults: _params["maxResults"]
          }
        }).then(res => {
          if (res && res.status === "000") {
            resolve(res);
            return;
          }

          setTimeout(() => {
            this.isReceive = false;
            this.infiniteHandler($state, index + 1);
          }, 3000);
        });
      }).then(res => {
        let data = res.data;

        // 只顯示is_mobile
        data.ret = data.ret.filter(i => i.is_mobile);

        this.isInit = true;
        const isActivityLabel = this.$route.query.label === "activity";
        const activityGames =
          this.activityData.ret &&
          this.activityData.ret &&
          this.activityData.ret.games
            ? this.activityData.ret.games
            : [];

        let activityEvents =
          this.activityData.ret &&
          this.activityData.ret &&
          this.activityData.ret.events
            ? this.activityData.ret.events
            : [];

        // 活動中頁籤只顯示活動中
        if (isActivityLabel && activityEvents) {
          activityEvents = activityEvents.filter(i => i.status === 3);
        }

        let list = [];
        if (this.paramsData.firstResult === 0) {
          list.push(...activityEvents);
        }

        // 只有活動中的遊戲需要顯示
        if (isActivityLabel) {
          list.push(...activityGames);
        } else {
          this.paramsData.firstResult += +data.ret.length;
          list.push(...data.ret);
        }

        this.gameData.push(...list);
        this.isReceive = false;
        this.isGameDataReceive = true;
        $state.loaded();

        if (isActivityLabel && (!activityGames || activityGames.length === 0)) {
          $state.complete();
          return;
        }

        const total = isActivityLabel
          ? this.activityData.pagination.total
          : data.pagination.total;

        if (+this.gameData.length >= +total) {
          $state.complete();
        }
      });
    },
    updateSearchStatus() {
      this.$emit("update:isShowSearch");
    },
    beforeDestroy() {
      clearTimeout(this.updateGameData);
      clearTimeout(this.infiniteHandler);
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.game-item-wrap {
  margin-top: 45px;
}

.game-item-mahjong {
  margin-top: 30px;
}
.empty-wrap {
  padding-top: 90px;
  color: #a6a9b2;
  font-size: 16px;
  text-align: center;
  height: calc(100vh - 80px);
}

.empty-icon {
  margin: 0 auto 20px;
  width: 62px;
  height: 62px;
  background: url("/static/image/common/search_none.png") 0 0 / contain
    no-repeat;
}

.jackpot-wrap {
  max-width: $mobile_max_width;
  padding-top: 9px;
  padding: 0;
  background: #ededed;
  width: 100%;
  z-index: 5;
  margin-bottom: 5px;
}

@media (orientation: landscape) {
  .jackpot-wrap {
    max-width: $mobile_max_landscape_width !important;
  }
}
</style>
