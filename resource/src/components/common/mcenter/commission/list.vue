<template>
    <div>
        <slot
            :commission-summary="commissionSummary"
            :commission-state="commissionState"
            :get-list-commission="getListCommission"
            :commission-list="commissionList"
            :set-data-sort="setDataSort"
            :page-subtotal="pageSubtotal"
            :all-total="allTotal"
            :current-page="currentPage"
            :total-page="totalPage"
            :update-page="updatePage"
        />
    </div>
</template>

<script>
import Vue from 'vue';
import EST from '@/lib/EST';
import ajax from '@/lib/ajax';
import { API_COMMISSION_LIST, API_COMMISSION_SUMMARY } from '@/config/api';

export default {
    props: {
        state: {
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
        sort: {
            type: String,
            required: true
        }
    },
    data() {
        const now = EST(new Date(), '', true);
        const limit = new Date(Vue.moment(now).add(-29, 'days'));

        return {
            isReceive: false,
            // 每頁限制筆數
            recordCount: 10,
            // 當前頁
            currentPage: '1',
            // 總頁數
            totalPage: 0,
            order: '',
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
            estToday: now,
            limitDays: limit,
            commissionList: [],
            commissionSummary: null,
            pageSubtotal: {},
            allTotal: {}
        };
    },
    watch: {
        currentPage() {
            this.getListCommission();
        }
    },
    created() {
        this.getSummaryCommission();
    },
    methods: {
        updatePage(value) {
            this.currentPage = value;
        },
        /**
         * 取得收益概況
         */
        getSummaryCommission() {
            return ajax({
                method: 'get',
                url: API_COMMISSION_SUMMARY,
                success: ({ result, ret }) => {
                    if (result !== 'ok') {
                        return;
                    }
                    this.commissionSummary = ret;
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
                params,
                success: (response) => {
                    if (response.result !== 'ok') {
                        return;
                    }

                    // 計算資料會有幾頁，一頁最多十筆
                    this.totalPage = Math.ceil(response.pagination.total / this.recordCount);
                    // 佣金資料列表
                    this.commissionList = response.ret;
                    // 小計
                    this.pageSubtotal = response.sub_total;
                    // 總計
                    this.allTotal = response.total;
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
</script>
