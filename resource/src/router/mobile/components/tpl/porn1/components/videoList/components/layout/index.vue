<template>
  <div>
    <template
      v-if="
        Object.keys(this.$route.query).indexOf('tagId') !== -1 &&
          Object.keys(this.$route.query).indexOf('sortId') !== -1
      "
    >
      <component
        :is="currentLayout.videoMore"
        :set-header-title="setHeaderTitle"
        :set-has-search-btn="setHasSearchBtn"
      />
    </template>

    <template v-else>
      <component
        :is="currentLayout.videoLobby"
        :set-header-title="setHeaderTitle"
        :set-has-search-btn="setHasSearchBtn"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { setCookie } from "@/lib/cookie";

export default {
  components: {
    // 套用 yabo 版面
    yaboVideoLobby: () => import("../layout/yabo/videoLobby"),
    yaboVideoMore: () => import("../layout/yabo/videoMore"),
    gayVideoLobby: () => import("../layout/yabo/videoLobby"),
    gayVideoMore: () => import("../layout/yabo/videoMore"),
    lesVideoLobby: () => import("../layout/yabo/videoLobby"),
    lesVideoMore: () => import("../layout/yabo/videoMore"),
    // 套用 custom 版面 - 小豬
    smallPigVideoLobby: () => import("../layout/custom/videoLobby"),
    smallPigVideoMore: () => import("../layout/custom/videoMore")
  },
  props: {
    source: {
      type: String,
      default: "yv"
    },
    setHeaderTitle: {
      type: Function,
      default: () => {}
    },
    setHasSearchBtn: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      currentLayout: {}
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    })
  },
  created() {
    this.setHeaderTitle(localStorage.getItem("iframe-third-url-title"));

    switch (this.source) {
      case "free-yv":
      case "yv":
        setCookie("s_id", this.siteConfig.PORN_CONFIG.ID["YV"]);
        break;
      case "av":
        setCookie("s_id", this.siteConfig.PORN_CONFIG.ID["AV"]);
        break;

      default:
        setCookie(
          "s_id",
          this.siteConfig.PORN_CONFIG.ID[this.source.toUpperCase()]
        );
        break;
    }

    switch (this.source) {
      case "free-yv":
      case "av":
      case "yv":
        this.currentLayout = {
          videoLobby: "yaboVideoLobby",
          videoMore: "yaboVideoMore"
        };
        break;

      case "smallPig":
        this.currentLayout = {
          videoLobby: "smallPigVideoLobby",
          videoMore: "smallPigVideoMore"
        };
        break;

      case "gay":
        this.currentLayout = {
          videoLobby: "gayVideoLobby",
          videoMore: "gayVideoMore"
        };
        break;

      case "les":
        this.currentLayout = {
          videoLobby: "lesVideoLobby",
          videoMore: "lesVideoMore"
        };
        break;
    }
  },
  watch: {
    "$route.query"() {
      if (this.$route.query.sortId && this.$route.query.tagId) {
        this.setHeaderTitle(this.$text("S_FULL_HD_MOVIE", "全部高清影片"));
        return;
      }
    }
  }
};
</script>

<style lang="scss" module></style>
