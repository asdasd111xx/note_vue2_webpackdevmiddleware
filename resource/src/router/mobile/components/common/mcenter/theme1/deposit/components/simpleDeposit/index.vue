<template>
  <div :class="[$style['mode-wrap']]">
    <div :class="[$style['header-wrap']]">
      <marquee
        v-if="marqueeList && marqueeList.length > 0 && isDoneMarquee"
        :list="marqueeList"
        :titleList="marqueeTitle"
        :origin="'deposit'"
      />
    </div>

    <div
      v-if="depositData.length > 0 && submitStatus === 'stepOne'"
      :class="$style['deposit-edit-wrap']"
    >
      <template v-if="depositData.length > 0">
        <div :class="$style['bank-card-wrap']">
          <!-- 支付方式 -->
          <div :class="[$style['feature-wrap'], 'clearfix']">
            <div :class="$style['feature-title']">支付方式</div>

            <div :class="[$style['pay-mode-item-wrap'], 'clearfix']">
              <div
                v-for="(info, index) in depositData"
                :key="`pay-mode-${info.id}`"
                :class="[
                  $style['pay-mode-item'],
                  {
                    [$style['is-current']]: simpleCurPayInfo.id === info.id
                  }
                ]"
                @click="changeSimplePayMode(info, index)"
              >
                <template v-if="info.id !== 26987">
                  <img
                    v-if="tagTrans[info.tag]"
                    :src="
                      $getCdnPath(
                        `/static/image/common/mcenter/deposit/icon_${
                          tagTrans[info.tag]
                        }.png`
                      )
                    "
                    :class="$style['pay-mode-tag']"
                  />
                  <img
                    v-lazy="getImg(info.image_url)"
                    :class="$style['pay-mode-img']"
                  />

                  <div :class="$style['pay-main-title']">
                    {{ info.name }}
                  </div>

                  <img
                    v-if="simpleCurPayInfo.id === info.id"
                    :class="$style['pay-active']"
                    :src="$getCdnPath(`/static/image/common/select_active.png`)"
                  />
                </template>
                <!-- 客製額度轉帳入口 -->
              <template v-else 
                @click="handleCreditTrans">
                  <div :class="[$style['pay-sub-title'], $style['custom']]">
                    代收代付
                  </div>
                  <div
                    :class="[$style['pay-sub-title'], $style['custom']]"
                    style="color: black"
                  >
                    代理分红
                  </div>
              </template>
              </div>
            </div>
          </div>
          <template v-if="simplePayType.method_id !== 20">
            <!-- 選擇銀行 or 選擇點卡 -->
            <div
              v-if="simpleCurPayInfo.banks && simpleCurPayInfo.banks.length > 0"
              :class="[
                $style['feature-wrap'],
                $style['select-card-wrap'],
                'clearfix'
              ]"
              @click="setPopupStatus(true, 'showBank')"
            >
              <span :class="$style['select-bank-title']"
                >{{
                  simplePayType.method_id === 2
                    ? $text("S_SELECT_POINT_CARD", "请选择点卡")
                    : $text("S_SELECT_BANKS", "请选择银行")
                }}
              </span>

              <div :class="$style['select-bank-item']">
                {{ simplePayBank.name }}
              </div>

              <img
                :class="$style['select-bank-icon']"
                :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
              />
            </div>
            <!-- 幣別 -->
            <div
              v-if="simpleCurPayInfo.content.length > 1"
              :class="[$style['feature-wrap'], 'clearfix']"
            >
              <div :class="$style['bank-feature-wrap']">
                <div
                  v-for="info in simpleCurPayInfo.content"
                  :key="info.currency"
                  :class="[
                    $style['pay-mode-pass'],
                    {
                      [$style['current-data']]:
                        info.currency === simpleCurrency.currency
                    }
                  ]"
                  @click="changeSimpleCurrency(info)"
                >
                  {{ info.currency }}
                  <img
                    v-if="info.currency === simpleCurrency.currency"
                    :class="$style['pay-active']"
                    :src="$getCdnPath(`/static/image/common/select_active.png`)"
                  />
                </div>
              </div>
            </div>
            <!-- 類型 -->
            <div
              v-if="simpleCurrency.data.length > 1"
              :class="[$style['feature-wrap'], 'clearfix']"
            >
              <div :class="$style['bank-feature-wrap']">
                <div
                  v-for="data in simpleCurrency.data"
                  :key="data.currency"
                  :class="[
                    $style['pay-mode-pass'],
                    {
                      [$style['current-data']]:
                        data.method_id === simplePayType.method_id
                    }
                  ]"
                  @click="changeSimplePayType(data)"
                >
                  {{ data.method_name }}
                  <img
                    v-if="data.method_id === simplePayType.method_id"
                    :class="$style['pay-active']"
                    :src="$getCdnPath(`/static/image/common/select_active.png`)"
                  />
                </div>
              </div>
            </div>
            <!-- 通道 -->
            <div
              v-if="
                (simplePayType.channels.length > 0 || simplePayType.tags.length > 0)&&
                !isSelectBindWallet(402) &&
                !isSelectBindWallet(404)
              "
              :class="[$style['feature-wrap'], 'clearfix']"
            >
              <div :class="$style['bank-feature-wrap']">
                <div
                  v-for="(road, index) in simplePayType.channels"
                  :key="road.id"
                  :class="[
                    $style['pay-mode-pass'],
                    { [$style['current-data']]: road.id === simplePayRode.id }
                  ]"
                  @click="changeSimpleRoad(road)"
                >
                  {{ `通道${index + 1}` }}
                  <img
                    v-if="tipTrans[road.display_tag]"
                    :src="
                      $getCdnPath(
                        `/static/image/common/mcenter/deposit/icon_${
                          tipTrans[road.display_tag]
                        }.png`
                      )
                    "
                    :class="$style['pay-mode-tag']"
                  />
                  <img
                    v-if="road.id === simplePayRode.id"
                    :class="$style['pay-active']"
                    :src="$getCdnPath(`/static/image/common/select_active.png`)"
                  />
                </div>
                <div
                  v-for="road in simplePayType.tags"
                  :key="road.id"
                  :class="[
                    $style['pay-mode-pass'],
                    { [$style['current-data']]: road.id === simplePayRode.id }
                  ]"
                  @click="changeSimpleRoad(road)"
                >
                  {{ road.name === "" ? "其他" :tipTransName[road.name] }}
                  <img
                    v-if="road.id === simplePayRode.id"
                    :class="$style['pay-active']"
                    :src="$getCdnPath(`/static/image/common/select_active.png`)"
                  />
                </div>
              </div>
              <div
                v-if="
                  simplePayType.channels.length > 0 && simplePayRode.tip != ''
                "
                :class="[
                  $style['pass-road-text'],
                  [
                    simplePayRodeTipTextShowMore
                      ? [$style['pay-mode-tip-show']]
                      : [$style['pay-mode-tip-close']]
                  ]
                ]"
              >
                <div
                  :class="[$style['pay-mode-tip'], $style[themeTPL]]"
                  v-html="simplePayRodeTipText"
                ></div>
              </div>
            </div>
            <div
                v-if="
                  simplePayType.channels.length > 0 &&
                  simplePayRode.tip != '' &&
                    !isSelectBindWallet(402) &&
                    !isSelectBindWallet(404)
                "
                @click="
                  simplePayRodeTipTextShowMore = !simplePayRodeTipTextShowMore
                "
                :class="$style['show-more-header']"
              >
                <span>通道提示详情</span>
                <div
                  :class="[
                    $style['collapse-img'],
                    { [$style.active]: simplePayRodeTipTextShowMore }
                  ]"
                />
              </div>

            <template v-if="simplePayType.method_id !== 20">
              <!-- 充值人姓名 -->
              <div
                v-if="simplePayType.method_id === 6"
                :class="$style['depositName-wrap']"
              >
                <div
                  :key="`field-depositName`"
                  :class="[
                    $style['speed-field-name'],
                    { [$style.error]: !speedName },
                    'clearfix'
                  ]"
                >
                  <div :class="$style['field-title']">
                    {{ this.$text("S_DEPOSIT_NAME", "请充值人姓名") }}
                  </div>

                  <div :class="$style['field-info']">
                    <input
                      v-model="speedName"
                      :class="$style['speed-deposit-input']"
                      :placeholder="$text('S_ENTER_DEPOSIT_NAME', '请输入充值人姓名')"
                      @input="
                        verification(
                          'depositName',
                          $event.target.value,
                          true
                        )
                      "
                    />
                  </div>
                </div>
                <div
                  :class="[
                    $style['deposit-name-messgae'],
                    {
                      [$style['hide']]: !nameCheckFail && speedName
                    }
                  ]"
                >
                  为即时到帐，请务必输入正确的汇款人姓名
                </div>
              </div>
              <!-- e點富銀行 -->
              <div
                v-if="
                  isSelectBindWallet(34, 41) && this.simplePayType.is_bind_wallet
                "
                :class="[
                  $style['feature-wrap'],
                  $style['select-card-wrap'],
                  'clearfix'
                ]"
                @click="setPopupStatus(true, 'epointBank')"
              >
                <span :class="$style['select-bank-title']">
                  挂单银行
                </span>
                <div :class="$style['select-epoint-bank-item']">
                  {{ defaultEpointWallet.account }}
                </div>
                <img
                  :class="$style['select-bank-icon']"
                  :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
                />
              </div>
              <div
                v-if="
                  isSelectBindWallet(34, 41) &&
                    simplePayType.is_bind_wallet &&
                    showEpointWalletAddress
                "
                :class="[
                  $style['feature-wrap'],
                  $style['select-card-wrap'],
                  'clearfix'
                ]"
              >
                <div :class="$style['other-bank-input-text']">
                  银行名称
                  <input
                    v-model="epointBankName"
                    :class="$style['input-cgpay-address']"
                    type="text"
                    :placeholder="'请输入银行名称'"
                    @input="verification('order-bank', $event.target.value)"
                  />
                </div>
                <div :class="[$style['other-bank-input-text'], $style['border']]">
                  银行帐号
                  <input
                    v-model="epointBankAccount"
                    :class="$style['input-cgpay-address']"
                    type="text"
                    :placeholder="'请输入银行卡号/钱包'"
                    @input="
                      verification('order-bank-account', $event.target.value)
                    "
                  />
                </div>
                <div :class="[$style['wallet-address-text'], $style['less']]">
                  为即时到帐，请务必输入正确的银行资讯
                </div>
              </div>

              <!-- 尚未綁定 CGPay(16) || CGPay-USDT(25,30) || OSPay(36) || OSPay-USDT(37,38) ||購寶(22) || USDT(402) || E点付(34,41)-->
              <div
                v-if="
                  ['porn1', 'sg1'].includes(themeTPL) &&
                    isSelectBindWallet() &&
                    !this.simplePayType.is_bind_wallet
                "
                :class="[$style['feature-wrap'], 'clearfix']"
              >
                <!-- Yabo: 尚未綁定直接跳轉到添加卡片頁面 -->
                <span :class="[$style['bank-card-title'], $style['no-margin']]">
                  <!-- <template v-if="cgPromotionMessage">
                    充值前请先绑定钱包
                  </template> -->
                  <template v-if="isSelectBindWallet(32)">
                    充值前请先绑定{{ simpleCurPayInfo.name }}
                  </template>
                  <template v-else-if="isSelectBindWallet(34, 41)">
                    充值前请先绑定{{ simpleCurPayInfo.name }}钱包
                  </template>
                  <template v-else-if="isSelectBindWallet(16, 25, 30)">
                    充值前请先绑定CGPay钱包
                  </template>
                  <template v-else-if="isSelectBindWallet(36, 37, 38)">
                    充值前请先绑定OSPay钱包
                  </template>
                  <template v-else>
                    充值前请先绑定{{ simpleCurPayInfo.name }}帐号
                  </template>

                  <div :class="$style['no-bind-wallet']">
                    <span @click="handleBindWallet">立即绑定</span>
                  </div>

                  <!-- <div
                    v-if="isSelectBindWallet(16) && cgPromotionMessage"
                    :class="$style['cgpay-promotion']"
                  >
                    {{ cgPromotionMessage }}
                  </div> -->
                </span>
              </div>

              <!-- CGPay/OSPay 餘額 -->
              <div
                v-if="
                  ['porn1', 'sg1'].includes(themeTPL) &&
                    isSelectBindWallet(16, 36) &&
                    simplePayType.is_bind_wallet
                "
                :class="[$style['feature-wrap'], 'clearfix']"
              >
                <span :class="$style['bank-card-title']">
                  {{ isSelectBindWallet(36) ? "OS" : "CG" }}币余额
                  <img
                    :class="$style['CGPay-update-img']"
                    :src="$getCdnPath(`/static/image/common/btn_update.png`)"
                    alt="update"
                    @click="getCGPayBalance"
                  />
                </span>

                <div :class="$style['CGPay-money']">
                  {{ isSelectBindWallet(36) ? "OS" : "CG" }}P
                  <span v-if="isSelectBindWallet(36)">
                    {{
                      walletData["OSPay"].balance !== undefined
                        ? formatThousandsCurrency(walletData["OSPay"].balance)
                        : "--"
                    }}
                  </span>
                  <span v-else>
                    {{
                      walletData["CGPay"].balance !== undefined
                        ? formatThousandsCurrency(walletData["CGPay"].balance)
                        : "--"
                    }}
                  </span>
                </div>
              </div>

              <div
                v-if="
                  isSelectBindWallet(25, 30, 37, 38, 402, 404) &&
                    this.simplePayType.is_outer_crypto &&
                    this.simplePayType.is_bind_wallet
                "
                :class="[
                  $style['feature-wrap'],
                  $style['select-card-wrap'],
                  'clearfix'
                ]"
              >
                <span :class="$style['select-bank-title']">
                  您的位址
                </span>
                <select
                  v-model="defaultOuterCrypto"
                  :class="$style['outer-crypto-selected']"
                >
                  <option
                    v-for="(option, idx) in outerCryptoOption"
                    :key="idx"
                    v-bind:value="option"
                  >
                    {{ option }}
                  </option>
                </select>
              </div>
              <div
                v-if="showOuterCryptoAddress"
                :class="[
                  $style['feature-wrap'],
                  $style['select-card-wrap'],
                  'clearfix'
                ]"
              >
                钱包位址
                <input
                  v-model="outerCryptoAddress"
                  :class="$style['input-cgpay-address']"
                  type="text"
                  :placeholder="'请输入钱包位址'"
                />
                <div :class="$style['wallet-address-text']">
                  为即时到帐，请务必输入正确的钱包位址
                </div>
              </div>
              <div
                v-if="isSelectBindWallet(32) && this.simplePayType.is_bind_wallet"
                :class="[$style['feature-wrap'], $style['bc-coint']]"
                @click="setPopupStatus(true, 'bcWalletCurrency')"
              >
                <div>充值币种</div>
                <div
                  v-if="selectBcCoin && selectBcCoin.balance > 0"
                  :class="[$style['coin-money']]"
                >
                  {{
                    `${formatThousandsCurrency(selectBcCoin.balance)} ${
                      selectBcCoin.currency
                    }`
                  }}
                </div>
                <div v-else :class="[$style['coin-money']]">--</div>
                <img :src="$getCdnPath(`/static/image/common/arrow_next.png`)" />
              </div>

              <!-- 存款金額 -->
              <!-- 出現條件：選擇需要绑定的錢包且已綁定 || 選非綁定錢包的支付方式 -->
              <div
                v-if="
                  (isSelectBindWallet() && simplePayType.is_bind_wallet) ||
                    !isSelectBindWallet()
                "
                :class="[
                  $style['feature-wrap'],
                  $style['select-money'],
                  'clearfix'
                ]"
              >
                <div :class="$style['bank-card-title']">充值金额</div>
                <!-- 選擇金額區塊 -->
                <!-- <div
                  v-if="simplePayFeeData.is_recommend_amount"
                  :class="[$style['speed-money-wrap'], 'clearfix']"
                >
                  <div
                    v-for="(item, index) in simplePayFeeData.amounts"
                    :key="`pay-money-${index}`"
                    :class="[
                      $style['pay-money-item'],
                      $style[siteConfig.ROUTER_TPL],
                      { [$style['is-current']]: moneyValue === item }
                    ]"
                    @click="() => {
                        changeSimpleMoney(item);
                        if (
                          isSelectBindWallet(25, 30, 37, 38, 32, 402, 404) &&
                          isClickCoversionBtn &&
                          moneyValue > 0
                        ) {
                          convertCryptoMoney();
                        }
                      }"
                  >
                    ¥ {{ formatThousandsCurrency(item) }}
                    <img
                      v-if="moneyValue === item"
                      :class="$style['pay-active']"
                      :src="$getCdnPath(`/static/image/common/select_active.png`)"
                    />
                  </div> -->

                <!-- 自訂金額 -->
                <!-- <div
                    v-if="simplePayFeeData &&
                        simplePayFeeData.is_custom_amount &&
                        simplePayFeeData.amounts.length > 0"
                    :class="[$style['speed-money-wrap'], 'clearfix']"
                  >
                    <div
                      :class="[
                        $style['pay-money-item'],
                        $style['custom-item'],
                        { [$style['is-current']]: isSelectedCustomMoney }
                      ]"
                      @click="
                        () => {
                          changeSimpleMoney('', true);
                          if (
                            isSelectBindWallet(25, 30, 37, 38, 32, 402, 404) &&
                            isClickCoversionBtn &&
                            moneyValue > 0
                          ) {
                            convertCryptoMoney();
                          }
                        }
                      "
                    >
                      <span> 其他金额 </span>
                      <br />
                      <span>
                        ({{
                          getSampleSingleLimit(
                            simplePayFeeData.per_trade_min,
                            simplePayFeeData.per_trade_max
                          )
                        }})
                      </span>
                      <img
                        v-if="isSelectedCustomMoney"
                        :class="$style['pay-active']"
                        :src="$getCdnPath(`/static/image/common/select_active.png`)"
                      />
                    </div>
                  </div>
                </div> -->
                <!-- 金額輸入欄 -->
                <div
                  v-if="simplePayFeeData.is_custom_amount"
                  :class="[
                    $style['feature-deposit-wrap'],
                    {
                      [$style['hidden']]:
                        simplePayFeeData.is_custom_amount &&
                        moneyValue &&
                        isDisableDepositInput
                    }
                  ]"
                >
                  <div class="money-input-wrap">
                    <input
                      v-model="displayMoneyValue"
                      :class="[
                        $style['deposit-input'],
                        {
                          [$style.disable]: isDisableDepositInput
                        }
                      ]"
                      :placeholder="
                        getSampleSingleLimit(
                          simplePayFeeData.per_trade_min,
                          simplePayFeeData.per_trade_max,
                          'placeholder'
                        )
                      "
                      type="text"
                      inputmode="decimal"
                      @blur="
                        $event => {
                          verification('money', $event.target.value);
                          if (
                            isSelectBindWallet(25, 30, 37, 38, 32, 402, 404) &&
                            isClickCoversionBtn &&
                            moneyValue
                          ) {
                            convertCryptoMoney();
                          }
                        }
                      "
                      @input="verification('money', $event.target.value)"
                      @keyup="
                        $event => {
                          if (
                            isSelectBindWallet(25, 30, 37, 38, 32, 402, 404) &&
                            isClickCoversionBtn &&
                            moneyValue
                          ) {
                            moneyUSDT($event);
                          }
                        }
                      "
                    />
                  </div>
                  <span :class="$style['deposit-input-icon']">¥</span>
                </div>

                <!-- 金額錯誤訊息 -->
                <div v-if="isErrorMoney" :class="$style['money-input-tip']">
                  {{
                    getSampleSingleLimit(
                      simplePayFeeData.per_trade_min,
                      simplePayFeeData.per_trade_max,
                      "placeholder"
                    )
                  }}
                </div>

                <!-- USDT 匯率試算 -->
                <template v-if="isSelectBindWallet(25, 30, 37, 38, 402, 404)">
                  <div :class="$style['crypto-block']">
                    <span>转入数量</span>
                    <div :class="[$style['content']]">
                      <span
                        :class="[
                          $style['no-money'],
                          { [$style['money']]: cryptoMoney > 0 }
                        ]"
                      >
                        <span
                          :class="[{ [$style['crypto-money']]: cryptoMoney > 0 }]"
                        >
                          {{ formatThousandsCurrency(cryptoMoney) }}
                        </span>
                        <span>
                          {{ simpleCurrency.currency }}
                        </span>
                      </span>
                    </div>
                  </div>
                  <!-- 參考匯率 -->
                  <div :class="$style['exchange-rate']">
                    <span>参考汇率 </span>
                    <div :class="[$style['content']]">
                      <span :class="[$style['rate']]"
                        >1 USDT ≈ {{ rate }} CNY (
                        <span :class="[$style['time']]">{{ timeUSDT() }}</span>
                        后更新 )</span
                      >
                    </div>
                  </div>
                </template>
                <!-- 幣希 匯率試算 -->
                <template v-if="isSelectBindWallet(32)">
                  <div :class="$style['crypto-block']">
                    <span>转入数量</span>
                    <div :class="[$style['content']]">
                      <span
                        :class="[
                          $style['no-money'],
                          { [$style['money']]: cryptoMoney > 0 }
                        ]"
                      >
                        <span
                          :class="[{ [$style['crypto-money']]: cryptoMoney > 0 }]"
                        >
                          {{ formatThousandsCurrency(cryptoMoney) }}
                        </span>
                        <span>
                          {{ selectBcCoin.currency }}
                        </span>
                      </span>
                    </div>
                  </div>
                  <!-- 參考匯率 -->
                  <div :class="$style['exchange-rate']">
                    <span>参考汇率 </span>
                    <div :class="[$style['content']]">
                      <span :class="[$style['rate']]"
                        >1 {{ selectBcCoin.currency }} ≈ {{ rate }} CNY (
                        <span :class="[$style['time'], $style[themeTPL]]">{{
                          timeUSDT()
                        }}</span>
                        后更新 )</span
                      >
                    </div>
                  </div>
                </template>
              </div>

              <!-- 驗證方式 -->
              <!-- If 選擇 CGPay且已綁定 : 顯示 CGPay 餘額 -->
              <div
                v-if="isSelectBindWallet(16) && simplePayType.is_bind_wallet"
                :class="[$style['feature-wrap'], 'clearfix']"
              >
                <span :class="$style['bank-card-title']">验证方式</span>
                <div :class="$style['bank-feature-wrap']">
                  <!-- 支付密碼 -->
                  <div
                    :class="[
                      $style['pay-auth-method'],
                      {
                        [$style['current-data']]: walletData['CGPay'].method === 0
                      },
                      {
                        [$style['disable']]: walletData['CGPay'].balance === '--'
                      }
                    ]"
                    @click="() => (walletData['CGPay'].method = 0)"
                  >
                    CGPay安全防护码
                    <img
                      v-if="walletData['CGPay'].method === 0"
                      :class="$style['pay-active']"
                      :src="$getCdnPath(`/static/image/common/select_active.png`)"
                    />
                  </div>

                  <div
                    :class="[
                      $style['pay-auth-method'],
                      {
                        [$style['current-data']]: walletData['CGPay'].method === 1
                      }
                    ]"
                    @click="walletData['CGPay'].method = 1"
                  >
                    扫码支付
                    <img
                      v-if="walletData['CGPay'].method === 1"
                      :class="$style['pay-active']"
                      :src="$getCdnPath(`/static/image/common/select_active.png`)"
                    />
                  </div>

                  <!-- CGP 安全防護碼 -->
                  <div
                    v-show="walletData['CGPay'].method === 0 && isShowCGPPwd"
                    :class="$style['input-wrap']"
                  >
                    <input
                      id="cgp-password"
                      :class="$style['wallet-password']"
                      v-model="walletData['CGPay'].password"
                      type="text"
                      :placeholder="walletData['CGPay'].placeholder"
                      @input="verification('CGPPwd', $event.target.value)"
                    />
                    <img
                      :src="
                        $getCdnPath(`/static/image/common/login/btn_eye_n.png`)
                      "
                      @click="toggleEye('cg')"
                    />
                  </div>
                  <div
                    v-show="walletData['CGPay'].method === 0 && !isShowCGPPwd"
                    :class="$style['input-wrap']"
                  >
                    <input
                      id="cgp-password"
                      :class="$style['wallet-password']"
                      v-model="walletData['CGPay'].password"
                      type="password"
                      :placeholder="walletData['CGPay'].placeholder"
                      @input="verification('CGPPwd', $event.target.value)"
                    />
                    <img
                      :src="
                        $getCdnPath(`/static/image/common/login/btn_eye_d.png`)
                      "
                      @click="toggleEye('cg')"
                    />
                  </div>
                </div>
              </div>

              <!-- If 選擇 OSPay且已綁定 : 顯示 OSPay 餘額 -->
              <div
                v-if="isSelectBindWallet(36) && simplePayType.is_bind_wallet"
                :class="[$style['feature-wrap'], 'clearfix']"
              >
                <span :class="$style['bank-card-title']">验证方式</span>
                <div :class="$style['bank-feature-wrap']">
                  <!-- 支付密碼 -->
                  <div
                    :class="[
                      $style['pay-auth-method'],
                      {
                        [$style['current-data']]: walletData['OSPay'].method === 0
                      },
                      {
                        [$style['disable']]: walletData['OSPay'].balance === '--'
                      }
                    ]"
                    @click="() => (walletData['OSPay'].method = 0)"
                  >
                    OSPay安全防护码
                    <img
                      v-if="walletData['OSPay'].method === 0"
                      :class="$style['pay-active']"
                      :src="$getCdnPath(`/static/image/common/select_active.png`)"
                    />
                  </div>

                  <div
                    :class="[
                      $style['pay-auth-method'],
                      {
                        [$style['current-data']]: walletData['OSPay'].method === 1
                      }
                    ]"
                    @click="walletData['OSPay'].method = 1"
                  >
                    扫码支付
                    <img
                      v-if="walletData['OSPay'].method === 1"
                      :class="$style['pay-active']"
                      :src="$getCdnPath(`/static/image/common/select_active.png`)"
                    />
                  </div>

                  <!-- OSP 安全防護碼 -->
                  <div
                    v-show="walletData['OSPay'].method === 0 && isShowOSPPwd"
                    :class="$style['input-wrap']"
                  >
                    <input
                      id="osp-password"
                      :class="$style['wallet-password']"
                      v-model="walletData['OSPay'].password"
                      type="text"
                      :placeholder="walletData['OSPay'].placeholder"
                      @input="verification('OSPPwd', $event.target.value)"
                    />
                    <img
                      :src="
                        $getCdnPath(`/static/image/common/login/btn_eye_n.png`)
                      "
                      @click="toggleEye('os')"
                    />
                  </div>
                  <div
                    v-show="walletData['OSPay'].method === 0 && !isShowOSPPwd"
                    :class="$style['input-wrap']"
                  >
                    <input
                      id="osp-password"
                      :class="$style['wallet-password']"
                      v-model="walletData['OSPay'].password"
                      type="password"
                      :placeholder="walletData['OSPay'].placeholder"
                      @input="verification('OSPPwd', $event.target.value)"
                    />
                    <img
                      :src="
                        $getCdnPath(`/static/image/common/login/btn_eye_d.png`)
                      "
                      @click="toggleEye('os')"
                    />
                  </div>
                </div>
              </div>
            </template>

            <!-- 實際到帳 -->
            <!-- 出現條件：選擇需要绑定的錢包且已綁定 || 選非綁定錢包的支付方式 -->
            <div
              v-if="
                (isSelectBindWallet() && simplePayType.is_bind_wallet) ||
                  !isSelectBindWallet()
              "
              :class="$style['money-info-wrap']"
            >
              <span
                v-if="simpleCurrency.currency === '代客充值'"
                :class="$style['feature-tip-title']"
              >
              </span>

              <!-- 109/11/10 實際到帳常註顯示 -->
              <span
                v-else
                :class="[
                  $style['feature-tip-title'],
                  $style[siteConfig.ROUTER_TPL],
                  {
                    [$style['success']]:
                      realSaveMoney &&
                      Number(String(realSaveMoney).replace(/\,/g, '')) > 0
                  }
                ]"
              >
                实际到帐： ¥{{ realSaveMoney }}
                <span
                  v-if="
                    simplePayType.offer_enable && +simplePayType.offer_percent > 0
                  "
                  @click="showRealStatusType(true)"
                >
                  (充值优惠)
                </span>
                <span
                  v-else-if="
                    +simplePayFeeData.fee_percent || +simplePayFeeData.fee_amount
                  "
                  @click="showRealStatusType(true)"
                >
                  (详情)
                </span>
              </span>
            </div>

            <div v-if="showRealStatus" :class="$style['pop-message']">
              <div :class="$style['pop-message-mark']" />
              <div :class="$style['message-container']">
                <ul :class="$style['message-content']">
                  <div :class="$style['message-content-title']">
                    {{
                      offerInfo.offer_enable && +offerInfo.offer_percent > 0
                        ? "充值优惠"
                        : "详情"
                    }}
                  </div>
                  <template
                    v-if="offerInfo.offer_enable && +offerInfo.offer_percent > 0"
                  >
                    <li :class="$style['tip-list']" v-html="promitionText" />
                  </template>
                  <!-- 簡易模式無手續費 -->
                  <!-- <li
                    v-if="
                      +simplePayFeeData.fee_percent || +simplePayFeeData.fee_amount
                    "
                  >
                    • {{ feeText }}
                  </li> -->

                  <li>• 实际存入依审核结果为准</li>
                </ul>
                <div
                  :class="$style['message-close']"
                  @click="showRealStatusType(false)"
                >
                  关闭
                </div>
              </div>
            </div>
          </template>
          <!-- <div>{{`!checkSuccess ${!checkSuccess}`}}</div>
          <div>{{`isBlockChecking ${isBlockChecking}`}}</div>
          <div>{{`nameCheckFail ${nameCheckFail}`}}</div>
          <div>{{`(isSelectBindWallet() && !this.simplePayType.is_bind_wallet) ${(isSelectBindWallet() && !this.simplePayType.is_bind_wallet)}`}}</div>
          <div>{{`(isSelectBindWallet(25, 30, 37, 38, 402, 404) &&
                    !isClickCoversionBtn) ${(isSelectBindWallet(25, 30, 37, 38, 402, 404) &&
                    !isClickCoversionBtn)}`}}</div>
          <div>{{`(isSelectBindWallet(16) &&
                    walletData['CGPay'].method === 0 &&
                    !walletData['CGPay'].password) ${(isSelectBindWallet(16) &&
                    walletData['CGPay'].method === 0 &&
                    !walletData['CGPay'].password)}`}}</div>
          <div>{{`(isSelectBindWallet(36) &&
                    walletData['OSPay'].method === 0 &&
                    !walletData['OSPay'].password) ${(isSelectBindWallet(36) &&
                    walletData['OSPay'].method === 0 &&
                    !walletData['OSPay'].password)}`}}</div>
          <div>{{`(showOuterCryptoAddress && outerCryptoAddress === '') ${(showOuterCryptoAddress && outerCryptoAddress === '')}`}}</div>
          <div>{{`(showEpointWalletAddress &&
                    (epointBankName === '' || epointBankAccount === '')) ${(showEpointWalletAddress &&
                    (epointBankName === '' || epointBankAccount === ''))}`}}</div>
          <div>{{`(isSelectBindWallet(32) &&
                    (cryptoMoney <= 0 || selectBcCoin.balance <= 0)) ${(isSelectBindWallet(32) &&
                    (cryptoMoney <= 0 || selectBcCoin.balance <= 0))}`}}</div> -->

          <!-- Todo: disable 狀態統整 -->
          <div
            :class="[
              $style['pay-button'],
              {
                [$style.disabled]:
                  !checkSuccess ||
                  isBlockChecking ||
                  nameCheckFail ||
                  (isSelectBindWallet() &&
                    !this.simplePayType.is_bind_wallet) ||
                  (isSelectBindWallet(25, 30, 37, 38, 402, 404) &&
                    !isClickCoversionBtn) ||
                  (isSelectBindWallet(16) &&
                    walletData['CGPay'].method === 0 &&
                    !walletData['CGPay'].password) ||
                  (isSelectBindWallet(36) &&
                    walletData['OSPay'].method === 0 &&
                    !walletData['OSPay'].password) ||
                  (showOuterCryptoAddress && outerCryptoAddress === '') ||
                  (showEpointWalletAddress &&
                    (epointBankName === '' || epointBankAccount === '')) ||
                  (isSelectBindWallet(32) &&
                    (cryptoMoney <= 0 || selectBcCoin.balance <= 0))
              }
            ]"
            :title="$text('S_ENTER_PAY', '立即充值')"
            @click="clickSubmit"
          >
            {{ $text("S_ENTER_PAY", "立即充值") }}
          </div>

          <p :class="$style['service-remind']">
            如需帮助，请<span
              :class="$style['service-btn']"
              @click="onClickService"
              >联系客服</span
            >
          </p>

          <!-- 温馨提醒 -->
          <div
            v-if="simpleCurPayInfo.memo"
            :class="[$style['feature-tip-wrap'], 'clearfix']"
          >
            <p :class="$style['warm-tip-title']">
              {{ $text("S_TIPS", "温馨提示") }}
            </p>
            <!-- eslint-disable vue/no-v-html -->
            <div :class="$style['warm-tip']" v-html="simpleCurPayInfo.memo" />
            <!-- eslint-enable vue/no-v-html -->
          </div>
        </div>
      </template>
    </div>

    <deposit-info
      v-if="submitStatus === 'stepTwo'"
      :is-simple-type="true"
      :your-bank-list="[]"
      :order-data="orderData"
      :is-show.sync="isShow"
      :required-fields="simplePayField"
      :submit-status.sync="nowSubmitStatus"
      :limit-time="limitTime"
    />

    <div v-if="isShow" :class="$style['loading-wrap']">
      <div :class="$style['loading-item']">
        <ele-loading />
      </div>
    </div>

    <!-- 彈窗 -->
    <template>
      <!-- 使用銀行/點卡 -->
      <template v-if="showPopStatus.type === 'showBank'">
        <div :class="$style['pop-wrap']">
          <div
            :class="$style['pop-mask']"
            @click.stop="setPopupStatus(false, '')"
          />
          <div :class="$style['pop-menu']">
            <div :class="$style['pop-title']">
              <span @click.stop="setPopupStatus(false, '')">
                {{ $text("S_CANCEL", "取消") }}
              </span>
              选择银行
            </div>

            <ul :class="$style['pop-list']">
              <li
                v-for="item in simpleCurPayInfo.banks"
                :key="item.selectId"
                @click.stop="changeSimplePayBank(item)"
              >
                <img v-lazy="getImg(item.image_url)" />
                {{ item.name }}
                <icon
                  v-if="item.swift_code === simplePayBank.swift_code"
                  :class="[$style['select-active']]"
                  name="check"
                />
              </li>
            </ul>
          </div>
        </div>
      </template>
      <!-- 手動配卡成功彈窗 -->
      <deposit-alert
        :manualcard="manualCard"
        v-if="successAlert"
        :close-fuc="goBack"
      />
      <!-- 使用者存款封鎖狀態 -->
      <template v-if="showPopStatus.type === 'blockStatus'">
        <div>
          <div :class="$style['pop-message-mark']" />
          <div :class="$style['entry-message-container']">
            <div :class="$style['entry-message-content']">
              <p>{{ $text("S_TIPS", "温馨提示") }}</p>
              <div>
                {{ statusText }}
              </div>
            </div>
            <ul :class="[$style['entry-message-confirm']]">
              <li @click="submitInfo(true)">确定</li>
              <!-- has_csr: 是否啟用代客充值 -->
              <li v-if="entryBlockStatusData.has_csr" @click="goToValetDeposit">
                代客充值
              </li>
            </ul>
          </div>
        </div>
      </template>

      <!-- 被列為黑名單提示 -->
      <template v-if="showPopStatus.type === 'blockTips'">
        <block-list-tips type="deposit" @close="closePopup" />
      </template>

      <!-- 綁定錢包 Qrocde -->
      <template v-if="showPopStatus.type === 'qrcode'">
        <popup-qrcode
          :virtualBankId="qrcodeObj.bank_id"
          :bindType="qrcodeObj.bind_type"
          @close="closePopup"
        />
      </template>

      <!-- 綁定電子錢包 -->
      <template v-if="showPopStatus.type === 'bindWallet'">
        <bind-wallet-popup
          :walletType="bindWalletType"
          :eyBindWalletData="eyBindWalletData"
          @close="closePopup"
        />
      </template>
      <template v-if="showPopStatus.type === 'epointBank'">
        <epoint-bank-popup
          :bank-selected="defaultEpointWallet"
          :bank-list="userBankOption"
          :item-func="setEpointBank"
          :orderCardList="orderCardList"
          :open-type="'deposit'"
          @close="closePopup"
        />
      </template>
      <template v-if="showPopStatus.type === 'bcWalletCurrency'">
        <bc-wallet-currency-popup
          :open-type="`deposit`"
          :currency-data="bcCurrencyData"
          :item-func="setBcCurrency"
          :open-wallet-popup="openBCWalletPopup"
          @close="closePopup"
        />
      </template>
      <bc-wallet-popup
        v-if="showPopStatus.type === 'bcWalletPopup'"
        :currency-data="bcCurrencyData"
        :reload-money="getWalletCurrencyBalanceList"
        @close="closePopup"
      />

      <!-- 支付成功 || 刷新匯率 || 維護彈窗 -->
      <template v-if="showPopStatus.type === 'funcTips'">
        <confirm-one-btn :data="confirmPopupObj" @close="confirmPopupObj.cb" />
      </template>
    </template>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapActions } from "vuex";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import blockListTips from "@/router/mobile/components/tpl/porn1/components/common/blockListTips";
import bindWalletPopup from "@/router/mobile/components/tpl/porn1/components/common/bindWalletPopup";
import epointBankPopup from "@/router/mobile/components/tpl/porn1/components/common/epointBankPopup";
import bcWalletCurrencyPopup from "@/router/mobile/components/tpl/porn1/components/common/bcWalletCurrencyPopup";
import DatePicker from "vue2-datepicker";
import mixin from "@/mixins/mcenter/deposit/bankCardDeposit";
import popupQrcode from "@/router/mobile/components/common/virtualBank/popupQrcode";
import confirmOneBtn from "@/router/mobile/components/common/confirmOneBtn";
import marquee from "@/router/mobile/components/common/marquee/marquee";
import goLangApiRequest from "@/api/goLangApiRequest";
import bcWalletPopup from "@/router/mobile/components/tpl/porn1/components/mcenter/components/wallet/components/bcWalletPopup";
import { sendUmeng } from "@/lib/sendUmeng";
import axios from "axios";
import {
  API_CRYPTO_MONEY,
  API_MCENTER_DEPOSIT_OUTER_WALLET,
  API_TRADE_RELAY
} from "@/config/api";
import { getCookie } from "@/lib/cookie";

export default {
  components: {
    depositInfo: () =>
      import(
        /* webpackChunkName: 'depositInfo' */ "../bankCardDeposit/components/depositInfo"
      ),
    eleLoading: () =>
      import(
        /* webpackChunkName: 'eleLoading' */ "@/router/web/components/tpl/common/element/loading/circle"
      ),
    depositAlert: () =>
      import(
        /* webpackChunkName: 'depositAlert' */ "../bankCardDeposit/components/depositAlert"
      ),
    Swiper,
    SwiperSlide,
    DatePicker,
    blockListTips,
    bindWalletPopup,
    epointBankPopup,
    bcWalletCurrencyPopup,
    popupQrcode,
    confirmOneBtn,
    marquee,
    bcWalletPopup
  },
  mixins: [mixin],
  props: {
    headerSetting: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      submitStatus: "stepOne",
      paySelectType: "",
      categoryOptions: {
        slidesPerView: "auto"
      },
      initHeaderSetting: {},
      tagTrans: { 2: "general", 3: "recommend", 4: "speed" },
      tipTrans: {
        HOT: "recommend",
        EVENT: "event",
        FAST: "speed",
        HIGH: "high",
        LOW: "low"
      },
      tipTransName: {
        HOT: "推荐",
        EVENT: "活动",
        FAST: "极速",
        HIGH: "大额",
        LOW: "小额",
      },

      nameCheckFail: false,

      entryBlockStatusData: null,
      isBlockChecking: false,

      bindWalletType: "CGPay",
      eyBindWalletData: {},

      // 彈窗參數(待之後整理)
      showRealStatus: false,
      isShowMethodsPop: false,
      isDoneMarquee: false,

      // 彈窗顯示狀態統整
      showPopStatus: {
        isShow: false,
        type: ""
      },

      qrcodeObj: {
        isShow: false,
        bank_id: null,
        bind_type: "deposit"
      },

      confirmPopupObj: {
        title: "",
        content: "",
        cb: () => {}
      },

      marqueeList: [],
      displayMoneyValue: "",
      isShowCGPPwd: false,
      isShowOSPPwd: false,
      bcMoneyShowType: false,

      simplePayRodeTipText: "",
      simplePayRodeTipTextShowMore: true,
      simpleCurPayInfo: {},
      simplePayBank: {},
      simpleCurrency: {},
      simplePayType: {},
      simplePayRode: {},
      simplePayFeeData: {
        amounts: "",
        fee_amount: "",
        fee_percent: "",
        is_custom_amount: "",
        is_recommend_amount: "",
        per_trade_max: "",
        per_trade_min: ""
      },
      simplePayField: [],
      newWindow:"",
      speedName:""
    };
  },
  watch: {
    simplePayType() {
      console.log("simplePayType", this.simplePayType);
      this.simplePayRodeTipText = "";
      this.showEpointWalletAddress = this.isSelectBindWallet(34, 41)
        ? this.defaultEpointWallet.account === "新增挂单银行卡"
        : false;
      // 選到 CGPay 時，取得 CGPay balance 的 func
      if (this.isSelectBindWallet(16, 36)) {
        this.getCGPayBalance();
      }
    },
    simplePayRode() {
      console.log("simplePayRode", this.simplePayRode);
      if (this.simplePayRode !== null && this.simplePayRode.tip != undefined) {
        if (this.simplePayRode.tip === "" && this.simplePayRodeTipText != "") {
          //有到無因特效需delay
          setTimeout(() => {
            this.simplePayRodeTipText = this.simplePayRode.tip.replace(
              "\n",
              "<br>"
            );
          }, 500);
        } else {
          this.simplePayRodeTipText = this.simplePayRode.tip.replace(
            "\n",
            "<br>"
          );
        }
      }
    },
    noticeData() {
      if (this.noticeData && this.noticeData.length > 0) {
        let data = this.noticeData[0];

        // event => 掃 QRcode 綁定錢包
        if (data.event === "trade_bind_wallet" && data.result === "ok") {
          this.noticeData.pop();
          this.actionSetGlobalMessage({
            msg: "绑定成功",
            cb: () => {
              // this.qrcodeObj.isShow = false;
              // this.closePopup();
              window.location.reload();
            }
          });
        }
      }
    },
    "walletData.CGPay.balance"(value) {
      switch (value) {
        // 尚未得到值時，選擇改為"掃碼支付"(同Android邏輯)
        case "--":
          this.walletData["CGPay"].method = 1;
          break;

        // 正常得到值時，選擇改為"CGP支付密碼"
        default:
          this.walletData["CGPay"].method = 0;
          break;
      }
    },
    "walletData.OSPay.balance"(value) {
      switch (value) {
        // 尚未得到值時，選擇改為"掃碼支付"(同Android邏輯)
        case "--":
          this.walletData["OSPay"].method = 1;
          break;

        // 正常得到值時，選擇改為"CGP支付密碼"
        default:
          this.walletData["OSPay"].method = 0;
          break;
      }
    },
    announcementList(val) {
      this.marqueeList = val;
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      rechargeConfig: "getRechargeConfig",
      noticeData: "getNoticeData",
      announcementList: "getAnnouncementList"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    /**
     * 金額是否輸入錯誤
     * @return Boolean
     */
    nowSubmitStatus: {
      get() {
        return this.submitStatus;
      },
      set(value) {
        if (value === "stepOne") {
          this.$emit("update:headerSetting", this.initHeaderSetting);
          this.resetStatus();
          this.getSimplePaymentGroups();
        }

        this.submitStatus = value;
        this.moneyValue = "";
        this.displayMoneyValue = "";
        this.isErrorMoney = false;
      }
    },
    statusText() {
      if (!this.entryBlockStatusData) return;
      switch (this.entryBlockStatusData.status) {
        case 1:
        case 2:
          return `您有提单未完成支付，若多次提单不充值，帐号可能会被暂停充值。祝您游戏愉快!`;

        case 3:
        case 5:
          return `为了保证您的使用安全，规避IP监控，我方将为您暂停${this.entryBlockStatusData.block_times}小时的充值服务功能，如需继续存款，请联繫我方客服。祝您游戏愉快!`;

        default:
          break;
      }
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
  created() {
    if (this.routerTPL === "sg1") {
      sendUmeng(46);
    } else {
      sendUmeng(47);
    }
    this.initHeaderSetting = this.headerSetting;

    // 判斷分項維護優先度最高
    this.actionGetServiceMaintain()
      .then(data => {
        let target = data.find(
          item =>
            item.service === "player_deposit_and_withdraw" && item.is_maintain
        );

        if (target) {
          this.handleServiceMain(target);

          return Promise.reject();
        }
      })
      .then(() => {
        // 沒有維護則跑原本流程
        const params = [
          this.getSimplePaymentGroups(),
          this.getUserBankList(),
          this.actionSetRechargeConfig(),
          this.actionSetAnnouncementList({ type: 1 }),
          this.getWalletCurrencyBalanceList()
        ];
        Promise.all(params).then(() => {
          // 起始時沒有任何錯誤才顯示跑馬燈
          if (!this.showPopStatus.isShow) {
            this.isDoneMarquee = true;
          }
        });
      })
      .catch(err => {});
  },
  destroyed() {
    this.resetTimerStatus();
  },
  methods: {
    ...mapActions([
      "actionSetUserBalance",
      "actionSetRechargeConfig",
      "actionVerificationFormData",
      "actionSetGlobalMessage",
      "actionGetServiceMaintain",
      "actionSetAnnouncementList",
      "actionGetMemInfoV3",
      "actionGetRechargeStatus"
    ]),
    setPopupStatus(isShow, type) {
      this.showPopStatus = {
        isShow,
        type
      };
    },
    closePopup() {
      switch (this.showPopStatus.type) {
        case "blockTips":
          this.$router.push("/mobile/mcenter/wallet");
          break;

        default:
          break;
      }

      this.setPopupStatus(false, "");
    },
    handleCreditTrans() {
      // this.$router.push("/mobile/mcenter/creditTrans?tab=0");
      this.actionGetMemInfoV3().then(() => {
        this.actionGetRechargeStatus("");
      });
    },
    handleBindWallet() {
      switch (this.simplePayType.method_id) {
        // CGPay
        case 16:
        // CGPay-USDT(ERC20)
        case 25:
        // CGPay-USDT(TRC20)
        case 30:
          this.$router.push(
            `/mobile/mcenter/bankCard?redirect=deposit&type=wallet&wallet=CGPay&swift=BBCGWACN1`
          );
          break;
        // OSPay
        case 36:
        // OSPay-USDT(ERC20)
        case 37:
        // OSPay-USDT(TRC20)
        case 38:
          this.$router.push(
            `/mobile/mcenter/bankCard?redirect=deposit&type=wallet&wallet=OSPay&swift=BBOSWACN1`
          );
          break;
        // 幣希
        case 32:
          this.$router.push(
            `/mobile/mcenter/bankCard?redirect=deposit&type=wallet&wallet=bcwallet&swift=${this.simpleCurPayInfo.bank_swift_code}`
          );
          break;
        // E点付
        case 34:
          this.$router.push(
            `/mobile/mcenter/bankCard?redirect=deposit&type=wallet&wallet=epoint&swift=${this.simpleCurPayInfo.bank_swift_code}`
          );
          break;
        // e点富
        case 41:
          this.$router.push(
            `/mobile/mcenter/bankCard?redirect=deposit&type=wallet&wallet=epointNew&swift=${this.simpleCurPayInfo.bank_swift_code}`
          );
          break;
        // 購寶
        case 22:
          this.$router.push(
            `/mobile/mcenter/bankCard?redirect=deposit&type=wallet&wallet=goBao&swift=${this.simpleCurPayInfo.bank_swift_code}`
          );
          break;
        // usdt
        case 402:
          this.$router.push(
            `/mobile/mcenter/bankCard?redirect=deposit&type=wallet&wallet=usdt&swift=BBUSDTCN1`
          );
          break;
        case 404:
          this.$router.push(
            `/mobile/mcenter/bankCard?redirect=deposit&type=wallet&wallet=usdt&swift=BBUSDTCN3`
          );
          break;
      }
      return;
    },
    //點擊立即充值
    clickSubmit() {
      this.newWindow = "";
      this.newWindow = window.open(
        "",
        "",
        "width=1024, height=768, target=_blank, toolbar=yes"
      );
      this.checkEntryBlockStatus().then(() => {
        if (this.routerTPL === "sg1") {
          sendUmeng(49);
        } else {
          sendUmeng(50);
        }
        // 代客充值
        if (
          this.simplePayType.method_id === 20 &&
          this.entryBlockStatusData.status < 3
        ) {
          this.submitInfo();
          return;
        }
        //幣希檢查餘額
        if (this.simplePayType.method_id === 32) {
          if (+this.cryptoMoney > +this.selectBcCoin.balance) {
            this.actionSetGlobalMessage({
              msg: "币希钱包余额不足"
            });
            this.newWindow.close();
            return;
          }
        }

        // 使用者存款封鎖狀態
        //  0為正常, 1為提示, 2為代客充值提示, 3為封鎖阻擋, 4為跳轉網址, 5為封鎖阻擋與跳轉網址
        switch (this.entryBlockStatusData.status) {
          case 0:
            this.submitInfo();
            break;

          case 4:
            this.newWindow.close();
            this.actionSetGlobalMessage({
              msg: this.entryBlockStatusData.custom_point
            });

            setTimeout(() => {
              window.open(this.entryBlockStatusData.external_url);
              return;
            }, 700);

            break;

          default:
            this.newWindow.close();
            this.setPopupStatus(true, "blockStatus");

            break;
        }
      });
    },
    /**
     * 提交訂單
     * @method submitInfo
     */
    submitInfo(needReOpen) {
      // status = 5-> 封鎖阻擋與跳轉網址
      if (this.entryBlockStatusData.status === 5) {
        this.actionSetGlobalMessage({
          msg: this.entryBlockStatusData.custom_point
        });
        setTimeout(() => {
          window.open(this.entryBlockStatusData.external_url);
          return;
        }, 700);
        this.closePopup();
        return;
      }
      // block -> 是否封鎖
      if (this.entryBlockStatusData.block) {
        this.closePopup();
        return;
      }
      this.closePopup();

      //USDT充值前檢查匯率異動
      if (this.isSelectBindWallet(25, 30, 37, 38, 32, 402, 404)) {
        let oldrate = this.rate;
        this.convertCryptoMoney();
        if (this.rate !== oldrate) {
          this.actionSetGlobalMessage({
            msg: "汇率已异动，请重新申请"
          });
          return;
        }
      }
      if(needReOpen){
        this.newWindow = "";
        this.newWindow = window.open(
          "",
          "",
          "width=1024, height=768, target=_blank, toolbar=yes"
        );
      }
      this.sendSimpleDeposit().then(response => {
        // 重置阻擋狀態
        this.entryBlockStatusData = null;

        if (response) {
          if (response.status === "NameFail") {
            this.actionSetGlobalMessage({
              msg: "请输入正确名称"
            });
            this.nameCheckFail = true;
          }
          if (response.status === "local") {
            //手動配卡不需顯示depositinfo
            if (this.manualCard) {
              return;
            }
            this.checkSuccess = false;
            this.submitStatus = "stepTwo";

            this.$emit("update:headerSetting", {
              ...this.initHeaderSetting,
              leftBtns: {
                icon: this.initHeaderSetting.leftBtns.icon,
                onClick: () => {
                  this.actionSetUserBalance();
                  this.submitStatus = "stepOne";
                }
              },
              submitStatus: this.submitStatus
            });

            // 點選加密貨幣的匯率試算，在需將時間設為0
            this.countdownSec = 0;
          }

          if (response.status === "third") {
            this.getSimplePaymentGroups()
            // if (this.simplePayFeeData.amounts.length > 0) {
            //   this.changeSimpleMoney(this.simplePayFeeData.amounts[0]);
            // } else {
            this.changeSimpleMoney("", true);
            // }
            this.cryptoMoney = "--";
            this.resetTimerStatus();
          }
        }
      });
    },
    getImg(image_url) {
      return {
        src: image_url,
        error: this.$getCdnPath(
          "/static/image/common/default/bank_card_default.png"
        ),
        loading: this.$getCdnPath(
          "/static/image/common/default/bank_card_default.png"
        )
      };
    },
    checkEntryBlockStatus() {
      // 使用者存款封鎖狀態
      this.isBlockChecking = true;
      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/CreateEntryBlock/User/Check`,
        params: {
          t_user_id: this.memInfo.user.user_id,
          t_user_name: this.memInfo.user.username
        }
      })
        .then(res => {
          this.isBlockChecking = false;
          if (res.status === "000" && res.data) {
            this.entryBlockStatusData = res.data;
          } else {
            // 存款功能無法使用
            this.actionSetGlobalMessage({
              msg: res.msg,
              code: res.code
            });
            this.newWindow.close();
          }
        })
        .catch(error => {
          const { msg, code } = error.response.data;
          this.actionSetGlobalMessage({
            msg,
            code
          });
          this.newWindow.close();
        });
    },
    // 代客充值
    goToValetDeposit() {
      this.closePopup();
      if (
        this.entryBlockStatusData.has_csr &&
        this.entryBlockStatusData.external_url
      ) {
        window.open(this.entryBlockStatusData.external_url);
        return;
      }
    },
    // 08/27 後續關於 Input 事件的輸入驗證將統一到這裡
    verification(target, value, isSpeedField) {
      if (target === "CGPPwd") {
        this.actionVerificationFormData({
          target: "safeCode",
          value: value
        }).then(val => {
          this.walletData["CGPay"].password = val;
        });
      }
      if (target === "OSPPwd") {
        this.actionVerificationFormData({
          target: "safeCode",
          value: value
        }).then(val => {
          this.walletData["OSPay"].password = val;
        });
      }

      if (target === "money") {
        this.actionVerificationFormData({
          target: "money",
          value: value
        }).then(val => {
          this.moneyValue = val;
          this.displayMoneyValue = this.moneyValue
            ? this.formatThousandsCurrency(this.moneyValue)
            : "";
          this.isErrorMoney =
            (+this.simplePayFeeData.per_trade_min &&
              +this.simplePayFeeData.per_trade_min > this.moneyValue) ||
            (+this.simplePayFeeData.per_trade_max > 0 &&
              +this.simplePayFeeData.per_trade_max < this.moneyValue);

          this.cryptoMoney = val ? this.cryptoMoney : "--";

          this.checkOrderData();
        });
      }
      if (target === "order-bank")
        this.actionVerificationFormData({
          target: "order-bank",
          value: value
        }).then(val => {
          this.epointBankName = val;
        });
      if (target === "order-bank-account")
        this.actionVerificationFormData({
          target: "order-bank-account",
          value: value
        }).then(val => {
          this.epointBankAccount = val;
        });

      // 如果是迅付欄位
      if (isSpeedField) {
        if (target === "depositName") {
          this.actionVerificationFormData({
            target: "name",
            value: value
          }).then(val => {
            this.speedField.depositName = val;
          });
        }
        this.checkOrderData();
      }
    },
    isSelectBindWallet(...args) {
      // 選擇特定錢包種類
      if (args.length > 0) {
        return args.includes(this.simplePayType.method_id);
      }

      return (
        this.simplePayType.method_id === 16 ||
        this.simplePayType.method_id === 25 ||
        this.simplePayType.method_id === 30 ||
        this.simplePayType.method_id === 36 || //OSPay-CGP
        this.simplePayType.method_id === 37 || //OSPay-USDT(ERC20)
        this.simplePayType.method_id === 38 || //OSPay-USDT(TRC20)
        this.simplePayType.method_id === 22 ||
        this.simplePayType.method_id === 32 ||
        this.simplePayType.method_id === 34 ||
        this.simplePayType.method_id === 41 ||
        this.simplePayType.method_id === 402 ||
        this.simplePayType.method_id === 404
      );
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

      this.setPopupStatus(true, "funcTips");
      this.confirmPopupObj = {
        title: "系统讯息",
        content: `
          <div style="font-size: 16px;">存款与取款功能 目前进行维护中，如有不便之处，敬请见谅!</div>
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
    },
    showRealStatusType(type) {
      this.showRealStatus = type;
      if (type) {
        this.getSimplePayOffer(this.moneyValue);
        // console.log("get offer??");
      }
    },
    onClickService() {
      if (this.routerTPL === "sg1") {
        sendUmeng(50);
      } else {
        sendUmeng(51);
      }
      this.$router.push("/mobile/service");
    },
    setEpointBank(item) {
      this.defaultEpointWallet = item;
    },
    replaceEpointWhiteSpace() {
      this.epointBankName = this.epointBankName.replace(/\s+/, "");
      this.epointBankAccount = this.epointBankAccount.replace(/\s+/, "");
    },
    toggleEye(value) {
      if (value === "cg") {
        this.isShowCGPPwd = !this.isShowCGPPwd;
      } else {
        this.isShowOSPPwd = !this.isShowOSPPwd;
      }
    },
    getWalletCurrencyBalanceList() {
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Wallet/Currency/Balance/List`,
        params: {
          lang: "zh-cn"
        }
      }).then(res => {
        // console.log(res);
        if (res.status === "000") {
          this.bcCurrencyData = res.data;

          let currencyHasMoney = [];
          if (res.data.currency_list.length > 0) {
            currencyHasMoney = res.data.currency_list.filter(coin => {
              return +coin.balance > 0;
            });
          }
          if (currencyHasMoney.length > 0) {
            this.selectBcCoin = currencyHasMoney[0];
          } else {
            this.selectBcCoin = res.data.currency_list[0];
          }

          // this.bcCurrencyData = {
          //   bind:true,
          //   total_balance:"12414152345",
          //     currency_list:[
          //     {
          //       balance:"1,000,000.99",
          //       currency:"BTC",
          //       name:"比特币"
          //     },
          //     {
          //       balance:"900,000.00",
          //       currency:"ETH",
          //       name:"以太坊"
          //     }
          //   ]
          // }
        } else {
          this.bcCurrencyData = {
            bind: true,
            total_balance: "12414152345",
            currency_list: [
              {
                balance: "1,000,000.99",
                currency: "BTC",
                name: "比特币"
              },
              {
                balance: "900,000.00",
                currency: "ETH",
                name: "以太坊"
              }
            ]
          };
        }
      });
    },
    setBcCurrency(currency) {
      // console.log(currency);
      this.selectBcCoin = currency;
      this.updateTime = true;
      this.convertCryptoMoney();
    },
    openBCWalletPopup() {
      this.setPopupStatus(true, "bcWalletPopup");
    },

    /*
    簡易模式
    */
    //  取得簡易支付群組 C04.61
    getSimplePaymentGroups() {
      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Vendor/Simple/Payment/Groups`,
        params: {}
      }).then(res => {
        if (res.status === "000") {
          this.depositData = res.data;
          if(['porn1', 'sg1'].includes(this.themeTPL)){
            this.depositData.push({id:26987})
          }
          console.log(res.data);
          this.changeSimplePayMode(this.depositData[0]);
          this.isShow = false;
        }
      });
    },
    changeSimplePayMode(info) {
      if (info.id === this.simpleCurPayInfo.id) {
        return;
      }
      this.resetStatus();
      this.resetTimerStatus();
      this.simpleCurPayInfo = info;
      console.log("simpleCurPayInfo", this.simpleCurPayInfo);
      //代客充值
      if (this.simpleCurPayInfo.bank_swift_code === "BBVALREC") {
        this.checkSuccess = true;
      } else {
        this.checkSuccess = false;
      }
      if (this.simpleCurPayInfo.is_link) {
        let openPage = window.open(this.simpleCurPayInfo.link, "_blank");
        return;
      }
      this.changeSimpleCurrency(this.simpleCurPayInfo.content[0]);

      if ([25, 30, 37, 38, 402, 404].includes(this.simplePayType.method_id)) {
        this.resetTimerStatus(); //讓timeUSDT()跑進this.countdownSec === 0
      }
      if (
        this.simpleCurPayInfo.banks &&
        this.simpleCurPayInfo.banks.length > 0
      ) {
        this.changeSimplePayBank(this.simpleCurPayInfo.banks[0]);
      }

      // if (
      //   this.curModeGroup.channel_display &&
      //   (this.curPayInfo.bank_id ||
      //     this.curSelectedBank.value ||
      //     this.isSelectBankPaymentMethod)
      // ) {
      //   this.getPayPass();
      // }

      // if (this.allBanks && this.allBanks.length > 0) {
      //   this.defaultCurPayBank();
      // }

      // this.checkDepositInput();
      this.getUserBankList();
    },
    /**
     * 切換銀行
     * @method changeSimplePayBank
     */
    changeSimplePayBank(info) {
      this.simplePayBank = info;
      this.setPopupStatus(false, "");
    },
    /**
     * 切換幣別
     * @method changeSimpleCurrency
     */
    changeSimpleCurrency(info) {
      this.simpleCurrency = info;
      this.changeSimplePayType(info.data[0]);
    },
    /**
     * 切換類型
     * @method changeSimplePayType
     */
    changeSimplePayType(info) {
      this.simplePayType = info;
      this.getVendorCryptoOuterUserAddressList();
      if (this.simplePayType.channels.length > 0) {
        this.changeSimpleRoad(this.simplePayType.channels[0]);
      } else if (this.simplePayType.tags.length > 0) {
        this.changeSimpleRoad(this.simplePayType.tags[0]);
      } else {
        this.changeSimpleRoad(null);
        if (this.simpleCurPayInfo.bank_swift_code !== "BBVALREC") {
          this.setSimpleFeeData(info);
        }
      }
    },
    /**
     * 切換通道
     * @method changeSimplePayType
     */
    changeSimpleRoad(info) {
      this.simplePayRode = info;
      this.getSimplePayOffer();
      if (this.simpleCurPayInfo.bank_swift_code !== "BBVALREC") {
        this.setSimpleFeeData(info);
      }
      
    },
    /**
     * 選擇通道金額
     * @method changeSimpleMoney
     * @param {String} money - 金額
     */
    changeSimpleMoney(money, canCustomMoney) {
      this.cryptoMoney = "--";
      this.isSelectedCustomMoney = !!canCustomMoney;
      this.isDisableDepositInput = !canCustomMoney;
      this.moneyValue = money;
      this.displayMoneyValue = this.formatThousandsCurrency(this.moneyValue);
      this.isErrorMoney = false;
      this.checkSuccess = true;
      // 金額輸入錯誤
      // console.log(`this.isErrorMoney ${this.isErrorMoney}`);
      // console.log(`!this.moneyValue ${!this.moneyValue}`);
      // console.log(`+this.simplePayFeeData.per_trade_min > +this.moneyValue ${+this.simplePayFeeData.per_trade_min > +this.moneyValue}`);
      // console.log(`+this.simplePayFeeData.per_trade_max < +this.moneyValue ${+this.simplePayFeeData.per_trade_max < +this.moneyValue}`);
      // console.log(`this.simplePayFeeData.per_trade_min ${this.simplePayFeeData.per_trade_min}`);
      // console.log(`this.simplePayFeeData.per_trade_max ${this.simplePayFeeData.per_trade_max}`);
      // console.log(`this.simplePayFeeData.per_trade_max ${this.simplePayFeeData.per_trade_max}`);
      // console.log(`+this.simplePayFeeData.per_trade_max ${+this.simplePayFeeData.per_trade_max}`);
      // console.log(`this.moneyValue ${this.moneyValue}`);

      if (
        this.isErrorMoney ||
        !this.moneyValue ||
        (+this.simplePayFeeData.per_trade_min &&
          +this.simplePayFeeData.per_trade_min > +this.moneyValue) ||
        (+this.simplePayFeeData.per_trade_max &&
          +this.simplePayFeeData.per_trade_max < +this.moneyValue)
      ) {
        console.log("checkSuccess faile");
        this.checkSuccess = false;
        return;
      }
    },
    /**
     * 設定充值金額資訊
     * @method setSimpleFeeData
     */
    setSimpleFeeData(info) {
      if (info !== null) {
        this.simplePayFeeData = {
          amounts: info.amounts,
          fee_amount: info.fee_amount,
          fee_percent: info.fee_percent,
          is_custom_amount: info.is_custom_amount,
          is_recommend_amount: info.is_recommend_amount,
          per_trade_max: info.per_trade_max,
          per_trade_min: info.per_trade_min
        };
        // if(this.simplePayFeeData.amounts.length > 0){
        //   this.changeSimpleMoney(this.simplePayFeeData.amounts[0])
        // }else{
        this.changeSimpleMoney("", true);
        // }
      }
    },
    // 取得 CGPay 餘額
    getCGPayBalance() {
      return axios({
        method: "get",
        url: "/api/v1/c/ext/inpay?api_uri=api/trade/v2/c/wallet/balance",
        params: {
          method_id: this.simplePayType.method_id
        }
      })
        .then(response => {
          const { result, ret, msg, code } = response.data;
          let paymode = this.simplePayType.method_id === 16 ? "CGPay" : "OSPay";
          if (!response || result !== "ok") {
            this.walletData[paymode].balance = "--";
            this.actionSetGlobalMessage({
              msg,
              code
            });
            return;
          }

          this.walletData[paymode].balance = ret.balance;
        })
        .catch(error => {
          const { msg, code } = error.response.data;
          let paymode = this.simplePayType.method_id === 16 ? "CGPay" : "OSPay";
          this.walletData[paymode].balance = "--";
          this.actionSetGlobalMessage({
            msg,
            code
          });
        });
    },
    // 取得存/取款加密貨幣試算金額
    convertCryptoMoney() {
      if (this.simplePayType.method_id === 32 && !this.selectBcCoin.currency) {
        return;
      }
      return axios({
        method: "get",
        url: API_CRYPTO_MONEY,
        params: {
          type: 1,
          amount: this.moneyValue,
          method_id: this.simplePayType.method_id,
          currency:
            this.simplePayType.method_id === 32
              ? this.selectBcCoin.currency
              : ""
        }
      })
        .then(response => {
          const { result, ret } = response.data;
          if (!response || result !== "ok") return;

          this.rate = ret.rate;

          if (this.moneyValue != "") {
            this.cryptoMoney = ret.crypto_amount;
          } else {
            this.cryptoMoney = "--";
          }

          this.isClickCoversionBtn = true;

          //當切換成USDT和歸零的時候才重call秒數
          if (this.updateTime) {
            this.updateTime = false;
            this.countdownSec = ret.ttl;
          }

          // 僅限按下按鈕觸發，@input & @blur 皆不會觸發
          if (this.countdownSec && !this.timer) {
            this.timer = setInterval(() => {
              if (this.countdownSec === 0) {
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
    // 取得使用者站外錢包入款錢包地址
    getVendorCryptoOuterUserAddressList() {
      return axios({
        method: "get",
        url: API_MCENTER_DEPOSIT_OUTER_WALLET,
        params: {
          payment_method_id: this.simplePayType.method_id
        }
      })
        .then(response => {
          if (response && response.data && response.data.result === "ok") {
            // console.log(response);
            this.outerCryptoOption = [];
            this.defaultOuterCrypto = "";
            response.data.ret.forEach(outerAddress => {
              if (outerAddress.is_default) {
                this.defaultOuterCrypto = outerAddress.address;
              }
              this.outerCryptoOption.push(outerAddress.address);
            });
            this.defaultOuterCrypto =
              this.defaultOuterCrypto === ""
                ? this.outerCryptoOption[0]
                : this.defaultOuterCrypto;

            this.outerCryptoOption.push("其他位址");
          }

          // this.outerCryptoOption = ["1", "2", "3"];
        })
        .catch(error => {});
    },
    /**
     * 簡易模式入款 C04.59
     * @method sendSimpleDeposit
     * @param {String} inputValue - 輸入金額
     */
    sendSimpleDeposit() {
      this.nameCheckFail = false;

      const newWindowHref = uri => {
        setTimeout(() => {
          this.newWindow.location.href = uri;
        }, 200);
      };

      // 代客充值
      if (this.simplePayType.method_id === 20) {
        // 流量分析事件 - 成功
        window.dataLayer.push({
          event: "ga_click",
          eventCategory: "deposit",
          eventAction: "pay",
          eventLabel: "success"
        });

        newWindowHref(this.simplePayType.external_url);
        return Promise.resolve({ status: "credit" });
      }

      this.isShow = true;
      this.actionSetIsLoading(true);
      let paramsData = {
        api_uri: "/api/trade/v2/c/simple/entry",
        method_id: this.simplePayType.method_id,
        amount: this.moneyValue,
        username: "" //使用者帳號(未登入入款必填)
      };

      if (this.simplePayRode && this.simplePayRode.id) {
        paramsData = {
          ...paramsData,
          tag_id:
            this.simplePayType.tags.length > 0 ? this.simplePayRode.id : "", //通道標籤id
          channel_id:
            this.simplePayType.channels.length > 0 ? this.simplePayRode.id : "" //通道id
        };
      }
      //使用者姓名(極速到帳必填 method_id = 6)
      if(this.simplePayType.method_id === 6){
        paramsData = {
          ...paramsData,
          pay_username:this.speedName,
        };
      }
      //銀行id (在線支付/點卡支付必填 method_id = 1,2)
      if ([1, 2].includes(this.simplePayType.method_id)) {
        paramsData = {
          ...paramsData,
          bank_id: this.simplePayBank.id
        };
      }

      //電子錢包支付密碼 (CGP/OSP密碼支付必填 method_id = 16,25)
      // CGPay：選擇支付密碼
      if (
        this.simplePayType.method_id === 16 &&
        this.walletData["CGPay"].method === 0
      ) {
        paramsData = {
          ...paramsData,
          wallet_token: +this.walletData["CGPay"].password
        };
      }
      // OSPay：選擇支付密碼
      if (
        this.simplePayType.method_id === 36 &&
        this.walletData["OSPay"].method === 0
      ) {
        paramsData = {
          ...paramsData,
          wallet_token: +this.walletData["OSPay"].password
        };
      }

      if (this.simplePayType.is_outer_crypto) {
        if (this.showOuterCryptoAddress) {
          paramsData = {
            ...paramsData,
            user_address: this.outerCryptoAddress
          };
        } else {
          paramsData = {
            ...paramsData,
            user_address: this.defaultOuterCrypto
          };
        }
      }
      //e點富
      //使用者銀行卡id（E点付/e点富入款必填 method_id = 34,41）
      //使用者銀行卡名稱（E点付/e点富入款必填 method_id = 34,41）
      //使用者轉出金額帳號（E点付/e点富入款必填 method_id = 34,41）?
      if (
        [34, 41].includes(this.simplePayType.method_id)
      ) {
        if (this.showEpointWalletAddress) {
          //新增的掛單銀行卡
          paramsData = {
            ...paramsData,
            pay_account: this.epointBankAccount,
            pay_bank_name: this.epointBankName
          };
        } else {
          //綁定的銀行卡
          paramsData = {
            ...paramsData,
            pay_account_id: this.defaultEpointWallet.id
          };
        }
      }
      //幣希
      //幣別（幣希錢包入款必填 method_id = 32）
      if (this.simplePayType.method_id === 32) {
        paramsData = {
          ...paramsData,
          currency: this.selectBcCoin.currency
        };
      }

      // let _isPWA = true;

      return goLangApiRequest({
        method: "post",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Simple/Deposit`,
        params: {
          ...paramsData
        }
      })
        .then(response => {
          this.isShow = false;
          this.actionSetIsLoading(false);
          const ret = response.data
          const msg = response.msg
          const code = response.code
          // let _isWebview = getCookie("platform") === "h";

          if (response.status !== "000") {
            // 流量分析事件 - 失敗
            window.dataLayer.push({
              event: "ga_click",
              eventCategory: "deposit",
              eventAction: "pay",
              eventLabel: "failure"
            });

            this.actionSetGlobalMessage({
              msg,
              code
            });

            this.newWindow.close();

            return { status: "error" };
          }

          // 流量分析事件 - 成功
          window.dataLayer.push({
            event: "ga_click",
            eventCategory: "deposit",
            eventAction: "pay",
            eventLabel: "success"
          });

          //手動配卡提交成功顯示彈窗
          if (ret.remit.is_manual_card) {
            this.manualCard = true;
            this.successAlert = true;
          }

          if (this.showEpointWalletAddress) {
            this.getUserBankList();
            this.epointBankName = "";
            this.epointBankAccount = "";
          }
          // 如有回傳限制時間
          if (ret.remit.limit_time) {
            this.limitTime = ret.remit.limit_time;
          }
          if (ret.remit.field && ret.remit.field.length > 0) {
            this.simplePayField = ret.remit.field;
          }

          if (ret.deposit.url) {
            // if (_isWebview) {
            //   this.webviewOpenUrl = ret.deposit.url;
            //   return { status: "third" };
            // } else if (_isPWA) {
            newWindowHref(ret.deposit.url);
            return { status: "third" };
            // }
            // window.open(ret.deposit.url, "third");
            // return { status: "third" };
          }
          if (ret.wallet.url) {
            if (this.simplePayType.method_id === 34) {
              localStorage.setItem("iframe-third-url", ret.wallet.url);
              localStorage.setItem("iframe-third-url-title", "");
              this.$router.push(`/mobile/iframe/deposit?func=false`);
              this.newWindow.close();
              return;
            }
            // if (_isWebview) {
            //   this.webviewOpenUrl = ret.wallet.url;
            //   return { status: "third" };
            // } else if (_isPWA) {
            newWindowHref(ret.wallet.url);
            return { status: "third" };
            // }
            // window.open(ret.wallet.url, "third");
            // return { status: "third" };
          }

          Object.keys(ret).forEach(info => {
            if (
              info === "deposit" ||
              info === "wallet" ||
              info === "remit" ||
              info === "crypto"
            ) {
              return;
            }
            if (
              ret[info] &&
              (info === "is_deposit" ||
                info === "is_wallet" ||
                info === "is_crypto" ||
                info === "is_remit")
            ) {
              const typeKey = info.split("_")[1];
              this.orderData.orderInfo = ret[typeKey];
              this.orderData.methodType = typeKey;
            }
            this.orderData[info] = ret[info];
          });

          // if (_isPWA) {
          this.newWindow.close();
          // }

          // CGPay 不需要進入詳細入款單
          if (
            this.simplePayType.method_id === 16 ||
            this.simplePayType.method_id === 36
          ) {
            // 將「confirmOneBtn」彈窗打開
            this.setPopupStatus(true, "funcTips");
            this.confirmPopupObj = {
              title: "支付成功",
              btnText: "关闭",
              cb: () => {
                this.closePopup();
                this.$emit("update:headerSetting", this.initHeaderSetting);
                this.resetStatus();
                this.getPayGroup();
              }
            };
            return { status: "third" };
          }
          return { status: "local" };
        })
        .catch(error => {
          console.log(error);
          const { msg, code } = error.response.data;

          this.isShow = false;
          this.actionSetIsLoading(false);

          // if (_isPWA) {
          this.newWindow.close();
          // }
          if (code === 1501020021) {
            (async () => {
              await this.getPayPass();
              this.verificationMoney(this.moneyValue);
            })();
          }

          this.actionSetGlobalMessage({
            msg,
            code
          });

          const errorsList = [
            1500110061,
            1500110091,
            1500170088,
            1500170098,
            1500500097,
            1500720088,
            1500720069,
            "TM020063",
            1500170054,
            1500500064
          ];

          if (errorsList.includes(code)) {
            this.$emit("update:headerSetting", this.initHeaderSetting);
            this.resetStatus();
            this.getPayGroup();
          }
        });
    },
    /**
     * 取得支付優惠
     * @method getSimplePayOffer
     */
    getSimplePayOffer(amount) {
      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/Vendor/Offer/And/Fee`,
        params: {
          paymentMethodId: this.simplePayType.method_id,
          amount: amount,
          lang: "zh-cn",
          t_user_id: this.memInfo.user.user_id,
          t_user_name: this.memInfo.user.username
        }
      }).then(res => {
        if (res.status === "000") {
          this.offerInfo = res.data;
        }
      });
    },
    getSampleSingleLimit(minMoney, maxMoney) {
      let str = "单笔充值金额：";

      if (isNaN(minMoney) || isNaN(maxMoney)) {
        return str;
      }

      minMoney = this.formatThousandsCurrency((+minMoney).toFixed(2));
      maxMoney = this.formatThousandsCurrency((+maxMoney).toFixed(2));

      switch (true) {
        // 最大金額不為0的時候，顯示最小值~最大值
        case Number(maxMoney) !== 0:
          str += `¥${minMoney} ~ ¥${maxMoney}`;
          break;

        // 最小金額不為0的時候，顯示最低金額~无限制
        case Number(minMoney) !== 0 && Number(maxMoney) === 0:
          str += `¥${minMoney} ~ 无限制`;
          break;

        // 最大金額 & 最低金額 都為0的時候，顯示無限制
        case Number(minMoney) === 0 && Number(maxMoney) === 0:
          str += `无限制`;
          break;
      }

      return str;
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/sg1.scss" module="$style_sg1"></style>
