<template>
  <mobile-container :header-config="headerConfig">
    <div slot="content" :class="[$style['content-wrap']]">
      <platform-layout :headerConfig.sync="headerConfig" :source="source" />
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters } from "vuex";
import mobileContainer from "../common/new/mobileContainer";
import platformLayout from "./components/layout/"

export default {
  components: {
    mobileContainer,
    platformLayout
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
    source() {
      let source = this.$route.query.source || "yabo";
      return source;
    }
  },
  created() {
    if (localStorage.getItem('content_rating')) {
      if (localStorage.getItem('content_rating') !== "1") {
        this.$router.push('/mobile');
      }
    } else if (!this.memInfo.config.content_rating || !this.memInfo.user.content_rating) {
      this.$router.push('/mobile');
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
