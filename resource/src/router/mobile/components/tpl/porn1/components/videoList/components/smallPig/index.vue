<template>
  <div>
    <template
      v-if="
        ($route.query.tagId && $route.query.sortId) ||
          ($route.query.tagId === 0 && $route.query.sortId === 0) ||
          ($route.query.tagId === 0 && $route.query.sortId !== 0)
      "
    >
      <video-more
        :set-header-title="setHeaderTitle"
        :set-has-search-btn="setHasSearchBtn"
        :siteId="siteId"
      />
    </template>

    <template v-else>
      <video-lobby
        :set-header-title="setHeaderTitle"
        :set-has-search-btn="setHasSearchBtn"
        :siteId="siteId"
      />
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

/***********************************
 * Source 為 smallPig 最外層的接口元件*
 ***********************************/

export default {
  components: {
    videoLobby: () => import("../layout/custom/videoLobby"),
    videoMore: () => import("../layout/custom/videoMore")
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
      siteId : 2
    }
  },
  watch: {
    "$route.query"() {
      if (this.$route.query.sortId && this.$route.query.tagId) {
        this.setHeaderTitle(this.$text("S_FULL_HD_MOVIE", "全部高清影片"));
        return;
      }

      this.setHeaderTitle("小猪视频");
    }
  }
};
</script>

<style lang="scss" module></style>
