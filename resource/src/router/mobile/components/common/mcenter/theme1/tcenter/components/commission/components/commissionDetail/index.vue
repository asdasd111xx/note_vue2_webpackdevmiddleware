<template>
  <div :class="$style['commission-detail-wrap']">
    <div v-if="!currentInfo.oauth2" :class="$style['tab-wrap']">
      <div
        v-for="(item, index) in tabItem"
        :key="`tab-${item.key}`"
        :class="[
          $style['tab-item'],
          { [$style['is-current']]: currentTab === index }
        ]"
        @click="setCurrentTab(index)"
      >
        {{ item.text }}
      </div>

      <div
        :class="$style['active-slider']"
        :style="{ left: `calc(25% + 50% * ${currentTab})` }"
      />
    </div>

    <assign v-if="currentTemplate === 'assign'" :currentInfo="currentInfo" />
    <record v-if="currentTemplate === 'record'" :currentInfo="currentInfo" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import assign from "./assign";
import record from "./record";

export default {
  components: {
    assign,
    record
  },
  props: {
    currentInfo: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentTab: 0,
      currentTemplate: "assign"
    };
  },
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
    tabItem() {
      return [
        {
          key: "assign",
          text: this.$text("S_ASSIGIN_DETAIL", "派发详情")
        },
        {
          key: "record",
          text: this.$text("S_RECORD_DETAIL", "统计详情")
        }
      ];
    }
  },
  created() {
    //　第三方
    if (this.currentInfo.oauth2) {
      this.currentTemplate = "record";
      return;
    }
  },
  methods: {
    setCurrentTab(index) {
      this.currentTab = index;
      switch (index) {
        case 0:
          this.currentTemplate = "assign";
          break;

        case 1:
          this.currentTemplate = "record";
          break;
      }
    }
  }
};
</script>

<style lang="scss" src="./css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="./css/ey1.module.scss" module="$style_ey1"></style>
<style lang="scss" src="./css/sg1.module.scss" module="$style_sg1"></style>
