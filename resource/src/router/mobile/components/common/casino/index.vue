<template>
    <div :class="`casino-wrap ${gameTheme}`">
        <template v-for="slotKey in slotSort">
            <template v-if="slotKey === 'search'">
                <gameSearch
                    :key="`slot-${slotKey}`"
                    :is-game-data-receive="isGameDataReceive"
                    :theme="searchTheme"
                    :text="paramsData.name"
                    :game-num="activityData.events && gameData.length === activityData.events.length ? 0 : gameData.length"
                    :set-search-text="setSearchText"
                />
            </template>
            <template v-if="slotKey === 'label'">
                <gameLabel
                    :key="`slot-${slotKey}`"
                    :theme="labelTheme"
                    :is-label-receive="isLabelReceive"
                    :label="paramsData.label.toString()"
                    :label-data="labelData"
                    :change-game-label="changeGameLabel"
                />
            </template>
            <template v-if="slotKey === 'list'">
                <div :key="`slot-${slotKey}`" class="game-item-wrap clearfix">
                    <game-empty
                        v-if="isGameDataReceive && gameData.length === 0"
                        :theme="gameTheme"
                        :now-type="paramsData.label"
                    />
                    <template v-else>
                        <template v-for="(gameInfo, index) in gameData">
                            <game-item
                                :key="`game-${gameInfo.vendor}-${index}`"
                                :theme="gameTheme"
                                :game-info="gameInfo"
                                :show-vendor="gameShowVendor"
                                :show-jackpot="gameShowJackpot"
                                :show-favor="gameShowFavor"
                                :show-button="gameShowButton"
                            />
                        </template>
                        <!-- 捲動加載 -->
                        <infinite-loading
                            v-if="showInfinite"
                            ref="infiniteLoading"
                            @infinite="infiniteHandler"
                        >
                            <span slot="no-more" />
                            <span slot="no-results" />
                        </infinite-loading>
                    </template>
                </div>
            </template>
        </template>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import InfiniteLoading from 'vue-infinite-loading';
import ajax from '@/lib/ajax';
import { gameType, gameList } from '@/config/api';
import gameItem from '@/router/web/components/common/gameItem';
import gameSearch from '../gameSearch';
import gameLabel from '../gameLabel';
import gameEmpty from '../gameEmpty';

/**
 * 共用元件 - 手機網頁版電子遊戲頁共用框 (邏輯共用)
 * @param {Array} [slotSort=['search', 'label', 'list']] - slot 的區塊順序調整
 * @param {String} [searchTheme] - 搜尋框組件樣式
 * @param {String} [labelTheme] - 分類項目組件樣式
 * @param {String} [gameTheme] - 遊戲列表(gameItem)的樣式
 * @param {Boolean} [gameShowVendor=true] - 遊戲列表(gameItem)，是否顯示平台名稱
 * @param {Boolean} [gameShowJackpot=false] - 遊戲列表(gameItem)，是否顯示彩金區塊
 * @param {Boolean} [gameShowFavor=true] - 遊戲列表(gameItem)，是否顯示最愛按鈕
 * @param {Boolean} [gameShowButton=true] - 遊戲列表(gameItem)，是否顯示進入遊戲按鈕
 */
export default {
    components: {
        gameSearch,
        gameLabel,
        gameItem,
        gameEmpty,
        InfiniteLoading
    },
    props: {
        slotSort: {
            type: Array,
            default: () => (['search', 'label', 'list'])
        },
        searchTheme: {
            type: String,
            default: '1'
        },
        labelTheme: {
            type: String,
            default: '1'
        },
        gameTheme: {
            type: String,
            default: ''
        },
        gameShowVendor: {
            type: Boolean,
            default: true
        },
        gameShowJackpot: {
            type: Boolean,
            default: false
        },
        gameShowFavor: {
            type: Boolean,
            default: true
        },
        gameShowButton: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            isReceive: false,
            showInfinite: false,
            paramsData: {
                kind: 3,
                label: 'hot',
                enable: true,
                first_result: 0,
                max_results: 36,
                name: ''
            },
            searchText: '',
            isLabelReceive: false,
            labelData: [],
            isGameDataReceive: false,
            gameData: [],
            activityData: []
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus',
            favoriteGame: 'getFavoriteGame'
        }),
        vendor() {
            return (this.$route.params.vendor === 'all') ? '' : (this.$route.params.vendor || '');
        },
        // 依平台篩選出最愛的遊戲列表
        favoriteData() {
            if (this.vendor) {
                return this.favoriteGame.filter((element) => element.vendor === this.vendor);
            }

            return this.favoriteGame.filter((element) => element.kind === this.paramsData.kind);
        }
    },
    watch: {
        vendor() {
            this.paramsData.first_result = 0;

            if (this.$route.params.type) {
                this.paramsData.label = this.$route.params.type;
            }

            this.getGameLabelList();
        }
    },
    created() {
        if (this.$route.params.type) {
            this.paramsData.label = this.$route.params.type;
        }

        this.getGameLabelList();

        if (this.loginStatus) {
            this.actionSetFavoriteGame();
        }
    },
    methods: {
        ...mapActions([
            'actionSetFavoriteGame'
        ]),
        /**
         * 取得遊戲平台分類
         */
        getGameLabelList() {
            // 電子分類預設資料
            const defaultData = [
                {
                    label: '',
                    name: this.$t('S_ALL')
                },
                // 活動先註解不開放，後續開放只要搜 activity_open
                // {
                //     label: 'activity',
                //     name: this.$t('S_ACTIVITY')
                // },
                {
                    label: 'new',
                    name: this.$t('S_NEW_GAMES')
                },
                {
                    label: 'hot',
                    name: this.$t('S_HOT')
                }
            ];

            // 抓取遊戲導覽清單
            ajax({
                method: 'get',
                url: `${gameType}?kind=${this.paramsData.kind}&vendor=${this.vendor}`
            }).then((response) => {
                this.labelData = defaultData.concat(response.ret);

                // 最愛統一放在最後面
                if (this.loginStatus) {
                    this.labelData.push({ label: 'favorite', name: this.$t('S_FAVORITE') });
                }
                this.isLabelReceive = true;

                if (!defaultData.concat(response.ret).some((item) => item.label === this.paramsData.label)) {
                    this.paramsData.label = '';
                }

                this.updateGameData();
            });

            // 活動先註解不開放，後續開放只要搜 activity_open
            // if (!this.paramsData.label || this.paramsData.label === 'activity') {
            //     ajax({
            //         method: 'get',
            //         url: `/api/v1/c/vendor/${this.vendor || 'all'}/vendor_event`,
            //         errorAlert: false,
            //         params: {
            //             games: 1,
            //             enable: true,
            //             first_result: this.paramsData.first_result,
            //             max_results: this.paramsData.max_results
            //         }
            //     }).then((response) => {
            //         if (response && response.result === 'ok') {
            //             this.activityData = response.ret;
            //         }

            //         this.updateGameData();
            //     });
            //     return;
            // }
        },
        /**
         * 設定搜尋文字
         * @param {string} value - 搜尋的文字
         */
        setSearchText(value) {
            this.paramsData.first_result = 0;
            this.paramsData.name = value;
            this.updateGameData();
        },
        /**
         * 設定遊戲分類
         * @param {string} value - 設定的分類
         */
        changeGameLabel(value) {
            this.paramsData = {
                ...this.paramsData,
                label: value,
                first_result: 0
            };

            // 活動先註解不開放，後續開放只要搜 activity_open
            // if (!this.paramsData.label || this.paramsData.label === 'activity') {
            //     ajax({
            //         method: 'get',
            //         url: `/api/v1/c/vendor/${this.vendor || 'all'}/vendor_event`,
            //         errorAlert: false,
            //         params: {
            //             games: 1,
            //             enable: true,
            //             first_result: this.paramsData.first_result,
            //             max_results: this.paramsData.max_results
            //         }
            //     }).then((response) => {
            //         if (response && response.result === 'ok') {
            //             this.activityData = response.ret;
            //         }

            //         this.updateGameData();
            //     });
            //     return;
            // }
            this.updateGameData();
        },
        /**
         * 重新取得遊戲資料
         */
        updateGameData() {
            this.showInfinite = false;
            this.isGameDataReceive = false;
            this.gameData = [];

            if (this.paramsData.label === 'favorite') {
                this.gameData = this.favoriteData;
                return;
            }

            if ((!this.paramsData.label || this.paramsData.label === 'activity') && this.activityData.events) {
                this.gameData = [...this.activityData.events];
            }

            this.$nextTick(() => {
                this.showInfinite = true;
            });
        },
        /**
         * 捲動加載
         * @param {object} $state - 套件提供的方法
         * @see { @link https://peachscript.github.io/vue-infinite-loading/#!/ }
         */
        infiniteHandler($state, index = 1) {
            // 防止在切換類別的時候馬上觸發捲動加載，造成有遊戲重複出現的情況
            if (this.isReceive) {
                return;
            }

            this.isReceive = true;

            if (index > 3) {
                return;
            }

            const gameApiInfo = {
                url: gameList,
                params: {
                    ...this.paramsData,
                    vendor: this.vendor
                }
            };

            // 活動先註解不開放，後續開放只要搜 activity_open
            // if (!this.paramsData.name && this.paramsData.label === 'activity') {
            //     gameApiInfo = {
            //         url: `/api/v1/c/vendor/${this.vendor || 'all'}/vendor_event`,
            //         params: {
            //             games: 1,
            //             enable: true,
            //             first_result: this.paramsData.first_result,
            //             max_results: this.paramsData.max_results
            //         }
            //     };
            // }

            new Promise((resolve) => {
                ajax({
                    method: 'get',
                    url: gameApiInfo.url,
                    errorAlert: false,
                    params: gameApiInfo.params
                }).then((response) => {
                    if (response && response.result === 'ok') {
                        resolve(response);
                        return;
                    }

                    setTimeout(() => {
                        this.isReceive = false;
                        this.infiniteHandler($state, index + 1);
                    }, 3000);
                });
            }).then((response) => {
                if (!this.paramsData.name && response.ret.games && this.paramsData.label === 'activity') {
                    this.gameData.push(...response.ret.games);
                } else {
                    this.gameData.push(...response.ret);
                }

                this.paramsData.first_result = this.gameData.length;
                this.isReceive = false;
                this.isGameDataReceive = true;

                $state.loaded();

                if (this.gameData.length >= response.pagination.total) {
                    $state.complete();
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.game-item-wrap {
    background: #F8F8F7;
    min-height: calc(100vh - 133px);
}
</style>
