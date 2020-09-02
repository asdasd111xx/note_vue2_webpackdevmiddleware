<template>
  <div>
    <balance-tran class="clearfix">
      <!-- 個別餘額 -->
      <template
        scope="{ balanceTran, enableAutotransfer, closeAutotransfer, setTranOut, setTranIn, setMoney, balanceTransfer, balanceBack, getDefaultTran }"
      >
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
                      '/static/image/_new/mcenter/balanceTrans/icon_transfer_tips_info.png'
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

            <div
              :class="[$style['balance-item'], $style['expend']]"
              @click="toggleShowMore"
            >
              <span :class="$style['balance-item-vendor']">更多</span>
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

            <div
              :class="[$style['balance-item'], $style['collapse']]"
              @click="toggleShowMore"
            >
              <span :class="$style['balance-item-vendor']">收起</span>
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

    <!-- 因底下商業邏輯皆不同，獨立 template 出來 -->
    <!-- Yabo -->
    <template v-if="themeTPL === 'porn1'">
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
          <img v-lazy="getBankImage(item.swift_code)" />
          <span>{{ item.alias }} </span>
          <div
            :class="[
              $style['check-box'],
              { [$style['checked']]: item.id === selectedCard }
            ]"
          />
        </div>
      </div>

      <div
        v-if="
          withdrawUserData &&
            withdrawUserData.account &&
            withdrawUserData.account.length < 3
        "
        :class="[$style['add-bank-card']]"
      >
        <img :src="$getCdnPath(`/static/image/${themeTPL}/mcenter/add.png`)" />
        &nbsp;
        <span
          @click="$router.push('/mobile/mcenter/bankcard?redirect=withdraw')"
        >
          {{ $text("S_ADD_BANKCARD", "添加银行卡") }}
        </span>
      </div>
    </template>

    <!-- 因按鈕顯示邏輯不同，所以獨立成兩份 -->
    <!-- 億元 -->
    <template v-if="themeTPL === 'ey1'">
      <!-- 提現帳號 -->
      <div
        v-if="allWithdrawAccount && allWithdrawAccount.length !== 0"
        :class="$style['bank-card-wrap']"
      >
        <div :class="$style['bank-card-cell']">
          {{ $text("S_BANKCARD", "银行卡") }}
          <span
            v-if="withdrawUserData.force_cgp_withdraw"
            :class="$style['cgp-tips']"
            >（请使用 CGPay 出款）</span
          >
        </div>

        <!-- 列出所有帳號-->
        <div
          v-for="item in allWithdrawAccount"
          :class="[
            $style['bank-card-cell'],
            {
              [$style['disable']]:
                withdrawUserData.force_cgp_withdraw && !item.allow
            }
          ]"
          @click="handleSelectCard(item)"
        >
          <img v-lazy="getBankImage(item.swift_code)" />
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
        v-if="allWithdrawAccount.length === 0 && userLevelObj.bank"
        :class="[$style['add-bank-card']]"
      >
        <img :src="$getCdnPath(`/static/image/${themeTPL}/mcenter/add.png`)" />
        &nbsp;
        <span @click="checkAccountData('bankCard')">
          {{ $text("S_ADD_BANKCARD", "添加银行卡") }}
        </span>
      </div>

      <!-- 添加电子钱包 -->
      <div
        v-if="allWithdrawAccount.length === 0 && userLevelObj.virtual_bank"
        :class="[$style['add-bank-card']]"
      >
        <img :src="$getCdnPath(`/static/image/${themeTPL}/mcenter/add.png`)" />
        &nbsp;
        <span @click="checkAccountData('wallet')">
          {{ $text("S_ADD_VIRTUAL_BANKCARD", "添加电子钱包") }}
        </span>
      </div>

      <!-- 更多提现方式 -->
      <div
        v-if="allWithdrawAccount.length > 0"
        :class="[$style['add-bank-card']]"
      >
        <img :src="$getCdnPath(`/static/image/${themeTPL}/mcenter/add.png`)" />
        &nbsp;
        <span @click="showMoreMethod = true">
          {{ "更多提现方式" }}
        </span>
      </div>

      <!-- 更多提现方式彈窗 -->
      <withdraw-more-method
        :show="showMoreMethod"
        :user-level-obj="userLevelObj"
        :withdraw-user-data="withdrawUserData"
        :check-account-data="checkAccountData"
        @close="
          () => {
            showMoreMethod = false;
          }
        "
      />
    </template>

    <!-- 額度提示訊息 -->
    <template>
      <div :class="$style['tips']">
        {{ getWithdrawTips }}
      </div>

      <!-- 提現輸入 -->
      <div v-if="hasBankCard" :class="[$style['withdraw-input']]">
        <span :class="$style['monet-currency']">¥</span>
        <input
          v-model="withdrawValue"
          autocomplete="off"
          type="number"
          @blur="verification('withdrawValue', $event.target.value)"
          @input="verification('withdrawValue', $event.target.value)"
          :placeholder="valuePlaceholder"
        />
        <span :class="[$style['withdraw-max']]">
          <span @click="handleMaxWithdraw">
            {{ $text("S_WITHRAW_MAX2", "最高提现") }}
          </span>
        </span>
      </div>
    </template>

    <!-- 到帳金額＋詳請 -->
    <!-- Yabo -->
    <template v-if="themeTPL === 'porn1'">
      <!-- 到帳金額 -->
      <div
        v-if="
          withdrawUserData &&
            withdrawUserData.account &&
            withdrawUserData.account.length > 0
        "
        :class="[$style['actual-money']]"
      >
        <span :class="$style['monet-currency']">到帐金额</span>
        <span :class="$style['monet-currency']">¥</span>
        <span :class="$style['monet-currency']">{{
          actualMoney.toFixed(2)
        }}</span>

        <span :class="[$style['serial']]" @click="toggleSerial">
          详情
        </span>
      </div>
    </template>

    <!-- 億元 -->
    <template v-if="themeTPL === 'ey1'">
      <!-- 到帳金額 -->
      <div
        v-if="allWithdrawAccount && allWithdrawAccount.length !== 0"
        :class="[$style['actual-money']]"
      >
        <span :class="$style['monet-currency']">到帐金额</span>
        <span :class="$style['monet-currency']">¥</span>
        <span :class="$style['monet-currency']">{{
          actualMoney.toFixed(2)
        }}</span>

        <span :class="[$style['serial']]" @click="toggleSerial">
          详情
        </span>
      </div>
    </template>

    <!-- 錯誤訊息 -->
    <div v-if="errTips" :class="[$style['withdraw-error-tips']]">
      <span>{{ errTips }}</span>
    </div>

    <!-- Botton＋Tips -->
    <!-- Yabo -->
    <template v-if="themeTPL === 'porn1'">
      <div
        :class="[$style['btn-wrap']]"
        v-if="
          withdrawUserData &&
            withdrawUserData.account &&
            withdrawUserData.account.length > 0
        "
      >
        <div :class="[$style['submit-btn']]">
          <div @click="linkToRecharge">
            额度转让&nbsp;返佣70%
          </div>
        </div>

        <div
          :class="[$style['submit-btn'], { [$style['disabled']]: lockSubmit }]"
        >
          <div @click="checkSubmit">
            立即提现
          </div>
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
    </template>

    <!-- 取款密碼＋Botton＋Tips -->
    <!-- 億元 -->
    <template v-if="themeTPL === 'ey1'">
      <div
        v-if="allWithdrawAccount && allWithdrawAccount.length !== 0"
        :class="[$style['withdraw-pwd-input']]"
      >
        <input
          v-model="withdrawPwd"
          autocomplete="off"
          placeholder="请输入提现密码(限定4码数字)"
          type="password"
          maxlength="4"
          @input="verification('withdrawPwd', $event.target.value)"
        />
      </div>

      <div
        :class="[$style['btn-wrap']]"
        v-if="allWithdrawAccount && allWithdrawAccount.length !== 0"
      >
        <div
          :class="[$style['submit-btn'], { [$style['disabled']]: lockSubmit }]"
        >
          <div @click="checkSubmit">
            立即提现
          </div>
        </div>
      </div>

      <div :class="$style['tips']">
        <template v-if="allWithdrawAccount && allWithdrawAccount.length !== 0">
          为了方便您快速提现，请先将所有场馆钱包金额回收至中心钱包
        </template>
        <template v-else>
          请先绑定一张银行卡，用于收款
        </template>
      </div>
    </template>

    <!-- 被列為黑名單提示彈窗 -->
    <template v-if="isShowBlockTips">
      <block-list-tips type="withdraw" @close="closeTips" />
    </template>

    <!-- 提款前提示彈窗 -->
    <widthdraw-tips
      :show="isShowCheck"
      :actual-money="+actualMoney"
      :withdraw-value="+withdrawValue"
      :type="widthdrawTipsType"
      @close="closeTips"
      @submit="handleSubmit"
      @save="saveCurrentValue"
    />
    <!-- 流水檢查 -->
    <serial-number v-if="isSerial" :handle-close="toggleSerial" />

    <!-- 帐户资料 -->
    <withdrawAccount
      v-if="showAccount"
      :isSlider="true"
      @close="
        () => {
          showAccount = false;
        }
      "
    />
    <page-loading :is-show="isLoading" />
    <message v-if="msg" @close="msg = ''">
      <div slot="msg">
        <div
          v-html="msg"
          style="background-color: transparent ; margin: 0 ; padding: 0"
        ></div>
      </div>
    </message>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ajax from "@/lib/ajax";
import balanceTran from "@/components/mcenter/components/balanceTran";
import blockListTips from "../../../../common/blockListTips";
import EST from "@/lib/EST";
import message from "@/router/mobile/components/common/message";
import mixin from "@/mixins/mcenter/withdraw";
import serialNumber from "./serialNumber";
import widthdrawTips from "./widthdrawTips";
import withdrawAccount from "@/router/mobile/components/common/withdrawAccount/withdrawAccount";
import withdrawMoreMethod from "./withdrawMoreMethod";

import {
  API_MCENTER_WITHDRAW,
  API_TRADE_RELAY,
  API_WITHDRAW,
  API_WITHDRAW_BALANCE_BACK,
  API_WITHDRAW_CGPAY_BINDING,
  API_WITHDRAW_INFO,
  API_WITHDRAW_WRITE_2
} from "@/config/api";
import common from "@/api/common";

export default {
  mixins: [mixin],
  data() {
    return {
      actualMoney: 0,
      depositBeforeWithdraw: false,
      errTips: "",
      firstDeposit: false,
      hasBankCard: false,
      isLoading: true,
      isSendSubmit: false,
      isSerial: false,
      isShowBlockTips: false,
      isShowCheck: false,
      isShowMore: true,
      msg: "",
      selectAccountValue: "",
      selectedCard: "",
      showMoreMethod: false,
      widthdrawTipsType: "tips"
    };
  },
  components: {
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      ),
    balanceTran,
    message,
    serialNumber,
    widthdrawTips,
    blockListTips,
    withdrawMoreMethod,
    withdrawAccount
  },
  watch: {
    withdrawUserData() {
      // 預設選擇第一張卡 或是從電話驗證成功後直接送出
      if (
        !this.selectedCard &&
        this.withdrawUserData.account &&
        this.withdrawUserData.account.length > 0
      ) {
        this.selectedCard =
          Number(localStorage.getItem("tmp_w_selectedCard")) ||
          this.withdrawUserData.account[0].id;
        this.withdrawValue = localStorage.getItem("tmp_w_amount");
        setTimeout(() => {
          localStorage.removeItem("tmp_w_selectedCard");
          localStorage.removeItem("tmp_w_amount");
          if (
            localStorage.getItem("tmp_w_1") &&
            localStorage.getItem("tmp_w_rule") !== "1"
          ) {
            this.handleSubmit();
          }
          localStorage.removeItem("tmp_w_rule");
        });

        this.isLoading = false;
      }
    }
  },
  created() {
    // 刷新 Player Api
    this.actionSetUserdata(true);

    this.depositBeforeWithdraw =
      this.memInfo.config.deposit_before_withdraw;
    this.firstDeposit = this.memInfo.user.first_deposit;
    if (this.depositBeforeWithdraw && !this.firstDeposit) {
      this.widthdrawTipsType = "deposit";
      this.isShowCheck = true;
      return;
    }

    // 綁定銀行卡內無常用帳號
    common.bankCardCheck({
      success: ({ result, ret }) => {
        if (result !== "ok") {
          return;
        }
        this.hasBankCard = ret;
      }
    });
  },
  mounted() {
    if (this.memInfo.auto_transfer.enable) {
      this.balanceBack();
    }
  },
  computed: {
    ...mapGetters({
      memCurrency: "getMemCurrency",
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      webInfo: "getWebInfo"
    }),
    valuePlaceholder() {
      if (this.withdrawData &&
        this.withdrawData.payment_charge &&
        this.withdrawData.payment_charge.ret) {
        return this.$text('S_WITHRAW_PLACEHOLDER', {
          replace: [
            {
              target: '%s',
              value:
                this.validateMoney(this.withdrawData.payment_charge.ret.withdraw_min)
            },
            {
              target: '%s',
              value:
                this.validateMoney(this.withdrawData.payment_charge.ret.withdraw_max)
            }
          ]
        })
      } else {
        return '';
      }
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    $style() {
      return (
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1
      );
    },
    lockSubmit() {
      if (
        this.errTips ||
        !this.withdrawValue ||
        this.isSendSubmit ||
        !this.selectedCard
      ) {
        return true;
      }

      if (this.themeTPL === "ey1" && !this.withdrawPwd) {
        return true;
      }

      if (
        this.withdrawData &&
        this.withdrawData.payment_charge &&
        this.withdrawData.payment_charge.ret
      ) {
        const ret = this.withdrawData.payment_charge.ret;

        const allowWithdrawCount = Number(
          this.withdrawData.payment_charge.ret.allow_withdraw_count
        );
        const allowWithdrawLimit = Number(
          this.withdrawData.payment_charge.ret.allow_withdraw_limit
        );

        // 非無限次數且有剩額度
        if (
          ret.withdraw_count &&
          Number(ret.withdraw_count) > 0 &&
          allowWithdrawCount <= 0
        ) {
          return true;
        }

        if (
          ret.withdraw_limit &&
          Number(ret.withdraw_limit) > 0 &&
          allowWithdrawLimit <= 0
        ) {
          return true;
        }
      }
      return false;
    },
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: this.$text("S_WITHDRAWAL_TEXT", "提现"),
        hasHelp: {
          type: "withdraw",
          url: "/mobile/mcenter/help/withdraw",
          func: () => {
            this.saveCurrentValue(true);
          }
        }
      };
    },
    getWithdrawTips() {
      let string = [];

      if (this.withdrawData && this.withdrawData.payment_charge && this.withdrawData.payment_charge.ret) {
        const ret = this.withdrawData.payment_charge.ret;
        if (ret.withdraw_count && Number(ret.withdraw_count) > 0) {
          string.push(`今日可用提现次数：${ret.allow_withdraw_count}次`);
        }

        if (ret.withdraw_limit && Number(ret.withdraw_limit) > 0) {
          string.push(`今日可用提现额度：${ret.allow_withdraw_limit}元`);
        }

        if (ret.withdraw_max && Number(ret.withdraw_max) > 0) {
          string.push(`单次最高提现额度：${ret.withdraw_max}元`);
        }

        return string.join("，");
      }
    }
  },
  methods: {
    linkToRecharge() {
      this.$router.push("/mobile/mcenter/creditTrans?tab=0");
    },
    getBankImage(swiftCode) {
      return {
        src: `https://images.dormousepie.com/icon/bankIconBySwiftCode/${swiftCode}.png`,
        error: this.$getCdnPath(
          "/static/image/_new/default/bank_default_2.png"
        ),
        loading: this.$getCdnPath(
          "/static/image/_new/default/bank_default_2.png"
        )
      };
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
    },
    validateMoney(target) {
      if (!target || Number(target) === 0) {
        return this.$text("S_UNLIMITED", "无限制");
      } else {
        return target;
      }
    },
    toggleSerial() {
      this.isSerial = !this.isSerial;
    },
    verification(key, value) {
      if (key === "withdrawValue") {
        value = +value;

        // 1.判斷是否為整數
        if (!Number.isInteger(value)) {
          this.errTips = "提现金额必需为整数";
          return;
        }
        this.actualMoney = value;
        // // 實際金額
        // let _actualMoney =
        //   value - +this.withdrawData.audit.total.total_deduction;
        // // 2.判斷是否 > 0
        // if (_actualMoney !== value) {
        //   this.actualMoney = _actualMoney;
        //   if (_actualMoney <= 0) {
        //     this.errTips = "实际提现金额须大于0，请重新输入";
        //     this.actualMoney = 0;
        //     return;
        //   }
        // } else {
        //   this.actualMoney = _actualMoney;
        //   this.errTips = "";
        //   return;
        // }

        // 最大值
        const withdrawMax = +this.withdrawData.payment_charge.ret.withdraw_max;
        // 最小值
        const withdrawMin = +this.withdrawData.payment_charge.ret.withdraw_min;
        // 3.判斷是否有超過最大、最小值
        if (
          this.actualMoney <= 0 ||
          value <= 0 ||
          value < withdrawMin ||
          (withdrawMax > 0 && value > withdrawMax)
        ) {
          this.errTips = `单笔提现金额最小为${withdrawMin}元，最大为${
            withdrawMax ? `${withdrawMax}元` : "无限制"
            }`;
          return;
        }

        this.errTips = "";
      }

      if (key === "withdrawPwd") {
        this.errTips = "";

        const re = /[^0-9]/g;

        if (this.withdrawPwd.length > 4) {
          this.withdrawPwd = this.withdrawPwd.substring(0, 4);
        }

        this.withdrawPwd = this.withdrawPwd
          .replace(" ", "")
          .trim()
          .replace(re, "");
      }
    },
    toggleShowMore() {
      this.isShowMore = !this.isShowMore;
    },
    handleSelectCard(item) {
      this.selectedCard = item.id;
    },
    // 最高提現
    handleMaxWithdraw() {
      if (!this.withdrawData) return;

      // 單筆最高提現
      let withdraw_max = this.withdrawData.payment_charge.ret.withdraw_max;
      let balance = this.withdrawData.cash.available_balance;

      if (!withdraw_max || Number(withdraw_max) == 0) {
        this.withdrawValue = Math.floor(Number(balance));
        this.verification("withdrawValue", Math.floor(Number(balance)));
        return;
      }

      let result =
        Number(withdraw_max) >= Number(balance) ? balance : withdraw_max;
      this.withdrawValue = Math.floor(Number(result));
      this.verification("withdrawValue", Math.floor(Number(result)));
    },
    checkSubmit() {
      if (this.memInfo.blacklist.includes(1)) {
        this.isShowBlockTips = true;
        return;
      }

      const islock = () => {
        if (
          this.errTips ||
          !this.withdrawValue ||
          this.isSendSubmit ||
          !this.selectedCard
        ) {
          return true;
        }
        if (
          this.withdrawData &&
          this.withdrawData.payment_charge &&
          this.withdrawData.payment_charge.ret
        ) {
          const ret = this.withdrawData.payment_charge.ret;

          const allowWithdrawCount = Number(
            this.withdrawData.payment_charge.ret.allow_withdraw_count
          );
          const allowWithdrawLimit = Number(
            this.withdrawData.payment_charge.ret.allow_withdraw_limit
          );

          // 非無限次數且有剩額度
          if (
            ret.withdraw_count &&
            Number(ret.withdraw_count) > 0 &&
            allowWithdrawCount <= 0
          ) {
            return true;
          }

          if (
            ret.withdraw_limit &&
            Number(ret.withdraw_limit) > 0 &&
            allowWithdrawLimit <= 0
          ) {
            return true;
          }
        }
        return false;
      };
      if (islock()) {
        return;
      }

      if (Number(this.actualMoney) !== Number(this.withdrawValue)) {
        this.widthdrawTipsType = "tips";
        this.isShowCheck = true;
      } else {
        this.handleSubmit();
      }
    },
    closeTips() {
      if (this.isShowCheck) {
        this.widthdrawTipsType = "";
        this.isShowCheck = false;
      } else if (this.isShowBlockTips) {
        this.isShowBlockTips = false;
        this.$router.back();
      }
    },
    saveCurrentValue(fromRule) {
      localStorage.setItem("tmp_w_selectedCard", this.selectedCard);
      localStorage.setItem("tmp_w_amount", this.withdrawValue);
      if (fromRule) {
        localStorage.setItem("tmp_w_rule", "1");
      }
    },
    handleSubmit() {
      if (
        this.memInfo.config.withdraw_player_verify &&
        !localStorage.getItem("tmp_w_1")
      ) {
        localStorage.setItem("tmp_w_selectedCard", this.selectedCard);
        localStorage.setItem("tmp_w_amount", this.withdrawValue);
        this.$router.push(
          "/mobile/mcenter/accountData/phone?redirect=withdraw"
        );
        return;
      }

      this.isSendSubmit = true;
      this.submitWithdraw({
        user_bank_id: this.selectedCard,
        keyring: localStorage.getItem("tmp_w_1") // 手機驗證成功後回傳
      }).then(response => {
        setTimeout(() => {
          this.$nextTick(() => {
            this.isSendSubmit = false;
            this.getWithdrawAccount();
          });
        }, 200);
      });
      localStorage.removeItem("tmp_w_1");
      localStorage.removeItem("tmp_w_selectedCard");
      localStorage.removeItem("tmp_w_amount");
    },
    /**
     * 送出取款資訊
     * @method submitWithdraw
     */
    submitWithdraw(params) {
      this.isLoading = true;
      this.actionSetIsLoading(true);

      // console.log(this.withdrawAccount);

      //不需要取款密碼,並且可選銀行卡
      let _params = {
        amount: this.withdrawValue,
        withdraw_password: this.withdrawPwd,
        forward: true,
        confirm: true,
        max_id: this.withdrawData.audit.total.max_id,
        audit_amount: this.withdrawData.audit.total.audit_amount,
        offer_deduction: this.withdrawData.audit.total.offer_deduction,
        administrative_amount: this.withdrawData.audit.total
          .administrative_amount
      };

      if (params) {
        _params = { ..._params, ...params };
      }

      const hasAccountId = !this.withdrawAccount.withdrawType
        ? "account_id"
        : this.withdrawAccount.withdrawType;

      if (this.memInfo.config.withdraw === "迅付") {
        _params = {
          ..._params,
          [`ext[api_uri]`]: "/api/trade/v2/c/withdraw/entry",
          [`ext[method][${hasAccountId}]`]: this.selectedCard,
          password: +this.withdrawPwd
        };
      }

      return ajax({
        method: "post",
        // url: API_WITHDRAW_WRITE, 舊的本站寫單
        url:
          this.memInfo.config.withdraw === "迅付"
            ? API_WITHDRAW_WRITE_2
            : API_WITHDRAW_WRITE,
        errorAlert: false,
        params: _params,
        success: response => {
          if (response && response.result === "ok") {
            if (this.memInfo.config.withdraw === "迅付") {
              this.msg = "提现成功";
              this.withdrawValue = "";
              this.withdrawPwd = "";
              this.actualMoney = 0;

              // 舊的第二次寫單才需要
              // 迅付寫單
              //   ajax({
              //     method: 'post',
              //     url: API_TRADE_RELAY,
              //     errorAlert: false,
              //     params: {
              //       api_uri: '/api/trade/v2/c/withdraw/entry',
              //       [`method[${hasAccountId}]`]: this.withdrawAccount.id,
              //       //   password: this.withdrawPwd,
              //       withdraw_id: response.ret.id
              //     },
              //     fail: (res) => {
              //       console.log(res)

              //       this.msg = '提现已取消，请重新提交申请';
              //     }
              //   }).then((res) => {
              //     console.log(res)

              //     this.isLoading = false;
              //     this.actionSetIsLoading(false);

              //     if (res && res.result === 'ok') {
              //       this.msg = "提现成功"
              //     }
              //   });
            } else {
              // 第三方寫單
              ajax({
                method: "get",
                url: API_WITHDRAW,
                errorAlert: false,
                params: {
                  amount: response.ret.amount,
                  withdraw_id: response.ret.id,
                  stage: "forward",
                  logo: this.webInfo.logo
                    ? `${this.webInfo.cdn_domain}${this.webInfo.logo}`
                    : "",
                  mlogo: this.webInfo.m_logo
                    ? `${this.webInfo.cdn_domain}${this.webInfo.m_logo}`
                    : "",
                  title: encodeURI(
                    this.memInfo.config.domain_name[this.curLang]
                  ),
                  favicon: this.webInfo.fav_icon
                    ? `${this.webInfo.cdn_domain}${this.webInfo.fav_icon}`
                    : "",
                  check: true
                },
                fail: res => {
                  this.msg = "提现已取消，请重新提交申请";
                }
              }).then(res => {
                this.isLoading = false;
                this.actionSetIsLoading(false);

                if (res.result === "ok") {
                  this.msg = "提现成功";
                  this.thirdUrl = res.ret.uri;
                }
              });
            }
          } else {
            this.msg = "提现已取消，请重新提交申请";
          }

          this.isLoading = false;
          this.actionSetIsLoading(false);
          return;
        },
        fail: error => {
          if (error && error.data && error.data.msg) {
            this.msg = error.data.msg;
            this.errTips = error.data.msg;
          }

          if (error && error.data && error.data.code === "M500001") {
            window.location.reload();
          }

          this.isLoading = false;
          this.actionSetIsLoading(false);
        }
      });
    }
  }
};
</script>

<style lang="scss" src="../css/index.module.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/ey1.module.scss" module="$style_ey1"></style>
