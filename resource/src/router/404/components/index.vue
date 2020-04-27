<template>
  <div :class="$style['content']">
    <div :class="$style['logo-header']">
      <img :src="$getCdnPath('/static/image/_new/status/logo_b.png')" />
    </div>
    <div :class="$style['title']">{{ $t("ROUTER_404_TITLE") }}</div>
    <div :class="$style['main-img']">
      <img :src="$getCdnPath('/static/image/_new/status/pic_404.png')" />
    </div>
    <div :class="$style['desc']">{{ $t("ROUTER_404_TEXT2") }}</div>
    <div :class="$style.tips">
      如需帮助，请
      <span @click="$router.push('/mobile/service')">&nbsp;联系客服</span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import getLang from '@/lib/getLang';

export default {
  beforeRouteEnter(to, from, next) {
    getLang({ [Vue.cookie.get('lang') || 'zh-cn']: '' }).then(() => {
      next();
    });
  }
};
</script>
<style lang="scss" src="@/css/router/status.scss" module></style>
