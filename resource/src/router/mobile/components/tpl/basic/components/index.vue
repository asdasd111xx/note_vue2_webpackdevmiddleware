<template>
    <div :class="mainClass">
        <!-- APP 下載 -->
        <app-banner v-if="hasAppDownload" @update="setCookie" />
        <m-header
            v-if="!isWebview && path[1] !== 'mcenter' && path[1] !== 'domain'"
            :config.sync="headerConfigValue"
            :has-app-download="hasAppDownload"
        />
        <div class="mobile-content">
            <transition name="fade" mode="out-in">
                <router-view :header-config.sync="headerConfigValue" theme="basic" />
            </transition>
        </div>
        <m-footer v-if="!isWebview && path[1] !== 'agcenter' && path[1] !== 'domain'" />
        <ele-pop />
        <pop-news />
        <!-- 代理中心及會員中心彈窗 -->
        <div v-if="popType === 'note'" class="note-content theme-basic">
            <security-verify v-if="path[1] === 'mcenter'" :position="popData" />
            <agent-note v-if="path[1] === 'agcenter'" :position="popData" />
        </div>
        <notice-center v-show="noticeData.length > 0" :notice-data="noticeData" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import store from '@/store';
import appEvent from '@/lib/appEvent';
import noticeCenter from '@/router/web/components/common/noticeCenter';
import mHeader from './mHeader';
import headerConfig from './mHeader/config';
import mFooter from './footer/mFooter';

export default {
    components: {
        mHeader,
        mFooter,
        elePop: () => import(/* webpackChunkName: 'elePop' */'@/router/web/components/tpl/common/pop'),
        popNews: () => import(/* webpackChunkName: 'popNews' */'@/router/web/components/common/popNews'),
        securityVerify: () => import(/* webpackChunkName: 'securityVerify' */'@/router/mobile/components/common/securityVerify'),
        agentNote: () => import(/* webpackChunkName: 'agentNote' */'@/router/agent/components/common/note'),
        appBanner: () => import(/* webpackChunkName: 'appBanner' */'./home/components/appBanner'),
        noticeCenter
    },
    data() {
        return {
            headerConfig,
            appDownloadStatus: this.$cookie.get('APP_DOWNLOAD_STATUS') || 'Y'
        };
    },
    computed: {
        ...mapGetters({
            isWebview: 'getIsWebview',
            loginStatus: 'getLoginStatus',
            agentIsLogin: 'getAgentIsLogin',
            isBackEnd: 'getIsBackEnd',
            memInfo: 'getMemInfo',
            agentInfo: 'getAgentInfo',
            popType: 'getPopType',
            sidebarWidth: 'getSidebarWidth',
            postData: 'getPost',
            popData: 'getPopData',
            noticeData: 'getNoticeData'
        }),
        headerConfigValue: {
            get() {
                return this.headerConfig;
            },
            set(value) {
                this.headerConfig = value;
            }
        },
        path() {
            return this.$route.path.split('/').filter((path) => path);
        },
        mainClass() {
            return [
                'mobile-wrap',
                {
                    'is-webview': this.isWebview,
                    'is-agcenter': this.path[1] === 'agcenter',
                    'is-mcenter': this.path[1] === 'mcenter',
                    'is-domain': this.path[1] === 'domain'
                }
            ];
        },
        /**
         * 取得 App 下載狀態
         * @method hasAppDownload
         * @returns {boolean} 是否顯示
         */
        hasAppDownload: {
            get() {
                if (!this.memInfo.config.app_is_ready) {
                    return false;
                }

                if (this.$route.name !== 'home') {
                    return false;
                }

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
    watch: {
        '$route.name': (nextPage) => {
            if (nextPage === 'home' || nextPage === 'promotion') {
                const postType = nextPage === 'home' ? '1' : '2';

                store.dispatch('actionSetPost', postType).then(() => {
                    store.dispatch('actionSetPop', {
                        type: 'post',
                        data: store.state.post.list
                    });
                });
            }
        }
    },
    created() {
        // 登入前如果代理端為登入狀態即登出
        if (!this.loginStatus) {
            this.actionSetAgentdata();
        }

        if (this.$cookie.get('IS_BB_APP') !== null && this.$cookie.get('IS_BB_APP') === 'Y') {
            appEvent.jsToAppMessage('HOME_PAGE');
            this.actionSetWebview();
        }

        // 會員首次登入強制修改密碼
        if (this.loginStatus && this.memInfo.user.password_reset) {
            return;
        }

        // 代理會員首次登入強制修改密碼
        if (this.agentIsLogin && this.agentInfo.user.password_reset) {
            return;
        }

        if (this.$route.name === 'home' || this.$route.name === 'promotion') {
            const postType = this.$route.name === 'home' ? '1' : '2';

            this.actionSetPost(postType).then(() => {
                this.actionSetPop({
                    type: 'post',
                    data: this.postData.list
                });
            });
        }
    },
    methods: {
        ...mapActions([
            'actionSetWebview',
            'actionSetAgentdata',
            'actionSetPost',
            'actionSetPop'
        ]),
        /**
         * 設定 Cookie
         * @method setCookie
         * @param {string} value - App 狀態
         */
        setCookie(value) {
            this.hasAppDownload = value;
        }
    }
};
</script>

<style src="@/css/index.scss" lang="scss"></style>
<style src="../css/index.scss" lang="scss" scoped></style>
