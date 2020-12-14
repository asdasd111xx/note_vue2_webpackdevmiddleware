<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content" class="content-wrap">
      <recharge />
    </div>
  </mobile-container>
</template>

<script>
import mobileContainer from "../../../common/mobileContainer";
import recharge from '@/router/mobile/components/tpl/porn1/components/mcenter/components/creditTrans/compontents/';

export default {
  components: {
    mobileContainer,
    recharge
  },
  computed: {
    headerConfig() {
      return {
        title: this.$text("S_CREDIT_TRANSFER", "额度转让"),
        prev: true,
        onClick: () => {
          this.$router.back();
        },
      }
    }
  }
};
</script>

<style lang="scss" module>
.container {
}
</style>
