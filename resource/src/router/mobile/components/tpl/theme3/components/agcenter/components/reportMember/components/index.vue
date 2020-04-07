<template>
    <div :class="`agcenter-wrap agcenter-bg theme-${siteConfig.MOBILE_WEB_TPL}`">
        <div class="agcenter-content-main">
            <report-member />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import reportMember from '@/router/agent/components/reportMember/components';

export default {
    components: {
        reportMember
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        })
    }
};
</script>
