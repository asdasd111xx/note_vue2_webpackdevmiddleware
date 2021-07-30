<template>
  <div :class="$style['third-wrap']">
    <span
      v-for="(item, index) in data"
      :key="index"
      :class="[$style['card-item']]"
      >{{ item.item }}</span
    >
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    data: {
      type: Array,
      require: true
    }
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
      siteConfig: "getSiteConfig"
    })
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";
.third-wrap {
  width: 100%;
  padding-bottom: 10px;
  color: $main_text_color3;
  border-bottom: 2px solid #eee;

  .card-item {
    display: inline-block;
    width: 160px;
    line-height: 20px;
    font-size: 12px;
  }
  .card-item:last-child {
    display: block;
  }
}
</style>
