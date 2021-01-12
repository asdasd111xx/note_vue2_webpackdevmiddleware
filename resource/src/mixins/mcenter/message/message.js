import { getCookie, setCookie } from "@/lib/cookie";
import { mapActions, mapGetters } from "vuex";

import EST from "@/lib/EST";
import Vue from "vue";

export default {
  data() {
    return {};
  },
  filters: {
    dateFormat(date) {
      return EST(Vue.moment(date).format("YYYY-MM-DD HH:mm:ss"));
    },
    shortDateFormat(date) {
      return Vue.moment(EST(date)).format("YYYY-MM-DD");
    }
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    }
  },
  mounted() {},
  methods: {
    setContent(content) {
      if (!content) {
        return;
      }
      let urlRegex = /(https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?/g;
      return content.replace(/\n/g, "<br/>").replace(urlRegex, function(url) {
        return '<a href="' + url + '" target="_blank">' + url + "</a>";
      });
    }
  }
};
