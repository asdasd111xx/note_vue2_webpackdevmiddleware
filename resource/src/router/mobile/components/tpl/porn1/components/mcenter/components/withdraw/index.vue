<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" :class="$style['content-wrap']">
      <message v-if="msg" @close="msg = ''">
        <div slot="msg">
          <div
            v-html="msg"
            style="background-color: transparent ; margin: 0 ; padding: 0"
          ></div>
        </div>
      </message>

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
          <!-- 個別餘額 -->
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
        </template>
      </balance-tran>

      <!-- 銀行卡 -->
      <div
        v-if="
          withdrawUserData &&
            withdrawUserData.account &&
            withdrawUserData.account.length !== 0
        "
        :class="$style['bank-card-wrap']"
      >
        <div :class="$style['bank-card-cell']">
          {{ $text("S_BANKCARD", "银行卡") }}
        </div>

        <!-- 取前三個銀行卡 不應該超過三張 -->
        <div
          v-for="item in withdrawUserData.account.slice(0, 3)"
          :class="$style['bank-card-cell']"
          @click="handleSelectCard(item)"
        >
          <!-- 缺銀行圖片 -->
          <img :src="`${bankSrc}${item.bank_id}.png`" />
          <span>{{ item.alias }} </span>
          <div
            :class="[
              $style['check-box'],
              { [$style['checked']]: item.id === selectedCard }
            ]"
          />
        </div>
      </div>

      <!-- 添加银行卡 -->
      <div
        v-if="
          withdrawUserData &&
            withdrawUserData.account &&
            withdrawUserData.account.length < 3
        "
        :class="[$style['add-bank-card']]"
      >
        <img
          :src="$getCdnPath(`/static/image/_new/common/ic_withardw_add.png`)"
        />
        &nbsp;
        <span @click="$router.push('/mobile/mcenter/bankcard?withdraw=true')">
          {{ $text("S_ADD_BANKCARD", "添加银行卡") }}
        </span>
      </div>

      <!-- 額度提示訊息 -->
      <template
        v-if="
          withdrawUserData &&
            withdrawData.payment_charge &&
            withdrawUserData.account &&
            withdrawUserData.account.length > 0
        "
      >
        <div :class="$style['tips']">
          {{
            $text("S_WITHRAW_DESC", {
              replace: [
                {
                  target: "%s",
                  value:
                    withdrawData.payment_charge.ret &&
                    validateMoney(
                      withdrawData.payment_charge.ret.withdraw_count
                    )
                },
                {
                  target: "%s",
                  value:
                    withdrawData.payment_charge.ret &&
                    validateMoney(
                      withdrawData.payment_charge.ret.allow_withdraw_limit
                    )
                },
                {
                  target: "%s",
                  value:
                    withdrawData.payment_charge.ret &&
                    validateMoney(withdrawData.payment_charge.ret.withdraw_max)
                }
              ]
            })
          }}
        </div>

        <!-- 提現輸入 -->
        <div v-if="hasBankCard" :class="[$style['withdraw-input']]">
          <span :class="$style['monet-currency']">¥</span>
          <input
            v-model="withdrawValue"
            autocomplete="off"
            type="number"
            @input="validateWithdrawValue($event.target.value)"
            :placeholder="
              $text('S_WITHRAW_PLACEHOLDER', {
                replace: [
                  {
                    target: '%s',
                    value:
                      withdrawData.payment_charge.ret &&
                      validateMoney(
                        withdrawData.payment_charge.ret.withdraw_min
                      )
                  },
                  {
                    target: '%s',
                    value:
                      withdrawData.payment_charge.ret &&
                      validateMoney(
                        withdrawData.payment_charge.ret.withdraw_max
                      )
                  }
                ]
              })
            "
          />
          <span :class="[$style['withdraw-max']]">
            <span @click="handleMaxWithdraw">
              {{ $text("S_WITHRAW_MAX2", "最高提现") }}
            </span>
          </span>
        </div>
      </template>

      <!-- 到帳金額 -->
      <div v-if="actualMoney" :class="[$style['actual-money']]">
        <span :class="$style['monet-currency']">到帐金额</span>
        <span :class="$style['monet-currency']">¥</span>
        <span :class="$style['monet-currency']">{{ actualMoney }}</span>

        <span :class="[$style['serial']]" @click="toggleSerial">
          詳請
        </span>
      </div>

      <!-- 錯誤訊息 -->
      <div v-if="errTips" :class="[$style['withdraw-error-tips']]">
        <span>{{ errTips }}</span>
      </div>

      <div
        v-if="
          withdrawUserData &&
            withdrawUserData.account &&
            withdrawUserData.account.length > 0
        "
        :class="[
          $style['submit-btn'],
          { [$style['disabled']]: errTips || !withdrawValue || !selectedCard }
        ]"
      >
        <div
          @click="
            errTips || !withdrawValue || !selectedCard
              ? () => {}
              : handleSubmit()
          "
        >
          立即提现
        </div>
      </div>

      <div :class="$style['tips']">
        <template
          v-if="
            withdrawUserData &&
              withdrawUserData.account &&
              withdrawUserData.account.length > 0
          "
        >
          为了方便您快速提现，请先将所有场馆钱包金额回收至中心钱包
        </template>
        <template v-else>
          请先绑定一张银行卡，用于收款
        </template>
      </div>

      <!-- 流水檢查 -->
      <serial-number v-if="isSerial" :handle-close="toggleSerial" />
    </div>
  </mobile-container>
</template>

<script>
import mobileContainer from '../../../common/new/mobileContainer';
import mixin from '@/mixins/mcenter/withdraw';
import { mapGetters, mapActions } from 'vuex';
import balanceTran from "@/components/mcenter/components/balanceTran";
import message from '../../../common/new/message'
import serialNumber from './serialNumber'
import ajax from '@/lib/ajax';
import {
  API_WITHDRAW_WRITE
} from '@/config/api';
import common from '@/api/common';

export default {
  mixins: [mixin],
  data() {
    return {
      curTitleTab: 'withdrawMethod',
      isSerial: false,
      isCheckWithdraw: false,
      isOpenOrder: false,
      selectAccountValue: '',
      isSendSubmit: false,

      isShowMore: true,
      msg: '',
      selectedCard: '',
      errTips: '',
      actualMoney: '',
      hasBankCard: false
    }
  },
  components: {
    mobileContainer,
    balanceTran,
    message,
    serialNumber
  },
  watch: {
    withdrawValue() {
      let value = Number(this.withdrawValue)

      if (!Number.isInteger(value) && this.withdrawValue) {
        this.errTips = '提现金额必需为整数';
      } else {
        this.errTips = "";

        //   withdrawData.audit.total.fee + withdrawData.audit.total.deduction
        let _actualMoney = value - Number(this.withdrawData.audit.total.total_deduction)

        if (_actualMoney !== value) {
          this.actualMoney = _actualMoney;
          if (_actualMoney <= 0) {
            this.errTips = '实际提现金额须大于0，请重新输入';
            this.actualMoney = "0.00";
          }
        }
        else {
          this.actualMoney = "";
          this.errTips = "";
        }
      }
    }
  },
  created() {
    // 綁定銀行卡內無常用帳號
    common.bankCardCheck({
      success: ({ result, ret }) => {
        if (result !== 'ok') {
          return;
        }
        this.hasBankCard = ret;
      }
    });
  },
  computed: {
    ...mapGetters({
      memCurrency: 'getMemCurrency',
      siteConfig: 'getSiteConfig',
      memInfo: 'getMemInfo',
      webInfo: 'getWebInfo',
    }),
    headerConfig() {
      return {
        prev: true,
        onClick: () => { this.$router.back(); },
        title: this.$text('S_WITHDRAWAL_TEXT', '提现'),
        hasHelp: true,
        helpRouter: '/withdraw'
      };
    },
    bankSrc() {
      return !this.webInfo.is_production ?
        'https://images.bbin-asia.com/icon/withdrawBank/' :
        'https://images.dormousepie.com/icon/withdrawBank/'
    }
  },
  methods: {
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
    },
    validateMoney(target) {
      if (!target || Number(target) === 0) {
        return this.$text('S_UNLIMITED', '无限制')
      } else {
        return target
      }
    },
    toggleSerial() {
      this.isSerial = !this.isSerial;
    },
    validateWithdrawValue(value) {
      return value
    },
    toggleShowMore() {
      this.isShowMore = !this.isShowMore;
    },
    handleSelectCard(item) {
      if (this.selectedCard === item.id) {
        // this.selectedCard = "";
      } else {
        this.selectedCard = item.id;
      }
    },
    // 最高提現
    handleMaxWithdraw() {
      if (!this.withdrawData) return;

      let withdraw_max = this.withdrawData.payment_charge.ret.withdraw_max
      let balance = this.withdrawData.cash.available_balance

      if (!withdraw_max || Number(withdraw_max) == 0) {
        this.withdrawValue = Math.floor(Number(balance));
        return;
      }

      let result = Number(withdraw_max) >= Number(balance) ? balance : withdraw_max;
      this.withdrawValue = Math.floor(Number(result));
    },
    handleSubmit() {
      if (this.errTips || !this.withdrawValue || this.isSendSubmit)
        return;

      this.isSendSubmit = true;
      this.submitWithdraw({
        user_bank_id: this.selectedCard,
        userBankId: this.selectedCard
      }).then((response) => {

        if (response) {
          if (response.result === 'error' && response.code === 500110) {
            this.isOpenOrder = true;
          }

          if (response.result === 'ok') {
            this.msg = "提现成功"
          }

          if (response.result === 'error') {
            this.errTips = response.msg;
          }
        }
      });
    },
    // 搬移原提現方法
    /**
       * 送出取款資訊
       * @method submitWithdraw
       */
    submitWithdraw(params) {
      if (this.realWithdrawMoney === '--' || this.realWithdrawMoney <= 0) {

        return Promise.resolve({ status: 'error', errorCode: '', msg: "金额低于最小金额限制" });
      }
      //不需要取款密碼,並且可選銀行卡
      let _params = {
        amount: this.withdrawValue,
        // withdraw_password: this.withdrawPwd,
        // withdraw_password: '0000',
        forward: true,
        confirm: true,
        max_id: this.withdrawData.audit.total.max_id,
        audit_amount: this.withdrawData.audit.total.audit_amount,
        offer_deduction: this.withdrawData.audit.total.offer_deduction,
        administrative_amount: this.withdrawData.audit.total.administrative_amount
      }
      if (params) {
        _params = { ..._params, ...params }
      }
      const hasAccountId = !this.withdrawAccount.withdrawType ? 'account_id' : this.withdrawAccount.withdrawType;

      this.isLoading = true;
      this.actionSetIsLoading(true);

      // 本站寫單
      return ajax({
        method: 'post',
        url: API_WITHDRAW_WRITE,
        errorAlert: false,
        params: _params,
        success: (response) => {
          if (response && response.result === 'ok') {
            this.msg = "提现成功"
            console.log(this.memInfo.config.withdraw)
            if (this.memInfo.config.withdraw === '迅付') {
              // 迅付寫單
              ajax({
                method: 'post',
                url: API_TRADE_RELAY,
                errorAlert: true,
                params: {
                  api_uri: '/api/trade/v2/c/withdraw/entry',
                  [`method[${hasAccountId}]`]: this.withdrawAccount.id,
                  //   password: this.withdrawPwd,
                  withdraw_id: response.ret.id
                }
              }).then((res) => {
                this.isLoading = false;
                this.actionSetIsLoading(false);

                if (res && res.result === 'ok') {
                  this.alertTipClose(true);
                }
              });

              return;
            }

            // 第三方寫單
            ajax({
              method: 'get',
              url: API_WITHDRAW,
              errorAlert: true,
              params: {
                amount: response.ret.amount,
                withdraw_id: response.ret.id,
                stage: 'forward',
                logo: this.webInfo.logo ? `${this.webInfo.cdn_domain}${this.webInfo.logo}` : '',
                mlogo: this.webInfo.m_logo ? `${this.webInfo.cdn_domain}${this.webInfo.m_logo}` : '',
                title: encodeURI(this.memInfo.config.domain_name[this.curLang]),
                favicon: this.webInfo.fav_icon ? `${this.webInfo.cdn_domain}${this.webInfo.fav_icon}` : '',
                check: true
              }
            }).then((res) => {
              this.isLoading = false;
              this.actionSetIsLoading(false);

              if (res.result === 'ok') {
                this.thirdUrl = res.ret.uri;
              }
            });

            return;
          }

          if (response.code === 'M500001') {
            window.location.reload();
            return;
          }

          this.isLoading = false;
          this.actionSetIsLoading(false);
        },
        fail: (error) => {
          console.log(error)
          if (error && error.data && error.data.code === 'M500001') {
            window.location.reload();
            return;
          }

          if (error && error.data && error.data.msg) {
            this.errTips = error.data.msg;
          }

          this.isLoading = false;
          this.actionSetIsLoading(false);
        }
      }).then(() => { this.isSendSubmit = false });
    },
  },

}

</script>
<style lang="scss" src="./css/index.module.scss" module></style>

