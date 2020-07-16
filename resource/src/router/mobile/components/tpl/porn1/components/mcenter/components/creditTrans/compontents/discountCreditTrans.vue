<template>
  <div slot="content" :class="[$style['content-wrap'], 'clearfix']">
    <div v-for="(item, index) in discountList" :class="$style['discount-item']">
      <img :src="$getCdnPath(item.imgSrc)" :alt="item.key" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  components: {},
  data() {
    return {
      discountList: [
        {
          key: "discount-1",
          imgSrc: "/static/image/_new/default/bg_banner_d.png"
        },
        {
          key: "discount-1",
          imgSrc: "/static/image/_new/default/bg_banner_d.png"
        }
      ]
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    })
  },
  created() {},
  methods: {
    ...mapActions([
      "actionSetUserBalance",
      "actionSetUserdata",
      "actionSetGlobalMessage"
    ]),
    setCurrentTab(index) {}
  }
};
</script>
<style lang="scss" src="../css/index.module.scss" module></style>
