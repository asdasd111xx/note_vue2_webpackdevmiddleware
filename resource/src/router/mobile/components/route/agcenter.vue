<script>
import { mapGetters } from 'vuex';
import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import store from '@/store';
import config from './config';

export default {
    components: config.agcenter,
    beforeRouteEnter(to, from, next) {
        store.dispatch('actionAgentInit', () => {
            if (!store.state.agentIsLogin || (store.state.agentInfo.user.id === 0 && store.state.agentInfo.user.username === 'unknown')) {
                next('/mobile');
                return;
            }
            next();
        });
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        })
    },
    render(createElement) {
        const routeName = this.$route.name.replace(/^agcenter-/, '');
        let target = `${routeName}-${this.siteConfig.MOBILE_WEB_TPL}`;

        if (this.siteConfig.TESTER === 'Y' && this.$cookie.get('TEST_MOBILE_TPL') !== null && this.$cookie.get('TEST_MOBILE_TPL') !== '') {
            target = `${routeName}-${this.$cookie.get('TEST_MOBILE_TPL')}`;
        }

        // 檢查模版是否有該頁面
        if (!(this.$options.components[camelCase(target)])) {
            window.location.href = '/mobile';
            return null;
        }

        return createElement(kebabCase(target));
    }
};
</script>
