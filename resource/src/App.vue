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
import { getCookie, setCookie } from '@/lib/cookie';
import io from 'socket.io-client';
import yaboRequest from '@/api/yaboRequest';
import CryptoJS from 'crypto-js';
import JsEncrypt from 'jsencrypt';

export default {
  data() {
    return {
      setCode: false, // 流量分析代碼設置狀態
      setGtmCode: false, // GTM流量分析狀態,
      siteConfigLoad: false,
      memInfoLoad: false,
      reconnectTimer: null, // 重新連線WS timer,
      yToken: '',
      AESKey: '',
      IVKey: '',
      RSAPublicKey: `-----BEGIN PUBLIC KEY-----
MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCr7yDK97AYJ3+MxRgs9KnaZkOA
e+bcMxka3kXtpvZyxRX98HB1U50ZIV6TKcNKY0uXz8o3IBOqs+MFN+yzEt0hPS7r
TGyyVIy9SCm9mVuRHkOcR9OyRJU0i+mWtOtisVU8DUYvO8q0jeCX4e20ptk7gx60
Z5fBrZ6/GzeXWjWoKwIDAQAB
-----END PUBLIC KEY-----`,//RSA 公鑰
      RSAPrivateKey: `-----BEGIN RSA PRIVATE KEY-----
MIICXAIBAAKBgQCr7yDK97AYJ3+MxRgs9KnaZkOAe+bcMxka3kXtpvZyxRX98HB1
U50ZIV6TKcNKY0uXz8o3IBOqs+MFN+yzEt0hPS7rTGyyVIy9SCm9mVuRHkOcR9Oy
RJU0i+mWtOtisVU8DUYvO8q0jeCX4e20ptk7gx60Z5fBrZ6/GzeXWjWoKwIDAQAB
AoGAMKLtiNz2MG8D8uNSSm1Pmxtwnujtzn6Z7HLSHz8q2h6McRBSD65+czxwT3rx
5poeKSy7jEqDpbdLUg+W4rVEXgrcqZgD1M+v9FNuh4lWxD4IUbI/P5gi85KWnO8a
GcBg2HJurfO0z5Ph/xlnkEB7ZTpdijOd1JUaQ0HHvZQH7GkCQQDdgO0yo/gXYpEI
Z+Bn4qwf/SYfRiu2flUC1wtK4PsqdYvAZAJis+35zp6GNlINc8PHVkC2HC8RnbNm
/YSfbwIvAkEAxrXtIl4EG8PA2m5LRzsJhSaxAN4IXZXnV/5gavOYKxtGlzbRP9fN
0YLYyrAc2ccLT4ojnUQrWUE8zqgjOGomxQJBAI6H1pnebtbFYyPwi7LtZerTn4NC
SQCOPC+upqKRMK16o+mxsONIeppjPRiJvbTQSCttsgg9DICeZIGiIoPhD5sCQCz/
m8Cxm6qR7MVKPr/VrbU6atDwduKChM4Xa8wsd6QjXBv4LPCRNSmhwOg9c3sZqQUN
Gj2N52ch79w4lSk8WKUCQFP/uuQnBfKnkaX7mdtraBr+hub20yWZ1W3oGqeugCAF
B3SMST7n4gDgAkzqE5Uxhc9QIddVmCmVdpqfcEZLCwk=
-----END RSA PRIVATE KEY-----`,//RSA 私鑰
    };
  },
  computed: {
    ...mapGetters({
      siteConfig: 'getSiteConfig',
      memInfo: 'getMemInfo',
      loginStatus: 'getLoginStatus',
      videoBounsPageStatus: 'getVideoBounsPageStatus',
    }),
    isDebug() {
      return process.env.NODE_ENV === 'development' || (this.$route.query & this.$route.query._db)
    }
  },
  watch: {
    // 彩金頁面才需要重新連線
    videoBounsPageStatus(val) {
      window.YABO_SOCKET_RECONNECT_ACTIVE = val;
    },
    memInfo() {
      this.setAnalyticsCode();
      this.setGoogleAnalytics();
      this.memInfoLoad = this.memInfo && this.memInfo.user;
      if (this.memInfoLoad && this.siteConfigLoad) {
        if (!this.yToken) this.getYABOAPIToken();
        this.getWsV2RSA();
        this.connectYaboWS();
      }
    },
    siteConfig() {
      this.siteConfigLoad = this.siteConfig && this.siteConfig.ACTIVES_BOUNS_WEBSOCKET;
      if (this.memInfoLoad && this.siteConfigLoad) {
        if (!this.yToken) this.getYABOAPIToken();
        this.getWsV2RSA();
        this.connectYaboWS();
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
    /* 推播中心 websocket */
    connectNotifyWS() {
      try {
        // var onSocket, nsp;
        // var reConnectSetting = {
        //   path: '/api/socket.io',
        //   reconnectionAttempts: 5
        // };
        // var socket = io('/namespace', reConnectSetting);
        // socket.on('open', (e) => { console.log(e) });

        // // 取得namespace並連線
        // socket.on('namespace', getNameSpace);

        // function getNameSpace(namespace) {
        //   nsp = namespace.nsp;
        //   socket.disconnect();

        //   onSocket = io(nsp, reConnectSetting);
        //   onSocket.on('message', (data) => {
        //     const lang = 'zh-cn';
        //     const ct = data.message.content;
        //     data.message.text = (textMap[lang] && textMap[lang][ct]) || ct;
        //     console.log(data);
        //     // displayFunc(data);
        //   });
        // }

      } catch (e) {
        console.log(e)
      }
    },
    /* 彩金websocket */
    reconnectYaboWS() {
      if (this.siteConfig.MOBILE_WEB_TPL !== 'porn1') {
        return;
      }

      if (window.YABO_SOCKET_VIDEO_DISCONNECT) {
        window.YABO_SOCKET_VIDEO_DISCONNECT();
      }

      if (this.reconnectTimer) return;
      this.reconnectTimer = setInterval(() => {

        // 是否要啟用重新連接
        if (window.YABO_SOCKET_RECONNECT_ACTIVE) {
          this.isConnecting = false;
          this.connectYaboWS();

          if (this.isDebug) {
            console.log("[WS]: Reconnecting");
          }
        }
      }, 3000)
    },
    connectYaboWS() {
      if (this.isConnecting) return;

      try {
        this.isConnecting = true;
        let cid = getCookie('cid') || '';
        if (!cid) return;
        let uri = this.siteConfig.ACTIVES_BOUNS_WEBSOCKET + `?cid=${cid}&domain=${this.memInfo.user.domain}&userid=${this.memInfo.user.id}`;
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
          clearInterval(this.reconnectTimer);
          this.reconnectTimer = null;
        };
        window.YABO_SOCKET.onerror = (e) => {
          console.log("[WS]: onError:", e)
          this.reconnectYaboWS();
        };
        window.YABO_SOCKET.onclose = (e) => {
          if (this.isDebug) {
            console.log("[WS]: onClose:", e)
          }
          this.reconnectYaboWS();
        };
        window.YABO_SOCKET.onopen = (e) => {
          if (this.isDebug) {
            console.log("[WS]: onOpen: Success")
          }

          if (window.YABO_SOCKET_VIDEO_CONNECT) {
            window.YABO_SOCKET_VIDEO_CONNECT();
          }

          clearInterval(this.reconnectTimer);
          this.reconnectTimer = null;
        };
      } catch (e) {
        this.isConnecting = false;
        console.log("[WS]: connectYaboWS Error:", e);
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
    getYABOAPIToken() {
      setCookie('y-x-domain', this.memInfo.user.domain)
      setCookie('y-username', this.memInfo.user.username)
      let cid = getCookie('cid') || '';
      if (!cid) return;
      yaboRequest({
        method: 'get',
        url: this.siteConfig.YABO_API_DOMAIN + '/Account/GetAuthorizationToken',
      }).then((res) => {
        if (res.data) {
          this.yToken = res.data;
          setCookie('y_token', res.data);
          return;
        }
      });
    },
    getWsV2RSA() {
      yaboRequest({
        method: 'get',
        url: this.siteConfig.YABO_API_DOMAIN.replace('/api', '') + '/wsn/getKey',
      }).then((res) => {
        this.connectYaboWSV2(res);
      });
    },
    connectYaboWSV2(ServerRSAKey) {
      if (this.isConnectingV2) return;

      try {
        this.isConnectingV2 = true;
        let cid = getCookie('cid') || '';
        if (!cid) return;
        let uri = this.siteConfig.ACTIVES_BOUNS_WEBSOCKET + `
        ?cid=${cid}
        &domain=${this.AESencrypt(this.memInfo.user.domain)}
        &userid=${this.AESencrypt(this.memInfo.user.id)}
        &pkey=${this.AESencrypt(this.RSAPublicKey)}
        &akey=${this.RSAencrypt(this.AESKey, ServerRSAKey)}`;
        console.log(`[WSV2]${uri}`);
        window.YABO_SOCKET = new WebSocket(uri);
        window.YABO_SOCKET.onmessage = (e) => {
          let data = JSON.parse(e.data);
          window.YABO_SOCKET_ID = data.SocketId;

          if (this.isDebug) {
            console.log("[WSV2]: onMessage:", JSON.parse(e.data));
          }
          clearInterval(this.reconnectTimerV2);
          this.reconnectTimerV2 = null;
        };
        window.YABO_SOCKET.onerror = (e) => {
          console.log("[WSV2]: onError:", e)
          this.reconnectYaboWSV2();
        };
        window.YABO_SOCKET.onclose = (e) => {
          if (this.isDebug) {
            console.log("[WSV2]: onClose:", e)
          }
          this.reconnectYaboWSV2();
        };
        window.YABO_SOCKET.onopen = (e) => {
          if (this.isDebug) {
            console.log("[WSV2]: onOpen: Success")
          }

          clearInterval(this.reconnectTimerV2);
          this.reconnectTimerV2 = null;
        };
      } catch (e) {
        this.isConnectingV2 = false;
        console.log("[WSV2]: connectYaboWS Error:", e);
      }
    },
    reconnectYaboWSV2() {

      if (this.reconnectTimerV2) return;
      this.reconnectTimerV2 = setInterval(() => {

        // 是否要啟用重新連接
        if (window.YABO_SOCKET_RECONNECT_ACTIVE) {
          this.isConnecting = false;
          this.connectYaboWSV2();

          if (this.isDebug) {
            console.log("[WSV2]: Reconnecting");
          }
        }
      }, 3000)
    },
    /**
 * AES加密 ：字符串 key iv  返回base64
 */
    AESencrypt(word) {
      word = "500015";
      if (this.AESKey === '') {
        this.AESKey = this.AESRandomWord(32)
      }
      if (this.IVKey === '') {
        this.IVKey = this.AESRandomWord(16)
      }
      let key = CryptoJS.enc.Utf8.parse(this.AESKey);
      console.log(`[WSV2]AESencrypt  ${word}: ${this.AESKey}`);
      console.log(`[WSV2]AESencrypt  ${word}: ${this.IVKey}`);

      let encrypted2 = CryptoJS.AES.encrypt(word, this.AESKey, { iv: this.IVKey, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      console.log(`[WSV2]AESencrypt  ${word}: ${encrypted2}`);

      console.log(`[WSV2]AESencrypt  ${word} Utf8: ${key}`);
      console.log(`[WSV2]AESencrypt  ${word} Utf8: ${CryptoJS.enc.Utf8.parse(this.IVKey)}`);
      let srcs = CryptoJS.enc.Utf8.parse(word);
      let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: CryptoJS.enc.Utf8.parse(this.IVKey), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      let hexStr = encrypted.ciphertext.toString().toUpperCase();
      console.log(`[WSV2]AESencrypt  ${word} Utf8: ${encrypted}`);
      return hexStr
    },
    /**
* RSA加密 
*/
    //加密方法
    RSAencrypt(pas, publicKey) {
      //实例化jsEncrypt对象
      let jse = new JSEncrypt();
      //设置公钥
      jse.setPublicKey(publicKey);
      // console.log('加密：'+jse.encrypt(pas))
      return jse.encrypt(pas);
    },

    /**
* 取隨機32碼AES key
*/
    AESRandomWord(count) {
      var str = "",
        range = count,
        arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      // 隨機產生
      for (var i = 0; i < range; i++) {
        str += arr[Math.round(Math.random() * (arr.length - 1))];
      }
      return str;
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
