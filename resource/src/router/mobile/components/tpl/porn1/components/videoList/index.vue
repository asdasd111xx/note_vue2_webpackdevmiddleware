<template>
  <mobile-container
    :header-config="headerConfig"
    :style="{ background: bgColor }"
  >
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
    yabo: () => import("./components/yabo/"),
    smallPig: () => import("./components/smallPig/"),
    gay: () => import("./components/gay/"),
    les: () => import("./components/les/"),
  },
  data() {
    return {
      headerConfig: {
        // Title 由各接口設定
        prev: true,
        isBackgroundGradient: true,
        hasSearchBtn: true,
        onClick: () => {
          this.$router.back();
        }
      }
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),

    template() {
      /* source Type
         yabo => 鴨脖視頻
         smallPig => 小豬視頻
         gay => 男男視頻
         les => 女女視頻
      */
      let source = this.$route.query.source;
      return source;
    },

    bgColor() {
      if (this.template) {
        switch (this.template) {
          case "yabo":
            return "#eee";
            break;

          case "smallPig":
            return "#333";
            break;

          default:
            break;
        }
      }
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
}
</style>
