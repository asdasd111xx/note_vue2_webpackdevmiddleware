<template>
  <div
    v-if="themeTPL"
    :class="[
      $style['content'],
      {
        [$style['ey1']]: themeTPL === 'ey1'
      }
    ]"
  >
    <div :class="$style['logo-header']">
      <img :src="$getCdnPath(`/static/image/${themeTPL}/common/logo_b.png`)" />
    </div>
    <div :class="$style['title']">{{ $t("ROUTER_404_TITLE") }}</div>
    <div :class="$style['main-img']">
      <img :src="$getCdnPath(`/static/image/${themeTPL}/status/pic_404.png`)" />
    </div>
    <div :class="$style['desc']">{{ $t("ROUTER_404_TEXT2") }}</div>
    <div :class="$style.tips">
      如需帮助，请
      <span @click="$router.push('/mobile/service')">&nbsp;联系客服</span>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import getLang from "@/lib/getLang";
import mixin from "@/mixins/status";

export default {
  mixins: [mixin],
  beforeRouteEnter(to, from, next) {
    getLang({ [Vue.cookie.get("lang") || "zh-cn"]: "" }).then(() => {
      next();
    });
  }
};
</script>
<style lang="scss" src="@/css/router/status.scss" module></style>
