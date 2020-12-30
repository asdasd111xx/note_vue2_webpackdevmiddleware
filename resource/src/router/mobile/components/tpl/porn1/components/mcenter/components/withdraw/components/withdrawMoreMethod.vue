<template>
  <transition name="fade">
    <div>
      <!-- 12/17 該份 vue 檔之後以 pickerView.vue 共用 by Chia-->
      <!-- 提款前提示彈窗 -->
      <template v-if="!showPopStatus.isShow">
        <div :class="$style['more-method-wrap']">
          <div :class="$style['more-method-container']">
            <div :class="$style['more-method-header']">
              <div @click="closePopup" :class="$style['prev']">
                {{ $text("S_CANCEL", "取消") }}
              </div>

              <div :class="$style['title']">
                {{
                  ["porn1", "sg1"].includes(themeTPL)
                    ? "添加提现方式"
                    : "选择转出货币"
                }}
              </div>
            </div>

            <div :class="$style['more-method-content']">
              <div
                v-for="item in methodList"
                :class="$style['cell']"
                @click="addMethod(item)"
              >
                <div
                  v-if="['porn1', 'sg1'].includes(themeTPL)"
                  :class="$style['add-block']"
                >
                  <img
                    v-if="themeTPL === 'porn1'"
                    :src="$getCdnPath(`/static/image/porn1/mcenter/add.png`)"
                    alt="add"
                  />

                  <img
                    v-if="themeTPL === 'sg1'"
                    :src="$getCdnPath(`/static/image/sg1/mcenter/add.png`)"
                    alt="add"
                  />
                </div>
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Qrcode 彈窗 -->
      <template v-else>
        <template v-if="showPopStatus.type === 'qrcode'">
          <popup-qrcode :virtualBankId="bank_id" @close="closePopup" />
        </template>
      </template>
    </div>
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
    withdrawUserData: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      bank_id: "",

      // 彈窗顯示狀態統整
      showPopStatus: {
        isShow: false,
        type: ""
      }
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
          title: ["porn1", "sg1"].includes(this.themeTPL)
            ? "添加银行卡"
            : "添加 提现银行卡",
          isShow: this.moreMethodStatus.bankCard
        },
        {
          key: "wallet",
          title: ["porn1", "sg1"].includes(this.themeTPL)
            ? "添加数字货币"
            : "添加 电子钱包",
          isShow: this.moreMethodStatus.wallet
        },
        {
          key: "CGPay",
          title: "新增 CGPay",
          isShow:
            ["ey1"].includes(this.themeTPL) &&
            this.withdrawUserData.support_binding.find(item => {
              return item.wallet_gateway_id === 3;
            })
        },
        {
          key: "goBao",
          title: "新增 购宝钱包",
          isShow:
            ["ey1"].includes(this.themeTPL) &&
            this.withdrawUserData.support_binding.find(item => {
              return item.wallet_gateway_id === 2;
            })
        }
      ].filter(item => item.isShow);
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
    closePopup() {
      this.$emit("close");
    },
    setPopupStatus(isShow, type) {
      this.showPopStatus = {
        isShow,
        type
      };
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
          this.setPopupStatus(true, "qrcode");
          this.bank_id = 37;
          break;
      }
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
<style
  lang="scss"
  src="../css/withdrawMoreMethod/sg1.index.module.scss"
  module="$style_sg1"
></style>
