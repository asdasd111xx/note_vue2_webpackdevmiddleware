const component = () =>
  import(/* webpackChunkName: 'component' */ "../components/route/normal");

export default [
  {
    // 首頁
    path: "home",
    alias: "",
    name: "home",
    component
  },
  {
    // 關於我們
    path: "about",
    name: "about",
    component
  },
  {
    // 聯繫我們
    path: "contact",
    name: "contact",
    component
  },
  {
    // 代理登入
    path: "aglogin",
    name: "agLogin",
    component
  },
  // 強檔活動大廳
  {
    path: "activity/:vendor?",
    name: "activity",
    component
  },
  // 熱門大廳
  {
    path: "hotLobby/:vendor?",
    name: "hotLobby",
    component
  },
  {
    // 棋牌大廳
    path: "card/:vendor?",
    name: "card",
    component
  },
  {
    // 麻將大廳
    path: "mahjong/:vendor?",
    name: "mahjong",
    component
  },
  {
    // 電子大廳
    path: "casino/:vendor?/:type?",
    name: "casino",
    component
  },
  {
    // 捕魚大廳
    path: "fisharea",
    name: "fisharea",
    component
  },
  {
    // 切換語系
    path: "changeLang",
    name: "changeLang",
    component
  },
  {
    // 忘記密碼
    path: "forgetpwd/:type",
    name: "forgetPwd",
    component
  },
  {
    // 加入代理
    path: "joinagent",
    name: "joinAgent",
    component
  },
  {
    // 加入會員
    path: "joinmember",
    name: "joinMember",
    component
  },
  {
    // 登入
    path: "login",
    name: "login",
    component
  },
  {
    // 註冊
    path: "register",
    name: "register",
    component
  },
  {
    // 登入
    path: "mobileLogin",
    name: "mobileLogin",
    component
  },
  {
    // 最新消息
    path: "news",
    name: "news",
    component
  },
  {
    // 優惠
    path: "promotion",
    name: "promotion",
    component
  },
  {
    // 重設密碼
    path: "resetpwd",
    name: "resetPwd",
    component
  },
  {
    // 合營計畫
    path: "agent",
    name: "agent",
    component
  },
  {
    // VIP 詳情
    path: "vip",
    name: "vip",
    component
  },
  {
    // 影片播放頁
    path: "videoPlay/:id?",
    name: "videoPlay",
    component
  },
  {
    // 影片列表頁
    path: "videoList",
    name: "videoList",
    component
  },
  {
    // 發現頁
    path: "discover/:page?",
    name: "discover",
    component
  },
  {
    // 女優資訊頁
    path: "artist/:id",
    name: "artist",
    component
  },
  {
    // 關鍵字搜尋影片頁
    path: "search",
    name: "search",
    component
  },
  {
    // 標籤搜尋影片頁
    path: "tag/:key",
    name: "tag",
    component
  },
  {
    // 直播頁
    path: "liveStream",
    name: "liveStream",
    component
  },
  {
    // 備用網址
    path: "domain",
    name: "mobileDomain",
    component
  },
  /* 新增 */
  {
    // 客服
    path: "service",
    name: "service",
    component
  },
  {
    // App 客服
    path: "webview",
    name: "webview",
    component
  },
  {
    // App 安裝頁面
    path: "install",
    name: "install",
    component
  },
  {
    path: "shareDownload",
    name: "shareDownload",
    component
  },
  {
    // 起始頁
    path: "launch",
    name: "launch",
    component
  },
  {
    path: "gift",
    name: "gift",
    component
  },
  {
    path: "gift/detail/:key?",
    name: "giftDetail",
    component
  },
  {
    path: "withdrawAccount",
    name: "withdrawAccount",
    component
  },
  {
    path: "iframe/:page?/:type?",
    name: "iframe",
    component
  },

  // 泡泡
  {
    path: "live",
    name: "live",
    redirect: "/mobile/live/home",
    component,
    children: [
      {
        path: "home",
        name: "liveHome",
        component
      },
      {
        path: "iframe/:page?",
        name: "liveIframe",
        component
      }
    ]
  }
];
