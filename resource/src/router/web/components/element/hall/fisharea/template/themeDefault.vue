<template>
    <div class="fisharea-wrap">
        <div :class="`game-list-wrap-${theme} clearfix`">
            <game-item
                v-for="gameInfo in gameList"
                :key="`game-${gameInfo.vendor}-${gameInfo.code}`"
                :show-jackpot="false"
                :game-info="gameInfo"
                :theme="themeConfig[theme]"
            />
        </div>
        <!-- 捲動加載 -->
        <infinite-loading ref="infiniteLoading" @infinite="infiniteHandler">
            <span slot="no-more" />
            <span slot="no-results" />
        </infinite-loading>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { timer } from 'rxjs';
import { switchMap, retry } from 'rxjs/operators';
import InfiniteLoading from 'vue-infinite-loading';
import game from '@/api/game';
import openGame from '@/lib/open_game';
import isMobile from '@/lib/is_mobile';
import gameItem from '../../../../common/gameItem';

/**
 * 自訂遊戲列表模塊
 * @module element/hall/gameList
 * @param {object} config - 模塊設定檔
 * @param {object} theme - 模塊當前佈局
 * @param {object} selfStore - 模塊 rxjs 資料 store
 * @param {object} storeMethods - 更新模塊 rxjs 資料的方法
 */
export default {
    components: {
        InfiniteLoading,
        gameItem
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        theme: {
            type: String,
            required: true
        },
        selfStore: {
            type: Object,
            required: true
        },
        storeMethods: {
            type: Object,
            required: true
        }
    },
    subscriptions() {
        return {
            page: this.selfStore.page$,
            gameList: this.selfStore.gameList$,
            isFetching: this.selfStore.isFetching$
        };
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain',
            isBackEnd: 'getIsBackEnd',
            loginStatus: 'getLoginStatus',
            favoriteGame: 'getFavoriteGame'
        }),
        style() {
            return this[`$style${this.theme}`];
        },
        themeConfig() {
            return {
                519: '519',
                A: 'waterBlue'
            };
        },
        /**
         * 重組最愛列表 List
         * @method favoriteList
         * @returns {object} 最愛列表
         */
        favoriteList() {
            const result = {};

            this.favoriteGame.forEach((info) => {
                if (!result[info.vendor]) {
                    result[info.vendor] = {};
                }
                result[info.vendor][info.code] = info;
            });

            return result;
        }
    },
    created() {
        if (this.isBackEnd) {
            return;
        }

        this.actionSetFavoriteGame();
        this.storeMethods.getGameList(this.isBackEnd).then(({ result, ret }) => {
            if (result === 'ok') {
                this.storeMethods.setFisharea('page$', this.page + 1);
                this.storeMethods.setFisharea('gameList$', ret);
            }
        });
    },
    methods: {
        ...mapActions([
            'actionSetFavoriteGame'
        ]),
        /**
         * 捲動加載
         * @method infiniteHandler
         * @param {object} $state - 套件提供的方法
         * @see { @link https://peachscript.github.io/vue-infinite-loading/#!/ }
         */
        infiniteHandler($state) {
            if (this.isFetching) {
                return;
            }

            this.storeMethods.setFisharea('isFetching$', true);

            // 呈現 loading 圖作為緩衝，600 毫秒再開始載入
            const list = timer(600);
            list.pipe(
                switchMap(() => this.storeMethods.getGameList(this.isBackEnd).then((response) => {
                    this.storeMethods.setFisharea('isFetching$', false);
                    return response;
                })),
                retry(3)
            ).subscribe(({ pagination, result, ret }) => {
                if (result === 'ok') {
                    this.storeMethods.setFisharea('page$', this.page + 1);
                    this.storeMethods.setFisharea('gameList$', [
                        ...this.gameList,
                        ...ret
                    ]);
                }
                $state.loaded();
                if (this.gameList.length >= pagination.total) {
                    $state.complete();
                }
            });
        },
        /**
         * 取得圖片路徑
         * @method getImg
         * @param {object} gameInfo - 遊戲資訊
        */
        getImg(gameInfo) {
            return {
                src: this.$getCdnPath(`${this.cdnDomain}/image/casino/${gameInfo.vendor}/Game_${gameInfo.code}.png`),
                error: this.$getCdnPath('/static/image/game_loading_s.gif'),
                loading: this.$getCdnPath('/static/image/game_loading_s.gif')
            };
        },
        /**
         * 取得遊戲按鈕文字
         * @method getBtnName
         * @param {object} gameInfo - 遊戲資訊
        */
        getBtnName(gameInfo) {
            const trialKey = isMobile() ? 'mobile_trial' : 'trial';
            let name = 'S_PLAY_NOW';

            if (this.loginStatus) {
                return this.$i18n.t(name);
            }

            if (gameInfo[trialKey]) {
                name = 'S_FREE_GAME';
            }

            return this.$i18n.t(name);
        },
        /**
         * 檢查是否為最愛
         * @method checkFavorite
         * @param {string} gameInfo.vendor - 遊戲供應商名稱
         * @param {string} gameInfo.code - 遊戲代號
         */
        checkFavorite({ vendor, code }) {
            try {
                return !!this.favoriteList[vendor][code];
            } catch (err) {
                return false;
            }
        },
        /**
         * 切換最愛遊戲
         * @method toggleFavorite
         * @param {object} gameInfo - 遊戲資訊
         */
        toggleFavorite(gameInfo) {
            if (this.isBackEnd) {
                return;
            }

            const actionType = this.checkFavorite(gameInfo) ? 'deleteFavoriteGame' : 'setFavoriteGame';

            game[actionType]({
                params: {
                    vendor: gameInfo.vendor,
                    kind: gameInfo.kind,
                    code: gameInfo.code
                }
            }).then(() => {
                this.actionSetFavoriteGame();
            });
        },
        /**
         * 點擊立即遊戲
         * @method onEnter
         * @param {object} gameInfo - 遊戲資訊
         * @param {string} gameInfo.vendor - 遊戲供應商名稱
         * @param {number} gameInfo.kind - 遊戲分類代號
         * @param {string} gameInfo.code - 遊戲代號
         * @param {boolean} gameInfo.trial - 是否有遊戲試玩
         * @param {boolean} gameInfo.mobile_trial - 是否有手機遊戲試玩
        */
        onEnter({
            vendor, kind, code, trial, mobile_trial: mobileTrial
        }) {
            if (this.isBackEnd) {
                return;
            }

            if (!this.loginStatus && !(isMobile() ? mobileTrial : trial)) {
                alert(this.$i18n.t('S_LOGIN_TIPS'));
                return;
            }

            openGame({
                vendor,
                kind,
                code
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.game-list-wrap-A {
    padding: 20px 0;
    margin: 0 auto;
    width: 960px;
}

.game-list-wrap-519 {
    padding: 1.3%;
    min-width: 960px;
}
</style>
