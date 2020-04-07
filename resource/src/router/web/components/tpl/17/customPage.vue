<template>
    <components :is="templateName" :change-page="changePage" />
</template>

<script>
import { mapActions } from 'vuex';

export default {
    components: {
        live: () => import(/* webpackChunkName: 'pageLive' */'./components/customPage/pageLive'),
        lottery: () => import(/* webpackChunkName: 'pageLottery' */'./components/customPage/pageLottery'),
        app: () => import(/* webpackChunkName: 'pageApp' */'./components/customPage/pageApp'),
        join: () => import(/* webpackChunkName: 'pageJoin' */'./components/customPage/pageJoin'),
        memLogin: () => import(/* webpackChunkName: 'pageMemLogin' */'./components/customPage/pageMemLogin'),
        forgetPw: () => import(/* webpackChunkName: 'pageForgetPw' */'./components/customPage/pageForgetPw'),
        sports: () => import(/* webpackChunkName: 'pageSports' */'./components/customPage/pageSports'),
        esports: () => import(/* webpackChunkName: 'pageEsports' */'./components/customPage/pageEsports'),
        promotions: () => import(/* webpackChunkName: 'pagePromotions' */'./components/customPage/pagePromotions'),
        agent: () => import(/* webpackChunkName: 'pageAgent' */'./components/customPage/pageAgent'),
        agentLogin: () => import(/* webpackChunkName: 'pageAgentLogin' */'./components/customPage/pageAgentLogin'),
        agentJoin: () => import(/* webpackChunkName: 'pageAgentJoin' */'./components/customPage/pageAgentJoin'),
        vip: () => import(/* webpackChunkName: 'pageVip' */'./components/customPage/vip'),
        resetPw: () => import(/* webpackChunkName: 'pageResetPw' */'./components/customPage/pageResetPw')
    },
    props: {
        templateName: {
            type: String,
            default: ''
        }
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        changePage({ type = '', page = '', subPage = '' }) {
            if (this.isBackEnd) {
                return;
            }

            this.actionChangePage({ type, page, subPage });
        }
    }
};
</script>
