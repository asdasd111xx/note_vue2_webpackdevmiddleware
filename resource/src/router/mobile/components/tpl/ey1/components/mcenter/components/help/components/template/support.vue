<template>
  <div :class="$style['content-wrap']">
    <div :class="$style['section']">
      <div
        v-for="(item, index) in data"
        :id="`q-${index}`"
        :class="[$style['cell'], { [$style['active']]: item.isOpen }]"
        :key="index"
      >
        <template v-if="item.title && item.content">
          <div
            :class="$style['title']"
            @click="item.content && handleToggleContent(index)"
          >
            {{ item.title }}
          </div>

          <div
            :class="[$style['content'], { [$style['active']]: item.isOpen }]"
          >
            <div
              v-for="(string, stringIndex) in item.content"
              :data-key="`${index}`"
              :class="[
                $style['text-block'],
                {
                  [$style['red']]:
                    (stringIndex === 5 && index === 0) ||
                    (stringIndex === 12 && index === 1),
                },
              ]"
              :key="`content-${stringIndex}`"
              v-html="string"
              @click="linkTo('service')"
            />
          </div>

          <div
            :class="[$style['arrow-btn'], { [$style['active']]: item.isOpen }]"
            @click="item.content && handleToggleContent(index)"
          >
            <img
              :src="$getCdnPath(`/static/image/common/arrow_next.png`)"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import info from "../../json/support.json";
import mixin from "@/mixins/mcenter/help/help";

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
