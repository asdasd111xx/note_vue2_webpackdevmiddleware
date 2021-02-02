<template>
  <div :class="$style['game-record']">
    <slot
      :inq-1st="inq1st"
      :inq-2nd="inq2nd"
      :has-search="hasSearch"
      :search-tabs="searchTabs"
      :current-condition="currentCondition"
      :game-list="gameList"
      :current-page="currentPage"
      :change-search-condition="changeSearchCondition"
      :on-search="onSearch"
      :on-search-bet="onSearchBet"
      :show-infinite="showInfinite"
      :infinite-handler="infiniteHandler"
      :control-1st-data="control1stData"
      :control-2nd-data="control2ndData"
      :mainNoData="mainNoData"
    />
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import EST from "@/lib/EST";
import gameName from "@/lib/game_name";
import ajax from "@/lib/ajax";
import * as apis from "@/config/api";
import bbosRequest from "@/api/bbosRequest";

export default {
  props: {
    inqVendor: {
      type: String,
      required: true
    },
    inqKind: {
      type: Number,
      required: true
    },
    inqStart: {
      type: String,
      required: true
    },
    inqEnd: {
      type: String,
      required: true
    },
    setHeaderTitle: {
      type: Function,
      required: true
    },
    setTabState: {
      type: Function,
      required: true
    }
  },
  data() {
    return {
      hasSearch: false,
      currentCondition: "today",
      currentPage: "", // 當前所呈現的頁面內容
      selectedUser: "", // 第一層所選擇的使用者
      currentAcc: "",
      currentVendor: "",
      currentKind: 0,
      currentStart: "",
      currentEnd: "",
      inq1st: {
        list: [],
        total: {},
        counts: null
      },
      inq2nd: {
        list: [],
        total: {},
        counts: null
      },
      isLoading: false,
      showInfinite: true,
      mainNoData: true,
      maxResults: {
        main: 10,
        bet: 10
      },
      showPage: {
        main: 0,
        bet: 0
      }
    };
  },
  computed: {
    ...mapGetters({
      gameData: "getGameData",
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo"
    }),
    searchTabs() {
      return [
        {
          key: "range",
          name: this.$text("S_SEARCH_FOR", "搜索")
        },
        {
          key: "today",
          name: this.$text("S_TODDAY", "今日")
        },
        {
          key: "yesterday",
          name: this.$text("S_YESTERDAY", "昨日")
        }
      ];
    },
    gameList() {
      return [
        { value: "", text: this.$text("S_ALL") },
        ...Object.keys(this.gameData)
          .filter(key => this.gameData[key].switch === "Y")
          .reduce((init, key) => {
            // 過濾重複的 vendor
            if (init.some(info => info.value === this.gameData[key].vendor)) {
              return init;
            }

            return [
              ...init,
              {
                value: this.gameData[key].vendor,
                text: gameName(this.gameData[key].vendor)
              }
            ];
          }, [])
      ];
    },
    control1stData() {
      return this.inq1st.list.filter(
        (item, index) => index < this.maxResults.main * this.showPage.main
      );
    },
    control2ndData() {
      return this.inq2nd.list.filter(
        (item, index) => index < this.maxResults.bet * this.showPage.bet
      );
    }
  },
  watch: {
    // eslint-disable-next-line
    "$route.params.page": {
      handler(newValue) {
        this.currentPage = newValue;

        switch (newValue) {
          case "main":
            this.showInfinite = false;
            this.setTabState(true);
            this.setHeaderTitle(this.$text("S_TEAM_CENTER", "我的推广"));
            break;
          case "bet":
            this.setTabState(false);
            this.setHeaderTitle(this.selectedUser);
            break;
          default:
            break;
        }
      },
      immediate: true
    },
    currentCondition(changeIndex) {
      this.changeSearchCondition(changeIndex);
    }
  },
  created() {
    this.currentVendor = this.inqVendor;
    this.currentKind = this.inqKind;
    this.currentStart = this.inqStart;
    this.currentEnd = this.inqEnd;

    this.onInquire();
  },
  methods: {
    changeSearchCondition(value) {
      this.inq1st = {
        list: [],
        total: {},
        counts: null
      };
      this.currentCondition = value;
      this.hasSearch = value === "range";

      const now = EST(new Date(), "", true);
      const range = value === "today" || value === "range" ? 0 : -1;
      const date = Vue.moment(now)
        .add(range, "days")
        .format("YYYY-MM-DD");

      this.$emit("update:inqVendor", "");
      this.$emit("update:inqKind", 0);
      this.$emit("update:inqStart", date);
      this.$emit("update:inqEnd", date);

      this.currentVendor = this.inqVendor;
      this.currentKind = this.inqKind;
      this.currentStart = date;
      this.currentEnd = date;

      if (value === "range") {
        // 選項欄文字預設 設回「全部」
        let o = document.body.getElementsByTagName("option");
        o[0].selected = true;
        return;
      }

      this.onInquire();
    },
    onSearch() {
      this.currentVendor = this.inqVendor;
      this.currentStart = this.inqStart;
      this.currentKind = this.inqKind;
      this.currentEnd = this.inqEnd;
      this.onInquire();
    },
    onInquire() {
      this.showInfinite = false;
      this.isLoading = true;
      this.showPage.main = 0;

      let _params = {};

      if (this.currentVendor && this.currentKind) {
        _params = {
          vendor: this.currentVendor,
          kind: this.currentKind
        };
      }

      ajax({
        method: "get",
        url: apis.API_FRIEND_WAGER_REPORT,
        params: {
          ..._params,
          start_at: Vue.moment(this.currentStart).format(
            "YYYY-MM-DD 00:00:00-04:00"
          ),
          end_at: Vue.moment(this.currentEnd).format(
            "YYYY-MM-DD 23:59:59-04:00"
          ),
          sort: "payoff",
          order: "asc"
        },
        success: response => {
          if (response.result === "ok") {
            this.hasSearch = false;
            this.$router.push({ params: { page: "main" } });

            this.showInfinite = true;
            if (response.ret.length === 0) {
              this.inq1st = {
                list: [],
                total: {},
                counts: null
              };
              this.mainNoData = true;
              return;
            }

            this.isLoading = false;
            this.inq1st = {
              list: response.ret,
              total: response.total,
              counts: Number(response.pagination.total)
            };
            this.mainNoData = false;
          }
        }
      });
    },
    onSearchBet(username) {
      //if (username === this.selectedUser)   return;
      this.selectedUser = username;
      this.onInquireBet();
    },
    onInquireBet() {
      this.showInfinite = false;
      this.isLoading = true;
      this.showPage.bet = 0;

      let _params = {};

      if (this.currentVendor && this.currentKind) {
        _params = {
          vendor: this.currentVendor,
          kind: this.currentKind
        };
      }

      bbosRequest({
        method: "get",
        url:
          this.siteConfig.BBOS_DOMIAN +
          "/Stats/Player/Friends/WagerReport/ByDayGame",
        reqHeaders: {
          Vendor: this.memInfo.user.domain
        },
        params: {
          lang: "zh-cn",
          username: this.selectedUser,
          startAt: Vue.moment(this.currentStart).format(
            "YYYY-MM-DD 00:00:00-04:00"
          ),
          endAt: Vue.moment(this.currentEnd).format(
            "YYYY-MM-DD 23:59:59-04:00"
          ),
          ..._params
        }
      })
        .then(response => {
          if (response.status === "000") {
            this.$router.push({ params: { page: "bet" } });
            this.showInfinite = true;

            if (response.data.ret.length === 0) {
              this.inq2nd = {
                list: [],
                total: {},
                counts: null
              };
              return;
            }

            this.isLoading = false;
            this.inq2nd = {
              list: response.data.ret,
              total: response.data.total,
              counts: Number(response.data.pagination.total)
            };
          }
        })
        .then(() => {
          // 整理 inq2nd.list => 將以日期區分資料
          let result = [];
          let dateArr = [];
          this.inq2nd.list.map(item => {
            if (dateArr.includes(item.day)) {
              result.find(i => i.day === item.day).list.push({ ...item });
            } else {
              dateArr.push(item.day);
              result.push({
                day: item.day,
                list: [{ ...item }]
              });
            }
          });

          this.inq2nd.list = result;
        });
    },
    /**
     * 捲動加載
     * @param {object} $state - 套件提供的方法
     * @see { @link https://peachscript.github.io/vue-infinite-loading/#!/ }
     */
    infiniteHandler($state) {
      setTimeout(() => {
        switch (this.currentPage) {
          case "main":
            if (this.inq1st.list.length === 0) {
              this.isLoading = false;
              $state.complete();
              return;
            }

            if (
              this.inq1st.list.length / this.maxResults.main >
              this.showPage.main
            ) {
              this.showPage.main += 1;
              $state.loaded();

              if (
                Math.ceil(this.inq1st.list.length / this.maxResults.main) ===
                this.showPage.main
              ) {
                $state.complete();
              }
            }
            break;

          case "bet":
            if (this.inq2nd.list.length === 0) {
              this.isLoading = false;
              $state.complete();
              return;
            }

            if (
              this.inq2nd.list.length / this.maxResults.bet >
              this.showPage.bet
            ) {
              this.showPage.bet += 1;
              $state.loaded();

              if (
                Math.ceil(this.inq2nd.list.length / this.maxResults.bet) ===
                this.showPage.bet
              ) {
                $state.complete();
              }
            }
            break;

          default:
            break;
        }
      }, 300);
    }
  }
};
</script>

<style lang="scss" module>
.game-record {
  position: relative;
}
</style>
