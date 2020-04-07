<template>
    <div :class="[$style.wrap, 'clearfix']">
        <!-- 關閉按鈕 -->
        <div :class="$style.close" @click="$emit('update', 'N')">
            <img src="/static/image/mobile/tpl/brilliant/home/btn_close.png" />
        </div>
        <!-- Logo -->
        <div v-if="appInfo.downloadInfo.icon" :class="$style.logo">
            <img :src="appInfo.downloadInfo.icon" />
        </div>
        <!-- 文字提示 -->
        <div :class="$style.tips">{{ $text('S_APP_DOWNLOAD_TIPS') }}</div>
        <!-- 下載按鈕 -->
        <div :class="$style.button" @click="onClick">{{ $text('S_CLICK_ME_DOWNLOAD') }}</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { API_QRCODE } from '@/config/api';
import ajax from '@/lib/ajax';

export default {
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
        }
    }
};
</script>

<style lang="scss" module>
.wrap {
    position: relative;
    height: 50px;
    margin-bottom: 42px;
    background-color: #313131;
    color: #FFF;
    font-size: 12px;
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
    margin: 20px 0 0 11px;
}

.logo {
    composes: image;
    width: 28px;
    height: 28px;
    margin: 11px 0 0 10px;
}

.tips {
    float: left;
    height: 50px;
    line-height: 50px;
    margin-left: 15px;
}

.button {
    float: right;
    width: 98px;
    height: 24px;
    line-height: 24px;
    margin: 13px 11px 0 0;
    padding: 0 3px;
    background-color: #BB28E6;
    color: #FFF;
    text-align: center;
}
</style>
