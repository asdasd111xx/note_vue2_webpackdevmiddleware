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
        :siteId="currentLayout.siteId"
      />
    </template>

    <template v-else>
      <component
        :is="currentLayout.videoLobby"
        :set-header-title="setHeaderTitle"
        :set-has-search-btn="setHasSearchBtn"
        :siteId="currentLayout.siteId"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

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
      default: "yabo"
    },
    setHeaderTitle: {
      type: Function,
      default: () => { }
    },
    setHasSearchBtn: {
      type: Function,
      default: () => { }
    }
  },
  data() {
    return {
      currentLayout: {}
    };
  },
  created() {
    switch (this.source) {
      case "yabo":
        this.currentLayout = {
          siteId: 1,
          videoLobby: "yaboVideoLobby",
          videoMore: "yaboVideoMore",
          setHeaderTitle: () => {
            this.setHeaderTitle("鸭脖视频");
          }
        };
        break;

      case "smallPig":
        this.currentLayout = {
          siteId: 2,
          videoLobby: "smallPigVideoLobby",
          videoMore: "smallPigVideoMore",
          setHeaderTitle: () => {
            this.setHeaderTitle("小猪视频");
          }
        };
        break;

      case "gay":
        this.currentLayout = {
          siteId: 3,
          videoLobby: "gayVideoLobby",
          videoMore: "gayVideoMore",
          setHeaderTitle: () => {
            this.setHeaderTitle("男男视频");
          }
        };
        break;

      case "les":
        this.currentLayout = {
          siteId: 4,
          videoLobby: "lesVideoLobby",
          videoMore: "lesVideoMore",
          setHeaderTitle: () => {
            this.setHeaderTitle("女女视频");
          }
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

      this.currentLayout.setHeaderTitle();
    }
  }
};
</script>

<style lang="scss" module></style>
