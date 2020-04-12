<template>
    <div class="home-content-container" :style="divHeight">
        <swiper
            class="swiper gellery-hall-thumbs"
            :options="swiperOptionThumbs"
            ref="swiperThumbs"
            :style="divHeight"
        >
            <swiper-slide
                class="hall-thumb-cell"
                v-for="(item, index) in hallTab"
                :key="'hallThumb-' + index"
            >
                <div @click="onClickHallSlide(index)">
                    <img
                        v-if="currentHallIndex === index"
                        :src="$getCdnPath(item.hImgSrc)"
                        alt="thumb"
                    />
                    <img v-else :src="$getCdnPath(item.nImgSrc)" alt="thumb" />
                    <div
                        :class="[
                            'thumb-title',
                            { active: currentHallIndex === index }
                        ]"
                    >
                        {{ item.title }}
                    </div>
                </div>
            </swiper-slide>
        </swiper>

        <func-Block :isVideoPage="isVideoPage" :video-tab.sync="videoTab" />

        <swiper
            class="swiper gellery-content"
            :options="swiperOptionContent"
            ref="swiperContent"
            :style="contentDivHeight"
        >
            <swiper-slide>
                <div
                    class="content-cells"
                    v-for="(item, index) in 2"
                    :key="index"
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
                            <span>热门推荐</span>
                        </div>
                        <div class="more">更多</div>
                    </div>
                    <div class="content">
                        <div
                            class="content-cell-block"
                            v-for="(item, index) in 4"
                            :key="index"
                        >
                            <img
                                :src="
                                    $getCdnPath(
                                        '/static/image/_new/platform/card/slot/short/agcasino_short.png'
                                    )
                                "
                                alt=""
                            />
                        </div>
                    </div>
                </div>
            </swiper-slide>
            <swiper-slide v-for="(item, index) in 11" :key="index">
                <div class="content-cells">
                    <div class="content">
                        <div
                            class="content-cell-block"
                            v-for="(item, index) in 4"
                            :key="index"
                        >
                            <img
                                :src="
                                    $getCdnPath(
                                        '/static/image/_new/platform/card/slot/short/agcasino_short.png'
                                    )
                                "
                                alt=""
                            />
                        </div>
                    </div>
                </div>
            </swiper-slide>
        </swiper>
    </div>
</template>

<script>
import { swiper, swiperSlide } from "vue-awesome-swiper";
import funcBlock from "./funcBlock";

export default {
    name: "homeContent",
    components: {
        swiper,
        swiperSlide,
        funcBlock
    },
    data() {
        return {
            currentHallIndex: 0,
            isVideoPage: true,
            video: { id: 0, title: "" },
            swiperOptionContent: {
                // loop: true,
                // loopAdditionalSlides: 6,
                // loopedSlides: 6, // looped slides should be the same
                spaceBetween: 10,
                direction: "vertical",
                freeMode: true,
                mousewheel: true,
                // 自適應內容的高度: autoHeight + slidesPerView 必備
                autoHeight: true,
                slidesPerView: "auto"
            },
            swiperOptionThumbs: {
                // loop: true,
                // loopAdditionalSlides: 6,
                // loopedSlides: 6, // looped slides should be the same
                direction: "vertical",
                height: 68,
                freeMode: true,
                mousewheel: true,
                touchRatio: 1,
                slideToClickedSlide: true
            }
        };
    },
    mounted() {
        this.$nextTick(() => {
            const swiperContent = this.swiperContent;
            const swiperThumbs = this.swiperThumbs;
            swiperContent.controller.control = swiperThumbs;
            // // 初始設定第一頁
            swiperContent.slideToLoop(0, 0, false);
            swiperThumbs.slideToLoop(0, 0, false);
            // // swiperThumbs.on("click", () => {
            // //     let index = swiperThumbs.realIndex;
            // //     swiperContent.slideToLoop(index, 500, false);
            // // });
            // // slideChange：在当前Slide切换到另一个Slide时执行(activeIndex发生改变)，一般是在点击控制组件、释放滑动的时间点
            swiperContent.on("slideChange", () => {
                let index = swiperThumbs.realIndex;
                this.currentHallIndex = index;
                this.isVideoPage = index === 0 ? true : false;
            });
        });
    },
    methods: {
        onClickHallSlide(index) {
            this.currentHallIndex = index;
        }
    },
    computed: {
        contentDivHeight() {
            // offsetHeight - n , n 應該要是 offsetTop 的值，但目前有問題
            return {
                height: document.body.offsetHeight - 340 + "px"
            };
        },
        divHeight() {
            // offsetHeight - n , n 應該要是 offsetTop 的值，但目前有問題
            return {
                height: document.body.offsetHeight - 280 + "px"
            };
        },
        hallTab() {
            let hallTab = [
                {
                    title: "影片",
                    alias: "tv"
                },
                {
                    title: "捕鱼",
                    alias: "fish"
                },
                {
                    title: "牛牛",
                    alias: "bubu"
                },
                {
                    title: "麻将",
                    alias: "mahjong"
                },
                {
                    title: "电子",
                    alias: "slot"
                },
                {
                    title: "棋牌",
                    alias: "card"
                },
                {
                    title: "电竞",
                    alias: "esports"
                },
                {
                    title: "真人",
                    alias: "livecasino"
                },
                {
                    title: "彩票",
                    alias: "lottery"
                },
                {
                    title: "体育",
                    alias: "sports"
                },
                {
                    title: "代理",
                    alias: "agents"
                },
                {
                    title: "直播",
                    alias: "live"
                }
            ];

            hallTab.forEach(item => {
                item.nImgSrc = `/static/image/_new/platform/icon/${item.alias}/icon_${item.alias}_n.png`;
                item.hImgSrc = `/static/image/_new/platform/icon/${item.alias}/icon_${item.alias}_h.png`;
            });

            return hallTab;
        },
        videoTab: {
            get() {
                return this.video;
            },
            set(value) {
                this.video = { ...value };
            }
        },
        swiperContent() {
            return this.$refs.swiperContent.swiper;
        },
        swiperThumbs() {
            return this.$refs.swiperThumbs.swiper;
        }
    }
};
</script>

<style lang="scss" scoped>
$border-radius: 5px;
$main-color: #b1987f;
$main-linear-background: linear-gradient(#bd9d7d, #f9ddbd);
$animation-time: 1s;

.home-content-container {
    position: relative;
    margin: 0px 17px;
}

.gellery-hall-thumbs {
    position: absolute;
    width: 68px;
    height: 68px;
    top: 0;
    left: 0;
    margin: 0;
}

.hall-thumb-cell {
    img {
        width: 100%;
        height: 100%;
    }
    .thumb-title {
        position: absolute;
        width: 100%;
        top: 37.5px;
        text-align: center;
        font-size: 12px;
        color: #a6a9b2;

        &.active {
            color: white;
        }
    }
}

.gellery-content {
    position: relative;
    width: calc(100% - 70px);
    left: 70px;
    margin: 0;
}

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
        display: inline-block;
        width: 49%;
        height: 120px;
        margin: 0 1px;

        img {
            width: 100%;
            height: 100%;
        }
    }
}
</style>
