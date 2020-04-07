import Vue from 'vue';
import { API_MANAGEMENT_LEVEL_LIST } from '@/config/api';
import ajax from '@/lib/ajax';

export default {
    data() {
        return {
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
        date() {
            this.getLevelList(this.date);
        }
    },
    methods: {
        /**
         * 取得各級好友的資訊
         * @method getLevelList
         * @param {Array} date - 日期
         */
        getLevelList(date) {
            this.levelList = [];

            return ajax({
                method: 'get',
                url: API_MANAGEMENT_LEVEL_LIST,
                params: {
                    start_at: Vue.moment(date[0]).format('YYYY-MM-DD 00:00:00-04:00'),
                    end_at: Vue.moment(date[1]).format('YYYY-MM-DD 23:59:59-04:00')
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
