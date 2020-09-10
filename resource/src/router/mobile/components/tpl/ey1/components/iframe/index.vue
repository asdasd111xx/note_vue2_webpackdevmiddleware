<template>
  <mobile-container>
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
};

</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.content-wrap {
  height: 100%;
}
</style>
