import axios from "axios";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      isRevice: false,
      bank_card: [],
      bank_cardDetail: {},
      isShowPop: false,

      // 控制詳細頁卡片顏色
      colorRepeatIndex: null
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    getUserBankList() {
      this.isRevice = false;

      // C02.221 回傳銀行卡清單與狀態/查詢會員出款銀行
      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/User/Bank/List`,
        params: {
          lang: "zh-cn",
          common: false
        }
      }).then(response => {
        this.isRevice = true;
        const { data, status, errorCode } = response;

        if (errorCode !== "00" || status !== "000") {
          return;
        }

        this.bank_card = data.filter((item, index) => index < 3);
      });
    },
    onClickDetail(info) {
      this.colorRepeatIndex = index;

      this.bank_cardDetail = info;
      this.$emit("update:isAudit", false);
      this.$emit("update:showDetail", true);

      if (info.auditing) {
        this.$emit("update:isAudit", true);
        return;
      }
    },
    onDelete() {
      this.isRevice = false;

      // 申請刪除會員銀行卡 C02.243
      goLangApiRequest({
        method: "put",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/User/Bank/ApplyDeletePlayer/${this.bank_cardDetail.id}`,
        params: {
          lang: "zh-cn",
          bankID: this.bank_cardDetail.id
        }
      }).then(response => {
        this.isRevice = true;
        this.isShowPop = false;
        this.$emit("update:editStatus", false);

        const { status, errorCode, msg } = response;

        if (errorCode !== "00" || status !== "000") {
          this.actionSetGlobalMessage({ msg: msg });
          return;
        }

        this.getUserBankList()
          .then(() => {
            // 更新 bank_cardDetail
            let temp = this.bank_card.find(item => {
              return item.id === this.bank_cardDetail.id;
            });
            this.bank_cardDetail = temp;
          })
          .then(() => {
            if (this.memInfo.config.manual_delete_bank_card) {
              this.actionSetGlobalMessage({ msg: "删除审核中" });
              switch (this.themeTPL) {
                case "porn1":
                  this.actionSetGlobalMessage({ msg: "银行卡删除审核中" });
                  break;

                case "ey1":
                  this.actionSetGlobalMessage({ msg: "删除审核中" });
                  break;
              }
            } else {
              switch (this.themeTPL) {
                case "porn1":
                  this.actionSetGlobalMessage({ msg: "银行卡刪除成功" });
                  break;

                case "ey1":
                  this.actionSetGlobalMessage({ msg: "刪除成功" });
                  break;
              }
              this.$emit("update:showDetail", false);
              this.setPageStatus(1, "walletCardInfo", true);
            }
          });
      });
    }
  }
};
