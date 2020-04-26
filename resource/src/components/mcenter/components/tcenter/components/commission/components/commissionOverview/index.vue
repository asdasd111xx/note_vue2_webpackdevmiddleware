<template>
    <div :class="mainClass">
        <div :class="[$style['date-wrap'], 'clearfix']">
            <div :class="$style.date">{{$text(`S_${currentMonth}_MONTH`)}}/{{ currentYear }}</div>
            <div :class="$style.remainder">{{ $text('S_DAYSLEFT', { replace: [{ target: '%s', value: remainderDays }] }) }}</div>
        </div>
        <div v-if="summary" :class="$style['summary-wrap']">
            <div
                v-for="(info, index) in summaryTitle"
                :key="`title-${info.key}`"
                :class="$style.wrap"
            >
                <div :class="[$style['title-wrap'], 'clearfix']" @click="onClick(info)">
                    <div :class="$style['btn-arrow']">
                        <icon
                            v-if="isSummaryShow[info.key]"
                            name="chevron-up"
                            width="10"
                            height="10"
                        />
                        <icon
                            v-else
                            name="chevron-down"
                            width="10"
                            height="10"
                        />
                    </div>
                    <div :class="$style.title">{{ info.text }}</div>
                    <div :class="$style.amount">{{ info.amount }}</div>
                </div>
                <!-- 預估返利(第三方) -->
                <template v-if="info.key === 'expected'">
                    <div v-show="isSummaryShow[info.key]" :class="$style['detail-wrap']">
                        <div :class="[$style.detail, 'clearfix']">
                            <div :class="[$style.text, $style.main]">{{ $text('S_EXPECTED_LOSS_REBATE', '盈亏返利预估') }}</div>
                            <div :class="[$style.amount, $style.main, { [$style.deficit]: +summaryContent[index].amount < 0 }]">{{ summaryContent[index].amount }}</div>
                        </div>
                        <div :class="[$style.detail, 'clearfix']">
                            <div :class="[$style.text, $style.main]">{{ $text('S_REBATE_LEVEL', '返利级别') }}</div>
                            <div :class="[$style.amount, $style.main]">{{ summaryContent[index].rate }} %</div>
                        </div>
                        <div :class="$style.divider" />
                        <div :class="$style['summary-date']">({{ summaryContent[index].start_at | dateFormat }}-{{ summaryContent[index].end_at | dateFormat }})</div>
                        <div :class="[$style.detail, 'clearfix']">
                            <div :class="$style.text">{{ $text('S_ACH_VALID_MEMBERS', '有效会员') }}</div>
                            <div :class="$style.amount">{{ summaryContent[index].valid_user }} {{ $text('S_PERSON', '人') }}</div>
                        </div>
                        <div :class="[$style.detail, 'clearfix']">
                            <div :class="$style.text">{{ $text('S_VALID_BET', '有效投注') }}</div>
                            <div :class="$style.amount">{{ summaryContent[index].valid_bet }}</div>
                        </div>
                        <div :class="[$style.detail, 'clearfix']">
                            <div :class="$style.text">{{ $text('S_GAME_LOSS', '游戏盈亏') }}</div>
                            <div :class="[$style.amount, { [$style.deficit]: +summaryContent[index].profit < 0 }]">{{ summaryContent[index].profit }}</div>
                        </div>
                        <div :class="[$style.detail, 'clearfix']">
                            <div :class="$style.text">{{ $text('S_SENT_RAKEBACK', '已派返水') }}</div>
                            <div :class="$style.amount">{{ summaryContent[index].dispatched_rebate }}</div>
                        </div>
                        <div :class="[$style.detail, 'clearfix']">
                            <div :class="$style.text">{{ $text('S_SENT_PROMOTIONS', '已派优惠') }}</div>
                            <div :class="$style.amount">{{ summaryContent[index].dispatched_offer }}</div>
                        </div>
                        <div :class="[$style.detail, 'clearfix']">
                            <div :class="$style.text">{{ $text('S_MEM_DEPOSIT', '会员入款') }}</div>
                            <div :class="$style.amount">{{ summaryContent[index].deposit }}</div>
                        </div>
                        <div :class="[$style.detail, 'clearfix']">
                            <div :class="$style.text">{{ $text('S_MEM_WITHDRAW', '会员出款') }}</div>
                            <div :class="$style.amount">{{ summaryContent[index].withdraw }}</div>
                        </div>
                        <div :class="[$style.detail, 'clearfix']">
                            <div :class="$style.text">{{ $text('S_PLATFORM_COST', '平台费') }}</div>
                            <div :class="$style.amount">{{ summaryContent[index].vendor_fee }}</div>
                        </div>
                        <div v-if="summaryContent[index].shift_amount" :class="[$style.detail, 'clearfix']">
                            <div :class="$style.text">{{ $text('S_SHIFT_AMOUNT', '是否上期結轉') }}</div>
                            <div :class="$style.amount">{{ $text('S_HAVE', '有') }}</div>
                        </div>
                        <div :class="$style.tips">※ {{ $text('S_EVERY_DAY_UPDATE', { replace: [{ target: '%s', value: '6:00' }] }) }}</div>
                    </div>
                </template>
                <template v-else-if="summaryContent[index].amount + summaryContent[index].oauthAmount <= 0">
                    <div v-show="isSummaryShow[info.key]" :class="$style['detail-wrap']">
                        <div :class="$style['no-data']">{{ $text('S_NO_DATA_YET', '暂无资料') }}</div>
                    </div>
                </template>
                <template v-else>
                    <div v-show="isSummaryShow[info.key]">
                        <div v-if="summaryContent[index].amount" :class="[$style['detail-wrap'], 'clearfix']">
                            <div :class="$style.text">{{ summaryContent[index].text }}</div>
                            <div :class="$style.amount">{{ summaryContent[index].amount }}</div>
                        </div>
                        <div v-if="summaryContent[index].oauthAmount" :class="[$style['detail-wrap'], 'clearfix']">
                            <div :class="$style.text">{{ summaryContent[index].oauthText }}</div>
                            <div :class="$style.amount">{{ summaryContent[index].oauthAmount }}</div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script>
import commissionOverview from '@/mixins/mcenter/commission/commissionOverview';

export default {
    mixins: [commissionOverview],
    data() {
        return {
            isSummaryShow: {
                today: false,
                yesterday: false,
                monthly: false,
                expected: false
            }
        };
    },
    computed: {
        mainClass() {
            const site = `site-${this.memInfo.user.domain}`;

            return {
                'commission-overview-wrap': true,
                [this.$style[site]]: this.$style[site],
                [this.$style['preset-color']]: !this.$style[site]
            };
        }
    },
    methods: {
        onClick({ key }) {
            this.isSummaryShow[key] = !this.isSummaryShow[key];
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
