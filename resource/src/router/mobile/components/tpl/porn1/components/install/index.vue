<template>
  <div :class="$style['container']">
    <div :class="$style['btn-prev']" @click="backPre">
      <img
        :src="$getCdnPath(`/static/image/common/btn_back_black.png`)"
        alt="back"
      />
    </div>
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
  },
  methods: {
    backPre() {
      // this.$router.push("/mobile/mcenter");
      this.$router.back();
    }
  }
};
</script>

<style lang="scss" module>
.container {
  position: relative;
  overflow: hidden;
  padding-bottom: 40px;
}

.btn-prev {
  position: absolute;
  top: 5px;
  left: 5px;
  width: 20px;
  height: 20px;
  margin: auto;

  > img {
    display: block;
    width: 100%;
  }
}

iframe {
  width: 100%;
  // height: 100vh;
  overflow: hidden;
}
</style>
