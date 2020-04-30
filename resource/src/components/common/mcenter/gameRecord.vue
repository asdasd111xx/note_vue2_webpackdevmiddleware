<template>
    <div :class="$style['game-record']">
        <slot
            :inq-1st="inq1st"
            :inq-2nd="inq2nd"
            :has-search="hasSearch"
            :search-tabs="searchTabs"
            :current-condition="currentCondition"
            :game-list="gameList"
            :current-page="currentPage"
            :sort="sort"
            :change-search-condition="changeSearchCondition"
            :on-sort="onSort"
            :on-search="onSearch"
            :on-search-bet="onSearchBet"
            :show-infinite="showInfinite"
            :infinite-handler="infiniteHandler"
            :control-1st-data="control1stData"
            :control-2nd-data="control2ndData"
        />
    </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import EST from "@/lib/EST";
import gameName from "@/lib/game_name";
import ajax from "@/lib/ajax";
import * as apis from "@/config/api";
import bbosRequest from "@/lib/bbosRequest";

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
        },
        setTabState: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            hasSearch: false,
            currentCondition: "today",
            currentPage: "", // 當前所呈現的頁面內容
            selectedUser: "", // 第一層所選擇的使用者
            currentAcc: "",
            currentGame: "",
            currentStart: "",
            currentEnd: "",
            sortBy: {
                // 排序欄位
                main: "payoff",
                bet: "payoff"
            },
            sortWay: {
                // 排序方法
                main: "asc",
                bet: "asc"
            },
            inq1st: {
                isReceive: false,
                list: [],
                total: {},
                counts: null
            },
            inq2nd: {
                list: [],
                total: {},
                counts: null
            },
            isLoading: false,
            showInfinite: true,
            mainNoData: true,
            maxResults: {
                main: 10,
                bet: 1
            },
            showPage: {
                main: 0,
                bet: 0
            }
        };
    },
    computed: {
        ...mapGetters({
            gameData: "getGameData",
            siteConfig: "getSiteConfig",
            memInfo: "getMemInfo"
        }),
        searchTabs() {
            return [
                {
                    key: "range",
                    name: this.$text("S_SEARCH_FOR", "搜索")
                },
                {
                    key: "today",
                    name: this.$text("S_TODDAY", "今日")
                },
                {
                    key: "yesterday",
                    name: this.$text("S_YESTERDAY", "昨日")
                }
            ];
        },
        gameList() {
            return [
                { value: "", text: this.$text("S_ALL") },
                ...Object.keys(this.gameData)
                    .filter(key => this.gameData[key].switch === "Y")
                    .reduce((init, key) => {
                        // 過濾重複的 vendor
                        if (
                            init.some(
                                info => info.value === this.gameData[key].vendor
                            )
                        ) {
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
                    case "main":
                        this.onInquire();
                        break;
                    case "bet":
                        this.onInquireBet();
                        break;
                    default:
                        break;
                }
            }
        },
        control1stData() {
            return this.inq1st.list.filter(
                (item, index) =>
                    index < this.maxResults.main * this.showPage.main
            );
        },
        control2ndData() {
            return this.inq2nd.list.filter(
                (item, index) =>
                    index < this.maxResults.bet * this.showPage.bet
            );
        }
    },
    watch: {
        // eslint-disable-next-line
        "$route.params.page": {
            handler(newValue) {
                this.currentPage = newValue;

                switch (newValue) {
                    case "main":
                        this.showInfinite = false;
                        this.setHeaderTitle(
                            this.$text("S_TEAM_CENTER", "我的推广")
                        );
                        break;
                    case "bet":
                        this.setTabState(false);
                        this.setHeaderTitle(this.selectedUser);
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
        changeSearchCondition(value) {
            this.inq1st = {
                isReceive: false,
                list: [],
                total: {},
                counts: null
            };
            this.currentCondition = value;
            this.hasSearch = value === "range";

            if (value === "range") {
                return;
            }

            const now = EST(new Date(), "", true);
            const range = value === "today" ? 0 : -1;
            const date = Vue.moment(now)
                .add(range, "days")
                .format("YYYY-MM-DD");

            this.$emit("update:inqGame", "");
            this.$emit("update:inqStart", date);
            this.$emit("update:inqEnd", date);

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
            this.onInquire();
        },
        onInquire() {
            this.showInfinite = false;
            this.isLoading = true;
            this.showPage.main = 0;

            ajax({
                method: "get",
                url: apis.API_FRIEND_WAGER_REPORT,
                params: {
                    start_at: Vue.moment(this.currentStart).format(
                        "YYYY-MM-DD 00:00:00-04:00"
                    ),
                    end_at: Vue.moment(this.currentEnd).format(
                        "YYYY-MM-DD 23:59:59-04:00"
                    ),
                    sort: this.sortBy.main,
                    order: this.sortWay.main
                },
                success: response => {
                    if (response.result === "ok") {
                        this.hasSearch = false;
                        this.$router.push({ params: { page: "main" } });

                        this.showInfinite = true;
                        if (response.ret.length === 0) {
                            this.inq1st = {
                                isReceive: false,
                                list: [],
                                total: {},
                                counts: null
                            };
                            this.mainNoData = true;
                            return;
                        }

                        this.isLoading = false;
                        this.inq1st = {
                            isReceive: true,
                            list: response.ret,
                            total: response.total,
                            counts: Number(response.pagination.total)
                        };
                        this.mainNoData = false;
                    }
                }
            });
        },
        onSearchBet(username) {
            this.selectedUser = username;
            this.onInquireBet();
        },
        onInquireBet() {
            this.showInfinite = false;
            this.isLoading = true;
            this.showPage.bet = 0;

            bbosRequest({
                method: "get",
                url:
                    this.siteConfig.BBOS_DOMIAN +
                    "/Stats/Player/Friends/WagerReport/ByDayGame",
                reqHeaders: {
                    Vendor: this.memInfo.user.domain
                },
                params: {
                    lang: "zh-cn",
                    username: this.selectedUser,
                    startAt: Vue.moment(this.currentStart).format(
                        "YYYY-MM-DD 00:00:00-04:00"
                    ),
                    endAt: Vue.moment(this.currentEnd).format(
                        "YYYY-MM-DD 23:59:59-04:00"
                    )
                }
            }).then(response => {
                if (response.status === "000") {
                    this.$router.push({ params: { page: "bet" } });
                    this.showInfinite = true;

                    if (response.data.ret.length === 0) {
                        this.inq2nd = {
                            list: [],
                            total: {},
                            counts: null
                        };
                        this.mainNoData = true;
                        return;
                    }

                    this.isLoading = false;
                    this.inq2nd = {
                        list: response.data.ret,
                        total: response.data.total,
                        counts: Number(response.data.pagination.total)
                    };
                    this.mainNoData = false;
                }
            });
        },
        /**
         * 捲動加載
         * @param {object} $state - 套件提供的方法
         * @see { @link https://peachscript.github.io/vue-infinite-loading/#!/ }
         */
        infiniteHandler($state) {
            setTimeout(() => {
                switch (this.currentPage) {
                    case "main":
                        if (this.inq1st.list.length === 0) {
                            this.isLoading = false;
                            $state.complete();
                            return;
                        }

                        if (
                            this.inq1st.list.length / this.maxResults.main >
                            this.showPage.main
                        ) {
                            this.showPage.main += 1;
                            $state.loaded();

                            if (
                                Math.ceil(
                                    this.inq1st.list.length /
                                        this.maxResults.main
                                ) === this.showPage.main
                            ) {
                                $state.complete();
                            }
                        }
                        break;

                    case "bet":
                        if (this.inq2nd.list.length === 0) {
                            this.isLoading = false;
                            $state.complete();
                            return;
                        }

                        if (
                            this.inq2nd.list.length / this.maxResults.bet >
                            this.showPage.bet
                        ) {
                            this.showPage.bet += 1;
                            $state.loaded();

                            if (
                                Math.ceil(
                                    this.inq2nd.list.length /
                                        this.maxResults.bet
                                ) === this.showPage.bet
                            ) {
                                $state.complete();
                            }
                        }
                        break;

                    default:
                        break;
                }
            }, 300);
        }
    }
};
</script>

<style lang="scss" module>
.game-record {
    position: relative;
}
</style>
