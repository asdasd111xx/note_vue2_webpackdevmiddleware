export default {
  data() {
    return {
      isReceive: false,

      // Page 相關參數
      currentTab: null,
      currentPage: null,
      isShowTab: null,

      syncStatusList: {
        editDetail: false,
        isAudit: false,
        showDetail: false,
        sameTypeWallet: false
      },

      step: "one"
    };
  },
  computed: {
    hasRedirect() {
      // 預設提現銀行卡添加 & 電子錢包添加
      const { query } = this.$route;
      let redirect = query.redirect;
      let type = query.type;
      if (redirect && redirect.split("-")[0]) {
        switch (redirect.split("-")[0]) {
          case "casino":
          case "deposit":
          case "withdraw":
          case "balanceTrans":
          case "home":
          case "card":
          case "mahjong":
          case "liveStream":
          case "videoPlay":
          case "wallet":
          case "hotLobby":
          case "recharge":
            if (type && type === "bankCard") {
              this.setPageStatus(0, "addBankCard", false);
            }

            if (type && type === "wallet") {
              this.setPageStatus(1, "addWalletCard", false);
            }

            return true;
        }
      }
      return false;
    },
    statusList: {
      get() {
        return this.syncStatusList;
      },
      set({ key, value }) {
        this.syncStatusList[key] = value;
      }
    },
    addBankCardStep: {
      get() {
        return this.step;
      },
      set(value) {
        this.step = value;
      }
    }
  },
  created() {
    if (
      localStorage.getItem("click-notification") &&
      localStorage.getItem("add-bank-form")
    ) {
      this.setPageStatus(0, "addBankCard", false);
    }
  },
  methods: {
    changePage(value) {
      this.currentPage = value;
    },
    goToHistory() {
      this.$router.push("/mobile/mcenter/historyCard");
    }
  }
};
