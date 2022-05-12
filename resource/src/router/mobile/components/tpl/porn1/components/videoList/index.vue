<script>
//影片入口
//以鴨脖視頻為例
//首頁開啟遊戲時，game.type===link_to 且 game.vendor===YB 會this.$router.push({name: "videoList", query: { source: "yabo" }}); 進來本vue
//進入<platform-layout :source="source"
//進入之後用source去判斷是哪種影片(並對應去 setCookie("s_id", this.siteConfig.PORN_CONFIG.ID["YV"]);)
//傳入參數進入 /layout/yabo/videoLobby
</script>
<template>
  <mobile-container
    :header-config="headerConfig"
    :style="{ background: bgColor }"
    :has-footer="false"
  >
    <div slot="content">
      <platform-layout
        :source="source"
        :set-header-title="setHeaderTitle"
        :set-has-search-btn="setHasSearchBtn"
      />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from "vuex";
import mobileContainer from "../common/mobileContainer";

export default {
  components: {
    mobileContainer,
    platformLayout: () => import("./components/layout/")
  },
  data() {
    return {
      headerConfig: {
        // Title 由各接口設定
        prev: true,
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
    source() {
      let source = this.$route.query.source;

      // 轉換舊版參數yabo,yv
      if (this.$route.query === "yabo") {
        source = "yv";
      }

      return source;
    },
    bgColor() {
      if (this.source) {
        switch (this.source) {
          case "yv":
            return "#eee";

          case "sp":
            return "#333";

          default:
            break;
        }
      }
    }
  },
  created() {
    // 由此層(最外層)直接判斷有無登入
    if (localStorage.getItem("content_rating")) {
      if (localStorage.getItem("content_rating") !== "1") {
        this.$router.push("/mobile");
      }
    }

    if (!this.$route.query.source || !this.source) {
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

<style lang="scss" module></style>
