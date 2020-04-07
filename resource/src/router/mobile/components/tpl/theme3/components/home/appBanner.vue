<template>
    <div :class="[$style.wrap, 'clearfix']">
        <!-- 關閉按鈕 -->
        <div :class="$style.close" @click="close()">
            <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/home/btn_close.png')" />
        </div>
        <!-- Logo -->
        <div v-if="appInfo.downloadInfo.icon" :class="$style.logo">
            <img :src="appInfo.downloadInfo.icon" />
        </div>
        <!-- 文字提示 -->
        <div :class="$style.tips">
            <div :class="$style.intro">{{ $text('S_APP_DOWNLOAD_TIPS_THEME3', '威尼斯人APP') }}</div>
            <div :class="$style.intro2">{{ $text('S_APP_DOWNLOAD_INTRO_THEME3', '真人娱乐、体育投注、电子游艺等尽在一手掌握') }}</div>
        </div>
        <!-- 下載按鈕 -->
        <div :class="$style.button" @click="onClick">{{ $text('S_CLICK_ME_DOWNLOAD', '点我下载') }}</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { API_QRCODE } from '@/config/api';
import ajax from '@/lib/ajax';

export default {
    data() {
        return {
            logo: ''
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus',
            appInfo: 'getAppInfo'
        })
    },
    methods: {
        onClick() {
            if (!this.appInfo.downloadInfo.unsafe_download && !this.loginStatus) {
                this.$router.push('/mobile/login');
                return;
            }

            ajax({
                method: 'post',
                url: API_QRCODE,
                params: {
                    path: 'mobileBet'
                },
                errorAlert: false,
                success: (response) => {
                    window.location.href = response.ret.url;
                }
            });
        },
        close() {
            this.$emit('update', 'N');
            this.$emit('resetHeight', true);
        }
    }
};
</script>

<style lang="scss" module>
.wrap {
    position: absolute;
    top: 0;
    left: 0;
    padding: 10px 0;
    width: 100%;
    height: 57px;
    background: url('/static/image/mobile/tpl/theme3/home/app_download_bar_bg.png') 0 0 no-repeat;
    background-size: 100% 100%;
    color: #FFF;
    font-size: 12px;
    z-index: 99;
}

.image {
    float: left;

    > img {
        display: block;
        width: 100%;
    }
}

.close {
    composes: image;
    width: 10px;
    height: 10px;
    margin: 10px 0 0 11px;
}

.logo {
    composes: image;
    width: 28px;
    height: 28px;
    margin: 1px 0 0 10px;
}

.tips {
    float: left;
    margin: 1px 0 0 15px;
    width: calc(100% - 21px - 38px - 81px - 15px); // 扣叉叉＋logo＋下載按鈕＋文字margin-left
    line-height: 12px;
}

.intro {
    color: #5C4030;
}

.intro2 {
    color: #9C6E54;
}

.button {
    float: right;
    width: 70px;
    height: 21px;
    line-height: 21px;
    margin: 6px 11px 0 0;
    padding: 0 3px;
    border-radius: 3px;
    background: url('/static/image/mobile/tpl/theme3/home/btn_app_download.png') 0 0 no-repeat;
    background-size: 100%;
    color: #F8F1EB;
    text-align: center;
}
</style>
