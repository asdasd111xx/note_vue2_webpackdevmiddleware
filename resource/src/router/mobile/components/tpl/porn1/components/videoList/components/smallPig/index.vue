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
      />
    </template>

    <template v-else>
      <video-lobby
        :set-header-title="setHeaderTitle"
        :set-has-search-btn="setHasSearchBtn"
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
    videoLobby: () => import("./components/videoLobby"),
    videoMore: () => import("./components/videoMore")
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
  watch: {
    "$route.query"() {
      if (this.$route.query.sortId && this.$route.query.tagId) {
        this.setHeaderTitle(this.$text("S_FULL_HD_MOVIE", "全部高清影片"));
        return;
      }

      this.setHeaderTitle("小猪視頻");
    }
  }
};
</script>

<style lang="scss" module></style>
