<template>
    <div :class="['deposit-info-wrap', 'clearfix', colorClass]">
        <!-- 收款帳號 -->
        <div :class="[$style['info-wrap'], $style['info-wrap-account'], 'clearfix']">
            <div :class="$style['deposit-info-title']">{{ $text('S_WITHDRAW_ACCOUNT', '收款帐号') }}</div>
            <div :class="$style['deposit-submit-info']">
                <template v-for="(info, index) in receiptInfo">
                    <div :key="`receipt-info-${index}`" :class="[ $style['submit-info-wrap'], { [$style['is-memo']]: info.objKey === 'memo' }]">
                        <div :class="[$style['basic-info-text'], $style['basic-info-title']]">{{ info.title }}</div>
                        <div v-if="info.qrcode && info.qrcode.length > 0" :class="[$style['basic-info-text'], $style['qrcode-wrap']]">
                            <template v-for="(qrcodeInfo, infoIndex) in info.qrcode">
                                <div
                                    v-if="qrcodeInfo.value"
                                    :key="`qrcode-item-${infoIndex}`"
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
        <!-- 存款信息 -->
        <div :class="[$style['info-wrap'], 'clearfix']">
            <div :class="$style['deposit-info-title']">{{ $text('S_DEPOSIT_TIP04', '填寫匯款資料，加速到帳') }}</div>
            <div :class="[$style['deposit-submit-info'], $style['application-table']]">
                <div
                    v-for="(info, index) in yourDepositData"
                    :key="`your-deposit-${index}`"
                    :class="$style['submit-info-wrap']"
                >
                    <div :class="[$style['basic-info-text'], $style['basic-info-title']]">{{ info.title }}</div>
                    <div :class="[$style['basic-info-text'], { [$style['info-important']]: info.isBorderBottom }]">{{ info.value }}</div>
                </div>
            </div>
            <speed-pay-field
                v-if="orderData.methodType === 'remit'"
                :speed-field.sync="resultSpeedField"
                :required-fields="requiredFields"
                :is-edit="true"
                :method-id="orderData.method_id"
                :type-id="orderData.type_id"
            />
        </div>
        <div
            :class="[$style['submit-btn'], , {[$style['disabled']]: isSubmitDisabled}]"
            :title="orderData.methodType !== 'remit' ? $text('S_FINISH_DEPOSIT', '完成支付') : $text('S_SUBMIT_DEPOSIT', '提交資料')"
            @click="submitData"
        >
            {{ orderData.methodType !== 'remit' ? $text('S_FINISH_DEPOSIT', '完成支付') : $text('S_SUBMIT_DEPOSIT', '提交資料') }}
        </div>
        <deposit-alert v-if="isAlertTip" :close-fuc="goBack" />
        <deposit-popup
            v-if="isShowQrcode"
            :value="qrcodeValue"
            :title="qrcodeTitle"
            @close="switchQrcodePopup"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import mixin from '@/mixins/mcenter/deposit/depositInfo';

export default {
    components: {
        depositAlert: () => import(/* webpackChunkName: 'depositAlert' */ './depositAlert'),
        speedPayField: () => import(/* webpackChunkName: 'speedPayField' */ '../../common/speedPayField'),
        depositPopup: () => import(/* webpackChunkName: 'depositPopup' */ './depositPopup')
    },
    mixins: [mixin],
    props: {
        orderData: {
            type: Object,
            default: () => {}
        },
        isShow: {
            type: Boolean,
            default: false
        },
        submitStatus: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            moreShow: false,
            isAlertTip: false,
            isShowQrcode: false,
            qrcodeValue: '',
            qrcodeTitle: ''
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
        }),
        colorClass() {
            return [
                {
                    [this.$style[`site-${this.memInfo.user.domain}`]]: this.$style[`site-${this.memInfo.user.domain}`],
                    [this.$style['preset-color']]: !this.$style[`site-${this.memInfo.user.domain}`]
                }
            ];
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
    methods: {
        /**
         * 回填寫存款資料頁
         * @method goBack
         */
        goBack() {
            this.isAlertTip = false;
            this.$emit('update:submitStatus', 'stepOne');
            window.scrollTo(0, 0);
        },
        submitData() {
            if (this.isSubmitDisabled) {
                return;
            }

            this.$emit('update:isShow', true);

            this.confirmDeposit().then((response) => {
                if (response.status === 'ok') {
                    this.isAlertTip = true;
                }

                this.$emit('update:isShow', false);
            });
        },
        switchQrcodePopup(enable, value, text) {
            this.qrcodeValue = value;
            this.isShowQrcode = enable;
            this.qrcodeTitle = text;
        }
    }
};
</script>

<style lang="scss" src="../css/indexDepositInfo.module.scss" module></style>
