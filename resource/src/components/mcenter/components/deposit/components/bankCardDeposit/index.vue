<template>
  <div
    :class="[
      $style['deposit-wrap'],
      $style[`theme-${siteConfig.MCENTER_COLOR}`]
    ]"
  >
    <!-- 導覽選單 -->
    <div class="deposit-list-wrap">
      <div
        v-for="listItem in depositData"
        :key="`mode-item-${listItem.payment_group_id}`"
        :title="listItem.payment_group_name || listItem.name"
        :class="[
          $style['mode-item'],
          {
            [$style['is-current']]:
              curModeGroup.payment_group_id === listItem.payment_group_id
          }
        ]"
        @click="modeChange(listItem)"
      >
        {{ listItem.payment_group_name || listItem.name }}
      </div>
    </div>
    <div
      v-if="depositData.length > 0 && submitStatus === 'stepOne'"
      class="deposit-edit-wrap"
    >
      <template v-if="Object.keys(curModeGroup).length > 0">
        <div v-if="!curModeGroup.uri" :class="$style['bank-card-wrap']">
          <!-- 支付方式 -->
          <div class="clearfix">
            <p :class="$style['bank-card-title']">
              {{ $text("S_PAY_MODE", "支付方式") }}
            </p>
            <!-- 因銀行卡轉帳會有其他銀行分類，其他銀行一定為 bank_id = 0，payment_method_id 為支付方式(譬如：銀行匯款、極速到帳）-->
            <!-- 為判斷當前current，因此使用 payment_method_id 與 bank_id 判斷 -->
            <div :class="$style['pay-mode-item-wrap']">
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
                <img v-lazy="getImg(info)" :class="$style['pay-mode-img']" />
                <span :class="$style['pay-main-title']">{{
                  info.bank_name || info.payment_method_name
                }}</span>
                <span :class="$style['pay-sub-title']">{{
                  info.payment_type_name
                }}</span>
              </div>
            </div>
          </div>
          <!-- 選擇銀行 or 選擇點卡 -->
          <div
            v-if="curPayInfo.banks && curPayInfo.banks.length > 0"
            :class="[$style['feature-wrap'], 'clearfix']"
          >
            <span :class="$style['bank-card-title']">{{
              curPayInfo.payment_method_id === 2
                ? $text("S_SELECT_POINT_CARD_SHORT", "选择点卡")
                : $text("S_SELECT_BANKS_ONE", "选择银行")
            }}</span>
            <div :class="$style['banks-select-wrap']">
              <Multiselect
                v-model="bankSelectValue"
                :placeholder="$text('S_SELECTED', '请选择')"
                :options="allBanks"
                :searchable="false"
                :show-labels="false"
                track-by="value"
                label="label"
              />
            </div>
          </div>
          <!-- 通道 -->
          <div
            v-if="!isDepositAi && passRoad.length > 0"
            :class="[$style['feature-wrap'], 'clearfix']"
          >
            <span :class="$style['bank-card-title']">{{
              $text("S_PAY_PASS", "支付通道")
            }}</span>
            <div :class="$style['bank-feature-wrap']">
              <div
                v-for="(item, index) in passRoad"
                :key="`pass-road-${index}`"
                :class="[
                  $style['pay-mode-pass'],
                  { [$style['is-current']]: curPassRoad.id === item.id }
                ]"
                @click="changePassRoad(item)"
              >
                {{ item.mainTitle }}
              </div>
              <span :class="$style['pass-tip']">{{
                $text("S_PAY_PASS_TIP", "若通道无法存款，请点选其他通道")
              }}</span>
            </div>
          </div>
          <!-- 收款帳號 -->
          <div v-if="receiptInfo" :class="[$style['info-wrap'], 'clearfix']">
            <div :class="$style['deposit-info-title']">
              {{ $text("S_WITHDRAW_ACCOUNT", "收款帐号") }}
            </div>
            <div :class="$style['deposit-info-table']">
              <div
                v-for="(info, index) in receiptInfo"
                :key="`receipt-info-${index}`"
                :class="$style['deposit-info-tr']"
              >
                <div
                  :class="[
                    $style['deposit-info-td'],
                    $style['deposit-info-thead']
                  ]"
                >
                  {{ info.title }}
                </div>
                <div
                  v-if="info.qrcode && info.qrcode.length > 0"
                  :class="$style['deposit-info-td']"
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
                      />
                    </div>
                  </template>
                </div>
                <!-- eslint-disable vue/no-v-html -->
                <div
                  v-else-if="info.htmlShow"
                  :class="$style['deposit-info-td']"
                  v-html="info.value"
                />
                <!-- eslint-enable vue/no-v-html -->
                <div
                  v-else
                  :class="[
                    $style['deposit-info-td'],
                    { [$style['info-important']]: info.isFontBold }
                  ]"
                >
                  {{ info.value }}
                  <div
                    v-if="info.copyShow"
                    :class="$style['icon-wrap']"
                    @click="copyInfo(info.value)"
                  >
                    <icon name="copy" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 存款金額 -->
          <div :class="[$style['feature-wrap'], 'clearfix']">
            <span :class="$style['bank-card-title']">{{
              $text("S_DEPOSIT_MONEY", "存款金额")
            }}</span>
            <div :class="[$style['bank-feature-wrap']]">
              <div
                v-if="
                  !isDepositAi &&
                    (Object.keys(curPassRoad).length === 0 ||
                      curPassRoad.is_custom_amount)
                "
                :class="$style['money-input-wrap']"
              >
                <input
                  v-model="moneyValue"
                  :class="[
                    $style['deposit-input'],
                    { [$style['is-error']]: isErrorMoney }
                  ]"
                  :placeholder="
                    Number(depositInterval.maxMoney)
                      ? $text('S_MONEY_RANGE_SHORT', {
                          replace: [
                            {
                              target: '%s',
                              value: depositInterval.minMoney
                            },
                            {
                              target: '%s',
                              value: depositInterval.maxMoney
                            }
                          ]
                        })
                      : $text('S_ENTER_DEPOSIT_MONEY', '请输入存款金额')
                  "
                  @blur="verificationMoney(moneyValue)"
                  @input="submitInput($event.target.value)"
                />
                <span
                  v-if="isErrorMoney && depositInterval.maxMoney"
                  :class="$style['error-tip']"
                >
                  {{ $text("S_SINGLE_LIMIT", "单笔限额") }}：
                  {{
                    $text("S_MONEY_RANGE_SHORT", {
                      replace: [
                        {
                          target: "%s",
                          value: depositInterval.minMoney
                        },
                        {
                          target: "%s",
                          value: depositInterval.maxMoney
                        }
                      ]
                    })
                  }}
                </span>
              </div>
              <template
                v-if="
                  isDepositAi ||
                    (curPassRoad && curPassRoad.is_recommend_amount)
                "
              >
                <div
                  v-for="(item, index) in getPassRoadOrAi.amounts"
                  :key="`pay-money-${index}`"
                  :class="[
                    $style['pay-money-item'],
                    { [$style['is-current']]: moneyValue === item }
                  ]"
                  @click="changeMoney(item)"
                >
                  {{ item }}
                </div>
              </template>
              <p v-if="isDepositAi">
                {{
                  $text(
                    "S_SUBMIT_ORDER_SYSTEM_AUO_ALLOCATES",
                    "提交订单时，系统自动调配最佳存款金额"
                  )
                }}
              </p>
            </div>
          </div>
          <!-- 實際存入 -->
          <div :class="[$style['feature-wrap'], 'clearfix']">
            <span :class="$style['bank-card-title']">{{
              $text("S_ESTIMATE_ENTER", "预计存入")
            }}</span>
            <div :class="[$style['bank-feature-wrap']]">
              <span :class="$style['amount-text']">{{
                realSaveMoney || 0.0
              }}</span>
            </div>
          </div>
          <!-- 匯款資料必填欄位 -->
          <div>
            <!-- 銀行匯款 極速到帳 or 支付轉帳，才需要輸入存款資料 -->
            <div
              v-if="[5, 6].includes(curPayInfo.payment_type_id)"
              :class="$style['speed-input-wrap']"
            >
              <speed-pay-field-step1
                :class-style="$style"
                :required-field="curPayInfo.field"
                :speed-field.sync="resultSpeedField"
                :method-id="curPayInfo.payment_method_id"
                :type-id="curPayInfo.payment_type_id"
              />
            </div>
          </div>
          <div :class="$style['pay-button-wrap']">
            <div
              :class="[
                $style['pay-button'],
                { [$style['is-speed']]: curPayInfo.payment_method_id === 6 }
              ]"
              :title="$text('S_ENTER_PAY', '立即充值')"
              @click="submitInfo"
            >
              {{ $text("S_ENTER_PAY", "立即充值") }}
            </div>
            <!-- eslint-disable vue/no-v-html -->
            <li
              v-if="curPayInfo.offer_enable"
              :class="$style['tip-list']"
              v-html="promitionText"
            />
            <!-- eslint-enable vue/no-v-html -->
            <li
              v-if="+getPassRoadOrAi.fee_percent || +getPassRoadOrAi.fee_amount"
              :class="$style['tip-list']"
            >
              {{ feeText }}
            </li>
          </div>
          <!-- 溫馨提醒 -->
          <div
            v-if="curModeGroup.payment_group_memo"
            :class="[$style['feature-wrap'], 'clearfix']"
          >
            <span :class="$style['bank-card-title']">{{
              $text("S_TIPS", "温馨提示")
            }}</span>
            <!-- eslint-disable vue/no-v-html -->
            <div
              :class="$style['warm-tip']"
              v-html="curModeGroup.payment_group_memo"
            />
            <!-- eslint-enable vue/no-v-html -->
          </div>
        </div>
        <!-- 第三方存款 -->
        <div v-else :class="$style['bank-card-wrap']">
          <!-- 支付方式 -->
          <div class="clearfix">
            <p :class="$style['bank-card-title']">
              {{ $text("S_PAY_MODE", "支付方式") }}
            </p>
            <div :class="[$style['pay-mode-item'], $style['is-current']]">
              <img
                v-lazy="getImg({ bank_id: 'default' })"
                :class="$style['pay-mode-img']"
              />
              <span :class="$style['pay-third-main-title']">{{
                curModeGroup.alias
              }}</span>
            </div>
          </div>
          <div
            :class="$style['pay-third-button']"
            :title="$text('S_ENTER_PAY', '立即充值')"
            @click="submitInfo"
          >
            {{ $text("S_ENTER_PAY", "立即充值") }}
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
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Multiselect from 'vue-multiselect';
import mixin from '@/mixins/mcenter/deposit/bankCardDeposit';

export default {
  components: {
    Multiselect,
    depositInfo: () => import(/* webpackChunkName: 'depositInfo' */ './components/depositInfo'),
    speedPayFieldStep1: () => import(/* webpackChunkName: 'speedPayField' */ '../common/speedPayField/step1')
  },
  mixins: [mixin],
  data() {
    return {
      submitStatus: 'stepOne'
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: 'getSiteConfig'
    }),
    /**
     * 存款步驟
     *
     * @return String
     */
    nowSubmitStatus: {
      get() {
        return this.submitStatus;
      },
      set(value) {
        if (value === 'stepOne') {
          this.resetStatus();
          this.getPayGroup();
        }

        this.submitStatus = value;
        this.moneyValue = '';
        this.isErrorMoney = false;
      }
    },
    resultSpeedField: {
      get() {
        return this.speedField;
      },
      set(value) {
        this.speedField[value.objKey] = value.data;
      }
    }
  },
  created() {
    this.getPayGroup();
  },
  methods: {
    modeChange(listItem) {
      this.submitStatus = 'stepOne';
      this.changeMode(listItem);
    },
    /**
     * 取得銀行圖片
     * @method getImg
     * @param {Object} info - 當前銀行資料
     * @return {Object} 圖片路徑
     */
    getImg(info) {
      return {
        src: this.$getCdnPath(`/static/image/mcenter/bank/${info.bank_id}.png`),
        error: this.$getCdnPath('/static/image/mcenter/bank/default.png'),
        loading: this.$getCdnPath('/static/image/game_loading_s.gif')
      };
    },
    /**
     * 提交訂單
     * @method submitInfo
     */
    submitInfo() {
      this.submitList().then((response) => {
        if (response.status === 'local') {
          this.submitStatus = 'stepTwo';
        }
      });
    }
  }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
