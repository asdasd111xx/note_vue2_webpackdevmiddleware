<template>
    <div :class="$style['mobile-bet-wrap']">
        <div :class="$style['logo-wrap']">
            <img :src="$getCdnPath('/static/image/tpl/customizeHome/500000/logo.png')" />
        </div>
        <div :class="$style['title-wrap']">
            <p>{{ $text('S_THEME3_MOBILE_BET_TITLE', '专业的原生客户端') }}</p>
            <p :class="$style['sub-title']">{{ $text('S_THEME3_MOBILE_BET_SUB_TITLE', '高赔率 最安全 最极致的用户体验') }}</p>
        </div>
        <div :class="$style['middle-wrap']">
            <img :src="$getCdnPath('/static/image/mobileBet/500000/middle_bg.png')" />
        </div>
        <div :class="$style['download-wrap']">
            <div v-if="!startDownload">
                <button
                    v-for="info in appInfo.app"
                    :key="info.id"
                    :class="$style['download-btn']"
                    @click="appDownlad(info)"
                >
                    {{ info.name }}
                </button>
            </div>
            <div v-else>
                <div>
                    <button :class="$style['download-btn']">{{ $text('S_NOW_DOWNLOADING', '正在下载') }}</button>
                </div>
                <div v-if="!appInfo.appLoading && appInfo.isIos">
                    <button :class="$style['trust-btn']" @click="setTrust()">{{ $text('S_ONE_CLICK_TRUST', '一键信任') }}</button>
                </div>
            </div>
            <p :class="$style['trust-tip']">{{ $text('S_THEME3_ONE_CLICK_TRUST', '安装后，需点击一键信任才可使用') }}</p>
            <div :class="$style['download-tips']">
                <p>{{ $text('S_THEME3_DOWNLOAD_TIP_01', '需在同一网络环境下下载安装和注册，勿切换网络') }}</p>
                <p>{{ $text('S_THEME3_DOWNLOAD_TIP_02', '若无法正常下载，请使用手机自带浏览器打开') }}</p>
                <p>({{ $text('S_THEME3_DOWNLOAD_TIP_03', 'UC浏览器、Chrome谷歌浏览器') }})</p>
            </div>
        </div>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .{{ $style['mobile-bet-wrap'] }} {
                background: url({{ $getCdnPath('/static/image/mobileBet/500000/bg_main.png') }}) no-repeat center center / cover;
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import ajax from '@/lib/ajax';
import { API_GETAPPINFO_MORE } from '@/config/api';

export default {
    data() {
        return {
            appInfo: {
                isIos: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                isIosUc: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) && navigator.userAgent.indexOf('UCBrowser') > -1,
                appLoading: true
            },
            startDownload: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        })
    },
    created() {
        if (this.appInfo.isIosUc) {
            alert(this.$t('S_UC_NOT_DOWNLOAD'));
        }
        this.getAppInfo();

        // 1分鐘檢測一次下載連結是否逾期
        window.setInterval(() => {
            this.getAppInfo();
        }, 60000);
    },
    methods: {
        getAppInfo() {
            // 抓取平多個APP資訊
            ajax({
                method: 'get',
                url: API_GETAPPINFO_MORE + window.location.search,
                success: (response) => {
                    this.appInfo = {
                        ...this.appInfo,
                        app: { ...response.ret }
                    };
                },
                fail: () => {
                    window.close();
                }
            });
        },
        appDownlad(info) {
            if (this.appInfo.isIosUc) {
                alert(this.$t('S_UC_NOT_DOWNLOAD'));
                return;
            }

            const checkDownload = window.confirm(this.$t('S_CONFIRM_INSTALL'));

            if (checkDownload === true) {
                if (info.new_windows) {
                    window.open(info.download_link);
                    return;
                }

                this.startDownload = true;
                window.location.href = info.download_link;
            }
        },
        setTrust() {
            window.location.href = '/public/file/embedded.mobileprovision';
        }
    }
};
</script>

<style lang="scss" src="./css/index.module.scss" module></style>
