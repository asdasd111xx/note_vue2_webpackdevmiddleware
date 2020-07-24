<template>
  <div :class="['clearfix']">
    <div v-for="(item, index) in imgList" :class="$style['discount-item']">
      <img :src="$getCdnPath(item)" :key="index" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import yaboRequest from '@/api/yaboRequest';

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
    yaboRequest({
      method: 'get',
      url: this.siteConfig.YABO_API_DOMAIN + '/System/quotaad',
    }).then((res) => {
      this.imgList = res.data;
    });
  },
};
</script>
<style lang="scss" src="../css/index.module.scss" module></style>
