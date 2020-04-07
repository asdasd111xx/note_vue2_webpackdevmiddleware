import Vue from 'vue';
import { mapActions } from 'vuex';
import ajax from '@/lib/ajax';
import { API_COMMISSION_LAST, API_COMMISSION_LIST } from '@/config/api';

export default {
    data() {
        return {
            isReceive: false,
            // 每頁限制筆數
            recordCount: 10,
            // 當前頁
            currentPage: '1',
            // 總頁數
            totalPage: 0,
            sort: '',
            order: '',
            state: '0',
            commissionState: {
                // 全部
                0: {
                    key: 'all',
                    text: 'S_ALL'
                },
                // 已派發
                1: {
                    key: 'assigned',
                    text: 'S_ASSIGN_ALREADY'
                },
                // 資格不符
                3: {
                    key: 'unqualified',
                    text: 'S_UNQUALIFIED_01'
                }
            },
            commissionLast: {},
            commissionList: [],
            pageSubtotal: {},
            allTotal: {}
        };
    },
    filters: {
        pointFormat(value, digit = 2) {
            return Number(value).toFixed(digit);
        },
        commaFormat(value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        dataFormat(value, format = 'YYYY-MM-DD') {
            return Vue.moment(value).utcOffset(-4).format(format);
        }
    },
    created() {
        this.actionSetIsLoading(true);
        const params = [this.getLastCommission(), this.getListCommission()];

        // 當所有 api 完成後再渲染
        Promise.all(params).then(() => {
            this.isReceive = true;
            this.actionSetIsLoading(false);
        });
    },
    watch: {
        currentPage() {
            this.getListCommission();
        },
        startTime() {
            if (this.startTime > this.endTime) {
                this.endTime = this.startTime;
            }
        }
    },
    methods: {
        ...mapActions([
            'actionSetIsLoading'
        ]),
        /**
         * 取得最近一期資料
         */
        getLastCommission() {
            return ajax({
                method: 'get',
                url: API_COMMISSION_LAST,
                // errorAlert: false,
                success: ({ result, ret }) => {
                    if (result !== 'ok') {
                        return;
                    }

                    this.commissionLast = ret;
                }
            });
        },
        /**
         * 取得佣金資料列表
         */
        getListCommission() {
            const params = {
                // 04:00 代表時區，美東時間必帶
                start_at: Vue.moment(this.startTime).format('YYYY-MM-DD 00:00:00-04:00'),
                end_at: Vue.moment(this.endTime).format('YYYY-MM-DD 23:59:59-04:00'),
                state: this.state,
                max_results: this.recordCount,
                first_result: (this.currentPage - 1) * this.recordCount
            };

            if (this.sort !== '') {
                params.sort = this.sort;
                params.order = this.order;
            }

            return ajax({
                method: 'get',
                url: API_COMMISSION_LIST,
                // errorAlert: false,
                params,
                success: (request) => {
                    if (request.result !== 'ok') {
                        return;
                    }

                    // 計算資料會有幾頁，一頁最多十筆
                    this.totalPage = Math.ceil(request.pagination.total / this.recordCount);
                    // 佣金資料列表
                    this.commissionList = request.ret;
                    // 小計
                    this.pageSubtotal = request.sub_total;
                    // 總計
                    this.allTotal = request.total;
                }
            });
        },
        setDataSort(sortValue) {
            let orderstate = 'asc';

            if (this.sort === sortValue) {
                orderstate = (this.order === 'asc') ? 'desc' : 'asc';
            }

            this.currentPage = '1';
            this.sort = sortValue;
            this.order = orderstate;
            this.getListCommission();
        }
    }
};
