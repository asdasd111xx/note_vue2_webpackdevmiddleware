<template>
    <div class="bank-rebate">
        <div class="bank-rebate-inner">
            <h1>{{ $t('S_MYREBATE') }}</h1>
            <div v-if="rebateInitData.self_rebate" class="main-radio-wrap clearfix">
                <div class="main-radio">
                    <input
                        id="rebate-history"
                        :checked="mcenterBankRebateType === 'history'"
                        type="radio"
                        name="rebate-type"
                        @click="getItemType('history')"
                    />{{ $t('S_REBATE_HISTORY') }}
                    <label for="rebate-history">
                        <span class="radio-style" />
                    </label>
                </div>
                <div class="main-radio">
                    <input
                        id="realtime-rebate"
                        :checked="mcenterBankRebateType === 'realtime'"
                        type="radio"
                        name="rebate-type"
                        @click="getItemType('realtime')"
                    />{{ $t('S_REAL_TIME_REBATE') }}
                    <label for="realtime-rebate">
                        <span class="radio-style" />
                    </label>
                </div>
            </div>
            <!-- 返水歷史 -->
            <div v-if="mcenterBankRebateType === 'history'" class="rebate-history-wrap">
                <div class="select-button-inner clearfix">
                    <div
                        :class="['select-button select-today', mcenterBankRebateInterval === 'today' ? 'current' : '']"
                        @click="actionSetMcenterBankRebate({ type: 'history', interval: 'today' })"
                    >
                        {{ $t('S_TODDAY') }}
                    </div>
                    <div
                        :class="['select-button select-yesterday', mcenterBankRebateInterval === 'yesterday' ? 'current' : '']"
                        @click="actionSetMcenterBankRebate({ type: 'history', interval: 'yesterday' })"
                    >
                        {{ $t('S_YESTERDAY') }}
                    </div>
                    <div
                        :class="['select-button select-week', mcenterBankRebateInterval === 'week' ? 'current' : '']"
                        @click="actionSetMcenterBankRebate({ type: 'history', interval: 'week' })"
                    >
                        {{ $t('S_LATELY_WEEK') }}
                    </div>
                </div>
                <div v-if="mcenterBankRebateInterval !== 'week'" class="rebate-total-wrap">
                    {{ shortDay }}
                    <span>{{ $t('S_SENT_TOTAL_AMOUNT') }}</span>
                    {{ amount }}
                </div>
                <table id="main-table-rebate" class="main-table">
                    <thead>
                        <tr>
                            <th class="number">{{ $t('S_NUMBER_NO') }}</th>
                            <th class="cycle">{{ $t('S_CYCLE_TIME') }}</th>
                            <th class="interval">{{ $t('S_CALCULATION_INTERVAL') }}</th>
                            <th class="wagering">{{ $t('S_VALID_BET_TOTAL') }}</th>
                            <th class="amount">{{ $t('S_PREMIUM_AMOUNT') }}</th>
                            <th class="status">{{ $t('S_STATUS') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template>
                            <tr v-for="(item, index) in list" :key="index">
                                <td class="number"><div class="title">{{ $t('S_NUMBER_NO') }}</div>{{ index + 1 }}</td>
                                <td class="cycle">
                                    <div class="title">{{ $t('S_CYCLE_TIME') }}</div>
                                    {{ item.name }}
                                </td>
                                <td class="interval">
                                    <div class="title">{{ $t('S_CALCULATION_INTERVAL') }}</div>
                                    <div class="row">
                                        <div class="date-start">{{ item.start_at }}</div>
                                        <div class="date-end">{{ item.end_at }}</div>
                                    </div>
                                </td>
                                <td class="wagering">
                                    <div class="title">{{ $t('S_VALID_BET_TOTAL') }}</div>
                                    {{ item.valid_bet }}
                                </td>
                                <td class="amount">
                                    <div class="title">{{ $t('S_PREMIUM_AMOUNT') }}</div>
                                    {{ item.amount }}
                                </td>
                                <td :class="['status', item.canceled === true ? 'text-red' : '']">
                                    <div class="title">{{ $t('S_STATUS') }}</div>
                                    {{ item.text }}
                                </td>
                            </tr>
                            <tr v-if="mainTotalCount == 0">
                                <td colspan="6" class="no-data">{{ $t('S_NO_DATA_YET') }}</td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <div v-if="mcenterBankRebateInterval === 'week' && pageAll > 0" class="page-wrap">
                    <span :class="`page-first${pageNow === 1 ? ' disable' : ''}`" @click="pageNow === 1 ? '' : mainPageChange(1)" />
                    <span :class="`page-pre${pageNow === 1 ? ' disable' : ''}`" @click="pageNow === 1 ? '' : mainPageChange(pageNow - 1)" />
                    <div class="page-select-wrap">
                        <select
                            v-model="pageNow"
                            class="page-select"
                            @change="mainPageChange(pageNow)"
                        >
                            <option
                                v-for="pageNum in pageAll"
                                :key="pageNum"
                                :value="pageNum"
                            >
                                {{ pageNum }}
                            </option>
                        </select>
                        <span class="page-total">/&nbsp;{{ pageAll }}</span>
                    </div>
                    <span :class="`page-next${pageNow === pageAll ? ' disable' : ''}`" @click="pageNow === pageAll ? '' : mainPageChange(pageNow + 1)" />
                    <span :class="`page-last${pageNow === pageAll ? ' disable' : ''}`" @click="pageNow === pageAll ? '' : mainPageChange(pageAll)" />
                </div>
            </div>
            <!-- 實時返水 -->
            <div v-else class="realtime-rebate-wrap">
                <ol class="realtime-step-wrap clearfix">
                    <li class="step-1">1 <span>{{ $t('S_TRIAL_CALCULATION') }}</span></li>
                    <li :class="['step-2', rebateState === 'ready' ? 'step-active' : '']">2 <span>{{ $t('S_RECEIVE') }}</span></li>
                </ol>
                <div class="trial-calculate-area-wrap clearfix">
                    <div class="calculate-time-inner">
                        <span class="calculate-title">{{ $t('S_CALCULATION_STARTED') }}</span>
                        <span class="calculate-time">{{ rebateInitData.last_stat_at }}</span>
                    </div>
                    <button :class="['calculate-button', { disable: btnLock }]" @click="rebateCaculate()">
                        {{ $t('S_TRIAL_CALCULATION') }}
                        <span v-if="btnLock && formatTime">{{ `(${formatTime})` }}</span>
                    </button>
                </div>
                <table id="main-table-rebate" class="main-table">
                    <thead>
                        <tr>
                            <th class="cycle">{{ $t('S_CYCLE_TIME') }}</th>
                            <th class="interval">{{ $t('S_CALCULATION_INTERVAL') }}</th>
                            <th class="wagering">{{ $t('S_VALID_BET') }}</th>
                            <th class="amount">{{ $t('S_PREMIUM_AMOUNT') }}</th>
                            <th class="minimum-amount">{{ $t('S_MINIMUM_PREMIUM_AMOUNT') }}</th>
                            <th class="receive-number">{{ $t('S_RECEIVE_NUMBER_TIMES') }}</th>
                            <th class="operate">{{ $t('S_OPERATE') }}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <template>
                            <tr>
                                <td class="cycle"><div class="title">{{ $t('S_CYCLE_TIME') }}</div>{{ rebateInitData.event_name }}</td>
                                <td class="interval">
                                    <div class="title">{{ $t('S_CALCULATION_INTERVAL') }}</div>
                                    <template v-if="rebateState === 'initial'">--</template>
                                    <ele-loading v-else-if="rebateState === 'loading'" />
                                    <template v-else>
                                        <div class="row">
                                            <div class="date-start">{{ caculateData.start_at }}</div>
                                            <div class="date-end">{{ caculateData.end_at }}</div>
                                        </div>
                                    </template>
                                </td>
                                <td class="wagering">
                                    <div class="title">{{ $t('S_VALID_BET') }}</div>
                                    <template v-if="rebateState === 'initial'">--</template>
                                    <ele-loading v-else-if="rebateState === 'loading'" />
                                    <template v-else>{{ caculateData.total }}</template>
                                </td>
                                <td class="amount">
                                    <div class="title">{{ $t('S_PREMIUM_AMOUNT') }}</div>
                                    <template v-if="rebateInitData.daily_upper_limit && !caculateData.rebate">{{ $t('S_UPPER_LIMIT') }}</template>
                                    <template v-else-if="rebateState === 'initial'">--</template>
                                    <ele-loading v-else-if="rebateState === 'loading'" />
                                    <template v-else>{{ caculateData.rebate }}</template>
                                </td>
                                <td class="minimum-amount"><div class="title">{{ $t('S_MINIMUM_PREMIUM_AMOUNT') }}</div>{{ rebateInitData.min_rebate }}</td>
                                <td class="receive-number">
                                    <div class="title">{{ $t('S_RECEIVE_NUMBER_TIMES') }}</div>
                                    {{ rebateInitData.remaining_times ? rebateInitData.remaining_times : $t('S_UPPER_LIMIT') }}
                                </td>
                                <td class="operate">
                                    <div class="title">{{ $t('S_OPERATE') }}</div>
                                    <template v-if="!rebateInitData.remaining_times || rebateInitData.daily_upper_limit">
                                        <div class="operate-text">{{ $t('S_UNABLE_PASS') }}</div>
                                    </template>
                                    <template v-else-if="rebateState === 'initial'">--</template>
                                    <ele-loading v-else-if="rebateState === 'loading'" />
                                    <template v-else>
                                        <!-- 當返水金額符合最低返水金額才可領取 rebate 和 min_rebate -->
                                        <a
                                            v-if="operateStatus"
                                            id="receive-button"
                                            :class="{disable: btnReceiveLock}"
                                            href="###"
                                            @click="popReceive()"
                                        >
                                            {{ $t('S_RECEIVE') }}
                                        </a>
                                        <div v-if="onableStatus" class="operate-text">{{ $t('S_UNABLE_PASS') }}</div>
                                    </template>
                                </td>
                            </tr>
                        </template>
                    </tbody>
                </table>
                <div class="rebate-text-wrap">
                    <p>(1){{ !rebateInitData.accumulative ? $t('S_VALID_BETTING_AMOUNT') : $t('S_VALID_BETTING_AMOUNT_NEW') }}</p>
                    <p>(2){{ !rebateInitData.accumulative ? $t('S_FUNCTION_ET') : $t('S_FUNCTION_ET_NEW') }}</p>
                    <p>(3){{ $t('S_CALCULATION_SERVICE') }}</p>
                    <p>(4){{ $t('S_ACTUAL_COLLECTION') }}</p>
                    <p>(5){{ messageText }}</p>
                    <p>(6){{ $t('S_CONSIDERATION_DATA') }}</p>
                    <p v-show="maintainsList">&nbsp;&nbsp;&nbsp;{{ $t('S_CURRENT_PLATFORM') }}：<span class="maintains-list">{{ maintainsList }}</span></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import EST from '@/lib/EST';
import i18n from '@/config/i18n';
import mcenter from '@/api/mcenter';

export default {
    components: {
        eleLoading: () => import(/* webpackChunkName: 'eleLoading' */'@/router/web/components/tpl/common/element/loading/square')
    },
    data() {
        return {
            isFisrtRequest: true,
            estToday: '',
            startTime: '',
            endTime: '',
            shortDay: '',
            amount: '',
            mainTotalCount: 0,
            firstResult: 0,
            maxResults: 10000, // 單頁筆數顯示
            limitResults: 10000, // 取api筆數上限
            pageNow: 1, // 當前頁
            pageAll: 1, // 總頁數
            rebateList: [],
            rebateInitData: {},
            caculateData: {},
            btnLock: false,
            btnReceiveLock: false,
            time: 0,
            lockTimer: '',
            formatTime: '',
            rebateState: 'initial',
            operateStatus: false,
            receiveData: {},
            maintainsList: '',
            onableStatus: false,
            reciprocalStatus: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            systemTime: 'getSystemTime',
            mcenterBankRebateType: 'getMcenterBankRebateType',
            mcenterBankRebateInterval: 'getMcenterBankRebateInterval',
            popType: 'getPopType'
        }),
        list() {
            const first = (this.pageNow - 1) * this.maxResults;
            const last = this.pageNow * this.maxResults;
            return this.rebateList.filter((info, index) => index >= first && index < last);
        },
        messageText() {
            const messageText = this.$t('S_REMAINING_REBATE');
            return messageText.replace('%S', this.rebateInitData.hour);
        }
    },
    watch: {
        mcenterBankRebateInterval(val) {
            this.pageNow = 1;
            if (val === 'today') {
                this.setDayAgo(0);
            } else if (val === 'yesterday') {
                this.setYesterday();
            } else if (val === 'week') {
                this.setDayAgo(6);
            }
        },
        popType(now, prev) {
            if (now === '' && prev === 'rebate') {
                // 當點選派發完成後點選返水歷史，預設開啟今日資料
                if (this.mcenterBankRebateInterval === 'today') {
                    this.setDayAgo(0);
                } else if (this.mcenterBankRebateType === '' && this.mcenterBankRebateInterval === '') {
                    // 當實返派發有誤時，重新設定頁面資料
                    this.init();
                }
            }
        }
    },
    created() {
        this.actionSetIsLoading(true);
        Promise.all([this.init()]).then(() => {
            this.actionSetIsLoading(false);
        });
    },
    destroyed() {
        clearTimeout(this.lockTimer);
    },
    methods: {
        init() {
            mcenter.bankRebateInit({
                success: (response) => {
                    this.rebateInitData = response.ret;
                    this.calculateTime(this.rebateInitData.last_stat_at);

                    // 從其他會員頁切換回我的返水時，恢復元件初始狀態
                    this.actionSetMcenterBankRebate({ type: 'history', interval: 'yesterday' });
                    if (this.rebateInitData.trial_ttl > 0) {
                        this.time = this.rebateInitData.trial_ttl;
                        this.btnLock = true;

                        if (this.reciprocalStatus) {
                            return;
                        }

                        this.rebatelLock();
                    }
                }
            });
            this.bankRebateMaintains();

            mcenter.bankRebateDateTime({
                success: (response) => {
                    const time = new Date(response.ret);
                    this.estToday = EST(time);
                    this.setYesterday();
                }
            });
        },
        getItemType(item) {
            if (item === this.mcenterBankRebateType) {
                return;
            }
            this.actionSetMcenterBankRebate({ type: item, interval: this.mcenterBankRebateInterval });
        },
        getHistoryList() {
            this.shortDay = Vue.moment(this.startTime).format('YYYY-MM-DD');

            mcenter.bankRebateHistory({
                params: {
                    start_at: Vue.moment(this.startTime).format('YYYY-MM-DD 00:00:00-04:00'),
                    end_at: Vue.moment(this.endTime).format('YYYY-MM-DD 23:59:59-04:00'),
                    first_result: this.firstResult,
                    max_results: this.limitResults
                },
                success: (response) => {
                    this.amount = response.total.amount_total;
                    this.rebateList = response.ret;
                    for (let i = 0; i < this.rebateList.length; i += 1) {
                        this.rebateList[i].start_at = EST(this.rebateList[i].start_at);
                        this.rebateList[i].end_at = EST(this.rebateList[i].end_at);
                        this.rebateList[i].rebate_done_at = EST(this.rebateList[i].rebate_done_at);

                        if (this.rebateList[i].canceled) {
                            this.rebateList[i].text = i18n.t('S_DISMISSA');
                        } else if (this.rebateList[i].self && this.rebateList[i].rebate_done_at == null) {
                            this.rebateList[i].text = i18n.t('S_REAL_TIME_REBATE_COMPUTING');
                        } else if (this.rebateList[i].self && this.rebateList[i].rebate_done_at != null) {
                            this.rebateList[i].text = i18n.t('S_REAL_TIME_REBATE');
                        } else {
                            this.rebateList[i].text = i18n.t('S_SYSTEM_DISTRIBUTION');
                        }
                    }
                    this.mainTotalCount = response.pagination.total;
                    this.pageAll = Math.ceil(this.mainTotalCount / this.maxResults);

                    // 當超過10000筆時,再將最大載入筆數設定成總筆數
                    if (this.mainTotalCount > 10000 && this.isFisrtRequest) {
                        this.maxResults = this.mainTotalCount;
                        this.limitResults = this.mainTotalCount;
                        this.isFisrtRequest = false;
                        this.getHistoryList();
                    }
                }
            });
        },
        setDayAgo(days) {
            this.maxResults = this.mcenterBankRebateInterval === 'today' ? 10000 : 20;
            this.startTime = new Date(Vue.moment(this.estToday).add(-days, 'days'));
            this.endTime = this.estToday;
            this.getHistoryList();
        },
        setYesterday() {
            this.maxResults = 10000;
            this.startTime = new Date(Vue.moment(this.estToday).add(-1, 'days'));
            this.endTime = this.startTime;
            this.getHistoryList();
        },
        mainPageChange(page) {
            this.pageNow = page;
            window.scrollTo(0, 0);
        },
        rebateCaculate() {
            if (this.btnLock) {
                return;
            }

            // 防連點
            this.btnLock = true;

            // 頁面不重整時，點選試算的操作狀態設定為fasle
            this.operateStatus = false;
            this.btnReceiveLock = false;

            // 美東時間00:00~00:30期間，系統不提供自助返水
            this.actionSetSystemTime(() => {
                const time = EST(this.systemTime, 'HH:mm:ss');
                const timeStr = time.split(':');
                const seconds = (timeStr[0] * 3600) + (timeStr[1] * 60) + (timeStr[2] * 1);

                if (seconds <= 1800) {
                    this.rebateState = 'initial';
                    alert(i18n.t('S_TRY_AGAIN_LATER'));

                    // 防連點
                    setTimeout(() => {
                        this.btnLock = false;
                    }, 100);
                    return;
                }

                this.rebateState = 'loading';
                this.onableStatus = false;

                mcenter.bankRebateCaculate({
                    success: (response) => {
                        this.rebateState = 'ready';
                        this.caculateData = response.ret;
                        this.caculateData.start_at = EST(this.caculateData.start_at);
                        this.caculateData.end_at = EST(this.caculateData.end_at);
                        if (Number(this.caculateData.rebate) >= Number(this.rebateInitData.min_rebate)) {
                            this.operateStatus = true;
                        } else {
                            this.onableStatus = true;
                        }

                        // 倒數開關
                        if (this.reciprocalStatus) {
                            return;
                        }

                        this.rebatelLock();
                    },
                    fail: () => {
                        this.actionSetMcenterBankRebate({ type: 'history', interval: this.mcenterBankRebateInterval });
                        this.rebateState = 'initial';
                        this.init();
                    }
                });
            });

            this.bankRebateMaintains();
        },
        rebatelLock() {
            if (this.time === 0) {
                this.time = 300;
            }

            this.reciprocalStatus = true;
            this.lockTimer = setInterval(() => {
                this.formatTime = this.time;
                // 當分秒小於10時，數值補0
                const m = (Math.floor((this.formatTime / 60) % 60) < 10) ? `0${Math.floor((this.formatTime / 60) % 60)}` : Math.floor((this.formatTime / 60) % 60);
                const s = (Math.floor(this.formatTime % 60) < 10) ? `0${Math.floor(this.formatTime % 60)}` : Math.floor(this.formatTime % 60);

                this.formatTime = `${m}:${s}`;

                if (this.time === 0) {
                    this.formatTime = '';
                    this.btnLock = false;
                    this.reciprocalStatus = false;
                    clearInterval(this.lockTimer);
                    return;
                }
                this.time -= 1;
            }, 1000);
        },
        popReceive() {
            if (this.btnReceiveLock === true) {
                return;
            }
            this.actionSetSystemTime(() => {
                // 判斷跨日之後是否有重新按下試算
                const caculateTime = new Date(this.caculateData.now_at.replace('+0800', '+08:00'));
                const nowTime = new Date(this.systemTime);
                if (caculateTime.getDate() !== nowTime.getDate()) {
                    this.btnReceiveLock = true;
                    alert(i18n.t('S_RESET_TRIAL'));
                    return;
                }

                window.scrollTo(0, 0);
                this.btnReceiveLock = true;

                mcenter.bankRebateReceive({
                    params: { trial_at: this.caculateData.now_at },
                    success: (response) => {
                        this.receiveData = response.ret;
                        this.receiveData.start_at = EST(this.receiveData.start_at);
                        this.receiveData.end_at = EST(this.receiveData.end_at);
                        // eslint-disable-next-line no-self-assign
                        this.receiveData.id = this.receiveData.id;
                        this.actionSetPop({ type: 'rebate', data: this.receiveData });
                        this.bankRebateInit();
                    },
                    fail: () => {
                        this.rebateState = 'initial';
                        this.init();
                    }
                });
            });
        },
        bankRebateMaintains() {
            mcenter.bankRebateMaintains({
                success: (response) => {
                    const maintainsList = [];
                    response.ret.forEach((maintain) => {
                        maintainsList.push(maintain.alias);
                    });
                    this.maintainsList = maintainsList.join('、');
                }
            });
        },
        bankRebateInit() {
            mcenter.bankRebateInit({
                success: (response) => {
                    this.rebateInitData = response.ret;
                    this.calculateTime(this.rebateInitData.last_stat_at);
                }
            });
        },
        calculateTime(time) {
            // 舊制並且已領取過則需將本次計算起始加上1秒顯示
            const lastTime = time.replace('+0800', '+08:00');
            if (!this.rebateInitData.accumulative && EST(lastTime, 'HH:mm:ss') !== '00:00:00') {
                const calculateTime = new Date(lastTime);
                calculateTime.setTime(calculateTime.getTime() + 1000);
                this.rebateInitData.last_stat_at = EST(new Date(calculateTime));
            } else {
                this.rebateInitData.last_stat_at = EST(lastTime);
            }
        },
        ...mapActions([
            'actionSetSystemTime',
            'actionSetPop',
            'actionSetMcenterBankRebate',
            'actionSetIsLoading'
        ])
    }
};
</script>

<style lang="scss" src="./css/index.scss" scoped></style>
