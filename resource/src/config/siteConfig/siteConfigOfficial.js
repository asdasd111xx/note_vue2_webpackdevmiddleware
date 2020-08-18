/* eslint-disable camelcase */
/**
 * 網站設定檔預設值
 */
import { basic, getVersion } from './basic';

export const preset = {
    ...basic,
    BBOS_DOMIAN: 'https://bbos.canarycherrytart.com/elibomApi/WebService',
    YABO_API_DOMAIN: 'https://yaboapi.canarycherrytart.com/api',
    ACTIVES_BOUNS_WEBSOCKET: 'wss://yaboapi.canarycherrytart.com/ws/promosocket'
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
 * 鸭博娱乐 正式站正式環境
 */
export const site_67 = {
    ...preset,
    MOBILE_WEB_TPL: 'porn1', // 手機網頁版模版
    VERSION: getVersion('porn1'),
    SITE_NAME: '鸭博娱乐'
};

/**
 * 鸭博娱乐 正式站Demo環境
 */
export const site_69 = {
    ...preset,
    MOBILE_WEB_TPL: 'porn1',
    VERSION: getVersion('porn1'),
    SITE_NAME: '鸭博娱乐',
    YABO_API_DOMAIN: 'https://yaboapi.canarycherrytart.com/api-demo',
};


/**
 * 亿元 正式站
 */
export const site_41 = {
    ...preset,
    MOBILE_WEB_TPL: 'ey1',
    VERSION: getVersion('ey1'),
    SITE_NAME: '亿元',
    YABO_API_DOMAIN: 'https://cxbb.bbin-asia.com/api',
};

/**
 * 亿元 正式站Demo環境
 */
export const site_74 = {
    ...preset,
    MOBILE_WEB_TPL: 'ey1',
    VERSION: getVersion('ey1'),
    SITE_NAME: '亿元',
    YABO_API_DOMAIN: 'https://cxbb.bbin-asia.com/api-demo',
};
/* eslint-enable camelcase */
