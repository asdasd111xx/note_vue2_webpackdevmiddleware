<template>
    <div class="home-page theme-miller">
        <page-header @openLoginModal="loginModalStatus = isBackEnd ? false : true" />
        <div :style="{left: left}" class="home-banner-box">
            <div class="app-wrap">
                <div class="app-download">
                    <div v-if="!qrcodeStatus" class="qrcode-img-wrap">
                        <img :src="$getCdnPath('/static/image/mobileBet/qr.png')" />
                        <p class="no-login-text">{{ $text('S_LOGIN_DOWNLOAD') }}</p>
                    </div>
                    <div v-else class="qrcode-box">
                        <div class="qrcode-img">
                            <qrcode :value="mobileBetUrl" :options="{ width: 193 }" />
                        </div>
                    </div>
                    <div class="text-box">
                        <p class="qrcode-text1">
                            {{ $text('S_SCAN_CODE', '扫码下载APP') }}
                        </p>
                        <p class="qrcode-text2">
                            {{ $text('S_SUPPORT_IOS_ANDROID', '支持 iOS & Android 全部移动设备') }}
                        </p>
                        <p class="qrcode-text3">
                            {{ $text('S_WANT_NOT_DOWNLOAD', '不想下载？') }}
                        </p>
                        <p class="qrcode-text4">
                            {{ $text('S_BROWSER_INPUT_URL', '手机浏览器输入网址访问') }}
                        </p>
                        <p class="qrcode-text5">
                            {{ mobileUrl }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="top-wrap">
            <div class="main-banner">
                <div class="banner-wrap">
                    <div class="banner-container">
                        <div class="carousel-banner">
                            <swiper :options="swiperOption">
                                <swiper-slide v-for="(item, index) in slideImg" :key="`silde-${index}`">
                                    <a
                                        href="#"
                                        class="swiper-banner-link"
                                    >
                                        <img :src="$getCdnPath(item.img)" />
                                    </a>
                                </swiper-slide>
                            </swiper>
                            <div class="pagination-wrap">
                                <div class="page-button button-prev active">
                                    <img :src="$getCdnPath('/static/image/tpl/customizeHome/52/slide-back.png')" class="button-prev-img" />
                                </div>
                                <div class="swiper-pagination" />
                                <div class="page-button button-next">
                                    <img :src="$getCdnPath('/static/image/tpl/customizeHome/52/slide-next.png')" class="button-next-img" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="video-wrap">
                <!-- 放置影片區塊 -->
            </div>
        </div>
        <login v-if="!loginStatus && loginModalStatus" @closeModal="loginModalStatus = false" />
        <page-footer />
        <service />
        <!-- 代理中心及會員中心彈窗 -->
        <div v-if="popType === 'note'" class="note-content">
            <note :position="popData" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import updateQrcode from '@/lib/qrocodeUpdate';
import pageHeader from './components/header';
import pageFooter from './components/footer';
import login from './components/login';
import service from './components/service';
import note from '../../../../../../components/mcenter/components/common/note';

export default {
    components: {
        pageHeader,
        pageFooter,
        swiper,
        swiperSlide,
        login,
        service,
        note
    },
    data() {
        return {
            swiperOption: {
                slidesPerView: 2,
                spaceBetween: 10,
                loop: true,
                autoplay: true,
                navigation: {
                    nextEl: '.button-next',
                    prevEl: '.button-prev'
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    type: 'bullets',
                    renderBullet(index, className) {
                        return `<span class="${className}">0${index + 1}</span>`;
                    }
                }
            },
            slideImg: [
                {
                    link: 'https://iledong.com/activity-LD-carnival',
                    img: '/static/image/tpl/customizeHome/52/slide01.png'
                },
                {
                    link: 'https://iledong.com/activity-first-save',
                    img: '/static/image/tpl/customizeHome/52/slide02.png'
                }
            ],
            loginModalStatus: false,
            left: 0
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            loginStatus: 'getLoginStatus',
            popData: 'getPopData',
            popType: 'getPopType',
            appInfo: 'getAppInfo'
        }),
        mobileBetUrl() {
            return this.appInfo.qrcode.url || `${window.location.hostname}/mobileBet`;
        },
        mobileUrl() {
            return window.location.host;
        },
        qrcodeStatus() {
            return this.loginStatus || this.appInfo.downloadInfo.unsafe_download;
        }
    },
    watch: {
        loginModalStatus() {
            document.body.style.overflow = this.loginModalStatus ? 'hidden' : '';
        }
    },
    created() {
        if (this.isBackEnd) {
            return;
        }

        updateQrcode.update();
    },
    mounted() {
        window.addEventListener('scroll', () => {
            const left = document.documentElement.scrollLeft || document.body.scrollLeft;
            this.left = `-${left}px`;
        });
    },
    beforeDestroy() {
        if (this.isBackEnd) {
            return;
        }

        clearTimeout(updateQrcode.timer);
    },
    methods: {
        formatToPrice(num) {
            let integerNum = num;

            if (Number.isNaN(integerNum)) {
                integerNum = '';
            } else {
                integerNum = integerNum.toLocaleString('en', { maximumFractionDigits: 0 });
            }

            return integerNum;
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss"></style>
<style lang="scss" scoped>
.home-page {
    padding: 140px 0 41px;
}

.home-banner-box {
    width: 100%;
    min-width: 1405px;
    height: 700px;
    position: fixed;
    top: 95px;
    background: url('/static/image/tpl/customizeHome/52/banner.jpg') center no-repeat;
}

.top-wrap {
    padding-bottom: 10px;
    position: relative;
    z-index: 5;
    background: url('/static/image/tpl/customizeHome/52/bg01.png') #000 no-repeat bottom center;
    background-size: cover;
}

.main-banner {
    width: 100%;
    height: 380px;
    margin-top: 700px;
    position: relative;

    &:before {
        content: '';
        display: block;
        width: 100%;
        height: 200px;
        position: absolute;
        top: -5px;
        left: 0;
        z-index: 0;
        background: #000;
    }

}

.video-wrap {
    min-width: 100px;
}

.banner-wrap {
    height: 100%;
    position: relative;
    top: -105px;
    overflow: hidden;
}

.banner-container {
    width: 1280px;
    height: 100%;
    margin: 0 auto;
    position: relative;
}

.app-wrap {
    position: relative;
    width: 1280px;
    margin: 0 auto;
}

.app-download {
    position: absolute;
    left: 70px;
    top: 380px;
}

.qrcode-img-wrap {
    position: relative;
    display: inline-block;
    vertical-align: top;
    width: 193px;

    img {
        display: block;
        max-width: 100%;
    }
}

.no-login-text {
    position: absolute;
    width: 100%;
    top: 77px;
    left: 0;
    text-align: center;
    font-size: 22px;
    color: #E2C8A0;
}

.qrcode-box {
    padding: 9px;
    background: #FFF;
    display: inline-block;
    vertical-align: top;
}

.qrcode-img {
    height: 175px;
    width: 175px;
    border: 1px solid #FFF;
    background: #FFF;
    overflow: hidden;

    canvas {
        margin: -10px 0 0 -10px;
    }
}

.text-box {
    display: inline-block;
    margin: 5px 0 0 10px;
}

.qrcode-text1 {
    line-height: 1;
    margin: 0 0 8px;
    font-size: 18px;
    color: #FFF;
    letter-spacing: 1px;
}

.qrcode-text2 {
    line-height: 14px;
    margin: 0 0 70px;
    font-size: 12px;
    color: #FFF;
    opacity: 0.5;
}

.qrcode-text3 {
    line-height: 1;
    margin: 0 0 8px;
    font-size: 16px;
    color: #FFF;
    letter-spacing: 1px;
}

.qrcode-text4 {
    line-height: 1;
    margin: 0 0 8px;
    font-size: 12px;
    color: #FFF;
    opacity: 0.5;
}

.qrcode-text5 {
    margin: 15px 0 10px;
    font-size: 21px;
    color: #FFEAB0;
    letter-spacing: 3px;
    word-break: break-all;
    line-height: 1.1;
    text-shadow: 0 0 8px rgba(35, 35, 35, .7);
}

.pagination-wrap {
    margin: 60px 0 0 0;
    text-align: center;
}

.page-button {
    width: 30px;
    height: 37px;
    line-height: 37px;
    text-align: center;
    position: relative;
    cursor: pointer;
    transition: all 0.5s;
    outline: none;
    vertical-align: middle;
    display: inline-block;
    background: #F7B500;
    margin: 0 10px;

    img {
        width: 15px;
        height: 15px;
        margin: 11px 0 0 -2px;
    }
}

/deep/ .swiper-slide {
    width: 720px;
    height: 280px;
    position: relative;
    overflow: hidden;

    &:after {
        content: '';
        display: block;
        width: 605px;
        height: 260px;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 0;
        background: #F7B500;
    }
}

/deep/ .swiper-pagination {
    position: static;
    display: inline-block;

    .swiper-pagination-bullet {
        width: 30px;
        height: 35px;
        line-height: 30px;
        font-size: 12px;
        color: #FFF;
        opacity: 1;
        border-radius: 0;
        background: 0 0;
        transition: all 0.3s;
        outline: 0;
        vertical-align: middle;
        text-align: center;
        margin: 0 9px;
    }

    .swiper-pagination-bullet-active {
        width: 30px;
        height: 35px;
        line-height: 35px;
        font-size: 38px;
        color: #FFF;
        background: 0 0;
        white-space: nowrap;
        transition: all 0.1s;
    }
}

.swiper-banner-link {
    display: block;
    position: relative;
    width: 620px;
    height: 265px;
    margin-left: 15px;
    cursor: pointer;
    background: url('/static/image/tpl/customizeHome/52/slide-bg01.png') no-repeat center #000;
    z-index: 2;

    img {
        width: 100%;
        height: 100%;
        background-size: contain;
    }
}

.main-turnover {
    color: #FFF;
    max-width: 1280px;
    margin: 0 auto;
    padding-bottom: 50px;

}

.year-turnover {
    background: url('/static/image/tpl/customizeHome/52/text-bg01.png') no-repeat center bottom;
    width: 1200px;
    height: 55px;
    line-height: 1;
    margin: 0 auto 80px;
    text-align: center;
    font-size: 25px;
    overflow: hidden;
}

.year-turnover-count {
    margin: 0 -8px 0 -3px;
    font-size: 50px;
    letter-spacing: 3px;
}

.access-amount {
    width: 605px;
    height: 40px;
    margin: 0 auto 55px;
}

.access-amount-item{
    float: left;
    width: 284px;
    height: 39px;
    line-height: 39px;
    background: url('/static/image/tpl/customizeHome/52/text-bg02.png') no-repeat center bottom;
    text-align: center;
    font-size: 15px;

     p {
         line-height: 33px;
         margin: 0;
     }
}

.access-amount-count {
    display: inline-block;
    font-size: 30px;
    letter-spacing: 2px;
    transform: translateY(4px);
}

.turnover-description {
    text-align: center;
    font-size: 16px;
    color: #FFF;
}

.advantage-wrap {
    padding: 45px 0 0;
    position: relative;
    z-index: 2;
}

.advantage-list {
    width: 1280px;
    padding-left: 0;
    margin: 0 auto 75px;
    text-align: center;
}

.advantage-item {
    display: inline-block;
    width: 25%;
    min-height: 230px;
    padding-right: 30px;
    text-align: center;
    vertical-align: bottom;
    position: relative;
    transition: 0.3s;
}

.advantage-item-img {
    width:120px;
    height:120px;
    margin: 0 auto 45px;
    transition: 0.3s;
    background-position: center center;
    background-size: cover;
    background-repeat: no-repeat;
    border-radius: 100px;

    &:hover {
        transform: scale(1.09);
    }
}

.advantage-item-img1 {
    background-image: url('/static/image/tpl/customizeHome/52/item01.png');
}

.advantage-item-img2 {
    background-image: url('/static/image/tpl/customizeHome/52/item02.png');
}

.advantage-item-img3 {
    background-image: url('/static/image/tpl/customizeHome/52/item03.png');
}

.advantage-item-txet {
    width: 255px;
    line-height: 1.5;
    margin: 0 auto;
    font-size: 14px;
    color: #FFF;
}

.dividing-line {
    max-width: 1000px;
    margin: 0 auto;
    border-top: 1px solid #FFF;
    opacity: 0.2;
}

.note-content {
    position: absolute;
    width: 100%;
    max-width: 700px;
    z-index: 1000;
    height: auto;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
}

</style>
