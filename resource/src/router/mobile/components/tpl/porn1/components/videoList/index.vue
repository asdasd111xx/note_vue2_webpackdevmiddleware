<script>
//影片入口
//免費區流程 (一小格就是一個聽主)(先拿到廳主的token) ()
//1.actionMemInit   await dispatch("actionSetSystemDomain", { isGetFreeSpace: true });  寫死泡泡幣發isGetFreeSpace :free
//2.actionSetSystemDomain    /getspaceIdJWT  payload {spaceId:123(廳主) 密鑰:xxx(寫死)}  responce {jwt=xxxxxxx} 拿到token
//3  /videolist  payload { videoSpaceId: 9(供影商) jwt: xxxxxx } responce {全部標籤}
//1.
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
