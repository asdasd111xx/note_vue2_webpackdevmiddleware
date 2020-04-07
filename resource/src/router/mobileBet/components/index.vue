<template>
    <component :is="theme" />
</template>

<script>
import { mapGetters } from 'vuex';
import * as axios from 'axios';
import store from '@/store';
import ajax from '@/lib/ajax';
import i18n from '@/config/i18n';

export default {
    metaInfo: {
        meta: [{
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no'
        }]
    },
    components: {
        mobileBetBasic: () => import(/* webpackChunkName: 'mobileBetBasic' */'@/components/mobileBet/basic'),
        mobileBet519: () => import(/* webpackChunkName: 'mobileBet519' */'@/components/mobileBet/519'),
        mobileBet500000: () => import(/* webpackChunkName: 'mobileBet500000' */'@/components/mobileBet/500000')
    },
    beforeRouteEnter(to, from, next) {
        return axios.all([(async () => {
            await store.dispatch('actionMemInit').then(() => {
                if (!store.state.loginStatus) {
                    store.dispatch('actionAgentInit');
                }
            });
            await ajax({
                method: 'get',
                url: `/i18n/${store.state.curLang}.json`,
                errorAlert: false,
                params: {
                    v: Date.parse(new Date())
                },
                success: (response) => {
                    i18n.setLocaleMessage(store.state.curLang, response);
                }
            });
            await next();
        })()]);
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        }),
        theme() {
            if (this.siteConfig.TESTER === 'Y' && this.$cookie.get('TEST_HOME') === '27') {
                return 'mobile-bet-519';
            }

            if (this.siteConfig.TESTER === 'Y' && this.$cookie.get('TEST_HOME') === '500000') {
                return 'mobile-bet-500000';
            }

            return `mobile-bet-${this.siteConfig.MOBILE_BET_THEME}`;
        }
    }
};
</script>

<style lang="scss" scoped>
.mobile-bet-body {
    height: 100%;
}
</style>
