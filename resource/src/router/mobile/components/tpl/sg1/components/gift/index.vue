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
      return "https://sgtt.iplay.bet/p/2108030001";
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
iframe {
  width: 100vw;
  height: 100vh;
}
div.container {
  background-color: $main_background_white1;
}
</style>
