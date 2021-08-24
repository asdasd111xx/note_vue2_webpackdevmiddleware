<template>
  <mobile-container :class="$style.container">
    <div slot="content" class="content-wrap">
      <iframe :src="campaignUrl"></iframe>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from "vuex";
import mobileContainer from "../common/mobileContainer";
import * as siteConfigOfficial from "@/config/siteConfig/siteConfigOfficial";

export default {
  components: {
    mobileContainer
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    campaignUrl() {
      switch (this.memInfo.user.domain) {
        // 鴨博
        // qa
        case "500015":
          return "https://yb01.iplay.bet/p/2108030001";
          break;
        // demo
        case "69":
          return "https://yb01.iplay.bet/p/2107220001";
          break;
        // 正式
        case "67":
          return "https://yb01.iplay.bet/p/2107230001";
          break;

        default:
          break;
      }
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
iframe {
  width: 100%;
  height: 100vh;
}
div.container {
  background-color: $main_background_white1;
}
</style>
