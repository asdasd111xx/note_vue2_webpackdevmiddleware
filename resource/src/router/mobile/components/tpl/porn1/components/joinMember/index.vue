<template>
  <mobile-container
    :header-config="headerConfig"
    :class="$style.container"
    :has-footer="false"
  >
    <div slot="content" class="content-wrap">
      <div :class="[$style['join-member-wrap'], $style[routerTPL]]">
        <join-member :theme="$style">
          <template slot="join-header" />
        </join-member>
      </div>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from "vuex";
import joinMember from "@/router/web/components/page/join_member";
import mobileContainer from "../common/mobileContainer";

export default {
  components: {
    joinMember,
    mobileContainer
  },
  data() {
    return {
      script: null
    };
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig",
      activity: "getActivity"
    }),
    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    },
    headerConfig() {
      return {
        prev: true,
        onClick: () => {
          if (this.$route.query.login === "1") {
            this.$router.replace(`/mobile/login`);
          } else {
            this.$router.push(`/mobile/home`);
          }
        },
        hasClose: true,
        title:
          this.activity.isActivity && this.activity.totalAmount > 0
            ? "领取彩金"
            : "访客注册"
      };
    }
  },
  beforeDestroy() {},
  created() {
    if (this.loginStatus) {
      this.$router.push("/mobile");
      return;
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
@import "~@/css/page/joinMem.module.scss";

.join-input {
  background-color: #fff;

  &::placeholder {
    color: #a5a5a5;
  }
}

.js-nc-check-bar {
  max-width: 300px;
  padding: 0;
  width: 100%;
}
</style>
