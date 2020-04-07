<template>
    <div :class="getClass(['casino-wrap', 'is-mobile'], { 'is-mobile': isMobile() })">
        <!-- 電子遊戲上方橫條區塊 -->
        <game-top
            :theme="element.theme"
            :vendor-list="vendorList"
            :top-refs="$refs"
            :self-store="selfStore"
            :store-methods="storeMethods"
        />
        <!-- 電子遊戲，遊戲商及遊戲分類列表區塊 -->
        <category-list
            :theme="element.theme"
            :vendor-list="vendorList"
            :top-refs="$refs"
            :self-store="selfStore"
            :store-methods="storeMethods"
        />
        <!-- 電子遊戲區塊 -->
        <game-wrap
            :element="element"
            :self-store="selfStore"
            :store-methods="storeMethods"
        />
        <!-- 捲動加載 -->
        <infinite-loading ref="infiniteLoading" @infinite="infiniteHandler">
            <span slot="no-more" />
            <span slot="no-results" />
        </infinite-loading>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { timer } from 'rxjs';
import { switchMap, retry } from 'rxjs/operators';
import InfiniteLoading from 'vue-infinite-loading';
import isMobile from '@/lib/is_mobile';
import gameTop from '../components/gameTop';
import categoryList from '../components/categoryList';
import gameWrap from '../components/gameWrap';

/**
 * 電子大廳模塊
 * @module element/hall/casino
 * @param {object} config - 模塊設定檔
 * @param {object} selfStore - 模塊 rxjs 資料 store
 * @param {object} storeMethods - 更新模塊 rxjs 資料的方法
 */
export default {
    components: {
        gameTop,
        categoryList,
        gameWrap,
        InfiniteLoading
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        vendorList: {
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
        },
        element: {
            type: Object,
            required: true
        }
    },
    subscriptions() {
        return {
            maxResult: this.selfStore.maxResult$,
            page: this.selfStore.page$,
            gameList: this.selfStore.gameList$,
            activityList: this.selfStore.activityList$,
            curVendor: this.selfStore.curVendor$,
            curType: this.selfStore.curType$,
            searchText: this.selfStore.searchText$,
            isFetching: this.selfStore.isFetching$
        };
    },
    data() {
        return {
            isMobile
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd'
        })
    },
    methods: {
        /**
         * 取得Class名稱
         * @method getClass
         * @param {array} className - 要取得的Class名稱
         * @param {object} classInfo - 判斷是否要取得此Class
         * @returns {object} Class Object
        */
        getClass(className, classInfo) {
            const style = this[`$style_${this.element.theme}`] || this.$style_basic;
            const classObj = {};

            className.forEach((name) => {
                if (!style[name]) {
                    return;
                }

                const value = classInfo && name in classInfo ? classInfo[name] : true;
                classObj[style[name]] = value;
            });

            return classObj;
        },
        /**
         * 捲動加載
         * @param {object} $state - 套件提供的方法
         * @see { @link https://peachscript.github.io/vue-infinite-loading/#!/ }
         */
        infiniteHandler($state) {
            if (this.isFetching) {
                return;
            }

            if (this.isBackEnd) {
                this.storeMethods.getGameList({}, this.isBackEnd).then((response) => {
                    this.storeMethods.setCasino('gameList$', response);
                });
                $state.complete();
                return;
            }

            this.storeMethods.setCasino('isFetching$', true);
            const { searchText } = this;

            const getGameApi = {
                // 遊戲
                getGameList: () => this.storeMethods.getGameList({ name: searchText }).then((response) => {
                    this.storeMethods.setCasino('isFetching$', false);
                    return response;
                }),
                // 活動
                getActivityList: () => this.storeMethods.getActivityList({ curVendor: this.curVendor || 'all' }, this.isBackEnd).then((response) => {
                    this.storeMethods.setCasino('isFetching$', false);
                    return response;
                })
            };
            const apiName = this.curType === 'activity' ? 'getActivityList' : 'getGameList';

            // 呈現 loading 圖作為緩衝，600 毫秒再開始載入
            const list = timer(600);
            list.pipe(
                switchMap(getGameApi[apiName]),
                retry(3)
            ).subscribe((response) => {
                if (response.result === 'ok') {
                    let resultGameList = [...response.ret];
                    this.storeMethods.setCasino('page$', this.page + 1);

                    if (this.curType === 'activity') {
                        resultGameList = [
                            ...response.ret.events,
                            ...response.ret.games
                        ];
                    }

                    this.storeMethods.setCasino('gameList$', [
                        ...this.gameList,
                        ...resultGameList
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

<style lang="scss" src="../css/basic/themeDefault.scss" module="$style_basic"></style>
<style lang="scss" src="../css/519/themeDefault.scss" module="$style_519"></style>
