<template>
    <div :class="[getClass(['game-list-wrap']), mainClass]">
        <!-- 彩金 -->
        <game-jackpot
            v-if="jpIsOpen"
            :key="curVendor"
            :theme="element.theme"
            :cur-vendor="curVendor"
        />
        <game-item
            v-for="gameInfo in resultGameList"
            :key="`game-${gameInfo.vendor}-${gameInfo.code}`"
            :theme="element.theme"
            :game-info="gameInfo"
        />
        <!-- 未搜尋到相關遊戲訊息區塊 -->
        <div v-show="!resultGameList.length && !isFetching" :class="getClass(['is-empty', curType])">
            <div class="empty-msg">{{ curType === 'activity' ? $text('S_NO_ACTIVITY', '暂无活动') : $t('S_NO_GAME') }}</div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import gameItem from '../../../../common/gameItem';

/**
 * 電子遊戲區塊
 * @module element/hall/gameWrap
 * @param {object} selfStore - 模塊 rxjs 資料 store
 * @param {object} storeMethods - 更新模塊 rxjs 資料的方法
 */
export default {
    components: {
        gameJackpot: () => import(/* webpackChunkName: 'gameJackpot' */'./gameJackpot'),
        gameItem
    },
    props: {
        element: {
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
            gameList: this.selfStore.gameList$,
            isFetching: this.selfStore.isFetching$
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            cdnDomain: 'getCdnDomain',
            favoriteGame: 'getFavoriteGame',
            loginStatus: 'getLoginStatus',
            jackpot: 'getJackpot',
            curLang: 'getCurLang'
        }),
        /**
         * 過濾非當前供應商的遊戲列表
         * @method resultGameList
         * @returns 遊戲列表
         */
        resultGameList() {
            return this.gameList.filter((gameInfo) => {
                const match = this.curVendor === gameInfo.vendor || this.curVendor === '';

                if (this.curType === 'favorite') {
                    return match && gameInfo.name.includes(this.searchText);
                }

                return match;
            });
        },
        /**
         * 取得外框 class
         * @method mainClass
         * @returns {object} css 樣式物件
         */
        mainClass() {
            const curType = `cur-type-${this.curType === '' ? 'all' : this.curType}`;
            const curVendor = `cur-vendor-${this.curVendor === '' ? 'all' : this.curVendor}`;

            return {
                [curVendor]: true,
                [curType]: true,
                clearfix: true
            };
        },
        /**
         * 彩金是否開放
         * @method jpClass
         * @returns {boolean} 是否開放
         */
        jpIsOpen() {
            // 沒活動彩金不顯示
            if (this.curType === 'activity' && this.resultGameList.length === 0) {
                return false;
            }

            if (this.jackpot[this.curVendor] && (this.jackpot[this.curVendor].jpGrand || (this.jackpot[this.curVendor].jpMinor && this.jackpot[this.curVendor].jpMinor.length !== 0))) {
                return true;
            }

            return false;
        }
    },
    created() {
        if (this.isBackEnd) {
            return;
        }
        this.actionSetFavoriteGame();
    },
    mounted() {
        if (this.isBackEnd) {
            return;
        }

        const allJackpotOpen = {};

        Object.keys(this.jackpot).forEach((obj) => {
            allJackpotOpen[obj] = {
                ...this.jackpot[obj],
                isShow: obj !== 'cq9'
            };
        });

        this.actionSetJackpot({
            ...this.jackpot,
            ...allJackpotOpen
        });
    },
    methods: {
        ...mapActions([
            'actionSetFavoriteGame',
            'actionSetCollectionStatus',
            'actionSetJackpot'
        ]),
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
        }
    }
};
</script>

<style lang="scss" src="../css/basic/gameWrap.scss" module="$style_basic"></style>
<style lang="scss" src="../css/519/gameWrap.scss" module="$style_519"></style>
