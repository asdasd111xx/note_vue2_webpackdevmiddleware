<template>
    <div class="fisharea-wrap">
        <template v-for="slotKey in slotSort">
            <template v-if="slotKey === 'search'">
                <slot
                    :text="paramsData.name"
                    :game-num="gameData.length"
                    :set-search-text="setSearchText"
                    name="search"
                >
                    <gameSearch
                        :key="`slot-${slotKey}`"
                        :is-game-data-receive="isGameDataReceive"
                        :theme="searchTheme"
                        :text="paramsData.name"
                        :game-num="gameData.length"
                        :set-search-text="setSearchText"
                    />
                </slot>
            </template>
            <template v-if="slotKey === 'list'">
                <div :key="`slot-${slotKey}`" class="game-item-wrap clearfix">
                    <slot v-if="isGameDataReceive && gameData.length === 0" name="gameListEmpty">
                        <game-empty :theme="gameTheme" />
                    </slot>
                    <template v-else>
                        <slot
                            :game-data="gameData"
                            :show-vendor="gameShowVendor"
                            :show-jackpot="gameShowJackpot"
                            :show-favor="gameShowFavor"
                            :show-button="gameShowButton"
                            name="gameList"
                        >
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
                        </slot>
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
import { gameList } from '@/config/api';
import gameItem from '@/router/web/components/common/gameItem';
import gameSearch from '../gameSearch';
import gameEmpty from '../gameEmpty';

/**
 * 共用元件 - 手機網頁版電子遊戲頁共用框 (邏輯共用)
 * @param {Array} [slotSort=['search', 'list']] - slot 的區塊順序調整
 * @param {String} [searchTheme] - 搜尋框組件樣式
 * @param {String} [gameTheme] - 遊戲列表(gameItem)的樣式
 * @param {Boolean} [gameShowVendor=true] - 遊戲列表(gameItem)，是否顯示平台名稱
 * @param {Boolean} [gameShowJackpot=false] - 遊戲列表(gameItem)，是否顯示彩金區塊
 * @param {Boolean} [gameShowFavor=true] - 遊戲列表(gameItem)，是否顯示最愛按鈕
 * @param {Boolean} [gameShowButton=true] - 遊戲列表(gameItem)，是否顯示進入遊戲按鈕
 */
export default {
    components: {
        gameSearch,
        gameItem,
        gameEmpty,
        InfiniteLoading
    },
    props: {
        slotSort: {
            type: Array,
            default: () => (['search', 'list'])
        },
        searchTheme: {
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
            showInfinite: true,
            paramsData: {
                kind: 3,
                label: 5,
                enable: true,
                first_result: 0,
                max_results: 36,
                name: ''
            },
            searchText: '',
            gameData: [],
            isGameDataReceive: false
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus',
            favoriteGame: 'getFavoriteGame'
        }),
        // 依平台篩選出最愛的遊戲列表
        favoriteData() {
            return this.favoriteGame.filter((element) => element.kind === this.paramsData.kind);
        }
    },
    created() {
        if (this.loginStatus) {
            this.actionSetFavoriteGame();
        }
    },
    methods: {
        ...mapActions([
            'actionSetFavoriteGame'
        ]),
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

            new Promise((resolve) => {
                ajax({
                    method: 'get',
                    url: gameList,
                    errorAlert: false,
                    params: {
                        ...this.paramsData
                    }
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
                this.gameData.push(...response.ret);
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
