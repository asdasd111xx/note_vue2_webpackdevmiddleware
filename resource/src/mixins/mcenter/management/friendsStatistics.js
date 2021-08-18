import { API_MANAGEMENT_FRIENDS_STATISTICS } from "@/config/api";
import ajax from "@/lib/ajax";
import { throws } from "assert";

export default {
  data() {
    return {
      friendsStatistics: null,
      moneyPerson: 0,
      isZero: false
    };
  },
  created() {
    this.getMemberStatistics();
  },
  methods: {
    /**
     * 取得會員統計資訊
     * @method getMemberStatistics
     */
    getMemberStatistics() {
      ajax({
        method: "get",
        url: API_MANAGEMENT_FRIENDS_STATISTICS,
        success: ({ result, ret }) => {
          if (result !== "ok") {
            return;
          }

          this.friendsStatistics = ret;
          if (
            this.friendsStatistics.deposit === "0.00" &&
            this.friendsStatistics.withdraw === "0.00"
          ) {
            this.isZero = true;
            this.moneyPerson = 100;
          } else {
            this.isZero = false;
            this.moneyPerson =
              (Number(this.friendsStatistics.deposit) /
                (Number(this.friendsStatistics.deposit) +
                  Number(this.friendsStatistics.withdraw))) *
              100;
          }
          // console.log(this.moneyPerson);
          // this.isZero = false;
          // this.moneyPerson =
          //   (Number("150.00") / (Number("150.00") + Number("319.00"))) * 100;
        }
      });
    }
  }
};
