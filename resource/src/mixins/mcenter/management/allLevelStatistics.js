import { mapGetters, mapActions } from "vuex";
import CommonDate from "@/lib/commonDate";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  props: {
    period: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      date: "",
      levelTrans: {
        1: "S_FIRST_LEVEL_FRIEND",
        2: "S_SECOND_LEVEL_FRIEND",
        3: "S_THIRD_LEVEL_FRIEND",
        4: "S_FOURTH_LEVEL_FRIEND",
        5: "S_FIFTH_LEVEL_FRIEND"
      },
      levelList: [],
      allTotal: {}
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    commonDate() {
      return CommonDate.getDate();
    }
  },
  watch: {
    period() {
      switch (this.period) {
        case "today":
          this.date = [this.commonDate.today_start, this.commonDate.today_end];
          break;

        case "yesterday":
          this.date = [
            this.commonDate.yesterday_start,
            this.commonDate.yesterday_end
          ];
          break;

        case "week":
          this.date = [...this.commonDate.week];
          break;

        case "last":
          this.date = [...this.commonDate.lastWeek];
          break;

        case "thirty":
          this.date = [...this.commonDate.thirty];
          break;

        default:
          break;
      }

      this.getLevelList();
    }
  },
  created() {
    this.date =
      this.themeTPL === "ey1"
        ? [...this.commonDate.week]
        : [this.commonDate.today_start, this.commonDate.today_end];

    this.getLevelList();
  },
  methods: {
    /**
     * 取得各級好友的資訊
     * @method getLevelList
     */
    getLevelList() {
      this.levelList = [];

      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Stats/Player/Friends/TransReport`,
        params: {
          lang: "zh-cn",
          startAt: this.date[0],
          endAt: this.date[1]
        }
      })
        .then(res => {
          const { data, status, errorCode } = res;
          if (status !== "000" || errorCode !== "00") {
            return;
          }

          this.allTotal = {
            total: 0,
            register: 0,
            deposit: 0,
            withdraw: 0
          };

          this.levelList = data.map(info => {
            this.allTotal.total += +info.total;
            this.allTotal.register += +info.register;
            this.allTotal.deposit += +info.deposit;
            this.allTotal.withdraw += +info.withdraw;
            return info;
          });
        })
        .catch(error => {
          const { msg, code } = error.response.data;
          this.actionSetGlobalMessage({
            msg
          });
        });
    }
  }
};
