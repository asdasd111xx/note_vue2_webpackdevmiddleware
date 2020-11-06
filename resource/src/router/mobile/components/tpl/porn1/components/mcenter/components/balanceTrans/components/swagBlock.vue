<template>
  <div :class="$style['swap-wrap']">
    <div :class="[$style['item'], $style['wallet']]">
      <img
        :src="
          $getCdnPath(
            '/static/image/porn1/mcenter/balanceTrans/ic_wallet_center.png'
          )
        "
      />
      <span> SWAG钱包</span>
      <div v-if="false" :class="$style['maintain-block']">
        {{ $t("S_MAINTAIN") }}
        <img
          :src="
            $getCdnPath(
              `/static/image/porn1/mcenter/balanceTrans/icon_transfer_tips_info.png`
            )
          "
        />
      </div>
      <!-- 沒有維護時，顯示金額 -->
      <div v-else :class="$style['balance']">
        {{ swagDiamondBalance }}
      </div>
    </div>

    <div :class="$style['item']" @click="$router.push('/mobile/mcenter/swag')">
      {{ this.$text("S_BUY_DIAMOND", "购买钻石") }}
    </div>

    <div
      :class="$style['item']"
      @click="$router.push('/mobile/mcenter/help/detail?type=buymethod')"
    >
      {{ this.$text("S_TO_BUY", "如何购买") }}
    </div>

    <div
      :class="$style['item']"
      @click="$router.push('/mobile/mcenter/help/detail?type=usage&key=2')"
    >
      {{ this.$text("S_INSTRUSTIONS", "使用方法") }}
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import balanceTran from '@/components/mcenter/components/balanceTran';

export default {
  components: {
    balanceTran,
  },
  computed: {
    ...mapGetters({
      hasBank: 'getHasBank'
    }),
  },
  data() {
    return {
      swagDiamondBalance: "0"
    }
  },
  watch: {
    swagBalance(val) {
      this.swagDiamondBalance = +val.balance === 0 ? '0' : val.balance;
    },
  },
  methods: {
    ...mapActions([
      'actionSetGlobalMessage',
      'actionGetRechargeStatus',
      'actionGetMemInfoV3',
      'actionSetSwagBalance'
    ]),

  },
};
</script>
<style lang="scss" module>
@import "~@/css/variable.scss";

.swap-wrap {
  position: relative;
  display: flex;
  align-items: center;
  text-align: center;
  height: 65px;
  background: #fefefe;
  color: $main_text_color3;
}

.item {
  position: relative;
  flex: 1;
  font-size: 12px;
  font-weight: 700;
  color: $main_text_color3;

  // Swag 錢包區塊
  &.wallet {
    flex: 0;
    min-width: 120px;
  }

  &::before {
    content: "";
    position: absolute;
    width: 1px;
    height: 20px;
    background: #eee;
    left: 0;
    top: 0;
  }

  img {
    width: 13px;
    height: 13px;
    vertical-align: text-bottom;
  }

  // 維護中
  .maintain-block {
    color: $main_error_color1;
    font-weight: 400;

    img {
      margin-left: 1px;
      width: 12px;
      height: 12px;
    }
  }

  // 餘額
  .balance {
    font-size: 16px;
    color: #be9e7f;
  }
}
</style>
