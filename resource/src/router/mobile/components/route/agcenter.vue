<script>
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
    render(createElement) {
        const routeName = this.$route.name.replace(/^agcenter-/, '');

        return createElement(kebabCase(`${routeName}-porn1`));
    }
};
</script>
