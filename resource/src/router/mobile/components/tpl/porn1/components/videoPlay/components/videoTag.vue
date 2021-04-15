<template>
  <div :class="[$style['video-tag-wrap'], { [$style['padding']]: padding }]">
    <div style="min-width:48px;margin: 0 10px 0 0;" v-if="isDialog">标签：</div>
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
  align-items: center;
  color: $main_text_color2;
  display: flex;
  overflow-x: auto;
  width: 100%;

  &.padding {
    padding: 12px 14px 10px 14px;
  }

  > .tag {
    min-width: 60px;
    background: #eeeeee;
    border-radius: 9px;
    text-align: center;
    font-size: 12px;
    line-height: 18px;
    font-weight: 400;
    margin: 0 10px;

    &.custom {
      background: #474747;
    }

    &.custom-dialog {
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
