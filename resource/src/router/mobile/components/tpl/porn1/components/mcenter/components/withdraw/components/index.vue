<template>
  <div :class="$style['withdraw-wrap']">
    <!-- 跑馬燈 -->
    <marquee
      :list="marqueeList"
      :titleList="marqueeTitle"
      :origin="'withdraw'"
    />

    <!-- 一件回收 -->
    <!-- 鴨博 -->
    <balance-back
      v-if="['porn1', 'sg1'].includes(themeTPL)"
      :has-link="true"
      :hasTopSpace="false"
    />
    <!-- 億元 -->
    <balance-back
      v-if="['ey1'].includes(themeTPL)"
      :has-link="false"
      :hasTopSpace="false"
      :back-router="'mcenter/withdraw'"
    />

    <balance-tran :class="[$style['balance-tran-container'], 'clearfix']">
      <!-- 個別餘額 -->
      <template scope="{ balanceTran }">
        <div :class="['clearfix']">
          <!-- 紅利彩金 -->
          <div
            :class="[
              $style['balance-item'],
              {
                [$style['is-last-item']]: !isShowMore
              }
            ]"
            @click="$router.push('/mobile/mcenter/bonus')"
          >
            <span :class="$style['balance-item-vendor']">
              <template v-if="['porn1', 'sg1'].includes(themeTPL)">
                {{ $text("S_BONUS", "红利彩金") }}
              </template>

              <template v-if="['ey1'].includes(themeTPL)">
                {{ $text("S_BONUS_ACCOUNT", "红利帐户") }}
              </template>
            </span>

            <span :class="$style['balance-item-money']">
              {{ bonus.balance ? bonus.balance : "" }}
            </span>
          </div>

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
                      3 || 3)
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
                    $getCdnPath(`/static/image/${themeTPL}/mcenter/ic_tips.png`)
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
                      `/static/image/common/mcenter/balanceTrans/ic_expand.png`
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
                    $getCdnPath(`/static/image/${themeTPL}/mcenter/ic_tips.png`)
                  "
                  :class="$style['balance-wrench']"
                />
              </span>
              <span v-else :class="$style['balance-item-money']">{{
                item.amount
              }}</span>
            </div>

            <div
              v-if="Object.keys(balanceTran.balanceInfo).length > 3"
              :class="[$style['balance-item'], $style['collapse']]"
              @click="toggleShowMore"
            >
              <span :class="$style['balance-item-vendor']">收起</span>
              <div :class="[$style['icon']]">
                <img
                  :src="
                    $getCdnPath(
                      `/static/image/common/mcenter/balanceTrans/ic_collapse.png`
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
    <!-- Yabo : 銀行卡列表 + 更多提現方式按鈕 -->
    <template v-if="['porn1', 'sg1'].includes(themeTPL)">
      <!-- 銀行卡 -->
      <div
        v-if="allWithdrawAccount && allWithdrawAccount.length > 0"
        :class="$style['bank-card-wrap']"
      >
        <div :class="$style['bank-card-cell']">
          {{ $text("S_WITHDRAW_ACCOUNT02", "提现帐号") }}
          <!-- 會員首次出款 or 需用銀行卡提現一次(強制銀行卡出款) -->
          <span
            v-if="
              forceStatus === 1 &&
                userWithdrawCount === 0 &&
                isFirstWithdraw &&
                withdrawUserData.wallet.length +
                  withdrawUserData.crypto.length >
                  0
            "
            :class="$style['withdraw-status-tip']"
            >银行卡提现一次，开通数字货币提现功能</span
          >

          <!-- 非首次出款 + 強制使用 CGPay 出款 -->
          <span
            v-else-if="forceStatus === 2"
            :class="$style['withdraw-status-tip']"
            >仅限使用 CGPay 出款</span
          >
        </div>

        <!-- 列出所有帐号 -->
        <!-- Question: 如果強制使用銀行卡出款，是否數字貨幣卡片 allow 狀態會為 false ? -->
        <!-- disable 的狀態需要與 RD5 請示 -->
        <div
          v-for="(item, index) in allWithdrawAccount"
          :key="index + '-' + item.id"
          :class="[
            $style['bank-card-cell'],
            {
              [$style['disable']]: !item.allow
            }
          ]"
          @click="handleSelectCard(item)"
        >
          <div
            :class="[
              $style['check-box'],
              { [$style['checked']]: item.id === selectedCard.id },
              {
                [$style['disable']]: !item.allow
              }
            ]"
          />
          <!-- <img v-lazy="getBankImage(item.swift_code)" /> -->
          <span :class="[{ [$style['hasOption']]: item.bank_id === 2009 }]">
            {{ parseCardName(item.alias, item.withdrawType) }}
          </span>

          <!-- CGPay USDT -->
          <template v-if="item.bank_id === 2009">
            <img
              :class="$style['transfergo-img']"
              :src="
                $getCdnPath(
                  `/static/image/common/mcenter/balanceTrans/ic_transfergo.png`
                )
              "
              alt="ic_transfergo"
            />

            <div
              :class="$style['currency-text']"
              @click.stop="
                () => {
                  if (item.id !== selectedCard.id) {
                    handleSelectCard(item);
                  }
                  setPopupStatus(true, 'currency');
                }
              "
            >
              {{ withdrawCurrency.alias }}
            </div>
          </template>
        </div>
      </div>

      <!-- 更多提现方式 -->
      <!-- 銀行卡超過3張 + 所有數字貨幣的錢包都有添加 => 則隱藏按鈕 -->
      <!-- 狀態由 withdrawMoreMethod 組件回傳 -->
      <div
        v-if="moreMethodStatus.bankCard || moreMethodStatus.wallet"
        :class="[$style['add-bank-card']]"
        @click="setPopupStatus(true, 'moreMethod')"
      >
        <img :src="$getCdnPath(`/static/image/${themeTPL}/mcenter/add.png`)" />
        &nbsp;
        <span>{{ "添加提现方式" }}</span>
      </div>
    </template>

    <!-- 因按鈕顯示邏輯不同，所以獨立成兩份 -->
    <!-- 億元 : 銀行卡列表 + 更多提現方式按鈕 -->
    <template v-if="['ey1'].includes(themeTPL)">
      <!-- 提現帳號 -->
      <div
        v-if="allWithdrawAccount && allWithdrawAccount.length > 0"
        :class="$style['bank-card-wrap']"
      >
        <div :class="$style['bank-card-cell']">
          {{ $text("S_WITHDRAW_ACCOUNT02", "提现帐号") }}
          <span v-if="forceStatus === 2" :class="$style['withdraw-status-tip']"
            >（请使用 CGPay 出款）</span
          >
        </div>

        <!-- 列出所有帳號-->
        <div
          v-for="(item, index) in allWithdrawAccount"
          :key="index + '-' + item.id"
          :class="[
            $style['bank-card-cell'],
            {
              [$style['disable']]: forceStatus === 2 && !item.allow
            }
          ]"
          @click="handleSelectCard(item)"
        >
          <div
            :class="[
              $style['check-box'],
              { [$style['checked']]: item.id === selectedCard.id }
            ]"
          />
          <span :class="[{ [$style['hasOption']]: item.bank_id === 2009 }]">
            {{ item.alias }}
          </span>

          <!-- CGPay USDT -->
          <template v-if="item.bank_id === 2009">
            <img
              :class="$style['transfergo-img']"
              :src="
                $getCdnPath(
                  `/static/image/common/mcenter/balanceTrans/ic_transfergo.png`
                )
              "
              alt="ic_transfergo"
            />

            <div
              :class="$style['currency-text']"
              @click.stop="
                () => {
                  if (item.id !== selectedCard.id) {
                    handleSelectCard(item);
                  }
                  setPopupStatus(true, 'currency');
                }
              "
            >
              {{ withdrawCurrency.alias }}
            </div>
          </template>
        </div>
      </div>

      <!-- 添加银行卡 -->
      <div
        v-if="allWithdrawAccount.length === 0 && userLevelObj.bank"
        :class="[$style['add-bank-card']]"
        @click="checkAccountData('bankCard')"
      >
        <img :src="$getCdnPath(`/static/image/common/mcenter/add_2.png`)" />
        &nbsp;
        <span>{{ $text("S_ADD_BANKCARD", "添加银行卡") }}</span>
      </div>

      <!-- 添加电子钱包 -->
      <div
        v-if="allWithdrawAccount.length === 0 && userLevelObj.virtual_bank"
        :class="[$style['add-bank-card']]"
        @click="checkAccountData('wallet')"
      >
        <img :src="$getCdnPath(`/static/image/common/mcenter/add_2.png`)" />
        &nbsp;
        <span>{{ $text("S_ADD_VIRTUAL_BANKCARD", "添加电子钱包") }}</span>
      </div>

      <!-- 更多提现方式 -->
      <div
        v-if="
          allWithdrawAccount &&
            allWithdrawAccount.length > 0 &&
            (moreMethodStatus.bankCard || moreMethodStatus.wallet)
        "
        :class="[$style['add-bank-card']]"
        @click="setPopupStatus(true, 'moreMethod')"
      >
        <img :src="$getCdnPath(`/static/image/common/mcenter/add_2.png`)" />
        &nbsp;
        <span>{{ "更多提现方式" }}</span>
      </div>
    </template>

    <!-- 需有卡片時才出現 -->
    <template v-if="allWithdrawAccount && allWithdrawAccount.length > 0">
      <!-- 額度提示訊息 -->
      <div :class="$style['tips']">{{ getWithdrawTips }}</div>

      <!-- 提現輸入 -->
      <!-- hasBankCard 似乎要再調整判斷 -->
      <!-- <div v-if="hasBankCard" :class="[$style['withdraw-input']]"> -->
      <div :class="[$style['withdraw-input']]">
        <span :class="$style['money-currency']">¥</span>
        <input
          v-model="withdrawValue"
          autocomplete="off"
          type="text"
          inputmode="decimal"
          @input="verification('withdrawValue', $event.target.value)"
          @blur="
            $event => {
              verification('withdrawValue', $event.target.value);
              if (isSelectedUSDT && isClickCoversionBtn && withdrawValue) {
                convertCryptoMoney();
              }
            }
          "
          :placeholder="valuePlaceholder"
        />
        <span :class="[$style['withdraw-max']]">
          <span @click="handleMaxWithdraw">
            {{ $text("S_WITHRAW_MAX2", "最高提现") }}
          </span>
        </span>
      </div>
      <!-- 優惠提示 -->
      <div v-if="hasOffer" :class="[$style['offer']]">
        <span>
          使用{{ selectedCard.name }}出款，额外赠送{{ offer() }}元(CNY)优惠
        </span>
      </div>
      <!-- 到帳金額 -->
      <div
        :class="[
          $style['actual-money'],
          {
            [$style['error']]:
              ['ey1'].includes(themeTPL) && withdrawValue && actualMoney <= 0
          }
        ]"
      >
        <span :class="$style['money-currency']">
          {{
            `${
              selectedCard.name && !isSelectedUSDT
                ? `${selectedCard.name}到帐`
                : "实际提现金额"
            }`
          }}
        </span>
        <span :class="$style['money-currency']">¥</span>
        <span :class="$style['money-currency']">
          {{ actualMoneyPlusOffer() }}
        </span>

        <span :class="[$style['serial']]" @click="toggleSerial">详情</span>
      </div>

      <!-- 匯率試算 -->
      <div v-if="isSelectedUSDT" :class="$style['crypto-block']">
        <!-- <span :class="$style['money-currency']">¥</span> -->
        <span :class="$style['money-currency']"
          >{{ selectedCard.name }}到帐</span
        >
        <span :class="$style['money-currency']">{{ cryptoMoney }}</span>

        <div
          :class="[
            $style['conversion-btn'],
            {
              [$style['disable']]:
                isClickCoversionBtn || !withdrawValue || +actualMoney <= 0
            }
          ]"
          @click="convertCryptoMoney"
        >
          {{ countdownSec > 0 ? `${formatCountdownSec()}` : `汇率试算` }}
        </div>
      </div>

      <!-- 錯誤訊息 -->
      <div v-if="errTips" :class="[$style['withdraw-error-tips']]">
        <span>{{ errTips }}</span>
      </div>

      <!-- Botton -->
      <!-- Yabo -->
      <template v-if="['porn1', 'sg1'].includes(themeTPL)">
        <div :class="[$style['btn-wrap']]">
          <div :class="[$style['submit-btn']]">
            <div @click="linkToRecharge">额度转让&nbsp;实时返佣</div>
          </div>

          <div
            :class="[
              $style['submit-btn'],
              { [$style['disabled']]: lockSubmit }
            ]"
          >
            <div @click="checkSubmit">立即提现</div>
          </div>
        </div>
      </template>

      <!-- 取款密碼＋Botton -->
      <!-- 億元 -->
      <template v-if="['ey1'].includes(themeTPL)">
        <div :class="[$style['withdraw-pwd-input']]">
          <input
            v-model="withdrawPwd"
            autocomplete="off"
            placeholder="请输入提现密码(限定4码数字)"
            type="tel"
            maxlength="4"
            @input="verification('withdrawPwd', $event.target.value)"
          />
        </div>

        <div :class="[$style['btn-wrap']]">
          <div
            :class="[
              $style['submit-btn'],
              { [$style['disabled']]: lockSubmit }
            ]"
          >
            <div @click="checkSubmit">立即提现</div>
          </div>
        </div>
      </template>
    </template>

    <!-- Tips -->
    <div :class="$style['tips']">
      <!-- 已綁定 + 尚未被禁用 + 允許支付(allow 為 true) -->
      <div v-if="allWithdrawAccount && allWithdrawAccount.length > 0">
        为了方便您快速提现，请先将所有场馆钱包金额回收至中心钱包
        <br />可提现金额会扣除未兑现红利总计
      </div>

      <div v-else>
        {{ hasBindingBankCard ? "" : "请先绑定一张银行卡，用于收款" }}
      </div>
    </div>

    <!-- 流水檢查 -->
    <serial-number
      v-if="isSerial"
      :handle-close="toggleSerial"
      :swift-code="selectedCard.swift_code"
    />

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

    <!-- 彈窗 -->
    <template v-if="showPopStatus.isShow">
      <!-- 被列為黑名單提示 -->
      <template v-if="showPopStatus.type === 'blockTips'">
        <block-list-tips type="withdraw" @close="closePopup" />
      </template>

      <!-- 提款前提示-->
      <template v-if="showPopStatus.type === 'check'">
        <widthdraw-tips
          :actual-money="actualMoneyPlusOffer()"
          :crypto-money="cryptoMoney"
          :withdraw-value="+withdrawValue"
          :type="widthdrawTipsType"
          :has-crypto="isSelectedUSDT"
          :swift-code="selectedCard.swift_code"
          :bonus-offer="offer()"
          :withdraw-name="selectedCard.name"
          :has-offer="hasOffer"
          @close="closePopup"
          @submit="handleSubmit"
          @save="saveCurrentValue(true)"
        />
      </template>

      <!-- 更多提现方式 -->
      <template v-if="showPopStatus.type === 'moreMethod'">
        <withdraw-more-method
          :withdraw-user-data="withdrawUserData"
          :check-account-data="checkAccountData"
          :more-method-status="moreMethodStatus"
          @close="closePopup"
        />
      </template>

      <!-- Currency 列表 -->
      <template v-if="showPopStatus.type === 'currency'">
        <withdraw-currency
          :type="'withdraw-currency'"
          :title="'选择转出货币'"
          :render-list="currencyList"
          :current-obj="withdrawCurrency"
          :item-func="setWithdrawCurrency"
          @close="closePopup"
        />
      </template>

      <!-- 刷新匯率 || 維護彈窗 -->
      <template v-if="showPopStatus.type === 'funcTips'">
        <confirm-one-btn :data="confirmPopupObj" @close="confirmPopupObj.cb" />
      </template>
    </template>

    <page-loading :is-show="isLoading" />
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import ajax from "@/lib/ajax";
import balanceTran from "@/components/mcenter/components/balanceTran";
import blockListTips from "../../../../common/blockListTips";
import confirmOneBtn from "@/router/mobile/components/common/confirmOneBtn";
import EST from "@/lib/EST";
import mixin from "@/mixins/mcenter/withdraw";
import serialNumber from "./serialNumber";
import withdrawCurrency from "@/router/mobile/components/common/pickerView/pickerView";
import widthdrawTips from "./widthdrawTips";
import withdrawAccount from "@/router/mobile/components/common/withdrawAccount/withdrawAccount";
import withdrawMoreMethod from "./withdrawMoreMethod";
import marquee from "@/router/mobile/components/common/marquee/marquee";
import balanceBack from "@/router/mobile/components/tpl/porn1/components/mcenter/components/common/balanceBack";

import {
  API_TRADE_RELAY,
  API_CRYPTO_MONEY,
  API_WITHDRAW,
  API_WITHDRAW_WRITE_2
} from "@/config/api";
import common from "@/api/common";

export default {
  components: {
    pageLoading: () =>
      import(
        /* webpackChunkName: 'pageLoading' */ "@/router/mobile/components/common/pageLoading"
      ),
    balanceTran,
    confirmOneBtn,
    serialNumber,
    widthdrawTips,
    blockListTips,
    withdrawCurrency,
    withdrawMoreMethod,
    withdrawAccount,
    marquee,
    balanceBack
  },
  mixins: [mixin],
  data() {
    return {
      actualMoney: 0,
      depositBeforeWithdraw: false,
      errTips: "",
      errCode: "",
      firstDeposit: false,
      // hasBankCard: false,

      isLoading: true,
      isSendSubmit: false,
      isSerial: false,
      isShowMore: true,
      // 彈窗顯示狀態統整
      showPopStatus: {
        isShow: false,
        type: ""
      },

      selectAccountValue: "",
      selectedCard: {
        bank_id: "",
        id: "",
        name: "",
        withdrawType: "",
        swift_code: "",
        offer_percent: "",
        offer_limit: ""
      },
      widthdrawTipsType: "tips",

      // 記錄使用者目前出款總次數
      userWithdrawCount: null,

      // 匯率試算相關
      cryptoMoney: "--",
      timer: null,
      countdownSec: 0,
      isClickCoversionBtn: false,

      //紅利帳戶
      bonus: {},

      confirmPopupObj: {
        title: "",
        content: "",
        btnText: "",
        cb: () => {}
      }
    };
  },
  watch: {
    allWithdrawAccount(value) {
      // 預設選擇第一張卡(allow = true) 或是從電話驗證成功後直接送出
      if (
        !this.selectedCard.id &&
        this.allWithdrawAccount &&
        this.allWithdrawAccount.length > 0
      ) {
        const defaultCard = this.allWithdrawAccount.find(item => {
          return item.allow;
        });

        // 卡片資料
        this.selectedCard = localStorage.getItem("tmp_w_selectedCard")
          ? {
              bank_id: JSON.parse(localStorage.getItem("tmp_w_selectedCard"))[
                "bank_id"
              ],
              id: JSON.parse(localStorage.getItem("tmp_w_selectedCard"))["id"],
              name: JSON.parse(localStorage.getItem("tmp_w_selectedCard"))[
                "name"
              ],
              withdrawType: JSON.parse(
                localStorage.getItem("tmp_w_selectedCard")
              )["withdrawType"],
              swift_code: JSON.parse(
                localStorage.getItem("tmp_w_selectedCard")
              )["swift_code"],
              offer_percent: JSON.parse(
                localStorage.getItem("tmp_w_selectedCard")
              )["offer_percent"],
              offer_limit: JSON.parse(
                localStorage.getItem("tmp_w_selectedCard")
              )["offer_limit"]
            }
          : {
              bank_id: defaultCard.bank_id,
              id: defaultCard.id,
              name:
                defaultCard.withdrawType === "account_id"
                  ? ""
                  : defaultCard.alias.substring(
                      0,
                      defaultCard.alias.indexOf("-")
                    ),
              withdrawType: defaultCard.withdrawType,
              swift_code: defaultCard.swift_code,
              offer_percent: defaultCard.offer_percent,
              offer_limit: defaultCard.offer_limit
            };

        this.updateAmount(this.selectedCard.swift_code);

        // 金額部份
        this.withdrawValue =
          localStorage.getItem("tmp_w_amount") || this.withdrawValue;
        this.actualMoney =
          JSON.parse(localStorage.getItem("tmp_w_actualAmount")) ||
          this.actualMoney;

        // 提現密碼
        this.withdrawPwd =
          localStorage.getItem("tmp_w_withdrawPwd") || this.withdrawPwd;

        // CGPay Currency
        this.withdrawCurrency =
          JSON.parse(localStorage.getItem("tmp_w_withdrawCurrency")) ||
          this.withdrawCurrency;

        setTimeout(() => {
          this.removeCurrentValue();

          if (
            localStorage.getItem("tmp_w_1") &&
            localStorage.getItem("tmp_w_rule") !== "1"
          ) {
            this.handleSubmit();
          }
          localStorage.removeItem("tmp_w_rule");
        });

        // this.actionSetIsLoading(false);
        this.isLoading = false;
      }
    },
    "selectedCard.bank_id"(value) {
      // When the option = CGPay
      if (value === 2009) {
        this.selectedCard.name = "CGPay";
      }
    }
  },
  created() {
    // 判斷分項維護優先度最高
    this.actionGetServiceMaintain().then(data => {
      // priority: player_deposit_and_withdraw > player_withdraw
      let target =
        data.find(
          item =>
            item.service === "player_deposit_and_withdraw" && item.is_maintain
        ) ||
        data.find(
          item => item.service === "player_withdraw" && item.is_maintain
        );

      if (target) {
        this.isLoading = false;
        this.handleServiceMain(target);

        return;
      } else {
        // 沒有維護則跑原本流程

        this.updateAmount().then(() => {
          this.getWithdrawAccount();
          // 刷新 Player Api
          this.actionSetUserdata(true);
          this.getUserLevel();
          this.getUserStat();
          this.getNowOpenWallet();
          this.getBounsAccount();
          this.actionSetAnnouncementList({ type: 2 });
        });

        this.depositBeforeWithdraw = this.memInfo.config.deposit_before_withdraw;
        this.firstDeposit = this.memInfo.user.first_deposit;
        if (this.depositBeforeWithdraw && !this.firstDeposit) {
          this.widthdrawTipsType = "deposit";
          this.setPopupStatus(true, "check");
          return;
        }

        // 綁定銀行卡內無常用帳號
        // common.bankCardCheck({
        //   success: ({ result, ret }) => {
        //     if (result !== "ok") {
        //       return;
        //     }
        //     this.hasBankCard = ret;
        //   }
        // });

        return;
      }
    });
  },
  mounted() {
    // 按下一鍵歸戶後，需再更新 withdraw/info 這支 API
    // 避免「可提現餘額是否超過中心錢包餘額」重複出現(到時重構再更改)
    document.querySelector("#one-recycle-btn").addEventListener("click", () => {
      setTimeout(() => {
        this.updateAmount(this.selectedCard.swift_code);
      }, 4000);
    });

    // if (this.memInfo.auto_transfer.enable) {
    //   this.balanceBack();
    // }
  },
  computed: {
    ...mapGetters({
      memCurrency: "getMemCurrency",
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      webInfo: "getWebInfo",
      hasBindingBankCard: "getHasBank",
      announcementList: "getAnnouncementList"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    $style() {
      return (
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1
      );
    },
    valuePlaceholder() {
      if (
        this.withdrawData &&
        this.withdrawData.payment_charge &&
        this.withdrawData.payment_charge.ret
      ) {
        return this.$text("S_WITHRAW_PLACEHOLDER", {
          replace: [
            {
              target: "%s",
              value: this.validateMoney(
                this.withdrawData.payment_charge.ret.withdraw_min
              )
            },
            {
              target: "%s",
              value: this.validateMoney(
                this.withdrawData.payment_charge.ret.withdraw_max
              )
            }
          ]
        });
      } else {
        return "";
      }
    },
    lockSubmit() {
      if (!this.withdrawValue || this.isSendSubmit || !this.selectedCard.id) {
        return true;
      }

      // C590021 = 系統忙碌中，出款單已取消，請重新提交
      if (this.errTips && this.errCode !== "C590021") {
        return true;
      }

      // 億元：當提現密碼尚未輸入值
      if (["ey1"].includes(this.themeTPL) && !this.withdrawPwd) {
        return true;
      }

      // 在有出現加密貨幣選項中，尚未點擊過試算按鈕
      if (this.isSelectedUSDT && !this.isClickCoversionBtn) {
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
        // const allowWithdrawLimit = Number(
        //   this.withdrawData.payment_charge.ret.allow_withdraw_limit
        // );

        // 非無限次數且有剩額度
        if (
          ret.withdraw_count &&
          Number(ret.withdraw_count) > 0 &&
          allowWithdrawCount <= 0
        ) {
          return true;
        }

        // if (
        //   ret.withdraw_limit &&
        //   Number(ret.withdraw_limit) > 0 &&
        //   allowWithdrawLimit <= 0
        // ) {
        //   return true;
        // }
      }
      return false;
    },
    getWithdrawTips() {
      let string = [];

      if (
        this.withdrawData &&
        this.withdrawData.payment_charge &&
        this.withdrawData.payment_charge.ret
      ) {
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
    },
    // 是否首次出款
    isFirstWithdraw() {
      return this.memInfo.config.player_ub_first_withdraw;
    },
    isSelectedUSDT() {
      // 選擇 加密貨幣USDT 的選項
      let withdrawType = this.selectedCard.withdrawType === "crypto_id";

      // CGPay-USDT
      let cgpayCurrencyUSDT =
        this.selectedCard.bank_id === 2009 &&
        this.withdrawCurrency.method_id === 28;

      return withdrawType || cgpayCurrencyUSDT;
    },
    // 強制出款狀態
    forceStatus() {
      return this.withdrawUserData.force_status;
    },
    // 更多提現方式
    moreMethodStatus() {
      let obj = {};
      // 直到 Check wallet 的部份，再 return 整個 obj

      // Bank
      if (
        this.userLevelObj.bank &&
        this.withdrawUserData &&
        this.withdrawUserData.account &&
        this.withdrawUserData.account.length < 3
      ) {
        obj.bankCard = true;
      } else {
        obj.bankCard = false;
      }

      // Wallet
      // 尚未打開電子錢包開關
      if (!this.userLevelObj.virtual_bank) {
        obj.wallet = false;
        return obj;
      }

      // 億元 && 未開啟限綁一組開關
      if (
        ["ey1"].includes(this.themeTPL) &&
        !this.userLevelObj.virtual_bank_single
      ) {
        // 已開啟電子錢包開關 & 未開啟限綁一組開關
        let noSingleLimit =
          this.withdrawUserData.wallet &&
          this.withdrawUserData.wallet.length < 15;

        obj.wallet = noSingleLimit ? true : false;
        return obj;
      }

      // Yabo or 億元 && 開啟限綁一組開關
      if (
        ["porn1", "sg1"].includes(this.themeTPL) ||
        (["ey1"].includes(this.themeTPL) &&
          this.userLevelObj.virtual_bank_single)
      ) {
        let nowBindWalletCount = 0;

        // 增加判空，否則報 map 錯誤
        if (
          this.withdrawData.user_virtual_bank &&
          this.withdrawData.user_virtual_bank.ret &&
          this.withdrawData.user_virtual_bank.ret.length > 0
        ) {
          // 找目前 user 有綁定過的 wallet
          let idArr = [
            ...new Set(
              this.withdrawData.user_virtual_bank.ret.map(item => {
                // 本廳是否支援此電子錢包 & 是否為常用帳戶
                return item.virtual && item.common
                  ? item.virtual_bank_id
                  : null;
              })
            )
          ];

          if (idArr) {
            this.nowOpenWallet.forEach(item => {
              nowBindWalletCount += idArr.includes(item.id) ? 1 : 0;
            });

            // 當使用者已綁定的錢包 >= 目前所有開放的電子錢包時
            if (nowBindWalletCount >= this.nowOpenWallet.length) {
              obj.wallet = false;
              return obj;
            }
          }
        }

        obj.wallet = true;
        return obj;
      }
    },
    hasOffer() {
      return (
        (this.isSelectedUSDT ||
          this.selectedCard.bank_id == 2009 ||
          this.selectedCard.bank_id == 2016) &&
        this.selectedCard.offer_percent > 0
      );
    },
    marqueeList() {
      return this.announcementList;
    },
    marqueeTitle() {
      let arr = this.marqueeList.map(item => {
        return {
          title: item.title,
          switch: item.announceSwitch
        };
      });
      return arr;
    }
  },

  methods: {
    ...mapActions(["actionGetServiceMaintain", "actionSetAnnouncementList"]),
    linkToRecharge() {
      this.$router.push("/mobile/mcenter/creditTrans?tab=0");
    },
    getBankImage(swiftCode) {
      return {
        src: `https://images.dormousepie.com/icon/bankIconBySwiftCode/${swiftCode}.png`,
        error: this.$getCdnPath(
          `/static/image/common/default/bank_card_default.png`
        ),
        loading: this.$getCdnPath(
          `/static/image/common/default/bank_card_default.png`
        )
      };
    },
    onClickMaintain(value) {
      let text = `美东时间：
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
      this.actionSetGlobalMessage({ msg: text });
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

    verification(target, value) {
      if (target === "withdrawValue") {
        value = String(value).replace(/[^0-9]/g, "");
        this.withdrawValue = value;

        // 針對加密貨幣
        if (this.isSelectedUSDT && !value) {
          this.cryptoMoney = "--";
        }

        // // 1.判斷是否為整數
        // if (!Number.isInteger(value)) {
        //   this.errTips = "提现金额必需为整数";
        //   return;
        // }

        // 實際金額
        let _actualMoney =
          value - +this.withdrawData.audit.total.total_deduction;
        this.actualMoney = _actualMoney;

        // 實際提現金額 < 0
        if (_actualMoney <= 0) {
          this.errTips = "实际提现金额须大于0，请重新输入";
          // 實際提現金額 => 有流水時為 0
          this.actualMoney = _actualMoney !== value ? 0 : this.actualMoney;
          return;
        }

        // 最大值
        const withdrawMax = +this.withdrawData.payment_charge.ret.withdraw_max;
        // 最小值
        const withdrawMin = +this.withdrawData.payment_charge.ret.withdraw_min;
        // 3.判斷是否有超過最大、最小值
        if (
          value <= 0 ||
          value < withdrawMin ||
          (withdrawMax > 0 && value > withdrawMax)
        ) {
          this.errTips = `单笔提现金额最小为${withdrawMin}元，最大为${
            withdrawMax ? `${withdrawMax}元` : "无限制"
          }`;
          return;
        }

        // 4.可提現餘額是否超過中心錢包餘額
        const balance = Number(this.withdrawData.cash.available_balance);

        if (this.withdrawValue > Math.floor(balance)) {
          // this.errTips = ["porn1", "sg1"].includes(this.themeTPL)
          //   ? "提现金额不可大於中心钱包余额"
          //   : "提现金额不可大于最高提现金额";
          this.errTips = "提现金额不可大于最高提现金额";
          return;
        }

        this.errTips = "";
        this.errCode = "";
      }

      if (target === "withdrawPwd") {
        this.actionVerificationFormData({
          target: "withdrawPwd",
          value: value
        }).then(val => {
          this.withdrawPwd = val;
        });
      }
    },
    toggleShowMore() {
      this.isShowMore = !this.isShowMore;
    },
    handleSelectCard(item) {
      this.updateAmount(item.swift_code);
      this.selectedCard = {
        id: item.id,
        withdrawType: item.withdrawType,
        bank_id: item.bank_id,
        swift_code: item.swift_code,
        offer_percent: item.offer_percent,
        offer_limit: item.offer_limit
      };

      switch (item.withdrawType) {
        case "account_id":
          this.selectedCard.name = "";
          break;

        default:
          this.selectedCard.name = item.alias.substring(
            0,
            item.alias.indexOf("-")
          );
          break;
      }

      // if (this.withdrawValue) {
      //   this.verification("withdrawValue", this.withdrawValue);
      // }

      // 已按下匯率試算的按鈕且做切換時
      if (this.isClickCoversionBtn) {
        this.resetTimerStatus();
        this.cryptoMoney = "--";
        this.closePopup(); // 為了不顯示「匯率刷新」的彈窗
      }
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

      if (this.isSelectedUSDT && this.isClickCoversionBtn) {
        this.convertCryptoMoney();
      }
    },
    checkSubmit() {
      // 每一次按下立即提現的時候，重新刷新 Player Api
      this.actionSetUserdata(true).then(() => {
        // 檢查有無黑名單
        if (this.memInfo.blacklist.includes(1)) {
          this.setPopupStatus(true, "blockTips");
          return;
        }

        const islock = () => {
          if (
            !this.withdrawValue ||
            this.isSendSubmit ||
            !this.selectedCard.id
          ) {
            return true;
          }

          if (this.errTips && this.errCode !== "C590021") {
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
            // const allowWithdrawLimit = Number(
            //   this.withdrawData.payment_charge.ret.allow_withdraw_limit
            // );

            // 非無限次數且有剩額度
            if (
              ret.withdraw_count &&
              Number(ret.withdraw_count) > 0 &&
              allowWithdrawCount <= 0
            ) {
              return true;
            }

            // if (
            //   ret.withdraw_limit &&
            //   Number(ret.withdraw_limit) > 0 &&
            //   allowWithdrawLimit <= 0
            // ) {
            //   return true;
            // }
          }
          return false;
        };

        if (islock()) {
          return;
        }

        // 會員綁定銀行卡前需手機驗證 与 投注/轉帳前需綁定銀行卡
        this.withdrawCheck().then(res => {
          if (res === "ok") {
            switch (this.themeTPL) {
              case "porn1":
              case "sg1":
                if (Number(this.actualMoney) !== Number(this.withdrawValue)) {
                  this.widthdrawTipsType = "tips";
                  this.setPopupStatus(true, "check");
                } else {
                  this.handleSubmit();
                }
                break;

              // 一律顯示溫馨
              case "ey1":
                this.widthdrawTipsType = "tips";
                this.setPopupStatus(true, "check");
                break;
            }
          }
        });
      });
    },
    closePopup() {
      switch (this.showPopStatus.type) {
        case "check":
          this.widthdrawTipsType = "";
          break;

        case "blockTips":
          this.$router.push("/mobile/mcenter/wallet");
          break;

        default:
          break;
      }

      this.setPopupStatus(false, "");
    },
    saveCurrentValue(fromRule) {
      localStorage.setItem(
        "tmp_w_selectedCard",
        JSON.stringify(this.selectedCard)
      );

      localStorage.setItem(
        "tmp_w_withdrawCurrency",
        JSON.stringify(this.withdrawCurrency)
      );

      localStorage.setItem("tmp_w_amount", this.withdrawValue);
      localStorage.setItem(
        "tmp_w_actualAmount",
        JSON.stringify(this.actualMoney)
      );

      localStorage.setItem("tmp_w_withdrawPwd", this.withdrawPwd);
      if (fromRule) {
        localStorage.setItem("tmp_w_rule", "1");
      }
    },
    removeCurrentValue(needDeleteRule) {
      localStorage.removeItem("tmp_w_selectedCard");
      localStorage.removeItem("tmp_w_withdrawCurrency");
      localStorage.removeItem("tmp_w_amount");
      localStorage.removeItem("tmp_w_actualAmount");
      localStorage.removeItem("tmp_w_withdrawPwd");

      if (needDeleteRule) {
        localStorage.removeItem("tmp_w_1");
      }
    },
    withdrawCheck() {
      return axios({
        method: "get",
        url: "/api/v2/c/withdraw/check"
      })
        .then(res => {
          this.isCheckWithdraw = false;

          if (res.data.result === "ok") {
            let check = true;

            Object.keys(res.data.ret).forEach(i => {
              if (i !== "bank" && !res.data.ret[i]) {
                this.actionSetGlobalMessage({
                  msg: "请先设定提现资料",
                  cb: () => {
                    {
                      this.$router.push(
                        "/mobile/withdrawAccount?redirect=wallet"
                      );
                    }
                  }
                });
                check = false;
                return;
              }
            });

            if (check) {
              return "ok";
            }
          } else {
            this.actionSetGlobalMessage({
              msg: res.data.msg,
              code: res.data.code
            });
            return;
          }
        })
        .catch(res => {
          if (res.response.data) {
            this.actionSetGlobalMessage({
              msg: res.response.data.msg,
              code: res.response.data.code
            });
          }
          return;
        });
    },
    handleSubmit() {
      this.closePopup();

      if (
        // 會員首次出款僅限銀行卡
        this.memInfo.config.withdraw_player_verify &&
        !localStorage.getItem("tmp_w_1")
      ) {
        this.saveCurrentValue();
        this.$router.push(
          "/mobile/mcenter/accountData/phone?redirect=withdraw"
        );
        return;
      }

      this.isSendSubmit = true;
      this.submitWithdraw({
        user_bank_id: this.selectedCard.id,
        keyring: localStorage.getItem("tmp_w_1") // 手機驗證成功後回傳
      }).then(response => {
        setTimeout(() => {
          this.$nextTick(() => {
            this.isSendSubmit = false;
            this.getWithdrawAccount();
          });
        }, 200);
      });

      this.removeCurrentValue(true);
    },
    /**
     * 送出取款資訊
     * @method submitWithdraw
     */
    submitWithdraw(params) {
      this.isLoading = true;
      this.actionSetIsLoading(true);

      // 不需要取款密碼,並且可選銀行卡
      let _params = {
        amount: this.withdrawValue,
        withdraw_password: this.withdrawPwd ? this.withdrawPwd : "",
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

      if (this.memInfo.config.withdraw === "迅付") {
        _params = {
          ..._params,
          [`ext[api_uri]`]: "/api/trade/v2/c/withdraw/entry",
          [`ext[method][${this.selectedCard.withdrawType}]`]: this.selectedCard
            .id,
          [`ext[method][method_id]`]:
            this.selectedCard.bank_id === 2009
              ? this.withdrawCurrency.method_id
              : "",
          password: this.withdrawPwd ? this.withdrawPwd : "",
          swift_code: this.selectedCard.swift_code
        };
      }

      console.log(_params);

      return ajax({
        method: "post",
        // url: API_WITHDRAW_WRITE, 舊的本站寫單
        url: API_WITHDRAW_WRITE_2,
        errorAlert: false,
        params: _params,
        success: response => {
          if (response && response.result === "ok") {
            if (this.memInfo.config.withdraw === "迅付") {
              this.actionSetGlobalMessage({
                msg: "提现成功",
                cb: () => {
                  window.location.reload();
                }
              });

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
                  this.actionSetGlobalMessage({
                    msg: "提现已取消，请重新提交申请"
                  });
                }
              }).then(res => {
                this.isLoading = false;
                this.actionSetIsLoading(false);

                if (res.result === "ok") {
                  this.actionSetGlobalMessage({
                    msg: "提现成功"
                  });

                  this.thirdUrl = res.ret.uri;
                }
              });
            }
          } else {
            this.actionSetGlobalMessage({ msg: "提现已取消，请重新提交申请" });
          }

          this.isLoading = false;
          this.actionSetIsLoading(false);
          return;
        },
        fail: error => {
          if (error && error.data && error.data.msg) {
            this.actionSetGlobalMessage({
              msg: error.data.msg,
              code: error.data.code,
              origin: "withdraw"
            });

            this.errTips = error.data.msg;
            this.errCode = error.data.code;
          }

          if (error && error.data && error.data.code === "M500001") {
            window.location.reload();
          }

          this.isLoading = false;
          this.actionSetIsLoading(false);
        }
      });
    },
    // 取得存/取款加密貨幣試算金額
    convertCryptoMoney() {
      let _params = {
        type: 2,
        amount: this.actualMoneyPlusOffer()
      };

      if (
        this.selectedCard.bank_id === 2009 &&
        this.withdrawCurrency.method_id === 28
      ) {
        _params = {
          ..._params,
          method_id: this.withdrawCurrency.method_id
        };
      }

      return axios({
        method: "get",
        url: API_CRYPTO_MONEY,
        params: {
          ..._params
        }
      })
        .then(response => {
          const { result, ret, msg, code } = response.data;
          if (!response || result !== "ok") {
            this.actionSetGlobalMessage({
              msg,
              code
            });
            return;
          }

          this.cryptoMoney = ret.crypto_amount;
          this.isClickCoversionBtn = true;
          this.countdownSec = this.countdownSec ? this.countdownSec : ret.ttl;

          // 僅限按下按鈕觸發，@input & @blur 皆不會觸發
          if (this.countdownSec && !this.timer) {
            this.timer = setInterval(() => {
              if (this.countdownSec === 0) {
                // 將「confirmOneBtn」彈窗打開
                this.setPopupStatus(true, "funcTips");

                this.confirmPopupObj = {
                  title: ["porn1", "sg1"].includes(this.themeTPL)
                    ? "汇率已失效"
                    : "汇率已失效，请再次确认汇率",
                  btnText: "刷新汇率",
                  cb: () => {
                    this.convertCryptoMoney();
                    this.closePopup();
                  }
                };

                this.resetTimerStatus();
                this.cryptoMoney = "--";
                return;
              }
              this.countdownSec -= 1;
            }, 1000);
          }
        })
        .catch(error => {
          const { msg, code } = error.response.data;
          this.actionSetGlobalMessage({
            msg,
            code
          });
        });
    },
    resetTimerStatus() {
      clearInterval(this.timer);
      this.timer = null;
      this.countdownSec = 0;
      this.isClickCoversionBtn = false;
    },
    formatCountdownSec() {
      let minutes = Math.floor(this.countdownSec / 60);
      let sec = this.countdownSec - minutes * 60;

      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (sec < 10) {
        sec = "0" + sec;
      }

      return `${minutes}:${sec}`;
    },
    parseCardName(value, withdrawType) {
      let result = "";
      // 109/09/22 卡片統一:前4码 + 中间8个* + 最后4码
      result =
        value.substring(0, value.indexOf("-") + 5) +
        " **** **** " +
        value.substr(-4);

      // switch (withdrawType) {
      //   // 银行卡：12个* + 最后4码
      //   case "account_id":
      //     result =
      //       value.substring(0, value.indexOf("-") + 1) +
      //       "************" +
      //       value.substr(-4);
      //     break;
      //   // 数字货币：前4码 + 中间8个*  + 最后4码
      //   default:
      //     result =
      //       value.substring(0, value.indexOf("-") + 5) +
      //       "********" +
      //       value.substr(-4);
      //     break;
      // }
      return result;
    },
    getBounsAccount() {
      // 紅利帳戶
      axios.get("/api/v1/c/gift-card").then(response => {
        if (response.data.result === "ok") {
          this.bonus = response.data.total;
        }
      });
    },
    setWithdrawCurrency(item) {
      this.withdrawCurrency.method_id = item.method_id;
      this.withdrawCurrency.name = item.currency_name;
      this.withdrawCurrency.alias = item.currency_alias;

      // 選項停留在 USDT 時，不執行重新刷新匯率動作
      if (this.isSelectedUSDT && this.isClickCoversionBtn) {
        return;
      }

      this.resetTimerStatus();
      this.cryptoMoney = "--";
      this.closePopup();
    },
    setPopupStatus(isShow, type) {
      this.showPopStatus = {
        isShow,
        type
      };
    },
    offer() {
      let bonusOffer = Math.round(
        (this.selectedCard.offer_percent * this.withdrawValue) / 100
      );

      switch (true) {
        case !+this.withdrawValue:
          return "--";
          break;

        case this.selectedCard.offer_percent === "0" || bonusOffer <= 0:
          return 0;
          break;

        case bonusOffer >= this.selectedCard.offer_limit &&
          this.selectedCard.offer_limit !== "0":
          return this.selectedCard.offer_limit;
          break;

        default:
          return bonusOffer;
          break;
      }
    },
    actualMoneyPlusOffer() {
      if (this.actualMoney) {
        this.verification("withdrawValue", this.withdrawValue);
      }

      // 有取款優惠金額 && 實際提現金額 > 0
      if (+this.offer() && this.actualMoney > 0) {
        return Number(+this.actualMoney + +this.offer()).toFixed(2);
      } else {
        return this.actualMoney.toFixed(2);
      }
    },
    handleServiceMain(target) {
      // 現在當地時間的"時區"
      const now_timezone = Vue.moment(new Date()).utcOffset() / 60;

      // 取得結束日期的"時區"
      const target_timezone = Vue.moment(target.end_at).utcOffset() / 60;

      let timezone = null;
      let formatDate = null;

      if (now_timezone === target_timezone) {
        timezone = now_timezone;
        formatDate = Vue.moment(target.end_at).format("YYYY-MM-DD HH:mm:ss");
      } else {
        timezone = now_timezone - target_timezone;
        formatDate = Vue.moment(target.end_at)
          .add(timezone, "hours")
          .format("YYYY-MM-DD HH:mm:ss");
      }

      const type =
        target.service === "player_deposit_and_withdraw"
          ? "存款与取款"
          : target.service === "player_withdraw"
          ? "取款"
          : "";

      this.setPopupStatus(true, "funcTips");
      this.confirmPopupObj = {
        title: "系统讯息",
        content: `
          <div style="font-size: 16px;">${type}功能 目前进行维护中，如有不便之处，敬请见谅!</div>
          <br />
          <div>预计完成：当地时间(GMT${timezone > 0 ? "+" : "-"}${
          Math.abs(timezone) > 10
            ? Math.abs(timezone)
            : "0" + Math.abs(timezone)
        }:00)</div>
          <span style="margin-left: 30%">${formatDate}</span>
          `,
        btnText: "返回我的",
        cb: () => {
          this.closePopup();
          this.$router.push("/mobile/mcenter");
        }
      };
    }
  },
  destroyed() {
    this.resetTimerStatus();
  }
};
</script>

<style lang="scss" src="../css/index.module.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="../css/sg1.module.scss" module="$style_sg1"></style>
