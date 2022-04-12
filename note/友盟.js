/*! 2021-09-28 18:01:46 aplus_cloud_um_203467608.js */
//line:593 表單資料轉成base64送出

!(function (e) {
  function t(a) {
    if (n[a]) return n[a].exports;
    var o = (n[a] = { exports: {}, id: a, loaded: !1 });
    return e[a].call(o.exports, o, o.exports, t), (o.loaded = !0), o.exports;
  }
  var n = {};
  return (t.m = e), (t.c = n), (t.p = ''), t(0);
})([
  function (e, t, n) {
    e.exports = n(1);
  },
  function (e, t, n) {
    'use strict';
    n(2).initGlobal(window),
      (function () {
        var e = n(4);
        n(122)(e);
      })();
  },
  function (e, t, n) {
    'use strict';
    var a,
      o = n(3),
      r = o.APLUS,
      i = o.APLUS_QUEUE,
      s = o.GOLDLOG,
      u = o.GOLDLOG_QUEUE,
      c = !1;
    try {
      (a = window), (c = !0);
    } catch (e) {
      a = {};
    }
    (t.getContext = function () {
      return a;
    }),
      (t.initGlobal = function (e) {
        a = e ? e : { v: 1, aplus: {}, aplus_queue: [] };
        var t, n;
        if (c)
          try {
            t = a.aplus || (a.aplus = {});
            var o = a.goldlog_queue || (a.goldlog_queue = []);
            (n = a.aplus_queue || (a.aplus_queue = [])), (n = o.concat(n));
          } catch (e) {}
        else (t = a.aplus), (n = a.aplus_queue);
        return (
          (a.aplus = a.goldlog = t), (a.aplus_queue = a.goldlog_queue = n), a
        );
      });
    var l = function (e) {
      if (e === r || e === s) {
        var t = a[r] || a[s];
        return t || (t = a[r] = a[s] = {}), t;
      }
      var n = u,
        o = i;
      if (e === o || e === n) {
        var c = a[o] || a[n];
        return c || (c = a[o] = a[n] = []), c;
      }
    };
    (t.getGlobalValue = l),
      (t.setGlobalValue = function (e, t) {
        a[e] = t;
      });
    var p = function (e) {
      var t;
      try {
        var n = l(r);
        t = n[e];
      } catch (e) {
        t = '';
      } finally {
        return t;
      }
    };
    t.getGoldlogVal = p;
    var f = function (e, t) {
      var n = !1;
      try {
        var a = l(r);
        e && ((a[e] = t), (n = !0));
      } catch (e) {
        n = !1;
      } finally {
        return n;
      }
    };
    (t.setGoldlogVal = f),
      (t.getClientInfo = function () {
        return p('_aplus_client') || {};
      });
  },
  function (e, t) {
    var n = 'aplus',
      a = 'goldlog',
      o = n + '_queue',
      r = a + '_queue',
      i = 'mw_change',
      s = 'MetaInfo',
      u = 'append' + s,
      c = 'set' + s,
      l = 'http',
      p = '_pubsub',
      f = 'other',
      g = '2101',
      d = '2201',
      _ = '2202',
      h = '19999',
      m = '1023',
      v = '1010',
      y = 3e4,
      b = 18e5,
      E = 'ekvs',
      w = 1e4,
      A = 1,
      S = 3e3,
      x = '$$_page_start',
      T = '$$_page_end',
      P = '$$_app_start',
      C = '$$_app_end',
      I = 'aplus_user_profile',
      M = 'imprint',
      k = 'aplus-idtype';
    e.exports = {
      PAGE_ENTER: 'PAGE_ENTER',
      CURRENT_PAGE_CONFIG: 'CURRENT_PAGE_CONFIG',
      _ANONY_ID: '_anony_id',
      _USER_ID: '_user_id',
      DEFAULT_CODE: f,
      OTHER: h,
      EVENT_MAP: {
        2101: 'click',
        2201: 'exposure',
        2202: 'exposure',
        19999: f,
        1023: 'app_show',
        1010: 'app_hide_or_unload',
      },
      EVENT_ID_MAP: { EXP: d, IMPEXP: _, CLK: g, OTHER: h, SHOW: m, H_OR_U: v },
      APLUS: n,
      GOLDLOG: a,
      UNSUBSCRIBE: n + '.' + n + p + '.unsubscribe',
      SUBSCRIBE: n + '.' + n + p + '.subscribe',
      PUBLISH: n + '.' + n + p + '.publish',
      CACHE_PUBS: n + '.' + n + p + '.cachePubs',
      APLUS_UNIVERSAL: n + '_universal',
      APLUS_QUEUE: o,
      GOLDLOG_QUEUE: r,
      COMPLETE: 'complete',
      PV_CODE: '2001',
      EXP_CODE: d,
      CLK_CODE: g,
      OTHER_CODE: h,
      CLK: 'CLK',
      EXP: 'EXP',
      SPM_CNT: 'spm-cnt',
      SPM_URL: 'spm-url',
      SPM_PRE: 'spm-pre',
      MW_CHANGE_PV: i + '_pv',
      MW_CHANGE_HJLJ: i + '_hjlj',
      HTTP: l + ':',
      HTTPS: 'https:',
      APPEND_META_INFO: u,
      SET_META_INFO: c,
      APLUS_APPEND_META_INFO: n + '.' + u,
      APLUS_SET_META_INFO: n + '.' + c,
      PVID: 'pvid',
      APLUS_LOG_PIPE: 'aplus-log-pipe',
      openAPIs: [
        'send',
        'enter',
        'sendPV',
        'record',
        'combineRecord',
        'recordUdata',
        'requestVTConfig',
        'setPageSPM',
        'setMetaInfo',
        'appendMetaInfo',
        'updatePageProperties',
        'updateNextPageProperties',
        'updatePageUtparam',
        'updateNextPageUtparam',
        'pageAppear',
        'pageDisappear',
        'skipPage',
        'updateSessionProperties',
        'getPageSpmUrl',
        'getPageSpmPre',
        'setPageName',
        'getElementSPM',
      ],
      SESSION_INTERVAL: y,
      SESSION_PAUSE_TIME: 'session_pause_time',
      IMPRINT: 'imprint',
      CURRENT_SESSION: 'current_session',
      MAX_EVENTID_LENGTH: 128,
      MAX_PROPERTY_KEY_LENGTH: 256,
      MAX_PROPERTY_KEYS_COUNT: 100,
      REQUESTS: 'requests',
      SHARES: 'shares',
      APLUS_SSRC: '_aplus_ssrc',
      EKVS: E,
      EVENT_MAX_COUNT: w,
      MEMORY_MAX_COUNT: A,
      EVENT_SEND_DEFAULT_INTERVAL: S,
      PAGE_START: x,
      PAGE_END: T,
      APP_START: P,
      APP_END: C,
      USER_PROFILE_KEY: I,
      SHARE_CACHE_INTERVAL: b,
      IMPRINT: M,
      ID_TYPE: k,
    };
  },
  function (e, t, n) {
    e.exports = {
      metaInfo: {
        'aplus-ifr-pv': '1',
        'aplus-rhost-v': 'umini.shujupie.com',
        'aplus-rhost-g': '',
        'aplus-channel': '',
        appId: '',
        sdkId: 'aplus_cloud_um',
        'aplus-cpvdata': {},
        'aplus-exdata': {},
        'aplus-mmstat-timeout': '10000',
        'aplus-etag-timeout': '1500',
        'aplus-toUT': '',
        customSdkId: '203467608_20210928_180144',
      },
      globalConfig: {
        isDecodeUrl: !0,
        isAli: !1,
        isUM: !0,
        APLUS_QUEUE: 'aplus_queue',
        ETAG_STORAGE_KEY: '__ETAG__CNA__ID__',
        script_name: 'aplus.js',
        lver: '1.7.6',
        NAME_STORAGE_KEYS: {
          REFERRER: 'wm_referrer',
          REFERRER_PV_ID: 'refer_pv_id',
          LOST_PV_PAGE_DURATION: 'lost_pv_page_duration',
          LOST_PV_PAGE_SPMAB: 'lost_pv_page_spmab',
          LOST_PV_PAGE: 'lost_pv_page',
          LOST_PV_PAGE_MSG: 'lost_pv_page_msg',
        },
      },
      plugins: [
        { name: 'aplus_h5_share', path: n(5) },
        { name: 'aplus_track_debug', path: n(17) },
        { name: 'aplus_body_ready', path: n(18) },
        { name: 'pubsub', path: n(19) },
        { name: 'aplus_client', path: n(23) },
        { name: 'aplus_meta_inject', path: n(25) },
        { name: 'aplus_ac', path: n(40) },
        { name: 'aplus_ae', path: n(53) },
        { name: 'name_storage', path: n(62) },
        {
          name: 'record_lost_pv',
          path: n(63),
          config: { lostPvRecordRatio: 0.01 },
        },
        {
          name: 'aplus_monitor',
          path: n(65),
          config: {
            obsoleteInterRecordRatio: '0.01',
            jsErrorRecordRatio: '0.01',
            browserSupportRatio: '0.01',
          },
        },
        { name: 'aplus_web_http_um', path: n(67) },
        {
          name: 'aplus_log_inject',
          path: n(81),
          deps: ['aplus_meta_inject'],
          config: {
            plugins: {
              pv: [
                { name: 'etag', path: n(82) },
                {
                  name: 'when_to_sendpv',
                  path: n(87),
                  config: { aplusWaiting: '' },
                },
                { name: 'where_to_send', path: n(88) },
                {
                  name: 'what_to_send',
                  path: n(90),
                  config: { pvdataToUt: {} },
                },
                {
                  name: 'what_to_sendpv_userdata',
                  path: n(93),
                  deps: ['what_to_send'],
                },
                {
                  name: 'what_to_sendpv_userdata_web',
                  path: n(95),
                  deps: ['what_to_send', 'what_to_sendpv_userdata'],
                },
                {
                  name: 'what_to_sendpv_ut2',
                  path: n(98),
                  deps: ['what_to_send'],
                },
                {
                  name: 'what_to_sendpv_um2native',
                  path: n(99),
                  deps: ['what_to_send'],
                },
                { name: 'can_to_sendpv', path: n(100), config: { flag: 'NO' } },
                { name: 'after_pv', path: n(101) },
              ],
              hjlj: [
                { name: 'etag', path: n(82) },
                { name: 'where_to_send', path: n(88), deps: [] },
                { name: 'what_to_send', path: n(90), deps: [] },
                {
                  name: 'what_to_hjlj_userdata',
                  path: n(103),
                  deps: ['what_to_send'],
                },
                {
                  name: 'what_to_hjlj_userdata_web',
                  path: n(104),
                  deps: ['what_to_send', 'what_to_hjlj_userdata'],
                },
                {
                  name: 'what_to_hjlj_ut2',
                  path: n(105),
                  deps: ['what_to_send'],
                },
                {
                  name: 'what_to_hjlj_um2native',
                  path: n(106),
                  deps: ['what_to_send'],
                },
              ],
            },
          },
        },
        { name: 'aplus_api', path: n(107) },
        { name: 'meta_queue', path: n(115) },
        { name: 'etag', path: n(82) },
        { name: 'etag_web_sync', path: n(117) },
        { name: 'aplus_queue', path: n(118) },
        {
          name: 'hot_loader',
          path: n(119),
          config: {
            urlRules: [
              {
                rule: 'aplus_webvt_messager',
                cdnPath: [
                  'https://d.alicdn.com/alilog/mlog/aplus_webvt_messager.js',
                ],
              },
            ],
          },
        },
        {
          name: 'aplus_apv',
          path: n(120),
          deps: ['aplus_log_inject', 'aplus_api'],
        },
      ],
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(6);
    e.exports = function () {
      return {
        run: function () {
          if (!aplus._h5_share_enable)
            return (
              (aplus._h5_share_enable = 1),
              aplus._h5_share_enable
                ? void n(7)()
                : void a.logger({
                    msg: '使用h5采集分享能力需先配置metainfo中aplus_h5_share_enabled为true',
                  })
            );
        },
      };
    };
  },
  function (e, t) {
    'use strict';
    var n = '[aplus log]: ';
    t.logger = function (e) {
      e || (e = {});
      var t = e.level || 'warn';
      console && console[t] && console[t](n + e.msg);
    };
  },
  function (e, t, n) {
    'use strict';
    function a() {
      h.remove('__sharefrom'),
        h.remove('__fromappkey'),
        h.remove('_um_ssrc'),
        h.remove('_um_channel'),
        h.remove('_um_campaign');
    }
    function o() {
      var e = m.getQueryVariable('sharefrom') || '';
      e && h.set('__sharefrom', e);
      var t = m.getQueryVariable('fromappkey') || '';
      t && h.set('__fromappkey', t);
      var n = m.getQueryVariable('_um_ssrc') || '';
      n && h.set('_um_ssrc', n);
      var a = m.getQueryVariable('_um_channel') || '';
      a && h.set('_um_channel', a);
      var o = m.getQueryVariable('_um_campaign') || '';
      o && h.set('_um_campaign', o);
    }
    function r(e, t) {
      var n = e || {};
      aplus_queue.push({
        action: 'aplus.record',
        arguments: ['$$_share', 'CLK', n, 'POST', t],
      });
    }
    function i(e, t) {
      var n = aplus.getMetaInfo('aplus-rhost-v');
      n = (/^\/\//.test(n) ? '' : '//') + n;
      var a = d.can2https(n) + '/ulink/getTC',
        r = aplus.getCookie('cna') || '';
      l.request4um({
        url: a,
        data: {
          appkey: e.appkey || '',
          openid: e.openid || aplus.getMetaInfo('openid') || r,
          unionId: e.unionId || aplus.getMetaInfo('unionid') || '',
          trackCode: e.trackCode || '',
          rootTrackCode: e.rootTrackCode || '',
          url: e.url || location.href,
        },
        success: function (e) {
          if (f(t))
            if (e)
              if (200 === e.code && e.data && e.data.trackCode) {
                o();
                var n = '';
                (n = e.data.trackCode),
                  n && h.set('_um_ssrc', n),
                  t({ _um_ssrc: n, trackCode: e.data.trackCode });
              } else p.logger({ msg: '获取trackcode失败, ' + e.msg }), t({});
            else p.logger({ msg: '获取trackcode失败' }), t({});
          else
            p.logger({ msg: 'getNextTrackCode入参回调函数需满足function类型' });
        },
        error: function () {
          f(t) && t({});
        },
      });
    }
    function s(e, t) {
      if ('string' == typeof e && 0 !== e.length) {
        var n = u.getGlobalValue(c.APLUS),
          a = n.getMetaInfo('aplus-rhost-v');
        a = (/^\/\//.test(a) ? '' : '//') + a;
        var o = d.can2https(a) + '/uminiprogram_logs/comm/uif2';
        try {
          var r = JSON.parse(e);
          r && !r.it && (r.it = n.getMetaInfo(c.ID_TYPE) || 'cnaid'),
            l.request4um({
              url: o,
              data: { ui: _.encode(JSON.stringify(r)) },
              success: function (e) {
                e && e.data
                  ? f(t) && t(e.data)
                  : p.logger({ msg: '上传用户信息失败' });
              },
              error: function () {
                p.logger({ msg: '上传用户信息失败' }), f(t) && t({});
              },
            });
        } catch (e) {
          p.logger({ msg: 'ui上报格式异常，请检查ui参数' + e });
        }
      }
    }
    var u = n(2),
      c = n(3),
      l = n(8),
      p = n(6),
      f = n(9),
      g = n(10),
      d = n(13),
      _ = n(14),
      h = n(15),
      m = n(16);
    e.exports = function () {
      var e = u.getGlobalValue(c.APLUS);
      (e.trackShare = r),
        (e.getNextTrackCode = i),
        (e.uploadUserProfile = s),
        o();
      try {
        g.on(window, 'beforeunload', function () {
          a();
        });
      } catch (e) {
        p.logger({ msg: '清理分享信息失败' + e });
      }
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(3),
      o = { base: 1e4, timeout: 1e4 },
      r = function (e, t, n, r) {
        /^\/\//.test(e) && (e = a.HTTPS + e);
        var i = !0,
          s = r && r.timeout ? r.timeout : o.timeout;
        setTimeout(function () {
          i && ((i = !1), n({ timeout: s }));
        }, s),
          window
            .fetch(e)
            .then(function (e) {
              return /application\/json/.test(e.headers.get('content-type'))
                ? e.json()
                : e.text();
            })
            .then(function (e) {
              i && (t(e), (i = !1));
            })
            .catch(function (e) {
              i && n(e);
            });
      },
      i = function (e, t, n, a) {
        var r,
          i = 'GET',
          s = function () {
            r.responseText ? t(r.responseText) : n();
          },
          u =
            window.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest();
        u
          ? ((r = new XMLHttpRequest()), r.open(i, e, !0))
          : ((r = new window.XDomainRequest()), r.open(i, e));
        var c = a && a.timeout ? a.timeout : o.timeout;
        (r.timeout = c),
          (r.onload = s),
          (r.onerror = n),
          (r.ontimeout = n),
          r.send();
      },
      s = function (e, t, n, a) {
        window.fetch ? r(e, t, n, a) : i(e, t, n, a);
      },
      u = function (e, t) {
        (e = e || {}),
          (e.method = (e.method || 'POST').toUpperCase()),
          (e.url = e.url || ''),
          (e.data = e.data || null),
          (e.success = e.success || function () {}),
          (e.error = e.error || function () {});
        var n = new XMLHttpRequest(),
          a = [];
        for (var o in e.data) a.push(o + '=' + encodeURIComponent(e.data[o]));
        var r = a.join('&'),
          i = JSON.stringify(e.data || {});
        'POST' === e.method
          ? (n.open(e.method, e.url, !0),
            n.setRequestHeader('Content-Type', t || 'application/json'))
          : 'GET' === e.method && n.open(e.method, e.url + '?' + r, !0),
          (n.withCredentials = !0),
          (n.timeout = 3e3),
          (n.onreadystatechange = function () {
            if (4 == n.readyState && 200 == n.status) {
              var t = {};
              try {
                t = JSON.parse(n.responseText);
              } catch (e) {}
              e.success(t);
            } else 4 == n.readyState && e.error(n.staus);
          }),
          'POST' === e.method ? n.send(i) : n.send();
        console.log(i);
      };
    (t.request = s), (t.request4um = u);
  },
  function (e, t) {
    'use strict';
    e.exports = function (e) {
      return 'function' == typeof e;
    };
  },
  function (e, t, n) {
    'use strict';
    function a(e, t, n) {
      var a = aplus._$ || {},
        o = a.meta_info || {},
        r = o.aplus_ctap || {},
        i = o['aplus-touch'];
      if (r && 'function' == typeof r.on) r.on(e, t);
      else {
        var u = 'ontouchend' in document.createElement('div');
        !u || ('tap' !== i && 'tapSpm' !== n && 'tap' !== n)
          ? s(e, u ? 'touchstart' : 'mousedown', t)
          : c.on(e, t);
      }
    }
    function o(e) {
      try {
        document.documentElement.doScroll('left');
      } catch (t) {
        return void setTimeout(function () {
          o(e);
        }, 1);
      }
      e();
    }
    function r(e) {
      var t = 0,
        n = function () {
          0 === t && e(), t++;
        };
      'complete' === document.readyState && n();
      var a;
      if (document.addEventListener)
        (a = function () {
          document.removeEventListener('DOMContentLoaded', a, !1), n();
        }),
          document.addEventListener('DOMContentLoaded', a, !1),
          window.addEventListener('load', n, !1);
      else if (document.attachEvent) {
        (a = function () {
          'complete' === document.readyState &&
            (document.detachEvent('onreadystatechange', a), n());
        }),
          document.attachEvent('onreadystatechange', a),
          window.attachEvent('onload', n);
        var r = !1;
        try {
          r = null === window.frameElement;
        } catch (e) {}
        document.documentElement.doScroll && r && o(n);
      }
    }
    function i(e) {
      'complete' === document.readyState ? e() : s(window, 'load', e);
    }
    function s() {
      var e = window,
        t = arguments;
      if (2 === t.length)
        'DOMReady' === t[0] && r(t[1]), 'onload' === t[0] && i(t[1]);
      else if (3 === t.length) {
        var n = t[0],
          o = t[1],
          s = t[2];
        if ('tap' === o || 'tapSpm' === o) a(n, s, o);
        else {
          var c = document.attachEvent ? 'attachEvent' : 'addEventListener',
            l = !!document.attachEvent;
          n[c](
            (l ? 'on' : '') + o,
            function (t) {
              t = t || e.event;
              var n = t.target || t.srcElement;
              'function' == typeof s && s(t, n);
            },
            !!u(o) && { passive: !0 }
          );
        }
      }
    }
    var u = n(11),
      c = n(12);
    (t.DOMReady = r), (t.onload = i), (t.on = s);
  },
  function (e, t) {
    var n;
    e.exports = function (e) {
      if ('boolean' == typeof n) return n;
      if (!/touch|mouse|scroll|wheel/i.test(e)) return !1;
      n = !1;
      try {
        var t = Object.defineProperty({}, 'passive', {
          get: function () {
            n = !0;
          },
        });
        window.addEventListener('test', null, t);
      } catch (e) {}
      return n;
    };
  },
  function (e, t) {
    'use strict';
    function n(e, t) {
      return e + Math.floor(Math.random() * (t - e + 1));
    }
    function a(e, t, n) {
      var a = document.createEvent('HTMLEvents');
      if ((a.initEvent(t, !0, !0), 'object' == typeof n))
        for (var o in n) a[o] = n[o];
      e.dispatchEvent(a);
    }
    function o(e) {
      var t = document.documentElement;
      0 === Object.keys(l).length &&
        (t.addEventListener(g, r, !1),
        t.addEventListener(f, i, !1),
        t.addEventListener(_, i, !1));
      for (var n = 0; n < e.changedTouches.length; n++) {
        var a = e.changedTouches[n],
          o = {};
        for (var s in a) o[s] = a[s];
        var u = {
          startTouch: o,
          startTime: Date.now(),
          status: d,
          element: e.srcElement || e.target,
        };
        l[a.identifier] = u;
      }
    }
    function r(e) {
      for (var t = 0; t < e.changedTouches.length; t++) {
        var n = e.changedTouches[t],
          a = l[n.identifier];
        if (!a) return;
        var o = n.clientX - a.startTouch.clientX,
          r = n.clientY - a.startTouch.clientY,
          i = Math.sqrt(Math.pow(o, 2) + Math.pow(r, 2));
        (a.status === d || 'pressing' === a.status) &&
          i > 10 &&
          (a.status = 'panning');
      }
    }
    function i(e) {
      for (var t = 0; t < e.changedTouches.length; t++) {
        var n = e.changedTouches[t],
          o = n.identifier,
          s = l[o];
        s &&
          (s.status === d &&
            e.type === f &&
            ((s.timestamp = Date.now()),
            a(s.element, h, { touch: n, touchEvent: e })),
          delete l[o]);
      }
      var u = document.documentElement;
      0 === Object.keys(l).length &&
        (u.removeEventListener(g, r, !1),
        u.removeEventListener(f, i, !1),
        u.removeEventListener(_, i, !1));
    }
    function s(e) {
      e.__fixTouchEvent ||
        (e.addEventListener(p, function () {}, !1), (e.__fixTouchEvent = !0));
    }
    function u() {
      if (!c) {
        var e = document.documentElement;
        e.addEventListener(p, o, !1), (c = !0);
      }
    }
    var c = !1,
      l = {},
      p = 'touchstart',
      f = 'touchend',
      g = 'touchmove',
      d = 'tapping',
      _ = 'touchcancel',
      h = 'aplus_tap' + n(1, 1e5);
    e.exports = {
      on: function (e, t) {
        u(),
          e &&
            e.addEventListener &&
            t &&
            (s(e),
            e.addEventListener(
              h,
              (t._aplus_tap_callback = function (e) {
                t(e, e.target);
              }),
              !1
            ));
      },
      un: function (e, t) {
        e &&
          e.removeEventListener &&
          t &&
          t._aplus_tap_callback &&
          e.removeEventListener(h, t._aplus_tap_callback, !1);
      },
    };
  },
  function (e, t) {
    'use strict';
    function n(e) {
      var t,
        n,
        o,
        r = [],
        i = e.length;
      for (o = 0; o < i; o++)
        (t = e[o][0]),
          (n = e[o][1]),
          r.push(0 === t.indexOf(a) ? n : t + '=' + encodeURIComponent(n));
      return r.join('&');
    }
    var a = '::-plain-::';
    (t.mkPlainKey = function () {
      return a + Math.random();
    }),
      (t.s_plain_obj = a),
      (t.mkPlainKeyForExparams = function (e) {
        var t = e || a;
        return t + 'exparams';
      }),
      (t.arr2param = n),
      (t.param2arr = function (e) {
        for (var t, n = e.split('&'), a = 0, o = n.length, r = []; a < o; a++)
          (t = n[a].split('=')), r.push([t.shift(), t.join('=')]);
        return r;
      }),
      (t.arr2obj = function (e) {
        var t,
          n,
          a,
          o = {},
          r = e.length;
        for (a = 0; a < r; a++) (t = e[a][0]), (n = e[a][1]), (o[t] = n);
        return o;
      }),
      (t.jsonLikeStr2JSON = function (e) {
        if (!e || 'string' != typeof e) return {};
        for (
          var t = e.replace(/['"{}]+/g, ''), n = t.split(','), a = [], o = 0;
          o < n.length;
          o++
        )
          a.push(n[o].split(':'));
        var r = this.arr2obj(a);
        return r;
      }),
      (t.can2https = function (e) {
        if (0 === e.indexOf('//')) {
          var t = 'https:';
          /(\d+\.){3,}\d+/.test(e) && (t = 'http:'), (e = t + e);
        }
        return e;
      }),
      (t.checkEmptyObj = function (e) {
        return 'object' != typeof e || 0 === Object.keys(e).length;
      });
  },
  function (e, t) {
    var n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      a = (function (e) {
        for (var t = {}, n = 0, a = e.length; n < a; n++) t[e.charAt(n)] = n;
        return t;
      })(n),
      o = String.fromCharCode,
      r = function (e) {
        var t;
        return e.length < 2
          ? ((t = e.charCodeAt(0)),
            t < 128
              ? e
              : t < 2048
              ? o(192 | (t >>> 6)) + o(128 | (63 & t))
              : o(224 | ((t >>> 12) & 15)) +
                o(128 | ((t >>> 6) & 63)) +
                o(128 | (63 & t)))
          : ((t =
              65536 +
              1024 * (e.charCodeAt(0) - 55296) +
              (e.charCodeAt(1) - 56320)),
            o(240 | ((t >>> 18) & 7)) +
              o(128 | ((t >>> 12) & 63)) +
              o(128 | ((t >>> 6) & 63)) +
              o(128 | (63 & t)));
      },
      i = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,
      s = function (e) {
        return e.replace(i, r);
      },
      u = function (e) {
        var t = [0, 2, 1][e.length % 3],
          a =
            (e.charCodeAt(0) << 16) |
            ((e.length > 1 ? e.charCodeAt(1) : 0) << 8) |
            (e.length > 2 ? e.charCodeAt(2) : 0),
          o = [
            n.charAt(a >>> 18),
            n.charAt((a >>> 12) & 63),
            t >= 2 ? '=' : n.charAt((a >>> 6) & 63),
            t >= 1 ? '=' : n.charAt(63 & a),
          ];
        return o.join('');
      },
      c = function (e) {
        return e.replace(/[\s\S]{1,3}/g, u);
      },
      l = function (e) {
        return c(s(e));
      },
      p = function (e, t) {
        return t
          ? l(String(e))
              .replace(/[+\/]/g, function (e) {
                return '+' == e ? '-' : '_';
              })
              .replace(/\=/g, '')
          : l(String(e));
      },
      f = new RegExp(
        ['[À-ß][-¿]', '[à-ï][-¿]{2}', '[ð-÷][-¿]{3}'].join('|'),
        'g'
      ),
      g = function (e) {
        switch (e.length) {
          case 4:
            var t =
                ((7 & e.charCodeAt(0)) << 18) |
                ((63 & e.charCodeAt(1)) << 12) |
                ((63 & e.charCodeAt(2)) << 6) |
                (63 & e.charCodeAt(3)),
              n = t - 65536;
            return o((n >>> 10) + 55296) + o((1023 & n) + 56320);
          case 3:
            return o(
              ((15 & e.charCodeAt(0)) << 12) |
                ((63 & e.charCodeAt(1)) << 6) |
                (63 & e.charCodeAt(2))
            );
          default:
            return o(((31 & e.charCodeAt(0)) << 6) | (63 & e.charCodeAt(1)));
        }
      },
      d = function (e) {
        return e.replace(f, g);
      },
      _ = function (e) {
        var t = e.length,
          n = t % 4,
          r =
            (t > 0 ? a[e.charAt(0)] << 18 : 0) |
            (t > 1 ? a[e.charAt(1)] << 12 : 0) |
            (t > 2 ? a[e.charAt(2)] << 6 : 0) |
            (t > 3 ? a[e.charAt(3)] : 0),
          i = [o(r >>> 16), o((r >>> 8) & 255), o(255 & r)];
        return (i.length -= [0, 0, 2, 1][n]), i.join('');
      },
      h = function (e) {
        return e.replace(/[\s\S]{1,4}/g, _);
      },
      m = function (e) {
        return d(h(e));
      },
      v = function (e) {
        return m(
          String(e)
            .replace(/[-_]/g, function (e) {
              return '-' == e ? '+' : '/';
            })
            .replace(/[^A-Za-z0-9\+\/]/g, '')
        );
      };
    (t.encode = p), (t.decode = v);
  },
  function (e, t) {
    'use strict';
    e.exports = {
      set: function (e, t) {
        try {
          return localStorage.setItem(e, t), !0;
        } catch (e) {
          return !1;
        }
      },
      get: function (e) {
        try {
          return localStorage.getItem(e);
        } catch (e) {
          return '';
        }
      },
      test: function () {
        var e = 'grey_test_key';
        try {
          return localStorage.setItem(e, 1), localStorage.removeItem(e), !0;
        } catch (e) {
          return !1;
        }
      },
      remove: function (e) {
        localStorage.removeItem(e);
      },
    };
  },
  function (e, t) {
    'use strict';
    t.getQueryVariable = function (e) {
      if (window && window.location) {
        var t =
          (window.location.search && window.location.search.substring(1)) || '';
        if (0 === t.length) {
          var n = window.location.hash || '',
            a = n.lastIndexOf('?') + 1;
          t = n.substring(a) || '';
        }
        for (var o = t.split('&'), r = 0; r < o.length; r++) {
          var i = o[r].split('=');
          if (i[0] === e) return i[1];
        }
      }
      return '';
    };
  },
  function (e, t) {
    'use strict';
    e.exports = function () {
      return {
        run: function () {
          var e = document,
            t = window.aplus || (window.aplus = {});
          if (!t._aplus_cplugin_track_deb) {
            t._aplus_cplugin_track_deb = { status: 'init' };
            var n = window,
              a = function () {
                try {
                  var t = n.localStorage,
                    a = 'aplus_track_debug_id',
                    o = new RegExp('[?|&]' + a + '=(\\w*)'),
                    r = location.href.match(o);
                  if (r && r.length > 0) t.setItem(a, r[1]);
                  else {
                    var i = e.referrer || '',
                      s = i.match(o);
                    if (s && s.length > 0) t.setItem(a, s[1]);
                    else {
                      var u = n.name || '',
                        c = u.match(o);
                      c && c.length > 0 && t.setItem(a, c[1]);
                    }
                  }
                  var l = t.getItem(a) || '';
                  if (!(l && l.length > 50)) return !1;
                  var p,
                    f = l.split('_');
                  if (f && f.length > 0) {
                    p = f[f.length - 1].replace(/log/, '');
                    var g = new Date(),
                      d = g.getTime(),
                      _ = new Date(),
                      h = _.getTime();
                    g.setFullYear(parseInt(p.substr(0, 4))),
                      g.setMonth(parseInt(p.substr(4, 2) - 1)),
                      g.setDate(parseInt(p.substr(6, 2))),
                      g.setHours(parseInt(p.substr(8, 2))),
                      g.setMinutes(parseInt(p.substr(10, 2))),
                      g.setSeconds(parseInt(p.substr(12, 2))),
                      g.setMilliseconds(0),
                      (d = g.getTime()),
                      (h = _.getTime());
                    var m = h - d;
                    return m <= 36e5 && (l || r[1]);
                  }
                } catch (e) {
                  return !1;
                }
              },
              o = a();
            if (o) {
              t._aplus_cplugin_track_deb.status = 'start';
              var r = { aplus_track_debug_id: o },
                i = window.aplus_queue || (window.aplus_queue = []);
              i.push({
                action: 'aplus.appendMetaInfo',
                arguments: ['aplus-exdata', r],
              }),
                i.push({
                  action: 'aplus.appendMetaInfo',
                  arguments: ['aplus-cpvdata', r],
                }),
                (t._aplus_cplugin_track_deb.status = 'complete');
            }
          }
        },
      };
    };
  },
  function (e, t) {
    'use strict';
    e.exports = function () {
      return {
        run: function (e, t) {
          var n = setInterval(function () {
            document.getElementsByTagName('body').length &&
              (clearInterval(n), (n = null), t());
          }, 50);
          return (
            setTimeout(function () {
              n && clearInterval(n);
            }, 1e3),
            1e3
          );
        },
      };
    };
  },
  function (e, t, n) {
    var a = n(20),
      o = n(2);
    e.exports = function () {
      return {
        run: function () {
          var e = o.getGlobalValue('aplus');
          e.aplus_pubsub || (e.aplus_pubsub = a.create());
        },
      };
    };
  },
  function (e, t, n) {
    var a = n(21);
    e.exports = a.extend({
      subscribeOnce: function (e, t) {
        this.callable(t);
        var n,
          a = this;
        return (
          this.subscribe.call(
            this,
            e,
            (n = function () {
              a.unsubscribe.call(a, e, n);
              var o = Array.prototype.slice.call(arguments);
              t.apply(a, o);
            })
          ),
          this
        );
      },
    });
  },
  function (e, t, n) {
    'use strict';
    var a = n(9),
      o = n(22),
      r = function (e) {
        for (var t = e.length, n = new Array(t - 1), a = 1; a < t; a++)
          n[a - 1] = e[a];
        return n;
      },
      i = o.extend({
        callable: function (e) {
          if (!a(e)) throw new TypeError(e + ' is not a function');
          return e;
        },
        create: function (e) {
          var t = new this();
          for (var n in e) t[n] = e[n];
          return (t.handlers = []), (t.pubs = {}), t;
        },
        setHandlers: function (e) {
          this.handlers = e;
        },
        subscribe: function (e, t) {
          this.callable(t);
          var n = this,
            a = n.pubs || {},
            o = a[e] || [];
          if (o)
            for (var r = 0; r < o.length; r++) {
              var i = o[r]();
              t.apply(n, i);
            }
          var s = n.handlers || [];
          return e in s || (s[e] = []), s[e].push(t), n.setHandlers(s), n;
        },
        unsubscribe: function (e, t) {
          this.callable(t);
          try {
            var n = this.handlers[e];
            if (!n) return this;
            if ('object' == typeof n && n.length > 0) {
              for (var a = 0; a < n.length; a++) {
                var o = t.toString(),
                  r = n[a].toString();
                o === r && n.splice(a, 1);
              }
              this.handlers[e] = n;
            } else delete this.handlers[e];
          } catch (e) {}
          return this;
        },
        publish: function (e) {
          var t = r(arguments),
            n = this.handlers || [],
            o = n[e] ? n[e].length : 0;
          if (o > 0)
            for (var i = 0; i < o; i++) {
              var s = n[e][i];
              a(s) && s.apply(this, t);
            }
          return this;
        },
        cachePubs: function (e) {
          var t = this.pubs || {},
            n = r(arguments);
          t[e] || (t[e] = []),
            t[e].push(function () {
              return n;
            });
        },
      });
    e.exports = i;
  },
  function (e, t, n) {
    'use strict';
    function a() {}
    var o = n(9);
    (a.prototype.extend = function () {}),
      (a.prototype.create = function () {}),
      (a.extend = function (e) {
        return this.prototype.extend.call(this, e);
      }),
      (a.prototype.create = function (e) {
        var t = new this();
        for (var n in e) t[n] = e[n];
        return t;
      }),
      (a.prototype.extend = function (e) {
        var t = function () {};
        try {
          o(Object.create) ||
            (Object.create = function (e) {
              function t() {}
              return (t.prototype = e), new t();
            }),
            (t.prototype = Object.create(this.prototype));
          for (var n in e) t.prototype[n] = e[n];
          (t.prototype.constructor = t),
            (t.extend = t.prototype.extend),
            (t.create = t.prototype.create);
        } catch (e) {
          console && console.log(e);
        } finally {
          return t;
        }
      }),
      (e.exports = a);
  },
  function (e, t, n) {
    'use strict';
    e.exports = function () {
      return {
        run: function () {
          var e = window.aplus || (window.aplus = {});
          e._aplus_client = n(24)();
        },
      };
    };
  },
  function (e, t) {
    'use strict';
    function n(e) {
      for (
        var t = [
            ['Windows NT 5.1', 'winXP'],
            ['Windows NT 6.1', 'win7'],
            ['Windows NT 6.0', 'winVista'],
            ['Windows NT 6.2', 'win8'],
            ['Windows NT 6.3', 'win8.1'],
            ['Windows NT 10.0', 'win10'],
            ['Ubuntu', 'ubuntu'],
            ['Linux', 'linux'],
            ['Windows NT 5.2', 'win2003'],
            ['Windows NT 5.0', 'win2000'],
            ['Windows', 'winOther'],
            ['rhino', 'rhino'],
          ],
          n = 0,
          a = t.length;
        n < a;
        ++n
      ) {
        var o = t[n][0];
        if (e.indexOf(o) !== -1) {
          var r = o.split(' ')[0];
          return { device_model: r, os: r, os_version: t[n][1] };
        }
      }
      var i = 'other';
      return { device_model: i, os: i, os_version: i };
    }
    function a(e, t) {
      var n = e.substring(e.indexOf('(') + 1, e.indexOf(')')),
        a = { device_model: t },
        o = t.toLowerCase();
      switch (o) {
        case 'ipad':
        case 'iphone':
        case 'ipod':
        case 'macintosh':
          'macintosh' === o
            ? /Mac OS X/.test(n)
              ? (a.os = 'Mac OS X')
              : (a.os = 'Mac OS')
            : (a.os = 'IOS'),
            (a.os_version = n.match(/[0-9_.]+/)[0]);
          break;
        case 'android':
          (a.os = 'Android'), (a.os_version = n.match(/[0-9.]+/)[0]);
      }
      return (a.os_version = a.os_version.replace(/_/g, '.')), a;
    }
    e.exports = function () {
      var e = navigator.userAgent,
        t = {},
        o = e.match(/iphone|ipad|android|macintosh/i),
        r = e.match(/Darwin/i);
      if (o) t = a(e, o[0]);
      else if (r) {
        var i = e.split(' ')[2];
        t = {
          os: 'Darwin',
          os_version: i.match(/[0-9.]+/)[0],
          device_model: 'Darwin',
        };
      } else t = n(e);
      var s = screen || {};
      return (
        (t.screenWidth = s.width),
        (t.screenHeight = s.height),
        navigator &&
          ((t.userAgent = navigator.userAgent || '-'),
          (t.language = navigator.language || navigator.userLanguage || '-')),
        t
      );
    };
  },
  function (e, t, n) {
    'use strict';
    e.exports = function () {
      return {
        run: function () {
          n(26)(this.options.context.aplus_config);
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    function a() {
      var e = document,
        t = '//g.alicdn.com';
      if (e) {
        var n =
            e.getElementById('beacon-aplus') ||
            e.getElementById('tb-beacon-aplus'),
          a = [
            '//assets.alicdn.com/g',
            '//g-assets.daily.taobao.net',
            '//alidt.oss-cn-hangzhou.aliyuncs.com',
          ];
        if (n)
          for (var o = 0; o < a.length; o++) {
            var r = new RegExp(a[o]);
            if (r.test(n.src)) {
              t = a[o];
              break;
            }
          }
      }
      return t;
    }
    function o() {
      s || (s = a());
      var e = '//assets.alicdn.com/g' === s || '//laz-g-cdn.alicdn.com' === s;
      return e || 'int' === f.getMetaInfo('aplus-env');
    }
    function r() {
      if (navigator && navigator.userAgent) {
        var e = /iphone|android/i.test(navigator.userAgent),
          t = e || /TB\-PD/i.test(navigator.userAgent);
        return t;
      }
      return !0;
    }
    function i() {
      var e,
        t = c.getParamFromUrl('utparamcnt', location.href);
      if (t)
        try {
          e = t = JSON.parse(decodeURIComponent(t));
        } catch (e) {}
      return e;
    }
    var s,
      u = n(2),
      c = n(27),
      l = n(28),
      p = n(29),
      f = n(30);
    e.exports = function (e) {
      var t = u.getGlobalValue('aplus'),
        s = e.globalConfig.NAME_STORAGE_KEYS,
        c = n(39).getRefer(s);
      (t.nameStorage = p.nameStorage), l.haveNativeFlagInUA();
      var g = (t._$ = t._$ || {});
      (g.is_terminal = r()),
        (g.send_pv_count = 0),
        (g.page_referrer = c),
        (g.spm = { data: {}, page_referrer: c }),
        (t.globalConfig = e.globalConfig);
      var d = i();
      g.meta_info = f.qGet() || {};
      for (var _ in e.metaInfo)
        if (!g.meta_info.hasOwnProperty(_)) {
          var h = e.metaInfo[_];
          'aplus-utparam' === _
            ? (d && f.appendMetaInfo(_, d), f.appendMetaInfo(_, h))
            : f.setMetaInfo(_, h);
        }
      (t._$ = g), (t.isInternational = o), (t.getCdnPath = a);
    };
  },
  function (e, t) {
    'use strict';
    function n(e, t) {
      if (!e || !t) return '';
      var n,
        a = '';
      try {
        var o = new RegExp(e + '=([^&|#|?|/]+)');
        if ('spm' === e || 'scm' === e) {
          var r = new RegExp('\\?.*' + e + '=([\\w\\.\\-\\*/]+)'),
            i = t.match(o),
            s = t.match(r),
            u = i && 2 === i.length ? i[1] : '',
            c = s && 2 === s.length ? s[1] : '';
          (a = u > c ? u : c), (a = decodeURIComponent(a));
        } else (n = t.match(o)), (a = n && 2 === n.length ? n[1] : '');
      } catch (e) {
      } finally {
        return a;
      }
    }
    (t.getParamFromUrl = n),
      (t.getSPMFromUrl = function (e) {
        return n('spm', e);
      });
  },
  function (e, t, n) {
    'use strict';
    var a = n(2),
      o = 'UT4Aplus',
      r = 'Umeng4Aplus';
    (t.isNative4Aplus = function () {
      var e = a.getGlobalValue('aplus'),
        t = e.getMetaInfo('aplus-toUT'),
        n = e.aplusBridgeName;
      return (n === o && t === o) || n === r;
    }),
      (t.haveNativeFlagInUA = function () {
        var e = a.getGlobalValue('aplus'),
          t = e.aplusBridgeName;
        if (!t && 'boolean' != typeof t && navigator && navigator.userAgent) {
          var n = new RegExp([o, r].join('|'), 'i'),
            i = navigator.userAgent.match(n);
          (t = !!i && i[0]), (e.aplusBridgeName = t);
        }
        return !!t;
      });
  },
  function (e, t, n) {
    'use strict';
    var a = n(2),
      o = (function () {
        function e() {
          var e,
            t = [],
            n = !0;
          for (var a in f)
            f.hasOwnProperty(a) &&
              ((n = !1), (e = f[a] || ''), t.push(l(a) + u + l(e)));
          window.name = n ? o : r + l(o) + s + t.join(c);
        }
        function t(e, t, n) {
          e &&
            (e.addEventListener
              ? e.addEventListener(t, n, !1)
              : e.attachEvent &&
                e.attachEvent('on' + t, function (t) {
                  n.call(e, t);
                }));
        }
        var n = a.getGlobalValue('nameStorage');
        if (n) return n;
        var o,
          r = 'nameStorage:',
          i = /^([^=]+)(?:=(.*))?$/,
          s = '?',
          u = '=',
          c = '&',
          l = encodeURIComponent,
          p = decodeURIComponent,
          f = {},
          g = {};
        return (
          (function (e) {
            if (e && 0 === e.indexOf(r)) {
              var t = e.split(/[:?]/);
              t.shift(), (o = p(t.shift()) || '');
              for (
                var n,
                  a,
                  s,
                  u = t.join(''),
                  l = u.split(c),
                  g = 0,
                  d = l.length;
                g < d;
                g++
              )
                (n = l[g].match(i)),
                  n && n[1] && ((a = p(n[1])), (s = p(n[2]) || ''), (f[a] = s));
            } else o = e || '';
          })(window.name),
          (g.setItem = function (t, n) {
            t && 'undefined' != typeof n && ((f[t] = String(n)), e());
          }),
          (g.getItem = function (e) {
            return f.hasOwnProperty(e) ? f[e] : null;
          }),
          (g.removeItem = function (t) {
            f.hasOwnProperty(t) && ((f[t] = null), delete f[t], e());
          }),
          (g.clear = function () {
            (f = {}), e();
          }),
          (g.valueOf = function () {
            return f;
          }),
          (g.toString = function () {
            var e = window.name;
            return 0 === e.indexOf(r) ? e : r + e;
          }),
          t(window, 'beforeunload', function () {
            e();
          }),
          g
        );
      })();
    t.nameStorage = o;
  },
  function (e, t, n) {
    'use strict';
    function a(e) {
      var t,
        n,
        a,
        o = e.length,
        r = {};
      for (m._microscope_data = r, t = 0; t < o; t++)
        (n = e[t]),
          'microscope-data' === _.tryToGetAttribute(n, 'name') &&
            ((a = _.tryToGetAttribute(n, 'content')),
            f.parseSemicolonContent(a, r),
            (m.is_head_has_meta_microscope_data = !0));
      (m._microscope_data_params = l.obj2param(r)),
        (m.ms_data_page_id = r.pageId),
        (m.ms_data_shop_id = r.shopId),
        (m.ms_data_instance_id = r.siteInstanceId),
        (m.ms_data_siteCategoryId = r.siteCategory),
        (m.ms_prototype_id = r.prototypeId),
        (m.site_instance_id_or_shop_id =
          m.ms_data_instance_id || m.ms_data_shop_id),
        (m._atp_beacon_data = {}),
        (m._atp_beacon_data_params = '');
    }
    function o(e) {
      var t,
        n = function () {
          var t;
          return (
            document.querySelector &&
              (t = document.querySelector('meta[name=data-spm]')),
            d(e, function (e) {
              'data-spm' === _.tryToGetAttribute(e, 'name') && (t = e);
            }),
            t
          );
        },
        a = n();
      return a && (t = _.tryToGetAttribute(a, 'data-spm-protocol')), t;
    }
    function r(e) {
      var t = e.isonepage || '-1',
        n = t.split('|'),
        a = n[0],
        o = n[1] ? n[1] : '';
      e.isonepage_data = { isonepage: a, urlpagename: o };
    }
    function i() {
      if (document) {
        var e = h.getMetaTags();
        a(e),
          d(e, function (e) {
            var t = _.tryToGetAttribute(e, 'name');
            if (/^aplus/.test(t) && ((m[t] = h.getMetaCnt(t)), t === v))
              try {
                u = m[t] = JSON.parse(h.getMetaCnt(t));
              } catch (e) {}
          }),
          d(y, function (e) {
            m[e] = h.getMetaCnt(e);
          }),
          (m.spm_protocol = o(e)),
          u && (m = p.assign(m, u));
        var t,
          n,
          i = ['aplus-rate-ahot'],
          s = i.length;
        for (t = 0; t < s; t++) (n = i[t]), (m[n] = parseFloat(m[n]));
        r(m);
      }
      return (c = m || {}), m;
    }
    function s(e) {
      g.logger({ msg: 'please do not repeat setPriorityMetaInfo ' + e });
    }
    var u,
      c,
      l = n(31),
      p = n(32),
      f = n(34),
      g = n(6),
      d = n(36),
      _ = n(37),
      h = n(38),
      m = {},
      v = 'aplus-x-settings',
      y = ['ahot-aplus', 'isonepage', 'spm-id', 'data-spm', 'microscope-data'];
    (t.getInfo = i),
      (t.qGet = function () {
        return c || i();
      }),
      (t.setMetaInfo = function (e, t) {
        if ((c || (c = {}), 'object' == typeof u && u[e])) return s(e), !0;
        if (e === v) {
          if (u) s(e);
          else
            try {
              (u = 'object' == typeof t ? t : JSON.parse(t)),
                (c = p.assign(c, u));
            } catch (e) {
              console && console.log(e);
            }
          return !0;
        }
        return (
          'aplus-exinfo' === e
            ? (c[e] = 'object' == typeof t ? t : l.param2obj(t))
            : (c[e] = t),
          !0
        );
      });
    var b = function (e) {
      return c || (c = {}), c[e] || '';
    };
    (t.getMetaInfo = b),
      (t.appendMetaInfo = function (e, t) {
        if (e && t) {
          var n,
            a = function (n) {
              try {
                var a = 'string' == typeof t ? JSON.parse(t) : t;
                i(e, p.assign(n, a));
              } catch (e) {}
            },
            o = function (n) {
              try {
                var a = 'string' == typeof t ? JSON.parse(t) : t;
                i(e, n.concat(a));
              } catch (e) {}
            },
            r = function (e) {
              e.constructor === Array ? o(e) : a(e);
            },
            i = function (e, t) {
              aplus.setMetaInfo(e, t, { from: 'appendMetaInfo' });
            },
            s = function (n) {
              var a = l.param2obj(t);
              i(e, p.assign(n, a));
            },
            u = aplus.getMetaInfo(e);
          if (('aplus-exinfo' === e && (s(u), (n = !0)), u))
            if ('object' == typeof u) r(u), (n = !0);
            else
              try {
                var c = JSON.parse(u);
                'object' == typeof c && (r(c), (n = !0));
              } catch (e) {}
          n || i(e, t);
        }
      });
  },
  function (e, t) {
    'use strict';
    function n(e, t) {
      var n,
        o,
        r,
        i = [],
        s = e.length;
      for (r = 0; r < s; r++) {
        (n = e[r][0]), (o = e[r][1]);
        var u = 0 === n.indexOf(a),
          c = u || t ? o : encodeURIComponent(o);
        i.push(u ? c : n + '=' + c);
      }
      return i.join('&');
    }
    (t.arr2obj = function (e) {
      var t,
        n,
        a,
        o = {},
        r = e.length;
      for (a = 0; a < r; a++) (t = e[a][0]), (n = e[a][1]), (o[t] = n);
      return o;
    }),
      (t.param2obj = function (e) {
        if ('object' == typeof e) return e;
        e || (e = '');
        for (var t = {}, n = e.split('&'), a = 0; a < n.length; a++) {
          var o = n[a],
            r = o.indexOf('='),
            i = o.split('='),
            s = o.length;
          if (2 === i.length) t[i[0]] = i[1] || '';
          else if (r > 0) {
            var u = o.slice(0, r),
              c = o.slice(r + 1, s) || '';
            t[u] = c;
          } else t[i[0]] = '';
        }
        return t;
      });
    var a = '::-plain-::';
    (t.s_plain_obj = a),
      (t.arr2param = n),
      (t.obj2param = function (e, t) {
        var n,
          o,
          r,
          i = [];
        for (n in e)
          n &&
            e.hasOwnProperty(n) &&
            ((o = '' + e[n]),
            (r = n + '=' + o),
            t ? i.push(r) : i.push(0 === n.indexOf(a) ? o : r));
        return i.join('&');
      }),
      (t.encodeGokeyValue = function (e) {
        return e;
      });
  },
  function (e, t, n) {
    'use strict';
    (t.assign = n(33)),
      (t.makeCacheNum = function () {
        return Math.floor(268435456 * Math.random()).toString(16);
      }),
      (t.isStartWith = function (e, t) {
        return 0 === e.indexOf(t);
      }),
      (t.isEndWith = function (e, t) {
        var n = e.length,
          a = t.length;
        return n >= a && e.indexOf(t) == n - a;
      }),
      (t.any = function (e, t) {
        var n,
          a = e.length;
        for (n = 0; n < a; n++) if (t(e[n])) return !0;
        return !1;
      }),
      (t.isNumber = function (e) {
        return 'number' == typeof e;
      }),
      (t.isContain = function (e, t) {
        return e.indexOf(t) > -1;
      });
    var a = function (e) {
      var t,
        n = e.constructor === Array ? [] : {};
      if ('object' == typeof e) {
        if (JSON && JSON.parse) (t = JSON.stringify(e)), (n = JSON.parse(t));
        else for (var o in e) n[o] = 'object' == typeof e[o] ? a(e[o]) : e[o];
        return n;
      }
    };
    t.cloneDeep = a;
  },
  function (e, t) {
    e.exports = function (e, t) {
      return 'function' != typeof Object.assign
        ? (function (e) {
            for (var t = Object(e), n = 1; n < arguments.length; n++) {
              var a = arguments[n];
              if (null !== a)
                for (var o in a)
                  Object.prototype.hasOwnProperty.call(a, o) && (t[o] = a[o]);
            }
            return t;
          })(e, t)
        : Object.assign({}, e, t);
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(35),
      o = n(15);
    e.exports = {
      tryToDecodeURIComponent: function (e, t) {
        var n = t || '';
        if (e)
          try {
            n = decodeURIComponent(e);
          } catch (e) {}
        return n;
      },
      parseSemicolonContent: function (e, t, n) {
        t = t || {};
        var o,
          r,
          i = e.split(';'),
          s = i.length;
        for (o = 0; o < s; o++) {
          r = i[o].split('=');
          var u = a.trim(r.slice(1).join('='));
          t[a.trim(r[0]) || ''] = n ? u : this.tryToDecodeURIComponent(u);
        }
        return t;
      },
      nodeListToArray: function (e) {
        var t, n;
        try {
          return (t = [].slice.call(e));
        } catch (o) {
          (t = []), (n = e.length);
          for (var a = 0; a < n; a++) t.push(e[a]);
          return t;
        }
      },
      getLsCna: function (e, t) {
        if (o.set && o.test()) {
          var n = '',
            a = o.get(e);
          if (a) {
            var r = a.split('_') || [];
            n = t
              ? r.length > 1 && t === r[0]
                ? r[1]
                : ''
              : r.length > 1
              ? r[1]
              : '';
          }
          return decodeURIComponent(n);
        }
        return '';
      },
      setLsCna: function (e, t, n) {
        n && o.set && o.test() && o.set(e, t + '_' + encodeURIComponent(n));
      },
      getUrl: function (e) {
        var t = e || '//log.mmstat.com/eg.js';
        try {
          var n = aplus.getMetaInfo('aplus-rhost-v'),
            a = /[[a-z|\-|\_|0-9\.]+[a-z|\-|\_|0-9](:\d*)?/,
            o = n.match(a);
          o && o[0] && (t = '//' + o[0] + '/eg.js');
        } catch (e) {}
        return t;
      },
    };
  },
  function (e, t) {
    'use strict';
    function n(e) {
      return 'string' == typeof e ? e.replace(/^\s+|\s+$/g, '') : '';
    }
    t.trim = n;
  },
  function (e, t) {
    'use strict';
    e.exports = function (e, t) {
      var n,
        a = e.length;
      for (n = 0; n < a; n++) {
        var o = t(e[n], n);
        if ('break' === o) break;
      }
    };
  },
  function (e, t) {
    'use strict';
    t.tryToGetAttribute = function (e, t) {
      return e && e.getAttribute ? e.getAttribute(t) || '' : '';
    };
    var n = function (e, t, n) {
      if (e && e.setAttribute)
        try {
          e.setAttribute(t, n);
        } catch (e) {}
    };
    (t.tryToSetAttribute = n),
      (t.tryToRemoveAttribute = function (e, t) {
        if (e && e.removeAttribute)
          try {
            e.removeAttribute(t);
          } catch (a) {
            n(e, t, '');
          }
      });
  },
  function (e, t, n) {
    'use strict';
    function a(e) {
      return (
        (i = i || document.getElementsByTagName('head')[0]),
        s && !e ? s : i ? (s = i.getElementsByTagName('meta')) : []
      );
    }
    function o(e, t) {
      var n,
        o,
        r,
        i = a(),
        s = i.length;
      for (n = 0; n < s; n++)
        (o = i[n]),
          u.tryToGetAttribute(o, 'name') === e &&
            (r = u.tryToGetAttribute(o, t || 'content'));
      return r || '';
    }
    function r(e) {
      var t = { isonepage: '-1', urlpagename: '' },
        n = e.qGet();
      if (n && n.hasOwnProperty('isonepage_data'))
        (t.isonepage = n.isonepage_data.isonepage),
          (t.urlpagename = n.isonepage_data.urlpagename);
      else {
        var a = o('isonepage') || '-1',
          r = a.split('|');
        (t.isonepage = r[0]), (t.urlpagename = r[1] ? r[1] : '');
      }
      return t;
    }
    var i,
      s,
      u = n(37);
    (t.getMetaTags = a), (t.getMetaCnt = o), (t.getOnePageInfo = r);
  },
  function (e, t, n) {
    'use strict';
    var a = n(29).nameStorage;
    t.getRefer = function (e) {
      return document.referrer || a.getItem(e.REFERRER) || '';
    };
  },
  function (e, t, n) {
    'use strict';
    e.exports = function () {
      return {
        run: function () {
          n(41)();
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    function a(e) {
      var t,
        n = window.aplus || (window.aplus = {}),
        a = !1,
        l = function () {
          a ||
            (o.wrap(function () {
              t = c.getAutoClkConfig();
              var e;
              t &&
                t.length > 0 &&
                ((e = u.create({ autoClkConfig: t })), e.init(), s.watch_clk()),
                n.aplus_pubsub.subscribe('setMetaInfo', function (n, a, o) {
                  if ('aplus-auto-clk' === n) {
                    var r = c.getAutoClkConfig(a);
                    if (JSON.stringify(r) === JSON.stringify(t)) return;
                    (t = r),
                      s.clear(),
                      o || (o = { from: 'setMetaInfo' }),
                      e && e.clear(o),
                      e && e.clearDom({ autoClkConfig: t }, o),
                      a &&
                        (e
                          ? e.reset({ autoClkConfig: t }, o)
                          : ((e = u.create({ autoClkConfig: t })), e.init()),
                        s.watch_clk());
                  }
                });
            }, 'do_init'),
            (a = !0));
        };
      setTimeout(function () {
        a ||
          i.logger({
            msg: 'aplus_ac_init failed! please check whether aplusJs is loaded correctly!',
          });
      }, 5e3);
      var p = n._$ || {},
        f = window.g_SPM || {};
      'complete' === p.status && f.spm && l();
      var g = window.aplus_queue || (window.aplus_queue = []);
      g.push({
        action: r.SUBSCRIBE,
        arguments: [
          'aplusReady',
          function (e) {
            'complete' === e && l('aplusReady');
          },
        ],
      }),
        'function' == typeof e && e();
    }
    var o = n(42),
      r = n(3),
      i = n(6),
      s = n(43),
      u = n(52),
      c = n(51);
    e.exports = function () {
      var e = window.aplus || (window.aplus = {});
      e._aplus_ac ||
        ((e._aplus_ac = { status: 'init', elementSelectorSizeMap: {} }),
        a(function () {
          e._aplus_ac.status = 'complete';
        }));
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(2),
      o = function (e, t) {
        var n = a.getGlobalValue('aplus_queue', []);
        n.push({
          action: 'aplus._aplus_cplugin_track_deb.monitor',
          arguments: [
            {
              key: 'APLUS_PLUGIN_DEBUG',
              title: 'aplus_core',
              msg: ['_error_:methodName=' + t + ',params=' + JSON.stringify(e)],
              type: 'updateMsg',
              description: t || 'aplus_core',
            },
          ],
        });
      },
      r = function (e, t, n) {
        var o = a.getGlobalValue('aplus_queue', []);
        o.push({
          action: ['aplus', '_aplus_cplugin_m', t].join('.'),
          arguments: [e, n],
        });
      };
    (t.do_tracker_jserror = function (e, t) {
      var n = 'do_tracker_jserror';
      r(e, n, t), o(e, n);
      var i = a.getGlobalValue('aplus');
      i && i.aplusDebug && console && console.warn(e);
    }),
      (t.wrap = function (e) {
        if ('function' == typeof e)
          try {
            e();
          } catch (e) {
            o({ msg: e.message || e }, 'exception');
          } finally {
          }
      });
  },
  function (e, t, n) {
    'use strict';
    var a = n(44),
      o = n(37),
      r = n(45),
      i = n(2),
      s = n(32),
      u = n(46),
      c = n(36),
      l = n(47),
      p = n(48),
      f = n(51),
      g = window,
      d = ['iframe', 'html', 'body', 'head'],
      _ = f.DATA_APLUS_AC_KEY,
      h = function (e) {
        var t = [],
          n = e ? o.tryToGetAttribute(e, _) : '';
        if (n) {
          var a = i.getGoldlogVal('_aplus_ac') || {},
            r = a._acHashMap || {};
          u(r, function (e, a) {
            c(a, function (e) {
              e.hash_value === n && t.push(e.clkConfig);
            });
          });
        }
        return { clkConfigs: t, el: e };
      },
      m = function (e) {
        var t = h(e);
        if (t && t.clkConfigs && t.clkConfigs.length > 0) return t;
        for (
          ;
          (e = e.parentNode) &&
          a.indexof(d, e.tagName ? e.tagName.toLowerCase() : 'html') === -1;

        )
          if (((t = h(e)), t && t.clkConfigs && t.clkConfigs.length > 0))
            return t;
      },
      v = function (e) {
        e = e || g.event;
        var t = e.target || e.srcElement,
          n = m(t) || {},
          a = n.clkConfigs;
        n &&
          a &&
          n.el &&
          c(a, function (a) {
            var o = a;
            t = n.el;
            var r = aplus.spm_ab ? aplus.spm_ab.join('.') : '0.0',
              i = r + '.0.0',
              u = '';
            g.g_SPM && 'function' == typeof g.g_SPM.spm && (i = g.g_SPM.spm(t));
            var c = [],
              l = {},
              d = p.fillPropsData(o, t, l);
            (d = p.fillFilterData(o, t, l)), (d = p.fillSpmData(o, t, l));
            var _ = f.getAutoClkUserFn();
            if (_) {
              var h = p.autoUserFnHandler(_, t, o.elementSelector, e);
              if ('object' == typeof h)
                'object' == typeof h.userdata && (d = s.assign(d, h.userdata)),
                  h.spm && (i = h.spm),
                  h.scm && (u = h.scm);
              else if (h === !1) return;
            }
            if (aplus.globalConfig.isAli)
              c.push(
                'clkdata=' +
                  JSON.stringify([
                    { exargs: d, scm: u, spm: i, aplusContentId: '' },
                  ])
              );
            else for (var m in d) c.push(m + '=' + d[m]);
            c.push('_is_auto_clk=1');
            var v = o.method || 'POST';
            aplus.globalConfig.isAli || (v = 'GET'),
              '$$_APLUS' !== o.logkey &&
                aplus_queue.push({
                  action: 'aplus.record',
                  arguments: [o.logkey, 'CLK', c.join('&'), v],
                });
          });
      };
    (t.watch_clk = function () {
      r.isTouch() ? l.on(document, 'tap', v) : l.on(document, 'mousedown', v);
    }),
      (t.clear = function () {
        r.isTouch() ? l.un(document, 'tap', v) : l.un(document, 'mousedown', v);
      });
  },
  function (e, t) {
    'use strict';
    (t.indexof = function (e, t) {
      var n = -1;
      try {
        n = e.indexOf(t);
      } catch (o) {
        for (var a = 0; a < e.length; a++) e[a] === t && (n = a);
      } finally {
        return n;
      }
    }),
      (t.isArray = function (e) {
        return Array.isArray
          ? Array.isArray(e)
          : /Array/.test(Object.prototype.toString.call(e));
      });
  },
  function (e, t, n) {
    'use strict';
    function a() {
      return (
        i ||
          (i =
            document.getElementById('beacon-aplus') ||
            document.getElementById('tb-beacon-aplus')),
        i
      );
    }
    function o(e) {
      var t = a(),
        n = s.tryToGetAttribute(t, 'cspx');
      e && n && (e.nonce = n);
    }
    var r,
      i,
      s = n(37),
      u = n(3);
    (t.getCurrentNode = a),
      (t.addScript = function (e, t, n) {
        var i = 'script',
          s = document.createElement(i);
        (s.type = 'text/javascript'), (s.async = !0);
        var c = a(),
          l = c && c.hasAttribute('crossorigin');
        l && (s.crossOrigin = 'anonymous');
        var p = u.HTTPS === location.protocol ? t || e : e;
        0 === p.indexOf('//') && (p = u.HTTPS + p),
          (s.src = p),
          n && (s.id = n),
          o(s);
        var f = document.getElementsByTagName(i)[0];
        (r = r || document.getElementsByTagName('head')[0]),
          f ? f.parentNode.insertBefore(s, f) : r && r.appendChild(s);
      }),
      (t.loadScript = function (e, t) {
        function n(e) {
          (a.onreadystatechange = a.onload = a.onerror = null),
            (a = null),
            t(e);
        }
        var a = document.createElement('script');
        if (
          ((r = r || document.getElementsByTagName('head')[0]),
          (a.async = !0),
          'onload' in a)
        )
          a.onload = n;
        else {
          var i = function () {
            /loaded|complete/.test(a.readyState) && n();
          };
          (a.onreadystatechange = i), i();
        }
        (a.onerror = function (e) {
          n(e);
        }),
          (a.src = e),
          o(a),
          r.appendChild(a);
      }),
      (t.isTouch = function () {
        return 'ontouchend' in document.createElement('div');
      });
  },
  function (e, t) {
    'use strict';
    e.exports = function (e, t) {
      if (Object && Object.keys)
        for (var n = Object.keys(e), a = n.length, o = 0; o < a; o++) {
          var r = n[o];
          t(r, e[r]);
        }
      else for (var i in e) t(i, e[i]);
    };
  },
  function (e, t, n) {
    'use strict';
    function a() {
      var e = aplus._$ || {},
        t = e.meta_info || {},
        n = t.aplus_ctap || {};
      return n && 'function' == typeof n.on ? n : null;
    }
    function o(e, t) {
      var n = a();
      n ? n.on(e, t) : s.on(e, t);
    }
    function r(e, t) {
      var n = a();
      n ? n.un(e, t) : s.un(e, t);
    }
    var i = !!document.attachEvent,
      s = n(12);
    (t.on = function (e, t, n) {
      return 'tap' === t
        ? void o(e, n)
        : void (i ? e.attachEvent(t, n) : e.addEventListener(t, n));
    }),
      (t.un = function (e, t, n) {
        return 'tap' === t
          ? void r(e, n)
          : void (i ? e.detachEvent(t, n) : e.removeEventListener(t, n));
      });
  },
  function (e, t, n) {
    'use strict';
    function a(e, t, n) {
      var a = t.hash_value,
        o = i.getGoldlogVal(n) || {};
      if (
        (o.hash_value || (o.hash_value = {}),
        o.hash_value[e] || (o.hash_value[e] = r.Map ? new r.Map() : {}),
        r.Map)
      ) {
        var s = o.hash_value[e].get(a);
        s ? ++s : (s = 1), o.hash_value[e].set(a, s);
      } else
        o.hash_value[e][a] ? ++o.hash_value[e][a] : (o.hash_value[e][a] = 1);
      i.setGoldlogVal(n, o);
    }
    var o = document,
      r = window,
      i = n(2),
      s = n(6),
      u = n(49),
      c = n(36),
      l = n(46),
      p = n(50),
      f = n(51),
      g = function (e) {
        return '[object Array]' === Object.prototype.toString.call(e);
      };
    (t.isArray = g),
      (t.getXPath = function (e) {
        var t,
          n,
          a,
          r,
          i,
          s,
          u = o.getElementsByTagName('*');
        for (t = []; e && 1 == e.nodeType; e = e.parentNode)
          if (e.id) {
            for (s = e.id, r = 0, n = 0; n < u.length; n++)
              if (((i = u[n]), i.id && i.id == s)) {
                r++;
                break;
              }
            if (
              (t.unshift(e.tagName.toLowerCase() + '[@id="' + s + '"]'), 1 == r)
            )
              return t.unshift('/'), t.join('/');
          } else {
            for (n = 1, a = e.previousSibling; a; a = a.previousSibling)
              a.tagName == e.tagName && n++;
            t.unshift(e.tagName.toLowerCase() + '[' + n + ']');
          }
        return t.length ? '/' + t.join('/') : null;
      });
    var d = function (e, t) {
      if (((t && 0 !== t.length) || (t = []), e && e.length > 0))
        for (var n = 0; n < e.length; n++) t.push(e[n]);
      return t;
    };
    (t.nodelistToArray = d),
      (t.getElements = function (e, t) {
        var n = t || o,
          a = [];
        if (n.querySelectorAll)
          a = d(n.querySelectorAll(e.elementSelector) || []);
        else
          for (
            var r = document.getElementsByTagName(e.tag),
              i = e.filter.split('='),
              s = i.length > 0 ? i[0].trim() : '',
              u = i.length > 1 ? i[1].trim() : '',
              c = 0;
            c < r.length;
            c++
          ) {
            var l = r[c],
              p = l.getAttribute(s),
              f = l.hasAttribute(s);
            !f || (u && u !== p) || a.push(l);
          }
        return a;
      });
    var _ = function () {
        return /aplusDebug=true/.test(location.search);
      },
      h = _();
    (t.IS_DEBUG = h),
      (t.fillPropsData = function (e, t, n) {
        n || (n = {});
        try {
          var a = e.props || [];
          if (a && g(a) && a.length > 0)
            for (var o = 0; o < a.length; o++)
              if (t && t.getAttribute) {
                var r = a[o],
                  i = t.getAttribute(r);
                if (void 0 !== typeof i && null !== i && '' !== i) {
                  var u = r.toLowerCase().replace(/^data-/, '');
                  n[u] = encodeURIComponent(i);
                }
              }
        } catch (e) {
          s.logger({ msg: e && e.message });
        }
        return n;
      }),
      (t.fillFilterData = function (e, t, n) {
        n || (n = {});
        try {
          var a = e.filter || '',
            o = a.split('=');
          if (g(o) && o[1]) n[o[0]] = o[1];
          else if (o[0] && t && t.getAttribute) {
            var r = t.getAttribute(o[0]) || '';
            void 0 !== typeof r && null !== r && '' !== r && (n[o[0]] = r);
          }
        } catch (e) {
          s.logger({ msg: e && e.message });
        }
        return n;
      }),
      (t.fillSpmData = function (e, t, n) {
        n || (n = {});
        var a, o, r;
        return (
          (a =
            e && e.spmB
              ? e.spmB
              : document.body.dataset && document.body.dataset.pagename),
          (o =
            e && e.spmC
              ? e.spmC
              : t.parentNode &&
                t.parentNode.dataset &&
                t.parentNode.dataset.spmc),
          (r = e && e.spmD ? e.spmD : t.dataset && t.dataset.spmd),
          t.dataset &&
            t.dataset.aplusVtPos &&
            (r += '_' + t.dataset.aplusVtPos),
          a && (n.spmB = a),
          o && (n.spmC = o),
          r && (n.spmD = r),
          n
        );
      });
    var m = function (e) {
      return !!/^POST|GET$/i.test(e);
    };
    t.isMethod = m;
    var v = function (e) {
      var t = !!/^\d+$/.test(e);
      return !!(t && parseInt(e) > 0);
    };
    (t.isPkgSize = v),
      (t.filterExpConfigRequestCfg = function (e) {
        var t = f.getDefaultRequestCfg() || {};
        try {
          var n = e || {};
          m(n.method) && (t.method = n.method),
            v(n.pkgSize) && (t.pkgSize = parseInt(n.pkgSize));
        } catch (e) {
          s.logger({ msg: e && e.message });
        }
        return t;
      });
    var y = function (e) {
      var t = e.split('&'),
        n = {};
      return (
        t.length > 0 &&
          c(t, function (e) {
            var t = e.split('=');
            2 === t.length && (n[t[0]] = p.tryToEncodeURIComponent(t[1]));
          }),
        n
      );
    };
    t.autoUserFnHandler = function (e, t, n, a) {
      var o = { userdata: {}, spm: '', scm: '' };
      try {
        var r = e(t, n, a);
        r &&
          ('string' == typeof r
            ? (o.userdata = y(r))
            : 'object' == typeof r &&
              'object' == typeof r.userdata &&
              (l(r.userdata, function (e, t) {
                o.userdata[e] = p.tryToEncodeURIComponent(t);
              }),
              (o.spm = r.spm),
              (o.scm = r.scm)));
      } catch (e) {
        console.log(e);
      }
      return o;
    };
    var b = function (e, t) {
        var n = '';
        if (e && t) {
          var a = [e.getAttribute(t.filter)],
            o = t.props || [];
          if (o)
            for (var r = 0; r < o.length; r++) a.push(e.getAttribute(o[r]));
          n = a.join('_');
        }
        return n;
      },
      E = function (e) {
        var t = e.getAttribute('data-spm-anchor-id');
        if (t) {
          var n = t.split('.');
          return { a: n[0], b: n[1], c: n[2], d: n[3], e: n[4] };
        }
      };
    (t.getSpmObj = E),
      (t.getElementHash = function (e, t) {
        var n = {};
        'aplus_webvt' !== e.source &&
          (n = E(t.ele) || (window.g_SPM ? window.g_SPM.getParam(t.ele) : {}));
        var a = '',
          o = 'x' + t.index;
        if (n.a && n.b && n.c && n.d) {
          var r = /^i/.test(n.d) ? o : n.d;
          (a = n.a + '_' + n.b + '_' + n.c + '_' + r), n.e && (a += '_' + n.e);
        } else (a = o), aplus.pvid && (a += aplus.pvid);
        t.ignore_attr ||
          ((a += e.logkey + '_'),
          (a += e.elementSelector + '_'),
          (a += b(t.ele, e)));
        var i = o + '_' + u.hash(a);
        return i;
      }),
      (t.filterUnloadAttr = function (e) {
        return (
          e &&
            ((e = e.replace(
              /(href|style|data-spm-anchor-id)=[\'|\"][\w|\W|\.]+[\'|\"]/,
              ''
            )),
            (e = e.replace(/\s\>/g, '>')),
            (e = e.replace(
              new RegExp(f.DATA_APLUS_AE_KEY + '=[\\\'|\\"]\\w+[\\\'|\\"]'),
              ''
            )),
            (e = e.replace(
              new RegExp(f.DATA_APLUS_AC_KEY + '=[\\\'|\\"]\\w+[\\\'|\\"]'),
              ''
            ))),
          e
        );
      });
    var w = function (e, t) {
        for (var n, a = 0, o = e.length; a < o; ) {
          var r = e[a] || {};
          if (r.hash_value === t.hash_value) return (e[a] = t), (n = !0), e;
          a++;
        }
        return n || e.push(t), e;
      },
      A = function (e, t, n, o) {
        if ((n || (n = 'ADD'), e && 'object' == typeof t)) {
          var r = i.getGoldlogVal(o) || {},
            s = r._acHashMap || {},
            u = s[e] || [],
            c = function () {
              for (var e = 0, n = u.length; e < n; ) {
                var a = u[e] || {};
                if (a.hash_value === t.hash_value) return e;
                e++;
              }
              return -1;
            },
            l = c();
          'ADD' === n && l === -1
            ? (u.push(t), a(e, t, o))
            : 'CLEAR' === n && l > -1
            ? u.splice(l, 1)
            : 'UPDATE' === n && (u = w(u, t)),
            (s[e] = u),
            (r._acHashMap = s),
            i.setGoldlogVal(o, r);
        }
      };
    (t.updateExpHashMap = function (e, t, n) {
      A(e, t, n, '_aplus_auto_exp');
    }),
      (t.updateClkHashMap = function (e, t, n) {
        A(e, t, n, '_aplus_ac');
      });
    var S = function () {
      return new Date().getTime();
    };
    (t.throttle = function (e, t, n) {
      var a,
        o,
        r,
        i,
        s = 0;
      n || (n = {});
      var u = function () {
          (s = n.leading === !1 ? 0 : S()),
            (a = null),
            (i = e.apply(o, r)),
            a || (o = r = null);
        },
        c = function () {
          var c = S();
          s || n.leading !== !1 || (s = c);
          var l = t - (c - s);
          return (
            (o = this),
            (r = arguments),
            l <= 0 || l > t
              ? (a && (clearTimeout(a), (a = null)),
                (s = c),
                (i = e.apply(o, r)),
                a || (o = r = null))
              : a || n.trailing === !1 || (a = setTimeout(u, l)),
            i
          );
        };
      return (
        (c.cancel = function () {
          clearTimeout(a), (s = 0), (a = o = r = null);
        }),
        c
      );
    }),
      (t.checkIsInHashMap = function (e) {
        var t = i.getGoldlogVal(e.aplusKey) || {},
          n = t.hash_value || {},
          a = n[e.logkey] || (r.Map ? new r.Map() : {}),
          o = a && a.get ? a.get(e.hash_value) : a[e.hash_value];
        if (o > 1) return !0;
        for (
          var s = t._acHashMap || {},
            u = s[e.logkey] || [],
            c = u.length,
            l = 0;
          l < c;
          l++
        )
          if (u[l].hash_value === e.hash_value) return !0;
        return !1;
      }),
      (t.setRecordSuccess = function (e, t) {
        try {
          var n = e ? e.element : {},
            a = e.hash_value || '';
          n && n.setAttribute && n.setAttribute(t, a);
        } catch (e) {}
      });
  },
  function (e, t) {
    'use strict';
    t.hash = function (e, t) {
      var n,
        a,
        o = 1315423911,
        r = t || o;
      for (n = e.length - 1; n >= 0; n--)
        (a = e.charCodeAt(n)), (r ^= (r << 5) + a + (r >> 2));
      var i = (2147483647 & r).toString(16);
      return i;
    };
  },
  function (e, t) {
    'use strict';
    t.tryToEncodeURIComponent = function (e) {
      var t = e || '';
      if (e)
        try {
          t = encodeURIComponent(decodeURIComponent(e));
        } catch (e) {}
      return t;
    };
  },
  function (e, t, n) {
    'use strict';
    function a(e) {
      return aplus && aplus.getMetaInfo
        ? aplus.getMetaInfo(e)
        : r.getMetaCnt(e);
    }
    var o = n(44),
      r = n(38),
      i = n(6);
    (t.DATA_APLUS_AE_KEY = 'data-aplus-ae'),
      (t.DATA_APLUS_AC_KEY = 'data-aplus-clk'),
      (t.DATA_APLUS_SPM_ANCHOR_ID_KEY = 'data-spm-anchor-id'),
      (t.DATA_APLUS_VT_ITEM_INDEX_KEY = 'data-aplus-vt-pos'),
      (t.LOOP_TIME = 1e3),
      (t.getDefaultRequestCfg = function () {
        return { method: 'POST', pkgSize: 10 };
      });
    var s = function (e) {
      var t = e;
      try {
        var n = a('aplus-auto-exp-visible');
        n && (t = parseFloat(n)), t <= 0 && (t = e);
      } catch (n) {
        t = e;
      } finally {
        return t;
      }
    };
    t.AUTO_AT_VIEW_RATE = s(0.3);
    var u = function (e) {
      var t = e;
      try {
        var n = a('aplus-auto-exp-duration'),
          o = parseInt(n);
        o + '' != 'NaN' && (t = o);
      } catch (e) {
      } finally {
        return t;
      }
    };
    t.EXP_DURATION = u(300);
    var c = function (e, t) {
      var n,
        r = [],
        s = [];
      try {
        n = t || a(e);
        var u = [];
        if (n && 'string' == typeof n)
          try {
            u = JSON.parse(n);
          } catch (e) {
            u = JSON.parse(n.replace(/'/g, '"'));
          }
        else 'object' == typeof n && n.constructor === Array && (u = n);
        if (u && u.constructor === Array)
          for (var c = 0; c < u.length; c++) {
            var l = u[c] || {},
              p = l.logkey || '',
              f = l.tag ? l.tag : '',
              g = l.filter,
              d = l.cssSelector,
              _ = d || (f && g);
            if (!p || !_)
              throw new Error(
                'meta ' + e + ' config error, ' + JSON.stringify(l)
              );
            g = 'string' == typeof g ? g.split('=') : [];
            var h = f;
            if (
              (g.length >= 2
                ? (h +=
                    '[' +
                    g.shift() +
                    '="' +
                    decodeURIComponent(g.join('')) +
                    '"]')
                : 1 == g.length &&
                  g[0] &&
                  (h += '[' + decodeURIComponent(g[0]) + ']'),
              d && (h += d),
              (l.elementSelector = h),
              o.indexof(s, h) > -1)
            )
              throw new Error(
                'meta ' +
                  e +
                  ' config error, tag_filter_cssSelector ' +
                  h +
                  ' repeated'
              );
            s.push(h), r.push(l);
          }
      } catch (e) {
        i.logger({ msg: e });
      } finally {
        return r;
      }
    };
    (t.getAutoExpConfig = function (e) {
      return c('aplus-auto-exp', e) || [];
    }),
      (t.getAutoExpUserFn = function () {
        var e = a('aplus-auto-exp-userfn');
        if (e) {
          var t = window[e] || e;
          if ('function' == typeof t) return t;
        }
        return null;
      }),
      (t.isThrottleWatchDom = function () {
        var e = !1;
        try {
          e = 'throttle' === a('aplus-auto-exp-watchdom');
        } catch (e) {}
        return e;
      }),
      (t.getAutoClkConfig = function (e) {
        return c('aplus-auto-clk', e) || [];
      }),
      (t.getAutoClkUserFn = function () {
        var e = a('aplus-auto-clk-userfn');
        if (e) {
          var t = window[e] || e;
          if ('function' == typeof t) return t;
        }
        return null;
      });
  },
  function (e, t, n) {
    'use strict';
    var a = n(22),
      o = n(42),
      r = n(6),
      i = n(47),
      s = n(48),
      u = n(51),
      c = window,
      l = document,
      p = a.extend({
        eachElements: function (e, t) {
          for (var n = t.logkey || '', a = 0; a < e.length; a++) {
            var o = e[a];
            t._pos_id &&
              !o.getAttribute('data-aplus-pos-id') &&
              o.setAttribute('data-aplus-pos-id', t._pos_id);
            var r = o.getAttribute(u.DATA_APLUS_AC_KEY);
            if (!(r && r.indexOf('_') > 0)) {
              isNaN(parseInt(r)) &&
                ((r = aplus._aplus_ac.elementSelectorSizeMap[
                  t.elementSelector
                ]++),
                o.setAttribute(u.DATA_APLUS_AC_KEY, r)),
                !aplus.globalConfig.isAli &&
                  t.spmB &&
                  t.spmC &&
                  t.spmD &&
                  (o.setAttribute(
                    u.DATA_APLUS_SPM_ANCHOR_ID_KEY,
                    [t.spmB, t.spmC, t.spmD + '_' + (a + 1)].join('.')
                  ),
                  o.setAttribute(u.DATA_APLUS_VT_ITEM_INDEX_KEY, '' + (a + 1)));
              var i = s.getElementHash(t, {
                ignore_attr: !1,
                index: r,
                ele: o,
              });
              if (
                !s.checkIsInHashMap({
                  logkey: n,
                  hash_value: i,
                  aplusKey: '_aplus_ac',
                })
              ) {
                var c = {
                  clkConfig: t,
                  hash_value: i,
                  element: o,
                  status: 0,
                  elementSelector: t.elementSelector,
                };
                s.updateClkHashMap(n, c, 'ADD'),
                  s.setRecordSuccess(c, u.DATA_APLUS_AC_KEY);
              }
            }
          }
        },
        handler_dom_change: function () {
          for (
            var e = this, t = e.autoClkConfig || [], n = 0;
            n < t.length;
            n++
          ) {
            var a = t[n];
            aplus._aplus_ac.elementSelectorSizeMap[a.elementSelector] ||
              (aplus._aplus_ac.elementSelectorSizeMap[a.elementSelector] = 1);
            var o = s.getElements(a, l);
            e.eachElements(o, a);
          }
        },
        throttle_handler_dom_change: s.throttle(function () {
          this.handler_dom_change();
        }, 200),
        init_observer: function (e, t) {
          var n = new e(function () {
              o.wrap(function () {
                var e = aplus._aplus_ac || {};
                ++e.observer_times, t();
              }, 'init_observer_init_elements');
            }),
            a = {
              attributes: !0,
              childList: !0,
              characterData: !0,
              subtree: !0,
            };
          n.observe(l.body, a),
            s.IS_DEBUG &&
              r.logger({ msg: 'aplus_ac init MutationObserver success!' }),
            (this._observer = n);
        },
        init_watch_dom: function () {
          var e = this,
            t = aplus._aplus_ac || {};
          e._loop_observer = setTimeout(function () {
            'blur' !== t.current_win_status
              ? (s.IS_DEBUG &&
                  r.logger({
                    msg:
                      'watch_dom in ac LOOP_TIME is ' +
                      u.LOOP_TIME +
                      'ms total: ' +
                      ++t.watch_times,
                  }),
                e.throttle_handler_dom_change(),
                e.init_watch_dom())
              : (t.watch_dom_running = !1);
          }, u.LOOP_TIME);
        },
        onFocusHandler: function () {
          var e = this,
            t = aplus._aplus_ac || {};
          (t.current_win_status = 'focus'),
            t.watch_dom_running || e.init_watch_dom();
        },
        onBlurHandler: function () {
          var e = aplus._aplus_ac || {};
          e.current_win_status = 'blur';
        },
        onVisibilityChange: function () {
          var e = this;
          'visible' === l.visibilityState
            ? e.onFocusHandler()
            : 'hidden' === l.visibilityState && e.onBlurHandler();
        },
        addAllListener: function () {
          var e = this,
            t = aplus._aplus_ac || {};
          (t.watch_times = 0),
            (t.watch_dom_running = !0),
            e.init_watch_dom(),
            c.WindVane &&
              l.addEventListener &&
              (i.on(l, 'WV.Event.APP.Active', e.onFocusHandler, !1),
              i.on(l, 'WV.Event.APP.Background', e.onBlurHandler, !1)),
            'hidden' in l
              ? i.on(c, 'visibilitychange', e.onVisibilityChange)
              : (i.on(c, 'blur', e.onBlurHandler),
                i.on(c, 'focus', e.onFocusHandler));
        },
        removeAllListener: function () {
          var e = this;
          c.WindVane &&
            l.removeEventListener &&
            (i.un(l, 'WV.Event.APP.Active', e.onFocusHandler, !1),
            i.un(l, 'WV.Event.APP.Background', e.onBlurHandler, !1)),
            'hidden' in l
              ? i.un(c, 'visibilitychange', e.onVisibilityChange)
              : (i.un(c, 'blur', e.onBlurHandler),
                i.un(c, 'focus', e.onFocusHandler));
        },
        init: function () {
          var e = this,
            t = aplus._aplus_ac || {};
          e.throttle_handler_dom_change();
          var n =
            c.MutationObserver ||
            c.WebKitMutationObserver ||
            c.MozMutationObserver;
          n
            ? ((t.observer_times = 0),
              e.init_observer(n, function () {
                e.throttle_handler_dom_change();
              }))
            : e.addAllListener();
        },
        clearDom: function (e, t) {
          var n = this.autoClkConfig || [];
          if (t && 'appendMetaInfo' !== t.from)
            for (var a = 0; a < n.length; a++)
              try {
                for (
                  var o = n[a].elementSelector,
                    r = l.querySelectorAll(o),
                    i = 0;
                  i < r.length;
                  i++
                )
                  r[i].setAttribute(u.DATA_APLUS_AC_KEY, '');
              } catch (e) {}
          this.autoClkConfig = e && e.autoClkConfig;
        },
        clear: function (e) {
          if (!e || 'appendMetaInfo' !== e.from) {
            var t = aplus._aplus_ac || {};
            t._acHashMap && (t._acHashMap = {}),
              t.hash_value && (t.hash_value = {}),
              (aplus._aplus_ac = t),
              this._loop_observer &&
                (clearTimeout(this._loop_observer),
                (this._loop_observer = null)),
              this._observer
                ? this._observer.disconnect()
                : this.removeAllListener();
          }
        },
        reset: function (e, t) {
          this.clearDom(e, t), this.init();
        },
      });
    e.exports = p;
  },
  function (e, t, n) {
    'use strict';
    e.exports = function () {
      return {
        run: function () {
          n(54)();
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    function a() {
      (r = n(56)),
        (i = n(window.IntersectionObserver ? 58 : 60)),
        (s = n(61)),
        (u = n(51));
    }
    function o(e) {
      var t,
        n = window.aplus || (window.aplus = {}),
        a = !1,
        o = !1,
        g = function (e) {
          o ||
            ((o = e),
            a ||
              (c.wrap(function () {
                (t = u.getAutoExpConfig() || []),
                  p.isDebugAplus() &&
                    f.logger({
                      msg: 'aplus-auto-exp metaVaue init: ' + JSON.stringify(t),
                    });
                var e;
                t &&
                  t.length > 0 &&
                  (s.watch_data_change(),
                  i.watch_exposure_change(t),
                  (e = r.create({
                    isThrottleWatch: u.isThrottleWatchDom(),
                    autoExpConfig: t,
                  })),
                  e.init({ type: 'init' })),
                  n.aplus_pubsub.subscribe('setMetaInfo', function (n, a, o) {
                    if ('aplus-auto-exp' === n) {
                      p.isDebugAplus() &&
                        f.logger({
                          msg:
                            'aplus-auto-exp metaVaue change: ' +
                            JSON.stringify(a),
                        });
                      var c = u.getAutoExpConfig(a);
                      if (JSON.stringify(c) === JSON.stringify(t)) return;
                      if (
                        ((t = c),
                        s.clear(),
                        o || (o = { from: 'setMetaInfo' }),
                        i.clear(t, o),
                        e && e.clear(o),
                        a && t && t.length > 0)
                      ) {
                        s.watch_data_change(), i.watch_exposure_change(t);
                        var l = {
                          isThrottleWatch: u.isThrottleWatchDom(),
                          autoExpConfig: t,
                        };
                        e
                          ? e.reset(l, o)
                          : ((e = r.create(l)), e.init({ type: 'init' }));
                      }
                    }
                  });
              }, 'do_init'),
              (a = !0)));
        };
      setTimeout(function () {
        a ||
          f.logger({
            msg: 'aplus_auto_exp_init failed! please check whether aplusJs is loaded correctly!',
          });
      }, 5e3);
      var d = n._$ || {},
        _ = window.g_SPM || {};
      'complete' === d.status && _.spm && g();
      var h = window.aplus_queue || (window.aplus_queue = []);
      h.push({
        action: l.SUBSCRIBE,
        arguments: [
          'aplusReady',
          function (e) {
            'complete' === e && g('aplusReady');
          },
        ],
      }),
        'function' == typeof e && e();
    }
    var r,
      i,
      s,
      u,
      c = n(42),
      l = n(3),
      p = n(55),
      f = n(6);
    e.exports = function () {
      var e = window.aplus || (window.aplus = {});
      e._aplus_auto_exp ||
        ((e._aplus_auto_exp = {
          tags: {},
          status: 'init',
          exp_times: 0,
          elementSelectorSizeMap: {},
        }),
        a(),
        o(function () {
          e._aplus_auto_exp.status = 'complete';
        }));
    };
  },
  function (e, t, n) {
    'use strict';
    var a,
      o = n(2);
    t.isDebugAplus = function (e) {
      if ('boolean' == typeof a) return a;
      if (('boolean' == typeof e && (a = e), localStorage && location)) {
        var t = location.href.match(/aplusDebug=(true|false)/);
        t && t.length > 0 && localStorage.setItem('aplusDebug', t[1]),
          (a = 'true' === localStorage.getItem('aplusDebug'));
      } else a = !1;
      return o.setGoldlogVal('aplusDebug', a), a;
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(22),
      o = n(42),
      r = n(6),
      i = n(47),
      s = n(57),
      u = n(48),
      c = n(51),
      l = window,
      p = document,
      f = a.extend({
        eachElements: function (e, t) {
          for (var n = t.logkey || '', a = 0; a < e.length; a++) {
            var o = e[a],
              r = o.getAttribute(c.DATA_APLUS_AE_KEY);
            if (!(r && r.indexOf('_') > 0)) {
              isNaN(parseInt(r)) &&
                ((r = aplus._aplus_auto_exp.elementSelectorSizeMap[
                  t.elementSelector
                ]++),
                o.setAttribute(c.DATA_APLUS_AE_KEY, r)),
                !aplus.globalConfig.isAli &&
                  t.spmB &&
                  t.spmC &&
                  t.spmD &&
                  (o.setAttribute(
                    c.DATA_APLUS_SPM_ANCHOR_ID_KEY,
                    [t.spmB, t.spmC, t.spmD + '_' + (a + 1)].join('.')
                  ),
                  o.setAttribute(c.DATA_APLUS_VT_ITEM_INDEX_KEY, '' + (a + 1)));
              var i = u.getElementHash(t, {
                  ignore_attr: !1,
                  index: r,
                  ele: o,
                }),
                l = s.checkIsRecord(o, i, c.DATA_APLUS_AE_KEY),
                p = u.checkIsInHashMap({
                  logkey: n,
                  hash_value: i,
                  aplusKey: '_aplus_auto_exp',
                });
              if (!l && !p) {
                var f = {
                  expConfig: t,
                  hash_value: i,
                  element: o,
                  status: 0,
                  elementSelector: t.elementSelector,
                };
                u.updateExpHashMap(n, f, 'ADD');
              }
            }
          }
        },
        handler_dom_change: function (e, t) {
          try {
            for (var n = this.autoExpConfig || [], a = 0; a < n.length; a++) {
              var o = n[a],
                i = u.getElements(o, p);
              aplus._aplus_auto_exp.elementSelectorSizeMap[o.elementSelector] ||
                (aplus._aplus_auto_exp.elementSelectorSizeMap[
                  o.elementSelector
                ] = 1),
                this.eachElements(i, o);
            }
            aplus.aplus_pubsub.publish('APLUS_AE_DOM_CHANGE', t || {});
          } catch (e) {
            r.logger({ msg: e && e.message });
          }
        },
        throttle_handler_dom_change: u.throttle(function (e, t) {
          this.handler_dom_change(e, t);
        }, 200),
        init_watch_dom: function () {
          var e = this,
            t = aplus._aplus_auto_exp || {};
          e._loop_observer = setTimeout(function () {
            'blur' !== t.current_win_status
              ? (aplus.aplusDebug &&
                  r.logger({
                    msg:
                      'watch_dom in ae LOOP_TIME is ' +
                      c.LOOP_TIME +
                      'ms total: ' +
                      ++t.watch_times,
                  }),
                e.handler_dom_change(null, { type: 'polling' }),
                e.init_watch_dom())
              : (t.watch_dom_running = !1);
          }, c.LOOP_TIME);
        },
        onFocusHandler: function () {
          var e = this,
            t = aplus._aplus_auto_exp || {};
          (t.current_win_status = 'focus'),
            t.watch_dom_running || e.init_watch_dom();
        },
        onBlurHandler: function () {
          var e = aplus._aplus_auto_exp || {};
          e.current_win_status = 'blur';
        },
        onVisibilityChange: function () {
          var e = this;
          'visible' === p.visibilityState
            ? e.onFocusHandler()
            : 'hidden' === p.visibilityState && e.onBlurHandler();
        },
        addAllListener: function () {
          var e = this,
            t = aplus._aplus_auto_exp || {};
          (t.watch_times = 0),
            (t.watch_dom_running = !0),
            e.init_watch_dom(),
            l.WindVane &&
              p.addEventListener &&
              (i.on(p, 'WV.Event.APP.Active', e.onFocusHandler, !1),
              i.on(p, 'WV.Event.APP.Background', e.onBlurHandler, !1)),
            'hidden' in p
              ? i.on(l, 'visibilitychange', e.onVisibilityChange)
              : (i.on(l, 'blur', e.onBlurHandler),
                i.on(l, 'focus', e.onFocusHandler));
        },
        removeAllListener: function () {
          var e = this;
          l.WindVane &&
            p.removeEventListener &&
            (i.un(p, 'WV.Event.APP.Active', e.onFocusHandler, !1),
            i.un(p, 'WV.Event.APP.Background', e.onBlurHandler, !1)),
            'hidden' in p
              ? i.un(l, 'visibilitychange', e.onVisibilityChange)
              : (i.un(l, 'blur', e.onBlurHandler),
                i.un(l, 'focus', e.onFocusHandler));
        },
        init_observer: function (e, t) {
          var n = [
              'IFRAME',
              'BODY',
              'OBJECT',
              'SCRIPT',
              'NOSCRIPT',
              'LINK',
              'STYLE',
              '#comment',
            ],
            a = ['class', 'style'],
            i = function (e) {
              return 'characterData' === e.type
                ? [e.target]
                : 'attributes' === e.type && a.indexOf(e.attributeName) > -1
                ? [e.target]
                : 'childList' !== e.type
                ? []
                : void 0;
            },
            s = function (e, a) {
              if (e && e.length > 0)
                for (var r = 0; r < e.length; r++) {
                  var i = e[r] || {},
                    s = i.nodeName,
                    u = aplus._aplus_auto_exp.tags || {};
                  u[s] || (u[s] = 0),
                    u[s]++,
                    (aplus._aplus_auto_exp.tags = u),
                    n.indexOf(s) === -1 &&
                      o.wrap(function () {
                        var e = aplus._aplus_auto_exp || {};
                        ++e.observer_times;
                        var n = a.attributeName;
                        t(i, { type: a.type + (n ? '_' + n : '') });
                      }, 'init_observer_init_elements');
                }
            };
          this._observer ||
            (this._observer = new e(function (e) {
              if (e && e.length > 0)
                for (var t = 0; t < e.length; t++) {
                  var n = e[t] || {},
                    a = u.nodelistToArray(n.addedNodes || []);
                  (a = u.nodelistToArray(i(n), a)), s(a, n);
                }
            }));
          var c = {
            attributes: !0,
            childList: !0,
            characterData: !0,
            subtree: !0,
          };
          this._observer.observe(p.body, c),
            u.IS_DEBUG &&
              r.logger({
                msg: 'aplus_auto_exp init MutationObserver success!',
              });
        },
        init: function (e) {
          var t = this,
            n = aplus._aplus_auto_exp || {};
          e && 'reset' !== e.type && !n.hash_value && (n.hash_value = {}),
            t.handler_dom_change(null, { type: 'aplus_init' });
          var a =
            l.MutationObserver ||
            l.WebKitMutationObserver ||
            l.MozMutationObserver;
          a
            ? ((n.observer_times = 0),
              t.init_observer(a, function (e, n) {
                var a = e && e.parentElement ? e.parentElement : e;
                t.throttle_handler_dom_change(a, n);
              }))
            : t.addAllListener();
        },
        clear: function (e) {
          if (!e || 'appendMetaInfo' !== e.from) {
            var t = aplus._aplus_auto_exp || {};
            t._acHashMap && (t._acHashMap = {}),
              t.hash_value && (t.hash_value = {}),
              (aplus._aplus_auto_exp = t),
              this._loop_observer &&
                (clearTimeout(this._loop_observer),
                (this._loop_observer = null)),
              this._observer
                ? (this._observer.takeRecords(), this._observer.disconnect())
                : this.removeAllListener();
          }
        },
        clearDom: function (e, t) {
          var n = this.autoExpConfig || [];
          if (t && 'appendMetaInfo' !== t.from)
            for (var a = 0; a < n.length; a++)
              try {
                for (
                  var o = n[a].elementSelector,
                    r = p.querySelectorAll(o),
                    i = 0;
                  i < r.length;
                  i++
                )
                  r[i].setAttribute(c.DATA_APLUS_AE_KEY, '');
              } catch (e) {}
          this.autoExpConfig = e && e.autoExpConfig ? e.autoExpConfig : [];
        },
        reset: function (e, t) {
          this.clearDom(e, t), this.init({ type: 'reset' });
        },
      });
    e.exports = f;
  },
  function (e, t) {
    'use strict';
    var n = document,
      a = function (e, t) {
        return (
          t.x >= e.pLeftTop[0] &&
          t.x <= e.pRightBottom[0] &&
          t.y >= e.pLeftTop[1] &&
          t.y <= e.pRightBottom[1]
        );
      },
      o = function (e, t) {
        var n = 0,
          o = a(e, t),
          r = a(e, { x: t.x + t.width, y: t.y }),
          i = a(e, { x: t.x, y: t.y + t.height }),
          s = a(e, { x: t.x + t.width, y: t.y + t.height }),
          u = function () {
            var e = 0;
            return o && s && (e = t.size / t.size), e;
          },
          c = function () {
            var n = 0,
              a = 0;
            return (
              o && r && !i && !s
                ? ((n = t.width), (a = e.pLeftBottom[1] - t.y))
                : !o && r && !i && s
                ? ((n = e.pLeftTop[0] - t.x), (a = t.y))
                : !o && !r && i && s
                ? ((n = t.width),
                  (a = t.height - Math.abs(e.pLeftTop[1] - t.y)))
                : o &&
                  !r &&
                  i &&
                  !s &&
                  ((n = e.pRightTop[0] - t.x), (a = t.height)),
              t.size > 0 ? Math.abs(n * a) / t.size : 0
            );
          },
          l = function () {
            var n = 0,
              a = 0;
            return (
              !o || r || i || s
                ? o || !r || i || s
                  ? o || r || !i || s
                    ? o ||
                      r ||
                      i ||
                      !s ||
                      ((n = e.pLeftTop[0] - t.x), (a = e.pLeftTop[1] - t.y))
                    : ((n = e.pRightTop[0] - t.x), (a = e.pRightTop[1] - t.y))
                  : ((n = e.pLeftBottom[0] - t.x), (a = e.pLeftBottom[1] - t.y))
                : ((n = e.pRightBottom[0] - t.x),
                  (a = e.pRightBottom[1] - t.y)),
              t.size > 0 ? Math.abs(n * a) / t.size : 0
            );
          };
        return (
          (n = u()),
          n > 0 ? n : ((n = c()), n > 0 ? n : ((n = l()), n > 0 ? n : n))
        );
      };
    t.wrapViewabilityRate = function (e, t, n) {
      var a = 0;
      if (e)
        for (var r = 0; r < e.length; r++)
          if (((a = o(e[r], t)), a < n)) return !1;
      return a;
    };
    var r = function (e) {
        return 'number' == typeof e && NaN !== e;
      },
      i = function (e) {
        var t = {};
        return (
          e &&
            ('function' == typeof e.getBoundingClientRect &&
              (t = e.getBoundingClientRect() || {}),
            r(t.x) || (r(t.left) && (t.x = t.left)),
            r(t.y) || (r(t.top) && (t.y = t.top)),
            r(t.width) || (t.width = e.offsetWidth),
            r(t.height) || (t.height = e.offsetHeight)),
          t
        );
      };
    (t.getElementPosition = i),
      (t.getWinPositions = function (e) {
        var t = [];
        if (e && 'function' == typeof document.querySelector) {
          var a = document.querySelector(e);
          if (a) {
            var o = i(a) || {};
            r(o.x) &&
              r(o.y) &&
              r(o.width) &&
              r(o.height) &&
              t.push({
                pLeftTop: [o.x, o.y],
                pRightTop: [o.x + o.width, o.y],
                pLeftBottom: [o.x, o.y + o.height],
                pRightBottom: [o.x + o.width, o.y + o.height],
              });
          }
        }
        var s = n.documentElement,
          u = n.body,
          c = s.clientWidth || u.offsetWidth || 0,
          l = s.clientHeight || u.offsetHeight || 0;
        return (
          t.push({
            pLeftTop: [0, 0],
            pRightTop: [c, 0],
            pLeftBottom: [0, l],
            pRightBottom: [c, l],
          }),
          t
        );
      }),
      (t.checkIsRecord = function (e, t, n) {
        var a;
        try {
          if (e && e.getAttribute) {
            var o = e.getAttribute(n) || '';
            a = t ? o === t : !!o;
          }
        } catch (e) {}
        return a;
      }),
      (t.getViewabilityRateInWindow = function (e, t, n) {
        var a = 0;
        if (e)
          for (var o = 0; o < e.length; o++)
            if (((a = t / e[o].size), a >= n)) return a;
        return a;
      });
  },
  function (e, t, n) {
    'use strict';
    function a(e, t, n) {
      var a = p.getWinPositions(),
        o = 0,
        r = u.getGoldlogVal('_aplus_auto_exp') || {},
        i = r._acHashMap || {};
      for (var c in i)
        for (var l = i[c] || [], h = 0; h < l.length; h++) {
          var m = l[h] || {};
          m.eventType = 'IObserver';
          var v = !!n || m.element === t.target;
          if (0 === m.status && m.expConfig && v) {
            var y = t.boundingClientRect || {};
            if (
              (y.width ||
                y.height ||
                (y = t.target.getBoundingClientRect() || {}),
              y.width && y.height)
            ) {
              (m = s.assign(m, y)),
                (m.x = y.x || y.left),
                (m.y = y.y || y.top),
                (m.width = y.width),
                (m.height = y.height),
                (m.size = y.width * y.height);
              var b = p.checkIsRecord(
                  m.element,
                  m.hash_value,
                  '_aplus_auto_exp'
                ),
                E = m.width * m.height * t.intersectionRatio,
                w = p.getViewabilityRateInWindow(a, E, _);
              if (!b) {
                var A = t.intersectionRatio >= d;
                if (A || w >= _) {
                  (m.exposureTime = e), (m.status = 1);
                  var S = f.getAutoExpUserFn();
                  S &&
                    (m.userParams = g.autoUserFnHandler(
                      S,
                      m.element,
                      m.elementSelector
                    )),
                    (m.viewabilityRate = A ? t.intersectionRatio : w),
                    (m.viewability = A ? 'intersection' : 'fillwindow'),
                    f.EXP_DURATION || (m.status = 2),
                    g.updateExpHashMap(c, m, 'UPDATE'),
                    ++o;
                } else
                  w &&
                    g.updateExpHashMap(
                      c,
                      s.assign(l[h], { lastEventType: m.eventType }),
                      'UPDATE'
                    );
              }
            }
          }
        }
      return o;
    }
    function o(e, t) {
      var n = 'APLUS_AE_EXPOSURE_CHANGE',
        o = e && e.type ? e.type : 'IObserver',
        r = new Date().getTime(),
        i = 0;
      (i = t ? l.filterStartExposureSize(r, e) : a(r, e)),
        i > 0 &&
          (f.EXP_DURATION
            ? setTimeout(function () {
                (i = l.filterEndExposureSize(r, o)),
                  i > 0 &&
                    aplus.aplus_pubsub.publish(n, { size: i, eventType: o });
              }, f.EXP_DURATION)
            : aplus.aplus_pubsub.publish(n, { size: i, eventType: o }));
    }
    function r(e) {
      var t = { root: null, rootMargin: '0px', threshold: d };
      return new m(function (e) {
        c(e, function (e) {
          e.intersectionRatio > 0 && o(e);
        });
      }, s.assign(t, e));
    }
    function i(e) {
      if (m) {
        v.io_base || (v.io_base = r());
        var t = u.getGoldlogVal('_aplus_auto_exp') || {},
          n = t._acHashMap || {};
        for (var a in n)
          for (var o = n[a] || [], i = 0; i < o.length; i++) {
            var s = o[i] || {};
            if (!s.inObserver) {
              var c,
                l = 'io_v_' + encodeURIComponent(s.positionSelector);
              s.positionSelector &&
                !v[l] &&
                ((c = r({
                  root: document.querySelector(s.positionSelector),
                  expConfig: e,
                })),
                (v[l] = c)),
                c ? c.observe(s.element) : v.io_base.observe(s.element),
                (s.inObserver = !0);
            }
          }
      }
      return !0;
    }
    var s = n(32),
      u = n(2),
      c = n(36),
      l = n(59),
      p = n(57),
      f = n(51),
      g = n(48),
      d = f.AUTO_AT_VIEW_RATE,
      _ = f.AUTO_AT_VIEW_RATE_IN_WINDOW,
      h = window,
      m = h.IntersectionObserver,
      v = {};
    (aplus._aplus_auto_exp.iobserverMap = v),
      (t.watch_exposure_change = function (e) {
        aplus.aplus_pubsub.subscribe('APLUS_AE_DOM_CHANGE', function () {
          i(e);
        }),
          i(e);
      }),
      (t.clear = function (e, t) {
        if (t && 'appendMetaInfo' !== t.from)
          for (var n in v) {
            var a = v[n];
            a.disconnect();
          }
      });
  },
  function (e, t, n) {
    'use strict';
    var a,
      o = n(2),
      r = n(57),
      i = n(51),
      s = n(48),
      u = i.AUTO_AT_VIEW_RATE,
      c = i.AUTO_AT_VIEW_RATE_IN_WINDOW,
      l = function (e) {
        for (var t; e && 'HTML' !== e.tagName; ) {
          t = e.style.display;
          {
            if ('none' === t) break;
            e = e.parentNode;
          }
        }
        return 'none' === t;
      };
    (t.filterStartExposureSize = function (e, t) {
      var n = 0,
        a = r.getWinPositions(),
        p = o.getGoldlogVal('_aplus_auto_exp') || {},
        f = p._acHashMap || {};
      for (var g in f)
        for (var d = f[g] || [], _ = 0; _ < d.length; _++) {
          var h = d[_] || {};
          if (0 === h.status && h.expConfig && !l(h.element)) {
            var m = r.getElementPosition(h.element);
            if (m.width && m.height) {
              (h.x = m.x),
                (h.y = m.y),
                (h.eventType = t),
                (h.width = m.width),
                (h.height = m.height),
                (h.size = m.width * m.height);
              var v;
              h.expConfig.positionSelector &&
                (v = r.getWinPositions(h.expConfig.positionSelector));
              var y = r.wrapViewabilityRate(v || a, h, u),
                b = y >= u,
                E = y;
              v && (E = r.wrapViewabilityRate(a, h, u));
              var w = h.width * h.height * E,
                A = r.getViewabilityRateInWindow(a, w, c),
                S = r.checkIsRecord(h.element, h.hash_value, '_aplus_auto_exp');
              if ((b || A >= c) && !S) {
                (h.exposureTime = e), (h.status = 1);
                var x = i.getAutoExpUserFn();
                x &&
                  (h.userParams = s.autoUserFnHandler(
                    x,
                    h.element,
                    h.elementSelector
                  )),
                  i.EXP_DURATION ||
                    ((h.viewabilityRate = b ? y : A),
                    (h.viewability = b ? 'intersection' : 'fillwindow'),
                    (h.status = 2)),
                  s.updateExpHashMap(g, h, 'UPDATE'),
                  ++n;
              }
            }
          }
        }
      return n;
    }),
      (t.filterEndExposureSize = function (e, t) {
        var n = 0;
        a || (a = r.getWinPositions());
        var i = o.getGoldlogVal('_aplus_auto_exp') || {},
          c = i._acHashMap || {};
        for (var l in c)
          for (var p = c[l] || [], f = 0; f < p.length; f++) {
            var g = p[f] || {};
            if (1 === g.status && g.exposureTime === e && g.expConfig) {
              (g.eventType = t),
                g.expConfig.positionSelector &&
                  (a = r.getWinPositions(g.expConfig.positionSelector));
              var d = r.wrapViewabilityRate(a, g, u),
                _ = r.checkIsRecord(g.element, g.hash_value, '_aplus_auto_exp');
              d && !_
                ? ((g.viewabilityRate = d),
                  (g.status = 2),
                  s.updateExpHashMap(l, g, 'UPDATE'),
                  ++n)
                : ((g.status = 0),
                  (g.exposureTime = ''),
                  s.updateExpHashMap(l, g, 'UPDATE'));
            }
          }
        return n;
      });
  },
  function (e, t, n) {
    'use strict';
    var a = n(47),
      o = n(59),
      r = n(48),
      i = n(51),
      s = function (e) {
        var t = 'APLUS_AE_EXPOSURE_CHANGE',
          n = e && e.type ? e.type : 'init',
          a = new Date().getTime(),
          r = o.filterStartExposureSize(a, n);
        r > 0 &&
          (i.EXP_DURATION
            ? setTimeout(function () {
                (r = o.filterEndExposureSize(a, n)),
                  r > 0 &&
                    aplus.aplus_pubsub.publish(t, {
                      size: r,
                      eventType: n,
                    });
              }, i.EXP_DURATION)
            : aplus.aplus_pubsub.publish(t, { size: r, eventType: n }));
      },
      u = r.throttle(function (e) {
        s(e);
      }, 100),
      c = {},
      l = function (e, t) {
        if (e && e.forEach && Object.keys && document.querySelector) {
          e.forEach(function (e) {
            e.positionSelector &&
              document.querySelector(e.positionSelector) &&
              (c[e.positionSelector] = !0);
          });
          var n = Object.keys(c);
          n.forEach(function (e) {
            a[t] &&
              a[t](document.querySelector(e), 'scroll', function (e) {
                u(e);
              });
          });
        }
      };
    (t.watch_exposure_change = function (e) {
      aplus.aplus_pubsub.subscribe('APLUS_AE_DOM_CHANGE', s),
        a.on(window, 'touchmove', u),
        a.on(window, 'scroll', u),
        a.on(window, 'resize', s),
        l(e, 'on');
    }),
      (t.clear = function (e) {
        a.un(window, 'touchmove', u),
          a.un(window, 'scroll', u),
          a.un(window, 'resize', s),
          l(e, 'un');
      });
  },
  function (e, t, n) {
    'use strict';
    function a(e, t, n) {
      var a = '0';
      if (n) {
        if ('spmc' === e) {
          var o = n.split('.');
          (a = o[2] ? o[2] : o[3]),
            /^(\i|\d)[0-9]+$/.test(a) && (a = '0'),
            (n = [o[0], o[1], a].join('.'));
        }
      } else {
        n = '';
        var r = window.g_SPM || {};
        if ('function' == typeof r.getParam) {
          var i = r.getParam(t);
          'spmc' === e
            ? ((a = t.getAttribute('data-spm') || '0'),
              (n = [i.a, i.b, a].join('.')))
            : (n = [i.a, i.b, i.c, i.d].join('.'));
        }
      }
      return n;
    }
    function o() {
      i ||
        ((i = !0),
        aplus.on(window, 'beforeunload', function () {
          clearInterval(r);
          for (var e = 0; e < m.length; e++) aplus_queue.push(m[e]);
        }));
    }
    var r,
      i,
      s = n(42),
      u = n(32),
      c = n(2),
      l = n(6),
      p = n(46),
      f = n(48),
      g = n(51),
      d = function () {
        var e = aplus.aplusDebug,
          t = {},
          n = g.getDefaultRequestCfg(),
          o = c.getGoldlogVal('_aplus_auto_exp') || {},
          r = o._acHashMap || {};
        return (
          p(r, function (r, i) {
            for (var s = i || [], c = 0, p = s.length; c < p; c++) {
              var g = s[c] || {};
              if (2 === g.status) {
                (g.status = 3),
                  f.updateExpHashMap(r, g, 'UPDATE'),
                  o.exp_times++;
                var d,
                  _ = g.expConfig || {},
                  h = goldlog.spm_ab ? goldlog.spm_ab.join('.') : '0.0.0.0',
                  m = a(_.eltype, g.element) || h,
                  v = '';
                try {
                  var y = new Number(g.viewabilityRate);
                  d = y.toFixed(2);
                } catch (e) {
                  d = g.viewabilityRate;
                }
                var b = {
                  _w: g.width,
                  _h: g.height,
                  _x: g.x,
                  _y: g.y,
                  _rate: d,
                  _viewability: g.viewability,
                };
                'object' == typeof g.userParams &&
                  ('object' == typeof g.userParams.userdata &&
                    (b = u.assign(b, g.userParams.userdata)),
                  g.userParams.spm && (m = a(_.eltype, '', g.userParams.spm)),
                  g.userParams.scm && (v = g.userParams.scm)),
                  (f.isMethod(_.method) || f.isPkgSize(_.pkgSize)) &&
                    (n = f.filterExpConfigRequestCfg(_));
                var E = { scm: v, spm: m, aplusContentId: '' },
                  w = f.fillPropsData(_, g.element, b);
                (w = f.fillFilterData(_, g.element, b)),
                  aplus.globalConfig.isAli
                    ? (E.exargs = w)
                    : ((w = f.fillSpmData(_, g.element, b)), (E = w)),
                  t[r] || (t[r] = []),
                  t[r].push(E),
                  e &&
                    l.logger({
                      msg:
                        'logkey = ' +
                        r +
                        ', params = ' +
                        decodeURIComponent(JSON.stringify(E)),
                    });
              }
            }
          }),
          { logkeyContainer: t, request_cfg: n }
        );
      },
      _ = function (e) {
        for (var t = [], n = 0, a = e.length; n < a; n++) {
          var o = e[n] || {},
            r = {};
          p(o, function (e, t) {
            'element' !== e && (r[e] = t);
          });
          var i = u.cloneDeep(r);
          (i.element = o.element), t.push(i);
        }
        return t;
      },
      h = function (e) {
        var t = c.getGoldlogVal('_aplus_auto_exp') || {},
          n = t._acHashMap || {},
          a = [];
        p(n, function (t, n) {
          for (var o = _(n) || [], r = 0, i = o.length; r < i; r++) {
            var s = o[r] || {},
              u = n[r] || {};
            if (3 === s.status)
              try {
                f.setRecordSuccess(u, g.DATA_APLUS_AE_KEY),
                  aplus.aplus_pubsub.publish('APLUS_ELEMENT_EXPOSURE', {
                    logkey: t,
                    v_origin: u,
                    options: e,
                  }),
                  a.push(u);
              } catch (e) {
                l.logger({ msg: e && e.message });
              }
          }
          for (; a.length > 0; ) f.updateExpHashMap(t, a.pop(), 'CLEAR');
        });
      },
      m = [],
      v = function () {
        r = setInterval(function () {
          m.length > 0
            ? aplus_queue.push(m.pop())
            : (clearInterval(r), (r = null));
        }, 200);
      },
      y = function (e, t, n) {
        var a = e.logkeyContainer || [],
          o = e.request_cfg || {};
        s.wrap(function () {
          p(a, function (e, a) {
            if (a && a.length > 0) {
              for (var r = 0; r < a.length; ) {
                var i = [],
                  s = JSON.stringify(a.slice(r, r + o.pkgSize));
                i.push('expdata=' + s),
                  i.push('_is_auto_exp=1'),
                  i.push('_eventType=' + t.eventType),
                  i.push('_method=' + o.method),
                  i.push('_pkgSize=' + o.pkgSize);
                var u = o.method || 'POST';
                aplus.globalConfig.isAli &&
                'POST' === u &&
                navigator &&
                navigator.sendBeacon &&
                m.length < 10
                  ? m.push({
                      action: 'aplus.record',
                      arguments: [e, 'EXP', i.join('&'), u],
                    })
                  : aplus_queue.push({
                      action: 'aplus.record',
                      arguments: [e, 'EXP', i.join('&'), 'GET'],
                    }),
                  (r += o.pkgSize);
              }
              n(t);
            }
          });
        }, 'recordAplusAt');
      },
      b = function (e, t, n) {
        var a = e.logkeyContainer || [],
          o = e.request_cfg || {};
        s.wrap(function () {
          p(a, function (e, a) {
            if (a && a.length > 0) {
              for (var r = 0; r < a.length; ) {
                var i = [],
                  s = a[r];
                for (var u in s) i.push(u + '=' + s[u]);
                i.push('_is_auto_exp=1'),
                  i.push('_eventType=' + t.eventType),
                  i.push('_method=' + o.method);
                var c = o.method || 'POST';
                aplus.globalConfig.isAli &&
                'POST' === c &&
                navigator &&
                navigator.sendBeacon &&
                m.length < 10
                  ? m.push({
                      action: 'aplus.record',
                      arguments: [e, 'EXP', i.join('&'), c],
                    })
                  : aplus_queue.push({
                      action: 'aplus.record',
                      arguments: [e, 'EXP', i.join('&'), 'GET'],
                    }),
                  (r += 1);
              }
              n(t);
            }
          });
        }, 'recordAplusAt');
      },
      E = function (e) {
        if (e.size > 0) {
          r || v();
          var t = d() || {};
          aplus.globalConfig.isAli ? y(t, e, h) : b(t, e, h);
        }
      };
    (t.watch_data_change = function () {
      aplus.aplus_pubsub.subscribe('APLUS_AE_EXPOSURE_CHANGE', E), o();
    }),
      (t.clear = function () {
        aplus.aplus_pubsub.unsubscribe('APLUS_AE_EXPOSURE_CHANGE', E);
      });
  },
  function (e, t, n) {
    'use strict';
    var a = n(10),
      o = n(3),
      r = n(29).nameStorage,
      i = n(39);
    e.exports = function () {
      return {
        recordValInWindowName: function () {
          var e,
            t,
            n = o.HTTPS == location.protocol,
            a = aplus.globalConfig.NAMESTORAGE_KEYS || {},
            s = parent !== self;
          if (!s && n) {
            var u = location.href,
              c =
                n &&
                (u.indexOf('login.taobao.com') >= 0 ||
                  u.indexOf('login.tmall.com') >= 0),
              l = i.getRefer(a);
            c && l
              ? ((e = l), (t = r.getItem(a.REFERRER_PV_ID)))
              : ((e = u), (t = aplus.pvid)),
              r.setItem(a.REFERRER, e),
              r.setItem(a.REFERRER_PV_ID, t);
          }
        },
        run: function () {
          var e = this;
          a.on(window, 'beforeunload', function () {
            e.recordValInWindowName();
          });
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(10),
      o = n(64);
    e.exports = function () {
      return {
        do_tracker_lostpv: function (e) {
          if (e && e.page) {
            var t = e.spm_ab ? e.spm_ab.split('.') : [],
              n = navigator && navigator.sendBeacon ? 'post' : 'get',
              a = 'record_lostpv_by' + n + '_' + e.msg,
              r = new o({
                ratio: e.ratio || this.options.config.lostPvRecordRatio,
              });
            r.run({
              code: 102,
              page: e.page,
              msg: a,
              spm_a: t[0],
              spm_b: t[1],
              c1: e.duration,
              c2: e.page_url,
            });
          }
        },
        recordLostPv: function (e) {
          var t = window.aplus || {},
            n = (t._$ = t._$ || {}),
            a = t.spm_ab ? t.spm_ab.join('.') : '0.0',
            o = n.send_pv_count || 0;
          if (o < 1 && navigator && navigator.sendBeacon) {
            var r = location.hostname + location.pathname;
            this.do_tracker_lostpv({
              page: r,
              page_url: location.protocol + '//' + r,
              duration: e,
              spm_ab: a,
              msg: 'dom_state=' + document.readyState,
            });
          }
        },
        run: function () {
          var e = this,
            t = new Date();
          a.on(window, 'beforeunload', function () {
            var n = new Date(),
              a = n.getTime() - t.getTime();
            e.recordLostPv(a);
          });
        },
      };
    };
  },
  function (e, t, n) {
    var a = n(31),
      o = n(32),
      r = n(6),
      i = { ratio: 1, logkey: 'fsp.1.1', gmkey: '', chksum: 'H46747615' },
      s = function (e) {
        (e && 'object' == typeof e) || (e = i),
          (this.opts = e),
          (this.opts.ratio = e.ratio || i.ratio),
          (this.opts.logkey = e.logkey || i.logkey),
          (this.opts.gmkey = e.gmkey || i.gmkey),
          (this.opts.chksum = e.chksum || i.chksum);
      },
      u = s.prototype;
    (u.getRandom = function () {
      return Math.floor(100 * Math.random()) + 1;
    }),
      (u.run = function (e, t) {
        var n,
          i,
          s = { pid: 'aplus', code: 101, msg: '异常内容' },
          u = '';
        try {
          var c = window.aplus || {},
            l = c._$ || {},
            p = l.meta_info || {},
            f = parseFloat(p['aplus-tracker-rate']);
          if (
            ((n = this.opts || {}),
            ('number' == typeof f && f + '' != 'NaN') || (f = n.ratio),
            (i = this.getRandom()),
            t || i <= 100 * f)
          ) {
            (u = '//gm.mmstat.com/' + n.logkey),
              (e.rel = c.globalConfig.script_name + '@' + c.globalConfig.lver),
              (e.type = e.code),
              (e.uid = encodeURIComponent(c.getCookieCna('cna'))),
              (e = o.assign(s, e));
            var g = a.obj2param(e);
            c.tracker = c.send(
              u,
              { cache: o.makeCacheNum(), gokey: g, logtype: '2' },
              'POST'
            );
          }
        } catch (e) {
          r.logger({ msg: 'tracker.run() exec error: ' + e });
        }
      }),
      (e.exports = s);
  },
  function (e, t, n) {
    'use strict';
    var a = n(2);
    e.exports = function () {
      return {
        run: function () {
          var e = a.getGlobalValue('aplus');
          if (!e._aplus_cplugin_m) {
            var t = this.options.config;
            e._aplus_cplugin_m = n(66).run(t);
          }
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(6),
      o = n(64),
      r = navigator && navigator.sendBeacon ? 'post' : 'get';
    t.run = function (e) {
      return {
        status: 'complete',
        do_tracker_jserror: function (t) {
          try {
            var n = new o({
                logkey: t ? t.logkey : '',
                ratio:
                  t && 'number' == typeof t.ratio && t.ratio > 0
                    ? t.ratio
                    : e.jsErrorRecordRatio,
              }),
              i = ['Message: ' + t.message, 'Error object: ' + t.error].join(
                ' - '
              ),
              s = aplus.spm_ab || [],
              u = location ? location.hostname + location.pathname : '';
            n.run({
              code: 110,
              page: u,
              msg: 'record_jserror_by' + r + '_' + t.message,
              spm_a: s[0],
              spm_b: s[1],
              c1: i,
              c2: t.filename,
              c3: location ? location.protocol + '//' + u : '',
            });
          } catch (e) {
            a.logger({ msg: e });
          }
        },
        do_tracker_browser_support: function (t) {
          var n = !1;
          try {
            if (t && t.page) {
              var i = t.spm_ab ? t.spm_ab.split('.') : [],
                s = new o({ ratio: t.ratio || e.browserSupportRatio }),
                u = aplus._aplus_client || {},
                c = u.ua_info || {};
              s.run({
                code: 111,
                page: t.page,
                msg: t.msg + '_by' + r,
                spm_a: i[0],
                spm_b: i[1],
                c1: [c.o, c.b, c.w].join('_'),
                c2: t.etag || '',
                c3: t.cna || '',
              }),
                (n = !0);
            }
          } catch (e) {
            a.logger({ msg: e });
          }
          return n;
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    e.exports = function () {
      return {
        run: function () {
          var e = n(68),
            t = e.create({ WS: null, CTX: window, CTX_TYPE: 'WEB' });
          t.run(this.options);
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    var a,
      o = n(69),
      r = n(2),
      i = r.getGlobalValue('aplus'),
      s = n(70),
      u = n(72),
      c = n(76),
      l = n(3),
      p = n(15),
      f = n(8),
      g = n(6);
    e.exports = s.extend({
      handlerMiddleware: function (e) {
        var t = o.changeToObj(e.what_to_send.logdata);
        c().setDebug(!!i.getMetaInfo('DEBUG'));
        var n,
          r = u(t, e.userdata);
        i._h5_share_enable
          ? (n = 'POST')
          : ((n = e.where_to_send.method),
            ('POST' === n && navigator && navigator.sendBeacon) ||
              (r = 'd=' + encodeURIComponent(r))),
          c().i('event before send to: ', e.where_to_send.url),
          a || (a = new Date().getTime()),
          a &&
            a - new Date().getTime() > l.SHARE_CACHE_INTERVAL &&
            i._h5_share_enable &&
            (p.remove('__sharefrom'),
            p.remove('__fromappkey'),
            p.remove('_um_ssrc'),
            p.remove('_um_channel'),
            p.remove('_um_campaign')),
          i._h5_share_enable
            ? f.request4um({
                url: e.where_to_send.url,
                method: n,
                data: r,
                success: function (e) {
                  e && e.imprint && p.set(l.IMPRINT, e.imprint);
                },
                error: function (e) {
                  g.logger({ msg: 'aplus weblogs error: ' + e });
                },
              })
            : i.send(e.where_to_send.url, r, n);
      },
    });
  },
  function (e, t, n) {
    'use strict';
    var a = n(2);
    t.getKeyIndex = function (e) {
      var t = { protocol: 1, event_args: 25 };
      return t[e];
    };
    var o = '-';
    (t.changeToArray = function (e, t) {
      var n = a.getGlobalValue('aplus'),
        r = t.event_timestamp.getTime().toString(),
        i = t.client || {},
        s = i.screenWidth || '',
        u = i.screenHeight || '',
        c = s + '*' + u,
        l = s && u ? c : o,
        p = i.language || o,
        f = t.gokey || {},
        g = JSON.stringify(f),
        d = JSON.stringify({
          customSdkId: t.sdk_info.customSdkId || '',
          platform_type: t.sdk_info.platformType || '',
        }),
        _ = t.appKey || t.appId || o,
        h = JSON.stringify({
          appId: i.appId || n.getMetaInfo('miniAppId') || '',
        }),
        m = JSON.stringify(t.sessionArgs || {}),
        v = JSON.stringify(t.globalArgs || {}),
        y = t.arg1 || t.logkey || o;
      0 === y.indexOf('/$$_') && (y = y.substring(1, y.length)),
        '2001' === t.event_code &&
          t.trackerEventCode &&
          (y = t.trackerEventCode);
      var b = [
        t.cache,
        t.method || 'GET',
        o,
        l,
        _,
        h,
        t._dev_id || o,
        '{}',
        t._user_nick || o,
        t._user_id || o,
        t._anony_id || o,
        '{}',
        p,
        t.timeZone || o,
        i.os || o,
        i.os_version || o,
        d,
        t._session_id || o,
        t.cna || o,
        r,
        encodeURIComponent(t.url) || o,
        t.event_code || o,
        encodeURIComponent(t.pre) || o,
        v,
        m,
        g,
        y,
        t.sdk_info.jsver,
        t.sdk_info.lver,
        i.appVersion || 'devtools' || o,
        i.brand || o,
        o,
        i.networkType || o,
      ];
      return b;
    }),
      (t.changeToObj = function (e) {
        var t = e.event_timestamp.getTime().toString(),
          n = e.client || {},
          a = n.language || o,
          r = e.gokey || {},
          i = JSON.stringify(r),
          s = JSON.stringify({
            customSdkId: e.sdk_info.customSdkId || '',
            platform_type: e.sdk_info.platformType || '',
          }),
          u = e.appKey || e.appId || o,
          c = JSON.stringify({
            appId: n.appId || aplus.getMetaInfo('miniAppId') || '',
          }),
          l = JSON.stringify(e.sessionArgs || {}),
          p = JSON.stringify(e.globalArgs || {}),
          f = e.arg1 || e.logkey || o;
        0 === f.indexOf('/$$_') && (f = f.substring(1, f.length)),
          '2001' === e.event_code &&
            e.trackerEventCode &&
            (f = e.trackerEventCode);
        var g = {};
        (g.platform = e.sdk_info.platformType || ''),
          (g.sdk_type = g.platform ? g.platform + 'mp' : ''),
          (g.appkey = u),
          (g.sdk_version = e.sdk_info.lver),
          (g.device_type = n.device_model || ''),
          (g.os = n.os || ''),
          (g.os_version = n.os_version || ''),
          (g.jsver = e.sdk_info.jsver),
          (g.pixel_ratio = window.devicePixelRatio || '');
        var d = Math.round(n.screenWidth * (window.devicePixelRatio || 1)),
          _ = Math.round(n.screenHeight * (window.devicePixelRatio || 1));
        (g.resolution = d > _ ? d + '*' + _ : _ + '*' + d),
          (g.language = a),
          (g.app_version = aplus.getMetaInfo('appVersion') || 'devtools'),
          (g.arg1 = f),
          (g.event_args = i),
          (g.event_code = e.event_code || ''),
          (g.sessionArgs = l),
          (g.global_args = p),
          (g.app_ext_info = c),
          (g.time = t),
          (g.cna = e.cna || ''),
          (g.url = e.url || ''),
          (g.pre = e.pre || ''),
          (g.method = e.method || 'GET'),
          (g.log_id = e.cache || ''),
          (g.sdk_info = s);
        var h = aplus.getMetaInfo('aplus-exdata');
        return (
          h &&
            h.aplus_track_debug_id &&
            (g.track_debug_id = h.aplus_track_debug_id),
          g
        );
      });
  },
  function (e, t, n) {
    'use strict';
    var a = n(22),
      o = n(71),
      r = n(3);
    e.exports = a.extend({
      subscribeLogs: function (e, t) {
        o.pushIntoGoldlogQueue(r.SUBSCRIBE, [
          e,
          function (e) {
            e.status === r.COMPLETE && t(e);
          },
        ]);
      },
      getLogicSymbol: function () {
        return 'ALI' === this.format ? '&' : '||';
      },
      handlerMiddleware: function () {},
      watchLOG: function () {
        var e = this;
        e.subscribeLogs(r.MW_CHANGE_PV, function (t) {
          e.handlerMiddleware(t, 'pv');
        }),
          e.subscribeLogs(r.MW_CHANGE_HJLJ, function (t) {
            e.handlerMiddleware(t, r.APLUS);
          });
      },
      run: function () {
        this.watchLOG();
      },
    });
  },
  function (e, t, n) {
    'use strict';
    var a = n(2);
    t.pushIntoGoldlogQueue = function (e, t) {
      var n = a.getGlobalValue('aplus_queue'),
        o = a.getGlobalValue('aplus'),
        r = e.split('.'),
        i = o[r[1]],
        s = i ? i[r[2]] : null;
      o && 2 === r.length && i
        ? i.apply(o, t)
        : 3 === r.length && s
        ? s.apply(i, t)
        : n.push({ action: e, arguments: t });
    };
  },
  function (e, t, n) {
    function a() {
      if (g._h5_share_enable) {
        var e = {},
          t = v.get('__sharefrom'),
          n = v.get('__fromappkey'),
          a = v.get('_um_ssrc'),
          o = v.get('_um_channel'),
          r = v.get('_um_campaign');
        return (
          t && (e.sharefrom = t),
          n && (e.fromappkey = n),
          a && (e._um_ssrc = a),
          o && (e._um_channel = o),
          r && (e._um_campaign = r),
          e
        );
      }
    }
    function o(e, t) {
      try {
        var n = {},
          o = g.getMetaInfo('globalproperty');
        o && (n.gp = o);
        var r,
          s = t.gokey;
        (r =
          'string' == typeof s
            ? JSON.parse(
                '{"' + s.replace(/\&/g, '","').replace(/\=/g, '":"') + '"}',
                function (e, t) {
                  return '' === e ? t : decodeURIComponent(t);
                }
              )
            : 'object' == typeof s
            ? i(s)
            : {}),
          e.url &&
            ((n.page_name =
              g.getPageName() ||
              r.spmB ||
              r['data-pagename'] ||
              r.page_name ||
              e.url ||
              '-'),
            (n.url = e.url || '-'),
            n.page_name &&
              r.spmC &&
              ((n['spm-cnt'] = [
                encodeURIComponent(n.page_name),
                encodeURIComponent(r.spmC),
                encodeURIComponent(r.spmD),
              ]
                .filter(function (e) {
                  return !!e;
                })
                .join('.')),
              delete r.spmC,
              delete r.spmD,
              delete r.spmB));
        var u = i(r);
        for (var l in u)
          'string' == typeof l &&
            c.startsWith(l, '_') &&
            ((n[l] = u[l]), delete r[l]);
        (n = m.assign(n, a() || {})),
          (n.is_auto =
            t.gokey && 'string' == typeof t.gokey && t.gokey.match('is_auto')
              ? 1
              : 0);
        var p = _(t.logkey, m.assign(n, { cusp: r }));
        return p;
      } catch (e) {
        return console.warn('JSON parse failed', e), {};
      }
    }
    function r(e, t) {
      var n = g.getMetaInfo('globalproperty'),
        o = {};
      (o.r = e.arg1), n && (o.gp = n), (o.is_auto = e.is_auto ? 1 : 0);
      var r = t,
        s = i(
          c.deleteInfo(r, [
            '_anony_id',
            '_dev_id',
            '_session_id',
            '_user_id',
            '_user_nick',
            '_src_pos_id',
          ])
        );
      if (
        (s.duration && ((o.duration = s.duration), delete s.duration),
        e.url &&
          ((o.page_name =
            g.getPageName() ||
            s.spmB ||
            s.page_name ||
            (document.body.dataset && document.body.dataset.pagename) ||
            e.url ||
            '-'),
          (o.url = e.url),
          (o['spm-cnt'] = encodeURIComponent(o.page_name))),
        e.pre &&
          ((o.ref_url = e.pre || '-'),
          g._h5_share_enable && o.ref_url.length > 1))
      ) {
        var u = o.ref_url.match(/(\w|-)+\.(\w|-)+\.(\w|-)+/);
        u && u.length > 0 && (o._um_referer_domain = u[0]);
      }
      return (
        (o = m.assign(o, a() || {})), _(f.PAGE_START, m.assign(o, { cusp: s }))
      );
    }
    var i = n(73),
      s = n(74),
      u = n(2),
      c = n(75),
      l = n(77),
      p = n(78),
      f = n(3),
      g = u.getGlobalValue('aplus'),
      d = n(79),
      _ = n(80),
      h = n(76),
      m = n(32),
      v = n(15);
    e.exports = function (e, t) {
      if (!e || !t || c.checkEmptyObj(e) || c.checkEmptyObj(t)) return {};
      var n = {},
        a = i(s(e)),
        u = g.getMetaInfo(f._ANONY_ID) || e.cna;
      u && ((a.anony_id = u), (a.id_tracking.anony_id = u));
      var _ = g.getMetaInfo('_dev_id') || e.cna;
      if (
        (_ && ((a.dev_id = _), (a.id_tracking.dev_id = _)), g._h5_share_enable)
      ) {
        var m = g.getMetaInfo('uuid');
        m && (a.id_tracking.ud = m);
        var y = g.getMetaInfo('openid');
        y && (a.id_tracking.openid = y);
        var b = g.getMetaInfo('unionid');
        b && (a.id_tracking.unionid = b);
        var E = g.getMetaInfo('anouymousopenid');
        E && (a.id_tracking.anonymousid = E);
        var w = g.getMetaInfo('alipayid');
        w && (a.id_tracking.alipay_id = w);
        var A = g.getMetaInfo('swanid');
        A && (a.id_tracking.anonymousid = A);
        var S = g.getMetaInfo(f.USER_PROFILE_KEY);
        S && (a.user_info = S);
        var x = v.get(f.IMPRINT);
        x && (a.imprint = x);
        var T = g.getMetaInfo(f.ID_TYPE) || 'cnaid';
        a.id_type = T;
      }
      var P = null;
      (P = '2001' === e.event_code ? r(e, t) : o(e, t)),
        P && (n = { analytics: { ekvs: { sessionid: [i(P)] } } });
      var C = g.getMetaInfo(f._USER_ID);
      C &&
        n.analytics &&
        (n.analytics.active_user = {
          puid: C,
          provider: g.getMetaInfo('_user_nick'),
        }),
        (n.header = c.assign(a, n.header, {
          ts: Date.now(),
          traceId: c.getRandomStr(10) + Date.now() + c.getRandomStr(9),
        }));
      var I = l(n),
        M = d.stringfy(I);
      return h().i('event data: ', I), p.encode(M);
    };
  },
  function (e, t) {
    function n(e) {
      var t,
        a = Array.isArray(e) ? [] : {};
      if ('object' == typeof e) {
        if (JSON && JSON.parse) (t = JSON.stringify(e)), (a = JSON.parse(t));
        else for (var o in e) a[o] = 'object' == typeof e[o] ? n(e[o]) : e[o];
        return a;
      }
    }
    e.exports = n;
  },
  function (e, t) {
    e.exports = function (e) {
      var t = {};
      return (
        (t.sdk_type = e.sdk_type),
        (t.appkey = e.appkey),
        (t.sdk_version = e.sdk_version),
        (t.device_type = e.device_type),
        (t.os = e.os),
        (t.os_version = e.os_version),
        (t.platform = e.platform),
        (t.pixel_ratio = e.pixel_ratio),
        (t.resolution = e.resolution),
        (t.language = e.language),
        (t.app_version = e.app_version),
        (t.jsver = e.jsver),
        (t.pre = e.pre),
        (t.url = e.url),
        (t.debugId = e.track_debug_id),
        (t.id_tracking = {}),
        t
      );
    };
  },
  function (e, t, n) {
    (t.getRandomStr = function (e) {
      for (
        var t = '',
          n = [
            '0',
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            'a',
            'b',
            'c',
            'd',
            'e',
            'f',
            'g',
            'h',
            'i',
            'j',
            'k',
            'l',
            'm',
            'n',
            'o',
            'p',
            'q',
            'r',
            's',
            't',
            'u',
            'v',
            'w',
            'x',
            'y',
            'z',
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z',
          ],
          a = 0;
        a < Number(e);
        a++
      ) {
        var o = Math.round(Math.random() * (n.length - 1));
        t += n[o];
      }
      return t;
    }),
      (t.startsWith = function (e, t) {
        return (
          !(!e || !t || 0 === t.length || t.length > e.length) &&
          e.substr(0, t.length) === t
        );
      }),
      (t.assign = function (e) {
        if (void 0 === e || null === e)
          throw new TypeError('Cannot convert undefined or null to object');
        for (var t = Object(e), n = 1; n < arguments.length; n++) {
          var a = arguments[n];
          if (a)
            for (var o in a)
              Object.prototype.hasOwnProperty.call(a, o) && (t[o] = a[o]);
        }
        return t;
      }),
      (t.checkEvent = function (e, t) {
        var a = n(3),
          o = n(76);
        if (!e || 'string' != typeof e)
          return (
            o().e(
              'please check trackEvent id. id should be "string" and not null'
            ),
            !1
          );
        var r = ['id', 'du'],
          i = {};
        if (
          (r.forEach(function (e) {
            i[e] = 1;
          }),
          i[e])
        )
          return o().e('eventId不能与以下保留字冲突: ' + r.join(',')), !1;
        if (e.length > a.MAX_EVENTID_LENGTH)
          return (
            o().e(
              'The maximum length of event id shall not exceed ' +
                a.MAX_EVENTID_LENGTH
            ),
            !1
          );
        if (
          t &&
          ('object' != typeof t || Array.isArray(t)) &&
          'string' != typeof t
        )
          return (
            o().e(
              'please check trackEvent properties. properties should be string or object(not include Array)'
            ),
            !1
          );
        if ('object' == typeof t) {
          var s = 0;
          for (var u in t)
            if ({}.hasOwnProperty.call(t, u)) {
              if (u.length > a.MAX_PROPERTY_KEY_LENGTH)
                return (
                  o().e(
                    'The maximum length of property key shall not exceed ' +
                      a.MAX_PROPERTY_KEY_LENGTH
                  ),
                  !1
                );
              if (s >= a.MAX_PROPERTY_KEYS_COUNT)
                return (
                  o().e(
                    'The maximum count of properties shall not exceed ' +
                      a.MAX_PROPERTY_KEYS_COUNT
                  ),
                  !1
                );
              if (i[u])
                return (
                  o().e('属性中的key不能与以下保留字冲突: ' + r.join(',')), !1
                );
              s += 1;
            }
        }
        return !0;
      });
    var a = n(36);
    (t.deleteInfo = function (e, t) {
      return (
        a(t, function (t) {
          delete e[t];
        }),
        e
      );
    }),
      (t.checkEmptyObj = function (e) {
        return 'object' != typeof e || 0 === Object.keys(e).length;
      }),
      (t.DataType = {
        HALF_SESSION: 'half_session',
        CLOSE_SESSION: 'close_session',
        EKV: 'ekv',
        ENTER_PAGE: 'enter_page',
        LEAVE_PAGE: 'leave_page',
      }),
      (t.AccessType = {
        MOBILE_NETWORK_2G: '2g',
        MOBILE_NETWORK_3G: '3g',
        MOBILE_NETWORK_4G: '4g',
        MOBILE_NETWORK_NONE: 'none',
      });
  },
  function (e, t) {
    var n = '[APLUS] -- ';
    e.exports = (function () {
      function e() {
        (this.setDebug = function (e) {
          a = e;
        }),
          (this.d = function () {
            if (a)
              try {
                'string' == typeof arguments[0] &&
                  (arguments[0] = n + arguments[0]),
                  console.debug.apply(console, arguments);
              } catch (e) {}
          }),
          (this.i = function () {
            try {
              if (a)
                try {
                  'string' == typeof arguments[0] &&
                    (arguments[0] = n + arguments[0]),
                    console.info.apply(console, arguments);
                } catch (e) {}
            } catch (e) {}
          }),
          (this.e = function () {
            if (a)
              try {
                'string' == typeof arguments[0] &&
                  (arguments[0] = n + arguments[0]),
                  console.error.apply(console, arguments);
              } catch (e) {}
          }),
          (this.w = function () {
            if (a)
              try {
                'string' == typeof arguments[0] &&
                  (arguments[0] = n + arguments[0]),
                  console.warn.apply(console, arguments);
              } catch (e) {}
          }),
          (this.v = function () {
            if (a)
              try {
                'string' == typeof arguments[0] &&
                  (arguments[0] = n + arguments[0]),
                  console.log.apply(console, arguments);
              } catch (e) {}
          }),
          (this.t = function () {
            if (a)
              try {
                console.table.apply(console, arguments);
              } catch (e) {}
          }),
          (this.tip = function () {
            try {
              'string' == typeof arguments[0] &&
                (arguments[0] = n + arguments[0]),
                console.log.apply(console, arguments);
            } catch (e) {}
          }),
          (this.tip_w = function (e) {
            try {
              console.log(
                '%c ' + n + e,
                'background:red; padding: 4px; padding-right: 8px; border-radius: 4px; color: #fff;'
              );
            } catch (e) {}
          }),
          (this.err = function () {
            try {
              'string' == typeof arguments[0] &&
                (arguments[0] = n + arguments[0]),
                console.error.apply(console, arguments);
            } catch (e) {}
          }),
          (this.repeat = function (e) {
            for (var t = e; t.length < 86; ) t += e;
            return t;
          });
      }
      var t = null,
        a = !1;
      return function () {
        return null === t && (t = new e()), t;
      };
    })();
  },
  function (e, t) {
    function n(e, t) {
      var n = a(e, t);
      return (
        e &&
          e.id_tracking &&
          (n[t.id_tracking || 'id_tracking'] = a(e.id_tracking, s)),
        n
      );
    }
    function a(e, t) {
      var n = {};
      for (var a in e) t[a] ? (n[t[a]] = e[a]) : (n[a] = e[a]);
      return n;
    }
    function o(e, t) {
      var n = {};
      if (e) for (var a in e) e[a] && (n[t[a]] = e[a]);
      return n;
    }
    var r = { ekvs: 'e', active_user: 'active_user' },
      i = {
        sdk_type: 'sdt',
        device_model: 'dm',
        language: 'lang',
        device_type: 'dt',
        os_version: 'ov',
        appkey: 'ak',
        sdk_version: 'sv',
        resolution: 'rl',
        testToken: 'ttn',
        pixel_ratio: 'pr',
        _id: 'id',
        id_type: 'it',
        id_tracking: 'itr',
        imprint: 'imp',
        debugId: 'dk',
      },
      s = {
        uuid: 'ud',
        unionid: 'und',
        openid: 'od',
        anonymousid: 'nd',
        alipay_id: 'ad',
        device_id: 'dd',
        userid: 'puid',
      };
    e.exports = function (e) {
      return { h: n(e.header, i), a: o(e.analytics, r) };
    };
  },
  function (e, t) {
    var n = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
      a = (function (e) {
        for (var t = {}, n = 0, a = e.length; n < a; n++) t[e.charAt(n)] = n;
        return t;
      })(n),
      o = String.fromCharCode,
      r = function (e) {
        var t;
        return e.length < 2
          ? ((t = e.charCodeAt(0)),
            t < 128
              ? e
              : t < 2048
              ? o(192 | (t >>> 6)) + o(128 | (63 & t))
              : o(224 | ((t >>> 12) & 15)) +
                o(128 | ((t >>> 6) & 63)) +
                o(128 | (63 & t)))
          : ((t =
              65536 +
              1024 * (e.charCodeAt(0) - 55296) +
              (e.charCodeAt(1) - 56320)),
            o(240 | ((t >>> 18) & 7)) +
              o(128 | ((t >>> 12) & 63)) +
              o(128 | ((t >>> 6) & 63)) +
              o(128 | (63 & t)));
      },
      i = /[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,
      s = function (e) {
        return e.replace(i, r);
      },
      u = function (e) {
        var t = [0, 2, 1][e.length % 3],
          a =
            (e.charCodeAt(0) << 16) |
            ((e.length > 1 ? e.charCodeAt(1) : 0) << 8) |
            (e.length > 2 ? e.charCodeAt(2) : 0),
          o = [
            n.charAt(a >>> 18),
            n.charAt((a >>> 12) & 63),
            t >= 2 ? '=' : n.charAt((a >>> 6) & 63),
            t >= 1 ? '=' : n.charAt(63 & a),
          ];
        return o.join('');
      },
      c = function (e) {
        return e.replace(/[\s\S]{1,3}/g, u);
      },
      l = function (e) {
        return c(s(e));
      },
      p = function (e, t) {
        return t
          ? l(String(e))
              .replace(/[+\/]/g, function (e) {
                return '+' == e ? '-' : '_';
              })
              .replace(/\=/g, '')
          : l(String(e));
      },
      f = new RegExp(
        ['[À-ß][-¿]', '[à-ï][-¿]{2}', '[ð-÷][-¿]{3}'].join('|'),
        'g'
      ),
      g = function (e) {
        switch (e.length) {
          case 4:
            var t =
                ((7 & e.charCodeAt(0)) << 18) |
                ((63 & e.charCodeAt(1)) << 12) |
                ((63 & e.charCodeAt(2)) << 6) |
                (63 & e.charCodeAt(3)),
              n = t - 65536;
            return o((n >>> 10) + 55296) + o((1023 & n) + 56320);
          case 3:
            return o(
              ((15 & e.charCodeAt(0)) << 12) |
                ((63 & e.charCodeAt(1)) << 6) |
                (63 & e.charCodeAt(2))
            );
          default:
            return o(((31 & e.charCodeAt(0)) << 6) | (63 & e.charCodeAt(1)));
        }
      },
      d = function (e) {
        return e.replace(f, g);
      },
      _ = function (e) {
        var t = e.length,
          n = t % 4,
          r =
            (t > 0 ? a[e.charAt(0)] << 18 : 0) |
            (t > 1 ? a[e.charAt(1)] << 12 : 0) |
            (t > 2 ? a[e.charAt(2)] << 6 : 0) |
            (t > 3 ? a[e.charAt(3)] : 0),
          i = [o(r >>> 16), o((r >>> 8) & 255), o(255 & r)];
        return (i.length -= [0, 0, 2, 1][n]), i.join('');
      },
      h = function (e) {
        return e.replace(/[\s\S]{1,4}/g, _);
      },
      m = function (e) {
        return d(h(e));
      },
      v = function (e) {
        return m(
          String(e)
            .replace(/[-_]/g, function (e) {
              return '-' == e ? '+' : '/';
            })
            .replace(/[^A-Za-z0-9\+\/]/g, '')
        );
      };
    (t.encode = p), (t.decode = v);
  },
  function (e, t) {
    (t.stringfy = function (e) {
      if (e)
        try {
          return JSON.stringify(e);
        } catch (e) {}
      return '';
    }),
      (t.parse = function (e) {
        if (e)
          try {
            return JSON.parse(e);
          } catch (e) {}
        return null;
      }),
      (t.parseToArray = function (e) {
        if (e)
          try {
            return JSON.parse(e);
          } catch (e) {}
        return [];
      });
  },
  function (e, t, n) {
    var a = n(2);
    e.exports = function (e, t) {
      if ('string' != typeof e) return null;
      var n = Object.create(null);
      (n.id = e), (t && t.ts) || (n.ts = Date.now());
      var o = typeof t;
      if ('object' === o)
        for (var r in t) ({}.hasOwnProperty.call(t, r) && (n[r] = t[r]));
      var i = a.getGlobalValue('aplus'),
        s = i.getMetaInfo('globalproperty');
      return s && (n.gp = s), n;
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(36);
    e.exports = function () {
      return {
        getLogConfig: function () {
          var e = {},
            t = this.options.config.plugins;
          for (var n in t)
            (e[n] = { plugins: t[n], context: {} }),
              a(t[n], function (t) {
                e[n].context[t.name] = t.config || {};
              });
          return e;
        },
        run: function () {
          (this.options.context.logConfig = this.getLogConfig()),
            (this.options.context.logConfig.pageLoadTime =
              this.options.context.PAGE_LOAD_TIME);
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(83),
      o = n(34),
      r = n(85),
      i = n(86),
      s = n(2);
    e.exports = function () {
      var e = n(45);
      return {
        init: function (e) {
          this.options = e;
          var t = this.options.context.etag || {};
          (this.cna = t.cna || a.getCookieCna('cna')),
            this.setTag(0),
            this.setStag(-1),
            this.setLsTag('-1'),
            this.setEtag(this.cna || ''),
            (this.requesting = !1),
            (this.today = r.getFormatDate());
        },
        setLsTag: function (e) {
          (this.lstag = e), (this.options.context.etag.lstag = e);
        },
        setTag: function (e) {
          (this.tag = e), (this.options.context.etag.tag = e);
        },
        setStag: function (e) {
          (this.stag = e), (this.options.context.etag.stag = e);
        },
        setEtag: function (e) {
          (this.etag = e),
            (this.options.context.etag.cna = e),
            a.getCookieCna('cna') !== e &&
              a.setCookieCna('cna', e, { SameSite: 'none' });
        },
        setLscnaStatus: function (e) {
          this.options.context.etag.lscnastatus = e;
        },
        run: function (t, n) {
          var a = this,
            r = s.getGlobalValue('aplus');
          if (a.cna) return void a.setTag(1);
          var u = null,
            c = r._$.meta_info['aplus-rhost-v'];
          if (c) {
            this.options.context.etag.egUrl = c + '/eg.js';
            var l = i.getUrl(this.options.context.etag || {});
            a.requesting = !0;
            var p = function () {
                setTimeout(function () {
                  n();
                }, 20),
                  clearTimeout(u);
              },
              f = this.options.context.etag.unittest,
              g = f || e.loadScript;
            g(l, function (e) {
              var t, n;
              if (
                (e && 'error' === e.type
                  ? a.setStag(-3)
                  : ((t = s.getGoldlogVal('Etag')),
                    t && a.setEtag(t),
                    (n = s.getGoldlogVal('stag')),
                    'undefined' != typeof n && a.setStag(n)),
                a.requesting)
              ) {
                var i = r.globalConfig || {};
                if (2 === n || 4 === n) {
                  var u = o.getLsCna(i.ETAG_STORAGE_KEY);
                  u
                    ? (a.setLsTag(1), a.setEtag(u))
                    : (a.setLsTag(0),
                      o.setLsCna(i.ETAG_STORAGE_KEY, a.today, t));
                }
                p();
              }
            });
            var d = r.getMetaInfo('aplus-etag-timeout'),
              _ = 200,
              h = _;
            try {
              (h = parseInt(d)), (NaN === h || h < 200) && (h = _);
            } catch (e) {}
            return (
              (u = setTimeout(function () {
                (a.requesting = !1), a.setStag(-2), n();
              }, h - 100)),
              h
            );
          }
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    function a(e) {
      if (!document) return '';
      var t = document.cookie.match(new RegExp('(?:^|;)\\s*' + e + '=([^;]+)'));
      return t ? t[1] : '';
    }
    function o(e) {
      var t = new Date(),
        n = '';
      return (
        'session' === e.expires ||
          (e.expires && ('number' == typeof e.expires || e.expires.toUTCString)
            ? ('number' == typeof e.expires
                ? t.setTime(t.getTime() + 24 * e.expires * 60 * 60 * 1e3)
                : (t = e.expires),
              (n = 'expires=' + t.toUTCString()))
            : (t.setTime(t.getTime() + 63072e7),
              (n = 'expires=' + t.toUTCString()))),
        n
      );
    }
    function r(e, t, n) {
      if (document) {
        n || (n = {}),
          (t += ';' + (n.expires || o(n))),
          (t += '; path=' + (n.path ? n.path : '/')),
          (t += '; domain=' + n.domain),
          (document.cookie = e + '=' + t);
        var r = 0;
        try {
          var i = navigator.userAgent.match(/Chrome\/\d/);
          i && i[0] && ((r = i[0].split('/')[1]), r && (r = parseInt(r)));
        } catch (e) {}
        return (
          n.SameSite &&
            r >= 8 &&
            ((t += '; SameSite=' + n.SameSite),
            (t += '; Secure'),
            (document.cookie = e + '=' + t)),
          a(e)
        );
      }
    }
    function i(e, t, n) {
      try {
        if (!document) return '';
        if ((n || (n = {}), n.domain)) r(e, t, n);
        else
          for (var a = u.getDomains(), o = 0; o < a.length; )
            (n.domain = a[o]), r(e, t, n) ? (o = a.length) : o++;
      } catch (e) {}
    }
    var s = n(36),
      u = n(84);
    (t.getCookie = a), (t.trySetCookie = r), (t.setCookie = i);
    var c = ['tracknick', 'thw', 'cna'];
    (t.getData = function () {
      var e = {};
      if (
        (s(c, function (t) {
          e[t] = a(t);
        }),
        location)
      ) {
        var t = location.hostname;
        e.cnaui = /\btanx\.com$/.test(t) ? a('cnaui') : '';
      }
      return e;
    }),
      (t.getHng = function () {
        return encodeURIComponent(a('hng') || '');
      }),
      (t.getCookieCna = function (e) {
        return a(e) || a('_' + e);
      }),
      (t.setCookieCna = function (e, t, n) {
        for (var a = u.getDomains(), i = 0; i < a.length; )
          if (((n.domain = a[i]), r(e, t, n))) i = a.length;
          else {
            if (i === a.length - 1) {
              var s = t + ';' + o(n);
              (s += '; path=/'), (document.cookie = '_' + e + '=' + s);
            }
            i++;
          }
      });
  },
  function (e, t) {
    'use strict';
    t.getDomains = function () {
      var e = [];
      try {
        for (
          var t = location.hostname, n = t.split('.'), a = 2;
          a <= n.length;

        )
          e.push(n.slice(n.length - a).join('.')), a++;
      } catch (e) {}
      return e;
    };
  },
  function (e, t) {
    'use strict';
    function n(e, t, n) {
      var a = '' + Math.abs(e),
        o = t - a.length,
        r = e >= 0;
      return (
        (r ? (n ? '+' : '') : '-') +
        Math.pow(10, Math.max(0, o)).toString().substr(1) +
        a
      );
    }
    t.getFormatDate = function (e) {
      var t = new Date();
      try {
        return [
          t.getFullYear(),
          n(t.getMonth() + 1, 2, 0),
          n(t.getDate(), 2, 0),
        ].join(e || '');
      } catch (e) {
        return '';
      }
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(34);
    t.getUrl = function (e) {
      var t = a.getUrl(e && e.egUrl);
      if (0 !== t.indexOf('http')) {
        var n = 'https:';
        /(\d+\.){3,}\d+/.test(t) && (n = 'http:'), (t = n + t);
      }
      return t;
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(2),
      o = n(3);
    e.exports = function () {
      return {
        getMetaInfo: function () {
          var e = a.getGoldlogVal('_$') || {},
            t = e.meta_info;
          return t;
        },
        getAplusWaiting: function () {
          var e = this.getMetaInfo() || {};
          return e['aplus-waiting'];
        },
        run: function (e, t) {
          var n = this.options.config || {},
            a = this.getAplusWaiting();
          if (a && n.is_auto)
            switch (
              ((a = this.getAplusWaiting() + ''),
              (this.options.context.when_to_sendpv = { aplusWaiting: a }),
              a)
            ) {
              case o._USER_ID:
              case o._ANONY_ID:
              case 'MAN':
                return 'done';
              case '1':
                return (
                  (this.options.context.when_to_sendpv.isWait = !0),
                  setTimeout(function () {
                    t();
                  }, 6e3),
                  6e3
                );
              default:
                var r = 1 * a;
                if (r + '' != 'NaN')
                  return (
                    (this.options.context.when_to_sendpv.isWait = !0),
                    setTimeout(function () {
                      t();
                    }, r),
                    r
                  );
            }
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(89),
      o = n(2),
      r = n(6),
      i = 'POST',
      s = 'GET';
    e.exports = function () {
      return {
        getMetaInfo: function () {
          var e = o.getGoldlogVal('_$') || {},
            t = e.meta_info;
          return t;
        },
        getAplusMetaByKey: function (e) {
          var t = this.getMetaInfo() || {};
          return t[e];
        },
        getRhost: function () {
          var e = this.getAplusMetaByKey('aplus-rhost-v');
          return e;
        },
        getHjljHostUrl: function (e) {
          var t = /^\/\//.test(e) ? '' : '//',
            n = '/web_logs',
            a = t + e + n;
          return a;
        },
        getPvHostUrl: function (e) {
          var t = /^\/\//.test(e) ? '' : '//',
            n = /\/$/.test(e) ? '' : '/',
            o = 'v.gif';
          return a.isMobile() && (o = 'm.gif'), t + e + n + o;
        },
        getHostUrl: function (e) {
          var t = /^\/\//.test(e) ? '' : '//',
            n = '/web_logs',
            a = t + e + n;
          return a;
        },
        getChannel: function (e) {
          var t,
            n = this.getAplusMetaByKey('aplus-channel'),
            a = ['WS', 'WS-ONLY', s, i];
          return (
            a.indexOf(e) > -1 && (t = e), !t && a.indexOf(n) > -1 && (t = n), t
          );
        },
        run: function () {
          var e = !!this.options.context.is_single;
          if (!e) {
            var t = this.options.config.recordType,
              n = this.getRhost(t);
            if (!n)
              return (
                r.logger({
                  msg: 'current request domain invalid, please check your aplus-rhost-v value inside metainfo!',
                }),
                'done'
              );
            var a;
            a =
              'PV' !== t || aplus._h5_share_enable
                ? this.getHjljHostUrl(n)
                : this.getPvHostUrl(n);
            var o = this.options.config || {},
              u = this.getChannel(o.method) || i;
            u !== i || (navigator && navigator.sendBeacon) || (u = s),
              (this.options.context.where_to_send.method = o.method),
              (this.options.context.where_to_send.url = a);
          }
        },
      };
    };
  },
  function (e, t) {
    'use strict';
    t.isMobile = function () {
      var e = navigator ? navigator.userAgent : '',
        t = /AliApp|Yunos|cyclone/i.test(e),
        n = /iPhone|iPad|iPod/i.test(e),
        a = /Android/i.test(e),
        o =
          /Windows Phone/i.test(e) ||
          /IEMobile/i.test(e) ||
          /WPDesktop/i.test(e),
        r = /BlackBerry/i.test(e),
        i = /Opera Mini/i.test(e);
      return t || n || a || o || r || i;
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(83),
      o = n(6),
      r = n(91),
      i = n(32),
      s = n(89),
      u = n(2),
      c = n(3),
      l = u.getGlobalValue('aplus'),
      p = n(92);
    e.exports = function () {
      return {
        getCommonParams: function () {
          var e = this.options.context || {},
            t = e.etag || {},
            n = e.userdata || {},
            f = u.getGoldlogVal('_$') || {},
            g = this.options.config || {},
            d = s.isMobile() ? 'WAP' : 'PC',
            _ = {
              _dev_id: l.getMetaInfo('_dev_id'),
              _anony_id: l.getMetaInfo(c._ANONY_ID),
              _user_id: l.getMetaInfo(c._USER_ID),
              _user_nick:
                l.getMetaInfo('_user_nick') || a.getCookie('tracknick'),
              _session_id: l.getMetaInfo('_session_id'),
            },
            h = g.pageUrl || (location ? location.href : '-'),
            m = g.title || (document && document.title),
            v = (l.globalConfig.isDecodeUrl ? 'DC_' : '') + r.getLogId(h, m),
            y = l.getMetaInfo('appKey') || l.getMetaInfo('appId');
          y ||
            o.logger({
              msg: 'please set appId in aplus metaInfo before sendPV!',
            });
          var b = i.assign(
            {
              appId: y,
              cache: v,
              cna: t.cna || a.getCookieCna('cna'),
              etag: t,
              pre: f.page_referrer || '-',
              sdk_info: {
                jsver: l.globalConfig.script_name,
                lver: l.globalConfig.lver,
                customSdkId: l.getMetaInfo('customSdkId') || '',
                platformType: d.toLowerCase(),
              },
              trackerEventCode: g.trackerEventCode,
              title: m,
              url: h,
              client: l._aplus_client || {},
              timeZone: p.getTimeZone(),
              gokey: _,
              gmkey: n.gmkey || '',
              method: this.options.context.where_to_send.method,
            },
            _
          );
          return b;
        },
        getPvParams: function () {
          var e = this.getCommonParams();
          return (
            this.options.config.is_auto || (e.sdk_info.mansndlog = 1),
            i.assign(e, {
              event_code: '2001',
              logtype: '1',
              logkey: s.isMobile() ? '/m.gif' : '/v.gif',
              event_timestamp:
                l._$.send_pv_count > 0 ? new Date() : l.logConfig.pageLoadTime,
            })
          );
        },
        getHjljParams: function () {
          var e = this.options.context || {},
            t = e.userdata || {},
            n = {
              event_code: c.EVENT_ID_MAP[t.gmkey] || c.OTHER,
              logtype: '2',
              logkey: t.logkey,
              event_timestamp: new Date(),
            };
          return i.assign(this.getCommonParams(), n);
        },
        run: function () {
          var e = {};
          (e =
            'PV' === this.options.config.recordType
              ? this.getPvParams()
              : this.getHjljParams()),
            (this.options.context.what_to_send.logdata = e);
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    function a(e, t, n) {
      return e ? o.hash(encodeURIComponent(e)).substr(0, t) : n;
    }
    var o = n(49),
      r = function (e) {
        function t(e) {
          var t =
              '0123456789abcdefhijklmnopqrstuvwxyzABCDEFHIJKLMNOPQRSTUVWXYZ',
            n = '0123456789abcdefghijkmnopqrstuvwxyzABCDEFGHIJKMNOPQRSTUVWXYZ';
          return 1 == e
            ? t.substr(Math.floor(60 * Math.random()), 1)
            : 2 == e
            ? n.substr(Math.floor(60 * Math.random()), 1)
            : '0';
        }
        for (
          var n,
            a = '',
            o =
              '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
            r = !1;
          a.length < e;

        )
          (n = o.substr(Math.floor(62 * Math.random()), 1)),
            !r &&
              a.length <= 2 &&
              ('g' == n.toLowerCase() || 'l' == n.toLowerCase()) &&
              (0 === a.length && 'g' == n.toLowerCase()
                ? Math.random() < 0.5 && ((n = t(1)), (r = !0))
                : 1 == a.length &&
                  'l' == n.toLowerCase() &&
                  'g' == a.charAt(0).toLowerCase() &&
                  ((n = t(2)), (r = !0))),
            (a += n);
        return a;
      };
    t.getLogId = function (e, t) {
      var n = r(8),
        o = n.substr(0, 4),
        i = n.substr(0, 6);
      return [a(e, 4, o), a(t, 4, o), i].join('');
    };
  },
  function (e, t) {
    t.getTimeZone = function () {
      var e = -new Date().getTimezoneOffset() / 60,
        t = '+';
      e < 0 && (t = '-');
      var n = Math.abs(parseInt(e)),
        a = Math.abs(parseInt(e) - e),
        o = '00';
      return a > 0 && (o = 60 * a), 'GMT' + t + (n > 9 ? n : '0' + n) + ':' + o;
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(31),
      o = n(94),
      r = n(32),
      i = n(2),
      s = i.getGlobalValue('aplus');
    e.exports = function () {
      return {
        getUserdata: function () {
          var e = this.options.config || {},
            t = {};
          e &&
            !e.is_auto &&
            e.gokey &&
            ('string' == typeof e.gokey
              ? (t = a.param2obj(e.gokey))
              : 'object' == typeof e.gokey && (t = e.gokey));
          var n = function (e) {
            o(e)
              ? e.forEach(function (e) {
                  t = r.assign(t, e);
                })
              : (t = r.assign(t, e));
          };
          n(s.getMetaInfo('aplus-cpvdata'));
          var i = this.options.context || {},
            u = i.userdata || {};
          return n(u), t;
        },
        processLodashDollar: function () {
          var e = this.options.config || {},
            t = i.getGoldlogVal('_$') || {};
          e && e.referrer && (t.page_referrer = e.referrer),
            i.setGoldlogVal('_$', t);
        },
        updatePre: function (e) {
          var t = i.getGoldlogVal('_$') || {};
          return t.page_referrer && (e.pre = t.page_referrer), e;
        },
        run: function () {
          var e = this.options.context.what_to_send.logdata,
            t = r.assign(this.getUserdata(), e.userdata || {});
          this.processLodashDollar(),
            (e.gokey = r.assign(e.gokey, t)),
            (e = this.updatePre(e)),
            (this.options.context.what_to_send.logdata = e),
            (this.options.context.userdata = e.gokey);
        },
      };
    };
  },
  function (e, t) {
    'use strict';
    e.exports = function (e) {
      return Array.isArray
        ? Array.isArray(e)
        : /Array/.test(Object.prototype.toString.call(e));
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(96),
      o = n(97),
      r = n(2),
      i = n(33);
    e.exports = function () {
      return {
        getPageId: function () {
          var e = this.options.config || {},
            t = this.options.context || {},
            n = t.userdata || {};
          return e.page_id || e.pageid || e.pageId || n.page_id;
        },
        resetSpmB: function () {
          if (aplus.spmAPI) {
            var e = r.getGoldlogVal('_$') || {},
              t = e.spm || {},
              n = t.data.b;
            if (n) {
              var a = this.getPageId();
              (n = a ? n.split('/')[0] + '/' + a : n.split('/')[0]),
                aplus.spmAPI && aplus.spmAPI.setB(n);
              var o = t.spm_cnt.split('.');
              o && o.length > 2 && ((o[1] = n), (t.spm_cnt = o.join('.')));
            }
          }
        },
        getExParamsInfo: function () {
          var e = a.getExParams();
          return (this.options.context.what_to_send.logdata.exparams = e), o(e);
        },
        run: function () {
          this.resetSpmB();
          var e = this.options.context.what_to_send.logdata.gokey;
          (e = i(this.getExParamsInfo(), e)),
            (this.options.context.what_to_send.logdata.gokey = e);
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    function a(e) {
      for (var t, n = e.split('&'), a = 0, o = n.length, r = []; a < o; a++)
        (t = n[a].split('=')), r.push([t.shift(), t.join('=')]);
      return r;
    }
    function o(e, t) {
      var n = 'aplus&sidx=aplusSidex&ckx=aplusCkx',
        a = e || n;
      try {
        if (t) {
          var o = u.param2obj(t),
            r = [
              d.APLUS,
              'cna',
              d.SPM_CNT,
              d.SPM_URL,
              d.SPM_PRE,
              'logtype',
              'pre',
              'uidaplus',
              'asid',
              'sidx',
              'trid',
              'gokey',
            ];
          s(r, function (e) {
            o.hasOwnProperty(e) &&
              (g.logger({ msg: 'Can not inject keywords: ' + e }), delete o[e]);
          }),
            delete o[''];
          var i = '';
          if (e) {
            var l = e.match(/aplus&/).index,
              p = l > 0 ? u.param2obj(e.substring(0, l)) : {};
            delete p[''],
              (i =
                u.obj2param(c.assign(p, o)) + '&' + e.substring(l, e.length));
          } else i = u.obj2param(o) + '&' + n;
          return i;
        }
        return a;
      } catch (e) {
        return a;
      }
    }
    function r() {
      var e = aplus && aplus._$ ? aplus._$ : {},
        t = e.meta_info || {};
      return t['aplus-exparams'] || '';
    }
    function i() {
      var e = l.getCurrentNode(),
        t = p.tryToGetAttribute(e, 'exparams'),
        n = o(t, r()) || '';
      return (
        n && n.replace(/&amp;/g, '&').replace(/\buser(i|I)d=/, 'uidaplus=')
      );
    }
    var s = n(36),
      u = n(31),
      c = n(32),
      l = n(45),
      p = n(37),
      f = n(44),
      g = n(6),
      d = n(3);
    (t.mergeExparams = o),
      (t.getExParams = i),
      (t.getExparamsInfos = function (e, t) {
        var n = {},
          o = e || ['uidaplus', 'pc_i', 'pu_i'],
          r = i() || '';
        r = r.replace(/&aplus&/, '&');
        for (
          var s = a(r) || [],
            u = function (e) {
              return f.indexof(o, e) > -1;
            },
            c = 0;
          c < s.length;
          c++
        ) {
          var l = s[c],
            p = l[0] || '',
            g = l[1] || '';
          p && g && ('EXPARAMS' === t || u(p)) && (n[p] = g);
        }
        return n;
      });
  },
  function (e, t, n) {
    var a = n(31);
    e.exports = function (e) {
      var t = {};
      try {
        var n = a.param2obj(
          e
            .replace(/&amp;/g, '&')
            .replace(/\buser(i|I)d=/, 'uidaplus=')
            .replace(/&aplus&/, '&')
        );
        n.uidaplus && (t.uidaplus = n.uidaplus),
          (t.pc_i = n.pc_i),
          (t.pu_i = n.pu_i);
      } catch (e) {
        console && console.log(e);
      }
      return t;
    };
  },
  function (e, t, n) {
    'use strict';
    function a(e) {
      var t,
        n,
        a,
        o,
        i = [],
        s = {};
      for (t = e.length - 1; t >= 0; t--)
        (n = e[t]),
          (a = n[0]),
          (a && a.indexOf(r.s_plain_obj) == -1 && s.hasOwnProperty(a)) ||
            ((o = n[1]),
            ('aplus' == a || o) && (i.unshift([a, o]), (s[a] = 1)));
      return i;
    }
    function o(e) {
      var t,
        n,
        a,
        o,
        i = [],
        u = { logtype: !0, cache: !0, scr: !0, 'spm-cnt': !0 };
      for (t = e.length - 1; t >= 0; t--)
        if (
          ((n = e[t]),
          (a = n[0]),
          (o = n[1]),
          !(
            (s.isStartWith(a, r.s_plain_obj) &&
              !s.isStartWith(a, r.mkPlainKeyForExparams())) ||
            u[a]
          ))
        )
          if (s.isStartWith(a, r.mkPlainKeyForExparams())) {
            var c = r.param2arr(o);
            if ('object' == typeof c && c.length > 0)
              for (var l = c.length - 1; l >= 0; l--) {
                var p = c[l];
                p && p[1] && i.unshift([p[0], p[1]]);
              }
          } else i.unshift([a, o]);
      return i;
    }
    var r = n(13),
      i = n(44),
      s = n(32),
      u = n(2),
      c = n(83),
      l = n(27),
      p = n(3),
      f = u.getGlobalValue(p.APLUS);
    e.exports = function () {
      return {
        keyIsAvailable: function (e) {
          var t = [
            'functype',
            'funcId',
            'spm-cnt',
            'spm-url',
            'spm-pre',
            '_ish5',
            '_is_g2u',
            '_h5url',
            'cna',
            'isonepage',
            'lver',
            'jsver',
          ];
          return i.indexof(t, e) === -1;
        },
        valIsAvailable: function (e) {
          return 'object' != typeof e && 'function' != typeof e;
        },
        upUtData: function (e, t) {
          var n = this;
          if (((e = e ? e : {}), t && 'object' == typeof t))
            for (var a in t) {
              var o = t[a];
              a && n.valIsAvailable(o) && n.keyIsAvailable(a) && (e[a] = o);
            }
          return e;
        },
        getToUtData: function () {
          var e = u.getGoldlogVal('_$') || {},
            t = e.spm || {},
            n = this.options.context || {},
            i = n.what_to_send || {},
            s = i.logdata || {},
            g = s.sdk_info || {},
            d = this.options.context.etag || {},
            _ = o(a(s.exparams || []));
          _ = r.arr2obj(_);
          var h = n.userdata,
            m = location.href,
            v = {},
            y = l.getParamFromUrl('scm', m) || '';
          y && (v.scm = y);
          var b = l.getParamFromUrl('pg1stepk', m) || '';
          b && (v.pg1stepk = b);
          var E = l.getParamFromUrl('point', m) || '';
          E && (v.issb = 1),
            g && g.mansndlog && (v.mansndlog = g.mansndlog),
            (v = this.upUtData(v, _)),
            (v = this.upUtData(v, s.gokey)),
            (v = this.upUtData(v, h)),
            (v.functype = 'page'),
            (v.funcId = '2001'),
            f && f.globalConfig && f.globalConfig.isAli
              ? (v.url =
                  (location.protocol || 'https:') +
                  '//' +
                  location.host +
                  location.pathname)
              : (v.url = location.href),
            (v._ish5 = '1'),
            (v._h5url = m),
            (v._toUT = 2),
            (v._bridgeName = 'WindVane'),
            (v._bridgeVersion = '3.0.4'),
            t.spm_cnt && (v[p.SPM_CNT] = t.spm_cnt || ''),
            t.spm_url && (v[p.SPM_URL] = t.spm_url || ''),
            t.spm_pre && (v[p.SPM_PRE] = t.spm_pre || ''),
            (v.cna = d.cna || c.getCookieCna('cna')),
            (v.lver = g.lver),
            (v.jsver = g.jsver),
            (v.pver = '1.0.0'),
            (v.isonepage = -1);
          var w = f.getMetaInfo('aplus-utparam');
          return (
            w && (v['utparam-cnt'] = JSON.stringify(w)),
            (v._is_g2u_ = 1),
            (v._slog = 1),
            v
          );
        },
        run: function () {
          var e = this.options.context || {},
            t = e.what_to_send || {};
          (t.pvdataToUt = this.getToUtData()),
            (this.options.context.what_to_send = t);
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(32),
      o = n(75),
      r = n(3);
    e.exports = function () {
      return {
        getToNativeData: function () {
          var e = this.options.context || {},
            t = a.cloneDeep(e.userdata) || {},
            n = e.what_to_send || {},
            i = n.logdata || {},
            s = i.sdk_info || {},
            u = this.options.context.etag || {},
            c = {},
            l = {},
            p = {};
          return (
            (l.cna = u.cna),
            (l.lver = s.lver),
            (l.jsver = s.jsver),
            (l.id = r.PAGE_START),
            (l.ts = Date.now()),
            (l.r = i.arg1 || i.logkey || '-'),
            (l.is_h5 = '1'),
            t.hasOwnProperty('autosend') ? (l.is_auto = 1) : (l.is_auto = 0),
            (p = a.cloneDeep(
              o.deleteInfo(t, [
                '_anony_id',
                '_dev_id',
                '_session_id',
                '_src_pos_id',
                '_user_id',
                '_user_nick',
              ])
            )),
            p.duration && ((l.duration = p.duration), delete p.duration),
            p.page_start &&
              ((l.page_start = p.page_start), delete p.page_start),
            i.url &&
              ((l.page_name =
                aplus.getPageName() || p.spmB || p.page_name || i.url || '-'),
              (l.url = i.url || '-'),
              (l['spm-cnt'] = encodeURIComponent(l.page_name))),
            i.pre && (l.ref_url = i.pre || '-'),
            p.ts && delete p.ts,
            (c.sdkArgs = a.cloneDeep(l)),
            (c.cusp = p),
            c
          );
        },
        run: function () {
          var e = this.options.context || {},
            t = e.what_to_send || {};
          (t.pvdataToUmNative = this.getToNativeData()),
            (this.options.context.what_to_send = t);
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(2);
    e.exports = function () {
      return {
        run: function () {
          var e = a.getGoldlogVal('_$') || {},
            t = this.options.context.can_to_sendpv || {},
            n = e.send_pv_count || 0,
            o = this.options.config || {};
          return o.is_auto && n > 0
            ? 'done'
            : ((t.flag = 'YES'),
              (this.options.context.can_to_sendpv = t),
              (e.send_pv_count = ++n),
              void a.setGoldlogVal('_$', e));
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(102),
      o = n(2);
    e.exports = function () {
      return {
        run: function () {
          var e = aplus._$ || {},
            t = this.options.context || {};
          o.setGoldlogVal('pv_context', t);
          var n = aplus.spm_ab || [],
            r = n.join('.'),
            i = e.send_pv_count,
            s = { cna: t.etag.cna, count: i, spmab_pre: aplus.spmab_pre };
          a.doPubMsg(['sendPV', 'complete', r, s]),
            a.doCachePubs(['sendPV', 'complete', r, s]);
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(2),
      o = 'function',
      r = function () {
        var e = a.getGlobalValue('aplus'),
          t = e.aplus_pubsub || {},
          n = typeof t.publish === o;
        return n ? t : '';
      };
    (t.doPubMsg = function (e) {
      var t = r();
      t && typeof t.publish === o && t.publish.apply(t, e);
    }),
      (t.doCachePubs = function (e) {
        var t = r();
        t && typeof t.cachePubs === o && t.cachePubs.apply(t, e);
      }),
      (t.doSubMsg = function (e, t) {
        var n = r();
        n && typeof n.subscribe === o && n.subscribe(e, t);
      });
  },
  function (e, t, n) {
    'use strict';
    var a = n(31),
      o = n(94),
      r = n(32),
      i = n(2),
      s = i.getGlobalValue('aplus');
    e.exports = function () {
      return {
        getUserData: function () {
          var e = this.options.context || {},
            t = e.userdata || {},
            n = e.what_to_send.logdata.gokey;
          n = r.assign(n, a.param2obj(t.gokey));
          var i = s.getMetaInfo('aplus-exinfo');
          i && (n = r.assign(n, a.param2obj(i)));
          var u = s.getMetaInfo('aplus-exdata');
          return (
            o(u)
              ? u.forEach(function (e) {
                  n = r.assign(n, e);
                })
              : (n = r.assign(n, s.getMetaInfo('aplus-exdata'))),
            n
          );
        },
        run: function () {
          this.options.context.what_to_send.logdata.gokey = this.getUserData();
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(96),
      o = n(97),
      r = n(32);
    e.exports = function () {
      return {
        getExParamsInfo: function () {
          var e = a.getExParams();
          return (this.options.context.what_to_send.logdata.exparams = e), o(e);
        },
        run: function () {
          var e = this.options.context.what_to_send.logdata.gokey;
          (e = r.assign(this.getExParamsInfo(), e)),
            (this.options.context.what_to_send.logdata.gokey = e);
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(2),
      o = n(3),
      r = a.getGlobalValue(o.APLUS);
    e.exports = function () {
      return {
        getToUtData: function () {
          var e = a.getGoldlogVal('_$') || {},
            t = e.spm || {},
            n = this.options.context || {},
            i = n.userdata || {},
            s = n.etag || {},
            u = n.what_to_send || {},
            c = u.logdata || {},
            l = c.sdk_info || {},
            p = c.gokey || {},
            f = [],
            g = '';
          for (var d in p)
            if ([o.SPM_CNT, o.SPM_URL, o.SPM_PRE].indexOf(d) === -1) {
              var _ = p[d];
              ('undefined' !== p[d] && void 0 !== p[d]) || (_ = ''),
                f.push(d + '=' + _);
            }
          f.length > 0 && (g = f.join('&'));
          var h = location.href,
            m = {};
          (m.functype = 'ctrl'),
            (m.funcId = c.event_code),
            r && r.globalConfig && r.globalConfig.isAli
              ? (m.url =
                  (location.protocol || 'https:') +
                  '//' +
                  location.host +
                  location.pathname)
              : (m.url = location.href),
            (m.logkey = c.logkey),
            (m.gokey = encodeURIComponent(g)),
            (m.gmkey = c.gmkey),
            (m._ish5 = '1'),
            (m._h5url = h),
            (m._is_g2u_ = 1),
            (m._slog = 1),
            (m._toUT = 2),
            (m._bridgeName = 'WindVane'),
            (m._bridgeVersion = '3.0.4'),
            t.spm_cnt && (m[o.SPM_CNT] = t.spm_cnt || ''),
            t.spm_url && (m[o.SPM_URL] = t.spm_url || ''),
            t.spm_pre && (m[o.SPM_PRE] = t.spm_pre || ''),
            (m.cna = s.cna),
            (m.lver = l.lver),
            (m.jsver = l.jsver),
            i.hasOwnProperty('autosend') && (m.autosend = i.autosend);
          var v = r.getMetaInfo('aplus-utparam');
          return v && (m['utparam-cnt'] = JSON.stringify(v)), m;
        },
        run: function () {
          var e = this.options.context || {},
            t = e.what_to_send || {};
          (t.pvdataToUt = this.getToUtData()),
            (this.options.context.what_to_send = t);
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(32),
      o = n(75),
      r = n(13);
    e.exports = function () {
      return {
        getToNativeData: function () {
          var e = this.options.context || {},
            t = e.userdata || {},
            n = e.etag || {},
            i = e.what_to_send || {},
            s = i.logdata || {},
            u = s.sdk_info || {},
            c = {},
            l = {},
            p = {};
          (l.cna = n.cna),
            (l.lver = u.lver),
            (l.jsver = u.jsver),
            (l.id = t.logkey || '-'),
            (l.ts = Date.now()),
            (l.is_h5 = '1'),
            (l.funcId = s.event_code),
            t.gokey && 'string' == typeof t.gokey && t.gokey.match('is_auto')
              ? (l.is_auto = 1)
              : (l.is_auto = 0),
            (p =
              'string' == typeof t.gokey
                ? r.arr2obj(r.param2arr(t.gokey || ''))
                : a.cloneDeep(
                    o.deleteInfo(t.gokey, [
                      '_anony_id',
                      '_dev_id',
                      '_session_id',
                      '_src_pos_id',
                      '_user_id',
                      '_user_nick',
                    ])
                  )),
            s.url &&
              ((l.page_name =
                aplus.getPageName() ||
                p.spmB ||
                p['data-pagename'] ||
                p.page_name ||
                s.url ||
                '-'),
              (l.url = s.url || '-'),
              l.page_name &&
                p.spmC &&
                ((l['spm-cnt'] = [
                  encodeURIComponent(l.page_name),
                  encodeURIComponent(p.spmC),
                  encodeURIComponent(p.spmD),
                ]
                  .filter(function (e) {
                    return !!e;
                  })
                  .join('.')),
                delete p.spmC,
                delete p.spmB,
                delete p.spmD)),
            p.ts && delete p.ts;
          var f = a.cloneDeep(p);
          for (var g in f)
            'string' == typeof g &&
              o.startsWith(g, '_') &&
              ((l[g] = f[g]), delete p[g]);
          return (c.sdkArgs = a.cloneDeep(l)), (c.cusp = p), c;
        },
        run: function () {
          var e = this.options.context || {},
            t = e.what_to_send || {};
          (t.hjljdataToUmNative = this.getToNativeData()),
            (this.options.context.what_to_send = t);
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    e.exports = function () {
      return {
        run: function () {
          n(108)(this.options.context.logConfig);
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(102),
      o = n(2);
    e.exports = function (e) {
      var t = o.getGlobalValue('aplus');
      if (!t._aplus_api) {
        t._aplus_api = { status: 'complete' };
        var r = n(109).run.create({ logConfig: e });
        for (var i in r) t[i] = r[i];
        n(114).makePVId();
        var s = ['aplusReady', 'complete'];
        a.doPubMsg(s), a.doCachePubs(s);
      }
    };
  },
  function (e, t, n) {
    'use strict';
    function a() {
      var e = 5e3;
      try {
        var t = w.getMetaInfo('aplus-mmstat-timeout');
        if (t) {
          var n = parseInt(t);
          n >= 1e3 && n <= 1e4 && (e = n);
        }
      } catch (e) {}
      return e;
    }
    var o = document,
      r = n(22),
      i = n(83),
      s = n(10),
      u = n(6),
      c = n(102),
      l = n(32),
      p = n(2),
      f = n(9),
      g = n(3),
      d = n(71),
      _ = n(110),
      h = n(30),
      m = n(113),
      v = [],
      y = [],
      b = [],
      E = [],
      w = p.getGlobalValue('aplus'),
      A = function () {};
    t.run = r.extend({
      beforeSendPV: function (e) {
        v.push(e);
      },
      afterSendPV: function (e) {
        y.push(e);
      },
      send: function (e, t, n) {
        var o;
        if (0 === e.indexOf('//')) {
          var r = g.HTTPS;
          /(\d+\.){3,}\d+/.test(e) && (r = 'http:'), (e = r + e);
        }
        return (
          (o =
            'POST' === n && navigator && navigator.sendBeacon
              ? m.postData(e, t)
              : m.sendImg(e + '?' + t, a())),
          (w.req = o),
          o
        );
      },
      sendPV: function (e, t) {
        if (
          ((e = e || {}),
          l.any(v, function (t) {
            return t(w, e) === !1;
          }))
        )
          return !1;
        var n = new _();
        e.recordType = 'PV';
        var a = w.globalConfig.isUM;
        a && (e.method = 'POST');
        var o = w.logConfig.pv;
        return (
          n.run(
            { plugins: o.plugins, context: l.cloneDeep(o.context) },
            {
              config: e,
              userdata: t,
              pubsubType: 'pv',
              messageFnQueue: y,
              middlewareMessageKey: 'mw_change_pv',
            }
          ),
          !0
        );
      },
      pageEnter: function (e) {
        d.pushIntoGoldlogQueue(g.PUBLISH, [g.PAGE_ENTER, e]),
          d.pushIntoGoldlogQueue(g.CACHE_PUBS, [g.PAGE_ENTER, e]);
      },
      getParam: function (e) {
        var t = window.WindVane || {},
          n = t && 'function' == typeof t.getParam ? t.getParam(e) : '';
        return n;
      },
      beforeRecord: function (e) {
        b.push(e);
      },
      afterRecord: function (e) {
        E.push(e);
      },
      record: function (e, t, n, a, o) {
        var r = w.globalConfig.isAli,
          i = w.globalConfig.isUM;
        if (
          (e && 0 !== e.indexOf('/') && r && (e = '/' + e),
          !l.any(b, function (e) {
            return e(w) === !1;
          }))
        ) {
          var s = new _(),
            u = w.logConfig.hjlj;
          return (
            s.run(
              { plugins: u.plugins, context: l.cloneDeep(u.context) },
              {
                config: {
                  recordType: 'COMMON_HJLJ',
                  method: i ? a || 'POST' : a,
                },
                userdata: { logkey: e, gmkey: t, gokey: n || {} },
                pubsubType: 'hjlj',
                messageFnQueue: E,
                middlewareMessageKey: 'mw_change_hjlj',
              },
              function () {
                f(o) && o();
              }
            ),
            !0
          );
        }
      },
      recordUdata: function (e, t, n, a, o) {
        var r = new _(),
          i = w.logConfig.hjlj;
        r.run(
          { plugins: i.plugins, context: l.cloneDeep(i.context) },
          {
            config: { recordType: 'DATACLICK_HJLJ', method: a },
            userdata: { logkey: e, gmkey: t, gokey: n || {} },
            pubsubType: 'hjlj',
            messageFnQueue: E,
            middlewareMessageKey: 'mw_change_hjlj',
          },
          function () {
            f(o) && o();
          }
        );
      },
      setPageSPM: function (e, t, n) {
        var a = w.getMetaInfo('aplus-spm-fixed'),
          o = 'function' == typeof n ? n : function () {};
        w.spm_ab = w.spm_ab || [];
        var r = l.cloneDeep(w.spm_ab);
        e && ((w.spm_ab[0] = '' + e), (w._$.spm.data.a = '' + e)),
          t && ((w.spm_ab[1] = '' + t), (w._$.spm.data.b = '' + t));
        var i = h.qGet();
        if ((w.spmAPI && w.spmAPI.spaInit(w, i, r), '1' !== a)) {
          var s = r.join('.');
          w.spmab_pre = s;
        }
        var u = [
          'setPageSPM',
          { spmab_pre: w.spmab_pre, spmab: w.spm_ab.join('.') },
        ];
        c.doPubMsg(u), c.doCachePubs(u), o();
      },
      setMetaInfo: function (e, t, n) {
        var a,
          o,
          r = 'OVERWRITE',
          i = r;
        if (
          ('object' == typeof e
            ? ((a = e.metaName), (o = e.metaValue), (i = e.mode || r))
            : ((a = e), (o = t)),
          i !== r)
        )
          return this.appendMetaInfo(a, o);
        if (h.setMetaInfo(a, o, n)) {
          var s = p.getGoldlogVal('_$') || {};
          s.meta_info = h.qGet();
          var u = p.setGoldlogVal('_$', s),
            l = ['setMetaInfo', a, o, n];
          return c.doPubMsg(l), c.doCachePubs(l), u;
        }
      },
      appendMetaInfo: h.appendMetaInfo,
      updatePageProperties: function (e) {
        e && 'object' == typeof e
          ? (e._page &&
              ((e.pageName = e._page),
              w.setMetaInfo('aplus-pagename', e.pageName),
              delete e._page),
            w.appendMetaInfo('aplus-cpvdata', e))
          : u.logger({
              msg: "warning: typeof updatePageProperties's params must be object",
            });
      },
      updateNextPageProperties: function (e) {
        'object' == typeof e
          ? w.appendMetaInfo('aplus-nextpage-properties', e)
          : u.logger({
              msg: "warning: typeof updateNextPageProperties's params must be object",
            });
      },
      getMetaInfo: function (e) {
        return h.getMetaInfo(e);
      },
      on: s.on,
      cloneDeep: l.cloneDeep,
      setCookie: i.setCookie,
      getCookie: i.getCookie,
      pageAppear: A,
      pageDisappear: A,
      updatePageUtparam: A,
      updateNextPageUtparam: A,
      updateSessionProperties: function (e) {
        'object' == typeof e && w.setMetaInfo('_session_args', e);
      },
      setPageName: function (e) {
        if (!e || 'string' != typeof e)
          return void u.logger({ msg: 'setPageName failed:  pagename=' + e });
        var t = o.querySelector('body');
        try {
          t.setAttribute('data-pagename', e);
        } catch (e) {
          u.logger({ msg: 'setPageName failed:  err=' + e });
        }
      },
      getPageName: function () {
        return window.document.body &&
          window.document.body.dataset &&
          window.document.body.dataset.pagename
          ? window.document.body.dataset.pagename
          : '';
      },
      getElementSPM: function (e) {
        if (e && e.dataset) return e.getAttribute('data-spm-anchor-id');
      },
    });
  },
  function (e, t, n) {
    'use strict';
    var a = n(36),
      o = n(2),
      r = n(9),
      i = n(102),
      s = n(6),
      u = n(3),
      c = n(111),
      l = n(112),
      p = function () {};
    (p.prototype.run = function (e, t, n) {
      var p = new l();
      p.init({ middleware: [], config: t.config, plugins: e.plugins });
      var f = p.run(),
        g = r(e.context) ? new e.context() : e.context;
      (g.userdata = t.userdata), (g.logger = s.logger);
      var d = {
          context: g,
          pubsub: o.getGoldlogVal('aplus_pubsub'),
          pubsubType: t && t.pubsubType,
        },
        _ = new c();
      _.create(d),
        _.wrap(f, function () {
          (d.context.status = u.COMPLETE),
            t &&
              (t.middlewareMessageKey &&
                i.doPubMsg([t.middlewareMessageKey, d.context]),
              t.messageFnQueue &&
                a(t.messageFnQueue, function (t) {
                  t(o.getGlobalValue(u.APLUS), e);
                })),
            r(n) && n(d.context);
        })();
    }),
      (e.exports = p);
  },
  function (e, t, n) {
    'use strict';
    function a() {}
    var o = n(9),
      r = n(44),
      i = n(6);
    (a.prototype.create = function (e) {
      for (var t in e) 'undefined' == typeof this[t] && (this[t] = e[t]);
      return this;
    }),
      (a.prototype.calledList = []),
      (a.prototype.setCalledList = function (e) {
        r.indexof(this.calledList, e) === -1 && this.calledList.push(e);
      }),
      (a.prototype.resetCalledList = function () {
        this.calledList = [];
      }),
      (a.prototype.wrap = function (e, t) {
        var n = this,
          a = this.context || {},
          s = a.compose || {},
          u = s.maxTimeout || 1e4;
        return function (a) {
          var s,
            c = e.length,
            l = 0,
            p = 0,
            f = function (g, d) {
              if (l === c)
                return (
                  (a = 'done'),
                  n.resetCalledList(),
                  o(t) && d !== a && t.call(n, a),
                  void clearTimeout(s)
                );
              if (r.indexof(n.calledList, l) === -1) {
                if ((n.setCalledList(l), !e[l] || !o(e[l][0]))) return;
                try {
                  a = e[l][0].call(n, a, function () {
                    l++, (p = 1), f(l);
                  });
                } catch (e) {
                  i.logger({ msg: e });
                }
              }
              var _ = 'number' == typeof a;
              if ('pause' === a || _) {
                p = 0;
                var h = _ ? a : u,
                  m = e[l] ? e[l][1] : '';
                s = setTimeout(function () {
                  0 === p &&
                    (i.logger({
                      msg:
                        'jump the middleware about ' +
                        m +
                        ', because waiting timeout maxTimeout = ' +
                        h,
                    }),
                    (a = null),
                    l++,
                    f(l));
                }, h);
              } else 'done' === a ? ((l = c), f(l, a)) : (l++, f(l));
            };
          return (
            n.calledList && n.calledList.length > 0 && n.resetCalledList(), f(l)
          );
        };
      }),
      (e.exports = a);
  },
  function (e, t, n) {
    'use strict';
    var a = n(33),
      o = n(6);
    e.exports = function () {
      return {
        init: function (e) {
          (this.opts = e),
            e && 'object' == typeof e.middleware && e.middleware.length > 0
              ? (this.middleware = e.middleware)
              : (this.middleware = []),
            (this.plugins_name = []);
        },
        pubsubInfo: function (e, t) {
          try {
            var n = e.pubsub;
            n && n.publish('plugins_change_' + e.pubsubType, t);
          } catch (e) {
            o.logger({ msg: e });
          }
        },
        run: function (e) {
          e || (e = 0);
          var t = this,
            n = this.middleware,
            o = this.opts || {},
            r = o.plugins;
          if (r && 'object' == typeof r && r.length > 0) {
            var i = r[e];
            if (
              (this.plugins_name.push(i.name),
              n.push([
                function (e, n) {
                  t.pubsubInfo(this, i);
                  var r = new i.path();
                  return (
                    r.init ||
                      (r.init = function (e) {
                        this.options = e;
                      }),
                    r.init({
                      context: this.context,
                      config: a(i.config || {}, o.config),
                    }),
                    r.run(e, function (e) {
                      setTimeout(function () {
                        n(i, e);
                      }, 1);
                    })
                  );
                },
                i.name,
              ]),
              e++,
              r[e])
            )
              return this.run(e);
          }
          return n;
        },
      };
    };
  },
  function (e, t) {
    'use strict';
    (t.sendImg = function (e, t) {
      var n = window || {},
        a = new Image(),
        o = '_img_' + Math.random();
      n[o] = a;
      var r = function () {
        if (n[o])
          try {
            delete n[o];
          } catch (e) {
            n[o] = void 0;
          }
      };
      return (
        (a.onload = function () {
          r();
        }),
        (a.onerror = function () {
          r();
        }),
        setTimeout(function () {
          window[o] && ((window[o].src = ''), r());
        }, t || 5e3),
        (a.src = e),
        (a = null),
        e
      );
    }),
      (t.postData = function (e, t) {
        return navigator.sendBeacon(e, t), e;
      });
  },
  function (e, t, n) {
    'use strict';
    function a() {
      var e,
        t = r.getGlobalValue('aplus');
      try {
        var n = t.getMetaInfo('aplus-disable-pvid') + '';
        'true' === n ? (e = !0) : 'false' === n && (e = !1);
      } catch (e) {}
      return e;
    }
    var o = n(102),
      r = n(2),
      i = n(91);
    (t.isDisablePvid = a),
      (t.makePVId = function () {
        var e = r.getGlobalValue('aplus'),
          t = e.pvid,
          n = location && location.href,
          s = document && document.title;
        e.pvid = i.getLogId(n, s);
        var u = ['pvidChange', { pre_pvid: t, pvid: e.pvid }];
        return o.doPubMsg(u), o.doCachePubs(u), a() ? '' : e.pvid;
      }),
      (t.getPvId = function () {
        var e = r.getGlobalValue('aplus');
        return a() ? '' : e.pvid;
      });
  },
  function (e, t, n) {
    'use strict';
    var a = n(116),
      o = n(2);
    e.exports = function () {
      return {
        run: function () {
          var e = this.options.context.aplus_config,
            t = e.globalConfig.APLUS_QUEUE,
            n = o.getContext(),
            r = n[t] || [],
            i = a.getFormatQueue(r, 'metaQueue');
          (n[t] = i.queue),
            a.processGoldlogQueue(i.formatQueue, this.options.config);
        },
      };
    };
  },
  function (e, t, n) {
    function a() {
      var e = u.getGoldlogVal('_$') || {},
        t = e.meta_info;
      return t;
    }
    function o() {
      var e = a() || {},
        t = e.uaid + '';
      return '1' !== t || e._anony_id ? e._hold || e['aplus-waiting'] : 'BLOCK';
    }
    function r(e) {
      var t = o(),
        n = a() || {},
        r = !0,
        i = e.arguments || [],
        s = i[0],
        u = i[1],
        c = 'START';
      if ('_hold' === s && u === c) return c;
      if ('_anony_id' === s && u) return c;
      if (
        e &&
        /sendPV|record|setPageSPM|setMetaInfo|appendMetaInfo$/.test(e.action)
      )
        switch (t) {
          case 'BLOCK':
            n[t] || (h.push(e), (r = !1));
        }
      return r;
    }
    function i(e) {
      g(d, e), g(_, e), g(h, e);
    }
    function s(e, t) {
      return t && f.openAPIs.indexOf(e) > -1 && (e = '_' + e), e;
    }
    var u = n(2),
      c = n(44),
      l = n(9),
      p = n(6),
      f = n(3),
      g = function (e, t) {
        function n() {
          if (e && c.isArray(e) && e.length) {
            for (var n = v(e).queue, a = {}, o = []; (a = n.shift()); )
              m(a, t, function (e) {
                o.push(e);
              });
            o.length > 0 &&
              setTimeout(function () {
                for (; (a = o.shift()); ) m(a, t);
              }, 100);
          }
        }
        try {
          n();
        } catch (e) {
          p.logger({ msg: e });
        }
      };
    t.processGoldlogQueue = g;
    var d = [],
      _ = [],
      h = [];
    t.subscribeAndProcessQueue = function (e, t) {
      var n = u.getGlobalValue(e);
      n.push({
        action: f.SUBSCRIBE,
        arguments: [
          f.SET_META_INFO,
          function (e, n) {
            e === f._USER_ID && n
              ? g(d, t)
              : e === f._ANONY_ID && n
              ? g(_, t)
              : '_hold' === e && 'START' === n && i(t);
          },
        ],
      });
    };
    var m = function (e, t, n) {
      var a = !!t.isOpenApi,
        o = e ? e.action : '',
        f = e ? e.arguments : '',
        g = r(e);
      if (g) {
        var d = u.getContext();
        try {
          if (o && f && c.isArray(f)) {
            var _,
              h = o.split('.'),
              m = d,
              v = d;
            if (3 === h.length)
              (m = d[h[0]][h[1]] || {}),
                (_ = s(h[2], a)),
                (v = m[_] ? m[_] : '');
            else
              for (; h.length; )
                if (((_ = s(h.shift(), a)), (v = m = m[_]), !m))
                  return void (l(n) && n(e));
            l(v) && v.apply(m, f), 'START' === g && i(t);
          }
        } catch (e) {
          p.logger({ msg: e });
        }
      }
    };
    t.processTask = m;
    var v = function (e, t) {
      for (
        var n = {
            subscribeMwChangeQueue: [],
            subscribeMetaQueue: [],
            subscribeQueue: [],
            metaQueue: [],
            othersQueue: [],
          },
          a = [],
          o = {};
        (o = e.shift());

      )
        try {
          var r = o.action,
            i = o.arguments[0];
          /subscribe/.test(r)
            ? 'setMetaInfo' === i
              ? n.subscribeMetaQueue.push(o)
              : i === f.MW_CHANGE_PV || i === f.MW_CHANGE_HJLJ
              ? n.subscribeMwChangeQueue.push(o)
              : n.subscribeQueue.push(o)
            : /MetaInfo/.test(r)
            ? n.metaQueue.push(o)
            : n.othersQueue.push(o);
        } catch (e) {
          p.logger({ msg: e }), n.othersQueue.push(o);
        }
      var s;
      return (
        t && n[t] && ((s = n[t]), (n[t] = [])),
        (a = n.subscribeMwChangeQueue.concat(n.metaQueue)),
        (a = a.concat(n.subscribeQueue)),
        (a = a.concat(n.subscribeMetaQueue, n.othersQueue)),
        { queue: a, formatQueue: s }
      );
    };
    t.getFormatQueue = v;
  },
  function (e, t, n) {
    'use strict';
    var a = n(34),
      o = n(45),
      r = n(86),
      i = n(15);
    e.exports = function () {
      return {
        run: function () {
          var e = this,
            t = this.options.context.aplus_config;
          if (i.test()) {
            var n = a.getLsCna(t.globalConfig.ETAG_STORAGE_KEY, e.today);
            n ||
              setTimeout(function () {
                var n = aplus._$.meta_info['aplus-rhost-v'];
                if (n) {
                  e.options.context.etag.egUrl = n + '/eg.js';
                  var i = r.getUrl(e.options.context.etag || {});
                  o.loadScript(i, function (n) {
                    n &&
                      'error' !== n.type &&
                      a.setLsCna(
                        t.globalConfig.ETAG_STORAGE_KEY,
                        e.today,
                        aplus.Etag
                      );
                  });
                }
              }, 1e3);
          }
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(22),
      o = n(2),
      r = n(116),
      i = a.extend({
        push: function (e) {
          this.length++, r.processTask(e, this.opts);
        },
      });
    e.exports = function () {
      return {
        processAplusQueue: function (e) {
          var t = this.options.config || {},
            n = o.getGlobalValue(e);
          r.processGoldlogQueue(n, t),
            o.setGlobalValue(
              e,
              i.create({ opts: t, startLength: n.length, length: 0 })
            );
        },
        run: function () {
          var e = this.options.context.aplus_config,
            t = e.globalConfig.APLUS_QUEUE;
          this.processAplusQueue(t),
            'aplus_queue' === t && this.processAplusQueue('goldlog_queue'),
            r.subscribeAndProcessQueue(t, this.options.config);
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(36),
      o = n(45),
      r = n(44);
    e.exports = function () {
      return {
        init: function (e) {
          this.options = e;
        },
        addStyle: function (e, t) {
          var n = e + '_style',
            a = document.getElementById(n);
          a ||
            ((a = document.createElement('link')),
            (a.id = n),
            (a.href = t),
            (a.rel = 'stylesheet'),
            (a.type = 'text/css'),
            document.getElementsByTagName('head').item(0).appendChild(a));
        },
        run: function () {
          var e = this,
            t = parent !== self,
            n = this.options.config || {};
          !t &&
            n.urlRules &&
            a(n.urlRules, function (t) {
              var n,
                i = new RegExp(t.rule);
              try {
                n = t.id ? window.sessionStorage.getItem(t.id) : '';
              } catch (e) {}
              if (i.test(location.href) || n) {
                try {
                  window.sessionStorage.setItem(t.id, !0);
                } catch (e) {}
                r.isArray(t.cdnPath)
                  ? a(t.cdnPath, function (n) {
                      /\.css$/.test(n)
                        ? e.addStyle(t.id, n)
                        : /\.js/.test(n) && o.addScript(n);
                    })
                  : o.addScript(t.cdnPath);
              }
            });
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(6);
    e.exports = function () {
      return {
        run: function () {
          return aplus._aplus_cplugin_webvt
            ? void a.logger({
                msg: '当前集成了可视化埋点分析插件，需要您做可视化埋点配置，才会有自动pv功能',
              })
            : void n(121)();
        },
      };
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(2);
    e.exports = function () {
      var e = a.getGlobalValue('aplus'),
        t = a.getGlobalValue('aplus_queue');
      e._aplus_apv ||
        ((e._aplus_apv = { status: 'complete' }),
        t.push({ action: 'aplus.sendPV', arguments: [{ is_auto: !0 }] }));
    };
  },
  function (e, t, n) {
    'use strict';
    e.exports = function (e) {
      var t = window,
        a = 'g_tb_aplus_loaded';
      if (!t[a]) {
        (t[a] = 1), n(55).isDebugAplus();
        var o = n(6),
          r = n(102),
          i = n(32),
          s = n(36),
          u = n(123),
          c = 'running',
          l = ['aplusReady', c];
        r.doPubMsg(l),
          u.run(
            {
              plugins: e.plugins,
              context: function () {
                var t = { PAGE_LOAD_TIME: new Date() },
                  n = [];
                return (
                  s(e.plugins, function (e) {
                    (t[e.name] = e.config || {}),
                      'aplus_log_inject' === e.name &&
                        e.config &&
                        e.config.plugins &&
                        ((n = e.config.plugins.pv),
                        s(n, function (e) {
                          t[e.name] = e.config;
                        }));
                  }),
                  i.assign(t, { aplus_config: e })
                );
              },
            },
            function () {
              o.logger({ msg: 'APLUS INIT SUCCESS' });
            }
          );
      }
    };
  },
  function (e, t, n) {
    'use strict';
    var a = n(110),
      o = n(9),
      r = n(102);
    t.run = function (e, t) {
      var n = new a();
      n.run(
        { plugins: e.plugins, context: e.context },
        {
          config: {},
          userdata: {},
          pubsubType: 'aplusinit',
          messageFnQueue: [],
          middlewareMessageKey: 'mw_change_aplusinit',
        },
        function (e) {
          var n = ['aplusInitContext', e];
          r.doPubMsg(n), r.doCachePubs(n), o(t) && t(e);
        }
      );
    };
  },
]);
