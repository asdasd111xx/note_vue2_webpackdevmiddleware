/* eslint-disable camelcase */
/**
 * 網站設定檔預設值
 */
import { basic, getVersion } from './basic';

import version from '../../config/version.json';

export const preset = {
    ...basic,
    BBOS_DOMIAN: 'https://bbos.bbin-asia.com/elibomApi/WebService',
    YABO_API_DOMAIN: 'https://yaboapi.bbin-asia.com/api',
    ACTIVES_BOUNS_WEBSOCKET: 'wss://yaboapi.bbin-asia.com/ws/promosocket',
};

/* ---------- ↓ 測試站 ---------- */

/**
 * 鸭博娱乐 測試站
 */
export const site_500015 = {
    ...preset,
    MOBILE_WEB_TPL: 'porn1',
    VERSION: getVersion('porn1'),
    SITE_NAME: '鸭博娱乐'
};


/**
 * 亿元 測試站
 */
export const site_500023 = {
    ...preset,
    MOBILE_WEB_TPL: 'ey1',
    VERSION: getVersion('ey1'),
    SITE_NAME: '亿元'
};
/* eslint-enable camelcase */
