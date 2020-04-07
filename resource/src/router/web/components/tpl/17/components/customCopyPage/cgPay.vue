<template>
    <div :class="$style['cgpay-wrap']">
        <div :class="$style['cgpay-bg']">
            <div :class="$style['cgpay-img']" @click="actionChangePage({ page: 'cgPay', type: 'static' })" />
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'actionChangePage'
        ])
    }
};
</script>

<style lang="scss" module>
.cgpay-wrap {
    padding: 20px;
}
.cgpay-bg {
    min-height: 656px;
    position: relative;
    background: url('/static/image/cgPay/bg_cgpay_help.jpg') no-repeat;

    .cgpay-img {
        width: 165px;
        height: 49px;
        position: absolute;
        top: 275px;
        left: 65px;
        background: url('/static/image/cgPay/btn_cgpay_help.png') no-repeat;
        cursor: pointer;

        &:hover {
            background: url('/static/image/cgPay/btn_cgpay_help_hover.png') no-repeat;
        }
    }
}
</style>
