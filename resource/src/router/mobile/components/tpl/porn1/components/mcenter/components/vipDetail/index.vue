<template>
  <mobile-container
    :header-config="headerConfig"
    :has-footer="false"
    :is-app="isApp"
  >
    <div slot="content" :class="$style['content-wrap']">
      <vip-detail />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from "vuex";
import { getCookie } from "@/lib/cookie";
import mobileContainer from "../../../common/mobileContainer";
import vipDetail from "./components/index";

export default {
  components: {
    mobileContainer,
    vipDetail
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      loginStatus: "getLoginStatus",
      siteConfig: "getSiteConfig"
    }),
    headerConfig() {
      return {
        prev: true,
        title: this.$text("S_BETHISTORYBTN", "投注记录"),
        onClick: () => {
          this.$router.back();
        }
      };
    },
    isApp() {
      const isApp = !!(
        (this.$route.query && this.$route.query.app) ||
        (this.$route.query && this.$route.query.APP)
      );
      if (isApp) {
        document.title = "VIP详请";
      }
      return isApp;
    },
    headerConfig() {
      if (this.isApp) {
        return {};
      }

      return {
        prev: true,
        onClick: () => {
          this.$router.back();
        },
        title: "VIP详请"
      };
    }
  },
  created() {
    if (getCookie("cid")) {
      return;
    }

    if (!this.loginStatus) {
      this.$router.push("/mobile/login");
    }
  }
};
</script>
<style lang="scss" module>
.content-wrap {
  padding-top: 10px;
  padding-bottom: 30px;
  background: #eee;
  overflow: hidden auto;
}
</style>
