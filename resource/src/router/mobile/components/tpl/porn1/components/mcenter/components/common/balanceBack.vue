<template>
  <balance-tran class="clearfix">
    <template scope="{ balanceTran , balanceBack}">
      <div>
        <div :class="[$style['balance-wrap'], 'clearfix']">
          <div :class="$style['balance-total-item']">
            <img
              :src="
                $getCdnPath(
                  '/static/image/_new/mcenter/balanceTrans/ic_wallet_center.png'
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
import balanceTran from '@/components/mcenter/components/balanceTran';

export default {
  props: {
    hasLink: {
      type: Boolean,
      default: false
    },
  },
  components: {
    balanceTran,
  },
  computed: {
    ...mapGetters({
      rechargeConfig: 'getRechargeConfig',
      hasBank: 'getHasBank'
    }),
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage'
    ]),
    handleCreditTrans() {
      if (this.rechargeConfig && this.rechargeConfig.bank_required && !this.hasBank) {
        this.actionSetGlobalMessage({ code: 'C50099', origin: 'home', type: 'bindcard' });
      } else if (this.rechargeConfig && !this.rechargeConfig.enable) {
        this.actionSetGlobalMessage({ msg: '额度转让升级中' });
      } else {
        this.$router.push('/mobile/mcenter/creditTrans');
      }
    }
  },
};
</script>
<style lang="scss" module>
@import "~@/css/variable.scss";

.balance-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 3%;
  height: 65px;
  border-radius: 4px;
  background: #fefefe;
  border-bottom: 1px solid #eeeeee;

  // 自動免轉區塊
  &:nth-child(2) {
    height: 48px;
  }

  .balance-total-item {
    flex: 1;
    font-size: 12px;
    font-weight: 700;
    color: $main_text_color3;

    img {
      width: 13px;
      height: 13px;
      vertical-align: text-bottom;
    }

    .balance-item-money {
      font-size: 16px;
      color: #be9e7f;
    }
  }

  .recycle-btn {
    position: relative;
    flex: 1;
    font-size: 16px;
    color: #be9e7f;
    font-weight: 700;

    &::before {
      content: "";
      position: absolute;
      width: 1px;
      height: 20px;
      background: #eee;
      left: 0;
      top: 0;
    }

    &.disable {
      opacity: 0.5;
    }
  }

  .balance-total-icon {
    width: 30px;
    height: 30px;

    img {
      max-width: 100%;
    }
  }

  .credit-trans-link {
    font-size: 16px;
    color: #be9e7f;
  }
}
</style>
