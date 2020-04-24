import Vue from 'vue';
import { mapGetters } from 'vuex';
import {
    API_FRIEND_WAGER_REPORT,
    API_AGCENTER_RECORD_MEMBER,
    API_FRIEND_RECORD_DETAIL,
    API_GET_VENDOR
} from '@/config/api';
import ajax from '@/lib/ajax';
import EST from '@/lib/EST';
import gameName from '@/lib/game_name';
import datepickerLang from '@/lib/datepicker_lang';

export default {
    data() {
        const now = EST(new Date(), '', true);

        return {
            inqAcc: '', // 輸入框 - 帳號
            inqGame: '', // 輸入框 - 遊戲
            inqStartDate: new Date(Vue.moment(now)), // 輸入框 - 開始日期
            inqEndDate: now, // 輸入框 - 結束日期
            currentAcc: '', // 搜尋條件下的帳號
            currentStartDate: new Date(Vue.moment(now)), // 搜尋條件下的開始日期
            currentEndDate: now, // 搜尋條件下的結束日期
            currentGame: '', // 搜尋條件下的遊戲
            currentPage: '', // 當前所呈現的頁面內容
            selectedUser: '', // 第一層所選擇的使用者
            selectedVendor: '', // 第二層所選的遊戲 vendor
            selectedKind: '', // 第二層所選擇的遊戲 kind
            sortBy: { // 排序欄位
                main: 'payoff',
                bet: 'payoff',
                detail: 'payoff'
            },
            sortWay: { // 排序方法
                main: 'asc',
                bet: 'asc',
                detail: 'asc'
            },
            showNum: 10, // 呈現筆數
            page: {
                main: '1',
                bet: '1',
                detail: '1'
            },
            totalPage: {
                main: 1,
                bet: 1,
                detail: 1
            },
            inq1st: {
                list: [],
                subTotal: {},
                total: {}
            },
            inq2nd: {
                list: [],
                subTotal: {},
                total: {}
            },
            inq3rd: {
                list: [],
                subTotal: {},
                total: {}
            },
            fromDate: new Date(Vue.moment(now).add(-60, 'days')),
            now,
            dateLang: datepickerLang(this.$i18n.locale)
        };
    },
    computed: {
        ...mapGetters({
            gameData: 'getGameData'
        }),
        hasSearchBar() {
            return this.currentPage === '' || this.currentPage === 'main';
        },
        currentPageNum: {
            get() {
                return this.page[this.currentPage];
            },
            set(pageNum) {
                this.page[this.currentPage] = pageNum;

                switch (this.currentPage) {
                    case 'main':
                        this.onInquire();
                        break;
                    case 'bet':
                        this.onInquireBetRecord(this.selectedUser);
                        break;
                    case 'detail':
                        this.onInquireDetail(this.selectedVendor, this.selectedKind);
                        break;
                    default:
                        break;
                }
            }
        },
        sort: {
            get() {
                return {
                    by: this.sortBy[this.currentPage],
                    way: this.sortWay[this.currentPage]
                };
            },
            set(value) {
                this.sortBy[this.currentPage] = value.by;
                this.sortWay[this.currentPage] = value.way;

                switch (this.currentPage) {
                    case 'main':
                        this.onInquire();
                        break;
                    case 'bet':
                        this.onInquireBetRecord(this.selectedUser);
                        break;
                    case 'detail':
                        this.onInquireDetail(this.selectedVendor, this.selectedKind);
                        break;
                    default:
                        break;
                }
            }
        },
        breadcrumb() {
            const crumbs = [
                {
                    id: 'main',
                    visible: true,
                    clickable: this.currentPage === 'bet' || this.currentPage === 'detail',
                    text: this.$text('S_GAME_RECORD', '游戏纪录')
                },
                {
                    id: 'bet',
                    visible: this.currentPage === 'bet' || this.currentPage === 'detail',
                    clickable: this.currentPage === 'detail',
                    text: this.selectedUser
                },
                {
                    id: 'detail',
                    visible: this.currentPage === 'detail',
                    clickable: false,
                    text: gameName(this.selectedVendor, this.selectedKind)
                }
            ];
            return crumbs.filter((crumb) => crumb.visible);
        },
        gameList() {
            return [
                { value: '', text: this.$text('S_ALL') },
                ...Object.keys(this.gameData)
                    .filter((key) => this.gameData[key].switch === 'Y')
                    .reduce((init, key) => {
                        // 過濾重複的 vendor
                        if (init.some((info) => info.value === this.gameData[key].vendor)) {
                            return init;
                        }

                        return [
                            ...init,
                            {
                                value: this.gameData[key].vendor,
                                text: gameName(this.gameData[key].vendor)
                            }
                        ];
                    }, [])
            ];
        }
    },
    watch: {
        inqStartDate() {
            if (this.inqStartDate > this.inqEndDate) {
                this.inqEndDate = this.inqStartDate;
            }
        }
    },
    created() {
        this.onInquireClick();
    },
    methods: {
        onCrumbClick(target) {
            this.currentPage = target;
        },
        onBackClick() {
            if (this.currentPage === 'bet') {
                this.onCrumbClick('main');
            }

            if (this.currentPage === 'detail') {
                this.onCrumbClick('bet');
            }
        },
        onInquireClick() {
            this.currentAcc = this.inqAcc;
            this.currentStartDate = this.inqStartDate;
            this.currentEndDate = this.inqEndDate;
            this.currentGame = this.inqGame;
            this.onInquire();
        },
        onInquire() {
            ajax({
                method: 'get',
                url: API_FRIEND_WAGER_REPORT,
                params: {
                    username: this.currentAcc,
                    vendor: this.currentGame,
                    start_at: Vue.moment(this.currentStartDate).format('YYYY-MM-DD 00:00:00-04:00'),
                    end_at: Vue.moment(this.currentEndDate).format('YYYY-MM-DD 23:59:59-04:00'),
                    sort: this.sortBy.main,
                    order: this.sortWay.main,
                    first_result: (this.page.main - 1) * this.showNum,
                    max_results: this.showNum
                }
            }).then((response) => {
                if (response.result === 'ok') {
                    this.currentPage = 'main';

                    if (!response.ret.length) {
                        return;
                    }

                    this.totalPage[this.currentPage] = Math.ceil(response.pagination.total / this.showNum);
                    this.inq1st = {
                        list: response.ret,
                        subTotal: response.sub_total,
                        total: response.total
                    };
                }
            });
        },
        onInquireBetClick(username) {
            this.selectedUser = username;
            this.page.bet = '1';
            this.onInquireBetRecord();
        },
        onInquireBetRecord() {
            ajax({
                method: 'get',
                url: API_AGCENTER_RECORD_MEMBER,
                params: {
                    username: this.selectedUser,
                    start_at: Vue.moment(this.currentStartDate).format('YYYY-MM-DD 00:00:00-04:00'),
                    end_at: Vue.moment(this.currentEndDate).format('YYYY-MM-DD 23:59:59-04:00'),
                    vendor: this.currentGame,
                    sort: this.sortBy.bet,
                    order: this.sortWay.bet,
                    first_result: (this.page.bet - 1) * this.showNum,
                    max_results: this.showNum
                }
            }).then((response) => {
                if (response.result === 'ok') {
                    this.currentPage = 'bet';
                    this.totalPage[this.currentPage] = Math.ceil(response.pagination.total / this.showNum);
                    this.inq2nd = {
                        list: response.ret.map((info) => ({
                            ...info,
                            name: gameName(info.vendor_name, info.kind)
                        })),
                        subTotal: response.total,
                        total: response.sum
                    };
                }
            });
        },
        onInquireDetailClick(vendor, kind) {
            this.selectedVendor = vendor;
            this.selectedKind = kind;
            this.page.detail = '1';
            this.onInquireDetail();
        },
        onInquireDetail() {
            ajax({
                method: 'get',
                url: API_FRIEND_RECORD_DETAIL,
                params: {
                    username: this.selectedUser,
                    start_at: Vue.moment(this.currentStartDate).format('YYYY-MM-DD 00:00:00-04:00'),
                    end_at: Vue.moment(this.currentEndDate).format('YYYY-MM-DD 23:59:59-04:00'),
                    vendor: this.selectedVendor,
                    kind: this.selectedKind,
                    sort: this.sortBy.detail,
                    order: this.sortWay.detail,
                    first_result: (this.page.detail - 1) * this.showNum,
                    max_results: this.showNum
                }
            }).then((response) => {
                if (response.result === 'ok') {
                    const params = [];
                    const list = [];

                    // 請求遊戲名稱
                    response.ret.forEach((info, index) => {
                        params.push(ajax({
                            method: 'get',
                            url: `${API_GET_VENDOR}/${this.selectedVendor}/game/list`,
                            params: {
                                kind: this.selectedKind,
                                first_result: 0,
                                max_results: 1,
                                code: info.code,
                                ignore_device: true
                            },
                            success: (res) => {
                                list[index] = {
                                    ...info,
                                    name: res.ret[0].name
                                };
                            }
                        }));
                    });

                    // 當所有 api 完成後再渲染
                    Promise.all(params).then(() => {
                        this.currentPage = 'detail';
                        this.totalPage[this.currentPage] = Math.ceil(response.pagination.total / this.showNum);

                        this.inq3rd = {
                            list,
                            subTotal: response.total,
                            total: response.sum
                        };
                    });
                }
            });
        }
    }
};
