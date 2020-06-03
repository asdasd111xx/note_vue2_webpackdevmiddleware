<template>
  <div>
    <template v-if="$route.query.tagId && $route.query.sortId">
      <video-tab :sort-id.sync="sortId" :is-single.sync="isSingle" />
      <video-list :sort-id="sortId" :is-single="isSingle" />
      <!-- <video-more /> -->
    </template>

    <template v-else>
      <video-lobby />
    </template>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  components: {
    videoTab: () => import("./components/videoTab"),
    videoList: () => import("./components/videoList"),
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
  data() {
    return {
      active: +this.$route.query.sortId,
      isOne: false
    };
  },
  computed: {
    sortId: {
      // Todo:這邊由lobby往上傳，再往下more頁做更新
      get() {
        return this.active;
      },
      set(value) {
        this.active = Number(value);
      }
    },
    isSingle: {
      // Todo:這邊由lobby往上傳，再往下more頁做更新
      get() {
        return this.isOne;
      },
      set() {
        this.isOne = !this.isOne;
      }
    }
  }
};
</script>

<style lang="scss" module></style>
