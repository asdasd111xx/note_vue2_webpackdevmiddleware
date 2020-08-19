<template>
  <div :class="$style['content-wrap']">
    <div :class="$style['section']">
      <div
        v-for="(item, index) in data"
        :id="`q-${index}`"
        :class="[$style['cell'], { [$style['active']]: true }]"
        :key="index"
      >
        <template v-if="item.title && item.content">
          <div :class="[$style['title'], $style['red']]">
            {{ item.title }}
          </div>

          <div :class="[$style['content'], { [$style['active']]: true }]">
            <div
              v-for="(item, index) in item.content"
              :class="$style['text-block']"
              v-html="item"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import info from '../../json/rules.json';
import mixin from '@/mixins/mcenter/help/help';

export default {
  mixins: [mixin],
  created() {
    this.source = info;
  },
};
</script>
<style lang="scss" module>
@import "../../css/index.module.scss";
</style>

