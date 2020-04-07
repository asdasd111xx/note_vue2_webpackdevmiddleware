<template>
    <div :class="[$style['mobile-bet-wrap'], $style[ isMobile ? 'is-mobile' : 'is-pc' ]]">
        <div :class="[$style['mobile-bet-header'], 'clearfix']">
            <lang-wrap />
            <div :class="$style['logo-wrap']">
                <img :src="$getCdnPath('/static/image/mobileBet/519/logo.png')" />
            </div>
        </div>
        <div :class="[$style['mobile-app-wrap'], 'clearfix']">
            <div :class="[$style['mobile-app-contain'], 'clearfix']">
                <div :class="[$style['mobile-app-info'], 'clearfix']">
                    <div :class="$style['mobile-app-title']" />
                    <div :class="[$style['mobile-app-content'], 'clearfix']">
                        <div v-if="!isMobile" :class="$style['app-qrcode-wrap']">
                            <img v-if="qrcodeStatus" :src="qrcodeInfo.qrcode" />
                            <template v-if="reciprocalStatus">
                                <p v-if="qrcodeInfo.ttl"><span>{{ qrcodeInfo.ttl }}</span> {{ $t('S_LINK_INVALID') }}</p>
                                <p v-if="!qrcodeInfo.ttl" :class="$style['refresh']">
                                    {{ $t('S_LINK_INVALID_UPDATE') }}
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
                        <div :class="$style['mobile-app-text']">
                            {{ $t('S_519_APP') }}
                        </div>
                        <div v-if="isMobile" :class="$style['app-feature-btn-wrap']">
                            <div
                                v-if="!appInfo.appLoading"
                                :class="$style['download-btn']"
                                @click="appDownload()"
                            />
                            <div v-if="!appInfo.appLoading && appInfo.isIos" :class="$style['trust-btn-wrap']">
                                <a :class="$style['trust-btn']" href="/public/file/embedded.mobileprovision" />
                                <span>{{ $t('S_TRUST_CAPTION') }}</span>
                            </div>
                            <ele-loading v-if="appInfo.appLoading" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div :class="$style['mobile-sport-wrap']">
            <div :class="[$style['mobile-sport-download'], 'clearfix']">
                <div :class="$style['mobile-sport-contain']">
                    <div :class="$style['mobile-sport-info']">
                        <div :class="$style['mobile-sport-title']" />
                        <div :class="$style['mobile-sport-content']">
                            <div v-if="!isMobile" :class="$style['sport-qrcode-wrap']">
                                <img v-if="qrcodeStatus" :src="qrcodeInfo.qrcode" />
                                <!-- 客端自行產生的qrcode -->
                                <!-- <qrcode
                                    v-if="qrcodeStatus"
                                    :class="$style['sport-qrcode']"
                                    :value="sportUrl"
                                    :size="140"
                                /> -->
                                <template v-if="reciprocalStatus">
                                    <p v-if="qrcodeInfo.ttl"><span>{{ qrcodeInfo.ttl }}</span> {{ $t('S_LINK_INVALID') }}</p>
                                    <p v-if="!qrcodeInfo.ttl" :class="$style['refresh']">
                                        {{ $t('S_LINK_INVALID_UPDATE') }}
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
                            <div :class="$style['mobile-sport-text']">
                                {{ $t('S_519_APP') }}
                            </div>
                            <div v-if="isMobile" :class="$style['app-feature-btn-wrap']">
                                <div
                                    v-if="!appInfo.appLoading"
                                    :class="$style['download-btn']"
                                    @click="appDownload(sportUrl)"
                                />
                                <div v-if="!appInfo.appLoading && appInfo.isIos" :class="$style['trust-btn-wrap']">
                                    <a :class="$style['trust-btn']" href="/public/file/embedded.mobileprovision" />
                                    <span>{{ $t('S_TRUST_CAPTION') }}</span>
                                </div>
                                <ele-loading v-if="appInfo.appLoading" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div :class="$style['mobile-bet-footer']">
            <div :class="$style['footer-info']">Copyright © {{ webName[$i18n.locale] }} Reserved</div>
        </div>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .{{ $style['mobile-bet-wrap'] }} {
                background: url({{ $getCdnPath('/static/image/mobileBet/519/app_bg01.jpg') }}) #000 59% 0 no-repeat;
            }

            .{{ $style['mobile-app-contain'] }} {
                background: url({{ $getCdnPath('/static/image/mobileBet/519/app_title01.png') }}) 39px 0 no-repeat;
            }

            .{{ $style['mobile-app-title'] }} {
                background: url({{ $getCdnPath('/static/image/mobileBet/519/app_title02.png') }}) 0 0 no-repeat;
            }

            .{{ $style['app-qrcode-wrap'] }} {
                background: url({{ $getCdnPath('/static/image/mobileBet/519/icon_qrcode02.png') }}) 0 0 no-repeat;
            }

            .{{ $style['app-qrcode-wrap'] }}:hover {
                background: url({{ $getCdnPath('/static/image/mobileBet/519/icon_qrcode02_hover.png') }}) 0 0 no-repeat;
            }

            .{{ $style['mobile-sport-wrap'] }} {
                background: url({{ $getCdnPath('/static/image/mobileBet/519/app_bg02.png') }}) 60% 0 no-repeat;
            }

            .{{ $style['mobile-sport-download'] }} {
                background: url({{ $getCdnPath('/static/image/mobileBet/519/app_bg04.png') }}) -85px 0 no-repeat;
            }

            .{{ $style['mobile-sport-contain'] }} {
                background: url({{ $getCdnPath('/static/image/mobileBet/519/app_title03.png') }}) 23% 0 no-repeat;
            }

            .{{ $style['mobile-sport-title'] }} {
                background: url({{ $getCdnPath('/static/image/mobileBet/519/app_title04.png') }}) 0 0 no-repeat;
            }

            .{{ $style['download-btn'] }} {
                background: url({{ $getCdnPath('/static/image/mobileBet/519/btn_download.png') }}) 0 0 /contain no-repeat;
            }

            .{{ $style['download-btn'] }}:active {
                background: url({{ $getCdnPath('/static/image/mobileBet/519/btn_download_hover.png') }}) 0 0 /contain no-repeat;
            }

            .{{ $style['trust-btn'] }} {
                background: url({{ $getCdnPath('/static/image/mobileBet/519/btn_trust.png') }}) 0 0 /contain no-repeat;
            }

            .{{ $style['trust-btn'] }}:active {
                background: url({{ $getCdnPath('/static/image/mobileBet/519/btn_trust_hover.png') }}) 0 0 /contain no-repeat;
            }

            .{{ $style['is-mobile'] }} .{{ $style['mobile-app-wrap'] }} {
                background: url({{ $getCdnPath('/static/image/mobileBet/519/app_title01_m.png') }}) -108px -94px no-repeat;
            }

            .{{ $style['is-mobile'] }} .{{ $style['mobile-sport-download'] }} {
                background: url({{ $getCdnPath('/static/image/mobileBet/519/app_bg03.png') }}) 40% 0 no-repeat;
            }

            .{{ $style['is-mobile'] }} .{{ $style['mobile-sport-contain'] }} {
                background: url({{ $getCdnPath('/static/image/mobileBet/519/app_title03_m.png') }}) 35% 0 no-repeat;
            }

            @media screen and (min-width: 768px) {
                .{{ $style['mobile-bet-footer'] }} {
                    background: url({{ $getCdnPath('/static/image/mobileBet/519/footer_bg01.png') }}) 50% 0 no-repeat;
                }
            }

            @media screen and (min-width: 960px) {
                .{{ $style['mobile-sport-download'] }} {
                    background: url({{ $getCdnPath('/static/image/mobileBet/519/app_bg03.png') }}) 0 0 no-repeat;
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
            isMobile: isMobile()
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            agentInfo: 'getAgentInfo',
            loginStatus: 'getLoginStatus',
            agentIsLogin: 'getAgentIsLogin'
        }),
        qrcodeStatus() {
            if (this.loginStatus || this.agentIsLogin || this.appInfo.unsafe_download) {
                return true;
            }

            return false;
        },
        sportUrl() {
            let appUrl = 'itms-services://?action=download-manifest&url=https://download.bbin-fun.com/c19_sport.apk';
            let userInfo = '';

            if (this.appInfo.url) {
                userInfo = `?${this.appInfo.url.split('?')[1]}`;
            }

            if (this.appInfo.isIos) {
                appUrl = 'itms-services://?action=download-manifest&url=https://download.bbin-fun.com/c19_sport.plist';
            }

            return appUrl + userInfo;
        },
        webName() {
            return this.memInfo.config.domain_name || this.agentInfo.config.domain_name;
        },
        reciprocalStatus() {
            return (this.loginStatus || this.agentIsLogin) && !this.appInfo.unsafe_download;
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
                    this.sportqrcode = response.ret.url.split('?');
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
        appDownload(downloadUrl = '') {
            if (this.appInfo.isIosUc) {
                alert(this.$t('S_UC_NOT_DOWNLOAD'));
                return;
            }

            const checkDownload = window.confirm(this.$t('S_CONFIRM_INSTALL'));

            if (checkDownload === true) {
                window.location.href = downloadUrl || this.appInfo.download_link;
            }
        }
    }
};
</script>

<style lang="scss" src="./css/index.module.scss" module></style>
<style lang="scss" src="@/css/index.scss" scoped></style>
