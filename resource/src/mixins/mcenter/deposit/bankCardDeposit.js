import {
  API_CRYPTO_MONEY,
  API_MCENTER_DEPOSIT_CHANNEL,
  API_MCENTER_DEPOSIT_OUTER_WALLET,
  API_MCENTER_DEPOSIT_BANK,
  API_MCENTER_DEPOSIT_THIRD,
  API_TRADE_RELAY
} from "@/config/api";
import { mapActions, mapGetters } from "vuex";

import BigNumber from "bignumber.js/bignumber";
import ajax from "@/lib/ajax";
import axios from "axios";
import { getCookie } from "@/lib/cookie";
import goLangApiRequest from "@/api/goLangApiRequest";
import { thousandsCurrency } from "@/lib/thousandsCurrency";

export default {
  data() {
    return {
      username: "",
      depositData: [],
      orderData: {},
      passRoad: [],
      // isDepositAi: false,
      curPaymentGroupIndex: 0,
      getPassRoadOrAi: {},
      curModeGroup: {},
      curPayInfo: {},
      curPassRoad: {}, // 存放當前 channel 的資料
      curPassRoadTipText: "",
      curPassRoadTipTextShowMore: false,
      offerInfo: {},
      moneyValue: "",
      isShow: true,
      isErrorMoney: false,
      selectedBank: {},
      speedField: {
        depositMethod: "",
        depositTime: "",
        depositAccount: "",
        depositName: "",
        bankBranch: "",
        serialNumber: ""
      },
      isShowPop: false,
      checkSuccess: false,
      yourBankList: [],
      webviewOpenUrl: "",
      isSelectedCustomMoney: false,
      isDisableDepositInput: false,
      defaultOuterCrypto: "",
      defaultEpointWallet: "",
      outerCryptoOption: [],
      userBankOption: [],
      bcCurrencyData: null,
      selectBcCoin: {
        balance: "",
        currency: "",
        name: ""
      },
      isOuterCrypto: false,
      showOuterCryptoAddress: false,
      showEpointWalletAddress: false,
      outerCryptoAddress: "",
      epointBankName: "",
      epointBankAccount: "",
      walletData: {
        CGPay: {
          balance: "", // 值由 api 回來之後再更新，配合 Watch
          method: 1,
          password: "",
          placeholder: "请输入CGP安全防护码"
        }
      },
      // 傳遞給 depositInfo (訂單限時)
      limitTime: 0,

      // 匯率試算相關
      cryptoMoney: "--",
      isClickCoversionBtn: false,

      //USDT參考匯率
      rate: "--",
      updateTime: false,

      // 倒數器
      timer: null,
      countdownSec: 0,

      topPromotionMessage: "",
      cgPromotionMessage: ""
    };
  },
  watch: {
    webviewOpenUrl(val) {
      setTimeout(() => {
        document.location.href = this.webviewOpenUrl;
      }, 200);
    },
    defaultOuterCrypto() {
      this.showOuterCryptoAddress = this.defaultOuterCrypto === "其他位址";
    },
    defaultEpointWallet() {
      this.showEpointWalletAddress = this.isSelectBindWallet(34)
        ? this.defaultEpointWallet.account === "其他银行卡"
        : false;
    }
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      isLoading: "getIsLoading"
    }),

    /**
     * 所有銀行
     *
     * @return array
     */
    allBanks() {
      // 銀行匯款一律吃 your_Bank 裡面所有的資料
      if (
        this.yourBankList.length > 0 &&
        this.curPayInfo.payment_type_id === 5
      ) {
        return this.yourBankList.map(bankInfo => ({
          label: bankInfo.name,
          value: bankInfo.id,
          swift_code: bankInfo.swift_code,
          image_url: bankInfo.image_url
        }));
      }

      if (!this.curPayInfo || !this.curPayInfo.banks) {
        return [];
      }

      // 在線支付 & 點卡儲值 => 吃當前支付方式的 banks
      return this.curPayInfo.banks.map(bankInfo => ({
        label: bankInfo.name,
        value: bankInfo.id,
        swift_code: bankInfo.swift_code,
        image_url: bankInfo.image_url
      }));
    },
    /**
     * 實際金額
     *
     * @return number or string
     */
    realSaveMoney() {
      let promotionValue = this.offerInfo.offer_enable
        ? new BigNumber(this.moneyValue)
            .multipliedBy(
              new BigNumber(this.offerInfo.offer_percent).dividedBy(100)
            )
            .toNumber()
        : 0;
      //充值優惠小數點後兩位捨去
      // promotionValue = Math.floor(promotionValue * 100) / 100;
      let deductionValue = +this.getPassRoadOrAi.fee_percent
        ? new BigNumber(this.moneyValue)
            .multipliedBy(
              new BigNumber(this.getPassRoadOrAi.fee_percent).dividedBy(100)
            )
            .toNumber()
        : Number(this.getPassRoadOrAi.fee_amount);
      //手續費小數點後兩位捨去
      // deductionValue = Math.floor(deductionValue * 100) / 100;
      let total = "0.00";

      // 尚未輸入金額
      if (!this.moneyValue) {
        return "0.00";
      }

      if (
        (this.depositInterval.minMoney &&
          this.depositInterval.minMoney > this.moneyValue) ||
        (this.depositInterval.maxMoney &&
          this.depositInterval.maxMoney < this.moneyValue) ||
        (+this.getPassRoadOrAi.fee_percent <= 0 &&
          +this.getPassRoadOrAi.fee_amount > +this.moneyValue)
      ) {
        return "0.00";
      }

      // 未達到單筆存款金額，無優惠
      if (+this.moneyValue < +this.offerInfo.offer_amount) {
        total = deductionValue
          ? new BigNumber(this.moneyValue)
              .minus(new BigNumber(deductionValue))
              .toNumber(2)
          : Number(this.moneyValue);

        // 取小數點後二位，若為整數則補小數點
        total = total.toString().replace(/^([-]?(\d*))$/, "$1.");
        // 只取小數點後二位
        total = `${total}00`.replace(/(\d*\.\d{2})\d*/, "$1");
        return this.formatThousandsCurrency(total);
      }

      // 超過優惠金額以單筆上限為主
      if (
        +this.offerInfo.per_offer_limit > 0 &&
        promotionValue > +this.offerInfo.per_offer_limit
      ) {
        promotionValue = +this.offerInfo.per_offer_limit;
      }
      // 檢查每日優惠金額有無達到上限
      if (this.offerInfo.is_full_offer) {
        promotionValue = 0;
      } else if (
        +this.offerInfo.offer_limit > 0 &&
        promotionValue >
          +this.offerInfo.offer_limit - +this.offerInfo.gotten_offer
      ) {
        promotionValue =
          +this.offerInfo.offer_limit - +this.offerInfo.gotten_offer;

        //充值優惠小數點後兩位捨去
        promotionValue = Math.floor(promotionValue * 100) / 100;
      }

      // 總額計算
      total = deductionValue
        ? new BigNumber(this.moneyValue)
            .plus(promotionValue)
            .minus(new BigNumber(deductionValue))
            .toNumber(2)
        : new BigNumber(this.moneyValue).plus(promotionValue);
      // 取小數點後二位，若為整數則補小數點
      total = total.toString().replace(/^([-]?(\d*))$/, "$1.");
      // 只取小數點後二位
      total = `${total}00`.replace(/(\d*\.\d{2})\d*/, "$1");
      return this.formatThousandsCurrency(total);
    },
    /**
     * 設定當前選擇的銀行
     *
     * @return object
     */
    curSelectedBank: {
      get() {
        if (Object.keys(this.selectedBank).length === 0) {
          return "";
        }

        return this.selectedBank;
      },
      set(value) {
        this.selectedBank = value;

        if (this.curModeGroup.channel_display) {
          //代客充值 payment_method_id = 20
          //因未充值過的會員一進去充值畫面剛好是代客充值的欄位 直接call getPayPass api會報錯
          if (this.curPayInfo.payment_method_id === 20) {
            this.getVendorCryptoOuterUserAddressList();
          } else {
            this.getPayPass();
          }
        }
      }
    },
    /**
     * 當前存款廠商
     *
     * @return string
     */
    mixingDeposit() {
      // 只有迅付
      if (
        this.memInfo.config.deposit.includes("迅付") &&
        this.memInfo.config.deposit.length === 1
      ) {
        return "onlyFastPay";
      }

      // 只有第三方
      if (
        !this.memInfo.config.deposit.includes("迅付") &&
        this.memInfo.config.deposit.length > 0
      ) {
        return "onlyThird";
      }

      return "mixing";
    },
    /**
     * 優惠金額提示訊息
     *
     * @return string
     */
    promitionText() {
      let textValue = "";

      if (!this.offerInfo.is_full_offer) {
        textValue += `• 此笔充值成功加赠优惠 ${this.formatThousandsCurrency(
          this.offerInfo.offer
        )}元\n`;
      }
      textValue += `• 单笔充值 ${this.formatThousandsCurrency(
        this.offerInfo.offer_amount
      )} 元+，优惠加赠 ${this.formatThousandsCurrency(
        this.offerInfo.offer_percent
      )} %\n`;

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
        : `•今日优惠已领 ${this.formatThousandsCurrency(
            this.offerInfo.gotten_offer
          )}元`;

      return textValue;
    },
    /**
     * 手續費提示訊息
     *
     * @return string
     */
    feeText() {
      // 百分比手續費
      return (
        `需承担 ${
          +this.offerInfo.fee_percent > 0
            ? this.formatThousandsCurrency(this.offerInfo.fee)
            : this.formatThousandsCurrency(this.offerInfo.fee_amount)
        } 元手续费` +
        (+this.offerInfo.fee_percent > 0
          ? `(充值金额 ${this.formatThousandsCurrency(
              this.offerInfo.fee_percent
            )} %)`
          : "") +
        `，费用由第三方收取`
      );
    },
    /**
     * 存款金額最小至最大值
     *
     * @return string
     */
    depositInterval() {
      const minMoney = +this.curPassRoad.per_trade_min;
      const maxMoney = +this.curPassRoad.per_trade_max;

      return {
        minMoney,
        maxMoney
      };
    },
    /**
     * 收款帳號
     *
     * @return string
     */
    receiptInfo() {
      if (this.curPassRoad.safe_account === false) {
        // 支付轉帳
        if (
          this.curPayInfo.payment_method_id !== 3 &&
          this.curPayInfo.payment_method_id !== 6 &&
          (this.curPassRoad.qrcode || this.curPassRoad.photo)
        ) {
          return [
            {
              objKey: "withdrawAccount",
              title: this.$text("S_WITHDRAW_ACCOUNT", "收款帐号"),
              value: this.curPassRoad.bank_account,
              isFontBold: false,
              copyShow: true
            },
            {
              objKey: "withdrawNickname",
              title: this.$text("S_WITHDRAW_NICKNAME", "收款昵称"),
              value: this.curPassRoad.bank_account_name,
              isFontBold: false,
              copyShow: true
            },
            {
              objKey: "withdrawDeliver",
              title: this.$text("S_DELIVER_INFO", "收款资讯"),
              isFontBold: true,
              copyShow: false,
              qrcode: [
                {
                  title: this.curPassRoad.photo_name,
                  value: this.curPassRoad.photo
                },
                {
                  title: this.curPassRoad.qrcode_name,
                  value: this.curPassRoad.qrcode
                }
              ]
            },
            {
              objKey: "memo",
              title: this.$text("S_DEPOSIT_TIP05", "提醒事项"),
              value: this.curPassRoad.reminder.replace(/\n/gi, "<br/>"),
              isFontBold: false,
              copyShow: false,
              htmlShow: true
            }
          ];
        }

        // 銀行匯款
        return [
          {
            objKey: "withdrawBank",
            title: this.$text("S_WITHDRAW_BANK", "收款银行"),
            value: this.curPassRoad.bank_name,
            isFontBold: false,
            copyShow: true
          },
          {
            objKey: "withdrawBranch",
            title: this.$text("S_WITHDRAW_BRANCH", "收款支行"),
            value: this.curPassRoad.bank_branch,
            isFontBold: false,
            copyShow: true
          },
          {
            objKey: "withdrawAccount",
            title: this.$text("S_WITHDRAW_ACCOUNT", "收款帐号"),
            value: this.curPassRoad.bank_account,
            isFontBold: true,
            copyShow: true
          },
          {
            objKey: "withdrawName",
            title: this.$text("S_WITHDRAW_NAME", "收款人姓名"),
            value: this.curPassRoad.bank_account_name,
            isFontBold: false,
            copyShow: true
          },
          {
            objKey: "withdrawDeliver",
            title: this.$text("S_DELIVER_INFO", "收款资讯"),
            isFontBold: true,
            copyShow: false,
            qrcode: [
              {
                title: this.curPassRoad.bank_account_qrcode_name,
                value: this.curPassRoad.bank_account_qrcode
              }
            ]
          },
          {
            objKey: "memo",
            title: this.$text("S_DEPOSIT_TIP05", "提醒事项"),
            value: this.curPassRoad.reminder.replace(/\n/gi, "<br/>"),
            isFontBold: false,
            copyShow: false,
            htmlShow: true
          }
        ].filter(item => {
          if ("qrcode" in item) {
            return item.qrcode[0].title && item.qrcode[0].value ? true : false;
          } else {
            return true;
          }
        });
      }

      return false;
    },
    isSelectBankPaymentMethod() {
      // 不知道什麼情況會是 true , 待判斷之後刪除 ?
      // 極速到帳(payment_method_id = 6)、銀行轉帳(payment_method_id = 3)皆有其他銀行選項
      const speedAccount =
        this.curPayInfo.payment_method_id === 6 &&
        this.curPayInfo.bank_id === 0;

      const bankTranser =
        this.curPayInfo.payment_method_id === 3 &&
        this.curPayInfo.bank_id === 0;

      return speedAccount || bankTranser;
    }
  },
  methods: {
    ...mapActions(["actionSetIsLoading"]),
    /**
     * 取得支付群組
     * @method getPayGroup
     */
    getPayGroup() {
      this.isShow = true;
      this.actionSetIsLoading(true);

      if (this.mixingDeposit === "onlyThird") {
        this.getPayThird().then(() => {
          [this.curModeGroup] = this.depositData;
        });
        return Promise.resolve({ status: "third" });
      }

      // 取得銀行群組
      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Vendor/Payment/Group`,
        params: {
          username: this.username,
          lang: "zh-cn",
          t_user_id: this.memInfo.user.user_id,
          t_user_name: this.memInfo.user.username
        }
      })
        .then(res => {
          this.isShow = false;
          this.actionSetIsLoading(false);

          if (res.status !== "000" || res.errorCode !== "00") {
            if (res.code === "TM020067") {
              this.setPopupStatus(true, "blockTips");
            } else {
              this.actionSetGlobalMessage({
                msg: res.msg,
                code: res.code
              });
            }
            return;
          }

          if (res && res.data) {
            let extraArray = res.data.extraArray;
            if (extraArray && extraArray.switchPromotionTypeEletWallet) {
              this.topPromotionMessage =
                extraArray.valuePromotionTypeEletWallet;
            }

            if (extraArray && extraArray.switchPromotionTypeCGPay) {
              this.cgPromotionMessage = extraArray.valuePromotionTypeCGPay;
            }
            //新增檢查 當充值方式“只有”外部連結時 直接外開
            if (res.data.ret.payment_group.length === 1) {
              if (res.data.ret.payment_group[0].is_link) {
                this.changeMode(res.data.ret.payment_group[0]);
                return;
              }
            }

            const filterData = res.data.ret.payment_group.filter(
              info => !info.is_link
            )[0];

            // 目前為第一個支付群組
            this.curModeGroup = filterData || {};
            // 根據第一個支付群組，選擇第一筆支付方式
            this.curPayInfo = filterData
              ? filterData.payment_group_content[0]
              : {};
            // 該參數顯示上方支付群組用
            this.depositData = res.data.ret.payment_group;
            // this.isDepositAi = res.data.ret.deposit_ai;

            this.yourBankList = res.data.ret.your_bank;

            // 110/01/09 defaultCurPayBank 再判斷能放哪，使用銀行這塊能再改寫
            this.defaultCurPayBank();

            // if (this.isDepositAi) {
            //   this.PassRoadOrAi();
            // }

            if (this.mixingDeposit !== "onlyFastPay") {
              // this.isShow = false 防非同步造成的問題
              this.isShow = false;
              this.getPayThird();
            }

            if (
              this.curModeGroup.channel_display &&
              (this.curPayInfo.bank_id || this.curSelectedBank.value)
            ) {
              // this.isShow = false 防非同步造成的問題
              this.isShow = false;
              this.getPayPass();
              return { result: res.data.ret };
            }

            return { result: res.data.ret };
          }

          return res;
        })
        .catch(errors => {
          if (
            errors &&
            errors.response.data &&
            errors.response.data.msg &&
            errors.response.data.code
          ) {
            if (res.data.code === "TM020067") {
              this.setPopupStatus(true, "blockTips");
            } else {
              this.actionSetGlobalMessage({
                msg: res.data.msg,
                code: res.data.code
              });
            }
            return;
          }
        });
    },
    /**
     * 智能 or 一般
     *
     * @return object
     */
    PassRoadOrAi() {
      let getDataInfo = this.curPassRoad ? this.curPassRoad : {};

      // if (this.isDepositAi) {
      //   getDataInfo = this.curModeGroup
      //     ? this.curModeGroup.payment_group_content[this.curPaymentGroupIndex]
      //     : {};
      // }
      this.getPassRoadOrAi = {
        fee_percent: getDataInfo.fee_percent,
        fee_amount: getDataInfo.fee_amount,
        amounts: getDataInfo.amounts
      };
    },
    /**
     * 取得第三方支付群組
     * @method getPayThird
     */
    getPayThird() {
      this.isShow = true;
      this.actionSetIsLoading(true);

      // 取得存款第三方
      return ajax({
        method: "get",
        url: API_MCENTER_DEPOSIT_THIRD,
        errorAlert: false
      }).then(response => {
        this.isShow = false;
        this.actionSetIsLoading(false);
        if (response && response.result === "ok") {
          // this.depositData.push(...response.ret.deposit.filter((info) => info.name !== '迅付'));

          if (
            this.mixingDeposit !== "onlyFastPay" &&
            Object.keys(this.curModeGroup).length === 0
          ) {
            [this.curModeGroup] = response.ret.deposit.filter(
              info => info.name !== "迅付"
            );
          }
        }
      });
    },
    /**
     * 取得支付通道
     * @method getPayPass
     */
    getPayPass() {
      if (this.isShow) {
        return;
      }

      this.isShow = true;
      this.actionSetIsLoading(true);

      const nowBankId = this.curPayInfo.bank_id
        ? this.curPayInfo.bank_id
        : this.curSelectedBank.value;

      // 取得銀行群組
      return axios({
        method: "get",
        url: API_MCENTER_DEPOSIT_CHANNEL,
        params: {
          payment_method_id: this.curPayInfo.payment_method_id,
          bank_id: this.isSelectBankPaymentMethod ? "" : nowBankId,
          username: this.username
        }
      })
        .then(response => {
          if (response && response.data) {
            const { result, ret } = response.data;

            if (result === "ok") {
              this.passRoad = ret.map((info, index) => ({
                ...info,
                mainTitle: this.$text("S_PASS_TEXT", {
                  replace: [{ target: "%s", value: index + 1 }]
                })
              }));
              this.curPassRoad = { ...this.passRoad[0] };
              this.isOuterCrypto = false;
              if (
                this.curPayInfo.payment_method_id === 25 ||
                this.curPayInfo.payment_method_id === 402 ||
                this.curPayInfo.payment_method_id === 404
              ) {
                this.isOuterCrypto = true;
                this.getVendorCryptoOuterUserAddressList();
              }
            }
          }

          this.isShow = false;
          this.actionSetIsLoading(false);
          this.PassRoadOrAi();
          this.getPayOffer();
        })
        .catch(error => {
          const { msg, code } = error.response.data;

          this.isShow = false;
          this.actionSetIsLoading(false);

          this.actionSetGlobalMessage({
            msg,
            code
          });

          if (code === "TM0200111") {
            this.$emit("update:headerSetting", this.initHeaderSetting);
            this.resetStatus();
            this.getPayGroup();
          }
        });
    },

    /**
     * 取得支付優惠
     * @method getPayOffer
     */
    getPayOffer(amount) {
      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Vendor/Offer/And/Fee`,
        params: {
          channelId: this.curPassRoad.id,
          paymentMethodId: this.curPayInfo.payment_method_id,
          username: this.username,
          amount: amount,
          lang: "zh-cn",
          t_user_id: this.memInfo.user.user_id,
          t_user_name: this.memInfo.user.username
        }
      }).then(res => {
        if (res.status === "000") {
          this.offerInfo = res.data;
        }
      });
    },
    /**
     * 切換支付群組
     * @method changeMode
     * @param {Object} mode - 支付群組資訊
     */
    changeMode(mode) {
      // 目前 Only 代客充值
      if (mode.is_link && mode.link) {
        window.open(mode.link, "third");
        return;
      }

      this.resetStatus();
      this.resetTimerStatus();
      this.curModeGroup = mode;

      if (this.curModeGroup.payment_group_content) {
        this.changePayMode(this.curModeGroup.payment_group_content[0], 0);
      }

      [this.curPayInfo] = this.curModeGroup.payment_group_content;

      if (
        this.curModeGroup.channel_display &&
        (this.curPayInfo.bank_id ||
          this.curSelectedBank.value ||
          this.isSelectBankPaymentMethod)
      ) {
        this.getPayPass();
      }

      this.checkDepositInput();
    },
    /**
     * 切換支付方式
     * @method changePayMode
     * @param {Object} info - 支付方式資訊
     */
    changePayMode(info, index = null) {
      if (
        info.payment_method_id === this.curPayInfo.payment_method_id &&
        info.bank_id === this.curPayInfo.bank_id
      ) {
        return;
      }

      this.resetStatus();
      this.resetTimerStatus();
      this.curPayInfo = info;
      this.chooseUSDT();

      if (info.payment_method_id === 20) {
        this.checkSuccess = true;
      } else {
        this.checkSuccess = false;
      }

      if (
        this.curModeGroup.channel_display &&
        (this.curPayInfo.bank_id ||
          this.curSelectedBank.value ||
          this.isSelectBankPaymentMethod)
      ) {
        this.getPayPass();
      }

      if (this.allBanks && this.allBanks.length > 0) {
        this.defaultCurPayBank();
      }

      this.checkDepositInput();
      this.getVendorCryptoOuterUserAddressList();
      this.getUserBankList();
    },
    /**
     * 切換通道
     * @method changePassRoad
     * @param {Object} info - 支付方式資訊
     */
    changePassRoad(info) {
      this.curPassRoad = info;
      this.PassRoadOrAi();
      this.changeMoney(
        "",
        this.curPassRoad.amounts && this.curPassRoad.amounts.length === 0
      );
    },
    /**
     * 選擇通道金額
     * @method changeMoney
     * @param {String} money - 金額
     */
    changeMoney(money, canCustomMoney) {
      this.cryptoMoney = "--";
      this.isSelectedCustomMoney = !!canCustomMoney;
      this.isDisableDepositInput = !canCustomMoney;
      this.moneyValue = money;
      this.displayMoneyValue = this.formatThousandsCurrency(this.moneyValue);
      this.isErrorMoney = false;
      this.checkOrderData();
    },
    /**
     * 驗證存款金額
     * @method verificationMoney
     * @param {String} money - 金額
     */
    verificationMoney(money) {
      if (this.depositInterval.maxMoney) {
        this.isErrorMoney =
          Number(money) > this.depositInterval.maxMoney ||
          Number(money) < this.depositInterval.minMoney;
        return;
      }

      this.isErrorMoney = !money;
    },
    /**
     * 資料重置
     * @method resetStatus
     */
    resetStatus() {
      this.curPayInfo = {};
      this.selectedBank = {};
      this.passRoad = [];
      this.curPassRoad = {};

      this.moneyValue = "";
      this.displayMoneyValue = this.formatThousandsCurrency(this.moneyValue);

      this.isDisableDepositInput = false;
      this.isErrorMoney = false;
      this.nameCheckFail = false;
      this.checkSuccess = false;
      this.showOuterCryptoAddress = false;
      this.showEpointWalletAddress = false;

      this.walletData["CGPay"].password = "";
      this.cryptoMoney = "--";
      // this.resetTimerStatus();

      Object.keys(this.speedField).forEach(info => {
        if (info === "depositMethod") {
          this.speedField[info] = "";
          return;
        }

        this.speedField[info] = "";
      });
    },
    /**
     * 送出存款表單
     * @method submitList
     * @param {String} inputValue - 輸入金額
     */
    submitList() {
      const reg = /^[^，:;！@#$%^&*?<>()+=`|[\]{}\\"/.~\-_']*$/;

      if (!reg.test(this.speedField.depositName)) {
        return Promise.resolve({ status: "NameFail" });
      }

      this.nameCheckFail = false;

      let newWindow = "";
      newWindow = window.open(
        "",
        "",
        "width=1024, height=768, target=_blank, toolbar=yes"
      );

      const newWindowHref = uri => {
        setTimeout(() => {
          newWindow.location.href = uri;
        }, 200);
      };

      // 代客充值
      if (this.curPayInfo.external_url) {
        // 流量分析事件 - 成功
        window.dataLayer.push({
          event: "ga_click",
          eventCategory: "deposit",
          eventAction: "pay",
          eventLabel: "success"
        });

        newWindowHref(this.curPayInfo.external_url);
        return Promise.resolve({ status: "credit" });

        // window.open(this.curPayInfo.external_url, "credit");
        // return Promise.resolve({ status: "credit" });
      }

      this.isShow = true;
      this.actionSetIsLoading(true);
      let paramsData = {
        api_uri: "/api/trade/v2/c/entry",
        username: this.username,
        method_id: this.curPayInfo.payment_method_id,
        bank_id: this.curSelectedBank.value || this.curPayInfo.bank_id,
        amount: this.moneyValue
      };

      if (this.curPassRoad.id) {
        paramsData = {
          ...paramsData,
          channel_id: this.curPassRoad.id
        };
      }
      // 銀行匯款、支付轉帳的極速到帳表單
      if ([5, 6].includes(this.curPayInfo.payment_type_id)) {
        paramsData = {
          ...paramsData,
          pay_account: this.speedField.depositAccount,
          pay_username: this.speedField.depositName,
          method: this.speedField.depositMethod,
          branch: this.speedField.bankBranch,
          deposit_at: this.speedField.depositTime,
          sn: this.speedField.serialNumber
        };
      }

      // CGPay：選擇支付密碼
      if (
        this.curPayInfo.payment_method_id === 16 &&
        this.walletData["CGPay"].method === 0
      ) {
        paramsData = {
          ...paramsData,
          wallet_token: +this.walletData["CGPay"].password
        };
      }

      if (this.curPassRoad.is_outer_crypto) {
        if (this.showOuterCryptoAddress) {
          paramsData = {
            ...paramsData,
            user_address: this.outerCryptoAddress
          };
        } else {
          paramsData = {
            ...paramsData,
            user_address: this.defaultOuterCrypto
          };
        }
      }
      //e點富
      if (this.curPayInfo.payment_method_id === 34) {
        if (this.showEpointWalletAddress) {
          paramsData = {
            ...paramsData,
            pay_account: this.epointBankAccount,
            pay_bank_name: this.epointBankName
          };
        } else {
          paramsData = {
            ...paramsData,
            pay_account_id: this.defaultEpointWallet.id
          };
        }
      }

      //幣希
      if (this.curPayInfo.payment_method_id === 32) {
        paramsData = {
          ...paramsData,
          currency: this.selectBcCoin.currency
        };
      }

      let _isPWA = true;

      return axios({
        method: "post",
        url: API_TRADE_RELAY,
        data: {
          ...paramsData
        }
      })
        .then(response => {
          this.isShow = false;
          this.actionSetIsLoading(false);

          const { result, ret, msg, code } = response.data;

          let _isWebview =
            getCookie("platform") === "H" ||
            window.location.host === "yaboxxxapp02.com";

          if (result !== "ok") {
            // 流量分析事件 - 失敗
            window.dataLayer.push({
              event: "ga_click",
              eventCategory: "deposit",
              eventAction: "pay",
              eventLabel: "failure"
            });

            this.actionSetGlobalMessage({
              msg,
              code
            });

            newWindow.close();

            return { status: "error" };
          }

          // 流量分析事件 - 成功
          window.dataLayer.push({
            event: "ga_click",
            eventCategory: "deposit",
            eventAction: "pay",
            eventLabel: "success"
          });

          console.log(ret, _isWebview);

          // 如有回傳限制時間
          if (ret.remit.limit_time) {
            this.limitTime = ret.remit.limit_time;
          }

          if (ret.deposit.url) {
            if (_isWebview) {
              this.webviewOpenUrl = ret.deposit.url;
              // setTimeout(function () { document.location.href = response.ret.deposit.url; }, 250);
              return { status: "third" };
            } else if (_isPWA) {
              newWindowHref(ret.deposit.url);
              return { status: "third" };
            }
            window.open(ret.deposit.url, "third");
            return { status: "third" };
          }
          if (ret.wallet.url) {
            if (this.curPayInfo.payment_method_id === 34) {
              localStorage.setItem("iframe-third-url", ret.wallet.url);
              // localStorage.setItem("iframe-third-url-title", "搓合查询");
              this.$router.push(`/mobile/iframe/deposit?func=false`);
              newWindow.close();
              return;
            }
            if (_isWebview) {
              this.webviewOpenUrl = ret.wallet.url;
              // setTimeout(function () { document.location.href = ret.wallet.url; }, 250);
              return { status: "third" };
            } else if (_isPWA) {
              newWindowHref(ret.wallet.url);
              return { status: "third" };
            }
            window.open(ret.wallet.url, "third");
            return { status: "third" };
          }

          Object.keys(ret).forEach(info => {
            if (
              info === "deposit" ||
              info === "wallet" ||
              info === "remit" ||
              info === "crypto"
            ) {
              return;
            }
            if (
              ret[info] &&
              (info === "is_deposit" ||
                info === "is_wallet" ||
                info === "is_crypto" ||
                info === "is_remit")
            ) {
              const typeKey = info.split("_")[1];
              this.orderData.orderInfo = ret[typeKey];
              this.orderData.methodType = typeKey;
            }
            this.orderData[info] = ret[info];
          });

          if (_isPWA) {
            newWindow.close();
          }

          // CGPay 不需要進入詳細入款單
          if (this.curPayInfo.payment_method_id === 16) {
            // 將「confirmOneBtn」彈窗打開
            this.setPopupStatus(true, "funcTips");
            this.confirmPopupObj = {
              title: "支付成功",
              btnText: "关闭",
              cb: () => {
                this.closePopup();
                this.$emit("update:headerSetting", this.initHeaderSetting);
                this.resetStatus();
                this.getPayGroup();
              }
            };
            return { status: "third" };
          }

          return { status: "local" };

          // 停權？
          // if (
          //   code === "TM020058" ||
          //   code === "TM020059" ||
          //   code === "TM020060"
          // ) {
          //   this.actionSetGlobalMessage({
          //     msg,
          //     code
          //   });
          //   window.location.reload();
          //   return { status: "error" };
          // }
        })
        .catch(error => {
          const { msg, code } = error.response.data;

          this.isShow = false;
          this.actionSetIsLoading(false);

          if (_isPWA) {
            newWindow.close();
          }
          if (code === 1501020021) {
            (async () => {
              await this.getPayPass();
              this.verificationMoney(this.moneyValue);
            })();
          }

          this.actionSetGlobalMessage({
            msg,
            code
          });

          // 提交申請單時，如存款金額低於交易費，後台需阻擋且重新撈取新的單筆限額
          // if (code === 1500720069) {
          //   this.getPayPass().then(() => {
          //     this.verification("money", this.moneyValue);
          //     this.checkOrderData();
          //     this.getSingleLimit(
          //       this.depositInterval.minMoney,
          //       this.depositInterval.maxMoney,
          //       "placeholder"
          //     );
          //   });
          // }

          const errorsList = [
            1500110061,
            1500110091,
            1500170088,
            1500170098,
            1500500097,
            1500720088,
            1500720069,
            "TM020063",
            1500170054,
            1500500064
          ];

          if (errorsList.includes(code)) {
            this.$emit("update:headerSetting", this.initHeaderSetting);
            this.resetStatus();
            this.getPayGroup();
          }
        });
    },
    /**
     * 複製
     * @method copyInfo
     * @param {String} text - 需複製資訊
     */
    copyInfo(text) {
      this.$copyText(text);
      this.actionSetGlobalMessage({
        msg: "已复制到剪贴板"
      });
    },
    checkOrderData() {
      // 金額輸入錯誤
      if (
        this.isErrorMoney ||
        !this.moneyValue ||
        (this.depositInterval.minMoney &&
          this.depositInterval.minMoney > this.moneyValue) ||
        (this.depositInterval.maxMoney &&
          this.depositInterval.maxMoney < this.moneyValue)
      ) {
        this.checkSuccess = false;
        return;
      }

      // 檢查銀行匯款、支付轉帳的極速到帳表單必填欄位
      if ([5, 6].includes(this.curPayInfo.payment_type_id)) {
        const checkItemMap = {
          method: {
            key: "bankBranch",
            alertMessage: this.$text("S_ENTER_DEPOSIT_BRANCH", "请输入银行支行")
          },
          deposit_at: {
            key: "depositTime",
            alertMessage: this.$text("S_ENTER_DEPOSIT_TIME", "请输入充值时间")
          },
          pay_account: {
            key: "depositAccount",
            alertMessage: this.$text(
              "S_ENTER_DEPOSIT_ACCOUNT",
              "请输入充值银行帐号"
            )
          },
          pay_username: {
            key: "depositName",
            alertMessage:
              this.curPayInfo.payment_type_id === 6
                ? this.$text("S_ENTER_DEPOSIT_NICKNAME", "请输入充值昵称")
                : this.$text("S_ENTER_DEPOSIT_NAME", "请输入充值人姓名")
          },
          sn: {
            key: "serialNumber",
            alertMessage: this.$text(
              "S_PLZ_ENTER_SERIAL_NUMBER",
              "请输入流水号"
            )
          }
        };

        const missingRequiredField = this.curPayInfo.field.find(item => {
          const check = checkItemMap[item.name];

          // 存款方式不是存款方式不是ATM或銀行櫃台 則不需檢查銀行支行的必填
          if (
            item.name === "method" &&
            !["2", "4"].includes(this.speedField.depositMethod)
          ) {
            return false;
          }

          if (check && item.required && !this.speedField[check.key]) {
            return true;
          }

          return false;
        });

        if (missingRequiredField) {
          this.checkSuccess = false;
          return;
        }
      }

      this.checkSuccess = true;
    },
    checkDepositInput() {
      // 自訂金額可填
      if (this.isSelectedCustomMoney) {
        this.isDisableDepositInput = false;
        this.checkSuccess = false;
        return;
      }
    },
    defaultCurPayBank() {
      let target = this.allBanks.find(item => {
        return item.value === this.curPayInfo.bank_id;
      });

      // 110/01/09 待再優化使用銀行這塊
      this.curSelectedBank = target || this.allBanks[0] || {};
    },
    getSingleLimit(minMoney, maxMoney, type = null) {
      let str = type === "placeholder" ? "单笔充值金额：" : "";

      if (isNaN(minMoney) || isNaN(maxMoney)) {
        return str;
      }

      minMoney = this.formatThousandsCurrency(minMoney);
      maxMoney = this.formatThousandsCurrency(maxMoney);

      switch (true) {
        // 最大金額不為0的時候，顯示最小值~最大值
        case Number(maxMoney) !== 0:
          str += `¥${minMoney} ~ ¥${maxMoney}`;
          break;

        // 最小金額不為0的時候，顯示最低金額~无限制
        case Number(minMoney) !== 0 && Number(maxMoney) === 0:
          str += `¥${minMoney} ~ 无限制`;
          break;

        // 最大金額 & 最低金額 都為0的時候，顯示無限制
        case Number(minMoney) === 0 && Number(maxMoney) === 0:
          str += `无限制`;
          break;
      }

      return str;
    },
    // 取得 CGPay 餘額
    getCGPayBalance() {
      return axios({
        method: "get",
        url: "/api/v1/c/ext/inpay?api_uri=api/trade/v2/c/wallet/balance",
        params: {
          method_id: this.curPayInfo.payment_method_id
        }
      })
        .then(response => {
          const { result, ret, msg, code } = response.data;

          if (!response || result !== "ok") {
            this.walletData["CGPay"].balance = "--";

            this.actionSetGlobalMessage({
              msg,
              code
            });
            return;
          }

          this.walletData["CGPay"].balance = ret.balance;
          // this.walletData["CGPay"].balance = "--";
        })
        .catch(error => {
          const { msg, code } = error.response.data;
          this.walletData["CGPay"].balance = "--";

          this.actionSetGlobalMessage({
            msg,
            code
          });
        });
    },
    // 取得存/取款加密貨幣試算金額
    convertCryptoMoney() {
      if (
        this.curPayInfo.payment_method_id === 32 &&
        !this.selectBcCoin.currency
      ) {
        return;
      }
      return axios({
        method: "get",
        url: API_CRYPTO_MONEY,
        params: {
          type: 1,
          amount: this.moneyValue,
          method_id: this.curPayInfo.payment_method_id,
          currency:
            this.curPayInfo.payment_method_id === 32
              ? this.selectBcCoin.currency
              : ""
        }
      })
        .then(response => {
          const { result, ret } = response.data;
          if (!response || result !== "ok") return;

          this.rate = ret.rate;

          if (this.moneyValue != "") {
            this.cryptoMoney = ret.crypto_amount;
          } else {
            this.cryptoMoney = "--";
          }

          this.isClickCoversionBtn = true;

          //當切換成USDT和歸零的時候才重call秒數
          if (this.updateTime) {
            this.updateTime = false;
            this.countdownSec = this.countdownSec ? this.countdownSec : ret.ttl;
          }

          // 僅限按下按鈕觸發，@input & @blur 皆不會觸發
          if (this.countdownSec && !this.timer) {
            this.timer = setInterval(() => {
              if (this.countdownSec === 0) {
                // if (this.submitStatus !== "stepTwo") {
                //   // 需重新判斷
                //   // 將「confirmOneBtn」彈窗打開
                //   this.setPopupStatus(true, "funcTips");

                //   this.confirmPopupObj = {
                //     title: ["porn1", "sg1"].includes(this.themeTPL)
                //       ? "汇率已失效"
                //       : "汇率已失效，请再次确认汇率",
                //     btnText: "刷新汇率",
                //     cb: () => {
                //       this.closePopup();
                //       this.convertCryptoMoney();
                //     }
                //   };
                // }

                this.resetTimerStatus();
                this.cryptoMoney = "--";
                return;
              }
              this.countdownSec -= 1;
            }, 1000);
          }
        })
        .catch(error => {
          const { msg, code } = error.response.data;
          this.actionSetGlobalMessage({
            msg,
            code
          });
        });
    },
    // 取得使用者站外錢包入款錢包地址
    getVendorCryptoOuterUserAddressList() {
      console.log("getVendorCryptoOuterUserAddressList");
      return axios({
        method: "get",
        url: API_MCENTER_DEPOSIT_OUTER_WALLET,
        params: {
          payment_method_id: this.curPayInfo.payment_method_id
        }
      })
        .then(response => {
          if (response && response.data && response.data.result === "ok") {
            console.log(response);
            this.outerCryptoOption = [];
            this.defaultOuterCrypto = "";
            response.data.ret.forEach(outerAddress => {
              if (outerAddress.is_default) {
                this.defaultOuterCrypto = outerAddress.address;
              }
              this.outerCryptoOption.push(outerAddress.address);
            });
            this.defaultOuterCrypto =
              this.defaultOuterCrypto === ""
                ? this.outerCryptoOption[0]
                : this.defaultOuterCrypto;

            this.outerCryptoOption.push("其他位址");
          }

          // this.outerCryptoOption = ["1", "2", "3"];
        })
        .catch(error => {});
    },
    // 取得使用者銀行卡列表(迅付)
    getUserBankList() {
      console.log("API_MCENTER_DEPOSIT_BANK");
      return axios({
        method: "get",
        url: API_MCENTER_DEPOSIT_BANK,
        params: {}
      })
        .then(response => {
          if (response && response.data && response.data.result === "ok") {
            console.log(response);
            this.userBankOption = [];
            this.userBankOption = response.data.ret;
            this.userBankOption.push({ account: "其他银行卡" });
            this.defaultEpointWallet = this.userBankOption[0];
          }
        })
        .catch(error => {});
    },
    formatCountdownSec() {
      let minutes = Math.floor(this.countdownSec / 60);
      let sec = this.countdownSec - minutes * 60;

      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (sec < 10) {
        sec = "0" + sec;
      }

      return `${minutes}:${sec}`;
    },
    resetTimerStatus() {
      clearInterval(this.timer);
      this.timer = null;
      this.countdownSec = 0;
      this.isClickCoversionBtn = false;
    },
    timeUSDT() {
      if (this.countdownSec > 0) {
        return this.formatCountdownSec();
      } else if (this.countdownSec === 0) {
        this.updateTime = true;
        this.resetTimerStatus();
        this.convertCryptoMoney();
        return "00:00";
      }
    },
    chooseUSDT() {
      //選擇 CGPAY-USDT ,USDT
      if (
        this.curPayInfo.payment_method_id === 25 ||
        this.curPayInfo.payment_method_id === 402 ||
        this.curPayInfo.payment_method_id === 404
      ) {
        this.resetTimerStatus(); //讓timeUSDT()跑進this.countdownSec === 0
      }
      return;
    },
    moneyUSDT(e) {
      //防止輸入連續call api
      clearTimeout(this.timerUSDT);
      this.timerUSDT = setTimeout(() => {
        //USDT、CGP-USDT
        this.convertCryptoMoney();
      }, 1000);
    },
    formatThousandsCurrency(value) {
      return thousandsCurrency(value);
    }
  }
};
