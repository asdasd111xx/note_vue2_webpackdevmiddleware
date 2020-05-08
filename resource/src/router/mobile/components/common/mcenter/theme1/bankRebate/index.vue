<template>
    <bank-rebate :class="$style[`theme-${siteConfig.MOBILE_WEB_TPL}`]">
        <template scope="{ rebateInitData, messageText, shortDay, pageAll, caculateData, list, pickDateList, rebateCaculate, btnLock, formatTime, rebateState, onableStatus, operateStatus, btnReceiveLock, popReceive, amountCache, rebateSubTotal, realTimePeriod, maintainsList }">
            <div :class="[$style['total-sub-wrap'], 'clearfix']">
                <div
                    :class="[$style['top-sub-title'], { [$style['active']]: mcenterBankRebateType === 'history' }, { [$style['self']]: !rebateInitData.self_rebate }]"
                    @click="getItemType('history'); realTimeNote = false"
                >
                    {{ $text('S_REBATE_HISTORY', '返水历史') }}
                </div>
                <div
                    v-if="rebateInitData.self_rebate"
                    :class="[$style['top-sub-title'], { [$style['active']]: mcenterBankRebateType === 'realtime' }]"
                    @click="getItemType('realtime')"
                >
                    {{ $text('S_REAL_TIME_REBATE', '实时返水') }}
                    <img :src="$getCdnPath('/static/image/mobile/mcenter/btn_description_d.png')" @click.stop="showRealNote" />
                </div>
            </div>
            <div v-if="realTimeNote" :class="$style['real-time-note']">
                <p>1.{{ !rebateInitData.accumulative ? $text('S_VALID_BETTING_AMOUNT') : $text('S_VALID_BETTING_AMOUNT_NEW') }}</p>
                <p>2.{{ !rebateInitData.accumulative ? $text('S_FUNCTION_ET') : $text('S_FUNCTION_ET_NEW') }}</p>
                <p>3.{{ $text('S_CALCULATION_SERVICE') }}</p>
                <p>4.{{ $text('S_ACTUAL_COLLECTION') }}</p>
                <p>5.{{ messageText }}</p>
                <p>6.{{ $text('S_CONSIDERATION_DATA') }}</p>
            </div>
            <template v-if="mcenterBankRebateType === 'history'">
                <div :class="$style['history-top-wrap']">
                    <swiper :options="categoryOptions">
                        <swiper-slide
                            v-for="(item, key) in dateList"
                            :key="`total-data-${key}`"
                            :class="$style['total-item']"
                        >
                            <div @click="actionSetMcenterBankRebate({ type: 'history', interval: item.type })">
                                <div v-if="item.type !== 'week'" :class="$style['total-item-title']">
                                    <span>{{ pickDateList[item.type].startDate }}</span>
                                </div>
                                <div v-else :class="$style['total-item-title']">
                                    <span>{{ pickDateList[item.type].startDate }}</span>
                                    <span>-</span>
                                    <span>{{ pickDateList[item.type].endDate }}</span>
                                </div>
                                <div :class="[$style['total-item-money'], { [$style.week]: item.type === 'week' }]">{{ rebateSubTotal[item.type] }}</div>
                                <div :class="$style['total-item-date']">{{ item.text }}</div>
                            </div>
                        </swiper-slide>
                    </swiper>
                </div>
                <div :class="$style['content-wrap']">
                    <div v-if="pageAll > 0">
                        <div
                            v-for="(item, index) in list"
                            :key="index"
                            :class="$style['content-item']"
                        >
                            <div :class="$style['rebate-header']">{{ item.start_at }}~{{ item.end_at }}</div>
                            <div :class="$style['rebate-body']">
                                <div :class="$style['detail-content']">
                                    <span :class="$style['content-left']">{{ $text('S_CYCLE_TIME', '周期') }}</span>
                                    <div :class="$style['content-right']">{{ item.name }}</div>
                                </div>
                                <div :class="$style['detail-content']">
                                    <span :class="$style['content-left']">{{ $text('S_VALID_BET_TOTAL', '总有效投注') }}</span>
                                    <div :class="$style['content-right']">{{ item.valid_bet }}</div>
                                </div>
                                <div :class="$style['detail-content']">
                                    <span :class="$style['content-left']">{{ $text('S_PREMIUM_AMOUNT', '返水金额') }}</span>
                                    <div :class="$style['content-right']">{{ item.amount }}</div>
                                </div>
                                <div :class="$style['detail-content']">
                                    <span :class="$style['content-left']">{{ $text('S_STATUS', '状态') }}</span>
                                    <div :class="$style['content-right']">{{ item.text }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else :class="$style['content-item']">
                        <div v-if="mcenterBankRebateInterval === 'week'" :class="$style['rebate-header']">{{ pickDateList[mcenterBankRebateInterval].startFullDate }} ~ {{ pickDateList[mcenterBankRebateInterval].endFullDate }}</div>
                        <div v-else :class="$style['rebate-header']">{{ pickDateList[mcenterBankRebateInterval].startFullDate }}</div>
                        <div :class="$style['rebate-nodata']">
                            <img :src="$getCdnPath('/static/image/mobile/mcenter/ic_nodata.png')" />
                            <p>{{ $text('S_NO_DATA_GENERATED', '尚未产生数据') }}</p>
                        </div>
                    </div>
                </div>
            </template>
            <template v-else>
                <div :class="$style['real-top-wrap']">
                    <div :class="$style['real-top-title']">
                        <div>周期: {{ rebateInitData.event_name }}</div>
                        <div :class="$style['calculate-title']">{{ $text('S_CALCULATION_STARTED', '本次计算起始 (美东时间)') }}</div>
                        <div>{{ realTimePeriod }}</div>
                    </div>
                    <div :class="[$style['real-top-btn'], { [$style['disable']]: btnLock && formatTime }]">
                        <div :class="$style['calculate-button']" @click="rebateCaculate()">
                            <span :class="$style['calculate-button-title']">{{ $text('S_TRIAL_CALCULATION', '试算') }}</span>
                            <span v-if="btnLock && formatTime">{{ `(${formatTime})` }}</span>
                        </div>
                    </div>
                </div>
                <div v-if="rebateState !== 'initial'" :class="$style['content-wrap']">
                    <div :class="$style['content-item']">
                        <div :class="$style['rebate-header']">
                            <template v-if="rebateState === 'initial'">--</template>
                            <ele-loading v-else-if="rebateState === 'loading'" />
                            <template v-else>
                                {{ caculateData.start_at }}~{{ caculateData.end_at }}
                            </template>
                        </div>
                        <div :class="$style['rebate-body']">
                            <div :class="$style['detail-content']">
                                <span :class="$style['content-left']">{{ $text('S_CYCLE_TIME', '周期') }}</span>
                                <div :class="$style['content-right']">{{ rebateInitData.event_name }}</div>
                            </div>
                            <div :class="$style['detail-content']">
                                <span :class="$style['content-left']">{{ $text('S_VALID_BET_TOTAL', '总有效投注') }}</span>
                                <div :class="$style['content-right']">
                                    <template v-if="rebateState === 'initial'">--</template>
                                    <ele-loading v-else-if="rebateState === 'loading'" />
                                    <template v-else>{{ caculateData.total }}</template>
                                </div>
                            </div>
                            <div :class="$style['detail-content']">
                                <span :class="$style['content-left']">{{ $text('S_PREMIUM_AMOUNT', '返水金额') }}</span>
                                <div :class="$style['content-right']">
                                    <template v-if="rebateInitData.daily_upper_limit && !caculateData.rebate">{{ $t('S_UPPER_LIMIT') }}</template>
                                    <template v-else-if="rebateState === 'initial'">--</template>
                                    <ele-loading v-else-if="rebateState === 'loading'" />
                                    <template v-else>{{ caculateData.rebate }}</template>
                                </div>
                            </div>
                            <div :class="$style['detail-content']">
                                <span :class="$style['content-left']">{{ $text('S_MINIMUM_PREMIUM_AMOUNT', '最低返水金额') }}</span>
                                <div :class="$style['content-right']">{{ rebateInitData.min_rebate }}</div>
                            </div>
                            <div :class="$style['detail-content']">
                                <span :class="$style['content-left']">{{ $text('S_RECEIVE_NUMBER_TIMES', '可领取次数') }}</span>
                                <div :class="$style['content-right']">{{ rebateInitData.info[0].remaining_times ? rebateInitData.info[0].remaining_times : $t('S_UPPER_LIMIT') }}</div>
                            </div>
                        </div>
                        <div :class="$style['rebate-btn']">
                            <template v-if="!rebateInitData.remaining_times || rebateInitData.daily_upper_limit">
                                <button :class="$style['unrebate-btn']">{{ $t('S_UNABLE_PASS') }}</button>
                            </template>
                            <template v-else-if="rebateState === 'initial'">
                                <button :class="$style['unrebate-btn']" @click="popReceive()">{{ $text('S_RECEIVE', '领取') }}</button>
                            </template>
                            <ele-loading v-else-if="rebateState === 'loading'" />
                            <template v-else>
                                <!-- 當返水金額符合最低返水金額才可領取 rebate 和 min_rebate -->
                                <a
                                    v-if="operateStatus"
                                    id="receive-button"
                                    :class="{ [$style['disable']]: btnReceiveLock }"
                                    href="###"
                                    @click="popReceive()"
                                >
                                    {{ $t('S_RECEIVE') }}
                                </a>
                                <button v-if="onableStatus" :class="$style['unrebate-btn']">{{ $t('S_UNABLE_PASS') }}</button>
                            </template>
                        </div>
                    </div>
                </div>
                <div :class="$style['rebate-manual-title']" @click="isShowTip = !isShowTip">
                    <icon :class="$style['title-icon']" :name="isShowTip ? 'angle-up' : 'angle-down'" />
                    <span :class="$style['manual-title']">{{ $text('S_REAL_DIRECTIONS', '实返说明') }}</span>
                </div>
                <div v-if="isShowTip" :class="$style['rebate-manual-wrap']">
                    <div :class="$style['manual-line']" />
                    <div :class="$style['rebate-manual-tip']">
                        <div>1{{ !rebateInitData.accumulative ? $t('S_VALID_BETTING_AMOUNT') : $t('S_VALID_BETTING_AMOUNT_NEW') }}</div>
                        <div>2{{ !rebateInitData.accumulative ? $t('S_FUNCTION_ET') : $t('S_FUNCTION_ET_NEW') }}</div>
                        <div>3{{ $t('S_CALCULATION_SERVICE') }}</div>
                        <div>4{{ $t('S_ACTUAL_COLLECTION') }}</div>
                        <div>5{{ messageText }}</div>
                        <div>6{{ $t('S_CONSIDERATION_DATA') }}</div>
                        <div v-show="maintainsList">
                            {{ $t('S_CURRENT_PLATFORM') }}：
                            <span :class="$style['maintains-list']">{{ maintainsList }}</span>
                        </div>
                    </div>
                </div>
            </template>
        </template>
    </bank-rebate>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import { mapActions, mapGetters } from 'vuex';
import bankRebate from '@/components/common/mcenter/bankRebate';

export default {
    components: {
        eleLoading: () => import(/* webpackChunkName: 'eleLoading' */'@/router/web/components/tpl/common/element/loading/square'),
        bankRebate,
        Swiper,
        SwiperSlide
    },
    data() {
        return {
            headerSetting: {
                title: this.$text('S_MYREBATE', '我的返水'),
                leftBtns: {
                    icon: 'arrow',
                    onClick: () => this.$router.push('/mobile/mcenter')
                },
                balance: true
            },
            categoryOptions: {
                slidesPerView: 'auto'
            },
            rebateType: true,
            realTimeNote: false,
            dateList: [
                {
                    type: 'yesterday',
                    text: this.$text('S_SENT_YESTERDAY_AMOUNT', '昨日已派金额')
                },
                {
                    type: 'today',
                    text: this.$text('S_SENT_TODAY_AMOUNT', '今日已派金额')
                },
                {
                    type: 'week',
                    text: this.$text('S_LATELY_WEEK', '最近一周')
                }
            ],
            isShowTip: true
        };
    },
    computed: {
        ...mapGetters({
            mcenterBankRebateType: 'getMcenterBankRebateType',
            mcenterBankRebateInterval: 'getMcenterBankRebateInterval',
            siteConfig: 'getSiteConfig'
        })
    },
    methods: {
        ...mapActions([
            'actionSetSystemTime',
            'actionSetPop',
            'actionSetMcenterBankRebate'
        ]),
        getItemType(item) {
            // eslint-disable-next-line no-restricted-globals
            this.rebateType = status;

            if (item === this.mcenterBankRebateType) {
                return;
            }
            this.actionSetMcenterBankRebate({ type: item, interval: this.mcenterBankRebateInterval });
        },
        showRealNote() {
            if (this.rebateType) {
                return;
            }
            this.realTimeNote = !this.realTimeNote;
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
