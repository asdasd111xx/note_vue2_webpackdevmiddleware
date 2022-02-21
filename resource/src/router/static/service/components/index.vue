<template>
  <div>
    <component
      :is="template"
      :is-static="true"
      :sourceSiteConfig="siteConfig"
    />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import porn1Service from "@/router/mobile/components/tpl/porn1/components/service";
import sg1Service from "@/router/mobile/components/tpl/sg1/components/service";
import * as siteConfigOfficial from "@/config/siteConfig/siteConfigOfficial";
import * as siteConfigTest from "@/config/siteConfig/siteConfigTest";
export default {
  data() {
    return {
      template: null,
      siteConfig: null
    };
  },
  components: {
    porn1Service,
    sg1Service
  },

  methods: {
    ...mapActions(["actionSetWebDomain", "actionGetMobileInfo"])
  },
  created() {
    this.actionSetWebDomain().then(res => {
      this.actionGetMobileInfo();

      if (res) {
        this.siteConfig =
          siteConfigTest[`site_${res.domain}`] ||
          siteConfigOfficial[`site_${res.domain}`];

        if (["sg1"].includes(res.site)) {
          this.template = `${res.site}Service`;
        } else {
          this.template = `porn1Service`;
        }
      }
    });
  }
};
</script>
<style lang="scss" src="@/css/router/status.scss" module></style>
