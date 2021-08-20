<template>
  <!-- 子標題 -->
  <div>
    <div :class="$style['top-link']">
      <div v-for="(item, index) in childItem" :key="`tab-${item.name}`">
        <span
          :class="[$style.link, { [$style.active]: tabCurrent === index }]"
          :style="{ width: `${100 / childItem.length}%` }"
          @click="changeTab(item)"
          >{{ item.text }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  props: {
    childItem: {
      type: Array,
      required: true
    },
    changeTab: {
      type: Function,
      default: () => {}
    }
  },
  created() {},
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    $style() {
      return this[`$style_${this.themeTPL}`] || this.$style_porn1;
    },
    themeTPL() {
      return this.siteConfig.MOBILE_WEB_TPL;
    },
    tabCurrent() {
      let tab = this.childItem.findIndex(item =>
        this.$route.path.includes(item.name)
      );
      return tab === -1 ? 0 : tab;
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
