<template>
  <mobile-container :class="$style.container">
    <div slot="content" class="content-wrap">
      <iframe src="https://yb01.iplay.bet/p/2108030001"></iframe>
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
    })
    // isAdult() {
    //   if (localStorage.getItem("content_rating")) {
    //     return localStorage.getItem("content_rating") === "1" ? true : false;
    //   } else {
    //     return (
    //       this.memInfo.config.content_rating && this.memInfo.user.content_rating
    //     );
    //   }
    // }
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
