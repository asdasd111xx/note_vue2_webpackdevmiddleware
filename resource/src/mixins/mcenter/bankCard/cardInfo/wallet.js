import axios from "axios";
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      isRevice: false,
      isShowPop: false,
      hasSameTypeCard: false,
      nowOpenWallet: [],
      wallet_card: [],
      wallet_cardDetail: {},

      // 控制詳細頁卡片顏色
      colorRepeatIndex: null,
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
    }
  },
  methods: {
    ...mapActions(['actionSetGlobalMessage']),
    /*************************
     * 取得目前開放的銀行列表    *
     *************************/
    getNowOpenWallet() {
      this.isRevice = false;

      // Get 錢包類型
      axios({
        method: "get",
        url: "/api/payment/v1/c/virtual/bank/list"
      }).then(response => {
        const { ret, result } = response.data;
        this.isRevice = true;

        if (!response || result !== "ok") {
          return;
        }

        this.nowOpenWallet = ret;
      });
    },
    /*************************
     * 目前 User 擁有的卡片     *
     *************************/
    getUserWalletList() {
      this.isRevice = false;

      return axios({
        method: "get",
        url: "/api/v1/c/player/user_virtual_bank/list",
        params: {
          common: true
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

    onClickDetail(info, index) {
      // console.log(index);
      // 取餘數的數量，取決於幾種顏色循環，目前 Yabo 共 3 種顏色循環，加 1 是方便 scss 判斷
      // this.colorRepeatIndex = (index + 1) % 3
      this.colorRepeatIndex = index;

      this.wallet_cardDetail = info;
      this.hasSameTypeCard = false;

      // Find the mutiple same type card
      let count =
        this.wallet_card
          .filter(item => {
            return info.payment_gateway_id === item.payment_gateway_id;
          }).length

      if (count > 1) {
        this.hasSameTypeCard = true;
      }

      this.$emit('update:isAudit', false)
      this.$emit("update:showDetail", true);

      if (info.auditing) {
        this.$emit('update:isAudit', true);
        return;
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
          common: false
        }
      }).then(response => {
        const { result } = response.data;
        if (!response || result !== 'ok') {
          return;
        }

        this.actionSetGlobalMessage({ msg: '移至历史帐号 成功' });
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
            switch (this.themeTPL) {
              case 'porn1':
                this.actionSetGlobalMessage({ msg: '钱包删除审核中' });
                break;

              case 'ey1':
                this.actionSetGlobalMessage({ msg: '删除审核中' });
                break;
            }
          } else {
            switch (this.themeTPL) {
              case 'porn1':
                this.actionSetGlobalMessage({ msg: '钱包刪除成功' });
                break;

              case 'ey1':
                this.actionSetGlobalMessage({ msg: '刪除成功' });
                break;
            }
            this.$emit("update:showDetail", false);
            this.setPageStatus(1, "walletCardInfo", true);
          }
        })
      })
    }
  }
}

