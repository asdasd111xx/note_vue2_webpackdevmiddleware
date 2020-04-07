<template>
    <div :class="[$style['bet-record-wrap'], colorClass]">
        <mcenter-header :header-setting="headerSetting" />
        <template>
            <div :class="$style['total-sub-wrap']">
                <div
                    :class="[$style['top-sub-title'], { [$style['active']]: isSettled === true }]"
                    @click="setSettled(true)"
                >
                    {{ $text('S_COMPUTED_STR', '已结算') }}
                </div>
                <div
                    :class="[$style['top-sub-title'], { [$style['active']]: isSettled === false }]"
                    @click="setSettled(false)"
                >
                    {{ $text('S_UNCOMPUTE_STR', '未结算') }}
                </div>
            </div>
            <div :class="$style['total-detail-wrap']">
                <div :class="$style['top-wrap-title']">{{ startDate }} - {{ endDate }}</div>
                <div>
                    <div :class="$style['top-wrap-item']">
                        <div>{{ $text('S_WAGER_AMOUNT', '投注金额') }}</div>
                        <div :class="[$style['amount'], { [$style['negative']]: Number(total.bet) < 0 }]">{{ total.bet }}</div>
                    </div>
                    <div :class="$style['top-wrap-item']">
                        <div>{{ $text('S_VALID_BET', '有效投注') }}</div>
                        <div :class="[$style['amount'], { [$style['negative']]: Number(total.valid_bet) < 0 }]">{{ total.valid_bet }}</div>
                    </div>
                    <div :class="$style['top-wrap-item']">
                        <div>{{ $text('S_PAY_OUT_TOTAL', '派彩总计') }}</div>
                        <div :class="[$style['amount'], { [$style['negative']]: Number(total.payoff) < 0 }]">{{ total.payoff }}</div>
                    </div>
                </div>
            </div>
            <div :class="$style['sub-detail-record']">
                <table>
                    <thead>
                        <tr>
                            <th>{{ $text('S_GAMETYPE2', '游戏类别') }}</th>
                            <th>{{ $text('S_MA_NUM_BETS', '单量') }}</th>
                            <th>{{ $text('S_WAGER_AMOUNT', '投注金额') }}</th>
                            <th>{{ $text('S_VALID_BET', '有效投注') }}</th>
                            <th>{{ $text('S_PAY_OUT', '派彩') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr
                            v-for="(item, key) in dataList"
                            :key="`betRecord-${key}`"
                            :class="$style['bet-record-tr']"
                        >
                            <td>{{ item.name }}</td>
                            <td :class="[{ [$style['negative']]: Number(item.counts) < 0 }]">{{ item.counts }}</td>
                            <td :class="[{ [$style['negative']]: Number(item.bet) < 0 }]">{{ item.bet }}</td>
                            <td :class="[{ [$style['negative']]: Number(item.valid_bet) < 0 }]">{{ item.valid_bet }}</td>
                            <td :class="[{ [$style['negative']]: Number(item.payoff) < 0 }]">{{ item.payoff }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Vue from 'vue';
import mixin from '@/mixins/mcenter/betRecord/detail';
import gameName from '@/lib/game_name';

export default {
    components: {
        mcenterHeader: () => import(/* webpackChunkName: 'recordDeposit' */'@/router/mobile/components/common/mcenter/theme1/header')
    },
    mixins: [mixin],
    props: {
        closeEvent: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            headerSetting: {
                title: gameName(this.vendor, this.kind),
                leftBtns: {
                    icon: 'arrow',
                    onClick: () => this.closeEvent()
                }
            },
            startDate: '',
            endDate: ''
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
        }
    },
    created() {
        this.startDate = Vue.moment(this.startTime).format('YYYY-MM-DD');
        this.endDate = Vue.moment(this.endTime).format('YYYY-MM-DD');
    },
    methods: {
        setSettled(status) {
            this.isSettled = status;
            this.inquire();
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
