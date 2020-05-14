<template>
    <div class="bank-rebate-data">
        <slot
            :rebate-init-data="rebateInitData"
            :caculate-data="caculateData"
            :message-text="messageText"
            :short-day="shortDay"
            :page-all="pageAll"
            :list="list"
            :pick-date-list="pickDateList"
            :rebate-caculate="rebateCaculate"
            :btn-lock="btnLock"
            :btn-receive-lock="btnReceiveLock"
            :format-time="formatTime"
            :rebate-state="rebateState"
            :pop-receive="popReceive"
            :amountCache="amountCache"
            :rebate-sub-total="rebateSubTotal"
            :immediate-data="immediateData"
            :real-time-rebate-total="realTimeRebateTotal"
            :receive-all="receiveAll"
            :maintains-list="maintainsList"
            :is-receive-all="isReceiveAll"
            :real-time-period="realTimePeriod"
        />
    </div>
</template>

<script>
import Vue from 'vue';
import { mapActions, mapGetters } from 'vuex';
import { format } from 'date-fns';
import EST from '@/lib/EST';
import i18n from '@/config/i18n';
import mcenter from '@/api/mcenter';
import { API_MCENTER_REBATE_RECEIVE_ALL } from '@/config/api';
import ajax from '@/lib/ajax';

export default {
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
            rebateSubTotal: {},
            btnLock: false,
            btnReceiveLock: [],
            time: 0,
            lockTimer: '',
            formatTime: '',
            rebateState: 'initial',
            receiveData: {},
            maintainsList: '',
            reciprocalStatus: false,
            pickDateList: {
                today: {
                    startDate: '',
                    endDate: '',
                    startFullDate: '',
                    endFullDate: ''
                },
                yesterday: {
                    startDate: '',
                    endDate: '',
                    startFullDate: '',
                    endFullDate: ''
                },
                week: {
                    startDate: '',
                    endDate: '',
                    startFullDate: '',
                    endFullDate: ''
                }
            },
            amountCache: {
                today: '--',
                yesterday: '--',
                week: '--'
            }
        };
    },
    computed: {
        ...mapGetters({
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
        },
        /**
         * 整理實時返水所需資料
         * @returns {array} 實時返水資料
         */
        immediateData() {
            if (this.rebateState === 'initial' || this.rebateState === 'loading') {
                return this.rebateInitData.info;
            }

            let rebateInfoData = {};

            this.rebateInitData.info.forEach((item) => {
                rebateInfoData = {
                    ...rebateInfoData,
                    [item.vip_config_id]: {
                        ...item
                    }
                };
            });

            const resultData = this.caculateData.map((item) => ({
                ...item,
                ...rebateInfoData[item.vip_config_id],
                operateStatus: Number(item.rebate) >= Number(rebateInfoData[item.vip_config_id].min_rebate)
            }));

            return resultData;
        },
        /**
         * 返水總金額
         * @returns {number} 實時返水總金額
         */
        realTimeRebateTotal() {
            if (!this.rebateInitData.is_vip) {
                return '--';
            }

            const allTotal = this.immediateData.reduce((item, nextItem) => Number(item) + Number(nextItem.rebate), 0);
            return allTotal ? allTotal.toFixed(2) : '--';
        },
        /**
         * 一鍵全領是否可按
         * @returns {boolean}} 是否可一鍵全領
         */
        isReceiveAll() {
            if (this.rebateState === 'initial' || this.rebateState === 'loading') {
                return false;
            }

            // 判斷是否可領取
            return this.btnReceiveLock.some((item) => item);
        },
        realTimePeriod() {
            if (!this.rebateInitData.event_end_at) {
                return '--';
            }

            const estDate = new Date(this.rebateInitData.event_end_at).getTime() + ((new Date(this.rebateInitData.event_end_at).getTimezoneOffset() / 60) * 3600000) - 14400000;
            return `${this.EST(this.rebateInitData.event_start_at)}～${format(new Date(estDate), 'HH:mm:ss')}`;
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
                this.getTotalRebateByUser();

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
        this.init();
        this.getTotalRebateByUser();
    },
    destroyed() {
        clearTimeout(this.lockTimer);
    },
    methods: {
        ...mapActions([
            'actionSetSystemTime',
            'actionSetPop',
            'actionSetMcenterBankRebate'
        ]),
        EST,
        init() {
            mcenter.bankRebateInit({
                success: (response) => {
                    this.rebateInitData = response.ret;

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
                    this.estToday = this.EST(time);
                    this.setYesterday();

                    this.pickDateList = {
                        today: {
                            startDate: Vue.moment(this.estToday).format('MM/DD'),
                            endDate: Vue.moment(this.estToday).format('MM/DD'),
                            startFullDate: Vue.moment(this.estToday).format('YYYY/MM/DD 00:00:00'),
                            endFullDate: Vue.moment(this.estToday).format('YYYY/MM/DD 23:59:59')
                        },
                        yesterday: {
                            startDate: Vue.moment(this.estToday).add(-1, 'days').format('MM/DD'),
                            endDate: Vue.moment(this.estToday).add(-1, 'days').format('MM/DD'),
                            startFullDate: Vue.moment(this.estToday).add(-1, 'days').format('YYYY/MM/DD 00:00:00'),
                            endFullDate: Vue.moment(this.estToday).add(-1, 'days').format('YYYY/MM/DD 23:59:59')
                        },
                        week: {
                            startDate: Vue.moment(this.estToday).add(-6, 'days').format('MM/DD'),
                            endDate: Vue.moment(this.estToday).format('MM/DD'),
                            startFullDate: Vue.moment(this.estToday).add(-6, 'days').format('YYYY/MM/DD 00:00:00'),
                            endFullDate: Vue.moment(this.estToday).format('YYYY/MM/DD 23:59:59')
                        }
                    };
                }
            });
        },
        bankRebateInit() {
            mcenter.bankRebateInit({
                success: (response) => {
                    this.rebateInitData = response.ret;
                }
            });
        },
        getTotalRebateByUser() {
            mcenter.bankRebateSubTotal({
                success: (response) => {
                    this.rebateSubTotal = {
                        week: response.ret.recent_week,
                        ...response.ret
                    };
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
            // 先將當下的interval狀態保存，避免下面取值時狀態已發生改變
            const interval = this.mcenterBankRebateInterval;

            mcenter.bankRebateHistory({
                params: {
                    start_at: Vue.moment(this.startTime).format('YYYY-MM-DD 00:00:00-04:00'),
                    end_at: Vue.moment(this.endTime).format('YYYY-MM-DD 23:59:59-04:00'),
                    first_result: this.firstResult,
                    max_results: this.limitResults || 10000
                },
                success: (response) => {
                    this.amount = response.total.amount_total;
                    this.amountCache[interval] = response.total.amount_total;
                    this.rebateList = response.ret;
                    for (let i = 0; i < this.rebateList.length; i += 1) {
                        this.rebateList[i].start_at = this.EST(this.rebateList[i].start_at);
                        this.rebateList[i].end_at = this.EST(this.rebateList[i].end_at);
                        this.rebateList[i].rebate_done_at = this.EST(this.rebateList[i].rebate_done_at);

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
            this.btnReceiveLock = this.immediateData.map(() => false);

            // 美東時間00:00~00:30期間，系統不提供自助返水
            this.actionSetSystemTime(() => {
                const time = this.EST(this.systemTime, 'HH:mm:ss');
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

                mcenter.bankRebateCaculate({
                    success: (response) => {
                        const arrangeData = [];

                        response.ret.forEach((item) => {
                            arrangeData.push({
                                ...item,
                                start_at: this.EST(item.start_at),
                                end_at: this.EST(item.end_at)
                            });
                        });

                        this.caculateData = arrangeData;
                        this.rebateState = 'ready';

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
        popReceive(dataIndex) {
            if (this.btnReceiveLock[dataIndex] === true) {
                return;
            }
            this.actionSetSystemTime(() => {
                this.$set(this.btnReceiveLock, dataIndex, true);

                // 判斷跨日之後是否有重新按下試算
                const caculateTime = new Date(this.caculateData[dataIndex].now_at.replace('+0800', '+08:00'));
                const nowTime = new Date(this.systemTime);
                if (caculateTime.getDate() !== nowTime.getDate()) {
                    alert(i18n.t('S_RESET_TRIAL'));
                    return;
                }

                window.scrollTo(0, 0);

                mcenter.bankRebateReceive({
                    params: {
                        trial_at: this.caculateData[dataIndex].now_at,
                        vip_config_id: this.caculateData[dataIndex].vip_config_id
                    },
                    success: (response) => {
                        const receiveData = {
                            idArray: [response.ret.id],
                            start_at: `${this.EST(this.rebateInitData.event_start_at)}-04:00`,
                            end_at: `${this.EST(this.rebateInitData.event_end_at)}-04:00`
                        };

                        this.actionSetPop({ type: 'rebate', data: receiveData });
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
        receiveAll() {
            if (!this.isReceiveAll) {
                return;
            }

            ajax({
                method: 'post',
                url: API_MCENTER_REBATE_RECEIVE_ALL,
                errorAlert: false,
                params: {
                    trial_at: this.caculateData[0].now_at
                },
                success: (response) => {
                    this.btnReceiveLock = this.immediateData.map(() => true);

                    const receiveData = {
                        idArray: response.ret.map((item) => item.id),
                        start_at: `${this.EST(this.rebateInitData.event_start_at)}-04:00`,
                        end_at: `${this.EST(this.rebateInitData.event_end_at)}-04:00`
                    };

                    this.actionSetPop({ type: 'rebate', data: receiveData });
                    this.bankRebateInit();
                },
                fail: () => {
                    this.rebateState = 'initial';
                    this.init();
                }
            });
        }
    }
};
</script>
