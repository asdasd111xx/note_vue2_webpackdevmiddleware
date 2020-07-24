<template>
  <div
    :class="[
      $style['mode-wrap'],
      $style[`theme-${siteConfig.MCENTER_COLOR}`],
      colorClass
    ]"
  >
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
    <div
      v-if="depositData.length > 0 && submitStatus === 'stepOne'"
      :class="$style['deposit-edit-wrap']"
    >
      <template v-if="Object.keys(curModeGroup).length > 0">
        <div v-if="!curModeGroup.uri" :class="$style['bank-card-wrap']">
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
                      `/static/image/_new/mcenter/deposit/icon_${
                        tagTrans[info.tag]
                      }.png`
                    )
                  "
                  :class="$style['pay-mode-tag']"
                />
                <img v-lazy="getImg(info)" :class="$style['pay-mode-img']" />
                <div :class="$style['pay-main-title']">
                  {{ info.short_name }}
                </div>
                <div :class="$style['pay-sub-title']">
                  <template v-if="[5, 6].includes(info.payment_type_id)">
                    返利1%无上限
                  </template>
                </div>
                <img
                  v-if="
                    curPayInfo.payment_method_id === info.payment_method_id &&
                      curPayInfo.bank_id === info.bank_id
                  "
                  :class="$style['pay-active']"
                  src="/static/image/_new/common/select_active.png"
                />
              </div>
            </div>

            <!-- 客製額度轉帳入口 -->
            <div
              :class="[
                $style['pay-mode-item-wrap'],
                'clearfix',
                $style['credit-trans']
              ]"
            >
              <div
                :class="[$style['pay-mode-item']]"
                @click="handleCreditTrans"
              >
                <div :class="$style['pay-sub-title']">代收代付</div>
                <div :class="$style['pay-main-title']">返利1%+</div>
                <div :class="$style['pay-main-title']">代理分红</div>
              </div>
            </div>
          </div>

          <!-- 選擇銀行 or 選擇點卡 -->
          <!-- To Do: payment_type_id === 5 就顯示 -->
          <div
            v-if="
              (curPayInfo.banks && curPayInfo.banks.length > 0) ||
                (yourBankData.length > 0 && curPayInfo.payment_type_id === 5)
            "
            :class="[
              $style['feature-wrap'],
              $style['select-card-wrap'],
              'clearfix'
            ]"
            @click="changeType('chagneBank'), (isShowPop = true)"
          >
            <span
              v-if="curPayInfo.payment_type_id === 5"
              :class="$style['select-bank-title']"
            >
              {{ $text("S_YOUR_BANK", "您的银行") }}
            </span>
            <span v-else :class="$style['select-bank-title']"
              >{{
                curPayInfo.payment_method_id === 2
                  ? $text("S_SELECT_POINT_CARD", "请选择点卡")
                  : $text("S_SELECT_BANKS", "请选择银行")
              }}
            </span>
            <div :class="$style['select-bank-item']">
              {{ isSelectValue }}
            </div>
            <img
              :class="$style['select-bank-icon']"
              src="/static/image/_new/common/arrow_next.png"
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
                    v-for="item in paySelectData['chagneBank'].allData"
                    :key="item.selectId"
                    @click.stop="changeSelectValue(item.value)"
                  >
                    <img v-lazy="getImg(item)" />
                    {{ item.label }}
                    <icon
                      v-if="item.value === selectedBank.value"
                      :class="$style['select-active']"
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
                      submitDataInput(
                        $event.target.value,
                        depositNameInput.objKey
                      )
                    "
                  />
                </div>
              </div>
              <div
                :class="[
                  $style['deposit-name-messgae'],
                  { [$style['hide']]: !nameCheckFail && speedField.depositName }
                ]"
              >
                为即时到账，请务必输入正确的汇款人姓名
              </div>
            </div>
            <!-- 通道 -->
            <div
              v-if="!isDepositAi && passRoad.length > 0"
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
                    v-if="data.id === curPassRoad.id"
                    :class="$style['pay-active']"
                    src="/static/image/_new/common/select_active.png"
                  />
                </div>
              </div>
            </div>
            <!-- 存款金額 -->
            <div
              :class="[
                $style['feature-wrap'],
                $style['select-money'],
                'clearfix'
              ]"
            >
              <div :class="$style['bank-card-title']">充值金额</div>
              <div
                v-if="isDepositAi"
                :class="[
                  $style['bank-card-title'],
                  { [$style['is-error']]: isErrorMoney }
                ]"
              >
                提交订单时，系统自动调配最佳充值金额
              </div>
              <div
                v-if="isDepositAi || curPassRoad.is_recommend_amount"
                :class="[$style['speed-money-wrap'], 'clearfix']"
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
                  ¥ {{ item }}
                  <img
                    v-if="moneyValue === item"
                    :class="$style['pay-active']"
                    src="/static/image/_new/common/select_active.png"
                  />
                </div>
                <div
                  v-if="passRoad && passRoad[0] && passRoad[0].is_custom_amount"
                  :class="[$style['speed-money-wrap'], 'clearfix']"
                >
                  <!-- 自訂金額 -->
                  <div
                    :class="[
                      $style['pay-money-item'],
                      $style['custonm-item'],
                      { [$style['is-current']]: isCustonmAmount }
                    ]"
                    @click="changeMoney('', true)"
                  >
                    <span>
                      其他金额
                    </span>
                    <br />
                    <span>
                      {{
                        `(${passRoad[0].per_trade_min}~${passRoad[0].per_trade_max})`
                      }}
                    </span>
                    <img
                      v-if="isCustonmAmount"
                      :class="$style['pay-active']"
                      src="/static/image/_new/common/select_active.png"
                    />
                  </div>
                </div>
              </div>
              <!-- <div
                                v-if="
                                    !isDepositAi &&
                                        getPassRoadOrAi.amounts &&
                                        getPassRoadOrAi.amounts.length === 0
                                "
                                :class="$style['feature-deposit-wrap']"
                            >
                                <div
                                    :class="$style['pay-money-item']"
                                >
                                    --
                                </div>
                            </div> -->
              <div
                v-if="
                  !isDepositAi &&
                    (Object.keys(curPassRoad).length === 0 ||
                      curPassRoad.is_custom_amount)
                "
                :class="$style['feature-deposit-wrap']"
              >
                <div class="money-input-wrap">
                  <input
                    v-model="moneyValue"
                    :class="[
                      $style['deposit-input'],
                      { [$style.disable]: isDisableDepositInput }
                    ]"
                    :placeholder="singleLimit"
                    type="number"
                    pattern="[0-9]*"
                    @blur="verificationMoney(moneyValue)"
                    @input="updateInput($event, $event.target.value)"
                  />
                </div>
                <span :class="$style['deposit-input-icon']">¥</span>
              </div>
              <div
                v-if="!isDepositAi && isErrorMoney"
                :class="$style['money-input-tip']"
              >
                {{ singleLimit }}
              </div>
              <!-- 實際存入 -->
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
                    src="/static/image/_new/common/arrow_next.png"
                  />
                  <div :class="$style['field-title']">{{ info.title }}</div>
                  <div :class="$style['field-info']">
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
                                :src="`/static/image/_new/mcenter/default.png`"
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
                        v-model="speedField[info.objKey]"
                        :placeholder="info.placeholderText"
                        type="datetime"
                        format="YYYY-MM-DD HH:mm:ss"
                        value-type="format"
                        @input="submitDataInput(info.value, info.objKey)"
                      />
                    </template>
                    <input
                      v-else
                      v-model="speedField[info.objKey]"
                      :class="$style['speed-deposit-input']"
                      :placeholder="info.placeholderText"
                      @input="submitDataInput($event.target.value, info.objKey)"
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
              <div :class="$style['deposit-info-title']">
                {{ $text("S_WITHDRAW_ACCOUNT", "收款帐号") }}
              </div>
              <div :class="$style['deposit-submit-info']">
                <template v-for="(info, index) in receiptInfo">
                  <div
                    :key="`receipt-info-${index}`"
                    :class="$style['submit-info-wrap']"
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
                      <div
                        v-if="info.copyShow"
                        :class="$style['icon-wrap']"
                        @click="handleCopy(info.value)"
                      >
                        <div>
                          <icon name="regular/copy" width="12" height="12" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    :key="`border-line-${index}`"
                    :class="{ [$style['info-border']]: info.isBorderBottom }"
                  />
                </template>
              </div>
            </div>
          </template>
          <div :class="$style['money-info-wrap']">
            <span
              v-if="realSaveMoney > 0"
              :class="[$style['feature-tip-title'], $style.success]"
              @click="showRealStatus = true"
            >
              实际到账： ¥{{ realSaveMoney }} (详情)
            </span>
            <span
              v-else-if="curPayInfo.payment_method_name !== '代客充值'"
              :class="$style['feature-tip-title']"
              >实际到账： {{ realSaveMoney }}</span
            >
          </div>
          <div v-if="showRealStatus" :class="$style['pop-message']">
            <div :class="$style['pop-message-mark']" />
            <div :class="$style['message-container']">
              <ul :class="$style['message-content']">
                <li>• 实际到账： ¥{{ realSaveMoney }}</li>
                <template v-if="curPayInfo.offer_enable">
                  <li :class="$style['tip-list']" v-html="promitionText" />
                </template>
                <li
                  v-if="
                    +getPassRoadOrAi.fee_percent || +getPassRoadOrAi.fee_amount
                  "
                >
                  • {{ feeText }}
                </li>

                <li>
                  • 实际存入依审核结果为准
                </li>
              </ul>
              <div
                :class="$style['message-close']"
                @click="showRealStatus = false"
              >
                关闭
              </div>
            </div>
          </div>
          <div
            :class="[
              $style['pay-button'],
              {
                [$style.disabled]:
                  !checkSuccess || !isBlockChecked || nameCheckFail
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
              @click="$router.push('/mobile/service')"
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
            v-if="isBlockChecked"
            :class="$style['pay-button']"
            title="立即充值"
            @click="clickSubmit"
          >
            立即充值
          </div>
        </div>
      </template>
      <select-box
        v-if="isSelectShow"
        :select-data="selectBoxData"
        :now-select-cur.sync="nowSelectData"
        :close-fuc="isShowSelect"
        :title="paySelectData[paySelectType].selectTitle"
      />
    </div>
    <deposit-info
      v-if="submitStatus === 'stepTwo'"
      :order-data="orderData"
      :is-show.sync="isShow"
      :required-fields="curPayInfo.field"
      :submit-status.sync="nowSubmitStatus"
    />
    <div v-if="isShow" :class="$style['loading-wrap']">
      <div :class="$style['loading-item']">
        <ele-loading />
      </div>
    </div>
    <message v-if="msg" @close="msg = ''">
      <div slot="msg">
        <div
          style="background-color: transparent ; margin: 0 ; padding: 0"
          v-html="msg"
        />
      </div>
    </message>

    <!-- 被列為黑名單提示彈窗 -->
    <template v-if="isShowBlockTips">
      <block-list-tips type="deposit" @close="closeTips" />
    </template>

    <div v-if="isShowEntryBlockStatus">
      <div :class="$style['pop-message-mark']" />
      <div :class="$style['entry-message-container']">
        <div :class="$style['entry-message-content']">
          <p>{{ $text("S_TIPS", "温馨提示") }}</p>
          <div>
            {{ statusText }}
          </div>
        </div>
        <ul
          :class="$style['entry-message-confirm']"
          @click="isShowEntryBlockStatus = false"
        >
          <li
            v-if="entryBlockStatusData.status === 2"
            @click="goToValetDeposit"
          >
            前往代客充值
          </li>
          <li @click="submitInfo">确定</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import blockListTips from "../../../../../../tpl/porn1/components/common/new/blockListTips";
import bbosRequest from "@/api/bbosRequest";
import DatePicker from 'vue2-datepicker';
import mixin from '@/mixins/mcenter/deposit/bankCardDeposit';
import message from '../../../../../../tpl/porn1/components/common/new/message';

export default {
  components: {
    depositInfo: () => import(/* webpackChunkName: 'depositInfo' */ './components/depositInfo'),
    eleLoading: () => import(/* webpackChunkName: 'eleLoading' */ '@/router/web/components/tpl/common/element/loading/circle'),
    selectBox: () => import(/* webpackChunkName: 'selectBox' */ '../common/selectBox'),
    Swiper,
    SwiperSlide,
    DatePicker,
    message,
    blockListTips
  },
  mixins: [mixin],
  props: {
    headerSetting: {
      type: Object,
      default: () => { }
    }
  },
  data() {
    return {
      submitStatus: 'stepOne',
      isSelectShow: false,
      paySelectType: '',
      categoryOptions: {
        slidesPerView: 'auto'
      },
      initHeaderSetting: {},
      isSelectValue: '',
      tagTrans: { 2: 'general', 3: 'recommend', 4: 'speed' },
      showRealStatus: false,
      isShowMethodsPop: false,
      nameCheckFail: false,
      msg: '',
      entryBlockStatusData: null,
      isShowEntryBlockStatus: false,
      isDisableDepositInput: false,
      isBlockChecked: false
    };
  },
  watch: {
    //   channel
    passRoad() {
      console.log("passRoad", this.passRoad[0])
    },
    getPassRoadOrAi() {
      if (this.getPassRoadOrAi.amounts && this.getPassRoadOrAi.amounts.length > 0) {
        this.moneyValue = this.getPassRoadOrAi.amounts[0];
        this.changeMoney(this.getPassRoadOrAi.amounts[0]);
      }
    },
    curPayInfo() {
      if (this.curPayInfo.payment_method_name === '代客充值') {
        this.checkSuccess = true;
      }

      if (this.curPayInfo.banks.length === 1 && this.paySelectData['chagneBank'] && this.paySelectData['chagneBank'].allData) {
        this.checkSuccess = true;
        this.paySelectType = "chagneBank"
        this.changeSelectValue(this.paySelectData['chagneBank'].allData[0].value);
      }
    },
    isSelectValue(value) {
      if (value) {
        this.isDisableDepositInput = false
        this.checkOrderData()
      }
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: 'getSiteConfig',
      memInfo: 'getMemInfo'
    }),
    colorClass() {
      return [
        {
          [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[`site-${this.memInfo.user.domain}`],
          [this.$style['preset-color']]: !this.$style[`site-${this.memInfo.user.domain}`]
        }
      ];
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
          this.isSelectValue = value.label;
          this.bankSelectValue = value;
          return;
        }

        if (this.paySelectType === 'payPass') {
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
        if (value === 'stepOne') {
          this.$emit('update:headerSetting', this.initHeaderSetting);
          this.resetStatus();
          this.getPayGroup().then(() => {
            this.defaultCurPayBank();
          });
        }

        this.submitStatus = value;
        this.moneyValue = '';
        this.isErrorMoney = false;
        this.isSelectShow = false;
      }
    },
    allInputData() {
      return [
        {
          objKey: 'depositMethod',
          title: '充值方式',
          curMethodId: this.speedField.depositMethod,
          selectTitle: '请选择充值方式',
          value: this.speedField.depositMethod,
          selectData: [
            {
              mainTitle: this.$text('S_ONLINE_BANK', '网银'),
              selectId: '1'
            },
            {
              mainTitle: 'ATM',
              selectId: '2'
            },
            {
              mainTitle: this.$text('S_BANK_COUNTER', '银行柜台'),
              selectId: '4'
            },
            {
              mainTitle: this.$text('S_MOBILE_TRANSFER', '手机银行转帐'),
              selectId: '8'
            },
            {
              mainTitle: this.$text('S_ZALO_PAY', '其他'),
              selectId: '16'
            }
          ],
          showCondition: this.curPayInfo.field.find((e) => e.name === 'method' && e.required),
          //   showCondition: this.curPayInfo.field.find((e) => e.name === 'method'),
          isError: false
        },
        {
          objKey: 'bankBranch',
          title: this.$text('S_DEPOSIT_BRANCH', '银行支行'),
          value: this.speedField.bankBranch,
          placeholderText: this.$text('S_ENTER_DEPOSIT_BRANCH', '请输入银行支行'),
          showCondition: this.speedField.depositMethod === '2' || this.speedField.depositMethod === '4',
          isError: this.showError && this.curPayInfo.field.find((item) => item.name === 'method' && item.required) && !this.speedField.bankBranch && ['2', '4'].includes(this.speedField.depositMethod)
        },
        {
          objKey: 'depositAccount',
          title: '充值帐号',
          value: this.speedField.depositAccount,
          placeholderText: '请输入充值帐号',
          showCondition: this.curPayInfo.field.find((e) => e.name === 'pay_account' && e.required),
          //   showCondition: this.curPayInfo.field.find((e) => e.name === 'pay_account'),
          isError: this.showError && this.curPayInfo.field.find((item) => item.name === 'pay_account' && item.required) && !this.speedField.depositAccount
        },
        {
          objKey: 'depositTime',
          title: '充值时间(北京)',
          value: this.speedField.depositTime,
          placeholderText: '请选择充值时间',
          // showCondition: this.curPayInfo.field.find((e) => e.name === 'deposit_at' && e.required),
          showCondition: this.curPayInfo.field.find(e => {
            const isShow = e.name === 'deposit_at';
            // 目前需求：只有極速xx銀行，要在第一頁連同顯示此欄位
            if (isShow && this.curPayInfo.payment_method_id === 6 && this.curPayInfo.payment_type_id === 5) {
              return true
            } else {
              return false
            }
          }),
          isError: this.showError && this.curPayInfo.field.find((item) => item.name === 'deposit_at' && item.required) && !this.speedField.depositTime
        },
        {
          objKey: 'serialNumber',
          title: this.$text('S_SERIAL_NUMBER2', '流水号'),
          value: this.speedField.serialNumber,
          placeholderText: this.$text('S_PLZ_ENTER_SERIAL_NUMBER', '请输入流水号'),
          // showCondition: this.curPayInfo.field.find((e) => e.name === 'sn' && e.required),
          showCondition: this.curPayInfo && this.curPayInfo.field && this.curPayInfo.field.find(e => {
            const isShow = e.name === 'sn';
            // 目前需求：只有極速xx銀行，要在第一頁連同顯示此欄位
            if (isShow && this.curPayInfo.payment_method_id === 6 && this.curPayInfo.payment_type_id === 5) {
              return true
            } else {
              return false
            }
          }),
          isError: this.showError && this.curPayInfo.field.find((item) => item.name === 'sn' && item.required) && !this.speedField.serialNumber
        }
      ];
    },
    depositNameInput() {
      // return this.allInputData.find((item) => item.objKey === 'depositName');
      return {
        objKey: 'depositName',
        title: '充值人姓名',
        value: this.speedField.depositName,
        placeholderText: '请输入充值人姓名',
        showCondition: this.curPayInfo.field.find((e) => e.name === 'pay_username' && e.required),
        isError: this.showError && this.curPayInfo.field.find((item) => item.name === 'pay_username' && item.required) && !this.speedField.depositName
      };
    },
    statusText() {
      if (!this.entryBlockStatusData) return;
      switch (this.entryBlockStatusData.status) {
        case 1:
          return `您已多次提单未完成支付，请尝试其他充值通道，若多次提单不充值，帐号可能会被暂停充值。祝您游戏愉快!`
          break;

        case 2:
          return `您已多次提单未完成支付，建议您可以谘询在线客服或是尝试代客充值方式。祝您游戏愉快!`
          break;

        case 3:
          return `为了保证您的使用安全，规避IP监控，我方将为您暂停${this.entryBlockStatusData.block_times}小时的充值服务功能，如需继续存款，请联繫我方客服。祝您游戏愉快!`
          break;

        default:
          break;
      }
    }
  },
  created() {
    this.initHeaderSetting = this.headerSetting;
    this.getPayGroup().then(() => {
      this.defaultCurPayBank();
    })
    this.checkEntryBlockStatus();
  },
  methods: {
    ...mapActions([
      'actionSetUserBalance'
    ]),
    handleCreditTrans() {
      this.$router.push('/mobile/mcenter/creditTrans?tab=0');
    },
    verificationName() {
      /* ---------------------------
         全型數字：[\uFF10-\uFF19]
         全型英文小寫：[\uFF41-\uFF5A]
         全型英文大寫：[\uFF21-\uFF3A]
        --------------------------- */
      const reg = /^[^A-Za-z0-9\uFF10-\uFF19\uFF41-\uFF5A\uFF21-\uFF3A，:;！@#$%^&*?<>()+=`|[\]{}\\"/~\-_']*$/;
      if (!reg.test(this.speedField.depositName)) {
        // this.msg = '请输入正确名称';
        this.nameCheckFail = true;
      } else {
        // this.msg = '';
        this.nameCheckFail = false;
      }
    },
    handleCopy(val) {
      this.msg = "已复制到剪贴板";
      this.copyInfo(val)
    },
    modeChange(listItem, index) {
      this.checkEntryBlockStatus();
      this.changeMode(listItem);

      // 進來充值頁面，沒有 bankSelectValue 的預設值才觸發，再切換其它類別不再觸發
      if (Object.keys(this.selectedBank).length === 0) {
        this.bankSelectValue = this.allBanks[0] || {};
      }

      // 銀行轉帳 payment_type_id === 5，將您的銀行，預設成當前選擇的支付銀行
      if (this.yourBankData.length > 0 && this.curPayInfo.payment_type_id === 5) {
        this.defaultCurPayBank()
      }
    },
    /**
 * 顯示選擇框
 * @method changeType
 */
    changeType(payType) {
      if (payType === 'payMethod') {
        this.isShowSelect(true);
      }
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
    clickSubmit() {
      if (this.curPayInfo.payment_method_id === 20 || this.entryBlockStatusData.status === 0) {
        this.submitInfo();
      }
      else {
        this.isShowEntryBlockStatus = true;
      }
    },
    /**
 * 提交訂單
 * @method submitInfo
 */
    submitInfo() {
      if (this.entryBlockStatusData.status === 3) {
        return;
      }

      this.isShowEntryBlockStatus = false;
      this.submitList().then((response) => {
        //   重置阻擋狀態
        this.checkEntryBlockStatus();
        this.entryBlockStatusData = null;

        if (response) {
          if (response.status === 'NameFail') {
            this.msg = '请输入正确名称';
            this.nameCheckFail = true;
          }
          if (response.status === 'local') {
            this.checkSuccess = false;
            this.submitStatus = 'stepTwo';
            this.$emit('update:headerSetting', {
              ...this.initHeaderSetting,
              leftBtns: {
                icon: this.initHeaderSetting.leftBtns.icon,
                onClick: () => {
                  this.actionSetUserBalance();
                  this.nowSubmitStatus = 'stepOne';
                }
              },
              submitStatus: this.submitStatus
            });
          }
        }
      });
    },
    getImg(info) {
      let imgId = info.swift_code || info.selectId;

      if (info.bank_id === 0) {
        if (info.payment_method_id === 20 && info.payment_type_id === 11) {
          imgId = 70000;
        }

        if (info.payment_method_id === 3 && info.payment_type_id === 5) {
          imgId = 70001;
        }

        if (info.payment_method_id === 1 && info.payment_type_id === 1) {
          imgId = 70002;
        }
      }
      return {
        src: `https://images.dormousepie.com/icon/bankIconBySwiftCode/${imgId}.png`,
        error: this.$getCdnPath('/static/image/_new/default/bank_default_2.png'),
        loading: this.$getCdnPath('/static/image/_new/default/bank_default_2.png')
      };
    },
    curPay(curPayInfo) {
      if (Object.keys(curPayInfo).length
        && curPayInfo.field.find((item) => item.required)
        && [5, 6].includes(curPayInfo.payment_type_id)) {
        return true;
      }
      return false;
    },
    changeSelectValue(val) {
      this.isShowPop = false;
      const index = this.paySelectData[this.paySelectType].allData.map((item) => item.value).indexOf(val);
      this.nowSelectData = this.paySelectData[this.paySelectType].allData[index];
    },
    checkEntryBlockStatus() {
      // 使用者存款封鎖狀態
      this.isBlockChecked = false;
      bbosRequest({
        method: 'get',
        url: this.siteConfig.BBOS_DOMIAN + '/Ext/V2/CreateEntryBlock/User/Check',
        reqHeaders: {
          'vendor': this.memInfo.user.domain
        },
        params: {
          "lang": "zh-cn",
        },
      }).then((res) => {
        this.isBlockChecked = true;
        if (res.status === "000" && res.data && res.data.ret) {
          this.entryBlockStatusData = res.data.ret;
        } else {
          // 存款功能無法使用
          if (res.code !== "TM020074") {
            this.msg = res.msg;
          }
        }
      });
    },
    goToValetDeposit() {
      this.isShowEntryBlockStatus = false;

      let newWindow = '';
      if (this.isPWA) {
        newWindow = window.open('', '', '_blank', true);
      }

      const newWindowHref = (uri) => {
        try {
          newWindow.location.href = uri;
        } catch (e) {
          console.log(e);
          console.log(newWindow);
          console.log(uri)
        }
      }

      // 前往代客充值
      if (this.entryBlockStatusData.has_csr && this.entryBlockStatusData.external_url) {
        if (this.isWebView) {
          window.location.href = this.entryBlockStatusData.external_url;
          return;
        }
        else if (this.isPWA) {
          newWindowHref(this.entryBlockStatusData.external_url);
          return;
        }

        window.open(this.entryBlockStatusData.external_url);
        return;
      }

      return
    },
    closeTips() {
      this.isShowBlockTips = false;
      this.$router.back();
    }
  }
};
</script>

<style lang="scss" src="./css/index.module.scss" module></style>
