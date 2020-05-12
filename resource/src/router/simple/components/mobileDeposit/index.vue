<template>
  <div :class="$style['simple-deposit-wrap']">
    <div :class="$style['header-wrap']">
      <span v-if="memInfo.config.domain_name" :class="$style['header-title']">{{
        memInfo.config.domain_name[curLang]
      }}</span>
      <div :class="$style['website-btn']" @click="goHome">
        {{ $text("S_HOME_ONE", "官网首页") }}
      </div>
    </div>
    <div :class="$style['content-wrap']">
      <div :class="$style['username-wrap']">
        <span :class="$style['member-title']">{{
          $text("S_NAME", "会员帐号")
        }}</span>
        <div :class="$style['username-input-wrap']">
          <input
            v-model="username"
            :class="$style['username-input']"
            :placeholder="$text('S_ENTER_USERNAME', '请输入会员帐号')"
            @blur="getPayUserData"
          />
          <icon
            v-if="imgType"
            :class="[$style['img-icon'], $style[`img-${imgType}`]]"
            :name="imgType === 'success' ? 'check-circle' : 'times-circle'"
          />
        </div>
      </div>
      <li :class="$style['username-tip']">
        {{
          $text(
            "S_DEPOSIT_TIP01",
            "请确认您的帐号，款项存入后，即无法取消或变更帐号"
          )
        }}
      </li>
      <preview-deposit v-if="!isShowDeposit" />
      <template v-else>
        <!-- 導覽選單 -->
        <div
          v-if="!submitStatus"
          :class="[$style['deposit-list-wrap'], 'clearfix']"
        >
          <div
            v-for="listItem in depositData"
            :key="`mode-item-${listItem.payment_group_id}`"
            :title="listItem.payment_group_name || listItem.name"
            :class="$style['mode-item']"
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
              <div :class="[$style['feature-wrap'], 'clearfix']">
                <p :class="$style['bank-card-title']">
                  {{ $text("S_SELECT_PAY_MODE", "请选择支付方式") }}
                </p>
                <div
                  :class="$style['pay-mode-item']"
                  @click="changeType('payMethod')"
                >
                  <span :class="$style['pay-main-title']"
                    >{{
                      curPayInfo.bank_name || curPayInfo.payment_method_name
                    }}
                    - {{ curPayInfo.payment_type_name }}</span
                  >
                </div>
              </div>
              <!-- 選擇銀行 -->
              <div
                v-if="curPayInfo.banks && curPayInfo.banks.length > 0"
                :class="[$style['feature-wrap'], 'clearfix']"
              >
                <span :class="$style['bank-card-title']">{{
                  curPayInfo.payment_method_id === 2
                    ? $text("S_SELECT_POINT_CARD", "请选择点卡")
                    : $text("S_SELECT_BANKS", "请选择银行")
                }}</span>
                <div
                  :class="$style['pay-mode-item']"
                  @click="changeType('chagneBank')"
                >
                  <span :class="$style['pay-main-title']">{{
                    bankSelectValue.label
                  }}</span>
                </div>
              </div>
              <!-- 通道 -->
              <div
                v-if="!isDepositAi && passRoad.length > 0"
                :class="[$style['feature-wrap'], 'clearfix']"
              >
                <span :class="$style['bank-card-title']"
                  >{{ $text("S_SELECT_PAY_PASS", "请选择支付通道") }}（{{
                    $text("S_PAY_PASS_TIP", "若通道无法存款，请点选其他通道")
                  }}）</span
                >
                <div
                  :class="$style['bank-feature-wrap']"
                  @click="changeType('payPass')"
                >
                  <div :class="$style['pay-mode-pass']">
                    {{ curPassRoad.mainTitle }}
                  </div>
                </div>
              </div>
              <!-- 存款金額 -->
              <div :class="[$style['feature-wrap'], 'clearfix']">
                <div
                  v-if="!isDepositAi"
                  :class="[
                    $style['bank-card-title'],
                    { [$style['is-error']]: isErrorMoney }
                  ]"
                >
                  {{ $text("S_SINGLE_LIMIT", "单笔限额") }} :
                  {{
                    Number(depositInterval.maxMoney) === 0
                      ? $text("S_UNLIMITED", "无限制")
                      : $text("S_MONEY_RANGE_SHORT", {
                          replace: [
                            { target: "%s", value: depositInterval.minMoney },
                            { target: "%s", value: depositInterval.maxMoney }
                          ]
                        })
                  }}
                </div>
                <div
                  v-if="isDepositAi"
                  :class="[
                    $style['bank-card-title'],
                    { [$style['is-error']]: isErrorMoney }
                  ]"
                >
                  {{
                    $text(
                      "S_SUBMIT_ORDER_SYSTEM_AUO_ALLOCATES",
                      "提交订单时，系统自动调配最佳存款金额"
                    )
                  }}
                </div>
                <div
                  v-if="
                    !isDepositAi &&
                      (Object.keys(curPassRoad).length === 0 ||
                        curPassRoad.is_custom_amount)
                  "
                  :class="[
                    $style['feature-deposit-wrap'],
                    { [$style['is-error-line']]: isErrorMoney }
                  ]"
                >
                  <div :class="$style['money-input-wrap']">
                    <input
                      v-model="moneyValue"
                      :class="$style['deposit-input']"
                      :placeholder="
                        $text('S_ENTER_DEPOSIT_MONEY', '请输入存款金额')
                      "
                      type="number"
                      pattern="[0-9]*"
                      @blur="verificationMoney(moneyValue)"
                      @input="updateInput($event, $event.target.value)"
                    />
                  </div>
                </div>
                <div
                  v-if="isDepositAi || curPassRoad.is_recommend_amount"
                  class="speed-money-wrap"
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
                </div>
              </div>
              <!-- 實際存入 -->
              <div :class="[$style['feature-tip-wrap'], 'clearfix']">
                <div :class="[$style['money-info-wrap'], 'clearfix']">
                  <span :class="$style['feature-tip-title']">{{
                    $text("S_ESTIMATE_ENTER", "预计存入")
                  }}</span>
                  <span :class="$style['amount-text']">{{
                    realSaveMoney
                  }}</span>
                </div>
                <div :class="$style['money-tip-wrap']">
                  <!-- eslint-disable vue/no-v-html -->
                  <li
                    v-if="curPayInfo.offer_enable"
                    :class="$style['tip-list']"
                    v-html="promitionText"
                  />
                  <!-- eslint-enable vue/no-v-html -->
                  <li
                    v-if="
                      +getPassRoadOrAi.fee_percent ||
                        +getPassRoadOrAi.fee_amount
                    "
                    :class="$style['tip-list']"
                  >
                    {{ feeText }}
                  </li>
                </div>
              </div>
              <div
                v-if="
                  curPayInfo.field.find(item => item.required) &&
                    [5, 6].includes(curPayInfo.payment_type_id)
                "
                :class="$style['speed-input-wrap']"
              >
                <span :class="$style['speed-input-title']">{{
                  $text("S_REMITTANCE_INFO", "汇款资料")
                }}</span>
                <speed-pay-field
                  :show-by-required-fields="true"
                  :required-fields="curPayInfo.field"
                  :speed-field.sync="resultSpeedField"
                  :method-id="curPayInfo.payment_method_id"
                  :type-id="curPayInfo.payment_type_id"
                />
              </div>
              <div
                :class="$style['pay-button']"
                :title="$text('S_ENTER_PAY', '立即充值')"
                @click="submitInfo"
              >
                {{ $text("S_ENTER_PAY", "立即充值") }}
              </div>
              <!-- 溫馨提醒 -->
              <div
                v-if="curModeGroup.payment_group_memo"
                :class="[$style['feature-tip-wrap'], 'clearfix']"
              >
                <span :class="$style['warm-tip-title']">{{
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
              <div :class="[$style['feature-wrap'], 'clearfix']">
                <p :class="$style['bank-card-title']">
                  {{ $text("S_SELECT_PAY_MODE", "请选择支付方式") }}
                </p>
                <div
                  :class="$style['pay-mode-item']"
                  @click="changeType('payMethod')"
                >
                  <span :class="$style['pay-main-title']">{{
                    curModeGroup.alias
                  }}</span>
                </div>
              </div>
              <div
                :class="$style['pay-button']"
                :title="$text('S_ENTER_PAY', '立即充值')"
                @click="submitInfo"
              >
                {{ $text("S_ENTER_PAY", "立即充值") }}
              </div>
            </div>
            <select-box
              v-if="isSelectShow"
              :select-data="paySelectData[paySelectType].allData"
              :now-select-cur.sync="nowSelectData"
              :close-fuc="isShowSelect"
              :title="paySelectData[paySelectType].selectTitle"
            />
          </template>
        </div>
        <deposit-info
          v-if="submitStatus === 'stepTwo'"
          :order-data="orderData"
          :is-show.sync="isShow"
          :required-fields="curPayInfo.field"
          :submit-status.sync="nowSubmitStatus"
        />
      </template>
    </div>
    <div :class="$style['footer-wrap']">
      <span v-if="memInfo.config.domain_name"
        >Copyright ©
        {{ memInfo.config.domain_name[$i18n.locale] }} Reserved.</span
      >
    </div>
    <div v-if="isShow" :class="$style['loading-wrap']">
      <div :class="$style['loading-item']">
        <ele-loading />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import mixin from '@/mixins/mcenter/deposit/bankCardDeposit';

export default {
  // 手機版自適應
  metaInfo: {
    meta: [{
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'
    }]
  },
  components: {
    depositInfo: () => import(/* webpackChunkName: 'depositInfo' */ './components/depositInfo'),
    eleLoading: () => import(/* webpackChunkName: 'eleLoading' */ '@/router/web/components/tpl/common/element/loading/circle'),
    selectBox: () => import(/* webpackChunkName: 'selectBox' */ './components/common/selectBox'),
    speedPayField: () => import(/* webpackChunkName: 'speedPayField' */ './components/common/speedPayField'),
    previewDeposit: () => import(/* webpackChunkName: 'previewDeposit' */ './components/previewDeposit')
  },
  mixins: [mixin],
  data() {
    return {
      imgType: '',
      isShowDeposit: false,
      submitStatus: '',
      isSelectShow: false,
      paySelectType: '',
      isShow: false
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      curLang: 'getCurLang'
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
        this.submitStatus = value;
        this.moneyValue = '';
        this.isErrorMoney = false;
        this.isSelectShow = false;
      }
    },
    resultSpeedField: {
      get() {
        return this.speedField;
      },
      set(value) {
        this.speedField[value.objKey] = value.data;
      }
    },
    paySelectData() {
      return {
        payMethod: {
          selectTitle: this.$text('S_SELECT_PAY_MODE', '请选择支付方式'),
          curInfo: {
            ...this.curPayInfo,
            selectId: this.curPayInfo.payment_method_id,
            objKey: 'payMethod'
          },
          allData: this.curModeGroup.payment_group_content.map((info) => ({
            ...info,
            selectId: info.payment_method_id,
            mainTitle: info.bank_name || info.payment_method_name,
            subTitle: info.payment_type_name
          }))
        },
        payPass: {
          selectTitle: this.$text('S_SELECT_PAY_PASS', '请选择支付通道'),
          curInfo: {
            ...this.curPassRoad,
            selectId: this.curPassRoad.id,
            objKey: 'payPass'
          },
          allData: this.passRoad.map((info) => ({
            ...info,
            selectId: info.id
          }))
        },
        chagneBank: {
          selectTitle: this.$text('S_CHANGE_BANK', '请选择支付银行'),
          curInfo: {
            ...this.bankSelectValue,
            selectId: this.allBanks.length > 0 ? this.bankSelectValue.value || this.allBanks[0].value : '',
            objKey: 'chagneBank'
          },
          allData: this.allBanks.map((info) => ({
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
        if (this.paySelectType === 'payMethod') {
          this.changePayMode(value);
          this.bankSelectValue = this.allBanks[0] || {};
          return;
        }

        if (this.paySelectType === 'chagneBank') {
          this.bankSelectValue = value;
          return;
        }

        if (this.paySelectType === 'payPass') {
          this.changePassRoad(value);
        }
      }
    }
  },
  created() {
    this.actionSetUserdata();
  },
  methods: {
    ...mapActions([
      'actionSetUserdata'
    ]),
    getPayUserData() {
      if (!this.username) {
        alert(this.$text('S_ENTER_USERNAME', '请输入会员帐号'));
        this.imgType = '';
        return;
      }

      this.isShow = true;

      this.getPayGroup().then((responese) => {
        if (responese.result === 'ok') {
          this.isShowDeposit = true;
          this.imgType = 'success';
          return;
        }

        this.imgType = 'error';
        this.isShowDeposit = false;
        this.isShow = false;
        alert(responese.msg);
      });
    },
    modeChange(listItem) {
      this.changeMode(listItem);

      if (Object.keys(this.selectedBank).length === 0) {
        this.bankSelectValue = this.allBanks[0] || {};
      }

      if (!listItem.is_link) {
        this.nowSubmitStatus = 'stepOne';
      }
    },
    /**
     * 顯示選擇框
     * @method changeType
     */
    changeType(payType) {
      this.isShowSelect(true);
      this.paySelectType = payType;
    },
    /**
     * 金額輸入
     * @method updateInput
     * @param {String} moneyValue - 輸入金額
     */
    updateInput(e, value) {
      let nowValue = value;

      if (!value && e.data) {
        nowValue = this.moneyValue + e.data;
      }

      // 因input number無法阻擋e-+*，為阻擋這些符號，強制input更新
      this.moneyValue = nowValue;

      this.$nextTick(() => {
        this.submitInput(this.moneyValue);
      });
    },
    /**
     * 是否顯示選擇框
     * @method isShowSelect
     * @param {Boolean} show - 是否顯示
     */
    isShowSelect(show = '') {
      if (show !== '') {
        this.isSelectShow = show;
        return;
      }

      this.isSelectShow = !this.isSelectShow;
    },
    /**
     * 提交訂單
     * @method submitInfo
     */
    submitInfo() {
      if (!this.username) {
        alert(this.$text('S_ENTER_USERNAME', '请输入会员帐号'));
        this.imgType = '';
        return;
      }

      this.submitList().then((response) => {
        if (response.status === 'local') {
          this.submitStatus = 'stepTwo';
        }
      });
    },
    /**
     * 回到首頁
     * @method goHome
     */
    goHome() {
      window.location.href = `${window.location.origin}/mobile`;
    }
  }
};
</script>

<style lang="scss" src="@/css/index.scss"></style>
<style lang="scss" src="./css/index.scss" module></style>
