<template>
  <!-- 提款前提示彈窗 -->
  <transition name="fade">
    <div v-if="show" :class="$style['more-method-wrap']">
      <div :class="$style['more-method-container']">
        <div :class="$style['more-method-header']">
          <div @click="close" :class="$style['prev']">
            {{ $text("S_CANCEL", "取消") }}
          </div>

          <div :class="$style['title']">
            {{ "更多提现方式" }}
          </div>
        </div>

        <div :class="$style['more-method-content']">
          <div
            v-for="item in methodList"
            :class="$style['cell']"
            @click="addMethod(item)"
          >
            <div v-if="themeTPL === 'porn1'" :class="$style['add-block']">
              <img
                :src="$getCdnPath(`/static/image/porn1/mcenter/add.png`)"
                alt="add"
              />
            </div>
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>

    <popup-qrcode
      v-if="isShowPopQrcode"
      :isShowPop.sync="isShowPopQrcode"
      :paymentGatewayId="bank_id"
    />
  </transition>
</template>

<script>
import axios from "axios";
import { mapGetters, mapActions } from "vuex";
import popupQrcode from "@/router/mobile/components/common/virtualBank/popupQrcode";

export default {
  components: {
    popupQrcode
  },
  props: {
    moreMethodStatus: {
      type: Object,
      default: () => {}
    },
    checkAccountData: {
      type: Function,
      default: () => {}
    },
    show: {
      type: Boolean,
      default: false
    },
    userLevelObj: {
      type: Object,
      default: {}
    },
    withdrawUserData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      bank_id: "",
      isShowPopQrcode: false,
      nowOpenWallet: []
    };
  },
  computed: {
    ...mapGetters({
      noticeData: "getNoticeData",
      isBindGoBao: "getHasBindGoBao",
      CGPayInfo: "getCGPayInfo",
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    $style() {
      return (
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1
      );
    },
    methodList() {
      return [
        {
          key: "bankCard",
          title: this.themeTPL === "porn1" ? "添加银行卡" : "添加 提现银行卡",
          isShow: this.showAddBankCard
        },
        {
          key: "wallet",
          title: this.themeTPL === "porn1" ? "添加数字货币" : "添加 电子钱包",
          isShow: this.showAddWallet
        },
        {
          key: "CGPay",
          title: "新增 CGPay",
          isShow: this.themeTPL === "ey1" && !this.CGPayInfo.is_bind_wallet
        },
        {
          key: "goBao",
          title: "新增 购宝钱包",
          isShow: this.themeTPL === "ey1" && !this.isBindGoBao
        }
      ].filter(item => item.isShow);
    },
    showAddBankCard() {
      if (
        this.userLevelObj.bank &&
        this.withdrawUserData &&
        this.withdrawUserData.account &&
        this.withdrawUserData.account.length < 3
      ) {
        this.$emit("update:moreMethodStatus", {
          objKey: "bankCard",
          data: true
        });
        return true;
      } else {
        this.$emit("update:moreMethodStatus", {
          objKey: "bankCard",
          data: false
        });
        return false;
      }
    },
    showAddWallet() {
      // 尚未打開電子錢包開關
      if (!this.userLevelObj.virtual_bank) {
        this.$emit("update:moreMethodStatus", {
          objKey: "wallet",
          data: false
        });
        return false;
      }

      if (this.themeTPL === "porn1") {
        let nowBindWalletCount = 0;
        let idArr = [
          ...new Set(
            this.withdrawUserData.wallet.map(item => {
              return item.payment_gateway_id;
            })
          )
        ];

        if (idArr) {
          this.nowOpenWallet.forEach(item => {
            if (idArr.includes(item.id)) {
              nowBindWalletCount += 1;
            }
          });

          // 當使用者已綁定目前所有開放的電子錢包時
          if (nowBindWalletCount >= this.nowOpenWallet.length) {
            this.$emit("update:moreMethodStatus", {
              objKey: "wallet",
              data: false
            });
            return false;
          }
        }

        this.$emit("update:moreMethodStatus", {
          objKey: "wallet",
          data: true
        });
        return true;
      }

      if (this.themeTPL === "ey1") {
        // 已開啟電子錢包開關 & 未開啟限綁一組開關
        let noSingleLimit =
          !this.userLevelObj.virtual_bank_single &&
          this.withdrawUserData.wallet &&
          this.withdrawUserData.wallet.length < 15;

        // 已開啟電子錢包開關 & 已開啟限綁一組開關
        let singleLimit =
          this.userLevelObj.virtual_bank_single &&
          this.withdrawUserData.wallet &&
          this.withdrawUserData.wallet.length < this.nowOpenWallet.length;

        if (noSingleLimit || singleLimit) {
          return true;
        }

        return false;
      }
    },
    showPopQrcode: {
      get() {
        return this.isShowPopQrcode;
      },
      set(value) {
        this.isShowPopQrcode = value;
      }
    }
  },
  watch: {
    noticeData(value) {
      if (this.noticeData && this.noticeData.length > 0) {
        let data = this.noticeData[0];

        if (data.event === "trade_bind_wallet" && data.result === "ok") {
          this.actionSetGlobalMessage({
            msg: "绑定成功",
            cb: () => {
              window.location.reload();
            }
          });
        }
      }
    }
  },
  created() {
    this.actionBindGoBao();
    this.actionSetCGPayInfo();
    this.getNowOpenWallet();
  },
  methods: {
    ...mapActions([
      "actionSetGlobalMessage",
      "actionBindGoBao",
      "actionSetCGPayInfo"
    ]),
    close() {
      this.$emit("close");
    },
    addMethod(item) {
      switch (item.key) {
        case "bankCard":
          this.checkAccountData("bankCard");
          break;

        case "wallet":
          this.checkAccountData("wallet");
          break;

        case "CGPay":
          this.$router.push(
            "/mobile/mcenter/bankcard?redirect=withdraw&type=wallet&wallet=CGPay"
          );
          break;

        case "goBao":
          this.isShowPopQrcode = true;
          this.bank_id = 37;
          break;
      }
      this.close();
    },
    getNowOpenWallet() {
      // Get 錢包類型
      axios({
        method: "get",
        url: "/api/payment/v1/c/virtual/bank/list"
      }).then(response => {
        const { ret, result } = response.data;

        if (!response || result !== "ok") {
          return;
        }

        this.nowOpenWallet = ret;
      });
    }
  }
};
</script>

<style
  lang="scss"
  src="../css/withdrawMoreMethod/porn1.index.module.scss"
  module="$style_porn1"
></style>
<style
  lang="scss"
  src="../css/withdrawMoreMethod/ey1.index.module.scss"
  module="$style_ey1"
></style>
