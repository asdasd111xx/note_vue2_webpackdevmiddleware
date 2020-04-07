import Vue from 'vue';
import { mapGetters } from 'vuex';
import capitalize from 'lodash/capitalize';
import upperCase from 'lodash/upperCase';
import { API_PROMOTION_INFO, API_MANAGEMENT_FIRST_LEVEL_INFO } from '@/config/api';
import EST from '@/lib/EST';
import ajax from '@/lib/ajax';
import isMobile from '@/lib/is_mobile';
import datepickerLang from '@/lib/datepicker_lang';

export default {
    data() {
        const estToday = EST(new Date(), '', true);
        const dateLang = datepickerLang(this.$i18n.locale);
        const days = estToday.getDay() || 7; // 取得當前是星期幾，用來取得本週與上週的日期
        const limitTime = new Date(Vue.moment(estToday).add(-29, 'days'));
        const startTime = new Date(Vue.moment(estToday).add(-(days - 1), 'days'));
        const date = [startTime, estToday];
        const week = [startTime, estToday];
        const last = [
            new Date(Vue.moment(estToday).add(-((days - 1) + 7), 'days')),
            new Date(Vue.moment(estToday).add(-((days - 1) + 1), 'days'))
        ];
        const options = [
            { value: 'first', text: this.$text('S_FIRST_LEVEL_FRIEND') },
            { value: 'all', text: this.$text('S_ALL') }
        ];

        return {
            isReceive: false,
            isRegister: false,
            isPopup: false,
            domain: '',
            estToday,
            dateLang,
            days,
            limitTime,
            startTime,
            endTime: estToday,
            date,
            week, // 本週日期
            last, // 上週日期
            options,
            popupType: '',
            agentCode: '',
            page: 'first',
            firstLevelInfo: [],
            period: 'week',
            currentPage: '1',
            totalPage: 0
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            isWebview: 'getIsWebview'
        }),
        /**
         * 推廣連結
         * @method agentLink
         * @returns {String} 推廣連結
         */
        agentLink() {
            return `https://${this.domain}/a/${this.agentCode}`;
        }
    },
    watch: {
        date() {
            const {
                date, week, last, onDateFormat
            } = this;

            if (Date.parse(date[0]) > Date.parse(date[1])) {
                [date[1], date[0]] = [date[0], date[1]];
            }

            if (onDateFormat(date[0]) === onDateFormat(week[0]) && onDateFormat(date[1]) === onDateFormat(week[1])) {
                this.period = 'week';
                return;
            }

            if (onDateFormat(date[0]) === onDateFormat(last[0]) && onDateFormat(date[1]) === onDateFormat(last[1])) {
                this.period = 'last';
                return;
            }

            this.period = 'search';
        }
    },
    methods: {
        getDomain() {
            return ajax({
                method: 'get',
                url: '/api/v1/c/hostnames'
            }).then(({ result, ret }) => {
                if (result !== 'ok') {
                    return;
                }

                [this.domain] = ret;
            });
        },
        /**
         * 取得推廣代碼
         * @method getAgentCode
         */
        getAgentCode() {
            return ajax({
                method: 'get',
                url: API_PROMOTION_INFO,
                success: ({ result, ret }) => {
                    if (result !== 'ok') {
                        return;
                    }

                    this.agentCode = ret.code;
                }
            });
        },
        /**
         * 取得一級好友總攬資訊
         * @method getFirstLevelInfo
         */
        getFirstLevelInfo() {
            return ajax({
                method: 'get',
                url: API_MANAGEMENT_FIRST_LEVEL_INFO,
                success: ({ result, ret }) => {
                    if (result !== 'ok') {
                        return;
                    }

                    // 排序
                    const trans = ['today_has_login', 'today_register', 'today_has_bet', 'today_has_deposit', 'week_no_login'];

                    this.firstLevelInfo = trans.map((value) => ({ text: value, value: ret[value] }));
                }
            });
        },
        /**
         * 複製推廣代碼或連結
         * @method onCopy
         * @param {String} key - code or link
         */
        onCopy(key) {
            const value = capitalize(key);
            const type = upperCase(key);

            this.$copyText(this[`agent${value}`]).then(() => {
                this.isPopup = true;
                this.popupType = type;

                // 三秒後自動關閉
                setTimeout(() => {
                    this.onPopupClose();
                }, 3000);
            });
        },
        /**
         * 日期區間切換
         * @method onPeriodChange
         * @param {String} value - 選擇的區間
         */
        onPeriodChange(value) {
            if (isMobile()) {
                this.date = [this[value][0], this[value][1]];
                return;
            }

            if (this.period === 'search') {
                return;
            }

            if (this.period === 'last') {
                [this.startTime, this.endTime] = this.last;
                return;
            }

            [this.startTime, this.endTime] = this.week;
        },
        /**
         * 顯示 QR Code(for mobile)
         * @method onQrcodeOpen
         */
        onQrcodeOpen() {
            this.isPopup = true;
            this.popupType = 'qrcode';
        },
        /**
         * 關閉彈跳視窗
         * @method onPopupClose
         */
        onPopupClose() {
            if (isMobile()) {
                this.isPopup = false;
                this.popupType = '';
                return;
            }

            this.isPopup = false;
        },
        /**
         * 選擇日期
         * @method onDateSelected
         * @param {String} key - 起始時間或結束時間
         * @param {date} value - 日期
         */
        onDateSelected(key, value) {
            this[`${key}Time`] = value;

            if (key === 'start') {
                this.endTime = this.startTime > this.endTime ? this.startTime : this.endTime;
            } else {
                this.startTime = this.startTime > this.endTime ? this.endTime : this.startTime;
            }

            const {
                startTime, endTime, week, last, onDateFormat
            } = this;

            if (onDateFormat(startTime) === onDateFormat(week[0]) && onDateFormat(endTime) === onDateFormat(week[1])) {
                this.period = 'week';
                return;
            }

            if (onDateFormat(startTime) === onDateFormat(last[0]) && onDateFormat(endTime) === onDateFormat(last[1])) {
                this.period = 'last';
                return;
            }

            this.period = 'search';
        },
        /**
         * 查詢
         * @method onInquire
         */
        onInquire() {
            this.date = [this.startTime, this.endTime];
        },
        /**
         * 日期格式化
         * @method onDateFormat
         * @param {Date} date - 日期
         * @returns {String} 格式化後的日期
         */
        onDateFormat(date) {
            return Vue.moment(date).format('YYYY-MM-DD');
        }
    }
};
