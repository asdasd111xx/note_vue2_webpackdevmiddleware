<template>
    <swiper
        v-if="avList.length && allGame.length"
        :options="swiperOptionContent"
        :style="contentStyle"
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
                        <img :src="$getCdnPath('/static/image/_new/common/icon_item.png')" />
                        <span>{{ info.name }}</span>
                    </div>
                    <a :href="`/mobile/videoList?tagId=${videoTab.id}&sortId=${info.id || 0}`">{{ $text("S_MORE", "更多") }}</a>
                </div>
                <div class="content clearfix">
                    <a
                        v-for="(item, i) in info.list"
                        :key="`av-list-${i}`"
                        :href="`/mobile/videoPlay/${item.id}`"
                        class="content-cell-block video-wrap"
                    >
                        <img :src="item.image" />
                        <div class="video-text">{{ item.title }}</div>
                    </a>
                </div>
            </div>
        </swiper-slide>

        <swiper-slide v-for="(info, index) in allGame" :key="`game-${index}`">
            <div class="content-cells">
                <div class="content clearfix">
                    <div
                        v-for="(item, i) in info.vendors"
                        :key="`game-list-${i}`"
                        :class="['content-cell-block', { 'is-full': item.imageType > 0 }]"
                        @click="onClick(item)"
                    >
                        <img :src="item.image" alt="img" />
                        <span v-if="!['D', 'R'].includes(item.type) && item.name">{{ item.name }}</span>
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
import openGame from '@/lib/open_game';

export default {
    components: {
        Swiper,
        SwiperSlide
    },
    props: {
        contentStyle: {
            type: Object,
            required: true
        },
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
        },
        allGame: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
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
            videoSort: []
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus',
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
            const recommand = this.videoTab.id ? [] : [...this.videoRecommand];

            return this.videoSort.reduce((init, sort) => {
                const data = find(this.videoList, (info) => info.id === sort.id);

                if (!data) {
                    return init;
                }

                return [...init, { ...data }];
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
    },
    methods: {
        getSort() {
            axios({
                method: 'get',
                url: `${API_PORN1_DOMAIN}/api/v1/video/sort`,
                timeout: 30000,
                headers: {
                    Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                    Version: 1
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
                    Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                    Version: 1
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
                    Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                    Version: 1
                }
            }).then((response) => {
                if (response.status !== 200) {
                    return;
                }

                this.videoList = [...response.data.result];
            });
        },
        onClick(game) {
            // Game Type
            // L => 遊戲大廳
            // G => 遊戲
            // BL => 美女直播
            // SL => 體育直播
            // D => 代理
            // T => 敬请期待
            if (game.type === 'D') {
                return;
            }

            if ([3, 5, 6].includes(game.kind) && game.code === '') {
                const trans = { 3: 'casino', 5: 'card', 6: 'mahjong' };
                this.$router.push(`/mobile/${trans[game.kind]}`);
                return;
            }

            if (!this.loginStatus) {
                this.$router.push('/mobile/login');
                return;
            }

            if (game.type === 'T') {
                alert('正在上线 敬请期待！');
                return;
            }

            if (['BL', 'SL'].includes(game.type)) {
                this.$router.push('/mobile/liveStream');
                return;
            }

            openGame({ kind: game.kind, vendor: game.vendor, code: game.code });
        }
    }
};
</script>

<style lang="scss" scoped>
$border-radius: 7px;
$main-color: #b1987f;
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

        .title {
            vertical-align: middle;

            > img,
            > span {
                vertical-align: middle;
            }
        }

        > a {
            display: inline-block;
            width: 63px;
            height: 24px;
            line-height: 24px;
            border-radius: 3px;
            background: linear-gradient(to left, #BD9D7D, #F9DDBD);
            font-size: 14px;
            color: #FFF;
            text-align: center;
            vertical-align: middle;
            outline: none;
        }
    }

    .content {
        position: relative;
        width: 100%;
        height: auto;
    }

    .content-cell-block {
        position: relative;
        float: left;
        width: 50%;
        padding: 0 2px 3px;
        box-sizing: border-box;

        &.video-wrap {
            height: 117px;

            img {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                left: 0;
                width: 100%;
                min-height: 100%;
                margin: auto;
                padding: 0 2px 3px;
            }
        }

        img {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: $border-radius;
        }

        span {
            position: absolute;
            top: 2px;
            left: 22px;
            color: #9ca3bf;
            font-weight: 700;
            font-size: 12px;
        }

        .video-text {
            overflow: hidden;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            line-height: 20px;
            border-radius: 0 0 7px 7px;
            background-color: #fff;
            color: #3d3d3d;
            font-size: 12px;
            text-overflow: ellipsis;
            white-space: nowrap;
            opacity: 0.8;
        }

        &.is-full {
            width: 100%;
        }
    }
}
</style>
