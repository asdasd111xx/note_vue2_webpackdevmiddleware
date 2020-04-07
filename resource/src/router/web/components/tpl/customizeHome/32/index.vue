<template>
    <div :class="['customize-home-wrap', isBackEnd ? 'back' : 'front', loginStatus ? 'is-login' : '']">
        <page-header />
        <page-content />
        <page-footer />
    </div>
</template>

<script>
/* global $ */
import { mapGetters } from 'vuex';

export default {
    components: {
        pageHeader: () => import(/* webpackChunkName: 'pageHeader' */'./components/header'),
        pageContent: () => import(/* webpackChunkName: 'pageContent' */'./components/content'),
        pageFooter: () => import(/* webpackChunkName: 'pageFooter' */'./components/footer')
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            loginStatus: 'getLoginStatus'
        })
    },
    created() {
        $('.body').addClass('customize-body-wrap');
    },
    destroyed() {
        $('.body').removeClass('customize-body-wrap');
    }
};
</script>

<style lang="scss" src="./css/index.scss" />
