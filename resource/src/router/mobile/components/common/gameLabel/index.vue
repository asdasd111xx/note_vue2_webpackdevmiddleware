<template>
    <div :class="$style['label-wrap-bg']">
        <div :class="$style['label-block']">
            <Swiper
                v-if="isLabelReceive && labelData.length !== 0"
                ref="typeSwiper"
                :options="{ slidesPerView: 'auto' }"
                class="clearfix"
            >
                <Swiper-slide
                    v-for="info in labelData"
                    :key="`nav-${info.label}`"
                    :class="$style['nav-item']"
                >
                    <button
                        :disabled="label === info.label"
                        :class="label === info.label.toString() ? $style['is-current'] : ''"
                        @click="changeGameLabel(info.label)"
                    >
                        {{ info.name }}
                    </button>
                </Swiper-slide>
            </swiper>
            <span v-else-if="!isLabelReceive && labelData.length === 0" :class="['ui', 'active', 'inline', 'small', 'loader', 'inverted', $style['loader']]" />
        </div>
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from 'vue-awesome-swiper';

/**
 * 共用元件 - 手機網頁版 遊戲大廳使用分類選單
 * @param {String} [theme=1] - 樣式; 值：1
 * @param {Boolean} [isLabelReceive=false] - API是否取得分類資料
 * @param {String} [label] - 當前分類
 * @param {Array} [labelData] - 分類資料
 * @param {Function} [changeGameLabel] - 切換分類觸發事件
 */
export default {
    components: {
        Swiper,
        SwiperSlide
    },
    props: {
        isLabelReceive: {
            type: Boolean,
            default: false
        },
        label: {
            type: String,
            required: true
        },
        labelData: {
            type: Array,
            required: true
        },
        changeGameLabel: {
            type: Function,
            required: true
        }
    }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module></style>
