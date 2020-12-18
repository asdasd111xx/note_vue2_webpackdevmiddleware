<template>
  <balance-tran class="clearfix">
    <template scope="{ balanceTran , balanceBack}">
      <div>
        <div :class="[$style['balance-wrap'], 'clearfix']">
          <div :class="$style['balance-total-item']">
            <img
              :src="
                $getCdnPath(
                  '/static/image/common/mcenter/balanceTrans/ic_wallet_center.png'
                )
              "
            />
            <span> {{ $text("S_MCENTER_WALLET", "中心钱包") }} </span>
            <div :class="$style['balance-item-money']">
              {{ balanceTran.membalance.vendor.default.amount }}
            </div>
          </div>

          <div
            v-if="hasLink"
            @click="handleCreditTrans"
            :class="[$style['balance-total-item'], $style['credit-trans-link']]"
          >
            <span> {{ $text("S_CREDIT_TRANSFER", "额度转让") }} </span>
          </div>

          <div
            id="one-recycle-btn"
            :class="[
              $style['recycle-btn'],
              balanceTran.balanceBackLock ? $style.disable : ''
            ]"
            @click="balanceBack()"
          >
            {{ $text("S_ONE_CLICK_TO_ACCOUNT") }}
          </div>
        </div>
      </div>
    </template>
  </balance-tran>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import balanceTran from "@/components/mcenter/components/balanceTran";

export default {
  props: {
    hasLink: {
      type: Boolean,
      default: false
    }
  },
  components: {
    balanceTran
  },
  computed: {
    ...mapGetters({
      hasBank: "getHasBank",
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
  methods: {
    ...mapActions([
      "actionSetGlobalMessage",
      "actionGetRechargeStatus",
      "actionGetMemInfoV3"
    ]),
    handleCreditTrans() {
      this.actionGetMemInfoV3().then(() => {
        this.actionGetRechargeStatus("");
      });
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.index.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.index.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.index.scss" module="$style_sg1"></style>
