/* eslint-disable camelcase */
/**
 * 網站設定檔預設值
 */
import { basic, getVersion } from "./basic";

export const preset = {
  ...basic,
  BBOS_DOMIAN: "https://bbos.bbin-asia.com/elibomApi/WebService",
  BBOS_DOMIAN_CDN: "https://bbos.bbin-asia.com/cdn",
  YABO_API_DOMAIN: "https://yaboapi.bbin-asia.com/api",
  YABO_GOLANG_API_DOMAIN: "https://yaboapi.bbin-asia.com/api-v2/cxbb",
  ACTIVES_BOUNS_WEBSOCKET: "wss://yaboapi.bbin-asia.com/ws/promosocket",
  ACTIVES_BOUNS_WEBSOCKETV2: "wss://yaboapi.bbin-asia.com/wsn/promosocket?"
};

/* ---------- ↓ 測試站 ---------- */

/**
 * 鸭博娱乐 測試站
 */
export const site_500015 = {
  ...preset,
  MOBILE_WEB_TPL: "porn1",
  VERSION: getVersion("porn1"),
  SITE_NAME: "鸭博娱乐"
};

/**
 * 亿元 測試站
 */
export const site_500023 = {
  ...preset,
  MOBILE_WEB_TPL: "ey1",
  VERSION: getVersion("ey1"),
  SITE_NAME: "亿元",
  YABO_API_DOMAIN: "https://cxbb.bbin-asia.com/api",
  YABO_GOLANG_API_DOMAIN: "https://cxbb.bbin-asia.com/api-v2/cxbb",
  ACTIVES_BOUNS_WEBSOCKETV2: "wss://cxbb.bbin-asia.com/wsn/promosocket?"
};
/* eslint-enable camelcase */

/**
 * 丝瓜娱乐 測試站
 */
export const site_500035 = {
  ...preset,
  MOBILE_WEB_TPL: "sg1",
  VERSION: getVersion("sg1"),
  SITE_NAME: "丝瓜娱乐"
};
