<script>
import { mapGetters } from 'vuex';
import camelCase from 'lodash/camelCase';
import kebabCase from 'lodash/kebabCase';
import store from '@/store';
import { getCookie } from '@/lib/cookie';
import config from './config';

export default {
  components: config.mcenter,
  props: {
    headerConfig: {
      type: Object,
      default: null
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: 'getSiteConfig'
    }),
    headerConfigValue: {
      get() {
        return this.headerConfig;
      },
      set(value) {
        this.$emit('update:headerConfig', value);
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    const skipValidate = ['519'];

    if (skipValidate.includes(getCookie('TEST_MOBILE_TPL') || store.state.siteConfig.MOBILE_WEB_TPL)) {
      next();
      return;
    }

    // if (!store.state.loginStatus && !['theme3', 'miller'].includes(store.state.siteConfig.MOBILE_WEB_TPL)) {
    //     next('/mobile');
    //     return;
    // }
    next();
  },
  render(createElement) {
    const routeName = this.$route.name.replace(/^mcenter-/, '');
    let target = `${routeName}-${this.siteConfig.MOBILE_WEB_TPL}`;

    if (this.siteConfig.TESTER === 'Y' && this.$cookie.get('TEST_MOBILE_TPL') !== null && this.$cookie.get('TEST_MOBILE_TPL') !== '') {
      target = `${routeName}-${this.$cookie.get('TEST_MOBILE_TPL')}`;
    }

    // 檢查模版是否有該頁面
    if (!(this.$options.components[camelCase(target)])) {
      window.location.href = '/mobile';
      return null;
    }

    return createElement(kebabCase(target), {
      props: {
        headerConfig: this.headerConfigValue
      },
      on: {
        'update:headerConfig': (value) => { this.headerConfigValue = value; }
      }
    });
  }
};
</script>
