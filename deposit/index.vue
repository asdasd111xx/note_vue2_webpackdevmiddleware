<template>
    <div :class="[$style['bank-deposit'], $style[`theme-${siteConfig.MCENTER_COLOR}`]]">
        <div :class="[$style['deposit-tab-wrap'], 'clearfix']">
            <div :class="[$style['deposit-title'], tabCurrent === 'deposit' ? $style['is-current'] : '']" @click="tabCurrent = 'deposit'">{{ $text('S_ACCOUNT_DEPOSITE', '存款' ) }}</div>
            <div
                v-if="isShow"
                :class="[$style['deposit-title'], tabCurrent === 'record' ? $style['is-current'] : '']"
                @click="tabCurrent = 'record'"
            >
                {{ $text('S_RECORD', '纪录' ) }}
            </div>
        </div>
        <bank-card-deposit v-if="tabCurrent === 'deposit'" />
        <record-deposit v-if="tabCurrent === 'record'" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        bankCardDeposit: () => import(/* webpackChunkName: 'bankCardDeposit' */'./components/bankCardDeposit'),
        recordDeposit: () => import(/* webpackChunkName: 'recordDeposit' */'./components/recordDeposit')
    },
    data() {
        return {
            tabCurrent: 'deposit'
        };
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig',
            memInfo: 'getMemInfo'
        }),
        isShow() {
            return this.memInfo.config.deposit.includes('迅付');
        }
    },
    methods: {
        changeTab(tabInfo) {
            this.tabCurrent = tabInfo;
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
