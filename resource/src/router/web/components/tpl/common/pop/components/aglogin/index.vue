<template>
    <component :is="templateName" />
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        template1: () => import(/* webpackChunkName: 'template1' */'./1'),
        template519: () => import(/* webpackChunkName: 'template519' */'./519')
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo'
        }),
        templateName() {
            switch (this.webInfo.alias) {
                case '27':
                case '185':
                    return 'template519';
                default:
                    return 'template1';
            }
        }
    }
};
</script>
