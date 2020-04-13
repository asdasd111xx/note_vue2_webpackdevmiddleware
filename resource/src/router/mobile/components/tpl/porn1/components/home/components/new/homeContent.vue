<template>
    <div class="home-content-container" :style="divHeight">
        <hall-thumb-swiper
            ref="swiperThumbs"
            :hallTabHasCreated.sync="hallTabHasCreated"
            :selectedIndex.sync="selectedIndex"
            :divHeight="divHeight"
        />

        <func-Block :isVideoPage="isVideoPage" :video-tab.sync="videoTab" />

        <content-thumb-swiper
            ref="swiperContent"
            v-if="hallTabHasCreated"
            :contentDivHeight="contentDivHeight"
            :isVideoPage.sync="isVideoPage"
            :selectedIndex.sync="selectedIndex"
            :videoTab="videoTab"
            :hall-thumb-swiper="$refs.swiperThumbs.$swiper"
        />
    </div>
</template>

<script>
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import funcBlock from "./funcBlock";
import hallThumbSwiper from "./hallThumbSwiper";
import contentThumbSwiper from "./contentThumbSwiper";

export default {
    name: "homeContent",
    components: {
        Swiper,
        SwiperSlide,
        funcBlock,
        hallThumbSwiper,
        contentThumbSwiper
    },
    data() {
        return {
            hallTabHasCreated: false,
            selectedIndex: 0,
            isVideoPage: true,
            video: { id: 0, title: "" }
        };
    },
    computed: {
        contentDivHeight() {
            // offsetHeight - n , n 應該要是 offsetTop 的值，但目前有問題(先寫死的)
            return {
                height: document.body.offsetHeight - 340 + "px"
            };
        },
        divHeight() {
            // offsetHeight - n , n 應該要是 offsetTop 的值，但目前有問題(先寫死的)
            return {
                height: document.body.offsetHeight - 280 + "px"
            };
        },

        videoTab: {
            get() {
                return this.video;
            },
            set(value) {
                this.video = { ...value };
            }
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
</style>
