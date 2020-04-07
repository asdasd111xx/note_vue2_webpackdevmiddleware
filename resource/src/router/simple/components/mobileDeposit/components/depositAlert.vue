<template>
    <transition :name="'fade'">
        <div :class="$style['deposit-alert-wrap']">
            <div :class="$style['alert-wrap']">
                <div :class="$style['alert-title']">
                    {{ $text('S_DEPOSIT_APPLY', '存款申请') }}
                    <div :class="$style['alert-close-wrap']" @click="closeFuc(false)">
                        <img :class="$style['alert-close-btn']" :src="$getCdnPath('/static/image/mobile/mcenter/close_icon.png')" />
                    </div>
                </div>
                <div :class="$style['alert-body-wrap']">
                    <div :class="$style['success-icon-wrap']">
                        <icon :class="$style['success-icon']" name="regular/check-circle" />
                        <span :class="$style['success-title']">{{ $text('S_ENTER_SUCCESS', '提交成功') }}</span>
                    </div>
                    <div :class="$style['tip-wrap']">
                        <li>{{ $text('S_DEPOSIT_TIP02', '财务将尽快为您添加额度，请稍候') }}</li>
                        <li>{{ $text('S_DEPOSIT_TIP03', '若长时间未到帐请联络客服') }}</li>
                    </div>
                    <div :class="$style['confirm-btn']" @click="closeFuc(false)">{{ $text('S_ENTER01', '我知道了') }}</div>
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
        }
    }
};
</script>

<style lang="scss" src="../css/depositAlert.scss" module></style>
