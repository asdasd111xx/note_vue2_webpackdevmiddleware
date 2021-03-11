export default {
  // 判斷極速版、pwa、webclip
  getIsPwa: state => state.isPwa,
  // Webview介接(客端、廳主端)
  getIsWebview: state => state.isWebview,
  getCurLang: state => state.curLang,
  getSidebarWidth: state => state.sidebarWidth,
  // 環境 (會員端/代理客端)
  getEnv: state => state.env,
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  //     後台(mangosteen_front)共用
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  // 是否為後台
  getIsBackEnd: state => state.isBackEnd,
  // 是否為預覽
  getIsPreview: state => state.preview,
  getNowtpl: state => state.nowtpl,
  getWebInfo: state => state.webInfo,
  // 取 cdn 路徑
  getCdnDomain: state => state.webInfo.cdn_domain,
  getCdnRoot: state => state.cdnRoot,
  getLang: state => state.webInfo.language,
  getSpecialCase: state => state.webInfo.special_case,
  getFloatPic: state => state.webInfo.special_case,
  getOnlineService: state => ({
    width: state.webInfo.on_service_w,
    height: state.webInfo.on_service_h,
    url: state.webInfo.on_service_url
  }),
  getBackground: state => ({
    bg_align: state.webInfo.bg_align,
    bg_color: state.webInfo.bg_color,
    isbgColor: state.webInfo.bg_has_color || "",
    bg_img: state.webInfo.bg_img,
    bg_repeat: state.webInfo.bg_repeat,
    bg_scroll: state.webInfo.bg_scroll
  }),
  getPage: state => state.webInfo.page || {},
  getPageData: state => state.webInfo.pageData,
  // 取得訪客開關
  getReadOnly: state => state.memInfo.config.read_only,
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  //     字型對照表
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  getTplTxtStyle: state => state.tplTxtStyle,
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  //     遊戲資料
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  getGameData: state => state.gameData,
  getSportData: state => ({
    bbsport: state.gameData.bbsport,
    sunplus: state.gameData.sunplus,
    nbb: state.gameData.nbb
    // cb: state.gameData.cb,
  }),
  getCasinoData: state => ({
    bbcasino: state.gameData.bbcasino,
    mg: state.gameData.mg,
    gns: state.gameData.gns,
    isb: state.gameData.isb,
    pt: state.gameData.pt,
    ag_casino: state.gameData.ag_casino,
    jdb: state.gameData.jdb,
    pp: state.gameData.pp,
    hb: state.gameData.hb,
    cq9: state.gameData.cq9
  }),
  getLiveData: state => ({
    bblive: state.gameData.bblive,
    ag: state.gameData.ag,
    og: state.gameData.og,
    ab: state.gameData.ab,
    gd: state.gameData.gd,
    bg: state.gameData.bg
  }),
  getLotteryData: state => ({
    lottery: state.gameData.lottery
  }),
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  //     電子彩金
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  getJackpot: state => state.jackpot,
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  //     客端 page
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  // 客端-當前頁
  getNowpage: state => state.nowpage,
  // 客端- custom頁排序
  getContentMapping: state => state.contentMapping,
  // 客端-電子頁-供應商
  getCasinoVendor: state => state.casinoVendor,
  // 客端-優惠頁-全部資料
  getPromotion: state => state.promotion,
  // 客端-共通-取加入最愛的遊戲列表
  getFavoriteGame: state => state.favoriteGame,
  // 客端-共通-取下方遊戲框顯示狀態
  getCollectionStatus: state => state.showCollection,
  // 會員中心-存款連結
  getMcenterDeposit: state => state.mcenterDeposit,
  // getBbopData: state => state.gameData.bbop
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  //     會員、代理 共用
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  // 會員、代理共用-重設密碼 欄位
  getPwdResetInfo: state => state.pwdResetInfo,
  // 會員、代理共用-系統時間
  getSystemTime: state => state.systemTime,
  // 會員、代理共用-彈出視窗-類別
  getPopType: state => state.pop.type,
  // 會員、代理共用-彈出視窗-資料
  getPopData: state => state.pop.data,
  // 會員、代理共用-取款-手機驗證
  getMobileCheck: state => state.mobileCheck,
  // 會員、代理共用-最新消息彈出視窗
  getNewsPopControl: state => state.newsPopControl,
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  //     MEM 會員相關
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  // 會員資訊
  getMemInfo: state => state.memInfo,
  // 取會員額度
  getMemBalance: state => state.memInfo.balance,
  // 取會員幣別
  getMemCurrency: state => state.memInfo.cash.currency,
  // 會員端-登入狀態
  getLoginStatus: state => state.loginStatus,
  // 會員端-跑馬燈 (首頁)
  getNews: state => state.news,
  // 會員端-跑馬燈 (充值/提現)
  getAnnouncementList: state => state.announcementList,
  // 會員端-公告
  getPost: state => state.post,
  // 會員端-使用者層級
  getUserLevels: state => state.userLevels,
  // 會員端-帳戶資料欄位開關
  getMemUserConfig: state => state.memUserConfig,
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  //  AGENT 代理相關
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  // 代理資訊
  getAgentInfo: state => state.agentInfo,
  // 代理端-登入狀態
  getAgentIsLogin: state => state.agentIsLogin,
  // 代理端-跑馬燈
  getAgentNews: state => state.agentNews,
  // 代理端-公告
  getAgentPost: state => state.agentPost,
  // 代理端-使用者層級
  getAgentUserLevels: state => state.agentUserLevels,
  // 代理端-帳戶資料欄位開關
  getAgentUserConfig: state => state.agentUserConfig,
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  //     MCENTER 會員中心
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  // 會員中心-左側列表
  getMcenterList: state => state.mcenterList,
  // 會員中心-帳戶資料-欄位
  getMcenterAccount: state => state.mcenterAccount,
  // 會員中心-我的返水-當前頁籤 (返水歷史/實時返水)
  getMcenterBankRebateType: state => state.mcenterBankRebate.type,
  // 會員中心-我的返水-返水歷史 (今日/昨日/最近一周)
  getMcenterBankRebateInterval: state => state.mcenterBankRebate.interval,
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  //     AGCENTER 代理中心
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  // 代理中心-左側列表
  getAgcenterList: state => state.agcenterList,
  // 代理中心-取款 選定期數
  getAgcenterWdPeriod: state => state.agcenterWdPeriod,
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  //     APP下載資料
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  getAppInfo: state => state.appInfo,
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  //     手機資料
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  getMobileInfo: state => state.mobileInfo,
  // 設定網站設定檔
  getSiteConfig: state => state.siteConfig,
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  //     推播中心資料
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  getNoticeData: state => state.noticeData,
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  //    綜合 vip 資料
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  getVip: state => state.vip,
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  //    所有 vip 資料
  // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
  getAllVip: state => state.allVip,
  // 是否Loading
  getIsLoading: state => state.isLoading,
  // 會員中心-個人資料-手機/姓名/信箱 綁定成功訊息
  getMcenterBindMessage: state => state.mcenterBindMessage,
  // 推廣連結
  getAgentLink: state => state.agentLink,
  getYaboConfig: state => state.yaboConfig,
  getGlobalMessage: state => state.globalMessage,
  getRechargeConfig: state => state.rechargeConfig,
  getHasBank: state => state.hasBank,
  getVideoBounsPageStatus: state => state.videoBounsPageStatus,
  getMemInfoV3: state => state.memInfoV3,
  getRechargeBonusConfig: state => state.rechargeBonusConfig, //取得廳首次額度轉讓優惠設定
  getSystemDomain: state => state.systemDomain,
  getPornDomain: state => state.pornDoamin,
  getPromotionLink: state => state.promotionLink,
  getBBOSDomain: state => state.BBosDomain,
  getSwagConfig: state => state.swagConfig,
  getSwagBalance: state => state.swagBalance
};
