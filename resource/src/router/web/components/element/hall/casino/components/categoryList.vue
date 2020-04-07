<template>
    <div :class="getClass(['category-list-wrap'])">
        <div :class="[getClass(['game-content', 'vendor-list', 'is-show'], { 'is-show': isTopListShow }), 'clearfix']">
            <div
                v-for="(vendor, vendorKey) in vendorList"
                :key="`vendor-${vendorKey}`"
                :class="getClass(['game-item'])"
            >
                <span
                    :class="getClass(['vendor', 'is-current'], { 'is-current': curVendor === vendorKey })"
                    @click="onVendorClick(vendorKey)"
                >
                    {{ vendorName(vendor) }}
                </span>
            </div>
        </div>
        <swiper
            ref="typeSwiper"
            :options="swiperOption"
            :class="[getClass(['category-content']), 'game-type-list', 'clearfix']"
        >
            <swiper-slide
                v-for="info in curTypeList"
                :key="`type-${info.label}`"
                :class="getClass(['category-item'])"
            >
                <span
                    :class="getClass(['type', 'is-current'], { 'is-current': curType === info.label })"
                    @click="onTypeClick(info.label)"
                >
                    {{ info.name }}
                </span>
            </swiper-slide>
            <span v-if="!typeList[curVendor]" :class="['ui', 'active', 'inline', 'small', 'loader', 'inverted', getClass(['loader'])]" />
        </swiper>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

/**
 * 電子遊戲，遊戲商及遊戲分類列表區塊
 * @module element/hall/categoryList
 * @param {object} vendorList - 遊戲商列表
 * @param {object} topRefs - 上層 refs 物件
 * @param {object} selfStore - 模塊 rxjs 資料 store
 * @param {object} storeMethods - 更新模塊 rxjs 資料的方法
 */
export default {
    components: {
        swiper,
        swiperSlide
    },
    props: {
        theme: {
            type: String,
            required: true
        },
        vendorList: {
            type: Object,
            required: true
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
            typeList: this.selfStore.typeList$,
            gameList: this.selfStore.gameList$,
            activityList: this.selfStore.activityList$,
            isTopListShow: this.selfStore.isTopListShow$,
            page: this.selfStore.page$
        };
    },
    data() {
        return {
            swiperOption: {
                slidesPerView: 'auto' // 容器呈現內的項目數量
            },
            reqVendor: ''
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            loginStatus: 'getLoginStatus',
            favoriteGame: 'getFavoriteGame',
            curLang: 'getCurLang',
            casinoVendor: 'getCasinoVendor'
        }),
        typeSwiper() {
            return this.$refs.typeSwiper.swiper;
        },
        curTypeList() {
            return this.typeList[this.reqVendor] || [];
        }
    },
    watch: {
        casinoVendor() {
            // 外部變更vendor時
            this.onVendorClick(this.casinoVendor);
        }
    },
    mounted() {
        this.storeMethods.getGameType({
            isBackEnd: this.isBackEnd,
            isLogin: this.loginStatus,
            vendor: this.curVendor
        });

        // 活動先註解不開放，後續開放只要搜 activity_open
        // if (!this.curType) {
        //     this.storeMethods.getActivityList({
        //         curVendor: this.curVendor
        //     }, this.isBackEnd).then((response) => {
        //         this.storeMethods.setCasino('gameList$', [...response.ret.events]);
        //     });
        // }

        this.reqVendor = this.curVendor;
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
         * 點選遊戲供應商
         * @method onVendorClick
         */
        onVendorClick(vendorKey) {
            if (this.curVendor === vendorKey || this.isBackEnd) {
                return;
            }

            this.reqVendor = vendorKey;
            this.storeMethods.setCasino('page$', 0);
            this.storeMethods.setCasino('searchText$', '');
            this.storeMethods.setCasino('isFetching$', true);

            new Promise((resolve) => {
                if (!Object.keys(this.typeList).includes(vendorKey)) {
                    this.storeMethods.getGameType({
                        isLogin: this.loginStatus,
                        vendor: vendorKey,
                        isBackEnd: this.isBackEnd
                    }).then((typeList) => {
                        // 活動先註解不開放，後續開放只要搜 activity_open
                        // if (!this.curType) {
                        //     this.storeMethods.getActivityList({
                        //         curVendor: vendorKey
                        //     }, this.isBackEnd).then(() => {
                        //         resolve(this.typeList);
                        //     });
                        //     return;
                        // }
                        resolve(typeList);
                    });
                    return;
                }

                // 活動先註解不開放，後續開放只要搜 activity_open
                // if (!this.curType) {
                //     this.storeMethods.getActivityList({
                //         curVendor: vendorKey
                //     }, this.isBackEnd).then(() => {
                //         resolve(this.typeList);
                //     });
                //     return;
                // }

                resolve(this.typeList);
            }).then((typeList) => {
                let gameType = '';
                let resultGameList = [];

                if (typeList[vendorKey].some((info) => info.label === this.curType)) {
                    gameType = this.curType;
                }

                this.typeSwiper.slideTo(0);
                this.storeMethods.setCasino('isFetching$', false);
                this.storeMethods.setCasino('curType$', gameType);
                this.storeMethods.setCasino('curVendor$', vendorKey);

                if (gameType === 'favorite') {
                    this.storeMethods.setCasino('gameList$', this.favoriteGame);
                    this.topRefs.infiniteLoading.$emit('$InfiniteLoading:complete');
                    return;
                }

                if (!gameType && this.activityList.ret) {
                    resultGameList = [...this.activityList.ret.events];
                }

                this.storeMethods.setCasino('gameList$', resultGameList);
                this.topRefs.infiniteLoading.$emit('$InfiniteLoading:reset');
                this.onCategoryClick();
            });
        },
        /**
         * 點選遊戲分類
         * @method onTypeClick
         */
        onTypeClick(type) {
            if (this.curType === type || this.isBackEnd) {
                return;
            }

            this.storeMethods.setCasino('page$', 0);
            this.storeMethods.setCasino('searchText$', '');

            // GA流量統計
            window.dataLayer.push({
                dep: 2,
                event: 'ga_click',
                eventCategory: 'game_filter',
                eventAction: 'game_filter',
                eventLabel: `filter_${this.curVendor}_${type}`
            });

            // 點選最愛時，直接取 store 資料
            if (type === 'favorite') {
                this.storeMethods.setCasino('curType$', type);
                this.storeMethods.setCasino('gameList$', this.favoriteGame);
                this.topRefs.infiniteLoading.$emit('$InfiniteLoading:complete');
                return;
            }

            // 活動先註解不開放，後續開放只要搜 activity_open
            // if (!type) {
            //     this.storeMethods.getActivityList({
            //         curVendor: this.curVendor
            //     }, this.isBackEnd).then((response) => {
            //         if (response && response.result === 'ok') {
            //             this.storeMethods.setCasino('curType$', type);
            //             this.storeMethods.setCasino('gameList$', [...response.ret.events]);
            //             this.topRefs.infiniteLoading.$emit('$InfiniteLoading:reset');
            //         }
            //     });
            //     return;
            // }

            this.storeMethods.setCasino('curType$', type);
            this.storeMethods.setCasino('gameList$', []);
            this.topRefs.infiniteLoading.$emit('$InfiniteLoading:reset');
        },
        /**
         * 平台名稱顯示特例
         * @method vendorName
         */
        vendorName(name) {
            if (name === 'mw') {
                if (this.curLang === 'zh-tw') {
                    return '大滿貫';
                } if (this.curLang === 'zh-cn') {
                    return '大满贯';
                }
            }

            return name.toUpperCase();
        },
        /* 點擊分類，展開/收合下方遊戲商及分類列表
         * @method onCategoryClick
         */
        onCategoryClick() {
            this.storeMethods.toggleTopList();
        }
    }
};
</script>

<style lang="scss" src="../css/basic/categoryList.scss" module="$style_basic"></style>
<style lang="scss" src="../css/519/categoryList.scss" module="$style_519"></style>
