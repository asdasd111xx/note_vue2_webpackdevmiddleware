<template>
    <div id="main-body" :class="['main-container', 'tpl-8', nowpage.toString(), loginStatus ? 'is-login' : '']">
        <template v-if="isWebview === false">
            <!-- header  -->
            <ele-header />
            <!-- body -->
            <ele-body />
            <!-- footer -->
            <ele-footer v-show="nowpage !== 'mcenter'" />
        </template>
        <!-- 若為Webview則不需要header跟footer -->
        <template v-else>
            <!-- body -->
            <ele-body />
        </template>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .body.brown {
                background: url({{ $getCdnPath('/static/image/tpl/8/bg.jpg') }}) #120C0C 50% 0 no-repeat;
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import eleHeader from './header';
import eleFooter from './footer';
import eleBody from '../../../page';

export default {
    components: {
        eleHeader,
        eleBody,
        eleFooter
    },
    computed: {
        ...mapGetters({
            isWebview: 'getIsWebview',
            sidebarWidth: 'getSidebarWidth',
            isBackEnd: 'getIsBackEnd',
            nowpage: 'getNowpage',
            popType: 'getPopType',
            loginStatus: 'getLoginStatus'
        })
    },
    created() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        ...mapActions([
            'actionSetPop'
        ]),
        /* 監聽裝置 */
        handleResize() {
            const isDesktop = window.innerWidth >= 768 + this.sidebarWidth;
            // popType 符合時, 768 以上要關掉 (前台才動作)
            const popClose = ['nav', 'loginForm', 'loginInfo'];
            if (!this.isBackEnd && isDesktop && popClose.indexOf(this.popType) !== -1) {
                this.actionSetPop();
            }
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" />
