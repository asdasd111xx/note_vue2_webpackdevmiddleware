<template>
    <div class="normal-page mcenter-wrap clearfix">
        <nav-list
            :nav-change-page="navChangePage"
            :list-select="listSelect"
            :list-switch="listSwitch"
            :is-current="$route.params.subId"
        />
        <div class="mcenter-content">
            <div :class="`content-main ${$route.params.subId}`">
                <components :is="$route.params.subId" />
                <loading />
            </div>
            <div class="content-bottom">Copyright © {{ memInfo.config.domain_name[$i18n.locale] }} Reserved.</div>
        </div>
        <!-- 代理中心及會員中心彈窗 -->
        <div v-if="popType === 'note'" class="note-content">
            <note :position="popData" />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
    components: {
        navList: () => import(/* webpackChunkName: 'navList' */'../common/navList'),
        accountData: () => import(/* webpackChunkName: 'accountData' */'../../components/account'),
        accountBankCard: () => import(/* webpackChunkName: 'accountBankCard' */'../../components/bankCard'),
        accountVip: () => import(/* webpackChunkName: 'accountVip' */'../../components/vip'),
        withdraw: () => import(/* webpackChunkName: 'withdraw' */'../../components/withdraw'),
        bankBalanceTran: () => import(/* webpackChunkName: 'bankBalanceTran' */'../../components/balanceTran'),
        bonusAccount: () => import(/* webpackChunkName: 'bonusAccount' */'../../components/bonusAccount'),
        bankRebate: () => import(/* webpackChunkName: 'bankRebate' */'../../components/bankRebate'),
        bankMoneyDetail: () => import(/* webpackChunkName: 'bankMoneyDetail' */'../../components/moneyDetail'),
        commission: () => import(/* webpackChunkName: 'commission' */'../../components/commission'),
        management: () => import(/* webpackChunkName: 'management' */'../../components/management'),
        gameRecord: () => import(/* webpackChunkName: 'gameRecord' */'../../components/gameRecord'),
        betRecord: () => import(/* webpackChunkName: 'betRecord' */'../../components/betRecord'),
        infoMessage: () => import(/* webpackChunkName: 'infoMessage' */'../../components/message'),
        infoPost: () => import(/* webpackChunkName: 'infoPost' */'../../components/post'),
        deposit: () => import(/* webpackChunkName: 'deposit' */'../../components/deposit'),
        note: () => import(/* webpackChunkName: 'note' */'../../components/common/note'),
        feedBack: () => import(/* webpackChunkName: 'feedBack' */'../../components/feedback'),
        vipExclusive: () => import(/* webpackChunkName: 'vipExclusive' */'../../components/vipExclusive'),
        loading: () => import(/* webpackChunkName: 'note' */'../../components/loading')
    },
    props: {
        getMcenterPage: {
            type: Function,
            default: () => {}
        }
    },
    data() {
        return {
            listSwitch: false
        };
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo',
            loginStatus: 'getLoginStatus',
            curLang: 'getCurLang',
            popData: 'getPopData',
            popType: 'getPopType'
        })
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        navChangePage(key) {
            if (this.listSwitch) {
                this.listSwitch = !this.listSwitch;
            }

            this.getMcenterPage(key);
        },
        listSelect() {
            this.listSwitch = !this.listSwitch;
            window.scrollTo(0, 0);
        }
    }
};
</script>

<style lang="scss" src="../../css/template/theme3.scss" scoped></style>
