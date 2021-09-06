<template>
  <div :class="$style['content-wrap']">
    <div :class="$style['section']">
      <div
        v-for="(item, index) in data"
        :id="`q-${index}`"
        :class="[$style['cell'], $style['active']]"
        :key="index"
      >
        <div v-if="item.title" :class="[$style['title'], $style['big']]">
          {{ item.title }}
        </div>

        <div :class="[$style['content'], $style['active']]">
          <div
            v-for="(string, stringIndex) in item.content"
            :data-key="`${index}`"
            :class="[$style['text-block']]"
            :key="`content-${stringIndex}`"
            v-html="string"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import mixin from "@/mixins/mcenter/help/help";

export default {
  mixins: [mixin],
  created() {
    // this.source = info;
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),

    routerTPL() {
      return this.siteConfig.ROUTER_TPL;
    }
  },
  mounted() {
    fetch(`/i18n/json/${this.routerTPL}/tips.json`)
      .then(res => res.json())
      .then(data => (this.source = data));
  }
};
</script>

<style lang="scss" module>
@import "../../css/index.module.scss";
</style>
