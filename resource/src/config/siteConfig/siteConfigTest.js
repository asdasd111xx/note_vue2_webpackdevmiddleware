/* eslint-disable camelcase */
/**
 * 網站設定檔預設值
 */
import version from '@/config/version'
export const preset = {
    TESTER: 'N', // 可使用 Cookies 測試設定客製首頁
    CUSTOMIZE_HOME_TPL_PATH: [], // 有客製首頁的模版編號
    MCENTER_COLOR: 'basic', // 會員中心及代理中心色系
    JOIN_MEMBER_THEME: 'default', // 加入會員 / 加入代理樣式
    MOBILE_WEB_TPL: 'brilliant', // 手機網頁版模版
    MOBILE_BET_THEME: 'basic', // 手機下注頁
    MOBILE_COLOR: 'yellow', // 手機網頁版色系
    VERSION: version.version
};

/* ---------- ↓ 測試站 ---------- */

/**
 * 鸭脖视频 測試站
 */
export const site_500015 = {
    ...preset,
    MOBILE_WEB_TPL: 'porn1', // 手機網頁版模版
    IS_PWA: true,
    BBOS_DOMIAN: 'https://bbos.bbin-asia.com/elibomApi/WebService',
    YABO_API_DOMAIN: 'https://yaboapi.bbin-asia.com/api',
    ACTIVES_BOUNS_WEBSOCKET: 'wss://yaboapi.bbin-asia.com/xxx/promosocket',
};
/* eslint-enable camelcase */
