<template>
  <mobile-container :has-footer="hasFooter">
    <div slot="content" :class="$style['content-wrap']">
      <iframe-content />
    </div>
  </mobile-container>
</template>

<script>
import iframeContent from '@/router/mobile/components/common/iframe';
import mobileContainer from '../common/mobileContainer';

export default {
  components: {
    mobileContainer,
    iframeContent
  },
  computed: {
    hasFooter() {
      return this.$route.query.hasFooter !== undefined ? this.$route.query.hasFooter === 'true' : true;
    }
  },
};

</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.content-wrap {
  height: 100%;
}
</style>
