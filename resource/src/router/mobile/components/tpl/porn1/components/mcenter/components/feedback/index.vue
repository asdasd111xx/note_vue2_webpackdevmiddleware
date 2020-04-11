<template>
  <mobile-container>
    <div slot="content" :class="$style['content-wrap']">
      <information />
    </div>
  </mobile-container>
</template>

<script>
import information from '@/router/mobile/components/common/mcenter/theme1/information';
import mobileContainer from '../../../common/new/mobileContainer';

export default {
  components: {
    mobileContainer,
    information
  }
};
</script>

<style lang="scss" module>
.content-wrap {
  position: relative;
  padding: 65px 0 45px;
  background: #eee;
  min-height: calc(100vh);
}
</style>
