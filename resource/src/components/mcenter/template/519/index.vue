<template>
    <div class="mcenter-bg-wrap">
        <div class="normal-page mcenter-wrap clearfix">
            <div class="body-wrap clearfix">
                <nav-list
                    :nav-change-page="navChangePage"
                    :list-select="listSelect"
                    :list-switch="listSwitch"
                    :is-current="$route.params.subId"
                />
                <div class="mcenter-content">
                    <div class="content-main">
                        <components :is="$route.params.subId" />
                    </div>
                </div>
            </div>
            <div class="content-bottom">Copyright © {{ memInfo.config.domain_name[$i18n.locale] }} Reserved.</div>
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
        betRecord: () => import(/* webpackChunkName: 'betRecord' */'../../components/betRecord'),
        infoMessage: () => import(/* webpackChunkName: 'infoMessage' */'../../components/message'),
        infoPost: () => import(/* webpackChunkName: 'infoPost' */'../../components/post'),
        deposit: () => import(/* webpackChunkName: 'deposit' */'../../components/deposit')
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
            curLang: 'getCurLang'
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

<style lang="scss" src="../../css/template/519.scss" scoped></style>
