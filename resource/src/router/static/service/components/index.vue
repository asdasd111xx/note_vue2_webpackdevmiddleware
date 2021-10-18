<template>
  <div v-if="show">
    <component :is="template" :is-static="true" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import porn1Service from "@/router/mobile/components/tpl/porn1/components/service";
import sg1Service from "@/router/mobile/components/tpl/sg1/components/service";
import ey1Service from "@/router/mobile/components/tpl/ey1/components/service";
import * as siteConfigOfficial from "@/config/siteConfig/siteConfigOfficial";
import * as siteConfigTest from "@/config/siteConfig/siteConfigTest";
export default {
  data() {
    return {
      show: false,
      template: null
    };
  },
  components: {
    porn1Service,
    sg1Service,
    ey1Service
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    })
  },
  methods: {
    ...mapActions([
      "actionSetWebDomain",
      "actionSetWebInfo",
      "actionGetMobileInfo"
    ])
  },
  created() {
    this.actionSetWebDomain().then(res => {
      this.actionGetMobileInfo();
      let configInfo = {};

      if (res) {
        configInfo =
          siteConfigTest[`site_${res.domain}`] ||
          siteConfigOfficial[`site_${res.domain}`];
      }

      this.template = `${res.site}Service`;
      if (configInfo) {
        this.show = true;
      }
    });
  }
};
</script>

<style lang="scss" src="@/css/router/500.scss"></style>
