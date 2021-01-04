<template>
  <div :class="$style['container']">
    <iframe id="iframe" :src="src" frameborder="0" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    src() {
      switch (this.memInfo.user.domain) {
        //　鴨博
        case "500015":
          return "/static/tpl/install/porn1/qa/index.htm";
          break;

        case "69":
          return "/static/tpl/install/porn1/demo/index.htm";
          break;

        case "67":
          return "/static/tpl/install/porn1/official/index.htm";
          break;

        // 絲瓜
        case "500035":
          return "/static/tpl/install/sg1/qa/index.htm";
          break;

        case "81":
          return "/static/tpl/install/sg1/demo/index.htm";
          break;

        case "80":
          return "/static/tpl/install/sg1/official/index.htm";
          break;

        default:
          break;
      }
    }
  },
  mounted() {
    document.getElementById("iframe").style.height =
      document.documentElement.clientHeight + "px";
  }
};
</script>

<style lang="scss" module>
.container {
  position: relative;
  overflow: hidden;
  padding-bottom: 40px;
}

iframe {
  width: 100%;
  // height: 100vh;
  overflow: hidden;
}
</style>
