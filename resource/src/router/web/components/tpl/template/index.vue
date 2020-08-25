<template>
    <div id="main-container" :class="mainClass">
        <template v-if="isWebview">
            <tpl-body />
        </template>
        <template v-else>
            <tpl-header />
            <tpl-body />
            <tpl-footer v-show="nowpage !== 'mcenter'" />
        </template>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import tplHeader from './tplHeader';
import tplFooter from './tplFooter';
import tplBody from '../../page';

export default {
    components: {
        tplHeader,
        tplBody,
        tplFooter
    },
    computed: {
        ...mapGetters({
            isWebview: 'getIsWebview',
            sidebarWidth: 'getSidebarWidth',
            isBackEnd: 'getIsBackEnd',
            webInfo: 'getWebInfo',
            nowpage: 'getNowpage',
            popType: 'getPopType',
            loginStatus: 'getLoginStatus'
        }),
        mainClass() {
            return [
                'main-container',
                `tpl-${this.webInfo.model}`,
                `page-${this.nowpage.toString()}`,
                { 'is-login': this.loginStatus }
            ];
        }
    }
};
</script>

<style lang="scss" src="./css/index.scss" />
