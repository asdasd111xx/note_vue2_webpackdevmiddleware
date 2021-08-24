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
        // 絲瓜
        //qa
        case "500035":
          return "https://sgtt.iplay.bet/p/2108030001";
          break;
        //demo
        case "81":
          return "https://sgtt.iplay.bet/p/2108020001";
          break;
        //正式
        case "80":
          return "https://sgtt.iplay.bet/p/2107230001";
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
  border: none;
}
div.container {
  background-color: $main_background_white1;
}
</style>
