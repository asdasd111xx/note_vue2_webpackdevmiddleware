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
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .body {
                background: url({{ $getCdnPath('/static/image/tpl/10/header_bg.jpg') }}) #2C1814 50% 0 no-repeat;
            }

            .body.deep-purple {
                background: url({{ $getCdnPath('/static/image/tpl/10/deep_purple/header_bg.jpg') }}) #190037 50% 0 no-repeat;
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
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
