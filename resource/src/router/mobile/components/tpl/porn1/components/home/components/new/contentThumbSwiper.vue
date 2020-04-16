<template>
    <swiper
        v-if="avList.length && isReceive"
        :options="swiperOptionContent"
        class="swiper gellery-content"
    >
        <swiper-slide key="av">
            <div
                v-for="(info, index) in avList"
                :key="`av-${index}`"
                class="content-cells"
            >
                <div class="desc">
                    <div class="title">
                        <img
                            :src="
                                $getCdnPath(
                                    '/static/image/_new/common/icon_item.png'
                                )
                            "
                            alt="icon_item"
                        />
                        <span>{{ info.name }}</span>
                    </div>
                    <div
                        class="more"
                        @click="
                            $router.push({
                                name: 'videoList',
                                query: {
                                    tagId: videoTab.id,
                                    sortId: info.id || 0
                                }
                            })
                        "
                    >
                        {{ $text("S_MORE", "更多") }}
                    </div>
                </div>
                <div class="content">
                    <div
                        v-for="(item, i) in info.list"
                        :key="`av-list-${i}`"
                        class="content-cell-block"
                    >
                        <img :src="item.image" alt="img" />
                        <div class="video-text">{{ item.title }}</div>
                    </div>
                </div>
            </div>
        </swiper-slide>

        <swiper-slide v-for="(info, key) in allGame" :key="key">
            <div class="content-cells">
                <div class="content">
                    <div
                        v-for="(item, index) in info"
                        :key="`game-list-${index}`"
                        class="content-cell-block"
                    >
                        <img
                            :src="
                                $getCdnPath(
                                    `/static/image/mobile/platform/card/${trans[item.kind]}/short/${item.vendor}.png`
                                )
                            "
                            alt="img"
                        />
                        <span>{{ item.alias }}</span>
                    </div>
                </div>
            </div>
        </swiper-slide>
    </swiper>
</template>

<script>
import { mapGetters } from 'vuex';
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';
import axios from 'axios';
import find from 'lodash/find';
import querystring from 'querystring';
import { API_PORN1_DOMAIN } from '@/config/api';

export default {
    components: {
        Swiper,
        SwiperSlide
    },
    props: {
        hallTab: {
            type: Array,
            required: true
        },
        videoTab: {
            type: Object,
            required: true
        },
        selectedIndex: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            isReceive: false,
            trans: {
                1: 'sports',
                2: 'live',
                3: 'casino',
                4: 'lottery',
                5: 'card',
                6: 'mahjong'
            },
            videoRecommand: [],
            videoList: [],
            videoSort: [],
            allGame: {}
        };
    },
    computed: {
        ...mapGetters({
            gameData: 'getGameData',
            memInfo: 'getMemInfo'
        }),
        swiperThumbs() {
            return this.$parent.$refs.swiperThumbs.$el.swiper;
        },
        swiperContent() {
            return this.$parent.$refs.swiperContent.$el.swiper;
        },
        swiperOptionContent() {
            return {
                loop: true,
                loopedSlides: this.hallTab.length, // looped slides should be the same
                spaceBetween: 10,
                direction: 'vertical',
                freeMode: true,
                mousewheel: true,
                autoHeight: true, // 自適應內容的高度: autoHeight + slidesPerView 必備
                slidesPerView: 'auto',
                thumbs: {
                    swiper: this.swiperThumbs
                },
                on: {
                    init: () => {
                        this.$emit('update:selectedIndex', 0);
                        this.swiperContent.slideTo(0, 0, false);
                    },
                    slideChange: () => {
                        this.$emit('update:selectedIndex', this.swiperContent.realIndex);
                    }
                }
            };
        },
        avList() {
            if (!this.videoList.length) {
                return [];
            }

            // 全部才顯示熱門推薦
            // 影片只顯示兩部
            const recommand = this.videoTab.id ? [] : [...this.videoRecommand.map((info) => ({ ...info, list: info.list.slice(0, 2) }))];

            return this.videoSort.reduce((init, sort) => {
                // 影片只顯示前三筆
                if (init.length >= 3) {
                    return init;
                }

                const data = find(this.videoList, (info) => info.id === sort.id);

                if (!data) {
                    return init;
                }

                // 影片只顯示兩部
                return [...init, { ...data, list: data.list.slice(0, 2) }];
            }, [...recommand]);
        }
    },
    watch: {
        videoTab() {
            this.getList();
        }
    },
    created() {
        this.getSort();
        this.getRecommand();
        this.getList();
        this.getGame();
    },
    methods: {
        getSort() {
            axios({
                method: 'get',
                url: `${API_PORN1_DOMAIN}/api/v1/video/sort`,
                timeout: 30000,
                headers: {
                    // Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                    // Version: 1
                    // 本機開發時會遇到 CORS 的問題，把Bundleid及Version註解，並打開下面註解即可
                    'Content-Type': 'application/x-www-form-urlencoded',
                    origin: 'http://127.0.0.1'
                }
            }).then((response) => {
                if (response.status !== 200) {
                    return;
                }

                this.videoSort = [...response.data.result];
            });
        },
        getRecommand() {
            axios({
                method: 'get',
                url: `${API_PORN1_DOMAIN}/api/v1/video/recommand`,
                timeout: 30000,
                headers: {
                    // Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                    // Version: 1
                    // 本機開發時會遇到 CORS 的問題，把Bundleid及Version註解，並打開下面註解即可
                    'Content-Type': 'application/x-www-form-urlencoded',
                    origin: 'http://127.0.0.1'
                }
            }).then((response) => {
                if (response.status !== 200) {
                    return;
                }

                this.videoRecommand = [...response.data.result];
            });
        },
        getList() {
            axios({
                method: 'post',
                url: `${API_PORN1_DOMAIN}/api/v1/video/videolist`,
                timeout: 30000,
                data: querystring.stringify({ tag: this.videoTab.title }),
                headers: {
                    // Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                    // Version: 1
                    // 本機開發時會遇到 CORS 的問題，把Bundleid及Version註解，並打開下面註解即可
                    'Content-Type': 'application/x-www-form-urlencoded',
                    origin: 'http://127.0.0.1'
                }
            }).then((response) => {
                if (response.status !== 200) {
                    return;
                }

                this.videoList = [...response.data.result];
            });
        },
        getGame() {
            // axios({
            //     method: 'get',
            //     url: 'http://192.168.133.98:8080/api/game/list',
            //     timeout: 30000,
            //     headers: {
            //         // Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
            //         // Version: 1
            //         // 本機開發時會遇到 CORS 的問題，把Bundleid及Version註解，並打開下面註解即可
            //         'Content-Type': 'application/x-www-form-urlencoded',
            //         origin: 'http://127.0.0.1'
            //     }
            // }).then((response) => {
            //     this.allGame = response.data.reduce((init, game) => {
            //         const { category } = game;
            //         if (!init[category]) {
            //             return { ...init, [category]: [{ ...game }] };
            //         }

            //         return { ...init, [category]: [...init[category], { ...game }] };
            //     }, {});
            // });
            const response = {
                data: [
                    {
                        type: null,
                        kind: 1,
                        alias: '捕魚',
                        vendor: 'bbin',
                        category: 'fish',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '捕魚',
                        vendor: 'bbin',
                        category: 'fish',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '捕魚',
                        vendor: 'bbin',
                        category: 'fish',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '捕魚',
                        vendor: 'bbin',
                        category: 'fish',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '牛牛',
                        vendor: 'bbin',
                        category: 'bubu',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '牛牛',
                        vendor: 'bbin',
                        category: 'bubu',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '牛牛',
                        vendor: 'bbin',
                        category: 'bubu',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '牛牛',
                        vendor: 'bbin',
                        category: 'bubu',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '麻將',
                        vendor: 'bbin',
                        category: 'mahjong',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '麻將',
                        vendor: 'bbin',
                        category: 'mahjong',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '麻將',
                        vendor: 'bbin',
                        category: 'mahjong',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '麻將',
                        vendor: 'bbin',
                        category: 'mahjong',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '電子',
                        vendor: 'bbin',
                        category: 'slots',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '電子',
                        vendor: 'bbin',
                        category: 'slots',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '電子',
                        vendor: 'bbin',
                        category: 'slots',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '電子',
                        vendor: 'bbin',
                        category: 'slots',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '棋牌',
                        vendor: 'bbin',
                        category: 'card',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '棋牌',
                        vendor: 'bbin',
                        category: 'card',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '棋牌',
                        vendor: 'bbin',
                        category: 'card',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '棋牌',
                        vendor: 'bbin',
                        category: 'card',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '電競',
                        vendor: 'bbin',
                        category: 'e-sports',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '電競',
                        vendor: 'bbin',
                        category: 'e-sports',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '電競',
                        vendor: 'bbin',
                        category: 'e-sports',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '電競',
                        vendor: 'bbin',
                        category: 'e-sports',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '真人',
                        vendor: 'bbin',
                        category: 'live',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '真人',
                        vendor: 'bbin',
                        category: 'live',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '真人',
                        vendor: 'bbin',
                        category: 'live',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '真人',
                        vendor: 'bbin',
                        category: 'live',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '彩票',
                        vendor: 'bbin',
                        category: 'lottery',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '彩票',
                        vendor: 'bbin',
                        category: 'lottery',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '彩票',
                        vendor: 'bbin',
                        category: 'lottery',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '彩票',
                        vendor: 'bbin',
                        category: 'lottery',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '體育',
                        vendor: 'bbin',
                        category: 'sport',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '體育',
                        vendor: 'bbin',
                        category: 'sport',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '體育',
                        vendor: 'bbin',
                        category: 'sport',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '體育',
                        vendor: 'bbin',
                        category: 'sport',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '代理',
                        vendor: 'bbin',
                        category: 'agents',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '代理',
                        vendor: 'bbin',
                        category: 'agents',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '代理',
                        vendor: 'bbin',
                        category: 'agents',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '代理',
                        vendor: 'bbin',
                        category: 'agents',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '直播',
                        vendor: 'bbin',
                        category: 'live-stream',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '直播',
                        vendor: 'bbin',
                        category: 'live-stream',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '直播',
                        vendor: 'bbin',
                        category: 'live-stream',
                        code: null,
                        url: null
                    },
                    {
                        type: null,
                        kind: 1,
                        alias: '直播',
                        vendor: 'bbin',
                        category: 'live-stream',
                        code: null,
                        url: null
                    }
                ],
                status: 'ok',
                errorCode: null,
                errorMessage: null,
                reponseTime: '2020-04-13T07:47:54.2109853+00:00',
                version: '1.0.0.0'
            };

            this.allGame = response.data.reduce((init, game) => {
                const { category } = game;
                if (!init[category]) {
                    return { ...init, [category]: [{ ...game }] };
                }

                return { ...init, [category]: [...init[category], { ...game }] };
            }, {});
            this.isReceive = true;
        }
    }
};
</script>

<style lang="scss" scoped>
$border-radius: 10px;
$main-color: #b1987f;
$main-linear-background: linear-gradient(#bd9d7d, #f9ddbd);
$animation-time: 1s;

.content-cells {
    position: relative;
    font-size: 14px;

    .desc {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 10px 0px;
        color: #be9e7f;

        .more {
            border-radius: $border-radius;
            font-size: 14px;
            padding: 2.5px 17.5px;
            color: white;
            background: $main-linear-background;
        }
    }

    .content {
        position: relative;
        width: 100%;
        height: auto;
    }

    .content-cell-block {
        position: relative;
        display: inline-block;
        width: 49%;
        height: 120px;
        margin: 0 1px;

        img {
            width: 100%;
            height: 100%;
            border-radius: $border-radius;
        }

        span {
            position: absolute;
            top: 10px;
            left: 10px;
            color: #FFF;
            font-size: 12px;
        }

        .video-text {
            position: absolute;
            width: 100%;
            height: 40px;
            line-height: 20px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            bottom: 0;
            background: white;
            opacity: 0.75;
            border-bottom-right-radius: $border-radius;
            border-bottom-left-radius: $border-radius;
        }
    }
}
</style>
