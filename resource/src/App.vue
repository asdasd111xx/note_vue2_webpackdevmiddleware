<template>
  <router-view />
</template>

<script>
/* global $ */
/* eslint no-underscore-dangle: 0 */
import { mapGetters, mapActions } from 'vuex';
import analytics from '@/lib/analytics';
import appEvent from '@/lib/appEvent';
import openGame from '@/lib/open_game';
import * as config from '@/api/bbos/config';

export default {
  data() {
    return {
      setCode: false, // 流量分析代碼設置狀態
      setGtmCode: false // GTM流量分析狀態
    };
  },
  computed: {
    ...mapGetters({
      memInfo: 'getMemInfo',
      loginStatus: 'getLoginStatus'
    })
  },
  watch: {
    memInfo() {
      this.setAnalyticsCode();
      this.setGoogleAnalytics();
    }
  },
  created() {
    if (this.$cookie.get('IS_BB_APP') !== null && this.$cookie.get('IS_BB_APP') === 'Y') {
      appEvent.jsToAppMessage('HOME_PAGE');
      this.actionSetWebview();
    }

    this.$swal.mixin({
      width: '500px',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: this.$t('S_CONFIRM'),
      cancelButtonText: this.$t('S_CANCEL'),
      allowOutsideClick: false,
      allowEscapeKey: false
    });
    // 給研五設定frame高度的function
    window.setFrameHeight = (num) => {
      const frame = window.top.document.getElementById('js-set-height');
      if (frame) {
        frame.height = num;
      }
    };
    // 給體育遊戲觸發事件的function
    window.sportEvent = (type) => {
      if (type === 'GO_IM_SPORT') {
        if (!this.loginStatus) {
          if (window.location.pathname.split('/')[1] === 'mobile') {
            this.$router.push({ name: 'login' });
            return;
          }

          alert(this.$text('S_LOGIN_TIPS', '请先登入'));
          return;
        }

        openGame({ vendor: 'boe', kind: 1 });
      }
    };
    this.setAnalyticsCode();

    this.$socket.onopen = (event) => {
      console.log("opened connection to ", event.target.url);
      console.log(event)
    };
    this.$socket.onerror = (event) => {
      console.log("==> socket error: ", event.target.url);
      console.log(event)
    };
    this.$socket.onmessage = (event) => {
      console.log(event);
    };
    this.$socket.onclose = (event) => {
      console.log("closed connection from ", event.target.url);
    };
  },
  methods: {
    ...mapActions([
      'actionSetWebview'
    ]),
    /* 設定各站的流量分析/站長統計代碼 */
    setAnalyticsCode() {
      if (!this.memInfo.user || !this.memInfo.user.domain || this.setCode) {
        return;
      }
      // 流量分析代碼只能設定一次
      this.setCode = true;

      // live chat 指定帳號資訊
      window.__lc = {
        visitor: {
          name: (this.memInfo.user.username === 'unknown' ? '' : this.memInfo.user.username)
        }
      };

      // 延遲載入流量分析以加快網頁載入速度
      setTimeout(() => {
        analytics({
          domain: this.memInfo.user.domain,
          result: (html) => {
            $('head').append(html);
          }
        });
      }, 3000);
    },
    /* GA流量統計 */
    setGoogleAnalytics() {
      if (window.dataLayer && !this.setGtmCode) {
        // 只能設定一次
        this.setGtmCode = true;

        window.dataLayer.push({
          dep: 2,
          event: 'custom_pageview',
          ga_uid: (!this.memInfo.user || !this.memInfo.user.id ? undefined : (+this.memInfo.user.id).toString(24)),
          ga_user_type: undefined,
          ga_hall_id: 3820325,
          ga_game_group: undefined,
          ga_game_id: undefined,
          ga_domain_id: (!this.memInfo.user || !this.memInfo.user.domain ? undefined : this.memInfo.user.domain)
        });
      }
    }
  }
};
</script>

<style>
body,
html {
  height: 100%;
}
</style>
