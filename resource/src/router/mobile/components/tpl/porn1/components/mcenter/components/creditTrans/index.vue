<template>
  <mobile-container :header-config="headerSetting" :has-footer="false">
    <div slot="content" :class="[$style['content-wrap'], 'clearfix']">
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
          :class="$style['active-slider']"
          :style="{
            left: `calc(16.5% + 33% * ${currentTab})`
          }"
        />
      </div>

      <div :class="[$style['credit-trans-container']]">
        <component :is="currentTemplate" />
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import balanceTran from "@/components/mcenter/components/balanceTran";
import blockListTips from "../../../common/blockListTips";
import mobileContainer from "../../../common/mobileContainer";
import transferCreditTrans from './compontents/transferCreditTrans';
import promotionCreditTrans from './compontents/promotionCreditTrans';
import recoardCreditTrans from './compontents/recoardCreditTrans';
import axios from 'axios';

export default {
  components: {
    mobileContainer,
    blockListTips,
    balanceTran,
    transferCreditTrans,
    promotionCreditTrans,
    recoardCreditTrans,
  },
  data() {
    return {
      transferMoney: null,
      headerSetting: {
        title: this.$text("S_CREDIT_TRANSFER", "额度转让"),
        prev: true,
        onClick: () => {
          this.$router.back();
        },
      },
      isShowBlockTips: false,
      isShowMore: true,
      isShowTransOutSelect: false,
      isShowTransInSelect: false,
      currentTab: 1, //promotion transfer recoard
      currentTemplate: "transfer-credit-trans"
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      rechargeConfig: "getRechargeConfig",
      hasBank: 'getHasBank',
    }),
    tabItem() {
      return [
        {
          key: "promotion",
          text: this.$text("S_CREDIT_DISCOUNT", "转让优惠"),
        },
        {
          key: "transfer",
          text: this.$text("S_CREDIT_TRANSFER", "额度转让"),
        },
        {
          key: "recoard",
          text: this.$text("S_CREDIT_RECOARD", "转让记录"),
        },
      ]
    },
  },
  created() {
    if (this.$route.query && this.$route.query.tab) {
      this.setCurrentTab(Number(this.$route.query.tab));
    }
  },
  methods: {
    ...mapActions([
      "actionSetUserBalance",
      "actionSetUserdata",
      'actionSetGlobalMessage',
      "actionGetRechargeStatus"
    ]),
    setCurrentTab(index) {
      switch (index) {
        default:
        case 0:
          this.currentTemplate = "promotion-credit-trans";
          break;
        case 1:
          if (this.isLock || this.currentTemplate === "transfer-credit-trans") return;
          this.actionGetRechargeStatus("recharge").then((res) => {
            if (res === "ok")
              this.currentTemplate = "transfer-credit-trans";
          });
          break;
        case 2:
          this.currentTemplate = "recoard-credit-trans";
          break;
      }
      this.currentTab = index;
    },
    closeTips() {
      this.isShowBlockTips = false;
      this.$router.back();
    }
  }
};
</script>
<style lang="scss" src="./css/index.module.scss" module></style>
