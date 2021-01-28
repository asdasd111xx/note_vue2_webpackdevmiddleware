import Vue from "vue";
import { mapActions } from "vuex";
import axios from "axios";

/**
 * @param {String} current - 當前頁數
 * @param {Number} total - 選擇總頁數
 */
export default {
  data() {
    return {
      isReceive: false,
      showInfinite: true,
      // 目前同 Android
      depthMapping: {
        2: "第二级",
        3: "第三级",
        4: "第四级",
        5: "第五级",
        6: "第六级",
        7: "第七级",
        8: "第八级",
        9: "第九级"
      },
      friendsTrans: {
        1: "会员注册",
        2: "代理注册",
        3: "厅主新增",
        4: "厅主批量"
      },
      firstFriends: {
        depth: 1,
        total: 0,
        list: []
      },
      firstResult: 0,
      maxResults: 50,
      pageNow: 1,
      pageAll: 1,
      showinfo: [-5]
    };
  },

  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    /**
     * 金額格式化
     * @method commaFormat
     * @param {String} value - 金額
     * @returns {String} 格式化後的金額
     */
    commaFormat(value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    /**
     * 日期格式化
     * @method dateFormat
     * @param {Date} value - 日期
     * @param {String} format - 日期格式
     * @returns {String} 格式化後的日期
     */
    dateFormat(value, format = "YYYY/MM/DD HH:mm:ss") {
      return Vue.moment(value)
        .utcOffset(-4)
        .format(format);
    },
    /**
     * 取的一級好友資料
     * @method getFirstFriends
     * @param {Object} params - 排序
     */
    getFirstFriends(params) {
      this.isReceive = false;

      // this.firstFriends = {
      //   depth: 1,
      //   total: 0,
      //   list: []
      // };

      return axios({
        method: "get",
        url: "/api/v1/c/player/friends",
        params: {
          ...params,
          first_result: this.firstResult,
          max_results: this.maxResults
        }
      })
        .then(res => {
          this.isReceive = true;
          const { ret, result, msg, pagination, depth } = res.data;

          if (result !== "ok" || ret.length === 0) {
            return Promise.resolve({ status: "error" });
          }

          this.firstFriends = {
            depth,
            total: pagination.total,
            list: ret
          };

          if (pagination.total === "0") {
            return Promise.resolve({ status: "error" });
          }

          this.pageAll = Math.ceil(+pagination.total / this.maxResults);

          return Promise.resolve({ status: "ok" });
        })
        .catch(error => {
          this.isReceive = true;
          const { msg } = error?.response?.data;
          if (msg) this.actionSetGlobalMessage({ msg });

          return Promise.resolve({ status: "error" });
        });
    },
    /**
     * 會員是否在線
     * @method isOnline
     * @param {Date} lastLogin - 最後登入時間
     * @param {Date} lastOnline - 最後離線時間
     * @returns {Boolean} true or false
     */
    isOnline({ last_login: lastLogin, last_online: lastOnline }) {
      if (!lastLogin) {
        return false;
      }

      if (!lastOnline) {
        return true;
      }

      return lastLogin > lastOnline;
    },
    /**
     * 捲動加載
     * @param {object} $state - 套件提供的方法
     * @see { @link https://peachscript.github.io/vue-infinite-loading/#!/ }
     */
    infiniteHandler($state) {
      // 防止在切換類別的時候馬上觸發捲動加載，造成有遊戲重複出現的情況
      if (this.isReceive) {
        return;
      }

      this.isReceive = true;

      this.getFirstFriends().then(({ result }) => {
        this.isReceive = false;

        if (result !== "ok") {
          return;
        }

        if (this.pageNow + 1 > this.pageAll) {
          $state.complete();
          return;
        }

        this.pageNow += 1;
        this.firstResult += this.maxResults;

        $state.loaded();
      });
    },
    pushing(value) {
      if (this.isShow(value)) {
        let index = this.showinfo.indexOf(value);
        if (index > -1) {
          this.showinfo.splice(index, 1);
        }
      } else {
        this.showinfo.push(value);
      }
    },
    isShow(value) {
      return this.showinfo.find(element => element === value) + 1;
    }
  }
};
