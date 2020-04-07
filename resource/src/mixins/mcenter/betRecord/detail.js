import Vue from 'vue';
import ajax from '@/lib/ajax';
import { API_MCENTER_BETRECORD_GAMECODE } from '@/config/api';

export default {
    props: {
        types: {
            type: String,
            required: true
        },
        startTime: {
            type: String,
            required: true
        },
        endTime: {
            type: String,
            required: true
        },
        kind: {
            type: Number,
            required: true
        },
        vendor: {
            type: String,
            required: true
        },
        pageCount: {
            type: Number,
            default: 10
        }
    },
    data() {
        return {
            dataList: [],
            total: {},
            sum: {},
            currentPage: '1',
            totalPage: 1,
            sort: '',
            order: '',
            isSettled: true
        };
    },
    computed: {
        isShowSettle() {
            return this.kind === 1 || this.kind === 4;
        }
    },
    created() {
        this.inquire();
    },
    methods: {
        inquire(sortBy = '') {
            const params = {
                start_at: Vue.moment(this.startTime).format('YYYY-MM-DD 00:00:00-04:00'),
                end_at: Vue.moment(this.endTime).format('YYYY-MM-DD 23:59:59-04:00'),
                settled: this.isSettled,
                kind: this.kind,
                vendor: this.vendor,
                max_results: this.pageCount,
                first_result: (this.pageCount * this.currentPage) - this.pageCount
            };
            const sortList = ['bet', 'valid_bet', 'payoff'];
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
                url: API_MCENTER_BETRECORD_GAMECODE,
                params,
                success: (response) => {
                    this.dataList = response.ret;
                    this.total = response.total;
                    this.sum = response.sum;
                    this.totalPage = response.pagination.total;
                }
            });
        }
    }
};
