<template>
  <mobile-container :class="$style.container">
    <div slot="content" class="content-wrap">
      <iframe :src="url"></iframe>
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
      url: ""
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    })
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"])
  },
  created() {
    goLangApiRequest({
      method: "get",
      url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/External/Url`,
      params: {
        lang: "zh-cn",
        urlName: "specific_promotion",
        needToken: false
      }
    }).then(res => {
      if (res.status === "000") {
        this.url = res.data.uri;
      } else {
        this.actionSetGlobalMessage({
          msg: res.data,
          code: res.errodCode
        });
      }
    });
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
iframe {
  width: 100%;
  height: 100vh;
  border: none;
}
div.container {
  background-color: $main_background_white1;
}
</style>
