import { format } from 'date-fns';
import ajax from '@/lib/ajax';
import { API_COMMISSION_LEVEL_LIST, API_COMMISSION_FIRST_LEVEL_LIST } from '@/config/api';

export default {
    props: {
        detailInfo: {
            type: Object,
            default: null
        },
        setDetailData: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            sort: '',
            order: '',
            levelTrans: {
                1: this.$text('S_FIRST_LEVEL_FRIEND', '一级好友'),
                2: this.$text('S_SECOND_LEVEL_FRIEND', '二级好友'),
                3: this.$text('S_THIRD_LEVEL_FRIEND', '三级好友'),
                4: this.$text('S_FOURTH_LEVEL_FRIEND', '四级好友'),
                5: this.$text('S_FIFTH_LEVEL_FRIEND', '五级好友')
            },
            detailList: null, // 第三方返利資料
            summaryList: [], // 本站返利各級好友資料
            summaryTotal: null, // 本站返利所有好友統計
            friendsList: [], // 本站返利一級好友資料
            pageTotal: null,
            allTotal: null,
            recordCount: 10, // 每頁限制筆數
            currentPage: '1', // 當前頁
            totalPage: 1 // 總頁數
        };
    },
    filters: {
        commaFormat(value) {
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        dateFormat(date) {
            const est = format(new Date(date), 'yyyy/MM/dd HH:mm:ss+20:00');
            return format(new Date(est), 'MM/dd');
        }
    },
    watch: {
        currentPage() {
            this.getFriends();
        }
    },
    created() {
        // 第三方返利只取第三方返利資料
        if (this.detailInfo.oauth2) {
            this.getDetail();
            return;
        }

        this.getSummary();
        this.getFriends();
    },
    methods: {
        /**
         * 本站返利各級好友統計
         */
        getSummary() {
            ajax({
                method: 'get',
                url: API_COMMISSION_LEVEL_LIST,
                errorAlert: false,
                params: { period: this.detailInfo.period },
                success: ({ result, ret, total }) => {
                    if (result !== 'ok') {
                        return;
                    }

                    this.summaryList = ret;
                    this.summaryTotal = total;
                }
            });
        },
        /**
         * 本站返利一級好友資料
         */
        getFriends() {
            const params = {
                max_results: this.recordCount,
                first_result: (this.currentPage - 1) * this.recordCount
            };

            if (this.sort !== '') {
                params.sort = this.sort;
                params.order = this.order;
            }

            ajax({
                method: 'get',
                url: `${API_COMMISSION_FIRST_LEVEL_LIST}/${this.detailInfo.id}/friends`,
                errorAlert: false,
                params,
                success: (response) => {
                    if (response.result !== 'ok') {
                        return;
                    }

                    if (response.pagination.total !== '0') {
                        this.totalPage = Math.ceil(response.pagination.total / this.recordCount); // 計算資料會有幾頁，一頁最多十筆
                    }

                    this.friendsList = response.ret; // 第一級好友佣金資料列表
                    this.pageTotal = response.sub_total; // 小計
                    this.allTotal = response.total; // 總計
                }
            });
        },
        /**
         * 取得第三方返利資料
         */
        getDetail() {
            ajax({
                method: 'get',
                url: `${API_COMMISSION_FIRST_LEVEL_LIST}/${this.detailInfo.id}/oauth2/detail`,
                errorAlert: false,
                success: ({ result, ret }) => {
                    if (result !== 'ok') {
                        return;
                    }

                    this.detailList = ret;
                }
            });
        },
        onSort(sortValue) {
            let orderstate = 'asc';

            if (this.sort === sortValue) {
                orderstate = (this.order === 'asc') ? 'desc' : 'asc';
            }

            this.currentPage = '1';
            this.sort = sortValue;
            this.order = orderstate;

            this.getFriends();
        }
    }
};
