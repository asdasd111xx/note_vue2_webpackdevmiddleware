<template>
  <mobile-container>
    <div slot="content" :class="[$style['content-wrap'], 'clearfix']">
      <mcenter-header :header-setting="headerSetting" />
      <balance-tran class="clearfix">
        <template
          scope="{ balanceTran, enableAutotransfer, closeAutotransfer, setTranOut, setTranIn, setMoney, balanceTransfer, balanceBack, getDefaultTran }"
        >
          <div
            :class="[$style['balance-wrap'], 'clearfix']"
            @click="balanceBack()"
          >
            <div :class="$style['balance-total-icon']">
              <img
                :src="
                  $getCdnPath(
                    '/static/image/mobile/mcenter/porn1/icon_wallet_main.png'
                  )
                "
              />
            </div>
            <div :class="$style['balance-total-item']">
              {{ $text("S_MCENTER_WALLET", "中心钱包") }}
              <span :class="$style['balance-item-money']">{{
                balanceTran.membalance.vendor.default.amount
              }}</span>
            </div>
            <div
              :class="[
                $style['recycle-btn'],
                balanceTran.balanceBackLock ? $style.disable : ''
              ]"
            >
              {{ $text("S_ONE_CLICK_TO_ACCOUNT") }}
            </div>
          </div>
          <div :class="[$style['balance-wrap'], 'clearfix']">
            <div :class="$style['balance-total-icon']">
              <img
                :src="
                  $getCdnPath(
                    '/static/image/mobile/mcenter/porn1/icon_autotransfer.png'
                  )
                "
              />
            </div>
            <div :class="$style['balance-tip-wrap']">
              {{ $text("S_AUTO_FREE_TRANSFER", "自动免转") }}
              <span :class="$style['balance-auto-tip']"
                >({{
                  $text("S_AUTOSWTICH_HINT_GAME", "开启后余额自动转入游戏场馆")
                }})</span
              >
            </div>
            <div class="ui fitted toggle checkbox field-checkbox">
              <input
                :checked="balanceTran.isAutotransfer"
                type="checkbox"
                @click="
                  balanceTran.isAutotransfer
                    ? closeAutotransfer()
                    : enableAutotransfer()
                "
              />
              <label />
            </div>
          </div>
          <div :class="[$style['balance-item-wrap'], 'clearfix']">
            <div
              v-for="(item, key, index) in balanceTran.balanceInfo"
              :key="`balance-item-${key}`"
              :class="[
                $style['balance-item'],
                {
                  [$style['is-last-item']]:
                    Object.keys(balanceTran.balanceInfo).length - index <=
                    (Object.keys(balanceTran.balanceInfo).length % 4 || 4)
                }
              ]"
            >
              <span :class="$style['balance-item-vendor']">{{
                item.text
              }}</span>
              <span
                v-if="item.maintain"
                :class="$style['balance-info-maintain']"
              >
                <img
                  :src="
                    $getCdnPath(
                      '/static/image/mobile/tpl/porn1/mcenter/icon_relax.png'
                    )
                  "
                  :class="$style['balance-wrench']"
                />
                {{ $t("S_MAINTAIN") }}
              </span>
              <span v-else :class="$style['balance-item-money']">{{
                item.amount
              }}</span>
            </div>
          </div>
          <!-- 手動轉換功能 -->
          <template v-if="!balanceTran.isAutotransfer">
            <div :class="[$style['balance-manual-wrap'], 'clearfix']">
              <span :class="$style['wallet-title']">{{
                $text("S_CHANGE_WALLET", "选择转帐钱包")
              }}</span>
              <div :class="[$style['balance-transfer-wrap'], 'clearfix']">
                <div :class="$style['balance-select-wrap']">
                  <div :class="$style['select-title']">
                    {{ $text("S_OUT_WALLET", "转出钱包") }}
                  </div>
                  <div :class="$style['balance-transfer-list']">
                    <select
                      v-model="getDefaultTran.out"
                      @change="setTranOut(getDefaultTran.out)"
                    >
                      <option
                        v-for="vendor in balanceTran.transOut"
                        :key="vendor.value"
                        :value="vendor.value"
                      >
                        {{ vendor.text }}
                      </option>
                    </select>
                    <img
                      :src="
                        $getCdnPath(
                          '/static/image/mobile/mcenter/porn1/dropdown.png'
                        )
                      "
                      :class="$style['select-arrow-icon']"
                    />
                  </div>
                </div>
                <div
                  :class="[
                    $style['balance-select-wrap'],
                    $style['select-right-wrap']
                  ]"
                >
                  <div :class="$style['select-title']">
                    {{ $text("S_IN_WALLET", "转入钱包") }}
                  </div>
                  <div :class="$style['balance-transfer-list']">
                    <select
                      v-model="getDefaultTran.in"
                      @change="setTranIn(getDefaultTran.in)"
                    >
                      <option
                        v-for="vendor in balanceTran.transIn"
                        :key="vendor.value"
                        :value="vendor.value"
                      >
                        {{ vendor.text }}
                      </option>
                    </select>
                    <img
                      :src="
                        $getCdnPath(
                          '/static/image/mobile/mcenter/porn1/dropdown.png'
                        )
                      "
                      :class="$style['select-arrow-icon']"
                    />
                  </div>
                </div>
              </div>
              <div :class="$style['balance-wallet-tip']">
                <img
                  :src="
                    $getCdnPath(
                      '/static/image/mobile/mcenter/porn1/icon_transfer_tips_info.png'
                    )
                  "
                  :class="$style['wallet-tip-img']"
                />
                <span :class="$style['wallet-tip']">{{
                  $text("S_TRANSFER_TIP", "场管钱包之间不可互转")
                }}</span>
              </div>
            </div>
            <div :class="[$style['balance-manual-wrap'], 'clearfix']">
              <span :class="$style['wallet-title']">{{
                $text("S_TRANSFER_MONEY", "转帐金额")
              }}</span>
              <div :class="[$style['balance-input-wrap'], 'clearfix']">
                <span :class="$style['transfer-money']">
                  ¥
                  <input
                    v-model="transferMoney"
                    :class="$style['transfer-money-input']"
                    type="number"
                    @input="setMoney(transferMoney)"
                  />
                </span>
                <div
                  :class="$style['max-money-btn']"
                  @click="
                    getMaxMoney(
                      balanceTran.membalance,
                      setMoney,
                      getDefaultTran.out
                    )
                  "
                >
                  {{ $text("S_MAX", "最大") }}
                </div>
              </div>
            </div>
            <div
              :class="[
                $style['transfer-btn'],
                { [$style['is-disable']]: balanceTran.btnLock }
              ]"
              @click="
                balanceTransfer({
                  customSucessAlert: () => {
                    transferSubmit(balanceTran.btnLock);
                  }
                })
              "
            >
              立即轉帳
            </div>
          </template>
        </template>
      </balance-tran>
    </div>
  </mobile-container>
</template>

<script>
import { mapActions } from 'vuex';
import mcenterHeader from '@/router/mobile/components/common/mcenter/theme1/header';
import balanceTran from '@/components/mcenter/components/balanceTran';
import mobileContainer from '../../../common/mobileContainer';

export default {
  components: {
    mobileContainer,
    mcenterHeader,
    balanceTran
  },
  data() {
    return {
      transferMoney: 0,
      headerSetting: {
        title: this.$text('S_transfer', '转帐'),
        leftBtns: {
          icon: 'arrow'
        },
        balance: true
      }
    };
  },
  methods: {
    ...mapActions([
      'actionSetUserBalance'
    ]),
    getMaxMoney(balanceList, setMoneyData, transferTargetOut) {
      if (balanceList.vendor[transferTargetOut]) {
        this.transferMoney = Math.floor(+balanceList.vendor[transferTargetOut].amount);
        setMoneyData(this.transferMoney);
        return;
      }

      this.transferMoney = 0;
      setMoneyData(0);
    },
    transferSubmit(isAjax) {
      if (isAjax) {
        return;
      }

      alert(this.$t('S_CR_SUCCESS'));
      this.transferMoney = 0;
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.content-wrap {
  position: relative;
  min-height: calc(100vh);
  padding: 65px 4% 45px;
  background: url("/static/image/mobile/mcenter/porn1/bg.jpg") 50% 0 no-repeat;
  background-size: cover;
}

.balance-wrap {
  margin-top: 3%;
  padding: 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.65);
}

.balance-total-icon {
  display: inline-block;
  vertical-align: middle;
  width: 36px;

  img {
    max-width: 100%;
  }
}

.balance-total-item {
  display: inline-block;
  vertical-align: middle;
  width: 50%;
}

.balance-tip-wrap {
  display: inline-block;
  vertical-align: middle;
  width: 67%;

  .balance-auto-tip {
    font-size: 12px;
  }
}

.recycle-btn {
  display: inline-block;
  vertical-align: middle;
  line-height: 28px;
  min-width: 82px;
  padding: 0 12px;
  margin: 0 6px;
  font-size: 12px;
  text-align: center;
  height: 28px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  &.disable {
    opacity: 0.5;
  }
}

:global {
  .ui.checkbox {
    &.field-checkbox {
      display: inline-block;
      vertical-align: middle;
    }
  }
}

.balance-item-wrap {
  margin-top: 2%;
  padding: 3%;
  font-size: 12px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.65);
}

.balance-item {
  float: left;
  box-sizing: border-box;
  width: 25%;
  padding: 4px;
  text-align: center;
  border-bottom: 1px solid #dad6d6;

  &.is-last-item {
    border-bottom: none;
  }
}

.balance-item-vendor {
  display: block;
}

.balance-item-money {
  display: block;
  color: #53b2f3;
}

.wallet-title {
  display: block;
  margin-top: 4%;
}

.balance-transfer-wrap {
  margin: 1% 0 2%;
  border-radius: 4px;
  background: url("/static/image/mobile/mcenter/porn1/icon_transfergo.png")
    rgba(255, 255, 255, 0.65) 50% 50% no-repeat;
  background-size: 24%;
}

.balance-select-wrap {
  float: left;
  box-sizing: border-box;
  width: 50%;
  padding: 6px 40px 6px 6px;
}

.select-right-wrap {
  padding: 6px 5px 6px 16%;
  background: rgba(154, 154, 154, 0.1);
}

.balance-transfer-list {
  position: relative;
  float: left;

  select {
    background: transparent;
    outline: 0;
    border: none;
    appearance: none;
  }
}

.select-title {
  padding-left: 5px;
  font-size: 12px;
  color: #848484;
}

.select-arrow-icon {
  position: absolute;
  width: 12px;
  margin-top: -6px;
  top: 50%;
  right: -15px;
}

.balance-wallet-tip {
  font-size: 12px;
  color: #848484;
}

.wallet-tip-img {
  display: inline-block;
  vertical-align: middle;
  width: 16px;
}

.wallet-tip {
  display: inline-block;
  vertical-align: middle;
}

.balance-input-wrap {
  margin: 1% 0 2%;
  padding: 3%;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.65);
}

.transfer-money {
  float: left;
  padding-left: 5px;
  font-size: 16px;
  font-weight: bold;
}

.transfer-money-input {
  outline: none;
  border: none;
  background: transparent;
}

.max-money-btn {
  float: right;
  width: 17%;
  height: 18px;
  line-height: 18px;
  margin-top: 3px;
  text-align: center;
  font-size: 12px;
  border-radius: 10px;
  color: #fff;
  background: #53b2f3;
  background: linear-gradient(
    90deg,
    rgba(0, 213, 253, 1) 27%,
    rgba(2, 136, 254, 0.8) 62%
  );
  background: -moz-linear-gradient(
    90deg,
    rgba(0, 213, 253, 1) 27%,
    rgba(2, 136, 254, 0.8) 62%
  );
  background: -webkit-linear-gradient(
    90deg,
    rgba(0, 213, 253, 1) 27%,
    rgba(2, 136, 254, 0.8) 62%
  );
  background: -o-linear-gradient(
    90deg,
    rgba(0, 213, 253, 1) 27%,
    rgba(2, 136, 254, 0.8) 62%
  );
}

.transfer-btn {
  height: 35px;
  line-height: 35px;
  margin-top: 3%;
  text-align: center;
  cursor: pointer;
  border-radius: 18px;
  color: #fff;
  background: #53b2f3;
  background: linear-gradient(
    90deg,
    rgba(0, 213, 253, 1) 27%,
    rgba(2, 136, 254, 0.8) 62%
  );
  background: -moz-linear-gradient(
    90deg,
    rgba(0, 213, 253, 1) 27%,
    rgba(2, 136, 254, 0.8) 62%
  );
  background: -webkit-linear-gradient(
    90deg,
    rgba(0, 213, 253, 1) 27%,
    rgba(2, 136, 254, 0.8) 62%
  );
  background: -o-linear-gradient(
    90deg,
    rgba(0, 213, 253, 1) 27%,
    rgba(2, 136, 254, 0.8) 62%
  );

  &.is-disable {
    background: #9e9e9e;
  }
}

.balance-info-maintain {
  font-size: 12px;
  color: #81674c;
}

.balance-wrench {
  height: 12px;
  width: 12px;
}

@media screen and (min-width: $phone) {
  .wrap {
    font-size: 15px;
  }
}

@media screen and (min-width: $pad) {
  .balance-total-item {
    font-size: 16px;
  }

  .balance-tip-wrap {
    font-size: 16px;
    .balance-auto-tip {
      font-size: 14px;
    }
  }

  .recycle-btn {
    font-size: 14px;
  }

  .balance-item-wrap {
    font-size: 16px;
  }

  .wallet-title {
    font-size: 16px;
  }

  .select-title {
    font-size: 14px;
  }

  .wallet-tip {
    font-size: 14px;
  }

  .max-money-btn {
    font-size: 14px;
  }

  .transfer-btn {
    font-size: 16px;
  }

  .balance-info-maintain {
    font-size: 14px;
  }

  .balance-wrench {
    height: 14px;
    width: 14px;
  }
}
</style>
