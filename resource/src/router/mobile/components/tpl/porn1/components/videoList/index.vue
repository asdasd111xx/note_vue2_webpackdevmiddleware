<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" :class="$style['content-wrap']">
      <component
        :is="template"
        :set-header-title="setHeaderTitle"
        :set-has-search-btn="setHasSearchBtn"
      />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from "vuex";
import mobileContainer from "../common/new/mobileContainer";

export default {
  components: {
    mobileContainer,
    yabo: () => import("./components/yabo/")
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    headerConfig() {
      const name = this.$route.query.source;
      const source = {
        yabo: "鸭脖视频",
        smallPig: "小猪视频"
        // this.$text("S_FULL_HD_MOVIE", "全部高清影片")
      };

      return {
        prev: true,
        isBackgroundGradient: true,
        title: source[name],
        hasSearchBtn: true,
        onClick: () => {
          this.$router.back();
        }
      };
    },
    template() {
      let source = this.$route.query.source;
      return source;
    }
  },
  created() {
    // 由此層(最外層)直接判斷有無登入
    if (
      !this.memInfo.config.content_rating ||
      !this.memInfo.user.content_rating
    ) {
      this.$router.push("/mobile");
    }
  },
  methods: {
    setHeaderTitle(value) {
      this.$set(this.headerConfig, "title", value);
    },
    setHasSearchBtn(value) {
      this.$set(this.headerConfig, "hasSearchBtn", value);
    }
  }
};
</script>

<style lang="scss" module>
.content-wrap {
  background: #eee;
}
</style>
