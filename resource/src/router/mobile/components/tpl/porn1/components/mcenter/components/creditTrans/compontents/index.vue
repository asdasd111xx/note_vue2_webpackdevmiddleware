<template>
  <div :class="[$style['content-wrap'], 'clearfix']">
    <!-- 黑名單阻擋 -->
    <template v-if="isShowBlockTips">
      <block-list-tips type="transfer" @close="closeTips" />
    </template>

    <div :class="[$style['tab-wrap']]">
      <div
        v-for="(item, index) in tabItem"
        :key="`tab-${item.key}`"
        :class="[
          $style['tab-item'],
          { [$style['is-current']]: currentTab === index }
        ]"
        @click="setCurrentTab(index)"
      >
        {{ item.text }}
      </div>
      <div
        :class="[$style['active-slider']]"
        :style="{
          left: `calc(25% + 50% * ${currentTab})`
        }"
      />
    </div>

    <div :class="[$style['credit-trans-container']]">
      <component :is="currentTemplate" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import balanceTran from "@/components/mcenter/components/balanceTran";
import blockListTips from "../../../../common/blockListTips";
import mobileContainer from "../../../../common/mobileContainer";
import transferCreditTrans from "../compontents/transferCreditTrans";
import promotionCreditTrans from "../compontents/promotionCreditTrans";
import recoardRecharge from "../compontents/recoardRecharge";

export default {
  components: {
    mobileContainer,
    blockListTips,
    balanceTran,
    transferCreditTrans,
    promotionCreditTrans,
    recoardRecharge
  },
  data() {
    return {
      transferMoney: null,
      headerSetting: {
        title: this.$text("S_CREDIT_TRANSFER", "额度转让"),
        prev: true,
        onClick: () => {
          this.$router.back();
        }
      },
      isShowBlockTips: false,
      isShowMore: true,
      isShowTransOutSelect: false,
      isShowTransInSelect: false,
      currentTab: 0, //promotion transfer recoard
      currentTemplate: "transfer-credit-trans"
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      rechargeConfig: "getRechargeConfig",
      siteConfig: "getSiteConfig"
    }),
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    tabItem() {
      return [
        // {
        //   key: "promotion",
        //   text: this.$text("S_CREDIT_DISCOUNT", "转让优惠")
        // },
        {
          key: "transfer",
          text: this.$text("S_CREDIT_TRANSFER", "额度转让")
        },
        {
          key: "recoard",
          text: this.$text("S_CREDIT_RECOARD", "转让记录")
        }
      ];
    }
  },
  created() {
    if (this.$route.query && this.$route.query.tab) {
      this.setCurrentTab(Number(this.$route.query.tab));
    } else {
      this.$router.replace(`/mobile/mcenter/creditTrans?tab=0`);
    }
  },
  methods: {
    ...mapActions([
      "actionSetUserdata",
      "actionSetGlobalMessage",
      "actionGetRechargeStatus",
      "actionGetMemInfoV3"
    ]),
    setCurrentTab(index) {
      switch (index) {
        default:
        // case 0:
        // this.$router.push("/mobile/iframe/promotion?alias=quota_transfer");
        // this.currentTemplate = "promotion-credit-trans";
        // this.currentTab = index;
        // break;

        case 0:
          if (this.currentTab == index) return;
          const self = this;
          this.actionGetMemInfoV3().then(() => {
            this.actionGetRechargeStatus("recharge").then(res => {
              if (res === "ok") {
                self.currentTemplate = "transfer-credit-trans";
                self.currentTab = index;
              }
            });
          });
          break;

        case 1:
          if (this.currentTab == index) return;

          this.currentTemplate = "recoard-recharge";
          this.currentTab = index;
          break;
      }
    },
    closeTips() {
      this.isShowBlockTips = false;
      this.$router.back();
    }
  }
};
</script>
<style lang="scss" src="../css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/sg1.module.scss" module="$style_sg1"></style>
