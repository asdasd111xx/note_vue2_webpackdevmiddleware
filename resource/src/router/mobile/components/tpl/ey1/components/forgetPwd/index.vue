<template>
  <mobile-container :header-config="headerConfig" :hasFooter="false">
    <div slot="content" :class="$style['content-wrap']">
      <forget-pwd :current-method.sync="currentMethod" />
    </div>
  </mobile-container>
</template>
<script>

import axios from 'axios';
import { mapGetters } from 'vuex';
import member from '@/api/member';
import mobileContainer from '../common/mobileContainer';
import forgetPwd from "@/router/mobile/components/tpl/porn1/components/forgetPwd/components/index";

export default {
  components: {
    mobileContainer,
    forgetPwd
  },
  data() {
    return {
      currentMethod: "phone-step-1"
    };
  },
  computed: {
    ...mapGetters({

    }),
    headerConfig() {
      return {
        prev: true,
        title: this.currentMethod === 'phone-step-2' ? '重设密码' : '找回密码',
        onClick: () => { this.$router.back(); },
        noBottomBorder: true
      };
    },
  },
};
</script>
<style lang="scss" module>
.content-wrap {
  min-height: calc(100vh - 43px);
  background: #fefefe;
}
</style>

