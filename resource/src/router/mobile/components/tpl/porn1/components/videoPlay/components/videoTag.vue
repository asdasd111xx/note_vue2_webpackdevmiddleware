<template>
  <div :class="[$style['video-tag-wrap'], { [$style['padding']]: padding }]">
    <span v-if="isDialog">标签：</span>
    <div
      v-for="(tTag, index) in tags"
      :key="`tag-${index}`"
      :class="[
        $style['tag'],
        { [$style['custom']]: $route.query.source === 'smallPig' },
        { [$style['custom-dialog']]: isDialog }
      ]"
    >
      {{ tTag }}
    </div>
  </div>
</template>

<script>
import split from "lodash/split";

export default {
  components: {},
  props: {
    tag: {
      type: String,
      required: true
    },
    padding: {
      type: Boolean
    },
    isDialog: {
      type: Boolean
    }
  },
  computed: {
    tags() {
      return split(this.tag, ",");
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.video-tag-wrap {
  color: $main_text_color2;
  text-align: center;
  display: flex;

  overflow-x: auto;

  &.padding {
    padding: 12px 14px 10px 14px;
  }
  > .tag {
    min-width: 62px;
    height: 18px;
    background: #eeeeee;
    border-radius: 9px;
    text-align: center;
    font-size: 10px;
    line-height: 18px;
    font-weight: 400;
    margin-right: 10px;

    &.custom {
      background: #474747;
    }

    &.custom-dialog {
      min-width: 0;
      padding: 0 5px;
      background: #eee;
      color: #333;
    }
  }
}

@media screen and (min-width: $pad) {
  .video-tag-wrap {
    > .tag {
      height: 20px;
      border-radius: 12px;
      line-height: 20px;
    }
  }
}
</style>
