import Vue from 'vue';
import { API_MANAGEMENT_LEVEL_LIST } from '@/config/api';
import ajax from '@/lib/ajax';
import EST from '@/lib/EST';

export default {
    props: {
        period: {
            type: String,
            required: true
        }
    },
    data() {
        const estToday = EST(new Date(), '', true);
        const days = estToday.getDay() || 7; // 取得當前是星期幾，用來取得本週與上週的日期
        const week = [
            new Date(Vue.moment(estToday).add(-(days - 1), 'days')),
            estToday
        ];
        const last = [
            new Date(Vue.moment(estToday).add(-((days - 1) + 7), 'days')),
            new Date(Vue.moment(estToday).add(-((days - 1) + 1), 'days'))
        ];
        const thirty = [
            new Date(Vue.moment(estToday).add(-29, 'days')),
            estToday
        ];
        const date = [...week];

        return {
            week,
            last,
            thirty,
            date,
            levelTrans: {
                1: 'S_FIRST_LEVEL_FRIEND',
                2: 'S_SECOND_LEVEL_FRIEND',
                3: 'S_THIRD_LEVEL_FRIEND',
                4: 'S_FOURTH_LEVEL_FRIEND',
                5: 'S_FIFTH_LEVEL_FRIEND'
            },
            levelList: [],
            allTotal: {}
        };
    },
    watch: {
        period() {
            switch (this.period) {
                case 'week':
                    this.date = [...this.week];
                    break;
                case 'last':
                    this.date = [...this.last];
                    break;
                case 'thirty':
                    this.date = [...this.thirty];
                    break;
                default:
                    break;
            }

            this.getLevelList();
        }
    },
    created() {
        this.getLevelList();
    },
    methods: {
        /**
         * 取得各級好友的資訊
         * @method getLevelList
         */
        getLevelList() {
            this.levelList = [];

            ajax({
                method: 'get',
                url: API_MANAGEMENT_LEVEL_LIST,
                params: {
                    start_at: Vue.moment(this.date[0]).format('YYYY-MM-DD 00:00:00-04:00'),
                    end_at: Vue.moment(this.date[1]).format('YYYY-MM-DD 23:59:59-04:00')
                },
                success: ({ result, ret }) => {
                    if (result !== 'ok') {
                        return;
                    }

                    if (!ret.length) {
                        alert(this.$text('S_NO_DATA_TPL'));
                        return;
                    }

                    this.allTotal = {
                        total: 0,
                        register: 0,
                        deposit: 0,
                        withdraw: 0
                    };

                    this.levelList = ret.map((info) => {
                        this.allTotal.total += +info.total;
                        this.allTotal.register += +info.register;
                        this.allTotal.deposit += +info.deposit;
                        this.allTotal.withdraw += +info.withdraw;

                        return info;
                    });
                }
            });
        }
    }
};
