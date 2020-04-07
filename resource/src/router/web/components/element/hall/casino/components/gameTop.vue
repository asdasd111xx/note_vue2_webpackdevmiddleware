<template>
    <div :class="getClass(['top-bg'])">
        <div :class="getClass(['top-bg-repeat'])">
            <div :class="getClass(['title-wrap', 'border-bg'])" @click="onCategoryClick">
                <div :class="getClass(['title', 'border-bg-repeat'])">
                    {{ (vendorList[curVendor] || '').toUpperCase() }}
                    &nbsp;<div :class="getClass(['collapse-icon', 'is-show'], { 'is-show': isTopListShow })" />
                </div>
            </div>
            <div :class="getClass(['search-btn-wrap', 'border-bg'])">
                <div :class="['search-btn', getClass(['border-bg-repeat'])]">
                    <input
                        ref="search"
                        :class="getClass(['search', 'is-show', 'is-empty'], { 'is-show': isSearchShow, 'is-empty': isEmpty })"
                        :value="searchText"
                        :placeholder="$t('S_PLEASE_ENTER_GAME_NAME')"
                        type="text"
                        @input="onSearch"
                    />
                    <div :class="getClass(['search-icon'])" @click="onSearchClick" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
 * 電子遊戲上方橫條區塊
 * @module element/hall/gameTop
 * @param {object} vendorList - 遊戲商列表
 * @param {object} topRefs - 上層 refs 物件
 * @param {object} selfStore - 模塊 rxjs 資料 store
 * @param {object} storeMethods - 更新模塊 rxjs 資料的方法
 */
export default {
    props: {
        theme: {
            type: String,
            required: true
        },
        vendorList: {
            type: Object,
            default: () => ({})
        },
        topRefs: {
            type: Object,
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
            curVendor: this.selfStore.curVendor$,
            curType: this.selfStore.curType$,
            searchText: this.selfStore.searchText$,
            page: this.selfStore.page$,
            gameList: this.selfStore.gameList$,
            activityList: this.selfStore.activityList$,
            isTopListShow: this.selfStore.isTopListShow$,
            isSearchShow: this.selfStore.isSearchShow$,
            isFetching: this.selfStore.isFetching$
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd'
        }),
        /**
         * 搜尋遊戲結果是否為空
         * @method isEmpty
         * @returns {boolean}
         */
        isEmpty() {
            const isActivityLength = this.activityList.ret && this.gameList.length === this.activityList.ret.events.length;
            return !this.isFetching && (!this.gameList.length || isActivityLength);
        }
    },
    mounted() {
        const keyword = fromEvent(this.$refs.search, 'input');

        keyword.pipe(
            debounceTime(600)
        ).subscribe(() => {
            if (this.curType === 'favorite') {
                return;
            }
            this.storeMethods.setCasino('page$', 0);
            this.storeMethods.setCasino('isFetching$', true);

            if (!this.searchText && this.curType === 'activity') {
                this.storeMethods.getActivityList({ curVendor: this.curVendor }, this.isBackEnd).then((response) => {
                    this.storeMethods.setCasino('isFetching$', false);

                    if (response.result === 'ok') {
                        this.storeMethods.setCasino('page$', this.page + 1);
                        this.storeMethods.setCasino('gameList$', [
                            ...response.ret.events,
                            ...response.ret.games
                        ]);
                    }

                    this.topRefs.infiniteLoading.$emit('$InfiniteLoading:reset');

                    if (this.gameList.length >= response.pagination.total) {
                        this.topRefs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    }
                });
                return;
            }

            this.storeMethods.getGameList({}, this.isBackEnd).then((response) => {
                const activityData = this.activityList.ret ? this.activityList.ret.events : [];
                this.storeMethods.setCasino('isFetching$', false);

                if (response.result === 'ok') {
                    this.storeMethods.setCasino('page$', this.page + 1);
                    this.storeMethods.setCasino('gameList$', [
                        ...activityData,
                        ...response.ret
                    ]);
                }

                this.topRefs.infiniteLoading.$emit('$InfiniteLoading:reset');

                if (this.gameList.length >= response.pagination.total) {
                    this.topRefs.infiniteLoading.$emit('$InfiniteLoading:complete');
                }
            });
        });
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
            const style = this[`$style_${this.theme}`] || this.$style_basic;
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
         * 點擊分類，展開/收合下方遊戲商及分類列表
         * @method onCategoryClick
         */
        onCategoryClick() {
            this.storeMethods.toggleTopList();
        },
        /**
         * 點擊搜尋的放大鏡圖示，展開/收合搜尋框
         * @method onSearchClick
         */
        onSearchClick() {
            if (this.isBackEnd) {
                return;
            }
            this.storeMethods.toggleSearch();
            this.$refs.search.focus();
        },
        /**
         * 搜尋遊戲
         * @method onSearch
         */
        onSearch(e) {
            if (this.isBackEnd) {
                return;
            }
            this.storeMethods.setCasino('searchText$', e.target.value);
        }
    }
};
</script>

<style lang="scss" src="../css/basic/gameTop.scss" module="$style_basic"></style>
<style lang="scss" src="../css/519/gameTop.scss" module="$style_519"></style>
