<template>
    <div :class="[$style['content-wrap'],'theme-theme3']">
        <div :class="$style['swiper-wrap']">
            <swiper ref="swiperTop" :options="swiperOptionTop">
                <swiper-slide v-for="(list, index) in swipperList" :key="index">
                    <img :src="$getCdnPath(list.image)" @click="onClick(list)" />
                </swiper-slide>
                <div slot="button-prev" class="swiper-button swiper-button-prev" />
                <div slot="button-next" class="swiper-button swiper-button-next" />
            </swiper>
            <div :class="$style['pagination-wrap']">
                <div :class="$style['pagination-container']">
                    <div
                        v-for="num in 6"
                        :key="num"
                        :class="[$style['pagination-btn'], {[$style.current]: (num - 1) === realIndex}]"
                        @click="onSwiperClick(num)"
                    >
                        <img :src="$getCdnPath(`/static/image/tpl/customizeHome/48/image${num}.jpg`)" />
                    </div>
                </div>
            </div>
        </div>
        <div :class="$style['news-wrap']">
            <div :class="$style['news-title']">
                {{ $text('S_YABO_ANNOUNCEMENT', '威尼斯人贵宾厅公告') }}：
            </div>
            <ele-news :class="$style['new-wrap']" :theme="'1'" />
            <div :class="$style.service">
                <img :src="$getCdnPath('/static/image/tpl/customizeHome/48/icon_service.png')" />
                <span @click="onService">{{ $text('S_CUSTOMER_SERVICE_ONLINE', '在线客服') }}</span>
            </div>
        </div>
        <div :class="$style['middel-wrap']">
            <div :class="$style['middel-container']">
                <mobile />
            </div>
            <game-card />
            <service-content />
        </div>
        <div v-if="popType === 'note'" class="note-content">
            <note :position="popData" />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import { API_QRCODE } from '@/config/api';
import ajax from '@/lib/ajax';
import eleNews from '../../../common/news';
import mobile from './components/mobile';
import gameCard from './components/gameCard';
import serviceContent from './components/serviceContent';
import note from '../../../../../../components/mcenter/components/common/note';

export default {
    components: {
        swiper,
        swiperSlide,
        eleNews,
        mobile,
        gameCard,
        serviceContent,
        note
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
                preventInteractionOnTransition: true,
                on: {
                    slideChangeTransitionEnd: () => {
                        this.$nextTick(() => {
                            this.realIndex = this.$refs.swiperTop.swiper.realIndex;
                        });
                    }
                }
            },
            swipperList: [
                {
                    image: '/static/image/tpl/customizeHome/48/image1.jpg',
                    path: ''
                },
                {
                    image: '/static/image/tpl/customizeHome/48/image2.jpg',
                    path: '/page/10488'
                },
                {
                    image: '/static/image/tpl/customizeHome/48/image3.jpg',
                    path: '/page/10488'
                },
                {
                    image: '/static/image/tpl/customizeHome/48/image4.jpg',
                    path: ''
                },
                {
                    image: '/static/image/tpl/customizeHome/48/image5.jpg',
                    path: 'mobileBet'
                },
                {
                    image: '/static/image/tpl/customizeHome/48/image6.jpg',
                    path: ''
                }
            ],
            realIndex: 0
        };
    },
    computed: {
        ...mapGetters({
            onlineService: 'getOnlineService',
            popData: 'getPopData',
            popType: 'getPopType',
            appInfo: 'getAppInfo',
            loginStatus: 'getLoginStatus'
        })
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        onSwiperClick(index) {
            this.$refs.swiperTop.swiper.slideTo(index, 1000);
        },
        openThirdUrl(url, name) {
            window.open(url, name);
        },
        onService() {
            if (!this.onlineService.url) {
                return;
            }

            this.actionChangePage({ page: 'service', type: 'static' });
        },
        onClick({ path }) {
            if (!path) {
                return;
            }

            if (path === 'mobileBet') {
                if (this.loginStatus || this.appInfo.downloadInfo.unsafe_download) {
                    const win = window.open('');
                    ajax({
                        method: 'post',
                        url: API_QRCODE,
                        params: { path: 'mobileBet' },
                        errorAlert: false,
                        success: (response) => {
                            win.location = response.ret.url;
                        }
                    });
                    return;
                }
                this.$router.push('/page/10482');
                return;
            }

            this.$router.push(path);
        }
    }
};
</script>

<style lang="scss" module>
@keyframes iconRotate{
    0% {
        transform: rotateY(0deg)
    }

    50% {
        transform: rotateY(-180deg)
    }

    100% {
        transform: rotateY(-360deg)
    }
}

.content-wrap {
    padding-top: 120px;
    background-color: #FFF;
    overflow: hidden;
}

.swiper-wrap {
    position: relative;
    width: 1920px;
    height: 500px;
    left: 50%;
    margin-left: -960px;
    cursor: pointer;
}

.pagination-wrap {
    position: absolute;
    bottom: 14px;
    width: 100%;
    z-index: 2;
}

.pagination-container {
    width: 1080px;
    margin: 0 auto;
    text-align: center;
}

.pagination-btn {
    display: inline-block;
    width: 115px;
    height: 49px;
    margin-right: 5px;
    border-bottom: 4px solid hsla(0,0%,100%,.4);
    cursor: pointer;

    img {
        width: 100%;
        height: 100%;
    }
}

.current {
    border-bottom-color: #BA8C4E;
}

.news-wrap {
    width: 1200px;
    height: 42px;
    margin: 0 auto;
    line-height: 42px;
    color: #666;

    :global(.news-content-wrap) {
        display: inline-block;
        width: 906px;
    }
}

.new-wrap {
    display: inline-block;
    width: 906px;
}

.news-title {
    display: inline-block;
    width: 182px;
    padding-left: 35px;
    background: url('/static/image/tpl/customizeHome/48/message.png') 0 50% no-repeat;
    vertical-align: top;
}

.service {
    display: inline-block;
    margin-left: 4px;
    vertical-align: top;
    cursor: pointer;

    img {
        vertical-align: middle;
        animation: iconRotate 5s linear infinite;
    }

    span {
        color: #BA8C4E;
        font-size: 16px;
    }
}

.middel-wrap {
    background: #F4F6F9;
}

.middel-container {
    width: 1200px;
    margin: 0 auto;
    padding-top: 32px;
}
</style>
