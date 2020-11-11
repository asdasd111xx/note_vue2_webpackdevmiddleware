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
      RSAPublicKey: ``,//RSA 公鑰
      // MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCr7yDK97AYJ3+MxRgs9KnaZkOA
      // e+bcMxka3kXtpvZyxRX98HB1U50ZIV6TKcNKY0uXz8o3IBOqs+MFN+yzEt0hPS7r
      // TGyyVIy9SCm9mVuRHkOcR9OyRJU0i+mWtOtisVU8DUYvO8q0jeCX4e20ptk7gx60
      // Z5fBrZ6/GzeXWjWoKwIDAQAB
      RSAPrivateKey: ``,//RSA 私鑰
      //       MIICXAIBAAKBgQCr7yDK97AYJ3+MxRgs9KnaZkOAe+bcMxka3kXtpvZyxRX98HB1
      // U50ZIV6TKcNKY0uXz8o3IBOqs+MFN+yzEt0hPS7rTGyyVIy9SCm9mVuRHkOcR9Oy
      // RJU0i+mWtOtisVU8DUYvO8q0jeCX4e20ptk7gx60Z5fBrZ6/GzeXWjWoKwIDAQAB
      // AoGAMKLtiNz2MG8D8uNSSm1Pmxtwnujtzn6Z7HLSHz8q2h6McRBSD65+czxwT3rx
      // 5poeKSy7jEqDpbdLUg+W4rVEXgrcqZgD1M+v9FNuh4lWxD4IUbI/P5gi85KWnO8a
      // GcBg2HJurfO0z5Ph/xlnkEB7ZTpdijOd1JUaQ0HHvZQH7GkCQQDdgO0yo/gXYpEI
      // Z+Bn4qwf/SYfRiu2flUC1wtK4PsqdYvAZAJis+35zp6GNlINc8PHVkC2HC8RnbNm
      // /YSfbwIvAkEAxrXtIl4EG8PA2m5LRzsJhSaxAN4IXZXnV/5gavOYKxtGlzbRP9fN
      // 0YLYyrAc2ccLT4ojnUQrWUE8zqgjOGomxQJBAI6H1pnebtbFYyPwi7LtZerTn4NC
      // SQCOPC+upqKRMK16o+mxsONIeppjPRiJvbTQSCttsgg9DICeZIGiIoPhD5sCQCz/
      // m8Cxm6qR7MVKPr/VrbU6atDwduKChM4Xa8wsd6QjXBv4LPCRNSmhwOg9c3sZqQUN
      // Gj2N52ch79w4lSk8WKUCQFP/uuQnBfKnkaX7mdtraBr+hub20yWZ1W3oGqeugCAF
      // B3SMST7n4gDgAkzqE5Uxhc9QIddVmCmVdpqfcEZLCwk=
      ServerRSAKey: "",
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
        this.getRsaKeys();
        this.getWsV2RSA();
        this.connectYaboWS();
      }
    },
    siteConfig() {
      this.siteConfigLoad = this.siteConfig && this.siteConfig.ACTIVES_BOUNS_WEBSOCKET;
      if (this.memInfoLoad && this.siteConfigLoad) {
        if (!this.yToken) this.getYABOAPIToken();
        this.getRsaKeys();
        this.getWsV2RSA();
        this.connectYaboWS();
      }
    }
  },
  beforeDestroy() {
    document.removeEventListener('visibilitychange', () => { }, false);
    document.removeEventListener('pageshow', () => { }, false);
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

    const self = this;
    const listner = function () {
      const paths = ['card', 'casino'];
      if (!document.hidden && paths.includes(self.$route.name) && window.GAME_RELOAD) {
        console.log('[visibilitychange]:false Reload');
        window.GAME_RELOAD = undefined;
        window.location.reload(true);
      }
    }
    document.addEventListener('visibilitychange', listner);
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
        this.ServerRSAKey = res;
        this.connectYaboWSV2();
      });
    },
    connectYaboWSV2() {
      if (this.isConnectingV2 || window.YABO_SOCKETV2) return;

      try {
        this.isConnectingV2 = true;
        let cid = getCookie('cid') || '';
        let uri = "";
        if (!cid) {
          uri = this.siteConfig.ACTIVES_BOUNS_WEBSOCKETV2 + `platform=Web&domain=${this.AESencrypt(this.memInfo.user.domain)}
        &userid=${this.AESencrypt(this.memInfo.user.id)}
        &pkey=${this.AESencrypt(this.RSAPublicKey)}
        &akey=${this.RSAencrypt(this.AESKey, this.ServerRSAKey)}`;
        } else {
          uri = this.siteConfig.ACTIVES_BOUNS_WEBSOCKETV2 + `cid=${cid}&platform=Web&domain=${this.AESencrypt(this.memInfo.user.domain)}
        &userid=${this.AESencrypt(this.memInfo.user.id)}
        &pkey=${this.AESencrypt(this.RSAPublicKey)}
        &akey=${this.RSAencrypt(this.AESKey, this.ServerRSAKey)}`;
        }
        // console.log(`[WSV2] cid:${cid}`);
        // console.log(`[WSV2]${uri}`);
        window.YABO_SOCKETV2 = new WebSocket(uri);
        window.YABO_SOCKETV2_SEND_EVENT = this.sendYaboWSV2
        window.YABO_SOCKETV2.onmessage = (e) => {
          let data = JSON.parse(e.data);
          let jsonData = JSON.parse(e.data);
          window.YABO_SOCKETV2_ID = this.AESDecrypt(jsonData.Res, this.RSAdecrypt(jsonData.Key)).SocketId;

          if (this.isDebug) {
            console.log("[WSV2]: onMessage:", jsonData);
            // console.log("[WSV2]: onMessage: server AES key", this.RSAdecrypt(jsonData.Key));
            console.log("[WSV2]: onMessage: server res", this.AESDecrypt(jsonData.Res, this.RSAdecrypt(jsonData.Key)));
          }

          clearInterval(this.reconnectTimerV2);
          this.reconnectTimerV2 = null;
        };
        window.YABO_SOCKETV2.onerror = (e) => {
          console.log("[WSV2]: onError:", e)
          this.reconnectYaboWSV2();
        };
        window.YABO_SOCKETV2.onclose = (e) => {
          if (this.isDebug) {
            console.log("[WSV2]: onClose:", e)
          }
          this.reconnectYaboWSV2();
        };
        window.YABO_SOCKETV2.onopen = (e) => {
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
        if (window.YABO_SOCKETV2_RECONNECT_ACTIVE) {
          this.isConnecting = false;
          this.connectYaboWSV2();

          if (this.isDebug) {
            console.log("[WSV2]: Reconnecting");
          }
        }
      }, 3000)
    },


    sendYaboWSV2(event) {
      if (!window.YABO_SOCKETV2) {
        return
      }
      // let cid = getCookie('cid') || '';
      // let req = {
      //   "SocketId": window.YABO_SOCKET_ID,
      //   "Cid": cid,
      //   "Domain": this.memInfo.user.domain,
      //   "UserId": this.memInfo.user.id,
      //   "Type": event,
      //   "SendTime": new Date().toISOString(),
      //   "Data": null
      // }
      // let data = {
      //   "Key": `${this.RSAencrypt(this.AESKey, this.ServerRSAKey)}`,
      //   "Req": `${this.AESencrypt(JSON.stringify(req))}`
      // }
      // if (this.isDebug) {
      //   console.log("[WS]: onSend:", data)
      // }
      // window.YABO_SOCKETV2.send(JSON.stringify(data));
    },
    /**
 * AES加密 ：字符串 key iv  返回base64
 */
    AESencrypt(word) {
      if (this.AESKey === '') {
        this.AESKey = this.AESRandomWord(16);
        this.IVKey = this.AESKey;
      }
      // console.log(`[WSV2]AESencrypt AES ${word}: ${this.AESKey}`);
      let key = CryptoJS.enc.Utf8.parse(this.AESKey);
      // btoa(this.AESKey);//base 64 encode
      let srcs = CryptoJS.enc.Utf8.parse(word);
      let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: CryptoJS.enc.Utf8.parse(this.IVKey), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      // let hexStr = encrypted.ciphertext.toString().toUpperCase();
      // console.log(`[WSV2]AESencrypt  ${word} Utf8: ${encrypted}`);
      return encrypted
    },

    /**
 * AES 解密 ：字符串 key iv  返回base64
 *
 */
    AESDecrypt(word, keyStr) {
      // console.log(`[WSV2]AESencrypt AES 解密: ${atob(keyStr)}`);
      let key = CryptoJS.enc.Utf8.parse(atob(keyStr));
      let iv = key;

      let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
      let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
      let decrypt = CryptoJS.AES.decrypt(word, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
      let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
      // console.log(`[WSV2]AESencrypt AES 解密: ${decryptedStr.toString()}`);
      let responseData = JSON.parse(decryptedStr.toString());
      return responseData;
    },
    /**
* RSA加密
*/
    //加密方法
    RSAencrypt(pas, publicKey) {
      // console.log(`[WSV2]AESencrypt RSA: ${pas}`);
      // pas = 'I15TMSLO0KXUWTHO';
      let base64Pas = btoa(pas);
      // publicKey = this.RSAPublicKey;
      // console.log(`[WSV2]AESencrypt RSA: ${base64Pas}`);
      //实例化jsEncrypt对象
      let jse = new JSEncrypt();
      //设置公钥
      jse.setPublicKey(publicKey);
      // console.log('加密：'+jse.encrypt(pas))
      let RSAdecode = jse.encrypt(base64Pas);
      // console.log(`[WSV2]AESencrypt RSA加密: ${RSAdecode}`);
      // this.RSAdecrypt(jse.encrypt(pas));
      return RSAdecode;
    },

    //解密方法
    RSAdecrypt(pas) {
      let jse = new JSEncrypt();
      // 私钥
      jse.setPrivateKey(this.RSAPrivateKey);
      // console.log('[WSV2]AESencrypt RSA解密：' + jse.decrypt(pas))
      return jse.decrypt(pas);
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

    //获取密钥对
    getRsaKeys(func) {
      window.crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 1024, //can be 1024, 2048, or 4096
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: { name: "SHA-512" }, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
        },
        true, //whether the key is extractable (i.e. can be used in exportKey)
        ["encrypt", "decrypt"] //must be ["encrypt", "decrypt"] or ["wrapKey", "unwrapKey"]
      ).then(key => {
        window.crypto.subtle.exportKey(
          "pkcs8",
          key.privateKey
        ).then(keydata1 => {
          window.crypto.subtle.exportKey(
            "spki",
            key.publicKey
          ).then(keydata2 => {
            let privateKey = this.RSA2text(keydata1, 1);
            let publicKey = this.RSA2text(keydata2);
            this.RSAPrivateKey = privateKey;
            this.RSAPublicKey = publicKey;
            // console.log(`privateKey is :${privateKey}`);
            // console.log(`publicKey is :${publicKey}`);
          }).catch(err => {
            console.error(err);
          });
        })
          .catch(err => {
            console.error(err);
          });
      })
        .catch(err => {
          console.error(err);
        });
    },
    RSA2text(buffer, isPrivate = 0) {
      let binary = '';
      let bytes = new Uint8Array(buffer);
      let len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      let base64 = window.btoa(binary);
      // let text = "-----BEGIN " + (isPrivate ? "PRIVATE" : "PUBLIC") + " KEY-----\n";
      // text += base64.replace(/[^\x00-\xff]/g, "$&\x01").replace(/.{64}\x01?/g, "$&\n");
      // text += "\n-----END " + (isPrivate ? "PRIVATE" : "PUBLIC") + " KEY-----";
      let text = base64.replace(/[^\x00-\xff]/g, "$&\x01").replace(/.{64}\x01?/g, "$&\n");
      return text;
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
