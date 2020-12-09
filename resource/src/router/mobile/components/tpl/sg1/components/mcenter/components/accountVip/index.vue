<template>
  <div :class="$style['content-wrap']">
    <vip />
  </div>
</template>

<script>
import vip from "@/router/mobile/components/tpl/porn1/components/mcenter/components/accountVip/components/vip";

export default {
  components: {
    vip
  }
};
</script>

<style lang="scss" module>
.content-wrap {
  padding-bottom: 60px;
  background: #eee;
  overflow: hidden auto;
}
</style>
