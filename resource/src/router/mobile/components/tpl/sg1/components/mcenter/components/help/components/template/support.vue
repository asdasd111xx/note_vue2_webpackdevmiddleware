<template>
  <div slot="content">
    <div :class="$style['section']" style="margin-top: 10px">
      <div
        v-for="(item, index) in data"
        :id="`q-${index}`"
        :class="$style['cell']"
        :key="index"
        @click="handleToggleContent(index)"
      >
        <div :class="$style['cell-header']">
          <div :class="$style['title-icon']">
            <img
              :src="$getCdnPath('/static/image/_new/mcenter/ic_help.png')"
              alt="help"
            />
          </div>

          <div :class="$style['title']">
            {{ item.title }}
          </div>
        </div>

        <div
          :class="[$style['content'], { [$style['active']]: item.isOpen }]"
          :style="{ 'max-height': item.isOpen ? `150vh` : 0 }"
        >
          <div
            v-for="(item, index) in item.list"
            :class="$style['text-block']"
            v-html="item"
          />
        </div>

        <div
          :class="[$style['arrow-btn'], { [$style['active']]: item.isOpen }]"
        >
          <img
            :src="$getCdnPath(`/static/image/_new/mcenter/ic_arrow_next.png`)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import info from "../../json/support.json";
import mixin from '@/mixins/mcenter/help/help';

export default {
  mixins: [mixin],
  created() {
    this.source = info;
  },
};
</script>
<style src="../../css/index.module.scss" lang="scss" module>
