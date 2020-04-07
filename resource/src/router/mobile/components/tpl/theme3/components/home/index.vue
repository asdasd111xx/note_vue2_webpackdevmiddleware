<template>
    <mobile-container :class="[$style.container, { [$style['has-app-download']]: hasAppDownload }]">
        <div slot="content">
            <app-banner
                v-if="hasAppDownload"
                @update="setCookie"
                @resetHeight="resetHeight"
            />
            <slider />
            <new-msg />
            <login-info />
            <game :to-reset="toReset" />
        </div>
    </mobile-container>
</template>

<script>
import mobileContainer from '../common/mobileContainer';
import slider from './slider';
import newMsg from './newMsg';
import loginInfo from './loginInfo';
import game from './game';
import appBanner from './appBanner';

export default {
    components: {
        mobileContainer,
        slider,
        newMsg,
        loginInfo,
        game,
        appBanner
    },
    data() {
        return {
            appDownloadStatus: this.$cookie.get('APP_DOWNLOAD_STATUS') || 'Y',
            toReset: false
        };
    },
    computed: {
        /**
         * 取得 App 下載狀態
         * @method hasAppDownload
         * @returns {boolean} 是否顯示
         */
        hasAppDownload: {
            get() {
                if (this.appDownloadStatus === 'N') {
                    return false;
                }

                return true;
            },
            set(value) {
                this.appDownloadStatus = value;
                this.$cookie.set('APP_DOWNLOAD_STATUS', value, 30);
            }
        }
    },
    methods: {
        /**
         * 設定 Cookie
         * @method setCookie
         * @param {string} value - App 狀態
         */
        setCookie(value) {
            this.hasAppDownload = value;
        },
        resetHeight(val) {
            // 關閉置頂App下載
            this.toReset = val;
        }
    }
};
</script>

<style lang="scss" module>
div.container {
    padding-bottom: 45px;
}

.has-app-download {
    padding-top: 57px;
}
</style>
