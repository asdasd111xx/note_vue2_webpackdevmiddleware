<template>
  <div :class="['clearfix']">
    <div v-for="(item, index) in imgList" :class="$style['discount-item']">
      <img :src="item.value" :key="index" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import yaboRequest from '@/api/yaboRequest';
import goLangApiRequest from '@/api/goLangApiRequest';

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
  },
  mounted() {
    // yaboRequest({
    //   method: 'get',
    //   url: this.siteConfig.YABO_API_DOMAIN + '/System/quotaad',
    // }).then((res) => {
    //   this.imgList = res.data;
    // });

    goLangApiRequest({
      method: 'get',
      url: this.siteConfig.YABO_GOLANG_API_DOMAIN + '/System/quotaad',
    }).then((res) => {
      console.log("api quotaad test");
      this.imgList = res.data;
    });
  },
};
</script>
<style lang="scss" src="../css/index.module.scss" module></style>
