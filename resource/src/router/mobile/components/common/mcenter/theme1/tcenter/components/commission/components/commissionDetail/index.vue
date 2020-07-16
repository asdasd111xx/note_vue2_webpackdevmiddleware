<template>
  <div :class="$style['commission-detail-wrap']">
    <div :class="$style['tab-wrap']">
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
    </div>

    <div :class="$style['detail-container']">
      <component :is="currentTemplate" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import commissionDetail from "@/mixins/mcenter/commission/commissionDetail";
import assign from "./assign";
import record from "./record";

export default {
  components: {
    assign,
    record
  },
  data() {
    return {
      currentTab: 0,
      currentTemplate: "assign"
    };
  },
  computed: {
    ...mapGetters({
      memInfo: "getMemInfo"
    }),
    tabItem() {
      return [
        {
          key: "assign",
          text: this.$text("S_ASSIGIN_DETAIL", "派发详情")
        },
        {
          key: "assign",
          text: this.$text("S_RECORD_DETAIL", "统计详情")
        }
      ];
    }
  },
  methods: {
    setCurrentTab(index) {
      this.currentTab = 1;
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

<style lang="scss" module></style>
