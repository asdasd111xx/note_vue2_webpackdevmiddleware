<template>
    <div :class="[$style.container, { [$style['has-coming-soon']]: gameData.csc.switch !== 'Y' }, 'clearfix']">
        <div :class="$style['img-wrap']">
            <img v-if="gameData.csc.switch === 'Y'" :src="$getCdnPath('/static/image/tpl/customizeHome/48/sports/app_sprite.png')" />
            <img v-else :src="$getCdnPath('/static/image/tpl/customizeHome/48/sports/comimgsoon.png')" />
        </div>
        <div v-if="gameData.csc.switch === 'Y'" :class="[$style.content, 'clearfix']">
            <div :class="$style['qrcode-info-wrap']">
                <div :class="$style['qrcode-info-title']">{{ $text('S_DOWNLOAD_SPORT_APP', '掃一掃下載体育APP') }}</div>
                <div :class="$style['qrcode-wrap']">
                    <img :class="$style.qrcode" :src="mobileBetImage" />
                    <div v-if="!qrcodeStatus" :class="$style['qrcode-tips']">{{ $text('S_LOGIN_DOWNLOAD', '请登入下载') }}</div>
                </div>
                <a :href="mobileBetUrl">{{ mobileBetHostname }}</a>
            </div>
            <div :class="$style['sports-link-wrap']">
                <div :class="$style['sports-link-title']">{{ $text('S_GAME_GROUP_BY_SPORTS', '体育赛事') }}</div>
                <div :class="$style['sports-link-tips']">{{ $text('S_YABO_TEXT16', '每月提供上万场体育赛事投注') }}</div>
                <div :class="$style['sports-link-btn']">{{ $text('S_ENTER_NOW', '立即进入') }}</div>
            </div>
            <div :class="$style['promotion-wrap']">
                <div :class="$style['promotion-title']">VENETIAN</div>
                <div :class="$style['promotion-title']">SPORTS</div>
                <div :class="$style['promotion-tips']">{{ $text('S_YABO_TEXT19', '体育首充优惠') }}</div>
                <div :class="$style['promotion-img']" />
            </div>
        </div>
        <div v-else :class="$style['coming-soon-wrap']">
            <div :class="$style['coming-soon-title']">{{ $text('S_COMIMG_SOON', '即将登场') }}</div>
            <div :class="$style['coming-soon-text']">Coming soon</div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            gameData: 'getGameData',
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

.has-coming-soon {
    padding: 0 138px 0 117px;
}

.img-wrap {
    float: left;
    width: 453px;
    margin-top: 43px;

    > img {
        display: block;
        width: 100%;
    }
}

.content {
    float: left;
}

.qrcode-info-wrap {
    float: left;
    width: 240px;
    margin-top: 60px;
    text-align: center;

    > a {
        color: #B98C4D;
        font-size: 16px;
        cursor: pointer;
    }
}

.qrcode-info-title {
    line-height: 25px;
    margin-bottom: 8px;
    color: #000;
    font-size: 16px;
}

.qrcode-wrap {
    display: block;
    position: relative;
    width: 109px;
    height: 109px;
    margin: 0 auto 6px;

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

.sports-link-wrap {
    float: left;
    width: 288px;
    margin-top: 70px;
}

.sports-link-title {
    line-height: 72px;
    color: #222;
    font-size: 60px;
    font-weight: 700;
    text-align: center;
}

.sports-link-tips {
    line-height: 32px;
    color: #66665F;
    font-size: 20px;
    text-align: center;
}

.sports-link-btn {
    width: 183px;
    height: 42px;
    line-height: 42px;
    margin: 15px auto 0;
    border-radius: 21px;
    background: #955D2C;
    background: linear-gradient(270deg, #955D2C, #F3D382);
    color: #FFF;
    font-size: 14px;
    text-align: center;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
        background: #F3D382;
        background: linear-gradient(270deg, #F3D382, #955D2C);
    }
}

.promotion-wrap {
    float: left;
    width: 120px;
    margin: 60px 0 0 90px;
}

.promotion-title {
    line-height: 23px;
    color: #343434;
    font-size: 20px;
}

.promotion-tips {
    line-height: 24px;
    margin-top: 3px;
    color: #666;
    font-size: 18px;
}

.promotion-img {
    width: 116px;
    height: 76px;
    margin: 12px auto 0;
    background: url('/static/image/tpl/customizeHome/48/sports/icon-50.png') 50% 50% no-repeat;
}

.coming-soon-wrap {
    float: right;
    width: 360px;
    margin-top: 70px;
    text-align: center;
    color: #C39E51;
}

.coming-soon-title {
    height: 110px;
    font-size: 90px;
    font-weight: 500;
}

.coming-soon-text {
    font-size: 50px;
    font-weight: 300;
}
</style>
