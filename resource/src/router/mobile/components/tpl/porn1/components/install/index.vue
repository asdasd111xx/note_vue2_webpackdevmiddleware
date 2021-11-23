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
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    }),
    src() {
      const { ROUTER_TPL, SITE_NAME } = this.siteConfig;

      const bundleIDList = {
        67: "yaboxxxapp01.com.mobile.webview",
        69: "yb0t.66relish.com/mobile/webview",
        100003: "ybbe1.777vendor.com/mobile/webview",
        500015: "yb01.66boxing.com/mobile/webview",

        41: "",
        74: "",
        100004: "",
        500023: "",

        80: "siguaxxxapp01.com.mobile.webview",
        81: "sgt.66relish.com.mobile.webview",
        100009: "sgbe1.grtymart.com/mobile/webview",
        500035: "sgtt.66boxing.com.mobile.webview",

        92: "aupr1.688lg.com.mobile.webview",
        93: "aude1.688lg.com.mobile.webview",
        9999894: "auqa1.66boxing.com/mobile/webview",

        94: "sppr1.688lg.com.mobile.webview",
        95: "spde1.688lg.com.mobile.webview",
        9999905: "spqa1.66boxing.com/mobile/webview"
      };

      localStorage.setItem(
        "service-app-bundleID",
        bundleIDList[this.memInfo.user.domain]
      );

      localStorage.setItem(
        "YABO_GOLANG_API_DOMAIN",
        this.siteConfig.YABO_GOLANG_API_DOMAIN
      );

      return `/static/tpl/install/index.htm?title=${SITE_NAME}&vendor=${this.memInfo.user.domain}&site=${this.siteConfig.ROUTER_TPL}`;
      // return `/static/tpl/install/${ROUTER_TPL}/index.htm?title=${SITE_NAME}&vendor=${this.memInfo.user.domain}`;
    }
  },
  mounted() {
    document.getElementById("iframe").style.height =
      document.documentElement.clientHeight + "px";
  },
  methods: {
    backPre() {
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
  overflow: hidden;
}
</style>
