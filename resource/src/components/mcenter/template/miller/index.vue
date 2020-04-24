<template>
    <div
        ref="mcenterWrapBox"
        :class="$style['mcenter-wrap']"
    >
        <div :class="[$style['main-wrap'], 'clearfix']">
            <nav-list
                :nav-change-page="navChangePage"
                :list-select="listSelect"
                :list-switch="listSwitch"
                :is-current="$route.params.subId"
                :style="{'min-height':contentHeight}"
            />
            <div
                :class="$style['mcenter-content']"
                :style="removeTop"
            >
                <div :class="[$style['content-main'], $style[$route.params.subId]]" :style="`min-height:${contentHeight}; ${removeTop}`">
                    <components :is="$route.params.subId" />
                    <loading />
                </div>
            </div>
        </div>
        <!-- 代理中心及會員中心彈窗 -->
        <div v-if="popType === 'note'" :class="$style['note-content']">
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
        accountVip: () => import(/* webpackChunkName: 'accountVip' */'../../components/vip'),
        bonusAccount: () => import(/* webpackChunkName: 'bonusAccount' */'../../components/bonusAccount'),
        // commission: () => import(/* webpackChunkName: 'commission' */'../../components/commission'),
        bankBalanceTran: () => import(/* webpackChunkName: 'bankBalanceTran' */'../../components/balanceTran/'),
        accountBankCard: () => import(/* webpackChunkName: 'accountBankCard' */'../../components/bankCard/'),
        // management: () => import(/* webpackChunkName: 'management' */'../../components/management'),
        // gameRecord: () => import(/* webpackChunkName: 'gameRecord' */'../../components/gameRecord'),
        bankRebate: () => import(/* webpackChunkName: 'bankRebate' */'../../components/bankRebate'),
        bankMoneyDetail: () => import(/* webpackChunkName: 'bankMoneyDetail' */'../../components/moneyDetail'),
        betRecord: () => import(/* webpackChunkName: 'betRecord' */'../../components/betRecord'),
        infoMessage: () => import(/* webpackChunkName: 'infoMessage' */'../../components/message'),
        note: () => import(/* webpackChunkName: 'note' */'../../components/common/note'),
        deposit: () => import(/* webpackChunkName: 'deposit' */'../../components/deposit/'),
        infoPost: () => import(/* webpackChunkName: 'infoPost' */'../../components/post'),
        withdraw: () => import(/* webpackChunkName: 'deposit' */'../../components/withdraw/'),
        feedBack: () => import(/* webpackChunkName: 'feedBack' */'../../components/feedback'),
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
            listSwitch: false,
            contentHeight: ''
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
        }),
        removeTop() {
            return ['management', 'commission'].includes(this.$route.params.subId) ? 'padding-top: 0' : '';
        }
    },
    created() {
        this.actionSetUserdata();
    },
    update() {
        this.getHeight();
    },
    mounted() {
        this.getHeight();
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionSetUserdata'
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
        },
        getHeight() {
            setTimeout(() => {
                this.contentHeight = `${this.$refs.mcenterWrapBox.offsetHeight}px`;
            }, 500);
        }
    }
};
</script>

<style lang="scss" src="../../css/template/miller.scss" module></style>
