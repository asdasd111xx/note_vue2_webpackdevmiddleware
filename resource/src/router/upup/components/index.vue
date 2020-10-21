<template>
  <div
    v-if="imgSite"
    :class="[
      $style['content'],
      {
        [$style['ey1']]: imgSite === 'ey1'
      }
    ]"
  >
    <div :class="$style['logo-header']">
      <img :src="$getCdnPath(`/static/image/${imgSite}/common/logo_b.png`)" />
    </div>
    <div :class="$style['title']">{{ $t("ROUTER_UPUP_TITLE") }}</div>
    <div :class="$style['main-img']">
      <img
        :src="$getCdnPath(`/static/image/${imgSite}/status/pic_maintain.png`)"
      />
    </div>
    <div :class="[$style['desc'], $style['has-time']]">
      {{ $t("ROUTER_UPUP_TEXT_1") }}
    </div>
    <template v-if="start && end">
      <div :class="$style['time']">
        <div>{{ $text("S_LOCAL_TIME", "当地时间") }} ({{ localGMT }})</div>
        <div>
          <span>{{ start }}</span> ~ <span>{{ end }}</span>
        </div>
      </div>
    </template>

    <div :class="$style.tips">
      如需帮助，请
      <span @click="linkToService">&nbsp;联系客服</span>
    </div>

    <div style="display:none" id="version">{{ version }}</div>
  </div>
</template>

<script>
/* global $ */
import Vue from 'vue';
import store from '@/store';
import member from '@/api/member';
import getLang from '@/lib/getLang';
import mixin from '@/mixins/status';

export default {
  mixins: [mixin],
  data() {
    return {
      start: '',
      end: '',
      username: '',
    };
  },
  beforeRouteEnter(to, from, next) {
    getLang({ [Vue.cookie.get('lang') || 'zh-cn']: '' }).then(() => {
      member.data({
        success: (response) => {
          if (response && response.ret && response.ret.user && response.ret.username) {
            this.username = response.ret.username
          }
          // 測試模式
          if (to.params.mode && to.params.mode === 'test') {
            store.dispatch('actionSetWebInfo', response.ret.user.domain).then(() => {
              next();
            });
          } else {
            next({ path: '/' });
          }
        },
        fail: (response) => {
          store.dispatch('actionSetWebInfo', response.data.extra ? response.data.extra.domain : '').then(() => {
            next((vm) => vm.setData(response.data.extra));
          });
        }
      });
    });
  },
  computed: {
    localGMT() {
      return `GMT${Vue.moment(new Date()).format('Z')}`;
    }
  },
  created() {
    $(document).prop('title', this.$t('S_UNDER_MAINTENANCE'));
  },
  methods: {
    setData(data) {
      if (!data || !data.end_at) return;

      // 將時間統一轉為UTC，再進行本地時區計算
      this.start = Vue.moment(data.start_at).utc().subtract((new Date().getTimezoneOffset() / 60), 'hours').format('YYYY-MM-DD HH:mm:ss');
      this.end = Vue.moment(data.end_at).utc().subtract((new Date().getTimezoneOffset() / 60), 'hours').format('YYYY-MM-DD HH:mm:ss');
    }
  }
};
</script>

<style lang="scss" src="@/css/router/status.scss" module></style>
