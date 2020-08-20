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
      nowOpenVirtualBank: []
    };
  },
  computed: {
    ...mapGetters({
      noticeData: "getNoticeData",
      isBindGoBao:"getHasBindGoBao",
      CGPayInfo:"getCGPayInfo"
    }),
    methodList() {
      // Todo: show -> 是否同卡片管理一樣，顯示的部份依限綁一組來吃不同的邏輯
      return [
        {
          key: "bankCard",
          title: "添加 提现银行卡",
          isShow: this.showAddBankCard
        },
        {
          key: "virtualBank",
          title: "添加 电子钱包",
          isShow: this.showAddVirtualBank
        },
        {
          key: "CGPay",
          title: "新增 CGPay",
          isShow: !this.CGPayInfo.is_bind_wallet
        },
        {
          key: "goBao",
          title: "新增 购宝钱包",
          isShow: !this.isBindGoBao
        }
      ].filter(item => item.isShow);
    },
    showAddBankCard() {
      return (
        this.userLevelObj.bank &&
        this.withdrawUserData &&
        this.withdrawUserData.account &&
        this.withdrawUserData.account.length < 3
      );
    },
    showAddVirtualBank() {
      // 尚未打開電子錢包開關
      if (!this.userLevelObj.virtual_bank) {
        return false;
      }

      // 已開啟電子錢包開關 & 未開啟限綁一組開關
      let noSingleLimit =
        !this.userLevelObj.virtual_bank_single &&
        this.withdrawUserData.wallet &&
        this.withdrawUserData.wallet.length < 15;

      // 已開啟電子錢包開關 & 已開啟限綁一組開關
      let singleLimit =
        this.userLevelObj.virtual_bank_single &&
        this.withdrawUserData.wallet &&
        this.withdrawUserData.wallet.length < this.nowOpenVirtualBank.length;

      if (noSingleLimit || singleLimit) {
        return true;
      }

      return false;
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
    this.getNowOpenVirtualBank();
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

        case "virtualBank":
          this.checkAccountData("virtualBank");
          break;

        case "CGPay":
          this.$router.push(
            "/mobile/mcenter/bankcard?redirect=withdraw&type=virtualBank&wallet=CGPay"
          );
          break;

        case "goBao":
          this.isShowPopQrcode = true;
          this.bank_id = 37;
          break;
      }
      this.close();
    },
    getNowOpenVirtualBank() {
      // Get 錢包類型
      axios({
        method: "get",
        url: "/api/payment/v1/c/virtual/bank/list"
      }).then(response => {
        const { ret, result } = response.data;

        if (!response || result !== "ok") {
          return;
        }

        this.nowOpenVirtualBank = ret;
      });
    }
  }
};
</script>

<style lang="scss" module>
.more-method-wrap {
  background-color: rgba(0, 0, 0, 0.8);
  color: #414655;
  height: 100%;
  margin: 0;
  overflow: hidden;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 10;
  max-width: 420px;
}

.more-method-container {
  background-color: #f8f8f7;
  border-radius: 20px 20px 0px 0px;
  bottom: 0;
  height: 312px;
  overflow: hidden;
  position: absolute;
  width: 100%;
}

.more-method-header {
  background-color: #ffffff;
  color: #414655;
  font-size: 17px;
  height: 75px;
  line-height: 75px;

  .prev {
    left: 14px;
    position: absolute;
    text-align: center;
    width: 40px;
  }

  .title {
    width: 100%;
    text-align: center;
  }
}

.more-method-content {
  background-color: #f8f8f7;
  margin-top: 10px;

  .cell {
    font-size: 14px;
    background-color: #ffffff;
    color: #0477e9;
    height: 50px;
    line-height: 50px;
    margin-bottom: 1px;
    padding-left: 23px;
  }
}
</style>
