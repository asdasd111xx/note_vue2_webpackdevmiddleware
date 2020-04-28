<template>
    <div :class="[$style['mode-wrap'], $style[`theme-${siteConfig.MCENTER_COLOR}`], colorClass]">
        <swiper
            v-if="depositData.length > 1"
            ref="swiperTop"
            :options="categoryOptions"
            :class="$style['swiper-wrap']"
        >
            <swiper-slide
                v-for="(listItem, index) in depositData"
                :key="`swiper-data-${index}`"
                :class="[$style['swiper-item'], { [$style['is-current']]: listItem.payment_group_id === curModeGroup.payment_group_id}]"
            >
                <span @click="modeChange(listItem, index)">{{ listItem.payment_group_name || listItem.name }}</span>
            </swiper-slide>
        </swiper>
        <div v-if="depositData.length > 0 && submitStatus === 'stepOne'" :class="$style['deposit-edit-wrap']">
            <template v-if="Object.keys(curModeGroup).length > 0">
                <div v-if="!curModeGroup.uri" :class="$style['bank-card-wrap']">
                    <!-- 支付方式 -->
                    <div :class="[$style['feature-wrap'], 'clearfix']">
                        <div :class="$style['feature-title']">支付方式</div>
                        <div :class="[$style['pay-mode-item-wrap'], 'clearfix']">
                            <div
                                v-for="(info, index) in curModeGroup.payment_group_content"
                                :key="`pay-mode-${info.payment_method_id}-${info.bank_id}`"
                                :class="[$style['pay-mode-item'], { [$style['is-current']]: curPayInfo.payment_method_id === info.payment_method_id && curPayInfo.bank_id === info.bank_id}]"
                                @click="changePayMode(info, index)"
                            >
                                <img
                                    v-if="[5, 6].includes(info.payment_type_id) && tagTrans[info.tag]"
                                    :src="$getCdnPath(`/static/image/_new/mcenter/deposit/icon_${tagTrans[info.tag]}.png`)"
                                    :class="$style['pay-mode-tag']"
                                />
                                <img v-lazy="getImg(info.bank_id)" :class="$style['pay-mode-img']" />
                                <div :class="$style['pay-main-title']">{{ info.short_name }}</div>
                                <div :class="$style['pay-sub-title']">
                                    <template v-if="[5, 6].includes(info.payment_type_id)">返利1%无上限</template>
                                </div>
                                <img
                                    v-if="curPayInfo.payment_method_id === info.payment_method_id && curPayInfo.bank_id === info.bank_id"
                                    :class="$style['pay-active']"
                                    src="/static/image/_new/common/select_active.png"
                                />
                            </div>
                        </div>
                    </div>
                    <!-- 選擇銀行 or 選擇點卡 -->
                    <div
                        v-if="curPayInfo.banks && curPayInfo.banks.length > 0"
                        :class="[$style['feature-wrap'], $style['select-card-wrap'], 'clearfix']"
                        @click="changeType('chagneBank'), isShowPop=true"
                    >
                        <span :class="$style['select-bank-title']">{{ curPayInfo.payment_method_id === 2 ? $text('S_SELECT_POINT_CARD', '请选择点卡') : $text('S_SELECT_BANKS', '请选择银行') }}</span>
                        <div :class="$style['select-bank-item']">
                            {{ isSelectValue }}
                        </div>
                        <img :class="$style['select-bank-icon']" src="/static/image/_new/common/arrow_next.png" />
                        <div v-if="isShowPop" :class="$style['pop-wrap']">
                            <div :class="$style['pop-mask']" @click.stop="isShowPop = false" />
                            <div :class="$style['pop-menu']">
                                <div :class="$style['pop-title']">
                                    <span @click.stop="isShowPop = false">{{ $text('S_CANCEL', '取消') }}</span>
                                    选择银行
                                </div>
                                <ul :class="$style['pop-list']">
                                    <li
                                        v-for="item in paySelectData['chagneBank'].allData"
                                        :key="item.selectId"
                                        @click.stop="changeSelectValue(item.value)"
                                    >
                                        <img v-lazy="getImg(item.selectId)" />
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

                    <div v-if="depositNameInput.showCondition" :class="$style['depositName-wrap']">
                        <div
                            :key="`field-${depositNameInput.objKey}`"
                            :class="[$style['speed-field'], {[$style.error]: depositNameInput.isError},'clearfix']"
                        >
                            <div :class="$style['field-title']">{{ depositNameInput.title }}</div>
                            <div :class="$style['field-info']">
                                <input
                                    v-model="speedField.depositName"
                                    :class="$style['speed-deposit-input']"
                                    :placeholder="depositNameInput.placeholderText"
                                    @input="submitDataInput($event.target.value, depositNameInput.objKey)"
                                />
                            </div>
                        </div>
                        <div
                            v-if="depositNameInput.isError"
                            :key="`field-error-${depositNameInput.objKey}`"
                            :class="$style['speed-deposit-input-error-messgae']"
                        >
                            {{ depositNameInput.placeholderText }}
                        </div>
                    </div>
                    <!-- 通道 -->
                    <div v-if="!isDepositAi && passRoad.length > 0" :class="[$style['feature-wrap'], 'clearfix']">
                        <span :class="$style['bank-card-title']">支付通道</span>
                        <div :class="$style['bank-feature-wrap']">
                            <div
                                v-for="data in paySelectData.payPass.allData"
                                :key="data.id"
                                :class="[$style['pay-mode-pass'], {[$style['current-data']]: data.id === curPassRoad.id}]"
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
                    <div :class="[$style['feature-wrap'], $style['select-money'], 'clearfix']">
                        <div :class="$style['bank-card-title']">充值金额</div>
                        <div v-if="isDepositAi" :class="[$style['bank-card-title'], { [$style['is-error']]: isErrorMoney }]">
                            提交订单时，系统自动调配最佳充值金额
                        </div>
                        <div v-if="isDepositAi || curPassRoad.is_recommend_amount" :class="[$style['speed-money-wrap'], 'clearfix']">
                            <div
                                v-for="(item, index) in getPassRoadOrAi.amounts"
                                :key="`pay-money-${index}`"
                                :class="[$style['pay-money-item'], { [$style['is-current']]: moneyValue === item }]"
                                @click="changeMoney(item)"
                            >
                                {{ item }}
                                <img
                                    v-if="moneyValue === item"
                                    :class="$style['pay-active']"
                                    src="/static/image/_new/common/select_active.png"
                                />
                            </div>
                        </div>
                        <div v-if="!isDepositAi && (Object.keys(curPassRoad).length === 0 || curPassRoad.is_custom_amount)" :class="$style['feature-deposit-wrap']">
                            <div class="money-input-wrap">
                                <input
                                    v-model="moneyValue"
                                    :class="$style['deposit-input']"
                                    :placeholder="singleLimit"
                                    type="number"
                                    pattern="[0-9]*"
                                    @blur="verificationMoney(moneyValue)"
                                    @input="updateInput($event, $event.target.value)"
                                />
                            </div>
                            <span :class="$style['deposit-input-icon']">¥</span>
                        </div>
                        <div v-if="!isDepositAi && isErrorMoney" :class="$style['money-input-tip']">
                            {{ singleLimit }}
                        </div>
                        <!-- 實際存入 -->
                    </div>
                    <div v-if="curPay(curPayInfo)" :class="$style['speed-input-wrap']">
                        <template v-for="info in allInputData">
                            <div
                                v-if="info.showCondition"
                                :key="`field-${info.objKey}`"
                                :class="[$style['speed-field'], {[$style.error]: info.isError},'clearfix']"
                            >
                                <img
                                    v-if="info.objKey === 'depositMethod' || info.objKey === 'depositTime'"
                                    :class="$style['speed-field-icon']"
                                    src="/static/image/_new/common/arrow_next.png"
                                />
                                <div :class="$style['field-title']">{{ info.title }}</div>
                                <div :class="$style['field-info']">
                                    <template v-if="info.objKey === 'depositMethod'">
                                        <div :class="[$style['speed-field-title'], {[$style['depositMethod-no-data']] : !speedField.depositMethod}]" @click="isShowMethodsPop=true">
                                            {{ speedField.depositMethod ? info.selectData.find(item => speedField.depositMethod === item.selectId).mainTitle : info.selectTitle }}
                                        </div>
                                        <div v-if="isShowMethodsPop" :class="$style['pop-wrap']">
                                            <div :class="$style['pop-mask']" @click.stop="isShowMethodsPop = false" />
                                            <div :class="$style['pop-menu']">
                                                <div :class="$style['pop-title']">
                                                    <span @click.stop="isShowMethodsPop = false">{{ $text('S_CANCEL', '取消') }}</span>
                                                    {{ info.title }}
                                                </div>
                                                <ul :class="$style['pop-list']">
                                                    <li
                                                        v-for="item in info.selectData"
                                                        :key="item.selectId"
                                                        @click.stop="speedField.depositMethod = item.selectId, isShowMethodsPop = false"
                                                    >
                                                        <img :src="`/static/image/mcenter/bank/default.png`" />
                                                        {{ item.mainTitle }}
                                                        <icon
                                                            v-if="item.selectId === speedField.depositMethod"
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
                        <div :class="$style['deposit-info-title']">{{ $text('S_WITHDRAW_ACCOUNT', '收款帐号') }}</div>
                        <div :class="$style['deposit-submit-info']">
                            <template v-for="(info, index) in receiptInfo">
                                <div :key="`receipt-info-${index}`" :class="$style['submit-info-wrap']">
                                    <div :class="[$style['basic-info-text'], $style['basic-info-title']]">{{ info.title }}</div>
                                    <div v-if="info.qrcode && info.qrcode.length > 0" :class="[$style['basic-info-text'], $style['qrcode-wrap']]">
                                        <template v-for="(qrcodeInfo, qrcodeInfoIndex) in info.qrcode">
                                            <div
                                                v-if="qrcodeInfo.value"
                                                :key="`qrcode-item-${qrcodeInfoIndex}`"
                                                :class="$style['qrcode-item']"
                                            >
                                                <div :class="$style['qrcode-title']">{{ qrcodeInfo.title }}</div>
                                                <img
                                                    :src="qrcodeInfo.value"
                                                    :class="$style['qrcode-img']"
                                                    @click="switchQrcodePopup(true, qrcodeInfo.value, qrcodeInfo.title)"
                                                />
                                            </div>
                                        </template>
                                    </div>
                                    <!-- eslint-disable vue/no-v-html -->
                                    <div
                                        v-else-if="info.htmlShow"
                                        :class="[$style['basic-info-text'], $style[`info-${info.objKey}`]]"
                                        v-html="info.value"
                                    />
                                    <!-- eslint-enable vue/no-v-html -->
                                    <div v-else :class="$style['basic-info-text']">
                                        {{ info.value }}
                                        <div
                                            v-if="info.copyShow"
                                            :class="$style['icon-wrap']"
                                            @click="copyInfo(info.value)"
                                        >
                                            <div>
                                                <icon
                                                    name="regular/copy"
                                                    width="12"
                                                    height="12"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div :key="`border-line-${index}`" :class="{ [$style['info-border']]: info.isBorderBottom }" />
                            </template>
                        </div>
                    </div>
                    <div
                        :class="[$style['pay-button'], {[$style.disabled] : !checkSuccess}]"
                        :title="$text('S_ENTER_PAY', '前往支付')"
                        @click="submitInfo"
                    >
                        {{ $text('S_ENTER_PAY', '前往支付') }}
                    </div>
                    <div :class="$style['money-info-wrap']">
                        <span
                            v-if="realSaveMoney > 0"
                            :class="$style['feature-tip-title']"
                            @click="showRealStatus=true"
                        >
                            实际到账： ¥{{ realSaveMoney }} (详情)
                        </span>
                        <span v-else :class="$style['feature-tip-title']">实际到账： {{ realSaveMoney }}</span>
                    </div>
                    <div v-if="showRealStatus" :class="$style['pop-message']">
                        <div :class="$style['pop-message-mark']" />
                        <div :class="$style['message-container']">
                            <ul :class="$style['message-content']">
                                <li>• 实际到账： {{ realSaveMoney }}</li>
                                <li
                                    v-if="curPayInfo.offer_enable"
                                    :class="$style['tip-list']"
                                    v-html="promitionText"
                                />
                                <li v-if="+getPassRoadOrAi.fee_percent || +getPassRoadOrAi.fee_amount">
                                    • {{ feeText }}
                                </li>
                            </ul>
                            <div :class="$style['message-close']" @click="showRealStatus=false">关闭</div>
                        </div>
                    </div>
                    <p :class="$style['service-remind']">
                        如需帮助，请<span :class="$style['service-btn']" @click="$router.push('/mobile/service')">联系客服</span>
                    </p>
                    <!-- 溫馨提醒 -->
                    <div v-if="curModeGroup.payment_group_memo" :class="[$style['feature-tip-wrap'], 'clearfix']">
                        <p :class="$style['warm-tip-title']">{{ $text('S_TIPS', '温馨提示') }}</p>
                        <!-- eslint-disable vue/no-v-html -->
                        <div :class="$style['warm-tip']" v-html="curModeGroup.payment_group_memo" />
                        <!-- eslint-enable vue/no-v-html -->
                    </div>
                </div>
                <!-- 第三方存款 -->
                <div v-else :class="$style['bank-card-wrap']">
                    <!-- 支付方式 -->
                    <div :class="[$style['feature-wrap'], 'clearfix']">
                        <p :class="$style['bank-card-title']">{{ $text('S_SELECT_PAY_MODE', '请选择支付方式') }}</p>
                        <div :class="$style['pay-mode-item']" @click="changeType('payMethod')">
                            <span :class="$style['pay-main-title']">{{ curModeGroup.alias }}</span>
                        </div>
                    </div>
                    <div
                        :class="$style['pay-button']"
                        :title="$text('S_ENTER_PAY', '前往支付')"
                        @click="submitInfo"
                    >
                        {{ $text('S_ENTER_PAY', '前往支付') }}
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
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import DatePicker from 'vue2-datepicker';
import mixin from '@/mixins/mcenter/deposit/bankCardDeposit';

export default {
    components: {
        depositInfo: () => import(/* webpackChunkName: 'depositInfo' */ './components/depositInfo'),
        eleLoading: () => import(/* webpackChunkName: 'eleLoading' */ '@/router/web/components/tpl/common/element/loading/circle'),
        selectBox: () => import(/* webpackChunkName: 'selectBox' */ '../common/selectBox'),
        Swiper,
        SwiperSlide,
        DatePicker
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
            isShowMethodsPop: false
        };
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
                    this.getPayGroup();
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
                    isError: this.showError && this.curPayInfo.field.find((item) => item.name === 'pay_account' && item.required) && !this.speedField.depositAccount
                },
                {
                    objKey: 'depositTime',
                    title: '充值时间(北京)',
                    value: this.speedField.depositTime,
                    placeholderText: '请选择充值时间',
                    showCondition: this.curPayInfo.field.find((e) => e.name === 'deposit_at' && e.required),
                    isError: this.showError && this.curPayInfo.field.find((item) => item.name === 'deposit_at' && item.required) && !this.speedField.depositTime
                },
                {
                    objKey: 'serialNumber',
                    title: this.$text('S_SERIAL_NUMBER2', '流水号'),
                    value: this.speedField.serialNumber,
                    placeholderText: this.$text('S_PLZ_ENTER_SERIAL_NUMBER', '请输入流水号'),
                    showCondition: this.curPayInfo.field.find((e) => e.name === 'sn' && e.required),
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
        }
    },
    created() {
        this.initHeaderSetting = this.headerSetting;
        this.getPayGroup();
    },
    methods: {
        ...mapActions([
            'actionSetUserBalance'
        ]),
        modeChange(listItem, index) {
            this.changeMode(listItem);

            if (Object.keys(this.selectedBank).length === 0) {
                this.bankSelectValue = this.allBanks[0] || {};
            }

            this.$nextTick(() => {
                this.$refs.swiperTop.swiper.slideTo(index);
            });
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
        /**
         * 提交訂單
         * @method submitInfo
         */
        submitInfo() {
            this.submitList().then((response) => {
                if (response.status === 'local') {
                    this.submitStatus = 'stepTwo';
                    this.$emit('update:headerSetting', {
                        ...this.initHeaderSetting,
                        leftBtns: {
                            icon: this.initHeaderSetting.leftBtns.icon,
                            onClick: () => {
                                this.actionSetUserBalance();
                                this.nowSubmitStatus = 'stepOne';
                            }
                        }
                    });
                }
            });
        },
        getImg(id) {
            return {
                src: `https://bbos.bbin-asia.com/elibom/bank/${id}.png`,
                error: this.$getCdnPath('/static/image/mcenter/bank/default.png'),
                loading: this.$getCdnPath('/static/image/game_loading_s.gif')
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
        }
    }
};
</script>

<style lang="scss" src="./css/index.module.scss" module></style>
