import { mapActions, mapGetters } from "vuex";
import goLangApiRequest from "@/api/goLangApiRequest";

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
      colorRepeatIndex: null
    };
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
    isCommon() {
      return this.$route.meta.common;
    },
    isBindNowOpenAllWallets() {
      // 根據目前已綁定的 ID 與目前有開放的所有銀行 ID 做比對
      let nowBindWalletCount = 0;
      let idArr = [
        ...new Set(
          this.wallet_card.map(item => {
            return item.virtual_bank_id;
          })
        )
      ];

      if (idArr) {
        this.nowOpenWallet.forEach(item => {
          if (idArr.includes(item.id)) {
            nowBindWalletCount += 1;
          }
        });

        return nowBindWalletCount >= this.nowOpenWallet.length ? true : false;
      }

      return false;
    },
    isShowAddCardButton() {
      switch (this.themeTPL) {
        case "porn1":
        case "sg1":
          return !this.isBindNowOpenAllWallets;

        case "ey1":
          return (
            (!this.userLevelObj.virtual_bank_single &&
              this.wallet_card.length < 15) ||
            (this.userLevelObj.virtual_bank_single &&
              this.wallet_card.length < this.nowOpenWallet.length)
          );
      }
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    /*************************
     * 取得目前開放的銀行列表    *
     *************************/
    getNowOpenWallet() {
      this.isRevice = false;

      // C02.141 取得廳主支援的電子錢包列表
      // Get 錢包類型
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Payment/VirtualBank/List`,
        params: {
          lang: "zh-cn"
        }
      })
        .then(response => {
          this.isRevice = true;
          const { data, status, errorCode } = response;

          if (errorCode !== "00" || status !== "000") {
            return;
          }

          this.nowOpenWallet = data;
        })
        .catch(error => {
          const { msg } = error.response.data;
          this.actionSetGlobalMessage({ msg });
        });
    },
    /*************************
     * 目前 User 擁有的卡片     *
     *************************/
    getUserWalletList() {
      this.isRevice = false;

      //  C02.241 查詢會員電子錢包
      return goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/User/Virtual/Bank/List`,
        params: {
          lang: "zh-cn",
          common: this.isCommon
        }
      })
        .then(response => {
          this.isRevice = true;
          const { data, status, errorCode } = response;

          if (errorCode !== "00" || status !== "000") {
            return;
          }

          this.wallet_card = data.filter((item, index) => index < 15);
        })
        .catch(error => {
          const { msg } = error.response.data;
          this.actionSetGlobalMessage({ msg });
        });
    },

    onClickDetail(info, index) {
      this.colorRepeatIndex = index;

      this.wallet_cardDetail = info;

      this.hasSameTypeCard = false;
      this.$emit("update:statusList", {
        key: "hasSameTypeWallet",
        value: false
      });

      // Find the mutiple same type card
      let count = this.wallet_card.filter(item => {
        return info.virtual_bank_id === item.virtual_bank_id;
      }).length;

      if (count > 1) {
        this.hasSameTypeCard = true;
        this.$emit("update:statusList", {
          key: "hasSameTypeWallet",
          value: true
        });
      }

      this.$emit("update:statusList", {
        key: "isAudit",
        value: false
      });
      this.$emit("update:statusList", {
        key: "showDetail",
        value: true
      });

      if (info.auditing) {
        this.$emit("update:statusList", {
          key: "isAudit",
          value: true
        });
        return;
      }
    },
    moveCard() {
      const { address, virtual_bank_id } = this.wallet_cardDetail;

      // 編輯會員電子錢包 C02.240 (取代C02.145)
      goLangApiRequest({
        method: "put",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/User/VirtualBank/Edit`,
        params: {
          lang: "zh-cn",
          oldAddress: address,
          virtualBankId: String(virtual_bank_id),
          common: !this.isCommon
        }
      })
        .then(response => {
          const { status, errorCode } = response;

          if (errorCode !== "00" || status !== "000") {
            return;
          }

          this.actionSetGlobalMessage({
            msg: this.isCommon ? "移至历史帐号 成功" : "移至我的电子钱包 成功"
          });
          this.getUserWalletList().then(() => {
            // 切換當前頁面狀態
            this.$emit("update:statusList", {
              key: "showDetail",
              value: false
            });
            this.$emit("update:statusList", {
              key: "editStatus",
              value: false
            });
            this.setPageStatus(1, "walletCardInfo", true);
          });
        })
        .catch(error => {
          const { msg } = error.response.data;
          this.actionSetGlobalMessage({ msg });
        });
    },
    onDelete() {
      // 申請刪除會員電子錢包 C02.244
      goLangApiRequest({
        method: "put",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/User/VirtualBank/ApplyDeletePlayer/${this.wallet_cardDetail.id}`,
        params: {
          lang: "zh-cn",
          bankID: this.wallet_cardDetail.id
        }
      })
        .then(response => {
          const { status, errorCode, msg } = response;

          if (errorCode !== "00" || status !== "000") {
            this.actionSetGlobalMessage({ msg: msg ? msg : "不开放删除" });
            return;
          }

          this.isShowPop = false;

          this.$emit("update:statusList", {
            key: "editStatus",
            value: false
          });

          this.getUserWalletList()
            .then(() => {
              // 更新 wallet_cardDetail
              let temp = this.wallet_card.find(item => {
                return item.id === this.wallet_cardDetail.id;
              });
              this.wallet_cardDetail = temp;
            })
            .then(() => {
              if (this.memInfo.config.manual_delete_bank_card) {
                switch (this.themeTPL) {
                  case "porn1":
                  case "sg1":
                    this.actionSetGlobalMessage({ msg: "钱包删除审核中" });
                    break;

                  case "ey1":
                    this.actionSetGlobalMessage({ msg: "删除审核中" });
                    break;
                }
                this.$emit("update:statusList", {
                  key: "isAudit",
                  value: true
                });
                return;
              } else {
                switch (this.themeTPL) {
                  case "porn1":
                  case "sg1":
                    this.actionSetGlobalMessage({ msg: "钱包刪除成功" });
                    break;

                  case "ey1":
                    this.actionSetGlobalMessage({ msg: "刪除成功" });
                    break;
                }
                this.$emit("update:statusList", {
                  key: "showDetail",
                  value: false
                });
                this.setPageStatus(1, "walletCardInfo", true);
                return;
              }
            });
        })
        .catch(error => {
          const { msg } = error.response.data;
          this.actionSetGlobalMessage({ msg });
        });
    }
  }
};
