import { mapActions, mapGetters } from "vuex";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  data() {
    return {
      isRevice: false,
      wallet_card: [],
      wallet_cardDetail: {},
      isShowPop: false
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
    getUserWalletList() {
      this.isRevice = false;

      //  C02.241 查詢會員電子錢包
      return goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/User/Virtual/Bank/List`,
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

        this.wallet_card = data.filter((item, index) => index < 15);
      });
    },
    getWalletDetail(info) {
      this.wallet_cardDetail = info;
      this.$emit("update:isAudit", false);
      this.$emit("update:showDetail", true);

      if (info.auditing) {
        this.$emit("update:isAudit", true);
      }
    },
    moveCard() {
      const { address, virtual_bank_id } = this.wallet_cardDetail;

      // 編輯會員電子錢包 C02.240 (取代C02.145)
      goLangApiRequest({
        method: "put",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/User/VirtualBank/Edit`,
        params: {
          lang: "zh-cn",
          oldAddress: address,
          virtualBankId: String(virtual_bank_id),
          common: true
        }
      }).then(response => {
        const { status, errorCode } = response;

        if (errorCode !== "00" || status !== "000") {
          return;
        }

        this.actionSetGlobalMessage({ msg: "移至我的电子钱包 成功" });
        this.getUserWalletList().then(() => {
          // 切換當前頁面狀態
          this.$emit("update:showDetail", false);
          this.$emit("update:editStatus", false);
          this.setPageStatus(1, "walletCardInfo", true);
        });
      });
    },
    onDelete() {
      goLangApiRequest({
        method: "put",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/User/VirtualBank/ApplyDeletePlayer/${this.wallet_cardDetail.id}`,
        params: {
          lang: "zh-cn",
          bankID: this.wallet_cardDetail.id
        }
      }).then(response => {
        const { status, errorCode } = response;

        if (errorCode !== "00" || status !== "000") {
          return;
        }

        this.isShowPop = false;
        this.$emit("update:editStatus", false);

        this.getUserWalletList()
          .then(() => {
            // 更新 wallet_cardDetail
            let temp = this.wallet_card.find(item => {
              return item.id === this.wallet_cardDetail.id;
            });
            this.wallet_cardDetail = temp;
          })
          .then(() => {
            if (this.memInfo.config.manual_delete_bank_card) {
              this.actionSetGlobalMessage({ msg: "删除审核中" });
            } else {
              this.actionSetGlobalMessage({ msg: "刪除成功" });
              this.$emit("update:showDetail", false);
              this.setPageStatus(1, "walletCardInfo", true);
            }
          });
      });
    }
  }
};
