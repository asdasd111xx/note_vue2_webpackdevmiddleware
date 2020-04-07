<template>
    <div :class="[$style.container, 'clearfix']">
        <div :class="[$style['item-wrap'], 'clearfix']">
            <div :class="$style['title-img']">
                <img :src="$getCdnPath('/static/image/tpl/customizeHome/500000/app/new_pic_sports_down.png')" />
            </div>
            <div :class="$style.content">
                <div :class="$style.title">{{ $text('S_SPORT_STATION_APP', '体育APP') }}</div>
                <div :class="$style['qrcode-wrap']">
                    <img :class="$style.qrcode" :src="mobileBetImage" />
                    <div v-if="!qrcodeStatus" :class="$style['qrcode-tips']">{{ $text('S_LOGIN_DOWNLOAD', '请登入下载') }}</div>
                </div>
                <div :class="$style.text">{{ $text('S_DOWNLOAD_SPORT_APP', '扫一扫下载体育APP') }}</div>
                <div :class="$style.tips">{{ $text('S_SUPPORT_MOBILE_DEVICES', '支持iOS & Android等全部移动设备') }}</div>
                <a :href="mobileBetUrl">{{ mobileBetHostname }}</a>
            </div>
        </div>
        <div :class="[$style['item-wrap'], 'clearfix']">
            <div :class="$style['title-img']">
                <img :src="$getCdnPath('/static/image/tpl/customizeHome/500000/app/new_pic_all_down.png')" />
            </div>
            <div :class="$style.content">
                <div :class="$style.title">{{ $text('S_ALL_STATION_APP', '全站APP') }}</div>
                <div :class="$style['qrcode-wrap']">
                    <img :class="$style.qrcode" :src="mobileBetImage" />
                    <div v-if="!qrcodeStatus" :class="$style['qrcode-tips']">{{ $text('S_LOGIN_DOWNLOAD', '请登入下载') }}</div>
                </div>
                <div :class="$style.text">{{ $text('S_DOWNLOAD_ALL_APP', '扫一扫下载全站APP') }}</div>
                <div :class="$style.tips">{{ $text('S_SUPPORT_MOBILE_DEVICES', '支持iOS & Android等全部移动设备') }}</div>
                <a :href="mobileBetUrl">{{ mobileBetHostname }}</a>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus',
            appInfo: 'getAppInfo'
        }),
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
        }
    }
};
</script>

<style lang="scss" module>
.container {
    width: 1200px;
    height: 100%;
    margin: 0 auto;
}
.item-wrap {
    float: left;
    width: 50%;
    height: 100%;
    margin: 0 auto;
    padding: 19px 0 0 40px;
    padding-top: 19px;
    text-align: center;
    cursor: pointer;

    &:hover {
        background-color: #FFF;
        opacity: .9;

        .title-img {
            transition: all .5s;
            transform: scale(1.03);
        }
    }
}

.title-img {
    float: left;
    margin-top: 31px;
}

.content {
    float: left;
    margin: 24px 0 0 32px;
    margin-left: 32px;
}

.title {
    margin-bottom: 18px;
    color: #333;
    font-size: 24px;
}

.qrcode-wrap {
    display: block;
    position: relative;
    width: 97px;
    height: 97px;
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

.sport-app {
    width: 97px;
    height: 97px;
    margin: 0 auto;
    background-color: #000;
}

.text {
    margin-top: 12px;
    font-size: 16px;
    color: #333;
}

.tips {
    margin: 6px 0 3px;
    font-size: 12px;
    color: #666;
}
</style>
