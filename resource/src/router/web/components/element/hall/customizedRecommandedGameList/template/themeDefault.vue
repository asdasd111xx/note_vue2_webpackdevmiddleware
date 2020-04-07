<template>
    <div class="tpl-wrap">
        <div :class="['game-list-wrap', 'cur-type-all', 'cur-vendor-all', 'clearfix']">
            <game-item
                v-for="caseData in gameList"
                :key="`case-${caseData.vendor}-${caseData.code}`"
                :theme="element.theme"
                :game-info="caseData"
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
import { timer } from 'rxjs';
import { switchMap, retry } from 'rxjs/operators';
import InfiniteLoading from 'vue-infinite-loading';
import gameItem from '../components/gameItem';

/**
 * 自訂遊戲列表模塊
 * @module element/hall/gameList
 * @param {object} config - 模塊設定檔
 * @param {object} element - 模塊資料
 * @param {object} selfStore - 模塊 rxjs 資料 store
 * @param {object} storeMethods - 更新模塊 rxjs 資料的方法
 */
export default {
    components: {
        gameItem,
        InfiniteLoading
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => ({})
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
    methods: {
        /**
         * 捲動加載
         * @param {object} $state - 套件提供的方法
         */
        infiniteHandler($state) {
            if (this.isFetching) {
                return;
            }

            this.storeMethods.setProps('isFetching$', true);

            // 呈現 loading 圖作為緩衝，600 毫秒再開始載入
            const list = timer(600);
            list.pipe(
                switchMap(() => this.storeMethods.getGameList().then((response) => {
                    this.storeMethods.setProps('isFetching$', false);
                    return response;
                })),
                retry(3)
            ).subscribe((response) => {
                if (response.result === 'ok') {
                    this.storeMethods.setProps('page$', this.page + 1);
                    this.storeMethods.setProps('gameList$', [
                        ...this.gameList,
                        ...response.ret
                    ]);
                }
                $state.loaded();
                if (this.gameList.length >= response.pagination.total) {
                    $state.complete();
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";

.tpl-wrap {
    position: relative;
    box-sizing: border-box;

    .game-list-wrap {
        padding: 50px 0;
        margin: 0 auto;

        .game-item {
            position: relative;
            float: left;
        }
    }
}

.theme-A {
    .tpl-wrap {
        .game-list-wrap {
            width: 306px;

            @media screen and (min-width: $phone + $sidebar) {
                width: 408px;
            }

            @media screen and (min-width: $pad + $sidebar) {
                width: 744px;
            }

            @media screen and (min-width: $pc + $sidebar) {
                width: 936px;
            }
        }
    }
}

.theme-B {
    .tpl-wrap {
        .game-list-wrap {
            width: 348px;

            @media screen and (min-width: $phone + $sidebar) {
                width: 464px;
            }

            @media screen and (min-width: $pad + $sidebar) {
                width: 740px;
            }

            @media screen and (min-width: $pc + $sidebar) {
                width: 960px;
            }
        }
    }
}
</style>
