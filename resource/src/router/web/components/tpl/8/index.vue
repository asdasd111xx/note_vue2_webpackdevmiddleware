<template>
    <components :is="theme" />
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        themeBasic: () => import(/* webpackChunkName: 'themeBasic' */'./basic'),
        themeBrilliant: () => import(/* webpackChunkName: 'themeBrilliant' */'./brilliant')
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo'
        }),
        theme() {
            if (['177', '30', '32'].includes(this.webInfo.alias)) {
                return 'themeBrilliant';
            }

            return 'themeBasic';
        }
    }
};
</script>
