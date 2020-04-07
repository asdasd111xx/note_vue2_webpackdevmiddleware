<template>
    <div id="main-container" :class="mainClass">
        <tpl-header />
        <tpl-content />
        <tpl-footer />
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import tplHeader from './tplHeader';
import tplContent from './content';
import tplFooter from './tplFooter';

export default {
    components: {
        tplHeader,
        tplContent,
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
