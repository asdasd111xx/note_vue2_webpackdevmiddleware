<template>
  <div :class="[$style['mode-wrap']]">
    <!-- <div
      v-if="['porn1', 'sg1'].includes(themeTPL) && topPromotionMessage"
      :class="$style['top-promotion']"
    >
      {{ topPromotionMessage }}
    </div> -->
    <div :class="[$style['header-wrap']]">
      <marquee
        v-if="marqueeList && marqueeList.length > 0 && isDoneMarquee"
        :list="marqueeList"
        :titleList="marqueeTitle"
        :origin="'deposit'"
      />

      <swiper
        v-if="depositData.length > 1"
        :options="categoryOptions"
        :class="$style['swiper-wrap']"
      >
        <swiper-slide
          v-for="(listItem, index) in depositData"
          :key="`swiper-data-${index}`"
          :class="[
            $style['swiper-item'],
            {
              [$style['is-current']]:
                listItem.payment_group_id === curModeGroup.payment_group_id
            }
          ]"
        >
          <span @click="modeChange(listItem, index)">{{
            listItem.payment_group_name || listItem.name
          }}</span>
        </swiper-slide>
      </swiper>
    </div>
    <div
      v-if="depositData.length > 0 && submitStatus === 'stepOne'"
      :class="$style['deposit-edit-wrap']"
      :style="{ 'margin-top': `${depositWrapMarignTop}px` }"
    >
      <template v-if="Object.keys(curModeGroup).length > 0">
        <div :class="$style['bank-card-wrap']">
          <!-- 支付方式 -->
          <div :class="[$style['feature-wrap'], 'clearfix']">
            <div :class="$style['feature-title']">支付方式</div>

            <div :class="[$style['pay-mode-item-wrap'], 'clearfix']">
              <div
                v-for="(info, index) in curModeGroup.payment_group_content"
                :key="`pay-mode-${info.payment_method_id}-${info.bank_id}`"
                :class="[
                  $style['pay-mode-item'],

                  {
                    [$style['is-current']]:
                      curPayInfo.payment_method_id === info.payment_method_id &&
                      curPayInfo.bank_id === info.bank_id
                  }
                ]"
                @click="changePayMode(info, index)"
              >
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
                  {{
                    info.short_name
                      ? info.short_name
                      : info.bank_name
                      ? info.bank_name
                      : info.payment_method_name
                  }}
                </div>

                <img
                  v-if="
                    curPayInfo.payment_method_id === info.payment_method_id &&
                      curPayInfo.bank_id === info.bank_id
                  "
                  :class="$style['pay-active']"
                  :src="$getCdnPath(`/static/image/common/select_active.png`)"
                />
              </div>

              <!-- Yabo  -->
              <!-- 客製額度轉帳入口 -->
              <template v-if="['porn1', 'sg1'].includes(themeTPL)">
                <div
                  :class="[
                    $style['pay-mode-item'],
                    $style[siteConfig.ROUTER_TPL]
                  ]"
                  @click="handleCreditTrans"
                >
                  <div :class="[$style['pay-sub-title'], $style['custom']]">
                    代收代付
                  </div>
                  <div
                    :class="[$style['pay-sub-title'], $style['custom']]"
                    style="color: black"
                  >
                    代理分红
                  </div>
                </div>
              </template>
            </div>
          </div>

          <!-- 選擇銀行 or 選擇點卡 -->
          <div
            v-if="allBanks && allBanks.length > 0"
            :class="[
              $style['feature-wrap'],
              $style['select-card-wrap'],
              'clearfix'
            ]"
            @click="changeType('changeBank'), (isShowPop = true)"
          >
            <span :class="$style['select-bank-title']"
              >{{
                curPayInfo.payment_type_id === 5
                  ? $text("S_YOUR_BANK", "您的银行")
                  : curPayInfo.payment_method_id === 2
                  ? $text("S_SELECT_POINT_CARD", "请选择点卡")
                  : $text("S_SELECT_BANKS", "请选择银行")
              }}
            </span>

            <div :class="$style['select-bank-item']">
              {{ curSelectedBank.label }}
            </div>

            <img
              :class="$style['select-bank-icon']"
              :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
            />

            <div v-if="isShowPop" :class="$style['pop-wrap']">
              <div
                :class="$style['pop-mask']"
                @click.stop="isShowPop = false"
              />
              <div :class="$style['pop-menu']">
                <div :class="$style['pop-title']">
                  <span @click.stop="isShowPop = false">{{
                    $text("S_CANCEL", "取消")
                  }}</span>
                  选择银行
                </div>

                <ul :class="$style['pop-list']">
                  <li
                    v-for="item in paySelectData['changeBank'].allData"
                    :key="item.selectId"
                    @click.stop="changeSelectValue(item.value)"
                  >
                    <img v-lazy="getImg(item.image_url)" />
                    {{ item.label }}
                    <icon
                      v-if="item.value === curSelectedBank.value"
                      :class="[$style['select-active']]"
                      name="check"
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <template v-if="curPayInfo.payment_method_id !== 20">
            <!-- 充值人姓名 -->
            <div
              v-if="depositNameInput.showCondition"
              :class="$style['depositName-wrap']"
            >
              <div
                :key="`field-${depositNameInput.objKey}`"
                :class="[
                  $style['speed-field-name'],
                  { [$style.error]: depositNameInput.isError },
                  'clearfix'
                ]"
              >
                <div :class="$style['field-title']">
                  {{ depositNameInput.title }}
                </div>

                <div :class="$style['field-info']">
                  <input
                    v-model="speedField.depositName"
                    :class="$style['speed-deposit-input']"
                    :placeholder="depositNameInput.placeholderText"
                    @input="
                      verification(
                        depositNameInput.objKey,
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
                    [$style['hide']]: !nameCheckFail && speedField.depositName
                  }
                ]"
              >
                为即时到帐，请务必输入正确的汇款人姓名
              </div>
            </div>
            <!-- e點富銀行 -->
            <div
              v-if="isSelectBindWallet(34,41) && this.curPassRoad.is_bind_wallet"
              :class="[
                $style['feature-wrap'],
                $style['select-card-wrap'],
                'clearfix'
              ]"
            >
              <span :class="$style['select-bank-title']">
                您的银行
              </span>
              <div
                :class="$style['select-epoint-bank-item']"
                @click="setPopupStatus(true, 'epointBank')"
              >
                {{ defaultEpointWallet.account }}
                <img
                  :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
                />
              </div>
            </div>

            <!-- v-if="showEpointWalletAddress" -->
            <div
              v-if="
                isSelectBindWallet(34,41) &&
                  curPassRoad.is_bind_wallet &&
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
                />
              </div>
              <div :class="[$style['other-bank-input-text'], $style['border']]">
                银行帐号
                <input
                  v-model="epointBankAccount"
                  :class="$style['input-cgpay-address']"
                  type="tel"
                  :placeholder="'请输入银行帐号'"
                />
              </div>
              <div :class="[$style['wallet-address-text'], $style['less']]">
                为即时到帐，请务必输入正确的银行资讯
              </div>
            </div>
            <!-- 支付通道 -->
            <!-- 加密貨幣會隱藏 -->
            <div
              v-if="
                passRoad.length > 0 &&
                  !isSelectBindWallet(402) &&
                  !isSelectBindWallet(404)
              "
              :class="[$style['feature-wrap'], 'clearfix']"
            >
              <span :class="$style['bank-card-title']">支付通道</span>
              <div :class="$style['bank-feature-wrap']">
                <div
                  v-for="data in paySelectData.payPass.allData"
                  :key="data.id"
                  :class="[
                    $style['pay-mode-pass'],

                    { [$style['current-data']]: data.id === curPassRoad.id }
                  ]"
                  @click="changePassRoad(data)"
                >
                  {{ data.mainTitle }}
                  <img
                    v-if="tipTrans[data.display_tag]"
                    :src="
                      $getCdnPath(
                        `/static/image/common/mcenter/deposit/icon_${
                          tipTrans[data.display_tag]
                        }.png`
                      )
                    "
                    :class="$style['pay-mode-tag']"
                  />
                  <img
                    v-if="data.id === curPassRoad.id"
                    :class="$style['pay-active']"
                    :src="$getCdnPath(`/static/image/common/select_active.png`)"
                  />
                </div>
              </div>
              <div
                :class="[
                  curPassRoad.tip != ''
                    ? [$style['pay-mode-tip-show']]
                    : [$style['pay-mode-tip-close']]
                ]"
              >
                <div
                  :class="$style['pay-mode-tip']"
                  v-html="curPassRoadTipText"
                ></div>
                <div
                  v-if="curPassRoadTipTextShowMore"
                  :class="$style['pay-mode-tip-more']"
                  @click="setPopupStatus(true, 'payTip')"
                >
                  more
                </div>
              </div>
            </div>

            <!-- Yabo -->
            <!-- 尚未綁定 CGPay(16) || CGPay-USDT(25,30) || OSPay(36) || OSPay-USDT(37,38) ||購寶(22) || USDT(402) || E点付(34,41)-->
            <div
              v-if="
                ['porn1', 'sg1'].includes(themeTPL) &&
                  isSelectBindWallet() &&
                  !this.curPassRoad.is_bind_wallet
              "
              :class="[$style['feature-wrap'], 'clearfix']"
            >
              <!-- Yabo: 尚未綁定直接跳轉到添加卡片頁面 -->
              <span :class="[$style['bank-card-title'], $style['no-margin']]">
                <template v-if="cgPromotionMessage">
                  充值前请先绑定钱包
                </template>
                <template v-else-if="isSelectBindWallet(32)">
                  充值前请先绑定{{ curPayInfo.payment_method_name }}
                </template>
                <template v-else-if="isSelectBindWallet(34,41)">
                  充值前请先绑定{{ curPayInfo.payment_method_name }}钱包
                </template>
                <template v-else-if="isSelectBindWallet(16, 25, 30)">
                  充值前请先绑定CGPay钱包
                </template>
                <template v-else-if="isSelectBindWallet(36, 37, 38)">
                  充值前请先绑定OSPay钱包
                </template>
                <template v-else>
                  充值前请先绑定{{curPayInfo.payment_method_name}}帐号
                </template>

                <div :class="$style['no-bind-wallet']">
                  <span @click="handleBindWallet">立即绑定</span>
                </div>

                <div
                  v-if="isSelectBindWallet(16) && cgPromotionMessage"
                  :class="$style['cgpay-promotion']"
                >
                  {{ cgPromotionMessage }}
                </div>
              </span>
            </div>

            <!-- Yabo：顯示 CGPay 餘額 -->
            <!-- IF 選擇 CGPay 且 已綁定 -->
            <div
              v-if="
                ['porn1', 'sg1'].includes(themeTPL) &&
                  isSelectBindWallet(16, 36) &&
                  curPassRoad.is_bind_wallet
              "
              :class="[$style['feature-wrap'], 'clearfix']"
            >
              <span :class="$style['bank-card-title']">
                {{isSelectBindWallet(36)? "OS" : "CG"}}币余额
                <img
                  :class="$style['CGPay-update-img']"
                  :src="$getCdnPath(`/static/image/common/btn_update.png`)"
                  alt="update"
                  @click="getCGPayBalance"
                />
              </span>

              <div :class="$style['CGPay-money']">
                {{isSelectBindWallet(36)? "OS" : "CG"}}P
                <span v-if="isSelectBindWallet(36)">
                  {{ walletData["OSPay"].balance !== undefined ? formatThousandsCurrency(walletData["OSPay"].balance) : "--" }}
                </span>
                <span v-else>
                  {{ walletData["CGPay"].balance !== undefined  ? formatThousandsCurrency(walletData["CGPay"].balance) : "--"  }}
                </span>
              </div>
            </div>

            <div
              v-if="
                isSelectBindWallet(25, 30, 37, 38, 402, 404) &&
                  this.curPassRoad.is_outer_crypto &&
                  this.curPassRoad.is_bind_wallet
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

              <!-- <div :class="$style['select-bank-item']">
              {{ curSelectedBank.label }}
              </div> -->
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
              v-if="isSelectBindWallet(32) && this.curPassRoad.is_bind_wallet"
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
                (isSelectBindWallet() && curPassRoad.is_bind_wallet) ||
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
              <div
                v-if="curPassRoad.is_recommend_amount"
                :class="[$style['speed-money-wrap'], 'clearfix']"
              >
                <div
                  v-for="(item, index) in getPassRoadOrAi.amounts"
                  :key="`pay-money-${index}`"
                  :class="[
                    $style['pay-money-item'],
                    $style[siteConfig.ROUTER_TPL],
                    { [$style['is-current']]: moneyValue === item }
                  ]"
                  @click="
                    () => {
                      changeMoney(item);
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
                  ¥ {{ formatThousandsCurrency(item) }}
                  <img
                    v-if="moneyValue === item"
                    :class="$style['pay-active']"
                    :src="$getCdnPath(`/static/image/common/select_active.png`)"
                  />
                </div>

                <!-- 自訂金額 -->
                <div
                  v-if="
                    curPassRoad &&
                      curPassRoad.is_custom_amount &&
                      curPassRoad.amounts.length > 0
                  "
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
                        changeMoney('', true);
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
                        getSingleLimit(
                          depositInterval.minMoney,
                          depositInterval.maxMoney
                        )
                      }})
                    </span>
                    <img
                      v-if="isSelectedCustomMoney"
                      :class="$style['pay-active']"
                      :src="
                        $getCdnPath(`/static/image/common/select_active.png`)
                      "
                    />
                  </div>
                </div>
              </div>
              <!-- 金額輸入欄 -->
              <div
                v-if="
                  Object.keys(curPassRoad).length === 0 ||
                    curPassRoad.is_custom_amount
                "
                :class="[
                  $style['feature-deposit-wrap'],
                  {
                    [$style['hidden']]:
                      curPassRoad.is_custom_amount &&
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
                      getSingleLimit(
                        depositInterval.minMoney,
                        depositInterval.maxMoney,
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
                  getSingleLimit(
                    depositInterval.minMoney,
                    depositInterval.maxMoney,
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
                        {{ curPayInfo.payment_method_name }}
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
                      <span
                        :class="[
                          $style['time'],
                          $style[themeTPL]
                        ]"
                        >{{ timeUSDT() }}</span
                      >
                      后更新 )</span
                    >
                  </div>
                </div>
              </template>
            </div>

            <!-- 驗證方式 -->
            <!-- If 選擇 CGPay且已綁定 : 顯示 CGPay 餘額 -->
            <div
              v-if="isSelectBindWallet(16) && curPassRoad.is_bind_wallet"
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
              v-if="isSelectBindWallet(36) && curPassRoad.is_bind_wallet"
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

            <div v-if="curPay(curPayInfo)" :class="$style['speed-input-wrap']">
              <template v-for="info in allInputData">
                <div
                  v-if="info.showCondition"
                  :key="`field-${info.objKey}`"
                  :class="[
                    $style['speed-field'],
                    { [$style.error]: info.isError },
                    'clearfix'
                  ]"
                >
                  <img
                    v-if="
                      info.objKey === 'depositMethod' ||
                        info.objKey === 'depositTime'
                    "
                    :class="$style['speed-field-icon']"
                    :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
                  />
                  <div :class="$style['field-title']">{{ info.title }}</div>
                  <div :class="$style['field-info']">
                    <!-- 充值方式 -->
                    <template v-if="info.objKey === 'depositMethod'">
                      <div
                        :class="[
                          $style['speed-field-title'],
                          {
                            [$style[
                              'depositMethod-no-data'
                            ]]: !speedField.depositMethod
                          }
                        ]"
                        @click="isShowMethodsPop = true"
                      >
                        {{
                          speedField.depositMethod
                            ? info.selectData.find(
                                item =>
                                  speedField.depositMethod === item.selectId
                              ).mainTitle
                            : info.selectTitle
                        }}
                      </div>

                      <!-- 充值方式選單 -->
                      <div v-if="isShowMethodsPop" :class="$style['pop-wrap']">
                        <div
                          :class="$style['pop-mask']"
                          @click.stop="isShowMethodsPop = false"
                        />
                        <div :class="$style['pop-menu']">
                          <div :class="$style['pop-title']">
                            <span @click.stop="isShowMethodsPop = false">{{
                              $text("S_CANCEL", "取消")
                            }}</span>
                            {{ info.title }}
                          </div>

                          <ul :class="$style['pop-list']">
                            <li
                              v-for="item in info.selectData"
                              :key="item.selectId"
                              @click.stop="
                                (speedField.depositMethod = item.selectId),
                                  (isShowMethodsPop = false)
                              "
                            >
                              <img
                                :src="
                                  $getCdnPath(
                                    `/static/image/common/default/bank_card_default.png`
                                  )
                                "
                              />
                              {{ item.mainTitle }}
                              <icon
                                v-if="
                                  item.selectId === speedField.depositMethod
                                "
                                :class="$style['select-active']"
                                name="check"
                              />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </template>

                    <template v-else-if="info.objKey === 'depositTime'">
                      <date-picker
                        v-model="speedField['depositTime']"
                        :placeholder="info.placeholderText"
                        type="datetime"
                        format="YYYY-MM-DD HH:mm:ss"
                        value-type="format"
                        @open="setDefaultDate"
                        @input="verification(info.objKey, info.value, true)"
                      />
                    </template>

                    <input
                      v-else
                      v-model="speedField[info.objKey]"
                      :class="$style['speed-deposit-input']"
                      :placeholder="info.placeholderText"
                      @input="
                        verification(info.objKey, $event.target.value, true)
                      "
                    />
                  </div>
                </div>
                <div
                  v-if="info.isError"
                  :key="`field-error-${info.objKey}`"
                  :class="$style['speed-deposit-input-error-messgae']"
                >
                  {{ info.placeholderText }}
                </div>
              </template>
            </div>

            <div v-if="receiptInfo" :class="[$style['info-wrap'], 'clearfix']">
              <!-- <div :class="$style['deposit-info-title']">
                {{ $text("S_WITHDRAW_ACCOUNT", "收款帐号") }}
              </div> -->

              <div :class="[$style['deposit-submit-info']]">
                <template v-for="(info, index) in receiptInfo">
                  <div
                    :key="`receipt-info-${index}`"
                    :class="[$style['submit-info-wrap']]"
                  >
                    <div
                      :class="[
                        $style['basic-info-text'],
                        $style['basic-info-title']
                      ]"
                    >
                      {{ info.title }}
                    </div>

                    <div
                      v-if="info.qrcode && info.qrcode.length > 0"
                      :class="[
                        $style['basic-info-text'],
                        $style['qrcode-wrap']
                      ]"
                    >
                      <template
                        v-for="(qrcodeInfo, qrcodeInfoIndex) in info.qrcode"
                      >
                        <div
                          v-if="qrcodeInfo.value"
                          :key="`qrcode-item-${qrcodeInfoIndex}`"
                          :class="$style['qrcode-item']"
                        >
                          <div :class="$style['qrcode-title']">
                            {{ qrcodeInfo.title }}
                          </div>
                          <img
                            :src="qrcodeInfo.value"
                            :class="$style['qrcode-img']"
                            @click="
                              switchQrcodePopup(
                                true,
                                qrcodeInfo.value,
                                qrcodeInfo.title
                              )
                            "
                          />
                        </div>
                      </template>
                    </div>

                    <!-- eslint-disable vue/no-v-html -->
                    <div
                      v-else-if="info.htmlShow"
                      :class="[
                        $style['basic-info-text'],
                        $style[`info-${info.objKey}`]
                      ]"
                      v-html="info.value"
                    />

                    <!-- eslint-enable vue/no-v-html -->
                    <div v-else :class="$style['basic-info-text']">
                      {{ info.value }}
                    </div>

                    <!-- icon -->
                    <div
                      v-if="info.copyShow"
                      :class="$style['icon-wrap']"
                      @click="copyInfo(info.value)"
                    >
                      <img
                        :src="$getCdnPath(`/static/image/common/ic_copy.png`)"
                      />
                    </div>
                  </div>

                  <!-- <div
                    :key="`border-line-${index}`"
                    :class="{ [$style['info-border']]: info.isBorderBottom }"
                  /> -->
                </template>
              </div>
            </div>
          </template>

          <!-- 實際到帳 -->
          <!-- 出現條件：選擇需要绑定的錢包且已綁定 || 選非綁定錢包的支付方式 -->
          <div
            v-if="
              (isSelectBindWallet() && curPassRoad.is_bind_wallet) ||
                !isSelectBindWallet()
            "
            :class="$style['money-info-wrap']"
          >
            <span
              v-if="curPayInfo.payment_method_name === '代客充值'"
              :class="$style['feature-tip-title']"
            >
              <!-- 实际到帐： ¥{{ realSaveMoney }} -->
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
                v-if="offerInfo.offer_enable && +offerInfo.offer_percent > 0"
                @click="showRealStatusType(true)"
              >
                (充值优惠)
              </span>
              <span
                v-else-if="
                  +getPassRoadOrAi.fee_percent || +getPassRoadOrAi.fee_amount
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
                <li
                  v-if="
                    +getPassRoadOrAi.fee_percent || +getPassRoadOrAi.fee_amount
                  "
                >
                  • {{ feeText }}
                </li>

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

          <!-- Todo: disable 狀態統整 -->
          <div
            :class="[
              $style['pay-button'],
              {
                [$style.disabled]:
                  !checkSuccess ||
                  !isBlockChecked ||
                  nameCheckFail ||
                  (isSelectBindWallet() && !this.curPassRoad.is_bind_wallet) ||
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
            v-if="curModeGroup.payment_group_memo"
            :class="[$style['feature-tip-wrap'], 'clearfix']"
          >
            <p :class="$style['warm-tip-title']">
              {{ $text("S_TIPS", "温馨提示") }}
            </p>
            <!-- eslint-disable vue/no-v-html -->
            <div
              :class="$style['warm-tip']"
              v-html="curModeGroup.payment_group_memo"
            />
            <!-- eslint-enable vue/no-v-html -->
          </div>
        </div>
      </template>
    </div>

    <deposit-info
      v-if="submitStatus === 'stepTwo'"
      :order-data="orderData"
      :is-show.sync="isShow"
      :required-fields="curPayInfo.field"
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
              <li @click="submitInfo">确定</li>
              <!-- has_csr: 是否啟用代客充值 -->
              <li v-if="entryBlockStatusData.has_csr" @click="goToValetDeposit">
                代客充值
              </li>
            </ul>
          </div>
        </div>
      </template>
      <!-- 通道提示 -->
      <template v-if="showPopStatus.type === 'payTip'">
        <div>
          <div :class="$style['pop-message-mark']" />
          <div :class="$style['entry-message-container']">
            <div :class="[$style['entry-message-content']]">
              <p>通道提示</p>
              <div :class="$style['wrap-line']" v-html="curPassRoad.tip" />
            </div>
            <div
              :class="[$style['entry-message-confirm']]"
              @click="setPopupStatus(false, '')"
            >
              关闭
            </div>
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
          :bank-selected="defaultEpointWallet.account"
          :bank-list="userBankOption"
          :item-func="setEpointBank"
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

export default {
  components: {
    depositInfo: () =>
      import(/* webpackChunkName: 'depositInfo' */ "./components/depositInfo"),
    eleLoading: () =>
      import(
        /* webpackChunkName: 'eleLoading' */ "@/router/web/components/tpl/common/element/loading/circle"
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
      tipTrans: { HOT: "recommend", EVENT: "event", FAST: "speed",HIGH:"high",LOW:"low" },

      nameCheckFail: false,

      entryBlockStatusData: null,
      isBlockChecked: false,

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
      bcMoneyShowType: false
    };
  },
  watch: {
    //   channel
    passRoad() {
      console.log("all passRoad", this.passRoad);
      this.showEpointWalletAddress = this.isSelectBindWallet(34,41)
        ? this.defaultEpointWallet.account === "其他银行卡"
        : false;
    },
    curPassRoad() {
      console.log("passRoad", this.curPassRoad);      
      if (this.curPassRoad.tip != undefined) {
        if (this.curPassRoad.tip === "" && this.curPassRoadTipText != "") {
          //有到無因特效需delay
          setTimeout(() => {
            this.curPassRoadTipText = this.curPassRoad.tip.replace(
              "\n",
              "<br>"
            );
            this.curPassRoadTipTextShowMore =
              this.curPassRoadTipText.replace(/[^\x00-\xff]/g,"**").length > 45 ||
              this.curPassRoadTipText.indexOf("<br>") != -1;
          }, 500);
        } else {
          this.curPassRoadTipText = this.curPassRoad.tip.replace("\n", "<br>");
          this.curPassRoadTipTextShowMore =
            this.curPassRoadTipText.replace(/[^\x00-\xff]/g,"**").length > 45 ||
            this.curPassRoadTipText.indexOf("<br>") != -1;
        }
      }
    },
    getPassRoadOrAi() {
      if (
        this.getPassRoadOrAi.amounts &&
        this.getPassRoadOrAi.amounts.length > 0
      ) {
        this.moneyValue = this.getPassRoadOrAi.amounts[0];
        this.displayMoneyValue = this.formatThousandsCurrency(this.moneyValue);
        this.changeMoney(this.getPassRoadOrAi.amounts[0]);
      }
    },
    curPayInfo(value) {
      if (!this.curPayInfo.payment_method_name) {
        return;
      }
      if (this.curPayInfo.payment_method_name === "代客充值") {
        this.checkSuccess = true;
      }

      if (
        this.curPayInfo.banks.length === 1 &&
        this.paySelectData["changeBank"] &&
        this.paySelectData["changeBank"].allData
      ) {
        // this.checkSuccess = true;
        this.paySelectType = "changeBank";
        this.changeSelectValue(
          this.paySelectData["changeBank"].allData[0].value
        );
      }

      // 選到 CGPay 時，取得 CGPay balance 的 func
      if (this.isSelectBindWallet(16, 36)) {
        this.getCGPayBalance();
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
    paySelectData() {
      return {
        payMethod: {
          selectTitle: this.$text("S_SELECT_PAY_MODE", "请选择支付方式"),
          curInfo: {
            ...this.curPayInfo,
            selectId: this.curPayInfo.payment_method_id,
            objKey: "payMethod"
          },
          allData: this.curModeGroup.payment_group_content.map(info => ({
            ...info,
            selectId: info.payment_method_id,
            mainTitle: info.bank_name || info.payment_method_name,
            subTitle: info.payment_type_name
          }))
        },
        payPass: {
          selectTitle: this.$text("S_SELECT_PAY_PASS", "请选择支付通道"),
          curInfo: {
            ...this.curPassRoad,
            selectId: this.curPassRoad.id,
            objKey: "payPass"
          },
          allData: this.passRoad.map(info => ({
            ...info,
            selectId: info.id
          }))
        },
        changeBank: {
          selectTitle: this.$text("S_CHANGE_BANK", "请选择支付银行"),
          curInfo: {
            ...this.curSelectedBank,
            selectId:
              this.allBanks.length > 0
                ? this.curSelectedBank.value || this.allBanks[0].value
                : "",
            objKey: "changeBank"
          },
          allData: this.allBanks.map(info => ({
            ...info,
            selectId: info.value,
            mainTitle: info.label
          }))
        }
      };
    },
    nowSelectData: {
      get() {
        return this.paySelectData[this.paySelectType].curInfo;
      },
      set(value) {
        if (this.paySelectType === "payMethod") {
          this.changePayMode(value);
          this.curSelectedBank = this.allBanks[0] || {};
          return;
        }

        if (this.paySelectType === "changeBank") {
          this.curSelectedBank = value;
          return;
        }

        if (this.paySelectType === "payPass") {
          this.changePassRoad(value);
        }
      }
    },
    /**
     * 金額是否輸入錯誤
     *
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
          this.getPayGroup();
        }

        this.submitStatus = value;
        this.moneyValue = "";
        this.displayMoneyValue = "";
        this.isErrorMoney = false;
      }
    },
    allInputData() {
      return [
        {
          objKey: "depositMethod",
          title: "充值方式",
          selectTitle: "请选择充值方式",
          value: this.speedField.depositMethod,
          selectData: [
            {
              mainTitle: this.$text("S_ONLINE_BANK", "网银"),
              selectId: "1"
            },
            {
              mainTitle: "ATM",
              selectId: "2"
            },
            {
              mainTitle: this.$text("S_BANK_COUNTER", "银行柜台"),
              selectId: "4"
            },
            {
              mainTitle: this.$text("S_MOBILE_TRANSFER", "手机银行转帐"),
              selectId: "8"
            },
            {
              mainTitle: this.$text("S_ZALO_PAY", "其他"),
              selectId: "16"
            }
          ],
          showCondition: this.curPayInfo.field.find(
            e => e.name === "method" && e.required
          ),
          //   showCondition: this.curPayInfo.field.find((e) => e.name === 'method'),
          isError: false
        },
        {
          objKey: "depositAccount",
          title: "充值银行帐号",
          value: this.speedField.depositAccount,
          placeholderText: "请输入充值银行帐号",
          showCondition: this.curPayInfo.field.find(
            e => e.name === "pay_account" && e.required
          ),
          //   showCondition: this.curPayInfo.field.find((e) => e.name === 'pay_account'),
          isError:
            this.showError &&
            this.curPayInfo.field.find(
              item => item.name === "pay_account" && item.required
            ) &&
            !this.speedField.depositAccount
        },
        {
          objKey: "depositTime",
          title: "充值时间(当地)",
          value: this.speedField.depositTime,
          placeholderText: "请选择充值时间",
          showCondition: this.curPayInfo.field.find(
            e => e.name === "deposit_at" && e.required
          ),
          // showCondition: this.curPayInfo.field.find(e => {
          //   const isShow = e.name === "deposit_at";
          //   // 目前需求：只有極速xx銀行，要在第一頁連同顯示此欄位
          //   if (
          //     isShow &&
          //     this.curPayInfo.payment_method_id === 6 &&
          //     this.curPayInfo.payment_type_id === 5
          //   ) {
          //     return true;
          //   } else {
          //     return false;
          //   }
          // }),
          isError:
            this.showError &&
            this.curPayInfo.field.find(
              item => item.name === "deposit_at" && item.required
            ) &&
            !this.speedField.depositTime
        },
        {
          objKey: "bankBranch",
          title: this.$text("S_DEPOSIT_BRANCH", "银行支行"),
          value: this.speedField.bankBranch,
          placeholderText: this.$text(
            "S_ENTER_DEPOSIT_BRANCH",
            "请输入银行支行"
          ),
          showCondition:
            this.speedField.depositMethod === "2" ||
            this.speedField.depositMethod === "4",
          isError:
            this.showError &&
            this.curPayInfo.field.find(
              item => item.name === "method" && item.required
            ) &&
            !this.speedField.bankBranch &&
            ["2", "4"].includes(this.speedField.depositMethod)
        },
        {
          objKey: "serialNumber",
          title: this.$text("S_SERIAL_NUMBER2", "流水号"),
          value: this.speedField.serialNumber,
          placeholderText: this.$text(
            "S_PLZ_ENTER_SERIAL_NUMBER",
            "请输入流水号"
          ),
          showCondition: this.curPayInfo.field.find(
            e => e.name === "sn" && e.required
          ),
          // showCondition:
          //   this.curPayInfo &&
          //   this.curPayInfo.field &&
          //   this.curPayInfo.field.find(e => {
          //     const isShow = e.name === "sn";
          //     // 目前需求：只有極速xx銀行，要在第一頁連同顯示此欄位
          //     if (
          //       isShow &&
          //       this.curPayInfo.payment_method_id === 6 &&
          //       this.curPayInfo.payment_type_id === 5
          //     ) {
          //       return true;
          //     } else {
          //       return false;
          //     }
          //   }),
          isError:
            this.showError &&
            this.curPayInfo.field.find(
              item => item.name === "sn" && item.required
            ) &&
            !this.speedField.serialNumber
        }
      ];
    },
    depositNameInput() {
      // return this.allInputData.find((item) => item.objKey === 'depositName');
      return {
        objKey: "depositName",
        title:
          this.curPayInfo.payment_type_id === 6
            ? this.$text("S_DEPOSIT_NICKNAME", "充值昵称")
            : this.$text("S_DEPOSIT_NAME", "请输入充值人姓名"),
        value: this.speedField.depositName,
        placeholderText:
          this.curPayInfo.payment_type_id === 6
            ? this.$text("S_ENTER_DEPOSIT_NICKNAME", "请输入充值昵称")
            : this.$text("S_ENTER_DEPOSIT_NAME", "请输入充值人姓名"),
        showCondition: this.curPayInfo.field
          ? this.curPayInfo.field.find(
              e => e.name === "pay_username" && e.required
            )
          : false,
        isError:
          this.showError &&
          this.curPayInfo.field.find(
            item => item.name === "pay_username" && item.required
          ) &&
          !this.speedField.depositName
      };
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
          this.getPayGroup(),
          this.getUserBankList(),
          this.checkEntryBlockStatus(),
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
      // 億元 USDT 的部份仍以彈窗顯示
      if (
        ["ey1"].includes(this.themeTPL) &&
        (this.curPayInfo.payment_method_id === 402 ||
          this.curPayInfo.payment_method_id === 404)
      ) {
        this.bindWalletType = "USDT";
        this.eyBindWalletData = this.curPayInfo;
        this.setPopupStatus(true, "bindWallet");
        return;
      }
      switch (this.curPayInfo.payment_method_id) {
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
            `/mobile/mcenter/bankCard?redirect=deposit&type=wallet&wallet=bcwallet&swift=${this.curPayInfo.swift_code}`
          );
          break;
        // E点付
        case 34:
          this.$router.push(
            `/mobile/mcenter/bankCard?redirect=deposit&type=wallet&wallet=epoint&swift=${this.curPayInfo.swift_code}`
          );
          break;
        // e点富
        case 41:
          this.$router.push(
            `/mobile/mcenter/bankCard?redirect=deposit&type=wallet&wallet=epointNew&swift=${this.curPayInfo.swift_code}`
          );
          break;

        // 購寶
        case 22:
          this.$router.push(
            `/mobile/mcenter/bankCard?redirect=deposit&type=wallet&wallet=goBao&swift=${this.curPayInfo.swift_code}`
          );

          break;

        // usdt
        case 402:
        case 404:
          this.$router.push(
            `/mobile/mcenter/bankCard?redirect=deposit&type=wallet&wallet=usdt&swift=${this.curPayInfo.swift_code}`
          );

          break;
      }
      return;
    },
    modeChange(listItem, index) {
      if (this.curModeGroup.payment_group_id === listItem.payment_group_id) {
        return;
      }
      if (this.submitStatus === "stepTwo") {
        this.submitStatus = "stepOne";
      }

      this.checkEntryBlockStatus();
      this.changeMode(listItem);

      if (this.allBanks && this.allBanks.length > 0) {
        this.defaultCurPayBank();
      }
    },
    /**
     * 顯示選擇框
     * @method changeType
     */
    changeType(payType) {
      this.paySelectType = payType;
    },
    clickSubmit() {
      if (this.routerTPL === "sg1") {
        sendUmeng(49);
      } else {
        sendUmeng(50);
      }
      // 代客充值
      if (
        this.curPayInfo.payment_method_id === 20 &&
        this.entryBlockStatusData.status < 3
      ) {
        this.submitInfo();
        return;
      }

      // 重新檢查狀態
      if (this.entryBlockStatusData === null) {
        this.checkEntryBlockStatus(true);
        return;
      }
      //幣希檢查餘額
      if (this.curPayInfo.payment_method_id === 32) {
        if (+this.cryptoMoney > +this.selectBcCoin.balance) {
          this.actionSetGlobalMessage({
            msg: "币希钱包余额不足"
          });
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
          this.actionSetGlobalMessage({
            msg: this.entryBlockStatusData.custom_point
          });

          setTimeout(() => {
            window.open(this.entryBlockStatusData.external_url);
            return;
          }, 700);

          break;

        default:
          this.setPopupStatus(true, "blockStatus");
          break;
      }
    },
    /**
     * 提交訂單
     * @method submitInfo
     */
    submitInfo() {
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
      this.submitList().then(response => {
        // 重置阻擋狀態
        this.checkEntryBlockStatus();
        this.entryBlockStatusData = null;

        if (response) {
          if (response.status === "NameFail") {
            this.actionSetGlobalMessage({
              msg: "请输入正确名称"
            });
            this.nameCheckFail = true;
          }

          if (response.status === "local") {
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
            // this.resetStatus();
            if (this.getPassRoadOrAi.amounts.length > 0) {
              this.changeMoney(this.getPassRoadOrAi.amounts[0]);
            } else {
              this.changeMoney("", true);
            }
            this.cryptoMoney = "--";
            this.resetTimerStatus();
          }
        }
      });
    },
    getImg(image_url) {
      // let imgId = info.swift_code || info.selectId;

      // if (info.bank_id === 0) {
      //   if (info.payment_method_id === 20 && info.payment_type_id === 11) {
      //     imgId = 70000;
      //   }

      //   if (info.payment_method_id === 3 && info.payment_type_id === 5) {
      //     imgId = 70001;
      //   }

      //   if (info.payment_method_id === 1 && info.payment_type_id === 1) {
      //     imgId = 70002;
      //   }
      // }
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
    curPay(curPayInfo) {
      if (
        Object.keys(curPayInfo).length &&
        curPayInfo.field.find(item => item.required) &&
        [5, 6].includes(curPayInfo.payment_type_id)
      ) {
        return true;
      }
      return false;
    },
    changeSelectValue(val) {
      this.isShowPop = false;
      const index = this.paySelectData[this.paySelectType].allData
        .map(item => item.value)
        .indexOf(val);
      this.nowSelectData = this.paySelectData[this.paySelectType].allData[
        index
      ];
    },
    checkEntryBlockStatus(showMsg = false) {
      // 使用者存款封鎖狀態
      this.isBlockChecked = false;
      return goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Ext/CreateEntryBlock/User/Check`,
        params: {
          t_user_id: this.memInfo.user.user_id,
          t_user_name: this.memInfo.user.username
        }
      })
        .then(res => {
          this.isBlockChecked = true;
          if (res.status === "000" && res.data) {
            this.entryBlockStatusData = res.data;
          } else {
            // 存款功能無法使用
            if (res.code !== "TM020074" || showMsg) {
              this.actionSetGlobalMessage({
                msg: res.msg,
                code: res.code
              });
            }
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
    // 代客充值
    goToValetDeposit() {
      this.closePopup();
      // let newWindow = "";
      // if (isPWA) {
      //   newWindow = window.open("", "", "_blank", true);
      // }

      // const newWindowHref = uri => {
      //   try {
      //     newWindow.location.href = uri;
      //   } catch (e) {
      //     console.log(e);
      //     console.log(newWindow);
      //     console.log(uri);
      //   }
      // };

      // 前往代客充值
      if (
        this.entryBlockStatusData.has_csr &&
        this.entryBlockStatusData.external_url
      ) {
        // if (isPWA) {
        //   newWindowHref(this.entryBlockStatusData.external_url);
        //   return;
        // }

        window.open(this.entryBlockStatusData.external_url);
        return;
      }

      return;
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

          this.isErrorMoney = false;
          this.cryptoMoney = val ? this.cryptoMoney : "--";

          this.verificationMoney(this.moneyValue);
          this.checkOrderData();
        });
      }

      // 如果是迅付欄位
      if (isSpeedField) {
        if (target === "depositName") {
          this.actionVerificationFormData({
            target: "name",
            value: value
          }).then(val => {
            // this.checkSuccess = val ? true : false;

            this.speedField.depositName = val;
          });
        }
        this.checkOrderData();
      }
    },
    isSelectBindWallet(...args) {
      // 選擇特定錢包種類
      if (args.length > 0) {
        return args.includes(this.curPayInfo.payment_method_id);
      }

      return (
        this.curPayInfo.payment_method_id === 16 ||
        this.curPayInfo.payment_method_id === 25 ||
        this.curPayInfo.payment_method_id === 30 ||
        this.curPayInfo.payment_method_id === 36 || //OSPay-CGP 
        this.curPayInfo.payment_method_id === 37 || //OSPay-USDT(ERC20)
        this.curPayInfo.payment_method_id === 38 || //OSPay-USDT(TRC20)
        this.curPayInfo.payment_method_id === 22 ||
        this.curPayInfo.payment_method_id === 32 ||
        this.curPayInfo.payment_method_id === 34 ||
        this.curPayInfo.payment_method_id === 41 ||
        this.curPayInfo.payment_method_id === 402 ||
        this.curPayInfo.payment_method_id === 404
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
    setDefaultDate() {
      Date.prototype.Format = function(fmt) {
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小時
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          S: this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt))
          fmt = fmt.replace(
            RegExp.$1,
            (this.getFullYear() + "").substr(4 - RegExp.$1.length)
          );
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(
              RegExp.$1,
              RegExp.$1.length == 1
                ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length)
            );
        return fmt;
      };
      //預設當前時間
      this.speedField["depositTime"] = new Date().Format("yyyy-MM-dd hh:mm:ss");
    },
    showRealStatusType(type) {
      this.showRealStatus = type;
      if (type) {
        this.getPayOffer(this.moneyValue);
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
    toggleEye(value) {
      if(value === 'cg'){
        this.isShowCGPPwd = !this.isShowCGPPwd;
      }else{
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
    }
  }
};
</script>

<style
  lang="scss"
  src="./css/bankCardDeposit/porn1.scss"
  module="$style_porn1"
></style>
<style
  lang="scss"
  src="./css/bankCardDeposit/ey1.scss"
  module="$style_ey1"
></style>
<style
  lang="scss"
  src="./css/bankCardDeposit/sg1.scss"
  module="$style_sg1"
></style>
