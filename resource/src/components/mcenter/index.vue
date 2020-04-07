<template>
    <components
        :is="`template-${siteConfig.MCENTER_COLOR}`"
        :class="`theme-${siteConfig.MCENTER_COLOR}`"
        :get-mcenter-page="getMcenterPage"
    />
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import mcenterPageAuthControl from '@/lib/mcenterPageAuthControl';

export default {
    components: {
        templateBasic: () => import(/* webpackChunkName: 'templateBasic' */'./template/basic'),
        templateBrilliant: () => import(/* webpackChunkName: 'templateBrilliant' */'./template/brilliant'),
        templateTheme3: () => import(/* webpackChunkName: 'templateTheme3' */'./template/theme3'),
        templateMiller: () => import(/* webpackChunkName: 'templateMiller' */'./template/miller')
        // template519: () => import(/* webpackChunkName: 'template519' */'./template/519')
    },
    data() {
        return {
            navClicked: false
        };
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo',
            loginStatus: 'getLoginStatus',
            popType: 'getPopType',
            siteConfig: 'getSiteConfig',
            mobileCheck: 'getMobileCheck'
        })
    },
    watch: {
        /* eslint-disable object-shorthand */
        '$route.params.subId'(next, prev) {
            if (next === prev || this.navClicked) {
                this.navClicked = false;
                return;
            }

            this.getMcenterPage(next, true);
        },
        loginStatus() {
            this.checkLogin();
        },
        popType() {
            this.checkLogin();
        }
    },
    created() {
        this.checkLogin();

        if (!this.loginStatus) return;

        // 當前頁
        if (this.$route.params.subId) {
            this.getMcenterPage(this.guidePageInit(this.$route.params.subId), true);
        }
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionEnterMCenterThirdPartyLink',
            'actionSetWithdrawCheck'
        ]),
        checkLogin() {
            if (!this.loginStatus && this.popType === '') {
                this.actionChangePage({ page: this.webInfo.pageData[this.webInfo.page[0].pid].pid, type: 'custom' });
                alert(this.$text('S_LOGIN_TIPS'));
            }
        },
        guidePageInit(pageName) {
            const isBankrupt = this.memInfo.user.bankrupt === '1' && (pageName === 'deposit' || pageName === 'withdraw' || pageName === 'bankBalanceTran');
            const withdrawalMobileCheck = pageName === 'withdraw' && !this.mobileCheck;

            if (isBankrupt || withdrawalMobileCheck) {
                return 'accountData';
            }

            if (pageName === 'tcenter') {
                return 'commission';
            }
            return pageName;
        },
        getMcenterPage(page, firstEnter = false) {
            this.navClicked = true;
            window.scrollTo(0, 0);

            if (page === 'bankRebate') {
                this.actionEnterMCenterThirdPartyLink({ type: 'member', page }).then((pageName) => {
                    if (pageName) {
                        mcenterPageAuthControl(pageName).then((response) => {
                            if (response && response.status) {
                                this.$router.push({ path: `/page/mcenter/${pageName}` });
                                return;
                            }

                            if (firstEnter) {
                                this.$router.push({ path: '/page/mcenter/accountData' });
                            }
                        });
                    }
                });
                return;
            }

            if (page === 'deposit') {
                this.$depositLink(false);
                return;
            }

            this.actionSetWithdrawCheck().then(() => {
                mcenterPageAuthControl(page).then((response) => {
                    if (response && response.status) {
                        this.$router.push({ path: `/page/mcenter/${page}` });
                        return;
                    }

                    if (firstEnter) {
                        this.$router.push({ path: '/page/mcenter/accountData' });
                    }
                });
            });
        }
    }
};
</script>
