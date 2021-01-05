<template>
  <mobile-container :has-footer="hasFooter">
    <div slot="content">
      <iframe-content />
    </div>
  </mobile-container>
</template>

<script>
import iframeContent from "@/router/mobile/components/common/iframe";
import mobileContainer from "../common/mobileContainer";

export default {
  components: {
    mobileContainer,
    iframeContent
  },
  computed: {
    hasFooter() {
      const query = this.$route.query;
      return query.hasFooter === undefined ? false : query.hasFooter === "true";
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
</style>
