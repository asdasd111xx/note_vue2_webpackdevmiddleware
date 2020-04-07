<template>
    <div :class="mainClass">
        <div v-show="curTab !== 'hot'" class="search-wrap clearfix">
            <div class="search-bg">
                <input
                    :class="['search', { 'is-empty': !list.length && searchText !== '' }]"
                    :value="searchText"
                    :placeholder="$t('S_ENTER_GAME_NAME')"
                    type="text"
                    @input="onSearch"
                />
            </div>
        </div>
        <vender-list
            v-show="curTab === 'favorite' && list.length"
            :self-store="selfStore"
            :store-methods="storeMethods"
            :parent-refs="$refs"
        />
        <!-- PC 版呈現 -->
        <swiper ref="swiper" :options="swiperOption">
            <swiper-slide
                v-for="listInfo in list"
                :key="`list-${listInfo.kind}-${listInfo.vendor}-${listInfo.code}`"
            >
                <list-item
                    :list-info="listInfo"
                    class="list-item"
                />
            </swiper-slide>
            <div
                ref="swiper-prev"
                slot="button-prev"
                class="swiper-button swiper-prev"
                @click="onPrevClick"
            />
            <div
                ref="swiper-next"
                slot="button-next"
                class="swiper-button swiper-next"
                @click="onNextClick"
            />
        </swiper>
        <!-- 非 PC 版呈現 -->
        <div
            v-show="list.length"
            ref="bar"
            v-bar
            :style="{ height: `${barHeight}px` }"
        >
            <div>
                <div class="list-wrap clearfix">
                    <div
                        v-for="listInfo in list"
                        :key="`list-${listInfo.kind}-${listInfo.vendor}-${listInfo.code}`"
                        class="list-item"
                    >
                        <list-item
                            :key="`list-${listInfo.vendor}-${listInfo.code}`"
                            :list-info="listInfo"
                        />
                    </div>
                </div>
            </div>
        </div>
        <!-- 未搜尋到相關遊戲訊息區塊 -->
        <div v-show="!list.length" class="empty-box">
            <div class="empty-msg">{{ $t('S_NO_GAME') }}</div>
        </div>
    </div>
</template>

<script>
/* global $ */
import { mapGetters } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import venderList from './venderList';
import listItem from './listItem';

/**
 * 客端下方快捷選單 - 內容區塊
 * @module tpl/collection/collectionContent
 * @param {object} selfStore - rxjs 資料 store
 * @param {object} storeMethods - 更新 rxjs 資料的方法
 */
export default {
    components: {
        swiper,
        swiperSlide,
        venderList,
        listItem
    },
    props: {
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
            curTab: this.selfStore.curTab$,
            curVendor: this.selfStore.curVendor$,
            recentList: this.selfStore.recentList$,
            hotGame: this.selfStore.hotGame$,
            searchText: this.selfStore.searchText$
        };
    },
    data() {
        return {
            swiperOption: {
                slidesPerView: 'auto', // 容器呈現內的項目數量
                slidesOffsetBefore: 18, // 容器左邊距
                slidesOffsetAfter: 18, // 容器右邊距
                spaceBetween: 6, // 項目之間的間距
                navigation: {
                    nextEl: '.swiper-next',
                    prevEl: '.swiper-prev'
                },
                on: {
                    resize: () => {
                        this.toggleSwiperNav();
                    }
                }
            },
            barHeight: 0
        };
    },
    computed: {
        ...mapGetters({
            collectionStatus: 'getCollectionStatus',
            favoriteGame: 'getFavoriteGame'
        }),
        swiper() {
            return this.$refs.swiper.swiper;
        },
        /**
         * 取得外框 class
         * @method mainClass
         * @returns {object} css 樣式物件
         */
        mainClass() {
            const curVendor = `cur-vendor-${this.curVendor === '' ? 'all' : this.curVendor}`;
            return [
                'content-wrap',
                curVendor,
                this.curTab,
                {
                    'is-show': this.collectionStatus,
                    'has-list': this.list.length
                }
            ];
        },
        /**
         * 取得 最近玩過/最愛 列表
         * @method list
         * @returns {array} 列表資料
         */
        list() {
            const filter = (info) => (this.curVendor === info.vendor
                || this.curVendor === '')
                && info.name.includes(this.searchText);

            if (this.curTab === 'favorite') {
                return this.favoriteGame.filter(filter);
            }

            if (this.curTab === 'hot') {
                return this.hotGame.filter(filter);
            }
            return this.recentList.filter(filter);
        }
    },
    watch: {
        collectionStatus(status) {
            if (!status) {
                this.swiper.slideTo(0);
            }
        }
    },
    mounted() {
        // 在 mounted 之後再 watch，防止程式錯誤
        this.$watch('list', () => {
            // 下一個循環再執行，確保頁面渲染完畢
            this.$nextTick(() => { this.toggleSwiperNav(); });
            this.setBarHeight();
        });

        this.setBarHeight();
        $(window).resize(this.setBarHeight);
    },
    methods: {
        /**
         * 設定虛擬捲軸高度 (當瀏覽器高度較小時)
         * @method setBarHeight
         */
        setBarHeight() {
            const defHeight = this.curTab === 'favorite' ? 361 : 435;
            const diff = this.curTab === 'favorite' ? 164 : 105;

            if ($(window).height() - diff < defHeight) {
                this.barHeight = $(window).height() - diff;
                return;
            }
            this.barHeight = defHeight;
        },
        /**
         * 搜尋遊戲
         * @method onSearch
         * @param {object} e - 表單事件 object
         */
        onSearch(e) {
            this.storeMethods.setCollection('searchText$', e.target.value);
        },
        /**
         * 設定 swiper 左右按鈕顯示/隱藏
         * @method toggleSwiperNav
         */
        toggleSwiperNav() {
            const viewportMax = Math.floor(($(window).width() - 18) / 126);

            if (this.swiper.slides.length <= viewportMax) {
                this.swiper.navigation.$prevEl.css('display', 'none');
                this.swiper.navigation.$nextEl.css('display', 'none');
                this.swiper.slideTo(0);
                return;
            }
            this.swiper.navigation.$prevEl.css('display', 'block');
            this.swiper.navigation.$nextEl.css('display', 'block');
        },
        /**
         * swiper prev button
         * @method onPrevClick
         */
        onPrevClick() {
            if (this.swiper.isBeginning) {
                // 因為點擊移到最後一個項目後會再觸發 prev，因此延遲處理
                setTimeout(() => {
                    this.swiper.slideTo(this.swiper.slides.length);
                }, 100);
            }
        },
        /**
         * swiper next button
         * @method onNextClick
         */
        onNextClick() {
            if (this.swiper.isEnd) {
                // 因為點擊移到第一個項目後會再觸發 next，因此延遲處理
                setTimeout(() => {
                    this.swiper.slideTo(0);
                }, 100);
            }
        }
    }
};
</script>

<style lang="scss" src="../css/collectionContent.scss" scoped></style>
