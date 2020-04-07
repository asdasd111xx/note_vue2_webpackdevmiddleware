<template>
    <div :class="`agcenter-wrap agcenter-bg theme-${siteConfig.MOBILE_WEB_TPL}`">
        <div class="agcenter-content-main">
            <feed-back />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import feedBack from '@/router/agent/components/feedBack/components';

export default {
    components: {
        feedBack
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        })
    }
};
</script>
