export default {
  data() {
    return {
      currentPage: 'cardInfo',
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
            this.currentPage = 'addCard';
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
    },
    backPre() {
      if (this.currentPage === 'cardInfo') {
        if (this.showDetail) {
          this.showDetail = false;
          return;
        }
        this.$router.back();
        return;
      }

      if (this.addBankCardStep === 'two') {
        this.step = 'one';
        return;
      }

      if (this.$route.query && this.$route.query.redirect) {
        if (this.$route.query.redirect === "home") {
          this.$router.push('/mobile');
          return;
        } else if (this.$route.query.redirect === "liveStream") {
          this.$router.push('/mobile/liveStream');
          return;
        }
        this.$router.back();
        return;
      }

      this.currentPage = 'cardInfo';
    }
  },
}
