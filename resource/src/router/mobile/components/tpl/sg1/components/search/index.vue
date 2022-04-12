<template>
  <mobile-container :header-config="headerConfig" :hasFooter="false">
    <div slot="content" :class="[$style['content-wrap']]">
      <platform-layout @setHeader="setHeader" :source="source" />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from "vuex";
import mobileContainer from "../common/mobileContainer";
import platformLayout from "@/router/mobile/components/tpl/porn1/components/search/components/layout/";

export default {
  components: {
    mobileContainer,
    platformLayout
  },
  data() {
    return {
      headerObj: {},
      divHeight: null
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    headerConfig() {
      return this.headerObj;
    },
    source() {
      let source = this.$route.query.source;

      // 轉換舊版參數yabo,yv
      if (this.$route.query === "yabo") {
        source = "yv";
      }

      return source;
    }
  },
  created() {
    // if (localStorage.getItem("content_rating")) {
    //   if (localStorage.getItem("content_rating") !== "1") {
    //     this.$router.push("/mobile");
    //   }
    // } else if (
    //   !this.memInfo.config.content_rating ||
    //   !this.memInfo.user.content_rating
    // ) {
    //   this.$router.push("/mobile");
    // }

    if (!this.$route.query.source) {
      this.$router.replace({
        path: "search",
        query: { source: "yv" },
        replace: true
      });
    }
  },
  methods: {
    setHeader(obj) {
      this.headerObj = obj;
    }
  }
};
</script>

<style lang="scss" module>
.content-wrap {
  background: #f8f8f7;
  overflow-y: auto;
}
</style>
