<template>
    <div ref="tab-box" :class="$style['tab-box']">
        <div :class="[$style.box, { [$style.fixed] : isFixed}]">
            <swiper :options="{ slidesPerView: 'auto', slideClass: $style.tab }">
                <swiper-slide>
                    <div
                        :class="[$style.wrap, { [$style.active]: videoTab.id === 0 }]"
                        @click="$emit('update:videoTab', { id: 0, title: '' })"
                    >
                        <span>{{ $text('S_ALL', '全部') }}</span>
                        <div />
                    </div>
                </swiper-slide>
                <swiper-slide v-for="tab in tabs" :key="tab.id">
                    <div
                        :class="[$style.wrap, { [$style.active]: tab.id === videoTab.id }]"
                        @click="$emit('update:videoTab', tab)"
                    >
                        <span>{{ tab.title }}</span>
                        <div />
                    </div>
                </swiper-slide>
            </swiper>
            <img :src="$getCdnPath('/static/image/mobile/tpl/porn1/video/arrow.png')" />
        </div>
    </div>
</template>

<script>
/* global $ */
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import axios from 'axios';
import { API_PORN1_DOMAIN } from '@/config/api';

export default {
    components: {
        swiper,
        swiperSlide
    },
    props: {
        videoTab: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            tabs: [],
            isFixed: false
        };
    },
    created() {
        axios({
            method: 'get',
            url: `${API_PORN1_DOMAIN}/api/v1/video/tag`,
            timeout: 30000,
            headers: {
                Bundleid: 'chungyo.foxyporn.prod.enterprise.web',
                Version: 1
                // 本機開發時會遇到 CORS 的問題，把Bundleid及Version註解，並打開下面註解即可
                // 'Content-Type': 'application/x-www-form-urlencoded',
                // origin: 'http://127.0.0.1'
            }
        }).then((response) => {
            if (response.status !== 200) {
                return;
            }

            this.tabs = [...response.data.result];
        });
    },
    mounted() {
        $(window).scroll(this.onScroll);
    },
    beforeDestroy() {
        $(window).off('scroll', this.onScroll);
    },
    methods: {
        onScroll() {
            this.isFixed = $(window).scrollTop() > $(this.$refs['tab-box']).offset().top - 43;
        }
    }
};
</script>

<style lang="scss" module>
@import '~@/css/variable.scss';

.tab-box {
    height: 44px;
}

.box {
    position: relative;
    height: 44px;
    background: #0E1213;

    &.fixed {
        width: 100%;
        position: fixed;
        top: 43px;
        left: 0;
        z-index: 2;
    }

    img {
        display: block;
        width: 10px;
        height: 7px;
        position: absolute;
        right: 3px;
        top: 50%;
        transform: translateY(-50%) rotate(90deg);
    }
}
.tab {
    display: inline-block;
    margin: 0 15px;
}

.wrap {
    position: relative;
    line-height: 44px;
    color: #BCBDC1;
    font-size: 15px;
    text-align: center;
    white-space: nowrap;

    &.active {
        color: #FACE15;

        > div {
            display: block;
        }
    }

    > div {
        display: none;
        position: absolute;
        right: 25%;
        bottom: 2px;
        left: 25%;
        height: 2px;
        border-radius: 1px;
        background-color: #FACE15;
    }
}


@media screen and (min-width: $phone) {
    .wrap {
        font-size: 16px;
    }
}

@media screen and (min-width: $pad) {
    .wrap {
        font-size: 18px;
    }
}
</style>
