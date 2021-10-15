<template>
  <div class="clearfix">
    <div
      v-if="['aobo1'].includes(routerTPL)"
      :class="$style[`discount-wrap-${routerTPL}`]"
    >
      <iframe
        v-if="src"
        :src="src"
        :class="$style[`discount-item-${routerTPL}`]"
      />
    </div>
    <div
      v-else
      v-for="(item, index) in imgList"
      :class="$style['discount-item']"
      :key="`key-${index}`"
    >
      <img :src="item" :key="index" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import goLangApiRequest from "@/api/goLangApiRequest";
import template1 from "../../../../../../../../../web/components/common/securityCheck/components/template1.vue";

export default {
  components: { template1 },
  data() {
    return {
      imgList: [],
      src: ""
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    routerTPL() {
      //先用ROUTER_TPL判斷aobo
      return this.siteConfig.ROUTER_TPL;
    }
  },
  mounted() {
    if (this.routerTPL === "aobo1") {
      let target = "quota_transfer";
      goLangApiRequest({
        method: "get",
        url: `${this.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Link/External/Url`,
        params: {
          urlName: target,
          lang: "zh-cn",
          needToken: "true",
          externalCode: "promotion"
        }
      }).then(res => {
        this.isLoading = false;
        if (res && res.data && res.data.uri) {
          this.src = res.data.uri;
        }

        if (res && res.msg) {
          this.actionSetGlobalMessage({ msg: res.msg });
          return;
        }
      });
    } else {
      goLangApiRequest({
        method: "get",
        url: this.siteConfig.YABO_GOLANG_API_DOMAIN + "/cxbb/System/quotaad"
      }).then(res => {
        this.imgList = res.data;
      });
    }
  },
  methods: {
    ...mapActions(["actionSetGlobalMessage"])
  }
};
</script>
<style lang="scss" src="../css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/sg1.module.scss" module="$style_sg1"></style>
