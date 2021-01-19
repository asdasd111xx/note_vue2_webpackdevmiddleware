import { format, getMonth, getYear, parseISO } from "date-fns";

import { API_COMMISSION_SUMMARY } from "@/config/api";
import ajax from "@/lib/ajax";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      summary: null
    };
  },
  filters: {
    dateFormat(date) {
      return format(new Date(date), "MM/dd");
    }
  },
  computed: {
    ...mapGetters({
      systemTime: "getSystemTime",
      memInfo: "getMemInfo"
    }),
    /**
     * 當前時間
     */
    currentTime() {
      return format(new Date(this.systemTime), "yyyy/MM/dd HH:mm:ss+20:00"); // +20:00 自動減12小時變成美東時間
    },
    /**
     * 當前年份
     */
    currentYear() {
      return getYear(new Date(this.currentTime));
    },
    /**
     * 當前月份
     */
    currentMonth() {
      return getMonth(new Date(this.currentTime)) + 1;
    },
    /**
     * 剩餘天數
     */
    remainderDays() {
      const today = new Date(this.currentTime).getDate();
      const lastDay = new Date(
        this.currentYear,
        this.currentMonth,
        0
      ).getDate();

      return lastDay - today + 1;
    },
    /**
     * 返利是否只使用本站
     */
    rewardOnlyLocal() {
      return (
        this.memInfo.config.wage &&
        this.memInfo.config.wage.length === 1 &&
        this.memInfo.config.wage[0] === "local"
      );
    },
    /**
     * 收益慨況標題
     */
    summaryTitle() {
      if (!this.summary) {
        return [];
      }

      const trans = {
        today: this.$text("S_GOT_TODAY", "今日已领"),
        yesterday: this.$text("S_GOT_YESTERDAY", "昨日已领"),
        monthly: this.$text("S_GOT_MONTH", "本月已領"),
        expected: this.$text("S_EXPECTED_REBATE", "预估返利")
      };

      // 08/28: 如果有需要判斷本站或第三方，才把註解拿掉
      const sort = this.rewardOnlyLocal
        ? ["today", "yesterday", "monthly"]
        : ["today", "yesterday", "expected"];

      // 因 Android & iOS 寫死，固定回傳第三方資料
      // const sort = ["today", "yesterday", "expected"];

      return sort.map(key => ({
        key,
        text: trans[key],
        amount: this.summary[key].amount || "--"
      }));
    },
    /**
     * 收益慨況內容
     */
    summaryContent() {
      if (!this.summary) {
        return [];
      }

      // 08/28: 如果有需要判斷本站或第三方，才把註解拿掉
      const sort = this.rewardOnlyLocal
        ? ["today", "yesterday", "monthly"]
        : ["today", "yesterday", "expected"];
      // 2021-01-13
      /**
       *  DSN-Cindy 編輯 2021/1/8 下午 06:54 [Revised 2021/1/8] 編輯
       * 【補充說明】
      今日已領 :
      只要今日有領取投注或盈虧返利時，顯示【XX返利+金額】  例. 投注返利  100.00
      不需與後台開關連動；兩者都無數值時，顯示暫無資料

      昨日已領 :
      只要昨日有領取投注或盈虧返利時，顯示【XX返利+金額】  例. 投注返利  100.00
      不需與後台開關連動；兩者都無數值時，顯示暫無資料
       */
      const text = this.$text("S_BET_REBATE", "投注返利");
      const oauthText = this.$text("S_LOSS_REBATE", "盈亏返利");
      const wage = this.rewardOnlyLocal ? "local" : "oauth2";

      // const sort = ["today", "yesterday", "expected"];
      // const text = "";
      // const oauthText = "";
      // const wage = "oauth2";

      return sort.map(key => {
        // 預估返利(第三方)
        if (key === "expected") {
          return {
            key,
            ...this.summary[key],
            start_at: format(
              parseISO(this.summary[key].start_at),
              "yyyy/MM/dd HH:mm:ss+20:00"
            ),
            end_at: format(
              parseISO(this.summary[key].end_at),
              "yyyy/MM/dd HH:mm:ss+20:00"
            )
          };
        }

        const oauthAmount = this.summary[key].wage.oauth2 || "";

        if (key === "monthly") {
          return {
            key,
            text,
            amount: this.summary[key].wage[wage] || "",
            oauthText,
            oauthAmount: oauthText ? oauthAmount : "",
            start_at: new Date(this.currentYear, this.currentMonth - 1, 1),
            end_at: new Date(this.currentYear, this.currentMonth, 0)
          };
        }

        return {
          key,
          text,
          amount: this.summary[key].wage.local || "",
          oauthText,
          oauthAmount: oauthText ? oauthAmount : ""
        };
      });
    }
  },
  created() {
    this.getSummary();
  },
  methods: {
    /**
     * 取得收益概況
     */
    getSummary() {
      ajax({
        method: "get",
        url: API_COMMISSION_SUMMARY,
        success: ({ result, ret }) => {
          if (result !== "ok") {
            return;
          }

          this.summary = ret;
        }
      });
    }
  }
};
