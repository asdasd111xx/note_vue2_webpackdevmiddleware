export default {
  data() {
    return {
      currentPage: "bankCardInfo",
      editDetailStatus: false,
      isAuditStatus: false,
      showDetailStatus: false,
      step: "one",
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
            this.isShowTab = false;

            if (type && type === 'bankCard') {
              this.currentPage = "addBankCard";
            }

            if (type && type === 'wallet') {
              this.currentPage = "addWalletCard";
            }

            return true;
        }
      }
      return false;
    },
    showDetail: {
      get() {
        return this.showDetailStatus;
      },
      set(value) {
        this.showDetailStatus = value;
      }
    },
    editStatus: {
      get() {
        return this.editDetailStatus;
      },
      set(value) {
        this.editDetailStatus = value;
      }
    },
    isAudit: {
      get() {
        return this.isAuditStatus;
      },
      set(value) {
        this.isAuditStatus = value;
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
  methods: {
    changePage(value) {
      this.currentPage = value;
    },
    changeToHistory() {
      this.$router.push('/mobile/mcenter/historyCard');
    }
  }
};
