(function (t) {
  function e(e) {
    for (
      var n, r, o = e[0], c = e[1], u = e[2], d = 0, m = [];
      d < o.length;
      d++
    )
      (r = o[d]),
        Object.prototype.hasOwnProperty.call(i, r) && i[r] && m.push(i[r][0]),
        (i[r] = 0);
    for (n in c) Object.prototype.hasOwnProperty.call(c, n) && (t[n] = c[n]);
    l && l(e);
    while (m.length) m.shift()();
    return s.push.apply(s, u || []), a();
  }
  function a() {
    for (var t, e = 0; e < s.length; e++) {
      for (var a = s[e], n = !0, o = 1; o < a.length; o++) {
        var c = a[o];
        0 !== i[c] && (n = !1);
      }
      n && (s.splice(e--, 1), (t = r((r.s = a[0]))));
    }
    return t;
  }
  var n = {},
    i = { app: 0 },
    s = [];
  function r(e) {
    if (n[e]) return n[e].exports;
    var a = (n[e] = { i: e, l: !1, exports: {} });
    return t[e].call(a.exports, a, a.exports, r), (a.l = !0), a.exports;
  }
  (r.m = t),
    (r.c = n),
    (r.d = function (t, e, a) {
      r.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: a });
    }),
    (r.r = function (t) {
      'undefined' !== typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' }),
        Object.defineProperty(t, '__esModule', { value: !0 });
    }),
    (r.t = function (t, e) {
      if ((1 & e && (t = r(t)), 8 & e)) return t;
      if (4 & e && 'object' === typeof t && t && t.__esModule) return t;
      var a = Object.create(null);
      if (
        (r.r(a),
        Object.defineProperty(a, 'default', { enumerable: !0, value: t }),
        2 & e && 'string' != typeof t)
      )
        for (var n in t)
          r.d(
            a,
            n,
            function (e) {
              return t[e];
            }.bind(null, n)
          );
      return a;
    }),
    (r.n = function (t) {
      var e =
        t && t.__esModule
          ? function () {
              return t['default'];
            }
          : function () {
              return t;
            };
      return r.d(e, 'a', e), e;
    }),
    (r.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }),
    (r.p = '{{ .AssetsPath }}/');
  var o = (window['webpackJsonp'] = window['webpackJsonp'] || []),
    c = o.push.bind(o);
  (o.push = e), (o = o.slice());
  for (var u = 0; u < o.length; u++) e(o[u]);
  var l = c;
  s.push([
    0,
    'vendors-element-ui',
    'vendors-date-fns',
    'vendors-crypto-js',
    'vendors-swiper',
    'lodash',
    'vendors-svgaplayerweb',
    'chunk-vendors',
  ]),
    a();
})({
  0: function (t, e, a) {
    t.exports = a('56d7');
  },
  '01f5': function (t, e, a) {},
  '0343': function (t, e, a) {
    'use strict';
    a('1fb8');
  },
  '03e7': function (t, e, a) {},
  '04b1': function (t, e, a) {},
  '0568': function (t, e, a) {
    'use strict';
    a.d(e, 'i', function () {
      return c;
    }),
      a.d(e, 'h', function () {
        return u;
      }),
      a.d(e, 'g', function () {
        return l;
      }),
      a.d(e, 'd', function () {
        return d;
      }),
      a.d(e, 'j', function () {
        return m;
      }),
      a.d(e, 'c', function () {
        return _;
      }),
      a.d(e, 'b', function () {
        return f;
      }),
      a.d(e, 'k', function () {
        return p;
      }),
      a.d(e, 'a', function () {
        return g;
      }),
      a.d(e, 'f', function () {
        return h;
      }),
      a.d(e, 'e', function () {
        return S;
      });
    a('99af'), a('4795');
    var n = a('a3be'),
      i = a('2471'),
      s = a('4360'),
      r = a('3aee'),
      o = a('8f6a'),
      c = function (t) {
        return Object(o['a'])('get', n['X'], t);
      },
      u = function (t) {
        return Object(o['a'])('get', ''.concat(n['T'], '/').concat(t));
      },
      l = function (t) {
        return Object(o['a'])('get', ''.concat(n['S'], '/').concat(t));
      },
      d = function (t) {
        return Object(o['a'])('get', ''.concat(n['x'], '/').concat(t));
      },
      m = function (t, e) {
        return Object(o['a'])('get', ''.concat(n['Y'], '/').concat(t), e);
      },
      _ = function (t, e) {
        return Object(o['a'])('get', ''.concat(n['q'], '/').concat(t), e);
      },
      h = function (t) {
        return Object(o['a'])('get', ''.concat(n['Z'], '/').concat(t.id), {
          role: t.role,
        });
      },
      f = function (t) {
        var e = t.streamerId,
          a = t.scope;
        return Object(o['a'])('get', ''.concat(n['i'], '/').concat(e), a);
      },
      p = function (t) {
        return Object(o['a'])('post', n['K'], t).then(function (t) {
          if ('116023116' === t.data.error_code)
            throw (
              (s['a'].dispatch(
                'actionSetHintInfo',
                r['a'].t('S_DEPOSIT_ONCE_OPEN_DIAMOND')
              ),
              setTimeout(function () {
                Object(i['c'])('deposit');
              }, 3e3),
              new Error())
            );
          return t;
        });
      },
      g = function (t) {
        return Object(o['a'])('post', n['g'], t).then(function (t) {
          if ('116023116' === t.data.error_code)
            throw (
              (s['a'].dispatch(
                'actionSetHintInfo',
                r['a'].t('S_DEPOSIT_ONCE_OPEN_DIAMOND')
              ),
              setTimeout(function () {
                Object(i['c'])('deposit');
              }, 3e3),
              new Error())
            );
          return t;
        });
      },
      S = function (t) {
        return Object(o['a'])('get', n['M'], t);
      };
  },
  '061e': function (t, e, a) {
    'use strict';
    a('6406');
  },
  '072a': function (t, e, a) {},
  '0875': function (t, e, a) {
    'use strict';
    var n = a('b6ce'),
      i = a.n(n);
    a.d(e, 'default', function () {
      return i.a;
    });
  },
  '08e1': function (t, e, a) {
    'use strict';
    a('b9ed');
  },
  '0d39': function (t, e, a) {
    'use strict';
    var n = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return t.getPropsList
          ? a(
              'div',
              { class: ['props-wrap', { model: t.isModel }] },
              [
                a('MainHeader', {
                  attrs: {
                    title: t.$t('S_PROPS') + ' (' + t.getPropsListTotal + ')',
                    'left-btn-func': t.isModel
                      ? function () {
                          return t.$emit('close');
                        }
                      : null,
                  },
                }),
                a(
                  'div',
                  { staticClass: 'page-wrap' },
                  [
                    a(
                      'div',
                      {
                        staticClass: 'style-list-wrap',
                        on: {
                          click: function (e) {
                            return e.target !== e.currentTarget
                              ? null
                              : t.setSelectItem(null);
                          },
                        },
                      },
                      [
                        a(
                          'div',
                          { staticClass: 'prop-wrap' },
                          t._l(t.getPropsList.backpack, function (e) {
                            return a(
                              'div',
                              {
                                key: e.id,
                                staticClass: 'props-item',
                                class: {
                                  activeItem:
                                    t.selectItem && t.selectItem.id === e.id,
                                  lockItem: 0 === e.gain || 0 === e.amount,
                                },
                                on: {
                                  click: function (a) {
                                    return t.setSelectItem(e);
                                  },
                                },
                              },
                              [
                                a('div', {
                                  staticClass: 'name',
                                  domProps: {
                                    innerHTML: t._s(t.getPropsName(e.name)),
                                  },
                                }),
                                a('div', { staticClass: 'img' }, [
                                  0 === e.gain || 0 === e.amount
                                    ? a('div', { staticClass: 'img-mask' })
                                    : t._e(),
                                  0 === e.gain
                                    ? a('img', {
                                        staticClass: 'lock-icon',
                                        attrs: {
                                          src: t.$getCdnPath(
                                            '/images/mainSite/props/ic_lock.svg'
                                          ),
                                        },
                                      })
                                    : t._e(),
                                  e.new
                                    ? a('div', { staticClass: 'new' }, [
                                        t._v('New'),
                                      ])
                                    : t._e(),
                                  a('img', {
                                    staticClass: 'thumbnail',
                                    attrs: { src: e.link },
                                  }),
                                ]),
                                a('div', { staticClass: 'use' }, [
                                  t._v(
                                    ' ' +
                                      t._s(
                                        0 === e.gain
                                          ? t.$t('S_LOCK')
                                          : 'x' + e.amount
                                      ) +
                                      ' '
                                  ),
                                ]),
                              ]
                            );
                          }),
                          0
                        ),
                      ]
                    ),
                    a('transition', { attrs: { name: 'slide-up' } }, [
                      t.selectItem
                        ? a('div', { staticClass: 'style-info-wrap' }, [
                            a('div', { staticClass: 'style-card-wrap' }, [
                              a('div', { staticClass: 'style-card' }, [
                                a('div', {
                                  staticClass: 'name',
                                  domProps: {
                                    innerHTML: t._s(
                                      t.getPropsName(t.selectItem.name)
                                    ),
                                  },
                                }),
                                a('div', { staticClass: 'img' }, [
                                  a('img', {
                                    staticClass: 'thumbnail',
                                    attrs: { src: t.selectItem.link },
                                  }),
                                ]),
                              ]),
                              a('div', { staticClass: 'description' }, [
                                a('div', { staticClass: 'description-title' }, [
                                  t._v(
                                    ' ' +
                                      t._s(t.getDescriptionName(t.activeName)) +
                                      '： '
                                  ),
                                ]),
                                a('div', [
                                  t._v(
                                    ' ' + t._s(t.selectItem.description) + ' '
                                  ),
                                ]),
                              ]),
                            ]),
                            a('div', { staticClass: 'btn-wrap' }, [
                              0 === t.selectItem.gain ||
                              0 === t.selectItem.amount
                                ? a(
                                    'div',
                                    {
                                      on: {
                                        click: function (e) {
                                          return t.$router.push('/main/mall');
                                        },
                                      },
                                    },
                                    [t._v(' ' + t._s(t.$t('S_TO_BUY')) + ' ')]
                                  )
                                : 1 === t.selectItem.gain
                                ? a('div', { on: { click: t.setProps } }, [
                                    t._v(' ' + t._s(t.$t('S_USE')) + ' '),
                                  ])
                                : t._e(),
                            ]),
                            a('div'),
                          ])
                        : t._e(),
                    ]),
                  ],
                  1
                ),
                a(
                  'transition',
                  { attrs: { name: 'slide-right' } },
                  [
                    t.isShowTrack
                      ? a('my-track', {
                          attrs: {
                            'is-model': '',
                            'props-id': t.selectItem.id,
                          },
                          on: { close: t.closeTrack },
                        })
                      : t._e(),
                  ],
                  1
                ),
              ],
              1
            )
          : t._e();
      },
      i = [],
      s = a('5530'),
      r = (a('ac1f'), a('5319'), a('2f62')),
      o = a('2471'),
      c = a('5061'),
      u = a('c56b'),
      l = {
        components: { MainHeader: c['a'], myTrack: u['a'] },
        props: { isModel: { type: Boolean, default: !1 } },
        data: function () {
          return {
            activeName: 'eff',
            selectItem: null,
            isShowTrack: !1,
            typeList: ['eff', 'uBadge', 'uFrame', 'background'],
          };
        },
        computed: Object(s['a'])(
          Object(s['a'])(
            Object(s['a'])({}, Object(r['c'])('my', ['getPropsList'])),
            Object(r['d'])(['user'])
          ),
          {},
          {
            getPropsListTotal: function () {
              return this.getPropsList.total ? this.getPropsList.total : 0;
            },
          }
        ),
        watch: {
          activeName: function () {
            this.selectItem = null;
          },
        },
        created: function () {
          var t = { lott_id: this.user.lott_id };
          this.actionGetPropsList(t);
        },
        methods: Object(s['a'])(
          Object(s['a'])(
            Object(s['a'])({}, Object(r['b'])(['actionSetHintInfo'])),
            Object(r['b'])('my', ['actionGetPropsList', 'actionSetProps'])
          ),
          {},
          {
            setSelectItem: function (t) {
              this.selectItem = t;
            },
            getDescriptionName: function (t) {
              var e = {
                eff: this.$t('S_EFF_DESCRIPTION'),
                uBadge: this.$t('S_BADGE_DESCRIPTION'),
                uFrame: this.$t('S_FRAME_DESCRIPTION'),
                background: this.$t('S_BG_DESCRIPTION'),
              };
              return e[t];
            },
            setProps: function () {
              var t = this.user,
                e = this.selectItem;
              switch (e.id) {
                case 1:
                case 2:
                case 3:
                case 4:
                  this.isShowTrack = !0;
                  break;
                case 5:
                  this.$router.push('/main/dailyTask');
                  break;
                case 6:
                case 7:
                  this.actionSetHintInfo(this.$t('S_ONLY_STREAM_USE'));
                  break;
                case 8:
                  Object(o['c'])('editLiveAlias');
                  break;
                case 10:
                case 12:
                  this.$router.push('/main/mall/eff');
                  break;
                case 9:
                case 11:
                case 13:
                case 14:
                case 15:
                  this.actionSetProps({
                    role: t.identity_id,
                    action_id: t.lott_id,
                    prop_id: e.id,
                  }),
                    13 === e.id && Object(o['c'])('streamHome');
                  break;
                default:
                  break;
              }
            },
            getPropsName: function (t) {
              return t.replace('/n', '<br>');
            },
            closeTrack: function () {
              (this.isShowTrack = !1), (this.selectItem = null);
            },
          }
        ),
      },
      d = l,
      m = (a('0343'), a('2877')),
      _ = Object(m['a'])(d, n, i, !1, null, '2aff406b', null);
    e['a'] = _.exports;
  },
  '0e18': function (t) {
    t.exports = JSON.parse(
      '{"S_TITLE":"新直播娛樂城","S_WELCOME":"Welcome","S_LOGIN_HINT":"請輸入用戶的帳號密碼","S_ACCOUNT_HINT":"請輸入帳號","S_PWD_HINT":"請輸入密碼","S_LOGIN":"登入","S_LOGIN_EMPTY_HINT":"帳號及密碼不能為空","S_LOGIN_LENGTH_HINT":"帳號長度需大於5個字","S_INDEX":"首頁","S_SPORT":"體育","S_GAMES":"游戲","S_DEPOSIT":"充值","S_MINE":"我的","S_LOGOUT":"登出","S_MARQUEE_TEXT":"這裡放要跑的文字","S_RECOMMAND":"推薦","S_LEAD":"帶投","S_CANCEL":"取消","S_STREAMER_INTRODUCE":"主播簡介","S_RECENTLY_VIEWED":"最近瀏覽","S_RECOMMAND_TO_YOU":"為您推薦","S_CHANGE_A_BATCH":"換一批","S_NO_MATCH_STREAMER":"未匹配到主播","S_ENTER_ROOM":"%n進入直播間","S_ONLINE_USER":"在線會員","S_ONLINE_LIMIT":"只顯示前50個在線人數","S_GUARD":"守護","S_USER_VARI":"%n人","S_GET":"獲取","S_GET_STREAMER_CARD":"獲取名片","S_STREAMER_CARD":"主播名片","S_SEND":"發送","S_SHARE":"分享","S_ACTIVITY":"活動","S_GIFT":"禮物","S_USER_ID":"會員ID","S_AREA":"地區","S_FANS":"粉絲","S_BUBBLE":"泡泡","S_HOME_PAGE":"主頁","S_GIVE_GIFT":"送禮","S_FOLLOW":"關注","S_FOLLOWED":"(已)關注","S_REPORT":"舉報","S_CRAD_VARI":"%n的名片","S_CARD_PROGRESS":"獲取名片進度","S_GET_CARD":"贈送禮物達到要求可獲取","S_SAY_SOMETHING":"說點什麼...","S_SAY_SOMETHING_RE":"說點什麼..","S_SAY_TO_STREAMER":"輸入想跟主播的話","S_BARRAGE_IS_OPEN":"已開啟彈幕評論","S_NO_INTRODUCTION":"目前沒有個人介紹","S_CONTRIBUTE_LIST":"貢獻榜","S_DAILY_LIST":"日榜","S_WEEKLY_LIST":"周榜","S_MONTHLY_LIST":"月榜","S_TOTAL_LIST":"總榜","S_LEADER_BOARD":"排行榜","S_FOLLOW_INFORMATION":"關注主播不迷路~","S_FOLLOW_AND_LEAVE":"關注並退出","S_LEAVE":"離開","S_DIAMOND":"鑽石","S_BALANCE":"餘額","S_ASK_EXCHANGE_DIAMOND":"鑽石不足，是否兌換鑽石？","S_ASK_DEPOSIT":"餘額不足，是否前往充值？","S_EXCHANGE_DIAMOND":"兌換鑽石","S_GIVE":"送出","S_GIFT_NUM_1":"一心一意","S_GIFT_NUM_10":"十全十美","S_GIFT_NUM_30":"想你","S_GIFT_NUM_66":"六六大順","S_GIFT_NUM_188":"要抱抱","S_GIFT_NUM_520":"我愛你","S_GIFT_NUM_1314":"一生一世","S_DONATE_MSG":"%n贈送給主播%b個%c","S_GAME_ACTIVITY":"游戲活動","S_STREAM_ACTIVITY":"直播活動","S_ACTIVITY_TIME":"活動時間","S_PRIVILEGE":"特權","S_BAG":"背包","S_NO_DATA":"暫無資料","S_OPEN_GUARD_INFO":"守護主播，成為守護騎士","S_OPEN_GUARD":"開通守護","S_CONTRIBUTE_POWER":"貢獻%n","S_GAME_CENTER":"游戲中心","S_HOT":"熱門","S_CHESS":"棋牌","S_FISH":"捕魚","S_ELECTRONIC":"電子","S_VIDEO":"視訊","S_LOTTERY":"彩票","S_FOLLOWED_STREAMER":"已關注主播","S_EXCHANGE":"兌換","S_CHARGE_IMMEDIATELY":"立即充值","S_SERVICE":"客服","S_DIAMOND_UNIT":"鑽","S_DOLLAR":"元","S_NEED_NICKNAME_INFO":"添加時請備著暱稱避免主播無法區分","S_CONNECT_SERVICE_INFO":"聯系方式如有虛假可以通過客服客訴","S_STREAMER_CARD_HINT":"贈送禮物即可獲取","S_ATTENTION_SUCCESS":"關注成功","S_CANCEL_ATTENTION_SUCCESS":"取消關注成功","S_NOBLE_AND_SEND_GIFT":"進行送禮可快速升級","S_HINT":"提示","S_TO_GIFT":"去送禮","S_TO_NOBLE":"開通貴族","S_CANCEL_ATTENTION":"取消關注","S_WAIT_USER":"虛位以待","S_DIAMOND_RANK":"鑽石榜","S_BUBBLE_RANK":"泡泡榜","S_SURE_TO_LEAVE":"您確定要離開直播間嗎？","S_CONTINUE_WATCH":"繼續觀看","S_ONLINE_GUARD":"在線守護","S_PLEASE_SELECT_GIFT":"請選中要贈送的禮物","S_PLEASE_SELECT_PROP":"請選擇要使用的道具","S_TO_EXCHANGE":"去兌換","S_TO_DEPOSIT":"去充值","S_USE_LIMIT_DIAMOND":"使用最大值送禮","S_DONATE_FAILED":"交易失敗","S_DONATE_SUCCESS":"贈禮成功","S_USEPROPS_SUCCESS":"道具使用成功","S_MONTHLY_GUARD":"月守護","S_WEEKLY_GUARD":"周守護","S_GUARD_PRIVILEGE_INFO":"為主播開通守護，暢享尊貴特權。","S_S_HEADER_FRAME":"特殊頭框","S_S_GIFT":"專屬禮物","S_S_INTRO":"進場特效","S_S_MUTE":"防禁言","S_FOLLOW_STREAMER":"關注主播","S_ASK_OPEN_GAURD":"消耗%n鑽石成為%m","S_OPEN":"開","S_CLOSE":"關","S_BARRAGE":"彈幕","S_FAN_LIST":"粉絲人數","S_CHARGE_PER_MINUTE":"按分收費 %n鑽/分","S_STREAMER_OPEN_CHARGEROOM":"主播開啟了付費直播 %n鑽/分","S_CHANGE_CHARGE":"主播調整收費為 %n鑽/分，繼續觀看麼","S_I_WANT_SEE":"我要看","S_ASK_INTO_CHARGEROOM":"是否付費加入？","S_PREVIEW_END":"預覽時間已結束","S_PAY_DIAMOND_ENTER_ROOM":"是否支付 %n鑽/分鐘 進入直播?","S_CHARGE_ROOM":"付費直播","S_OK":"確定","S_PASS":"跳過","S_CHARGE_COUNT":"預覽倒數%n秒","S_WATCHED_MINUTE":"已觀看%n分鐘","S_SYSTEM":"系統","S_ANNOUNCE":"公告","S_USER":"用戶","S_HAS":"已被","S_MUTE":"禁言","S_REMUTE":"解除禁言","S_KO":"封鎖","S_UNBLOCK":"解除封鎖","S_BE_BLOCK":"您已被封鎖","S_CHARGE_ON_TIME":"按分收費","S_PER_MINUTE_DIAMOND":"%n鑽/分","S_KICK_OUT":"小姐姐溫柔的把你踢出去囉><","S_SEE_U_LATER":"說話留一線 日後好相見哦","S_BACK_TO_INDEX":"回到首頁","S_COMMAND_NEXT_ROOM":"為您推薦下一間","S_WIN_GAME_INFO":"恭喜會員%n中獎了","S_WIN":"中獎","S_I_UNDERSTAND":"我了解了","S_TASK":"任務","S_MEMBER_BE_GUARDIAN":"會員%n守護了主播","S_MEMBER_ATTENTION":"會員%n已關注主播","S_UNOPEN_GUARDIAN_INFO":"該主播等級未達開放此功能","S_USE":"使用","S_ONLOOKERS":"去圍觀","S_CANT_ATTENTION_TIP":"主播等級不足，無法關注","S_TASK_WALL":"任務牆","S_GAME_BET_INFO":"會員%n在%n玩法中，成功下注了%n元","S_FROM_NOW":"即日起","S_LEADER_BOARD_ANCHOR":"主播榜","S_LEADER_BOARD_RICHER":"土豪榜","S_LAST_WEEK":"上周","S_LAST_MONTH":"上月","S_YESTERDAY":"昨日","S_NEXT_STREAM_TIME":"下次開播","S_USER_INFO":"個人信息","S_USER_ACCOUNT":"會員帳號","S_BIRTHDAY":"生日","S_LOVE_STATUS":"感情","S_FANS_COUNT":"粉絲人數","S_ITEM":"道具","S_SEARCH":"搜尋","S_MY_STYLE":"我的風格","S_EFF":"進場特效","S_BADGE":"徽章","S_FRAME":"頭像框","S_BG":"背景","S_IN_USE":"使用中","S_UN_USE":"未使用","S_LOCK":"未解鎖","S_EFF_DESCRIPTION":"特效說明","S_BADGE_DESCRIPTION":"徽章說明","S_FRAME_DESCRIPTION":"頭像框說明","S_BG_DESCRIPTION":"背景說明","S_TO_BUY":"去購買","S_STOP_USE":"停用","S_USED":"已使用","S_STOP_USED":"已停用","S_PROPS":"道具","S_MALL":"商城","S_RECHARGE":"充值","S_BUY":"購買","S_BUY_PROPS":"購買道具","S_BUY_EFF":"購買特效","S_TRACK_COUNT":"追蹤人數","S_MY_FAVORITE":"我的最愛","S_CANCEL_FAVORITE":"取消最愛","S_CANCEL_FAVORITE_OK":"取消了最愛","S_ADD_FAVORITE":"加入最愛","S_ADD_FAVORITE_OK":"加入了最愛","S_ON_STREAM":"開播中","S_MEMINFO_LEVEL":"會員等級","S_PROMOTION_REWARD":"晉級獎勵","S_ACCUMULATION_SPEND_DIAMOND":"累積消費鑽石","S_MY_DIAMOND":"我的鑽石","S_EXPERIENCE":"經驗值","S_REMINDER":"溫馨提示","S_NOW_EXCHANGE_DIAMOND":"立即換鑽","S_EXCHANGE_SUCCESS":"兌換成功","S_MY_GUARD":"我的守護","S_MY_CONTRIBUTE":"我的貢獻","S_ALL_EXP_EXCHANGE_DIAMOND":"將以所有經驗值兌換鑽石","S_BUBBLE_MONTH_SIGNIN":"%n月簽泡","S_ACTIVITY_TIME_RANGE":"活動區間","S_RECEIVE":"領取","S_RECEIVED":"已領取","S_REISSUE":"補簽","S_DAILY_SIGN_BUBBLE":"每日簽泡","S_RECEIVE_SUCCESS":"領取成功","S_TODAY_RECEIVE_WHAT":"今天已領取%n","S_DAILY_SIGN_BUBBLE_ARTICLE":"當月全勤之玩家即可獲得領取獎勵，%n道具","S_REISSUE_ARTICLE":"補簽失敗，需從最後日期開始補簽","S_MY_SENDED_PAO":"我送過的泡泡","S_LATEST":"最新","S_TODAY_LIVENESS":"今日活躍度","S_ADD_EXP":"+加%n經驗值","S_ADD_LIVENESS":"+加%n活躍度","S_ONLY_STREAM_USE":"僅能於直播間使用","S_ATTENTION_FAVORITE_STREAMER":"已關注最愛的主播","S_DONT_HAVE_ATTENTION":"你還沒關注任何小姊姊呢~","S_BUY_SUCCESS":"購買成功","S_SEARCH_KEYWORD":"主播ID、暱稱或Hashtag","S_EXP":"經驗值","S_USER_PORPS":"使用道具","S_FINISH":"完成","S_GO_TASK":"去任務","S_FIN_TASK_GET_RANDOM_ITEM":"完成任務即獲得隨機道具","S_NO_LIMIT_DATE":"無期限","S_BECOME_GUARDIAN":"成為守護","S_LEAVE_ROOM_TIP":"即將前往兌換鑽石，確認是否離開聊天室","S_FOLLOW_BET":"跟投","S_MEMBER":"會員","S_PK_PAOPK":"PK10","S_LT_PAO1MLT":"1分六合彩","S_SC_PAO1MSC":"1分時時彩","S_Q3_PAOQ3":"快3","S_E5_PAOE5":"11選5","S_SICBO_PAOFSC":"魚蝦蟹","S_GUARD_SUCCESS":"成為守護","S_LIGHT_YEARS_RECOMMAND":"光年推薦","S_USE_BROADCAST":"使用大聲公","S_PLZ_INPUT_CONTENT":"請輸入內容","S_NO_PROPS_DATA":"空虛寂寞缺道具","S_NO_SETTING":"未設定","S_COOKIE_MSG":"cookie已被封鎖，無法取得session資訊","S_GO_REGISTER":"去注冊","S_GO_REGISTER_TIP":"親～您還不是會員呢！ \\n立即注冊領取300鑽石","S_403_TITLE":"訪問受限制","S_CUS_SERVICE_MAIL":"客服郵箱","S_STREAMER_MAIL":"主播郵箱","S_403MSG_FIRST":"尊敬的用戶，由於相關法規限制，您所在的地區無法使用泡泡直播，如有任何疑問，請通過在線客服，或發郵件至","S_403MSG_SECOND":"我們將第一時間給您回復，對您造成的不便，我們深表歉意，感謝您的理解與支持！","S_NEED_HELP":"如需幫助，請","S_CONTACT_SERVICE":"聯系客服","S_404_TITLE":"頁面未找到","S_404MSG":"尊敬的用戶，很抱歉，此頁面未找到，請您聯系客服為您提供解決方法，對您造成的不便，我們深表歉意，感謝您的理解與支持！","S_UPGRADE_TITLE":"網站升級中","S_UPGRADEMSG":"目前網站進行系統維護中，如有不便之處，敬請見諒。 我們很快回來!請您稍後回來繼續游戲喔!","S_CHANGENAME_TIP":"請至個人頁面使用","S_NO_GUARD":"目前還沒有粉絲守護","S_EXIT_TO_BUY_CARD":"離開直播去購買特殊禮物卡","S_SYS_CHARGE_CLOSE_HINT":"收費房關閉提示","S_SYS_ERRORMSG":"哎呀！系統出錯了","S_SWITCH_TO_POTRAIT":"請使用直屏開始瀏覽","S_GUARD_ARTICLE_01":"1. 什麽是守護","S_GUARD_ARTICLE_02":"守護身分是代表著粉絲與主播的親密關系，也像徵著主播在直播平台的人氣","S_GUARD_ARTICLE_03":"2. 守護類型","S_GUARD_ARTICLE_04":"守護分為兩種類型、周守護以及月守護。有效期分別為7日、30日","S_GUARD_ARTICLE_05":"有效期為7日","S_GUARD_ARTICLE_06":"有效期30日","S_GUARD_ARTICLE_07":"3. 如何開通守護","S_GUARD_ARTICLE_08":"周守護開通:","S_GUARD_ARTICLE_09":"您可以通過消費999鉆石成為主播周守護身分，999鉆石將全數贈送給主播，同時您可以獲得專屬於守護的特權。","S_GUARD_ARTICLE_10":"月守護開通:","S_GUARD_ARTICLE_11":"您可以通過消費2999鉆石成為主播周守護身分，2999鉆石將全數贈送給主播，同時您可以獲得專屬於守護的特權。","S_GUARD_ARTICLE_12":"4. 守護特權","S_GUARD_ARTICLE_13":"開通守護後，即可在該主播直播間享受對應的守護特權，不同類型的守護身分，享受特權不同具體如下:","S_GUARD_ARTICLE_14":"周守護：","S_GUARD_ARTICLE_15":"專屬徽章、周守護專屬進場特效、周守護專屬禮物。","S_GUARD_ARTICLE_16":"月守護：","S_GUARD_ARTICLE_17":"守護專屬徽章、月守護專屬進場特效、月守護專屬禮物、月守護限定特殊頭框、直播間防禁言。","S_GUARD_ARTICLE_18":"5. 榮耀守護","S_GUARD_ARTICLE_19":"累積為主播貢獻鉆石最高的守護，將成為榮耀守護，在直播間守護列表頁面中榜單顯示頭像。即便未在直播間內也會顯示。","S_GUARD_ARTICLE_20":"6.其他說明","S_GUARD_ARTICLE_21":"a、各個守護一旦開通，無法取消。","S_GUARD_ARTICLE_22":"b、每個會員可以為不同的主播開通守護，沒有數量限制，主播也可以有多個守護，也沒有數量的限制。","S_GUARD_ARTICLE_23":"c、為主播開通守護，您將可以獲得對應的守護權限且主播可獲得開通守護100%的鉆石獎勵。","S_GUARD_ARTICLE_24":"d、直播間內不同的守護不能累積時效。例:","S_GUARD_ARTICLE_25":"A會員於9/1開通周守護，使用效期可到9/7。如該會員於9/3開通月守護，則周守護會直接失效，月守護則由9/3計算時效至10/3。反之亦然。","S_GUARD_ARTICLE_26":"e、承上:","S_GUARD_ARTICLE_27":"不同守護時效影響僅限於同個主播的直播間，會員在不同直播間的守護則不會互相影響。","S_MALL_ARTICLE_01":"未達會員等級3，請至商城購買一日特效道具卡","S_MY_GUARD_STREAMER":"我守護的主播","S_TO_GUARD_STREAMER":"前往守護主播","S_NO_NEED_TO_SIGN_UP":"不需補簽","S_NO_BARRAGE_TIP":"離開直播間去購買彈幕卡","S_DAILY_SIGN_BUBBLE_ARTICLE_EX_DM":"當月全勤之玩家即可獲得領取獎勵，%n","S_CONNECT_ERROR":"哎呀~連線異常，換一間試試","S_GIFT_REPARING":"禮物準備中"}'
    );
  },
  1: function (t, e) {},
  '11d0': function (t, e, a) {
    'use strict';
    a('6ef4');
  },
  1483: function (t, e, a) {
    'use strict';
    a('9eb6');
  },
  '149e': function (t, e, a) {
    'use strict';
    a('4879');
  },
  '18c3': function (t, e, a) {
    'use strict';
    a('f8f4');
  },
  '1b03': function (t, e, a) {},
  '1b034': function (t) {
    t.exports = JSON.parse(
      '{"S_TITLE":"泡泡直播","S_WELCOME":"Welcome","S_LOGIN_HINT":"请输入用户的帐号密码","S_ACCOUNT_HINT":"请输入帐号","S_PWD_HINT":"请输入密码","S_LOGIN":"登入","S_LOGIN_EMPTY_HINT":"帐号及密码不能为空","S_LOGIN_LENGTH_HINT":"帐号长度需大于5个字","S_INDEX":"首页","S_SPORT":"体育","S_GAMES":"游戏","S_DEPOSIT":"充值","S_MINE":"我的","S_LOGOUT":"登出","S_MARQUEE_TEXT":"这里放要跑的文字","S_RECOMMAND":"推荐","S_LEAD":"带投","S_CANCEL":"取消","S_STREAMER_INTRODUCE":"主播简介","S_RECENTLY_VIEWED":"最近浏览","S_RECOMMAND_TO_YOU":"为您推荐","S_CHANGE_A_BATCH":"换一批","S_NO_MATCH_STREAMER":"未匹配到主播","S_ENTER_ROOM":"%n进入直播间","S_ONLINE_USER":"在线会员","S_ONLINE_LIMIT":"只显示前50个在线人数","S_GUARD":"守护","S_USER_VARI":"%n人","S_GET":"获取","S_GET_STREAMER_CARD":"获取名片","S_STREAMER_CARD":"主播名片","S_SEND":"发送","S_SHARE":"分享","S_ACTIVITY":"活动","S_GIFT":"礼物","S_USER_ID":"会员ID","S_AREA":"地区","S_FANS":"粉丝","S_BUBBLE":"泡泡","S_HOME_PAGE":"主页","S_GIVE_GIFT":"送礼","S_FOLLOW":"关注","S_FOLLOWED":"(已)关注","S_REPORT":"举报","S_CRAD_VARI":"%n的名片","S_CARD_PROGRESS":"获取名片进度","S_GET_CARD":"赠送礼物达到要求可获取","S_SAY_SOMETHING":"说点什麽...","S_SAY_SOMETHING_RE":"说点什麽..","S_SAY_TO_STREAMER":"输入想跟主播的话","S_BARRAGE_IS_OPEN":"已开启弹幕评论","S_NO_INTRODUCTION":"目前没有个人介绍","S_CONTRIBUTE_LIST":"贡献榜","S_DAILY_LIST":"日榜","S_WEEKLY_LIST":"周榜","S_MONTHLY_LIST":"月榜","S_TOTAL_LIST":"总榜","S_LEADER_BOARD":"排行榜","S_FOLLOW_INFORMATION":"关注主播不迷路~","S_FOLLOW_AND_LEAVE":"关注并退出","S_LEAVE":"离开","S_DIAMOND":"钻石","S_BALANCE":"馀额","S_ASK_EXCHANGE_DIAMOND":"钻石不足，是否兑换钻石？","S_ASK_DEPOSIT":"馀额不足，是否前往充值？","S_EXCHANGE_DIAMOND":"兑换钻石","S_GIVE":"送出","S_GIFT_NUM_1":"一心一意","S_GIFT_NUM_10":"十全十美","S_GIFT_NUM_30":"想你","S_GIFT_NUM_66":"六六大顺","S_GIFT_NUM_188":"要抱抱","S_GIFT_NUM_520":"我爱你","S_GIFT_NUM_1314":"一生一世","S_DONATE_MSG":"%n赠送给主播%b个%c","S_GAME_ACTIVITY":"游戏活动","S_STREAM_ACTIVITY":"直播活动","S_ACTIVITY_TIME":"活动时间","S_PRIVILEGE":"特权","S_BAG":"背包","S_NO_DATA":"暂无资料","S_OPEN_GUARD_INFO":"守护主播，成为守护骑士","S_OPEN_GUARD":"开通守护","S_CONTRIBUTE_POWER":"贡献%n","S_GAME_CENTER":"游戏中心","S_HOT":"热门","S_CHESS":"棋牌","S_FISH":"捕鱼","S_ELECTRONIC":"电子","S_VIDEO":"视讯","S_LOTTERY":"彩票","S_FOLLOWED_STREAMER":"已关注主播","S_EXCHANGE":"兑换","S_CHARGE_IMMEDIATELY":"立即充值","S_SERVICE":"客服","S_DIAMOND_UNIT":"钻","S_DOLLAR":"元","S_NEED_NICKNAME_INFO":"添加时请备着昵称避免主播无法区分","S_CONNECT_SERVICE_INFO":"联系方式如有虚假可以通过客服客诉","S_STREAMER_CARD_HINT":"赠送礼物即可获取","S_ATTENTION_SUCCESS":"关注成功","S_CANCEL_ATTENTION_SUCCESS":"取消关注成功","S_NOBLE_AND_SEND_GIFT":"进行送礼可快速升级","S_HINT":"提示","S_TO_GIFT":"去送礼","S_TO_NOBLE":"开通贵族","S_CANCEL_ATTENTION":"取消关注","S_WAIT_USER":"虚位以待","S_DIAMOND_RANK":"钻石榜","S_BUBBLE_RANK":"泡泡榜","S_SURE_TO_LEAVE":"您确定要离开直播间吗？","S_CONTINUE_WATCH":"继续观看","S_ONLINE_GUARD":"在线守护","S_PLEASE_SELECT_GIFT":"请选中要赠送的礼物","S_PLEASE_SELECT_PROP":"请选择要使用的道具","S_TO_EXCHANGE":"去兑换","S_TO_DEPOSIT":"去充值","S_USE_LIMIT_DIAMOND":"使用最大值送礼","S_DONATE_FAILED":"交易失败","S_DONATE_SUCCESS":"赠礼成功","S_USEPROPS_SUCCESS":"道具使用成功","S_MONTHLY_GUARD":"月守护","S_WEEKLY_GUARD":"周守护","S_GUARD_PRIVILEGE_INFO":"为主播开通守护，畅享尊贵特权。","S_S_HEADER_FRAME":"特殊头框","S_S_GIFT":"专属礼物","S_S_INTRO":"进场特效","S_S_MUTE":"防禁言","S_FOLLOW_STREAMER":"关注主播","S_ASK_OPEN_GAURD":"消耗%n钻石成为%m","S_OPEN":"开","S_CLOSE":"关","S_BARRAGE":"弹幕","S_FAN_LIST":"粉丝人数","S_CHARGE_PER_MINUTE":"按分收费 %n钻/分","S_STREAMER_OPEN_CHARGEROOM":"主播开启了付费直播，%n钻/分","S_CHANGE_CHARGE":"主播调整收费为 %n钻/分，继续观看么","S_I_WANT_SEE":"我要看","S_ASK_INTO_CHARGEROOM":"是否付费加入？","S_PREVIEW_END":"预览时间已结束","S_PAY_DIAMOND_ENTER_ROOM":"是否支付 %n钻/分钟 进入直播?","S_CHARGE_ROOM":"付费直播","S_OK":"确定","S_PASS":"跳过","S_CHARGE_COUNT":"预览倒数%n秒","S_WATCHED_MINUTE":"已观看%n分钟","S_SYSTEM":"系统","S_ANNOUNCE":"公告","S_USER":"用户","S_HAS":"已被","S_MUTE":"禁言","S_REMUTE":"解除禁言","S_KO":"封锁","S_UNBLOCK":"解除封锁","S_BE_BLOCK":"您已被封锁","S_CHARGE_ON_TIME":"按分收费","S_PER_MINUTE_DIAMOND":"%n钻/分","S_KICK_OUT":"小姐姐温柔的把你踢出去啰><","S_SEE_U_LATER":"说话留一线 日后好相见哦","S_BACK_TO_INDEX":"回到首页","S_COMMAND_NEXT_ROOM":"为您推荐下一间","S_WIN_GAME_INFO":"恭喜会员%n中奖了","S_WIN":"中奖","S_I_UNDERSTAND":"我了解了","S_TASK":"任务","S_MEMBER_BE_GUARDIAN":"会员%n守护了主播","S_MEMBER_ATTENTION":"会员%n已关注主播","S_UNOPEN_GUARDIAN_INFO":"该主播等级未达开放此功能","S_USE":"使用","S_ONLOOKERS":"去围观","S_CANT_ATTENTION_TIP":"主播等级不足，无法关注","S_TASK_WALL":"任务墙","S_GAME_BET_INFO":"会员%n在%n玩法中，成功下注了%n元","S_FROM_NOW":"即日起","S_LEADER_BOARD_ANCHOR":"主播榜","S_LEADER_BOARD_RICHER":"土豪榜","S_LAST_WEEK":"上周","S_LAST_MONTH":"上月","S_YESTERDAY":"昨日","S_NEXT_STREAM_TIME":"下次开播","S_USER_INFO":"个人信息","S_USER_ACCOUNT":"会员帐号","S_BIRTHDAY":"生日","S_LOVE_STATUS":"感情","S_FANS_COUNT":"粉丝人数","S_ITEM":"道具","S_SEARCH":"搜寻","S_MY_STYLE":"我的风格","S_EFF":"进场特效","S_BADGE":"徽章","S_FRAME":"头像框","S_BG":"背景","S_IN_USE":"使用中","S_UN_USE":"未使用","S_LOCK":"未解锁","S_EFF_DESCRIPTION":"特效说明","S_BADGE_DESCRIPTION":"徽章说明","S_FRAME_DESCRIPTION":"头像框说明","S_BG_DESCRIPTION":"背景说明","S_TO_BUY":"去购买","S_STOP_USE":"停用","S_USED":"已使用","S_STOP_USED":"已停用","S_PROPS":"道具","S_MALL":"商城","S_RECHARGE":"充值","S_BUY":"购买","S_BUY_PROPS":"购买道具","S_BUY_EFF":"购买特效","S_TRACK_COUNT":"追踪人数","S_MY_FAVORITE":"我的最爱","S_CANCEL_FAVORITE":"取消最爱","S_CANCEL_FAVORITE_OK":"取消了最爱","S_ADD_FAVORITE":"加入最爱","S_ADD_FAVORITE_OK":"加入了最爱","S_ON_STREAM":"开播中","S_MEMINFO_LEVEL":"会员等级","S_PROMOTION_REWARD":"晋级奖励","S_ACCUMULATION_SPEND_DIAMOND":"累积消费钻石","S_MY_DIAMOND":"我的钻石","S_EXPERIENCE":"经验值","S_REMINDER":"温馨提示","S_NOW_EXCHANGE_DIAMOND":"立即换钻","S_EXCHANGE_SUCCESS":"兑换成功","S_MY_GUARD":"我的守护","S_MY_CONTRIBUTE":"我的贡献","S_ALL_EXP_EXCHANGE_DIAMOND":"将以所有经验值兑换钻石","S_BUBBLE_MONTH_SIGNIN":"%n月签泡","S_ACTIVITY_TIME_RANGE":"活动区间","S_RECEIVE":"领取","S_RECEIVED":"已领取","S_REISSUE":"补签","S_DAILY_SIGN_BUBBLE":"每日签泡","S_RECEIVE_SUCCESS":"领取成功","S_TODAY_RECEIVE_WHAT":"今天已领取%n","S_DAILY_SIGN_BUBBLE_ARTICLE":"当月全勤之玩家即可获得领取奖励，%n道具","S_REISSUE_ARTICLE":"补签失败，需从最后日期开始补签","S_MY_SENDED_PAO":"我送过的泡泡","S_LATEST":"最新","S_WEEK_LIVENESS":"本周活跃度","S_ADD_EXP":"+加%n经验值","S_ADD_LIVENESS":"+加%n活跃度","S_ONLY_STREAM_USE":"仅能于直播间使用","S_ATTENTION_FAVORITE_STREAMER":"已关注最爱的主播","S_DONT_HAVE_ATTENTION":"你还没关注任何小姊姊呢~","S_BUY_SUCCESS":"购买成功","S_SEARCH_KEYWORD":"主播ID、昵称或#标签","S_EXP":"经验值","S_USER_PORPS":"使用道具","S_FINISH":"完成","S_GO_TASK":"去任务","S_FIN_TASK_GET_RANDOM_ITEM":"完成任务即获得随机道具","S_NO_LIMIT_DATE":"无期限","S_BECOME_GUARDIAN":"成为守护","S_LEAVE_ROOM_TIP":"执行此项操作将会离开聊天室 \\n确认是否离开聊天室？","S_FOLLOW_BET":"跟投","S_MEMBER":"会员","S_PK_PAOPK":"PK10","S_LT_PAO1MLT":"1分六合彩","S_SC_PAO1MSC":"1分时时彩","S_Q3_PAOQ3":"快3","S_E5_PAOE5":"11选5","S_SICBO_PAOFSC":"鱼虾蟹","S_GUARD_SUCCESS":"成为守护","S_LIGHT_YEARS_RECOMMAND":"光年推荐","S_USE_BROADCAST":"使用大声公","S_PLZ_INPUT_CONTENT":"请输入内容","S_NO_PROPS_DATA":"空虚寂寞缺道具","S_NO_SETTING":"未设定","S_COOKIE_MSG":"cookie已被封锁，无法取得session资讯","S_GO_REGISTER":"去注册","S_GO_REGISTER_TIP":"亲～您还不是会员呢！ \\n立即注册领取300钻石","S_403_TITLE":"访问受限制","S_CUS_SERVICE_MAIL":"客服邮箱","S_STREAMER_MAIL":"主播邮箱","S_403MSG_FIRST":"尊敬的用户，由于相关法规限制，您所在的地区无法使用泡泡直播，如有任何疑问，请通过在线客服，或发邮件至","S_403MSG_SECOND":"我们将第一时间给您回复，对您造成的不便，我们深表歉意，感谢您的理解与支持！","S_NEED_HELP":"如需帮助，请","S_CONTACT_SERVICE":"联系客服","S_404_TITLE":"页面未找到","S_404MSG":"尊敬的用户，很抱歉，此页面未找到，请您联系客服为您提供解决方法，对您造成的不便，我们深表歉意，感谢您的理解与支持！","S_UPGRADE_TITLE":"网站升级中","S_UPGRADEMSG":"目前网站进行系统维护中，如有不便之处，敬请见谅。 我们很快回来!请您稍后回来继续游戏喔!","S_CHANGENAME_TIP":"请至个人页面使用","S_CONNECT_ERR":"哎呀~连线异常\\n换一间试试","S_STREAM_UPGRADE":"直播互动升级中","S_USA_TIME":"美东时间","S_CN_TIME":"北京时间","S_TO_GAME_CENTER":"前往更多游戏","S_DEPOSIT_ONCE_OPEN_DIAMOND":"只需充值一次，开通使用钻石","S_RENEWAL_GUARD":"续费守护","S_STREAMER_CLOSE":"此主播已关播","S_NO_SEARCH":"未搜索到结果","S_NO_GUARD":"目前还没有粉丝守护","S_EXIT_TO_BUY_CARD":"离开直播去购买特殊礼物卡","S_SYS_CHARGE_CLOSE_HINT":"收费房关闭提示","S_SYS_ERRORMSG":"哎呀！系统出错了","S_SWITCH_TO_POTRAIT":"请使用直屏开始浏览","S_GO_MSG":"去留言","S_GO_WATCH":"去观看","S_GO_SHARE":"去分享","S_GO_SIGN":"去签到","S_GO_ACTIVITY":"去活动","S_GO_GUARD":"去守护","S_GUARD_ARTICLE_01":"1. 什么是守护","S_GUARD_ARTICLE_02":"守护身分是代表着粉丝与主播的亲密关系，也像征着主播在直播平台的人气","S_GUARD_ARTICLE_03":"2. 守护类型","S_GUARD_ARTICLE_04":"守护分为两种类型、周守护以及月守护。有效期分别为7日、30日","S_GUARD_ARTICLE_05":"有效期为7日","S_GUARD_ARTICLE_06":"有效期30日","S_GUARD_ARTICLE_07":"3. 如何开通守护","S_GUARD_ARTICLE_08":"周守护开通:","S_GUARD_ARTICLE_09":"您可以通过消费999钻石成为主播周守护身分，999钻石将全数赠送给主播，同时您可以获得专属于守护的特权。","S_GUARD_ARTICLE_10":"月守护开通:","S_GUARD_ARTICLE_11":"您可以通过消费2999钻石成为主播周守护身分，2999钻石将全数赠送给主播，同时您可以获得专属于守护的特权。","S_GUARD_ARTICLE_12":"4. 守护特权","S_GUARD_ARTICLE_13":"开通守护后，即可在该主播直播间享受对应的守护特权，不同类型的守护身分，享受特权不同具体如下:","S_GUARD_ARTICLE_14":"周守护：","S_GUARD_ARTICLE_15":"专属徽章、周守护专属进场特效、周守护专属礼物。","S_GUARD_ARTICLE_16":"月守护：","S_GUARD_ARTICLE_17":"守护专属徽章、月守护专属进场特效、月守护专属礼物、月守护限定特殊头框、直播间防禁言。","S_GUARD_ARTICLE_18":"5. 荣耀守护","S_GUARD_ARTICLE_19":"累积为主播贡献钻石最高的守护，将成为荣耀守护，在直播间守护列表页面中榜单显示头像。即便未在直播间内也会显示。","S_GUARD_ARTICLE_20":"6.其他说明","S_GUARD_ARTICLE_21":"a、各个守护一旦开通，无法取消。","S_GUARD_ARTICLE_22":"b、每个会员可以为不同的主播开通守护，没有数量限制，主播也可以有多个守护，也没有数量的限制。","S_GUARD_ARTICLE_23":"c、为主播开通守护，您将可以获得对应的守护权限且主播可获得开通守护100%的钻石奖励。","S_GUARD_ARTICLE_24":"d、直播间内不同的守护不能累积时效。例:","S_GUARD_ARTICLE_25":"A会员于9/1开通周守护，使用效期可到9/7。如该会员于9/3开通月守护，则周守护会直接失效，月守护则由9/3计算时效至10/3。反之亦然。","S_GUARD_ARTICLE_26":"e、承上:","S_GUARD_ARTICLE_27":"不同守护时效影响仅限于同个主播的直播间，会员在不同直播间的守护则不会互相影响。","S_MALL_ARTICLE_01":"未达会员等级3，请至商城购买一日特效道具卡","S_MY_GUARD_STREAMER":"我守护的主播","S_TO_GUARD_STREAMER":"前往守护主播","S_NO_NEED_TO_SIGN_UP":"不需补签","S_NO_BARRAGE_TIP":"离开直播间去购买弹幕卡","S_DAILY_SIGN_BUBBLE_ARTICLE_EX_DM":"当月全勤之玩家即可获得领取奖励，%n","S_PULLING_TEXT":"下拉刷新","S_LOOSING_TEXT":"释放刷新","S_PLZ_CORRECT_BUYING_NUM":"输入正确的购买数量","S_CONNECT_ERROR":"哎呀~连线异常，换一间试试","S_GIFT_REPARING":"礼物准备中"}'
    );
  },
  '1c7a': function (t, e, a) {},
  '1d15': function (t, e, a) {
    t.exports = { anime: 'a23Anime_anime_3p4le', top: 'a23Anime_top_2hbig' };
  },
  '1dce': function (t, e, a) {},
  '1fb8': function (t, e, a) {},
  '1fd6': function (t, e, a) {},
  2122: function (t, e, a) {
    'use strict';
    var n = a('4b0e'),
      i = a.n(n);
    e['default'] = i.a;
  },
  2205: function (t, e, a) {
    'use strict';
    a('e623');
  },
  '234c': function (t, e, a) {
    'use strict';
    a.d(e, 'c', function () {
      return c;
    }),
      a.d(e, 'a', function () {
        return u;
      }),
      a.d(e, 'b', function () {
        return l;
      });
    a('caad'), a('2532');
    var n = a('2b27'),
      i = a.n(n),
      s = a('3aee'),
      r = window.location.protocol,
      o = r.includes('https');
    function c(t, e) {
      o ? i.a.set(t, e, null, null, null, !0, 'None') : i.a.set(t, e),
        i.a.get(t) || window.sessionStorage.setItem(t, JSON.stringify(e));
    }
    function u(t) {
      if (i.a.get(t)) return i.a.get(t);
      try {
        if (window.sessionStorage.getItem(t))
          return JSON.parse(window.sessionStorage.getItem(t));
      } catch (e) {
        throw (
          (alert(s['a'].t('S_COOKIE_MSG')), new Error(s['a'].t('S_COOKIE_MSG')))
        );
      }
      return '';
    }
    function l(t) {
      i.a.get(t) && i.a.remove(t),
        window.sessionStorage.getItem(t) && window.sessionStorage.removeItem(t);
    }
  },
  2407: function (t, e, a) {
    'use strict';
    a.d(e, 'b', function () {
      return s;
    }),
      a.d(e, 'c', function () {
        return r;
      }),
      a.d(e, 'a', function () {
        return o;
      });
    a('0d03'), a('9129'), a('a9e3');
    var n = a('b166'),
      i = a('e3ee');
    function s(t) {
      if (!t) return new Date();
      var e = new Date(t);
      return Number.isNaN(+e) ? Object(i['a'])(t) : e;
    }
    function r(t, e) {
      var a = e || 'yyyy-MM-dd HH:mm:ss';
      if (!Number(t)) return t;
      if (t) {
        var i = new Date(1e3 * t);
        return Object(n['a'])(i, a);
      }
      return t;
    }
    function o(t) {
      var e =
          arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : 'yyyy-MM-dd HH:mm:ss',
        a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 8,
        i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
        r = s(t),
        o = 6e4 * r.getTimezoneOffset(),
        c = o + 36e5 * a,
        u = r.getTime() + c;
      return Object(n['a'])(u, e, i);
    }
  },
  2442: function (t, e, a) {
    'use strict';
    var n = a('61f9'),
      i = a.n(n);
    a.d(e, 'default', function () {
      return i.a;
    });
  },
  2471: function (t, e, a) {
    'use strict';
    a.d(e, 'a', function () {
      return o;
    }),
      a.d(e, 'b', function () {
        return c;
      }),
      a.d(e, 'c', function () {
        return u;
      }),
      a.d(e, 'd', function () {
        return l;
      });
    var n = a('5530'),
      i = a('2909'),
      s = (a('99af'), a('3aee')),
      r = a('4360'),
      o = {
        callbacksCount: 1,
        callbacks: {},
        resultForCallback: function (t, e) {
          try {
            var a = o.callbacks[t];
            if (!a) return;
            a.apply(void 0, Object(i['a'])(e));
          } catch (n) {
            alert(n);
          }
        },
        call: function (t, e, a) {
          var n = a && 'function' === typeof a,
            i = n ? (o.callbacksCount += 1) : 0;
          n && (o.callbacks[i] = a);
          var s = document.createElement('IFRAME');
          s.setAttribute(
            'src',
            'js-frame:'
              .concat(t, ':0:')
              .concat(encodeURIComponent(JSON.stringify(e)))
          ),
            document.documentElement.appendChild(s),
            s.parentNode.removeChild(s),
            (s = null);
        },
        iosJsToAppMessage: function (t) {
          o.call('JsToAppMessage', [t], function () {});
        },
        androidJsToAppMessage: function (t) {
          window.MyHandler && window.MyHandler.JsToAppMessage(t);
        },
        getMobileOperatingSystem: function () {
          var t = navigator.userAgent || navigator.vendor || window.opera;
          return /android/i.test(t)
            ? 'Android'
            : /iPad|iPhone|iPod/.test(t) && !window.MSStream
            ? 'iOS'
            : 'unknown';
        },
        jsToAppMessage: function (t) {
          console.log(t);
          var e = o.getMobileOperatingSystem(),
            a = Object(n['a'])(
              Object(n['a'])({}, t),
              {},
              { from: window.location.href }
            );
          'EVENT_EXIT' === t.event && (a = t),
            window.parent.postMessage(a, '*'),
            'iOS' !== e
              ? 'Android' === e && o.androidJsToAppMessage(JSON.stringify(a))
              : o.iosJsToAppMessage(JSON.stringify(a));
        },
      },
      c = function (t) {
        0 !== r['a'].state.chatroom.chargeRoomState
          ? r['a'].dispatch('actionSetTipMsgInfo', {
              title: s['a'].t('S_HINT'),
              content: s['a'].t('S_LEAVE_ROOM_TIP'),
              cancelFunc: function () {
                return r['a'].dispatch('actionSetTipMsgInfo', null);
              },
              confirmFunc: function () {
                r['a'].dispatch('actionSetTipMsgInfo', null),
                  o.jsToAppMessage({ event: 'EVENT_REDIRECT_PAGE', data: t });
              },
            })
          : o.jsToAppMessage({ event: 'EVENT_REDIRECT_PAGE', data: t });
      },
      u = function (t) {
        o.jsToAppMessage({ event: 'EVENT_REDIRECT_PAGE', data: t });
      },
      l = function (t) {
        o.jsToAppMessage({
          event: 'EVENT_REDIRECT_PAGE',
          data: 'streamRoom',
          roomId: t,
        });
      };
  },
  '257b': function (t, e, a) {},
  2631: function (t, e, a) {
    'use strict';
    var n = a('d175'),
      i = a('2122'),
      s = a('2877'),
      r = Object(s['a'])(i['default'], n['a'], n['b'], !1, null, null, null);
    e['default'] = r.exports;
  },
  '27d7': function (t, e, a) {},
  '293f': function (t, e, a) {
    'use strict';
    a('70a9');
  },
  '2a65': function (t, e, a) {
    'use strict';
    a('ae3a');
  },
  '2ae7': function (t, e, a) {},
  '2ba1': function (t, e, a) {
    t.exports = {
      'video-wrap': 'WFPlayer_video-wrap_1GBhs',
      loading: 'WFPlayer_loading_OiMWz',
      'canvas-wrap': 'WFPlayer_canvas-wrap_1IFfu',
      'chatroom-loading-bg': 'WFPlayer_chatroom-loading-bg_Rsiv7',
    };
  },
  '2bcb': function (t, e, a) {
    'use strict';
    a('1dce');
  },
  '2c76': function (t, e, a) {},
  '2f66': function (t, e, a) {
    'use strict';
    a('1c7a');
  },
  '30b58': function (t, e, a) {},
  '30c3': function (t, e, a) {},
  '30c6': function (t, e, a) {
    'use strict';
    a('5068');
  },
  '33d3': function (t, e, a) {
    'use strict';
    a('a9fc');
  },
  '343d': function (t, e, a) {},
  '38fa': function (t, e, a) {},
  '3a80': function (t, e, a) {
    'use strict';
    a('d522');
  },
  '3aee': function (t, e, a) {
    'use strict';
    var n = a('2b0e'),
      i = a('a925'),
      s = a('0e18'),
      r = a('1b034');
    n['default'].use(i['a']);
    var o = 'cn',
      c = { tw: s, cn: r },
      u = new i['a']({ locale: o, messages: c, silentTranslationWarn: !0 });
    e['a'] = u;
  },
  '3b32': function (t, e, a) {},
  '3bf0': function (t, e, a) {
    'use strict';
    a('6fbd');
  },
  '3e23': function (t, e, a) {
    'use strict';
    a('072a');
  },
  4285: function (t, e, a) {
    'use strict';
    a('4313');
  },
  4313: function (t, e, a) {},
  4360: function (t, e, a) {
    'use strict';
    var n = {};
    a.r(n),
      a.d(n, 'actionGetGameResults', function () {
        return N;
      }),
      a.d(n, 'actionSetCloseTimestamp', function () {
        return k;
      }),
      a.d(n, 'actionSwitchGame', function () {
        return P;
      }),
      a.d(n, 'actionSetFollowBet', function () {
        return M;
      }),
      a.d(n, 'actionGameList', function () {
        return D;
      }),
      a.d(n, 'actionSetGameName', function () {
        return j;
      }),
      a.d(n, 'actionSetGameUrls', function () {
        return G;
      }),
      a.d(n, 'actionSetGameToken', function () {
        return $;
      }),
      a.d(n, 'actionSetTokenInterval', function () {
        return U;
      }),
      a.d(n, 'actionSetTrialOption', function () {
        return x;
      });
    var i = {};
    a.r(i),
      a.d(i, 'getGameResults', function () {
        return F;
      }),
      a.d(i, 'getGameSwitch', function () {
        return H;
      }),
      a.d(i, 'getFollowBet', function () {
        return B;
      }),
      a.d(i, 'getGameList', function () {
        return W;
      }),
      a.d(i, 'getCloseTimestamp', function () {
        return V;
      }),
      a.d(i, 'getGameName', function () {
        return Y;
      }),
      a.d(i, 'getGameUrls', function () {
        return K;
      }),
      a.d(i, 'getGameToken', function () {
        return X;
      }),
      a.d(i, 'getTrialOption', function () {
        return q;
      });
    var s = {};
    a.r(s),
      a.d(s, 'actionSetGiftList', function () {
        return tt;
      }),
      a.d(s, 'actionGetDiamond', function () {
        return et;
      }),
      a.d(s, 'actionDonate', function () {
        return at;
      }),
      a.d(s, 'actionSetDonateAnime', function () {
        return nt;
      }),
      a.d(s, 'actionGetMyBags', function () {
        return it;
      }),
      a.d(s, 'actionUseProps', function () {
        return st;
      });
    var r = a('2b0e'),
      o = a('2f62'),
      c = {
        user: null,
        initialized: !1,
        programList: [],
        lightYearList: [],
        streamerList: [],
        attentionStreamerList: [],
        attentionProgramList: [],
        searchProgramList: [],
        hintInfo: null,
        wholePageType: null,
        wholePageOptions: {},
        timezone: 'Asia/Shanghai',
        tipMsgInfo: null,
        activitiesList: [],
        activityUrl: null,
        webInfo: null,
        showPlayBtn: !1,
        showVideo: !0,
        isLaunch: !1,
        cdnDomain: '',
        wsCdnDomain: '',
      },
      u = (a('d81d'), a('4de4'), a('ebf7')),
      l = {
        getInitialized: function (t) {
          return t.initialized;
        },
        getDefaultUserImg: function () {
          return 'this.src="/images/material/img_login@2x.png"';
        },
        getProgramList: function (t) {
          return Object(u['e'])(t.programList);
        },
        getLightYearList: function (t) {
          return Object(u['e'])(t.lightYearList);
        },
        getAttentionProgramList: function (t) {
          return Object(u['e'])(t.attentionProgramList);
        },
        getSearchProgramList: function (t) {
          return Object(u['e'])(t.searchProgramList);
        },
        getStreamerList: function (t) {
          var e = t.streamerList.map(function (t) {
            return {
              streamerId: t.streamer_id,
              account: t.account,
              nickname: t.nickname,
              headphoto: t.headphoto,
              heat: t.heat,
            };
          });
          return e;
        },
        getUserAttentionStreamer: function (t) {
          return t.attentionStreamerList;
        },
        getUserIsAttentionStreamer: function (t, e, a) {
          var n = a.chatroom.currentRoom,
            i = t.attentionStreamerList.filter(function (t) {
              return t === n.streamerId;
            });
          return !!i.length;
        },
        getHintInfo: function (t) {
          return t.hintInfo;
        },
        getWholePageType: function (t) {
          return t.wholePageType;
        },
        getWholePageOptions: function (t) {
          return t.wholePageOptions;
        },
        getUserInfo: function (t) {
          return t.user;
        },
        getTipMsgInfo: function (t) {
          return t.tipMsgInfo;
        },
        getActivitiesList: function (t) {
          return t.activitiesList;
        },
        getActivityUrl: function (t) {
          return t.activityUrl;
        },
        getWebInfo: function (t) {
          return t.webInfo;
        },
        getIsGuest: function (t) {
          return 0 === t.user.user_id;
        },
        getIsLaunch: function (t) {
          return t.isLaunch;
        },
        getCdnDomain: function (t) {
          return t.cdnDomain;
        },
        getWsCdnDomain: function (t) {
          return t.wsCdnDomain;
        },
      },
      d = (a('99af'), a('93ee')),
      m = a('2471'),
      _ = a('234c'),
      h = a('b4a9'),
      f = a('3aee'),
      p = {
        actionSetUser: function (t, e) {
          var a = t.commit;
          a('SET_USER', e);
        },
        actionFetchUser: function (t, e) {
          var a = t.commit,
            n = t.dispatch;
          return Object(d['m'])(e).then(function (t) {
            var e = t.data;
            return '0' !== e.error_code && e.error_text
              ? (n('actionSetHintInfo', e.error_text),
                Object(_['b'])('session'),
                m['a'].jsToAppMessage({
                  event: 'EVENT_THIRDPARTY_LOGIN',
                  data: e,
                }),
                e)
              : (Object(_['c'])('session', e.result.session),
                a('SET_USER', e.result),
                a('SET_INITIALIZED'),
                e);
          });
        },
        actionGetProgram: function (t) {
          var e = t.commit;
          return Object(d['i'])()
            .then(function (t) {
              var a = t.data;
              '0' === a.error_code &&
                (e('SET_PROGRAM', a.result.stream_list),
                e('SET_LIFEYEAR_LIST', a.result.lightyear_list));
            })
            ['catch'](function (t) {
              return Object(h['b'])(t), t.response;
            });
        },
        actionGetAttentionProgram: function (t) {
          var e = t.state,
            a = t.commit,
            n = { group_id: 0, userid: e.user.lott_id };
          return Object(d['d'])(n)
            .then(function (t) {
              var e = t.data;
              '0' === e.error_code &&
                (a('SET_ATTENTION_PROGRAM', e.result.attention),
                a('SET_PROGRAM', e.result.all));
            })
            ['catch'](function (t) {
              return Object(h['b'])(t), t.response;
            });
        },
        actionGetSearchProgramList: function (t) {
          var e = t.state,
            a = t.commit,
            n = { group_id: 0, userid: e.user.lott_id };
          return Object(d['d'])(n)
            .then(function (t) {
              var e = t.data;
              '0' === e.error_code && a('SET_SEARCH_PROGRAM', e.result.all);
            })
            ['catch'](function (t) {
              return Object(h['b'])(t), t.response;
            });
        },
        actionGetAttentionStreamer: function (t, e) {
          var a = t.commit;
          Object(d['e'])(e).then(function (t) {
            a('SET_ATTENTION_STREAMERLIST', t.data);
          });
        },
        actionAttentionStreamer: function (t, e) {
          var a = t.dispatch,
            n = t.state;
          Object(d['a'])(e)
            .then(function (t) {
              var i = t.data;
              if ('0' === i.error_code) {
                a('actionGetAttentionStreamer', n.user.lott_id);
                var s =
                  0 === i.result.incr_points
                    ? ''.concat(f['a'].t('S_ATTENTION_SUCCESS'))
                    : ''
                        .concat(f['a'].t('S_ATTENTION_SUCCESS'), '，')
                        .concat(f['a'].t('S_EXP'), '+')
                        .concat(i.result.incr_points);
                return (
                  m['a'].jsToAppMessage({
                    event: 'EVENT_ATTENTION',
                    data: { id: e.streamer_id, attention: !0 },
                  }),
                  void a('actionSetHintInfo', s)
                );
              }
              a('actionSetHintInfo', i.error_text);
            })
            ['catch'](function (t) {
              return Object(h['b'])(t), t.response;
            });
        },
        actionCancelAttentionStreamer: function (t, e) {
          var a = t.dispatch,
            n = t.state;
          return Object(d['b'])(e)
            .then(function (t) {
              var i = t.data;
              return (
                '0' === i.error_code &&
                  (a(
                    'actionSetHintInfo',
                    f['a'].t('S_CANCEL_ATTENTION_SUCCESS')
                  ),
                  a('actionGetAttentionStreamer', n.user.lott_id),
                  m['a'].jsToAppMessage({
                    event: 'EVENT_ATTENTION',
                    data: { id: e.streamer_id, attention: !1 },
                  })),
                i
              );
            })
            ['catch'](function (t) {
              return Object(h['b'])(t), t.response;
            });
        },
        actionSetHintInfo: function (t, e) {
          var a = t.commit;
          a('SET_HINT_INFO', e);
        },
        actionSetWholePageType: function (t, e) {
          var a = t.commit;
          a('SET_WHOLE_PAGE_TYPE', e);
        },
        actionSetWholePageOptions: function (t, e) {
          var a = t.commit;
          a('SET_WHOLE_PAGE_OPTIONS', e);
        },
        actionSetTipMsgInfo: function (t, e) {
          var a = t.commit;
          a('SET_TIPMSG_INFO', e);
        },
        actionGetActivitiesList: function (t) {
          var e = t.commit;
          return Object(d['c'])()
            .then(function (t) {
              var a = t.data;
              e('SET_ACTIVITIES_LIST', a.result);
            })
            ['catch'](function (t) {
              return Object(h['b'])(t), t.response;
            });
        },
        actionSetActivityUrl: function (t, e) {
          var a = t.commit;
          a('SET_ACTIVITY_URL', e);
        },
        actionWebInfo: function (t, e) {
          var a = t.commit;
          a('SET_WEB_INFO', e);
        },
        actionShowPlayBtn: function (t, e) {
          var a = t.commit;
          a('SET_PLAY_BTN', e);
        },
        actionShowVideo: function (t, e) {
          var a = t.commit;
          a('SET_SHOW_VIDEO', e);
        },
        actionSetIsLaunch: function (t, e) {
          var a = t.commit;
          a('SET_IS_LAUNCH', e);
        },
        actionCdnDomain: function (t, e) {
          var a = t.commit;
          a('SET_CDN_DOMAIN', e);
        },
        actionWsCdnDomain: function (t, e) {
          var a = t.commit;
          a('SET_WS_CDN_DOMAIN', e);
        },
      },
      g = {
        SET_USER: function (t, e) {
          t.user = e;
        },
        SET_INITIALIZED: function (t) {
          t.initialized = !0;
        },
        SET_PROGRAM: function (t, e) {
          t.programList = e || [];
        },
        SET_LIFEYEAR_LIST: function (t, e) {
          t.lightYearList = e || [];
        },
        SET_ATTENTION_PROGRAM: function (t, e) {
          t.attentionProgramList = e || [];
        },
        SET_SEARCH_PROGRAM: function (t, e) {
          t.searchProgramList = e || [];
        },
        SET_STREAMERLIST: function (t, e) {
          t.streamerList = e ? e.result : [];
        },
        SET_ATTENTION_STREAMERLIST: function (t, e) {
          '0' === e.error_code && e.result
            ? (t.attentionStreamerList = e.result)
            : (t.attentionStreamerList = []);
        },
        SET_HINT_INFO: function (t, e) {
          t.hintInfo = e;
        },
        SET_WHOLE_PAGE_TYPE: function (t, e) {
          (t.wholePageType = e), e || (t.wholePageOptions = {});
        },
        SET_WHOLE_PAGE_OPTIONS: function (t, e) {
          t.wholePageOptions = e;
        },
        SET_TIPMSG_INFO: function (t, e) {
          t.tipMsgInfo = e;
        },
        SET_ACTIVITIES_LIST: function (t, e) {
          t.activitiesList = e || [];
        },
        SET_ACTIVITY_URL: function (t, e) {
          t.activityUrl = e;
        },
        SET_WEB_INFO: function (t, e) {
          t.webInfo = e;
        },
        SET_PLAY_BTN: function (t, e) {
          t.showPlayBtn = e;
        },
        SET_SHOW_VIDEO: function (t, e) {
          t.showVideo = e;
        },
        SET_IP: function (t, e) {
          t.ip = e;
        },
        SET_IS_LAUNCH: function (t, e) {
          t.isLaunch = e;
        },
        SET_CDN_DOMAIN: function (t, e) {
          t.cdnDomain = e;
        },
        SET_WS_CDN_DOMAIN: function (t, e) {
          t.wsCdnDomain = e;
        },
      },
      S = {
        wsOn: !1,
        swipeDirection: '',
        chatMsg: [],
        roomCount: { guardSum: 0, contributeSum: 0, roomCount: 0 },
        index: -1,
        chargeRoomState: 0,
        chatUser: null,
        userConnectInfo: null,
        currentRoom: null,
        showRoomInfo: !0,
        chatroomModalType: null,
        chatroomModalOptions: {},
        streamerCard: '',
        guardianList: [],
        userInfo: null,
        fansList: [],
        showStreamerGiftPage: !1,
        contributeList: null,
        currentroomStatus: 0,
        showGesture: !0,
        broadcast: [],
        enterVip: null,
        enterUser: null,
        enterGuard: null,
        currentRoomKO: !1,
        barrageList: [],
        userTrackList: [],
        isClearScreen: !1,
        isSysCharge: 1,
        chargeRoomStop: 0,
        reConnect: 0,
      },
      v = a('0568'),
      b = {
        actionSetCurrentRoom: function (t, e) {
          var a = t.commit,
            n = t.dispatch;
          e && n('actionSetCurrentRoomStatus', e.status),
            a('SET_CURRENT_ROOM', e);
        },
        actionSetRoomIndex: function (t, e) {
          var a = t.commit;
          a('SET_ROOM_INDEX', e);
        },
        actionSetRoomIsCharge: function (t, e) {
          var a = t.commit;
          a('SET_ROOM_IS_CHARGE', e);
        },
        actionStopChargeRoom: function (t, e) {
          var a = t.commit;
          a('SET_CHARGEROOM_STOP', e);
        },
        actionSetSocketOn: function (t, e) {
          var a = t.commit;
          a('SET_WEBSOCKETON', e);
        },
        actionSetChatMsg: function (t, e) {
          var a = t.commit;
          a('SET_CHATMSG', e);
        },
        actionSetRoomCount: function (t, e) {
          var a = t.commit;
          a('SET_ROOMCOUNT', e);
        },
        actionSetChatUser: function (t, e) {
          var a = t.commit;
          a('SET_CHATUSER', e);
        },
        actionGetUserConnect: function (t, e) {
          var a = t.commit;
          return Object(v['i'])(e).then(function (t) {
            var e = t.data;
            return a('SET_USERCONNECT', e.result || null), e;
          });
        },
        actionSetUserConnect: function (t, e) {
          var a = t.commit;
          a('SET_USERCONNECT', e);
        },
        actionSetShowRoomInfo: function (t, e) {
          var a = t.commit;
          a('SET_SHOWROOMINFO', e);
        },
        actionSetChatroomModalType: function (t, e) {
          var a = t.commit;
          a('SET_CHATROOM_MODALTYPE', e);
        },
        actionSetChatroomModalOptions: function (t, e) {
          var a = t.commit;
          a('SET_CHATROOM_MODAL_OPTIONS', e);
        },
        actionGetStreamerCard: function (t, e) {
          var a = t.commit;
          Object(v['g'])(e).then(function (t) {
            a('SET_STREAMERCARD', t.data);
          });
        },
        actionGetGuardians: function (t, e) {
          var a = t.commit;
          Object(v['d'])(e)
            .then(function (t) {
              var e = t.data;
              if ('0' === e.error_code) {
                var n = e.result
                  ? e.result.list.map(function (t) {
                      return {
                        id: t.id,
                        name: t.alias,
                        headphoto: t.head_photo,
                        level: t.level,
                        contribute: t.contribute_diamond,
                        badges: t.badges,
                        frame: t.frame,
                        identityId: t.identity_id,
                      };
                    })
                  : [];
                a('SET_GUARDIANS', n);
              }
            })
            ['catch'](function (t) {
              Object(h['b'])(t);
            });
        },
        actionGetUserInfo: function (t, e) {
          var a = t.dispatch;
          return Object(v['j'])(e.id, { role: e.role }).then(function (t) {
            var e = t.data;
            '0' !== e.error_code
              ? a('actionSetUserInfo', null)
              : a('actionSetUserInfo', e.result);
          });
        },
        actionSetUserInfo: function (t, e) {
          var a = t.commit;
          a('SET_USERINFO', e);
        },
        actionGetFansList: function (t, e) {
          var a = t.commit;
          return Object(v['c'])(e, { is_streamer: 0 })
            .then(function (t) {
              var e = t.data;
              if ('0' === e.error_code) {
                var n = e.result.map(function (t) {
                  return {
                    id: t.user_id,
                    name: t.alias,
                    headphoto: t.head_photo,
                    level: t.level,
                    gender: t.gender,
                    identityId: t.role,
                  };
                });
                a('SETFANSLIST', n);
              }
              return e;
            })
            ['catch'](function (t) {
              Object(h['b'])(t);
            });
        },
        actionSetFanList: function (t, e) {
          var a = t.commit;
          a('SETFANSLIST', e);
        },
        actionGetUserTrack: function (t, e) {
          var a = t.commit;
          return Object(v['f'])(e)
            .then(function (t) {
              var e = t.data;
              if ('0' === e.error_code) {
                var n = e.result.map(function (t) {
                  return {
                    id: t.streamer_id,
                    name: t.alias,
                    headphoto: t.head_photo,
                    frame: t.frame,
                  };
                });
                a('SET_USER_TRACK', n);
              }
              return e;
            })
            ['catch'](function (t) {
              Object(h['b'])(t);
            });
        },
        actionToggleStreamerGiftPage: function (t, e) {
          var a = t.commit;
          a('SETSTEAMERGIFTPAGE', e);
        },
        actionGetContribute: function (t, e) {
          var a = t.commit;
          Object(v['b'])(e).then(function (t) {
            a('SET_CONTRIBUTE_LIST', t.data);
          });
        },
        actionSetCurrentRoomStatus: function (t, e) {
          var a = t.commit;
          a('SET_CURRENTROOM_STATUS', e);
        },
        actionBecomeGuardian: function (t, e) {
          var a = t.dispatch;
          Object(v['k'])(e).then(function (t) {
            var e = t.data;
            '0' === e.error_code
              ? (a('actionSetChatroomModalType', null),
                a('actionSetHintInfo', f['a'].t('S_GUARD_SUCCESS'), {
                  root: !0,
                }))
              : a('actionSetHintInfo', e.error_text, { root: !0 });
          });
        },
        actionSetShowGesture: function (t, e) {
          var a = t.commit;
          a('SET_SHOW_Gesture', e);
        },
        actionSetBarrage: function (t, e) {
          var a = t.commit;
          a('SET_BARRAGE', e);
        },
        actionSetBroadcast: function (t, e) {
          var a = t.commit;
          a('SET_BROADCAST', e);
        },
        actionSetEnterList: function (t, e) {
          var a = t.commit;
          a('SET_ENTERLIST', e);
        },
        actionSetVipEnterList: function (t, e) {
          var a = t.commit;
          a('SET_VIPENTERLIST', e);
        },
        actionSetGuardEnter: function (t, e) {
          var a = t.commit;
          a('SET_GUARD_ENTER', e);
        },
        actionSetCurrentRoomKo: function (t, e) {
          var a = t.commit;
          a('SET_CURRENT_ROOM_KO', e);
        },
        actionSetSwipeDirection: function (t, e) {
          var a = t.commit;
          a('SET_SWIPE_DIRECTION', e);
        },
        actionSetClearScreen: function (t) {
          var e = t.commit,
            a = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
          e('SET_CLEAR_SCREEN', a);
        },
        actionSetSysCharge: function (t, e) {
          var a = t.commit;
          a('SET_SYS_CHARGE', e);
        },
        actionSetReConnect: function (t, e) {
          var a = t.commit;
          a('SET_RECONNECT', e);
        },
      },
      C = a('5530'),
      O = a('ade3'),
      T =
        (a('4160'),
        a('159b'),
        a('b64b'),
        a('13d5'),
        a('277d'),
        {
          getWsUrl: function (t) {
            return t.userConnectInfo ? t.userConnectInfo.chatroom : '';
          },
          getStreamUrl: function (t) {
            return t.userConnectInfo
              ? { mode: t.userConnectInfo.mode, rtcurl: t.userConnectInfo.rtc }
              : null;
          },
          getStreamCharge: function (t) {
            var e = t.userConnectInfo;
            if (e) {
              var a = { charge: e.charge, leaveSecond: e.leave_second };
              return a;
            }
            return { charge: 0, leaveSecond: 0 };
          },
          getStreamState: function (t) {
            return t.userConnectInfo.status;
          },
          getCdnDomain: function (t) {
            return t.userConnectInfo ? t.userConnectInfo.cdn_domain : null;
          },
          getChatUser: function (t) {
            return t.chatUser ? t.chatUser : null;
          },
          getChatMsg: function (t) {
            return t.chatMsg ? t.chatMsg : '';
          },
          getGuardianList: function (t) {
            return t.guardianList;
          },
          getChatroomModalType: function (t) {
            return t.chatroomModalType;
          },
          getChatroomModalOptions: function (t) {
            return t.chatroomModalOptions;
          },
          getUserInfo: function (t) {
            if (t.userInfo) {
              var e = t.userInfo,
                a = {
                  nickname: e.alias,
                  birth: e.birth,
                  headphoto: e.head_photo,
                  hometown: e.hometown,
                  id: e.id,
                  intro: e.intro,
                  level: e.level,
                  loginDays: e.login_days,
                  profession: e.profession,
                  relationship: e.relationship,
                  account: e.username,
                  frame: e.frame,
                  badges: e.badges,
                  trackNum: e.track_total,
                  paoTotal: e.pao_total,
                  propNum: e.prop_num,
                };
              return a;
            }
            return t.userInfo;
          },
          getFansList: function (t) {
            return t.fansList;
          },
          getContributeList: function (t) {
            if (t.contributeList) {
              var e = {};
              return (
                Object.keys(t.contributeList).forEach(function (a) {
                  var n = t.contributeList[a];
                  e[a] = Object.keys(n).reduce(function (t, e) {
                    if (Array.isArray(n[e])) {
                      var i = n[e].map(function (t) {
                        var e;
                        return (
                          (e = { id: t.user_id, alias: t.alias }),
                          Object(O['a'])(e, a, t.amount),
                          Object(O['a'])(e, 'gkType', t.gk_type),
                          Object(O['a'])(e, 'head_photo', t.head_photo),
                          Object(O['a'])(e, 'level', t.level),
                          Object(O['a'])(e, 'badges', t.badges),
                          Object(O['a'])(e, 'frame', t.frame),
                          Object(O['a'])(e, 'identityId', t.identity_id),
                          e
                        );
                      });
                      return Object(C['a'])(
                        Object(C['a'])({}, t),
                        {},
                        Object(O['a'])({}, e, i)
                      );
                    }
                    return Object(C['a'])(
                      Object(C['a'])({}, t),
                      {},
                      Object(O['a'])({}, e, n[e])
                    );
                  }, {});
                }),
                e
              );
            }
            return t.contributeList;
          },
          getBroadcasts: function (t) {
            return t.broadcast;
          },
          getSwipeDirection: function (t) {
            return t.swipeDirection;
          },
          getUserTrackList: function (t) {
            return t.userTrackList;
          },
          getGuardEnter: function (t) {
            return t.enterGuard;
          },
          getIsClearScreen: function (t) {
            return t.isClearScreen;
          },
          getReConnectCount: function (t) {
            return t.reConnect;
          },
          getVipEnter: function (t) {
            return t.enterVip;
          },
          getUserEnter: function (t) {
            return t.enterUser;
          },
        }),
      E = a('2909'),
      I = {
        SET_CURRENT_ROOM: function (t, e) {
          t.currentRoom = e;
        },
        SET_ROOM_INDEX: function (t, e) {
          t.index = e;
        },
        SET_ROOM_IS_CHARGE: function (t, e) {
          t.chargeRoomState = e;
        },
        SET_CHARGEROOM_STOP: function (t, e) {
          t.chargeRoomStop = e;
        },
        SET_CHATUSER: function (t, e) {
          t.chatUser = e;
        },
        SET_USERCONNECT: function (t, e) {
          t.userConnectInfo = e || null;
        },
        SET_WEBSOCKETON: function (t, e) {
          t.wsOn = e;
        },
        SET_CHATMSG: function (t, e) {
          t.chatMsg = e
            ? [].concat(Object(E['a'])(t.chatMsg), [
                Object(C['a'])(
                  Object(C['a'])({}, e.body),
                  {},
                  { time: e.time }
                ),
              ])
            : [];
        },
        SET_ROOMCOUNT: function (t, e) {
          t.roomCount = Object(C['a'])(Object(C['a'])({}, t.roomCount), e);
        },
        SET_SHOWROOMINFO: function (t, e) {
          t.showRoomInfo = e;
        },
        SET_CHATROOM_MODALTYPE: function (t, e) {
          (t.chatroomModalType = e), e || (t.chatroomModalOptions = {});
        },
        SET_CHATROOM_MODAL_OPTIONS: function (t, e) {
          t.chatroomModalOptions = e;
        },
        SET_STREAMERCARD: function (t, e) {
          '0' !== e.error_code
            ? (t.streamerCard = 'empty')
            : (t.streamerCard = e.result);
        },
        SET_GUARDIANS: function (t, e) {
          t.guardianList = e;
        },
        SET_USER_TRACK: function (t, e) {
          t.userTrackList = e;
        },
        SET_USERINFO: function (t, e) {
          t.userInfo = e;
        },
        SETFANSLIST: function (t, e) {
          t.fansList = e;
        },
        SETSTEAMERGIFTPAGE: function (t, e) {
          t.showStreamerGiftPage = e;
        },
        SET_CONTRIBUTE_LIST: function (t, e) {
          '0' !== e.error_code
            ? (t.contributeList = null)
            : (t.contributeList = e.result);
        },
        SET_CURRENTROOM_STATUS: function (t, e) {
          t.currentroomStatus = e;
        },
        SET_SHOW_Gesture: function (t, e) {
          t.showGesture = e;
        },
        SET_BROADCAST: function (t, e) {
          e ? t.broadcast.push(e) : t.broadcast.shift();
        },
        SET_ENTERLIST: function (t, e) {
          t.enterUser = e;
        },
        SET_VIPENTERLIST: function (t, e) {
          t.enterVip = e;
        },
        SET_GUARD_ENTER: function (t, e) {
          t.enterGuard = e;
        },
        SET_CURRENT_ROOM_KO: function (t, e) {
          t.currentRoomKO = e;
        },
        SET_SWIPE_DIRECTION: function (t, e) {
          t.swipeDirection = e;
        },
        SET_BARRAGE: function (t, e) {
          if (e) {
            if ('clear' === e) return void (t.barrageList = []);
            t.barrageList.push(e);
          } else t.barrageList.shift();
        },
        SET_CLEAR_SCREEN: function (t, e) {
          t.isClearScreen = e;
        },
        SET_SYS_CHARGE: function (t, e) {
          t.isSysCharge = e;
        },
        SET_RECONNECT: function (t, e) {
          t.reConnect = e;
        },
      },
      A = { namespaced: !0, state: S, actions: b, mutations: I, getters: T },
      y = {
        gameSwitch: !1,
        gameResults: null,
        closeTimestamp: 0,
        followBet: 0,
        gameList: null,
        gameName: '',
        gameUrls: {},
        gameToken: null,
        tokenInterval: null,
        trialOption: null,
      },
      w = a('a3be'),
      R = a('8f6a'),
      L = function () {
        return Object(R['a'])('get', w['s']);
      },
      N = function (t, e) {
        var a = t.commit;
        a('SET_GAME_RESULTS', e);
      },
      k = function (t, e) {
        var a = t.commit;
        a('SET_CLOSE_TIMESTAMP', e);
      },
      P = function (t, e) {
        var a = t.commit;
        a('SWITCH_GAME', e);
      },
      M = function (t, e) {
        var a = t.commit;
        a('SET_FOLLOW_BET', e);
      },
      D = function (t) {
        var e = t.commit;
        L().then(function (t) {
          var a = t.data;
          '0' === a.error_code && e('SET_GAME_LIST', a.result);
        });
      },
      j = function (t, e) {
        var a = t.commit;
        a('SET_GAME_NAME', e);
      },
      G = function (t, e) {
        var a = t.commit;
        a('SET_GAME_URLS', e);
      },
      $ = function (t, e) {
        var a = t.commit;
        a('SET_GAME_TOKEN', e);
      },
      U = function (t, e) {
        var a = t.commit;
        a('SET_TOKEN_INTERVAL', e);
      },
      x = function (t, e) {
        var a = t.commit;
        a('SET_TRIAL_OPTION', e);
      },
      F = function (t) {
        if (t.gameResults) {
          var e = t.gameResults,
            a = JSON.parse(e.result_display),
            n = Object(C['a'])(
              Object(C['a'])({}, e),
              {},
              { result_display: [] }
            );
          return (
            Object.keys(a).forEach(function (t, e) {
              t === String(e + 1)
                ? (n.result_display = [].concat(
                    Object(E['a'])(n.result_display),
                    [a[t]]
                  ))
                : (n[t] = a[t]);
            }),
            n
          );
        }
        return null;
      },
      H = function (t) {
        return t.gameSwitch;
      },
      B = function (t) {
        return t.followBet;
      },
      W = function (t) {
        return t.gameList;
      },
      V = function (t) {
        return t.closeTimestamp;
      },
      Y = function (t) {
        return t.gameName;
      },
      K = function (t) {
        return t.gameUrls;
      },
      X = function (t) {
        return t.gameToken;
      },
      q = function (t) {
        return t.trialOption;
      },
      z = {
        SET_GAME_RESULTS: function (t, e) {
          t.gameResults = e;
        },
        SET_CLOSE_TIMESTAMP: function (t, e) {
          t.closeTimestamp = e;
        },
        SWITCH_GAME: function (t, e) {
          t.gameSwitch = e;
        },
        SET_FOLLOW_BET: function (t, e) {
          t.followBet = e;
        },
        SET_GAME_LIST: function (t, e) {
          t.gameList = e;
        },
        SET_GAME_NAME: function (t, e) {
          t.gameName = e;
        },
        SET_GAME_URLS: function (t, e) {
          t.gameUrls = Object(C['a'])(Object(C['a'])({}, t.gameUrls), e);
        },
        SET_GAME_TOKEN: function (t, e) {
          t.gameToken = e;
        },
        SET_TOKEN_INTERVAL: function (t, e) {
          if ('clear' === e)
            return (
              clearInterval(t.tokenInterval), void (t.tokenInterval = null)
            );
          t.tokenInterval = e;
        },
        SET_TRIAL_OPTION: function (t, e) {
          t.trialOption = e;
        },
      },
      Q = { namespaced: !0, state: y, actions: n, mutations: z, getters: i },
      J = {
        giftList: [],
        userDiamond: 0,
        userCoin: 0,
        donateAnime: null,
        myBags: [],
      },
      Z = a('624c'),
      tt = function (t) {
        var e = t.commit;
        return Object(Z['d'])()
          .then(function (t) {
            var a = t.data;
            if ('0' === a.error_code) {
              var n = a.result.reduce(function (t, e) {
                var a = e.data.map(function (t) {
                    return {
                      name: t.gift_name,
                      src: t.thumbnail,
                      id: t.id,
                      status: t.status,
                      price: t.amount,
                    };
                  }),
                  n = {
                    category: e.category,
                    categoryId: e.category_id,
                    list: a,
                  };
                return Object(C['a'])(
                  Object(C['a'])({}, t),
                  {},
                  Object(O['a'])({}, e.category_id, n)
                );
              }, {});
              e('SET_GIFTLIST', n);
            }
          })
          ['catch'](function (t) {
            Object(h['b'])(t);
          });
      },
      et = function (t) {
        var e = t.commit;
        return Object(Z['c'])().then(function (t) {
          e('SET_DIAMOND', t.data);
        });
      },
      at = function (t, e) {
        var a = t.commit;
        return Object(Z['b'])(e).then(function (t) {
          var e = t.data;
          return '0' === e.error_code && a('SET_DIAMOND', e), e;
        });
      },
      nt = function (t, e) {
        var a = t.commit;
        a('SET_DONATE_ANIME', e);
      },
      it = function (t) {
        var e = t.commit;
        Object(Z['e'])().then(function (t) {
          var a = t.data;
          '0' === a.error_code && e('SET_MY_BAGS', a.result);
        });
      },
      st = function (t) {
        var e = t.dispatch;
        return Object(Z['f'])().then(function (t) {
          var a = t.data;
          return '0' === a.error_code && e('actionGetMyBags'), a;
        });
      },
      rt =
        (a('ac1f'),
        a('5319'),
        a('b0c0'),
        {
          getGiftList: function (t) {
            return t.giftList;
          },
          getMyBagList: function (t) {
            return t.myBags.map(function (t) {
              return Object(C['a'])(
                Object(C['a'])({}, t),
                {},
                { name: t.name.replace('/n', '') }
              );
            });
          },
          getDonateAnime: function (t) {
            return t.donateAnime;
          },
        }),
      ot = {
        SET_GIFTLIST: function (t, e) {
          t.giftList = e;
        },
        SET_DIAMOND: function (t, e) {
          '0' === e.error_code && e.result
            ? (t.userDiamond = e.result.diamond)
            : (t.userDiamond = 0);
        },
        SET_DONATE_ANIME: function (t, e) {
          t.donateAnime = e;
        },
        SET_MY_BAGS: function (t, e) {
          t.myBags = e;
        },
      },
      ct = { namespaced: !0, state: J, actions: s, mutations: ot, getters: rt },
      ut = { styleList: [], propsList: [], usingBadgeList: [] },
      lt = {
        getStyleList: function (t) {
          var e,
            a = 0,
            n = [];
          return (
            t.styleList.forEach(function (t) {
              if ('effA' === t.prop_type || 'effB' === t.prop_type)
                return (
                  (a += t.type_count),
                  (n = [].concat(Object(E['a'])(n), Object(E['a'])(t.data))),
                  void (e = Object(C['a'])(
                    Object(C['a'])({}, e),
                    {},
                    { eff: { propType: 'eff', typeCount: a, data: n } }
                  ))
                );
              e = Object(C['a'])(
                Object(C['a'])({}, e),
                {},
                Object(O['a'])({}, t.prop_type, {
                  propType: t.prop_type,
                  typeCount: t.type_count,
                  data: t.data,
                })
              );
            }),
            e
          );
        },
        getPropsList: function (t) {
          return t.propsList;
        },
        getUsingBadgesList: function (t) {
          return t.usingBadgeList;
        },
      },
      dt = a('7bb4'),
      mt = {
        actionGetStyleList: function (t, e) {
          var a = t.commit;
          Object(dt['n'])(e)
            .then(function (t) {
              var e = t.data;
              a('SET_STYLE_LIST', e.result);
            })
            ['catch'](function (t) {
              Object(h['b'])(t);
            });
        },
        actionSetStyle: function (t, e) {
          var a = t.dispatch;
          return Object(dt['t'])(e)
            .then(function (t) {
              var n = t.data;
              if ('0' === n.error_code) {
                var i = { lott_id: e.action_id };
                a('actionSetHintInfo', f['a'].t('S_USED'), { root: !0 }),
                  a('actionGetStyleList', i);
              } else a('actionSetHintInfo', n.error_text, { root: !0 });
              return n;
            })
            ['catch'](function (t) {
              Object(h['b'])(t);
            });
        },
        actionDeleteMyStyle: function (t, e) {
          var a = t.dispatch;
          return Object(dt['d'])(e)
            .then(function (t) {
              var n = t.data;
              if ('0' === n.error_code) {
                var i = { lott_id: e.action_id };
                a('actionSetHintInfo', f['a'].t('S_STOP_USED'), { root: !0 }),
                  a('actionGetStyleList', i);
              } else a('actionSetHintInfo', n.error_text, { root: !0 });
              return n;
            })
            ['catch'](function (t) {
              Object(h['b'])(t);
            });
        },
        actionGetPropsList: function (t, e) {
          var a = t.commit;
          Object(dt['l'])(e)
            .then(function (t) {
              var e = t.data;
              a('SET_PROPS_LIST', e.result);
            })
            ['catch'](function (t) {
              Object(h['b'])(t);
            });
        },
        actionSetProps: function (t, e) {
          var a = t.dispatch;
          return Object(dt['s'])(e)
            .then(function (t) {
              var n = t.data;
              if ('0' === n.error_code) {
                var i = { lott_id: e.action_id };
                a('actionSetHintInfo', n.result.replace('/n', ''), {
                  root: !0,
                }),
                  a('actionGetPropsList', i);
              } else a('actionSetHintInfo', n.error_text, { root: !0 });
              return n;
            })
            ['catch'](function (t) {
              Object(h['b'])(t);
            });
        },
      },
      _t = {
        SET_STYLE_LIST: function (t, e) {
          (t.styleList = e.equip || []), (t.usingBadgeList = e.badge || []);
        },
        SET_PROPS_LIST: function (t, e) {
          t.propsList = e || [];
        },
      },
      ht = {
        namespaced: !0,
        state: ut,
        actions: mt,
        mutations: _t,
        getters: lt,
      };
    r['default'].use(o['a']);
    e['a'] = new o['a'].Store({
      state: c,
      getters: l,
      actions: p,
      mutations: g,
      modules: { chatroom: A, game: Q, gift: ct, my: ht },
      strict: !0,
    });
  },
  4423: function (t, e, a) {
    'use strict';
    a('f8f9');
  },
  '482f': function (t, e, a) {
    'use strict';
    a('c64e');
  },
  4879: function (t, e, a) {},
  '48ec': function (t, e, a) {},
  '4b0e': function (t, e) {},
  '4c34': function (t, e, a) {},
  '4d14': function (t, e, a) {},
  5061: function (t, e, a) {
    'use strict';
    var n = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { class: ['header', { 'app-header': t.appUse }] },
          [
            a('div', { staticClass: 'left-btn', on: { click: t.leftBtn } }, [
              a('img', {
                staticClass: 'arrow-icon',
                attrs: {
                  src: t.$getCdnPath('/images/common/ic_arrow_l_grey.png'),
                },
              }),
            ]),
            a('div', { staticClass: 'title' }, [
              t._v(' ' + t._s(t.title) + ' '),
            ]),
            t._t('right-btn'),
          ],
          2
        );
      },
      i = [],
      s = a('2471'),
      r = a('234c'),
      o = {
        props: {
          title: { type: String, default: '' },
          leftBtnFunc: { type: Function, default: null },
        },
        computed: {
          appUse: function () {
            return Object(r['a'])('appUse');
          },
        },
        methods: {
          leftBtn: function () {
            this.leftBtnFunc
              ? this.leftBtnFunc()
              : s['a'].jsToAppMessage({ event: 'EVENT_EXIT', data: '' });
          },
        },
      },
      c = o,
      u = (a('d596'), a('2877')),
      l = Object(u['a'])(c, n, i, !1, null, '0fcac3a4', null);
    e['a'] = l.exports;
  },
  5068: function (t, e, a) {},
  '50ef': function (t, e, a) {},
  5134: function (t, e, a) {
    'use strict';
    a('04b1');
  },
  5165: function (t, e, a) {
    'use strict';
    a('d07f');
  },
  5230: function (t, e, a) {},
  '53b9': function (t, e, a) {
    'use strict';
    a('01f5');
  },
  '56d7': function (t, e, a) {
    'use strict';
    a.r(e);
    a('0fb7'), a('450d');
    var n = a('f529'),
      i = a.n(n),
      s =
        (a('e260'),
        a('e6cf'),
        a('cca6'),
        a('a79d'),
        a('4160'),
        a('159b'),
        a('b64b'),
        a('4de4'),
        a('2b0e')),
      r = a('2f62'),
      o = a('0086'),
      c = a.n(o),
      u = a('7212'),
      l = a.n(u),
      d = a('caf9'),
      m = a('3766'),
      _ = a('ad3d'),
      h = {
        install: function (t) {
          t.prototype.$umClick = function (t) {
            var e = {
                A1: { category: '首页', action: '进入', label: '' },
                A2: { category: '首页', action: '点击', label: '关注' },
                A3: { category: '首页', action: '点击', label: '推荐' },
                A4: { category: '首页', action: '点击', label: '活动' },
                A5: { category: '首页', action: '点击', label: '搜寻' },
                A6: { category: '首页', action: '点击', label: '排行榜' },
                C8: { category: '首页', action: '点击', label: '主播位' },
                E14: { category: '首页', action: '点击', label: '光年推荐' },
                F15: {
                  category: '首页',
                  action: '点击',
                  label: '推荐下方主播',
                },
              },
              a = window,
              n = a.aplus_queue,
              i = e[t];
            console.log(i),
              n.push({ action: 'aplus.record', arguments: [t, 'CLK', i] });
          };
        },
      },
      f = (a('99af'), a('4360')),
      p = {
        install: function (t) {
          (t.prototype.$getCdnPath = function (t) {
            var e = f['a'].state.cdnDomain
              ? 'https://'.concat(f['a'].state.cdnDomain)
              : '';
            return ''.concat(e).concat(t);
          }),
            (t.prototype.$wsGetCdnPath = function (t) {
              var e = f['a'].state.wsCdnDomain
                ? 'https://'.concat(f['a'].state.wsCdnDomain)
                : 'https://storage.googleapis.com/lottcube';
              return t.length ? ''.concat(e).concat(t) : '';
            });
        },
      },
      g =
        (a('4795'),
        {
          install: function (t) {
            t.prototype.$vigoPlayer = {
              volume: !1,
              player: null,
              canvasElem: null,
              createCount: 0,
              created: function () {
                var t = this;
                this.createCount += 1;
                try {
                  VigoPlayer.load(function () {
                    (t.player = new VigoPlayer()),
                      t.player.setKeepScreenOn(),
                      t.player.setScaleMode(2),
                      t.player.setBufferTime(100),
                      t.player.setTimeout(5),
                      (t.canvasElem = document.createElement('canvas')),
                      (t.canvasElem.id = 'videoCanvas');
                  });
                } catch (e) {
                  this.createCount < 100 &&
                    setTimeout(function () {
                      return t.created();
                    }, 500);
                }
              },
            };
          },
        }),
      S = (a('560b'), a('dcdc')),
      v = a.n(S),
      b = (a('6b30'), a('c284')),
      C = a.n(b),
      O = (a('1951'), a('eedf')),
      T = a.n(O),
      E = (a('10cb'), a('f3ad')),
      I = a.n(E),
      A = (a('6611'), a('e772')),
      y = a.n(A),
      w = (a('1f1a'), a('4e4b')),
      R = a.n(w),
      L = (a('075a'), a('72aa')),
      N = a.n(L),
      k = (a('e612'), a('dd87')),
      P = a.n(k),
      M = (a('b84d'), a('c216')),
      D = a.n(M),
      j = (a('8f24'), a('76b9')),
      G = a.n(j),
      $ = {
        install: function (t) {
          t.use(G.a),
            t.use(D.a),
            t.use(P.a),
            t.use(N.a),
            t.use(R.a),
            t.use(y.a),
            t.use(I.a),
            t.use(T.a),
            t.use(C.a),
            t.use(v.a);
        },
      },
      U = $,
      x = a('8f6a'),
      F = a('8c4f'),
      H = a('2631'),
      B = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', { staticClass: 'login-wrap' }, [
          a('div', [
            a('div', { staticClass: 'logo' }, [
              a('img', {
                attrs: {
                  src: t.$getCdnPath('/images/login/logo_b@2x.png'),
                  alt: '',
                },
              }),
            ]),
            a(
              'div',
              { staticClass: 'login-block' },
              [
                a(
                  'div',
                  { staticClass: 'input-wrap' },
                  [
                    a('div', [t._v('請輸入帳號：')]),
                    a('el-input', {
                      attrs: {
                        disabled: !0 === t.guestMode,
                        placeholder: t.$t('S_ACCOUNT_HINT'),
                      },
                      nativeOn: {
                        keyup: function (e) {
                          return !e.type.indexOf('key') &&
                            t._k(e.keyCode, 'enter', 13, e.key, 'Enter')
                            ? null
                            : t.doLogin(e);
                        },
                      },
                      model: {
                        value: t.user.account,
                        callback: function (e) {
                          t.$set(t.user, 'account', e);
                        },
                        expression: 'user.account',
                      },
                    }),
                  ],
                  1
                ),
                a(
                  'div',
                  { staticClass: 'input-wrap' },
                  [
                    a('div', [t._v('請輸入品牌商後製碼：')]),
                    a('el-input', {
                      attrs: { placeholder: '請輸入品牌商後製碼' },
                      nativeOn: {
                        keyup: function (e) {
                          return !e.type.indexOf('key') &&
                            t._k(e.keyCode, 'enter', 13, e.key, 'Enter')
                            ? null
                            : t.doLogin(e);
                        },
                      },
                      model: {
                        value: t.user.brand_domain_code,
                        callback: function (e) {
                          t.$set(t.user, 'brand_domain_code', e);
                        },
                        expression: 'user.brand_domain_code',
                      },
                    }),
                  ],
                  1
                ),
                a(
                  'div',
                  [
                    a(
                      'el-checkbox',
                      {
                        model: {
                          value: t.guestMode,
                          callback: function (e) {
                            t.guestMode = e;
                          },
                          expression: 'guestMode',
                        },
                      },
                      [t._v(' 以訪客模式登入 ')]
                    ),
                  ],
                  1
                ),
                a(
                  'el-button',
                  {
                    staticClass: 'login-btn',
                    attrs: { round: '' },
                    on: { click: t.doLogin },
                  },
                  [t._v(' ' + t._s(t.$t('S_LOGIN')) + ' ')]
                ),
              ],
              1
            ),
          ]),
        ]);
      },
      W = [],
      V = a('5530'),
      Y = a('234c'),
      K = a('93ee'),
      X = {
        data: function () {
          return {
            guestMode: !1,
            user: { account: '', brand_domain_code: 'qfm' },
          };
        },
        created: function () {
          Object(Y['a'])('session') &&
            (this.actionSetUser(Object(Y['a'])('lottUser')),
            this.$router.push({ path: '/' })['catch'](function (t) {
              return t;
            }));
        },
        methods: Object(V['a'])(
          Object(V['a'])({}, Object(r['b'])(['actionSetUser'])),
          {},
          {
            doLogin: function () {
              var t = this,
                e = this.user,
                a = this.guestMode;
              if ('' !== e.account || a)
                if (e.account.length < 5 && !a)
                  this.$message({
                    showClose: !0,
                    message: this.$t('S_LOGIN_LENGTH_HINT'),
                    type: 'error',
                  });
                else {
                  var n = {
                    user_type: 1,
                    currency: 'CNY',
                    alias: e.account,
                    username: e.account,
                    brand_domain_code: e.brand_domain_code,
                    ip: '127.0.0.1',
                    identity_id: 1,
                  };
                  a &&
                    (n = Object(V['a'])(
                      Object(V['a'])({}, n),
                      {},
                      {
                        alias: 'gusetABCD',
                        username: 'gusetABCD',
                        device_code: 'ppin',
                      }
                    )),
                    Object(K['n'])(n, a).then(function (e) {
                      var a = e.data;
                      if (0 !== a.error_code && a.error_text)
                        return (
                          Object(Y['b'])('session'),
                          void t.$message({
                            showClose: !0,
                            message: a.error_text,
                            type: 'error',
                          })
                        );
                      Object(Y['c'])('session', a.result.session),
                        Object(Y['c'])('lottUser', a.result),
                        t.actionSetUser(a.result),
                        t.$router.push('/');
                    });
                }
              else
                this.$message({
                  showClose: !0,
                  message: this.$t('S_LOGIN_EMPTY_HINT'),
                  type: 'error',
                });
            },
          }
        ),
      },
      q = X,
      z = (a('7f64'), a('2877')),
      Q = Object(z['a'])(q, B, W, !1, null, '6414267e', null),
      J = Q.exports,
      Z = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { staticClass: 'index-wrap' },
          [
            a(
              'div',
              { staticClass: 'top-wrap' },
              [
                a(
                  'el-tabs',
                  {
                    staticClass: 'nav-item-wrap',
                    attrs: { stretch: '' },
                    on: { 'tab-click': t.handleTabClick },
                    model: {
                      value: t.curTab,
                      callback: function (e) {
                        t.curTab = e;
                      },
                      expression: 'curTab',
                    },
                  },
                  t._l(t.tabOption, function (e) {
                    return a('el-tab-pane', {
                      key: e.key,
                      attrs: { label: t.$t(e.label), name: e.key },
                    });
                  }),
                  1
                ),
                a('div', { staticClass: 'nav-icon-wrap' }, [
                  a('img', {
                    attrs: {
                      src: t.$getCdnPath('/images/navBar/icon_search.svg'),
                    },
                    on: { click: t.toSearch },
                  }),
                  a('img', {
                    attrs: {
                      src: t.$getCdnPath('/images/navBar/icon_board.svg'),
                    },
                    on: { click: t.toLeaderBoard },
                  }),
                ]),
              ],
              1
            ),
            a(
              'swiper',
              {
                ref: 'mySwiper',
                attrs: { options: t.swiperOptions },
                on: { 'slide-change': t.slideChange },
              },
              t._l(t.tabOption, function (e) {
                return a(
                  'swiper-slide',
                  { key: e.key },
                  [
                    a(e.key, {
                      tag: 'component',
                      attrs: { 'cur-tab': t.curTab },
                      on: { toStreamRoom: t.toStreamRoom },
                    }),
                  ],
                  1
                );
              }),
              1
            ),
            a(
              'transition',
              { attrs: { name: 'slide-left' } },
              [
                t.searchOn
                  ? a('Search', {
                      on: {
                        toStreamRoom: t.toStreamRoom,
                        closeSearch: function (e) {
                          t.searchOn = !1;
                        },
                      },
                    })
                  : t._e(),
              ],
              1
            ),
            t.isLaunch
              ? a('div', { staticClass: 'mask' }, [
                  a('div', { staticClass: 'register-promotion' }, [
                    a('img', {
                      attrs: {
                        src: t.$getCdnPath(
                          '/images/common/registerPromotion.png'
                        ),
                      },
                    }),
                    a('div', {
                      staticClass: 'submit',
                      on: { click: t.closePromotion },
                    }),
                  ]),
                ])
              : t._e(),
          ],
          1
        );
      },
      tt = [],
      et = (a('ac1f'), a('5319'), a('b0c0'), a('0568')),
      at = a('2471'),
      nt = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', { staticClass: 'search-streamer-wrap' }, [
          a(
            'div',
            { staticClass: 'search-input-wrap' },
            [
              a(
                'el-input',
                {
                  attrs: { placeholder: t.$t('S_SEARCH_KEYWORD') },
                  nativeOn: {
                    keyup: function (e) {
                      return !e.type.indexOf('key') &&
                        t._k(e.keyCode, 'enter', 13, e.key, 'Enter')
                        ? null
                        : t.searchPrograms(e);
                    },
                  },
                  model: {
                    value: t.searchText,
                    callback: function (e) {
                      t.searchText = e;
                    },
                    expression: 'searchText',
                  },
                },
                [
                  a('img', {
                    staticClass: 'search-icon',
                    attrs: {
                      slot: 'prefix',
                      src: t.$getCdnPath('/images/common/icon_search@2x.png'),
                    },
                    on: { click: t.searchPrograms },
                    slot: 'prefix',
                  }),
                  a('i', {
                    staticClass: 'el-input__icon el-icon-error',
                    attrs: { slot: 'suffix' },
                    on: { click: t.clearSearchData },
                    slot: 'suffix',
                  }),
                ]
              ),
              a(
                'div',
                { staticClass: 'cancel-btn', on: { click: t.backToIndex } },
                [t._v(' ' + t._s(t.$t('S_CANCEL')) + ' ')]
              ),
            ],
            1
          ),
          a(
            'div',
            { staticClass: 'search-content-wrap' },
            [
              t.isSearch
                ? a(
                    'div',
                    { staticClass: 'program-wrap' },
                    [
                      t.filterProgramList.length
                        ? t._l(t.filterProgramList, function (e, n) {
                            return a('ProgramCard', {
                              key: 'roomId-' + e.roomId + '-' + n,
                              attrs: { room: e },
                              on: {
                                toStreamRoom: function (e) {
                                  return t.$emit('toStreamRoom', e);
                                },
                              },
                            });
                          })
                        : a('NoDataWrap', {
                            staticClass: 'no-data',
                            attrs: { text: t.$t('S_NO_MATCH_STREAMER') + '~' },
                          }),
                    ],
                    2
                  )
                : !t.isSearch && t.recentWatchedList.length
                ? [
                    a('div', { staticClass: 'title' }, [
                      a('span', [t._v(t._s(t.$t('S_RECENTLY_VIEWED')))]),
                    ]),
                    a(
                      'div',
                      { staticClass: 'program-wrap' },
                      t._l(t.recentWatchedList, function (e, n) {
                        return a('ProgramCard', {
                          key: 'roomId-' + e.roomId + '-' + n,
                          attrs: { room: e },
                          on: {
                            toStreamRoom: function (e) {
                              return t.$emit('toStreamRoom', e);
                            },
                          },
                        });
                      }),
                      1
                    ),
                  ]
                : t._e(),
              [
                a('div', { staticClass: 'title' }, [
                  a('span', [t._v(t._s(t.$t('S_RECOMMAND_TO_YOU')))]),
                  a(
                    'div',
                    {
                      staticClass: 'change-batch',
                      on: { click: t.changeBatch },
                    },
                    [
                      a('span', [t._v(t._s(t.$t('S_CHANGE_A_BATCH')))]),
                      a('span', [
                        a('img', {
                          attrs: {
                            src: t.$getCdnPath(
                              '/images/index/icon_renovate.png'
                            ),
                          },
                        }),
                      ]),
                    ]
                  ),
                ]),
                a(
                  'div',
                  { staticClass: 'program-wrap' },
                  t._l(t.recommendList, function (e, n) {
                    return a('ProgramCard', {
                      key: 'recommend-' + e.roomId + '-' + n,
                      attrs: { room: e },
                      on: {
                        toStreamRoom: function (e) {
                          return t.$emit('toStreamRoom', e);
                        },
                      },
                    });
                  }),
                  1
                ),
              ],
            ],
            2
          ),
        ]);
      },
      it = [],
      st =
        (a('4d63'),
        a('25f0'),
        a('466d'),
        a('caad'),
        a('2532'),
        function () {
          var t = this,
            e = t.$createElement,
            a = t._self._c || e;
          return a(
            'div',
            { staticClass: 'program-card', on: { click: t.toStreamRoom } },
            [
              a('div', { staticClass: 'program-info' }, [
                a('div', { staticClass: 'room-info-top-wrap' }, [
                  a('div', { staticClass: 'game-name' }, [
                    t._v(' ' + t._s(t.liveGameName(t.room.game)) + ' '),
                  ]),
                  a(
                    'div',
                    { staticClass: 'online' },
                    [
                      a('font-awesome-icon', {
                        staticClass: 'circle',
                        attrs: { icon: 'circle' },
                      }),
                      t._v(' ' + t._s(t.room.onlineNum) + ' '),
                    ],
                    1
                  ),
                ]),
                t.room.charge > 0
                  ? a('div', { staticClass: 'charge-tag-wrap' }, [
                      a('div', [t._v(t._s(t.$t('S_CHARGE_ON_TIME')))]),
                      a('div', [
                        t._v(
                          ' ' +
                            t._s(
                              t
                                .$t('S_PER_MINUTE_DIAMOND')
                                .replace('%n', t.room.charge)
                            ) +
                            ' '
                        ),
                      ]),
                    ])
                  : t._e(),
                a('div', { staticClass: 'room-info-buttom-wrap' }, [
                  a('div', { staticClass: 'stream-title' }, [
                    t._v(' ' + t._s(t.room.streamTitle) + ' '),
                  ]),
                  a('div', { staticClass: 'streamer-name' }, [
                    t._v(' ' + t._s(t.room.nickname) + ' '),
                  ]),
                  t.room.tags.length
                    ? a(
                        'div',
                        { staticClass: 'tag-wrap' },
                        t._l(t.room.tags, function (e) {
                          return a('code', { key: e, staticClass: 'tag' }, [
                            t._v('#' + t._s(e)),
                          ]);
                        }),
                        0
                      )
                    : t._e(),
                ]),
              ]),
              a('img', {
                directives: [
                  {
                    name: 'lazy',
                    rawName: 'v-lazy',
                    value: { src: t.room.headphoto, error: t.errorPath },
                    expression: '{ src: room.headphoto, error: errorPath }',
                  },
                ],
              }),
            ]
          );
        }),
      rt = [],
      ot = a('3aee');
    function ct(t) {
      var e = {
        'PK-PAOPK-1': ot['a'].t('S_PK_PAOPK'),
        'LT-PAO1MLT-1': ot['a'].t('S_LT_PAO1MLT'),
        'SC-PAO1MSC-1': ot['a'].t('S_SC_PAO1MSC'),
        'Q3-PAOQ3-1': ot['a'].t('S_Q3_PAOQ3'),
        'E5-PAOE5-1': ot['a'].t('S_E5_PAOE5'),
        'SICBO-PAOFSC-1': ot['a'].t('S_SICBO_PAOFSC'),
      };
      return e[t] ? e[t] : '';
    }
    function ut(t) {
      var e = {
        Mute: ot['a'].t('S_MUTE'),
        ReMute: ot['a'].t('S_REMUTE'),
        KO: ot['a'].t('S_KO'),
        ReBlockade: ot['a'].t('S_UNBLOCK'),
      };
      return e[t];
    }
    function lt() {
      var t = { tw: 'tw', cn: 'cn', en: 'en' };
      return t[ot['a'].locale];
    }
    function dt(t) {
      var e = {
        eff: ot['a'].t('S_EFF'),
        uBadge: ot['a'].t('S_BADGE'),
        uFrame: ot['a'].t('S_FRAME'),
        background: ot['a'].t('S_BG'),
        props: ot['a'].t('S_PROPS'),
      };
      return e[t] ? e[t] : '';
    }
    var mt = {
        props: {
          room: {
            type: Object,
            default: function () {
              return {};
            },
          },
        },
        computed: {
          errorPath: function () {
            return this.$getCdnPath('/images/presetImg/preset.svg');
          },
        },
        methods: {
          liveGameName: ct,
          toStreamRoom: function () {
            this.$emit('toStreamRoom', this.room);
          },
        },
      },
      _t = mt,
      ht = (a('a899'), Object(z['a'])(_t, st, rt, !1, null, '0683dbe8', null)),
      ft = ht.exports,
      pt = a('ee29'),
      gt = a('ebf7'),
      St = {
        components: { ProgramCard: ft, NoDataWrap: pt['a'] },
        data: function () {
          return {
            recommendList: [],
            count: 0,
            isSearch: !1,
            searchText: '',
            filterProgramList: [],
            recentWatchedList: [],
          };
        },
        computed: Object(V['a'])(
          Object(V['a'])({}, Object(r['d'])(['user'])),
          Object(r['c'])({
            programList: 'getProgramList',
            searchProgramList: 'getSearchProgramList',
          })
        ),
        created: function () {
          var t = this;
          this.actionGetProgram().then(function () {
            t.changeBatch();
          }),
            this.actionGetSearchProgramList(),
            this.getRecentWatched();
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            {},
            Object(r['b'])([
              'actionGetProgram',
              'actionGetSearchProgramList',
              'actionSetHintInfo',
            ])
          ),
          {},
          {
            searchPrograms: function () {
              var t = this,
                e = /\S/;
              if (!e.test(this.searchText))
                return (this.isSearch = !1), void this.clearSearchData();
              var a = [];
              (this.isSearch = !0),
                this.searchProgramList.forEach(function (e) {
                  var n = new RegExp(''.concat(t.searchText), 'i');
                  (String(e.streamerId).match(n) ||
                    e.nickname.match(n) ||
                    e.tags.includes(t.searchText)) &&
                    a.push(e);
                }),
                (this.filterProgramList = this.searchText ? a : []),
                this.filterProgramList.length ||
                  this.actionSetHintInfo(this.$t('S_NO_SEARCH'));
            },
            clearSearchData: function () {
              this.searchText = '';
            },
            backToIndex: function () {
              this.$emit('closeSearch');
            },
            changeBatch: function () {
              (this.recommendList = Object(gt['a'])(
                this.programList,
                30,
                this.count
              )),
                (this.count += 30);
            },
            getRecentWatched: function () {
              var t = this;
              this.user.lott_id &&
                Object(K['k'])(this.user.lott_id).then(function (e) {
                  var a = e.data;
                  if ('0' === a.error_code) {
                    var n = a.result || [];
                    t.recentWatchedList = Object(gt['e'])(n);
                  }
                });
            },
          }
        ),
      },
      vt = St,
      bt = (a('8059'), Object(z['a'])(vt, nt, it, !1, null, 'fb3ba072', null)),
      Ct = bt.exports,
      Ot = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return t.isShow
          ? a(
              'div',
              { staticClass: 'info-wrap' },
              [
                a(
                  'div',
                  { staticClass: 'no-swiper-scroll-wrap' },
                  [
                    0 === t.sliderData.length
                      ? a('div', { staticClass: 'carousel-wrap' }, [
                          a('img', {
                            attrs: {
                              src: t.$getCdnPath(
                                '/images/carousel/default.jpeg'
                              ),
                            },
                          }),
                        ])
                      : a(
                          'swiper',
                          {
                            ref: 'mySwiper',
                            staticClass: 'carousel-wrap',
                            attrs: { options: t.swiperOptions },
                          },
                          t._l(t.sliderData, function (e) {
                            return a('swiper-slide', { key: e.key }, [
                              a('img', {
                                attrs: { src: e.image },
                                on: {
                                  click: function (a) {
                                    return t.goLink(e);
                                  },
                                },
                              }),
                            ]);
                          }),
                          1
                        ),
                  ],
                  1
                ),
                a(
                  'div',
                  { staticClass: 'marquee' },
                  [
                    a('img', {
                      attrs: {
                        src: t.$getCdnPath('/images/navBar/icon_news.svg'),
                      },
                    }),
                    a('marquee', {
                      domProps: { innerHTML: t._s(t.marqueeData) },
                    }),
                  ],
                  1
                ),
                a(
                  'vue-loadmore',
                  {
                    attrs: {
                      'on-refresh': t.onRefresh,
                      'pulling-text': t.$t('S_PULLING_TEXT'),
                      'loosing-text': t.$t('S_LOOSING_TEXT'),
                      'show-success-text': !1,
                    },
                  },
                  [
                    a(
                      'div',
                      {
                        staticClass: 'program-wrap',
                        class: { refresh: t.refresh },
                      },
                      [
                        t._l(t.programList, function (e, n) {
                          return [
                            n <= 3
                              ? a('ProgramCard', {
                                  key: 'roomId-' + e.roomId + '-' + n,
                                  attrs: { room: e },
                                  on: {
                                    toStreamRoom: function (e) {
                                      return t.$emit('toStreamRoom', e, 'C8');
                                    },
                                  },
                                })
                              : t._e(),
                          ];
                        }),
                        a('div', { staticClass: 'light-years-wrap' }, [
                          a('div', { staticClass: 'title' }, [
                            t._v(
                              ' ' + t._s(t.$t('S_LIGHT_YEARS_RECOMMAND')) + ' '
                            ),
                          ]),
                          a(
                            'div',
                            {
                              staticClass:
                                'light-years-scroll-wrap no-swiper-scroll-wrap',
                            },
                            t._l(t.lightYearList, function (e, n) {
                              return a(
                                'div',
                                {
                                  key: 'roomId-' + e.roomId + '-' + n,
                                  staticClass: 'light-item',
                                  on: {
                                    click: function (a) {
                                      return t.$emit('toStreamRoom', e, 'E14');
                                    },
                                  },
                                },
                                [
                                  a(
                                    'div',
                                    { staticClass: 'light-content-wrap' },
                                    [
                                      a(
                                        'div',
                                        { staticClass: 'online' },
                                        [
                                          a('font-awesome-icon', {
                                            staticClass: 'circle',
                                            attrs: { icon: 'circle' },
                                          }),
                                          t._v(t._s(e.onlineNum) + ' '),
                                        ],
                                        1
                                      ),
                                      a('div', { staticClass: 'room-title' }, [
                                        t._v(
                                          ' ' +
                                            t._s(t.liveGameName(e.game)) +
                                            ' '
                                        ),
                                      ]),
                                    ]
                                  ),
                                  a('img', {
                                    directives: [
                                      {
                                        name: 'lazy',
                                        rawName: 'v-lazy',
                                        value: {
                                          src: e.headphoto,
                                          error: t.errorPath,
                                        },
                                        expression:
                                          '{ src: item.headphoto, error: errorPath }',
                                      },
                                    ],
                                  }),
                                ]
                              );
                            }),
                            0
                          ),
                        ]),
                        t._l(t.programList, function (e, n) {
                          return [
                            n > 3
                              ? a('ProgramCard', {
                                  key: 'roomId-' + e.roomId + '-' + n,
                                  attrs: { room: e },
                                  on: {
                                    toStreamRoom: function (e) {
                                      return t.$emit('toStreamRoom', e, 'F15');
                                    },
                                  },
                                })
                              : t._e(),
                          ];
                        }),
                      ],
                      2
                    ),
                  ]
                ),
              ],
              1
            )
          : t._e();
      },
      Tt = [],
      Et =
        (a('a15b'),
        {
          components: { ProgramCard: ft },
          props: { curTab: { type: String, required: !0 } },
          data: function () {
            return {
              pageTab: 'Recommand',
              swiperOptions: { autoplay: { delay: 5e3 }, loop: !0, nested: !0 },
              marqueeData: '',
              isShow: !1,
              refresh: !1,
              refreshInterval: null,
            };
          },
          computed: Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])({}, Object(r['d'])(['user'])),
              Object(r['c'])({
                programList: 'getProgramList',
                lightYearList: 'getLightYearList',
                getDefaultUserImg: 'getDefaultUserImg',
                webInfo: 'getWebInfo',
              })
            ),
            {},
            {
              sliderData: function () {
                var t;
                return (
                  (null === (t = this.webInfo) || void 0 === t
                    ? void 0
                    : t.bannerList) || []
                );
              },
              errorPath: function () {
                return this.$getCdnPath('/images/presetImg/preset.svg');
              },
            }
          ),
          watch: {
            curTab: {
              immediate: !0,
              handler: function (t) {
                t === this.pageTab && ((this.isShow = !0), this.initData());
              },
            },
          },
          methods: Object(V['a'])(
            Object(V['a'])(
              { liveGameName: ct },
              Object(r['b'])(['actionGetProgram'])
            ),
            {},
            {
              onRefresh: function (t) {
                var e = this;
                clearTimeout(this.refreshInterval),
                  (this.refresh = !0),
                  this.actionGetProgram().then(function () {
                    t(),
                      (e.refreshInterval = setTimeout(function () {
                        e.refresh = !1;
                      }, 500));
                  });
              },
              initData: function () {
                this.actionGetProgram(), this.getMarquee();
              },
              getMarquee: function () {
                var t = this;
                Object(K['h'])().then(function (e) {
                  var a = e.data;
                  if ('0' === a.error_code) {
                    var n = a.result.marquee || [];
                    t.marqueeData = n.join('&emsp;');
                  }
                });
              },
              goLink: function (t) {
                at['a'].jsToAppMessage({
                  event: 'EVENT_SWIPER_LINK',
                  data: {
                    linkType: t.link_type,
                    linkTo: t.link_to,
                    linkItem: t.link_item,
                  },
                });
              },
            }
          ),
          beforeDistroy: function () {
            clearTimeout(this.refreshInterval);
          },
        }),
      It = Et,
      At = (a('f735'), Object(z['a'])(It, Ot, Tt, !1, null, '21335dd1', null)),
      yt = At.exports,
      wt = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return t.isShow
          ? a(
              'div',
              { staticClass: 'info-wrap' },
              [
                a(
                  'vue-loadmore',
                  {
                    attrs: {
                      'on-refresh': t.onRefresh,
                      'pulling-text': t.$t('S_PULLING_TEXT'),
                      'loosing-text': t.$t('S_LOOSING_TEXT'),
                      'show-success-text': !1,
                    },
                  },
                  [
                    a(
                      'div',
                      {
                        staticClass: 'follow-streamer-wrap',
                        class: { refresh: t.refresh },
                      },
                      [
                        a('div', { staticClass: 'title' }, [
                          t._v(
                            ' ' +
                              t._s(t.$t('S_ATTENTION_FAVORITE_STREAMER')) +
                              ' '
                          ),
                        ]),
                        a(
                          'div',
                          { staticClass: 'program-wrap' },
                          [
                            t.attentionProgramList.length
                              ? t._l(t.attentionProgramList, function (e, n) {
                                  return a('ProgramCard', {
                                    key: 'roomId-' + e.roomId + '-' + n,
                                    attrs: { room: e },
                                    on: {
                                      toStreamRoom: function (e) {
                                        return t.$emit('toStreamRoom', e);
                                      },
                                    },
                                  });
                                })
                              : a('div', { staticClass: 'no-attention-wrap' }, [
                                  a('img', {
                                    attrs: {
                                      src: t.$getCdnPath(
                                        '/images/common/img_love@2x.png'
                                      ),
                                    },
                                  }),
                                  t._v(
                                    ' ' +
                                      t._s(t.$t('S_DONT_HAVE_ATTENTION')) +
                                      ' '
                                  ),
                                ]),
                          ],
                          2
                        ),
                      ]
                    ),
                    a(
                      'div',
                      {
                        staticClass: 'recommand-wrap',
                        class: { refresh: t.refresh },
                      },
                      [
                        a('div', { staticClass: 'title' }, [
                          a('span', [t._v(t._s(t.$t('S_RECOMMAND_TO_YOU')))]),
                          a(
                            'div',
                            {
                              staticClass: 'change-batch',
                              on: { click: t.changeBatch },
                            },
                            [
                              a('span', [t._v(t._s(t.$t('S_CHANGE_A_BATCH')))]),
                              a('span', [
                                a('img', {
                                  attrs: {
                                    src: t.$getCdnPath(
                                      '/images/index/icon_renovate.png'
                                    ),
                                  },
                                }),
                              ]),
                            ]
                          ),
                        ]),
                        a(
                          'div',
                          { staticClass: 'program-wrap' },
                          t._l(t.recommendList, function (e, n) {
                            return a('ProgramCard', {
                              key: 'recommend-' + e.roomId + '-' + n,
                              attrs: { room: e },
                              on: {
                                toStreamRoom: function (e) {
                                  return t.$emit('toStreamRoom', e);
                                },
                              },
                            });
                          }),
                          1
                        ),
                      ]
                    ),
                  ]
                ),
              ],
              1
            )
          : t._e();
      },
      Rt = [],
      Lt = {
        components: { ProgramCard: ft },
        props: { curTab: { type: String, required: !0 } },
        data: function () {
          return {
            isShow: !1,
            pageTab: 'Follow',
            count: 0,
            recommendList: [],
            refresh: !1,
            refreshInterval: null,
          };
        },
        computed: Object(V['a'])(
          {},
          Object(r['c'])({
            programList: 'getProgramList',
            attentionProgramList: 'getAttentionProgramList',
          })
        ),
        watch: {
          curTab: {
            immediate: !0,
            handler: function (t) {
              t === this.pageTab && ((this.isShow = !0), this.getProgram());
            },
          },
        },
        methods: Object(V['a'])(
          Object(V['a'])({}, Object(r['b'])(['actionGetAttentionProgram'])),
          {},
          {
            onRefresh: function (t) {
              var e = this;
              clearTimeout(this.refreshInterval),
                (this.refresh = !0),
                this.actionGetAttentionProgram().then(function () {
                  (e.recommendList = e.programList),
                    t(),
                    (e.refreshInterval = setTimeout(function () {
                      e.refresh = !1;
                    }, 500));
                });
            },
            getProgram: function () {
              var t = this;
              this.actionGetAttentionProgram().then(function () {
                t.changeBatch();
              });
            },
            changeBatch: function () {
              (this.recommendList = Object(gt['a'])(
                this.programList,
                30,
                this.count
              )),
                (this.count += 30);
            },
          }
        ),
        beforeDistroy: function () {
          clearTimeout(this.refreshInterval);
        },
      },
      Nt = Lt,
      kt = (a('2f66'), Object(z['a'])(Nt, wt, Rt, !1, null, '78c23434', null)),
      Pt = kt.exports,
      Mt = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return t.isShow
          ? a(
              'div',
              { staticClass: 'info-wrap' },
              [
                a(
                  'vue-loadmore',
                  {
                    attrs: {
                      'on-refresh': t.onRefresh,
                      'pulling-text': t.$t('S_PULLING_TEXT'),
                      'loosing-text': t.$t('S_LOOSING_TEXT'),
                      'show-success-text': !1,
                    },
                  },
                  [
                    t._l(t.getActivitiesList, function (e) {
                      return a(
                        'div',
                        {
                          key: e.id,
                          staticClass: 'promotion-item',
                          class: { refresh: t.refresh },
                          attrs: { 'show-success-text': !1 },
                          on: {
                            click: function (a) {
                              return t.setActivityUrl(e);
                            },
                          },
                        },
                        [
                          a('img', {
                            staticClass: 'promotion-img',
                            attrs: { src: e.image },
                          }),
                          a(
                            'div',
                            { staticClass: 'content' },
                            [
                              a('font-awesome-icon', {
                                attrs: { icon: ['far', 'clock'] },
                              }),
                              e.end_time
                                ? a('span', [
                                    t._v(
                                      ' ' +
                                        t._s(e.start_time) +
                                        ' ~ ' +
                                        t._s(e.end_time) +
                                        ' '
                                    ),
                                  ])
                                : a('span', [t._v(t._s(t.$t('S_FROM_NOW')))]),
                            ],
                            1
                          ),
                        ]
                      );
                    }),
                    t.getActivitiesList.length
                      ? t._e()
                      : a('div', { staticClass: 'no-data' }),
                  ],
                  2
                ),
                a(
                  'transition',
                  { attrs: { name: 'slide-left' } },
                  [t.getActivityUrl ? a('ActivityPage') : t._e()],
                  1
                ),
              ],
              1
            )
          : t._e();
      },
      Dt = [],
      jt =
        (a('9911'),
        function () {
          var t = this,
            e = t.$createElement,
            a = t._self._c || e;
          return a('div', { staticClass: 'activity-page-wrap' }, [
            a('div', { staticClass: 'iframe-wrap' }, [
              a('iframe', {
                attrs: {
                  src: t.url,
                  crossorigin: '',
                  allow: 'geolocation',
                  allowfullscreen: 'allowfullscreen',
                  frameborder: '0',
                  wmode: 'Opaque',
                },
              }),
            ]),
            a('div', { staticClass: 'left-btn', on: { click: t.closeModal } }, [
              a('img', {
                staticClass: 'arrow-icon',
                attrs: {
                  src: t.$getCdnPath('/images/common/ic_arrow_l_grey.png'),
                },
              }),
            ]),
          ]);
        }),
      Gt = [],
      $t = {
        computed: Object(V['a'])(
          Object(V['a'])({}, Object(r['c'])(['getActivityUrl'])),
          {},
          {
            url: function () {
              return ''.concat(this.getActivityUrl, '?wmode=transparent');
            },
          }
        ),
        methods: Object(V['a'])(
          Object(V['a'])(
            {},
            Object(r['b'])(['actionSetActivityUrl', 'actionSetWholePageType'])
          ),
          {},
          {
            closeModal: function () {
              this.actionSetWholePageType(null),
                this.actionSetActivityUrl(null);
            },
          }
        ),
      },
      Ut = $t,
      xt = (a('5d7b'), Object(z['a'])(Ut, jt, Gt, !1, null, 'c248f4b4', null)),
      Ft = xt.exports,
      Ht = {
        components: { ActivityPage: Ft },
        props: { curTab: { type: String, required: !0 } },
        data: function () {
          return {
            isShow: !1,
            pageTab: 'Activity',
            refresh: !1,
            refreshInterval: null,
          };
        },
        computed: Object(V['a'])(
          {},
          Object(r['c'])(['getActivitiesList', 'getActivityUrl'])
        ),
        watch: {
          curTab: {
            immediate: !0,
            handler: function (t) {
              t === this.pageTab &&
                ((this.isShow = !0), this.actionGetActivitiesList());
            },
          },
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            {},
            Object(r['b'])(['actionGetActivitiesList', 'actionSetActivityUrl'])
          ),
          {},
          {
            onRefresh: function (t) {
              var e = this;
              clearTimeout(this.refreshInterval),
                (this.refresh = !0),
                this.actionGetActivitiesList().then(function () {
                  t(),
                    (e.refreshInterval = setTimeout(function () {
                      e.refresh = !1;
                    }, 500));
                });
            },
            setActivityUrl: function (t) {
              at['a'].jsToAppMessage({ event: 'EVENT_HTML', data: t.link }),
                this.actionSetActivityUrl(t.link);
            },
          }
        ),
        beforeDistroy: function () {
          clearTimeout(this.refreshInterval);
        },
      },
      Bt = Ht,
      Wt = (a('30c6'), Object(z['a'])(Bt, Mt, Dt, !1, null, '6b056e68', null)),
      Vt = Wt.exports,
      Yt = {
        components: { Search: Ct, Recommand: yt, Follow: Pt, Activity: Vt },
        data: function () {
          return {
            tabOption: [
              { key: 'Follow', label: 'S_FOLLOW' },
              { key: 'Recommand', label: 'S_RECOMMAND' },
              { key: 'Activity', label: 'S_ACTIVITY' },
            ],
            curTab: 'Recommand',
            swiperOptions: {
              initialSlide: 1,
              noSwipingClass: 'no-swiper-scroll-wrap',
            },
            searchOn: !1,
          };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            {},
            Object(r['c'])({
              isLaunch: 'getIsLaunch',
              isGuest: 'getIsGuest',
              userInfo: 'getUserInfo',
            })
          ),
          {},
          {
            swiper: function () {
              return this.$refs.mySwiper.$swiper;
            },
          }
        ),
        watch: {
          isLaunch: {
            immediate: !0,
            handler: function (t) {
              at['a'].jsToAppMessage({ event: 'EVENT_MASK_FOOTER', data: t });
            },
          },
        },
        created: function () {
          at['a'].jsToAppMessage({ event: 'EVENT_DISPLAY_FOOTER', data: !0 }),
            this.fetchBanner(),
            this.$umClick('A1');
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])({}, Object(r['b'])(['actionSetIsLaunch'])),
              Object(r['b'])(['actionWebInfo', 'actionSetHintInfo'])
            ),
            Object(r['b'])('chatroom', ['actionSetCurrentRoom'])
          ),
          {},
          {
            fetchBanner: function () {
              var t = this;
              Object(K['f'])().then(function (e) {
                var a = e.data;
                '0' === a.error_code &&
                  t.actionWebInfo({ bannerList: a.result.banner_list });
              });
            },
            closePromotion: function () {
              this.actionSetIsLaunch(!1);
            },
            toStreamRoom: function (t, e) {
              var a = this;
              e && this.$umClick(e);
              var n = {
                roomid: t.roomId,
                groupid: 0,
                userid: this.userInfo.lott_id,
              };
              Object(et['i'])(n).then(function (e) {
                var n = e.data;
                if ('0' !== n.error_code)
                  return (
                    '116021018' === n.error_code
                      ? a.actionSetHintInfo(a.$t('S_BE_BLOCK'))
                      : a.actionSetHintInfo(a.$t(n.error_text)),
                    void a.$router.push({ path: '/' })['catch'](function (t) {
                      return t;
                    })
                  );
                a.actionSetCurrentRoom(t),
                  a.$router
                    .replace({ name: 'chatroom', params: { roomId: t.roomId } })
                    ['catch'](function (t) {
                      return t;
                    });
              });
            },
            handleTabClick: function (t) {
              var e = t.index;
              switch ((this.swiper.slideTo(e), t.name)) {
                case 'Follow':
                  this.$umClick('A2');
                  break;
                case 'Recommand':
                  this.$umClick('A3');
                  break;
                default:
                  this.$umClick('A4');
                  break;
              }
            },
            slideChange: function () {
              var t = this.swiper.activeIndex;
              this.curTab = this.tabOption[t].key;
            },
            toSearch: function () {
              this.$umClick('A5'), (this.searchOn = !0);
            },
            toLeaderBoard: function () {
              this.$umClick('A6'), this.$router.push('leaderboard');
            },
          }
        ),
      },
      Kt = Yt,
      Xt = (a('7ec6'), Object(z['a'])(Kt, Z, tt, !1, null, 'bfa3dc1a', null)),
      qt = Xt.exports,
      zt = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', { staticClass: 'chatroom-wrap' }, [
          a(
            'div',
            {
              ref: 'chatroomIndex',
              staticClass: 'chatroom-index-wrap chatroomAnimation',
            },
            [
              t.gameSwitch
                ? t._e()
                : a(
                    'div',
                    { staticClass: 'pre-next-room-wrap pre-room-wrap' },
                    [
                      a('img', {
                        attrs: {
                          src: t.preRoom.backgroundImg,
                          onerror: t.getDefaultUserImg,
                        },
                      }),
                    ]
                  ),
              t.showGesture
                ? a('div', { staticClass: 'gesture-wrap' }, [
                    a('div', { staticClass: 'first-bg' }),
                    a(
                      'div',
                      {
                        staticClass: 'ok-btn',
                        on: {
                          click: function (e) {
                            return t.actionSetShowGesture(!1);
                          },
                        },
                      },
                      [t._v(' ' + t._s(t.$t('S_I_UNDERSTAND')) + ' ')]
                    ),
                  ])
                : t._e(),
              a(
                'transition',
                [
                  t.currentRoomKO
                    ? a('ChatroomKo')
                    : [
                        t.currentRoom && 2 == t.currentroomStatus
                          ? a('chatroom', {
                              directives: [
                                {
                                  name: 'touch',
                                  rawName: 'v-touch:start',
                                  value: t.startSwipe,
                                  expression: 'startSwipe',
                                  arg: 'start',
                                },
                                {
                                  name: 'touch',
                                  rawName: 'v-touch:moved',
                                  value: t.movedSwipe,
                                  expression: 'movedSwipe',
                                  arg: 'moved',
                                },
                                {
                                  name: 'touch',
                                  rawName: 'v-touch:moving',
                                  value: t.movingSwipe,
                                  expression: 'movingSwipe',
                                  arg: 'moving',
                                },
                                {
                                  name: 'touch',
                                  rawName: 'v-touch:end',
                                  value: t.endSwipe,
                                  expression: 'endSwipe',
                                  arg: 'end',
                                },
                              ],
                              ref: 'chatroom',
                              on: { setSwipeX: t.setSwipeX },
                            })
                          : t._e(),
                        t.currentRoom && 2 != t.currentroomStatus
                          ? a('ChatroomClosed', {
                              directives: [
                                {
                                  name: 'touch',
                                  rawName: 'v-touch:start',
                                  value: t.startSwipe,
                                  expression: 'startSwipe',
                                  arg: 'start',
                                },
                                {
                                  name: 'touch',
                                  rawName: 'v-touch:moved',
                                  value: t.movedSwipe,
                                  expression: 'movedSwipe',
                                  arg: 'moved',
                                },
                                {
                                  name: 'touch',
                                  rawName: 'v-touch:moving',
                                  value: t.movingSwipe,
                                  expression: 'movingSwipe',
                                  arg: 'moving',
                                },
                                {
                                  name: 'touch',
                                  rawName: 'v-touch:end',
                                  value: t.endSwipe,
                                  expression: 'endSwipe',
                                  arg: 'end',
                                },
                              ],
                              ref: 'chatroomClose',
                            })
                          : t._e(),
                      ],
                ],
                2
              ),
              t.gameSwitch
                ? t._e()
                : a(
                    'div',
                    { staticClass: 'pre-next-room-wrap next-room-wrap' },
                    [
                      a('img', {
                        attrs: {
                          src: t.nextRoom.backgroundImg,
                          onerror: t.getDefaultUserImg,
                        },
                      }),
                    ]
                  ),
            ],
            1
          ),
        ]);
      },
      Qt = [],
      Jt = (a('a9e3'), a('2ef0')),
      Zt = a.n(Jt);
    function te(t, e) {
      void 0 !== t.changedTouches &&
        1 === t.changedTouches.length &&
        ((e.doSwipe = !0),
        (e.swipe.startX = t.changedTouches[0].pageX),
        (e.swipe.startY = t.changedTouches[0].pageY));
    }
    function ee(t, e) {
      var a = e.swipe,
        n = e.showRoomInfo,
        i = e.showStreamerGiftPage;
      if (
        void 0 !== t.changedTouches &&
        1 === t.changedTouches.length &&
        ((a.distanceX = t.changedTouches[0].pageX - a.startX),
        (a.distanceY = t.changedTouches[0].pageY - a.startY),
        Math.abs(a.distanceX) > Math.abs(a.distanceY))
      ) {
        if ((e.$emit('setSwipeX', !0), a.distanceX < 0))
          return n
            ? void (a.direction = 'left-2')
            : void (a.direction = 'left-1');
        if (!i) return void (a.direction = 'right-1');
        a.direction = 'right-2';
      }
    }
    function ae(t, e) {
      var a = e.swipe,
        n = e.chatroomContent,
        i = e.chatroomWidth,
        s = e.streamerGiftWrap;
      switch (
        ((a.distanceX = t.changedTouches[0].pageX - a.startX), a.direction)
      ) {
        case 'right-1':
          n.style.left = ''.concat(a.distanceX, 'px');
          break;
        case 'left-1':
          f['a'].dispatch('chatroom/actionSetClearScreen'),
            (n.style.left = ''.concat(i + a.distanceX, 'px'));
          break;
        case 'right-2':
          s.style.left = ''.concat(a.distanceX > 0 ? a.distanceX : 0, 'px');
          break;
        case 'left-2':
          if (s.style.left.replace('px', '') <= 0) return;
          s.style.left = ''.concat(i + a.distanceX, 'px');
          break;
        default:
          break;
      }
    }
    function ne(t, e) {
      var a = e.swipe,
        n = e.chatroomContent,
        i = e.chatroomWidth,
        s = e.streamerGiftWrap,
        r = e.initSwipeData,
        o = e.actionSetShowRoomInfo,
        c = e.actionToggleStreamerGiftPage;
      e.$emit('setSwipeX', !1);
      var u = t.changedTouches[0].pageX - a.startX;
      switch (a.direction) {
        case 'right-1':
          if ((r(), Math.abs(u) > Math.abs(i) / 2.5))
            return (n.style.left = ''.concat(i, 'px')), void o(!1);
          (n.style.left = '0px'), o(!0);
          break;
        case 'left-1':
          if ((r(), Math.abs(u) > Math.abs(i) / 2.5))
            return (n.style.left = ''.concat(0, 'px')), void o(!0);
          (n.style.left = ''.concat(i, 'px')), o(!1);
          break;
        case 'right-2':
          if ((r(), u > 0.15 * Math.abs(i)))
            return (s.style.left = ''.concat(i, 'px')), void c(!1);
          (s.style.left = ''.concat(0, 'px')), c(!0);
          break;
        case 'left-2':
          if ((r(), Math.abs(u) > 0.15 * Math.abs(i)))
            return (s.style.left = ''.concat(0, 'px')), void c(!0);
          (s.style.left = ''.concat(i, 'px')), c(!1);
          break;
        default:
          break;
      }
    }
    function ie(t, e) {
      void 0 !== t.changedTouches &&
        1 === t.changedTouches.length &&
        ((e.doSwipe = !0),
        (e.swipe.startX = t.changedTouches[0].pageX),
        (e.swipe.startY = t.changedTouches[0].pageY));
    }
    function se(t, e) {
      var a = e.swipe;
      if (
        void 0 !== t.changedTouches &&
        1 === t.changedTouches.length &&
        ((a.distanceX = t.changedTouches[0].pageX - a.startX),
        (a.distanceY = t.changedTouches[0].pageY - a.startY),
        Math.abs(a.distanceX) < Math.abs(a.distanceY))
      ) {
        if (a.distanceY < 0) return void (a.direction = 'up');
        a.direction = 'down';
      }
    }
    function re(t, e) {
      var a = e.swipe,
        n = e.chatroomIndexWrap;
      e.chatroomIndexHeight;
      (a.distanceY = t.changedTouches[0].pageY - a.startY),
        (n.style.top = ''.concat(a.distanceY, 'px'));
    }
    function oe(t, e) {
      var a = e.swipe,
        n = e.chatroomIndexHeight,
        i = e.actionSetCurrentRoom,
        s = e.chatroomIndexWrap,
        r = t.changedTouches[0].pageY - a.startY;
      if (
        ((e.slide = 'up' === a.direction ? 'slide-up' : 'slide-down'),
        Math.abs(r) > n / 2.5)
      )
        return (
          i(null),
          void e.$nextTick(function () {
            var t = 'up' === a.direction ? 'nextRoom' : 'preRoom';
            i(e[t]), (s.style.top = ''.concat(0, 'px'));
          })
        );
      s.style.top = ''.concat(0, 'px');
    }
    var ce = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return t.loading
          ? t._e()
          : a(
              'div',
              { staticClass: 'chatroom' },
              [
                t.showPlayBtn
                  ? a(
                      'div',
                      {
                        staticClass: 'player-btn',
                        on: { click: t.reloadVideo },
                      },
                      [a('font-awesome-icon', { attrs: { icon: 'play' } })],
                      1
                    )
                  : t._e(),
                [2, 4].includes(t.chargeRoomState)
                  ? a('ChargeRoom', {
                      on: {
                        callSocket: t.wsConnect,
                        socketOffMode: function (e) {
                          t.socketOffMode = e;
                        },
                      },
                    })
                  : a(
                      'div',
                      {
                        directives: [
                          {
                            name: 'touch',
                            rawName: 'v-touch:start',
                            value: t.startSwipe,
                            expression: 'startSwipe',
                            arg: 'start',
                          },
                          {
                            name: 'touch',
                            rawName: 'v-touch:moved',
                            value: t.movedSwipe,
                            expression: 'movedSwipe',
                            arg: 'moved',
                          },
                          {
                            name: 'touch',
                            rawName: 'v-touch:moving',
                            value: t.movingSwipe,
                            expression: 'movingSwipe',
                            arg: 'moving',
                          },
                          {
                            name: 'touch',
                            rawName: 'v-touch:end',
                            value: t.endSwipe,
                            expression: 'endSwipe',
                            arg: 'end',
                          },
                        ],
                        ref: 'chatroom',
                        attrs: { id: 'chatroom' },
                      },
                      [
                        a(
                          'div',
                          {
                            ref: 'chatroomContent',
                            staticClass: 'chatroom-content linear-animation',
                          },
                          [
                            a(
                              'div',
                              {
                                staticClass: 'top-wrap',
                                on: {
                                  click: function (e) {
                                    t.isInputFocus = !1;
                                  },
                                },
                              },
                              [
                                a('ChatroomTopInfo', {
                                  on: {
                                    openModal: t.openModal,
                                    socketOff: t.socketOff,
                                  },
                                }),
                                a(
                                  'div',
                                  { staticClass: 'flow-text-wrap' },
                                  [a('RoomBroadcast'), a('RoomBarrage')],
                                  1
                                ),
                                a(
                                  'div',
                                  {
                                    class: [
                                      'room-msg-wrap',
                                      { 'chat-opacity': t.showChatMsg },
                                    ],
                                  },
                                  [
                                    a('ChatroomMsg', {
                                      on: { openLiveGame: t.openLiveGame },
                                    }),
                                    a('GameIcon', {
                                      staticClass: 'game-icon-wrap',
                                      on: { openLiveGame: t.openLiveGame },
                                    }),
                                  ],
                                  1
                                ),
                              ],
                              1
                            ),
                            a(
                              'div',
                              {
                                class: [
                                  'bottom-wrap',
                                  { 'chat-opacity': t.showChatMsg },
                                ],
                              },
                              [
                                a(
                                  'div',
                                  {
                                    class: [
                                      'input-wrap',
                                      { 'input-wrap-focus': t.isInputFocus },
                                    ],
                                  },
                                  [
                                    t.isInputFocus
                                      ? a(
                                          'SwitchBtn',
                                          {
                                            attrs: { data: t.barrage },
                                            on: {
                                              toggleSwitch: t.toggleSwitch,
                                            },
                                          },
                                          [
                                            t._v(
                                              ' ' +
                                                t._s(t.$t('S_BARRAGE')) +
                                                ' '
                                            ),
                                          ]
                                        )
                                      : t._e(),
                                    a(
                                      'div',
                                      { staticClass: 'input-contet-wrap' },
                                      [
                                        a('img', {
                                          directives: [
                                            {
                                              name: 'show',
                                              rawName: 'v-show',
                                              value: !t.isInputFocus,
                                              expression: '!isInputFocus',
                                            },
                                          ],
                                          staticClass: 'talk-icon',
                                          attrs: {
                                            src: t.$getCdnPath(
                                              '/images/chatroom/bar/bar_ic_talk.svg'
                                            ),
                                          },
                                        }),
                                        a('el-input', {
                                          ref: 'submitInput',
                                          attrs: {
                                            placeholder: t.inputPlaceHolder,
                                          },
                                          on: { focus: t.inputFocus },
                                          nativeOn: {
                                            keyup: function (e) {
                                              return !e.type.indexOf('key') &&
                                                t._k(
                                                  e.keyCode,
                                                  'enter',
                                                  13,
                                                  e.key,
                                                  'Enter'
                                                )
                                                ? null
                                                : t.submitMsg(e);
                                            },
                                          },
                                          model: {
                                            value: t.msg,
                                            callback: function (e) {
                                              t.msg = e;
                                            },
                                            expression: 'msg',
                                          },
                                        }),
                                      ],
                                      1
                                    ),
                                    a(
                                      'el-button',
                                      {
                                        directives: [
                                          {
                                            name: 'show',
                                            rawName: 'v-show',
                                            value: t.isInputFocus,
                                            expression: 'isInputFocus',
                                          },
                                        ],
                                        staticClass: 'submit-btn',
                                        on: { click: t.submitMsg },
                                      },
                                      [
                                        a('img', {
                                          attrs: {
                                            src: t.$getCdnPath(
                                              '/images/common/ic_send.svg'
                                            ),
                                          },
                                        }),
                                      ]
                                    ),
                                    a('RightBottomBtns', {
                                      directives: [
                                        {
                                          name: 'show',
                                          rawName: 'v-show',
                                          value: !t.isInputFocus,
                                          expression: '!isInputFocus',
                                        },
                                      ],
                                    }),
                                  ],
                                  1
                                ),
                              ]
                            ),
                          ]
                        ),
                        a(
                          'div',
                          { staticClass: 'modal' },
                          [
                            a('RightPage', {
                              staticClass: 'chatInfoAnimation',
                            }),
                            a(
                              'transition',
                              { attrs: { name: 'fade' } },
                              [
                                t.AdPageDisplay
                                  ? a('ad-page', {
                                      on: {
                                        setAdPageStatus: t.setAdPageStatus,
                                      },
                                    })
                                  : t._e(),
                              ],
                              1
                            ),
                            a(
                              'transition',
                              { attrs: { name: t.transitionAnimateType } },
                              [
                                t.chatroomModalType
                                  ? a(t.chatroomModalType, {
                                      tag: 'component',
                                      on: {
                                        closeModal: t.closeModal,
                                        openModal: t.openModal,
                                        backToIndex: t.backToIndex,
                                        setAdPageStatus: t.setAdPageStatus,
                                        inputFocus: t.inputFocus,
                                        toggleSwitch: t.toggleSwitch,
                                        openLiveGame: t.openLiveGame,
                                      },
                                    })
                                  : t._e(),
                              ],
                              1
                            ),
                            a(
                              'transition',
                              { attrs: { name: 'slide-up' } },
                              [t.liveGameStatus ? a('LiveGame') : t._e()],
                              1
                            ),
                          ],
                          1
                        ),
                        a('Animation'),
                        t.showVideo
                          ? [
                              t.isVideoMask && 1 === t.getStreamUrl.mode
                                ? a(
                                    'div',
                                    {
                                      staticClass: 'video-mask',
                                      on: { click: t.openSound },
                                    },
                                    [
                                      a('img', {
                                        attrs: {
                                          src: t.$getCdnPath(
                                            '/images/chatroom/opensound.png'
                                          ),
                                        },
                                      }),
                                    ]
                                  )
                                : t._e(),
                              a('VideoPlayer', { staticClass: 'video-wrap' }),
                            ]
                          : t._e(),
                      ],
                      2
                    ),
                a(
                  'transition',
                  { attrs: { name: 'slide-left' } },
                  [
                    t.wholePageType
                      ? a(t.wholePageType, {
                          tag: 'component',
                          attrs: { 'is-paopao': !0 },
                        })
                      : t._e(),
                  ],
                  1
                ),
                t.receiveItem
                  ? a(
                      'tip-msg',
                      {
                        attrs: {
                          title: t.$t('S_SYS_CHARGE_CLOSE_HINT'),
                          content: t.$t('S_SYS_ERRORMSG'),
                        },
                      },
                      [
                        a(
                          'div',
                          {
                            staticClass: 'tip-msg-btns',
                            attrs: { slot: 'btns' },
                            on: {
                              click: function (e) {
                                t.isClose = !1;
                              },
                            },
                            slot: 'btns',
                          },
                          [t._v(' ' + t._s(t.$t('S_OK')) + ' ')]
                        ),
                      ]
                    )
                  : t._e(),
              ],
              1
            );
      },
      ue = [],
      le = (a('c975'), a('1276'), a('d81d'), a('fb6a'), a('e94e')),
      de = {
        data: function () {
          return {
            socketOffMode: null,
            ws: null,
            pingPong: null,
            wsConnStatus: null,
            changeRoomTimeout: null,
            chargeWsTimeout: null,
          };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])(
                Object(V['a'])({}, Object(r['d'])(['user'])),
                Object(r['d'])('chatroom', [
                  'userConnectInfo',
                  'wsOn',
                  'index',
                  'roomCount',
                  'chargeRoomState',
                  'currentRoom',
                ])
              ),
              Object(r['c'])('chatroom', ['getWsUrl', 'getReConnectCount'])
            ),
            Object(r['c'])(['getProgramList'])
          ),
          {},
          {
            socketUrl: function () {
              var t = this.user,
                e = this.getWsUrl,
                a = Object(Y['a'])('session') || '';
              return 0 === t.lott_id
                ? ''
                    .concat(e, '?user=0:0:')
                    .concat(t.lott_id, '&pas=')
                    .concat(a)
                : ''
                    .concat(e, '?user=')
                    .concat(t.identity_id, ':')
                    .concat(t.partner_id, ':')
                    .concat(t.lott_id, '&pas=')
                    .concat(a);
            },
          }
        ),
        beforeDestroy: function () {
          this.actionSetReConnect(0),
            this.clearPingInterval(),
            this.changeRoomTimeout && clearTimeout(this.changeRoomTimeout),
            this.chargeWsTimeout && clearTimeout(this.chargeWsTimeout);
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])(
                Object(V['a'])(
                  {},
                  Object(r['b'])(['actionSetHintInfo', 'actionSetTipMsgInfo'])
                ),
                Object(r['b'])('chatroom', [
                  'actionSetSocketOn',
                  'actionSetUserConnect',
                  'actionSetBarrage',
                  'actionSetBroadcast',
                  'actionSetSysCharge',
                  'actionStopChargeRoom',
                  'actionSetReConnect',
                  'actionSetCurrentRoom',
                ])
              ),
              Object(r['b'])('game', [
                'actionSetCloseTimestamp',
                'actionGetGameResults',
              ])
            ),
            Object(r['b'])('gift', ['actionSetDonateAnime'])
          ),
          {},
          {
            initSocket: function () {
              var t = this;
              window.WebSocket &&
                ((this.ws = new WebSocket(this.socketUrl)),
                (this.socketOffMode = null)),
                (this.ws.onopen = function () {
                  t.actionSetSocketOn(!0);
                }),
                (this.ws.onclose = function () {
                  t.actionSetSocketOn(!1),
                    'user' !== t.socketOffMode && t.getWsUrl && t.initSocket();
                });
            },
            socketOff: function (t) {
              t && ((this.socketOffMode = 'user'), (this.wsConnStatus = null)),
                this.ws && (this.ws.close(), this.clearPingInterval()),
                this.actionSetSocketOn(!1),
                (this.ws = null);
            },
            handleMsg: function () {
              var t = this;
              if (this.ws) {
                var e = this.actionSetHintInfo,
                  a = this.actionSetTipMsgInfo,
                  n = this.actionSetChatUser,
                  i = this.actionSetRoomCount,
                  s = this.actionSetChatMsg,
                  r = this.actionSetRoomIsCharge,
                  o = this.actionSetCurrentRoomStatus,
                  c = this.actionSetEnterList,
                  u = this.actionSetGuardEnter,
                  l = this.confirmUserLevel,
                  d = this.socketOff,
                  m = this.actionGetGameResults,
                  _ = this.actionSetUserConnect,
                  h = this.actionSetCloseTimestamp,
                  f = this.actionSetVipEnterList,
                  p = this.actionSetBarrage,
                  g = this.actionSetBroadcast,
                  S = this.actionSetSysCharge,
                  v = this.actionStopChargeRoom,
                  b = this.actionSetCurrentRoom;
                s(null),
                  this.ws.addEventListener('message', function (C) {
                    if ('pong' !== C.data) {
                      var O = JSON.parse(C.data.split('\n')),
                        T = O.body;
                      switch (O.event) {
                        case 'sys_updateRoomStatus':
                          if ('enter' === T.entry_notice.action) {
                            var E = {
                              nickname: T.entry_notice.username,
                              vipIcon: T.entry_notice.entry_banner.main_badge,
                              banner: T.entry_notice.entry_banner.img_url,
                              otherBadges:
                                T.entry_notice.entry_banner.other_badges,
                            };
                            switch (T.entry_notice.entry_banner.present_type) {
                              case 'B':
                                u(E);
                                break;
                              case 'D':
                                f(E);
                                break;
                              default:
                                c(E);
                                break;
                            }
                          }
                          var I = {
                            onlineGuard: T.guardian_count,
                            guardSum: T.guardian_sum,
                            contributeSum: T.contribute_sum,
                            roomCount: T.room_count,
                          };
                          i(I);
                          var A = O.body.user_infos,
                            y = {};
                          Object.keys(A).map(function (t) {
                            var e = A[t],
                              a = [];
                            return (
                              e &&
                                (a = e.map(function (t) {
                                  return {
                                    gender: t.gender,
                                    headphoto: t.head_photo ? t.head_photo : '',
                                    level: t.level,
                                    nickname: t.lott_alias,
                                    account: t.username,
                                    lottId: t.lott_id,
                                    identityId: t.identity_id,
                                    partnerId: t.partner_id,
                                    badges: t.badges,
                                    frame: t.frame,
                                    isAdmin: t.is_admin,
                                  };
                                })),
                              (y[t] = a),
                              a
                            );
                          }),
                            n(y);
                          break;
                        case 'default_message':
                          switch (O.body.type) {
                            case 'N':
                              s(O);
                              break;
                            default:
                              break;
                          }
                          break;
                        case 'prop_room_barrage':
                          switch (O.body.type) {
                            case 'Barrage':
                              s(O), p(O);
                              break;
                            default:
                              break;
                          }
                          break;
                        case 'prop_all_broadcast':
                          g(O);
                          break;
                        case 'sys_member_notice':
                          switch (T.num) {
                            case 1:
                              l(O.body.text);
                              break;
                            case 2:
                              var w = {
                                time: O.time,
                                body: { type: 'A', content: O.body.text },
                              };
                              s(w);
                              break;
                            case 5:
                              r(3);
                              break;
                            case 8:
                              a({
                                content: t.$t('S_NO_BARRAGE_TIP'),
                                cancelText: t.$t('S_CANCEL'),
                                confirmText: t.$t('S_TO_BUY'),
                                cancelFunc: function () {
                                  return t.actionSetTipMsgInfo(null);
                                },
                                confirmFunc: function () {
                                  t.actionSetTipMsgInfo(null),
                                    Object(at['b'])('liveMall');
                                },
                              });
                              break;
                            case 10:
                              e(T.text);
                              break;
                            default:
                              break;
                          }
                          break;
                        case 'admin_all_broadcast':
                          var R = {
                            time: O.time,
                            body: { type: 'announce', content: O.body.content },
                          };
                          s(R);
                          break;
                        case 'sys_room_endStream':
                          var L = T.type;
                          'C' === L && (d(!0), o(null));
                          break;
                        case 'sys_member_stop':
                          d(!0), r(2), v(T.reason_num);
                          break;
                        case 'streamer_room_charge':
                          if ('1' === T['switch'])
                            return (
                              b(
                                Object(V['a'])(
                                  Object(V['a'])({}, t.currentRoom),
                                  {},
                                  { charge: T.price }
                                )
                              ),
                              _(
                                Object(V['a'])(
                                  Object(V['a'])({}, t.userConnectInfo),
                                  {},
                                  { charge: T.price, leave_second: 12 }
                                )
                              ),
                              void setTimeout(function () {
                                r(1);
                              }, 100)
                            );
                          t.actionSetRoomIsCharge(0);
                          break;
                        case 'sys_room_charge':
                          S(T['switch']);
                          break;
                        case 'game_result_broadcast':
                          m(T);
                          break;
                        case 'game_timestamp_broadcast':
                          var N = {
                            close: T.close_timestamp,
                            now: O.time.slice(0, 10),
                          };
                          h(N);
                          break;
                        case 'control_room_notice':
                          var k = {
                            time: O.time,
                            body: {
                              type: 'KO',
                              KOtype: T.type,
                              nickname: T.user_alias,
                              id: T.user_id,
                              account: T.username,
                              content: T.content,
                            },
                          };
                          s(k);
                          break;
                        case 'sys_member_control':
                          'KO' === T.type &&
                            t.$router
                              .replace({ path: '/' })
                              ['catch'](function (t) {
                                return t;
                              });
                          break;
                        case 'game_bet_room_notice':
                          var P = {
                            time: O.time,
                            body: {
                              type: 'gameBet',
                              orderId: T.order_id,
                              nickname: T.user_alias,
                              roomId: T.room_id,
                              gameName: ct(T.game_name),
                              gameCode: T.game_name,
                              betGold: Object(le['amountFormat'])(T.bet_gold, {
                                zeroStuffing: !0,
                              }),
                              isFollow: T.is_follow,
                            },
                          };
                          s(P);
                          break;
                        case 'game_win_room_notice':
                          var M = {
                            time: O.time,
                            body: {
                              type: 'win',
                              nickname: T.user_alias,
                              roomId: T.room_id,
                              gameName: T.game_name,
                            },
                          };
                          s(M);
                          break;
                        case 'default_room_animate':
                          t.actionSetDonateAnime(T);
                          break;
                        case 'sys_room_notice':
                          var D;
                          switch (T.type) {
                            case 'donate':
                              (D = {
                                time: O.time,
                                body: {
                                  type: T.type,
                                  nickname: T.user_alias,
                                  content: T.content,
                                },
                              }),
                                s(D);
                              break;
                            case 'attention':
                            case 'guardian':
                              (D = {
                                time: O.time,
                                body: {
                                  type: T.type,
                                  nickname: T.user_alias,
                                  roomId: T.room_id,
                                },
                              }),
                                s(D);
                              break;
                            case 'props':
                              (D = {
                                time: O.time,
                                body: {
                                  type: T.type,
                                  nickname: T.user_alias,
                                  content: T.content,
                                },
                              }),
                                s(D);
                              break;
                            default:
                              break;
                          }
                          break;
                        case 'sys_room_update_info':
                          if ('sum_contribute' === T.field) {
                            var j = Object(V['a'])(
                              Object(V['a'])({}, t.roomCount),
                              {},
                              { contributeSum: T.value }
                            );
                            i(j);
                          }
                          break;
                        case 'sys_member_ko':
                          t.actionSetHintInfo(T.text), t.backToIndex();
                          break;
                        default:
                          break;
                      }
                    } else t.wsConnStatus = 'pong';
                  });
              }
            },
            pingPongConnect: function () {
              this.clearPingInterval(),
                (this.pingPong = setInterval(this.sendPing, 2e4));
            },
            sendPing: function () {
              if ('ping' === this.wsConnStatus)
                return 3 === this.chargeRoomState
                  ? void this.chargeWsLost()
                  : void this.freeWsLost();
              'reConnect' === this.wsConnStatus
                ? this.actionSetReConnect(this.getReConnectCount)
                : this.actionSetReConnect(0),
                this.ws.send('ping'),
                (this.wsConnStatus = 'ping');
            },
            chargeWsLost: function () {
              var t = this;
              this.clearPingInterval(),
                (this.chargeWsTimeout = setTimeout(function () {
                  'pong' !== t.wsConnStatus
                    ? (t.actionSetHintInfo(t.$t('S_CONNECT_ERROR')),
                      (t.changeRoomTimeout = setTimeout(t.toOtherRoom, 3e3)))
                    : (t.pingPong = setInterval(t.sendPing, 2e4));
                }, 6e4));
            },
            freeWsLost: function () {
              if (this.getReConnectCount > 1)
                return (
                  this.clearPingInterval(),
                  this.actionSetHintInfo(this.$t('S_CONNECT_ERROR')),
                  void (this.changeRoomTimeout = setTimeout(
                    this.toOtherRoom,
                    3e3
                  ))
                );
              (this.wsConnStatus = 'reConnect'),
                this.actionSetReConnect(this.getReConnectCount + 1),
                this.clearPingInterval(),
                this.socketOff();
            },
            clearPingInterval: function () {
              this.pingPong &&
                (clearInterval(this.pingPong), (this.pingPong = null));
            },
            toOtherRoom: function () {
              var t = this,
                e = this.index,
                a = this.getProgramList,
                n = a.length,
                i = Math.floor(Math.random() * n);
              e !== i
                ? ((this.wsConnStatus = null),
                  this.actionSetCurrentRoom(null),
                  this.$nextTick(function () {
                    t.actionSetCurrentRoom(t.getProgramList[i]);
                  }))
                : this.toOtherRoom();
            },
          }
        ),
      },
      me = {
        computed: Object(V['a'])(
          {},
          Object(r['c'])('game', {
            gameSwitch: 'getGameSwitch',
            gameName: 'getGameName',
            gameUrls: 'getGameUrls',
            gameToken: 'getGameToken',
          })
        ),
        beforeDestroy: function () {
          this.actionSetGameName('');
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            {},
            Object(r['b'])('game', [
              'actionSwitchGame',
              'actionSetGameName',
              'actionSetTokenInterval',
            ])
          ),
          {},
          {
            openLiveGame: function (t) {
              var e = this;
              this.actionSetGameName(t);
              var a = !(!this.gameToken || !this.gameUrls[t]);
              if (a) this.actionSwitchGame(!0);
              else {
                this.getGameToken(t),
                  this.actionSwitchGame(!0),
                  this.actionSetTokenInterval('clear');
                var n = setInterval(function () {
                  e.gameSwitch || e.getGameToken(t);
                }, 3e5);
                this.actionSetTokenInterval(n);
              }
            },
            getGameToken: function (t) {
              at['a'].jsToAppMessage({
                event: 'EVENT_GET_GAME_URL_TOKEN',
                data: {
                  kind: 4,
                  code: t,
                  vendor_name: 'pao_ly',
                  from: window.location.href,
                },
              });
            },
          }
        ),
      },
      _e = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { staticClass: 'switch-wrap', on: { click: t.toggleSwitch } },
          [
            a(
              'div',
              { staticClass: 'switch-body', class: { active: t.data } },
              [
                a('span', { staticClass: 'text' }, [t._t('default')], 2),
                a('div', { staticClass: 'circle' }),
              ]
            ),
          ]
        );
      },
      he = [],
      fe = {
        props: { data: { type: Boolean, default: !1 } },
        computed: {
          isOpen: function () {
            return this.data ? this.$t('S_OPEN') : this.$t('S_CLOSE');
          },
        },
        methods: {
          toggleSwitch: function () {
            this.$emit('toggleSwitch', !this.data);
          },
        },
      },
      pe = fe,
      ge = (a('33d3'), Object(z['a'])(pe, _e, he, !1, null, 'd20475b8', null)),
      Se = ge.exports,
      ve = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          {
            class: [
              'main-wrap',
              { 'is-model': t.isModel },
              { 'for-app': t.forApp },
            ],
          },
          [
            t.isModel
              ? t._e()
              : a('MainHeader', { attrs: { title: t.$t('S_TASK_WALL') } }),
            t.isModel
              ? a('div', {
                  staticClass: 'mask',
                  on: {
                    click: function (e) {
                      return t.$emit('closeModal');
                    },
                  },
                })
              : t._e(),
            a(
              'div',
              { staticClass: 'top-info-wrap' },
              [
                a(
                  'el-tabs',
                  {
                    class: { dark: t.isModel },
                    attrs: { value: t.activeType, stretch: '' },
                    on: {
                      'tab-click': function (e) {
                        t.activeType = e.name;
                      },
                    },
                  },
                  t._l(t.tabItems, function (t) {
                    return a('el-tab-pane', {
                      key: t.key,
                      attrs: { label: t.label, name: t.key },
                    });
                  }),
                  1
                ),
              ],
              1
            ),
            a(
              'div',
              { staticClass: 'content' },
              [
                'activity' === t.activeType
                  ? [
                      t.getActivitiesList.length
                        ? a(
                            'div',
                            { staticClass: 'activity-content-wrap' },
                            t._l(t.getActivitiesList, function (e) {
                              return a(
                                'div',
                                {
                                  key: e.id,
                                  staticClass: 'activity-content-item',
                                  on: {
                                    click: function (a) {
                                      return t.setActivityUrl(e);
                                    },
                                  },
                                },
                                [
                                  a('img', { attrs: { src: e.image } }),
                                  a(
                                    'div',
                                    { staticClass: 'time-wrap' },
                                    [
                                      a('font-awesome-icon', {
                                        attrs: { icon: ['far', 'clock'] },
                                      }),
                                      e.end_time
                                        ? a('span', [
                                            t._v(
                                              ' ' +
                                                t._s(e.start_time) +
                                                ' ~ ' +
                                                t._s(e.end_time) +
                                                ' '
                                            ),
                                          ])
                                        : a('span', [
                                            t._v(t._s(t.$t('S_FROM_NOW'))),
                                          ]),
                                    ],
                                    1
                                  ),
                                ]
                              );
                            }),
                            0
                          )
                        : a('div', { staticClass: 'no-data' }),
                    ]
                  : t._e(),
                'task' === t.activeType
                  ? [
                      a('div', { staticClass: 'task-content-wrap' }, [
                        a(
                          'div',
                          { staticClass: 'active-bar-wrap' },
                          [
                            a('div', { staticClass: 'today-active' }, [
                              t._v(
                                ' ' +
                                  t._s(
                                    t.$t('S_WEEK_LIVENESS') +
                                      '：' +
                                      t.weekLiveness
                                  ) +
                                  ' '
                              ),
                            ]),
                            a(
                              'div',
                              { staticClass: 'reach-award' },
                              t._l(t.livenessAward, function (e, n) {
                                return a(
                                  'div',
                                  {
                                    key: e.quest_key,
                                    class: t.awardClass(e),
                                    on: {
                                      click: function (a) {
                                        return t.gotoTask(e, n);
                                      },
                                    },
                                  },
                                  [
                                    a('font-awesome-icon', {
                                      attrs: { icon: 'gift' },
                                    }),
                                    a('div', [t._v(t._s(e.target_value))]),
                                  ],
                                  1
                                );
                              }),
                              0
                            ),
                            a('el-progress', {
                              attrs: {
                                percentage: t.livenessPercentage,
                                color: '#FFBC24',
                                'show-text': !1,
                              },
                            }),
                            a('div', { staticClass: 'bar' }),
                          ],
                          1
                        ),
                        a(
                          'div',
                          { staticClass: 'task-wrap' },
                          t._l(t.taskWall, function (e, n) {
                            return a('div', { key: n, staticClass: 'task' }, [
                              a('div', [
                                a('div', { staticClass: 'task-name' }, [
                                  t._v(t._s(e.name)),
                                ]),
                                a('div', { staticClass: 'task-content' }, [
                                  t._v(' ' + t._s(e.content) + ' '),
                                ]),
                                e.diamond_points || e.liveness
                                  ? a('div', { staticClass: 'task-award' }, [
                                      a('div', {
                                        staticClass: 'task-award-label',
                                        domProps: {
                                          innerHTML: t._s(
                                            t
                                              .$t('S_ADD_EXP')
                                              .replace(
                                                '%n',
                                                '<span>' +
                                                  e.diamond_points +
                                                  '</span>'
                                              )
                                          ),
                                        },
                                      }),
                                      a('div', {
                                        staticClass: 'task-award-label',
                                        domProps: {
                                          innerHTML: t._s(
                                            t
                                              .$t('S_ADD_LIVENESS')
                                              .replace(
                                                '%n',
                                                '<span>' +
                                                  e.liveness +
                                                  '</span>'
                                              )
                                          ),
                                        },
                                      }),
                                    ])
                                  : t._e(),
                              ]),
                              a('div', [
                                a(
                                  'div',
                                  {
                                    class: [
                                      'go-to-btn',
                                      {
                                        'is-done':
                                          1 === e.done &&
                                          !t.hasChildTask(e.quest_key),
                                      },
                                      {
                                        done:
                                          2 === e.done &&
                                          !t.hasChildTask(e.quest_key),
                                      },
                                    ],
                                    on: {
                                      click: function (a) {
                                        return t.gotoTask(e, n);
                                      },
                                    },
                                  },
                                  [
                                    a('span', [
                                      t._v(
                                        ' ' +
                                          t._s(t.taskStatus(e, e.done)) +
                                          ' '
                                      ),
                                    ]),
                                    [-1, 0].includes(e.done) ||
                                    t.hasChildTask(e.quest_key)
                                      ? a('font-awesome-icon', {
                                          attrs: { icon: 'chevron-right' },
                                        })
                                      : t._e(),
                                  ],
                                  1
                                ),
                                [-1, 0].includes(e.done) ||
                                t.hasChildTask(e.quest_key)
                                  ? a('div', { staticClass: 'status' }, [
                                      t._v(
                                        ' ' +
                                          t._s(
                                            e.progress + '/' + e.target_count
                                          ) +
                                          ' '
                                      ),
                                    ])
                                  : t._e(),
                              ]),
                            ]);
                          }),
                          0
                        ),
                      ]),
                    ]
                  : t._e(),
              ],
              2
            ),
            a(
              'transition',
              { attrs: { name: 'slide-left' } },
              [
                t.getActivityUrl ? a('ActivityPage') : t._e(),
                t.pageType
                  ? a(t.pageType, {
                      tag: 'component',
                      attrs: { 'is-paopao': !0, 'is-model': t.isModel },
                      on: {
                        refresh: t.getMyTask,
                        goBack: function (e) {
                          t.pageType = '';
                        },
                      },
                    })
                  : t._e(),
              ],
              1
            ),
          ],
          1
        );
      },
      be = [],
      Ce = (a('e25e'), a('d3b7'), a('a3be')),
      Oe = function () {
        return Object(x['a'])('get', Ce['W']);
      },
      Te = function () {
        return Object(x['a'])('get', Ce['r']);
      },
      Ee = function () {
        return Object(x['a'])('get', ''.concat(Ce['k'], '/records'));
      },
      Ie = function (t) {
        return Object(x['a'])('post', Ce['k'], t);
      },
      Ae = function (t) {
        return Object(x['a'])('get', ''.concat(Ce['O'], '/').concat(t));
      },
      ye = function () {
        return Object(x['a'])('get', Ce['j']);
      },
      we = a('5061'),
      Re = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return t.taskData
          ? a(
              'div',
              { staticClass: 'main-wrap' },
              [
                a('MainHeader', {
                  attrs: {
                    title: t.$t(t.fullAward.name),
                    'left-btn-func': t.leftBtnFunc,
                  },
                }),
                a('div', { staticClass: 'content' }, [
                  a('div', { staticClass: 'task-info' }, [
                    a('div', { staticClass: 'name' }, [
                      t._v(t._s(t.fullAward.content)),
                    ]),
                    a('div', { staticClass: 'range' }, [
                      t._v(
                        ' ' +
                          t._s(t.$t('S_ACTIVITY_TIME_RANGE')) +
                          '：' +
                          t._s(t.$t('S_NO_LIMIT_DATE')) +
                          ' '
                      ),
                    ]),
                  ]),
                  a('div', { staticClass: 'task-content' }, [
                    a('div', { staticClass: 'award-field' }, [
                      a('div', { staticClass: 'card-pic' }, [
                        a('img', {
                          attrs: {
                            src: t.$getCdnPath(
                              '/images/mainSite/task/card_charm.svg'
                            ),
                          },
                        }),
                      ]),
                    ]),
                    a('div', { staticClass: 'task-tip' }, [
                      t._v(
                        ' ' + t._s(t.$t('S_FIN_TASK_GET_RANDOM_ITEM')) + ' '
                      ),
                    ]),
                    a(
                      'div',
                      {
                        class: [
                          'receive-btn',
                          { 'is-done': 1 === t.fullAward.done },
                        ],
                        on: { click: t.getLastAward },
                      },
                      [
                        t._v(
                          ' ' +
                            t._s(
                              2 === t.fullAward.done
                                ? t.$t('S_RECEIVED')
                                : t.$t('S_RECEIVE')
                            ) +
                            ' '
                        ),
                      ]
                    ),
                    a(
                      'div',
                      { staticClass: 'task-list-wrap' },
                      t._l(t.taskList, function (e, n) {
                        return a(
                          'div',
                          {
                            key: n,
                            staticClass: 'task-item',
                            on: {
                              click: function (a) {
                                return t.gotoTask(e, n);
                              },
                            },
                          },
                          [
                            a('div', [
                              a('div', { staticClass: 'name' }, [
                                t._v(t._s(e.name)),
                              ]),
                              a('div', { staticClass: 'info' }, [
                                t._v(t._s(e.content)),
                              ]),
                            ]),
                            a('div', [
                              a(
                                'div',
                                {
                                  class: [
                                    'go-to-btn',
                                    { 'is-done': 1 === e.done },
                                    { done: 2 === e.done },
                                  ],
                                },
                                [
                                  a('span', [t._v(t._s(t.taskStatus(e)))]),
                                  [-1, 0].includes(e.done)
                                    ? a('font-awesome-icon', {
                                        attrs: { icon: 'chevron-right' },
                                      })
                                    : t._e(),
                                ],
                                1
                              ),
                            ]),
                          ]
                        );
                      }),
                      0
                    ),
                  ]),
                ]),
              ],
              1
            )
          : t._e();
      },
      Le = [],
      Ne = {
        components: { MainHeader: we['a'] },
        props: { isModel: { type: Boolean, default: !1 } },
        data: function () {
          return { isAjax: !1, taskData: null, missionIsclosed: !1 };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            {},
            Object(r['c'])({ wholePageType: 'getWholePageType' })
          ),
          {},
          {
            taskList: function () {
              return this.taskData.slice(1);
            },
            fullAward: {
              get: function () {
                return this.taskData[0];
              },
              set: function (t) {
                this.$set(this.taskData, 0, t);
              },
            },
          }
        ),
        created: function () {
          this.initFirstMeet();
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              {},
              Object(r['b'])(['actionSetWholePageType', 'actionSetHintInfo'])
            ),
            Object(r['b'])('chatroom', ['actionSetChatroomModalType'])
          ),
          {},
          {
            leftBtnFunc: function () {
              this.isModel
                ? (this.missionIsclosed && this.$emit('refresh'),
                  this.$emit('goBack'))
                : Object(Y['a'])('appUse')
                ? at['a'].jsToAppMessage({ event: 'EVENT_EXIT', data: '' })
                : this.$router.back();
            },
            initFirstMeet: function () {
              var t = this;
              Te().then(function (e) {
                var a = e.data;
                '0' === a.error_code && (t.taskData = a.result);
              });
            },
            taskStatus: function (t) {
              var e = {
                FirstBuyDiamond: this.$t('S_TO_EXCHANGE'),
                FirstDonate: this.$t('S_TO_GIFT'),
                CumulativeDonate: this.$t('S_TO_GIFT'),
                FirstGuardian: this.$t('S_GO_GUARD'),
              };
              switch (t.done) {
                case 1:
                  return this.$t('S_FINISH');
                case 2:
                  return this.$t('S_RECEIVED');
                default:
                  return e[t.quest_key] ? e[t.quest_key] : this.$t('S_GO_TASK');
              }
            },
            gotoTask: function (t, e) {
              var a = this;
              Te().then(function (n) {
                var i = n.data;
                if ('0' !== i.error_code)
                  (a.missionIsclosed = !0),
                    a.actionSetHintInfo(
                      ''.concat(i.error_text, '(').concat(i.error_code, ')')
                    );
                else {
                  var s = t.done,
                    r = t.quest_key;
                  if (2 === s) return;
                  if (1 === s)
                    return void a.getRewardItem(r, function () {
                      a.taskList[e].done = 2;
                    });
                  var o = ['FirstBuyDiamond'];
                  switch (
                    (at['a'].jsToAppMessage({
                      event: 'EVENT_QUEST',
                      data: r,
                      isUse: !a.isModel && !o.includes(r),
                    }),
                    r)
                  ) {
                    case 'FirstBuyDiamond':
                      Object(at['b'])('exchangeDiamond');
                      break;
                    case 'FirstDonate':
                    case 'CumulativeDonate':
                    case 'FirstGuardian':
                      a.isModel &&
                        ('FirstGuardian' === r
                          ? a.actionSetChatroomModalType('showOpenGuard')
                          : a.actionSetChatroomModalType('showGiftList'),
                        a.actionSetWholePageType(null));
                      break;
                    default:
                      break;
                  }
                }
              });
            },
            getLastAward: function () {
              var t = this;
              1 === this.fullAward.done &&
                this.getRewardItem('FirstMeet', function () {
                  t.fullAward = Object(V['a'])(
                    Object(V['a'])({}, t.fullAward),
                    {},
                    { done: 2 }
                  );
                });
            },
            getRewardItem: function (t, e) {
              var a = this;
              this.isAjax ||
                ((this.isAjax = !0),
                Ae(t)
                  .then(function (t) {
                    var n = t.data;
                    if ('0' === n.error_code && 'success' === n.result)
                      return (
                        e && e(),
                        void a.actionSetHintInfo(a.$t('S_RECEIVE_SUCCESS'))
                      );
                    a.actionSetHintInfo(
                      ''.concat(n.error_text, '(').concat(n.error_code, ')')
                    );
                  })
                  ['finally'](function () {
                    a.isAjax = !1;
                  }));
            },
          }
        ),
      },
      ke = Ne,
      Pe = (a('bbdb'), Object(z['a'])(ke, Re, Le, !1, null, '74d45202', null)),
      Me = Pe.exports,
      De = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { class: ['main-wrap'] },
          [
            a('MainHeader', {
              attrs: {
                title: t.$t('S_DAILY_SIGN_BUBBLE'),
                'left-btn-func': t.leftBtnFunc,
              },
            }),
            a('div', {
              directives: [
                {
                  name: 'show',
                  rawName: 'v-show',
                  value: !t.signData.month,
                  expression: '!signData.month',
                },
              ],
              staticClass: 'content white',
            }),
            a(
              'div',
              {
                directives: [
                  {
                    name: 'show',
                    rawName: 'v-show',
                    value: t.signData.month,
                    expression: 'signData.month',
                  },
                ],
                staticClass: 'content',
              },
              [
                a('div', { staticClass: 'task-info' }, [
                  a('div', { staticClass: 'name' }, [
                    t._v(
                      ' ' +
                        t._s(
                          t
                            .$t('S_BUBBLE_MONTH_SIGNIN')
                            .replace('%n', t.signData.month)
                        ) +
                        ' '
                    ),
                  ]),
                  a('div', { staticClass: 'range' }, [
                    t._v(
                      ' ' +
                        t._s(
                          t.$t('S_ACTIVITY_TIME_RANGE') +
                            '：' +
                            t.signData.start_time +
                            '~' +
                            t.signData.end_time
                        ) +
                        ' '
                    ),
                  ]),
                ]),
                a('div', { staticClass: 'task-content' }, [
                  t.signData.diamond_reward || t.signData.diamond_point_reward
                    ? a('div', { staticClass: 'card-pic ex-diamond' }, [
                        a('img', { attrs: { src: t.thumbnail } }),
                      ])
                    : a('div', { staticClass: 'award-field' }, [
                        a('div', { staticClass: 'card-pic' }, [
                          a('img', { attrs: { src: t.signData.thumbnail } }),
                        ]),
                        a('div', { staticClass: 'card-info' }, [
                          a('div', [t._v(t._s(t.signData.reward_name + '：'))]),
                          a('div', [t._v(t._s(t.signData.reward_content))]),
                        ]),
                      ]),
                  a('div', { staticClass: 'task-tip' }, [
                    t._v(' ' + t._s(t.taskTip) + ' '),
                  ]),
                  a(
                    'div',
                    {
                      class: [
                        'receive-btn',
                        { enabled: 1 === t.signData.is_avaliable },
                      ],
                      on: { click: t.getRewardItem },
                    },
                    [t._v(' ' + t._s(t.$t('S_RECEIVE')) + ' ')]
                  ),
                  a(
                    'div',
                    { staticClass: 'daily-field' },
                    t._l(t.filterData, function (e, n) {
                      return a(
                        'div',
                        {
                          key: n,
                          staticClass: 'date-item',
                          on: {
                            click: function (a) {
                              return t.onSignIn(e, n);
                            },
                          },
                        },
                        [
                          a('div', { staticClass: 'date' }, [
                            t._v(
                              ' ' + t._s(t._f('monthDate')(e.signin_date)) + ' '
                            ),
                          ]),
                          a('img', {
                            staticClass: 'icon',
                            attrs: { src: e.src },
                          }),
                          a('div', { class: t.btnClass(e) }, [
                            t._v(' ' + t._s(t.statusText(e.status)) + ' '),
                          ]),
                        ]
                      );
                    }),
                    0
                  ),
                ]),
              ]
            ),
            t.receiveItem
              ? a(
                  'tip-msg',
                  {
                    attrs: {
                      title: t.$t('S_RECEIVE_SUCCESS'),
                      content: t
                        .$t('S_TODAY_RECEIVE_WHAT')
                        .replace('%n', t.receiveItem),
                    },
                  },
                  [
                    a(
                      'div',
                      {
                        staticClass: 'tip-msg-btns',
                        attrs: { slot: 'btns' },
                        on: {
                          click: function (e) {
                            t.receiveItem = '';
                          },
                        },
                        slot: 'btns',
                      },
                      [t._v(' ' + t._s(t.$t('S_OK')) + ' ')]
                    ),
                  ]
                )
              : t._e(),
          ],
          1
        );
      },
      je = [],
      Ge = (a('0d03'), a('b166')),
      $e = a('7bb4'),
      Ue = a('2407'),
      xe = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          {
            class: [
              'tip-msg-mask',
              { 'no-background': t.content === t.$t('S_SURE_TO_LEAVE') },
            ],
          },
          [
            a(
              'div',
              { staticClass: 'tip-msg-wrap' },
              [
                t._t('title', [
                  t.title
                    ? a('div', { staticClass: 'tip-msg-title' }, [
                        t._v(' ' + t._s(t.title) + ' '),
                      ])
                    : t._e(),
                ]),
                t._t('content', [
                  a(
                    'div',
                    {
                      class: [
                        'tip-msg-content',
                        { 'no-title': !t.$slots.title && !t.title },
                      ],
                    },
                    [t._v(' ' + t._s(t.content) + ' ')]
                  ),
                ]),
                t._t('btns', [
                  a('div', { staticClass: 'tip-msg-btns' }, [
                    a(
                      'div',
                      {
                        on: {
                          click: function (e) {
                            return t.$emit('cancelFunc');
                          },
                        },
                      },
                      [t._v(t._s(t.cancelText || t.$t('S_CANCEL')))]
                    ),
                    a(
                      'div',
                      {
                        on: {
                          click: function (e) {
                            return t.$emit('confirmFunc');
                          },
                        },
                      },
                      [t._v(t._s(t.confirmText || t.$t('S_OK')) + ' ')]
                    ),
                  ]),
                ]),
              ],
              2
            ),
          ]
        );
      },
      Fe = [],
      He = {
        props: {
          title: { type: String, default: '' },
          content: { type: String, default: '' },
          cancelText: { type: String, default: '' },
          confirmText: { type: String, default: '' },
        },
      },
      Be = He,
      We = (a('da61'), Object(z['a'])(Be, xe, Fe, !1, null, '07ba53cc', null)),
      Ve = We.exports,
      Ye = {
        filters: {
          monthDate: function (t) {
            return Object(Ge['a'])(t, 'MM/dd');
          },
        },
        components: { MainHeader: we['a'], tipMsg: Ve },
        props: { isModel: { type: Boolean, default: !1 } },
        data: function () {
          return {
            isFilter: !1,
            isAjax: !1,
            receiveItem: '',
            signData: {},
            propsList: [],
            nowDate: Object(Ue['b'])(
              Object(Ue['a'])('', 'yyyy-MM-dd 00:00:00')
            ),
            missionIsclosed: !1,
          };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            {},
            Object(r['c'])({ wholePageType: 'getWholePageType' })
          ),
          {},
          {
            filterData: function () {
              var t = this;
              return this.signData.sign_data
                ? this.signData.sign_data.filter(function (e) {
                    return !t.isDisabled(e.signin_date);
                  })
                : [];
            },
            taskTip: function () {
              return this.signData.diamond_reward
                ? ''.concat(
                    this.$t('S_DAILY_SIGN_BUBBLE_ARTICLE_EX_DM').replace(
                      '%n',
                      ''
                        .concat(this.signData.diamond_reward)
                        .concat(this.$t('S_DIAMOND'))
                    )
                  )
                : this.signData.diamond_point_reward
                ? ''.concat(
                    this.$t('S_DAILY_SIGN_BUBBLE_ARTICLE_EX_DM').replace(
                      '%n',
                      ''
                        .concat(this.signData.diamond_point_reward)
                        .concat(this.$t('S_EXPERIENCE'))
                    )
                  )
                : ''.concat(
                    this.$t('S_DAILY_SIGN_BUBBLE_ARTICLE').replace(
                      '%n',
                      this.signData.reward_name
                    )
                  );
            },
            thumbnail: function () {
              return this.signData.diamond_reward
                ? '/images/mainSite/common/ic_diamond_b.png'
                : this.signData.diamond_point_reward
                ? '/images/mainSite/common/ic_exp.png'
                : this.signData.thumbnail;
            },
          }
        ),
        created: function () {
          var t = this;
          this.getData(),
            Object($e['h'])().then(function (e) {
              var a = e.data;
              '0' === a.error_code && (t.propsList = a.result.props);
            });
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            {},
            Object(r['b'])(['actionSetWholePageType', 'actionSetHintInfo'])
          ),
          {},
          {
            isDisabled: function (t) {
              var e = [
                16436448e5, 16437312e5, 16438176e5, 1643904e6, 16439904e5,
                16440768e5, 16441632e5, 16442496e5,
              ].includes(t);
              return e && (this.isFilter = !0), e;
            },
            statusText: function (t) {
              return 0 === t
                ? this.$t('S_RECEIVE')
                : t < 0
                ? this.$t('S_REISSUE')
                : this.$t('S_RECEIVED');
            },
            leftBtnFunc: function () {
              this.isModel
                ? (this.missionIsclosed && this.$emit('refresh'),
                  this.$emit('goBack'))
                : Object(Y['a'])('appUse')
                ? at['a'].jsToAppMessage({ event: 'EVENT_EXIT', data: '' })
                : this.$router.back();
            },
            getData: function () {
              var t = this;
              Ee().then(function (e) {
                var a = e.data;
                if ('0' === a.error_code)
                  return (
                    (t.signData = a.result),
                    void (t.signData = Object(V['a'])(
                      Object(V['a'])({}, t.signData),
                      {},
                      {
                        reward_name: t.signData.reward_name.replace('/n', ''),
                        sign_data: t.signData.sign_data.map(function (e) {
                          var a = Date.parse(
                              Object(Ue['b'])(
                                ''.concat(e.signin_date, ' 00:00:00')
                              )
                            ),
                            n = '';
                          return (
                            e.prop_id_reward &&
                              (n = t.$getCdnPath(
                                '/images/mainSite/common/ic_card_preset.png'
                              )),
                            e.diamond_reward &&
                              (n = t.$getCdnPath(
                                '/images/mainSite/common/ic_diamond_b.png'
                              )),
                            e.diamond_point_reward &&
                              (n = t.$getCdnPath(
                                '/images/mainSite/common/ic_exp.png'
                              )),
                            e.liveness_reward &&
                              (n = t.$getCdnPath(
                                '/images/mainSite/common/ic_jp.png'
                              )),
                            Object(V['a'])(
                              Object(V['a'])({}, e),
                              {},
                              { signin_date: a, src: n }
                            )
                          );
                        }),
                      }
                    ))
                  );
                t.actionSetHintInfo(
                  ''.concat(a.error_text, '(').concat(a.error_code, ')')
                );
              });
            },
            btnClass: function (t) {
              return [
                'status',
                { reissue: t.status < 0 },
                { receive: 0 === t.status },
                { disabled: t.signin_date > this.nowDate },
              ];
            },
            onSignIn: function (t, e) {
              var a = this,
                n = this.isFilter ? e + 8 : e;
              if (!(t.signin_date > this.nowDate || this.isAjax))
                if ([1, 2].includes(t.status))
                  this.actionSetHintInfo(this.$t('S_NO_NEED_TO_SIGN_UP'));
                else {
                  var i = this.signData.sign_data.filter(function (t, e) {
                    return e > n && -1 === t.status;
                  }).length;
                  -1 === t.status && i
                    ? this.actionSetHintInfo(this.$t('S_REISSUE_ARTICLE'))
                    : ((this.isAjax = !0),
                      Ie({ status: 0 === t.status ? 1 : 2 })
                        .then(function (t) {
                          var e = t.data;
                          if ('0' !== e.error_code)
                            (a.missionIsclosed = !0),
                              a.actionSetHintInfo(
                                ''
                                  .concat(e.error_text, '(')
                                  .concat(e.error_code, ')')
                              );
                          else {
                            var n = e.result,
                              i = n.diamond_point_reward,
                              s = n.diamond_reward,
                              r = n.prop_id_reward,
                              o = n.prop_amount;
                            if (
                              (i &&
                                (a.receiveItem = ''
                                  .concat(i)
                                  .concat(a.$t('S_EXPERIENCE'))),
                              s &&
                                (a.receiveItem = ''
                                  .concat(s)
                                  .concat(a.$t('S_DIAMOND'))),
                              r)
                            ) {
                              var c = a.propsList.filter(function (t) {
                                return t.id === r;
                              })[0].name;
                              a.receiveItem = ''
                                .concat(c.replace('/n', ''), ' * ')
                                .concat(o);
                            }
                            a.getData();
                          }
                        })
                        ['finally'](function () {
                          a.isAjax = !1;
                        }));
                }
            },
            getRewardItem: function () {
              var t = this;
              1 !== this.signData.is_avaliable ||
                this.isAjax ||
                ((this.isAjax = !0),
                Ae('DailySignIn')
                  .then(function (e) {
                    var a = e.data;
                    if ('0' === a.error_code && 'success' === a.result)
                      return (
                        (t.signData.is_avaliable = 2),
                        void t.actionSetHintInfo(t.$t('S_RECEIVE_SUCCESS'))
                      );
                    t.actionSetHintInfo(
                      ''.concat(a.error_text, '(').concat(a.error_code, ')')
                    );
                  })
                  ['finally'](function () {
                    t.isAjax = !1;
                  }));
            },
          }
        ),
      },
      Ke = Ye,
      Xe = (a('c301'), Object(z['a'])(Ke, De, je, !1, null, '2acfb247', null)),
      qe = Xe.exports,
      ze = {
        components: {
          MainHeader: we['a'],
          ActivityPage: Ft,
          FirstMeetTask: Me,
          dailyTask: qe,
        },
        data: function () {
          return {
            activeType: 'task',
            tabItems: [
              { key: 'task', label: this.$t('S_TASK') },
              { key: 'activity', label: this.$t('S_ACTIVITY') },
            ],
            livenessAward: [],
            taskWall: [],
            weekLiveness: 0,
            isAjax: !1,
            pageType: '',
          };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              {},
              Object(r['c'])('chatroom', {
                chatroomModalType: 'getChatroomModalType',
              })
            ),
            Object(r['c'])(['getActivitiesList', 'getActivityUrl'])
          ),
          {},
          {
            livenessPercentage: function () {
              return (this.weekLiveness / 450) * 100;
            },
            isModel: function () {
              return (
                'taskWall' === this.chatroomModalType ||
                'Y' === this.$route.query.model
              );
            },
            forApp: function () {
              return 'Y' === this.$route.query.model;
            },
          }
        ),
        created: function () {
          this.getMyTask(), this.actionGetActivitiesList();
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            {},
            Object(r['b'])([
              'actionSetWholePageType',
              'actionSetHintInfo',
              'actionGetActivitiesList',
              'actionSetActivityUrl',
            ])
          ),
          {},
          {
            awardClass: function (t) {
              return [
                'gift-item',
                { 'active-award': this.weekLiveness >= t.target_value },
                { done: 2 === t.done },
              ];
            },
            getMyTask: function () {
              var t = this;
              Oe().then(function (e) {
                var a = e.data;
                '0' === a.error_code &&
                  ((t.weekLiveness = a.result.week_liveness),
                  (t.taskWall = a.result.quest_list.map(function (t) {
                    return Object(V['a'])(
                      Object(V['a'])({}, t),
                      {},
                      {
                        progress:
                          'ViewStream' === t.quest_key
                            ? parseInt(t.progress / 60, 10)
                            : t.progress,
                      }
                    );
                  })),
                  (t.livenessAward = a.result.liveness_quest_list));
              });
            },
            hasChildTask: function (t) {
              return ['FirstMeet', 'DailySignIn'].includes(t);
            },
            taskStatus: function (t) {
              var e = {
                ChatStream: this.$t('S_GO_MSG'),
                ViewStream: this.$t('S_GO_WATCH'),
                ShareStream: this.$t('S_GO_SHARE'),
                DailySignIn: this.$t('S_GO_SIGN'),
                FirstMeet: this.$t('S_GO_ACTIVITY'),
              };
              if (this.hasChildTask(t.quest_key))
                return e[t.quest_key] ? e[t.quest_key] : this.$t('S_GO_TASK');
              switch (t.done) {
                case 1:
                  return this.$t('S_FINISH');
                case 2:
                  return this.$t('S_RECEIVED');
                default:
                  return e[t.quest_key] ? e[t.quest_key] : this.$t('S_GO_TASK');
              }
            },
            gotoTask: function (t) {
              var e = this,
                a = t.done,
                n = t.quest_key;
              if (2 !== a || this.hasChildTask(n))
                if (1 !== a || this.hasChildTask(n))
                  if (
                    [
                      'LivenessQuest4',
                      'LivenessQuest3',
                      'LivenessQuest2',
                      'LivenessQuest1',
                    ].includes(n)
                  )
                    this.getRewardItem(n);
                  else {
                    var i = ['ShareStream'];
                    switch (
                      (at['a'].jsToAppMessage({
                        event: 'EVENT_QUEST',
                        data: n,
                        isUse: !this.isModel && !i.includes(n),
                      }),
                      n)
                    ) {
                      case 'ChatStream':
                      case 'ViewStream':
                        this.isModel && this.$emit('closeModal');
                        break;
                      case 'ShareStream':
                        ye(), Object(at['b'])('memberCard');
                        break;
                      case 'DailySignIn':
                        Ee().then(function (t) {
                          var a = t.data;
                          if ('0' === a.error_code)
                            return e.isModel
                              ? void (e.pageType = 'dailyTask')
                              : void e.$router.push('/main/dailyTask');
                          e.actionSetHintInfo(
                            ''
                              .concat(a.error_text, '(')
                              .concat(a.error_code, ')')
                          ),
                            e.getMyTask();
                        });
                        break;
                      case 'FirstMeet':
                        Te().then(function (t) {
                          var a = t.data;
                          if ('0' === a.error_code)
                            return e.isModel
                              ? void (e.pageType = 'FirstMeetTask')
                              : void e.$router.push('/main/firstMeetTask');
                          e.actionSetHintInfo(
                            ''
                              .concat(a.error_text, '(')
                              .concat(a.error_code, ')')
                          ),
                            e.getMyTask();
                        });
                        break;
                      default:
                        break;
                    }
                  }
                else this.getRewardItem(n);
              else this.actionSetHintInfo(this.$t('S_RECEIVED'));
            },
            getRewardItem: function (t) {
              var e = this;
              this.isAjax
                ? this.actionSetHintInfo(this.$t('S_GIFT_REPARING'))
                : ((this.isAjax = !0),
                  Ae(t)
                    .then(function (a) {
                      var n = a.data;
                      return '0' === n.error_code && 'success' === n.result
                        ? (e.getMyTask(),
                          void e.actionSetHintInfo(e.$t('S_RECEIVE_SUCCESS')))
                        : [
                            'LivenessQuest4',
                            'LivenessQuest3',
                            'LivenessQuest2',
                            'LivenessQuest1',
                          ].includes(t)
                        ? (e.actionSetHintInfo(e.$t('S_GIFT_REPARING')),
                          void e.getMyTask())
                        : void e.actionSetHintInfo(
                            ''
                              .concat(n.error_text, '(')
                              .concat(n.error_code, ')')
                          );
                    })
                    ['finally'](function () {
                      e.isAjax = !1;
                    }));
            },
            setActivityUrl: function (t) {
              at['a'].jsToAppMessage({ event: 'EVENT_HTML', data: t.link }),
                this.actionSetActivityUrl(t.link);
            },
          }
        ),
      },
      Qe = ze,
      Je = (a('18c3'), Object(z['a'])(Qe, ve, be, !1, null, '60d0e7a0', null)),
      Ze = Je.exports,
      ta = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { class: ['mall-wrap', { model: t.isModel }] },
          [
            a('MainHeader', {
              attrs: {
                title: t.$t('S_MALL'),
                'left-btn-func': t.isModel
                  ? function () {
                      return t.actionSetWholePageType(null);
                    }
                  : null,
              },
            }),
            a(
              'el-tabs',
              {
                staticClass: 'tabs',
                attrs: { stretch: '' },
                model: {
                  value: t.activeName,
                  callback: function (e) {
                    t.activeName = e;
                  },
                  expression: 'activeName',
                },
              },
              t._l(t.typeList, function (e) {
                return a('el-tab-pane', {
                  key: e,
                  attrs: { label: t.libGetStyleTypeName(e), name: e },
                });
              }),
              1
            ),
            a(
              'div',
              { staticClass: 'page-nav-wrap' },
              [
                a('div', { staticClass: 'list-wrap' }, [
                  a(
                    'div',
                    { staticClass: 'prop-wrap' },
                    [
                      t._l(t.activeCommodityList, function (e) {
                        return a(
                          'div',
                          {
                            key: e.id,
                            staticClass: 'props-item',
                            class: {
                              activeCommodity:
                                t.selectItem && e.id === t.selectItem.id,
                            },
                            on: {
                              click: function (a) {
                                return t.setSelectItem(e);
                              },
                            },
                          },
                          [
                            a('div', {
                              staticClass: 'name',
                              domProps: {
                                innerHTML: t._s(t.getStyleName(e.name)),
                              },
                            }),
                            a('div', { staticClass: 'img' }, [
                              a('img', {
                                staticClass: 'thumbnail',
                                attrs: { src: e.thumbnail },
                              }),
                            ]),
                            a('div', { staticClass: 'amount' }, [
                              t._v(
                                ' ' +
                                  t._s(e.amount) +
                                  t._s(t.$t('S_DIAMOND')) +
                                  ' '
                              ),
                            ]),
                            a('div', { staticClass: 'buy-btn' }, [
                              t._v(' ' + t._s(t.$t('S_BUY')) + ' '),
                            ]),
                          ]
                        );
                      }),
                      'eff' !== t.activeName || t.activeCommodityList.length
                        ? t._e()
                        : a('div', { staticClass: 'no-data' }, [
                            t._v(' ' + t._s(t.$t('S_MALL_ARTICLE_01')) + ' '),
                          ]),
                    ],
                    2
                  ),
                ]),
                a('div', { staticClass: 'footer' }, [
                  a('div', [
                    a('div', { staticClass: 'charge-item' }, [
                      a('div', { staticClass: 'left' }, [
                        a('img', {
                          attrs: {
                            src: t.$getCdnPath(
                              '/images/mainSite/common/bar_ic_diamond.svg'
                            ),
                          },
                        }),
                        a('div', { staticClass: 'amount' }, [
                          t._v(
                            ' ' +
                              t._s(t._f('amountFormat')(t.userDiamond)) +
                              ' '
                          ),
                        ]),
                      ]),
                      a(
                        'div',
                        {
                          staticClass: 'btn',
                          on: {
                            click: function (e) {
                              return t.leaveRoomAndToPage('exchangeDiamond');
                            },
                          },
                        },
                        [t._v(' ' + t._s(t.$t('S_EXCHANGE')) + ' ')]
                      ),
                    ]),
                  ]),
                ]),
                a('transition', { attrs: { name: 'slide-up' } }, [
                  t.selectItem
                    ? a('div', { staticClass: 'buy-detail-wrap' }, [
                        a('div', { staticClass: 'title' }, [
                          t._v(t._s(t.getButItemTilte())),
                        ]),
                        a('div', { staticClass: 'content' }, [
                          a('div', { staticClass: 'item-amount-wrap' }, [
                            a('div', { staticClass: 'item-card' }, [
                              a('div', {
                                staticClass: 'name',
                                domProps: {
                                  innerHTML: t._s(
                                    t.getStyleName(t.selectItem.name)
                                  ),
                                },
                              }),
                              a('div', { staticClass: 'img' }, [
                                a('img', {
                                  attrs: { src: t.selectItem.thumbnail },
                                }),
                              ]),
                            ]),
                            a('div', { staticClass: 'amount-wrap' }, [
                              a(
                                'div',
                                {
                                  class: [
                                    'num',
                                    { 'alone-num': 'eff' === t.activeName },
                                  ],
                                },
                                [
                                  'props' === t.activeName
                                    ? [
                                        a(
                                          'div',
                                          {
                                            staticClass: 'minus-btn',
                                            on: {
                                              click: function (e) {
                                                return t.setNum('minus');
                                              },
                                            },
                                          },
                                          [
                                            a('font-awesome-icon', {
                                              attrs: { icon: 'minus' },
                                            }),
                                          ],
                                          1
                                        ),
                                        a('el-input', {
                                          staticClass: 'input-number',
                                          model: {
                                            value: t.num,
                                            callback: function (e) {
                                              t.num = t._n(e);
                                            },
                                            expression: 'num',
                                          },
                                        }),
                                        a(
                                          'div',
                                          {
                                            staticClass: 'plus-btn',
                                            on: {
                                              click: function (e) {
                                                return t.setNum('plus');
                                              },
                                            },
                                          },
                                          [
                                            a('font-awesome-icon', {
                                              attrs: { icon: 'plus' },
                                            }),
                                          ],
                                          1
                                        ),
                                      ]
                                    : a('div', [t._v(t._s(t.num))]),
                                ],
                                2
                              ),
                              a('div', { staticClass: 'amount' }, [
                                a('img', {
                                  attrs: {
                                    src: t.$getCdnPath(
                                      '/images/mainSite/common/bar_ic_diamond.svg'
                                    ),
                                  },
                                }),
                                t._v(
                                  ' ' +
                                    t._s(
                                      t._f('amountFormat')(
                                        t.selectItem.amount * t.num
                                      )
                                    ) +
                                    ' '
                                ),
                              ]),
                            ]),
                          ]),
                          a('div', { staticClass: 'submit-wrap' }, [
                            a(
                              'div',
                              {
                                staticClass: 'cancel-btn',
                                on: {
                                  click: function (e) {
                                    return t.setSelectItem(null);
                                  },
                                },
                              },
                              [t._v(' ' + t._s(t.$t('S_CANCEL')) + ' ')]
                            ),
                            a(
                              'div',
                              {
                                staticClass: 'buy-btn',
                                on: { click: t.buyItem },
                              },
                              [t._v(' ' + t._s(t.$t('S_BUY')) + ' ')]
                            ),
                          ]),
                        ]),
                      ])
                    : t._e(),
                ]),
              ],
              1
            ),
            t.selectItem
              ? a('div', {
                  staticClass: 'bg-mask',
                  on: {
                    click: function (e) {
                      return e.target !== e.currentTarget
                        ? null
                        : t.setSelectItem(null);
                    },
                  },
                })
              : t._e(),
          ],
          1
        );
      },
      ea = [],
      aa = {
        components: { MainHeader: we['a'] },
        data: function () {
          return {
            typeList: ['props', 'eff'],
            activeName: 'props',
            selectItem: null,
            isAjax: !1,
            num: 1,
            commodityList: {},
          };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])({}, Object(r['d'])('gift', ['userDiamond'])),
            Object(r['c'])({
              wholePageType: 'getWholePageType',
              wholePageOptions: 'getWholePageOptions',
            })
          ),
          {},
          {
            activeCommodityList: function () {
              var t = this.commodityList,
                e = this.activeName;
              return t[e];
            },
            isModel: function () {
              return 'mall' === this.wholePageType;
            },
          }
        ),
        watch: {
          activeName: function (t) {
            (this.selectItem = null),
              this.isModel || this.$router.replace({ params: { type: t } });
          },
          selectItem: function (t) {
            t || (this.num = 1);
          },
          num: function (t, e) {
            '' !== t && 'number' === typeof t
              ? t > 99999 && (this.num = 99999)
              : (this.num = '');
          },
        },
        created: function () {
          this.isModel
            ? (this.activeName = this.wholePageOptions.type)
            : ((this.activeName = this.$route.params.type || 'props'),
              this.$router.replace({ params: { type: this.activeName } })),
            this.initProduct(),
            this.actionGetDiamond();
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              {},
              Object(r['b'])(['actionSetWholePageType', 'actionSetHintInfo'])
            ),
            Object(r['b'])('gift', ['actionGetDiamond'])
          ),
          {},
          {
            libGetStyleTypeName: dt,
            leaveRoomAndToPage: function (t) {
              Object(at['b'])(t);
            },
            initProduct: function () {
              var t = this;
              Object($e['h'])().then(function (e) {
                var a = e.data;
                '0' === a.error_code && (t.commodityList = a.result);
              });
            },
            getStyleName: function (t) {
              return t.replace('/n', '<br>');
            },
            getButItemTilte: function () {
              var t = {
                eff: this.$t('S_BUY_EFF'),
                props: this.$t('S_BUY_PROPS'),
              };
              return t[this.activeName];
            },
            setSelectItem: function (t) {
              this.selectItem = t;
            },
            setNum: function (t) {
              '' !== this.num
                ? 'plus' !== t
                  ? this.num > 1 && (this.num -= 1)
                  : (this.num += 1)
                : (this.num = 1);
            },
            buyItem: function () {
              var t = this;
              this.num && '' !== this.num
                ? this.isAjax ||
                  ((this.isAjax = !0),
                  console.log(this.num),
                  Object($e['b'])({
                    num: this.num,
                    prop_id: this.selectItem.id,
                  })
                    .then(function (e) {
                      var a = e.data;
                      if ('0' === a.error_code)
                        return (
                          t.actionSetHintInfo(t.$t('S_BUY_SUCCESS')),
                          (t.selectItem = null),
                          void t.actionGetDiamond()
                        );
                      t.actionSetHintInfo(
                        ''.concat(a.error_text, '(').concat(a.error_code, ')')
                      );
                    })
                    ['finally'](function () {
                      t.isAjax = !1;
                    }))
                : this.actionSetHintInfo(this.$t('S_PLZ_CORRECT_BUYING_NUM'));
            },
          }
        ),
      },
      na = aa,
      ia = (a('482f'), Object(z['a'])(na, ta, ea, !1, null, '3341622e', null)),
      sa = ia.exports,
      ra = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { class: ['dynamic-page', { model: t.wholePageType }] },
          [
            a('DynamicPage', {
              attrs: {
                'target-id': t.targetId,
                'show-page': t.showPage,
                'is-streamer-card': t.isStreamerCard,
                'is-admin': t.isAdmin,
                'is-fake-user': t.isFakeUser,
                options: t.options,
                'is-app': t.isApp,
              },
              on: {
                'update:targetId': function (e) {
                  t.targetId = e;
                },
                'update:target-id': function (e) {
                  t.targetId = e;
                },
                'update:isStreamerCard': function (e) {
                  t.isStreamerCard = e;
                },
                'update:is-streamer-card': function (e) {
                  t.isStreamerCard = e;
                },
                'update:isAdmin': function (e) {
                  t.isAdmin = e;
                },
                'update:is-admin': function (e) {
                  t.isAdmin = e;
                },
                'update:isFakeUser': function (e) {
                  t.isFakeUser = e;
                },
                'update:is-fake-user': function (e) {
                  t.isFakeUser = e;
                },
                'update:showPage': t.updatePage,
              },
            }),
          ],
          1
        );
      },
      oa = [],
      ca = a('7a96'),
      ua = {
        components: { DynamicPage: ca['default'] },
        data: function () {
          return {
            targetId: null,
            showPage: null,
            isStreamerCard: !1,
            isAdmin: !1,
            isFakeUser: !1,
            isApp: !1,
            options: {},
          };
        },
        computed: Object(V['a'])(
          {},
          Object(r['c'])({
            wholePageType: 'getWholePageType',
            wholePageOptions: 'getWholePageOptions',
          })
        ),
        created: function () {
          if (this.$route.params.page) {
            var t = this.$route.params,
              e = t.page,
              a = t.id,
              n = t.type,
              i = this.$route.query.tab;
            return (
              (this.targetId = a),
              (this.showPage = e),
              (this.isStreamerCard = 'streamer' === n),
              (this.isAdmin = 'admin' === n),
              (this.isFakeUser = 'fuser' === n),
              (this.isApp = !0),
              void (this.options = { tab: i })
            );
          }
          (this.targetId = this.wholePageOptions.targetId),
            (this.showPage = this.wholePageOptions.showPage),
            (this.isStreamerCard = this.wholePageOptions.isStreamerCard),
            (this.isAdmin = this.wholePageOptions.isAdmin),
            (this.isFakeUser = this.wholePageOptions.isFakeUser);
        },
        methods: {
          updatePage: function (t) {
            (this.showPage = t), (this.options = {});
          },
        },
      },
      la = ua,
      da = (a('59a5'), Object(z['a'])(la, ra, oa, !1, null, 'f0971a44', null)),
      ma = da.exports,
      _a = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', { staticClass: 'top swipe-wrap' }, [
          a('div', [
            a(
              'div',
              {
                staticClass: 'streamer',
                on: {
                  click: function (e) {
                    return t.openModal('showStreamerInfo');
                  },
                },
              },
              [
                a('img', {
                  staticClass: 'streamer-headphoto',
                  attrs: {
                    src: t.currentRoom.headphoto,
                    onerror: t.getDefaultUserImg,
                  },
                }),
                a('div', { staticClass: 'streamer-name' }, [
                  a('div', [t._v(t._s(t.currentRoom.nickname))]),
                  a('div', { staticClass: 'id' }, [
                    t._v('ID：' + t._s(t.currentRoom.streamerId)),
                  ]),
                ]),
                t.currentRoom.openAttention
                  ? [
                      t.getUserIsAttentionStreamer
                        ? a('img', {
                            staticClass: 'follow-stream-btn',
                            attrs: {
                              src: t.$getCdnPath(
                                '/images/chatroom/bar/bar_unsubscribe.svg'
                              ),
                            },
                            on: {
                              click: function (e) {
                                return (
                                  e.stopPropagation(),
                                  t.cancelAttentionStreamer(e)
                                );
                              },
                            },
                          })
                        : a('img', {
                            staticClass: 'follow-stream-btn',
                            attrs: {
                              src: t.$getCdnPath(
                                '/images/chatroom/bar/bar_focuson.svg'
                              ),
                            },
                            on: {
                              click: function (e) {
                                return (
                                  e.stopPropagation(), t.attentionStreamer(e)
                                );
                              },
                            },
                          }),
                    ]
                  : [
                      a('img', {
                        staticClass: 'follow-stream-btn',
                        attrs: {
                          src: t.$getCdnPath(
                            '/images/chatroom/bar/bar_no_focuson.svg'
                          ),
                        },
                        on: {
                          click: function (e) {
                            e.stopPropagation(),
                              t.actionSetHintInfo(t.$t('S_CANT_ATTENTION_TIP'));
                          },
                        },
                      }),
                    ],
              ],
              2
            ),
            a(
              'div',
              { staticClass: 'online-headphoto-wrap' },
              [
                t._l(t.userList, function (e) {
                  return [
                    a('img', {
                      key: e.id,
                      attrs: {
                        src: t.$wsGetCdnPath(e.headphoto),
                        onerror: t.getDefaultUserImg,
                      },
                      on: {
                        click: function (a) {
                          return t.getUserInfo(e);
                        },
                      },
                    }),
                  ];
                }),
              ],
              2
            ),
            a(
              'div',
              {
                staticClass: 'online-num',
                on: {
                  click: function (e) {
                    return t.openModal('showOnlineMember');
                  },
                },
              },
              [t._v(' ' + t._s(t.roomCount.roomCount) + ' ')]
            ),
          ]),
          a('div', { staticClass: 'contribution-wrap' }, [
            a(
              'div',
              {
                staticClass: 'diamond',
                on: {
                  click: function (e) {
                    return t.openModal('showDiamondList');
                  },
                },
              },
              [
                a('img', {
                  attrs: {
                    src: t.$getCdnPath('/images/chatroom/bar/bar_diamond.svg'),
                  },
                }),
                t._v(
                  ' ' +
                    t._s(t._f('amountFormat')(t.roomCount.contributeSum)) +
                    ' '
                ),
              ]
            ),
            a(
              'div',
              {
                staticClass: 'guard',
                on: {
                  click: function (e) {
                    return t.openModal('showGuardList');
                  },
                },
              },
              [
                a('img', {
                  attrs: {
                    src: t.$getCdnPath('/images/chatroom/bar/bar_guard.svg'),
                  },
                }),
                a('span', [
                  t._v(
                    ' ' +
                      t._s(t.$t('S_GUARD')) +
                      ' ' +
                      t._s(
                        t.$t('S_USER_VARI').replace('%n', t.roomCount.guardSum)
                      ) +
                      ' '
                  ),
                ]),
                a('img', {
                  staticClass: 'arrow-icon',
                  attrs: {
                    src: t.$getCdnPath('/images/common/ic_arrow_r.svg'),
                  },
                }),
              ]
            ),
            a(
              'div',
              {
                staticClass: 'recommend-tag',
                on: {
                  click: function (e) {
                    return t.openModal('showRecommand');
                  },
                },
              },
              [
                a('img', {
                  staticClass: 'arrow-icon',
                  attrs: {
                    src: t.$getCdnPath('/images/common/ic_arrow_l.svg'),
                  },
                }),
                t._v(' ' + t._s(t.$t('S_RECOMMAND_TO_YOU')) + ' '),
              ]
            ),
          ]),
          a(
            'div',
            { staticClass: 'tag-card-wrap' },
            [
              a(
                'transition',
                { attrs: { name: 'game-slide' } },
                [
                  t.showGameResult
                    ? a('GameResults', {
                        staticClass: 'game-results-wrap',
                        attrs: { result: t.getGameResults },
                      })
                    : t._e(),
                ],
                1
              ),
              0 !== t.chargeRoomState
                ? a(
                    'div',
                    { staticClass: 'charge-wrap' },
                    [
                      a('div', [
                        t._v(
                          ' ' +
                            t._s(
                              t
                                .$t('S_CHARGE_PER_MINUTE')
                                .replace('%n', t.getStreamCharge.charge)
                            ) +
                            ' '
                        ),
                      ]),
                      [
                        [1, 2].includes(t.chargeRoomState)
                          ? a('div', [
                              t._v(
                                ' ' +
                                  t._s(
                                    t
                                      .$t('S_CHARGE_COUNT')
                                      .replace('%n', t.leaveSecond)
                                  ) +
                                  ' '
                              ),
                            ])
                          : 3 === t.chargeRoomState
                          ? a('div', { staticClass: 'watch-btn' }, [
                              t._v(
                                ' ' +
                                  t._s(
                                    t
                                      .$t('S_WATCHED_MINUTE')
                                      .replace('%n', t.watchedMinute)
                                  ) +
                                  ' '
                              ),
                            ])
                          : t._e(),
                      ],
                    ],
                    2
                  )
                : t._e(),
            ],
            1
          ),
        ]);
      },
      ha = [],
      fa = a('a1d8'),
      pa = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', [
          a('div', { staticClass: 'title-wrap' }, [
            a('div', { staticClass: 'title' }, [
              t._v(t._s(t.liveGameName(t.result.game_name))),
            ]),
            a('div', { staticClass: 'no' }, [t._v(t._s(t.result.game_num))]),
          ]),
          a(
            'div',
            { staticClass: 'results-wrap' },
            [
              t._l(t.result.result_display, function (e, n) {
                return [
                  1 === t.gameType
                    ? a('div', { key: n, staticClass: 'type-1-ball' }, [
                        t._v(' ' + t._s(e) + ' '),
                      ])
                    : 2 === t.gameType
                    ? a(
                        'div',
                        {
                          key: n,
                          staticClass: 'type-2-ball',
                          class: t.getType2Class(e),
                        },
                        [t._v(' ' + t._s(e) + ' ')]
                      )
                    : 4 === t.gameType
                    ? a('div', { key: n, staticClass: 'type-4-ball' }, [
                        a('img', {
                          attrs: {
                            src: t.$getCdnPath(
                              '/images/game/SICBO/resultIcon_' + e + '.png'
                            ),
                          },
                        }),
                      ])
                    : t._e(),
                ];
              }),
              3 === t.gameType
                ? a(
                    'div',
                    { staticClass: 'type-3-wrap' },
                    t._l(t.result.result_display, function (e, n) {
                      return a('img', {
                        key: n,
                        staticClass: 'type-3-ball',
                        attrs: {
                          src: t.$getCdnPath(
                            '/images/game/Q3/dice_' + e + '.png'
                          ),
                        },
                      });
                    }),
                    0
                  )
                : t._e(),
              2 === t.gameType
                ? [
                    a('span', { staticClass: 'plus' }, [t._v('+')]),
                    a(
                      'div',
                      {
                        staticClass: 'type-2-ball',
                        class: t.getType2Class(t.result.sp),
                      },
                      [t._v(' ' + t._s(t.result.sp) + ' ')]
                    ),
                  ]
                : t._e(),
              4 === t.gameType
                ? [
                    a('span', { staticClass: 'type-4-equal' }, [t._v('=')]),
                    a('span', { staticClass: 'type-4-sum' }, [
                      t._v(t._s(t.result.sum)),
                    ]),
                  ]
                : t._e(),
            ],
            2
          ),
        ]);
      },
      ga = [],
      Sa = {
        props: {
          result: {
            type: Object,
            default: function () {
              return {};
            },
          },
        },
        data: function () {
          return { gameType: 0 };
        },
        created: function () {
          this.getResultData();
        },
        methods: {
          liveGameName: ct,
          getResultData: function () {
            switch (this.result.game_name) {
              case 'PK-PAOPK-1':
              case 'SC-PAO1MSC-1':
              case 'E5-PAOE5-1':
                this.gameType = 1;
                break;
              case 'LT-PAO1MLT-1':
                this.gameType = 2;
                break;
              case 'Q3-PAOQ3-1':
                this.gameType = 3;
                break;
              case 'SICBO-PAOFSC-1':
                this.gameType = 4;
                break;
              default:
                break;
            }
          },
          getType2Class: function (t) {
            var e = [
                '01',
                '02',
                '07',
                '08',
                '12',
                '13',
                '18',
                '19',
                '23',
                '24',
                '29',
                '30',
                '34',
                '35',
                '40',
                '45',
                '46',
              ],
              a = [
                '03',
                '04',
                '09',
                '10',
                '14',
                '15',
                '20',
                '25',
                '26',
                '31',
                '36',
                '37',
                '41',
                '42',
                '47',
                '48',
              ],
              n = [
                '05',
                '06',
                '11',
                '16',
                '17',
                '21',
                '22',
                '27',
                '28',
                '32',
                '33',
                '38',
                '39',
                '43',
                '44',
                '49',
              ];
            return -1 !== e.indexOf(t)
              ? 'red-ball'
              : -1 !== a.indexOf(t)
              ? 'blue-ball'
              : -1 !== n.indexOf(t)
              ? 'green-ball'
              : '';
          },
          getSicboText: function (t) {
            var e;
            switch (t) {
              case '1':
              case '6':
                e = 'red-text';
                break;
              case '2':
              case '5':
                e = 'green-text';
                break;
              case '3':
              case '4':
                e = 'blue-text';
                break;
              default:
                break;
            }
            return e;
          },
        },
      },
      va = Sa,
      ba = (a('bdb5'), Object(z['a'])(va, pa, ga, !1, null, '262cf35e', null)),
      Ca = ba.exports,
      Oa = {
        components: { GameResults: Ca },
        data: function () {
          return {
            leaveSecond: 0,
            leaveSecondInterval: null,
            timeInterval: null,
            watchedMinute: 0,
            showGameResult: null,
            gameResultsTimeout: null,
            startSecond: 0,
          };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])(
                Object(V['a'])(
                  Object(V['a'])(
                    Object(V['a'])({}, Object(r['d'])(['user'])),
                    Object(r['d'])('chatroom', [
                      'currentRoom',
                      'roomCount',
                      'leaveSec',
                      'chargeRoomState',
                    ])
                  ),
                  Object(r['c'])([
                    'getDefaultUserImg',
                    'getUserIsAttentionStreamer',
                  ])
                ),
                Object(r['c'])('chatroom', {
                  guardianList: 'getGuardianList',
                  getStreamCharge: 'getStreamCharge',
                })
              ),
              Object(r['c'])('chatroom', ['getChatUser'])
            ),
            Object(r['c'])('game', ['getGameResults'])
          ),
          {},
          {
            userList: function () {
              var t;
              return null === (t = this.getChatUser) || void 0 === t
                ? void 0
                : t.guardianlist;
            },
          }
        ),
        watch: {
          leaveSecond: function (t) {
            t <= 0 &&
              (clearInterval(this.leaveSecondInterval),
              this.$emit('socketOff', !0),
              this.actionSetRoomIsCharge(2));
          },
          chargeRoomState: function () {
            this.getChargeRoomState(), this.getLeaveSrc();
          },
          getGameResults: function (t) {
            var e = this;
            (this.showGameResult = t),
              (this.gameResultsTimeout = setTimeout(function () {
                e.showGameResult = null;
              }, 8e3));
          },
        },
        created: function () {
          this.getLeaveSrc(),
            this.getMinute(),
            this.getChargeRoomState(),
            clearTimeout(this.gameResultsTimeout);
        },
        beforeDestroy: function () {
          clearInterval(this.timeInterval),
            clearInterval(this.leaveSecondInterval);
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              {},
              Object(r['b'])([
                'actionAttentionStreamer',
                'actionSetHintInfo',
                'actionCancelAttentionStreamer',
              ])
            ),
            Object(r['b'])('chatroom', [
              'actionGetUserInfo',
              'actionSetChatroomModalType',
              'actionSetChatroomModalOptions',
              'actionSetRoomIsCharge',
            ])
          ),
          {},
          {
            openModal: function (t) {
              this.$emit('openModal', t);
            },
            attentionStreamer: function () {
              var t = { streamer_id: this.currentRoom.streamerId };
              this.actionAttentionStreamer(t);
            },
            cancelAttentionStreamer: function () {
              var t = this,
                e = { streamer_id: this.currentRoom.streamerId };
              this.actionCancelAttentionStreamer(e).then(function (e) {
                '0' === e.error_code &&
                  t.actionSetHintInfo(t.$t('S_CANCEL_ATTENTION_SUCCESS'));
              });
            },
            getUserInfo: function (t) {
              var e = { id: t.lottId };
              -1 === t.identityId &&
                ((e = Object(V['a'])(Object(V['a'])({}, e), {}, { role: -1 })),
                this.actionSetChatroomModalOptions({ isFakeUser: !0 })),
                this.actionGetUserInfo(e),
                this.actionSetChatroomModalType('showUserInfo');
            },
            getLeaveSrc: function () {
              var t = this,
                e = this.getStreamCharge;
              e.leaveSecond <= 0
                ? (this.leaveSecond = 0)
                : e.leaveSecond > 0 &&
                  ((this.leaveSecond = e.leaveSecond),
                  (this.leaveSecondInterval = setInterval(function () {
                    t.leaveSecond -= 1;
                  }, 1e3)));
            },
            getMinute: function () {
              var t = Object(fa['a'])(new Date()) - this.startSecond;
              this.watchedMinute = Math.floor(t / 60);
            },
            getChargeRoomState: function () {
              var t = this,
                e = this.chargeRoomState;
              3 === e &&
                ((this.startSecond = Object(fa['a'])(new Date())),
                this.getMinute(),
                (this.timeInterval = setInterval(function () {
                  t.getMinute();
                }, 15e3))),
                3 !== e &&
                  (clearInterval(this.timeInterval), (this.watchedMinute = 0));
            },
          }
        ),
      },
      Ta = Oa,
      Ea = (a('149e'), Object(z['a'])(Ta, _a, ha, !1, null, '5cf5cab3', null)),
      Ia = Ea.exports,
      Aa = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          {
            staticClass: 'chat-all-msg-wrap',
            attrs: { id: 'chat-all-msg-wrap' },
          },
          [
            a(
              'div',
              {
                directives: [
                  {
                    name: 'show',
                    rawName: 'v-show',
                    value: !t.getIsClearScreen,
                    expression: '!getIsClearScreen',
                  },
                ],
                staticClass: 'vip-enter-wrap',
              },
              [
                a('transition', { attrs: { name: 'vip-slide' } }, [
                  t.showEnterVipUser
                    ? a(
                        'div',
                        {
                          class: [
                            'vip-enter-msg',
                            { noIcon: '' === t.enterVip.vipIcon },
                          ],
                          style: {
                            backgroundImage:
                              'url(' + t.$wsGetCdnPath(t.enterVip.banner) + ')',
                          },
                        },
                        [
                          '' !== t.enterVip.vipIcon
                            ? a('img', {
                                staticClass: 'icon',
                                attrs: {
                                  src: t.$wsGetCdnPath(t.enterVip.vipIcon),
                                },
                              })
                            : t._e(),
                          a(
                            'div',
                            { staticClass: 'badges-wrap' },
                            t._l(t.enterVip.otherBadges, function (e, n) {
                              return a('img', {
                                key: n,
                                attrs: { src: t.$wsGetCdnPath(e) },
                              });
                            }),
                            0
                          ),
                          a('span', {
                            domProps: {
                              innerHTML: t._s(t.getUser(t.enterVip)),
                            },
                          }),
                        ]
                      )
                    : t._e(),
                ]),
              ],
              1
            ),
            a(
              'div',
              {
                ref: 'chat-msg-wrap',
                staticClass: 'chat-msg-wrap',
                attrs: { id: 'chat-msg-wrap' },
              },
              [
                t._l(t.getChatMsg, function (e, n) {
                  return [
                    ['N', 'Barrage'].includes(e.type)
                      ? a('MsgItem', {
                          key: 'msg-item-' + e.type + '-' + n,
                          attrs: {
                            sender: e,
                            content: e.text,
                            'msg-type': 'user',
                            badges: e.info.badges,
                          },
                        })
                      : 'A' === e.type
                      ? a('MsgItem', {
                          key: 'msg-item-' + e.type + '-' + n,
                          attrs: { 'tag-type': 'system', content: e.content },
                        })
                      : 'announce' === e.type
                      ? a('MsgItem', {
                          key: 'msg-item-' + e.type + '-' + n,
                          staticClass: 'announce',
                          attrs: { content: e.content.cn },
                        })
                      : 'props' === e.type
                      ? a('MsgItem', {
                          key: 'msg-item-' + e.type + '-' + n,
                          staticClass: 'announce',
                          attrs: {
                            'tag-type': 'system',
                            content: t.getPropsMsg(e.nickname, e.content),
                          },
                        })
                      : 'KO' === e.type
                      ? a('MsgItem', {
                          key: 'msg-item-' + e.type + '-' + n,
                          attrs: {
                            'tag-type': 'system',
                            content: t.getKOMsg(e.nickname, e.KOtype),
                          },
                        })
                      : 'win' === e.type
                      ? a('MsgItem', {
                          key: 'msg-item-' + e.type + '-' + n,
                          attrs: {
                            'tag-type': 'win',
                            content: t.getWinMsg(e.nickname),
                          },
                        })
                      : 'guardian' === e.type
                      ? a('MsgItem', {
                          key: 'msg-item-' + e.type + '-' + n,
                          attrs: {
                            'tag-type': 'guardian',
                            content: t.getGuardianMsg(e.nickname),
                          },
                        })
                      : 'attention' === e.type
                      ? a('MsgItem', {
                          key: 'msg-item-' + e.type + '-' + n,
                          attrs: {
                            'tag-type': 'system',
                            content: t.getAttentionMsg(e.nickname),
                          },
                        })
                      : 'donate' === e.type
                      ? a('MsgItem', {
                          key: 'msg-item-' + e.type + '-' + n,
                          attrs: {
                            'tag-type': 'system',
                            content: t.getDonateMsg(e.nickname, e.content),
                          },
                        })
                      : 'gameBet' === e.type
                      ? a(
                          'MsgItem',
                          {
                            key: 'msg-item-' + e.type + '-' + n,
                            attrs: {
                              'tag-type': 'system',
                              content: t.getGameBetMsg(
                                e.gameName,
                                e.nickname,
                                e.betGold
                              ),
                            },
                          },
                          [
                            a(
                              'div',
                              {
                                staticClass: 'follow-bet',
                                on: {
                                  click: function (a) {
                                    return t.folloeBet(e);
                                  },
                                },
                              },
                              [
                                t._v(
                                  ' ' + t._s(t.$t('S_FOLLOW_BET') + '>') + ' '
                                ),
                              ]
                            ),
                          ]
                        )
                      : t._e(),
                  ];
                }),
              ],
              2
            ),
            a(
              'div',
              { staticClass: 'enter-msg-wrap' },
              [
                a(
                  'transition',
                  { attrs: { name: 'enter-msg-slide' } },
                  [
                    t.showEnterUser
                      ? a('msg-item', {
                          staticClass: 'enter-msg',
                          attrs: { content: t.getUser(t.enterUser) },
                        })
                      : t._e(),
                  ],
                  1
                ),
              ],
              1
            ),
          ]
        );
      },
      ya = [],
      wa = a('2909'),
      Ra = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', { class: t.$style['chat-msg-item'] }, [
          a('div', { class: t.$style['chat-msg-text'] }, [
            a(
              'code',
              { class: t.$style.msg },
              [
                t.tagType
                  ? a(
                      'span',
                      { class: [t.$style.tag, t.$style[t.tag.style]] },
                      [t._v(' ' + t._s(t.tag.name) + ' ')]
                    )
                  : t._e(),
                t.badges
                  ? t._l(t.badges, function (e, n) {
                      return a(
                        'span',
                        { key: 'badges-' + n, class: t.$style.badges },
                        [
                          a('img', {
                            directives: [
                              {
                                name: 'lazy',
                                rawName: 'v-lazy',
                                value: t.$wsGetCdnPath(e),
                                expression: '$wsGetCdnPath(badgesItem)',
                              },
                            ],
                          }),
                        ]
                      );
                    })
                  : t._e(),
                t.sender
                  ? a('span', { class: t.$style.sender }, [
                      t._v(' ' + t._s(t.sender.nickname) + '： '),
                    ])
                  : t._e(),
                'system' === t.msgType
                  ? a('span', {
                      class: t.$style['msg-content'],
                      domProps: { innerHTML: t._s(t.content) },
                    })
                  : a('span', { class: t.$style['msg-content'] }, [
                      t._v(' ' + t._s(t.content) + ' '),
                    ]),
                t._t('default'),
              ],
              2
            ),
          ]),
        ]);
      },
      La = [],
      Na = {
        props: {
          sender: { type: Object, default: null },
          content: { type: String, default: '' },
          tagType: { type: String, default: '' },
          badges: {
            type: Array,
            default: function () {
              return [];
            },
          },
          msgType: { type: String, default: 'system' },
        },
        computed: {
          tag: function () {
            if (!this.tagType) return null;
            var t = {
              system: { name: this.$t('S_SYSTEM'), style: 'sys-tag' },
              win: { name: this.$t('S_WIN'), style: 'win-tag' },
              guardian: { name: this.$t('S_GUARD'), style: 'guardian-tag' },
            };
            return t[this.tagType];
          },
        },
      },
      ka = Na,
      Pa = a('c0d8');
    function Ma(t) {
      this['$style'] = Pa['default'].locals || Pa['default'];
    }
    var Da = Object(z['a'])(ka, Ra, La, !1, Ma, null, null),
      ja = Da.exports,
      Ga = {
        components: { MsgItem: ja },
        data: function () {
          return {
            scrollInterval: null,
            showEnterUser: !1,
            showEnterVipUser: !1,
            enterMsgInterval: null,
            enterVipMsgInterval: null,
            vipList: [],
            enterVip: {},
            userList: [],
            enterUser: {},
          };
        },
        computed: Object(V['a'])(
          Object(V['a'])({}, Object(r['d'])(['user'])),
          Object(r['c'])('chatroom', [
            'getChatMsg',
            'getIsClearScreen',
            'getVipEnter',
            'getUserEnter',
          ])
        ),
        watch: {
          getChatMsg: function (t) {
            var e;
            (this.$refs['chat-msg-wrap'].scrollHeight -
              this.$refs['chat-msg-wrap'].scrollTop >
              200 &&
              this.user.username !==
                (null === (e = t[t.length - 1]) || void 0 === e
                  ? void 0
                  : e.account)) ||
              (clearTimeout(this.scrollInterval), this.scrollFun());
          },
          getVipEnter: function (t) {
            var e = this;
            (this.vipList = [].concat(Object(wa['a'])(this.vipList), [t])),
              this.enterVipMsgInterval ||
                ((this.enterVip = this.vipList.shift()),
                (this.enterVipMsgInterval = setInterval(function () {
                  if (!e.vipList.length)
                    return (
                      (e.showEnterVipUser = !1),
                      e.enterVipMsgInterval &&
                        clearInterval(e.enterVipMsgInterval),
                      (e.enterVipMsgInterval = null),
                      void (e.enterVip = null)
                    );
                  e.enterVip = e.vipList.shift();
                }, 3e3)));
          },
          getUserEnter: function (t) {
            var e = this;
            (this.userList = [].concat(Object(wa['a'])(this.userList), [t])),
              this.enterMsgInterval ||
                ((this.enterUser = this.userList.shift()),
                (this.enterMsgInterval = setInterval(function () {
                  if (!e.userList.length)
                    return (
                      (e.showEnterUser = !1),
                      e.enterMsgInterval && clearInterval(e.enterMsgInterval),
                      (e.enterMsgInterval = null),
                      void (e.enterUser = null)
                    );
                  e.enterUser = e.userList.shift();
                }, 3e3)));
          },
          enterVip: function (t) {
            var e = this;
            t &&
              ((this.showEnterVipUser = !1),
              this.$nextTick(function () {
                e.showEnterVipUser = !0;
              }));
          },
          enterUser: function (t) {
            var e = this;
            t &&
              ((this.showEnterUser = !1),
              this.$nextTick(function () {
                e.showEnterUser = !0;
              }));
          },
        },
        beforeDestroy: function () {
          this.clearInterval(),
            this.actionSetEnterList(null),
            this.actionSetVipEnterList(null);
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              {},
              Object(r['b'])('chatroom', [
                'actionSetEnterList',
                'actionSetVipEnterList',
              ])
            ),
            Object(r['b'])('game', ['actionSetFollowBet'])
          ),
          {},
          {
            getKOName: ut,
            scrollFun: function () {
              var t = this;
              this.scrollInterval = setTimeout(function () {
                t.$refs['chat-msg-wrap'] &&
                  (t.$refs['chat-msg-wrap'].scrollTop =
                    t.$refs['chat-msg-wrap'].scrollHeight + 100);
              }, 100);
            },
            getUser: function (t) {
              return this.$t('S_ENTER_ROOM').replace(
                '%n',
                "<span style='color:var(--orange)'>".concat(
                  null === t || void 0 === t ? void 0 : t.nickname,
                  '</span>'
                )
              );
            },
            getWinMsg: function (t) {
              return this.$t('S_WIN_GAME_INFO').replace(
                '%n',
                "<span style='color:var(--msg-blue)'>".concat(t, '</span>')
              );
            },
            getGuardianMsg: function (t) {
              return this.$t('S_MEMBER_BE_GUARDIAN').replace(
                '%n',
                "<span style='color:var(--msg-blue)'>".concat(t, '</span>')
              );
            },
            getAttentionMsg: function (t) {
              return this.$t('S_MEMBER_ATTENTION').replace(
                '%n',
                "<span style='color:var(--msg-blue)'>".concat(t, '</span>')
              );
            },
            getDonateMsg: function (t, e) {
              return ''
                .concat(
                  this.$t('S_MEMBER'),
                  "<span style='color:var(--msg-blue)'>"
                )
                .concat(t, '</span>')
                .concat(this.$t('S_GIVE'))
                .concat(e[lt()]);
            },
            getPropsMsg: function (t, e) {
              return ''
                .concat(
                  this.$t('S_MEMBER'),
                  "<span style='color:var(--msg-blue)'>"
                )
                .concat(t, '</span>')
                .concat(this.$t('S_USE'))
                .concat(e[lt()].replace('/n', ''));
            },
            getGameBetMsg: function (t, e, a) {
              return ''.concat(
                this.$t('S_GAME_BET_INFO')
                  .replace(
                    '%n',
                    "<span style='color:var(--msg-blue)'>".concat(e, '</span>')
                  )
                  .replace(
                    '%n',
                    "<span style='color:#FFDD50'>".concat(t, '</span>')
                  )
                  .replace(
                    '%n',
                    "<span style='color:#FF4D4D'>".concat(a, '</span>')
                  )
              );
            },
            getKOMsg: function (t, e) {
              return ''
                .concat(
                  this.$t('S_MEMBER'),
                  "<span style='color:var(--msg-blue)'>"
                )
                .concat(t, '</span>')
                .concat(
                  this.$t('S_HAS'),
                  "\n            <span style='color:#e53266'>"
                )
                .concat(ut(e), ' </span>');
            },
            folloeBet: function (t) {
              var e = this;
              this.actionSetFollowBet(t.orderId).then(function () {
                e.$emit('openLiveGame', t.gameCode);
              });
            },
            clearInterval: (function (t) {
              function e() {
                return t.apply(this, arguments);
              }
              return (
                (e.toString = function () {
                  return t.toString();
                }),
                e
              );
            })(function () {
              clearTimeout(this.scrollInterval),
                clearInterval(this.enterMsgInterval),
                clearInterval(this.enterVipMsgInterval);
            }),
          }
        ),
      },
      $a = Ga,
      Ua = (a('99ea'), Object(z['a'])($a, Aa, ya, !1, null, '838d32ec', null)),
      xa = Ua.exports,
      Fa = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          {
            staticClass: 'bottom-modal-wrap',
            on: {
              click: function (e) {
                return e.target !== e.currentTarget ? null : t.closeModal(e);
              },
            },
          },
          [
            a(
              'div',
              { staticClass: 'online-member-wrap' },
              [
                a(
                  'el-tabs',
                  {
                    attrs: { stretch: !0 },
                    model: {
                      value: t.onlineUserType,
                      callback: function (e) {
                        t.onlineUserType = e;
                      },
                      expression: 'onlineUserType',
                    },
                  },
                  [
                    a('el-tab-pane', {
                      attrs: {
                        label:
                          t.$t('S_ONLINE_GUARD') +
                          '(' +
                          t.roomCount.onlineGuard +
                          ')',
                        name: 'guardianlist',
                      },
                    }),
                    a('el-tab-pane', {
                      attrs: {
                        label:
                          t.$t('S_ONLINE_USER') +
                          '(' +
                          t.roomCount.roomCount +
                          ')',
                        name: 'onlinelist',
                      },
                    }),
                  ],
                  1
                ),
                a(
                  'div',
                  { staticClass: 'user-wrap' },
                  t._l(t.filterList, function (e) {
                    return a(
                      'div',
                      {
                        key: e.id,
                        staticClass: 'user-item',
                        on: {
                          click: function (a) {
                            return t.openUserInfo(e);
                          },
                        },
                      },
                      [
                        a('avatar', {
                          attrs: {
                            'frame-path': t.$wsGetCdnPath(e.frame),
                            'headphoto-path': t.$wsGetCdnPath(e.headphoto),
                          },
                        }),
                        a(
                          'div',
                          { staticClass: 'badges-wrap' },
                          t._l(e.badges, function (e, n) {
                            return a('img', {
                              key: n,
                              attrs: { src: t.$wsGetCdnPath(e) },
                            });
                          }),
                          0
                        ),
                        a('div', { staticClass: 'user-name' }, [
                          t._v(t._s(e.nickname)),
                        ]),
                      ],
                      1
                    );
                  }),
                  0
                ),
              ],
              1
            ),
          ]
        );
      },
      Ha = [],
      Ba = a('7150'),
      Wa = {
        components: { avatar: Ba['a'] },
        data: function () {
          return { onlineUserType: 'guardianlist' };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])({}, Object(r['d'])('chatroom', ['roomCount'])),
              Object(r['c'])(['getDefaultUserImg'])
            ),
            Object(r['c'])('chatroom', ['getChatUser'])
          ),
          {},
          {
            filterList: function () {
              return 'guardianlist' === this.onlineUserType
                ? this.getChatUser.guardianlist
                : this.getChatUser.onlinelist.slice(0, 50);
            },
          }
        ),
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              {},
              Object(r['b'])([
                'actionSetWholePageType',
                'actionSetWholePageOptions',
              ])
            ),
            Object(r['b'])('chatroom', ['actionSetChatroomModalType'])
          ),
          {},
          {
            closeModal: function () {
              this.$emit('closeModal');
            },
            setOnlineUser: function (t) {
              this.onlineUserType = t;
            },
            openUserInfo: function (t) {
              this.actionSetWholePageType('memInfo'),
                this.actionSetWholePageOptions({
                  targetId: t.lottId,
                  showPage: 'card',
                  isStreamerCard: !1,
                  isAdmin: !!t.isAdmin,
                  isFakeUser: -1 === t.identityId,
                });
            },
          }
        ),
      },
      Va = Wa,
      Ya = (a('d252'), Object(z['a'])(Va, Fa, Ha, !1, null, '31e44841', null)),
      Ka = Ya.exports,
      Xa = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return Object.keys(t.streamerInfo).length
          ? a(
              'div',
              {
                staticClass: 'bottom-modal-wrap',
                on: {
                  click: function (e) {
                    return e.target !== e.currentTarget
                      ? null
                      : t.closeModal(e);
                  },
                },
              },
              [
                a(
                  'div',
                  { staticClass: 'streamer-info-wrap' },
                  [
                    a('avatar', {
                      staticClass: 'streamer-avatar',
                      attrs: {
                        'frame-path': t.streamerInfo.frame,
                        'headphoto-path': t.streamerInfo.head_photo,
                      },
                    }),
                    a('div', { staticClass: 'streamer-info-text' }, [
                      a('div', { staticClass: 'streamer-base-info' }, [
                        a(
                          'div',
                          { staticClass: 'streamer-name' },
                          [
                            t._l(t.streamerInfo.badges, function (t, e) {
                              return a('img', {
                                key: 'badges-' + e,
                                staticClass: 'badge',
                                attrs: { src: t },
                              });
                            }),
                            t._v(' ' + t._s(t.streamerInfo.alias) + ' '),
                          ],
                          2
                        ),
                        a('div', { staticClass: 'streamer-id' }, [
                          t._v('ID：' + t._s(t.streamerInfo.id)),
                        ]),
                        t.streamerInfo.intro
                          ? a('div', { staticClass: 'streamer-description' }, [
                              t._v(' ' + t._s(t.streamerInfo.intro) + ' '),
                            ])
                          : t._e(),
                      ]),
                      a('div', { staticClass: 'streamer-follow' }, [
                        a(
                          'div',
                          {
                            on: {
                              click: function (e) {
                                return t.openPage('fans');
                              },
                            },
                          },
                          [
                            a('div', [
                              t._v(
                                ' ' +
                                  t._s(
                                    t._f('amountFormat')(
                                      t.streamerInfo.attention_num
                                    )
                                  ) +
                                  ' '
                              ),
                            ]),
                            a('div', [t._v(t._s(t.$t('S_FANS')))]),
                          ]
                        ),
                        a(
                          'div',
                          {
                            on: {
                              click: function (e) {
                                return t.openPage('guard');
                              },
                            },
                          },
                          [
                            a('div', [
                              t._v(
                                ' ' +
                                  t._s(
                                    t._f('amountFormat')(
                                      t.streamerInfo.guardian_num
                                    )
                                  ) +
                                  ' '
                              ),
                            ]),
                            a('div', [t._v(t._s(t.$t('S_GUARD')))]),
                          ]
                        ),
                        a(
                          'div',
                          {
                            on: {
                              click: function (e) {
                                return t.openWholePage('showDiamondList');
                              },
                            },
                          },
                          [
                            a('div', [
                              t._v(
                                t._s(
                                  t._f('amountFormat')(t.streamerInfo.paopao)
                                )
                              ),
                            ]),
                            a('div', [t._v(t._s(t.$t('S_BUBBLE')))]),
                          ]
                        ),
                      ]),
                    ]),
                    a(
                      'el-breadcrumb',
                      {
                        staticClass: 'streamer-info-nav-wrap',
                        attrs: { separator: '|' },
                      },
                      [
                        a('el-breadcrumb-item', [
                          a(
                            'span',
                            {
                              on: {
                                click: function (e) {
                                  return t.openPage('card');
                                },
                              },
                            },
                            [t._v(' ' + t._s(t.$t('S_HOME_PAGE')) + ' ')]
                          ),
                        ]),
                        a('el-breadcrumb-item', [
                          a(
                            'span',
                            {
                              on: {
                                click: function (e) {
                                  return t.actionSetChatroomModalType(
                                    'showGiftList'
                                  );
                                },
                              },
                            },
                            [t._v(' ' + t._s(t.$t('S_GIVE_GIFT')) + ' ')]
                          ),
                        ]),
                        a(
                          'el-breadcrumb-item',
                          {
                            class: t.getUserIsAttentionStreamer
                              ? ''
                              : 'follow-streamer',
                          },
                          [
                            t.getUserIsAttentionStreamer
                              ? a(
                                  'span',
                                  { on: { click: t.cancelAttentionStreamer } },
                                  [
                                    t._v(
                                      ' ' +
                                        t._s(t.$t('S_CANCEL_ATTENTION')) +
                                        ' '
                                    ),
                                  ]
                                )
                              : a(
                                  'span',
                                  { on: { click: t.attentionStreamer } },
                                  [
                                    t._v(' ' + t._s(t.$t('S_FOLLOW')) + ' '),
                                    a('font-awesome-icon', {
                                      attrs: { icon: 'plus' },
                                    }),
                                  ],
                                  1
                                ),
                          ]
                        ),
                      ],
                      1
                    ),
                  ],
                  1
                ),
              ]
            )
          : t._e();
      },
      qa = [];
    function za(t) {
      var e;
      switch (t) {
        case 'F':
          e = '/images/common/gender_female.png';
          break;
        case 'M':
          e = '/images/common/gender_male.png';
          break;
        default:
          e = !1;
      }
      return e;
    }
    function Qa(t) {
      return '' !== t
        ? '/images/chatroom/streamerCard/icon_'.concat(t, '.png')
        : '/images/chatroom/streamerCard/icon_line.png';
    }
    function Ja(t) {
      var e = {
        'PK-PAOPK-1': 'pao_bjpk@2x.png',
        'LT-PAO1MLT-1': 'pao_LT@2x.png',
        'SC-PAO1MSC-1': 'pao_lgsc@2x.png',
        'Q3-PAOQ3-1': 'pao_lgq3@2x.png',
        'E5-PAOE5-1': 'pao_lge5@2x.png',
        'SICBO-PAOFSC-1': 'pao_sicbo@2x.png',
      };
      return e[t] ? e[t] : '';
    }
    var Za = {
        components: { avatar: Ba['a'] },
        data: function () {
          return { streamerInfo: {} };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])({}, Object(r['d'])(['user'])),
            Object(r['d'])('chatroom', ['currentRoom'])
          ),
          Object(r['c'])({
            defaultUserImg: 'getDefaultUserImg',
            getUserIsAttentionStreamer: 'getUserIsAttentionStreamer',
          })
        ),
        created: function () {
          var t = this;
          Object(et['h'])(this.currentRoom.streamerId).then(function (e) {
            var a = e.data;
            '0' === a.error_code && (t.streamerInfo = a.result);
          });
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              {},
              Object(r['b'])([
                'actionAttentionStreamer',
                'actionCancelAttentionStreamer',
                'actionSetHintInfo',
                'actionSetWholePageType',
                'actionSetWholePageOptions',
              ])
            ),
            Object(r['b'])('chatroom', ['actionSetChatroomModalType'])
          ),
          {},
          {
            closeModal: function () {
              this.$emit('closeModal');
            },
            getGender: function (t) {
              return this.$getCdnPath(za(t));
            },
            attentionStreamer: function () {
              if (this.currentRoom.openAttention) {
                var t = { streamer_id: this.currentRoom.streamerId };
                this.actionAttentionStreamer(t);
              } else this.actionSetHintInfo(this.$t('S_CANT_ATTENTION_TIP'));
            },
            cancelAttentionStreamer: function () {
              var t = this,
                e = { streamer_id: this.currentRoom.streamerId };
              this.actionCancelAttentionStreamer(e).then(function (e) {
                '0' === e.error_code &&
                  t.actionSetHintInfo(t.$t('S_CANCEL_ATTENTION_SUCCESS'));
              });
            },
            tagStreamer: function () {
              this.$emit('inputFocus', this.streamerInfo.alias, !0),
                this.closeModal();
            },
            openPage: function (t) {
              this.actionSetChatroomModalType(null),
                this.actionSetWholePageType('memInfo'),
                this.actionSetWholePageOptions({
                  targetId: this.streamerInfo.id,
                  showPage: t,
                  isStreamerCard: !0,
                });
            },
            openWholePage: function (t) {
              this.actionSetChatroomModalType(null),
                this.actionSetWholePageType(t);
            },
          }
        ),
      },
      tn = Za,
      en = (a('8663'), Object(z['a'])(tn, Xa, qa, !1, null, '7d1d4948', null)),
      an = en.exports,
      nn = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return t.userInfo
          ? a(
              'div',
              {
                class: [
                  'bottom-modal-wrap',
                  { 'upper-top': t.userInfo.id !== t.user.lott_id },
                ],
                on: {
                  click: function (e) {
                    return e.target !== e.currentTarget
                      ? null
                      : t.closeModal(e);
                  },
                },
              },
              [
                a(
                  'div',
                  {
                    staticClass: 'user-info-wrap',
                    class:
                      t.userInfo.id === t.user.lott_id ? 'self-info-wrap' : '',
                  },
                  [
                    a('avatar', {
                      staticClass: 'user-avatar',
                      attrs: {
                        'frame-path': t.userInfo.frame,
                        'headphoto-path': t.userInfo.headphoto,
                      },
                      nativeOn: {
                        click: function (e) {
                          return t.openPage('card');
                        },
                      },
                    }),
                    a('div', { staticClass: 'user-info-text' }, [
                      a('div', { staticClass: 'user-base-info' }, [
                        a(
                          'div',
                          { staticClass: 'user-name' },
                          [
                            t._l(t.userInfo.badges, function (t, e) {
                              return a('img', {
                                key: 'badges-' + e,
                                staticClass: 'badge',
                                attrs: { src: t },
                              });
                            }),
                            t._v(' ' + t._s(t.userInfo.nickname) + ' '),
                          ],
                          2
                        ),
                        a('div', { staticClass: 'id-wrap' }, [
                          a('div', { staticClass: 'id' }, [
                            t._v('ID：' + t._s(t.userInfo.id)),
                          ]),
                          t.userInfo.hometown
                            ? a('div', { staticClass: 'hometown' }, [
                                a('img', {
                                  attrs: {
                                    src: t.$getCdnPath(
                                      '/images/userInfoCard/ic_member_map.svg'
                                    ),
                                  },
                                }),
                                t._v(t._s(t.userInfo.hometown)),
                              ])
                            : t._e(),
                        ]),
                        t.userInfo.intro.length
                          ? a('div', { staticClass: 'user-description' }, [
                              t._v(' ' + t._s(t.userInfo.intro) + ' '),
                            ])
                          : t._e(),
                      ]),
                      a('div', { staticClass: 'user-follow' }, [
                        a(
                          'div',
                          {
                            on: {
                              click: function (e) {
                                return t.openPage('follow');
                              },
                            },
                          },
                          [
                            a('div', [
                              t._v(
                                t._s(t._f('amountFormat')(t.userInfo.trackNum))
                              ),
                            ]),
                            a('div', [t._v(t._s(t.$t('S_TRACK_COUNT')))]),
                          ]
                        ),
                        a('div', [
                          a('div', [
                            t._v(
                              t._s(t._f('amountFormat')(t.userInfo.paoTotal))
                            ),
                          ]),
                          a('div', [t._v(t._s(t.$t('S_BUBBLE')))]),
                        ]),
                      ]),
                    ]),
                    null === t.wholePageType && t.userInfo.id !== t.user.lott_id
                      ? a(
                          'div',
                          {
                            staticClass: 'user-info-nav-wrap',
                            on: {
                              click: function (e) {
                                return t.openPage('card');
                              },
                            },
                          },
                          [t._v(' ' + t._s(t.$t('S_HOME_PAGE')) + ' ')]
                        )
                      : t._e(),
                  ],
                  1
                ),
              ]
            )
          : t._e();
      },
      sn = [],
      rn = {
        components: { avatar: Ba['a'] },
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])({}, Object(r['d'])(['user', 'wholePageType'])),
              Object(r['d'])('chatroom', ['currentRoom'])
            ),
            Object(r['c'])({
              defaultUserImg: 'getDefaultUserImg',
              getUserIsAttentionStreamer: 'getUserIsAttentionStreamer',
            })
          ),
          Object(r['c'])('chatroom', {
            userInfo: 'getUserInfo',
            chatroomModalOptions: 'getChatroomModalOptions',
          })
        ),
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              {},
              Object(r['b'])([
                'actionSetWholePageType',
                'actionSetWholePageOptions',
              ])
            ),
            Object(r['b'])('chatroom', ['actionGetFansList'])
          ),
          {},
          {
            closeModal: function () {
              this.$emit('closeModal');
            },
            getGender: function (t) {
              return this.$getCdnPath(za(t));
            },
            tagUser: function () {
              this.$emit('inputFocus', this.info.nickname, !0),
                this.closeModal();
            },
            openPage: function (t) {
              this.userInfo.id !== this.user.lott_id &&
                (this.actionSetWholePageType('memInfo'),
                this.actionSetWholePageOptions(
                  Object(V['a'])(
                    {
                      targetId: this.userInfo.id,
                      showPage: t,
                      isStreamerCard: !1,
                    },
                    this.chatroomModalOptions
                  )
                ));
            },
          }
        ),
      },
      on = rn,
      cn = (a('5e9a'), Object(z['a'])(on, nn, sn, !1, null, '4d67e928', null)),
      un = cn.exports,
      ln = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return Object.keys(t.streamerInfo).length
          ? a('div', { staticClass: 'center-modal-wrap' }, [
              a('div', { staticClass: 'streamer-card-wrap' }, [
                a('img', {
                  staticClass: 'close-btn',
                  attrs: {
                    src: t.$getCdnPath('/images/common/ic_closure.svg'),
                  },
                  on: { click: t.closeModal },
                }),
                a('div', { staticClass: 'streamer-image' }, [
                  a('img', {
                    staticClass: 'headphoto',
                    attrs: {
                      src: t.streamerInfo.head_photo,
                      onerror: t.defaultUserImg,
                    },
                  }),
                ]),
                a('div', { staticClass: 'streamer-name' }, [
                  t._v(
                    t._s(
                      t.$t('S_CRAD_VARI').replace('%n', t.streamerInfo.nickname)
                    )
                  ),
                ]),
                a('div', { staticClass: 'streamer-intro' }, [
                  t._v(t._s(t.streamerInfo.intro)),
                ]),
                a('div', { staticClass: 'get-wrap' }, [
                  a('img', {
                    attrs: {
                      src: t.libGetSocialSoftwareIcon(t.streamerInfo.type),
                    },
                  }),
                  a(
                    'div',
                    {
                      staticClass: 'streamer-id-wrap',
                      class: { streamerId: t.showStreamerCardId },
                    },
                    [t._v(' ' + t._s(t.streamerConnectId) + ' ')]
                  ),
                  a(
                    'div',
                    {
                      staticClass: 'get-btn',
                      on: { click: t.getStreamerConnectId },
                    },
                    [t._v(' ' + t._s(t.$t('S_GET_STREAMER_CARD')) + ' ')]
                  ),
                ]),
                a('div', { staticClass: 'get-progress-wrap' }, [
                  a('div', { staticClass: 'get-progress-title' }, [
                    t._v(' ' + t._s(t.$t('S_CARD_PROGRESS')) + ' '),
                    a('br'),
                    t._v(t._s(t.$t('S_GET_CARD')) + ' '),
                  ]),
                  a('div', { staticClass: 'progress-bar' }, [
                    a('span', [
                      t._v(
                        t._s(
                          t.streamerInfo.current_amount +
                            ' / ' +
                            t.streamerInfo.limit_amount
                        )
                      ),
                    ]),
                    a('div', {
                      staticClass: 'progress-bar-inner',
                      style: t.getProgressWidth,
                    }),
                  ]),
                  a('div', { staticClass: 'info-wrap' }, [
                    a('div', [t._v('1.' + t._s(t.$t('S_NEED_NICKNAME_INFO')))]),
                    a('div', [
                      t._v('2.' + t._s(t.$t('S_CONNECT_SERVICE_INFO'))),
                    ]),
                  ]),
                ]),
              ]),
            ])
          : t._e();
      },
      dn = [],
      mn = {
        data: function () {
          return { streamerInfo: {}, showStreamerCardId: !1 };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])({}, Object(r['d'])(['user'])),
              Object(r['d'])('chatroom', ['currentRoom', 'streamerCard'])
            ),
            Object(r['c'])({ defaultUserImg: 'getDefaultUserImg' })
          ),
          {},
          {
            getProgressPercent: function () {
              var t = this.streamerInfo;
              return t.current_amount / t.limit_amount;
            },
            getProgressWidth: function () {
              return 'width:'.concat(100 * this.getProgressPercent, '%');
            },
            streamerConnectId: function () {
              return this.showStreamerCardId
                ? this.streamerCard
                : '****************';
            },
          }
        ),
        created: function () {
          var t = this;
          Object(et['h'])(this.currentRoom.streamerId).then(function (e) {
            var a = e.data;
            '0' === a.error_code && (t.streamerInfo = a.result);
          });
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])({}, Object(r['b'])(['actionSetHintInfo'])),
            Object(r['b'])('chatroom', ['actionGetStreamerCard'])
          ),
          {},
          {
            closeModal: function () {
              this.$emit('closeModal');
            },
            libGetSocialSoftwareIcon: function (t) {
              return this.$getCdnPath(Qa(t));
            },
            getStreamerConnectId: function () {
              var t = this;
              1 !== this.getProgressPercent
                ? this.actionSetHintInfo(this.$t('S_STREAMER_CARD_HINT'))
                : this.actionGetStreamerCard(this.currentRoom.streamerId).then(
                    function () {
                      1 === t.getProgressPercent &&
                        setTimeout(function () {
                          t.showStreamerCardId = !0;
                        }, 100);
                    }
                  );
            },
          }
        ),
      },
      _n = mn,
      hn = (a('da83'), Object(z['a'])(_n, ln, dn, !1, null, '2d394fd4', null)),
      fn = hn.exports,
      pn = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return t.getContributeList
          ? a(
              'div',
              {
                class: ['bottom-modal-wrap', { 'whole-page-wrap': t.isModel }],
                on: {
                  click: function (e) {
                    return e.target !== e.currentTarget
                      ? null
                      : t.closeModal(e);
                  },
                },
              },
              [
                a(
                  'div',
                  { staticClass: 'contribution-list-wrap' },
                  [
                    a('div', { staticClass: 'title-wrap' }, [
                      t.isModel
                        ? a(
                            'div',
                            {
                              staticClass: 'back-btn',
                              on: {
                                click: function (e) {
                                  return t.actionSetWholePageType(null);
                                },
                              },
                            },
                            [
                              a('font-awesome-icon', {
                                attrs: { icon: 'chevron-left' },
                              }),
                            ],
                            1
                          )
                        : t._e(),
                      t._v(' ' + t._s(this.$t('S_CONTRIBUTE_LIST')) + ' '),
                    ]),
                    a(
                      'el-tabs',
                      {
                        attrs: { stretch: '' },
                        model: {
                          value: t.contributionType,
                          callback: function (e) {
                            t.contributionType = e;
                          },
                          expression: 'contributionType',
                        },
                      },
                      [
                        a('el-tab-pane', {
                          attrs: {
                            label: t.$t('S_DIAMOND_RANK'),
                            name: 'diamond',
                          },
                        }),
                        a('el-tab-pane', {
                          attrs: {
                            label: t.$t('S_BUBBLE_RANK'),
                            name: 'paopao',
                          },
                        }),
                      ],
                      1
                    ),
                    a('div', { staticClass: 'contribution-rank-wrap' }, [
                      a('div', { staticClass: 'contribution-rank-top-wrap' }, [
                        a(
                          'div',
                          { staticClass: 'contribution-nav-wrap' },
                          t._l(t.contributionNavOptions, function (e) {
                            return a(
                              'div',
                              {
                                key: e.value,
                                staticClass: 'contribution-nav-item ',
                                class: {
                                  active: t.contributionFreq === e.value,
                                },
                                on: {
                                  click: function (a) {
                                    t.contributionFreq = e.value;
                                  },
                                },
                              },
                              [t._v(' ' + t._s(e.label) + ' ')]
                            );
                          }),
                          0
                        ),
                        a(
                          'div',
                          { staticClass: 'top-three-wrap' },
                          t._l(t.topThreeList, function (e, n) {
                            return a(
                              'div',
                              {
                                key: n,
                                staticClass: 'top-three-item',
                                on: {
                                  click: function (a) {
                                    return t.openUserModal(e);
                                  },
                                },
                              },
                              [
                                a('div', { staticClass: 'header-wrap' }, [
                                  a('img', {
                                    staticClass: 'header-frame',
                                    attrs: {
                                      src: t.$getCdnPath(
                                        '/images/common/no' + n + '.png'
                                      ),
                                    },
                                  }),
                                  a('img', {
                                    staticClass: 'header-img',
                                    attrs: {
                                      src: e.head_photo,
                                      onerror: t.getDefaultUserImg,
                                    },
                                  }),
                                ]),
                                a('div', [
                                  a(
                                    'div',
                                    { staticClass: 'badges-wrap' },
                                    t._l(e.badges, function (t, e) {
                                      return a('img', {
                                        key: 'badges-' + e,
                                        attrs: { src: t },
                                      });
                                    }),
                                    0
                                  ),
                                  a(
                                    'div',
                                    { staticClass: 'top-three-user-name' },
                                    [t._v(' ' + t._s(e.alias) + ' ')]
                                  ),
                                  a(
                                    'div',
                                    { staticClass: 'top-three-user-info' },
                                    [
                                      a(
                                        'div',
                                        {
                                          class: [
                                            'amount-wrap',
                                            {
                                              opacity: !e.id,
                                              yellowText:
                                                'diamond' ===
                                                t.contributionType,
                                              diamond:
                                                'diamond' ===
                                                t.contributionType,
                                            },
                                          ],
                                        },
                                        [
                                          t._v(
                                            ' ' +
                                              t._s(
                                                t._f('amountFormat')(
                                                  e[t.contributionType]
                                                )
                                              ) +
                                              ' '
                                          ),
                                        ]
                                      ),
                                    ]
                                  ),
                                ]),
                              ]
                            );
                          }),
                          0
                        ),
                      ]),
                      a(
                        'div',
                        { staticClass: 'rank-list' },
                        [
                          t._l(t.filterList, function (e, n) {
                            return a(
                              'div',
                              {
                                key: n,
                                staticClass: 'rank-item',
                                on: {
                                  click: function (a) {
                                    return t.openUserModal(e);
                                  },
                                },
                              },
                              [
                                a(
                                  'div',
                                  [
                                    a(
                                      'div',
                                      { staticClass: 'rank-user-index' },
                                      [t._v(t._s(n + 4))]
                                    ),
                                    a('Avatar', {
                                      staticClass: 'avatar-wrap',
                                      attrs: {
                                        'frame-path': e.frame,
                                        'headphoto-path': e.head_photo,
                                      },
                                    }),
                                    a('div', { staticClass: 'user-info' }, [
                                      a(
                                        'div',
                                        { staticClass: 'badges-wrap' },
                                        t._l(e.badges, function (t, e) {
                                          return a('img', {
                                            key: 'badges-' + e,
                                            attrs: { src: t },
                                          });
                                        }),
                                        0
                                      ),
                                      a(
                                        'div',
                                        { staticClass: 'rank-username' },
                                        [t._v(' ' + t._s(e.alias) + ' ')]
                                      ),
                                    ]),
                                  ],
                                  1
                                ),
                                a(
                                  'div',
                                  {
                                    class: {
                                      yellowText:
                                        'diamond' === t.contributionType,
                                    },
                                  },
                                  [
                                    t._v(
                                      ' ' +
                                        t._s(
                                          t._f('amountFormat')(
                                            e[t.contributionType]
                                          )
                                        ) +
                                        ' '
                                    ),
                                    a('img', {
                                      staticClass: 's-icon',
                                      attrs: {
                                        src:
                                          'diamond' === t.contributionType
                                            ? t.$getCdnPath(
                                                '/images/common/ic_diamond.svg'
                                              )
                                            : t.$getCdnPath(
                                                '/images/common/ic_bubble.svg'
                                              ),
                                      },
                                    }),
                                  ]
                                ),
                              ]
                            );
                          }),
                          t.filterList.length < 2
                            ? t._l(2 - t.filterList.length, function (e, n) {
                                return a(
                                  'div',
                                  {
                                    key: n + t.filterList.length + 4,
                                    staticClass: 'rank-item',
                                  },
                                  [
                                    a(
                                      'div',
                                      [
                                        a(
                                          'div',
                                          { staticClass: 'rank-user-index' },
                                          [
                                            t._v(
                                              ' ' +
                                                t._s(
                                                  n + t.filterList.length + 4
                                                ) +
                                                ' '
                                            ),
                                          ]
                                        ),
                                        a('Avatar', {
                                          staticClass: 'avatar-wrap',
                                          attrs: {
                                            'headphoto-path': t.$getCdnPath(
                                              '/images/material/img_login@2x.png'
                                            ),
                                          },
                                        }),
                                        a('div', [
                                          t._v(t._s(t.$t('S_WAIT_USER'))),
                                        ]),
                                      ],
                                      1
                                    ),
                                  ]
                                );
                              })
                            : t._e(),
                        ],
                        2
                      ),
                    ]),
                  ],
                  1
                ),
              ]
            )
          : t._e();
      },
      gn = [],
      Sn = {
        components: { Avatar: Ba['a'] },
        props: { isPaopao: { type: Boolean, default: !1 } },
        data: function () {
          return { contributionType: 'diamond', contributionFreq: 'day' };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])({}, Object(r['d'])('chatroom', ['currentRoom'])),
              Object(r['c'])('chatroom', [
                'getChatroomModalType',
                'getContributeList',
              ])
            ),
            Object(r['c'])(['getDefaultUserImg', 'getWholePageType'])
          ),
          {},
          {
            topThreeList: function () {
              var t = this,
                e = {
                  alias: this.$t('S_WAIT_USER'),
                  head_photo: this.$getCdnPath(
                    '/images/material/img_login@2x.png'
                  ),
                },
                a = [2, 1, 3],
                n = a.map(function (a) {
                  return t.fullList[a - 1] ? t.fullList[a - 1] : e;
                });
              return n;
            },
            fullList: function () {
              var t;
              return null ===
                (t = this.getContributeList[this.contributionType]) ||
                void 0 === t
                ? void 0
                : t[this.contributionFreq];
            },
            filterList: function () {
              return this.fullList.length > 3
                ? this.fullList.slice(3, this.fullList.length)
                : [];
            },
            contributionNavOptions: function () {
              return [{ label: this.$t('S_DAILY_LIST'), value: 'day' }];
            },
            isModel: function () {
              return 'showDiamondList' === this.getWholePageType;
            },
          }
        ),
        created: function () {
          this.actionGetContribute({ streamerId: this.currentRoom.streamerId }),
            (this.contributionType = this.isPaopao ? 'paopao' : 'diamond');
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              {},
              Object(r['b'])([
                'actionSetWholePageType',
                'actionSetWholePageOptions',
              ])
            ),
            Object(r['b'])('chatroom', [
              'actionGetContribute',
              'actionSetChatroomModalType',
            ])
          ),
          {},
          {
            closeModal: function () {
              this.$emit('closeModal');
            },
            openUserModal: function (t) {
              t.id &&
                (this.actionSetWholePageType('memInfo'),
                this.actionSetWholePageOptions({
                  isFakeUser: -1 === t.identityId,
                  targetId: t.id,
                  showPage: 'card',
                  isStreamerCard: !1,
                }));
            },
          }
        ),
      },
      vn = Sn,
      bn = (a('061e'), Object(z['a'])(vn, pn, gn, !1, null, 'c136da70', null)),
      Cn = bn.exports,
      On = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          {
            staticClass: 'bottom-modal-wrap',
            on: {
              click: function (e) {
                return e.target !== e.currentTarget ? null : t.closeModal(e);
              },
            },
          },
          [
            a(
              'div',
              { staticClass: 'guard-list-wrap' },
              [
                a('div', { staticClass: 'title-wrap' }, [
                  t._v(
                    ' ' + t._s(t.$t('S_GUARD')) + '(' + t._s(t.guardNum) + ') '
                  ),
                ]),
                t.guardianList.length
                  ? a('div', { staticClass: 'guard-user-wrap' }, [
                      a('div', { staticClass: 'top-guard-user' }, [
                        a(
                          'div',
                          {
                            staticClass: 'header-wrap',
                            on: {
                              click: function (e) {
                                return t.openUserInfo(t.topGaurd);
                              },
                            },
                          },
                          [
                            t.topGaurd.frame
                              ? a('img', {
                                  staticClass: 'header-frame',
                                  attrs: { src: t.topGaurd.frame },
                                })
                              : t._e(),
                            a('img', {
                              staticClass: 'header-img',
                              attrs: {
                                src: t.topGaurd.headphoto,
                                onerror: t.getDefaultUserImg,
                              },
                            }),
                          ]
                        ),
                        a('div', { staticClass: 'user-info' }, [
                          a(
                            'span',
                            { staticClass: 'badges-wrap' },
                            t._l(t.topGaurd.badges, function (t, e) {
                              return a('img', { key: e, attrs: { src: t } });
                            }),
                            0
                          ),
                          t._v(' ' + t._s(t.topGaurd.name) + ' '),
                        ]),
                        a('div', { staticClass: 'contribute_power' }, [
                          t._v(
                            ' ' +
                              t._s(
                                t._f('amountFormat')(t.topGaurd.contribute)
                              ) +
                              ' '
                          ),
                        ]),
                      ]),
                      a(
                        'div',
                        { staticClass: 'guard-user-list-wrap' },
                        t._l(t.sortGaurdList, function (e) {
                          return a(
                            'div',
                            {
                              key: e.id,
                              staticClass: 'guard-user-item',
                              on: {
                                click: function (a) {
                                  return t.openUserInfo(e);
                                },
                              },
                            },
                            [
                              a('avatar', {
                                attrs: {
                                  'frame-path': e.frame,
                                  'headphoto-path': e.headphoto,
                                },
                              }),
                              a(
                                'div',
                                { staticClass: 'badges-wrap' },
                                t._l(e.badges, function (t, e) {
                                  return a('img', {
                                    key: e,
                                    attrs: { src: t },
                                  });
                                }),
                                0
                              ),
                              a('div', { staticClass: 'guardian-name' }, [
                                t._v(' ' + t._s(e.name) + ' '),
                              ]),
                              a('div', { staticClass: 'contribute_power' }, [
                                t._v(
                                  ' ' +
                                    t._s(t._f('amountFormat')(e.contribute)) +
                                    ' '
                                ),
                                a('img', {
                                  attrs: {
                                    src: t.$getCdnPath(
                                      '/images/common/ic_diamond.svg'
                                    ),
                                  },
                                }),
                              ]),
                            ],
                            1
                          );
                        }),
                        0
                      ),
                    ])
                  : a('NoDataWrap', {
                      staticClass: 'guard-user-wrap',
                      attrs: {
                        src: '/images/common/no_data/img_guardian_no_data.svg',
                        text: t.$t('S_NO_GUARD'),
                      },
                    }),
                a('div', { staticClass: 'open-guard-wrap' }, [
                  a('div', [
                    t._v(' ' + t._s(t.$t('S_OPEN_GUARD_INFO')) + ' '),
                    a(
                      'div',
                      {
                        staticClass: 'open-guard-btn',
                        on: {
                          click: function (e) {
                            return t.actionSetChatroomModalType(
                              'showOpenGuard'
                            );
                          },
                        },
                      },
                      [t._v(' ' + t._s(t.$t('S_OPEN_GUARD')) + ' ')]
                    ),
                  ]),
                ]),
              ],
              1
            ),
          ]
        );
      },
      Tn = [],
      En = {
        components: { NoDataWrap: pt['a'], avatar: Ba['a'] },
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])(
                Object(V['a'])({}, Object(r['d'])(['user'])),
                Object(r['d'])('chatroom', ['currentRoom'])
              ),
              Object(r['c'])(['getDefaultUserImg'])
            ),
            Object(r['c'])('chatroom', { guardianList: 'getGuardianList' })
          ),
          {},
          {
            topGaurd: function () {
              return this.guardianList[0];
            },
            sortGaurdList: function () {
              return this.guardianList.filter(function (t, e) {
                return 0 !== e;
              });
            },
            guardNum: function () {
              return this.guardianList ? this.guardianList.length : 0;
            },
          }
        ),
        created: function () {
          this.actionGetGuardians(this.currentRoom.streamerId);
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              {},
              Object(r['b'])([
                'actionSetWholePageType',
                'actionSetWholePageOptions',
              ])
            ),
            Object(r['b'])('chatroom', [
              'actionSetChatroomModalType',
              'actionGetGuardians',
            ])
          ),
          {},
          {
            closeModal: function () {
              this.$emit('closeModal');
            },
            openUserInfo: function (t) {
              this.actionSetWholePageType('memInfo'),
                this.actionSetWholePageOptions({
                  isFakeUser: -1 === t.identityId,
                  targetId: t.id,
                  showPage: 'card',
                  isStreamerCard: !1,
                });
            },
          }
        ),
      },
      In = En,
      An = (a('5d41'), Object(z['a'])(In, On, Tn, !1, null, '1d41c18c', null)),
      yn = An.exports,
      wn = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          {
            staticClass: 'bottom-modal-wrap',
            on: {
              click: function (e) {
                return e.target !== e.currentTarget ? null : t.closeModal(e);
              },
            },
          },
          [
            a(
              'div',
              { staticClass: 'donate-wrap' },
              [
                a(
                  'div',
                  { staticClass: 'nav-item-wrap' },
                  [
                    a(
                      'el-tabs',
                      {
                        staticClass: 'dark',
                        attrs: { stretch: !0 },
                        model: {
                          value: t.activeNav,
                          callback: function (e) {
                            t.activeNav = e;
                          },
                          expression: 'activeNav',
                        },
                      },
                      t._l(t.navItems, function (e) {
                        return a('el-tab-pane', {
                          key: e.key,
                          attrs: { label: t.$t(e.title), name: e.key },
                        });
                      }),
                      1
                    ),
                  ],
                  1
                ),
                'gift' === t.activeNav
                  ? a('Gift', {
                      staticClass: 'center-wrap',
                      attrs: {
                        'select-gift-data': t.selectGiftData,
                        'focus-category': t.selectCategory,
                      },
                      on: {
                        'update:selectGiftData': function (e) {
                          t.selectGiftData = e;
                        },
                        'update:select-gift-data': function (e) {
                          t.selectGiftData = e;
                        },
                        'update:focusCategory': function (e) {
                          t.selectCategory = e;
                        },
                        'update:focus-category': function (e) {
                          t.selectCategory = e;
                        },
                        openAd: t.openAdPage,
                      },
                    })
                  : a('MyBag', {
                      staticClass: 'center-wrap',
                      attrs: { 'select-props-data': t.selectPropsData },
                      on: {
                        'update:selectPropsData': function (e) {
                          t.selectPropsData = e;
                        },
                        'update:select-props-data': function (e) {
                          t.selectPropsData = e;
                        },
                        openAd: t.openAdPage,
                      },
                    }),
                a('div', { staticClass: 'pay-wrap' }, [
                  a('div', { staticClass: 'send-gift-wrap' }, [
                    a('div', { staticClass: 'pay-item' }, [
                      a('div', [
                        a('img', {
                          attrs: {
                            src: t.$getCdnPath(
                              '/images/gift/bar_ic_diamond.svg'
                            ),
                          },
                        }),
                        a('span', [
                          t._v(t._s(t._f('amountFormat')(t.userDiamond))),
                        ]),
                      ]),
                      a(
                        'div',
                        {
                          staticClass: 'exchange-btn',
                          on: {
                            click: function (e) {
                              return t.leaveRoomAndToPage('exchangeDiamond');
                            },
                          },
                        },
                        [t._v(' ' + t._s(t.$t('S_EXCHANGE')) + ' ')]
                      ),
                    ]),
                    a(
                      'div',
                      [
                        'gift' === t.activeNav
                          ? a(
                              'el-select',
                              {
                                model: {
                                  value: t.newGift.num,
                                  callback: function (e) {
                                    t.$set(t.newGift, 'num', e);
                                  },
                                  expression: 'newGift.num',
                                },
                              },
                              t._l(t.giftNumOptions, function (e) {
                                return a(
                                  'el-option',
                                  { key: e, attrs: { value: e } },
                                  [a('span', [t._v(t._s(e))])]
                                );
                              }),
                              1
                            )
                          : t._e(),
                        a(
                          'div',
                          { staticClass: 'send-btn', on: { click: t.send } },
                          [
                            t._v(
                              ' ' +
                                t._s(t.$t(t.sendBtn[t.activeNav].text)) +
                                ' '
                            ),
                          ]
                        ),
                      ],
                      1
                    ),
                  ]),
                ]),
              ],
              1
            ),
            t.usePropsBox
              ? a('div', { staticClass: 'use-props-box' }, [
                  a(
                    'div',
                    { staticClass: 'use-props-input-wrap' },
                    [
                      a('div', { staticClass: 'title' }, [
                        t._v(t._s(t.$t('S_USE_BROADCAST'))),
                      ]),
                      a('el-input', {
                        attrs: {
                          type: 'textarea',
                          placeholder: t.$t('S_PLZ_INPUT_CONTENT'),
                          resize: 'none',
                          autosize: { minRows: 1, maxRows: 4 },
                        },
                        model: {
                          value: t.propsInput,
                          callback: function (e) {
                            t.propsInput = e;
                          },
                          expression: 'propsInput',
                        },
                      }),
                    ],
                    1
                  ),
                  a('div', { staticClass: 'btn-wrap' }, [
                    a(
                      'div',
                      {
                        staticClass: 'cancel-btn',
                        on: { click: t.closePropsBox },
                      },
                      [t._v(' ' + t._s(t.$t('S_CANCEL')) + ' ')]
                    ),
                    a(
                      'div',
                      { staticClass: 'send-btn', on: { click: t.useLoudly } },
                      [t._v(' ' + t._s(t.$t('S_OK')) + ' ')]
                    ),
                  ]),
                ])
              : t._e(),
          ]
        );
      },
      Rn = [],
      Ln = a('624c'),
      Nn = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', [
          a('div', { staticClass: 'top-info-wrap' }, [
            a(
              'div',
              { staticClass: 'gift-option-wrap' },
              [
                a(
                  'el-tabs',
                  {
                    staticClass: 'dark',
                    attrs: { value: t.activeGiftCategory, stretch: '' },
                    on: {
                      'tab-click': function (e) {
                        return t.changeGiftOption(e.name);
                      },
                    },
                  },
                  t._l(t.giftList, function (t, e) {
                    return a('el-tab-pane', {
                      key: e,
                      attrs: { label: t.category, name: e },
                    });
                  }),
                  1
                ),
              ],
              1
            ),
            a(
              'div',
              {
                staticClass: 'become-guard',
                on: {
                  click: function (e) {
                    return t.actionSetChatroomModalType('showOpenGuard');
                  },
                },
              },
              [t._v(' ' + t._s(t.$t('S_BECOME_GUARDIAN')) + ' ')]
            ),
          ]),
          a(
            'div',
            { staticClass: 'gift-content-wrap' },
            [
              t.havedData
                ? a(
                    'swiper',
                    {
                      ref: 'mySwiper',
                      attrs: { options: t.swiperOptions },
                      on: { 'touch-end': t.touchEnd },
                    },
                    [
                      t._l(t.totalPage, function (e) {
                        return a(
                          'swiper-slide',
                          { key: e, staticClass: 'gift-wrap' },
                          t._l(t.activePageList(e), function (e) {
                            return a(
                              'div',
                              {
                                key: e.id,
                                class: [
                                  'gift-item',
                                  {
                                    'gift-item-selected':
                                      t.selectGiftData.id === e.id,
                                  },
                                ],
                                on: {
                                  click: function (a) {
                                    return t.selectGift(e);
                                  },
                                },
                              },
                              [
                                1 === e.status
                                  ? a('div', { staticClass: 'lock-mask' }, [
                                      a('img', {
                                        attrs: {
                                          src: t.$getCdnPath(
                                            '/images/gift/ic_lock.svg'
                                          ),
                                        },
                                      }),
                                    ])
                                  : t._e(),
                                a('img', {
                                  directives: [
                                    {
                                      name: 'lazy',
                                      rawName: 'v-lazy',
                                      value: { src: e.src, error: t.errorPath },
                                      expression:
                                        '{ src: item.src, error: errorPath }',
                                    },
                                  ],
                                }),
                                a(
                                  'div',
                                  { staticClass: 'gift-info' },
                                  [
                                    t.selectGiftData.id !== e.id
                                      ? a('div', [
                                          t._v(' ' + t._s(e.name) + ' '),
                                        ])
                                      : a(
                                          'marquee',
                                          { attrs: { scrollamount: '5' } },
                                          [t._v(' ' + t._s(e.name) + ' ')]
                                        ),
                                    a('div', { staticClass: 'gift-price' }, [
                                      a('img', {
                                        attrs: {
                                          src: t.$getCdnPath(
                                            '/images/gift/bar_ic_diamond.svg'
                                          ),
                                        },
                                      }),
                                      t._v(
                                        ' ' +
                                          t._s(t._f('amountFormat')(e.price)) +
                                          ' '
                                      ),
                                    ]),
                                  ],
                                  1
                                ),
                              ]
                            );
                          }),
                          0
                        );
                      }),
                      a('div', {
                        staticClass: 'swiper-pagination',
                        attrs: { slot: 'pagination' },
                        slot: 'pagination',
                      }),
                    ],
                    2
                  )
                : t._e(),
              t.havedData
                ? t._e()
                : a('NoDataWrap', {
                    attrs: {
                      src: '/images/common/no_data/img_not_find.png',
                      text: t.$t('S_NO_PROPS_DATA'),
                    },
                  }),
            ],
            1
          ),
        ]);
      },
      kn = [],
      Pn =
        (a('7db0'),
        a('c740'),
        {
          components: { NoDataWrap: pt['a'] },
          props: {
            selectGiftData: {
              type: Object,
              default: function () {
                return {};
              },
            },
            focusCategory: { type: Number, default: null },
          },
          data: function () {
            return {
              swiperOptions: {
                pagination: { el: '.swiper-pagination', clickable: !0 },
              },
              selectedCategory: '',
            };
          },
          computed: Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])(
                Object(V['a'])({}, Object(r['d'])(['user'])),
                Object(r['d'])('chatroom', ['currentRoom'])
              ),
              Object(r['c'])('gift', { giftList: 'getGiftList' })
            ),
            {},
            {
              activeGiftCategory: function () {
                var t = this,
                  e = Object.keys(this.giftList).find(function (e) {
                    return +e === +t.selectedCategory;
                  });
                return e || Object.keys(this.giftList)[0];
              },
              havedData: function () {
                var t;
                return null === (t = this.giftList[this.activeGiftCategory]) ||
                  void 0 === t
                  ? void 0
                  : t.list.length;
              },
              totalPage: function () {
                var t,
                  e =
                    null === (t = this.giftList[this.activeGiftCategory]) ||
                    void 0 === t
                      ? void 0
                      : t.list.length;
                return Math.ceil(e / 8) || 1;
              },
              swiper: function () {
                return this.$refs.mySwiper.$swiper;
              },
              errorPath: function () {
                return this.$getCdnPath('/images/presetImg/preset.svg');
              },
            }
          ),
          created: function () {
            this.focusCategory &&
              ((this.selectedCategory = this.focusCategory),
              this.$emit('update:focusCategory', null));
          },
          methods: Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])({}, Object(r['b'])(['actionSetTipMsgInfo'])),
              Object(r['b'])('chatroom', ['actionSetChatroomModalType'])
            ),
            {},
            {
              touchEnd: function () {
                var t = this,
                  e = Object.keys(this.giftList).findIndex(function (e) {
                    return e === t.activeGiftCategory;
                  }),
                  a = this.swiper.activeIndex,
                  n = this.swiper.swipeDirection;
                if (n) {
                  var i = '';
                  if ('prev' === n && 0 === a) {
                    if (0 === e) return;
                    if (a + 1 > this.totalPage) return;
                    (i = Object.keys(this.giftList)[e - 1]),
                      this.changeGiftOption(i, n);
                  }
                  if ('next' === n && a + 1 === this.totalPage) {
                    if (e + 1 === Object.keys(this.giftList).length) return;
                    if (a + 1 < this.totalPage && this.totalPage > 1) return;
                    (i = Object.keys(this.giftList)[e + 1]),
                      this.changeGiftOption(i, n);
                  }
                }
              },
              changeGiftOption: function (t, e) {
                var a = this;
                (this.selectedCategory = t),
                  this.$nextTick(function () {
                    e || a.swiper.slideTo(0),
                      'prev' === e && a.swiper.slideTo(a.totalPage - 1),
                      'next' === e && a.swiper.slideTo(0);
                  });
              },
              activePageList: function (t) {
                var e;
                return null === (e = this.giftList[this.activeGiftCategory]) ||
                  void 0 === e
                  ? void 0
                  : e.list.slice(8 * (t - 1), 8 * t);
              },
              selectGift: function (t) {
                var e = this;
                if (1 === t.status)
                  return this.user.lott_id
                    ? void this.actionSetTipMsgInfo({
                        content: this.$t('S_EXIT_TO_BUY_CARD'),
                        cancelText: this.$t('S_CANCEL'),
                        confirmText: this.$t('S_TO_BUY'),
                        cancelFunc: function () {
                          return e.actionSetTipMsgInfo(null);
                        },
                        confirmFunc: function () {
                          e.actionSetTipMsgInfo(null),
                            Object(at['b'])('liveMall');
                        },
                      })
                    : void Object(gt['d'])();
                this.$emit('update:selectGiftData', t);
              },
              openAdPage: function () {
                this.$emit('openAd');
              },
            }
          ),
        }),
      Mn = Pn,
      Dn = (a('84fc'), Object(z['a'])(Mn, Nn, kn, !1, null, '24281023', null)),
      jn = Dn.exports,
      Gn = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', [
          a(
            'div',
            { staticClass: 'gift-content-wrap' },
            [
              t.havedData
                ? a(
                    'swiper',
                    { ref: 'mySwiper', attrs: { options: t.swiperOptions } },
                    [
                      t._l(t.totalPage, function (e) {
                        return a(
                          'swiper-slide',
                          { key: e, staticClass: 'gift-wrap' },
                          t._l(t.activePageList(e), function (e) {
                            return a(
                              'div',
                              {
                                key: e.id,
                                class: [
                                  'gift-item',
                                  {
                                    'gift-item-selected':
                                      t.selectPropsData.id === e.id,
                                  },
                                ],
                                on: {
                                  click: function (a) {
                                    return t.selectProps(e);
                                  },
                                },
                              },
                              [
                                a('img', {
                                  directives: [
                                    {
                                      name: 'lazy',
                                      rawName: 'v-lazy',
                                      value: {
                                        src: e.link,
                                        error: t.errorPath,
                                      },
                                      expression:
                                        '{ src: item.link, error: errorPath }',
                                    },
                                  ],
                                }),
                                a(
                                  'div',
                                  { staticClass: 'gift-info' },
                                  [
                                    t.selectPropsData.id !== e.id
                                      ? a('div', [
                                          t._v(' ' + t._s(e.name) + ' '),
                                        ])
                                      : a(
                                          'marquee',
                                          { attrs: { scrollamount: '5' } },
                                          [t._v(' ' + t._s(e.name) + ' ')]
                                        ),
                                    a('div', { staticClass: 'gift-price' }, [
                                      t._v(
                                        ' x ' +
                                          t._s(t._f('amountFormat')(e.amount)) +
                                          ' '
                                      ),
                                    ]),
                                  ],
                                  1
                                ),
                              ]
                            );
                          }),
                          0
                        );
                      }),
                      a('div', {
                        staticClass: 'swiper-pagination',
                        attrs: { slot: 'pagination' },
                        slot: 'pagination',
                      }),
                    ],
                    2
                  )
                : t._e(),
              t.havedData
                ? t._e()
                : a('NoDataWrap', {
                    attrs: {
                      src: '/images/common/no_data/img_not_find.png',
                      text: t.$t('S_NO_PROPS_DATA'),
                    },
                  }),
            ],
            1
          ),
        ]);
      },
      $n = [],
      Un = {
        components: { NoDataWrap: pt['a'] },
        props: {
          selectPropsData: {
            type: Object,
            default: function () {
              return {};
            },
          },
        },
        data: function () {
          return {
            swiperOptions: {
              pagination: { el: '.swiper-pagination', clickable: !0 },
            },
          };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            {},
            Object(r['c'])('gift', { myBagList: 'getMyBagList' })
          ),
          {},
          {
            havedData: function () {
              return this.myBagList.length;
            },
            totalPage: function () {
              var t = this.myBagList.length;
              return Math.ceil(t / 8) || 1;
            },
            swiper: function () {
              return this.$refs.mySwiper.$swiper;
            },
            errorPath: function () {
              return this.$getCdnPath('/images/presetImg/preset.svg');
            },
          }
        ),
        methods: {
          selectProps: function (t) {
            this.$emit('update:selectPropsData', t);
          },
          activePageList: function (t) {
            return this.myBagList.slice(8 * (t - 1), 8 * t);
          },
          openAdPage: function () {
            this.$emit('openAd');
          },
        },
      },
      xn = Un,
      Fn = (a('a915'), Object(z['a'])(xn, Gn, $n, !1, null, '644e482a', null)),
      Hn = Fn.exports,
      Bn = {
        components: { Gift: jn, MyBag: Hn },
        data: function () {
          return {
            activeNav: 'gift',
            newGift: null,
            selectCategory: null,
            selectGiftData: {},
            selectPropsData: {},
            navItems: [
              { key: 'gift', title: 'S_GIFT' },
              { key: 'bag', title: 'S_BAG' },
            ],
            giftNumOptions: [1314, 520, 88, 6, 1],
            sendBtn: {
              gift: { text: 'S_GIVE', func: this.sendGift },
              bag: { text: 'S_USE', func: this.useMyProps },
            },
            usePropsBox: !1,
            propsInput: '',
          };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])({}, Object(r['d'])(['user'])),
            Object(r['d'])('chatroom', ['currentRoom'])
          ),
          Object(r['d'])('gift', ['userDiamond', 'userCoin'])
        ),
        created: function () {
          this.initGift(), this.actionGetMyBags();
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])(
                {},
                Object(r['b'])([
                  'actionSetWholePageType',
                  'actionSetWholePageOptions',
                  'actionSetHintInfo',
                  'actionSetTipMsgInfo',
                ])
              ),
              Object(r['b'])('gift', [
                'actionSetGiftList',
                'actionGetMyBags',
                'actionGetDiamond',
                'actionDonate',
                'actionUseProps',
              ])
            ),
            Object(r['b'])('chatroom', ['actionSetChatroomModalType'])
          ),
          {},
          {
            leaveRoomAndToPage: function (t) {
              0 !== this.user.user_id ? Object(at['b'])(t) : Object(gt['d'])();
            },
            initGift: function () {
              (this.newGift = {
                stream_id: this.currentRoom.roomId,
                partner_id: this.user.partner_id,
                gift_id: null,
                num: 1,
              }),
                this.actionSetGiftList(),
                this.actionGetDiamond();
            },
            send: function () {
              this.sendBtn[this.activeNav].func();
            },
            sendGift: function () {
              var t = this,
                e = Object(V['a'])(
                  Object(V['a'])({}, this.newGift),
                  {},
                  { gift_id: this.selectGiftData.id }
                );
              e.gift_id
                ? this.actionDonate(e).then(function (e) {
                    '0' === e.error_code
                      ? t.actionSetHintInfo(t.$t('S_DONATE_SUCCESS'))
                      : t.actionSetHintInfo(e.error_text);
                  })
                : this.actionSetHintInfo(this.$t('S_PLEASE_SELECT_GIFT'));
            },
            useMyProps: function () {
              if (this.selectPropsData.id)
                switch (this.selectPropsData.id) {
                  case 1:
                  case 2:
                  case 3:
                  case 4:
                    this.excuteUseProps({
                      target_id: this.currentRoom.streamerId,
                    });
                    break;
                  case 5:
                    this.actionSetChatroomModalType(null),
                      this.actionSetWholePageType('dailyTask');
                    break;
                  case 6:
                    this.$emit('inputFocus', null, !1),
                      this.$emit('toggleSwitch', !0),
                      this.closeModal();
                    break;
                  case 7:
                    this.usePropsBox = !0;
                    break;
                  case 8:
                    this.actionSetHintInfo(this.$t('S_CHANGENAME_TIP'));
                    break;
                  case 10:
                  case 12:
                    this.actionSetWholePageType('mall'),
                      this.actionSetWholePageOptions({ type: 'eff' });
                    break;
                  case 9:
                  case 11:
                  case 13:
                  case 14:
                  case 15:
                    this.excuteUseProps();
                    break;
                  default:
                    break;
                }
              else this.actionSetHintInfo(this.$t('S_PLEASE_SELECT_PROP'));
            },
            useLoudly: function () {
              var t = this;
              if (this.propsInput.replace(/\s*/g, '').length) {
                var e = { content: this.propsInput };
                this.excuteUseProps(e).then(function () {
                  t.closePropsBox();
                });
              } else this.actionSetHintInfo(this.$t('S_PLZ_INPUT_CONTENT'));
            },
            excuteUseProps: function (t) {
              var e = this,
                a = Object(V['a'])(
                  {
                    role: 1,
                    action_id: this.user.lott_id,
                    prop_id: this.selectPropsData.id,
                    stream_id: this.currentRoom.roomId,
                  },
                  t
                );
              return Object(Ln['f'])(a).then(function (t) {
                var a = t.data;
                '0' === a.error_code &&
                  (e.actionSetHintInfo(
                    a.result
                      .replace(':一日', '')
                      .replace(':2小时', '')
                      .replace(':', '')
                      .replace('/n', '')
                  ),
                  e.actionGetMyBags());
              });
            },
            closePropsBox: function () {
              (this.propsInput = ''), (this.usePropsBox = !1);
            },
            closeModal: function () {
              this.$emit('closeModal');
            },
            openAdPage: function () {
              this.$emit('closeModal'), this.$emit('setAdPageStatus', !0);
            },
            goExchangePage: function () {
              this.actionSetTipMsgInfo(null),
                Object(at['b'])('exchangeDiamond');
            },
          }
        ),
      },
      Wn = Bn,
      Vn = (a('5134'), Object(z['a'])(Wn, wn, Rn, !1, null, '659947a9', null)),
      Yn = Vn.exports,
      Kn = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          {
            staticClass: 'bottom-modal-wrap',
            on: {
              click: function (e) {
                return e.target !== e.currentTarget
                  ? null
                  : t.$emit('closeModal');
              },
            },
          },
          [
            a('div', { staticClass: 'game-wrap' }, [
              a(
                'div',
                { staticClass: 'top-info-wrap' },
                [
                  a(
                    'el-tabs',
                    {
                      staticClass: 'dark',
                      attrs: { value: t.activeCategory, stretch: '' },
                      on: {
                        'tab-click': function (e) {
                          return t.changeGameCategory(e.name);
                        },
                      },
                    },
                    t._l(t.gameCategory, function (t, e) {
                      return a('el-tab-pane', {
                        key: e,
                        attrs: { label: t.title, name: e },
                      });
                    }),
                    1
                  ),
                ],
                1
              ),
              a(
                'div',
                { staticClass: 'content-wrap' },
                [
                  a(
                    'swiper',
                    {
                      ref: 'mySwiper',
                      attrs: { options: t.swiperOptions },
                      on: { 'touch-end': t.touchEnd },
                    },
                    [
                      t._l(t.totalPage, function (e) {
                        return a(
                          'swiper-slide',
                          { key: e },
                          [
                            t._l(t.activePageList(e), function (e) {
                              return a(
                                'div',
                                {
                                  key: e.id,
                                  staticClass: 'game-item',
                                  on: {
                                    click: function (a) {
                                      return t.gameLink(e);
                                    },
                                  },
                                },
                                [
                                  a('img', {
                                    directives: [
                                      {
                                        name: 'lazy',
                                        rawName: 'v-lazy',
                                        value: {
                                          src: e.game_icon_url,
                                          error: t.errorPath,
                                        },
                                        expression:
                                          '{\n                                src: item.game_icon_url,\n                                error: errorPath\n                            }',
                                      },
                                    ],
                                  }),
                                ]
                              );
                            }),
                            t.gameCategory[t.activeCategory] &&
                            !t.gameCategory[t.activeCategory].list.length
                              ? a('NoDataWrap')
                              : t._e(),
                          ],
                          2
                        );
                      }),
                      a('div', {
                        directives: [
                          {
                            name: 'show',
                            rawName: 'v-show',
                            value: t.totalPage > 1,
                            expression: 'totalPage > 1',
                          },
                        ],
                        attrs: { slot: 'pagination' },
                        slot: 'pagination',
                      }),
                    ],
                    2
                  ),
                ],
                1
              ),
              a('div', { staticClass: 'pay-wrap' }, [
                a('div', { staticClass: 'balance-wrap' }, [
                  a('div', { staticClass: 'pay-item' }, [
                    a('div', [
                      a('img', {
                        attrs: {
                          src: t.$getCdnPath('/images/gift/bar_ic_diamond.svg'),
                        },
                      }),
                      a('span', [
                        t._v(t._s(t._f('amountFormat')(t.userDiamond))),
                      ]),
                    ]),
                    a(
                      'div',
                      {
                        staticClass: 'exchange-btn',
                        on: {
                          click: function (e) {
                            return t.leaveRoomAndToPage('exchangeDiamond');
                          },
                        },
                      },
                      [t._v(' ' + t._s(t.$t('S_EXCHANGE')) + ' ')]
                    ),
                  ]),
                  a(
                    'div',
                    {
                      staticClass: 'game-center-btn',
                      on: {
                        click: function (e) {
                          return t.leaveRoomAndToPage('gameCenter');
                        },
                      },
                    },
                    [t._v(' ' + t._s(t.$t('S_GAME_CENTER')) + ' ')]
                  ),
                ]),
              ]),
            ]),
          ]
        );
      },
      Xn = [],
      qn = a('ade3'),
      zn =
        (a('13d5'),
        {
          components: { NoDataWrap: pt['a'] },
          data: function () {
            return {
              swiperOptions: {
                pagination: { el: '.swiper-pagination', clickable: !0 },
              },
              activeCategory: 'hot',
            };
          },
          computed: Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])(
                Object(V['a'])(
                  Object(V['a'])({}, Object(r['d'])(['user'])),
                  Object(r['d'])('chatroom', ['currentRoom'])
                ),
                Object(r['d'])('gift', ['userDiamond', 'userCoin'])
              ),
              Object(r['c'])('game', { gameList: 'getGameList' })
            ),
            {},
            {
              swiper: function () {
                return this.$refs.mySwiper.$swiper;
              },
              gameCategory: function () {
                var t = this;
                return Object.keys(this.gameList).reduce(
                  function (e, a) {
                    return Object(V['a'])(
                      Object(V['a'])({}, e),
                      {},
                      Object(qn['a'])({}, a, {
                        title: t.$t('S_'.concat(a.toUpperCase())),
                        list: t.gameList[a],
                      })
                    );
                  },
                  {
                    hot: {},
                    chess: {},
                    fish: {},
                    electronic: {},
                    video: {},
                    lottery: {},
                  }
                );
              },
              totalPage: function () {
                var t,
                  e =
                    null === (t = this.gameCategory[this.activeCategory]) ||
                    void 0 === t
                      ? void 0
                      : t.list.length;
                return Math.ceil(e / 12) || 1;
              },
              errorPath: function () {
                return this.$getCdnPath('/images/presetImg/preset.svg');
              },
            }
          ),
          created: function () {
            this.actionGetDiamond();
          },
          methods: Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])(
                Object(V['a'])(
                  Object(V['a'])({}, Object(r['b'])(['actionSetHintInfo'])),
                  Object(r['b'])('chatroom', ['actionSetChatroomModalType'])
                ),
                Object(r['b'])('gift', ['actionGetDiamond'])
              ),
              Object(r['b'])('game', [
                'actionSetGameToken',
                'actionSetTokenInterval',
              ])
            ),
            {},
            {
              leaveRoomAndToPage: function (t) {
                0 !== this.user.user_id
                  ? Object(at['b'])(t)
                  : Object(gt['d'])();
              },
              changeGameCategory: function (t, e) {
                var a = this;
                (this.activeCategory = t),
                  this.$nextTick(function () {
                    e || a.swiper.slideTo(0),
                      'prev' === e && a.swiper.slideTo(a.totalPage - 1),
                      'next' === e && a.swiper.slideTo(0);
                  });
              },
              activePageList: function (t) {
                var e;
                return null === (e = this.gameCategory[this.activeCategory]) ||
                  void 0 === e
                  ? void 0
                  : e.list.slice(12 * (t - 1), 12 * t);
              },
              touchEnd: function () {
                var t = this,
                  e = Object.keys(this.gameCategory).findIndex(function (e) {
                    return e === t.activeCategory;
                  }),
                  a = this.swiper.activeIndex,
                  n = this.swiper.swipeDirection;
                if (n) {
                  var i = '';
                  if ('prev' === n && 0 === a) {
                    if (0 === e) return;
                    if (a + 1 > this.totalPage) return;
                    (i = Object.keys(this.gameCategory)[e - 1]),
                      this.changeGameCategory(i, n);
                  }
                  if ('next' === n && a + 1 === this.totalPage) {
                    if (e + 1 === Object.keys(this.gameCategory).length) return;
                    if (a + 1 < this.totalPage && this.totalPage > 1) return;
                    (i = Object.keys(this.gameCategory)[e + 1]),
                      this.changeGameCategory(i, n);
                  }
                }
              },
              gameLink: function (t) {
                if (t.enable)
                  if (this.user.lott_id) {
                    if (4 === t.kind)
                      return (
                        this.$emit('openLiveGame', t.code),
                        void this.actionSetChatroomModalType(null)
                      );
                    this.actionSetTokenInterval('clear'),
                      this.actionSetGameToken(null),
                      this.$router.push('/'),
                      at['a'].jsToAppMessage({
                        event: 'EVENT_OPEN_GAME',
                        data: {
                          kind: t.kind,
                          code: t.code,
                          vendor_name: t.vendor_name,
                        },
                        from: window.location.href,
                      });
                  } else Object(gt['d'])();
              },
            }
          ),
        }),
      Qn = zn,
      Jn = (a('67c2'), Object(z['a'])(Qn, Kn, Xn, !1, null, '46f5f24a', null)),
      Zn = Jn.exports,
      ti = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', { staticClass: 'center-modal-wrap' }, [
          a('div', { staticClass: 'leave-chatroom-wrap' }, [
            a('img', {
              staticClass: 'close-btn',
              attrs: { src: t.$getCdnPath('/images/common/ic_closure.svg') },
              on: { click: t.closeModal },
            }),
            a('img', {
              staticClass: 'head-photo',
              attrs: {
                src: t.currentRoom.headphoto,
                onerror: t.getDefaultUserImg,
              },
            }),
            a('div', { staticClass: 'leave-modal-top-wrap' }, [
              t.getUserIsAttentionStreamer
                ? a('div', [t._v(t._s(t.$t('S_SURE_TO_LEAVE')))])
                : a('div', [
                    a('div', { staticClass: 'nickname' }, [
                      t._v(' ' + t._s(t.currentRoom.nickname) + ' '),
                    ]),
                    a('div', { staticClass: 'id-hometown' }, [
                      t._v(' ID：' + t._s(t.currentRoom.streamerId) + ' '),
                    ]),
                    a('div', { staticClass: 'attent-text' }, [
                      t._v(' ' + t._s(t.$t('S_FOLLOW_INFORMATION')) + ' '),
                    ]),
                  ]),
            ]),
            a('div', { staticClass: 'leave-btn-wrap' }, [
              t.getUserIsAttentionStreamer
                ? a(
                    'div',
                    {
                      staticClass: 'follow-and-leave',
                      on: { click: t.closeModal },
                    },
                    [t._v(' ' + t._s(t.$t('S_CONTINUE_WATCH')) + ' ')]
                  )
                : a(
                    'div',
                    {
                      staticClass: 'follow-and-leave',
                      on: { click: t.attentionStreamer },
                    },
                    [t._v(' ' + t._s(t.$t('S_FOLLOW_AND_LEAVE')) + ' ')]
                  ),
              a(
                'div',
                { staticClass: 'leave-btn', on: { click: t.backToIndex } },
                [t._v(' ' + t._s(t.$t('S_LEAVE')) + ' ')]
              ),
            ]),
          ]),
        ]);
      },
      ei = [],
      ai = {
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])({}, Object(r['d'])('chatroom', ['currentRoom'])),
            Object(r['d'])(['user'])
          ),
          Object(r['c'])(['getDefaultUserImg', 'getUserIsAttentionStreamer'])
        ),
        methods: Object(V['a'])(
          Object(V['a'])({}, Object(r['b'])(['actionAttentionStreamer'])),
          {},
          {
            closeModal: function () {
              this.$emit('closeModal');
            },
            backToIndex: function () {
              this.$emit('backToIndex');
            },
            attentionStreamer: function () {
              var t = { streamer_id: this.currentRoom.streamerId };
              this.actionAttentionStreamer(t), this.$emit('backToIndex');
            },
          }
        ),
      },
      ni = ai,
      ii = (a('dbc6'), Object(z['a'])(ni, ti, ei, !1, null, '219eb6a6', null)),
      si = ii.exports,
      ri = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          {
            staticClass: 'right-modal-wrap recommand-content-wrap',
            on: {
              click: function (e) {
                return e.target !== e.currentTarget ? null : t.closeModal(e);
              },
            },
          },
          [
            a('div', { staticClass: 'recommand-wrap' }, [
              a(
                'div',
                {
                  staticClass: 'recommand-arrow-wrap',
                  on: { click: t.closeModal },
                },
                [
                  a('img', {
                    attrs: {
                      src: t.$getCdnPath('/images/chatroom/arrow_s.svg'),
                    },
                  }),
                ]
              ),
              a(
                'div',
                { staticClass: 'recommand-chatroom-wrap' },
                t._l(t.getProgramList, function (e, n) {
                  return a(
                    'div',
                    {
                      key: 'roomId-' + e.roomId + '-' + n,
                      staticClass: 'chatroom-item',
                      on: {
                        click: function (a) {
                          return t.toStreamRoom(e);
                        },
                      },
                    },
                    [
                      a('div', { staticClass: 'program-info' }, [
                        a('div', { staticClass: 'program-title' }, [
                          t._v(t._s(e.nickname)),
                        ]),
                      ]),
                      a('img', {
                        attrs: {
                          src: e.headphoto,
                          onerror: t.getDefaultUserImg,
                        },
                      }),
                    ]
                  );
                }),
                0
              ),
            ]),
          ]
        );
      },
      oi = [],
      ci = {
        computed: Object(V['a'])(
          Object(V['a'])({}, Object(r['d'])('chatroom', ['currentRoom'])),
          Object(r['c'])(['getProgramList', 'getDefaultUserImg'])
        ),
        methods: Object(V['a'])(
          Object(V['a'])(
            {},
            Object(r['b'])('chatroom', [
              'actionSetCurrentRoom',
              'actionToggleStreamerGiftPage',
            ])
          ),
          {},
          {
            toStreamRoom: function (t) {
              var e = this;
              this.actionSetCurrentRoom(null),
                this.actionToggleStreamerGiftPage(!1),
                this.$router
                  .replace({ name: 'chatroom', params: { roomId: t.roomId } })
                  ['catch'](function (t) {
                    return t;
                  }),
                this.$nextTick(function () {
                  e.actionSetCurrentRoom(t);
                });
            },
            closeModal: function () {
              this.$emit('closeModal');
            },
          }
        ),
      },
      ui = ci,
      li = (a('60cc'), Object(z['a'])(ui, ri, oi, !1, null, '591d91da', null)),
      di = li.exports,
      mi = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', { staticClass: 'follow-streamer-wrap' }, [
          a('img', {
            attrs: {
              src: t.currentRoom.headphoto,
              onerror: t.getDefaultUserImg,
            },
          }),
          a('div', { staticClass: 'follow-streamer-info' }, [
            a('div', { staticClass: 'streamer-name' }, [
              t._v(' ' + t._s(t.currentRoom.nickname) + ' '),
            ]),
            a('div', { staticClass: 'follow-text' }, [
              t._v(t._s(t.$t('S_FOLLOW_INFORMATION'))),
            ]),
          ]),
          t.getUserIsAttentionStreamer
            ? a('div', { staticClass: 'followed-btn' }, [
                t._v(' ' + t._s(t.$t('S_FOLLOWED')) + ' '),
              ])
            : a(
                'div',
                {
                  staticClass: 'follow-btn',
                  on: { click: t.attentionStreamer },
                },
                [t._v(' ' + t._s(t.$t('S_FOLLOW')) + ' ')]
              ),
        ]);
      },
      _i = [],
      hi = {
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])({}, Object(r['d'])(['user'])),
            Object(r['d'])('chatroom', ['currentRoom'])
          ),
          Object(r['c'])(['getDefaultUserImg', 'getUserIsAttentionStreamer'])
        ),
        methods: Object(V['a'])(
          Object(V['a'])(
            {},
            Object(r['b'])(['actionAttentionStreamer', 'actionSetHintInfo'])
          ),
          {},
          {
            attentionStreamer: function () {
              var t = this,
                e = { streamer_id: this.currentRoom.streamerId };
              this.actionAttentionStreamer(e).then(function (e) {
                '0' === e.error_code &&
                  t.actionSetHintInfo(t.$t('S_ATTENTION_SUCCESS'));
              });
            },
          }
        ),
      },
      fi = hi,
      pi = (a('3a80'), Object(z['a'])(fi, mi, _i, !1, null, '7e738c8c', null)),
      gi = pi.exports,
      Si = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { staticClass: 'video-player-wrap' },
          [
            t.showVideo
              ? [
                  a('WFPlayer', {
                    attrs: {
                      'is-component': '',
                      'room-id': t.currentRoom.roomId,
                    },
                    on: { toggleLoadimg: t.toggleLoadimg },
                  }),
                ]
              : t._e(),
            a('img', {
              directives: [
                {
                  name: 'show',
                  rawName: 'v-show',
                  value: t.showLoadimg,
                  expression: 'showLoadimg',
                },
              ],
              staticClass: 'chatroom-loading-bg',
              attrs: {
                src: t.currentRoom.backgroundImg,
                onerror: t.getDefaultUserImg,
              },
            }),
          ],
          2
        );
      },
      vi = [],
      bi = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', { class: t.$style['video-wrap'] }, [
          a('div', { ref: 'canvas', class: t.$style['canvas-wrap'] }),
          a(
            'div',
            {
              directives: [
                {
                  name: 'show',
                  rawName: 'v-show',
                  value: t.isLoading,
                  expression: 'isLoading',
                },
              ],
              class: t.$style.loading,
            },
            [a('font-awesome-icon', { attrs: { icon: 'spinner', spin: '' } })],
            1
          ),
          a('img', {
            directives: [
              {
                name: 'show',
                rawName: 'v-show',
                value: t.isLoading && t.backgroundImg,
                expression: 'isLoading && backgroundImg',
              },
            ],
            class: t.$style['chatroom-loading-bg'],
            attrs: { src: t.backgroundImg, onerror: t.getDefaultUserImg },
          }),
        ]);
      },
      Ci = [],
      Oi = {
        props: { roomId: { type: [Number, String], required: !0 } },
        data: function () {
          return {
            interval: null,
            isLoading: !0,
            isDestroy: !1,
            url: '',
            backgroundImg: '',
            cryptoKey: '',
            reTryCount: 0,
          };
        },
        computed: Object(V['a'])({}, Object(r['c'])(['getDefaultUserImg'])),
        mounted: function () {
          if (!document.getElementById('vigoPlayer_lottcube')) {
            var t = document.createElement('script'),
              e = this.$getCdnPath('/static/utils/VigoPlayer.min.js');
            t.setAttribute('src', e),
              t.setAttribute('charset', 'utf-8'),
              t.setAttribute('id', 'vigoPlayer_lottcube'),
              document.body.appendChild(t);
          }
          this.$vigoPlayer.player || this.$vigoPlayer.created(),
            this.playerInit();
        },
        beforeDestroy: function () {
          (this.isDestroy = !0),
            clearInterval(this.interval),
            this.$vigoPlayer.player.stop(),
            this.$refs.canvas.removeChild(this.$vigoPlayer.canvasElem);
        },
        created: function () {
          var t = this;
          Object(K['j'])(this.roomId).then(function (e) {
            var a = e.data;
            '0' === a.error_code &&
              (t.backgroundImg = a.result.background_image);
          });
        },
        methods: Object(V['a'])(
          Object(V['a'])({}, Object(r['b'])(['actionSetHintInfo'])),
          {},
          {
            playerInit: function () {
              var t = this;
              this.$vigoPlayer.player
                ? (this.$refs.canvas.appendChild(this.$vigoPlayer.canvasElem),
                  this.$vigoPlayer.player.setView('videoCanvas'),
                  this.$vigoPlayer.player.on('start', function () {
                    clearInterval(t.interval),
                      t.$emit('toggleLoadimg', !1),
                      (t.reTryCount = 0);
                  }),
                  this.$vigoPlayer.player.on('stop', function () {
                    (t.isLoading = !0),
                      t.$emit('toggleLoadimg', !0),
                      clearInterval(t.interval),
                      t.isDestroy ||
                        ((t.reTryCount += 1),
                        4 === t.reTryCount &&
                          (t.actionSetHintInfo(t.$t('S_CONNECT_ERR')),
                          (t.reTryCount = 0)),
                        (t.interval = setInterval(t.playerStart, 1e3)));
                  }),
                  this.$vigoPlayer.player.on('timeout', function () {
                    t.$vigoPlayer.player.stop();
                  }),
                  this.$vigoPlayer.player.on('error', function (t) {
                    console.log('WTFPlayerError', t);
                  }),
                  this.$vigoPlayer.player.on('buffer', function (e) {
                    'full' === e && (t.isLoading = !1);
                  }),
                  Object(et['e'])({ roomid: +this.roomId }).then(function (e) {
                    var a = e.data;
                    if ('0' === a.error_code) {
                      var n = a.result,
                        i = n.url,
                        s = n.status,
                        r = n.key;
                      if (!s)
                        return void t.actionSetHintInfo(
                          t.$t('S_STREAMER_CLOSE')
                        );
                      (t.url = i),
                        (t.cryptoKey = Object(gt['b'])(r)),
                        t.playerStart();
                    }
                  }))
                : setTimeout(function () {
                    t.playerInit();
                  }, 500);
            },
            playerStart: function () {
              this.isDestroy
                ? this.$vigoPlayer.player.stop()
                : (this.$vigoPlayer.player.setCryptoKey(this.cryptoKey),
                  this.$vigoPlayer.player.start(this.url));
            },
          }
        ),
      },
      Ti = Oi,
      Ei = a('ca4d');
    function Ii(t) {
      this['$style'] = Ei['default'].locals || Ei['default'];
    }
    var Ai = Object(z['a'])(Ti, bi, Ci, !1, Ii, null, null),
      yi = Ai.exports,
      wi = {
        components: { WFPlayer: yi },
        data: function () {
          return { showVideo: !1, showLoadimg: !0 };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])({}, Object(r['d'])('chatroom', ['currentRoom'])),
            Object(r['c'])('chatroom', ['getStreamUrl'])
          ),
          Object(r['c'])(['getDefaultUserImg'])
        ),
        watch: {
          getStreamUrl: {
            immediate: !0,
            deep: !0,
            handler: function (t) {
              t && (this.showVideo = t);
            },
          },
        },
        methods: {
          toggleLoadimg: function (t) {
            this.showLoadimg = t;
          },
        },
      },
      Ri = wi,
      Li = (a('8851'), Object(z['a'])(Ri, Si, vi, !1, null, '28f35730', null)),
      Ni = Li.exports,
      ki = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', { staticClass: 'ad-page-wrap' }, [
          a('div', { staticClass: 'mask' }),
          a('div', { staticClass: 'ad-main-wrap' }, [
            t._m(0),
            a('div', { staticClass: 'ad-content' }, [
              t._m(1),
              a('div', { staticClass: 'center-text' }, [
                a('img', {
                  staticClass: 'diamond-icon',
                  attrs: {
                    src: t.$getCdnPath('/images/chatroom/adPage/diamond.png'),
                  },
                }),
                a('span', [t._v('388 鑽+特惠大禮包')]),
              ]),
              a('div', { staticClass: 'card-wrap' }, [
                a('div', { staticClass: 'card-item' }, [
                  a('div', { staticClass: 'card-title' }, [t._v('戀愛單車')]),
                  a('img', {
                    staticClass: 'card-img',
                    attrs: {
                      src: t.$getCdnPath('/images/gift/gift_01.png'),
                      alt: '',
                    },
                  }),
                  a('div', { staticClass: 'card-info' }, [t._v(' x2天 ')]),
                ]),
                a('div', { staticClass: 'card-item' }, [
                  a('div', { staticClass: 'card-title' }, [t._v('戀愛單車')]),
                  a('img', {
                    staticClass: 'card-img',
                    attrs: {
                      src: t.$getCdnPath('/images/gift/gift_01.png'),
                      alt: '',
                    },
                  }),
                  a('div', { staticClass: 'card-info' }, [t._v(' x2天 ')]),
                ]),
                a('div', { staticClass: 'card-item' }, [
                  a('div', { staticClass: 'card-title' }, [t._v('戀愛單車')]),
                  a('img', {
                    staticClass: 'card-img',
                    attrs: {
                      src: t.$getCdnPath('/images/gift/gift_01.png'),
                      alt: '',
                    },
                  }),
                  a('div', { staticClass: 'card-info' }, [t._v(' x2天 ')]),
                ]),
              ]),
            ]),
            a('div', { staticClass: 'ad-footer' }, [
              a(
                'div',
                {
                  staticClass: 'add-btn',
                  on: {
                    click: function (e) {
                      return t.leaveRoomAndToPage('exchangeDiamond');
                    },
                  },
                },
                [t._v(' 前往儲值 ')]
              ),
              t._m(2),
            ]),
          ]),
          a(
            'div',
            { staticClass: 'close-btn' },
            [
              a('font-awesome-icon', {
                attrs: { icon: ['far', 'times-circle'] },
                on: { click: t.closeAdPage },
              }),
            ],
            1
          ),
        ]);
      },
      Pi = [
        function () {
          var t = this,
            e = t.$createElement,
            a = t._self._c || e;
          return a('div', { staticClass: 'ad-header' }, [
            a('span', [t._v('首充超值大禮包')]),
          ]);
        },
        function () {
          var t = this,
            e = t.$createElement,
            a = t._self._c || e;
          return a('div', { staticClass: 'price-wrap' }, [
            a('div', { staticClass: 'price-item active' }, [
              a('div', [t._v('50元')]),
            ]),
            a('div', { staticClass: 'price-item' }, [
              a('div', [t._v('100元')]),
            ]),
            a('div', { staticClass: 'price-item' }, [
              a('div', [t._v('200元')]),
            ]),
            a('div', { staticClass: 'price-item' }, [
              a('div', [t._v('500元')]),
            ]),
          ]);
        },
        function () {
          var t = this,
            e = t.$createElement,
            a = t._self._c || e;
          return a('div', { staticClass: 'footer-text' }, [
            t._v(' 首充 '),
            a('span', [t._v('50元')]),
            t._v(' 額外獲得價值 '),
            a('span', [t._v('10元')]),
            t._v(' 的大禮包 '),
          ]);
        },
      ],
      Mi = {
        methods: {
          leaveRoomAndToPage: at['b'],
          closeAdPage: function () {
            this.$emit('setAdPageStatus', !1);
          },
        },
      },
      Di = Mi,
      ji = (a('11d0'), Object(z['a'])(Di, ki, Pi, !1, null, '031bdeb4', null)),
      Gi = ji.exports,
      $i = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { staticClass: 'streamer-gift-wrap' },
          [a('Recommand')],
          1
        );
      },
      Ui = [],
      xi = { components: { Recommand: di } },
      Fi = xi,
      Hi = (a('5ff5'), Object(z['a'])(Fi, $i, Ui, !1, null, '04cd1ddc', null)),
      Bi = Hi.exports,
      Wi = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          {
            staticClass: 'bottom-modal-wrap',
            on: {
              click: function (e) {
                return e.target !== e.currentTarget ? null : t.closeModal(e);
              },
            },
          },
          [
            a(
              'div',
              { staticClass: 'open-guard-wrap' },
              [
                a(
                  'div',
                  {
                    directives: [
                      {
                        name: 'show',
                        rawName: 'v-show',
                        value: !t.showGuardInfo,
                        expression: '!showGuardInfo',
                      },
                    ],
                  },
                  [
                    a('div', { staticClass: 'title-wrap' }, [
                      t._v(' ' + t._s(t.guardTitle) + ' '),
                      a('img', {
                        staticClass: 'qa-btn',
                        attrs: {
                          src: t.$getCdnPath('/images/common/ic_question.svg'),
                        },
                        on: {
                          click: function (e) {
                            return t.setGuardInfo(!0);
                          },
                        },
                      }),
                    ]),
                    a('div', { staticClass: 'guard-content-wrap' }, [
                      a(
                        'div',
                        { staticClass: 'guard-type-wrap' },
                        t._l(t.guardTypeList, function (e, n) {
                          return a(
                            'div',
                            {
                              key: n,
                              class: [
                                'guard-card',
                                {
                                  'guard-card-active': t.guardType === e.value,
                                },
                              ],
                              on: {
                                click: function (a) {
                                  return t.setGuardType(e.value);
                                },
                              },
                            },
                            [a('img', { attrs: { src: e.image } })]
                          );
                        }),
                        0
                      ),
                      a('div', { staticClass: 'info-wrap' }, [
                        a('div', { staticClass: 'open-guard-info' }, [
                          t._v(
                            ' ' + t._s(t.$t('S_GUARD_PRIVILEGE_INFO')) + ' '
                          ),
                        ]),
                        a(
                          'div',
                          { staticClass: 'open-guard-icon-wrap' },
                          t._l(t.featureList, function (e) {
                            return a('div', { key: e.key }, [
                              a('img', { attrs: { src: e.imagePath } }),
                              t._v(' ' + t._s(e.label) + ' '),
                            ]);
                          }),
                          0
                        ),
                      ]),
                    ]),
                    a('div', { staticClass: 'open-guard-footer' }, [
                      a('div', { staticClass: 'balance-wrap' }, [
                        a(
                          'div',
                          { staticClass: 'balance-item' },
                          [
                            t.currentRoom.openGuardians
                              ? [
                                  a('img', {
                                    attrs: {
                                      src: t.$getCdnPath(
                                        '/images/gift/bar_ic_diamond.svg'
                                      ),
                                    },
                                  }),
                                  a('div', { staticClass: 'amount' }, [
                                    t._v(
                                      ' ' +
                                        t._s(
                                          t._f('amountFormat')(t.userDiamond)
                                        ) +
                                        ' '
                                    ),
                                  ]),
                                  a(
                                    'div',
                                    {
                                      staticClass: 'charge-btn',
                                      on: {
                                        click: function (e) {
                                          return t.leaveRoomAndToPage(
                                            'exchangeDiamond'
                                          );
                                        },
                                      },
                                    },
                                    [t._v(' ' + t._s(t.$t('S_EXCHANGE')) + ' ')]
                                  ),
                                ]
                              : a('span', [
                                  t._v(
                                    ' ' +
                                      t._s(t.$t('S_UNOPEN_GUARDIAN_INFO')) +
                                      ' '
                                  ),
                                ]),
                          ],
                          2
                        ),
                        a(
                          'div',
                          {
                            class: [
                              'btn',
                              { disable: !t.currentRoom.openGuardians },
                            ],
                            on: { click: t.openGuardian },
                          },
                          [t._v(' ' + t._s(t.guardTitle) + ' ')]
                        ),
                      ]),
                    ]),
                  ]
                ),
                a('GuardianInfo', {
                  directives: [
                    {
                      name: 'show',
                      rawName: 'v-show',
                      value: t.showGuardInfo,
                      expression: 'showGuardInfo',
                    },
                  ],
                  on: { setGuardInfo: t.setGuardInfo },
                }),
              ],
              1
            ),
          ]
        );
      },
      Vi = [],
      Yi =
        (a('45fc'),
        function () {
          var t = this,
            e = t.$createElement,
            a = t._self._c || e;
          return a('div', { staticClass: 'guardian-info-wrap' }, [
            a('div', { staticClass: 'title-wrap' }, [
              a('img', {
                staticClass: 'close-btn',
                attrs: { src: t.$getCdnPath('/images/common/ic_closure.svg') },
                on: {
                  click: function (e) {
                    return t.setGuardInfo(!1);
                  },
                },
              }),
            ]),
            a('div', { staticClass: 'content-wrap' }, [
              a('div', { staticClass: 'content-block' }, [
                a('div', { staticClass: 'title-text' }, [
                  t._v(t._s(t.$t('S_GUARD_ARTICLE_01'))),
                ]),
                a('div', [t._v(' ' + t._s(t.$t('S_GUARD_ARTICLE_02')) + ' ')]),
              ]),
              a('div', { staticClass: 'content-block' }, [
                a('div', { staticClass: 'title-text' }, [
                  t._v(t._s(t.$t('S_GUARD_ARTICLE_03'))),
                ]),
                a('div', [t._v(' ' + t._s(t.$t('S_GUARD_ARTICLE_04')) + ' ')]),
                a('div', { staticClass: 'guard-type-wrap' }, [
                  a('div', { staticClass: 'guard-type' }, [
                    a('img', {
                      attrs: {
                        src: t.$getCdnPath(
                          '/images/chatroom/guardList/ic_guard_weekly_s.png'
                        ),
                        alt: '',
                      },
                    }),
                    a('div', { staticClass: 'green-text ' }, [
                      t._v(t._s(t.$t('S_WEEKLY_GUARD'))),
                    ]),
                    a('div', [t._v(t._s(t.$t('S_GUARD_ARTICLE_05')))]),
                  ]),
                  a('div', { staticClass: 'guard-type' }, [
                    a('img', {
                      attrs: {
                        src: t.$getCdnPath(
                          '/images/chatroom/guardList/ic_guard_monthly_s.png'
                        ),
                        alt: '',
                      },
                    }),
                    a('div', { staticClass: 'green-text' }, [
                      t._v(t._s(t.$t('S_MONTHLY_GUARD'))),
                    ]),
                    a('div', [t._v(t._s(t.$t('S_GUARD_ARTICLE_06')))]),
                  ]),
                ]),
              ]),
              a('div', { staticClass: 'content-block' }, [
                a('div', { staticClass: 'title-text' }, [
                  t._v(t._s(t.$t('S_GUARD_ARTICLE_07'))),
                ]),
                a('div', { staticClass: 'green-text' }, [
                  t._v(' ' + t._s(t.$t('S_GUARD_ARTICLE_08')) + ' '),
                ]),
                a('div', [t._v(' ' + t._s(t.$t('S_GUARD_ARTICLE_09')) + ' ')]),
                a('div', { staticClass: 'green-text' }, [
                  t._v(' ' + t._s(t.$t('S_GUARD_ARTICLE_10')) + ' '),
                ]),
                a('div', [t._v(' ' + t._s(t.$t('S_GUARD_ARTICLE_11')) + ' ')]),
              ]),
              a('div', { staticClass: 'content-block' }, [
                a('div', { staticClass: 'title-text' }, [
                  t._v(t._s(t.$t('S_GUARD_ARTICLE_12'))),
                ]),
                a('div', [t._v(' ' + t._s(t.$t('S_GUARD_ARTICLE_13')) + ' ')]),
                a('div', { staticClass: 'guard-privilege' }, [
                  a('div', [
                    a('img', {
                      attrs: {
                        src: t.$getCdnPath(
                          '/images/chatroom/guardList/guard_headframe_h.svg'
                        ),
                      },
                    }),
                    t._v(' ' + t._s(t.$t('S_S_HEADER_FRAME')) + ' '),
                  ]),
                  a('div', [
                    a('img', {
                      attrs: {
                        src: t.$getCdnPath(
                          '/images/chatroom/guardList/guard_ gift_h.svg'
                        ),
                      },
                    }),
                    t._v(' ' + t._s(t.$t('S_S_GIFT')) + ' '),
                  ]),
                  a('div', [
                    a('img', {
                      attrs: {
                        src: t.$getCdnPath(
                          '/images/chatroom/guardList/guard_effects_h.svg'
                        ),
                      },
                    }),
                    t._v(' ' + t._s(t.$t('S_S_INTRO')) + ' '),
                  ]),
                  a('div', [
                    a('img', {
                      attrs: {
                        src: t.$getCdnPath(
                          '/images/chatroom/guardList/guard_mute_h.svg'
                        ),
                      },
                    }),
                    t._v(' ' + t._s(t.$t('S_S_MUTE')) + ' '),
                  ]),
                ]),
                a('div', { staticClass: 'green-text' }, [
                  t._v(' ' + t._s(t.$t('S_GUARD_ARTICLE_14')) + ' '),
                ]),
                a('div', [t._v(' ' + t._s(t.$t('S_GUARD_ARTICLE_15')) + ' ')]),
                a('div', { staticClass: 'green-text' }, [
                  t._v(' ' + t._s(t.$t('S_GUARD_ARTICLE_16')) + ' '),
                ]),
                a('div', [t._v(' ' + t._s(t.$t('S_GUARD_ARTICLE_17')) + ' ')]),
              ]),
              a('div', { staticClass: 'content-block' }, [
                a('div', { staticClass: 'title-text' }, [
                  t._v(t._s(t.$t('S_GUARD_ARTICLE_18'))),
                ]),
                a('div', [t._v(' ' + t._s(t.$t('S_GUARD_ARTICLE_19')) + ' ')]),
              ]),
              a('div', { staticClass: 'content-block' }, [
                a('div', { staticClass: 'title-text' }, [
                  t._v(t._s(t.$t('S_GUARD_ARTICLE_20'))),
                ]),
                a('div', [t._v(' ' + t._s(t.$t('S_GUARD_ARTICLE_21')) + ' ')]),
                a('div', [t._v(' ' + t._s(t.$t('S_GUARD_ARTICLE_22')) + ' ')]),
                a('div', [t._v(' ' + t._s(t.$t('S_GUARD_ARTICLE_23')) + ' ')]),
                a('div', [
                  t._v(
                    ' ' +
                      t._s(t.$t('S_GUARD_ARTICLE_24')) +
                      ' ' +
                      t._s(t.$t('S_GUARD_ARTICLE_25')) +
                      ' '
                  ),
                ]),
                a('div', [
                  t._v(
                    ' ' +
                      t._s(t.$t('S_GUARD_ARTICLE_26')) +
                      ' ' +
                      t._s(t.$t('S_GUARD_ARTICLE_27')) +
                      ' '
                  ),
                ]),
              ]),
            ]),
          ]);
        }),
      Ki = [],
      Xi = {
        methods: {
          setGuardInfo: function (t) {
            at['a'].jsToAppMessage({ event: 'EVENT_EXIT', data: '' }),
              this.$emit('setGuardInfo', t);
          },
        },
      },
      qi = Xi,
      zi = (a('e327'), Object(z['a'])(qi, Yi, Ki, !1, null, '687c587c', null)),
      Qi = zi.exports,
      Ji = {
        components: { GuardianInfo: Qi },
        data: function () {
          return { showGuardInfo: !1, guardType: 'weekly' };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])({}, Object(r['d'])(['user'])),
              Object(r['d'])('chatroom', ['currentRoom', 'guardianList'])
            ),
            Object(r['d'])('gift', ['userCoin', 'userDiamond'])
          ),
          {},
          {
            featureList: function () {
              var t = '/images/chatroom/guardList',
                e = 'monthly' === this.guardType;
              return [
                {
                  key: 'headframe',
                  label: this.$t('S_S_HEADER_FRAME'),
                  imagePath: this.$getCdnPath(
                    ''.concat(t, '/guard_headframe_h.svg')
                  ),
                },
                {
                  key: 'gift',
                  label: this.$t('S_S_GIFT'),
                  imagePath: this.$getCdnPath(
                    ''.concat(t, '/guard_ gift_h.svg')
                  ),
                },
                {
                  key: 'effects',
                  label: this.$t('S_S_INTRO'),
                  imagePath: this.$getCdnPath(
                    ''.concat(t, '/guard_effects_h.svg')
                  ),
                },
                {
                  key: 'mute',
                  label: this.$t('S_S_MUTE'),
                  imagePath: this.$getCdnPath(
                    ''.concat(t, '/guard_mute_').concat(e ? 'h' : 'n', '.svg')
                  ),
                },
              ];
            },
            guardTypeList: function () {
              var t = '/images/chatroom/guardList';
              return {
                weekly: {
                  label: this.$t('S_WEEKLY_GUARD'),
                  value: 'weekly',
                  amount: 999,
                  image: this.isRenewal
                    ? this.$getCdnPath(''.concat(t, '/ic_guard_weekly.svg'))
                    : this.$getCdnPath(''.concat(t, '/ic_guard_weekly_s.png')),
                },
                monthly: {
                  label: this.$t('S_MONTHLY_GUARD'),
                  value: 'monthly',
                  amount: 2999,
                  image: this.isRenewal
                    ? this.$getCdnPath(''.concat(t, '/ic_guard_monthly.svg'))
                    : this.$getCdnPath(''.concat(t, '/ic_guard_monthly_s.png')),
                },
              };
            },
            tipMsgContent: function () {
              if ('become' === this.showTipMsgType) {
                var t = this.guardTypeList[this.guardType],
                  e = t.amount,
                  a = t.label;
                return this.$t('S_ASK_OPEN_GAURD')
                  .replace('%n', e)
                  .replace('%m', a);
              }
              return this.$t('S_ASK_EXCHANGE_DIAMOND');
            },
            isRenewal: function () {
              var t = this;
              return this.guardianList.some(function (e) {
                return e.id === t.user.lott_id;
              });
            },
            guardTitle: function () {
              return this.isRenewal
                ? this.$t('S_RENEWAL_GUARD')
                : this.$t('S_OPEN_GUARD');
            },
          }
        ),
        created: function () {
          this.actionGetDiamond(),
            this.actionGetGuardians(this.currentRoom.streamerId);
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])({}, Object(r['b'])(['actionSetTipMsgInfo'])),
              Object(r['b'])('gift', ['actionGetDiamond', 'actionCheckBalance'])
            ),
            Object(r['b'])('chatroom', [
              'actionGetGuardians',
              'actionBecomeGuardian',
            ])
          ),
          {},
          {
            leaveRoomAndToPage: function (t) {
              0 !== this.user.user_id ? Object(at['b'])(t) : Object(gt['d'])();
            },
            closeModal: function () {
              this.$emit('closeModal');
            },
            openGuardian: function () {
              var t = this;
              if (this.currentRoom.openGuardians) {
                var e = this.guardTypeList[this.guardType],
                  a = { amount: e.amount };
                Object(Ln['a'])(a).then(function (e) {
                  var a = e.data;
                  if ('0' === a.error_code) {
                    var n = t.$t('S_ASK_EXCHANGE_DIAMOND'),
                      i = t.$t('S_TO_EXCHANGE');
                    if (a.result) {
                      var s = t.guardTypeList[t.guardType],
                        r = s.amount,
                        o = s.label;
                      (n = t
                        .$t('S_ASK_OPEN_GAURD')
                        .replace('%n', r)
                        .replace('%m', o)),
                        (i = t.$t('S_OPEN_GUARD'));
                    }
                    t.actionSetTipMsgInfo({
                      title: t.$t('S_HINT'),
                      content: n,
                      confirmText: i,
                      cancelFunc: function () {
                        return t.actionSetTipMsgInfo(null);
                      },
                      confirmFunc: function () {
                        t.actionSetTipMsgInfo(null),
                          a.result
                            ? t.openGuard()
                            : Object(at['b'])('exchangeDiamond');
                      },
                    });
                  }
                });
              }
            },
            setGuardType: function (t) {
              this.guardType = t;
            },
            openGuard: function () {
              var t = {
                streamer_id: this.currentRoom.streamerId,
                gk_type: 'weekly' === this.guardType ? 1 : 2,
              };
              this.actionBecomeGuardian(t);
            },
            setGuardInfo: function (t) {
              this.showGuardInfo = t;
            },
          }
        ),
      },
      Zi = Ji,
      ts = (a('53b9'), Object(z['a'])(Zi, Wi, Vi, !1, null, '2ba5d7fa', null)),
      es = ts.exports,
      as = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', { staticClass: 'charge-wrap' }, [
          a('img', {
            attrs: {
              src: t.currentRoom.backgroundImg,
              onerror: t.getDefaultUserImg,
            },
          }),
        ]);
      },
      ns = [],
      is = {
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])(
                Object(V['a'])({}, Object(r['d'])(['user'])),
                Object(r['d'])('chatroom', [
                  'index',
                  'currentRoom',
                  'userConnectInfo',
                  'chargeRoomStop',
                ])
              ),
              Object(r['c'])([
                'getProgramList',
                'getDefaultUserImg',
                'getIsGuest',
              ])
            ),
            Object(r['c'])('chatroom', ['getStreamCharge', 'getSwipeDirection'])
          ),
          {},
          {
            confirmBoxText: function () {
              var t = this;
              return 2 === this.chargeRoomStop
                ? {
                    title: this.$t('S_HINT'),
                    content: this.$t('S_ASK_EXCHANGE_DIAMOND'),
                    cancelText: this.$t('S_PASS'),
                    cancelFunc: function () {
                      return t.tipMsgCancel();
                    },
                    confirmFunc: function () {
                      return t.tipMsgConfirm('exchange');
                    },
                  }
                : {
                    title: this.$t('S_CHARGE_ROOM'),
                    content: ''
                      .concat(
                        this.$t('S_STREAMER_OPEN_CHARGEROOM').replace(
                          '%n',
                          this.getStreamCharge.charge
                        ),
                        '\n'
                      )
                      .concat(this.$t('S_ASK_INTO_CHARGEROOM')),
                    cancelText: this.$t('S_PASS'),
                    cancelFunc: function () {
                      return t.tipMsgCancel();
                    },
                    confirmFunc: function () {
                      return t.tipMsgConfirm('charge');
                    },
                  };
            },
          }
        ),
        created: function () {
          this.setConfirm();
        },
        beforeDestroy: function () {
          this.actionStopChargeRoom(0);
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              {},
              Object(r['b'])(['actionSetHintInfo', 'actionSetTipMsgInfo'])
            ),
            Object(r['b'])('chatroom', [
              'actionSetCurrentRoom',
              'actionSetRoomIsCharge',
              'actionSetUserConnect',
              'actionStopChargeRoom',
            ])
          ),
          {},
          {
            wsConnect: function () {
              this.$emit('callSocket');
            },
            getNextRoomIndex: function () {
              if ('up' === this.getSwipeDirection) {
                var t = this.index === this.getProgramList.length - 1;
                return t ? 0 : this.index + 1;
              }
              if ('down' === this.getSwipeDirection) {
                var e = 0 === this.index;
                return e ? this.getProgramList.length - 1 : this.index - 1;
              }
              return this.index === this.getProgramList.length - 1
                ? 0
                : this.index + 1;
            },
            setConfirm: function () {
              this.actionSetTipMsgInfo({
                title: this.confirmBoxText.title,
                content: this.confirmBoxText.content,
                cancelText: this.confirmBoxText.cancelText,
                cancelFunc: this.confirmBoxText.cancelFunc,
                confirmFunc: this.confirmBoxText.confirmFunc,
              });
            },
            tipMsgConfirm: function (t) {
              var e = this;
              if ((this.actionSetTipMsgInfo(null), this.getIsGuest))
                at['a'].jsToAppMessage({ event: 'EVENT_GUEST_REGISTER' });
              else if ('exchange' !== t) {
                var a = this.currentRoom,
                  n = {
                    stream_id: a.roomId,
                    streamer_id: a.streamerId,
                    charge: a.charge,
                  };
                Object(et['a'])(n).then(function (t) {
                  var n = t.data;
                  switch ((e.$emit('socketOffMode', null), n.error_code)) {
                    case '0':
                      e.actionSetUserConnect(
                        Object(V['a'])(
                          Object(V['a'])(
                            Object(V['a'])({}, e.userConnectInfo),
                            n.result.stream_url
                          ),
                          {},
                          { charge: n.result.charge_price }
                        )
                      ),
                        setTimeout(function () {
                          e.wsConnect(), e.actionSetRoomIsCharge(3);
                        }, 100);
                      break;
                    case '116022001':
                      e.actionSetHintInfo(n.error_text),
                        e.actionSetUserConnect(
                          Object(V['a'])(
                            Object(V['a'])({}, e.userConnectInfo),
                            {},
                            { charge: 0, leave_second: 0 }
                          )
                        ),
                        setTimeout(function () {
                          e.wsConnect(), e.actionSetRoomIsCharge(0);
                        }, 100);
                      break;
                    case '116023101':
                      e.actionSetTipMsgInfo({
                        title: e.$t('S_HINT'),
                        content: e.$t('S_ASK_EXCHANGE_DIAMOND'),
                        cancelText: e.$t('S_PASS'),
                        cancelFunc: function () {
                          return e.tipMsgCancel('exchange');
                        },
                        confirmFunc: function () {
                          return e.tipMsgConfirm('exchange');
                        },
                      });
                      break;
                    case '116022003':
                      e.actionSetCurrentRoom(
                        Object(V['a'])(
                          Object(V['a'])({}, a),
                          {},
                          { charge: n.result.new_charge }
                        )
                      ),
                        e.actionSetUserConnect(
                          Object(V['a'])(
                            Object(V['a'])({}, e.userConnectInfo),
                            {},
                            { charge: n.result.new_charge }
                          )
                        ),
                        e.actionSetTipMsgInfo({
                          title: e.$t('S_CHARGE_ROOM'),
                          content: ''.concat(
                            e
                              .$t('S_CHANGE_CHARGE')
                              .replace('%n', e.getStreamCharge.charge)
                          ),
                          cancelText: e.$t('S_PASS'),
                          confirmText: e.$t('S_I_WANT_SEE'),
                          cancelFunc: function () {
                            return e.tipMsgCancel();
                          },
                          confirmFunc: function () {
                            return e.tipMsgConfirm('charge');
                          },
                        });
                      break;
                    default:
                      e.$router.push('/'), e.actionSetHintInfo(n.error_text);
                      break;
                  }
                });
              } else this.chargeAndToDiamond('exchangeDiamond');
            },
            tipMsgCancel: function (t) {
              var e = this;
              this.actionSetTipMsgInfo(null),
                'exchange' !== t
                  ? (this.actionSetCurrentRoom(null),
                    this.$nextTick(function () {
                      var t = e.getProgramList[e.getNextRoomIndex()];
                      e.actionSetCurrentRoom(t);
                    }))
                  : this.$router.push('/');
            },
            chargeAndToDiamond: function (t) {
              this.actionSetTipMsgInfo(null), Object(at['c'])(t);
            },
          }
        ),
      },
      ss = is,
      rs = (a('6f71'), Object(z['a'])(ss, as, ns, !1, null, '9cb06f1e', null)),
      os = rs.exports,
      cs = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', [
          a('div', { staticClass: 'game-icon ' }, [
            a('img', {
              attrs: {
                src: t.$getCdnPath(
                  '/images/game/gameType/' + t.getGameImg(t.currentRoom.game)
                ),
              },
              on: { click: t.openGame },
            }),
            a('div', { staticClass: 'time-wrap' }, [t._v(t._s(t.timeFormate))]),
          ]),
        ]);
      },
      us = [],
      ls = {
        data: function () {
          return { time: 0, countDownInterval: null };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])({}, Object(r['d'])(['user'])),
              Object(r['d'])('chatroom', ['currentRoom'])
            ),
            Object(r['c'])('game', { closeTimestamp: 'getCloseTimestamp' })
          ),
          {},
          {
            timeFormate: function () {
              return this.time < 0
                ? '00:00'
                : Object(Ue['c'])(this.time, 'mm:ss');
            },
          }
        ),
        watch: {
          closeTimestamp: function (t, e) {
            !Zt.a.isEqual(t, e) &&
              t &&
              ((this.time = t.close - t.now),
              clearInterval(this.countDownInterval),
              this.getCountDownTime());
          },
        },
        beforeDestroy: function () {
          this.actionSetCloseTimestamp(0),
            clearInterval(this.countDownInterval);
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            {},
            Object(r['b'])('game', ['actionSetCloseTimestamp'])
          ),
          {},
          {
            getCountDownTime: function () {
              var t = this;
              this.countDownInterval = setInterval(function () {
                t.time < 0 ? clearInterval(t.countDownInterval) : (t.time -= 1);
              }, 1e3);
            },
            getGameImg: function (t) {
              return Ja(t);
            },
            openGame: function () {
              this.user.lott_id
                ? this.$emit('openLiveGame', this.currentRoom.game)
                : Object(gt['d'])();
            },
          }
        ),
      },
      ds = ls,
      ms = (a('ba78'), Object(z['a'])(ds, cs, us, !1, null, '5895028a', null)),
      _s = ms.exports,
      hs = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          {
            staticClass: 'bottom-modal-wrap',
            on: {
              click: function (e) {
                return e.target !== e.currentTarget ? null : t.closeModal(e);
              },
            },
          },
          [
            a('div', { staticClass: 'live-game-wrap' }, [
              a(
                'div',
                {
                  directives: [
                    {
                      name: 'show',
                      rawName: 'v-show',
                      value: t.loading,
                      expression: 'loading',
                    },
                  ],
                  staticClass: 'loading-wrap',
                },
                [t._v('正在進入遊戲...')]
              ),
              a('div', { attrs: { id: 'game' } }),
            ]),
          ]
        );
      },
      fs = [],
      ps = {
        data: function () {
          return { loading: !0, createCount: 0 };
        },
        computed: Object(V['a'])(
          Object(V['a'])({}, Object(r['d'])('chatroom', ['currentRoom'])),
          Object(r['c'])('game', {
            followBet: 'getFollowBet',
            gameName: 'getGameName',
            gameUrls: 'getGameUrls',
            gameToken: 'getGameToken',
            trialOption: 'getTrialOption',
          })
        ),
        mounted: function () {
          var t = this;
          try {
            this.initLiveGame();
          } catch (e) {
            (this.createCount += 1),
              this.createCount < 100 &&
                setTimeout(function () {
                  return t.initLiveGame();
                }, 500);
          }
        },
        beforeDestroy: function () {
          this.actionSetFollowBet(0);
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            {},
            Object(r['b'])('game', ['actionSwitchGame', 'actionSetFollowBet'])
          ),
          {},
          {
            initLiveGame: function () {
              var t = this,
                e = document.getElementById('game');
              AppLive.create({
                el: e,
                token: this.gameToken,
                domain: this.gameUrls[this.gameName],
                game_name: this.gameName,
                room_id: this.currentRoom.roomId,
                follow_oid: this.followBet || 0,
                custom_option: this.trialOption || null,
              }).then(function () {
                t.loading = !1;
              });
            },
            closeModal: function () {
              window.isModOpen || this.actionSwitchGame(!1);
            },
          }
        ),
      },
      gs = ps,
      Ss = (a('4423'), Object(z['a'])(gs, hs, fs, !1, null, 'b7d46176', null)),
      vs = Ss.exports,
      bs = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { staticClass: 'anime-wrap' },
          [a('A1anime'), a('A23anime'), a('Banime'), a('Canime')],
          1
        );
      },
      Cs = [],
      Os = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return t.hasAnime
          ? a(
              'div',
              {
                directives: [
                  {
                    name: 'show',
                    rawName: 'v-show',
                    value: !t.getIsClearScreen,
                    expression: '!getIsClearScreen',
                  },
                ],
                staticClass: 'a1-anime',
              },
              t._l(t.showDonate, function (e, n) {
                return a('div', { key: 'sec' + n }, [
                  e
                    ? a('div', { staticClass: 'anime' }, [
                        a('div', { staticClass: 'anime-info' }, [
                          a('img', {
                            staticClass: 'head-photo',
                            attrs: { src: t.$wsGetCdnPath(e.head_photo) },
                          }),
                          a('div', [
                            a('div', { staticClass: 'alias' }, [
                              t._v(t._s(e.user_alias)),
                            ]),
                            a('div', { staticClass: 'gift-name' }, [
                              t._v('送' + t._s(e.items.cn)),
                            ]),
                          ]),
                          a('img', {
                            staticClass: 'gift-photo',
                            attrs: {
                              src: t.$wsGetCdnPath(t.thumbnail(e.thumbnail)),
                            },
                          }),
                        ]),
                        a('div', { staticClass: 'combo' }, [
                          a('div', [
                            t._v('x'),
                            a('span', [t._v(t._s(e.combo))]),
                          ]),
                          a('div', { staticClass: 'fade' }, [
                            t._v('x'),
                            a('span', [t._v(t._s(e.combo))]),
                          ]),
                        ]),
                      ])
                    : t._e(),
                ]);
              }),
              0
            )
          : t._e();
      },
      Ts = [],
      Es =
        (a('a434'),
        a('a623'),
        {
          data: function () {
            return {
              donateInterval: null,
              donateList: [],
              showDonate: [null, null, null, null],
              showIndex: 0,
            };
          },
          computed: Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])({}, Object(r['c'])('gift', ['getDonateAnime'])),
              Object(r['c'])('chatroom', ['getIsClearScreen'])
            ),
            {},
            {
              hasAnime: function () {
                return this.showDonate.some(function (t) {
                  return t;
                });
              },
              errorPath: function () {
                return this.$getCdnPath('/images/presetImg/preset.svg');
              },
            }
          ),
          watch: {
            getDonateAnime: {
              deep: !0,
              handler: function (t) {
                var e = this;
                if (
                  'A1' === t.present_type &&
                  ((this.donateList = [].concat(
                    Object(wa['a'])(this.donateList),
                    [t]
                  )),
                  !this.donateInterval)
                ) {
                  var a = this.showIndex;
                  this.checkShowIndex(),
                    this.showDonate.splice(a, 1, this.donateList[0]),
                    this.donateList.shift();
                  var n = setTimeout(function () {
                    e.showDonate.splice(a, 1, null), clearTimeout(n);
                  }, 3e3);
                  this.donateInterval = setInterval(function () {
                    if (
                      e.showDonate.every(function (t) {
                        return !t;
                      }) &&
                      !e.donateList.length
                    )
                      return (
                        clearInterval(e.donateInterval),
                        void (e.donateInterval = null)
                      );
                    if (
                      !e.showDonate.every(function (t) {
                        return t;
                      })
                    ) {
                      var t = e.showIndex;
                      e.showDonate.splice(t, 1, e.donateList.shift()),
                        e.checkShowIndex();
                      var a = setTimeout(function () {
                        e.showDonate.splice(t, 1, null), clearTimeout(a);
                      }, 3e3);
                    }
                  }, 1e3);
                }
              },
            },
          },
          beforeDestroy: function () {
            clearInterval(this.donateInterval);
          },
          methods: {
            checkShowIndex: function () {
              (this.showIndex += 1),
                4 === this.showIndex && (this.showIndex = 0);
            },
            thumbnail: function (t) {
              return t || this.errorPath;
            },
          },
        }),
      Is = Es,
      As = (a('a412'), Object(z['a'])(Is, Os, Ts, !1, null, '0a4564a9', null)),
      ys = As.exports,
      ws = function () {
        var t,
          e,
          a = this,
          n = a.$createElement,
          i = a._self._c || n;
        return i(
          'div',
          {
            directives: [
              {
                name: 'show',
                rawName: 'v-show',
                value: a.hasAnime,
                expression: 'hasAnime',
              },
            ],
          },
          [
            i('div', {
              ref: 'canvasA2',
              class: [
                a.$style.anime,
                ((t = {}), (t[a.$style.top] = 'A2' === a.lastEffect), t),
              ],
            }),
            i('div', {
              ref: 'canvasA3',
              class: [
                a.$style.anime,
                a.$style['effect-a3'],
                ((e = {}), (e[a.$style.top] = 'A3' === a.lastEffect), e),
              ],
            }),
          ]
        );
      },
      Rs = [],
      Ls = a('d871'),
      Ns = {
        data: function () {
          return {
            lastEffect: '',
            donate: {
              A2: { donateList: [], isAniming: !1, player: null, parser: null },
              A3: { donateList: [], isAniming: !1, player: null, parser: null },
            },
          };
        },
        computed: Object(V['a'])(
          Object(V['a'])({}, Object(r['c'])('gift', ['getDonateAnime'])),
          {},
          {
            hasAnime: function () {
              var t = this.donate,
                e = t.A2,
                a = t.A3;
              return (
                !!e.donateList.length ||
                !!a.donateList.length ||
                e.isAniming ||
                a.isAniming
              );
            },
            activeA2Anime: function () {
              return this.donate.A2.donateList[0];
            },
            activeA3Anime: function () {
              return this.donate.A3.donateList[0];
            },
          }
        ),
        watch: {
          getDonateAnime: function (t) {
            var e = t.present_type;
            ['A2', 'A3'].includes(e) &&
              (this.donate[e].donateList = [].concat(
                Object(wa['a'])(this.donate[e].donateList),
                [t]
              ));
          },
          activeA2Anime: function (t) {
            if (t) {
              var e = t.present_type;
              this.startAnime(e);
            }
          },
          activeA3Anime: function (t) {
            if (t) {
              var e = t.present_type;
              this.startAnime(e);
            }
          },
        },
        beforeDestroy: function () {
          this.destorySVGA('A2'), this.destorySVGA('A3');
        },
        methods: {
          destorySVGA: function (t) {
            this.donate[t].player &&
              (this.donate[t].player.stopAnimation(),
              this.donate[t].player.clear(),
              this.donate[t].player._videoItem &&
                (this.donate[t].player._videoItem = null),
              (this.donate[t].player = null)),
              this.donate[t].parser && (this.donate[t].parser = null);
          },
          startAnime: function (t) {
            var e = this;
            (this.lastEffect = t),
              this.donate[t].isAniming ||
                ((this.donate[t].isAniming = !0),
                this.$nextTick(function () {
                  e.initMachineSVGA(t);
                }));
          },
          initMachineSVGA: function (t) {
            var e = this,
              a = this.donate[t].donateList,
              n = this.$wsGetCdnPath(a[0].img_url);
            (this.donate[t].player = new Ls['Player'](
              this.$refs['canvas'.concat(t)]
            )),
              (this.donate[t].parser = new Ls['Parser'](
                this.$refs['canvas'.concat(t)]
              )),
              (this.donate[t].player.loops = 1),
              'A3' === t && this.donate.A3.player.setContentMode('AspectFill'),
              this.donate[t].parser.load(n, function (a) {
                e.donate[t].player.setVideoItem(a),
                  e.donate[t].player.startAnimation(),
                  e.donate[t].player.onFinished(function () {
                    e.donate[t].player.stopAnimation(),
                      e.donate[t].donateList.shift(),
                      e.destorySVGA(t),
                      (e.donate[t].isAniming = !1);
                  });
              });
          },
        },
      },
      ks = Ns,
      Ps = a('899b');
    function Ms(t) {
      this['$style'] = Ps['default'].locals || Ps['default'];
    }
    var Ds = Object(z['a'])(ks, ws, Rs, !1, Ms, null, null),
      js = Ds.exports,
      Gs = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          {
            directives: [
              {
                name: 'show',
                rawName: 'v-show',
                value: t.hasAnime,
                expression: 'hasAnime',
              },
            ],
            staticClass: 'b-anime',
          },
          [
            a('div', { ref: 'canvas', staticClass: 'anime' }),
            t.guardEnterInfo
              ? a('div', { staticClass: 'info-wrap' }, [
                  t.guardEnterInfo.vipIcon
                    ? a('img', {
                        staticClass: 'vip-icon',
                        attrs: {
                          src: t.$wsGetCdnPath(t.guardEnterInfo.vipIcon),
                        },
                      })
                    : t._e(),
                  t.guardEnterInfo.otherBadges
                    ? a(
                        'div',
                        { staticClass: 'badge-wrap' },
                        t._l(t.guardEnterInfo.otherBadges, function (e, n) {
                          return a('img', {
                            key: n,
                            attrs: { src: t.$wsGetCdnPath(e) },
                          });
                        }),
                        0
                      )
                    : t._e(),
                  a('div', { staticClass: 'name' }, [
                    a('span', [t._v(t._s(t.guardEnterInfo.nickname))]),
                    t._v(
                      ' ' + t._s(t.$t('S_ENTER_ROOM').replace('%n', '')) + ' '
                    ),
                  ]),
                ])
              : t._e(),
          ]
        );
      },
      $s = [],
      Us = {
        data: function () {
          return {
            guardEnterList: [],
            guardEnterInfo: null,
            guardInterval: null,
            player: null,
            parser: null,
            isAniming: !1,
          };
        },
        computed: Object(V['a'])(
          Object(V['a'])({}, Object(r['c'])('chatroom', ['getGuardEnter'])),
          {},
          {
            hasAnime: function () {
              return !!this.guardEnterList.length || this.isAniming;
            },
          }
        ),
        watch: {
          getGuardEnter: function (t) {
            var e = this;
            (this.guardEnterList = [].concat(
              Object(wa['a'])(this.guardEnterList),
              [t]
            )),
              this.guardInterval ||
                ((this.isAniming = !0),
                this.$nextTick(function () {
                  e.initMachineSVGA(),
                    (e.guardInterval = setInterval(function () {
                      return e.animeInterval();
                    }, 3e3));
                }));
          },
        },
        beforeDestroy: function () {
          this.destorySVGA(),
            this.guardInterval && clearInterval(this.guardInterval);
        },
        methods: {
          destorySVGA: function () {
            this.player &&
              (this.player.stopAnimation(),
              this.player.clear(),
              this.player._videoItem && (this.player._videoItem = null),
              (this.player = null)),
              this.parser && (this.parser = null);
          },
          animeInterval: function () {
            if (
              (this.player.stopAnimation(),
              this.destorySVGA(),
              !this.guardEnterList.length)
            )
              return (
                (this.isAniming = !1),
                this.guardInterval && clearInterval(this.guardInterval),
                (this.guardInterval = null),
                void (this.guardEnterInfo = null)
              );
            this.initMachineSVGA();
          },
          initMachineSVGA: function () {
            var t = this;
            (this.guardEnterInfo = null),
              this.$nextTick(function () {
                t.guardEnterInfo = t.guardEnterList.shift();
                var e = t.$wsGetCdnPath(t.guardEnterInfo.banner);
                (t.player = new Ls['Player'](t.$refs.canvas)),
                  (t.parser = new Ls['Parser'](t.$refs.canvas)),
                  t.parser.load(e, function (e) {
                    t.player.setVideoItem(e), t.player.startAnimation();
                  });
              });
          },
        },
      },
      xs = Us,
      Fs = (a('2a65'), Object(z['a'])(xs, Gs, $s, !1, null, '7bc1bcda', null)),
      Hs = Fs.exports,
      Bs = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return t.hasAnime
          ? a('div', { ref: 'canvas', staticClass: 'anime' })
          : t._e();
      },
      Ws = [],
      Vs = {
        data: function () {
          return {
            enterEffectList: [],
            isAniming: !1,
            player: null,
            parser: null,
          };
        },
        computed: Object(V['a'])(
          Object(V['a'])({}, Object(r['c'])('gift', ['getDonateAnime'])),
          {},
          {
            hasAnime: function () {
              return !!this.enterEffectList.length || this.isAniming;
            },
          }
        ),
        watch: {
          getDonateAnime: function (t) {
            var e = this,
              a = t.present_type;
            ['C1', 'C2', 'C3'].includes(a) &&
              ((this.enterEffectList = [].concat(
                Object(wa['a'])(this.enterEffectList),
                [t]
              )),
              (this.isAniming = !0),
              this.$nextTick(function () {
                e.initMachineSVGA();
              }));
          },
        },
        beforeDestroy: function () {
          this.destorySVGA();
        },
        methods: {
          destorySVGA: function () {
            this.player &&
              (this.player.stopAnimation(),
              this.player.clear(),
              this.player._videoItem && (this.player._videoItem = null),
              (this.player = null)),
              this.parser && (this.parser = null);
          },
          initMachineSVGA: function () {
            var t = this,
              e = this.$wsGetCdnPath(this.enterEffectList[0].img_url);
            (this.player = new Ls['Player'](this.$refs.canvas)),
              (this.parser = new Ls['Parser'](this.$refs.canvas)),
              (this.player.loops = 1),
              this.player.setContentMode('AspectFill'),
              this.parser.load(e, function (e) {
                t.player.setVideoItem(e),
                  t.player.startAnimation(),
                  t.player.onFinished(function () {
                    t.player.stopAnimation(),
                      t.enterEffectList.shift(),
                      t.enterEffectList[0]
                        ? t.initMachineSVGA()
                        : (t.destorySVGA(), (t.isAniming = !1));
                  });
              });
          },
        },
      },
      Ys = Vs,
      Ks = (a('5833'), Object(z['a'])(Ys, Bs, Ws, !1, null, 'a841273a', null)),
      Xs = Ks.exports,
      qs = {
        components: { A1anime: ys, A23anime: js, Banime: Hs, Canime: Xs },
      },
      zs = qs,
      Qs = (a('f00c'), Object(z['a'])(zs, bs, Cs, !1, null, '092b86b1', null)),
      Js = Qs.exports,
      Zs = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { staticClass: 'room-barrage-wrap' },
          [
            t._l(t.barrageItemList, function (e, n) {
              return [
                a('div', { key: n, staticClass: 'barrage-ani-wrap' }, [
                  e
                    ? a('div', { staticClass: 'barrage-item' }, [
                        a('code', [
                          a(
                            'span',
                            { staticClass: 'badges-wrap' },
                            t._l(e.body.info.badges, function (e, n) {
                              return a('img', {
                                key: 'badges-' + n,
                                attrs: { src: t.$wsGetCdnPath(e) },
                              });
                            }),
                            0
                          ),
                          a('span', { staticClass: 'nickname' }, [
                            t._v(t._s(e.body.nickname) + '：'),
                          ]),
                          a('span', { staticClass: 'txt' }, [
                            t._v(t._s(e.body.text)),
                          ]),
                        ]),
                      ])
                    : t._e(),
                ]),
              ];
            }),
          ],
          2
        );
      },
      tr = [],
      er = {
        data: function () {
          return {
            barrageItemList: [null, null, null, null, null],
            lastIndex: -1,
          };
        },
        computed: Object(V['a'])(
          {},
          Object(r['d'])('chatroom', ['barrageList'])
        ),
        watch: {
          barrageList: function () {
            var t = this.barrageList.length - 1,
              e = this.barrageList[t];
            this.handleBarrageList(e, t);
          },
        },
        methods: Object(V['a'])(
          Object(V['a'])({}, Object(r['b'])('chatroom', ['actionSetBarrage'])),
          {},
          {
            handleBarrageList: function (t, e) {
              var a = this,
                n = this.barrageItemList.indexOf(null);
              -1 !== n &&
                n < 5 &&
                ((this.lastIndex = e),
                (this.barrageItemList = this.barrageItemList.map(function (
                  e,
                  a
                ) {
                  return a === n ? t : e;
                })),
                setTimeout(function () {
                  (a.barrageItemList = a.barrageItemList.map(function (t, e) {
                    return e === n ? null : t;
                  })),
                    setTimeout(function () {
                      a.lastIndex < a.barrageList.length - 1 &&
                        a.handleBarrageList(
                          a.barrageList[a.lastIndex + 1],
                          a.lastIndex + 1
                        );
                    }, 100);
                }, 6e3));
            },
          }
        ),
      },
      ar = er,
      nr = (a('8747'), Object(z['a'])(ar, Zs, tr, !1, null, '4fdecb3e', null)),
      ir = nr.exports,
      sr = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', { staticClass: 'room-broadcast-wrap' }, [
          t.broadcastShow && t.broadcastText
            ? a('div', { staticClass: 'announce-item' }, [
                a('img', {
                  staticClass: 'broadcast-icon',
                  attrs: {
                    src: t.$getCdnPath('/images/common/ic_broadcast.svg'),
                  },
                }),
                a('div', { staticClass: 'text' }, [
                  t._v(t._s(t.broadcastText.body.text)),
                ]),
                t.currentRoom.roomId !== t.redirectStreamId
                  ? a(
                      'div',
                      {
                        staticClass: 'onlook-btn',
                        on: {
                          click: function (e) {
                            return t.toChatroom(t.redirectStreamId);
                          },
                        },
                      },
                      [t._v(' ' + t._s(t.$t('S_ONLOOKERS')) + '> ')]
                    )
                  : t._e(),
              ])
            : t._e(),
        ]);
      },
      rr = [],
      or = {
        data: function () {
          return { broadcastShow: !1, timer: null };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])({}, Object(r['d'])('chatroom', ['currentRoom'])),
              Object(r['c'])(['getProgramList'])
            ),
            Object(r['c'])('chatroom', { roomBroadcasts: 'getBroadcasts' })
          ),
          {},
          {
            broadcastText: function () {
              var t;
              return null === (t = this.roomBroadcasts) || void 0 === t
                ? void 0
                : t[0];
            },
            redirectStreamId: function () {
              return this.broadcastText.body.redirect_stream_id;
            },
          }
        ),
        watch: {
          broadcastText: function (t, e) {
            var a = this;
            Zt.a.isEqual(t, e) ||
              (t &&
                (this.$nextTick(function () {
                  a.broadcastShow = !0;
                }),
                null === this.timer && this.setupTimer()));
          },
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            {},
            Object(r['b'])('chatroom', [
              'actionSetBroadcast',
              'actionSetCurrentRoom',
            ])
          ),
          {},
          {
            setupTimer: function () {
              var t = this;
              this.timer = setTimeout(function () {
                t.actionSetBroadcast(null),
                  (t.broadcastShow = !1),
                  (t.timer = null);
              }, 5e3);
            },
            toChatroom: function (t) {
              var e = this,
                a = this.getProgramList.find(function (e) {
                  return e.roomId === t;
                });
              a &&
                (this.actionSetCurrentRoom(null),
                this.$router
                  .replace({ name: 'chatroom', params: { roomId: a.roomId } })
                  ['catch'](function (t) {
                    return t;
                  }),
                this.$nextTick(function () {
                  e.actionSetCurrentRoom(a);
                }));
            },
          }
        ),
      },
      cr = or,
      ur = (a('ecb6'), Object(z['a'])(cr, sr, rr, !1, null, '2038195e', null)),
      lr = ur.exports,
      dr = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', { class: t.$style['btn-wrap'] }, [
          a('div', { class: t.$style['activity-btn-wrap'] }, [
            a('div', { on: { click: t.onShare } }, [
              a('img', {
                attrs: {
                  src: t.$getCdnPath('/images/chatroom/bar/bar_ic_share.svg'),
                },
              }),
            ]),
            a('div', { on: { click: t.openTaskWallModel } }, [
              a('img', {
                attrs: {
                  src: t.$getCdnPath(
                    '/images/chatroom/bar/bar_ic_activity.svg'
                  ),
                },
              }),
            ]),
            a(
              'div',
              {
                on: {
                  click: function (e) {
                    return t.actionSetChatroomModalType('showGiftList');
                  },
                },
              },
              [
                a('img', {
                  attrs: {
                    src: t.$getCdnPath('/images/chatroom/bar/bar_ic_gift.svg'),
                  },
                }),
              ]
            ),
            a(
              'div',
              {
                on: {
                  click: function (e) {
                    return t.actionSetChatroomModalType('showGameList');
                  },
                },
              },
              [
                a('img', {
                  attrs: {
                    src: t.$getCdnPath('/images/chatroom/bar/bar_ic_game.svg'),
                  },
                }),
              ]
            ),
            a('div', { on: { click: t.leaveRoom } }, [
              a('img', {
                attrs: {
                  src: t.$getCdnPath('/images/chatroom/bar/bar_closure.svg'),
                },
              }),
            ]),
          ]),
        ]);
      },
      mr = [],
      _r = {
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])({}, Object(r['d'])(['user'])),
            Object(r['d'])('chatroom', ['currentRoom'])
          ),
          Object(r['c'])({
            userIsAttentionStreamer: 'getUserIsAttentionStreamer',
          })
        ),
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])({}, Object(r['b'])(['actionSetTipMsgInfo'])),
            Object(r['b'])('chatroom', ['actionSetChatroomModalType'])
          ),
          {},
          {
            openTaskWallModel: function () {
              this.user.lott_id
                ? this.actionSetChatroomModalType('taskWall')
                : Object(gt['d'])();
            },
            onShare: function () {
              this.user.lott_id
                ? (ye(), Object(at['b'])('memberCard'))
                : Object(gt['d'])();
            },
            leaveRoom: function () {
              var t = this;
              !this.userIsAttentionStreamer && this.currentRoom.openAttention
                ? this.actionSetChatroomModalType('showLeaveChatroom')
                : this.actionSetTipMsgInfo({
                    content: this.$t('S_SURE_TO_LEAVE'),
                    cancelText: this.$t('S_CONTINUE_WATCH'),
                    confirmText: this.$t('S_LEAVE'),
                    cancelFunc: function () {
                      return t.actionSetTipMsgInfo(null);
                    },
                    confirmFunc: function () {
                      t.actionSetTipMsgInfo(null),
                        t.$router.replace({ path: '/' })['catch'](function (t) {
                          return t;
                        });
                    },
                  });
            },
          }
        ),
      },
      hr = _r,
      fr = a('a886');
    function pr(t) {
      this['$style'] = fr['default'].locals || fr['default'];
    }
    var gr = Object(z['a'])(hr, dr, mr, !1, pr, null, null),
      Sr = gr.exports,
      vr = {
        components: {
          ChatroomTopInfo: Ia,
          ChatroomMsg: xa,
          VideoPlayer: Ni,
          showOnlineMember: Ka,
          showStreamerInfo: an,
          showUserInfo: un,
          showStreamerCard: fn,
          showGiftList: Yn,
          showGameList: Zn,
          taskWall: Ze,
          showDiamondList: Cn,
          showGuardList: yn,
          showLeaveChatroom: si,
          showRecommand: di,
          attentionStreamer: gi,
          adPage: Gi,
          RightPage: Bi,
          showOpenGuard: es,
          SwitchBtn: Se,
          GameIcon: _s,
          LiveGame: vs,
          Animation: Js,
          ChargeRoom: os,
          RoomBarrage: ir,
          RoomBroadcast: lr,
          mall: sa,
          RightBottomBtns: Sr,
          memInfo: ma,
          ActivityPage: Ft,
          tipMsg: Ve,
        },
        mixins: [de, me],
        data: function () {
          return {
            loading: !0,
            isInputFocus: !1,
            msg: '',
            doSwipe: !1,
            swipe: {},
            AdPageDisplay: !1,
            barrage: !1,
            isClose: !0,
            isVideoMask: !1,
          };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])(
                Object(V['a'])(
                  {},
                  Object(r['d'])(['user', 'showPlayBtn', 'showVideo'])
                ),
                Object(r['d'])('chatroom', [
                  'currentRoom',
                  'wsOn',
                  'showRoomInfo',
                  'showStreamerGiftPage',
                  'currentroomStatus',
                  'userConnectInfo',
                  'chargeRoomState',
                  'isSysCharge',
                ])
              ),
              Object(r['c'])({ wholePageType: 'getWholePageType' })
            ),
            Object(r['c'])('chatroom', {
              streamCharge: 'getStreamCharge',
              streamState: 'getStreamState',
              wsUrl: 'getWsUrl',
              chatroomModalType: 'getChatroomModalType',
              reConnectCount: 'getReConnectCount',
              getStreamCharge: 'getStreamCharge',
              getStreamUrl: 'getStreamUrl',
              cdnDomain: 'getCdnDomain',
            })
          ),
          {},
          {
            transitionAnimateType: function () {
              var t = {
                showOnlineMember: 'slide-up',
                showStreamerInfo: 'slide-up',
                showUserInfo: 'slide-up',
                showGuardList: 'slide-up',
                showDiamondList: 'slide-up',
                taskWall: 'slide-up',
                showGiftList: 'slide-up',
                showGameList: 'slide-up',
                showLeaveChatroom: '',
                showStreamerCard: '',
                showDiamondExchange: 'slide-left',
                showRecommand: 'slide-left',
                showOpenGuard: 'slide-up',
                ActivityPage: 'slide-left',
              };
              return t[this.chatroomModalType];
            },
            showChatMsg: function () {
              var t = ['showOnlineMember', 'showGiftList', 'showGameList'];
              return -1 !== t.indexOf(this.chatroomModalType);
            },
            inputPlaceHolder: function () {
              return this.isInputFocus
                ? this.barrage
                  ? this.$t('S_BARRAGE_IS_OPEN')
                  : this.$t('S_SAY_TO_STREAMER')
                : this.reConnectCount
                ? this.$t('S_SAY_SOMETHING_RE')
                : this.$t('S_SAY_SOMETHING');
            },
            receiveItem: function () {
              return !(
                '0' !== this.isSysCharge ||
                !this.isClose ||
                !this.chargeRoomState
              );
            },
            chatroomContent: function () {
              return [2, 4].includes(this.chargeRoomState)
                ? {}
                : this.$refs.chatroomContent;
            },
            streamerGiftWrap: function () {
              return [2, 4].includes(this.chargeRoomState)
                ? {}
                : document.querySelector('.streamer-gift-wrap');
            },
            chatroomWidth: function () {
              return [2, 4].includes(this.chargeRoomState)
                ? {}
                : document.querySelector('#chatroom').clientWidth;
            },
            knightWrap: function () {
              return [2, 4].includes(this.chargeRoomState)
                ? {}
                : document.querySelector('.online-headphoto-wrap');
            },
            liveGameStatus: function () {
              return !!(
                this.gameSwitch &&
                this.gameToken &&
                this.gameUrls[this.gameName]
              );
            },
          }
        ),
        watch: {
          wsUrl: function (t, e) {
            !Zt.a.isEqual(t, e) && t && this.wsConnect();
          },
          wsOn: function (t, e) {
            Zt.a.isEqual(t, e) ||
              (t && (this.handleMsg(), this.pingPongConnect()));
          },
          msg: function (t, e) {
            t.length > 200 && (this.msg = e);
          },
          showVideo: function (t) {
            var e = this;
            t ||
              this.$nextTick(function () {
                e.actionShowVideo(!0);
              });
          },
          isSysCharge: function () {
            '0' === this.isSysCharge &&
              !1 === this.isClose &&
              (this.isClose = !0);
          },
          barrage: function () {
            this.$refs.submitInput.focus();
          },
        },
        created: function () {
          this.actionSetClearScreen(),
            this.getAttentionStreamer(),
            this.initSwipeData(),
            this.getUserConnect(),
            (this.isVideoMask = !this.$vigoPlayer.volume);
        },
        beforeDestroy: function () {
          this.actionShowPlayBtn(!1),
            this.actionShowVideo(!0),
            this.socketOff(!0),
            this.actionSetChatroomModalType(null),
            this.actionSetWholePageType(null),
            this.actionSetUserConnect(null),
            this.actionSetRoomIsCharge(0);
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              {},
              Object(r['b'])('chatroom', [
                'actionGetUserConnect',
                'actionSetCurrentRoom',
                'actionSetUserConnect',
                'actionSetShowRoomInfo',
                'actionSetChatroomModalType',
                'actionSetChatUser',
                'actionSetRoomCount',
                'actionToggleStreamerGiftPage',
                'actionSetCurrentRoomStatus',
                'actionSetRoomIsCharge',
                'actionSetBroadcast',
                'actionSetChatMsg',
                'actionSetCurrentRoomKo',
                'actionSetEnterList',
                'actionSetVipEnterList',
                'actionSetGuardEnter',
                'actionSetClearScreen',
              ])
            ),
            Object(r['b'])([
              'actionGetAttentionStreamer',
              'actionSetWholePageType',
              'actionSetTipMsgInfo',
              'actionShowPlayBtn',
              'actionShowVideo',
            ])
          ),
          {},
          {
            wsConnect: function () {
              'user' !== this.socketOffMode && this.initSocket();
            },
            backToIndex: function () {
              this.$router.replace({ path: '/' })['catch'](function (t) {
                return t;
              });
            },
            getUserConnect: function () {
              var t = this,
                e = {
                  roomid: this.currentRoom.roomId,
                  groupid: 0,
                  userid: this.user.lott_id,
                };
              this.actionGetUserConnect(e).then(function (e) {
                if ('0' === e.error_code)
                  return (
                    t.checkCharge(),
                    t.actionSetCurrentRoomKo(!1),
                    void (t.loading = !1)
                  );
                '116021018' === e.error_code && t.actionSetCurrentRoomKo(!0),
                  t.$router.push({ path: '/' })['catch'](function (t) {
                    return t;
                  });
              });
            },
            submitMsg: function () {
              if (this.user.lott_id) {
                if (this.msg.replace(/\s*/g, '').length) {
                  var t = {
                    action: this.barrage ? 'Barrage' : 'N',
                    sender: this.user.account,
                    content: this.msg,
                  };
                  this.Barrage ||
                    (t = Object(V['a'])(
                      Object(V['a'])({}, t),
                      {},
                      { recipient: '' }
                    )),
                    this.ws.send(JSON.stringify(t)),
                    (this.msg = ''),
                    this.$refs.submitInput.focus();
                }
              } else Object(gt['d'])();
            },
            inputFocus: function (t, e) {
              (this.isInputFocus = !0), e && (this.msg = '@'.concat(t, ' '));
            },
            openModal: function (t) {
              this.actionSetChatroomModalType(t);
            },
            closeModal: function () {
              this.actionSetChatroomModalType(null);
            },
            initSwipeData: function () {
              (this.swipe = {
                startX: 0,
                startY: 0,
                direction: null,
                distanceX: '',
                distanceY: '',
              }),
                (this.doSwipe = !1);
            },
            startSwipe: function (t) {
              var e = this;
              if (this.chatroomModalType) this.doSwipe = !1;
              else {
                if (t.path) {
                  if (
                    t.path.filter(function (t) {
                      return t === e.knightWrap;
                    }).length
                  )
                    return;
                } else if (t.target === this.knightWrap) return;
                te(t, this);
              }
            },
            movedSwipe: function (t) {
              this.doSwipe && ee(t, this);
            },
            movingSwipe: function (t) {
              this.doSwipe && ae(t, this);
            },
            endSwipe: function (t) {
              this.doSwipe && ne(t, this);
            },
            setAdPageStatus: function (t) {
              this.AdPageDisplay = t;
            },
            getAttentionStreamer: function () {
              this.actionGetAttentionStreamer(this.user.lott_id);
            },
            toggleSwitch: function (t) {
              this.barrage = t;
            },
            checkCharge: function () {
              this.actionSetRoomIsCharge(0);
              var t = this.streamCharge;
              t.charge > 0 &&
                (this.actionSetRoomIsCharge(1),
                t.leaveSecond <= 0 &&
                  (this.socketOff(!0), this.actionSetRoomIsCharge(2)));
            },
            confirmUserLevel: function (t) {
              this.actionSetTipMsgInfo({
                title: this.$t('S_HINT'),
                content: ''
                  .concat(t, '\n')
                  .concat(this.$t('S_NOBLE_AND_SEND_GIFT')),
                cancelText: this.$t('S_CANCEL'),
                confirmText: this.$t('S_TO_GIFT'),
                cancelFunc: this.tipMsgCancel,
                confirmFunc: this.tipMsgConfirm,
              });
            },
            tipMsgConfirm: function () {
              this.actionSetTipMsgInfo(null),
                this.actionSetChatroomModalType('showGiftList');
            },
            tipMsgCancel: function () {
              this.actionSetTipMsgInfo(null);
            },
            reloadVideo: function () {
              var t = this;
              this.actionShowVideo(!1),
                this.$nextTick(function () {
                  t.actionShowPlayBtn(!1);
                });
            },
            openSound: function () {
              this.$vigoPlayer.player &&
                (this.$vigoPlayer.player.audioResume(),
                (this.$vigoPlayer.volume = !0)),
                (this.isVideoMask = !1);
            },
          }
        ),
      },
      br = vr,
      Cr =
        (a('7de1'),
        a('1483'),
        Object(z['a'])(br, ce, ue, !1, null, '33f82da6', null)),
      Or = Cr.exports,
      Tr = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', { staticClass: 'chatroom-closed-wrap' }, [
          a('img', {
            staticClass: 'close-btn',
            attrs: {
              src: t.$getCdnPath('/images/chatroom/bar/bar_closure.svg'),
            },
            on: { click: t.backToIndex },
          }),
          a(
            'div',
            { staticClass: 'streamer-wrap' },
            [
              a('div', [
                a('img', {
                  staticClass: 'streamer-head',
                  attrs: {
                    src: t.currentRoom.headphoto,
                    onerror: t.getDefaultUserImg,
                  },
                }),
              ]),
              a('div', { staticClass: 'streamer-info' }, [
                a('div', { staticClass: 'nick-name' }, [
                  t._v(t._s(t.currentRoom.nickname)),
                ]),
                a('div', { staticClass: 'streamer-id' }, [
                  t._v('ID:' + t._s(t.currentRoom.streamerId)),
                ]),
              ]),
              [
                t.userIsAttentionStreamer
                  ? t._e()
                  : a(
                      'div',
                      {
                        staticClass: 'follow-btn',
                        on: { click: t.attentionStreamer },
                      },
                      [t._v(' +' + t._s(t.$t('S_FOLLOW_STREAMER')) + ' ')]
                    ),
              ],
            ],
            2
          ),
          a('div', { staticClass: 'recommand-wrap' }, [
            a('div', { staticClass: 'title-wrap' }, [
              a('div', [t._v(t._s(t.$t('S_RECOMMAND_TO_YOU')))]),
              a(
                'div',
                { staticClass: 'change-a-batch', on: { click: t.changeBatch } },
                [t._v(' ' + t._s(t.$t('S_CHANGE_A_BATCH')) + ' ')]
              ),
            ]),
            a(
              'div',
              { staticClass: 'program-wrap' },
              t._l(t.recommendList, function (e, n) {
                return a('ProgramCard', {
                  key: 'recommend-' + e.roomId + '-' + n,
                  attrs: { room: e },
                  on: { toStreamRoom: t.toStreamRoom },
                });
              }),
              1
            ),
          ]),
        ]);
      },
      Er = [],
      Ir = {
        components: { ProgramCard: ft },
        data: function () {
          return { count: 0, recommendList: [] };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])({}, Object(r['d'])(['user'])),
              Object(r['d'])('chatroom', ['currentRoom'])
            ),
            Object(r['c'])(['getDefaultUserImg', 'getProgramList'])
          ),
          Object(r['c'])({
            userIsAttentionStreamer: 'getUserIsAttentionStreamer',
          })
        ),
        created: function () {
          var t = this;
          this.actionGetProgram().then(function () {
            t.changeBatch();
          });
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              {},
              Object(r['b'])([
                'actionAttentionStreamer',
                'actionCancelAttentionStreamer',
                'actionSetHintInfo',
                'actionGetProgram',
              ])
            ),
            Object(r['b'])('chatroom', ['actionSetCurrentRoom'])
          ),
          {},
          {
            toStreamRoom: function (t) {
              var e = this;
              this.actionSetCurrentRoom(null),
                this.$router
                  .replace({ name: 'chatroom', params: { roomId: t.roomId } })
                  ['catch'](function (t) {
                    return t;
                  }),
                this.$nextTick(function () {
                  e.actionSetCurrentRoom(t);
                });
            },
            attentionStreamer: function () {
              var t = { streamer_id: this.currentRoom.streamerId };
              this.actionAttentionStreamer(t);
            },
            cancelAttentionStreamer: function () {
              var t = this,
                e = { streamer_id: this.currentRoom.streamerId };
              this.actionCancelAttentionStreamer(e).then(function (e) {
                '0' === e.error_code &&
                  t.actionSetHintInfo(t.$t('S_CANCEL_ATTENTION_SUCCESS'));
              });
            },
            backToIndex: function () {
              this.$router.push('/');
            },
            changeBatch: function () {
              (this.recommendList = Object(gt['a'])(
                this.getProgramList,
                30,
                this.count
              )),
                (this.count += 30);
            },
          }
        ),
      },
      Ar = Ir,
      yr = (a('d2ee'), Object(z['a'])(Ar, Tr, Er, !1, null, '327e4c33', null)),
      wr = yr.exports,
      Rr = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', { staticClass: 'chatroom-ko-wrap' }, [
          a('img', {
            staticClass: 'chatroom-loading-bg',
            attrs: {
              src: t.currentRoom.backgroundImg,
              onerror: t.getDefaultUserImg,
            },
          }),
        ]);
      },
      Lr = [],
      Nr = {
        data: function () {
          return { newIndex: -1 };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            {},
            Object(r['d'])('chatroom', [
              'currentRoom',
              'index',
              'currentRoomKO',
            ])
          ),
          Object(r['c'])(['getDefaultUserImg', 'getProgramList'])
        ),
        created: function () {
          this.actionSetTipMsgInfo({
            title: this.$t('S_HINT'),
            content: ''
              .concat(this.$t('S_KICK_OUT'), '\n')
              .concat(this.$t('S_SEE_U_LATER')),
            cancelText: this.$t('S_BACK_TO_INDEX'),
            confirmText: this.$t('S_COMMAND_NEXT_ROOM'),
            cancelFunc: this.tipMsgCancel,
            confirmFunc: this.toOtherRoom,
          });
        },
        beforeDestroy: function () {
          this.actionSetCurrentRoomKo(!1);
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])({}, Object(r['b'])(['actionSetTipMsgInfo'])),
            Object(r['b'])('chatroom', [
              'actionSetCurrentRoomKo',
              'actionSetCurrentRoom',
            ])
          ),
          {},
          {
            toOtherRoom: function () {
              var t = this.index,
                e = this.getProgramList,
                a = e.length,
                n = Math.floor(Math.random() * a);
              this.actionSetTipMsgInfo(null),
                t !== n ? this.actionSetCurrentRoom(e[n]) : this.toOtherRoom();
            },
            tipMsgCancel: function () {
              this.actionSetTipMsgInfo(null), this.$router.push('/');
            },
          }
        ),
      },
      kr = Nr,
      Pr = (a('e587'), Object(z['a'])(kr, Rr, Lr, !1, null, '2695ccac', null)),
      Mr = Pr.exports,
      Dr = {
        components: { Chatroom: Or, ChatroomClosed: wr, ChatroomKo: Mr },
        data: function () {
          return {
            doSwipe: !1,
            swipe: {},
            chatMsgWrap: null,
            chatroomAnimation: !1,
            chatroomIndexWrap: null,
            chatroomIndexHeight: null,
            preRoom: '',
            nextRoom: '',
            slide: '',
            swipeX: !1,
          };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])(
                Object(V['a'])(
                  Object(V['a'])({}, Object(r['d'])(['user'])),
                  Object(r['d'])('chatroom', [
                    'currentRoom',
                    'chatroomModalType',
                    'showStreamerGiftPage',
                    'currentroomStatus',
                    'showGesture',
                    'index',
                    'currentRoomKO',
                    'chargeRoomState',
                  ])
                ),
                Object(r['c'])([
                  'getProgramList',
                  'getDefaultUserImg',
                  'getUserIsAttentionStreamer',
                  'getHintInfo',
                ])
              ),
              Object(r['c'])('game', { gameSwitch: 'getGameSwitch' })
            ),
            Object(r['c'])('chatroom', ['getChatMsg', 'getSwipeDirection'])
          ),
          {},
          {
            canRoomSwipe: function () {
              return (
                this.chatroomModalType ||
                this.showStreamerGiftPage ||
                this.currentRoomKO ||
                this.gameSwitch
              );
            },
          }
        ),
        watch: {
          getProgramList: function (t, e) {
            if (Zt.a.xor(t, e).length > 0) {
              var a = Number(this.$route.params.roomId),
                n = t.filter(function (t) {
                  return t.roomId === a;
                });
              n.length && this.actionSetCurrentRoom(n[0]);
            }
          },
          currentRoom: function (t) {
            t &&
              (this.actionSetCurrentRoomKo(!1),
              this.setRoomIndex(),
              this.$router
                .push({
                  name: 'chatroom',
                  params: { roomId: this.getProgramList[this.index].roomId },
                })
                ['catch'](function (t) {
                  return t;
                }));
          },
          'swipe.direction': {
            handler: function (t, e) {
              !Zt.a.isEqual(t, e) && t && this.actionSetSwipeDirection(t);
            },
          },
        },
        beforeDestroy: function () {
          this.actionSetTokenInterval('clear'),
            this.actionSetGameToken(null),
            at['a'].jsToAppMessage({ event: 'EVENT_DISPLAY_FOOTER', data: !0 });
        },
        created: function () {
          at['a'].jsToAppMessage({ event: 'EVENT_DISPLAY_FOOTER', data: !1 }),
            this.checkCurrentRoom(),
            this.initSwipeData(),
            this.setShowGesture(),
            this.actionGameList();
        },
        mounted: function () {
          if (
            (this.swipeElementSetting(), !document.getElementById('rd2-live'))
          ) {
            var t = document.createElement('script');
            t.setAttribute(
              'src',
              this.$getCdnPath('/static/utils/live-element-v2101.js')
            ),
              t.setAttribute('charset', 'utf-8'),
              t.setAttribute('id', 'rd2-live'),
              document.body.appendChild(t);
          }
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              Object(V['a'])({}, Object(r['b'])(['actionGetProgram'])),
              Object(r['b'])('chatroom', [
                'actionSetCurrentRoom',
                'actionSetShowGesture',
                'actionSetRoomIndex',
                'actionSetCurrentRoomKo',
                'actionSetSwipeDirection',
              ])
            ),
            Object(r['b'])('game', [
              'actionGameList',
              'actionSetTokenInterval',
              'actionSetGameToken',
            ])
          ),
          {},
          {
            checkCurrentRoom: function () {
              this.currentRoom ? this.setRoomIndex() : this.actionGetProgram();
            },
            setRoomIndex: function () {
              this.actionSetRoomIndex(this.currentRoom.index),
                (this.preRoom = this.getProgramList[this.getPreRoomIndex()]),
                (this.nextRoom = this.getProgramList[this.getNextRoomIndex()]);
            },
            getPreRoomIndex: function () {
              return 0 === this.index
                ? this.getProgramList.length - 1
                : this.index - 1;
            },
            getNextRoomIndex: function () {
              return this.index === this.getProgramList.length - 1
                ? 0
                : this.index + 1;
            },
            swipeElementSetting: function () {
              (this.chatMsgWrap = document.getElementById('chat-msg-wrap')),
                (this.chatroomIndexWrap = this.$refs.chatroomIndex),
                (this.chatroomIndexHeight =
                  this.chatroomIndexWrap.clientHeight);
            },
            initSwipeData: function () {
              (this.swipe = {
                startX: 0,
                startY: 0,
                direction: null,
                distanceX: '',
                distanceY: '',
              }),
                (this.doSwipe = !1);
            },
            startSwipe: function (t) {
              var e = this;
              if (
                ((this.chatMsgWrap = document.getElementById('chat-msg-wrap')),
                this.canRoomSwipe)
              )
                this.doSwipe = !1;
              else {
                if ('touchstart' === t.type) {
                  var a = document.getElementById('chat-all-msg-wrap'),
                    n =
                      2 === this.currentroomStatus
                        ? this.$refs.chatroom.$el
                        : this.$refs.chatroomClose.$el,
                    i = t.target,
                    s = !1;
                  while (i !== a && !s) (i = i.parentElement), (s = n === i);
                  if (!s) return void (this.doSwipe = !1);
                }
                if (t.path) {
                  if (
                    t.path.filter(function (t) {
                      return t === e.chatMsgWrap;
                    }).length
                  )
                    return void (this.doSwipe = !1);
                } else if (t.target === this.chatMsgWrap)
                  return void (this.doSwipe = !1);
                ie(t, this);
              }
            },
            movedSwipe: function (t) {
              this.doSwipe && se(t, this);
            },
            movingSwipe: function (t) {
              this.doSwipe && !this.swipeX && re(t, this);
            },
            endSwipe: function (t) {
              this.doSwipe && oe(t, this);
            },
            setSwipeX: function (t) {
              this.swipeX = t;
            },
            setShowGesture: function () {
              this.showGesture &&
                this.actionSetShowGesture(this.user.first_login);
            },
          }
        ),
      },
      jr = Dr,
      Gr = (a('e504'), Object(z['a'])(jr, zt, Qt, !1, null, 'f6b101da', null)),
      $r = Gr.exports,
      Ur = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          [
            a('Leaderboard', {
              on: {
                targetId: function (e) {
                  t.targetId = e;
                },
                showPage: function (e) {
                  t.showPage = e;
                },
                isStreamerCard: function (e) {
                  t.isStreamerCard = e;
                },
                isFakeUser: function (e) {
                  t.isFakeUser = e;
                },
              },
            }),
            a(
              'transition',
              { attrs: { name: 'slide-left' } },
              [
                t.targetId
                  ? a('DynamicPage', {
                      attrs: {
                        'target-id': t.targetId,
                        'show-page': t.showPage,
                        'is-streamer-card': t.isStreamerCard,
                        'is-admin': t.isAdmin,
                        'is-fake-user': t.isFakeUser,
                      },
                      on: {
                        'update:targetId': function (e) {
                          t.targetId = e;
                        },
                        'update:target-id': function (e) {
                          t.targetId = e;
                        },
                        'update:showPage': function (e) {
                          t.showPage = e;
                        },
                        'update:show-page': function (e) {
                          t.showPage = e;
                        },
                        'update:isStreamerCard': function (e) {
                          t.isStreamerCard = e;
                        },
                        'update:is-streamer-card': function (e) {
                          t.isStreamerCard = e;
                        },
                        'update:isAdmin': function (e) {
                          t.isAdmin = e;
                        },
                        'update:is-admin': function (e) {
                          t.isAdmin = e;
                        },
                        'update:isFakeUser': function (e) {
                          t.isFakeUser = e;
                        },
                        'update:is-fake-user': function (e) {
                          t.isFakeUser = e;
                        },
                      },
                    })
                  : t._e(),
              ],
              1
            ),
          ],
          1
        );
      },
      xr = [],
      Fr = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { staticClass: 'leaderboard-wrap' },
          [
            a('Header', {
              attrs: {
                title: t.$t('S_LEADER_BOARD'),
                'left-btn-func': t.leftBtnFunc,
              },
            }),
            a(
              'div',
              { staticClass: 'content' },
              [
                a(
                  'el-tabs',
                  {
                    staticClass: 'tabs-wrap',
                    attrs: { stretch: '' },
                    model: {
                      value: t.nowTab,
                      callback: function (e) {
                        t.nowTab = e;
                      },
                      expression: 'nowTab',
                    },
                  },
                  t._l(t.tabList, function (t) {
                    return a('el-tab-pane', {
                      key: 'tab-' + t.key,
                      attrs: { name: t.key, label: t.label },
                    });
                  }),
                  1
                ),
                a('div', { staticClass: 'time-options-wrap' }, [
                  a(
                    'div',
                    { staticClass: 'time-options' },
                    t._l(t.timeOptions, function (e) {
                      return a(
                        'div',
                        {
                          key: 'tab-' + e.key,
                          class: { current: e.key === t.nowTime },
                          on: {
                            click: function (a) {
                              t.nowTime = e.key;
                            },
                          },
                        },
                        [t._v(' ' + t._s(e.label) + ' ')]
                      );
                    }),
                    0
                  ),
                  a(
                    'div',
                    {
                      staticClass: 'last-date',
                      on: {
                        click: function (e) {
                          t.isShowLast = !0;
                        },
                      },
                    },
                    [
                      a('img', {
                        attrs: {
                          src: t.$getCdnPath('/images/common/ic_calender.png'),
                        },
                      }),
                      a('span', [t._v(t._s(t.lastTimeDate.title))]),
                    ]
                  ),
                ]),
                a('DataContent', {
                  attrs: {
                    leaderboard: t.nowTab,
                    data: t.boardData[t.nowTime],
                  },
                  on: { openCard: t.openCard },
                }),
                t.isShowLast
                  ? a('div', { staticClass: 'mask' }, [
                      a(
                        'div',
                        { staticClass: 'popup-wrap' },
                        [
                          a('img', {
                            staticClass: 'close',
                            attrs: {
                              src: t.$getCdnPath(
                                '/images/common/popup_ic_close.png'
                              ),
                            },
                            on: {
                              click: function (e) {
                                t.isShowLast = !1;
                              },
                            },
                          }),
                          a('DataContent', {
                            attrs: {
                              'is-pop-up': '',
                              data: t.boardData[t.lastTimeDate.key],
                              leaderboard: t.nowTab,
                            },
                            on: { openCard: t.openCard },
                          }),
                        ],
                        1
                      ),
                    ])
                  : t._e(),
              ],
              1
            ),
          ],
          1
        );
      },
      Hr = [],
      Br = a('71c2'),
      Wr = a('e79c'),
      Vr = {
        components: { Header: Br['a'], DataContent: Wr['a'] },
        data: function () {
          return {
            timeOptions: [
              { key: 'day', label: this.$t('S_DAILY_LIST') },
              { key: 'week', label: this.$t('S_WEEKLY_LIST') },
              { key: 'month', label: this.$t('S_MONTHLY_LIST') },
            ],
            nowTab: 'richer',
            nowTime: 'day',
            lastTime: 'yesterday',
            isShowLast: !1,
            boardData: {},
          };
        },
        computed: {
          tabList: function () {
            return [
              { key: 'anchor', label: this.$t('S_LEADER_BOARD_ANCHOR') },
              { key: 'richer', label: this.$t('S_LEADER_BOARD_RICHER') },
              { key: 'paopao', label: this.$t('S_BUBBLE_RANK') },
            ];
          },
          lastTimeDate: function () {
            var t = {
              day: { key: 'yesterday', title: this.$t('S_YESTERDAY') },
              week: { key: 'last_week', title: this.$t('S_LAST_WEEK') },
              month: { key: 'last_month', title: this.$t('S_LAST_MONTH') },
            };
            return t[this.nowTime];
          },
          lastDate: function () {
            return 'week' === this.nowTime
              ? this.$t('S_LAST_WEEK')
              : 'month' === this.nowTime
              ? this.$t('S_LAST_MONTH')
              : this.$t('S_YESTERDAY');
          },
        },
        watch: {
          nowTab: function (t, e) {
            t && t !== e && this.getLeaderboardData();
          },
        },
        created: function () {
          this.getLeaderboardData();
        },
        methods: {
          openCard: function (t) {
            var e = 'anchor' === this.nowTab;
            this.$emit('targetId', t.id),
              this.$emit('isFakeUser', -1 === t.identity_id),
              this.$emit('showPage', 'card'),
              this.$emit('isStreamerCard', e);
          },
          getLeaderboardData: function () {
            var t = this,
              e = { anchor: $e['f'], richer: $e['q'], paopao: $e['p'] };
            e[this.nowTab]().then(function (e) {
              var a = e.data;
              '0' === a.error_code && (t.boardData = a.result);
            });
          },
          leftBtnFunc: function () {
            Object(Y['a'])('appUse') || this.$route.query.jwt_token
              ? at['a'].jsToAppMessage({ event: 'EVENT_EXIT', data: '' })
              : this.$router.push('/');
          },
        },
      },
      Yr = Vr,
      Kr = (a('2205'), Object(z['a'])(Yr, Fr, Hr, !1, null, 'c9de6b5a', null)),
      Xr = Kr.exports,
      qr = {
        components: { Leaderboard: Xr, DynamicPage: ca['default'] },
        data: function () {
          return {
            targetId: null,
            showPage: null,
            isStreamerCard: !1,
            isAdmin: !1,
            isFakeUser: !1,
          };
        },
        beforeDestroy: function () {
          at['a'].jsToAppMessage({ event: 'EVENT_DISPLAY_FOOTER', data: !0 });
        },
        created: function () {
          at['a'].jsToAppMessage({ event: 'EVENT_DISPLAY_FOOTER', data: !1 });
        },
      },
      zr = qr,
      Qr = (a('b7b2'), Object(z['a'])(zr, Ur, xr, !1, null, 'ebca47ca', null)),
      Jr = Qr.exports,
      Zr = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { staticClass: 'page-wrap' },
          [
            a('div', { staticClass: 'title' }, [t._v('主站ＨＯＭＥ')]),
            t._l(t.route, function (e) {
              return a(
                'router-link',
                {
                  key: e.path,
                  staticClass: 'router-link',
                  attrs: { to: { name: '' + e.name } },
                },
                [a('div', [t._v(t._s(t.$t(e.name)))])]
              );
            }),
          ],
          2
        );
      },
      to = [],
      eo = {
        data: function () {
          return {
            route: [
              { path: '/', name: 'Index' },
              { path: '/myStyle', name: 'MyStyle' },
              { path: '/myProps', name: 'MyProps' },
              { path: '/mall', name: 'Mall' },
              { path: '/myTrack', name: 'myTrack' },
              { path: '/myFavorite', name: 'myFavorite' },
              { path: '/myVip', name: 'myVip' },
              { path: '/myGuard', name: 'myGuard' },
              { path: '/myContribute', name: 'myContribute' },
              { path: '/exchange-Diamond', name: 'exchangeDiamond' },
              { path: '/taskWall', name: 'taskWall' },
              { path: '/firstMeetTask', name: 'firstMeetTask' },
              { path: '/mySentPaopao', name: 'mySentPaopao' },
            ],
          };
        },
      },
      ao = eo,
      no = (a('5abd'), Object(z['a'])(ao, Zr, to, !1, null, '06f40fed', null)),
      io = no.exports,
      so = a('c70f'),
      ro = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { staticClass: 'exchagne-wrap' },
          [
            a('MainHeader', { attrs: { title: t.$t('S_EXCHANGE_DIAMOND') } }, [
              a(
                'div',
                {
                  staticClass: 'service-btn',
                  attrs: { slot: 'right-btn' },
                  on: { click: t.callService },
                  slot: 'right-btn',
                },
                [
                  a('img', {
                    attrs: {
                      src: t.$getCdnPath(
                        '/images/mainSite/common/icon_service.png'
                      ),
                    },
                  }),
                ]
              ),
            ]),
            a('div', { staticClass: 'content' }, [
              a('div', { staticClass: 'item' }, [
                a('img', {
                  attrs: {
                    src: t.$getCdnPath(
                      '/images/mainSite/common/ic_diamond_b.png'
                    ),
                  },
                }),
                a('div', { staticClass: 'label' }, [
                  t._v(t._s(t.$t('S_MY_DIAMOND'))),
                ]),
                a('div', { staticClass: 'amount' }, [
                  t._v(t._s(t._f('amountFormat')(t.resultData.diamond_amount))),
                ]),
              ]),
              a('div', { staticClass: 'v-line' }),
              a('div', { staticClass: 'item' }, [
                a('img', {
                  attrs: {
                    src: t.$getCdnPath('/images/mainSite/common/ic_exp.png'),
                  },
                }),
                a('div', { staticClass: 'label' }, [
                  t._v(t._s(t.$t('S_EXPERIENCE'))),
                ]),
                a('div', { staticClass: 'amount' }, [
                  t._v(t._s(t._f('amountFormat')(t.resultData.exp))),
                ]),
              ]),
              a('div', { staticClass: 'v-line' }),
              a('div', { staticClass: 'item' }, [
                a(
                  'div',
                  {
                    class: ['btn', { disable: !t.resultData.exp }],
                    on: { click: t.onExchagne },
                  },
                  [t._v(' ' + t._s(t.$t('S_NOW_EXCHANGE_DIAMOND')) + ' ')]
                ),
              ]),
            ]),
            a(
              'div',
              { staticClass: 'article-wrap' },
              [
                a('el-divider', { attrs: { 'content-position': 'center' } }, [
                  t._v(t._s(t.$t('S_REMINDER'))),
                ]),
                a('ul', { staticClass: 'article-content' }, [
                  a('li', [t._v(t._s(t.articleList[0]))]),
                  a('li', [t._v(t._s(t.articleList[1]))]),
                  a('li', [t._v(t._s(t.articleList[2]))]),
                  a('li', [t._v(t._s(t.articleList[3]))]),
                ]),
              ],
              1
            ),
          ],
          1
        );
      },
      oo = [],
      co = {
        components: { MainHeader: we['a'] },
        data: function () {
          return {
            showTipPop: !1,
            resultData: {},
            articleList: [
              '【经验值作用？】',
              '经验值可兑换钻石，一旦完成兑换后，不得再转换为经验值',
              '【如何获得经验值？】',
              '可透过「直播活动」或「完成任务、签到」以及「会员直播等级晋升」取得',
            ],
          };
        },
        created: function () {
          this.initData();
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            {},
            Object(r['b'])(['actionSetHintInfo', 'actionSetTipMsgInfo'])
          ),
          {},
          {
            initData: function () {
              var t = this;
              Object($e['g'])().then(function (e) {
                var a = e.data;
                '0' === a.error_code && (t.resultData = a.result);
              });
            },
            confirmFunc: function () {
              var t = this;
              this.actionSetTipMsgInfo(null),
                Object($e['e'])().then(function (e) {
                  var a = e.data;
                  if ('0' === a.error_code)
                    return (
                      t.actionSetHintInfo(t.$t('S_EXCHANGE_SUCCESS')),
                      void t.initData()
                    );
                  t.actionSetHintInfo(
                    ''.concat(a.error_text, '(').concat(a.error_code, ')')
                  );
                });
            },
            onExchagne: function () {
              var t = this;
              this.resultData.exp &&
                this.actionSetTipMsgInfo({
                  title: this.$t('S_HINT'),
                  content: this.$t('S_ALL_EXP_EXCHANGE_DIAMOND'),
                  cancelFunc: function () {
                    return t.actionSetTipMsgInfo(null);
                  },
                  confirmFunc: this.confirmFunc,
                });
            },
            callService: function () {
              Object(at['c'])('customerService');
            },
          }
        ),
      },
      uo = co,
      lo = (a('7829'), Object(z['a'])(uo, ro, oo, !1, null, '7f39b07a', null)),
      mo = lo.exports,
      _o = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return t.getStyleList
          ? a(
              'div',
              [
                a('MainHeader', { attrs: { title: t.$t('S_MY_STYLE') } }),
                a(
                  'el-tabs',
                  {
                    attrs: { stretch: '' },
                    model: {
                      value: t.activeName,
                      callback: function (e) {
                        t.activeName = e;
                      },
                      expression: 'activeName',
                    },
                  },
                  t._l(t.typeList, function (e) {
                    return a('el-tab-pane', {
                      key: e,
                      attrs: { label: t.libGetStyleTypeName(e), name: e },
                    });
                  }),
                  1
                ),
                a(
                  'div',
                  {
                    staticClass: 'page-nav-wrap',
                    on: {
                      click: function (e) {
                        return e.target !== e.currentTarget
                          ? null
                          : t.setSelectItem(null);
                      },
                    },
                  },
                  [
                    a(
                      'div',
                      { staticClass: 'prop-wrap' },
                      t._l(t.activeStyleList, function (e) {
                        return a(
                          'div',
                          {
                            key: e.id,
                            staticClass: 'props-item',
                            class: {
                              activeItem:
                                t.selectItem && t.selectItem.id === e.id,
                              lockItem: 1 === e.equip && 0 === e.gain,
                              useingItem: 2 === e.equip,
                            },
                            on: {
                              click: function (a) {
                                return t.setSelectItem(e);
                              },
                            },
                          },
                          [
                            a('div', {
                              staticClass: 'name',
                              domProps: {
                                innerHTML: t._s(t.getStyleName(e.name)),
                              },
                            }),
                            a(
                              'div',
                              { staticClass: 'img' },
                              [
                                0 === e.gain
                                  ? [
                                      a('div', { staticClass: 'img-mask' }),
                                      a('img', {
                                        staticClass: 'lock-icon',
                                        attrs: {
                                          src: t.$getCdnPath(
                                            '/images/mainSite/props/ic_lock.svg'
                                          ),
                                        },
                                      }),
                                    ]
                                  : t._e(),
                                e.new
                                  ? a('div', { staticClass: 'new' }, [
                                      t._v('New'),
                                    ])
                                  : t._e(),
                                a('img', {
                                  staticClass: 'thumbnail',
                                  attrs: { src: e.thumbnail },
                                }),
                              ],
                              2
                            ),
                            a('div', { staticClass: 'use' }, [
                              t._v(t._s(t.getUsingType(e))),
                            ]),
                          ]
                        );
                      }),
                      0
                    ),
                    a('transition', { attrs: { name: 'slide-up' } }, [
                      t.selectItem
                        ? a('div', { staticClass: 'style-info-and-badge' }, [
                            'uBadge' === t.activeName
                              ? a(
                                  'div',
                                  { staticClass: 'badge-wrap' },
                                  [
                                    t._l(t.getUsingBadgesList, function (t, e) {
                                      return [
                                        t
                                          ? a(
                                              'div',
                                              { key: e, staticClass: 'badge' },
                                              [a('img', { attrs: { src: t } })]
                                            )
                                          : a('div', {
                                              key: e,
                                              staticClass: 'empty-badge',
                                            }),
                                      ];
                                    }),
                                  ],
                                  2
                                )
                              : t._e(),
                            a('div', { staticClass: 'style-info-wrap' }, [
                              a('div', { staticClass: 'style-card-wrap' }, [
                                a('div', { staticClass: 'style-card' }, [
                                  a('div', {
                                    staticClass: 'name',
                                    domProps: {
                                      innerHTML: t._s(
                                        t.getStyleName(t.selectItem.name)
                                      ),
                                    },
                                  }),
                                  a(
                                    'div',
                                    {
                                      staticClass: 'img',
                                      on: { click: t.showSVGADemo },
                                    },
                                    [
                                      'eff' === t.activeName
                                        ? a('img', {
                                            staticClass: 'demo-img',
                                            attrs: {
                                              src: t.$getCdnPath(
                                                '/images/mainSite/props/ic_demo.svg'
                                              ),
                                            },
                                          })
                                        : t._e(),
                                      a('img', {
                                        staticClass: 'thumbnail',
                                        attrs: { src: t.selectItem.thumbnail },
                                      }),
                                    ]
                                  ),
                                ]),
                                a('div', { staticClass: 'description' }, [
                                  a(
                                    'div',
                                    { staticClass: 'description-title' },
                                    [
                                      t._v(
                                        ' ' +
                                          t._s(
                                            t.getDescriptionName(t.activeName)
                                          ) +
                                          '： '
                                      ),
                                    ]
                                  ),
                                  a('div', [
                                    t._v(
                                      ' ' + t._s(t.selectItem.description) + ' '
                                    ),
                                  ]),
                                ]),
                              ]),
                              a(
                                'div',
                                { staticClass: 'btn-wrap' },
                                [
                                  'background' !== t.activeName
                                    ? [
                                        0 === t.selectItem.gain
                                          ? a(
                                              'div',
                                              {
                                                on: {
                                                  click: function (e) {
                                                    return t.$router.push(
                                                      '/main/mall'
                                                    );
                                                  },
                                                },
                                              },
                                              [
                                                t._v(
                                                  ' ' +
                                                    t._s(t.$t('S_TO_BUY')) +
                                                    ' '
                                                ),
                                              ]
                                            )
                                          : 1 === t.selectItem.equip
                                          ? a(
                                              'div',
                                              { on: { click: t.setStyle } },
                                              [
                                                t._v(
                                                  ' ' +
                                                    t._s(t.$t('S_USE')) +
                                                    ' '
                                                ),
                                              ]
                                            )
                                          : a(
                                              'div',
                                              { on: { click: t.deleteStyle } },
                                              [
                                                t._v(
                                                  ' ' +
                                                    t._s(t.$t('S_STOP_USE')) +
                                                    ' '
                                                ),
                                              ]
                                            ),
                                      ]
                                    : [
                                        0 === t.selectItem.gain
                                          ? a(
                                              'div',
                                              { staticClass: 'lock-btn' },
                                              [
                                                t._v(
                                                  ' ' +
                                                    t._s(t.$t('S_LOCK')) +
                                                    ' '
                                                ),
                                              ]
                                            )
                                          : 1 === t.selectItem.equip
                                          ? a(
                                              'div',
                                              { on: { click: t.setStyle } },
                                              [
                                                t._v(
                                                  ' ' +
                                                    t._s(t.$t('S_USE')) +
                                                    ' '
                                                ),
                                              ]
                                            )
                                          : a(
                                              'div',
                                              { staticClass: 'lock-btn' },
                                              [
                                                t._v(
                                                  ' ' +
                                                    t._s(t.$t('S_USED')) +
                                                    ' '
                                                ),
                                              ]
                                            ),
                                      ],
                                ],
                                2
                              ),
                              a('div'),
                            ]),
                          ])
                        : t._e(),
                    ]),
                  ],
                  1
                ),
                a(
                  'div',
                  {
                    directives: [
                      {
                        name: 'show',
                        rawName: 'v-show',
                        value: t.showDemoStyle,
                        expression: 'showDemoStyle',
                      },
                    ],
                    staticClass: 'demo-wrap',
                  },
                  [
                    a('img', {
                      staticClass: 'close-btn',
                      attrs: {
                        src: t.$getCdnPath(
                          '/images/mainSite/common/btn_close2.svg'
                        ),
                      },
                      on: { click: t.stopSVGADemo },
                    }),
                    a('div', {
                      ref: 'canvas',
                      staticClass: 'anime-player-wrap',
                    }),
                  ]
                ),
              ],
              1
            )
          : t._e();
      },
      ho = [],
      fo = {
        components: { MainHeader: we['a'] },
        data: function () {
          return {
            activeName: 'eff',
            selectItem: null,
            typeList: ['eff', 'uBadge', 'uFrame', 'background'],
            showDemoStyle: !1,
            player: null,
            parser: null,
          };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              {},
              Object(r['c'])('my', ['getStyleList', 'getUsingBadgesList'])
            ),
            Object(r['d'])(['user'])
          ),
          {},
          {
            activeStyleList: function () {
              var t = this.getStyleList,
                e = this.activeName;
              return t[e].data;
            },
          }
        ),
        watch: {
          activeName: function () {
            this.selectItem = null;
          },
          getStyleList: function (t) {
            var e = this;
            t &&
              this.$nextTick(function () {
                (e.player = new Ls['Player'](e.$refs.canvas)),
                  (e.parser = new Ls['Parser'](e.$refs.canvas)),
                  e.player.setContentMode('AspectFill');
              });
          },
        },
        created: function () {
          var t = { lott_id: this.user.lott_id };
          this.actionGetStyleList(t);
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            {},
            Object(r['b'])('my', [
              'actionGetStyleList',
              'actionSetStyle',
              'actionDeleteMyStyle',
            ])
          ),
          {},
          {
            libGetStyleTypeName: function (t) {
              var e = this.getStyleList[t].typeCount;
              return ''.concat(dt(t), '(').concat(e, ')');
            },
            getUsingType: function (t) {
              if (!t.gain) return this.$t('S_LOCK');
              var e = { 1: this.$t('S_UN_USE'), 2: this.$t('S_IN_USE') };
              return e[t.equip];
            },
            setSelectItem: function (t) {
              this.selectItem = t;
            },
            getDescriptionName: function (t) {
              var e = {
                eff: this.$t('S_EFF_DESCRIPTION'),
                uBadge: this.$t('S_BADGE_DESCRIPTION'),
                uFrame: this.$t('S_FRAME_DESCRIPTION'),
                background: this.$t('S_BG_DESCRIPTION'),
              };
              return e[t];
            },
            setStyle: function () {
              var t = this,
                e = this.user,
                a = this.selectItem,
                n = {
                  role: e.identity_id,
                  action_id: e.lott_id,
                  prop_id: a.id,
                };
              this.actionSetStyle(n).then(function (e) {
                '0' === e.error_code &&
                  setTimeout(function () {
                    t.getSelection();
                  }, 100);
              });
            },
            deleteStyle: function () {
              var t = this,
                e = this.user,
                a = this.selectItem,
                n = {
                  role: e.identity_id,
                  action_id: e.lott_id,
                  prop_id: a.id,
                };
              this.actionDeleteMyStyle(n).then(function (e) {
                '0' === e.error_code &&
                  setTimeout(function () {
                    t.getSelection();
                  }, 100);
              });
            },
            getSelection: function () {
              var t = this,
                e = this.activeStyleList.find(function (e) {
                  return e.id === t.selectItem.id;
                });
              this.selectItem = e;
            },
            getStyleName: function (t) {
              return t.replace('/n', '<br>');
            },
            showSVGADemo: function () {
              var t = this;
              'eff' === this.activeName &&
                ((this.showDemoStyle = !0),
                this.$nextTick(function () {
                  t.initMachineSVGA(t.selectItem.link);
                }));
            },
            stopSVGADemo: function () {
              (this.showDemoStyle = !1), this.player.stopAnimation();
            },
            initMachineSVGA: function (t) {
              var e = this;
              this.parser.load(t, function (t) {
                e.player.setVideoItem(t),
                  e.player.startAnimation(),
                  e.player.onFinished(function () {
                    e.player.stopAnimation();
                  });
              });
            },
          }
        ),
      },
      po = fo,
      go = (a('3e23'), Object(z['a'])(po, _o, ho, !1, null, '70de912e', null)),
      So = go.exports,
      vo = a('0d39'),
      bo = a('c56b'),
      Co = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          [
            a('MainHeader', {
              attrs: {
                title:
                  t.$t('S_MY_FAVORITE') + '(' + t.resultList.length + '/25)',
              },
            }),
            a(
              'div',
              { staticClass: 'page-wrap' },
              [
                t._l(t.resultList, function (e) {
                  return a(
                    'div',
                    {
                      directives: [
                        {
                          name: 'touch',
                          rawName: 'v-touch:swipe',
                          value: t.swipeHandler(e.streamer_id),
                          expression: 'swipeHandler(user.streamer_id)',
                          arg: 'swipe',
                        },
                      ],
                      key: e.streamer_id,
                      staticClass: 'user-info-wrap',
                    },
                    [
                      a(
                        'div',
                        { staticClass: 'user-info' },
                        [
                          a('div', { staticClass: 'user-field' }, [
                            a(
                              'div',
                              {
                                staticClass: 'user',
                                on: {
                                  click: function (a) {
                                    return t.checkCard(e.streamer_id);
                                  },
                                },
                              },
                              [
                                a('Avatar', {
                                  attrs: {
                                    'frame-path': e.frame,
                                    'headphoto-path': e.head_photo,
                                  },
                                }),
                                a('div', { staticClass: 'name' }, [
                                  t._v(t._s(e.alias)),
                                ]),
                              ],
                              1
                            ),
                            e.stream_status
                              ? a('div', { staticClass: 'on-stream' }, [
                                  a('div', [t._v(t._s(t.$t('S_ON_STREAM')))]),
                                ])
                              : t._e(),
                          ]),
                          a('transition', { attrs: { name: 'slide-left' } }, [
                            t.openField.includes(e.streamer_id)
                              ? a(
                                  'div',
                                  {
                                    staticClass: 'open-field',
                                    on: {
                                      click: function (a) {
                                        return t.cancelFavorite(e.streamer_id);
                                      },
                                    },
                                  },
                                  [
                                    a('span', [
                                      t._v(t._s(t.$t('S_CANCEL_FAVORITE'))),
                                    ]),
                                  ]
                                )
                              : t._e(),
                          ]),
                        ],
                        1
                      ),
                    ]
                  );
                }),
                t.resultList.length
                  ? t._e()
                  : a('NoDataWrap', {
                      attrs: {
                        src: '/images/common/no_data/img_fans_no_data.svg',
                      },
                    }),
              ],
              2
            ),
            a(
              'transition',
              { attrs: { name: 'slide-page-left' } },
              [
                t.targetId
                  ? a('DynamicPage', {
                      attrs: {
                        'target-id': t.targetId,
                        'show-page': t.showPage,
                        'is-streamer-card': t.isStreamerCard,
                      },
                      on: {
                        'update:targetId': function (e) {
                          t.targetId = e;
                        },
                        'update:target-id': function (e) {
                          t.targetId = e;
                        },
                        'update:showPage': function (e) {
                          t.showPage = e;
                        },
                        'update:show-page': function (e) {
                          t.showPage = e;
                        },
                        'update:isStreamerCard': function (e) {
                          t.isStreamerCard = e;
                        },
                        'update:is-streamer-card': function (e) {
                          t.isStreamerCard = e;
                        },
                      },
                    })
                  : t._e(),
              ],
              1
            ),
          ],
          1
        );
      },
      Oo = [],
      To = {
        components: {
          MainHeader: we['a'],
          Avatar: Ba['a'],
          DynamicPage: ca['default'],
          NoDataWrap: pt['a'],
        },
        data: function () {
          return {
            resultList: [],
            openField: [],
            targetId: null,
            showPage: null,
            isStreamerCard: !1,
          };
        },
        created: function () {
          this.initData();
        },
        methods: Object(V['a'])(
          Object(V['a'])({}, Object(r['b'])(['actionSetHintInfo'])),
          {},
          {
            initData: function () {
              var t = this;
              Object($e['j'])().then(function (e) {
                var a = e.data;
                '0' === a.error_code && (t.resultList = a.result || []);
              });
            },
            swipeHandler: function (t) {
              var e = this;
              return function (a) {
                switch (a) {
                  case 'left':
                    (e.openField = []), e.openField.push(t);
                    break;
                  case 'right':
                    e.openField = e.openField.filter(function (e) {
                      return e !== t;
                    });
                    break;
                  default:
                    break;
                }
              };
            },
            cancelFavorite: function (t) {
              var e = this;
              Object($e['c'])(t).then(function (t) {
                var a = t.data;
                '0' === a.error_code &&
                  (e.actionSetHintInfo(e.$t('S_CANCEL_FAVORITE_OK')),
                  e.initData());
              });
            },
            checkCard: function (t) {
              (this.targetId = t),
                (this.showPage = 'card'),
                (this.isStreamerCard = !0);
            },
          }
        ),
      },
      Eo = To,
      Io = (a('c9a6'), Object(z['a'])(Eo, Co, Oo, !1, null, '34cf4cd0', null)),
      Ao = Io.exports,
      yo = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          [
            a('MainHeader', { attrs: { title: t.$t('S_MY_GUARD') } }),
            a(
              'div',
              { staticClass: 'page-wrap' },
              [
                a('div', { staticClass: 'top-fieid' }, [
                  a('div', [t._v(t._s(t.$t('S_MY_GUARD_STREAMER')))]),
                  a(
                    'div',
                    { staticClass: 'go-guard', on: { click: t.toGuard } },
                    [t._v(' ' + t._s(t.$t('S_TO_GUARD_STREAMER') + ' >') + ' ')]
                  ),
                ]),
                t._l(t.userList, function (e) {
                  return a(
                    'div',
                    {
                      key: e.streamer_id,
                      class: ['user-info-wrap', { 'is-end-guard': !e.active }],
                    },
                    [
                      a(
                        'div',
                        {
                          staticClass: 'user-info',
                          on: {
                            click: function (a) {
                              return t.checkCard(e.streamer_id);
                            },
                          },
                        },
                        [
                          a(
                            'div',
                            { staticClass: 'user-field' },
                            [
                              a('Avatar', {
                                attrs: {
                                  'frame-path': e.frame,
                                  'headphoto-path': e.head_photo,
                                },
                              }),
                              a('div', { staticClass: 'name' }, [
                                t._v(t._s(e.alias)),
                              ]),
                            ],
                            1
                          ),
                          a('div', { staticClass: 'status-field' }, [
                            a('div', { staticClass: 'end-date' }, [
                              t._v(
                                ' ' + t._s(t.guardEndTime(e.end_time)) + ' '
                              ),
                            ]),
                            a(
                              'div',
                              {
                                staticClass: 'on-stream-wrap',
                                on: {
                                  click: function (a) {
                                    return (
                                      a.stopPropagation(),
                                      t.toStreamRoom(e.stream_id)
                                    );
                                  },
                                },
                              },
                              [
                                e.stream_status
                                  ? a('div', { staticClass: 'on-stream' }, [
                                      a('div', [
                                        t._v(t._s(t.$t('S_ON_STREAM'))),
                                      ]),
                                    ])
                                  : t._e(),
                              ]
                            ),
                          ]),
                        ]
                      ),
                    ]
                  );
                }),
                t.userList.length
                  ? t._e()
                  : a('NoDataWrap', {
                      staticClass: 'no-guard',
                      attrs: {
                        src: '/images/common/no_data/img_guardian_no_data.svg',
                      },
                    }),
              ],
              2
            ),
            a(
              'transition',
              { attrs: { name: 'slide-page-left' } },
              [
                t.targetId
                  ? a('DynamicPage', {
                      attrs: {
                        'target-id': t.targetId,
                        'show-page': t.showPage,
                        'is-streamer-card': t.isStreamerCard,
                      },
                      on: {
                        'update:targetId': function (e) {
                          t.targetId = e;
                        },
                        'update:target-id': function (e) {
                          t.targetId = e;
                        },
                        'update:showPage': function (e) {
                          t.showPage = e;
                        },
                        'update:show-page': function (e) {
                          t.showPage = e;
                        },
                        'update:isStreamerCard': function (e) {
                          t.isStreamerCard = e;
                        },
                        'update:is-streamer-card': function (e) {
                          t.isStreamerCard = e;
                        },
                      },
                    })
                  : t._e(),
              ],
              1
            ),
          ],
          1
        );
      },
      wo = [],
      Ro = {
        components: {
          MainHeader: we['a'],
          Avatar: Ba['a'],
          DynamicPage: ca['default'],
          NoDataWrap: pt['a'],
        },
        data: function () {
          return {
            userList: [],
            targetId: null,
            showPage: null,
            isStreamerCard: !1,
          };
        },
        created: function () {
          this.initData();
        },
        methods: {
          toStreamRoom: at['d'],
          initData: function () {
            var t = this;
            Object($e['k'])().then(function (e) {
              var a = e.data;
              '0' === a.error_code && (t.userList = a.result);
            });
          },
          guardEndTime: function (t) {
            return t
              ? ''.concat(Object(Ue['a'])(t, 'MM-dd'), '到期')
              : '已過期';
          },
          checkCard: function (t) {
            (this.targetId = t),
              (this.showPage = 'card'),
              (this.isStreamerCard = !0);
          },
          toGuard: function () {
            Object(at['c'])('streamHome');
          },
        },
      },
      Lo = Ro,
      No = (a('2bcb'), Object(z['a'])(Lo, yo, wo, !1, null, '1734c5bc', null)),
      ko = No.exports,
      Po = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { staticClass: 'contribute-wrap' },
          [
            a('MainHeader', { attrs: { title: t.$t('S_MY_CONTRIBUTE') } }),
            a(
              'el-tabs',
              {
                staticClass: 'nav-item-wrap',
                attrs: { stretch: '' },
                model: {
                  value: t.activeNav,
                  callback: function (e) {
                    t.activeNav = e;
                  },
                  expression: 'activeNav',
                },
              },
              t._l(t.navItems, function (e) {
                return a('el-tab-pane', {
                  key: e.name,
                  attrs: { label: t.$t(e.label), name: e.name },
                });
              }),
              1
            ),
            a(
              'div',
              { staticClass: 'content-wrap' },
              [
                t._l(t.contributeData, function (e) {
                  return a(
                    'div',
                    {
                      key: e.id,
                      staticClass: 'user-info-wrap',
                      on: {
                        click: function (a) {
                          return t.checkCard(e.id);
                        },
                      },
                    },
                    [
                      a('div', { staticClass: 'user-info' }, [
                        a(
                          'div',
                          { staticClass: 'user-field' },
                          [
                            a('Avatar', {
                              attrs: {
                                'frame-path': e.frame,
                                'headphoto-path': e.head_photo,
                              },
                            }),
                            a('div', { staticClass: 'name' }, [
                              t._v(t._s(e.alias)),
                            ]),
                          ],
                          1
                        ),
                        a('div', { staticClass: 'diamond-amount' }, [
                          a('div', [t._v(t._s(e.diamond))]),
                          a('img', {
                            attrs: {
                              src: t.$getCdnPath(
                                '/images/mainSite/common/ic_diamond.svg'
                              ),
                            },
                          }),
                        ]),
                      ]),
                    ]
                  );
                }),
                t.contributeData.length
                  ? t._e()
                  : a('NoDataWrap', {
                      attrs: {
                        src: '/images/mainSite/common/rank_no_data.svg',
                      },
                    }),
              ],
              2
            ),
            a(
              'transition',
              { attrs: { name: 'slide-page-left' } },
              [
                t.targetId
                  ? a('DynamicPage', {
                      attrs: {
                        'target-id': t.targetId,
                        'show-page': t.showPage,
                        'is-streamer-card': t.isStreamerCard,
                      },
                      on: {
                        'update:targetId': function (e) {
                          t.targetId = e;
                        },
                        'update:target-id': function (e) {
                          t.targetId = e;
                        },
                        'update:showPage': function (e) {
                          t.showPage = e;
                        },
                        'update:show-page': function (e) {
                          t.showPage = e;
                        },
                        'update:isStreamerCard': function (e) {
                          t.isStreamerCard = e;
                        },
                        'update:is-streamer-card': function (e) {
                          t.isStreamerCard = e;
                        },
                      },
                    })
                  : t._e(),
              ],
              1
            ),
          ],
          1
        );
      },
      Mo = [],
      Do = {
        components: {
          MainHeader: we['a'],
          NoDataWrap: pt['a'],
          Avatar: Ba['a'],
          DynamicPage: ca['default'],
        },
        data: function () {
          return {
            navItems: [
              { name: 'day', label: 'S_DAILY_LIST' },
              { name: 'week', label: 'S_WEEKLY_LIST' },
              { name: 'month', label: 'S_MONTHLY_LIST' },
              { name: 'total', label: 'S_TOTAL_LIST' },
            ],
            activeNav: 'day',
            contributeData: [],
            targetId: null,
            showPage: null,
            isStreamerCard: !1,
          };
        },
        watch: {
          activeNav: function (t, e) {
            t && t !== e && this.getContributeData();
          },
        },
        created: function () {
          this.getContributeData();
        },
        methods: {
          getContributeData: function () {
            var t = this,
              e = { type: this.activeNav };
            Object($e['i'])(e).then(function (e) {
              var a = e.data;
              '0' === a.error_code && (t.contributeData = a.result);
            });
          },
          checkCard: function (t) {
            (this.targetId = t),
              (this.showPage = 'card'),
              (this.isStreamerCard = !0);
          },
        },
      },
      jo = Do,
      Go = (a('f001'), Object(z['a'])(jo, Po, Mo, !1, null, '01937513', null)),
      $o = Go.exports,
      Uo = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          [
            a('MainHeader', { attrs: { title: t.$t('S_MY_SENDED_PAO') } }),
            a(
              'div',
              { staticClass: 'page-wrap' },
              [
                t._l(t.userList, function (e) {
                  return a(
                    'div',
                    { key: e.streamer_id, staticClass: 'user-info-wrap' },
                    [
                      a(
                        'div',
                        {
                          staticClass: 'user-info',
                          on: {
                            click: function (a) {
                              return t.checkCard(e.streamer_id);
                            },
                          },
                        },
                        [
                          a(
                            'div',
                            { staticClass: 'user-field' },
                            [
                              a('Avatar', {
                                attrs: {
                                  'frame-path': e.frame,
                                  'headphoto-path': e.head_photo,
                                },
                              }),
                              a('div', { staticClass: 'name' }, [
                                t._v(t._s(e.alias)),
                              ]),
                            ],
                            1
                          ),
                          a('div', { staticClass: 'status-field' }, [
                            a('div', { staticClass: 'amount' }, [
                              t._v(
                                ' ' + t._s(t._f('amountFormat')(e.amount)) + ' '
                              ),
                            ]),
                            a('img', {
                              attrs: {
                                src: t.$getCdnPath(
                                  '/images/common/ic_bubble.svg'
                                ),
                              },
                            }),
                          ]),
                        ]
                      ),
                    ]
                  );
                }),
                t.userList.length
                  ? t._e()
                  : a('NoDataWrap', {
                      attrs: {
                        src: '/images/mainSite/common/rank_no_data.svg',
                      },
                    }),
              ],
              2
            ),
            a(
              'transition',
              { attrs: { name: 'slide-page-left' } },
              [
                t.targetId
                  ? a('DynamicPage', {
                      attrs: {
                        'target-id': t.targetId,
                        'show-page': t.showPage,
                        'is-streamer-card': t.isStreamerCard,
                      },
                      on: {
                        'update:targetId': function (e) {
                          t.targetId = e;
                        },
                        'update:target-id': function (e) {
                          t.targetId = e;
                        },
                        'update:showPage': function (e) {
                          t.showPage = e;
                        },
                        'update:show-page': function (e) {
                          t.showPage = e;
                        },
                        'update:isStreamerCard': function (e) {
                          t.isStreamerCard = e;
                        },
                        'update:is-streamer-card': function (e) {
                          t.isStreamerCard = e;
                        },
                      },
                    })
                  : t._e(),
              ],
              1
            ),
          ],
          1
        );
      },
      xo = [],
      Fo = {
        components: {
          MainHeader: we['a'],
          Avatar: Ba['a'],
          NoDataWrap: pt['a'],
          DynamicPage: ca['default'],
        },
        data: function () {
          return {
            userList: [],
            targetId: null,
            showPage: null,
            isStreamerCard: !1,
          };
        },
        created: function () {
          this.initData();
        },
        methods: {
          initData: function () {
            var t = this;
            Object($e['m'])().then(function (e) {
              var a = e.data;
              '0' === a.error_code && (t.userList = a.result);
            });
          },
          checkCard: function (t) {
            (this.targetId = t),
              (this.showPage = 'card'),
              (this.isStreamerCard = !0);
          },
        },
      },
      Ho = Fo,
      Bo = (a('4285'), Object(z['a'])(Ho, Uo, xo, !1, null, '508b0b0a', null)),
      Wo = Bo.exports,
      Vo = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', { staticClass: 'container' }, [
          a('div', { staticClass: 'logo' }),
          a('div', { staticClass: 'bottom' }, [
            a('p', { staticClass: 'topic' }, [t._v(t._s(t.$t('S_403_TITLE')))]),
            a('div', { staticClass: 'img-403' }),
            a('div', { staticClass: 'content' }, [
              t._v(' ' + t._s(t.$t('S_403MSG_FIRST')) + ' '),
              a('div', { staticClass: 'inner-content' }, [
                a('p', [
                  t._v(
                    'paopao ' +
                      t._s(t.$t('S_CUS_SERVICE_MAIL')) +
                      ' cs@paocs.co'
                  ),
                ]),
                a('p', [
                  t._v(
                    'paopao ' + t._s(t.$t('S_STREAMER_MAIL')) + ' cs2@paocs.co'
                  ),
                ]),
              ]),
              t._v(' ' + t._s(t.$t('S_403MSG_SECOND')) + ' '),
            ]),
          ]),
          a('div', { staticClass: 'footer' }, [
            t._v(' ' + t._s(t.$t('S_NEED_HELP'))),
            a(
              'a',
              {
                on: {
                  click: function (t) {
                    t.preventDefault();
                  },
                },
              },
              [t._v(t._s(t.$t('S_CONTACT_SERVICE')))]
            ),
          ]),
        ]);
      },
      Yo = [],
      Ko = {},
      Xo = Ko,
      qo = (a('8741'), Object(z['a'])(Xo, Vo, Yo, !1, null, '5937c7d5', null)),
      zo = qo.exports,
      Qo = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', { staticClass: 'container' }, [
          a('div', { staticClass: 'logo' }),
          a('p', { staticClass: 'topic' }, [t._v(t._s(t.$t('S_404_TITLE')))]),
          a('div', { staticClass: 'img-404' }),
          a('div', { staticClass: 'content' }, [
            t._v(' ' + t._s(t.$t('S_404MSG')) + ' '),
          ]),
          a('div', { staticClass: 'footer' }, [
            t._v(' ' + t._s(t.$t('S_NEED_HELP'))),
            a(
              'a',
              {
                on: {
                  click: function (t) {
                    t.preventDefault();
                  },
                },
              },
              [t._v(t._s(t.$t('S_CONTACT_SERVICE')))]
            ),
          ]),
        ]);
      },
      Jo = [],
      Zo = {},
      tc = Zo,
      ec = (a('293f'), Object(z['a'])(tc, Qo, Jo, !1, null, 'e5ec6f98', null)),
      ac = ec.exports,
      nc = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return t.isShow
          ? a('div', { staticClass: 'upgrade-wrap' }, [
              a('div', { staticClass: 'content' }, [
                a('div', { staticClass: 'title' }, [
                  t._v(' ' + t._s(t.$t('S_STREAM_UPGRADE')) + ' '),
                ]),
                t.isGCPUpgrade
                  ? t._e()
                  : a('div', { staticClass: 'time-wrap' }, [
                      a('div', [
                        a('div', { staticClass: 'time-title' }, [
                          t._v('-' + t._s(t.$t('S_USA_TIME')) + '-'),
                        ]),
                        a('div', { staticClass: 'time-item' }, [
                          a('div', [t._v(t._s(t.dateTime.en.start))]),
                          a('img', {
                            attrs: {
                              src: t.$getCdnPath(
                                '/images/feature/ic_transfergo_w@2x.png'
                              ),
                            },
                          }),
                          a('div', [t._v(t._s(t.dateTime.en.end))]),
                        ]),
                      ]),
                      a('div', [
                        a('div', { staticClass: 'time-title' }, [
                          t._v('-' + t._s(t.$t('S_CN_TIME')) + '-'),
                        ]),
                        a('div', { staticClass: 'time-item' }, [
                          a('div', [t._v(t._s(t.dateTime.cn.start))]),
                          a('img', {
                            attrs: {
                              src: t.$getCdnPath(
                                '/images/feature/ic_transfergo_w@2x.png'
                              ),
                            },
                          }),
                          a('div', [t._v(t._s(t.dateTime.cn.end))]),
                        ]),
                      ]),
                    ]),
                a(
                  'div',
                  {
                    staticClass: 'to-game-center-btn',
                    on: {
                      click: function (e) {
                        return t.leaveRoomAndToPage('gameCenter');
                      },
                    },
                  },
                  [
                    t._v(' ' + t._s(t.$t('S_TO_GAME_CENTER')) + ' '),
                    a('span', { staticClass: 'game-time' }, [
                      t._v(t._s(t.time)),
                    ]),
                  ]
                ),
              ]),
            ])
          : t._e();
      },
      ic = [],
      sc = {
        data: function () {
          return {
            isShow: !1,
            time: 5,
            timeInteraval: null,
            dateTime: {
              cn: { start: null, end: null },
              en: { start: null, end: null },
            },
          };
        },
        computed: {
          isGCPUpgrade: function () {
            return 'Y' === this.$route.query.isGCP;
          },
        },
        created: function () {
          var t = this;
          Object(K['g'])({ site: 3 }).then(function (e) {
            var a,
              n = e.data;
            t.isGCPUpgrade ||
            ('0' !== n.error_code &&
              0 !==
                (null === (a = n.maintain) || void 0 === a ? void 0 : a.state))
              ? t.setData(n.maintain)
              : t.$router.push('/');
          });
        },
        beforeDestroy: function () {
          clearInterval(this.timeInteraval);
        },
        methods: {
          leaveRoomAndToPage: at['b'],
          getTimebyTimeZone: Ue['a'],
          init: function () {
            var t = this;
            this.timeInteraval = setInterval(function () {
              if (0 === t.time)
                return (
                  clearInterval(t.timeInteraval),
                  void t.leaveRoomAndToPage('gameCenter')
                );
              t.time -= 1;
            }, 1e3);
          },
          setData: function (t) {
            if (this.isGCPUpgrade) return (this.isShow = !0), void this.init();
            var e = t.start,
              a = t.end;
            (e *= 1e3),
              (a *= 1e3),
              (this.dateTime.cn.start = Object(Ue['a'])(e)),
              (this.dateTime.cn.end = Object(Ue['a'])(a)),
              (this.dateTime.en.start = Object(Ue['a'])(
                e,
                'yyyy-MM-dd HH:mm:ss',
                -4
              )),
              (this.dateTime.en.end = Object(Ue['a'])(
                a,
                'yyyy-MM-dd HH:mm:ss',
                -4
              )),
              (this.isShow = !0),
              this.init();
          },
        },
      },
      rc = sc,
      oc = (a('7347'), Object(z['a'])(rc, nc, ic, !1, null, 'ffd82e9a', null)),
      cc = oc.exports;
    s['default'].use(F['a']);
    var uc = [
        {
          path: '/',
          component: H['default'],
          children: [
            { path: '/', name: 'home', component: qt },
            { path: '/leaderboard', name: 'leaderboard', component: Jr },
            {
              path: '/memInfo/:page/:type/:id?',
              name: 'memInfo',
              component: ma,
            },
            { path: '/chatroom/:roomId', name: 'chatroom', component: $r },
            {
              path: '/player/:roomId',
              name: 'player',
              props: !0,
              component: yi,
            },
            { path: 'mainHome', name: 'main-home', component: io },
            { path: 'main/myStyle', name: 'MyStyle', component: So },
            { path: 'main/myProps', name: 'MyProps', component: vo['a'] },
            { path: 'main/mall/:type?', name: 'Mall', component: sa },
            { path: 'main/myTrack', name: 'myTrack', component: bo['a'] },
            { path: 'main/myFavorite', name: 'myFavorite', component: Ao },
            { path: 'main/myVip', name: 'myVip', component: so['a'] },
            { path: 'main/myGuard', name: 'myGuard', component: ko },
            { path: 'main/myContribute', name: 'myContribute', component: $o },
            { path: 'main/mySentPaopao', name: 'mySentPaopao', component: Wo },
            {
              path: 'main/exchange-Diamond',
              name: 'exchangeDiamond',
              component: mo,
            },
            { path: 'main/taskWall', name: 'taskWall', component: Ze },
            { path: 'main/dailyTask', name: 'dailyTask', component: qe },
            {
              path: 'main/firstMeetTask',
              name: 'firstMeetTask',
              component: Me,
            },
          ],
        },
        { path: '/ppin', name: 'ppin', meta: { noAuth: !0 }, component: J },
        { path: '/403', name: '403', meta: { noAuth: !0 }, component: zo },
        {
          path: '/upgrade',
          name: 'upgrade',
          meta: { noAuth: !0 },
          component: cc,
        },
        {
          path: '/guardianInfo',
          name: 'guardianInfo',
          meta: { noAuth: !0 },
          component: Qi,
        },
        { path: '*', name: '404', meta: { noAuth: !0 }, component: ac },
      ],
      lc = new F['a']({ mode: 'history', routes: uc }),
      dc = lc,
      mc = function () {
        var t,
          e = this,
          a = e.$createElement,
          n = e._self._c || a;
        return e.initialized || e.appShow
          ? n(
              'div',
              {
                class: [
                  e.$style.wrap,
                  ((t = {}), (t[e.$style['is-model']] = e.isModel), t),
                ],
              },
              [
                n(
                  'div',
                  {
                    directives: [
                      {
                        name: 'show',
                        rawName: 'v-show',
                        value: e.isHorizontal,
                        expression: 'isHorizontal',
                      },
                    ],
                    class: e.$style['horizontal-mask'],
                  },
                  [
                    n('div', { class: e.$style['hint'] }, [
                      n('div', { class: e.$style['phone-img'] }),
                      n('span', [e._v(e._s(e.$t('S_SWITCH_TO_POTRAIT')))]),
                    ]),
                  ]
                ),
                n('router-view', { class: e.$style['router-view'] }),
                e.hintInfo ? n('Hint') : e._e(),
                e.tipMsgInfo
                  ? n('TipMsg', {
                      class: e.$style['tip-msg'],
                      attrs: {
                        title: e.tipMsgInfo.title,
                        content: e.tipMsgInfo.content,
                        'cancel-text': e.tipMsgInfo.cancelText,
                        'confirm-text': e.tipMsgInfo.confirmText,
                      },
                      on: {
                        cancelFunc: e.tipMsgInfo.cancelFunc,
                        confirmFunc: e.tipMsgInfo.confirmFunc,
                      },
                    })
                  : e._e(),
              ],
              1
            )
          : e._e();
      },
      _c = [],
      hc =
        (a('3ca3'),
        a('ddb0'),
        a('2b3d'),
        a('9861'),
        function (t, e) {
          var a = t.replace(/[[]/, '\\[').replace(/[\]]/, '\\]'),
            n = new RegExp('[\\?&]'.concat(a, '=([^&#]*)')),
            i = n.exec(e);
          return null === i ? '' : decodeURIComponent(i[1].replace(/\+/g, ' '));
        }),
      fc = {
        computed: Object(V['a'])(
          Object(V['a'])({}, Object(r['d'])('chatroom', ['chargeRoomState'])),
          Object(r['c'])('game', { gameName: 'getGameName' })
        ),
        created: function () {
          window.addEventListener('message', this.handleEvent, !1);
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            Object(V['a'])(
              {},
              Object(r['b'])(['actionSetHintInfo', 'actionSetTipMsgInfo'])
            ),
            Object(r['b'])('game', [
              'actionSwitchGame',
              'actionSetGameUrls',
              'actionSetGameToken',
              'actionSetTokenInterval',
              'actionSetTrialOption',
            ])
          ),
          {},
          {
            handleEvent: function (t) {
              var e = t.data;
              switch ((console.log('----', e), e.event)) {
                case 'EVENT_GAME_URI':
                  this.setGameToken(e.data);
                  break;
                case 'EVENT_TOKEN_FAIL':
                  this.actionSetTokenInterval('clear'),
                    this.actionSetGameToken(null),
                    this.exitGame();
                  break;
                case 'EVENT_MAINTAIN':
                  this.gameMaintain();
                  break;
                case 'EVENT_EXIT':
                  this.exitGame();
                  break;
                case 'EVENT_ADD_VALUE':
                case 'EVENT_BIND_BANK':
                case 'EVENT_WITHDRAWAL_INFORMATION':
                  this.liveGameLeavePage(e.event);
                  break;
                case 'EVENT_GAME_CENTER':
                  Object(at['b'])('gameCenter');
                  break;
                default:
                  break;
              }
            },
            setGameToken: function (t) {
              if ((console.log('---getGameUrl--', t), 'ok' === t.result)) {
                var e = hc('session-key', t.ret.url),
                  a = Object(qn['a'])(
                    {},
                    this.gameName,
                    new URL(t.ret.url).origin
                  ),
                  n = hc('trial', t.ret.url);
                this.actionSetGameToken(e),
                  this.actionSetGameUrls(a),
                  this.actionSetTrialOption(n);
              }
              'error' === t.result &&
                (this.actionSetHintInfo(this.$t('S_UPGRADEMSG')),
                this.exitGame());
            },
            gameMaintain: function () {
              this.actionSetHintInfo(this.$t('S_UPGRADEMSG')), this.exitGame();
            },
            exitGame: function () {
              this.actionSwitchGame(!1);
            },
            liveGameLeavePage: function (t) {
              var e = this;
              0 !== this.chargeRoomState
                ? this.actionSetTipMsgInfo({
                    title: this.$t('S_HINT'),
                    content: this.$t('S_LEAVE_ROOM_TIP'),
                    cancelFunc: function () {
                      return e.actionSetTipMsgInfo(null);
                    },
                    confirmFunc: function () {
                      e.actionSetTipMsgInfo(null),
                        at['a'].jsToAppMessage({ event: t });
                    },
                  })
                : at['a'].jsToAppMessage({ event: t });
            },
          }
        ),
        beforeDestroy: function () {
          window.removeEventListener('message', this.handleEvent, !1);
        },
      },
      pc = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', { class: t.$style['hint-wrap'] }, [
          a('div', {
            class: t.$style.hint,
            domProps: { innerHTML: t._s(t.hintInfo) },
          }),
        ]);
      },
      gc = [],
      Sc = {
        computed: Object(V['a'])(
          {},
          Object(r['c'])({ hintInfo: 'getHintInfo' })
        ),
        created: function () {
          var t = this;
          setTimeout(function () {
            t.actionSetHintInfo(null);
          }, 3e3);
        },
        methods: Object(V['a'])({}, Object(r['b'])(['actionSetHintInfo'])),
      },
      vc = Sc,
      bc = a('2442');
    function Cc(t) {
      this['$style'] = bc['default'].locals || bc['default'];
    }
    var Oc = Object(z['a'])(vc, pc, gc, !1, Cc, null, null),
      Tc = Oc.exports,
      Ec = {
        components: { Hint: Tc, TipMsg: Ve },
        mixins: [fc],
        data: function () {
          var t = 90 === window.orientation || -90 === window.orientation;
          return { appShow: !1, isHorizontal: t, deviceCode: null };
        },
        computed: Object(V['a'])(
          Object(V['a'])(
            {},
            Object(r['c'])({
              hintInfo: 'getHintInfo',
              tipMsgInfo: 'getTipMsgInfo',
              user: 'getUserInfo',
              initialized: 'getInitialized',
            })
          ),
          {},
          {
            isModel: function () {
              return (
                ['/main/taskWall', '/guardianInfo'].includes(
                  this.$route.path
                ) && 'Y' === this.$route.query.model
              );
            },
          }
        ),
        created: function () {
          var t,
            e = Object(gt['c'])(),
            a = e.type,
            n = e.version;
          if (
            ((this.$vigoPlayer.volume = 'chatroom' !== this.$route.name),
            'Safari' === a &&
              +(
                (null === n ||
                void 0 === n ||
                null === (t = n.split('.')) ||
                void 0 === t
                  ? void 0
                  : t[0]) || 0
              ) < 13 &&
              (this.$vigoPlayer.volume = !1),
            this.isModel && (document.body.style.background = 'transparent'),
            window.addEventListener('resize', this.handleOrientationChange),
            this.$route.meta.noAuth)
          )
            this.appShow = !0;
          else {
            var i = hc('isLaunch', window.location.href) || !1;
            this.actionSetIsLaunch(i), this.checkUserInfo();
          }
        },
        mounted: function () {
          Object(gt['f'])();
        },
        beforeDestroy: function () {
          window.removeEventListener('resize', this.handleOrientationChange);
        },
        methods: Object(V['a'])(
          Object(V['a'])(
            {},
            Object(r['b'])([
              'actionSetUser',
              'actionSetHintInfo',
              'actionSetTipMsgInfo',
              'actionWebInfo',
              'actionFetchUser',
              'actionSetIsLaunch',
            ])
          ),
          {},
          {
            handleOrientationChange: function () {
              var t = window.innerWidth,
                e = window.innerHeight;
              this.isHorizontal = t > e;
            },
            checkUserInfo: function () {
              var t = hc('jwt_token', window.location.href),
                e = hc('gcid', window.location.href) || null;
              if (((this.deviceCode = e), !t))
                return (
                  this.user || this.actionSetUser(Object(Y['a'])('lottUser')),
                  '/ppin' === window.location.pathname ||
                    Object(Y['a'])('lottUser') ||
                    this.$router.push('/403'),
                  void (this.appShow = !0)
                );
              t
                ? this.checkToken(t)
                : (this.$router.push('/403'), (this.appShow = !0));
            },
            checkToken: function (t) {
              var e = this;
              Object(K['l'])({
                jwt_token: t,
                session: Object(Y['a'])('session'),
              }).then(function (a) {
                var n = a.data;
                if ('0' !== n.error_code && n.error_text)
                  at['a'].jsToAppMessage({
                    event: 'EVENT_THIRDPARTY_LOGIN',
                    data: n,
                  });
                else {
                  var i = Object(fa['a'])(new Date()),
                    s = {
                      token: t,
                      deviceCode: e.deviceCode || 'pwa@paopao@'.concat(i),
                    };
                  if (!n.result.re_login)
                    return e.user
                      ? void (e.appShow = !0)
                      : void e.actionFetchUser(s);
                  e.jwtLogin(s);
                }
              });
            },
            jwtLogin: function (t) {
              var e = this;
              Object(K['m'])(t).then(function (t) {
                var a = t.data;
                if ('0' !== a.error_code && a.error_text)
                  return (
                    e.actionSetHintInfo(a.error_text),
                    Object(Y['b'])('session'),
                    void at['a'].jsToAppMessage({
                      event: 'EVENT_THIRDPARTY_LOGIN',
                      data: a,
                    })
                  );
                Object(Y['c'])('session', a.result.session),
                  Object(Y['c'])('lottUser', a.result),
                  e.actionSetUser(a.result),
                  (e.appShow = !0);
              });
            },
          }
        ),
      },
      Ic = Ec,
      Ac = (a('5c0b'), a('0875'));
    function yc(t) {
      this['$style'] = Ac['default'].locals || Ac['default'];
    }
    var wc = Object(z['a'])(Ic, mc, _c, !1, yc, null, null),
      Rc = wc.exports,
      Lc = a('ecee'),
      Nc = a('e3e1'),
      kc = a('3818'),
      Pc = a('9ae8'),
      Mc = a('211a'),
      Dc = a('fcad'),
      jc = a('5a21'),
      Gc = a('8b50'),
      $c = a('4c54'),
      Uc = a('0ee4'),
      xc = a('91fb'),
      Fc = a('21f3'),
      Hc = a('ffcd'),
      Bc = a('b6a3'),
      Wc = a('5dae'),
      Vc = a('077c'),
      Yc = a('184c'),
      Kc = a('1adf'),
      Xc = a('eff2'),
      qc = a('0839'),
      zc = a('d7b7');
    Lc['c'].add(
      Nc['faTimes'],
      kc['faSync'],
      Pc['faChevronRight'],
      Mc['faChevronLeft'],
      Dc['faTimesCircle'],
      jc['faQuestionCircle'],
      Gc['faFire'],
      $c['faCircle'],
      Uc['faPlus'],
      xc['faHeart'],
      Fc['faMapMarkerAlt'],
      Hc['faRedo'],
      Bc['faVolumeUp'],
      Wc['faClock'],
      Yc['faGift'],
      Vc['faClock'],
      Kc['faSearch'],
      Xc['faMinus'],
      qc['faPlay'],
      zc['faSpinner']
    );
    a('e9cc'), a('a7a3');
    Object.keys(le).forEach(function (t) {
      s['default'].filter(t, le[t]);
    }),
      s['default'].use(r['a']),
      s['default'].use(c.a, { disableClick: !1 }),
      s['default'].use(l.a),
      s['default'].use(d['a']),
      s['default'].use(p),
      s['default'].use(g),
      s['default'].use(m['a']),
      s['default'].use(U),
      s['default'].use(h),
      s['default'].component('font-awesome-icon', _['a']),
      s['default'].component(i.a),
      (s['default'].prototype.$message = i.a),
      Object(x['b'])(),
      (s['default'].config.productionTip = !1),
      new s['default']({
        router: dc,
        store: f['a'],
        i18n: ot['a'],
        render: function (t) {
          return t(Rc);
        },
      }).$mount('#app');
  },
  5833: function (t, e, a) {
    'use strict';
    a('f8b8');
  },
  5877: function (t, e, a) {
    'use strict';
    a('b1a3');
  },
  '587c': function (t, e, a) {},
  '59a5': function (t, e, a) {
    'use strict';
    a('2ae7');
  },
  '5abd': function (t, e, a) {
    'use strict';
    a('257b');
  },
  '5c0b': function (t, e, a) {
    'use strict';
    a('9c0c');
  },
  '5d41': function (t, e, a) {
    'use strict';
    a('fc13');
  },
  '5d7b': function (t, e, a) {
    'use strict';
    a('e024');
  },
  '5e9a': function (t, e, a) {
    'use strict';
    a('f2f4');
  },
  '5ff5': function (t, e, a) {
    'use strict';
    a('d301');
  },
  '603f': function (t, e, a) {},
  '60cc': function (t, e, a) {
    'use strict';
    a('9b07');
  },
  '61f9': function (t, e, a) {
    t.exports = {
      'hint-wrap': 'hint_hint-wrap_2Ym__',
      hint: 'hint_hint_3cF2Y',
    };
  },
  '624c': function (t, e, a) {
    'use strict';
    a.d(e, 'd', function () {
      return c;
    }),
      a.d(e, 'c', function () {
        return u;
      }),
      a.d(e, 'b', function () {
        return l;
      }),
      a.d(e, 'a', function () {
        return d;
      }),
      a.d(e, 'e', function () {
        return m;
      }),
      a.d(e, 'f', function () {
        return _;
      });
    a('4795');
    var n = a('a3be'),
      i = a('4360'),
      s = a('2471'),
      r = a('3aee'),
      o = a('8f6a'),
      c = function () {
        return Object(o['a'])('get', n['w']);
      },
      u = function () {
        return Object(o['a'])('get', n['l']);
      },
      l = function (t) {
        return Object(o['a'])('post', n['n'], t).then(function (t) {
          if ('116023116' === t.data.error_code)
            throw (
              (i['a'].dispatch(
                'actionSetHintInfo',
                r['a'].t('S_DEPOSIT_ONCE_OPEN_DIAMOND')
              ),
              setTimeout(function () {
                Object(s['c'])('deposit');
              }, 3e3),
              new Error())
            );
          return t;
        });
      },
      d = function (t) {
        return Object(o['a'])('get', n['h'], t);
      },
      m = function () {
        return Object(o['a'])('get', n['J']);
      },
      _ = function (t) {
        return Object(o['a'])('post', n['J'], t);
      };
  },
  6406: function (t, e, a) {},
  6415: function (t, e, a) {},
  '67c2': function (t, e, a) {
    'use strict';
    a('ac76');
  },
  '6a01': function (t, e, a) {},
  '6b5f': function (t, e, a) {},
  '6ef4': function (t, e, a) {},
  '6f71': function (t, e, a) {
    'use strict';
    a('343d');
  },
  '6fbd': function (t, e, a) {},
  '70a9': function (t, e, a) {},
  7150: function (t, e, a) {
    'use strict';
    var n = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', { staticClass: 'avatar-wrap' }, [
          t.framePath
            ? a('img', {
                staticClass: 'head-frame',
                attrs: { src: t.framePath },
              })
            : t._e(),
          a('img', {
            staticClass: 'headphoto',
            attrs: {
              src: t.headphotoPath,
              onerror: t.$getCdnPath(t.getDefaultUserImg),
            },
          }),
        ]);
      },
      i = [],
      s = a('5530'),
      r = a('2f62'),
      o = {
        props: {
          framePath: { type: String, default: '' },
          headphotoPath: { type: String, default: null },
        },
        computed: Object(s['a'])({}, Object(r['c'])(['getDefaultUserImg'])),
      },
      c = o,
      u = (a('9ffa'), a('2877')),
      l = Object(u['a'])(c, n, i, !1, null, '07c86bd5', null);
    e['a'] = l.exports;
  },
  '71c2': function (t, e, a) {
    'use strict';
    var n = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { class: ['header', { 'app-header': t.appUse }] },
          [
            t._t('left-btn', [
              a('div', { staticClass: 'left-btn', on: { click: t.leftBtn } }, [
                a('img', {
                  staticClass: 'arrow-icon',
                  attrs: {
                    src: t.$getCdnPath('/images/common/ic_arrow_l_grey.png'),
                  },
                }),
              ]),
            ]),
            a('div', { staticClass: 'title' }, [
              t._v(' ' + t._s(t.title) + ' '),
            ]),
          ],
          2
        );
      },
      i = [],
      s = a('234c'),
      r = {
        props: {
          title: { type: String, default: '' },
          leftBtnFunc: { type: Function, default: null },
        },
        computed: {
          appUse: function () {
            return Object(s['a'])('appUse');
          },
        },
        methods: {
          leftBtn: function () {
            this.leftBtnFunc ? this.leftBtnFunc() : this.$router.back();
          },
        },
      },
      o = r,
      c = (a('e48f'), a('2877')),
      u = Object(c['a'])(o, n, i, !1, null, '5727bef2', null);
    e['a'] = u.exports;
  },
  7347: function (t, e, a) {
    'use strict';
    a('c0c7');
  },
  '76ee': function (t, e, a) {},
  7829: function (t, e, a) {
    'use strict';
    a('fa8a');
  },
  '7a96': function (t, e, a) {
    'use strict';
    a.r(e);
    var n = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { staticClass: 'dynamic-page' },
          [
            a(
              'transition',
              { attrs: { name: 'slide-left' } },
              [
                ['fans', 'follow', 'guard'].includes(t.showPage)
                  ? a(
                      'ListPage',
                      t._g(
                        {
                          attrs: {
                            'target-id': t.id,
                            'show-page': t.showPage,
                            'is-admin': t.isAdmin,
                            'is-fake-user': t.isFake,
                          },
                          on: {
                            'update:targetId': function (e) {
                              t.id = e;
                            },
                            'update:target-id': function (e) {
                              t.id = e;
                            },
                            'update:isFakeUser': function (e) {
                              t.isFake = e;
                            },
                            'update:is-fake-user': function (e) {
                              t.isFake = e;
                            },
                            isStreamerCard: function (e) {
                              return t.$emit('update:isStreamerCard', e);
                            },
                          },
                        },
                        t.$listeners
                      )
                    )
                  : t._e(),
              ],
              1
            ),
            a(
              'transition',
              { attrs: { name: 'slide-left' } },
              [
                ['contribute'].includes(t.showPage)
                  ? a('Contribute', {
                      attrs: {
                        'target-id': t.id,
                        'is-app': t.isApp,
                        'is-fake-user': t.isFake,
                        'default-tab': t.options.tab,
                      },
                      on: {
                        'update:targetId': function (e) {
                          t.id = e;
                        },
                        'update:target-id': function (e) {
                          t.id = e;
                        },
                        'update:isFakeUser': function (e) {
                          t.isFake = e;
                        },
                        'update:is-fake-user': function (e) {
                          t.isFake = e;
                        },
                        showPage: function (e) {
                          return t.$emit('update:showPage', e);
                        },
                        isStreamerCard: function (e) {
                          return t.$emit('update:isStreamerCard', e);
                        },
                      },
                    })
                  : t._e(),
              ],
              1
            ),
            a(
              'transition',
              { attrs: { name: 'slide-left' } },
              [
                ['card'].includes(t.showPage)
                  ? a('UserInfoCard', {
                      attrs: {
                        'target-id': t.id,
                        'is-streamer-card': t.isStreamerCard,
                        'is-admin': t.isAdmin,
                        'is-fake-user': t.isFake,
                      },
                      on: {
                        'update:targetId': function (e) {
                          t.id = e;
                        },
                        'update:target-id': function (e) {
                          t.id = e;
                        },
                        showPage: function (e) {
                          return t.$emit('update:showPage', e);
                        },
                      },
                    })
                  : t._e(),
              ],
              1
            ),
          ],
          1
        );
      },
      i = [],
      s =
        (a('a9e3'),
        function () {
          var t = this,
            e = t.$createElement,
            a = t._self._c || e;
          return Object.keys(t.userData)
            ? a(
                'div',
                { class: t.$style['card-wrap'] },
                [
                  a('Header', { attrs: { 'left-btn-func': t.closeCard } }),
                  a('div', { class: t.$style.content }, [
                    a('img', {
                      directives: [
                        {
                          name: 'lazy',
                          rawName: 'v-lazy',
                          value: {
                            src: t.userData.background,
                            error: t.errorPath,
                          },
                          expression:
                            '{\n                src: userData.background,\n                error: errorPath\n            }',
                        },
                      ],
                      class: t.$style['bg-img'],
                    }),
                    t.userData
                      ? a(
                          'div',
                          { class: t.$style['avatar-wrap'] },
                          [
                            a('Avatar', {
                              attrs: {
                                'frame-path': t.userData.frame,
                                'headphoto-path': t.userData.headphoto,
                              },
                            }),
                          ],
                          1
                        )
                      : t._e(),
                    a(
                      'div',
                      { class: t.$style['info-top'] },
                      [
                        a(
                          'div',
                          { class: t.$style['user-name'] },
                          [
                            t._l(t.userData.badges, function (t, e) {
                              return a('img', {
                                key: 'badge-' + e,
                                attrs: { src: t },
                              });
                            }),
                            a('span', [t._v(t._s(t.userData.nickname))]),
                          ],
                          2
                        ),
                        t.isStreamerCard
                          ? [
                              a('div', { class: t.$style['user-id'] }, [
                                t._v(' ' + t._s('ID：' + t.userData.id) + ' '),
                              ]),
                              a('div', { class: t.$style['next-time'] }, [
                                t._v(
                                  ' ' +
                                    t._s(
                                      t.$t('S_NEXT_STREAM_TIME') +
                                        ' ' +
                                        t.openStreamTime(t.userData.nextOpen)
                                    ) +
                                    ' '
                                ),
                              ]),
                            ]
                          : t._e(),
                        a('div', { class: t.$style['info-vip'] }, [
                          a(
                            'div',
                            {
                              class: t.$style.vip,
                              on: {
                                click: function (e) {
                                  t.isSelf && (t.openType = 'myVip');
                                },
                              },
                            },
                            [
                              a('img', {
                                attrs: {
                                  src: t.$getCdnPath(
                                    '/images/common/ic_crown.png'
                                  ),
                                },
                              }),
                              a('span', [
                                t._v(t._s('LEVEL ' + t.userData.level)),
                              ]),
                              t.isSelf
                                ? a('font-awesome-icon', {
                                    attrs: { icon: 'chevron-right' },
                                  })
                                : t._e(),
                            ],
                            1
                          ),
                          t.isStreamerCard
                            ? a(
                                'div',
                                {
                                  class: t.$style.btn,
                                  on: {
                                    click: function (e) {
                                      return t.checkContribute(t.userData.id);
                                    },
                                  },
                                },
                                [
                                  a('span', [
                                    t._v(t._s(t.$t('S_CONTRIBUTE_LIST'))),
                                  ]),
                                  a('font-awesome-icon', {
                                    attrs: { icon: 'chevron-right' },
                                  }),
                                ],
                                1
                              )
                            : t._e(),
                        ]),
                      ],
                      2
                    ),
                    a(
                      'div',
                      { class: t.$style['item-info'] },
                      t._l(t.itemList, function (e) {
                        return a(
                          'div',
                          {
                            key: 'item-' + e.key,
                            class: t.$style.item,
                            on: {
                              click: function (a) {
                                return t.checkListPage(e.key);
                              },
                            },
                          },
                          [
                            a('div', { class: t.$style.amount }, [
                              t._v(
                                ' ' +
                                  t._s(
                                    t._f('amountFormat')(t.userData[e.key])
                                  ) +
                                  ' '
                              ),
                            ]),
                            a('div', [t._v(t._s(e.label))]),
                          ]
                        );
                      }),
                      0
                    ),
                    t.userData.intro
                      ? a('div', { class: t.$style.slogan }, [
                          t._v(' ' + t._s(t.userData.intro) + ' '),
                        ])
                      : t._e(),
                    t.isStreamerCard
                      ? t._e()
                      : a(
                          'div',
                          { class: t.$style['user-info'] },
                          [
                            a('div', { class: t.$style['info-title'] }, [
                              t._v(t._s(t.$t('S_USER_INFO'))),
                            ]),
                            t._l(t.userInfoTitle, function (e) {
                              return a(
                                'div',
                                {
                                  key: 'user-info-' + e.key,
                                  class: t.$style['info-item'],
                                },
                                [
                                  a('img', {
                                    attrs: {
                                      src: t.$getCdnPath(
                                        '/images/userInfoCard/ic_' +
                                          e.key +
                                          '.png'
                                      ),
                                    },
                                  }),
                                  a('div', { class: t.$style.label }, [
                                    t._v(' ' + t._s(e.label) + ' '),
                                  ]),
                                  'id' == e.key
                                    ? a('div', [t._v(t._s(t.userData.id))])
                                    : a('div', [
                                        t._v(
                                          ' ' +
                                            t._s(
                                              t.userData[e.key] &&
                                                t.userData[e.key].length
                                                ? t.userData[e.key]
                                                : t.$t('S_NO_SETTING')
                                            ) +
                                            ' '
                                        ),
                                      ]),
                                ]
                              );
                            }),
                          ],
                          2
                        ),
                  ]),
                  t.isStreamerCard
                    ? a(
                        'div',
                        { class: t.$style.follow, on: { click: t.follow } },
                        [
                          t._v(
                            ' ' +
                              t._s(
                                t.isAttentionStreamer
                                  ? t.$t('S_CANCEL_ATTENTION')
                                  : t.$t('S_FOLLOW')
                              ) +
                              ' '
                          ),
                        ]
                      )
                    : t._e(),
                  a(
                    'transition',
                    { attrs: { name: 'slide-left' } },
                    [
                      t.openType
                        ? a(t.openType, {
                            tag: 'component',
                            attrs: { 'is-model': '' },
                            on: {
                              close: function (e) {
                                t.openType = '';
                              },
                            },
                          })
                        : t._e(),
                    ],
                    1
                  ),
                ],
                1
              )
            : t._e();
        }),
      r = [],
      o = a('5530'),
      c = (a('caad'), a('2532'), a('4de4'), a('b0c0'), a('2f62')),
      u = a('c70f'),
      l = a('0d39'),
      d = a('0568'),
      m = a('71c2'),
      _ = a('7150'),
      h = a('2471'),
      f = a('2407'),
      p = {
        components: {
          Header: m['a'],
          Avatar: _['a'],
          myVip: u['a'],
          myProps: l['a'],
        },
        props: {
          targetId: { type: Number, required: !0 },
          isStreamerCard: { type: Boolean, required: !0 },
          isAdmin: { type: Boolean, default: !1 },
          isFakeUser: { type: Boolean, default: !1 },
        },
        data: function () {
          return {
            streamerInfo: {},
            openType: '',
            userInfoTitle: [
              { key: 'id', label: this.$t('S_USER_ID') },
              { key: 'birth', label: this.$t('S_BIRTHDAY') },
              { key: 'hometown', label: this.$t('S_AREA') },
              { key: 'relationship', label: this.$t('S_LOVE_STATUS') },
            ],
          };
        },
        computed: Object(o['a'])(
          Object(o['a'])(
            Object(o['a'])(
              Object(o['a'])({}, Object(c['d'])(['user'])),
              Object(c['c'])('chatroom', { userInfo: 'getUserInfo' })
            ),
            Object(c['c'])({
              wholePageType: 'getWholePageType',
              attentionStreamer: 'getUserAttentionStreamer',
            })
          ),
          {},
          {
            isAttentionStreamer: function () {
              return this.attentionStreamer.includes(this.userData.id);
            },
            userData: function () {
              var t, e, a, n, i, s, r;
              return this.isStreamerCard
                ? Object(o['a'])(
                    Object(o['a'])({}, this.streamerInfo),
                    {},
                    {
                      fans:
                        null === (a = this.streamerInfo) || void 0 === a
                          ? void 0
                          : a.attention_num,
                      guard:
                        null === (n = this.streamerInfo) || void 0 === n
                          ? void 0
                          : n.guardian_num,
                      headphoto:
                        null === (i = this.streamerInfo) || void 0 === i
                          ? void 0
                          : i.head_photo,
                      nickname:
                        null === (s = this.streamerInfo) || void 0 === s
                          ? void 0
                          : s.alias,
                      nextOpen:
                        null === (r = this.streamerInfo) || void 0 === r
                          ? void 0
                          : r.next_open_at,
                    }
                  )
                : Object(o['a'])(
                    Object(o['a'])({}, this.userInfo),
                    {},
                    {
                      follow:
                        null === (t = this.userInfo) || void 0 === t
                          ? void 0
                          : t.trackNum,
                      item:
                        null === (e = this.userInfo) || void 0 === e
                          ? void 0
                          : e.propNum,
                    }
                  );
            },
            itemList: function () {
              var t = this;
              return [
                { key: 'fans', label: this.$t('S_FANS_COUNT'), isStreamer: !0 },
                { key: 'guard', label: this.$t('S_GUARD'), isStreamer: !0 },
                { key: 'paopao', label: this.$t('S_BUBBLE'), isStreamer: !0 },
                {
                  key: 'follow',
                  label: this.$t('S_TRACK_COUNT'),
                  isStreamer: !1,
                },
                { key: 'item', label: this.$t('S_ITEM'), isStreamer: !1 },
              ].filter(function (e) {
                return e.isStreamer === t.isStreamerCard;
              });
            },
            isSelf: function () {
              var t;
              return (
                !this.isStreamerCard &&
                this.user.lott_id ===
                  (null === (t = this.userInfo) || void 0 === t ? void 0 : t.id)
              );
            },
            errorPath: function () {
              return this.$getCdnPath('/images/common/default_bg.jpeg');
            },
          }
        ),
        created: function () {
          this.initData();
        },
        beforeDestroy: function () {
          this.actionSetUserInfo(null);
        },
        methods: Object(o['a'])(
          Object(o['a'])(
            Object(o['a'])(
              {},
              Object(c['b'])([
                'actionSetHintInfo',
                'actionGetAttentionStreamer',
                'actionAttentionStreamer',
                'actionCancelAttentionStreamer',
                'actionSetWholePageType',
              ])
            ),
            Object(c['b'])('chatroom', [
              'actionGetUserInfo',
              'actionSetUserInfo',
            ])
          ),
          {},
          {
            initData: function () {
              if (this.isStreamerCard)
                return (
                  this.fetchStreamerInfo(),
                  void this.actionGetAttentionStreamer(this.user.lott_id)
                );
              var t = { id: this.targetId };
              this.isAdmin &&
                (t = Object(o['a'])(Object(o['a'])({}, t), {}, { role: 3 })),
                this.isFakeUser &&
                  (t = Object(o['a'])(Object(o['a'])({}, t), {}, { role: -1 })),
                this.actionGetUserInfo(t);
            },
            fetchStreamerInfo: function () {
              var t = this;
              Object(d['h'])(this.targetId).then(function (e) {
                var a = e.data;
                '0' === a.error_code && (t.streamerInfo = a.result);
              });
            },
            follow: function () {
              var t = { streamer_id: this.userData.id };
              this.isAttentionStreamer
                ? this.actionCancelAttentionStreamer(t)
                : this.actionAttentionStreamer(t);
            },
            checkListPage: function (t) {
              switch (t) {
                case 'fans':
                case 'guard':
                case 'follow':
                  this.$emit('showPage', t);
                  break;
                case 'item':
                  this.isSelf && (this.openType = 'myProps');
                  break;
                case 'paopao':
                  break;
                default:
                  break;
              }
            },
            checkContribute: function (t) {
              this.$emit('update:targetId', t),
                this.$emit('showPage', 'contribute');
            },
            openStreamTime: function (t) {
              return t
                ? Object(f['a'])(t, 'MM/dd 00:00')
                : this.$t('S_NO_SETTING');
            },
            closeCard: function () {
              'memInfo' !== this.wholePageType
                ? 'memInfo' !== this.$route.name
                  ? this.$emit('update:targetId', null)
                  : h['a'].jsToAppMessage({ event: 'EVENT_EXIT', data: '' })
                : this.actionSetWholePageType(null);
            },
          }
        ),
      },
      g = p,
      S = a('956a'),
      v = (a('5877'), a('2877'));
    function b(t) {
      this['$style'] = S['default'].locals || S['default'];
    }
    var C = Object(v['a'])(g, s, r, !1, b, '30198cc6', null),
      O = C.exports,
      T = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { staticClass: 'page-wrap' },
          [
            a('Header', {
              attrs: { title: t.headerText, 'left-btn-func': t.close },
            }),
            a(
              'div',
              { class: ['content', { 'app-content': t.appUse }] },
              [
                t.userList.length
                  ? t._l(t.userList, function (e, n) {
                      return a(
                        'div',
                        { key: e.id + '-' + n, staticClass: 'user-info-wrap' },
                        [
                          a(
                            'div',
                            {
                              staticClass: 'user-info',
                              on: {
                                click: function (a) {
                                  return t.toCheckInfo(e);
                                },
                              },
                            },
                            [
                              a(
                                'div',
                                { staticClass: 'user-field' },
                                [
                                  a('Avatar', {
                                    attrs: {
                                      'frame-path': e.frame,
                                      'headphoto-path': e.headphoto,
                                    },
                                  }),
                                  a('div', { staticClass: 'name' }, [
                                    t._v(t._s(e.name)),
                                  ]),
                                ],
                                1
                              ),
                            ]
                          ),
                        ]
                      );
                    })
                  : a('NoDataWrap'),
              ],
              2
            ),
          ],
          1
        );
      },
      E = [],
      I = (a('99af'), a('ee29')),
      A = a('234c'),
      y = {
        components: { Header: m['a'], NoDataWrap: I['a'], Avatar: _['a'] },
        props: {
          targetId: { type: Number, required: !0 },
          showPage: { type: String, required: !0 },
          isAdmin: { type: Boolean, default: !1 },
          isFakeUser: { type: Boolean, default: !1 },
        },
        computed: Object(o['a'])(
          Object(o['a'])(
            Object(o['a'])(
              {},
              Object(c['c'])({ wholePageType: 'getWholePageType' })
            ),
            Object(c['c'])('chatroom', {
              fansList: 'getFansList',
              guardList: 'getGuardianList',
              trackList: 'getUserTrackList',
            })
          ),
          {},
          {
            headerText: function () {
              var t = {
                fans: 'S_FAN_LIST',
                guard: 'S_GUARD',
                follow: 'S_TRACK_COUNT',
              };
              return ''
                .concat(this.$t(t[this.showPage]), ' (')
                .concat(this.userList.length, ')');
            },
            appUse: function () {
              return Object(A['a'])('appUse');
            },
            userList: function () {
              switch (this.showPage) {
                case 'fans':
                  return this.fansList;
                case 'guard':
                  return this.guardList;
                case 'follow':
                  return this.trackList;
                default:
                  return [];
              }
            },
            isStreamerCard: function () {
              return 'follow' === this.showPage;
            },
          }
        ),
        created: function () {
          this.getListData();
        },
        methods: Object(o['a'])(
          Object(o['a'])(
            Object(o['a'])({}, Object(c['b'])(['actionSetWholePageType'])),
            Object(c['b'])('chatroom', [
              'actionGetFansList',
              'actionGetGuardians',
              'actionGetUserTrack',
            ])
          ),
          {},
          {
            getListData: function () {
              if ('follow' === this.showPage) {
                var t = 0;
                return (
                  this.isAdmin && (t = 3),
                  this.isFakeUser && (t = -1),
                  void this.actionGetUserTrack({ id: this.targetId, role: t })
                );
              }
              var e = {
                fans: this.actionGetFansList,
                guard: this.actionGetGuardians,
              };
              e[this.showPage](this.targetId);
            },
            toCheckInfo: function (t) {
              this.$emit('isStreamerCard', this.isStreamerCard),
                this.$emit('update:showPage', 'card'),
                this.$emit('update:targetId', t.id),
                this.$emit('update:isFakeUser', -1 === t.identityId);
            },
            close: function () {
              'memInfo' !== this.wholePageType
                ? 'memInfo' !== this.$route.name
                  ? this.$emit('update:showPage', 'card')
                  : h['a'].jsToAppMessage({ event: 'EVENT_EXIT', data: '' })
                : this.actionSetWholePageType(null);
            },
          }
        ),
      },
      w = y,
      R = (a('85ea'), Object(v['a'])(w, T, E, !1, null, '4f52dc17', null)),
      L = R.exports,
      N = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { staticClass: 'contribute-wrap' },
          [
            a('Header', {
              attrs: {
                title: t.$t('S_CONTRIBUTE_LIST'),
                'left-btn-func': t.close,
              },
            }),
            t.contributeList
              ? a(
                  'div',
                  { staticClass: 'content' },
                  [
                    a(
                      'el-tabs',
                      {
                        staticClass: 'tabs-wrap',
                        attrs: { stretch: '' },
                        model: {
                          value: t.nowTab,
                          callback: function (e) {
                            t.nowTab = e;
                          },
                          expression: 'nowTab',
                        },
                      },
                      t._l(t.tabList, function (t) {
                        return a('el-tab-pane', {
                          key: 'tab-' + t.key,
                          attrs: { name: t.key, label: t.label },
                        });
                      }),
                      1
                    ),
                    a('div', { staticClass: 'time-options-wrap' }, [
                      a(
                        'div',
                        { staticClass: 'time-options' },
                        t._l(t.timeOptions, function (e) {
                          return a(
                            'div',
                            {
                              key: 'tab-' + e.key,
                              class: { current: e.key === t.nowTime },
                              on: {
                                click: function (a) {
                                  t.nowTime = e.key;
                                },
                              },
                            },
                            [t._v(' ' + t._s(e.label) + ' ')]
                          );
                        }),
                        0
                      ),
                      t.isApp
                        ? t._e()
                        : a(
                            'div',
                            {
                              staticClass: 'last-date',
                              on: { click: t.checkLast },
                            },
                            [
                              a('img', {
                                attrs: {
                                  src: t.$getCdnPath(
                                    '/images/common/ic_calender.png'
                                  ),
                                },
                              }),
                              a('span', [t._v(t._s(t.lastTimeData.title))]),
                            ]
                          ),
                    ]),
                    a('DataContent', {
                      attrs: {
                        leaderboard: t.nowTab,
                        data: t.contributeList[t.nowTab][t.nowTime],
                      },
                      on: { openCard: t.openCard },
                    }),
                    t.isShowLast
                      ? a('div', { staticClass: 'mask' }, [
                          a(
                            'div',
                            { staticClass: 'popup-wrap' },
                            [
                              a('img', {
                                staticClass: 'close',
                                attrs: {
                                  src: t.$getCdnPath(
                                    '/images/common/popup_ic_close.png'
                                  ),
                                },
                                on: {
                                  click: function (e) {
                                    t.isShowLast = !1;
                                  },
                                },
                              }),
                              a('DataContent', {
                                attrs: {
                                  'is-pop-up': '',
                                  leaderboard: t.nowTab,
                                  data: t.contributeList[t.nowTab][t.lastTime],
                                },
                                on: { openCard: t.openCard },
                              }),
                            ],
                            1
                          ),
                        ])
                      : t._e(),
                  ],
                  1
                )
              : t._e(),
          ],
          1
        );
      },
      k = [],
      P = a('e79c'),
      M = {
        components: { Header: m['a'], DataContent: P['a'] },
        props: {
          targetId: { type: Number, required: !0 },
          isApp: { type: Boolean, default: !1 },
          defaultTab: { type: String, default: '' },
        },
        data: function () {
          return {
            nowTab: this.defaultTab || 'diamond',
            nowTime: 'day',
            lastTime: 'yesterday',
            isShowLast: !1,
          };
        },
        computed: Object(o['a'])(
          Object(o['a'])(
            Object(o['a'])(
              {},
              Object(c['c'])({ wholePageType: 'getWholePageType' })
            ),
            Object(c['c'])('chatroom', { contributeList: 'getContributeList' })
          ),
          {},
          {
            timeOptions: function () {
              return this.isApp
                ? [{ key: 'day', label: this.$t('S_DAILY_LIST') }]
                : [
                    { key: 'day', label: this.$t('S_DAILY_LIST') },
                    { key: 'week', label: this.$t('S_WEEKLY_LIST') },
                    { key: 'month', label: this.$t('S_MONTHLY_LIST') },
                  ];
            },
            tabList: function () {
              return [
                { key: 'diamond', label: this.$t('S_DIAMOND_RANK') },
                { key: 'paopao', label: this.$t('S_BUBBLE_RANK') },
              ];
            },
            lastTimeData: function () {
              var t = {
                day: { key: 'yesterday', title: this.$t('S_YESTERDAY') },
                week: { key: 'lastweek', title: this.$t('S_LAST_WEEK') },
                month: { key: 'lastmonth', title: this.$t('S_LAST_MONTH') },
              };
              return t[this.nowTime];
            },
          }
        ),
        created: function () {
          this.actionGetContribute({
            streamerId: this.targetId,
            scope: { scope: 'all' },
          });
        },
        methods: Object(o['a'])(
          Object(o['a'])(
            Object(o['a'])({}, Object(c['b'])(['actionSetWholePageType'])),
            Object(c['b'])('chatroom', ['actionGetContribute'])
          ),
          {},
          {
            checkLast: function () {
              (this.lastTime = this.lastTimeData.key), (this.isShowLast = !0);
            },
            openCard: function (t) {
              this.$emit('update:targetId', t.id),
                this.$emit('update:isFakeUser', -1 === t.identityId),
                this.$emit('showPage', 'card'),
                this.$emit('isStreamerCard', !1);
            },
            close: function () {
              'memInfo' !== this.wholePageType
                ? 'memInfo' !== this.$route.name
                  ? this.$emit('showPage', 'card')
                  : h['a'].jsToAppMessage({ event: 'EVENT_EXIT', data: '' })
                : this.actionSetWholePageType(null);
            },
          }
        ),
      },
      D = M,
      j = (a('08e1'), Object(v['a'])(D, N, k, !1, null, '051b3d42', null)),
      G = j.exports,
      $ = {
        components: { UserInfoCard: O, ListPage: L, Contribute: G },
        props: {
          targetId: { type: Number, default: null },
          showPage: { type: String, default: null },
          isStreamerCard: { type: Boolean, default: !1 },
          isAdmin: { type: Boolean, default: !1 },
          isFakeUser: { type: Boolean, default: !1 },
          isApp: { type: Boolean, default: !1 },
          options: {
            type: Object,
            default: function () {
              return {};
            },
          },
        },
        computed: {
          id: {
            get: function () {
              return this.targetId;
            },
            set: function (t) {
              this.$emit('update:targetId', t),
                this.$emit('update:isAdmin', !1),
                this.$emit('update:isFake', !1);
            },
          },
          isFake: {
            get: function () {
              return this.isFakeUser;
            },
            set: function (t) {
              this.$emit('update:isFakeUser', t);
            },
          },
        },
      },
      U = $,
      x = (a('b61b'), Object(v['a'])(U, n, i, !1, null, '6070e026', null));
    e['default'] = x.exports;
  },
  '7bb4': function (t, e, a) {
    'use strict';
    a.d(e, 'n', function () {
      return c;
    }),
      a.d(e, 't', function () {
        return u;
      }),
      a.d(e, 'd', function () {
        return l;
      }),
      a.d(e, 'l', function () {
        return d;
      }),
      a.d(e, 's', function () {
        return m;
      }),
      a.d(e, 'k', function () {
        return _;
      }),
      a.d(e, 'o', function () {
        return h;
      }),
      a.d(e, 'j', function () {
        return f;
      }),
      a.d(e, 'a', function () {
        return p;
      }),
      a.d(e, 'c', function () {
        return g;
      }),
      a.d(e, 'h', function () {
        return S;
      }),
      a.d(e, 'g', function () {
        return v;
      }),
      a.d(e, 'r', function () {
        return b;
      }),
      a.d(e, 'e', function () {
        return C;
      }),
      a.d(e, 'b', function () {
        return O;
      }),
      a.d(e, 'm', function () {
        return T;
      }),
      a.d(e, 'i', function () {
        return E;
      }),
      a.d(e, 'f', function () {
        return I;
      }),
      a.d(e, 'q', function () {
        return A;
      }),
      a.d(e, 'p', function () {
        return y;
      });
    a('99af'), a('4795');
    var n = a('a3be'),
      i = a('4360'),
      s = a('2471'),
      r = a('3aee'),
      o = a('8f6a'),
      c = function (t) {
        return Object(o['a'])('get', n['u'], t);
      },
      u = function (t) {
        return Object(o['a'])('put', n['u'], t);
      },
      l = function (t) {
        return Object(o['a'])('delete', n['u'], t);
      },
      d = function (t) {
        return Object(o['a'])('get', n['t'], t);
      },
      m = function (t) {
        return Object(o['a'])('post', n['t'], t);
      },
      _ = function () {
        return Object(o['a'])('get', n['F']);
      },
      h = function () {
        return Object(o['a'])('get', n['H']);
      },
      f = function () {
        return Object(o['a'])('get', n['E']);
      },
      p = function (t) {
        return Object(o['a'])('post', n['D'], t);
      },
      g = function (t) {
        return Object(o['a'])('put', ''.concat(n['D'], '/').concat(t));
      },
      S = function () {
        return Object(o['a'])('get', n['G']);
      },
      v = function () {
        return Object(o['a'])('get', n['m']);
      },
      b = function () {
        return Object(o['a'])('get', n['v']);
      },
      C = function () {
        return Object(o['a'])('get', n['p']);
      },
      O = function (t) {
        return Object(o['a'])('post', n['f'], t).then(function (t) {
          if ('116023116' === t.data.error_code)
            throw (
              (i['a'].dispatch(
                'actionSetHintInfo',
                r['a'].t('S_DEPOSIT_ONCE_OPEN_DIAMOND')
              ),
              setTimeout(function () {
                Object(s['c'])('deposit');
              }, 3e3),
              new Error())
            );
          return t;
        });
      },
      T = function () {
        return Object(o['a'])('get', n['Q']);
      },
      E = function (t) {
        return Object(o['a'])('get', n['C'], t);
      },
      I = function () {
        return Object(o['a'])('get', n['b']);
      },
      A = function () {
        return Object(o['a'])('get', n['P']);
      },
      y = function () {
        return Object(o['a'])('get', n['L']);
      };
  },
  '7de1': function (t, e, a) {
    'use strict';
    a('abc9');
  },
  '7ec6': function (t, e, a) {
    'use strict';
    a('ce69');
  },
  '7f64': function (t, e, a) {
    'use strict';
    a('dd8a');
  },
  '802a': function (t, e, a) {
    t.exports = {
      'chat-msg-item': 'msgItem_chat-msg-item_1Vus4',
      'chat-msg-text': 'msgItem_chat-msg-text_32boT',
      badges: 'msgItem_badges_1fqdc',
      msg: 'msgItem_msg_3sp-J',
      sender: 'msgItem_sender_14-pi',
      'msg-content': 'msgItem_msg-content_2VK_w',
      tag: 'msgItem_tag_17fHL',
      'donate-icon': 'msgItem_donate-icon_2fTGj',
      'sys-tag': 'msgItem_sys-tag_36we3',
      'win-tag': 'msgItem_win-tag_2K5Oj',
      'guardian-tag': 'msgItem_guardian-tag_2p_6P',
      'enter-msg': 'msgItem_enter-msg_Sz6S4',
    };
  },
  8059: function (t, e, a) {
    'use strict';
    a('50ef');
  },
  '84fc': function (t, e, a) {
    'use strict';
    a('1fd6');
  },
  '85ea': function (t, e, a) {
    'use strict';
    a('2c76');
  },
  '863c': function (t, e, a) {},
  8663: function (t, e, a) {
    'use strict';
    a('5230');
  },
  8741: function (t, e, a) {
    'use strict';
    a('6b5f');
  },
  8747: function (t, e, a) {
    'use strict';
    a('30c3');
  },
  8851: function (t, e, a) {
    'use strict';
    a('76ee');
  },
  8935: function (t, e, a) {},
  '899b': function (t, e, a) {
    'use strict';
    var n = a('1d15'),
      i = a.n(n);
    a.d(e, 'default', function () {
      return i.a;
    });
  },
  '8f6a': function (t, e, a) {
    'use strict';
    a.d(e, 'b', function () {
      return _;
    }),
      a.d(e, 'a', function () {
        return h;
      });
    var n = a('5530'),
      i = (a('caad'), a('d3b7'), a('bc3a')),
      s = a.n(i),
      r = a('234c'),
      o = a('3aee'),
      c = a('ebf7'),
      u = a('2471'),
      l = a('b4a9'),
      d = a('4360'),
      m = s.a.create();
    function _() {
      (m.defaults.timeout = 3e4),
        (m.defaults.headers.common['Content-Type'] =
          'application/json;charset=UTF-8'),
        m.interceptors.response.use(
          function (t) {
            if (
              (d['a'].dispatch('actionCdnDomain', t.headers['x-cdn']),
              d['a'].dispatch('actionWsCdnDomain', t.headers['x-cdn-pao-img']),
              '0' !== t.data.error_code && t.data.error_text)
            ) {
              if (
                (Object(l['a'])({ url: t.config.url, response: t }),
                ['116020009'].includes(t.data.error_code) &&
                  (Object(r['b'])('session'),
                  d['a'].dispatch('actionSetHintInfo', t.data.error_text),
                  u['a'].jsToAppMessage({
                    event: 'EVENT_USER_SESSION_ERROR',
                    data: t.data.error_text,
                  })),
                ['116020016'].includes(t.data.error_code) && Object(c['d'])(),
                ['116020010'].includes(t.data.error_code) &&
                  d['a'].dispatch('actionSetHintInfo', t.data.error_text),
                ['116020031', '116020033', '116020038'].includes(
                  t.data.error_code
                ))
              )
                throw ((window.location.href = '/403'), new Error());
              if (
                ['116020025'].includes(t.data.error_code) &&
                !t.config.noCheckMaintain
              )
                throw (
                  ('Y' === t.data.isGCP
                    ? (window.location.href = '/upgrade?isGCP=Y')
                    : (window.location.href = '/upgrade'),
                  new Error())
                );
            }
            return t;
          },
          function (t) {
            return (
              Object(l['a'])({ url: t.config.url, response: t.response || t }),
              Promise.reject(t)
            );
          }
        );
    }
    function h(t, e) {
      var a =
          arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null,
        i = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : {},
        s = Object(r['a'])('session') || '',
        c = {
          headers: Object(n['a'])(
            { 'Accept-Language': o['a'].locale, Session: s },
            null === i || void 0 === i ? void 0 : i.headers
          ),
        };
      switch (t) {
        case 'post':
          return m.post(e, a, c);
        case 'delete':
          return m['delete'](e, Object(n['a'])({ data: a }, c));
        case 'put':
          return m.put(e, a, c);
        case 'patch':
          return m.patch(e, a, c);
        default:
          return m.get(e, Object(n['a'])(Object(n['a'])({ params: a }, c), i));
      }
    }
  },
  '918b': function (t, e, a) {},
  '93ee': function (t, e, a) {
    'use strict';
    a.d(e, 'i', function () {
      return s;
    }),
      a.d(e, 'd', function () {
        return r;
      }),
      a.d(e, 'n', function () {
        return o;
      }),
      a.d(e, 'e', function () {
        return l;
      }),
      a.d(e, 'a', function () {
        return d;
      }),
      a.d(e, 'b', function () {
        return m;
      }),
      a.d(e, 'm', function () {
        return c;
      }),
      a.d(e, 'k', function () {
        return _;
      }),
      a.d(e, 'l', function () {
        return u;
      }),
      a.d(e, 'c', function () {
        return h;
      }),
      a.d(e, 'h', function () {
        return f;
      }),
      a.d(e, 'f', function () {
        return p;
      }),
      a.d(e, 'g', function () {
        return g;
      }),
      a.d(e, 'j', function () {
        return S;
      });
    a('99af');
    var n = a('a3be'),
      i = a('8f6a'),
      s = function (t) {
        return Object(i['a'])('get', n['U'], t);
      },
      r = function (t) {
        return Object(i['a'])('get', n['c'], t);
      },
      o = function (t, e) {
        var a = { headers: { partner: '2' } };
        return Object(i['a'])(
          'post',
          ''.concat(n['A']).concat(e ? '?guest=true' : ''),
          t,
          a
        );
      },
      c = function (t) {
        return Object(i['a'])(
          'post',
          ''.concat(n['z'], '?token=').concat(t.token),
          { device_code: t.deviceCode }
        );
      },
      u = function (t) {
        return Object(i['a'])('post', n['y'], t);
      },
      l = function (t) {
        return Object(i['a'])('get', ''.concat(n['d'], '/').concat(t));
      },
      d = function (t) {
        return Object(i['a'])('post', n['d'], t);
      },
      m = function (t) {
        return Object(i['a'])('delete', n['d'], t);
      },
      _ = function (t) {
        return Object(i['a'])('get', ''.concat(n['N'], '/').concat(t));
      },
      h = function () {
        return Object(i['a'])('get', n['a']);
      },
      f = function () {
        return Object(i['a'])('get', n['I']);
      },
      p = function () {
        return Object(i['a'])('get', n['e']);
      },
      g = function (t) {
        return Object(i['a'])('get', n['B'], t, { noCheckMaintain: !0 });
      },
      S = function (t) {
        return Object(i['a'])('get', ''.concat(n['V'], '/').concat(t));
      };
  },
  '956a': function (t, e, a) {
    'use strict';
    var n = a('ee0f'),
      i = a.n(n);
    a.d(e, 'default', function () {
      return i.a;
    });
  },
  '99ea': function (t, e, a) {
    'use strict';
    a('9ea9');
  },
  '9b07': function (t, e, a) {},
  '9c0c': function (t, e, a) {},
  '9ea9': function (t, e, a) {},
  '9eb6': function (t, e, a) {},
  '9ffa': function (t, e, a) {
    'use strict';
    a('1b03');
  },
  a069: function (t, e, a) {
    t.exports = {
      'btn-wrap': 'rightBottomBtns_btn-wrap_2O7Vx',
      'activity-btn-wrap': 'rightBottomBtns_activity-btn-wrap_2-Na0',
    };
  },
  a3be: function (t, e, a) {
    'use strict';
    a.d(e, 'X', function () {
      return n;
    }),
      a.d(e, 'T', function () {
        return i;
      }),
      a.d(e, 'w', function () {
        return s;
      }),
      a.d(e, 'A', function () {
        return r;
      }),
      a.d(e, 'U', function () {
        return o;
      }),
      a.d(e, 'd', function () {
        return c;
      }),
      a.d(e, 'c', function () {
        return u;
      }),
      a.d(e, 'S', function () {
        return l;
      }),
      a.d(e, 'x', function () {
        return d;
      }),
      a.d(e, 'Y', function () {
        return m;
      }),
      a.d(e, 'i', function () {
        return _;
      }),
      a.d(e, 'l', function () {
        return h;
      }),
      a.d(e, 'n', function () {
        return f;
      }),
      a.d(e, 'q', function () {
        return p;
      }),
      a.d(e, 'Z', function () {
        return g;
      }),
      a.d(e, 'K', function () {
        return S;
      }),
      a.d(e, 'h', function () {
        return v;
      }),
      a.d(e, 'g', function () {
        return b;
      }),
      a.d(e, 'J', function () {
        return C;
      }),
      a.d(e, 'z', function () {
        return O;
      }),
      a.d(e, 'y', function () {
        return T;
      }),
      a.d(e, 'N', function () {
        return E;
      }),
      a.d(e, 'a', function () {
        return I;
      }),
      a.d(e, 'I', function () {
        return A;
      }),
      a.d(e, 's', function () {
        return y;
      }),
      a.d(e, 'e', function () {
        return w;
      }),
      a.d(e, 'M', function () {
        return R;
      }),
      a.d(e, 'B', function () {
        return L;
      }),
      a.d(e, 'V', function () {
        return N;
      }),
      a.d(e, 'W', function () {
        return k;
      }),
      a.d(e, 'r', function () {
        return P;
      }),
      a.d(e, 'u', function () {
        return M;
      }),
      a.d(e, 't', function () {
        return D;
      }),
      a.d(e, 'F', function () {
        return j;
      }),
      a.d(e, 'H', function () {
        return G;
      }),
      a.d(e, 'D', function () {
        return $;
      }),
      a.d(e, 'E', function () {
        return U;
      }),
      a.d(e, 'G', function () {
        return x;
      }),
      a.d(e, 'm', function () {
        return F;
      }),
      a.d(e, 'v', function () {
        return H;
      }),
      a.d(e, 'k', function () {
        return B;
      }),
      a.d(e, 'O', function () {
        return W;
      }),
      a.d(e, 'p', function () {
        return V;
      }),
      a.d(e, 'f', function () {
        return Y;
      }),
      a.d(e, 'Q', function () {
        return K;
      }),
      a.d(e, 'C', function () {
        return X;
      }),
      a.d(e, 'b', function () {
        return q;
      }),
      a.d(e, 'P', function () {
        return z;
      }),
      a.d(e, 'L', function () {
        return Q;
      }),
      a.d(e, 'j', function () {
        return J;
      }),
      a.d(e, 'R', function () {
        return Z;
      }),
      a.d(e, 'o', function () {
        return tt;
      });
    var n = '/api/stream/v1/user-end/streams/conn',
      i = '/api/account/v1/user-end/user/streamer-info',
      s = '/api/market/v1/user-end/gift',
      r = '/api/account/v1/user-end/auto/login',
      o = '/api/stream/v1/user-end/streams/all',
      c = '/api/account/v1/user-end/attention',
      u = '/api/stream/v1/user-end/streams/atten_stream',
      l = '/api/account/v1/user-end/user/streamer-card',
      d = '/api/account/v1/user-end/streamer/guardians',
      m = '/api/account/v1/user-end/user/info',
      _ = '/api/market/v1/user-end/contribute',
      h = '/api/market/v1/user-end/user/diamond',
      f = '/api/market/v1/user-end/donate',
      p = '/api/account/v1/user-end/attention-userinfo',
      g = '/api/account/v1/user-end/user/attention',
      S = '/api/market/v1/user-end/guardian',
      v = '/api/market/v1/user-end/user/check-diamond',
      b = '/api/market/v1/user-end/charge-room',
      C = '/api/market/v1/user-end/props',
      O = '/api/account/v1/user-end/auto/login/bbos',
      T = '/api/account/v1/user-end/auth/user/jwt-compare',
      E = '/api/stream/v1/user-end/streams/recently-watched',
      I = '/api/market/v1/user-end/paopao/activities',
      A = '/api/stream/v1/user-end/marquee',
      y = '/api/stream/v1/user-end/external/game/list',
      w = '/api/stream/v1/user-end/banner',
      R = '/api/stream/v1/user-end/stream/pullurl',
      L = '/api/info/maintain/status',
      N = '/api/stream/v1/user-end/stream/detail',
      k = '/api/quest/v1/user-end/user/quest-wall',
      P = '/api/quest/v1/user-end/user/quest/first-meet',
      M = '/api/market/v1/user-end/main/equips',
      D = '/api/market/v1/user-end/main/props',
      j = '/api/account/v1/user-end/user/guardians',
      G = '/api/account/v1/user-end/main-attention',
      $ = '/api/account/v1/user-end/favorite',
      U = '/api/account/v1/user-end/favorites',
      x = '/api/market/v1/user-end/product',
      F = '/api/account/v1/user-end/user/diamond-and-exp',
      H = '/api/account/v1/user-end/user/vip-list',
      B = '/api/quest/v1/user-end/user/quest/daily-signin',
      W = '/api/quest/v1/user-end/user/quest/reward',
      V = '/api/market/v1/user-end/exchange-diamond',
      Y = '/api/market/v1/user-end/buy-props',
      K = '/api/market/v1/user-end/main/mysentpaopao',
      X = '/api/market/v1/user-end/user/contribute/self-list',
      q = '/api/market/v1/user-end/leaderboard/anchor',
      z = '/api/market/v1/user-end/leaderboard/filthy-rich',
      Q = '/api/market/v1/user-end/leaderboard/paopao',
      J = '/api/quest/v1/user-end/user/quest/daily-share',
      Z = '/api/market/v1/user-end/user/event/sign-up-diamond',
      tt = '/api/market/v1/user-end/user/event/reward';
  },
  a412: function (t, e, a) {
    'use strict';
    a('3b32');
  },
  a52a: function (t, e, a) {
    'use strict';
    a('6415');
  },
  a886: function (t, e, a) {
    'use strict';
    var n = a('a069'),
      i = a.n(n);
    a.d(e, 'default', function () {
      return i.a;
    });
  },
  a899: function (t, e, a) {
    'use strict';
    a('6a01');
  },
  a915: function (t, e, a) {
    'use strict';
    a('8935');
  },
  a9fc: function (t, e, a) {},
  aab8: function (t, e, a) {},
  abc9: function (t, e, a) {},
  ac76: function (t, e, a) {},
  ad79: function (t, e, a) {},
  ae3a: function (t, e, a) {},
  b119: function (t, e, a) {},
  b1a3: function (t, e, a) {},
  b4a9: function (t, e, a) {
    'use strict';
    a.d(e, 'a', function () {
      return i;
    }),
      a.d(e, 'b', function () {
        return n;
      });
    a('0d03'),
      a('d3b7'),
      a('25f0'),
      a('4160'),
      a('159b'),
      a('ac1f'),
      a('841c'),
      a('99af');
    var n = function (t) {
        (t && t.response && t.response.status) ||
          'Error' === t.toString() ||
          console.error(t.toString());
      },
      i = function (t) {
        var e = t.url,
          a = t.response,
          n = e.search('/api/v1/') < 0 ? 1 : 5,
          i = 'background-color: #D00; color: #FFF;',
          s = 'color: #D00;',
          r = function (t) {
            return t instanceof Error
              ? t.response
                ? {
                    data: t,
                    status: t.response.status,
                    code: t.response.data.code,
                    message: t.response.data.msg || t.response.data.message,
                  }
                : t.request
                ? { data: t, status: t.code, message: t.message }
                : t
              : {
                  data: a.data,
                  status: a.status,
                  code: a.data ? a.data.code : '',
                  message: a.data ? a.data.msg || a.data.message : '',
                };
          },
          o = r(e, a),
          c = o.data,
          u = o.status,
          l = o.code,
          d = o.message;
        console.group(
          '%c -------------------- API ERROR ------------------- ',
          i
        ),
          console.log('%c API URL: '.concat(e, ' '), s),
          console.log('%c DEPARTMENT: '.concat(n, ' '), s),
          u &&
            console.log(
              '%c NET STATUS: '
                .concat(u, ' ')
                .concat('ECONNABORTED' === u ? '(timeout)' : '', ' '),
              s
            ),
          l && console.log('%c ERROR CODE: '.concat(l, ' '), s),
          d && console.log('%c ERROR MESSAGE: '.concat(d, ' '), s),
          c && console.log('%c RESPONSE:', s, c),
          console.groupEnd();
      };
  },
  b61b: function (t, e, a) {
    'use strict';
    a('4d14');
  },
  b6ce: function (t, e, a) {
    t.exports = {
      'tip-msg': 'App_tip-msg_2USOY',
      wrap: 'App_wrap_2esTH',
      'router-view': 'App_router-view_LxvqH',
      'is-model': 'App_is-model_LEDGG',
      'horizontal-mask': 'App_horizontal-mask_2BHjB',
      hint: 'App_hint_3sOog',
      'phone-img': 'App_phone-img_27ARx',
    };
  },
  b7b2: function (t, e, a) {
    'use strict';
    a('ad79');
  },
  b9ed: function (t, e, a) {},
  ba78: function (t, e, a) {
    'use strict';
    a('f794');
  },
  bbdb: function (t, e, a) {
    'use strict';
    a('befc');
  },
  bdb5: function (t, e, a) {
    'use strict';
    a('f24e');
  },
  befc: function (t, e, a) {},
  bfce: function (t, e, a) {},
  c0c7: function (t, e, a) {},
  c0d8: function (t, e, a) {
    'use strict';
    var n = a('802a'),
      i = a.n(n);
    a.d(e, 'default', function () {
      return i.a;
    });
  },
  c301: function (t, e, a) {
    'use strict';
    a('38fa');
  },
  c41d: function (t, e, a) {
    'use strict';
    a('4c34');
  },
  c56b: function (t, e, a) {
    'use strict';
    var n = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { class: { model: t.isModel } },
          [
            a('MainHeader', {
              attrs: {
                title: t.$t('S_TRACK_COUNT') + '(' + t.trackList.length + ')',
                'left-btn-func': t.isModel
                  ? function () {
                      return t.$emit('close');
                    }
                  : null,
              },
            }),
            a(
              'div',
              { staticClass: 'page-wrap' },
              [
                t._l(t.trackList, function (e) {
                  return a(
                    'div',
                    {
                      directives: [
                        {
                          name: 'touch',
                          rawName: 'v-touch:swipe',
                          value: t.swipeHandler(e.streamer_id),
                          expression: 'swipeHandler(user.streamer_id)',
                          arg: 'swipe',
                        },
                      ],
                      key: e.streamer_id,
                      staticClass: 'track-info-wrap',
                    },
                    [
                      a(
                        'div',
                        { staticClass: 'track-info' },
                        [
                          a('div', { staticClass: 'user-field' }, [
                            a(
                              'div',
                              {
                                staticClass: 'user',
                                on: {
                                  click: function (a) {
                                    return t.checkCard(e.streamer_id);
                                  },
                                },
                              },
                              [
                                a('Avatar', {
                                  attrs: {
                                    'frame-path': e.frame,
                                    'headphoto-path': e.head_photo,
                                  },
                                }),
                                a('div', { staticClass: 'name' }, [
                                  t._v(t._s(e.alias)),
                                ]),
                              ],
                              1
                            ),
                            a(
                              'div',
                              {
                                class: [
                                  'favorite-btn',
                                  {
                                    'is-favorite': e.is_favorite && !t.isModel,
                                  },
                                ],
                                on: {
                                  click: function (a) {
                                    t.isModel
                                      ? t.useProps(e.streamer_id, e.alias)
                                      : t.setFavorite(e);
                                  },
                                },
                              },
                              [
                                t._v(
                                  ' ' +
                                    t._s(
                                      t.isModel
                                        ? t.$t('S_USER_PORPS')
                                        : t.favBtnText(e.is_favorite)
                                    ) +
                                    ' '
                                ),
                              ]
                            ),
                          ]),
                          t.isModel
                            ? t._e()
                            : a(
                                'transition',
                                { attrs: { name: 'slide-left' } },
                                [
                                  t.openField.includes(e.streamer_id)
                                    ? a(
                                        'div',
                                        {
                                          staticClass: 'open-field',
                                          on: {
                                            click: function (a) {
                                              return t.cancelAttention(
                                                e.streamer_id
                                              );
                                            },
                                          },
                                        },
                                        [
                                          a('span', [
                                            t._v(
                                              t._s(t.$t('S_CANCEL_ATTENTION'))
                                            ),
                                          ]),
                                        ]
                                      )
                                    : t._e(),
                                ]
                              ),
                        ],
                        1
                      ),
                    ]
                  );
                }),
                t.trackList.length
                  ? t._e()
                  : a('NoDataWrap', {
                      attrs: {
                        src: '/images/common/no_data/img_fans_no_data.svg',
                      },
                    }),
              ],
              2
            ),
            a(
              'transition',
              { attrs: { name: 'slide-page-left' } },
              [
                t.targetId
                  ? a('DynamicPage', {
                      attrs: {
                        'target-id': t.targetId,
                        'show-page': t.showPage,
                        'is-streamer-card': t.isStreamerCard,
                      },
                      on: {
                        'update:targetId': function (e) {
                          t.targetId = e;
                        },
                        'update:target-id': function (e) {
                          t.targetId = e;
                        },
                        'update:showPage': function (e) {
                          t.showPage = e;
                        },
                        'update:show-page': function (e) {
                          t.showPage = e;
                        },
                        'update:isStreamerCard': function (e) {
                          t.isStreamerCard = e;
                        },
                        'update:is-streamer-card': function (e) {
                          t.isStreamerCard = e;
                        },
                      },
                    })
                  : t._e(),
              ],
              1
            ),
          ],
          1
        );
      },
      i = [],
      s = a('5530'),
      r =
        (a('d3b7'),
        a('3ca3'),
        a('ddb0'),
        a('a9e3'),
        a('4de4'),
        a('ac1f'),
        a('5319'),
        a('b0c0'),
        a('99af'),
        a('2f62')),
      o = a('7bb4'),
      c = a('93ee'),
      u = a('7150'),
      l = a('ee29'),
      d = a('5061'),
      m = {
        components: {
          DynamicPage: function () {
            return Promise.resolve().then(a.bind(null, '7a96'));
          },
          MainHeader: d['a'],
          Avatar: u['a'],
          NoDataWrap: l['a'],
        },
        props: {
          isModel: { type: Boolean, default: !1 },
          propsId: { type: Number, default: null },
        },
        data: function () {
          return {
            trackList: [],
            openField: [],
            targetId: null,
            showPage: null,
            isStreamerCard: !1,
          };
        },
        computed: Object(s['a'])(
          Object(s['a'])({}, Object(r['d'])(['user'])),
          Object(r['c'])('my', { propsList: 'getPropsList' })
        ),
        created: function () {
          this.initData(),
            this.isModel &&
              this.actionGetPropsList({ lott_id: this.user.lott_id });
        },
        methods: Object(s['a'])(
          Object(s['a'])(
            Object(s['a'])(
              {},
              Object(r['b'])(['actionSetTipMsgInfo', 'actionSetHintInfo'])
            ),
            Object(r['b'])('my', ['actionGetPropsList', 'actionSetProps'])
          ),
          {},
          {
            initData: function () {
              var t = this;
              Object(o['o'])().then(function (e) {
                var a = e.data;
                '0' === a.error_code && (t.trackList = a.result || []);
              });
            },
            swipeHandler: function (t) {
              var e = this;
              return function (a) {
                switch (a) {
                  case 'left':
                    (e.openField = []), e.openField.push(t);
                    break;
                  case 'right':
                    e.openField = e.openField.filter(function (e) {
                      return e !== t;
                    });
                    break;
                  default:
                    break;
                }
              };
            },
            setFavorite: function (t) {
              var e = this,
                a = t.is_favorite ? o['c'] : o['a'],
                n = t.is_favorite
                  ? 'S_CANCEL_FAVORITE_OK'
                  : 'S_ADD_FAVORITE_OK',
                i = t.is_favorite
                  ? t.streamer_id
                  : { streamer_id: t.streamer_id };
              a(i).then(function (t) {
                var a = t.data;
                '0' === a.error_code &&
                  (e.actionSetHintInfo(e.$t(n)), e.initData()),
                  '116020307' === a.error_code &&
                    (e.actionSetHintInfo(a.error_text), e.initData());
              });
            },
            cancelAttention: function (t) {
              var e = this;
              Object(c['b'])({ streamer_id: t }).then(function (t) {
                var a = t.data;
                '0' === a.error_code &&
                  (e.actionSetHintInfo(e.$t('S_CANCEL_ATTENTION_SUCCESS')),
                  e.initData());
              });
            },
            favBtnText: function (t) {
              return t
                ? this.$t('S_CANCEL_FAVORITE')
                : this.$t('S_ADD_FAVORITE');
            },
            checkCard: function (t) {
              this.isModel ||
                ((this.targetId = t),
                (this.showPage = 'card'),
                (this.isStreamerCard = !0));
            },
            useProps: function (t, e) {
              var a,
                n = this,
                i =
                  null ===
                    (a = this.propsList.backpack.filter(function (t) {
                      return t.id === n.propsId;
                    })[0]) || void 0 === a
                    ? void 0
                    : a.name.replace('/n', '');
              this.actionSetTipMsgInfo({
                title: this.$t('S_HINT'),
                content: '是否對 '.concat(e, ' 使用 ').concat(i),
                cancelFunc: function () {
                  return n.actionSetTipMsgInfo(null);
                },
                confirmFunc: function () {
                  n.actionSetTipMsgInfo(null),
                    n
                      .actionSetProps({
                        role: n.user.identity_id,
                        action_id: n.user.lott_id,
                        target_id: t,
                        prop_id: +n.propsId,
                      })
                      .then(function (t) {
                        '0' === t.error_code && n.$emit('close');
                      });
                },
              });
            },
          }
        ),
      },
      _ = m,
      h = (a('3bf0'), a('2877')),
      f = Object(h['a'])(_, n, i, !1, null, '42edb15e', null);
    e['a'] = f.exports;
  },
  c64e: function (t, e, a) {},
  c70f: function (t, e, a) {
    'use strict';
    var n = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { class: ['vip-wrap', { model: t.isModel }] },
          [
            a('MainHeader', {
              staticClass: 'haeder',
              attrs: {
                title: t.$t('S_MEMINFO_LEVEL'),
                'left-btn-func': t.isModel
                  ? function () {
                      return t.$emit('close');
                    }
                  : null,
              },
            }),
            a('div', { staticClass: 'page-wrap' }, [
              a('div', { staticClass: 'top-bg' }, [
                a(
                  'div',
                  { ref: 'choice-swipe-list', staticClass: 'vip-img-wrap' },
                  t._l(t.vipLevels, function (e, n) {
                    return a(
                      'div',
                      {
                        key: 'vip-level-' + e.level,
                        ref: 'type-item',
                        refInFor: !0,
                        staticClass: 'vip-item',
                      },
                      [
                        a('img', {
                          class: [
                            'vip-img',
                            { current: t.currentLevel === e.level },
                          ],
                          attrs: {
                            src: t.$getCdnPath(
                              '/images/mainSite/vip/membervip_' +
                                e.level +
                                '.png'
                            ),
                          },
                          on: {
                            click: function (a) {
                              return t.selectVip(e, n);
                            },
                          },
                        }),
                        n < t.vipLevels.length - 1
                          ? a('div', { staticClass: 'h-line' })
                          : t._e(),
                      ]
                    );
                  }),
                  0
                ),
                a(
                  'div',
                  { staticClass: 'award-wrap' },
                  t._l(t.awardList, function (e, n) {
                    return a('div', {
                      key: 'award-' + n,
                      staticClass: 'award',
                      domProps: { innerHTML: t._s(e) },
                    });
                  }),
                  0
                ),
              ]),
              a(
                'div',
                { staticClass: 'content' },
                [
                  a('div', { staticClass: 'current-level' }, [
                    a('img', {
                      attrs: {
                        src: t.$getCdnPath('/images/mainSite/vip/ic_crown.png'),
                      },
                    }),
                    a('div', [t._v(t._s(t.levelInfo))]),
                  ]),
                  a('div', { staticClass: 'diamond-icon' }, [
                    a('img', {
                      attrs: {
                        src: t.$getCdnPath(
                          '/images/mainSite/common/ic_diamond_b.png'
                        ),
                      },
                    }),
                  ]),
                  a('div', { staticClass: 'label' }, [
                    t._v(
                      ' ' +
                        t._s(
                          t.$t('S_ACCUMULATION_SPEND_DIAMOND') +
                            '(' +
                            t.amountFormat(
                              t.currentLevelData.upgrade_condition
                            ) +
                            ')'
                        ) +
                        ' '
                    ),
                  ]),
                  a('div', { staticClass: 'level-up-label' }, [
                    a('img', {
                      attrs: {
                        src: t.$getCdnPath(
                          '/images/mainSite/vip/img_gradeaward.png'
                        ),
                      },
                    }),
                    a('div', [t._v(t._s(t.$t('S_PROMOTION_REWARD')))]),
                  ]),
                  t._l(t.currentLevelData.upgrade_reward, function (e, n) {
                    return a(
                      'div',
                      { key: 'content-' + n, staticClass: 'upgrades' },
                      [t._v(' ' + t._s(e) + ' ')]
                    );
                  }),
                ],
                2
              ),
              a(
                'div',
                {
                  staticClass: 'btn',
                  on: {
                    click: function (e) {
                      return t.leaveRoomAndToPage('exchangeDiamond');
                    },
                  },
                },
                [t._v(' ' + t._s(t.$t('S_EXCHANGE_DIAMOND')) + ' ')]
              ),
            ]),
          ],
          1
        );
      },
      i = [],
      s = a('2909'),
      r = a('5530'),
      o =
        (a('99af'),
        a('4de4'),
        a('ac1f'),
        a('1276'),
        a('d81d'),
        a('c740'),
        a('7db0'),
        a('49c3')),
      c = a.n(o),
      u = a('2471'),
      l = a('e94e'),
      d = a('7bb4'),
      m = a('5061'),
      _ = {
        components: { MainHeader: m['a'] },
        props: { isModel: { type: Boolean, default: !1 } },
        data: function () {
          return {
            loading: !0,
            currentLevel: 0,
            currentSpend: 0,
            nowData: { content: '' },
            vipLevels: [],
          };
        },
        computed: {
          levelInfo: function () {
            return this.currentLevel > this.nowData.level
              ? 'LEVEL'
                  .concat(this.nowData.level, ' > LEVEL')
                  .concat(this.currentLevel)
              : 'LEVEL'.concat(this.currentLevel);
          },
          currentLevelData: function () {
            var t = this,
              e = this.vipLevels.filter(function (e) {
                return e.level === +t.currentLevel;
              });
            if (e.length) {
              var a = e[0].all_content.split('\n');
              return Object(r['a'])(
                Object(r['a'])({}, e[0]),
                {},
                { upgrade_reward: a }
              );
            }
            return {};
          },
          awardList: function () {
            var t = this.nowData.content
                ? this.nowData.content.split('\n').map(function (t) {
                    return '● '.concat(t);
                  })
                : '',
              e = '● '
                .concat(this.$t('S_ACCUMULATION_SPEND_DIAMOND'), '：<span>')
                .concat(
                  Object(l['amountFormat'])(this.currentSpend),
                  '</span>'
                );
            return (
              this.currentLevel > this.nowData.level &&
                (e += '('
                  .concat(Object(l['amountFormat'])(this.currentSpend), '/')
                  .concat(
                    Object(l['amountFormat'])(
                      this.currentLevelData.upgrade_condition
                    ),
                    ')'
                  )),
              [].concat(Object(s['a'])(t), [e])
            );
          },
        },
        watch: {
          loading: function (t) {
            var e = this;
            t ||
              this.$nextTick(function () {
                e.menuSlide(
                  e.vipLevels.findIndex(function (t) {
                    return t.level === e.nowData.level;
                  })
                );
              });
          },
        },
        created: function () {
          var t = this;
          Object(d['r'])().then(function (e) {
            var a = e.data;
            if ('0' === a.error_code) {
              var n = a.result;
              (t.currentLevel = n.level),
                (t.vipLevels = n.level_list),
                (t.currentSpend = n.current_spend_diamond),
                t.getNowLevel(),
                (t.loading = !1);
            }
          });
        },
        methods: {
          amountFormat: l['amountFormat'],
          leaveRoomAndToPage: function (t) {
            Object(u['b'])(t);
          },
          selectVip: function (t, e) {
            (this.currentLevel = t.level), this.menuSlide(e);
          },
          menuSlide: function (t) {
            var e = this.$refs['choice-swipe-list'],
              a = e.clientWidth,
              n = a / 2,
              i = this.$refs['type-item'][t],
              s = i.clientWidth,
              r = i.offsetLeft,
              o = s / 2,
              u = r < n ? 0 : r - n + o;
            c()([u, 0], { elementToScroll: e });
          },
          getNowLevel: function () {
            var t = this,
              e = this.vipLevels.find(function (e) {
                return e.level === t.currentLevel;
              });
            this.nowData = e;
          },
        },
      },
      h = _,
      f = (a('a52a'), a('2877')),
      p = Object(f['a'])(h, n, i, !1, null, '937d87d6', null);
    e['a'] = p.exports;
  },
  c9a6: function (t, e, a) {
    'use strict';
    a('30b58');
  },
  ca4d: function (t, e, a) {
    'use strict';
    var n = a('2ba1'),
      i = a.n(n);
    a.d(e, 'default', function () {
      return i.a;
    });
  },
  cd4c: function (t, e, a) {},
  ce69: function (t, e, a) {},
  d07f: function (t, e, a) {},
  d175: function (t, e, a) {
    'use strict';
    a.d(e, 'a', function () {
      return n;
    }),
      a.d(e, 'b', function () {
        return i;
      });
    var n = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('router-view');
      },
      i = [];
  },
  d252: function (t, e, a) {
    'use strict';
    a('863c');
  },
  d2ee: function (t, e, a) {
    'use strict';
    a('b119');
  },
  d301: function (t, e, a) {},
  d522: function (t, e, a) {},
  d596: function (t, e, a) {
    'use strict';
    a('587c');
  },
  d8f9: function (t, e, a) {},
  da61: function (t, e, a) {
    'use strict';
    a('603f');
  },
  da83: function (t, e, a) {
    'use strict';
    a('e85f');
  },
  dbc6: function (t, e, a) {
    'use strict';
    a('918b');
  },
  dd8a: function (t, e, a) {},
  e024: function (t, e, a) {},
  e327: function (t, e, a) {
    'use strict';
    a('03e7');
  },
  e48f: function (t, e, a) {
    'use strict';
    a('fa8c');
  },
  e504: function (t, e, a) {
    'use strict';
    a('bfce');
  },
  e587: function (t, e, a) {
    'use strict';
    a('cd4c');
  },
  e623: function (t, e, a) {},
  e79c: function (t, e, a) {
    'use strict';
    var n = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a(
          'div',
          { class: ['leaderboard-wrap', { 'is-pop-up': t.isPopUp }] },
          [
            t.topThree
              ? a(
                  'div',
                  { staticClass: 'top-three-wrap' },
                  t._l(t.topThree, function (e, n) {
                    return a(
                      'div',
                      {
                        key: 'top-' + n,
                        class: ['top-three', { topOne: 1 === n }],
                        on: {
                          click: function (a) {
                            return t.checkCard(e);
                          },
                        },
                      },
                      [
                        a('div', { staticClass: 'avatar-wrap' }, [
                          a('img', {
                            staticClass: 'top-background',
                            attrs: {
                              src: t.$getCdnPath(
                                '/images/common/no' + n + '.png'
                              ),
                            },
                          }),
                          a('img', {
                            directives: [
                              {
                                name: 'lazy',
                                rawName: 'v-lazy',
                                value: {
                                  src: e.head_photo,
                                  error: t.errorPath,
                                },
                                expression:
                                  '{\n                        src: item.head_photo,\n                        error: errorPath\n                    }',
                              },
                            ],
                            staticClass: 'top-avatar',
                          }),
                        ]),
                        a('div', { staticClass: 'user-wrap' }, [
                          a(
                            'div',
                            { staticClass: 'badges-wrap' },
                            t._l(e.badges, function (t, e) {
                              return a('img', {
                                key: 'vip-' + n + '-' + e,
                                staticClass: 'vip-img',
                                attrs: { src: t },
                              });
                            }),
                            0
                          ),
                          a('div', { staticClass: 'user-name' }, [
                            t._v(' ' + t._s(e.alias) + ' '),
                          ]),
                        ]),
                        e.id
                          ? a('div', { staticClass: 'money-area' }, [
                              t.isShowDiamond
                                ? a(
                                    'div',
                                    { class: ['top-money', 'diamond'] },
                                    [
                                      t._v(
                                        ' ' +
                                          t._s(
                                            t._f('amountFormat')(e.diamond, {
                                              zeroStuffing: !1,
                                            })
                                          ) +
                                          ' '
                                      ),
                                    ]
                                  )
                                : t._e(),
                              t.isShowBubble
                                ? a('div', { staticClass: 'top-money' }, [
                                    t._v(
                                      ' ' +
                                        t._s(
                                          t._f('amountFormat')(e.paopao, {
                                            zeroStuffing: !1,
                                          })
                                        ) +
                                        ' '
                                    ),
                                  ])
                                : t._e(),
                            ])
                          : t._e(),
                      ]
                    );
                  }),
                  0
                )
              : t._e(),
            t._l(t.otherUser, function (e, n) {
              return a(
                'div',
                {
                  key: 'user-' + n,
                  staticClass: 'user-item',
                  on: {
                    click: function (a) {
                      return t.checkCard(e);
                    },
                  },
                },
                [
                  a('span', { staticClass: 'index' }, [t._v(t._s(n + 4))]),
                  a('Avatar', {
                    attrs: {
                      'frame-path': e.frame,
                      'headphoto-path': e.head_photo,
                    },
                  }),
                  a(
                    'div',
                    { staticClass: 'user-info' },
                    [
                      t._l(e.badges, function (t, e) {
                        return a('img', {
                          key: 'vip-' + n + '-' + e,
                          staticClass: 'vip-img',
                          attrs: { src: t },
                        });
                      }),
                      a('span', { staticClass: 'user-name' }, [
                        t._v(t._s(e.alias)),
                      ]),
                    ],
                    2
                  ),
                  e.id
                    ? a('div', { staticClass: 'money-wrap' }, [
                        t.isShowDiamond
                          ? a('div', { class: ['money', 'diamond'] }, [
                              a('div', [
                                t._v(t._s(t._f('amountFormat')(e.diamond))),
                              ]),
                              a('img', {
                                attrs: {
                                  src: t.$getCdnPath(
                                    '/images/common/ic_diamond.svg'
                                  ),
                                },
                              }),
                            ])
                          : t._e(),
                        t.isShowBubble
                          ? a('div', { staticClass: 'money' }, [
                              a('div', [
                                t._v(t._s(t._f('amountFormat')(e.paopao))),
                              ]),
                              a('img', {
                                attrs: {
                                  src: t.$getCdnPath(
                                    '/images/common/ic_bubble.svg'
                                  ),
                                },
                              }),
                            ])
                          : t._e(),
                      ])
                    : t._e(),
                ],
                1
              );
            }),
          ],
          2
        );
      },
      i = [],
      s = (a('d81d'), a('fb6a'), a('caad'), a('7150')),
      r = {
        components: { Avatar: s['a'] },
        props: {
          leaderboard: { type: String, required: !0 },
          isPopUp: { type: Boolean, default: !1 },
          data: {
            type: Array,
            default: function () {
              return [];
            },
          },
        },
        computed: {
          topThree: function () {
            var t = this,
              e = {
                alias: this.$t('S_WAIT_USER'),
                head_photo: this.$getCdnPath(
                  '/images/material/img_login@2x.png'
                ),
              },
              a = [2, 1, 3],
              n = a.map(function (a) {
                return t.data[a - 1] ? t.data[a - 1] : e;
              });
            return n;
          },
          otherUser: function () {
            var t = this.data.slice(3, this.data.length),
              e = this.data.slice(3, this.data.length).length,
              a = {
                alias: this.$t('S_WAIT_USER'),
                head_photo: this.$getCdnPath(
                  '/images/material/img_login@2x.png'
                ),
              };
            if (t.length < 27) for (var n = 1; n <= 27 - e; n += 1) t.push(a);
            return t;
          },
          isShowDiamond: function () {
            return ['anchor', 'richer', 'diamond'].includes(this.leaderboard);
          },
          isShowBubble: function () {
            return ['anchor', 'paopao'].includes(this.leaderboard);
          },
          errorPath: function () {
            return this.$getCdnPath('/images/material/paopao@2x.png');
          },
        },
        methods: {
          checkCard: function (t) {
            t.id && this.$emit('openCard', t);
          },
        },
      },
      o = r,
      c = (a('5165'), a('2877')),
      u = Object(c['a'])(o, n, i, !1, null, 'd520493e', null);
    e['a'] = u.exports;
  },
  e85f: function (t, e, a) {},
  e94e: function (t, e, a) {
    'use strict';
    a.r(e),
      a.d(e, 'amountFormat', function () {
        return n;
      });
    a('0d03'), a('d3b7'), a('25f0'), a('ac1f'), a('5319');
    var n = function () {
      var t =
          arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
        e =
          arguments.length > 1 && void 0 !== arguments[1]
            ? arguments[1]
            : { zeroStuffing: !1 },
        a = t.toString();
      return (
        e.zeroStuffing &&
          ((a = a.replace(/^(\d*)$/, '$1.')),
          (a = ''.concat(a, '0').replace(/(\d*\.\d{2})\d*/, '$1'))),
        a.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      );
    };
  },
  e9cc: function (t, e, a) {},
  ebf7: function (t, e, a) {
    'use strict';
    a.d(e, 'a', function () {
      return u;
    }),
      a.d(e, 'e', function () {
        return l;
      }),
      a.d(e, 'd', function () {
        return d;
      }),
      a.d(e, 'b', function () {
        return m;
      }),
      a.d(e, 'f', function () {
        return _;
      }),
      a.d(e, 'c', function () {
        return h;
      });
    var n = a('2909'),
      i =
        (a('ac1f'),
        a('5319'),
        a('0d03'),
        a('d3b7'),
        a('25f0'),
        a('4de4'),
        a('99af'),
        a('d81d'),
        a('1276'),
        a('caad'),
        a('2532'),
        a('466d'),
        a('3452')),
      s = a.n(i),
      r = a('3aee'),
      o = a('2471'),
      c = a('4360'),
      u = function (t, e, a) {
        if (t.length <= e) return t;
        if (a + e <= t.length)
          return t.filter(function (t, n) {
            return n >= a && n < a + e;
          });
        var i = a % t.length;
        return i + e > t.length
          ? [].concat(
              Object(n['a'])(
                t.filter(function (t, e) {
                  return e >= i;
                })
              ),
              Object(n['a'])(
                t.filter(function (n, i) {
                  return i < (a + e) % t.length;
                })
              )
            )
          : t.filter(function (t, a) {
              return a >= i && a < i + e;
            });
      },
      l = function (t) {
        var e = t.map(function (t, e) {
          return {
            account: t.account,
            headphoto: t.head_photo,
            nickname: t.nickname,
            onlineNum: t.online_num,
            roomId: t.stream_id,
            startTime: t.start_time,
            status: t.status,
            streamTitle: t.stream_title,
            streamerId: t.streamer_id,
            type: t.type,
            tags: t.tags.length ? t.tags.split(',') : [],
            game: t.game,
            charge: t.charge,
            openAttention: t.open_attention,
            openGuardians: t.open_guardians,
            backgroundImg: t.background_image,
            index: e,
          };
        });
        return e;
      },
      d = function () {
        c['a'].dispatch('actionSetTipMsgInfo', {
          content: r['a'].t('S_GO_REGISTER_TIP'),
          cancelText: r['a'].t('S_CANCEL'),
          confirmText: r['a'].t('S_GO_REGISTER'),
          cancelFunc: function () {
            return c['a'].dispatch('actionSetTipMsgInfo', null);
          },
          confirmFunc: function () {
            c['a'].dispatch('actionSetTipMsgInfo', null),
              o['a'].jsToAppMessage({
                event: 'EVENT_GUEST_REGISTER',
                data: 'Please login or signup',
              });
          },
        });
      },
      m = function (t) {
        var e = s.a.enc.Utf8.parse('R3n9ouGj'),
          a = s.a.DES.decrypt({ ciphertext: s.a.enc.Hex.parse(t) }, e, {
            mode: s.a.mode.ECB,
            padding: s.a.pad.Pkcs7,
          });
        return a.toString(s.a.enc.Utf8);
      },
      _ = function () {
        var t = 0.01 * window.innerHeight;
        document.documentElement.style.setProperty('--vh', ''.concat(t, 'px'));
      },
      h = function () {
        var t,
          e,
          a,
          n,
          i,
          s = window.navigator.userAgent.toLowerCase();
        return s.includes('msie')
          ? {
              type: 'IE',
              version:
                null === (t = s.match(/msie ([\d.]+)/)) || void 0 === t
                  ? void 0
                  : t[1],
            }
          : s.includes('firefox')
          ? {
              type: 'Firefox',
              version:
                null === (e = s.match(/firefox\/([\d.]+)/)) || void 0 === e
                  ? void 0
                  : e[1],
            }
          : s.includes('chrome')
          ? {
              type: 'Chrome',
              version:
                null === (a = s.match(/chrome\/([\d.]+)/)) || void 0 === a
                  ? void 0
                  : a[1],
            }
          : s.includes('opera')
          ? {
              type: 'Opera',
              version:
                null === (n = s.match(/opera.([\d.]+)/)) || void 0 === n
                  ? void 0
                  : n[1],
            }
          : s.includes('safari')
          ? {
              type: 'Safari',
              version:
                null === (i = s.match(/version\/([\d.]+)/)) || void 0 === i
                  ? void 0
                  : i[1],
            }
          : { type: '', version: 0 };
      };
  },
  ecb6: function (t, e, a) {
    'use strict';
    a('aab8');
  },
  ee0f: function (t, e, a) {
    t.exports = {
      'card-wrap': 'userInfoCard_card-wrap_1BfCj',
      content: 'userInfoCard_content_3jeHd',
      'bg-img': 'userInfoCard_bg-img_3YJZ-',
      'avatar-wrap': 'userInfoCard_avatar-wrap_1Wosv',
      'info-top': 'userInfoCard_info-top_1WoD4',
      'user-name': 'userInfoCard_user-name_2rB0w',
      'user-id': 'userInfoCard_user-id_2Sm_h',
      'next-time': 'userInfoCard_next-time_219mq',
      'info-vip': 'userInfoCard_info-vip_K1Z_p',
      btn: 'userInfoCard_btn_rkZyb',
      vip: 'userInfoCard_vip_1iMxi userInfoCard_btn_rkZyb',
      'item-info': 'userInfoCard_item-info_11j6V',
      item: 'userInfoCard_item_3AMh-',
      amount: 'userInfoCard_amount_2i1hn',
      slogan: 'userInfoCard_slogan_9V0Va',
      'info-title': 'userInfoCard_info-title_2w_-a',
      'info-item': 'userInfoCard_info-item_H5bv8',
      label: 'userInfoCard_label_1ecpp',
      follow: 'userInfoCard_follow_2yFkJ',
    };
  },
  ee29: function (t, e, a) {
    'use strict';
    var n = function () {
        var t = this,
          e = t.$createElement,
          a = t._self._c || e;
        return a('div', { staticClass: 'no-data' }, [
          a('div', [
            a('img', { attrs: { src: t.$getCdnPath(t.src) } }),
            a('div', { staticClass: 'text' }, [
              t._v(t._s(t.text || t.$t('S_NO_DATA'))),
            ]),
          ]),
        ]);
      },
      i = [],
      s = {
        props: {
          text: { type: String, default: null },
          src: { type: String, default: '/images/common/img_not_find.svg' },
        },
      },
      r = s,
      o = (a('c41d'), a('2877')),
      c = Object(o['a'])(r, n, i, !1, null, '65673be4', null);
    e['a'] = c.exports;
  },
  f001: function (t, e, a) {
    'use strict';
    a('d8f9');
  },
  f00c: function (t, e, a) {
    'use strict';
    a('48ec');
  },
  f24e: function (t, e, a) {},
  f2f4: function (t, e, a) {},
  f735: function (t, e, a) {
    'use strict';
    a('27d7');
  },
  f794: function (t, e, a) {},
  f8b8: function (t, e, a) {},
  f8f4: function (t, e, a) {},
  f8f9: function (t, e, a) {},
  fa8a: function (t, e, a) {},
  fa8c: function (t, e, a) {},
  fc13: function (t, e, a) {},
});
