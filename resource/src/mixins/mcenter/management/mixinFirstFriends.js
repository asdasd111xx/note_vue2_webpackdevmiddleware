import Vue from 'vue';
import { API_FIRST_LEVEL_FRIENDS } from '@/config/api';
import ajax from '@/lib/ajax';

export default {
    data() {
        return {
            isReceive: false,
            friendsTrans: {
                1: 'S_MEMBER_REGISTER',
                2: 'S_AGENT_JOIN_2',
                3: 'S_HALL_CREATE',
                4: 'S_HALL_CREATE_LOT'
            },
            firstFriends: [],
            subInfoIndex: -1, // 要顯示詳細資料的索引值(for mobile)
            maxResults: 10,
            sort: '',
            order: {
                created_at: false,
                last_online: false
            }
        };
    },
    watch: {
        current() {
            let params = {};

            if (this.sort) {
                params = { sort: this.sort, order: this.order.created_at ? 'asc' : 'desc' };
            }

            this.getFirstFriends(params);
        }
    },
    filters: {
        /**
         * 金額格式化
         * @method commaFormat
         * @param {String} value - 金額
         * @returns {String} 格式化後的金額
         */
        commaFormat(value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        /**
         * 日期格式化
         * @method dateFormat
         * @param {Date} value - 日期
         * @param {String} format - 日期格式
         * @returns {String} 格式化後的日期
         */
        dateFormat(value, format = 'YYYY-MM-DD HH:mm:ss') {
            return Vue.moment(value).utcOffset(-4).format(format);
        }
    },
    methods: {
        /**
         * 取的一級好友資料
         * @method getFirstFriends
         * @param {Object} params - 排序
         */
        getFirstFriends(params) {
            return ajax({
                method: 'get',
                url: API_FIRST_LEVEL_FRIENDS,
                params: {
                    ...params,
                    first_result: (this.current - 1) * this.maxResults,
                    max_results: this.maxResults
                },
                success: ({ result, ret, pagination }) => {
                    if (result !== 'ok') {
                        return;
                    }

                    if (!ret.length) {
                        return;
                    }

                    // 計算資料會有幾頁，一頁最多十筆
                    this.$emit('update:total', Math.ceil(pagination.total / this.maxResults));
                    this.firstFriends = ret;
                }
            });
        },
        /**
         * 會員是否在線
         * @method isOnline
         * @param {Date} lastLogin - 最後登入時間
         * @param {Date} lastOnline - 最後離線時間
         * @returns {Boolean} true or false
         */
        isOnline({ last_login: lastLogin, last_online: lastOnline }) {
            if (!lastLogin) {
                return false;
            }

            if (!lastOnline) {
                return true;
            }

            return lastLogin > lastOnline;
        },
        /**
         * 排序
         * @method onSort
         * @param {String} key - 要排序的欄位
         */
        onSort(key) {
            this.sort = key;
            this.order[key] = !this.order[key];
            this.getFirstFriends({ sort: key, order: this.order[key] ? 'asc' : 'desc' });
        },
        /**
         * 手機版一級好友詳細資料索引切換
         * @method onChangeSubInfo
         * @param {Number} value - 索引值
         */
        onChangeSubInfo(value) {
            if (this.subInfoIndex === value) {
                this.subInfoIndex = -1;
                return;
            }

            this.subInfoIndex = value;
        }
    }
};
