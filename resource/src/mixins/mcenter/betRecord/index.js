import { mapGetters } from 'vuex';
import Vue from 'vue';
import EST from '@/lib/EST';
import ajax from '@/lib/ajax';
import datepickerLang from '@/lib/datepicker_lang';
import { API_MCENTER_BETRECORD_TOTAL, API_MCENTER_BETRECORD_ALL } from '@/config/api';
import gameName from '@/lib/game_name';

export default {
    data() {
        return {
            initLimiDay: -31,
            initStartDay: -6,
            inquiryStartTime: '',
            inquiryEndTime: '',
            dateLang: datepickerLang(this.$i18n.locale),
            options: [{ value: 'all', text: this.$t('S_ALL') }],
            limitDays: '',
            estToday: EST(new Date(), '', true),
            startTime: '',
            endTime: '',
            sort: '',
            order: '',
            type: 'all',
            allTotalData: {},
            mainListData: [],
            mainNoData: true,
            mainTotal: {
                bet: 0,
                valid_bet: 0,
                payoff: 0
            },
            messageStatus: false
        };
    },
    computed: {
        ...mapGetters({
            gameData: 'getGameData'
        }),
        dateTypeList() {
            return {
                search: {
                    text: 'S_SEARCH_FOR'
                },
                overview: {
                    text: 'S_BET_OVERVIEW'
                },
                ...this.allTotalData
            };
        }
    },
    created() {
        this.getBetRecordTotal();
        this.getAllGameData();
        this.limitDays = new Date(Vue.moment(this.estToday).add(this.initLimiDay, 'days'));
        this.startTime = Vue.moment(this.estToday).format('YYYY-MM-DD');
        this.endTime = Vue.moment(this.estToday).format('YYYY-MM-DD');
        this.inquire();
    },
    methods: {
        getBetRecordTotal() {
            return ajax({
                method: 'get',
                url: API_MCENTER_BETRECORD_TOTAL,
                success: (response) => {
                    const temp = response.ret;
                    const textObj = {
                        today: 'S_TODDAY',
                        yesterday: 'S_YESTERDAY',
                        this_week: 'THIS_WEEK',
                        last_week: 'S_LAST_WEEK',
                        this_month: 'THIS_MONTH',
                        last_month: 'LAST_MONTH'
                    };
                    const tempData = {};

                    Object.keys(temp).forEach((index) => {
                        tempData[index] = {
                            start_at: temp[index].start_at,
                            end_at: temp[index].end_at,
                            startShow: Vue.moment(temp[index].start_at).format('MM/DD'),
                            endShow: Vue.moment(temp[index].end_at).format('MM/DD'),
                            money: +temp[index].total !== 0 ? Number(temp[index].total).toFixed(2) : +temp[index].total,
                            text: textObj[index]
                        };
                    });

                    this.allTotalData = tempData;
                }
            });
        },
        getAllGameData() {
            Object.keys(this.gameData).forEach((index) => {
                const { vendor } = this.gameData[index];
                if (this.gameData[index].switch === 'Y' && this.options.map((item) => item.value).indexOf(vendor) === -1) {
                    this.options.push({ value: vendor, text: gameName(vendor) });
                }
            });
        },
        quickInquire(key) {
            const data = this.allTotalData[key];
            this.type = 'all';
            this.startTime = new Date(data.start_at);
            this.endTime = new Date(data.end_at);
            this.inquire();
        },
        inquire(sortBy = '') {
            const params = {
                start_at: Vue.moment(this.startTime).format('YYYY-MM-DD 00:00:00-04:00'),
                end_at: Vue.moment(this.endTime).format('YYYY-MM-DD 23:59:59-04:00')
            };
            const sortList = ['bet', 'valid_bet', 'payoff'];
            this.startTime = Vue.moment(this.startTime).format('YYYY-MM-DD');
            this.endTime = Vue.moment(this.endTime).format('YYYY-MM-DD');

            // 判斷排序問題
            if (this.sort !== '' || sortList.includes(sortBy)) {
                if (sortList.includes(sortBy)) {
                    if (sortBy === this.sort) {
                        this.order = (this.order === 'asc') ? 'desc' : 'asc';
                    } else {
                        this.sort = sortBy;
                        this.order = 'asc';
                    }
                }
                params.sort = this.sort;
                params.order = this.order;
            }
            return ajax({
                method: 'get',
                url: API_MCENTER_BETRECORD_ALL,
                params,
                success: (response) => {
                    this.mainListData = [];
                    this.inquiryStartTime = this.startTime;
                    this.inquiryEndTime = this.endTime;

                    setTimeout(() => {
                        this.messageStatus = false;
                    }, 3000);

                    if (this.type === 'all') {
                        this.mainListData = response.ret;
                    } else {
                        let num = 0;
                        for (let i = 0; i < response.ret.length; i += 1) {
                            if (this.type === response.ret[i].vendor) {
                                this.mainListData[num] = response.ret[i];
                                num += 1;
                            }
                        }
                    }

                    if (this.mainListData.length === 0) {
                        this.mainListData = '';
                        this.mainNoData = true;
                        this.mainTotal = {
                            bet: 0,
                            valid_bet: 0,
                            payoff: 0
                        };
                        return;
                    }

                    this.mainTotal = {
                        bet: 0,
                        valid_bet: 0,
                        payoff: 0
                    };

                    for (let index = 0; index < this.mainListData.length; index += 1) {
                        this.mainTotal.bet = this.accAdd(this.mainTotal.bet, this.mainListData[index].bet);
                        this.mainTotal.valid_bet = this.accAdd(this.mainTotal.valid_bet, this.mainListData[index].valid_bet);
                        this.mainTotal.payoff = this.accAdd(this.mainTotal.payoff, this.mainListData[index].payoff);
                    }

                    this.mainNoData = false;
                }
            });
        },
        accAdd(arg1, arg2) {
            let r1;
            let r2;
            let n1 = arg1;
            let n2 = arg2;
            try {
                r1 = n1.toString().split('.')[1].length;
            } catch (e) {
                r1 = 0;
            }
            try {
                r2 = n2.toString().split('.')[1].length;
            } catch (e) {
                r2 = 0;
            }
            const c = Math.abs(r1 - r2);
            const m = Math.pow(10, Math.max(r1, r2)); // eslint-disable-line no-restricted-properties
            const cm = Math.pow(10, c); // eslint-disable-line no-restricted-properties
            if (c > 0 && r1 > r2) {
                n1 = Number(n1.toString().replace('.', ''));
                n2 = Number(n2.toString().replace('.', '')) * cm;
                return (n1 + n2) / m;
            }
            if (c > 0 && r1 <= r2) {
                n1 = Number(n1.toString().replace('.', '')) * cm;
                n2 = Number(n2.toString().replace('.', ''));
                return (n1 + n2) / m;
            }
            n1 = Number(n1.toString().replace('.', ''));
            n2 = Number(n2.toString().replace('.', ''));
            return (n1 + n2) / m;
        }
    }
};
