<template>
    <transition :name="'fade'">
        <div :class="$style['withdraw-alert-wrap']">
            <div :class="[$style['alert-wrap'], $style[`alert-${type}`]]">
                <div :class="$style['alert-title']">
                    {{ title }}
                    <div :class="$style['alert-close-wrap']" @click="closeFuc(false)">
                        <icon
                            :class="$style['alert-close-btn']"
                            width="30"
                            height="30"
                            name="times"
                        />
                    </div>
                </div>
                <div :class="$style['alert-body-wrap']">
                    <div :class="[$style['success-icon-wrap'], 'clearfix']">
                        <icon
                            v-if="type === 'successTip'"
                            :class="$style['success-icon']"
                            width="60"
                            height="60"
                            name="regular/check-circle"
                        />
                        <img
                            v-else
                            :src="$getCdnPath(tipImgSrc)"
                            :class="$style['success-img']"
                        />
                        <span :class="$style['success-title']">{{ tipTitle }}</span>
                    </div>
                    <div v-if="type === 'successTip'" :class="$style['tip-wrap']">
                        <li>{{ $text('S_WITHDRAW_TIP04', '财务将尽快为您审核出款，请稍后') }}</li>
                        <li>{{ $text('S_DEPOSIT_TIP03', '若长时间未到帐请联络客服') }}</li>
                    </div>
                    <div v-else :class="$style['tip-wrap']">
                        <li>{{ $text('S_CGPAY_TIP01', '请使用 CG Pay 内建扫描器扫描QR code') }}</li>
                        <li>{{ $text('S_CGPAY_TIP02', '成功绑定钱包后，此视窗自动关闭') }}</li>
                        <li>{{ $text('S_CGPAY_TIP03', '没有 CG Pay 帐号？') }} <a :class="$style['go-text']" @click="openCGPay">{{ $text('S_ENTER03', '立即申请') }}</a></li>
                    </div>
                    <div :class="$style['confirm-btn']" @click="closeFuc(false)">{{ closeBtnText }}</div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
export default {
    props: {
        closeFuc: {
            type: Function,
            default: () => {}
        },
        title: {
            type: String,
            default: ''
        },
        closeBtnText: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'successTip'
        },
        tipTitle: {
            type: String,
            default: ''
        },
        tipImgSrc: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            timeFuc: 0
        };
    },
    created() {
        this.timeFuc = setTimeout(() => {
            this.closeFuc(false);
        }, 30000);
    },
    beforeDestroy() {
        clearTimeout(this.timeFuc);
    },
    methods: {
        openCGPay() {
            window.open('https://cgpay.pw/', 'cgpay');
        }
    }
};
</script>

<style lang="scss" src="../css/withdrawAlert.module.scss" module></style>
