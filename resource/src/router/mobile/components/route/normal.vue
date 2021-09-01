<script>
import kebabCase from "lodash/kebabCase";
import config from "./config";
import { mapGetters } from "vuex";

export default {
  components: config.normal,
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    })
  },
  render(createElement) {
    let ROUTER_TPL =
      this.siteConfig.ROUTER_TPL || this.siteConfig.MOBILE_WEB_TPL;
    let target = `${this.$route.name}-${ROUTER_TPL}`;
    return createElement(kebabCase(target));
  }
};
</script>
