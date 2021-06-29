<template>
  <!-- 實時返利 -->
  <div>
    <tcenter-label :child-item="childItem" :change-tab="changeTab" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import tcenterLabel from "../../../tcenterSame/tcenterLabel.vue";

export default {
  components: {
    tcenterLabel
  },
  data() {
    return {
      title: "real",
      currentLayout: {}
    };
  },
  created() {},
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo",
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
    childItem() {
      return [
        { key: "receive", text: this.$text("S_RECEIVE", "领取") },
        { key: "detail", text: this.$text("S_DETAIL", "详情") }
      ];
    }
  },
  methods: {
    changeTab(tabKey) {
      switch (this.childItem[tabKey].key) {
        default:
        case "receive":
          this.currentLayout = { vendor: "recordRebate" };
          break;
        case "detail":
          this.currentLayout = { vendor: "realRebate" };
          break;
      }
      this.$router.replace({
        params: {
          title: this.title,
          item: `${this.childItem[tabKey].key}`
        }
      });
    }
  }
};
</script>

<style></style>
