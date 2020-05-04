<template>
  <mobile-container :header-config="headerSetting">
    <div slot="content" :class="[$style['content-wrap'], 'clearfix']">
      <balance-tran class="clearfix">
        <template
          scope="{ balanceTran, enableAutotransfer, closeAutotransfer, setTranOut, setTranIn, setMoney, balanceTransfer, balanceBack, getDefaultTran }"
        >
          <div
            :class="[$style['balance-wrap'], 'clearfix']"
            @click="balanceBack"
          >
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
                        `/static/image/_new/mcenter/balanceTrans/ic_expand.png`
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
                        '/static/image/_new/mcenter/balanceTrans/icon_transfer_tips_info.png'
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
                        `/static/image/_new/mcenter/balanceTrans/ic_collapse.png`
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
                                `/static/image/_new/mcenter/balanceTrans/ic_transfer_sel.png`
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
                                `/static/image/_new/mcenter/balanceTrans/ic_transfer_sel.png`
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
                  <span>¥</span>
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
      isShowMore: true,
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
          <span>${value.etc_start_at}</span>
          <p style="margin: 0 ; padding: 0 ; text-align: center">|</p>
          <span>${value.etc_end_at}</span>
          <p></p>
          北京时间：
          <br>
          <span>${value.start_at}</span>
          <p style="margin: 0 ; padding: 0 ; text-align: center">|</p>
          <span>${value.end_at}</span>
        `;
    }
  }
};
</script>
<style lang="scss" src="./css/index.module.scss" module></style>
