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
import { getCookie } from '@/lib/cookie';

export default {
  data() {
    return {
      setCode: false, // 流量分析代碼設置狀態
      setGtmCode: false, // GTM流量分析狀態,
      siteConfigLoad: false,
      memInfoLoad: false,
      reconnectTimer: null // 重新連線WS timer
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: 'getSiteConfig',
      memInfo: 'getMemInfo',
      loginStatus: 'getLoginStatus',
    }),
    isDebug() {
      return process.env.NODE_ENV === 'development' || (this.$route.query & this.$route.query._db)
    }
  },
  watch: {
    memInfo() {
      this.setAnalyticsCode();
      this.setGoogleAnalytics();
      this.memInfoLoad = this.memInfo && this.memInfo.user;
      if (this.memInfoLoad && this.siteConfigLoad) {
        this.connectWS();
      }
    },
    siteConfig() {
      this.siteConfigLoad = this.siteConfig && this.siteConfig.ACTIVES_BOUNS_WEBSOCKET;
      if (this.memInfoLoad && this.siteConfigLoad) {
        this.connectWS();
      }
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

    this.setAnalyticsCode();
  },
  methods: {
    ...mapActions([
      'actionSetWebview'
    ]),
    reconnect() {
      if (this.reconnectTimer) return;
      this.reconnectTimer = setTimeout(() => {
        if (this.isDebug) {
          console.log("[WS]: Reconnecting");
        }
        this.connectWS();
      }, 3000)
    },
    connectWS() {
      try {
        let cid = getCookie('cid') || '';
        if (!cid) return;
        let uri = this.siteConfig.ACTIVES_BOUNS_WEBSOCKET + `?cid=${cid}&domain=${this.memInfo.user.domain}`;
        window.YABO_SOCKET = new WebSocket(uri);
        window.YABO_SOCKET.onmessage = (e) => {
          let data = JSON.parse(e.data);
          window.YABO_SOCKET_ID = data.SocketId;

          if (this.isDebug) {
            console.log("[WS]: onMessage:", JSON.parse(e.data));
          }
          //   彩金活動ONMESSAGE
          if (window.YABO_SOCKET_VIDEO_ONMESSAGE) {
            window.YABO_SOCKET_VIDEO_ONMESSAGE(e);
          }
        };
        window.YABO_SOCKET.onerror = (e) => {
          console.log("[WS]: onError:", e)
          this.reconnect();
        };
        window.YABO_SOCKET.onclose = (e) => {
          if (this.isDebug) {
            console.log("[WS]: onClose:", e)
          }
          this.reconnect();
        };
        window.YABO_SOCKET.onopen = (e) => {
          if (this.isDebug) {
            console.log("[WS]: onOpen: Success")
          }
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        };
      } catch (e) {
        console.log("[WS]: connectWS Error:", e);
      }
    },
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
