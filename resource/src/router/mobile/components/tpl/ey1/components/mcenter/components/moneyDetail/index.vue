<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :class="$style.container"
  >
    <div slot="content" class="content-wrap">
      <money-detail />
    </div>
  </mobile-container>
</template>

<script>
import moneyDetail from '@/router/mobile/components/common/mcenter/theme1/moneyDetail';
import mobileContainer from '../../../common/mobileContainer';

export default {
  components: {
    mobileContainer,
    moneyDetail
  },
  computed: {
    headerConfig() {
      return {
        prev: true,
        title: this.$route.params.page === 'detail' ? '交易详情' : '交易记录',
        onClick: () => {
          this.$router.back();
        }
      };
    }
  }
};
</script>

<style lang="scss" module>
.container {
  position: relative;
  background-color: #f8f8f7;
}
</style>
