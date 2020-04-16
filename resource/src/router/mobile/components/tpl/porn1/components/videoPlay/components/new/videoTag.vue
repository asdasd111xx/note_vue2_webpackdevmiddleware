<template>
  <div :class="$style['video-tag-wrap']">
    <div
      v-for="(tTag, index) in tags"
      :key="`tag-${index}`"
      :class="$style['tag']"
    >
      {{ tTag }}
    </div>
    <div
      v-for="(tTag, index) in tags"
      :key="`tag-${index}`"
      :class="$style['tag']"
    >
      {{ tTag }}
    </div>
    <div
      v-for="(tTag, index) in tags"
      :key="`tag-${index}`"
      :class="$style['tag']"
    >
      {{ tTag }}
    </div>
  </div>
</template>

<script>
import split from 'lodash/split';

export default {
  components: {

  },
  props: {
    tag: {
      type: String,
      required: true
    }
  },
  computed: {
    tags() {
      return split(this.tag, ',');
    }
  }
};
</script>

<style lang="scss" module>
@import "~@/css/variable.scss";

.video-tag-wrap {
  color: $main_text_color2;
  padding: 0 14px;
  text-align: center;
  display: flex;
  padding: 12px 14px 10px 14px;
  overflow-x: auto;

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
