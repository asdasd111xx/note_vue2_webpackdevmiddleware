<template>
    <div :class="$style['vip-exclusive-wrap']">
        <div :class="$style['vip-title']">
            <p>{{ $text('S_INFORMATION' ,'我的') }}VIP</p>
        </div>
        <div :class="$style['vip-header']">
            {{ $text('S_INFORMATION' ,'我的') }}{{ $text('S_VIP_LEVEL' ,'VIP等级') }}：{{ vipData.now_level_name }} &emsp;
            <!-- eslint-disable vue/no-v-html -->
            <span v-html="tipText" />
            <!-- eslint-enable vue/no-v-html -->
        </div>
        <div :class="$style['vip-sub-title']">
            <p>{{ $text('S_VIP_PRIVILEGE' ,'我享有的特权') }}</p>
        </div>
        <div :class="$style['vip-sub-header']">
            <div :class="$style['sub-header-item']">
                <p>{{ $text('S_VIP_UPGRADE_GIFT' ,'升级礼金') }}</p>
                <span>{{ vipData.now_gift_amount }}{{ $text('S_DOLLAR' ,'元') }}</span>
            </div>
            <div :class="$style['sub-header-item']">
                <p>{{ $text('S_VIP_BIRTH_GIFT' ,'生日礼金') }}</p>
                <span>{{ vipData.now_birth_amount }}{{ $text('S_DOLLAR' ,'元') }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import mcenter from '@/api/mcenter';

export default {
    data() {
        return {
            vipData: {}
        };
    },
    computed: {
        tipText() {
            return this.$text('S_VIP_UPGRADE_TIP', {
                replace: [
                    { target: '%S', value: this.vipData.upgrade_deposit_amount },
                    { target: '%S', value: this.vipData.upgrade_valid_bet },
                    { target: '%S', value: this.vipData.next_level_name }
                ]
            });
        }
    },
    created() {
        this.actionSetIsLoading(true);
        mcenter.accountVIP({
            success: (response) => {
                this.vipData = {
                    ...response.ret
                };
            }
        })
            .then(() => {
                this.actionSetIsLoading(false);
            });
    },
    methods: {
        ...mapActions([
            'actionSetIsLoading'
        ])
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
