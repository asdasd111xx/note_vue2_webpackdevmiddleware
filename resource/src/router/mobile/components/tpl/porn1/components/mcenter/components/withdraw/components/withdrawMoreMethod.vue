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
    withdrawUserData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      bank_id: "",
      isShowPopQrcode: false,
    };
  },
  computed: {
    ...mapGetters({
      noticeData: "getNoticeData",
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
          isShow: this.moreMethodStatus.bankCard
        },
        {
          key: "wallet",
          title: this.themeTPL === "porn1" ? "添加数字货币" : "添加 电子钱包",
          isShow: this.moreMethodStatus.wallet
        },
        {
          key: "CGPay",
          title: "新增 CGPay",
          isShow:
            this.themeTPL === "ey1" &&
            this.withdrawUserData.support_binding.find(item => {
              return item.wallet_gateway_id === 3;
            })
        },
        {
          key: "goBao",
          title: "新增 购宝钱包",
          isShow:
            this.themeTPL === "ey1" &&
            this.withdrawUserData.support_binding.find(item => {
              return item.wallet_gateway_id === 2;
            })
        }
      ].filter(item => item.isShow);
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
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
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
