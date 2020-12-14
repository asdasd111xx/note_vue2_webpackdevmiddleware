<template>
  <div :class="['clearfix']">
    <div v-for="(item, index) in imgList" :class="$style['discount-item']">
      <img :src="item" :key="index" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import yaboRequest from "@/api/yaboRequest";
import goLangApiRequest from "@/api/goLangApiRequest";

export default {
  data() {
    return {
      imgList: []
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
  },
  mounted() {
    // yaboRequest({
    //   method: 'get',
    //   url: this.siteConfig.YABO_API_DOMAIN + '/System/quotaad',
    // }).then((res) => {
    //   this.imgList = res.data;
    // });

    goLangApiRequest({
      method: "get",
      url: this.siteConfig.YABO_GOLANG_API_DOMAIN + "/cxbb/System/quotaad"
    }).then(res => {
      this.imgList = res.data;
    });
  }
};
</script>
<style lang="scss" src="../css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/sg1.module.scss" module="$style_sg1"></style>
