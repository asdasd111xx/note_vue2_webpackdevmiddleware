<template>
    <div :class="['mobile-bet-wrap', { 'is-mobile': isMobile, 'is-pc': !isMobile }]">
        <div class="mobile-bet-inner-wrap">
            <div class="mobile-bet-header clearfix">
                <lang-wrap />
            </div>
            <div class="mobile-bet-container clearfix">
                <div class="mobile-bet-body">
                    <div class="logo-wrap">
                        <img :src="appInfo.icon" />
                        <span>{{ webName[$i18n.locale] }}</span>
                    </div>
                    <p class="introduction-title">
                        {{ $t('S_MOBILE_BET_TITLE_FIRST') }}
                        <br v-if="curLang === 'vi'" />
                        <span v-else class="circle-wrap" />
                        {{ $t('S_MOBILE_BET_TITLE_LAST') }}
                    </p>
                    <div class="introduction-body">
                        <p>{{ $t('S_CONFORM_ALL_GAME') }}</p>
                        <p>{{ $t('S_FREE_TIME') }}</p>
                    </div>
                </div>
                <div class="mobile-animate-bg">
                    <div class="mobile-animate-phone">
                        <img :src="$getCdnPath('/static/image/mobileBet/phone.png')" />
                    </div>
                    <div class="mobile-phone-cover" />
                </div>
                <div class="mobile-info-wrap clearfix">
                    <div class="app-download-info-bg">
                        <div class="app-download-info clearfix">
                            <div :class="['download-info-left', 'clearfix', !appInfo.isIos ? 'not-ios' : '']">
                                <div class="info-left-wrap">
                                    <div class="download-title-wrap">
                                        <p class="app-download-title">{{ $t('S_APP_DOWNLOAD') }}</p>
                                        <p class="app-download-title-sub">For iOS & Android</p>
                                    </div>
                                    <ul>
                                        <li>{{ $t('S_MOBILE_QRCODE') }}</li>
                                        <li>{{ $t('S_BIND_ACCOUNT') }}</li>
                                    </ul>
                                </div>
                                <div :class="['app-feature-btn-wrap', !appInfo.isIos ? 'not-ios' : '']">
                                    <button
                                        v-if="!appInfo.appLoading"
                                        class="download-btn"
                                        @click="appDownlad()"
                                    >
                                        {{ $t('S_NOW_DOWNLOAD') }}
                                    </button>
                                    <button
                                        v-if="!appInfo.appLoading"
                                        class="open-mobile-btn"
                                        @click="openApp()"
                                    >
                                        {{ $t('S_NOW_OPEN') }}
                                    </button>
                                    <button v-if="!appInfo.appLoading && appInfo.isIos" class="trust-btn">
                                        <a href="/public/file/embedded.mobileprovision">{{ $t('S_ONE_CLICK_TRUST') }}</a>
                                    </button>
                                    <ele-loading v-if="appInfo.appLoading" />
                                </div>
                                <div v-if="!appInfo.appLoading && appInfo.isIos" class="app-device-info">
                                    <!-- eslint-disable vue/no-v-html -->
                                    <span v-html="iosInstallTip" />：
                                    <!-- eslint-enable vue/no-v-html -->
                                    {{ $t('S_IOS_STEP') }}
                                </div>
                            </div>
                            <div class="app-qrcode-wrap">
                                <div :title="$t('S_SCANNING_DOWNLOAD')" class="app-now-download-bg">{{ $t('S_SCANNING_DOWNLOAD') }}</div>
                                <img :src="qrcodeStatus ? qrcodeInfo.qrcode : $getCdnPath('/static/image/mobileBet/qr.png')" />
                                <p v-if="!qrcodeStatus" class="no-login-text">{{ $t('S_LOGIN_DOWNLOAD') }}</p>
                                <template v-if="reciprocalStatus">
                                    <p
                                        v-if="qrcodeInfo.ttl"
                                        :title="`${qrcodeInfo.ttl} ${$t('S_LINK_INVALID')}`"
                                        :class="`link-invalid font-lang-${curLang}`"
                                    >
                                        <span>{{ qrcodeInfo.ttl }}</span> {{ $t('S_LINK_INVALID') }}
                                    </p>
                                    <p v-if="!qrcodeInfo.ttl" :class="`link-update font-lang-${curLang}`">
                                        <span>{{ $t('S_LINK_INVALID_UPDATE') }}</span>
                                        <button @click="updataQrcode(true)">
                                            <icon
                                                name="sync"
                                                width="14"
                                                height="14"
                                            />
                                        </button>
                                    </p>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="now-play-info-bg">
                        <div class="now-play-info">
                            <div class="now-play-url" />
                            <div class="now-play-title-wrap">
                                <p class="now-play-title">{{ $t('S_WEB_NOW_PLAY') }}</p>
                                <p :title="$t('S_NOT_DOWNLOAD')" :class="`now-play-title-sub font-lang-${curLang}`">{{ $t('S_NOT_DOWNLOAD') }}</p>
                            </div>
                            <ul>
                                <li>{{ $t('S_IOS_SHOW_SUGGEST') }}</li>
                                <li>{{ $t('S_ENTER_URL') }} <a :href="mobileUrl" target="mobileUrl">{{ mobileUrl }}</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mobile-bet-footer">
                <div class="footer-info">Copyright © {{ webName[$i18n.locale] }} Reserved</div>
            </div>
        </div>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .mobile-bet-wrap[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/mobileBet/bg_extend.png') }}) #2D2D40 50% 0 repeat-x;
            }

            .mobile-bet-inner-wrap[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/mobileBet/bg_m.png') }}) 50% 0 no-repeat;
            }

            .mobile-animate-bg .mobile-phone-cover[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/mobileBet/phone_cover.png') }}) 50% 100% no-repeat;
            }

            .mobile-info-wrap .now-play-info-bg .download-title-wrap,
            .mobile-info-wrap .app-download-info-bg .app-download-info-bg[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/mobileBet/title_bg.png') }}) 0 12px no-repeat;
            }

            .mobile-info-wrap .app-download-info-bg .app-download-info[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/mobileBet/mobile_bg.png') }}) right 10px top 5px no-repeat;
            }

            .mobile-info-wrap .app-feature-btn-wrap .download-btn[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/mobileBet/icon_download.png') }}) #FF4D4D 8px 50% no-repeat;
            }

            .mobile-info-wrap .app-feature-btn-wrap .open-mobile-btn[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/mobileBet/icon_open.png') }}) #8993BA 13px 50% no-repeat;
            }

            .mobile-info-wrap .app-feature-btn-wrap .trust-btn[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/mobileBet/icon_safety.png') }}) #C19A73 9px 51% no-repeat;
            }

            .app-download-info .app-device-info[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/mobileBet/icon_notice.png') }}) 0 2px no-repeat;
            }

            .now-play-info-bg[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/mobileBet/web_bg.png') }}) #303148 right 10px center no-repeat;
            }

            .app-qrcode-wrap .app-now-download-bg[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/mobileBet/qr-scan.png') }}) 50% 0 no-repeat;
            }

            @media screen and (min-width: 480px) {
                .mobile-info-wrap .app-download-info-bg .download-btn[{{ this.$options._scopeId }}] {
                    background: url({{ $getCdnPath('/static/image/mobileBet/icon_download.png') }}) #FF4D4D 8px 50% no-repeat;
                }

                .mobile-info-wrap .app-download-info-bg .open-mobile-btn[{{ this.$options._scopeId }}] {
                    background: url({{ $getCdnPath('/static/image/mobileBet/icon_open.png') }}) #8993BA 16px 50% no-repeat;
                }
            }

            @media screen and (min-width: 768px) {
                .mobile-bet-inner-wrap[{{ this.$options._scopeId }}] {
                    background: url({{ $getCdnPath('/static/image/mobileBet/bg_t.png') }}) 50% 0 no-repeat;
                }

                .now-play-info[{{ this.$options._scopeId }}] {
                    background: url({{ $getCdnPath('/static/image/mobileBet/web_bg.png') }}) 60px 0 no-repeat;
                }

                .now-play-url[{{ this.$options._scopeId }}] {
                    background: url({{ $getCdnPath('/static/image/mobileBet/web_url.gif') }}) 50% 0 no-repeat;
                }
            }

            @media screen and (min-width: 960px) {
                .mobile-bet-inner-wrap[{{ this.$options._scopeId }}] {
                    background: url({{ $getCdnPath('/static/image/mobileBet/bg.png') }}) 50% 0 no-repeat;
                }

                .app-download-info .app-device-info[{{ this.$options._scopeId }}] {
                    background: url({{ $getCdnPath('/static/image/mobileBet/icon_notice.png') }}) 0 2px no-repea;
                }
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import * as apiUrl from '@/config/api';
import ajax from '@/lib/ajax';
import isMobile from '@/lib/is_mobile';
import eleLoading from '@/router/web/components/tpl/common/element/loading/circle';
import langWrap from './lang';

export default {
    components: {
        langWrap,
        eleLoading
    },
    data() {
        return {
            appInfo: {
                isIos: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                isIosUc: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) && navigator.userAgent.indexOf('UCBrowser') > -1,
                appLoading: true
            },
            qrcodeInfo: {},
            qrcodeCountdown: {},
            mobileUrl: `${window.origin}/mobile`,
            isMobile: isMobile()
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            agentInfo: 'getAgentInfo',
            loginStatus: 'getLoginStatus',
            agentIsLogin: 'getAgentIsLogin',
            curLang: 'getCurLang'
        }),
        qrcodeStatus() {
            if (this.loginStatus || this.agentIsLogin || this.appInfo.unsafe_download) {
                return true;
            }

            return false;
        },
        webName() {
            return this.memInfo.config.domain_name || this.agentInfo.config.domain_name;
        },
        reciprocalStatus() {
            return (this.loginStatus || this.agentIsLogin) && !this.appInfo.unsafe_download;
        },
        iosInstallTip() {
            return this.$text('S_IOS_DEVICE_TIP', {
                replace: [
                    {
                        target: '%s',
                        value: '<span class="one-click-trust">'
                    }, {
                        target: '%s',
                        value: '</span>'
                    }
                ]
            });
        }
    },
    created() {
        if (this.appInfo.isIosUc) {
            alert(this.$t('S_UC_NOT_DOWNLOAD'));
        }
        this.getAppInfo();
        this.updataQrcode();

        // 1分鐘檢測一次下載連結是否逾期
        window.setInterval(() => {
            this.getAppInfo();
        }, 60000);
    },
    methods: {
        ...mapActions([
            'actionSetWebInfo'
        ]),
        timeReciprocal() {
            if (this.qrcodeInfo.ttl === 0) {
                return;
            }
            this.qrcodeInfo.ttl -= 1;
            this.qrcodeCountdown = setTimeout(this.timeReciprocal, 1000);
        },
        getAppInfo() {
            // 抓取平台APP資訊
            ajax({
                method: 'get',
                url: apiUrl.API_GETAPPINFO + window.location.search,
                success: (response) => {
                    this.appInfo = {
                        ...this.appInfo,
                        ...response.ret,
                        appLoading: false
                    };
                },
                fail: () => {
                    window.close();
                }
            });
        },
        updataQrcode(errorAlert = false) {
            ajax({
                method: 'post',
                url: apiUrl.API_QRCODE,
                params: {
                    path: 'mobileBet'
                },
                errorAlert,
                success: (response) => {
                    this.qrcodeInfo = response.ret;
                    clearTimeout(this.qrcodeCountdown);
                    this.timeReciprocal();
                }
            });
        },
        openApp() {
            if (this.appInfo.open_link) {
                window.location = this.appInfo.open_link;
            }
        },
        appDownlad() {
            if (this.appInfo.isIosUc) {
                alert(this.$t('S_UC_NOT_DOWNLOAD'));
                return;
            }

            const checkDownload = window.confirm(this.$t('S_CONFIRM_INSTALL'));

            if (checkDownload === true) {
                window.location.href = this.appInfo.download_link;
            }
        }
    }
};
</script>

<style lang="scss" src="@/css/tpl/index.scss"></style>
<style lang="scss" scoped>
@import "~@/css/variable.scss";

.mobile-bet-wrap {
    height: 100%;

    &.is-pc {
        min-width: $phone;
    }

    &.is-mobile {
        .app-qrcode-wrap {
            display: none !important;
        }

        .download-info-left {
            width: 100% !important;

            &.not-ios {
                margin-top: 39px;
            }

            .app-feature-btn-wrap {
                display: block !important;
            }
        }
    }

    .mobile-bet-container {
        position: relative;
    }

    .mobile-bet-body {
        position: relative;
        z-index: 1;
        min-height: 258px;
        margin-top: -12px;
        text-align: center;

        .logo-wrap {
            display: inline-block;
            width: 96px;
            margin-bottom: 36px;

            img {
                width: 100%;
            }

            span {
                color: #E0C69F;
            }
        }

        p {
            margin: 0;
        }

        .introduction-title {
            font-size: 32px;
            font-weight: bold;
            color: #FFF;

            .circle-wrap {
                display: inline-block;
                vertical-align: middle;
                width: 8px;
                height: 8px;
                margin: 0 4px;
                border-radius: 50%;
                background: #FFF;
            }
        }

        .introduction-body {
            display: block;
            padding-top: 2px;
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            color: #9899AB;

            p {
                line-height: 22px;
            }
        }
    }

    .mobile-animate-bg {
        position: absolute;
        width: 100%;
        top: 225px;

        .mobile-animate-phone {
            opacity: 0;
            width: 85%;
            margin: 0 auto;
            transition: all 1.5s;
            -webkit-transition: all 1.5s;
            animation: mobileSlider .5s ease-out .2s;
            -webkit-animation: mobileSlider .5s ease-out .2s;
            animation-fill-mode: forwards;
            -webkit-animation-fill-mode: forwards;

            img {
                max-width: 100%;
            }
        }

        .mobile-phone-cover {
            position: absolute;
            width: 100%;
            height: 276px;
            bottom: 10px;
            background-size: contain;
        }
    }

    @-webkit-keyframes mobileSlider {
        0% {
            top: 210px;
            opacity: 0;
        }

        100% {
            top: 225px;
            opacity: 1;
        }
    }

    @keyframes mobileSlider {
        0% {
            top: 210px;
            opacity: 0;
        }
        100% {
            top: 225px;
            opacity: 1;
        }
    }

    .mobile-info-wrap {
        position: relative;
        width: 100%;
        margin-top: 36%;

        .now-play-info-bg,
        .app-download-info-bg {
            color: #E0C69F;

            .now-play-info,
            .app-download-info {
                width: 100%;

                p {
                    margin: 0;
                    font-size: 18px;
                }

                .font-lang-vi,
                .font-lang-en,
                .font-lang-ja {
                    font-size: 13px;
                }

                .link-invalid {
                    max-width: 210px;
                    overflow : hidden;
                    text-overflow : ellipsis;
                    white-space : nowrap;
                }

                .link-update {
                    span {
                        display: inline-block;
                        max-width: 200px;
                        overflow : hidden;
                        text-overflow : ellipsis;
                        white-space : nowrap;
                    }
                }

                ul {
                    margin-top: 16px;
                    padding-left: 16px;

                    li {
                        list-style-type: decimal;
                        line-height: 26px;
                        font-size: 16px;
                        color: #FFF;
                    }
                }

                .download-title-wrap,
                .now-play-title-wrap {
                    padding-left: 10px;

                    .now-play-title,
                    .app-download-title {
                        font-size: 40px;
                        line-height: 40px;
                    }
                }
            }
        }

        .app-download-info-bg {
            width: 100%;
            margin: 0 auto;
            padding: 0 3% 2px 3%;

            .app-download-info {
                position: relative;
                min-height: 230px;

                .download-info-left {
                    float: left;
                    width: 222px;

                    .info-left-wrap {
                        float: left;
                    }

                    .app-feature-btn-wrap {
                        display: none;
                        float: right;
                        width: 33%;
                        margin-right: 3%;

                        &.not-ios {
                            margin-top: 9%;
                        }

                        button {
                            display: block;
                            width: 100%;
                            height: 45px;
                            line-height: 42px;
                            border-radius: 26px;
                            margin: 8px 0;
                            padding: 0 15% 0 29%;
                            text-align: center;
                            text-overflow: ellipsis;
                            overflow: hidden;
                            white-space: nowrap;
                            font-size: 14px;
                            cursor: pointer;
                            color: #FFF;
                        }

                        .download-btn {
                            background-size: 20%;
                        }

                        .open-mobile-btn {
                            background-size: 13%;
                        }

                        .trust-btn {
                            background-size: 20%;

                            a {
                                color: #FFF;
                            }
                        }
                    }

                    .download-title-wrap {
                        padding-top: 4px;
                    }

                    .app-device-info {
                        clear: both;
                        float: left;
                        margin-top: 2%;
                        padding-left: 26px;
                        font-size: 14px;
                        color: #80808D;
                        background-size: 20px;

                        /deep/ .one-click-trust {
                            color: #E1C79F;
                        }
                    }
                }
            }
        }

        .now-play-info-bg {
            width: 100%;
            margin-top: 10px;
            padding: 59px 3% 38px;

            .now-play-info {
                width: 100%;

                .now-play-title-wrap {
                    padding-top: 4px;
                    background-position: 1px 7px;
                }

                ul {
                    margin-top: 26px;

                    li {
                        a {
                            color: #FF4D4D;
                        }
                    }
                }

                .now-play-url {
                    display: none;
                }
            }
        }
    }

    .app-qrcode-wrap {
        position: relative;
        float: right;
        margin-right: 3px;
        text-align: center;

        .app-now-download-bg {
            position: absolute;
            opacity: 0;
            width: 151px;
            height: 47px;
            line-height: 36px;
            top: -30px;
            right: -22px;
            overflow : hidden;
            text-overflow : ellipsis;
            white-space : nowrap;
            animation: downloadTitleSlider .5s ease-out .2s;
            -webkit-animation: downloadTitleSlider .5s ease-out .2s;
            animation-fill-mode: forwards;
            -webkit-animation-fill-mode: forwards;
            font-size: 16px;
            color: #FFF;
        }

        @-webkit-keyframes downloadTitleSlider {
            0% {
                top: -34px;
                opacity: 0;
            }

            100% {
                top: -54px;
                opacity: 1;
            }
        }

        @keyframes downloadTitleSlider {
            0% {
                top: -34px;
                opacity: 0;
            }
            100% {
                top: -54px;
                opacity: 1;
            }
        }

        p {
            margin-top: 7px;
            font-size: 14px;

            &.no-login-text {
                position: absolute;
                width: 196px;
                font-size: 26px;
                top: 75px;
                left: 0;
                color: #E2C8A0;
            }

            span {
                color: #FFF;
            }

            button {
                vertical-align: text-top;
                width: 14px;
                height: 14px;
                line-height: 14px;
                transition: transform .3s ease-out;
                cursor: pointer;
                color: #E0C69F;
                background: transparent;

                &:hover {
                    transform: rotate(180deg);
                }
            }
        }
    }

    .mobile-bet-footer {
        width: 100%;
        color: #666;

        .footer-info {
            padding: 30px 0 20px;
            text-align: center;
        }
    }
}

@media screen and (min-width: $phone) {
    .mobile-bet-wrap {
        .mobile-bet-body {
            .logo-wrap {
                margin-bottom: 9px;
            }

            .introduction-title {
                font-size: 46px;

                .circle-wrap {
                    width: 12px;
                    height: 12px;
                }
            }

            .introduction-body {
                padding-top: 8px;
                font-size: 30px;

                p {
                    line-height: 32px;
                }
            }
        }

        .mobile-animate-bg {
            top: 229px;

            .mobile-animate-phone {
                width: 64%;
            }

            .mobile-phone-cover {
                bottom: 0;
            }
        }

        @-webkit-keyframes mobileSlider {
            0% {
                top: 214px;
                opacity: 0;
            }

            100% {
                top: 229px;
                opacity: 1;
            }
        }

        @keyframes mobileSlider {
            0% {
                top: 214px;
                opacity: 0;
            }
            100% {
                top: 229px;
                opacity: 1;
            }
        }

        .mobile-info-wrap {
            margin-top: 24%;

            .app-download-info-bg {
                width: 442px;
                padding: 0;

                .app-download-info {
                    padding-bottom: 32px;
                    background-position: 189px 2px;

                    .download-info-left {
                        .info-left-wrap {
                            .download-title-wrap {
                                padding-top: 7px;
                            }
                        }

                        .app-feature-btn-wrap {
                            width: 148px;
                            margin: 16px 50px 0 0;

                            button {
                                width: 148px;
                                padding-left: 37px;
                                font-size: 16px;
                            }

                            .download-btn {
                                background-size: 20%;
                            }

                            .open-mobile-btn {
                                background-size: 13%;
                            }
                        }

                        .app-device-info {
                            margin-top: 0;
                        }
                    }
                }
            }

            .now-play-info-bg {
                margin-top: 1px;
                background-position-x: 41%;

                .now-play-info {
                    width: 448px;
                    margin: 0 auto;
                }
            }
        }
    }
}

@media screen and (min-width: $pad) {
    .mobile-bet-wrap {
        .mobile-bet-body {
            float: right;
            margin: 8px 10px 0 0;

            .logo-wrap {
                width: 120px;
                margin-bottom: 11px;
            }
        }

        .mobile-animate-bg {
            top: 73px;
            left: 0;

            .mobile-animate-phone {
                margin: 0;
            }

            .mobile-phone-cover {
                display: none;
            }
        }

        @-webkit-keyframes mobileSlider {
            0% {
                top: 57px;
                opacity: 0;
            }

            100% {
                top: 73px;
                opacity: 1;
            }
        }

        @keyframes mobileSlider {
            0% {
                top: 57px;
                opacity: 0;
            }
            100% {
                top: 73px;
                opacity: 1;
            }
        }

        .mobile-info-wrap {
            clear: right;
            width: 100%;
            margin-top: 0;
            padding-top: 30%;
            background: none;

            .app-download-info-bg {
                .app-download-info {
                    background-position: 66px 0;

                    .download-info-left {

                        .info-left-wrap {
                            .download-title-wrap {
                                padding-top: 13px;
                                background-position-y: 12px;

                                .app-download-title-sub {
                                    margin-top: 6px;
                                }
                            }

                            ul {
                                margin-top: 17px;
                            }
                        }
                    }
                }
            }

            .now-play-info-bg {
                position: relative;
                margin-top: 8px;
                padding: 45px 0 44px;
                background: #303148;

                .now-play-info {
                    position: relative;
                    padding-top: 9px;

                    .now-play-title-wrap {
                        width: 280px;
                        padding-top: 14px;
                        background-position: 0 12px;

                        .now-play-title-sub {
                            margin-top: 8px;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            white-space: nowrap;
                        }
                    }

                    ul {
                        margin: 64px 0 0;
                        padding-bottom: 8px;
                    }

                    .now-play-url {
                        position: absolute;
                        display: block;
                        width: 200px;
                        height: 84px;
                        top: 44px;
                        left: 270px;
                    }
                }
            }
        }
    }
}

@media screen and (min-width: $pc) {
    .mobile-bet-wrap {
        .mobile-bet-inner-wrap {
            min-width: 990px;
        }

        .mobile-bet-header {
            max-width: 1024px;
            margin: 0 auto;
        }

        .mobile-bet-container {
            max-width: 1024px;
            margin: 0 auto;
        }

        .mobile-bet-body {
            min-height: 379px;
            margin-right: 0;

            .logo-wrap {
                margin-bottom: 46px;
            }

            .introduction-title {
                font-size: 64px;
            }

            .introduction-body {
                padding-top: 14px;
                font-size: 36px;

                p {
                    line-height: 46px;
                }
            }
        }

        .mobile-animate-bg {
            top: 87px;
            left: 1px;

            .mobile-animate-phone {
                width: 656px;
            }
        }

        @-webkit-keyframes mobileSlider {
            0% {
                top: 72px;
                opacity: 0;
            }

            100% {
                top: 87px;
                opacity: 1;
            }
        }

        @keyframes mobileSlider {
            0% {
                top: 72px;
                opacity: 0;
            }
            100% {
                top: 87px;
                opacity: 1;
            }
        }

        .mobile-info-wrap {
            padding: 162px 22px 0 10px;

            .app-download-info-bg {
                float: right;
                width: 50%;

                .app-download-info {
                    background-position: 101px 5px;

                    .download-info-left {
                        margin: 4px 0 0 11%;

                        .app-device-info {
                            width: 222px;
                            padding-left: 26px;
                            font-size: 14px;
                            color: #80808D;
                            background-size: 20px;

                            p {
                                font-size: 14px;
                            }
                        }
                    }
                }
            }

            .now-play-info-bg {
                float: left;
                width: 50%;
                margin: 0;
                padding: 0;
                background-color: transparent;

                .now-play-info {
                    margin: 0;
                    background-position-x: 54px;

                    .now-play-title-wrap {
                        padding-top: 8px;
                        background-position: 1px 6px;
                    }

                    ul {
                        margin-top: 65px;

                        li {
                            a {
                                color: #FFF;

                                &:hover {
                                    color: #FF4D4D;
                                }
                            }
                        }
                    }
                }
            }
        }

        .mobile-bet-footer {
            max-width: 1024px;
            margin: 0 auto;

            .footer-info {
                padding: 16px 0;
            }
        }
    }
}

@media screen and (min-width: $layoutWidth) {
    .mobile-bet-wrap {
        .mobile-bet-container {
            max-width: 1064px;
        }

        .mobile-bet-body {
            margin: 8px 10px 0 0;
        }

        .mobile-animate-bg {
            left: 20px;
        }

        .mobile-info-wrap {
            padding: 163px 0 0;

            .app-download-info-bg {
                .app-download-info {
                    background-position: 150px 5px;

                    .download-info-left {
                        margin-left: 16%;
                    }

                    .app-qrcode-wrap {
                        &:before {
                            top: -54px;
                            right: -25px;
                        }
                    }
                }
            }
        }
    }
}
</style>
