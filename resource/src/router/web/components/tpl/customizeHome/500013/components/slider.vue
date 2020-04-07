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
                    <div :class="[$style.service, $style.btn]" @click="actionChangePage({ page: 'service', type: 'static'})" />
                    <div :class="[$style.download, $style.btn]" @click="actionChangePage({ page: 'mobileBet', type: 'static'})" />
                    <div :class="[$style.contact, $style.btn]" @click="actionChangePage({ page: 'service', type: 'static'})" />
                </div>
            </div>
            <div :class="$style['page-bottom']">
                <img
                    v-for="num in 4"
                    :key="`img-${num}`"
                    :class="$style['img-item']"
                    :src="`/static/image/tpl/customizeHome/500013/body/first_featrues_0${num}.png`"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { mapActions } from 'vuex';
import navData from '@/lib/nav_data';

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
                    image: '/static/image/tpl/customizeHome/500013/body/slider01.jpg',
                    path: 's128'
                },
                {
                    image: '/static/image/tpl/customizeHome/500013/body/slider02.jpg',
                    path: 'promotion'
                },
                {
                    image: '/static/image/tpl/customizeHome/500013/body/slider03.jpg',
                    path: 'promotion'
                },
                {
                    image: '/static/image/tpl/customizeHome/500013/body/slider04.jpg',
                    path: 'promotion'
                }
            ],
            navData: {}
        };
    },
    computed: {
        promotionData() {
            let data;
            this.navData.navArr.forEach((nav) => {
                if (nav.navPage === 'promotion') {
                    data = nav;
                }
            });
            return data;
        }
    },
    created() {
        this.navData = navData();
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        onClick({ path }) {
            if (!path) {
                return;
            }
            // 鬥雞
            if (path === 's128') {
                this.actionChangePage({ page: path, type: 'games' });
                return;
            }
            // 優小秘
            if (path === 'promotion') {
                this.changePage(this.promotionData);
                return;
            }

            this.$router.push(path);
        },
        changePage(pageInfo) {
            if (!this.isBackEnd) {
                this.actionChangePage({
                    page: pageInfo.navPage,
                    type: pageInfo.navType,
                    config: {
                        linkItem: pageInfo.linkItem
                    }
                });
            }
        }
    }
};
</script>

<style lang="scss" src="../css/slider.module.scss" module></style>
