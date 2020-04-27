import Vue from 'vue';
import { API_FIRST_LEVEL_FRIENDS } from '@/config/api';
import ajax from '@/lib/ajax';

/**
 * @param {String} current - 當前頁數
 * @param {Number} total - 選擇總頁數
 */
export default {
    data() {
        return {
            isReceive: false,
            showInfinite: true,
            friendsTrans: {
                1: 'S_MEMBER_REGISTER',
                2: 'S_AGENT_JOIN_2',
                3: 'S_HALL_CREATE',
                4: 'S_HALL_CREATE_LOT'
            },
            firstFriends: [],
            subInfoIndex: -1, // 要顯示詳細資料的索引值(for mobile)
            firstResult: 0,
            maxResults: 10 ,
            pageNow: 1,
            pageAll: 1 ,
            sort: '',
            order: {
                created_at: false,
                last_online: false
            }
        };
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
    created() {
        // this.getFirstFriends();
    },
    methods: {
        /**
         * 取的一級好友資料
         * @method getFirstFriends
         * @param {Object} params - 排序
         */
        getFirstFriends(params) {
            return (
                ajax({
                    method: 'get',
                    url: API_FIRST_LEVEL_FRIENDS,
                    params: {
                        ...params,
                        first_result: this.firstResult,
                        max_results: this.maxResults
                    },
                    success: ({ result, ret, pagination }) => {

                        if (result !== 'ok' || ret.length === 0) {
                            return;
                        }

                        this.firstFriends = ret.reduce((init , info) => {
                            return [...init, info]
                        }, this.firstFriends)

                        if (pagination.total === '0') {
                            return;
                        }

                        this.pageAll = Math.ceil(+pagination.total / this.maxResults);
                    }
                })
            )
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
        },
        /**
         * 捲動加載
         * @param {object} $state - 套件提供的方法
         * @see { @link https://peachscript.github.io/vue-infinite-loading/#!/ }
         */
        infiniteHandler($state) {
            // 防止在切換類別的時候馬上觸發捲動加載，造成有遊戲重複出現的情況
            if (this.isReceive) {
                return;
            }

            this.isReceive = true;

            this.getFirstFriends().then(({ result }) => {
                this.isReceive = false;

                if (result !== 'ok') {
                    return;
                }

                if (this.pageNow + 1 > this.pageAll) {
                    $state.complete();
                    return;
                }

                this.pageNow += 1;
                this.firstResult += this.maxResults;

                $state.loaded();
            });
        }
    }
};
