<template>
  <mobile-container :header-config="headerConfig" :hasFooter="false">
    <div slot="content" :class="$style['content-wrap']">
      <forget-pwd @setTitle="t => (title = t)" />
    </div>
  </mobile-container>
</template>
<script>
import { mapGetters } from "vuex";
import mobileContainer from "../common/mobileContainer";
import forgetPwd from "@/router/mobile/components/tpl/porn1/components/forgetPwd/components/index";

export default {
  data() {
    return {
      title: "找回密码" //重设密码
    };
  },
  components: {
    mobileContainer,
    forgetPwd
  },
  computed: {
    ...mapGetters({}),
    headerConfig() {
      return {
        prev: true,
        title: this.title,
        onClick: () => {
          this.$router.back();
        }
      };
    }
  }
};
</script>
<style lang="scss" module>
.content-wrap {
  min-height: calc(100vh - 43px);
  background: #fefefe;
}
</style>
