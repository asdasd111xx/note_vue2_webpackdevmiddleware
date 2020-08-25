<template>
    <ele1 :data="data" />
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        ele1: () => import(/* webpackChunkName: 'ele1' */'./1')
    },
    props: {
        data: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo'
        })
    }
};
</script>
