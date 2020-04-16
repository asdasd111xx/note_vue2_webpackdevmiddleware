<template>
  <mobile-container>
    <div slot="content" :class="$style['content-wrap']">
      <mcenter-header :header-setting="headerSetting" />
      <bank-card />
    </div>
  </mobile-container>
</template>

<script>
import mcenterHeader from '@/router/mobile/components/common/mcenter/theme1/header';
import bankCard from '@/components/mcenter/components/bankCard';
import mobileContainer from '../../../common/new/mobileContainer';

export default {
  components: {
    bankCard,
    mcenterHeader,
    mobileContainer
  },
  data() {
    return {
      headerSetting: {
        title: this.$text('S_BIND_BANK', '绑定银行卡'),
        leftBtns: {
          icon: 'arrow',
          onClick: () => this.$router.push('/mobile/mcenter')
        }
      }
    };
  }
};
</script>

<style lang="scss" module>
.content-wrap {
  position: absolute;
  top: 65px;
  right: 0;
  bottom: 45px;
  left: 0;
  background-color: #fff;
}
</style>
