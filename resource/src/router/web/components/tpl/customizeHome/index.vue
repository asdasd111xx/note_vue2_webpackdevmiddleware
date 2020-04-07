<template>
    <div>
        <!-- 首頁客製化 -->
        <intro-first30 v-if="nowAlias === '30'" />
        <intro-first32 v-else-if="nowAlias === '32'" />
        <intro-first177 v-else-if="nowAlias === '177'" />
        <intro-first500000 v-else-if="nowAlias === '500000'" />
        <intro-first48 v-else-if="nowAlias === '48'" />
        <intro-first50 v-else-if="nowAlias === '50'" />
        <introFirst500011 v-else-if="nowAlias === '500011'" />
        <introFirst52 v-else-if="nowAlias === '52'" />
        <introFirst53 v-else-if="nowAlias === '53'" />
        <introFirst500013 v-else-if="nowAlias === '500013' || nowAlias === '47'" />
        <introFirst70 v-else-if="nowAlias === '70'" />
        <introFirst71 v-else-if="nowAlias === '71'" />
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    components: {
        introFirst30: () => import(/* webpackChunkName: 'introFirst30' */'./30'),
        introFirst32: () => import(/* webpackChunkName: 'introFirst32' */'./32'),
        introFirst177: () => import(/* webpackChunkName: 'introFirst177' */'./177'),
        introFirst500000: () => import(/* webpackChunkName: 'introFirst500000' */'./500000'),
        introFirst48: () => import(/* webpackChunkName: 'introFirst48' */'./48'),
        introFirst50: () => import(/* webpackChunkName: 'introFirst50' */'./50'),
        introFirst500011: () => import(/* webpackChunkName: 'introFirst500011' */'./500011'),
        introFirst52: () => import(/* webpackChunkName: 'introFirst52' */'./52'),
        introFirst53: () => import(/* webpackChunkName: 'introFirst53' */'./53'),
        introFirst500013: () => import(/* webpackChunkName: 'introFirst500013' */'./500013'),
        introFirst70: () => import(/* webpackChunkName: 'introFirst70' */'./70'),
        introFirst71: () => import(/* webpackChunkName: 'introFirst71' */'./71')
    },
    props: {
        nowAlias: {
            type: String,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd'
        })
    },
    created() {
        this.handleResize();
        window.addEventListener('resize', this.handleResize);
    },
    destroyed() {
        window.removeEventListener('resize', this.handleResize);
    },
    methods: {
        ...mapActions([
            'actionSetPop'
        ]),
        /* 監聽裝置 */
        handleResize() {
            const isDesktop = window.innerWidth >= 768 + this.sidebarWidth;

            // popType 符合時, 768 以上要關掉 (前台才動作)
            const popClose = ['nav', 'loginForm', 'loginInfo'];
            if (!this.isBackEnd && isDesktop && popClose.indexOf(this.popType) !== -1) {
                this.actionSetPop();
            }
        }
    }
};
</script>
