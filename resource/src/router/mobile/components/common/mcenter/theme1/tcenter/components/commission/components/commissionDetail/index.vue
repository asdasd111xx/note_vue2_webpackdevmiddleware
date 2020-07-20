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
      <div
        :class="$style['active-slider']"
        :style="{ left: `calc(25% + 50% * ${currentTab})` }"
      />
    </div>

    <div :class="$style['detail-container']">
      <component :is="currentTemplate" />
    </div>
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
          key: "record",
          text: this.$text("S_RECORD_DETAIL", "统计详情")
        }
      ];
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

<style lang="scss" module>
@import "~@/css/variable.scss";

.commission-detail-wrap {
}
.tab-wrap {
  position: relative;
  display: flex;
  background: #fff;
  border-bottom: 2px solid #eee;
}

.tab-item {
  flex: 1;
  position: relative;
  height: 42px;
  line-height: 42px;
  text-align: center;
  color: $main_text_color2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.is-current {
    color: $main_text_color4;
  }
}

.active-slider {
  position: absolute;
  width: 40px;
  height: 2px;
  bottom: 0;
  transform: translateX(-50%);
  background: #be9e7f;
  // left: calc(50% / 2 - 20px);
  transition: left 0.31s;
}

.detail-container {
}
</style>
