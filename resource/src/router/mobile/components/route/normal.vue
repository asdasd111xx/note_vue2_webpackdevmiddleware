<script>
import { mapGetters } from 'vuex';
import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import config from './config';

export default {
    components: config.normal,
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        })
    },
    render(createElement) {
        let target = `${this.$route.name}-${this.siteConfig.MOBILE_WEB_TPL}`;

        if (this.siteConfig.TESTER === 'Y' && this.$cookie.get('TEST_MOBILE_TPL') !== null && this.$cookie.get('TEST_MOBILE_TPL') !== '') {
            target = `${this.$route.name}-${this.$cookie.get('TEST_MOBILE_TPL')}`;
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
