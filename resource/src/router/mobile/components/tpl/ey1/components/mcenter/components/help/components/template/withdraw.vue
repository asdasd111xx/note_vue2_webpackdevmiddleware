<template>
  <div :class="$style['content-wrap']">
    <div :class="$style['section']">
      <div
        v-for="(item, index) in data"
        :id="`q-${item.key}`"
        :class="[$style['cell'], { [$style['active']]: item.isOpen }]"
        :key="item.key"
      >
        <template v-if="item.title && item.content">
          <div
            :class="$style['title']"
            @click="item.content && handleToggleContent(item.key)"
          >
            {{ item.title }}
          </div>

          <div
            :class="[$style['content'], { [$style['active']]: item.isOpen }]"
            :style="{ 'max-height': item.isOpen ? `unset` : 0 }"
          >
            <div
              v-for="(item, index) in item.content"
              :class="$style['text-block']"
              :key="`content-${index}`"
              v-html="item"
            />
          </div>

          <div
            :class="[$style['arrow-btn'], { [$style['active']]: item.isOpen }]"
            @click="item.content && handleToggleContent(item.key)"
          >
            <img
              :src="$getCdnPath(`/static/image/_new/mcenter/ic_arrow_next.png`)"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import info from '../../json/withdraw.json';
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
