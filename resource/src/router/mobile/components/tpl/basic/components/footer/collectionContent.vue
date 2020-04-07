<template>
    <div :class="mainClass">
        <div class="search-wrap clearfix">
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
            :parent-refs="$refs"
            :cur-vendor="curVendor"
            @venderClick="onVenderClick"
        />
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
        </swiper>
        <!-- 未搜尋到相關遊戲訊息區塊 -->
        <div v-show="!list.length" class="empty-box">
            <div class="empty-msg">{{ $t('S_NO_GAME') }}</div>
        </div>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .list-item[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/casino/game_img_bg_s.png') }}) 0 0 no-repeat;
            }

            .search-bg[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/casino/search_icon.png') }}) #202020 202px 8px no-repeat;
            }

            .swiper-container .swiper-button.swiper-next[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/casino/quick_arrow_r.png') }}) 0 0 no-repeat;
            }

            .swiper-container .swiper-button.swiper-prev[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/casino/quick_arrow_l.png') }}) 0 0 no-repeat;
            }

            @media screen and (min-width: 768px) {
                .list-item[{{ this.$options._scopeId }}] {
                    background: url({{ $getCdnPath('/static/image/casino/game_img_bg_m.png') }}) 0 0 no-repeat;
                }
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import venderList from './venderList';
import listItem from './listItem';

export default {
    components: {
        swiper,
        swiperSlide,
        venderList,
        listItem
    },
    props: {
        curTab: {
            type: String,
            required: true
        },
        recentList: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            curVendor: '',
            searchText: '',
            swiperOption: {
                slidesPerView: 'auto', // 容器呈現內的項目數量
                slidesOffsetBefore: 18, // 容器左邊距
                slidesOffsetAfter: 18, // 容器右邊距
                spaceBetween: 6 // 項目之間的間距
            }
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
                && info.name && info.name.includes(this.searchText);

            if (this.curTab === 'favorite') {
                return this.favoriteGame.filter(filter);
            }
            return this.recentList.filter(filter);
        }
    },
    watch: {
        collectionStatus(status) {
            if (!status) {
                this.swiper.slideTo(0);
            }
        },
        curTab() {
            this.swiper.slideTo(0);
            this.curVendor = '';
            this.searchText = '';
        }
    },
    methods: {
        /**
         * 搜尋遊戲
         * @method onSearch
         * @param {object} e - 表單事件 object
         */
        onSearch(e) {
            this.searchText = e.target.value;
        },
        onVenderClick(vendor) {
            this.curVendor = vendor;
        }
    }
};
</script>

<style lang="scss" src="../../css/footer/collectionContent.scss" scoped></style>
