<template>
    <component
        :is="theme"
        :nav-max="11"
        icon-type="plus"
        animation-type="slide-down"
    />
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        theme30: () => import(/* webpackChunkName: 'theme30' */'../../customizeHome/30/components/nav'),
        theme32: () => import(/* webpackChunkName: 'theme32' */'../../customizeHome/32/components/nav'),
        theme177: () => import(/* webpackChunkName: 'theme177' */'../../customizeHome/177/components/nav')
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

<style lang="scss" src="./css/nav.scss" scoped></style>
