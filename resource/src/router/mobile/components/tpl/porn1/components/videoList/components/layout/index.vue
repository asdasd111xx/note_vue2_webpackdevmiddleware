<script>
//影片入口
//以鴨脖視頻為例
//首頁開啟遊戲時，game.type===link_to 且 game.vendor===YB 會this.$router.push({name: "videoList", query: { source: "yabo" }});
//進來之後用source去判斷是哪種影片
//傳入參數進入 /layout/yabo/videoLobby
</script>

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

      case "smallPig": //????好像曾經是我們做的，現在不會走進來了 (homeContent game.vendor === PV)
        setCookie("s_id", this.siteConfig.PORN_CONFIG.ID["SP"]);
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
