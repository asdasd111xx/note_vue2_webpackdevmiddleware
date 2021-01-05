<template>
  <mobile-container :header-config="headerConfig" :has-footer="hasFooter">
    <div slot="content">
      <reset-pwd />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "../common/mobileContainer";
import resetPwd from "@/router/mobile/components/tpl/porn1/components/resetPwd/compontents/";
export default {
  components: {
    mobileContainer,
    resetPwd
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig",
      memInfo: "getMemInfo",
      loginStatus: "getLoginStatus"
    }),
    headerConfig() {
      return {
        prev: this.isResetPW ? false : !this.memInfo.user.password_reset,
        onClick: () => {
          this.$router.back();
        },
        title: this.isResetPW
          ? this.$text("S_PASSWORD_RESET", "重设密码")
          : this.$text("S_CHANGE_PASSWD", "修改密码")
      };
    },
    isResetPW() {
      return this.$route.query.page === "pwdreset";
    },
    hasFooter() {
      return this.isResetPW ? false : !this.memInfo.user.password_reset;
    }
  }
};
</script>

<style lang="scss" module></style>
