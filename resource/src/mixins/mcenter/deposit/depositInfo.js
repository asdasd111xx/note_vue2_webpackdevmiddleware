import { API_TRADE_RELAY } from "@/config/api";
import Vue from "vue";
import ajax from "@/lib/ajax";

export default {
  props: {
    requiredFields: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      moreShow: false,
      speedField: {
        depositMethod: this.orderData.orderInfo.method
          ? String(this.orderData.orderInfo.method)
          : "",
        depositTime: this.orderData.orderInfo.deposit_at
          ? Vue.moment(this.orderData.orderInfo.deposit_at)
              .utcOffset(+8)
              .format("YYYY-MM-DD HH:mm:ss")
          : "",
        depositAccount: this.orderData.orderInfo.pay_account,
        depositName: this.orderData.orderInfo.pay_username,
        bankBranch: this.orderData.orderInfo.branch,
        serialNumber: this.orderData.orderInfo.sn
      }
    };
  },
  computed: {
    receiptInfo() {
      if (this.orderData.methodType === "deposit") {
        return [
          {
            objKey: "order",
            title: this.$text("S_ORDER_NUMBER_2", "订单号"),
            value: this.orderData.id,
            isFontBold: true,
            copyShow: false
          },
          {
            objKey: "payInfo",
            title: this.$text("S_PAY_INFO", "支付资讯"),
            isFontBold: true,
            copyShow: false,
            qrcode: [
              {
                title: this.$text("S_SCANNING", "扫一扫"),
                value:
                  this.orderData.orderInfo.qrcode ||
                  this.orderData.orderInfo.img
              }
            ]
          }
        ];
      }

      if (this.orderData.methodType === "wallet") {
        return [
          {
            objKey: "order",
            title: this.$text("S_ORDER_NUMBER_2", "订单号"),
            value: this.orderData.id,
            isFontBold: true,
            copyShow: false
          },
          {
            objKey: "payInfo",
            title: this.$text("S_PAY_INFO", "支付资讯"),
            isFontBold: true,
            copyShow: false,
            qrcode: [
              {
                title: this.$text("S_SCANNING", "扫一扫"),
                value:
                  this.orderData.orderInfo.qrcode ||
                  this.orderData.orderInfo.img
              }
            ]
          }
        ];
      }

      if (this.orderData.methodType === "crypto") {
        return [
          {
            objKey: "order",
            title: this.$text("S_ORDER_NUMBER_2", "订单号"),
            value: this.orderData.id,
            isFontBold: true,
            copyShow: true
          },
          {
            objKey: "receiveWalletAddress",
            title: this.$text("S_RECEIVE_WITHDRAW_ADDRESS", "收款钱包位址"),
            value: this.orderData.orderInfo.address,
            isFontBold: true,
            copyShow: true
          },
          {
            objKey: "payInfo",
            title: this.$text("S_DELIVER_INFO", "收款资讯"),
            isFontBold: true,
            copyShow: false,
            qrcode: [
              {
                title: "点击图片截屏扫码",
                value:
                  this.orderData.orderInfo.qrcode ||
                  this.orderData.orderInfo.img
              }
            ]
          },
          {
            objKey: "receiveWalletAddress",
            title: this.$text("S_NEED_TRANSFER_IN_COUNT", "需转入数量"),
            value: `${this.orderData.orderInfo.crypto_num} ${this.orderData.method_name}`,
            isFontBold: true,
            isHighlightValue: true,
            copyShow: false
          }
        ];
      }

      if (
        this.orderData.methodType === "remit" &&
        (this.orderData.orderInfo.qrcode || this.orderData.orderInfo.photo)
      ) {
        return [
          {
            objKey: "order",
            title: this.$text("S_ORDER_NUMBER_2", "订单号"),
            value: this.orderData.id,
            isFontBold: true,
            copyShow: true
          },
          {
            objKey: "withdrawAccount",
            title: this.$text("S_WITHDRAW_ACCOUNT", "收款帐号"),
            value: this.orderData.orderInfo.bank_account,
            isFontBold: false,
            copyShow: true
          },
          {
            objKey: "withdrawNickname",
            title: this.$text("S_WITHDRAW_NICKNAME", "收款昵称"),
            value: this.orderData.orderInfo.bank_account_name,
            isFontBold: false,
            copyShow: false
          },
          {
            objKey: "withdrawDeliver",
            title: this.$text("S_DELIVER_INFO", "收款资讯"),
            isFontBold: true,
            copyShow: false,
            qrcode: [
              {
                title: this.orderData.orderInfo.photo_name,
                value: this.orderData.orderInfo.photo
              },
              {
                title: this.orderData.orderInfo.qrcode_name,
                value: this.orderData.orderInfo.qrcode
              }
            ]
          },
          {
            objKey: "memo",
            title: this.$text("S_DEPOSIT_TIP05", "提醒事项"),
            value: this.orderData.reminder.replace(/\n/gi, "<br/>"),
            isFontBold: false,
            copyShow: false,
            htmlShow: true
          }
        ];
      }

      return [
        {
          objKey: "order",
          title: this.$text("S_ORDER_NUMBER_2", "订单号"),
          value: this.orderData.id,
          isFontBold: true,
          copyShow: true
        },
        {
          objKey: "withdrawBank",
          title: this.$text("S_WITHDRAW_BANK", "收款银行"),
          value: this.orderData.orderInfo.bank_name,
          isFontBold: false,
          copyShow: true
        },
        {
          objKey: "withdrawBranch",
          title: this.$text("S_WITHDRAW_BRANCH", "收款支行"),
          value: this.orderData.orderInfo.bank_branch,
          isFontBold: false,
          copyShow: true
        },
        {
          objKey: "withdrawAccount",
          title: this.$text("S_WITHDRAW_ACCOUNT", "收款帐号"),
          value: this.orderData.orderInfo.bank_account,
          isFontBold: true,
          copyShow: true
        },
        {
          objKey: "withdrawName",
          title: this.$text("S_WITHDRAW_NAME", "收款人姓名"),
          value: this.orderData.orderInfo.bank_account_name,
          isFontBold: false,
          copyShow: true
        },
        {
          objKey: "memo",
          title: this.$text("S_DEPOSIT_TIP05", "提醒事项"),
          value: this.orderData.reminder.replace(/\n/gi, "<br/>"),
          isFontBold: false,
          copyShow: false,
          htmlShow: true
        }
      ];
    },
    yourDepositData() {
      // 加密貨幣不顯示
      if (this.orderData.is_crypto) return;

      return [
        {
          objKey: "yourAccount",
          title: this.$text("S_NAME", "会员帐号"),
          value: this.orderData.username,
          isFontBold: false
        },
        {
          objKey: "yourBank",
          title:
            this.orderData.method_id === 3
              ? this.$text("S_USE_BANK", "使用银行")
              : this.$text("S_PAY_MODE", "支付方式"),
          value: this.orderData.method_name,
          isFontBold: false
        },
        {
          objKey: "yourMoney",
          title: this.$text("S_DEPOSIT_MONEY", "充值金额"),
          value: this.orderData.amount,
          isFontBold: true
        }
      ];
    },
    isSubmitDisabled() {
      // 檢查銀行匯款、支付轉帳的必填欄位
      if ([5, 6].includes(this.orderData.type_id)) {
        const checkItemMap = {
          method: {
            key: "bankBranch"
          },
          deposit_at: {
            key: "depositTime"
          },
          pay_account: {
            key: "depositAccount"
          },
          pay_username: {
            key: "depositName"
          },
          sn: {
            key: "serialNumber"
          }
        };
        return this.requiredFields.find(item => {
          const check = checkItemMap[item.name];

          // 存款方式不是存款方式不是ATM或銀行櫃台 則不需檢查銀行支行的必填
          if (
            item.name === "method" &&
            !["2", "4"].includes(this.speedField.depositMethod)
          ) {
            return false;
          }

          return check && item.required && !this.speedField[check.key];
        });
      }
      return false;
    }
  },
  methods: {
    /**
     * 提交存款修改資料
     * @method confirmDeposit
     */
    confirmDeposit() {
      // 銀行匯款 or 支付轉帳，才需要輸入存款資料
      if ([5, 6].includes(this.orderData.type_id)) {
        let paramData = {};

        paramData = {
          deposit_at: this.speedField.depositTime,
          pay_account: this.speedField.depositAccount,
          pay_username: this.speedField.depositName,
          method: this.speedField.depositMethod,
          branch: this.speedField.bankBranch,
          sn: this.speedField.serialNumber
        };
        return ajax({
          method: "put",
          url: API_TRADE_RELAY,
          errorAlert: false,
          params: {
            api_uri: `/api/trade/v2/c/entry/${this.orderData.id}/submit`,
            ...paramData
          }
        }).then(response => {
          if (response.result === "ok") {
            // 流量分析事件 - 成功
            window.dataLayer.push({
              event: "ga_click",
              eventCategory: "deposit",
              eventAction: "submit",
              eventLabel: "success"
            });
            return { status: "ok" };
          }

          // 流量分析事件 - 失敗
          window.dataLayer.push({
            event: "ga_click",
            eventCategory: "deposit",
            eventAction: "submit",
            eventLabel: "failure"
          });
          return { status: "error" };
        });
      }

      return Promise.resolve({ status: "ok" });
    },
    /**
     * 複製
     * @method copyInfo
     * @param {String} text - 需複製資訊
     */
    copyInfo(text) {
      this.$copyText(text);
      this.msg = "已复制到剪贴板";
    }
  }
};
