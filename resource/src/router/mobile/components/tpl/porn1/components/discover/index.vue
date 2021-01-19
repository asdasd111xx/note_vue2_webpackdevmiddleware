<template>
  <mobile-container :class="$style.container" :header-config="headerConfig">
    <div slot="content" class="content-wrap">
      <component :is="template" />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from "vuex";
import mobileContainer from "../common/mobileContainer";

export default {
  components: {
    mobileContainer,
    noPorn: () => import("./components/noPorn"),
    discoverHome: () => import("./components/discoverHome"),
    discoverTag: () => import("./components/discoverTag"),
    discoverArtist: () => import("./components/discoverArtist"),
    discoverRank: () => import("./components/discoverRank"),
    discoverSponsor: () => import("./components/discoverSponsor")
  },
  data() {
    return {
      hasPrev: true
    };
  },
  created() {
    // 跳轉頁面需要有返回及不顯示tabbar
    if (this.$route.query.prev !== undefined) {
      this.hasPrev = this.$route.query.prev === "true";
    }
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    isAdult() {
      if (localStorage.getItem("content_rating")) {
        return localStorage.getItem("content_rating") === "1" ? true : false;
      } else {
        return (
          this.memInfo.config.content_rating && this.memInfo.user.content_rating
        );
      }
    },
    headerConfig() {
      const name = this.$route.params.page || "home";
      const trans = {
        home: this.$text("S_DISCOVER", "发现"),
        sponsor: "联盟伙伴",
        rank: this.$text("S_RANK", "排行"),
        artist: this.$text("S_ARTIST", "女优"),
        tag: this.$text("S_TAG", "标签")
      };

      return {
        prev: this.hasPrev,
        isBackgroundGradient: true,
        hasSearchBtn: name === "home" && this.isAdult,
        title: trans[name],
        onClick: () => {
          localStorage.removeItem("discover-tag");
          this.$router.back();
        }
      };
    },
    template() {
      if (this.isAdult) {
        return this.$route.params.page
          ? `discover-${this.$route.params.page}`
          : "discover-home";
      } else {
        let page = this.$route.params.page || "";
        switch (page) {
          case "tag":
          case "artist":
          case "rank":
          case "":
            return "discover-home";
          default:
            return `discover-${page}`;
        }
      }
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

div.container {
  background-color: $main_background_white1;
}
</style>
