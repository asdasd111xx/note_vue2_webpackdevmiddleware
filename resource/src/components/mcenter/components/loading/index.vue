<template>
    <div v-if="isLoading" :class="$style['loading-wrap']">
        <div :class="$style['loading-item']">
            <ele-loading />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        eleLoading: () => import(/* webpackChunkName: 'eleLoading' */ '@/router/web/components/tpl/common/element/loading/circle')
    },
    computed: {
        ...mapGetters({
            isLoading: 'getIsLoading'
        })
    }
};
</script>

<style lang="scss" src="./css/index.scss" module></style>
