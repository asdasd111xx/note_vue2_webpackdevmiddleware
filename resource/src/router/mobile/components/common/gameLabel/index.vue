<template>
    <div :class="$style['label-wrap-bg']">
        <div :class="$style['label-block']">
            <swiper
                v-if="isLabelReceive && labelData.length !== 0"
                ref="typeSwiper"
                :options="{ slidesPerView: 'auto' }"
                class="clearfix"
            >
                <swiper-slide
                    v-for="info in labelData"
                    :key="`nav-${info.label}`"
                    :style="{ width: 100 / labelData.length > 18 ? `${100 / labelData.length}%` : '18%' }"
                    :class="[
                        $style['nav-item'],
                        { [$style['is-current']]: label === info.label.toString() }
                    ]"
                >
                    <button :disabled="label === info.label" @click="changeGameLabel(info.label)">{{ info.name }}</button>
                </swiper-slide>
            </swiper>
            <span v-else-if="!isLabelReceive && labelData.length === 0" :class="['ui', 'active', 'inline', 'small', 'loader', 'inverted', $style['loader']]" />
        </div>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';

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
        swiper,
        swiperSlide
    },
    props: {
        theme: {
            type: String,
            required: true
        },
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
    },
    computed: {
        $style() {
            return this[`$style_${this.theme}`] || this.$style_theme1Gold;
        }
    }
};
</script>

<style lang="scss" src="./css/theme1Gold.module.scss" module="$style_theme1Gold"></style>
<style lang="scss" src="./css/theme1Orange.module.scss" module="$style_theme1Orange"></style>
<style lang="scss" src="./css/theme3.module.scss" module="$style_theme3"></style>
<style lang="scss" src="./css/themeMiller.module.scss" module="$style_themeMiller"></style>
<style lang="scss" src="./css/basicMobile.module.scss" module="$style_basicMobile"></style>
<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
