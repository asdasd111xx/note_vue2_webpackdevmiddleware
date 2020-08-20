export default {
  data() {
    return {
      currentPage: "bankCardInfo",
      editDetailStatus: false,
      isAuditStatus: false,
      showDetailStatus: false,
      step: "one"
    };
  },
  computed: {
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
