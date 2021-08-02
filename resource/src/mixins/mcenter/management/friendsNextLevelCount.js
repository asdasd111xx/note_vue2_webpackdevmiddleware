import goLangApiRequest from "@/api/goLangApiRequest";
import { getCookie, setCookie } from "@/lib/cookie";

import Vue from "vue";
export default {
  data() {
    return {
      startTime: "",
      endTime: "",
      friendsStatistics: null,
      estToday: new Date(),
      totalDepth: [], //幾級好友統計人數
      pagination: [], //總筆數
      friendList: [], //詳細好友資料,
      depth: 1,
      levelTrans: {
        1: "S_FIRST_LEVEL_FRIEND",
        2: "S_SECOND_LEVEL_FRIEND",
        3: "S_THIRD_LEVEL_FRIEND",
        4: "S_FOURTH_LEVEL_FRIEND",
        5: "S_FIFTH_LEVEL_FRIEND"
      }
    };
  },
  created() {
    this.startTime = Vue.moment(this.estToday).format("YYYY-MM-DD 00:00:00");
    this.endTime = Vue.moment(this.estToday).format("YYYY-MM-DD 23:59:59");
  },
  mounted() {},
  computed: {
    allTotalData() {
      return [
        {
          text: "今日注册",
          name: "today-register",
          value: 0,
          key: "register",
          show: true
        },
        {
          text: "本月注册",
          name: "month-register",
          value: 0,
          key: "register",
          show: true
        },
        {
          text: "今日活跃",
          name: "totay-live",
          value: 0,
          key: "login",
          show: true
        },
        {
          text: "7日未登入",
          name: "no-login",
          value: 6,
          key: "login",
          show: true
        }
      ].filter(item => item.show);
    }
  },
  methods: {
    getNextLevelList() {
      //回傳下級好友報表(最多查詢層數為廳設定的好友級數)

      let cid = getCookie("cid");
      if (!cid && this.loginStatus) {
        return;
      }

      let params = {
        startAt: Vue.moment(this.startTime).format("YYYY-MM-DD 00:00:00"),
        endAt: Vue.moment(this.endTime).format("YYYY-MM-DD 23:59:59")
      };

      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/Friends/Report`,
        params: {
          ...params,
          cid: cid,
          //好友統計類別（login 登入資料，register 註冊資料，預設抓取註冊資料）
          type: this.currentDate.key,
          lang: "zh-cn",
          depth: this.depth
        }
      }).then(res => {
        if (res && res.status === "000" && res.errorCode === "00") {
          this.totalDepth = res.data.total_per_depth ?? [];
          this.pagination = res.data.pagination ?? [];
          this.friendList = res.data.ret ?? [];
        }
        return;
      });
    }
  }
};
