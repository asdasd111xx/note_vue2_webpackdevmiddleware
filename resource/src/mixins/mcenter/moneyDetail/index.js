import Vue from 'vue';
import { mapGetters } from 'vuex';
import common from '@/api/common';
import mcenter from '@/api/mcenter';
import EST from '@/lib/EST';

export default {
    data() {
        const estToday = EST(new Date(), '', true);
        const startTime = estToday;
        const endTime = estToday;
        return {
            isReceive: false,
            estToday,
            startTime,
            endTime,
            type: 'all', // 交易類型
            sort: 'desc', // 排序方式
            firstResult: 0, // 每頁起始筆數
            maxResults: 10, // 每頁顯示幾筆
            total: 0, // 總筆數
            pageNow: 1, // 當前頁
            pageAll: 1, // 總頁數
            detailList: [],
            opcodeList: {},
            messageStatus: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        options() {
            return [
                { key: 'all', text: this.$text('S_ALL', '全部'), show: true, choice: false },
                { key: 'deposit', text: this.$text('S_ACCOUNT_DEPOSITE', '存款'), show: true, choice: false },
                { key: 'withdraw', text: this.$text('S_ACCOUNT_WITHDRAW', '取款'), show: true, choice: false },
                { key: 'deposit_withdraw', text: this.$text('S_ACCESS', '存取款'), show: true, choice: true },
                { key: 'activity', text: this.$text('S_PROMOTIONS_2', '优惠活动'), show: true, choice: true },
                { key: 'rebate', text: this.$text('S_RAKEBACK', '返水'), show: true, choice: true },
                { key: 'wage', text: this.$text('S_COMMISSION_01', '佣金'), show: this.memInfo.config.infinity, choice: true },
                { key: 'manual', text: this.$text('S_MANUAL_TRANS', '人工存提'), show: true, choice: true },
                { key: 'vendor', text: this.$text('S_VENDOR', '外接平台'), show: true, choice: true }
            ].filter(info => info.show);
        },
        choiceTypes() {
            // 精選類別
            const listData = this.options.filter(info => info.choice);

            return [
                { key: 'search', text: this.$text('S_SEARCH_FOR', '搜索'), show: true, choice: true },
                ...listData
            ];
        }
    },
    watch: {
        startTime() {
            if (this.startTime > this.endTime) {
                this.endTime = this.startTime;
            }
        }
    },
    created() {
        common.opcode({
            success: ({ result, ret }) => {
                if (result !== 'ok') {
                    return;
                }
                this.opcodeList = ret;
            }
        });

        // 點入資金明細時，預設開啟"存取款"
        this.type = 'deposit_withdraw';
        this.startTime = Vue.moment(this.startTime).format('YYYY-MM-DD');
        this.endTime = Vue.moment(this.endTime).format('YYYY-MM-DD');
        this.onInquire();
    },
    methods: {
        onType(type) {
            this.type = type;
            this.onInquire();
        },
        onSort(sort) {
            if (this.detailList.length === 0) {
                return;
            }
            this.sort = sort;
            this.onInquire();
        },
        onInquire() {
            this.pageNow = 1;
            this.firstResult = 0;
            this.getData();
        },
        onChange(disable, page) {
            if (disable) {
                return;
            }
            this.pageNow = page;
            this.firstResult = (this.pageNow - 1) * this.maxResults;
            this.getData();
        },
        getData() {
            mcenter.moneyDetail({
                params: {
                    start_at: Vue.moment(this.startTime).format('YYYY-MM-DD 00:00:00-04:00'),
                    end_at: Vue.moment(this.endTime).format('YYYY-MM-DD 23:59:59-04:00'),
                    category: this.type === 'all' ? '' : this.type,
                    first_result: this.firstResult,
                    max_results: this.maxResults,
                    order: this.sort
                },
                success: ({ result, pagination, ret }) => {
                    this.isReceive = true;

                    setTimeout(() => {
                        this.messageStatus = false;
                    }, 3000);

                    if (result !== 'ok') {
                        return;
                    }
                    this.detailList = ret.map(info => ({ ...info, created_at: EST(info.created_at) }));
                    this.total = +pagination.total;
                    this.pageAll = this.total ? Math.ceil(this.total / this.maxResults) : 1;

                    if (!this.total) {
                        return;
                    }

                    this.showSearch = false;
                    window.scrollTo(0, 0);
                }
            });
        }
    }
};
