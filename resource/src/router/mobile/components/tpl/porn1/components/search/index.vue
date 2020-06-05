<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" :class="[$style['content-wrap']]">
      <component :is="template" :headerConfig.sync="headerConfig" />
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
    smallPig: () => import("./components/smallPig/")
  },
  data() {
    return {
      headerObj: {}
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    headerConfig: {
      get() {
        return this.headerObj;
      },
      set(value) {
        this.headerObj = value;
      }
    },
    template() {
      let source = this.$route.query.source || "yabo";
      return source;
    }
  },
  created() {
    if (
      !this.memInfo.config.content_rating ||
      !this.memInfo.user.content_rating
    ) {
      this.$router.push("/mobile");
    }

    if (!this.$route.query.source) {
      this.$router.replace({
        path: "search",
        query: { source: "yabo" },
        replace: true
      });
    }
  }
};
</script>

<style lang="scss" module>
.content-wrap {
  background: #f8f8f7;
}
</style>
