<template>
    <div v-if="isReceive" class="home-wrap">
        <!-- 最新消息 -->
        <div class="news-wrap clearfix">
            <div class="news-title">{{ $t('S_HOT_NEWS_2') }}：</div>
            <ele-news />
        </div>
        <!-- 輪播圖 -->
        <slider-view />
        <div class="game-wrap">
            <!-- 遊戲頁籤 -->
            <div class="category-list-wrap">
                <swiper :options="categoryOptions">
                    <swiper-slide
                        v-for="data in gameCategory"
                        :key="`category-list-${data.kind}`"
                    >
                        <span :class="{ current: data.vendor === curType }" @click="onTabClick(data.vendor)">{{ $text(data.name) }}</span>
                    </swiper-slide>
                </swiper>
            </div>
            <!-- 遊戲、平台 -->
            <game-list :games="gameItems" :cur-type="curType" />
        </div>
        <!-- 捲動加載 -->
        <infinite-loading v-if="curType === 'favorite'" @infinite="infiniteHandler">
            <span slot="no-more" />
            <span slot="no-results" />
        </infinite-loading>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import InfiniteLoading from 'vue-infinite-loading';
import find from 'lodash/find';
import keyBy from 'lodash/keyBy';
import categoryList from '@/config/gameCategory';
import game from '@/api/game';
import eleNews from '@/router/web/components/common/news';
import gameList from './gameList';
import sliderView from './sliderView';

export default {
    components: {
        swiper,
        swiperSlide,
        sliderView,
        eleNews,
        gameList,
        InfiniteLoading
    },
    data() {
        return {
            settings: {},
            isReceive: false,
            categoryOptions: {
                slidesPerView: 'auto'
            },
            curType: 'casino',
            recent: [],
            favorite: [],
            games: {},
            isFetching: false,
            total: 0
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus'
        }),
        /**
         * 取得頁籤
         * @method gameCategory
         * @returns {array} 頁籤列表
         */
        gameCategory() {
            const sort = ['recent', 'favorite', 'casino', 'live', 'lottery', 'card', 'sports', 'mahjong'];
            const list = [
                {
                    kind: 'recent',
                    vendor: 'recent',
                    name: this.$t('S_PLAYED')
                },
                {
                    kind: 'favorite',
                    vendor: 'favorite',
                    name: this.$t('S_FAVORITE')
                },
                ...categoryList.filter((items) => this.games[items.kind] && this.games[items.kind].length > 0)
            ];

            return sort.map((value) => find(list, (items) => value === items.vendor)).filter((info) => info);
        },
        gameItems() {
            if (this.curType === 'recent' || this.curType === 'favorite') {
                return this[this.curType];
            }

            return this.games[keyBy(categoryList, 'vendor')[this.curType].kind];
        }
    },
    created() {
        const param = [];

        if (this.loginStatus) {
            // 玩過
            param.push(game.recentGame({
                success: (response) => {
                    this.recent = response.ret;

                    this.curType = response.ret.length > 0 ? 'recent' : 'casino';
                }
            }));

            // 最愛
            param.push(game.favoriteGame({
                success: (response) => {
                    this.favorite = response.ret;
                    this.total = +response.pagination.total;
                }
            }));
        }

        // 電子、視訊、體育、彩票、棋牌
        param.push(game.gameSwitch({
            success: (response) => {
                response.ret.forEach((data) => {
                    if (!this.games[data.kind]) {
                        this.games[data.kind] = [];
                    }

                    // 因應MG2電子上線, 先將MG電子隱藏
                    if (data.kind === 3 && data.vendor === 'mg') {
                        return;
                    }

                    this.games[data.kind].push({
                        ...data,
                        new: (() => {
                            try {
                                return this.settings[data.kind][data.vendor].new;
                            } catch (error) {
                                return false;
                            }
                        })(),
                        hot: (() => {
                            try {
                                return this.settings[data.kind][data.vendor].hot;
                            } catch (error) {
                                return false;
                            }
                        })()
                    });
                });

                // 活動先註解不開放，後續開放只要搜 activity_open
                // this.games[3].unshift({
                //     alias: this.$text('S_HOT_ACTIVITY', '最新活动'),
                //     hot: false,
                //     kind: 3,
                //     new: false,
                //     vendor: 'activity'
                // });
            }
        }));

        // 當所有 api 完成後再渲染
        Promise.all(param).then(() => {
            this.$nextTick(() => {
                this.isReceive = true;
            });
        });
    },
    methods: {
        /**
         * 切換頁籤
         * @method onTabClick
         * @param {number} kind - 遊戲分類代號
         */
        onTabClick(kind) {
            this.curType = kind;
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

            this.isFetching = true;

            if (this.favorite.length >= this.total) {
                this.isFetching = false;
                $state.complete();
                return;
            }

            setTimeout(() => {
                game.favoriteGame({
                    params: {
                        first_result: this.favorite.length
                    }
                }).then((response) => {
                    if (response.result !== 'ok') {
                        this.isFetching = false;
                        return;
                    }

                    this.favorite = [...this.favorite, ...response.ret];
                    this.isFetching = false;
                    $state.loaded();
                });
            }, 600);
        }
    }
};
</script>

<style src="../css/index.scss" lang="scss" scoped></style>
