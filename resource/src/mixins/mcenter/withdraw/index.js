import {
  API_WITHDRAW_CGPAY_BINDING,
  API_WITHDRAW_INFO,
  API_MCENTER_DEPOSIT_BANK
} from "@/config/api";
import { mapActions, mapGetters } from "vuex";

import ajax from "@/lib/ajax";
import axios from "axios";
import isMobile from "@/lib/is_mobile";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  data() {
    return {
      withdrawAccount: {},
      withdrawData: {},
      withdrawUserData: {},
      withdrawValue: "",
      withdrawPwd: "",
      withdrawCurrency: {
        // 預設為 CGP
        isFirst: true,
        name: "CGP",
        alias: "CGP",
        method_id: 15
      },
      withdrawCurrencyOSP: {
        // 預設為 OSP
        isFirst: true,
        name: "OSP",
        alias: "OSP",
        method_id: 35
      },
      isAlertTip: false,
      isAjaxUse: false,
      alertData: {
        title: this.$text("S_WITHDRAW_APPLY", "取款申请"),
        closeBtnText: this.$text("S_ENTER01", "我知道了"),
        type: "successTip",
        tipTitle: this.$text("S_ENTER_SUCCESS", "提交成功"),
        tipImgSrc: ""
      },
      isLoading: false,
      // cgpayBindingAccount: {},
      thirdUrl: "",
      showAccount: false, // 帳戶資料檢查
      userLevelObj: {}, // 存放 Card type 開關 & 限綁一組開關
      nowOpenWallet: [],
      bank_card: [],
      wallet_card: [],
      epointWallet: {},
      epointNewWallet: {},
      userBankOption: [],
      defaultEpointWallet: {
        id: "",
        account: ""
      },
      defaultEpointNewWallet: {
        id: "",
        account: ""
      },
      offerInfo: null
    };
  },
  computed: {
    ...mapGetters({
      mobileCheck: "getMobileCheck",
      memInfo: "getMemInfo",
      noticeData: "getNoticeData",
      webInfo: "getWebInfo",
      siteConfig: "getSiteConfig"
    }),
    /**
     * 使用者所有取款帳戶
     *
     * @return Array
     */
    allWithdrawAccount() {
      if (
        !this.withdrawUserData.account &&
        !this.withdrawUserData.wallet &&
        !this.withdrawUserData.crypto
      ) {
        return [];
      }
      let allAccount = [
        ...this.withdrawUserData.account.map(info => ({
          ...info,
          withdrawType: "account_id"
        })),
        ...this.withdrawUserData.wallet.map(info => ({
          ...info,
          withdrawType: "wallet_id"
        })),
        ...this.withdrawUserData.crypto.map(info => ({
          ...info,
          withdrawType: "crypto_id"
        }))
      ];
      let resulAccount = [];

      // 過濾e點富
      resulAccount = allAccount.filter(info => {
        return info.bank_id != 2026 && info.bank_id != 2030;
      });

      this.epointWallet = allAccount.filter(info => {
        return info.bank_id === 2026;
      });
      this.epointNewWallet = allAccount.filter(info => {
        return info.bank_id === 2030;
      });

      // 目前應該進不來，沒有 isSupportCGPay 的欄位 ?
      if (this.withdrawUserData.isSupportCGPay && !isMobile()) {
        return resulAccount.concat({
          id: "cgpay",
          alias: this.$text("S_ADD_CGPAY", "新增CGPay")
        });
      }

      return resulAccount;
    },
    /**
     * 實際取款金額
     *
     * @return number or string
     */
    realWithdrawMoney() {
      if (
        !this.withdrawValue &&
        !this.withdrawData.audit.total.exceed_free_count
      ) {
        return "--";
      }

      return (
        +this.withdrawValue - +this.withdrawData.audit.total.total_deduction
      );
    },
    /**
     * 取款金額提示文字
     *
     * @return number or string
     */
    withdrawMoneyTip() {
      if (
        +this.withdrawData.payment_charge.ret.withdraw_min > 0 &&
        +this.withdrawData.payment_charge.ret.withdraw_max === 0
      ) {
        return {
          type: "min",
          text: `${this.$text("S_MINIMUM_MONEY", {
            replace: [
              {
                target: "%s",
                value: this.withdrawData.payment_charge.ret.withdraw_min
              }
            ]
          })}`
        };
      }

      if (
        +this.withdrawData.payment_charge.ret.withdraw_min === 0 &&
        +this.withdrawData.payment_charge.ret.withdraw_max > 0
      ) {
        return {
          type: "max",
          text: `${this.$text("S_MAX_MONEY", {
            replace: [
              {
                target: "%s",
                value: this.withdrawData.payment_charge.ret.withdraw_max
              }
            ]
          })}`
        };
      }

      return {
        type: "mixing",
        text: `${this.$text("S_SINGLE_LIMIT", "單筆限額")} ${
          this.withdrawData.payment_charge.ret.withdraw_min
        } ~ ${this.withdrawData.payment_charge.ret.withdraw_max}`
      };
    },
    /**
     * 是否顯示頁面
     *
     * @return boolean
     */
    isShow() {
      if (Object.keys(this.withdrawData).length > 0) {
        return true;
      }

      return false;
    },
    /**
     * 流水提示文字
     *
     * @return string
     */
    serialTip() {
      if (this.withdrawData.audit.total.deduction > 0) {
        return this.$text("S_SERIAL_NUMBER_TIP01", {
          replace: [
            { target: "%s", value: this.withdrawData.audit.total.deduction }
          ]
        });
      }

      return this.$text("S_SERIAL_CHANGE", "流水检查");
    },
    /**
     * CGPay優惠文字
     *
     * @return string
     */
    cgpayPromotionText() {
      let resultPromotion = Math.round(
        this.withdrawValue * (this.resultWithdrawAccount.offer_percent / 100)
      );

      if (
        +this.resultWithdrawAccount.offer_limit > 0 &&
        resultPromotion > +this.resultWithdrawAccount.offer_limit
      ) {
        resultPromotion = +this.resultWithdrawAccount.offer_limit;
      }

      return this.$text("S_WITHDRAW_TIP03", {
        replace: [{ target: "%s", value: resultPromotion }]
      });
    },
    /**
     * 設定當前取款銀行
     *
     * @return string
     */
    resultWithdrawAccount: {
      get() {
        return this.withdrawAccount;
      },
      set(value) {
        if (value.id === "cgpay") {
          this.isLoading = true;
          this.actionSetIsLoading(true);

          ajax({
            method: "get",
            url: `${API_WITHDRAW_CGPAY_BINDING}?wallet_gateway_id=1`,
            errorAlert: false
          }).then(response => {
            if (response.result === "ok") {
              this.isLoading = false;
              this.actionSetIsLoading(false);

              this.alertData = {
                title: this.$text("S_SCANNING_BINDING", "扫描绑定"),
                closeBtnText: this.$text("S_CLOSE", "关闭"),
                type: "cgpay",
                tipTitle: this.$text(
                  "S_CGPAY_TIP04",
                  "30秒后连结无效，并关闭视窗"
                ),
                tipImgSrc: response.ret.url
              };

              this.isAlertTip = true;
            }
          });
          return;
        }

        this.alertData = {
          title: this.$text("S_WITHDRAW_APPLY", "取款申请"),
          closeBtnText: this.$text("S_ENTER01", "我知道了"),
          type: "successTip",
          tipTitle: this.$text("S_ENTER_SUCCESS", "提交成功"),
          tipImgSrc: ""
        };

        this.withdrawAccount = value;
      }
    },
    /**
     * CGPay Currency
     *
     * @return Array
     */
    currencyList() {
      let target = [];
      let list = [];
      if (this.allWithdrawAccount && this.allWithdrawAccount.length > 0) {
        target = this.allWithdrawAccount.find(item => {
          return item.bank_id === 2009;
        });
        if (target) {
          // 新增 alias : 選單顯示用
          list = target.currency.map(item => {
            return {
              ...item,
              currency_alias: item.currency_name
            };
          });
        }
      }
      return list;
    },
    /**
     * OSPay Currency
     *
     * @return Array
     */
    currencyListForOSP() {
      let target = [];
      let list = [];
      if (this.allWithdrawAccount && this.allWithdrawAccount.length > 0) {
        target = this.allWithdrawAccount.find(item => {
          return item.bank_id === 2029;
        });
        if (target) {
          // 新增 alias : 選單顯示用
          list = target.currency.map(item => {
            return {
              ...item,
              currency_alias: item.currency_name
            };
          });
        }
      }
      return list;
    },
    /**
     * 優惠金額提示訊息
     *
     * @return string
     */
    promitionText() {
      let textValue = "";

      if (!this.offerInfo.is_full_offer) {
        textValue += `• 此笔提现成功加赠优惠 ${this.formatThousandsCurrency(
          this.offerInfo.offer
        )}元\n`;
      }

      if (+this.offerInfo.per_offer_limit && +this.offerInfo.offer_limit) {
        textValue += `• 单笔上限 ${this.formatThousandsCurrency(
          this.offerInfo.per_offer_limit
        )} 元，单日上限 ${this.formatThousandsCurrency(
          this.offerInfo.offer_limit
        )} 元(美东时间计算)\n`;
      } else if (+this.offerInfo.per_offer_limit) {
        textValue += `• 单笔上限 ${this.formatThousandsCurrency(
          this.offerInfo.per_offer_limit
        )} 元\n`;
      } else if (+this.offerInfo.offer_limit) {
        textValue += `• 单日上限 ${this.formatThousandsCurrency(
          this.offerInfo.offer_limit
        )} 元(美东时间计算)\n`;
      }

      textValue += this.offerInfo.is_full_offer
        ? "• 今日领取已达上限"
        : `• 今日优惠已领 ${this.formatThousandsCurrency(
            this.offerInfo.gotten_offer
          )}元`;

      return textValue;
    }
  },
  watch: {
    // noticeData() {
    //     let resultNotice = {};
    //     if (this.noticeData.filter((info) => info.event === 'trade_bind_wallet').length > 0) {
    //         this.noticeData.forEach((element) => {
    //             if (Object.keys(resultNotice).length === 0) {
    //                 resultNotice = element;
    //                 return;
    //             }
    //             if (new Date(element.id).getTime() > new Date(resultNotice.id).getTime()) {
    //                 resultNotice = element;
    //             }
    //         });
    //         if (Object.keys(resultNotice).length > 0 && resultNotice.result === 'ok') {
    //             this.cgpayBindingAccount = resultNotice;
    //             this.getWithdrawAccount();
    //             this.alertTipClose(false);
    //         }
    //     }
    // }
  },
  methods: {
    ...mapActions([
      "actionSetIsLoading",
      "actionSetUserdata",
      "actionSetGlobalMessage",
      "actionVerificationFormData",
      "actionGetWithdrawAccount"
    ]),
    checkAccountData(target) {
      this.getAccountDataStatus().then(data => {
        let check = true;
        Object.keys(data.ret).every(i => {
          if (!data.ret[i] && i !== "bank") {
            this.showAccount = true;
            check = false;
            return;
          }
        });

        if (check && target === "bankCard") {
          this.$router.push(
            "/mobile/mcenter/bankcard?redirect=withdraw&type=bankCard"
          );
        }

        if (check && target === "wallet") {
          this.$router.push(
            "/mobile/mcenter/bankcard?redirect=withdraw&type=wallet"
          );
        }
      });
    },
    getAccountDataStatus() {
      return axios({
        method: "get",
        url: "/api/v2/c/withdraw/check"
      })
        .then(res => {
          const { ret, result, msg, code } = res.data;

          if (!res || result !== "ok") {
            this.actionSetGlobalMessage({
              msg,
              code
            });
            return;
          }

          return res.data;
        })
        .catch(error => {
          const { msg, code } = error.response.data;
          this.actionSetGlobalMessage({
            msg,
            code
          });
        });
    },
    /**
     * 取得取款帳戶
     * @method getWithdrawAccount
     */
    getWithdrawAccount() {
      this.isLoading = true;
      this.actionSetIsLoading(true);

      this.actionGetWithdrawAccount().then(data => {
        this.isLoading = false;
        this.actionSetIsLoading(false);

        if (data) {
          this.withdrawUserData = data;
          [this.withdrawAccount] = this.allWithdrawAccount;
        }
      });
    },
    /**
     * 關閉彈跳取款訊息
     * @method alertTipClose
     */
    alertTipClose(showType = false) {
      if (showType) {
        this.isAlertTip = showType;
        return;
      }

      this.isAlertTip = !this.isAlertTip;
      window.location.reload();
    },
    /**
     * 資料重置
     * @method resetValue
     */
    resetValue() {
      this.withdrawValue = "";
      this.withdrawPwd = "";
      this.withdrawAccount = {};
      // this.cgpayBindingAccount = {};
    },
    /**
     * 更新帳戶金額
     * @method updateAmount
     */
    updateAmount(swift_code = "") {
      if (this.isAjaxUse) {
        return;
      }

      this.isAjaxUse = true;

      return ajax({
        method: "get",
        url: API_WITHDRAW_INFO,
        errorAlert: false,
        params: {
          swift_code: swift_code
        },
        fail: res => {
          this.actionSetIsLoading(false);
          if (res.data && res.data.msg) {
            this.actionSetGlobalMessage({
              msg: res.data.msg,
              code: res.data.code
              // cb: () => {
              //   if (res.data.code == "C600001") {
              //     this.$router.back();
              //   }
              // }
            });
          }
        }
      }).then(response => {
        this.withdrawData = response;
        // if (this.memInfo.config.withdraw === "迅付") {
        //   this.getWithdrawAccount();
        // }
        this.isAjaxUse = false;
      });
    },
    /**
     * 使用者層級並取得 card type & 電子錢包綁綁開關
     * @method getUserLevel
     */
    getUserLevel() {
      //取得會員層級 C02.126
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Level`
      })
        .then(res => {
          const { status, errorCode, msg } = res;

          if (errorCode !== "00" || status !== "000") {
            this.actionSetGlobalMessage({ code: errorCode, msg: msg });
            return;
          }

          this.userLevelObj = res.data;
        })
        .catch(error => {
          dispatch("actionSetGlobalMessage", {
            msg: error.res?.data?.msg,
            code: error.res?.data?.code
          });
        });
    },
    /**
     * 回傳使用者出入款統計資料
     * @method getUserStat
     */
    getUserStat() {
      axios({
        method: "get",
        url: "/api/v1/c/user-stat/deposit-withdraw"
      })
        .then(res => {
          const { ret, result, msg, code } = res.data;

          if (!res || result !== "ok") {
            this.actionSetGlobalMessage({
              msg,
              code
            });
            return;
          }

          this.userWithdrawCount = ret.withdraw_count;
        })
        .catch(error => {
          const { msg, code } = error.response.data;
          this.actionSetGlobalMessage({
            msg,
            code
          });
        });
    },
    /**
     * 回傳目前開放的電子錢包
     * @method getNowOpenWallet
     */
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
          this.actionSetGlobalMessage({ msg, code });
        });
    },
    /*************************
     * 目前 User 擁有的卡片     *
     *************************/
    getUserBankList() {
      this.isRevice = false;

      // C02.221 回傳銀行卡清單與狀態/查詢會員出款銀行
      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/User/Bank/List`,
        params: {
          lang: "zh-cn",
          common: true
        }
      })
        .then(response => {
          this.isRevice = true;
          const { data, status, errorCode } = response;

          if (errorCode !== "00" || status !== "000") {
            return;
          }

          this.bank_card = data;
        })
        .catch(error => {
          const { msg } = error.response.data;
          this.actionSetGlobalMessage({ msg });
        });
    },
    /*************************
     * 目前 User 擁有的錢包     *
     *************************/
    getUserWalletList() {
      this.isRevice = false;

      //  C02.241 查詢會員電子錢包
      return goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/User/Virtual/Bank/List`,
        params: {
          lang: "zh-cn",
          common: true
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
          this.actionSetGlobalMessage({ msg, code });
        });
    },
    // 取得使用者銀行卡列表(迅付)
    getUserBankListFast() {
      return axios({
        method: "get",
        url: API_MCENTER_DEPOSIT_BANK,
        params: {}
      })
        .then(response => {
          if (response && response.data && response.data.result === "ok") {
            // console.log(response);
            this.userBankOption = [];
            this.userBankOption = response.data.ret;
            this.defaultEpointWallet = this.userBankOption[0];
            this.defaultEpointNewWallet = this.userBankOption[0];
          }
        })
        .catch(error => {});
    },
    // 取得會員層級當日取款試算優惠、金額(迅付)
    getWithdrawOffer(amount) {
      let method_id = 0;
      if (this.selectedCard.bank_id === 2009) {
        method_id = this.withdrawCurrency.method_id;
      } else if (this.selectedCard.bank_id === 2029) {
        method_id = this.withdrawCurrencyOSP.method_id;
      } else {
        if (this.selectedCard.offer_data) {
          method_id = this.selectedCard.offer_data[0]
            ? this.selectedCard.offer_data[0].method_id
            : 0;
        } else if (this.selectedCard && this.selectedCard["currency"]) {
          //僅綁定購寶錢包情況fb546335
          method_id = this.selectedCard["currency"][0]
            ? this.selectedCard["currency"][0].method_id
            : 0;
        } else {
          method_id = 0;
        }
      }
      //取得會員層級當日取款試算優惠、金額 C04.55
      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Vendor/Withdraw/Offer`,
        params: {
          payment_method_id: method_id, //銀行卡時=0
          amount: amount
        }
      }).then(response => {
        if (response && response.data && response.status === "000") {
          // console.log(response.data);
          this.offerInfo = response.data;
        } else {
          this.actionSetGlobalMessage({
            msg: response.msg,
            code: response.code
          });
        }
      });
    }
  }
};
