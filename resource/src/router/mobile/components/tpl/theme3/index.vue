<template>
    <transition name="fade" mode="out-in">
        <router-view />
    </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import store from '@/store';
import appEvent from '@/lib/appEvent';
import 'swiper/dist/css/swiper.css'; // require styles

export default {
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus',
            agentIsLogin: 'getAgentIsLogin',
            memInfo: 'getMemInfo',
            agentInfo: 'getAgentInfo',
            postData: 'getPost'
        })
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
        ])
    }
};
</script>>

<style src="@/css/index.scss" lang="scss"></style>
<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition-duration: .3s;
    transition-property: opacity;
    transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
    opacity: 0
}
</style>
