import { format, toDate, parseISO } from 'date-fns';
import ajax from '@/lib/ajax';
import { API_COMMISSION_LIST } from '@/config/api';

export default {
    props: {
        searchInfo: {
            type: Object,
            required: true
        },
        setDetailData: {
            type: Function,
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
            isReceive: false,
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
            recordCount: 10, // 每頁限制筆數
            currentPage: '1', // 當前頁
            totalPage: 0 // 總頁數
        };
    },
    watch: {
        searchInfo() {
            this.getListCommission();
        },
        currentPage() {
            this.getListCommission();
        }
    },
    methods: {
        /**
         * 取得佣金資料列表
         */
        getListCommission() {
            const { startTime, endTime, state } = this.searchInfo;
            // startTime, endTime初始值為日期格式，若使用者選擇日期後將會變成串格式
            const start = typeof (startTime) === 'string' ? parseISO(startTime) : startTime;
            const end = typeof (startTime) === 'string' ? parseISO(endTime) : endTime;

            const params = {
                start_at: format(toDate(Date.parse(start)), 'yyyy-MM-dd'),
                end_at: format(toDate(Date.parse(end)), 'yyyy-MM-dd'),
                state,
                max_results: this.recordCount,
                first_result: (this.currentPage - 1) * this.recordCount
            };
            // 預設美東時間
            params.start_at += ' 00:00:00-04:00';
            params.end_at += ' 23:59:59-04:00';

            if (this.sort !== '') {
                params.sort = this.sort;
                params.order = this.order;
            }

            ajax({
                method: 'get',
                url: API_COMMISSION_LIST,
                params,
                success: (response) => {
                    this.isReceive = true;

                    if (response.result !== 'ok') {
                        return;
                    }

                    this.totalPage = Math.ceil(response.pagination.total / this.recordCount); // 計算資料會有幾頁，一頁最多十筆
                    this.pageTotal = response.sub_total; // 小計
                    this.allTotal = response.total; // 總計
                    this.commissionList = response.ret; // 佣金資料列表
                }
            });
        },
        onSort(sortValue) {
            let orderstate = 'asc';

            if (this.sort === sortValue) {
                orderstate = this.order === 'asc' ? 'desc' : 'asc';
            }

            this.currentPage = '1';
            this.sort = sortValue;
            this.order = orderstate;

            this.getListCommission();
        }
    }
};
