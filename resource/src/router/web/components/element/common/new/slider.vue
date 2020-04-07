<template>
    <!-- swiper -->
    <swiper
        v-if="type === 'swiper'"
        :slider-data="sliderData"
        :slider-options="options"
        :custom-panel="customPanel"
        :is-update="isUpdate"
    >
        <template slot="swiper" scope="{ data }">
            <slot :data="data" name="swiper" />
        </template>
    </swiper>
    <!-- Cloud9Carousel -->
    <cloud9-carousel
        v-else-if="type === 'cloud9Carousel'"
        :element="element"
        :slider-data="sliderData"
    />
</template>

<script>
import swiper from './slider/swiper';
import cloud9Carousel from './slider/cloud9Carousel';

/**
 * 共用輪播元件主要外框
 * @module element/common/new/slider
 * @param {String} type - 輪播元件名稱
 * @param {Object} element - 模塊資料
 * @param {Array} sliderData - 輪播資料
 * @param {Object} options - 輪播設定
 */
export default {
    components: {
        swiper,
        cloud9Carousel
    },
    props: {
        type: {
            type: String,
            required: true
        },
        element: {
            type: Object,
            default: null
        },
        options: {
            type: Object,
            default: () => ({})
        },
        sliderData: {
            type: Array,
            required: true
        },
        customPanel: {
            type: Object,
            default: () => ({})
        },
        isUpdate: {
            type: Boolean,
            default: false
        }
    }
};
</script>
