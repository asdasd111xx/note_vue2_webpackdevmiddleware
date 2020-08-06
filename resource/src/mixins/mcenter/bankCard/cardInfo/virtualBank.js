import axios from "axios";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      virtualBank_card: [],
      virtualBank_cardDetail: {}
    }
  },
  methods: {
    ...mapActions(['actionSetGlobalMessage']),
    getUserVirtualBankList() {
      return axios({
        method: "get",
        url: "/api/v1/c/player/user_virtual_bank/list"
      }).then(response => {
        console.log(response);
        const { ret, result } = response.data;
        this.isRevice = true;
        if (!response || result !== "ok") {
          return;
        }

        this.virtualBank_card = ret.filter((item, index) => index < 15);
      })
    },
    getVirtualBankDetail(info) {
      this.virtualBank_cardDetail = info
      this.$emit("update:showDetail", true)
    },
  },
}

