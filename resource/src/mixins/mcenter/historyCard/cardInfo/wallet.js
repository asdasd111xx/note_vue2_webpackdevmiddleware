import axios from "axios";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      isRevice: false,
      wallet_card: [],
      wallet_cardDetail: {},
      isShowPop: false
    }
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
    },
  },
  methods: {
    ...mapActions(['actionSetGlobalMessage']),
    getUserWalletList() {
      this.isRevice = false;

      return axios({
        method: "get",
        url: "/api/v1/c/player/user_virtual_bank/list",
        params: {
          common: false
        }
      }).then(response => {
        const { ret, result } = response.data;
        this.isRevice = true;

        if (!response || result !== "ok") {
          return;
        }

        this.wallet_card = ret.filter((item, index) => index < 15);
      })
    },
    getWalletDetail(info) {
      this.wallet_cardDetail = info;
      this.$emit('update:isAudit', false)
      this.$emit("update:showDetail", true);

      if (info.auditing) {
        this.$emit('update:isAudit', true);
      }
    },
    moveCard() {
      const { address, payment_gateway_id } = this.wallet_cardDetail;

      axios({
        method: "put",
        url: "/api/v1/c/player/user_virtual_bank",
        data: {
          old_address: address,
          payment_gateway_id: String(payment_gateway_id),
          common: true
        }
      }).then(response => {
        const { result } = response.data;
        if (!response || result !== 'ok') {
          return;
        }

        this.actionSetGlobalMessage({ msg: '移至我的电子钱包 成功' });
        this.getUserWalletList().then(() => {
          // 切換當前頁面狀態
          this.$emit("update:showDetail", false);
          this.$emit('update:editStatus', false);
          this.setPageStatus(1, "walletCardInfo", true);
        })
      })
    },
    onDelete() {
      axios({
        method: "put",
        url: `/api/v1/c/player/user_virtual_bank/${this.wallet_cardDetail.id}/delete/apply`,
        data: {
          userVirtualBankId: this.wallet_cardDetail.id
        }
      }).then(response => {
        const { result } = response.data;
        if (!response || result !== 'ok') {
          return;
        }

        this.isShowPop = false;
        this.$emit('update:editStatus', false);

        this.getUserWalletList().then(() => {
          // 更新 wallet_cardDetail
          let temp = this.wallet_card.find(item => {
            return item.id === this.wallet_cardDetail.id;
          })
          this.wallet_cardDetail = temp;
        }).then(() => {
          if (this.memInfo.config.manual_delete_bank_card) {
            this.actionSetGlobalMessage({ msg: '删除审核中' });
          } else {
            this.actionSetGlobalMessage({ msg: '刪除成功' });
            this.$emit("update:showDetail", false);
            this.setPageStatus(1, "walletCardInfo", true);
          }
        })
      })
    }
  }
}

