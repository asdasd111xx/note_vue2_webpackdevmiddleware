<template>
  <mobile-container :header-config="headerSetting">
    <div slot="content" :class="[$style['content-wrap'], 'clearfix']">
      <balance-tran class="clearfix">
        <template
          scope="{ balanceTran, enableAutotransfer, closeAutotransfer, setTranOut, setTranIn, setMoney, balanceTransfer, balanceBack, getDefaultTran }"
        >
          <div
            :class="[$style['balance-wrap'], 'clearfix']"
            @click="balanceBack()"
          >
            <div :class="$style['balance-total-item']">
              <img
                :src="
                  $getCdnPath(
                    '/static/image/_new/mcenter/myWallet/ic_wallet_center.png'
                  )
                "
              />
              {{ $text("S_MCENTER_WALLET", "中心钱包") }}
              <div :class="$style['balance-item-money']">
                {{ balanceTran.membalance.vendor.default.amount }}
              </div>
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
            <template v-if="!isShowMore">
              <div
                v-for="(item, key, index) in balanceTran.firstThirdBalanceInfo"
                :key="`balance-item-${key}`"
                :class="[
                  $style['balance-item'],
                  {
                    [$style['is-last-item']]:
                      Object.keys(balanceTran.firstThirdBalanceInfo).length -
                        index <=
                      (Object.keys(balanceTran.firstThirdBalanceInfo).length %
                        4 || 4)
                  }
                ]"
              >
                <span :class="$style['balance-item-vendor']">{{
                  item.text
                }}</span>
                <span
                  v-if="item.maintain"
                  :class="$style['balance-info-maintain']"
                  @click="onClickMaintain(item.maintain)"
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

              <div :class="[$style['balance-item'], $style['collapse']]">
                <span
                  :class="$style['balance-item-vendor']"
                  @click="toggleShowMore"
                  >更多</span
                >
                <div :class="[$style['icon']]">
                  <img
                    :src="
                      $getCdnPath(
                        `/static/image/_new/mcenter/myWallet/ic_expand.png`
                      )
                    "
                    alt="expend"
                  />
                </div>
              </div>
            </template>

            <template v-else>
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
                  @click="onClickMaintain(item.maintain)"
                >
                  {{ $t("S_MAINTAIN") }}
                  <img
                    :src="
                      $getCdnPath(
                        '/static/image/_new/mcenter/myWallet/icon_transfer_tips_info.png'
                      )
                    "
                    :class="$style['balance-wrench']"
                  />
                </span>
                <span v-else :class="$style['balance-item-money']">{{
                  item.amount
                }}</span>
              </div>

              <div :class="[$style['balance-item'], $style['collapse']]">
                <span
                  :class="$style['balance-item-vendor']"
                  @click="toggleShowMore"
                  >收起</span
                >
                <div :class="[$style['icon']]">
                  <img
                    :src="
                      $getCdnPath(
                        `/static/image/_new/mcenter/myWallet/ic_collapse.png`
                      )
                    "
                    alt="collapse"
                  />
                </div>
              </div>
            </template>
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
                  <div
                    :class="$style['balance-transfer-list']"
                    @click="showTransOutSelect"
                  >
                    {{ transOutText }}
                    <span :class="$style['select-arrow-icon']"></span>
                  </div>

                  <div
                    v-if="isShowTransOutSelect"
                    :class="$style['select-container']"
                  >
                    <div :class="$style['select-wrap']">
                      <div :class="$style['select-header']">
                        <span :class="$style['cancel']" @click="closeSelect">
                          取消
                        </span>
                        选择钱包
                      </div>

                      <div :class="$style['select-content']">
                        <div
                          :class="$style['option']"
                          v-for="vendor in balanceTran.transOut"
                          :key="vendor.value"
                          @click="
                            setTranOut(vendor.value);
                            setTransOutText(vendor.text);
                          "
                        >
                          <span>{{ vendor.text }}</span>
                          <img
                            v-if="transOutText === vendor.text"
                            :src="
                              $getCdnPath(
                                `/static/image/_new/mcenter/myWallet/ic_transfer_sel.png`
                              )
                            "
                            alt="sel"
                          />
                        </div>
                      </div>
                    </div>
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
                  <div
                    :class="$style['balance-transfer-list']"
                    @click="showTransInSelect"
                  >
                    {{ transInText }}
                    <span :class="$style['select-arrow-icon']"></span>
                  </div>

                  <div
                    v-if="isShowTransInSelect"
                    :class="$style['select-container']"
                  >
                    <div :class="$style['select-wrap']">
                      <div :class="$style['select-header']">
                        <span :class="$style['cancel']" @click="closeSelect">
                          取消
                        </span>
                        选择钱包
                      </div>

                      <div :class="$style['select-content']">
                        <div
                          :class="$style['option']"
                          v-for="vendor in balanceTran.transIn"
                          :key="vendor.value"
                          @click="
                            setTranIn(vendor.value);
                            setTransInText(vendor.text);
                          "
                        >
                          {{ vendor.text }}
                          <img
                            v-if="transInText === vendor.text"
                            :src="
                              $getCdnPath(
                                `/static/image/_new/mcenter/myWallet/ic_transfer_sel.png`
                              )
                            "
                            alt="sel"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
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
                    placeholder="请输入转帐金额"
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
              立即转帐
            </div>
          </template>
        </template>
      </balance-tran>
      <message v-if="msg" @close="msg = ''">
        <div slot="msg">
          <div
            v-html="msg"
            style="background-color: transparent ; margin: 0 ; padding: 0"
          ></div>
        </div>
      </message>
    </div>
  </mobile-container>
</template>

<script>
import { mapActions } from "vuex";
import balanceTran from "@/components/mcenter/components/balanceTran";
import mobileContainer from "../../../common/new/mobileContainer";
import message from "../../../common/new/message";

export default {
  components: {
    mobileContainer,
    balanceTran,
    message
  },
  data() {
    return {
      transferMoney: 0,
      headerSetting: {
        title: this.$text("S_TRANSDER", "转帐"),
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        hasHelp: true
      },
      msg: "",
      isShowMore: false,
      isShowTransOutSelect: false,
      isShowTransInSelect: false,
      transInText: "请选择帐户",
      transOutText: "请选择帐户"
    };
  },
  methods: {
    ...mapActions(["actionSetUserBalance"]),
    getMaxMoney(balanceList, setMoneyData, transferTargetOut) {
      if (balanceList.vendor[transferTargetOut]) {
        this.transferMoney = Math.floor(
          +balanceList.vendor[transferTargetOut].amount
        );
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

      alert(this.$t("S_CR_SUCCESS"));
      this.transferMoney = 0;
    },
    toggleShowMore() {
      this.isShowMore = !this.isShowMore;
    },
    showTransOutSelect() {
      this.isShowTransOutSelect = true;
    },
    showTransInSelect() {
      this.isShowTransInSelect = true;
    },
    closeSelect() {
      this.isShowTransOutSelect = false;
      this.isShowTransInSelect = false;
    },
    setTransInText(value) {
      this.transInText = value;
      this.closeSelect();
    },
    setTransOutText(value) {
      this.transOutText = value;
      this.closeSelect();
    },
    onClickMaintain(value) {
      this.msg = `美东时间：
          <br>
          ${value.etc_start_at}
          <p style="text-align: center">|</p>
          ${value.etc_end_at}
        `;
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

@mixin fixed-container-style($opacity) {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 10;

  &::before {
    content: "";
    position: absolute;
    background: #000;
    opacity: $opacity;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
}

.content-wrap {
  position: relative;
  min-height: calc(100vh - 60px);
  padding-bottom: 45px;
  background: #eee;
}

.balance-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-top: 3%;
  height: 65px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.65);

  // 自動免轉區塊
  &:nth-child(2) {
    height: 48px;
  }
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

.balance-tip-wrap {
  width: 70%;
  text-align: left;
  color: $main_text_color3;

  .balance-auto-tip {
    font-size: 12px;
    color: $main_text_color2;
  }
}

:global {
  .ui.checkbox {
    &.field-checkbox {
      display: inline-block;
      vertical-align: middle;
    }
  }

  // /* Focus */
  .ui.toggle.checkbox input:focus ~ .box:before,
  .ui.toggle.checkbox input:focus ~ label:before {
    background-color: rgba(0, 0, 0, 0.05) !important;
  }

  /* Active */
  .ui.toggle.checkbox input:checked ~ .box:before,
  .ui.toggle.checkbox input:checked ~ label:before {
    background-color: #7d87a5 !important;
  }

  /* Active Focus */
  .ui.toggle.checkbox input:focus:checked ~ .box:before,
  .ui.toggle.checkbox input:focus:checked ~ label:before {
    background-color: #7d87a5 !important;
  }
}

.balance-item-wrap {
  margin-top: 2%;
  padding: 5px 3% 0;
  font-size: 12px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.65);
}

.balance-item {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  width: 25%;
  height: 65px;
  padding: 10px 4px 15px;
  text-align: center;
  font-size: 14px;
  color: $main_text_color3;
  border-bottom: 1px solid #dad6d6;

  &:not(:nth-child(4n + 1)):before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 1px;
    height: 23px;
    background: #eee;
  }

  &.is-last-item {
    border-bottom: none;
  }

  &.collapse {
    float: right;
    color: $main_text_color2;
    border-bottom: none;

    .icon {
      width: 15px;
      height: 15px;
      margin: 2px auto;

      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.balance-item-vendor {
  display: block;
}

.balance-info-maintain {
  font-size: 12px;
  color: $main_error_color1;
}

.balance-wrench {
  height: 12px;
  width: 12px;
  vertical-align: middle;
}

.balance-item-money {
  display: block;
  color: $main_text_color2;
}

.balance-manual-wrap {
  background: rgba(255, 255, 255, 0.65);
}

.wallet-title {
  display: block;
  padding: 8px 17px;
  background: #eee;
  color: $main_text_color3;
  font-size: 14px;
}

.balance-transfer-wrap {
  margin: 1% 0 2%;
  border-radius: 4px;
  background: url("/static/image/_new/mcenter/myWallet/ic_transfergo.png")
    rgba(255, 255, 255, 0.65) 50% 50% no-repeat;
  background-size: 20px 15px;
}

.balance-select-wrap {
  position: relative;
  float: left;
  box-sizing: border-box;
  width: 50%;
  padding: 6px 40px 6px 17px;
}

.select-right-wrap {
  padding: 6px 17px 6px 13%;
}

.balance-transfer-list {
  width: 100%;
  position: relative;
  float: left;

  &::after {
    content: "";
    position: absolute;
    bottom: 40%;
    right: 0px;
    border-top: 5px solid #cbced8;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
  }

  select {
    background: transparent;
    outline: 0;
    border: none;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
  }
}

.select-container {
  @include fixed-container-style(0.4);

  .select-wrap {
    position: absolute;
    background: $main_white_color1;
    width: 100%;
    bottom: 0;
    padding: 0 17px;
    border-radius: 20px 20px 0 0;
  }

  .select-header {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    text-align: center;
    height: 65px;
    color: $main_text_color3;

    &::before {
      content: "";
      position: absolute;
      width: 100vw;
      height: 8px;
      bottom: 0;
      background: #f8f8f7;
    }

    span {
      position: absolute;
      left: 0;
      color: #be9e7f;
    }
  }

  .select-content {
    position: relative;
    font-size: 14px;
    color: $main_text_color3;
    max-height: 500px;
    overflow: hidden;
    overflow-y: auto;

    .option {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;

      img {
        width: 15px;
        height: 15px;
      }
    }
  }
}

.select-title {
  font-size: 12px;
  color: $main_text_color2;
}

// .select-arrow-icon {
//   position: absolute;
//   top: 8px;
//   right: -10px;
//   transform: translateY(50%);
//   border-top: 5px solid #cbced8;
//   border-left: 4px solid transparent;
//   border-right: 4px solid transparent;
// }

.wallet-tip-img {
  display: inline-block;
  vertical-align: middle;
  width: 16px;
}

.balance-input-wrap {
  padding: 15px 17px;
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
  color: $main_text_color3;

  &::placeholder {
    color: #cdced8;
  }
}

.max-money-btn {
  float: right;
  width: 50px;
  height: 20px;
  line-height: 20px;
  text-align: center;
  font-size: 14px;
  border-radius: 10px;
  color: #fff;
  background: linear-gradient(to left, #bd9d7d, #f9ddbd);
  background: -moz-linear-gradient(to left, #bd9d7d, #f9ddbd);
  background: -webkit-linear-gradient(to left, #bd9d7d, #f9ddbd);
  background: -o-linear-gradient(to left, #bd9d7d, #f9ddbd);
}

.transfer-btn {
  height: 42px;
  line-height: 42px;
  margin: 4% 17px 0;
  text-align: center;
  cursor: pointer;
  border-radius: 3px;
  color: #fff;
  background: linear-gradient(to left, #bd9d7d, #f9ddbd);
  background: -moz-linear-gradient(to left, #bd9d7d, #f9ddbd);
  background: -webkit-linear-gradient(to left, #bd9d7d, #f9ddbd);
  background: -o-linear-gradient(to left, #bd9d7d, #f9ddbd);

  &.is-disable {
    background: linear-gradient(to left, #e9dacb, #eee5db);
    background: -moz-linear-gradient(to left, #e9dacb, #eee5db);
    background: -webkit-linear-gradient(to left, #e9dacb, #eee5db);
    background: -o-linear-gradient(to left, #e9dacb, #eee5db);
  }
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

  .max-money-btn {
    font-size: 14px;
  }

  .transfer-btn {
    font-size: 16px;
  }

  .balance-wrench {
    height: 14px;
    width: 14px;
  }
}
</style>
