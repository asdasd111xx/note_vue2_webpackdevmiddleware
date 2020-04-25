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
        <div v-if="depositData.length > 0 && submitStatus === 'stepOne'" class="deposit-edit-wrap">
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
                                    v-if="tagTrans[info.tag]"
                                    :src="$getCdnPath(`/static/image/_new/mcenter/deposit/icon_${tagTrans[info.tag]}.png`)"
                                    :class="$style['pay-mode-tag']"
                                />
                                <img v-lazy="getImg(info)" :class="$style['pay-mode-img']" />
                                <div :class="$style['pay-main-title']">{{ info.short_name }}</div>
                                <div :class="$style['pay-sub-title']">
                                    <template v-if="[5, 6].includes(info.payment_type_id)">返利1%无上限</template>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- 選擇銀行 or 選擇點卡 -->
                    <div v-if="curPayInfo.banks && curPayInfo.banks.length > 0" :class="[$style['feature-wrap'], 'clearfix']">
                        <span :class="$style['bank-card-title']">{{ curPayInfo.payment_method_id === 2 ? $text('S_SELECT_POINT_CARD', '请选择点卡') : $text('S_SELECT_BANKS', '请选择银行') }}</span>
                        <div :class="$style['select-bank-item']" @click="changeType('chagneBank')">
                            <select
                                v-model="isSelectValue"
                                :class="$style['select-style']"
                                @change="changeSelectValue(isSelectValue)"
                            >
                                <option
                                    v-for="item in paySelectData['chagneBank'].allData"
                                    :key="item.value"
                                    :value="item.value"
                                >
                                    {{ item.label }}
                                </option>
                            </select>
                        </div>
                    </div>
                    <!-- 通道 -->
                    <div v-if="!isDepositAi && passRoad.length > 0" :class="[$style['feature-wrap'], 'clearfix']">
                        <span :class="$style['bank-card-title']">{{ $text('S_PAY_PASS_TIP', '若通道无法存款，请点选其他通道') }}</span>
                        <div :class="$style['bank-feature-wrap']">
                            <div
                                v-for="data in paySelectData.payPass.allData"
                                :key="data.id"
                                :class="[$style['pay-mode-pass'], {[$style['current-data']]: data.id === curPassRoad.id}]"
                                @click="changePassRoad(data)"
                            >
                                {{ data.mainTitle }}
                            </div>
                        </div>
                    </div>
                    <!-- 存款金額 -->
                    <div :class="[$style['feature-wrap'], 'clearfix']">
                        <div v-if="!isDepositAi" :class="[$style['bank-card-title'], { [$style['is-error']]: isErrorMoney }]">
                            {{ $text('S_SINGLE_LIMIT', '单笔限额') }} :
                            {{ Number(depositInterval.maxMoney) === 0 ? $text('S_UNLIMITED', '无限制') : $text('S_MONEY_RANGE_SHORT', {replace: [
                                { target: '%s', value: depositInterval.minMoney },
                                { target: '%s', value: depositInterval.maxMoney }]})
                            }}
                        </div>
                        <div v-if="isDepositAi" :class="[$style['bank-card-title'], { [$style['is-error']]: isErrorMoney }]">
                            {{ $text('S_SUBMIT_ORDER_SYSTEM_AUO_ALLOCATES', '提交订单时，系统自动调配最佳存款金额') }}
                        </div>
                        <div :class="$style['money-tip-wrap']">
                            <!-- eslint-disable vue/no-v-html -->
                            <li
                                v-if="curPayInfo.offer_enable"
                                :class="$style['tip-list']"
                                v-html="promitionText"
                            />
                            <!-- eslint-enable vue/no-v-html -->
                            <li v-if="+getPassRoadOrAi.fee_percent || +getPassRoadOrAi.fee_amount" :class="$style['tip-list']">
                                {{ feeText }}
                            </li>
                        </div>
                        <div v-if="!isDepositAi && (Object.keys(curPassRoad).length === 0 || curPassRoad.is_custom_amount)" :class="[$style['feature-deposit-wrap'], { [$style['is-error-line']]: isErrorMoney }]">
                            <div class="money-input-wrap">
                                <input
                                    v-model="moneyValue"
                                    :class="$style['deposit-input']"
                                    :placeholder="$text('S_ENTER_DEPOSIT_MONEY', '请输入存款金额')"
                                    type="number"
                                    pattern="[0-9]*"
                                    @blur="verificationMoney(moneyValue)"
                                    @input="updateInput($event, $event.target.value)"
                                />
                            </div>
                        </div>
                        <div v-if="isDepositAi || curPassRoad.is_recommend_amount" :class="[$style['speed-money-wrap'], 'clearfix']">
                            <div
                                v-for="(item, index) in getPassRoadOrAi.amounts"
                                :key="`pay-money-${index}`"
                                :class="[$style['pay-money-item'], { [$style['is-current']]: moneyValue === item }]"
                                @click="changeMoney(item)"
                            >
                                {{ item }}
                            </div>
                        </div>
                        <!-- 實際存入 -->
                        <div :class="[$style['money-info-wrap'], 'clearfix']">
                            <span :class="$style['feature-tip-title']">{{ $text('S_ESTIMATE_ENTER', '预计存入') }}</span>
                            <span :class="$style['amount-text']">{{ realSaveMoney }}</span>
                        </div>
                    </div>
                    <div v-if="curPay(curPayInfo)" :class="$style['speed-input-wrap']">
                        <span :class="$style['speed-input-title']">{{ $text('S_REMITTANCE_INFO', '汇款资料') }}</span>
                        <speed-pay-field
                            :show-by-required-fields="true"
                            :required-fields="curPayInfo.field"
                            :speed-field.sync="resultSpeedField"
                            :method-id="curPayInfo.payment_method_id"
                            :type-id="curPayInfo.payment_type_id"
                        />
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
                                        <div v-if="info.copyShow" :class="$style['icon-wrap']" @click="copyInfo(info.value)">
                                            <div>
                                                <icon
                                                    name="regular/copy"
                                                    width="12"
                                                    height="12"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div :key="`border-line-${index}`" :class="{ [$style['info-border']]: info.isBorderBottom }" />
                            </template>
                        </div>
                    </div>
                    <div
                        :class="$style['pay-button']"
                        :title="$text('S_ENTER_PAY', '前往支付')"
                        @click="submitInfo"
                    >
                        {{ $text('S_ENTER_PAY', '前往支付') }}
                    </div>
                    <!-- 溫馨提醒 -->
                    <div v-if="curModeGroup.payment_group_memo" :class="[$style['feature-tip-wrap'], 'clearfix']">
                        <span :class="$style['warm-tip-title']">{{ $text('S_TIPS', '温馨提示') }}</span>
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
                :select-data="paySelectData[paySelectType].allData"
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
import mixin from '@/mixins/mcenter/deposit/bankCardDeposit';

export default {
    components: {
        depositInfo: () => import(/* webpackChunkName: 'depositInfo' */ './components/depositInfo'),
        eleLoading: () => import(/* webpackChunkName: 'eleLoading' */ '@/router/web/components/tpl/common/element/loading/circle'),
        selectBox: () => import(/* webpackChunkName: 'selectBox' */ '../common/selectBox'),
        speedPayField: () => import(/* webpackChunkName: 'speedPayField' */ '../common/speedPayField'),
        Swiper,
        SwiperSlide
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
            tagTrans: { 2: 'general', 3: 'recommend', 4: 'speed' }
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
        getImg(info) {
            return {
                src: this.$getCdnPath(`/static/image/mcenter/bank/${info.bank_id}.png`),
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
            const index = this.paySelectData[this.paySelectType].allData.map(item => item.value).indexOf(val);
            this.nowSelectData = this.paySelectData[this.paySelectType].allData[index];
        }
    }
};
</script>

<style lang="scss" src="./css/index.module.scss" module></style>
