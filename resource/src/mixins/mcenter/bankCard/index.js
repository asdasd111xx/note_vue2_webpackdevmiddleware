export default {
  data() {
    return {
      currentPage: 'bankCardInfo',
      showDetailStatus: false,
      editDetailStatus: false,
      step: 'one'
    }
  },
  computed: {
    hasRedirect() {
      // 預設提現銀行卡添加
      const { query } = this.$route;
      let redirect = query.redirect;
      if (redirect && redirect.split('-')[0]) {
        switch (redirect.split('-')[0]) {
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
            this.currentPage = 'addBankCard';
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
    }
  },
}
