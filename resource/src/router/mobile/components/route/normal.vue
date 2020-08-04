<script>
import kebabCase from 'lodash/kebabCase';
import config from './config';
import { mapGetters } from 'vuex';

export default {
  components: config.normal,
  computed: {
    ...mapGetters({
      siteConfig: 'getSiteConfig'
    })
  },
  render(createElement) {
    let target = `${this.$route.name}-${this.siteConfig.MOBILE_WEB_TPL}`;
    return createElement(kebabCase(target));
  }
};
</script>
