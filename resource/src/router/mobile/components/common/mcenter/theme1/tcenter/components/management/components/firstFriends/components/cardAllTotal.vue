<template>
  <div :class="$style['card-all-total']">
    <span v-for="(item, index) in data" :key="index">{{ item }}</span>
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

.card-all-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  color: $main_text_color3;
  border-bottom: 2px solid #eee;
}
</style>
