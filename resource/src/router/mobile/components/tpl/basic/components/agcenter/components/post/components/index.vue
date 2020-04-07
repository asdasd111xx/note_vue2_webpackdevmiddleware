<template>
    <div :class="`agcenter-wrap agcenter-bg theme-${siteConfig.MOBILE_WEB_TPL}`">
        <div class="agcenter-content-main">
            <post />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import post from '@/router/agent/components/infoPost/components';

export default {
    components: {
        post
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        })
    }
};
</script>
