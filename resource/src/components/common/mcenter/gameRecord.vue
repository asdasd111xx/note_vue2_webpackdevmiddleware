<template>
    <div :class="$style['game-record']">
        <slot
            :inq-1st="inq1st"
            :inq-2nd="inq2nd"
            :inq-3rd="inq3rd"
            :has-search="hasSearch"
            :is-show-tips="isShowTips"
            :search-tabs="searchTabs"
            :current-condition="currentCondition"
            :game-list="gameList"
            :current-page="currentPage"
            :sort="sort"
            :page="page"
            :total-page="totalPage"
            :count-of-page="showNum"
            :update-page="updatePage"
            :change-search-condition="changeSearchCondition"
            :on-sort="onSort"
            :on-search="onSearch"
            :on-search-bet="onSearchBet"
            :on-search-detail="onSearchDetail"
        />
    </div>
</template>

<script>
import Vue from 'vue';
import { mapGetters } from 'vuex';
import EST from '@/lib/EST';
import gameName from '@/lib/game_name';
import ajax from '@/lib/ajax';
import * as apis from '@/config/api';

export default {
    props: {
        inqGame: {
            type: String,
            required: true
        },
        inqStart: {
            type: String,
            required: true
        },
        inqEnd: {
            type: String,
            required: true
        },
        setHeaderTitle: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            hasSearch: false,
            isShowTips: false,
            currentCondition: 'today',
            currentPage: '', // 當前所呈現的頁面內容
            selectedUser: '', // 第一層所選擇的使用者
            selectedVendor: '', // 第二層所選的遊戲 vendor
            selectedKind: '', // 第二層所選擇的遊戲 kind
            currentAcc: '',
            currentGame: '',
            currentStart: '',
            currentEnd: '',
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
            showNum: 10,
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
                isReceive: false,
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
            }
        };
    },
    computed: {
        ...mapGetters({
            gameData: 'getGameData'
        }),
        searchTabs() {
            return [
                {
                    key: 'range',
                    name: this.$text('S_SEARCH_FOR', '搜索')
                },
                {
                    key: 'today',
                    name: this.$text('S_TODDAY', '今日')
                },
                {
                    key: 'yesterday',
                    name: this.$text('S_YESTERDAY', '昨日')
                }
            ];
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
                        this.onInquireBet();
                        break;
                    case 'detail':
                        this.onInquireDetail();
                        break;
                    default:
                        break;
                }
            }
        }
    },
    watch: {
        // eslint-disable-next-line
        '$route.params.page': {
            handler(newValue) {
                this.currentPage = newValue;

                switch (newValue) {
                    case 'main':
                        this.setHeaderTitle(this.$text('S_TEAM_CENTER', '我的推广'));
                        break;
                    case 'bet':
                        this.setHeaderTitle(this.selectedUser);
                        break;
                    case 'detail':
                        this.setHeaderTitle(gameName(this.selectedVendor, this.selectedKind));
                        break;
                    default:
                        break;
                }
            },
            immediate: true
        }
    },
    created() {
        this.currentGame = this.inqGame;
        this.currentStart = this.inqStart;
        this.currentEnd = this.inqEnd;

        this.onInquire();
    },
    methods: {
        updatePage(target, value) {
            this.$set(this.page, target, value);
            switch (target) {
                case 'main':
                    this.onInquire();
                    break;
                case 'bet':
                    this.onInquireBet();
                    break;
                case 'detail':
                    this.onInquireDetail();
                    break;
                default:
                    break;
            }
        },
        changeSearchCondition(value) {
            if (this.isShowTips) {
                return;
            }

            this.inq1st = {
                isReceive: false,
                list: [],
                subTotal: {},
                total: {}
            };
            this.currentCondition = value;
            this.hasSearch = value === 'range';

            if (value === 'range') {
                return;
            }

            const now = EST(new Date(), '', true);
            const range = value === 'today' ? 0 : -1;
            const date = Vue.moment(now).add(range, 'days').format('YYYY-MM-DD');

            this.$emit('update:inqGame', '');
            this.$emit('update:inqStart', date);
            this.$emit('update:inqEnd', date);

            this.currentGame = this.inqGame;
            this.currentStart = this.inqStart;
            this.currentEnd = this.inqEnd;

            this.onInquire();
        },
        onSort(value) {
            this.sort = value;
        },
        onSearch() {
            this.currentGame = this.inqGame;
            this.currentStart = this.inqStart;
            this.currentEnd = this.inqEnd;
            this.onInquire().then(() => {
                this.isShowTips = true;

                setTimeout(() => {
                    this.isShowTips = false;
                }, 3000);
            });
        },
        onInquire() {
            return ajax({
                method: 'get',
                url: apis.API_FRIEND_WAGER_REPORT,
                params: {
                    username: this.currentAcc,
                    vendor: this.currentGame,
                    start_at: Vue.moment(this.currentStart).format('YYYY-MM-DD 00:00:00-04:00'),
                    end_at: Vue.moment(this.currentEnd).format('YYYY-MM-DD 23:59:59-04:00'),
                    sort: this.sortBy.main,
                    order: this.sortWay.main,
                    first_result: (this.page.main - 1) * this.showNum,
                    max_results: this.showNum
                }
            }).then((response) => {
                if (response.result === 'ok') {
                    this.hasSearch = false;
                    this.$router.push({ params: { page: 'main' } });

                    if (!response.ret.length) {
                        this.inq1st = {
                            isReceive: true,
                            list: [],
                            subTotal: {},
                            total: {}
                        };
                        return;
                    }

                    this.$nextTick(() => {
                        this.totalPage[this.currentPage] = Math.ceil(response.pagination.total / this.showNum);
                        this.inq1st = {
                            isReceive: true,
                            list: response.ret,
                            subTotal: response.sub_total,
                            total: response.total
                        };
                    });
                }
            });
        },
        onSearchBet(username) {
            this.selectedUser = username;
            this.page.bet = '1';
            this.onInquireBet();
        },
        onInquireBet() {
            ajax({
                method: 'get',
                url: apis.API_AGCENTER_RECORD_MEMBER,
                params: {
                    username: this.selectedUser,
                    start_at: Vue.moment(this.currentStart).format('YYYY-MM-DD 00:00:00-04:00'),
                    end_at: Vue.moment(this.currentEnd).format('YYYY-MM-DD 23:59:59-04:00'),
                    vendor: this.currentGame,
                    sort: this.sortBy.bet,
                    order: this.sortWay.bet,
                    first_result: (this.page.bet - 1) * this.showNum,
                    max_results: this.showNum
                }
            }).then((response) => {
                if (response.result === 'ok') {
                    this.$router.push({ params: { page: 'bet' } });
                    this.$nextTick(() => {
                        this.totalPage[this.currentPage] = Math.ceil(response.pagination.total / this.showNum);
                        this.inq2nd = {
                            list: response.ret.map((info) => ({
                                ...info,
                                name: gameName(info.vendor_name, info.kind)
                            })),
                            subTotal: response.total,
                            total: response.sum
                        };
                    });
                }
            });
        },
        onSearchDetail(vendor, kind) {
            this.selectedVendor = vendor;
            this.selectedKind = kind;
            this.page.detail = '1';
            this.onInquireDetail();
        },
        onInquireDetail() {
            ajax({
                method: 'get',
                url: apis.API_FRIEND_RECORD_DETAIL,
                params: {
                    username: this.selectedUser,
                    start_at: Vue.moment(this.currentStart).format('YYYY-MM-DD 00:00:00-04:00'),
                    end_at: Vue.moment(this.currentEnd).format('YYYY-MM-DD 23:59:59-04:00'),
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
                            url: `${apis.API_GET_VENDOR}/${this.selectedVendor}/game/list`,
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
                        this.$router.push({ params: { page: 'detail' } });

                        this.$nextTick(() => {
                            this.totalPage[this.currentPage] = Math.ceil(response.pagination.total / this.showNum);
                            this.inq3rd = {
                                list,
                                subTotal: response.total,
                                total: response.sum
                            };
                        });
                    });
                }
            });
        }
    }
};
</script>

<style lang="scss" module>
.game-record {
    position: relative;
}
</style>
