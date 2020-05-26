import version from '@/config/version'

/* eslint-disable camelcase */
/**
 * 網站設定檔預設值
 */
export const preset = {
    TESTER: 'N', // 可使用 Cookies 測試設定客製首頁
    CUSTOMIZE_HOME_TPL_PATH: [], // 有客製首頁的模版編號
    MCENTER_COLOR: 'basic', // 會員中心及代理中心色系
    JOIN_MEMBER_THEME: 'default', // 加入會員 / 加入代理樣式
    MOBILE_WEB_TPL: 'brilliant', // 手機網頁版模版
    MOBILE_BET_THEME: 'basic', // 手機下注頁
    MOBILE_COLOR: 'yellow', // 手機網頁版色系
    IS_PWA: false, // 是否為PWA站
    VERSION: version.version // 版本
};

/* ---------- ↓ 正式站 ---------- */

// domain list
// yaboapi.dormousepie.com
// yaboapi.gophertart.com
// yaboapi.slothwafer.com
// yaboapi.armadillobrulee.com
// yaboapi.chimpanzeescone.com
// yaboapi.duckbillcaramel.com
// yaboapi.quailtortillas.com
// yaboapi.parrotbostonpie.com
// yaboapi.canarycherrytart.com
// yaboapi.iguanagingercake.com

/**
 * 鸭脖视频 正式站正式環境
 */
export const site_67 = {
    ...preset,
    MOBILE_WEB_TPL: 'porn1', // 手機網頁版模版
    IS_PWA: true,
    BBOS_DOMIAN: 'https://bbos.canarycherrytart.com/elibomApi/WebService',
    YABO_API_DOMAIN: 'https://yaboapi.canarycherrytart.com/api',
    ACTIVES_BOUNS_WEBSOCKET: 'wss://yaboapi.canarycherrytart.com/ws/promosocket'
};

/**
 * 鸭脖视频 正式站Demo環境
 */
export const site_69 = {
    ...preset,
    MOBILE_WEB_TPL: 'porn1', // 手機網頁版模版
    IS_PWA: true,
    BBOS_DOMIAN: 'https://bbos.canarycherrytart.com/elibomApi/WebService',
    YABO_API_DOMAIN: 'https://yaboapi.canarycherrytart.com/api',
    ACTIVES_BOUNS_WEBSOCKET: 'wss://yaboapi.canarycherrytart.com/ws/promosocket'
};

/* eslint-enable camelcase */
