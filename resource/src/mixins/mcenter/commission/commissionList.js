import axios from "axios";
import EST from '@/lib/EST';
import { format, toDate, parseISO } from 'date-fns';
import { API_COMMISSION_LIST } from '@/config/api';
import { mapActions } from 'vuex'

export default {
    props: {
        searchInfo: {
            type: Object,
            required: true
        }
    },
    filters: {
        amountFormat(amount) {
            return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        dateFormat(date) {
            const toESTDate = new Date(parseISO(date)).getTime() + ((parseISO(date).getTimezoneOffset() / 60) * 3600000) - 14400000;
            return format(toESTDate, 'yyyy-MM-dd');
        }
    },
    data() {
        return {
            sort: '',
            order: '',
            commissionState: {
                0: { key: 'all', text: this.$text('S_ALL', '全部') }, // 全部
                1: { key: 'assigned', text: this.$text('S_ASSIGN_ALREADY', '已派发') }, // 已派發
                3: { key: 'unqualified', text: this.$text('S_UNQUALIFIED_01', '资格不符') } // 資格不符
            },
            commissionList: [],
            pageTotal: null,
            allTotal: null,
            mainNoData: true,
            showInfinite: true,
            isLoading: false,
            maxResults: 10,
            showPage: 0
        };
    },
    computed: {
        controlData() {
            return this.commissionList.filter((item, index) => index < this.maxResults * this.showPage);
        }
    },
    watch: {
        searchInfo() {
            this.getListCommission();
        }
    },
    methods: {
        ...mapActions([
            'actionSetGlobalMessage'
        ]),
        EST,
        /**
         * 取得佣金資料列表
         */
        getListCommission() {
            this.showInfinite = false;
            this.isLoading = true;
            this.showPage = 0

            const { startTime, endTime } = this.searchInfo;
            // startTime, endTime初始值為日期格式，若使用者選擇日期後將會變成串格式
            const start = typeof (startTime) === 'string' ? parseISO(startTime) : startTime;
            const end = typeof (endTime) === 'string' ? parseISO(endTime) : endTime;

            const params = {
                start_at: format(toDate(Date.parse(start)), 'yyyy-MM-dd'),
                end_at: format(toDate(Date.parse(end)), 'yyyy-MM-dd')
            };
            // 預設美東時間
            params.start_at += ' 00:00:00-04:00';
            params.end_at += ' 23:59:59-04:00';

            if (this.sort !== '') {
                params.sort = this.sort;
                params.order = this.order;
            }

            axios({
                method: 'get',
                url: API_COMMISSION_LIST,
                params
            }).then(response => {
                this.showInfinite = true

                if (response.data.result !== 'ok' || response.data.ret.length === 0) {
                    this.pageTotal = null
                    this.allTotal = null
                    this.commissionList = [];
                    this.mainNoData = true;
                    return;
                }

                this.isLoading = false;
                this.pageTotal = response.data.sub_total; // 小計
                this.allTotal = response.data.total; // 總計
                this.commissionList = response.data.ret; // 佣金資料列表
                this.mainNoData = false;
            }).catch(error => {
                this.actionSetGlobalMessage({msg: error.response.data.msg})
            })
        },
        /**
         * 捲動加載
         * @param {object} $state - 套件提供的方法
         * @see { @link https://peachscript.github.io/vue-infinite-loading/#!/ }
         */
        infiniteHandler($state) {
            setTimeout(() => {
                if (this.commissionList.length === 0) {
                    this.isLoading = false;
                    $state.complete();
                    return
                }

                if (this.commissionList.length / this.maxResults > this.showPage) {
                    this.showPage += 1;
                    $state.loaded();

                    if (Math.ceil(this.commissionList.length / this.maxResults) === this.showPage) {
                        $state.complete();
                    }
                }
            }, 300)
        }
    }
};
