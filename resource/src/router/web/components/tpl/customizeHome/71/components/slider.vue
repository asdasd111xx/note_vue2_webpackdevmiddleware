<template>
    <div :class="$style['page-wrap']">
        <div :class="$style['page-container']">
            <div :class="$style['page-top']">
                <swiper :options="swiperOptionTop">
                    <swiper-slide v-for="(list, index) in swipperList" :key="index">
                        <img :src="$getCdnPath(list.image)" @click="onClick(list)" />
                    </swiper-slide>
                </swiper>
                <div :class="$style['btn-wrap']">
                    <div :class="[$style.service, $style.btn]" @click="actionChangePage({ page: 'service', type: 'static'})"/>
                    <div :class="[$style.download, $style.btn]" @click="actionChangePage({ page: 'mobileBet', type: 'static'})"/>
                    <div :class="[$style.contact, $style.btn]" @click="actionChangePage({ page: 'service', type: 'static'})"/>
                </div>
            </div>
            <div :class="$style['page-bottom']">
                <img
                    v-for="num in 4"
                    :key="`img-${num}`"
                    :class="$style['img-item']"
                    :src="`/static/image/tpl/customizeHome/71/body/first_featrues_0${num}.png`"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { mapActions } from 'vuex';

export default {
    components: {
        swiper,
        swiperSlide
    },
    data() {
        return {
            swiperOptionTop: {
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false
                },
                loop: true,
                speed: 1000,
                navigation: {
                    prevEl: '.swiper-button-prev',
                    nextEl: '.swiper-button-next'
                },
                preventInteractionOnTransition: true
            },
            swipperList: [
                {
                    image: '/static/image/tpl/customizeHome/71/body/slider01.png'
                },
                {
                    image: '/static/image/tpl/customizeHome/71/body/slider02.png'
                },
                {
                    image: '/static/image/tpl/customizeHome/71/body/slider03.png'
                }
            ]
        };
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ])
    }
};
</script>

<style lang="scss" src="../css/slider.module.scss" module></style>
