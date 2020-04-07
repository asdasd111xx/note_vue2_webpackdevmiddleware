<template>
    <swiper ref="swiper-wrap" :options="options">
        <!-- 輪播內容 -->
        <swiper-slide v-for="(data, index) in sliderData" :key="index">
            <slot :data="data" name="swiper" />
        </swiper-slide>

        <!-- 左右箭頭 -->
        <template v-if="options.navigation.prevEl && options.navigation.nextEl && !customPanel.navigation">
            <div slot="button-prev" class="swiper-button swiper-button-prev" />
            <div slot="button-next" class="swiper-button swiper-button-next" />
        </template>

        <!-- 分頁器 -->
        <template v-if="options.pagination.el && !customPanel.pagination">
            <div slot="pagination" class="swiper-pagination" />
        </template>

        <!-- 滾動軸 -->
        <template v-if="options.scrollbar.el">
            <div slot="scrollbar" class="swiper-scrollbar" />
        </template>
    </swiper>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';

/**
 * 輪播元件 swiper
 * @module element/common/new/slider/swiper
 * @param {Array} sliderData - 輪播資料
 * @param {Object} sliderOptions - 輪播設定
 */
export default {
    components: {
        swiper,
        swiperSlide
    },
    props: {
        sliderData: {
            type: Array,
            required: true
        },
        sliderOptions: {
            type: Object,
            default: () => ({})
        },
        customPanel: {
            type: Object,
            default: () => ({})
        },
        isUpdate: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            options: {
                // 自動播放
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false
                },
                // 切換方向
                direction: 'horizontal',
                // 切換速度
                speed: 1000,
                // 循環模式
                loop: true,
                // 切換效果
                effect: 'slide',
                // Fade 效果參數
                fadeEffect: {
                    crossFade: true
                },
                // 前後控制鈕
                navigation: {
                    prevEl: '.swiper-button-prev',
                    nextEl: '.swiper-button-next'
                },
                // 分頁器
                pagination: {
                    el: null
                },
                // 滾動條
                scrollbar: {
                    el: null
                },
                // 輪播圖切換時無法進行滑動
                preventInteractionOnTransition: true,
                ...this.sliderOptions
            }
        };
    },
    watch: {
        isUpdate() {
            if (!this.isUpdate) {
                return;
            }

            this.$nextTick(() => {
                if (this.options.loop) {
                    this.$refs['swiper-wrap'].swiper.loopDestroy();
                    this.$refs['swiper-wrap'].swiper.loopCreate();
                }
            });
        }
    }
};
</script>
