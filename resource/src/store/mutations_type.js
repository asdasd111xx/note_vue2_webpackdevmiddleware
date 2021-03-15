// Webview介接(客端、廳主端)
export const SETWEBVIEW = "SETWEBVIEW";
// 環境 (會員端/代理客端)
export const SETENV = "SETENV";
// 後台資料
export const SETWEBINFO = "SETWEBINFO";
// 設定取預覽的自改資料
export const SETPREVIEW = "SETPREVIEW";
// 設定是否透過外面CDN廠商代理
export const SETCDNROOT = "SETCDNROOT";
// 遊戲資料
export const SETGAMEDATA = "SETGAMEDATA";

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     客端 page
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 客端-當前頁
export const CHANGEPAGE = "CHANGEPAGE";
// 客端-電子頁-供應商
export const SETCASINOVENDOR = "SETCASINOVENDOR";
// 客端-電子頁-API讀取狀態
export const SETCASINOLOADINGSTATUS = "SETCASINOLOADINGSTATUS";
// 客端-優惠頁-全部資料
export const SETPROMOTION = "SETPROMOTION";

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     會員、代理 共用
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 會員、代理共用-系統時間
export const SETSYSTEMTIME = "SETSYSTEMTIME";
// 會員、代理共用-彈出視窗
export const SETPOP = "SETPOP";
// 會員、代理共用-手機驗證
export const SETMOBILECHECK = "SETMOBILECHECK";
// 會員、代理共用-最新消息彈出視窗
export const NEWSPOPCONTROL = "NEWSPOPCONTROL";

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     MEM 會員相關
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 會員端-會員資料
export const SETMEMINFO = "SETMEMINFO";
// 會員端-登入狀態
export const ISLOGIN = "ISLOGIN";
// 會員端-會員餘額
export const SETUSERBALANCE = "SETUSERBALANCE";
// 會員端-跑馬燈 (首頁)
export const SETNEWS = "SETNEWS";
// 會員端-跑馬燈 (存款/提現)
export const SET_ANNOUNCEMENTLIST = "SET_ANNOUNCEMENTLIST";
// 會員端-公告
export const SETPOST = "SETPOST";
// 會員端-加入最愛的遊戲列表
export const SETFAVORITEGAME = "SETFAVORITEGAME";
// 會員端-設定下方遊戲框顯示狀態
export const SET_COLLECTION_STATUS = "SET_COLLECTION_STATUS";
// 會員端-使用者層級
export const SET_USER_LEVELS = "SET_USER_LEVELS";
// 會員端-帳戶資料欄位開關
export const SET_MCENTER_USER_CONFIG = "SET_MCENTER_USER_CONFIG";
// 會員端-會員資料 v3
export const SETMEMINFOV3 = "SETMEMINFOV3";
export const SET_WEB_DOMAIN = "SET_WEB_DOMAIN";
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     AGENT 代理相關
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 代理端-代理資料
export const SETAGENTMEMINFO = "SETAGENTMEMINFO";
// 代理端-登入狀態
export const SETAGENTLOGIN = "SETAGENTLOGIN";
// 代理端-跑馬燈
export const SETAGENTNEWS = "SETAGENTNEWS";
// 代理端-公告
export const SETAGENTPOST = "SETAGENTPOST";
// 代理端-使用者層級
export const SET_AGENT_USER_LEVELS = "SET_AGENT_USER_LEVELS";
// 代理端-帳戶資料欄位開關
export const SET_AGENT_USER_CONFIG = "SET_AGENT_USER_CONFIG";

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     MCENTER 會員中心
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 會員中心-未讀訊息
export const SETMCENTERMSGCOUNT = "SETMCENTERMSGCOUNT";
// 會員中心-我的返水-當前頁籤 (返水歷史/實時返水)
export const SETMCENTERBANKREBATE = "SETMCENTERBANKREBATE";
// 會員中心-我的返水
export const SETMCENTERREBATE = "SETMCENTERREBATE";
// 會員中心-存款
export const SET_MCENTER_DEPOSIT = "SET_MCENTER_DEPOSIT";
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     AGCENTER 代理中心
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 代理中心-未讀訊息
export const SETAGCENTERMSGCOUNT = "SETAGCENTERMSGCOUNT";
// 代理中心-會員連動帳號
export const SETAGCENTERMEMUSERNAME = "SETAGCENTERMEMUSERNAME";
// 代理中心-代理連結(推廣網址)、合營連結
export const SETAGCENTERLINKS = "SETAGCENTERLINKS";
// 代理中心-代理中心-取款 選定期數
export const SETAGCENTERWDPERIOD = "SETAGCENTERWDPERIOD";

export const ADD_CASE_ITEM = "ADD_CASE_ITEM";
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     APP下載頁資料
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// APP下載連結資訊
export const SET_APP_DOWNLOAD_INFO = "SET_APP_DOWNLOAD_INFO";

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     QR Code資料
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// QR Code資訊
export const SET_APP_QRCODE = "SET_APP_QRCODE";

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     手機資料
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
export const SETMOBILEINFO = "SETMOBILEINFO";

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     電子彩金
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 設定電子彩金資料
export const SETJACKPOT = "SETJACKPOT";

// 設定網站設定檔
export const SETSITECONFIG = "SETSITECONFIG";

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     推播中心資料
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
export const SETNOTICEDATA = "SETNOTICEDATA";

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     VIP 資料
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
export const SET_VIP = "SET_VIP";

export const SET_ISLOADING = "SET_ISLOADING";

// 會員中心-個人資料-手機/姓名/信箱 綁定成功訊息
export const SET_MCENTER_BIND_MESSAGE = "SET_MCENTER_BIND_MESSAGE";

export const SET_AGENTLINK = "SET_AGENTLINK";
export const SET_YABOCONFIG = "SET_YABOCONFIG";
export const SET_GLOBALMESSAGE = "SET_GLOBALMESSAGE";
export const SET_RECHARGECONFIG = "SET_RECHARGECONFIG";
export const SET_HASBANK = "SET_HASBANK";
export const SET_VIDEO_BOUNS_PAGE_STATUS = "SET_VIDEO_BOUNS_PAGE_STATUS";
export const SET_RECHARGEBONUSCONFIG = "SET_RECHARGEBONUSCONFIG";
export const SET_SYSTEMDOMAIN = "SET_SYSTEMDOMAIN";
export const SET_PORNDOMAIN = "SET_PORNDOMAIN";
export const SET_SWAG_CONFIG = "SET_SWAG_CONFIG";
export const SET_SWAG_BALANCE = "SET_SWAG_BALANCE";
export const SET_PROMOTION_LINK = "SET_PROMOTION_LINK";
export const SET_BBOSDOMAIN = "SET_BBOSDOMAIN";
