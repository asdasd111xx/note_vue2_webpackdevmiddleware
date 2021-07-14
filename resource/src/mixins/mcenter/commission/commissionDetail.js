import { format } from "date-fns";
import ajax from "@/lib/ajax";
import Vue, { nextTick } from "vue";
import { getCookie } from "@/lib/cookie";
import goLangApiRequest from "@/api/goLangApiRequest";
import {
  API_COMMISSION_LEVEL_LIST,
  API_COMMISSION_FIRST_LEVEL_LIST
} from "@/config/api";
import { mapGetters, mapActions } from "vuex";

export default {
  props: {
    currentInfo: {
      type: Object | null,
      required: true
    }
  },
  data() {
    return {
      sort: "",
      order: "",
      levelTrans: {
        1: "S_FIRST_LEVEL_FRIEND",
        2: "S_SECOND_LEVEL_FRIEND",
        3: "S_THIRD_LEVEL_FRIEND",
        4: "S_FOURTH_LEVEL_FRIEND",
        5: "S_FIFTH_LEVEL_FRIEND"
      },
      detailList: null, // 第三方返利資料
      summaryList: [], // 本站返利各級好友資料
      summaryTotal: null, // 本站返利所有好友統計
      friendsList: [], // 本站返利一級好友資料
      pageTotal: null,
      allTotal: null,
      isLoading: false,
      showInfinite: true,
      maxResults: 10, // 每頁限制筆數
      showPage: 0,
      pagination: [],
      cid: getCookie("cid"),
      friendGameList: [],
      gameRateResult: [],
      mainNoData: true
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    controlData() {
      return this.friendsList.filter(
        (item, index) => index < this.maxResults * this.showPage
      );
    },
    filterDate() {
      //取得當前時間 以小時
      //若超過該期的結束區間就會顯示該期的結束區間
      let currentHour = Vue.moment(new Date()).format("HH");
      if (currentHour > 23) {
        return Vue.moment(new Date()).format("23:00:00");
      }
      return Vue.moment(new Date()).format("HH:00:00");
    }
  },
  filters: {
    commaFormat(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    dateFormat(date) {
      const est = format(new Date(date), "yyyy/MM/dd HH:mm:ss+20:00");
      return format(new Date(est), "MM-dd");
    }
  },
  created() {
    // oauth2 = 是否為第三方 (true：第三方，false：本站)
    if (this.currentInfo.oauth2) {
      // 第三方返利只取第三方返利資料
      this.getDetail();
      return;
    }

    this.getSummary();
  },
  methods: {
    /**
     * 本站返利各級好友統計
     */
    getSummary() {
      ajax({
        method: "get",
        url: API_COMMISSION_LEVEL_LIST,
        errorAlert: false,
        params: { period: this.currentInfo.period },
        success: ({ result, ret, total }) => {
          if (result !== "ok") {
            return;
          }

          this.summaryList = ret;
          this.summaryTotal = total;
          this.mainNoData = false;
        }
      });
    },
    /**
     * 本站返利一級好友資料
     */
    getFriends() {
      this.showInfinite = false;
      this.isLoading = true;
      this.showPage = 0;

      const params = {
        // max_results: this.maxResults,
        // first_result: this.firstResult
      };

      if (this.sort !== "") {
        params.sort = this.sort;
        params.order = this.order;
      }

      ajax({
        method: "get",
        url: `${API_COMMISSION_FIRST_LEVEL_LIST}/${this.currentInfo.current_entry_id}/friends`,
        errorAlert: false,
        params,
        success: response => {
          this.showInfinite = true;
          if (response.result !== "ok" || response.ret.length === 0) {
            return;
          }

          this.isLoading = false;
          this.friendsList = response.ret; // 第一級好友佣金資料列表
          this.pageTotal = response.sub_total; // 小計
          this.allTotal = response.total; // 總計
        }
      });
    },
    /**
     * 取得第三方返利資料
     */
    getDetail() {
      ajax({
        method: "get",
        url: `${API_COMMISSION_FIRST_LEVEL_LIST}/${this.currentInfo.current_entry_id}/oauth2/detail`,
        errorAlert: false,
        success: ({ result, ret }) => {
          if (result !== "ok") {
            return;
          }

          this.detailList = ret;
        }
      });
    },
    onSort(sortValue) {
      let orderState = "asc";

      if (this.sort === sortValue) {
        orderState = this.order === "asc" ? "desc" : "asc";
      }

      this.showPage = 1;
      this.sort = sortValue;
      this.order = orderState;

      this.getFriends();
    },
    amountFormat(value) {
      //小數點後2位+千分位
      return `${Number(value)
        .toFixed(2)
        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
    },
    titleDateFormat(value) {
      return Vue.moment(value).format("YYYY-MM-DD");
    },

    /**
     * 捲動加載
     * @param {object} $state - 套件提供的方法
     * @see { @link https://peachscript.github.io/vue-infinite-loading/#!/ }
     */
    infiniteHandler($state) {
      setTimeout(() => {
        if (this.friendsList.length === 0) {
          this.isLoading = false;
          $state.complete();
          return;
        }

        if (this.friendsList.length / this.maxResults > this.showPage) {
          this.showPage += 1;
          $state.loaded();

          if (
            Math.ceil(this.friendsList.length / this.maxResults) ===
            this.showPage
          ) {
            $state.complete();
          }
        }
      }, 300);
    },
    //返利管理-返利紀錄api
    getRebateFriends(depth) {
      //取得特定期數好友有效投注額及佣金列表
      goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Wage/Entry/${this.currentInfo.current_entry_id}/Friends`,
        params: {
          lang: "zh-cn",
          cid: this.cid,
          depth: depth ?? 1
        }
      })
        .then(res => {
          if (res && res.status === "000") {
            this.friendsList = res.data.ret; // 第一級好友佣金資料列表
            this.pageTotal = res.data.sub_total; // 小計
            this.allTotal = res.data.total; // 總計
            this.pagination = res.data.pagination;
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
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Wage/Entry/${this.currentInfo.current_entry_id}/Vendor/Validbet/Report`,
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
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Wage/Entry/${this.currentInfo.current_entry_id}/Layer/Condition`,
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
    }
  }
};
