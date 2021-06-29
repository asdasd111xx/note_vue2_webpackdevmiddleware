<template>
  <!-- 返利紀錄 -->
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
      title: "record",
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
        { key: "today", text: this.$text("S_TODDAY", "今日") },
        { key: "yesterday", text: this.$text("S_YESTERDAY", "昨日") },
        { key: "thirty", text: this.$text("S_THIRTY_DAY", "近30日") },
        { key: "range", text: this.$text("S_SEARCH_FOR", "搜索") }
      ];
    }
  },
  methods: {
    changeTab(tabKey) {
      switch (this.childItem[tabKey].key) {
        default:
        case "today":
          this.currentLayout = { vendor: "recordRebate" };
          break;
        case "yesterday":
          this.currentLayout = { vendor: "realRebate" };
          break;
        case "thirty":
          this.currentLayout = { vendor: "profitRebate" };
          break;
        case "range":
          this.currentLayout = { vendor: "recommendGiftRebate" };
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
