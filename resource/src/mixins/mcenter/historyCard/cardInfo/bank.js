import axios from "axios";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      bank_card: [],
      bank_cardDetail: {}
    }
  },
  methods: {
    ...mapActions(['actionSetGlobalMessage']),
    getUserBankList() {
      return axios({
        method: "get",
        url: "/api/v1/c/player/user_bank/list"
      }).then(response => {
        const { ret, result } = response.data;
        this.isRevice = true;
        if (!response || result !== "ok") {
          return;
        }

        this.bank_card = ret.filter((item, index) => index < 3);
      })
    },
    getBankDetail(info) {
      this.bank_cardDetail = info;
      this.$emit("update:showDetail", true);
    },
    removeBankCard() {
      this.actionSetGlobalMessage({ msg: "正在上线 敬请期待" });
      this.$emit("update:editStatus", false);
    }
  },
}
