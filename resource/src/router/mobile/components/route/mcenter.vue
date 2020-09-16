<script>
import kebabCase from 'lodash/kebabCase';
import config from './config';
import { mapGetters } from 'vuex';

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
    if (from.name === 'home') {
      localStorage.setItem('back', 'home');
    } else if (from.name ==='mcenter-home') {
      localStorage.removeItem('back');
    }
    next();
  },
  render(createElement) {

    const routeName = this.$route.name.replace(/^mcenter-/, '');
    let target = `${routeName}-${this.siteConfig.MOBILE_WEB_TPL}`;

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
