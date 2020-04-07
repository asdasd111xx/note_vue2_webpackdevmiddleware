<template>
    <div :class="`agcenter-wrap agcenter-bg theme-${siteConfig.MOBILE_WEB_TPL}`">
        <div class="agcenter-content-main">
            <message />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import message from '@/router/agent/components/infoMessage/components';

export default {
    components: {
        message
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        })
    }
};
</script>
