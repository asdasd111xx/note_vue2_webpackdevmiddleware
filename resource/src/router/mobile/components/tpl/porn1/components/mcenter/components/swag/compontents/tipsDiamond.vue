<template>
  <div :class="$style['tips']">
    <div :class="$style['tips-title']">
      <div :class="$style['hr']"><div /></div>
      <div :class="$style['title-tips']">
        温馨提示，如需帮助
        <span :class="$style['link']" @click="$router.push('/mobile/service')">
          请联系客服
        </span>
      </div>
      <div :class="$style['hr']"><div /></div>
    </div>
    <div :class="$style['tips-content']">
      <template v-if="swagConfig && swagConfig.remind">
        <div v-html="swagConfig.remind.replace(/\n/g, '<br/>')" />
      </template>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import mixin from "@/mixins/mcenter/swag/swag";

export default {
  mixins: [mixin],
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters({
      siteConfig: "getSiteConfig"
    }),
    $style() {
      const style =
        this[`$style_${this.siteConfig.MOBILE_WEB_TPL}`] || this.$style_porn1;
      return style;
    },
  },
};
</script>
<style lang="scss" src="../css/porn1.module.scss" module="$style_porn1"></style>
<style lang="scss" src="../css/sg1.module.scss" module="$style_sg1"></style>
