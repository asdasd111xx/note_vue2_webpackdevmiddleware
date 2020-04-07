<template>
    <div class="deposit-info-wrap clearfix">
        <!-- 收款帳號 -->
        <div :class="[$style['info-wrap'], 'clearfix']">
            <div :class="$style['deposit-info-title']">{{ $text('S_WITHDRAW_ACCOUNT', '收款帐号') }}</div>
            <div :class="$style['deposit-info-table']">
                <div
                    v-for="(info, index) in receiptInfo"
                    :key="`receipt-info-${index}`"
                    :class="$style['deposit-info-tr']"
                >
                    <div :class="[$style['deposit-info-td'], $style['deposit-info-thead']]">{{ info.title }}</div>
                    <div v-if="info.qrcode && info.qrcode.length > 0" :class="$style['deposit-info-td']">
                        <template v-for="(qrcodeInfo, infoIndex) in info.qrcode">
                            <div
                                v-if="qrcodeInfo.value"
                                :key="`qrcode-item-${infoIndex}`"
                                :class="$style['qrcode-item']"
                            >
                                <div :class="$style['qrcode-title']">{{ qrcodeInfo.title }}</div>
                                <img :src="qrcodeInfo.value" :class="$style['qrcode-img']" />
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
                    <div v-else :class="[$style['deposit-info-td'], { [$style['info-important']]: info.isFontBold }]">
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
        <!-- 您的申請資料 -->
        <div :class="[$style['info-wrap'], 'clearfix']">
            <div :class="$style['deposit-info-title']">{{ orderData.methodType === 'remit' ? $text('S_DEPOSIT_TIP04', '填写汇款资料，加速到帐') : $text('S_APPLICATION_INFORMATION', '您的申请资料') }}</div>
            <div :class="[$style['deposit-info-table'], $style['application-table']]">
                <div
                    v-for="(info, index) in yourDepositData"
                    :key="`your-deposit-${index}`"
                    :class="$style['deposit-info-tr']"
                >
                    <div :class="[$style['deposit-info-td'], $style['deposit-info-thead']]">{{ info.title }}</div>
                    <div :class="[$style['deposit-info-td'], { [$style['info-important']]: info.isFontBold }, $style[`info-${info.objKey}`]]">{{ info.value }}</div>
                </div>
                <speed-pay-field
                    v-if="orderData.methodType === 'remit'"
                    :required-fields="requiredFields"
                    :speed-field.sync="resultSpeedField"
                    :is-edit="true"
                    :method-id="orderData.method_id"
                    :type-id="orderData.type_id"
                />
            </div>
        </div>
        <div
            :class="[$style['submit-btn'], {[$style['disabled']]: isSubmitDisabled}]"
            :title="orderData.methodType !== 'remit' ? $text('S_FINISH_DEPOSIT', '完成支付') : $text('S_SUBMIT_DEPOSIT', '提交資料')"
            @click="submitData"
        >
            {{ orderData.methodType !== 'remit' ? $text('S_FINISH_DEPOSIT', '完成支付') : $text('S_SUBMIT_DEPOSIT', '提交資料') }}
        </div>
        <deposit-alert v-if="isAlertTip" :close-fuc="goBack" />
    </div>
</template>

<script>
import mixin from '@/mixins/mcenter/deposit/depositInfo';

export default {
    components: {
        depositAlert: () => import(/* webpackChunkName: 'depositAlert' */ './depositAlert'),
        speedPayField: () => import(/* webpackChunkName: 'speedPayField' */ './common/speedPayField')
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
            isAlertTip: false
        };
    },
    computed: {
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
        }
    }
};
</script>

<style lang="scss" src="../css/depositInfo.scss" module></style>
