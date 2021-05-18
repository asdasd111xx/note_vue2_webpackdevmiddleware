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
        2: "直属新增",
        3: "厅主新增",
        4: "厅主批量",
        5: "代理新增"
      },
      firstFriends: {
        depth: 1,
        total: 0,
        list: []
      },
      firstResult: 0,
      maxResults: 20,
      pageNow: 0,
      pageAll: 0,
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
    initLoadingStatus() {
      this.firstFriends = {
        depth: 1,
        total: 0,
        list: []
      };
      this.pageNow = 0;
      this.pageAll = 0;
    },
    /**
     * 取得一級好友資料
     * @method getFirstFriends
     * @param {Object} params
     */
    getFirstFriends(params, isInitLoadingStatus) {
      return axios({
        method: "get",
        url: "/api/v1/c/player/friends",
        params: {
          first_result: this.firstResult,
          max_results: this.maxResults,
          ...params
        }
      })
        .then(res => {
          const { ret, result, msg, pagination, depth } = res.data;

          if (result !== "ok" || ret.length === 0) {
            this.actionSetGlobalMessage({ msg });
            return Promise.resolve("error");
          }

          this.showInfinite = true;

          if (isInitLoadingStatus) {
            this.initLoadingStatus();
          }

          this.firstFriends = {
            depth,
            total: pagination.total,
            list: [...this.firstFriends.list, ...ret]
          };

          this.pageAll = Math.ceil(+pagination.total / this.maxResults);
          this.pageNow += 1;
          this.firstResult += this.maxResults;

          if (this.pageNow + 1 > this.pageAll) {
            this.showInfinite = false;

            return Promise.resolve("completed");
          }

          return Promise.resolve("loaded");
        })
        .catch(error => {
          const msg = error?.response?.data?.msg;
          const code = error?.response?.data?.code;
          if (msg) {
            this.actionSetGlobalMessage({ msg, code });
          }

          // 好友层数超过可查询上限
          if (code === "C20207") {
            // reload => 重新呼叫 API 使用
            return Promise.resolve("reload");
          }

          return Promise.resolve("error");
        });
    },
    /**
     * 更新好友資料(當查詢好友時觸發此方法)
     * @method updateFirstFriends
     * @param {Object} params
     */
    updateFirstFriends(params) {
      // 不觸發加載
      this.showInfinite = false;

      if (this.firstResult !== 0) {
        this.firstResult = 0;

        params = {
          ...params,
          first_result: this.firstResult
        };
      }

      return this.getFirstFriends(params, true).then(status => {
        return Promise.resolve(status);
      });
    },
    /**
     * 捲動加載
     * @param {object} $state - 套件提供的方法
     * @see { @link https://peachscript.github.io/vue-infinite-loading/#!/ }
     */
    infiniteHandler($state) {
      if (this.isReceive) {
        return;
      }

      this.isReceive = true;

      this.getFirstFriends().then(status => {
        this.isReceive = false;

        if (status === "completed") {
          $state.complete();
          return;
        }

        if (status === "loaded") {
          $state.loaded();
          return;
        }
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
