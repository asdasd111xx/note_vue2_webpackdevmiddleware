<template>
    <swiper
        :options="swiperOptionThumbs"
        class="swiper gellery-hall-thumbs"
    >
        <swiper-slide
            v-for="(tab, index) in hallTab"
            :key="`hallThumb-${index}`"
            class="hall-thumb-cell"
        >
            <div>
                <img
                    v-if="selectedIndex === index"
                    :src="$getCdnPath(`/static/image/_new/platform/icon/${tab.category}/icon_${tab.category}_h.png`)"
                    alt="thumb"
                />
                <img
                    v-else
                    :src="$getCdnPath(`/static/image/_new/platform/icon/${tab.category}/icon_${tab.category}_n.png`)"
                    alt="thumb"
                />
                <div :class="['thumb-title', { active: selectedIndex === index }]">{{ tab.title }}</div>
            </div>
        </swiper-slide>
    </swiper>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

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
        selectedIndex: {
            type: Number,
            required: true
        },
        hallTabHasCreated: {
            type: Boolean,
            required: true
        }
    },
    computed: {
        swiperOptionThumbs() {
            return {
                loop: true,
                loopedSlides: this.hallTab.length, // looped slides should be the same
                direction: 'vertical',
                height: 63,
                freeMode: true,
                mousewheel: true,
                touchRatio: 1,
                slideToClickedSlide: true,
                on: {
                    init: () => {
                        this.$nextTick(() => {
                            this.$emit('update:hallTabHasCreated', true);
                        });
                    }
                }
            };
        }
    }
};
</script>

<style lang="scss" scoped>
.gellery-hall-thumbs {
    float: left;
    width: 63px;
}

.hall-thumb-cell {
    img {
        display: block;
        width: 100%;
        height: 100%;
    }
    .thumb-title {
        position: absolute;
        top: 32px;
        width: 100%;
        text-align: center;
        font-size: 12px;
        color: #a6a9b2;

        &.active {
            color: white;
        }
    }
}
</style>
