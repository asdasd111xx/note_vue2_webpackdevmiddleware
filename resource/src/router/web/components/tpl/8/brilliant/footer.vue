<template>
    <component :is="theme" />
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        theme30: () => import(/* webpackChunkName: 'theme30' */'../../customizeHome/30/components/footer'),
        theme32: () => import(/* webpackChunkName: 'theme32' */'../../customizeHome/32/components/footer'),
        theme177: () => import(/* webpackChunkName: 'theme177' */'../../customizeHome/177/components/footer')
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            isBackEnd: 'getIsBackEnd',
            siteConfig: 'getSiteConfig'
        }),
        theme() {
            return `theme${this.webInfo.alias}`;
        }
    }
};
</script>
