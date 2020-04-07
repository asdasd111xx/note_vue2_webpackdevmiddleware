<template>
    <div :class="$style['page-wrap']">
        <div
            v-for="data in selectBtnData"
            :key="data.type"
            :class="[$style['select-btn'], {[$style.current]: curBtn === data.link}]"
            @click="scrollHandler(data.link)"
        >
            {{ data.text }}
        </div>
        <div id="all-app" :class="$style['all-app-container']">
            <div :class="[$style['app-wrap'], 'clearfix']">
                <div :class="$style['all-swiper-wrap']">
                    <swiper
                        ref="swiperTop"
                        :options="swiperOptionTop"
                        :class="$style.swiper"
                    >
                        <swiper-slide v-for="num in 2" :key="num">
                            <img :src="$getCdnPath(`/static/image/tpl/customizeHome/500000/app/all_slider_${num}.png`)" />
                        </swiper-slide>
                    </swiper>
                    <img :class="$style['app-slider-bg']" :src="$getCdnPath('/static/image/tpl/customizeHome/500000/app/app_slider_bg.png')" />
                    <img :class="$style['app-messi']" :src="$getCdnPath('/static/image/tpl/customizeHome/500000/app/img_app_messi.png')" />
                </div>
                <div :class="$style['all-app-wrap']">
                    <img :src="$getCdnPath('/static/image/tpl/customizeHome/500000/app/game_title.png')" />
                    <div :class="$style['all-app-text']">
                        全球首家一体化娱乐原生APP，尽显流畅、完美操作。海量体育、电竞顶尖赛事，真人娱乐、彩票投注及电子游艺等，最新最全娱乐项目尽在掌中体验扫码下载，即刻拥有！
                    </div>
                    <div :class="[$style['links-wrap'], 'clearfix']">
                        <div :class="$style['qrcode-wrap']">
                            <div :class="$style['qrcode-image-wrap']">
                                <img :class="$style.qrcode" :src="mobileBetImage" />
                                <div v-if="!qrcodeStatus" :class="$style['qrcode-tips']">{{ $text('S_LOGIN_DOWNLOAD', '请登入下载') }}</div>
                            </div>
                            <div :class="$style['link-text']">
                                扫描二维码下载iOS
                                <br />
                                安卓纯原生手机客户端
                            </div>
                            <a :href="mobileBetUrl">{{ mobileBetHostname }}</a>
                        </div>
                        <div :class="$style['link-wrap']">
                            <img :src="$getCdnPath('/static/image/tpl/customizeHome/500000/app/h5_icon.png')" />
                            <div :class="$style['link-text']">
                                使用浏览器输入以下网址
                                <br />
                                免下载访问
                            </div>
                            <a :href="mobileUrl">{{ mobileHostname }}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div id="sports-app" :class="$style['sports-app-container']">
            <div :class="[$style['app-wrap'], 'clearfix']">
                <div :class="$style['sports-swiper-wrap']">
                    <swiper
                        ref="swiperTop"
                        :options="swiperOptionTop"
                        :class="$style.swiper"
                    >
                        <swiper-slide v-for="num in 2" :key="num">
                            <img :src="$getCdnPath(`/static/image/tpl/customizeHome/500000/app/sports_slider_${num}.png`)" />
                        </swiper-slide>
                    </swiper>
                    <img :class="$style['app-slider-bg']" :src="$getCdnPath('/static/image/tpl/customizeHome/500000/app/app_slider_bg.png')" />
                    <img :class="$style['app-cr']" :src="$getCdnPath('/static/image/tpl/customizeHome/500000/app/img_app_cr7.png')" />
                </div>
                <div :class="$style['sports-app-wrap']">
                    <img :src="$getCdnPath('/static/image/tpl/customizeHome/500000/app/sport_title.png')" />
                    <div :class="$style['all-sport-text']">
                        业内赔率最高！覆盖世界各地赛事,让球、大小、半全场、波胆、单双、总入球、<br />连串过关等多元竞猜，让您畅游轻松娱乐投注。
                    </div>
                    <div :class="[$style['links-wrap'], 'clearfix']">
                        <div :class="$style['qrcode-wrap']">
                            <div :class="$style['qrcode-image-wrap']">
                                <img :class="$style.qrcode" :src="mobileBetImage" />
                                <div v-if="!qrcodeStatus" :class="$style['qrcode-tips']">{{ $text('S_LOGIN_DOWNLOAD', '请登入下载') }}</div>
                            </div>
                            <div :class="$style['link-text']">
                                扫描二维码下载iOS
                                <br />
                                安卓纯原生手机客户端
                            </div>
                            <a :href="mobileBetUrl">{{ mobileBetHostname }}</a>
                        </div>
                        <div :class="$style['link-wrap']">
                            <img :src="$getCdnPath('/static/image/tpl/customizeHome/500000/app/h5_icon.png')" />
                            <div :class="$style['link-text']">
                                使用浏览器输入以下网址
                                <br />
                                免下载访问
                            </div>
                            <a :href="mobileUrl">{{ mobileHostname }}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';

export default {
    components: {
        swiper,
        swiperSlide
    },
    props: {
        changePage: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            selectBtnData: [
                { type: 'ws', text: this.$text('S_WS_ALL_APP', '威尼斯人全站APP'), link: '#all-app' },
                { type: 'yf', text: this.$text('S_WS_SPORT_APP', '威尼斯人体育APP'), link: '#sports-app' }
            ],
            curBtn: '#all-app',
            swiperOptionTop: {
                autoplay: {
                    delay: 3000,
                    disableOnInteraction: false
                },
                loop: true,
                speed: 1000,
                allowTouchMove: false
            }
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus',
            appInfo: 'getAppInfo'
        }),
        qrcodeStatus() {
            return this.loginStatus || this.appInfo.downloadInfo.unsafe_download;
        },
        mobileUrl() {
            return `${window.location.origin}/mobile`;
        },
        mobileHostname() {
            return `${window.location.hostname}/mobile`;
        },
        mobileBetImage() {
            if (this.qrcodeStatus) {
                return this.appInfo.qrcode.qrcode;
            }

            return this.$getCdnPath('/static/image/mobileBet/qr.png');
        },
        mobileBetUrl() {
            if (this.qrcodeStatus) {
                return this.appInfo.qrcode.url;
            }

            return `${window.location.origin}/mobileBet`;
        },
        mobileBetHostname() {
            return `${window.location.hostname}/mobileBet`;
        }
    },
    mounted() {
        window.addEventListener('scroll', () => {
            this.curBtn = window.pageYOffset > 508 ? '#sports-app' : '#all-app';
        });
    },
    beforeDestroy() {
        window.removeEventListener('scroll', () => {
            this.curBtn = window.pageYOffset > 508 ? '#sports-app' : '#all-app';
        });
    },
    methods: {
        scrollHandler(el) {
            document.querySelector(el).scrollIntoView({ behavior: 'smooth' });
        }
    }
};
</script>

<style lang="scss" module>
.page-wrap {
    padding: 120px 0 140px;
    background: #F4F6F9;
}

.all-app-container {
    height: 880px;
    background: url('/static/image/tpl/customizeHome/500000/app/bg_fullsite.png') 0 0 no-repeat;
}

.sports-app-container {
    height: 850px;
    background: url('/static/image/tpl/customizeHome/500000/app/bg_sport.png') 0 0 no-repeat;
}

.select-btn {
    position: fixed;
    left: 8%;
    top: 254px;
    z-index: 10;
    width: 160px;
    height: 46px;
    line-height: 46px;
    font-size: 15px;
    border-radius: 23px;
    border: 0;
    background: #FFF;
    color: #BA8C4E;
    box-shadow: 0 2px 6px 3px rgba(194, 194, 194, 0.3);
    text-align: center;
    transition: all .3s ease;
    cursor: pointer;

    &:first-child {
        top: 185px;
    }
}


.current {
    color: #FFF;
    background: linear-gradient(270deg, #955D2C, #F3D382);
    box-shadow: 0 4px 12px 6px rgba(145, 87, 40, 0.3);
}

.app-wrap {
    width: 1200px;
    margin: 0 auto;
    padding: 0 80px;
}

.all-swiper-wrap {
    position: relative;
    float: left;
    width: 320px;
    height: 693px;
    margin-top: 101px;
    margin-left: 34px;
}

.app-slider-bg {
    position: absolute;
    top: -30px;
    left: -36px;
    z-index: 1;
}

.app-messi {
    position: absolute;
    top: 297px;
    left: 183px;
    z-index: 2;
}

.all-app-wrap {
    float: right;
    width: 462px;
    margin-top: 258px;
    text-align: center;
}

.all-app-text {
    margin-top: 22px;
    color: #333;
    font-size: 14px;
    line-height: 26px;
}

.links-wrap {
    margin-top: 13px;
    padding: 0 34px;

    a {
        color: #BA8C4E;
        text-decoration: initial;
    }
}

.qrcode-wrap {
    float: left;
    width: 50%;
}

.qrcode-image-wrap {
    display: block;
    position: relative;
    width: 104px;
    height: 104px;
    margin: 0 auto;

    > img {
        display: block;
        width: 100%;
    }
}

.qrcode-tips {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 12px;
    line-height: 12px;
    margin: auto;
    color: #E2C8A0;
    font-size: 12px;
}

.link-wrap {
    float: right;
    width: 50%;

    img {
        height: 104px;
    }
}

.link-text {
    margin-top: 10px;
    line-height: 26px;
    font-size: 14px;
    color: #333;
}

.sports-swiper-wrap {
    composes: all-swiper-wrap;
    float: right;
}

.app-cr {
    position: absolute;
    top: 270px;
    right: 361px;
}

.sports-app-wrap {
    float: left;
    width: 450px;
    padding-top: 250px;
    text-align: center;
}

.sports-title {
    height: 90px;
    margin-top: 60px;
    line-height: 90px;
    background: linear-gradient(to bottom, dimgray 0%, dimgray 50%, #222222 100%);
    -moz-background-clip: text;
    -webkit-background-clip: text;
    -o-background-clip: text;
    background-clip: text;
    color: transparent;
    font-size: 90px;
    font-weight: 500;
}

.all-sport-text {
    margin-top: 22px;
    color: #333;
    font-size: 14px;
    line-height: 26px;
    text-align: left;
}

.sports-text {
    height: 64px;
    line-height: 60px;
    background: linear-gradient(to bottom, dimgray 0%, dimgray 50%, #222222 100%);
    -moz-background-clip: text;
    -webkit-background-clip: text;
    -o-background-clip: text;
    background-clip: text;
    color: transparent;
    font-size: 50px;
    font-weight: 300;
}
</style>
