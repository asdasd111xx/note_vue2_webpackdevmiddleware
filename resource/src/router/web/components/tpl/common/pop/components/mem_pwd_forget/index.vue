<template>
    <components :is="themeType" />
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        theme1: () => import(/* webpackChunkName: 'theme1' */'./1'),
        theme519: () => import(/* webpackChunkName: 'theme519' */'./519')
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo'
        }),
        themeType() {
            if (this.webInfo.alias === '27' || this.webInfo.alias === '185') {
                return 'theme519';
            }
            return 'theme1';
        }
    }
};
</script>
