<template>
  <!-- <div class="text">{{ $t("ROUTER_NO_SERVICE_TITLE") }}</div>
    <div class="text">IP：{{ ip }}({{ code }})</div> -->
  <div :class="$style['content']">
    <div :class="$style['logo-header']">
      <img :src="$getCdnPath('/static/image/_new/status/logo_b.png')" />
    </div>
    <div :class="$style['title']">{{ $t("ROUTER_NO_SERVICE_TITLE") }}</div>
    <div :class="$style['main-img']">
      <img :src="$getCdnPath('/static/image/_new/status/pic_403.png')" />
    </div>
    <div :class="$style['desc']">
      {{ $t("ROUTER_NO_SERVICE_TEXT1") }}
      <span>cs2@yaboxxx.net</span>
      {{ $t("ROUTER_NO_SERVICE_TEXT2") }}
    </div>
    <div :class="$style.tips">
      如需帮助，请
      <span @click="$router.push('/mobile/service')">&nbsp;联系客服</span>
    </div>
  </div>
</template>

<script>
import Vue from 'vue';
import member from '@/api/member';
import getLang from '@/lib/getLang';

export default {
  data() {
    return {
      ip: '',
      code: '',
      status: false
    };
  },
  beforeRouteEnter(to, from, next) {
    getLang({ [Vue.cookie.get('lang') || 'zh-cn']: '' }).then(() => {
      next();
    });
  },
  created() {
    member.data({
      success: () => {
        if (this.$route.params.mode && this.$route.params.mode === 'test') {
          this.status = true;
        } else {
          this.$router.push({ path: '/' });
        }
      },
      fail: (response) => {
        this.ip = response.data.ip;
        this.code = response.data.code;
        this.status = true;
      }
    });
  }
};
</script>

<style lang="scss" src="@/css/router/status.scss" module></style>
