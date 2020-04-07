<template>
    <div v-if="isPopShow" :class="[$style['popup-container'], `theme-${theme}`]">
        <div :class="$style.mask" @click="onMaskClick" />
        <ag-login v-if="popType === 'agLogin'" />
        <mem-pwd-forget v-else-if="popType === 'memPwdForget'" />
        <ag-pwd-forget v-else-if="popType === 'agPwdForget'" />
        <account v-else-if="popType === 'account'" :select="popData" />
        <post
            v-else-if="popType === 'post' && !isWebview"
            :config="postData.config"
            :data="popData"
        />
        <rebate v-else-if="popType === 'rebate'" :data="popData" />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    components: {
        memPwdForget: () => import(/* webpackChunkName: 'memPwdForget' */'./components/mem_pwd_forget'),
        agPwdForget: () => import(/* webpackChunkName: 'agPwdForget' */'./components/ag_pwd_forget'),
        agLogin: () => import(/* webpackChunkName: 'agLogin' */'./components/aglogin'),
        account: () => import(/* webpackChunkName: 'account' */'./components/account'),
        post: () => import(/* webpackChunkName: 'post' */'./components/post'),
        rebate: () => import(/* webpackChunkName: 'rebate' */'./components/rebate')
    },
    computed: {
        ...mapGetters({
            isWebview: 'getIsWebview',
            loginStatus: 'getLoginStatus',
            agentIsLogin: 'getAgentIsLogin',
            popData: 'getPopData',
            postData: 'getPost',
            popType: 'getPopType',
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo',
            agentInfo: 'getAgentInfo'
        }),
        isPopShow() {
            const isLogin = this.loginStatus ? 'Y' : 'N';
            const cookieName = `postStatus${isLogin + this.postData.config.last_modified_at}`;

            if (this.popType === 'post') {
                return !(this.postData.list.length === 0 || this.$cookie.get(cookieName) === 'true');
            }

            return !!this.popType;
        },
        theme() {
            switch (this.webInfo.alias) {
                case '27': // 九鼎
                case '185': // 九鼎測試站
                    return '519';
                case '30': // 輝煌正式廳
                case '32': // 輝煌測試廳
                case '177': // 無限層測試廳
                    return 'brilliant';
                case '500000': // 威尼斯人
                case '50': // 威尼斯人
                case '48': // 威尼斯人
                    return 'theme3';
                case '500011': // 必博
                case '52': // 必博
                case '53': // 必博
                    return 'miller';
                default:
                    return 'basic';
            }
        }
    },
    watch: {
        // eslint-disable-next-line
        'memInfo.user.password_reset'() {
            // 會員、代理會員首次登入強制修改密碼
            if (!this.loginStatus || !this.memInfo.user.password_reset || this.isWebview) {
                return;
            }

            const params = {
                type: 'account',
                data: {
                    key: 'password',
                    text: 'S_CHANGE_PASSWD',
                    type: 'password',
                    position: 'member',
                    closeBtnHide: true
                }
            };
            this.actionSetPop(params);
        },
        // eslint-disable-next-line
        'agentInfo.user.password_reset'() {
            // 會員、代理會員首次登入強制修改密碼
            if (!this.agentIsLogin || !this.agentInfo.user.password_reset || this.isWebview) {
                return;
            }

            const params = {
                type: 'account',
                data: {
                    key: 'password',
                    text: 'S_CHANGE_PASSWD',
                    type: 'password',
                    position: 'agent',
                    closeBtnHide: true
                }
            };
            this.actionSetPop(params);
        }
    },
    created() {
        // 會員首次登入強制修改密碼
        if (this.loginStatus && this.memInfo.user.password_reset && !this.isWebview) {
            this.actionSetPop({
                type: 'account',
                data: {
                    key: 'password',
                    text: 'S_CHANGE_PASSWD',
                    type: 'password',
                    position: 'member',
                    closeBtnHide: true
                }
            });
            return;
        }

        // 代理會員首次登入強制修改密碼
        if (this.agentIsLogin && this.agentInfo.user.password_reset && !this.isWebview) {
            this.actionSetPop({
                type: 'account',
                data: {
                    key: 'password',
                    text: 'S_CHANGE_PASSWD',
                    type: 'password',
                    position: 'agent',
                    closeBtnHide: true
                }
            });
        }
    },
    methods: {
        ...mapActions([
            'actionSetPop'
        ]),
        resetPopType() {
            if (this.popType === '') {
                return;
            }
            this.actionSetPop();
        },
        onMaskClick() {
            const {
                popType, popData, loginStatus, agentIsLogin, memInfo, agentInfo, actionSetPop
            } = this;
            const reset = (loginStatus && memInfo.user.password_reset) || (agentIsLogin && agentInfo.user.password_reset);

            // 會員首次登入強制修改密碼
            if (popType === 'account' && popData.type === 'password' && reset) {
                return;
            }

            actionSetPop();
        }
    }
};
</script>

<style lang="scss" module>
.popup-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
}

.mask {
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .5);
    width: 100%;
    height: 100%;
}

// .post-mask {
//     composes: mask;
//     background: url('/static/image/tpl/common/pop/post/bg_gray.png') 0 0 repeat;
// }
</style>
