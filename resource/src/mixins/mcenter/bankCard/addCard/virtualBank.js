import axios from "axios";
import { mapGetters, mapActions } from "vuex";

export default {
  data() {
    return {
      vBankList: [],
      currentVBank: "",
      isShowPop: false,
      formData: {
        walletAddress: "",
        bank_id: "",
        cgpPwd: ""
      },
      walletAddressTips: "",
      errorMsg: "",
      lockStatus: false,
      msg: ""
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    })
  },
  created() {
    ajax({
      method: "get",
      url: "/api/payment/v1/c/withdraw/bank/list",
      errorAlert: false
    }).then(response => {
      if (!response || response.result !== "ok") {
        return;
      }

      this.vBankList = response.ret;
    });
  },
  methods: {
    ...mapActions(["actionSetUserdata"]),
    sendData() {
      if (this.lockStatus) {
        return;
      }

      this.lockStatus = true;

      const params = {
        ...this.formData
      };

      ajax({
        method: "post",
        url: "/api/v1/c/player/user_bank",
        errorAlert: false,
        params,
        success: () => {
          this.msg = "绑定成功";
          this.lockStatus = false;
          if (!this.memInfo.user.name) {
            this.actionSetUserdata(true);
          }
        },
        fail: error => {
          this.lockStatus = false;
          this.errorMsg = error.data.msg;
        }
      });
    },
    clearMsg() {
      const { query } = this.$route;
      if (!this.msg.includes("绑定成功")) {
        this.msg = "";
        return;
      }

      // 綁定成功後添加成功後回到遊戲 影片
      this.msg = "";
      let redirect = query.redirect;
      if (!redirect) {
        this.changePage("virtualBankCardInfo");
        return;
      }

      let split = redirect.split("-");
      if (split.length === 2) {
        this.$router.push(`/mobile/${split[0]}/${split[1]}`);
        return;
      }

      // 有分類的遊戲大廳 card casino
      if (split.length === 3) {
        this.$router.push(`/mobile/${split[0]}/${split[1]}?label=${split[2]}`);
        return;
      }

      switch (redirect) {
        case "deposit":
          this.$router.push(`/mobile/mcenter/deposit`);
          return;
        case "wallet":
          this.$router.push(`/mobile/mcenter/wallet`);
          return;
        case "withdraw":
        case "balanceTrans":
          this.$router.push(`/mobile/mcenter/${redirect}`);
          return;
        case "liveStream":
        case "home":
          this.$router.push(`/mobile/${redirect}`);
          return;
        default:
          this.changePage("virtualBankCardInfo");
          return;
      }
    },
    setBank(bank) {
      this.isShowPop = false;
      this.formData.bank_id = bank.id;
      this.currentVBank = bank.name;
    },
    verifyNumber(e) {
      const regex = /^[0-9]+$/;
      if (!regex.test(e.key)) {
        e.preventDefault();
      }
    },
    getBankImage(swiftCode) {
      return {
        src: `https://images.dormousepie.com/icon/bankIconBySwiftCode/${swiftCode}.png`,
        error: this.$getCdnPath(
          "/static/image/_new/default/bank_default_2.png"
        ),
        loading: this.$getCdnPath(
          "/static/image/_new/default/bank_default_2.png"
        )
      };
    }
  }
}
