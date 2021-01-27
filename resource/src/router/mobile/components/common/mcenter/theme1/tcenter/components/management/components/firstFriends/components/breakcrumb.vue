<template>
  <div :class="$style['breakcrumb']">
    <span
      v-for="(friend, index) in list"
      :key="friend.id"
      :class="{
        [$style['current']]: lastIndex === index
      }"
      @click="clickTarget(friend.id, index)"
    >
      {{ friend.alias }}
    </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    depth: {
      type: Number,
      default: 1
    },
    list: {
      type: Array,
      default: []
    }
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
    lastIndex() {
      return this.list.length - 1;
    }
  },
  methods: {
    clickTarget(id, index) {
      // 有需要此需求再開啟
      // this.$emit("click", { id, index });
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.breakcrumb {
  height: 37px;
  line-height: 37px;
  color: #a2a2a2;
  background: #fefffe;
  padding: 0 18px;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow-x: scroll;
  overflow-y: auto;

  span.current {
    color: #2693fc;
  }

  span:not(:last-child)::after {
    content: ">";
    color: #5e626d;
    padding: 0 5px;
  }
}
</style>
