// cdn
export const API_CDN = '/cdn';

// 取得圖片連結
export const API_IMG = '/api/v1/image';

// 系統時間
export const API_SYSTEM_TIME = '/api/v1/c/tool/datetime';

// 遊戲開關
export const API_GAME_SWITCH = '/api/v1/c/vendors';

// 遊戲連結.取各別額度
export const API_GET_VENDOR = '/api/v1/c/vendor';

// 依指定遊戲回傳有開放的遊戲列表
export const API_GET_GAMES = '/api/v1/c/games';

// 取近期開啟過的遊戲列表
export const API_GET_RECENT_GAME = '/api/v1/c/recent_game';

// 取得熱門遊戲(廳主推薦)模塊清單
export const API_GET_CUSTOMIZED_HOT_GAME = '/api/v1/c/vendor/all/recommend/games';

// 我的最愛遊戲
export const API_FAVORITE_GAME = '/api/v1/c/favorite_game';

// 驗證碼
export const API_CAPTCHA = '/api/v1/captcha';

// 優惠
export const API_PROMOTION_ALL = '/api/v1/c/activities';
export const API_PROMOTION_IMG = '/api/v1/image';
export const API_PROMOTION_MEM = '/api/v1/c/player/activity';
export const API_PROMOTION_POP = '/api/v1/c/activity';
export const API_PROMOTION_URL = '/api/v1/c/link/activity';

// 會員.代理 是否綁定銀行卡
export const API_BANK_CARD_CHECK = '/api/v1/c/user/has-bank';

// 取opcode對照文字 (目前 會員中心-資金明細-類別名稱 使用)
export const API_OPCODE_TEXT = '/api/v1/c/opcodes';


// 列出使用者所有綁定裝置
export const API_AGENT_SLIDE_DEVICE_LIST = '/api/v1/c/user/slide/device';

// 修改裝置綁定名稱
export const API_AGENT_MODIFY_SLIDE_DEVICE = '/api/v1/c/slide/binding/name';

// 移除綁定裝置
export const API_AGENT_DELETE_SLIDE_DEVICE = '/api/v1/c/slide/binding';

// 取得遊戲平台分類
export const API_GET_GAME_TYPE = '/api/game-type';
// 取得遊戲平台分類的遊戲列表
export const API_GET_GAME_LIST = '/api/game-detail2';
// 取得遊戲平台分類的遊戲詳細資料
export const API_GET_GAME_INFO = '/api/game-block';

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     MEM 會員相關
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 加入會員、會員資訊
export const API_MEMBER = '/api/v1/c/player';

// 加入會員欄位開關
export const API_JOINMEM_CONFIG = '/api/v1/c/player/user_register_config';

// 會員中心-帳戶資料欄位開關
export const API_MCENTER_USER_CONFIG = '/api/v1/c/player/user_info_config/with_verify';

// 會員中心 - 會員帳號啟用暱稱顯示
export const API_MCENTER_ENABLE_ALIAS = '/api/v1/c/player/alias/enable';

// 會員中心 - 會員帳號關閉暱稱顯示
export const API_MCENTER_DISABLE_ALIAS = '/api/v1/c/player/alias/disable';

// 登入 - 安全防護
export const API_LOGIN_CHECK = '/api/v1/client/login/check';

// 登入
export const API_LOGIN = '/api/v1/client/login';

// 登出
export const API_LOGOUT = '/api/v1/client/logout';

// 手機登入驗證
export const API_MOBILE_LOGIN = '/api/v1/client/phone/verify/login';

// 發驗證碼給手機
export const API_MOBILE_CAPTCHA = '/api/v1/client/login/phone/verify';

// 取得國家碼
export const API_COUNTRY_CODE = '/api/v1/c/player/country_codes';

// 跑馬燈
export const API_GET_NEWS = '/api/v1/c/player/news/list';

// 公告
export const API_GET_POST = '/api/v1/c/player/announcement';

// 忘記密碼
export const API_PWD_FORGET = '/api/v1/c/player/forget/password';

// 忘記密碼手機簡訊
export const API_PWD_FORGET_MOBILE = '/api/v1/c/player/forget/password/sms';

// 忘記密碼手機簡訊
export const API_PWD_MOBILE_VERIFY = '/api/v1/c/player/forget/password/sms/verify';

// 重設密碼-簡訊
export const API_PWD_MOBILE_RESET = '/api/v1/c/player/password/reset/sms';

// 重設密碼
export const API_PWD_RESET = '/api/v1/c/player/password/reset';

// 彈跳公告訊息
export const API_MEMBER_ANNOUNCEMENT = '/api/v1/c/player/popup-announcement';

// 最新已派發佣金明細
export const API_COMMISSION_LAST = '/api/v1/c/wage/last/dispatch';

// 佣金明細列表
export const API_COMMISSION_LIST = '/api/v1/c/wage/entry/list';

// 特定期數各好友層級有效投注總額及佣金總額
export const API_COMMISSION_LEVEL_LIST = '/api/v1/c/wage/amount_per_depth';

// 特定期數一級好友有效投注額及佣金列表
export const API_COMMISSION_FIRST_LEVEL_LIST = '/api/v1/c/wage/entry';

// 會員推廣資訊
export const API_PROMOTION_INFO = '/api/v1/c/player/promotion';

// 下層好友總覽
export const API_MANAGEMENT_FRIENDS_STATISTICS = '/api/v1/c/stats/player/friends/overview';

// 一級好友今日登入、今日註冊、今日有投注、今日存款會員、7日未登入數量
export const API_MANAGEMENT_FIRST_LEVEL_INFO = '/api/v1/c/stats/player/depth/1/friends';

// 各級好友總人數、新增會員數、存款會員數、取款會員數
export const API_MANAGEMENT_LEVEL_LIST = '/api/v1/c/stats/player/friends/trans_report';

// 直屬代理建立會員帳號
export const API_FIRST_LEVEL_REGISTER = '/api/v1/c/player/by_upper';

// 一級好友清單
export const API_FIRST_LEVEL_FRIENDS = '/api/v1/c/player/friends';

// 一級好友注單統計資料
export const API_FRIEND_WAGER_REPORT = '/api/v1/c/stats/player/friends/wager_report';

// 取得使用者每日各遊戲的注單統計資料
export const API_FRIEND_WAGER_REPORT_BY_DAY_GAME = 'api/v1/c/stats/player/friend/wager_report/by_day_game';

// 會員依遊戲類別取得下層注單一覽
export const API_FRIEND_RECORD_DETAIL = '/api/v1/c/friend/wagers/list_by_game_code';

// 我的返利收益概況
export const API_COMMISSION_SUMMARY = '/api/v1/c/wage/summary';

// 取得會員意見反饋類別
export const API_FEEDBACK_TYPE_LIST = '/api/v1/c/feedback_type/list';

// 建立會員意見反饋單
export const API_FEEDBACK_CREATED = '/api/v1/c/feedback';

// 批次刪除會員意見反饋
export const API_FEEDBACK_DELETE = '/api/v1/c/player/feedbacks';

// 取得已回覆意見反饋列表
export const API_FEEDBACK_REPLIED_LIST = '/api/v1/c/feedback/replied/list';

// 取得已回覆且未讀取意見反饋數量
export const API_FEEDBACK_UN_READ_COUNT = '/api/v1/c/feedback/un_read_count';

// 取得vip使⽤者詳細資料
export const API_VIP_USER = '/api/v1/c/vip2/user';

// 依vip分類回傳所有等級清單(不分⾴)
export const API_VIP_LEVEL_LIST = '/api/v1/c/vip2/level/list';

// 取得vip參數檔清單
export const API_VIP_CONFIG_LIST = '/api/v1/c/vip2/config/list';

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     AGENT 代理相關
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 加入代理、代理資訊
export const API_AGENT = '/api/v1/c/agent';

// 加入代理欄位開關
export const API_AGENT_CONFIG = '/api/v1/c/agent/user_register_config';

// 代理中心 - 帳戶資料欄位開關
export const API_AGENT_USER_CONFIG = '/api/v1/c/agent/user_info_config/with_verify';

// 代理中心 - 代理帳號啟用暱稱顯示
export const API_AGENT_ENABLE_ALIAS = '/api/v1/c/agent/alias/enable';

// 代理中心 - 代理帳號關閉暱稱顯示
export const API_AGENT_DISABLE_ALIAS = '/api/v1/c/agent/alias/disable';

// 登入 - 安全防護
export const API_AGENT_LOGIN_CHECK = '/api/v1/agent/login/check';

// 登入
export const API_AGENT_LOGIN = '/api/v1/agent/login';

// 登出
export const API_AGENT_LOGOUT = '/api/v1/agent/logout';

// 跑馬燈
export const API_AGENT_NEWS = '/api/v1/c/agent/news/list';

// 公告
export const API_AGENT_POST = '/api/v1/c/agent/announcement';

// 忘記密碼
export const API_AGENT_PWD_FORGET = '/api/v1/c/agent/forget/password';

// 重設密碼
export const API_AGENT_PWD_RESET = '/api/v1/c/agent/password/reset';

// 忘記密碼手機簡訊
export const API_AGENT_PWD_FORGET_MOBILE = '/api/v1/c/agent/forget/password/sms';

// 忘記密碼手機簡訊
export const API_AGENT_PWD_MOBILE_VERIFY = '/api/v1/c/agent/forget/password/sms/verify';

// 重設密碼-簡訊
export const API_AGENT_PWD_MOBILE_RESET = '/api/v1/c/agent/password/reset/sms';


// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     MCENTER 會員中心
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 帳戶安全程度
export const API_MCENTER_PERCENT = '/api/v1/c/player/safety/strengths';

// 帳戶資料-信箱驗證
export const API_MAIL_CHECK = '/api/v1/c/player/verify/email';

// 帳戶資料-電話驗證
export const API_PHONE_CHECK = '/api/v1/c/player/verify/phone';

// 帳戶資料-信箱修改 (無開驗證)
export const API_MAIL_EDIT = '/api/v1/c/player/email';

// 帳戶資料-電話修改 (無開驗證)
export const API_PHONE_EDIT = '/api/v1/c/player/phone';

// 帳戶資料-信箱驗證-秒數倒數
export const API_MAIL_CHECK_SEC = '/api/v1/c/player/email/ttl';

// 帳戶資料-電話驗證-秒數倒數
export const API_PHONE_CHECK_SEC = '/api/v1/c/player/phone/ttl';

// 帳戶資料-修改密碼
export const API_PWD_CHANGE = '/api/v1/c/password';

// 帳戶資料-修改取款密碼
export const API_WITHDRAW_PWD_CHANGE = '/api/v1/c/withdraw_password';

// 額度轉換
export const API_MCENTER_BALANCE_ALL = '/api/v1/c/vendor/all/balance';
export const API_MCENTER_BALANCE = '/api/v1/c/transfer/source';

// 紅利帳戶
export const API_MCENTER_BONUS = '/api/v1/c/gift-card';

// 會員存款總額
export const API_MCENTER_DESPOSIT_AMOUNT = '/api/v1/c/stats/player/deposit_amount';

// 我的返水
export const API_MCENTER_REBATE_INITIAL = '/api/v1/c/rebate/self/info';
export const API_MCENTER_REBATE_CACULATE = '/api/v1/c/rebate/trial';
export const API_MCENTER_REBATE_RECEIVE = '/api/v1/c/rebate/self';
export const API_MCENTER_REBATE_RECEIVE_ENTRY = '/api/v1/c/rebate/entry';
export const API_MCENTER_REBATE_HISTORY = '/api/v1/c/rebate/entry/list';
export const API_MCENTER_MAINTAINS = '/api/v1/c/maintains';
export const API_MCENTER_DATETIME = '/api/v1/c/tool/datetime';
export const API_MCENTER_REBATE_SUBTOTAL = '/api/v1/c/player/rebate/subtotal';

// 餘額歸戶
export const API_MCENTER_BALANCE_BACK = '/api/v1/c/vendor/recycle/balance';

// 免轉錢包功能 (啟用)
export const API_MCENTER_ENABLE_AUTOTRANSFER = '/api/v1/c/auto-transfer';
// 免轉錢包功能 (取消)
export const API_MCENTER_CLOSE_AUTOTRANSFER = '/api/v1/c/auto-transfer/disable';

// 自動回收機制
export const API_BALANCE_AUTO_BACK = '/api/v1/c/refresh';

// 最後開啟平台
export const API_MCENTER_RECENTLY_OPENED = '/api/v1/c/last_vendor';

// 資金明細
export const API_MCENTER_MONEY_DETAIL = '/api/v1/c/cash/entry';

// 投注記錄
export const API_MCENTER_BETRECORD_TOTAL = '/api/v1/c/stats/player/valid_bet';
export const API_MCENTER_BETRECORD_ALL = '/api/v1/c/wagers/list_by_vendor';
export const API_MCENTER_BETRECORD_GAMECODE = '/api/v1/c/wagers/list_by_game_code';

// 站內信 (取全部標題)
export const API_MCENTER_MESSAGE = '/api/v1/c/player/messages';
// 站內信 (取單則內容、刪除)
export const API_MCENTER_MESSAGE_CONTENT = '/api/v1/c/player/message';
// 站內信 (取多則內容、刪除)
export const API_MCENTER_MESSAGES_CONTENT = '/api/v1/c/player/messages';

// 會員中心存款 (登入前)
export const API_MCENTER_DEPOSIT_BEFORE_LOGIN = '/api/v1/c/link/deposit_before_login';
// 會員中心存款
export const API_MCENTER_DEPOSIT = '/api/v1/c/link/deposit';
// 會員中心存款第三方
export const API_MCENTER_DEPOSIT_THIRD = '/api/v2/c/links';
// 會員中心新的存款
export const API_MCENTER_DEPOSIT_INPAY = '/api/v1/c/ext/inpay?api_uri=/api/trade/v2/c/vendor_user_level/payment_group';
// 會員中心 - 存款支付通道
export const API_MCENTER_DEPOSIT_CHANNEL = '/api/v1/c/ext/inpay?api_uri=/api/trade/v2/c/vendor_user_level/channel';
// 會員中心 - 存款取得8日內紀錄
export const API_MCENTER_DEPOSIT_RECORD = '/api/v1/c/ext/inpay?api_uri=/api/trade/v2/c/stat/list';
// 會員中心 - 存款取得單筆紀錄
export const API_MCENTER_DEPOSIT_SINGLE = '/api/v1/c/ext/inpay?api_uri=/api/trade/v2/c/entry';
// 會員中心 - 迅付中繼
export const API_TRADE_RELAY = '/api/v1/c/ext/inpay';

// 會員中心 - 取款 - 近10筆取款紀錄
export const API_WITHDRAW_RECORD = '/api/payment/v1/c/withdraw/list';
// 會員中心 - 取款 - 取款手續費
export const API_WITHDRAW_ASSIST = '/api/v1/c/audit/entry';
// 會員中心 - 取款 - 取得會員帳戶
export const API_MCENTER_WITHDRAW = '/api/v1/c/ext/inpay?api_uri=/api/trade/v2/c/withdraw/user/account/list';
// 會員中心 - 取款 - 一鍵歸戶
export const API_WITHDRAW_BALANCE_BACK = '/api/v1/c/vendor/recycle/balance';
// 會員中心 - 取款 - 取得取款資訊
export const API_WITHDRAW_INFO = '/api/v1/c/withdraw/info';
// 會員中心 - 取款 - 本站取款寫單
export const API_WITHDRAW_WRITE = '/api/payment/v1/c/withdraw';
// 會員中心 - 取款 - 取得CGPAY綁定資訊
export const API_WITHDRAW_CGPAY_BINDING = '/api/v1/c/ext/inpay?api_uri=/api/trade/v1/c/withdraw/bind_wallet';

// 會員中心、代理中心取款
export const API_WITHDRAW = '/api/v1/c/link/withdraw';
// 會員中心我的返水
export const API_REBATE = '/api/v1/c/link/rebate';
// 會員中心-第三方佣金的連結
export const API_COMMISSION_LINK = '/api/v1/c/link/wage';
// 會員中心、代理中心 - 手機驗證
export const API_MOBILE_CHECK = '/api/v1/c/withdraw/check';

// 會員中心、代理中心 - 手機驗證
export const API_MCENTER_VIP = '/api/v1/c/user/vip';

// 會員收貨地址
export const API_MCENTER_ADDRESS = '/api/v1/c/player/address';
// 會員手機開放國碼
export const API_MCENTER_COUNTRY_CODES = '/api/v1/c/player/country_codes';

// 會員意見反饋發送紀錄
export const API_MCENTER_FEEDBACK_RECORD = '/api/v1/c/player/feedback/list';

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     AGCENTER 代理中心
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 帳戶資料-信箱驗證
export const API_AGCENTER_MAIL_CHECK = '/api/v1/c/agent/verify/email';

// 帳戶資料-電話驗證
export const API_AGCENTER_PHONE_CHECK = '/api/v1/c/agent/verify/phone';

// 帳戶資料-信箱修改 (無開驗證)
export const API_AGCENTER_MAIL_EDIT = '/api/v1/c/agent/email';

// 帳戶資料-電話修改 (無開驗證)
export const API_AGCENTER_PHONE_EDIT = '/api/v1/c/agent/phone';

// 帳戶資料-信箱驗證-秒數倒數
export const API_AGCENTER_MAIL_CHECK_SEC = '/api/v1/c/agent/email/ttl';

// 帳戶資料-電話驗證-秒數倒數
export const API_AGCENTER_PHONE_CHECK_SEC = '/api/v1/c/agent/phone/ttl';

// 帳戶資料-修改密碼
export const API_AGCENTER_PWD_CHANGE = '/api/v1/c/agent/password';

// 帳戶資料-修改取款密碼
export const API_AGCENTER_WD_PWD_CHANGE = '/api/v1/c/agent/withdraw_password';

// 帳戶資料-綁定會員帳號
export const API_AGCENTER_MEM_USERNAME = '/api/v1/c/agent/bind_user';

// 帳戶資料-合營連結
export const API_AGCENTER_OUT_LINK = '/api/v1/c/agent/promotion';

// 帳戶資料-設定使用者層級
export const API_AGCENTER_USER_LEVELS = '/api/v1/c/levels/by_user';

// 佣金明細
export const API_AGCENTER_REWARD = '/api/v1/c/rewards';
// 佣金明細 (單則詳細內容)
export const API_AGCENTER_REWARD_DETIAL = '/api/v1/c/reward';
// 佣金明細 (第三方連結)
export const API_AGCENTER_REWARD_THIRD_PARTY_LINK = '/api/v1/c/link/reward';

// 會員遊戲紀錄 (外層-全部或指定平台、可單搜會員)
export const API_AGCENTER_RECORD = '/api/v1/c/stats/agent/children/wager_report';
// 會員遊戲紀錄 (內層-依會員+指定平台)
export const API_AGCENTER_RECORD_MEMBER = '/api/v1/c/stats/player/vendors/kinds/wager_report';
// 會員遊戲紀錄 (內層-依會員+指定平台+遊戲類別)
export const API_AGCENTER_RECORD_DETIAL = '/api/v1/c/child/wagers/list_by_game_code';

// 取下層會員列表
export const API_MCENTER_MEMBER_LIST = '/api/v1/c/players';

// 站內信 (取全部標題)
export const API_AGCENTER_MESSAGE = '/api/v1/c/agent/messages';
// 站內信 (取單則內容、刪除)
export const API_AGCENTER_MESSAGE_CONTENT = '/api/v1/c/agent/message';

// 聯絡我們
export const API_CONTACT = '/api/v1/c/contact'; // 聯絡我們

// 彈跳公告訊息
export const API_AGENT_ANNOUNCEMENT = '/api/v1/c/agent/popup-announcement';

// 代理收貨地址
export const API_AGCENTER_ADDRESS = '/api/v1/c/agent/address';
// 會員手機開放國碼
export const API_AGCENTER_COUNTRY_CODES = '/api/v1/c/agent/country_codes';

// 會員意見反饋發送紀錄
export const API_AGCENTER_FEEDBACK_RECORD = '/api/v1/c/agent/feedback/list';

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     電子遊戲
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 電子頁分類項目
export const gameType = '/api/v1/c/game_type/label/list';
// 電子遊戲項目
export const gameList = '/api/v1/c/games';

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     手機下注
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 產生下載頁面QR Code
export const API_QRCODE = '/api/v1/c/slide/qrcode';
// 取得平台app資訊
export const API_GETAPPINFO = '/api/v1/c/app/info';
// 取得平台多個app資訊
export const API_GETAPPINFO_MORE = '/api/v2/c/app/info';

// 必博優惠活動
export const API_PROMOTION_LIST = '/api/v1/c/ext/promotion';

// 亞博直播 api domain
export const API_PORN1_DOMAIN = 'https://ncpxsgypt.com';
