<template>
    <div :class="$style['mobile-wrap']">
        <div :class="$style['img-wrap']">
            <div :class="$style['img-phone2']">
                <img :src="$getCdnPath(`/static/image/tpl/customizeHome/48/img_iphone2${currentData === 'sport' ? '_sport' : ''}.png`)" />
            </div>
            <div :class="$style['img-phone3']">
                <img :src="$getCdnPath(`/static/image/tpl/customizeHome/48/img_iphone3${currentData === 'sport' ? '_sport' : ''}.png`)" />
            </div>
            <div :class="$style['img-human']">
                <img :src="$getCdnPath(`/static/image/tpl/customizeHome/48/img_${currentData === 'sport' ? 'cr7-1' : 'shaizi'}.png`)" />
            </div>
            <div :class="$style['img-player']">
                <img :src="$getCdnPath(`/static/image/tpl/customizeHome/48/img_${currentData === 'sport' ? 'messi-1' : 'poker'}.png`)" />
            </div>
            <div :class="$style['img-phone1']">
                <img :src="$getCdnPath(`/static/image/tpl/customizeHome/48/img_iphone1${currentData === 'sport' ? '_sport' : ''}.png`)" />
            </div>
        </div>
        <div :class="$style['content-wrap']">
            <div :class="$style['content-title']">{{ $text('S_YABO_TEXT09', '方寸之间 从容尽显') }}</div>
            <div :class="$style['content-subtitle']">{{ $text('S_YABO_TEXT10', '业内最顶尖的手机投注APP') }}</div>
            <div :class="$style['btn-wrap']">
                <span
                    :class="[$style.btn, { [$style.active] : currentData === 'sport' }]"
                    @click="currentData = 'sport'"
                >
                    {{ $text('S_SPORT_STATION_APP', '體育APP') }}
                </span>
                <span
                    :class="[$style.btn, { [$style.active] : currentData === 'all' }]"
                    @click="currentData = 'all'"
                >
                    {{ $text('S_ALL_STATION_APP', '全站APP') }}
                </span>
            </div>
            <!-- eslint-disable vue/no-v-html -->
            <div :class="$style['content-text']" v-html="contextText" />
            <!-- eslint-enable vue/no-v-html -->
            <div :class="[$style['download-wrap'], 'clearfix']">
                <div :class="$style['qrcode-wrap']">
                    <div :class="$style['qrcode-image-wrap']">
                        <img :class="$style.qrcode" :src="mobileBetImage" />
                        <div v-if="!qrcodeStatus" :class="$style['qrcode-tips']">{{ $text('S_LOGIN_DOWNLOAD', '请登入下载') }}</div>
                    </div>
                    <div :class="$style['download-title']">{{ $text('S_SCAN_DOWNLOAD_APP', '扫码下载APP') }}</div>
                    <div :class="$style['download-text']">{{ $text('S_SUPPORT_MOBILE_DEVICES', '支持iOS & Android等全部移动设备') }}</div>
                    <a :href="mobileBetUrl">{{ hostname }}</a>
                </div>
                <div :class="$style['web-link-wrap']">
                    <img :src="$getCdnPath('/static/image/tpl/customizeHome/48/h5_icon.png')" />
                    <div :class="$style['download-title']">{{ $text('S_SCAN_DOWNLOAD_APP', '扫码下载APP') }}</div>
                    <div :class="$style['download-text']">{{ $text('S_YABO_TEXT11', '无需下载，手机输入网址即可访问') }}</div>
                    <a :href="mobileBetUrl">{{ mobileBetHostname }}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            currentData: 'sport',
            hoverData: ''
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus',
            appInfo: 'getAppInfo'
        }),
        hostname() {
            return window.location.hostname;
        },
        qrcodeStatus() {
            return this.loginStatus || this.appInfo.downloadInfo.unsafe_download;
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
        },
        contextText() {
            if (this.currentData === 'sport') {
                return '业内赔率最高！覆盖世界各地赛事,让球、大小、半全场、波胆、单双、总入球、连串过关等多元竞猜，让您畅游轻松娱乐投注。';
            }

            return '赛事竞技、真人娱乐、电子游戏、棋牌，您所要的尽在威尼斯人贵宾厅，行业最<br/> 全游戏竞技娱乐APP，威尼斯人贵宾厅为您呈现别样、缤纷的极致体验。';
        }
    }
};
</script>

<style lang="scss" module>
@keyframes phone2 {
    0% {
        left: -40px;
    }

    100% {
        left: 0px;
    }
}

@keyframes phone3 {
    0% {
        right: -38px;
    }

    100% {
        right: 6px;
    }
}

@keyframes phone1 {
    0% {
        transform: scale(0.9);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes human {
    0% {

    }

    100% {
        left: 82px;
    }
}

.img-wrap {
    display: inline-block;
    position: relative;
    width: 730px;
    height: 638px;
    margin-right: 10px;
}

.img-phone2,
.img-phone1,
.img-phone3,
.img-human,
.img-player {
    position: absolute;

    > img {
        width: 100%;
        height: 100%;
    }
}

.img-phone2 {
    top: 50px;
    width: 323px;
    height: 550px;
    animation: phone2 1.5s forwards;
}

.img-phone1 {
    left: 203px;
    width: 323px;
    height: 640px;
    animation: phone1 1.5s forwards;
}

.img-phone3 {
    top: 50px;
    width: 323px;
    height: 554px;
    animation: phone3 1.5s forwards;
}

.img-human {
    bottom: 0;
    left: 82px;
    animation: phone1 1.5s forwards;
}

.img-player {
    bottom: 0;
    right: -2px;
    animation: phone1 1.5s forwards;
}

.content-wrap {
    display: inline-block;
    width: 455px;
    height: 549px;
    margin-top: 44px;
    vertical-align: top;
    text-align: center;
}

.content-title {
    width: 455px;
    height: 52px;
    margin-bottom: 10px;
    font-size: 52px;
    font-weight: 300;
    line-height: 52px;
    text-align: center;
    color: #BA8C4E;
}

.content-subtitle {
    composes: content-title;
    height: 24px;
    line-height: 24px;
    font-size: 24px;
}

.btn-wrap {
    padding: 27px 0 34px;
}

.btn {
    display: inline-block;
    width: 184px;
    height: 52px;
    padding: 18px 60px;
    border-radius: 50px;
    font-size: 16px;
    color: #BA8C4E;
    box-shadow: 0 0 8px rgba(145, 87, 40, 0.4);
    cursor: pointer;

    &:first-child {
        margin-right: 7px;
    }

    &.active {
        color: #FFF;
        background: linear-gradient(90deg, #F3D382, #955D2C);
        box-shadow: 0 0 8px rgba(145, 87, 40, 0.4);
    }
}

.content-text {
    height: 75px;
    margin-bottom: 30px;
    color: #666;
    line-height: 25px;
}

.qrcode-wrap {
    float: left;
    width: 227px;

    a {
        color: #BA8C4E;
    }
}

.qrcode-image-wrap {
    display: block;
    position: relative;
    width: 133px;
    height: 133px;
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

.qrcode-img {
    width: 133px;
    height: 133px;
    margin: 8px auto 26px;
    background: #000;
}

.web-link-wrap {
    float: left;
    width: 227px;

    img {
        height: 128px;
    }


    a {
        color: #BA8C4E;
    }
}

.download-title {
    color: #BA8C4E;
    font-size: 17px;
    margin: 8px 0;
}

.download-text {
    margin-bottom: 8px;
    color: #666;
    font-size: 14px;
}
</style>
