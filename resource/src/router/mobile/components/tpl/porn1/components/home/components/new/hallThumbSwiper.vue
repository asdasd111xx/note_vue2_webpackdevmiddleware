<template>
    <swiper
        class="swiper gellery-hall-thumbs"
        :options="swiperOptionThumbs"
        :style="divHeight"
    >
        <swiper-slide
            class="hall-thumb-cell"
            v-for="(tab, index) in hallTab"
            :key="`hallThumb-${index}`"
        >
            <div>
                <img
                    v-if="selectedIndex === index"
                    :src="$getCdnPath(tab.hImgSrc)"
                    alt="thumb"
                />
                <img v-else :src="$getCdnPath(tab.nImgSrc)" alt="thumb" />
                <div
                    :class="[
                        'thumb-title',
                        { active: selectedIndex === index }
                    ]"
                >
                    {{ tab.title }}
                </div>
            </div>
        </swiper-slide>
    </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";

export default {
    components: {
        Swiper,
        SwiperSlide
    },
    props: {
        divHeight: {
            type: Object,
            required: true
        },
        selectedIndex: {
            type: Number,
            required: true
        },
        hallTabHasCreated: {
            type: Boolean,
            required: true
        }
    },
    data() {
        return {
            currentIndex: 0,
            swiperOptionThumbs: {
                loop: true,
                // // loopAdditionalSlides: 6,
                loopedSlides: 12, // looped slides should be the same
                direction: "vertical",
                height: 68,
                freeMode: true,
                mousewheel: true,
                touchRatio: 1,
                slideToClickedSlide: true,
                on: {
                    init: () => {
                        this.$nextTick(() => {
                            this.$emit("update:hallTabHasCreated", true);
                        });
                    }
                }
            }
        };
    },
    computed: {
        hallTab() {
            let hallTab = [
                {
                    title: "影片",
                    category: "tv"
                },
                {
                    title: "捕鱼",
                    category: "fish"
                },
                {
                    title: "牛牛",
                    category: "bubu"
                },
                {
                    title: "麻将",
                    category: "mahjong"
                },
                {
                    title: "电子",
                    category: "slot"
                },
                {
                    title: "棋牌",
                    category: "card"
                },
                {
                    title: "电竞",
                    category: "esports"
                },
                {
                    title: "真人",
                    category: "livecasino"
                },
                {
                    title: "彩票",
                    category: "lottery"
                },
                {
                    title: "体育",
                    category: "sports"
                },
                {
                    title: "代理",
                    category: "agents"
                },
                {
                    title: "直播",
                    category: "live"
                }
            ];

            hallTab.forEach(item => {
                item.nImgSrc = `/static/image/_new/platform/icon/${item.category}/icon_${item.category}_n.png`;
                item.hImgSrc = `/static/image/_new/platform/icon/${item.category}/icon_${item.category}_h.png`;
            });

            return hallTab;
        }
    }
};
</script>

<style lang="scss" scoped>
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
</style>
