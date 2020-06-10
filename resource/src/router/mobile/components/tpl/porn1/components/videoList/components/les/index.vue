<template>
  <div>
    <template
      v-if="
        Object.keys(this.$route.query).indexOf('tagId') !== -1 &&
          Object.keys(this.$route.query).indexOf('sortId') !== -1
      "
    >
      <video-more :set-header-title="setHeaderTitle" :siteId="siteId" />
    </template>

    <template v-else>
      <video-lobby :set-header-title="setHeaderTitle" :siteId="siteId" />
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

/********************************
 * Source 為 les 最外層的接口元件  *
 ********************************/

export default {
  components: {
    videoLobby: () => import("../layout/yabo/videoLobby"),
    videoMore: () => import("../layout/yabo/videoMore")
  },
  props: {
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
      siteId: 4
    };
  },
  watch: {
    "$route.query"() {
      if (this.$route.query.sortId && this.$route.query.tagId) {
        this.setHeaderTitle(this.$text("S_FULL_HD_MOVIE", "全部高清影片"));
        return;
      }

      this.setHeaderTitle("女女视频");
    }
  }
};
</script>

<style lang="scss" module></style>
