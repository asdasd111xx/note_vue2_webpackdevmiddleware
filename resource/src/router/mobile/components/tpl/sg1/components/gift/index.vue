<template>
  <mobile-container :class="$style.container">
    <div slot="content" class="content-wrap">
      <div :class="$style['header-title']">
        <img
          :src="
            $getCdnPath(
              `/static/image/common/btn_back_${
                themeTPL === 'porn1'
                  ? 'grey'
                  : themeTPL === 'sg1'
                  ? 'black'
                  : null
              }.png`
            )
          "
          @click="goBack"
        />
        {{ giftTitle }}
      </div>
      <iframe :style="giftIfrStyle" :src="giftIfrUrl"></iframe>
    </div>
  </mobile-container>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mobileContainer from "../common/mobileContainer";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  components: {
    mobileContainer
  },
  data() {
    return {
      url: "",
      giftTitle: ""
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    giftIfrStyle() {
      return {
        width: "100%",
        minHeight: "calc(100vh - 120px)",
        border: "none"
      };
    },
    giftIfrUrl() {
      return `/mobile/iframe/gift?alias=specific_promotion&fullscreen=false&hasHeader=false`;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"]),
    goBack() {
      if (this.$router.history.current.path == "/mobile/gift") {
        window.history.back();
      } else {
        this.$router.push("/mobile");
      }
    }
  },
  created() {}
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

div.container {
  background-color: #f8f8f8;
}

.header-title {
  width: 100%;
  height: 52px;
  background-color: #fff;
  font-size: 1.15rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 8px;
  box-shadow: 0 0.04rem 0.08rem 0 rgba(0, 0, 0, 0.05);
  img {
    width: 20px;
    height: 20px;
    position: absolute;
    left: 15px;
  }
}
</style>
