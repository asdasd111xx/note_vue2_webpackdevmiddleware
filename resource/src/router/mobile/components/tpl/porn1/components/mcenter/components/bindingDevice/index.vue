<template>
  <mobile-container>
    <div slot="content" :class="$style['content-wrap']">
      <binding-device />
    </div>
  </mobile-container>
</template>

<script>
import bindingDevice from '@/router/mobile/components/common/mcenter/theme1/bindingDevice';
import mobileContainer from '../../../common/mobileContainer';

export default {
  components: {
    mobileContainer,
    bindingDevice
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
