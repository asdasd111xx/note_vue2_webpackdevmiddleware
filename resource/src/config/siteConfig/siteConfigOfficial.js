/* eslint-disable camelcase */
/**
 * 網站設定檔預設值
 */
import { basic, getVersion } from "./basic";

export const preset = {
  ...basic,
  BBOS_DOMIAN: "https://bbos.canarycherrytart.com/elibomApi/WebService",
  YABO_API_DOMAIN: "https://yaboapi.canarycherrytart.com/api",

  YABO_GOLANG_API_DOMAIN: "https://yaboapi.canarycherrytart.com/api-v2",
  // YABO_GOLANG_API_DOMAIN: "https://yaboapi.lysywh.cn:9443/api-v2",
  ACTIVES_BOUNS_WEBSOCKET: "wss://yaboapi.canarycherrytart.com/ws/promosocket",
  ACTIVES_BOUNS_WEBSOCKETV2:
    "wss://yaboapi.iguanagingercake.com/wsn/promosocket?",
  CDN_HEADER: ""
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
 * 币发BIFA 正式站正式環境
 */
export const site_67 = {
  ...preset,
  ROUTER_TPL: "porn1",
  MOBILE_WEB_TPL: "porn1", // 手機網頁版模版
  VERSION: getVersion("porn1"),
  SITE_NAME: "币发BIFA",
  ACTIVES_BOUNS_WEBSOCKETV2:
    "wss://yaboapi.iguanagingercake.com/wsn/promosocket?",
  YABO_GOLANG_API_DOMAIN: "https://yaboapi.lysywh.cn:9443/api-v2",
  PORN_CONFIG: {
    ID: {
      SPACE: "1",
      YB: "9",
      SP: "13",
      GAY: "7",
      LES: "8"
    }
  },
  CDN_HEADER: "x-cdn-yb"
};

/**
 * 币发BIFA 正式站Demo環境
 */
export const site_69 = {
  ...preset,
  ROUTER_TPL: "porn1",
  MOBILE_WEB_TPL: "porn1",
  VERSION: getVersion("porn1"),
  SITE_NAME: "币发BIFA",
  YABO_API_DOMAIN: "https://yaboapi.canarycherrytart.com/api",
  YABO_GOLANG_API_DOMAIN: "https://yaboapi.lysywh.cn:9443/api-v2",
  ACTIVES_BOUNS_WEBSOCKETV2:
    "wss://yaboapi.iguanagingercake.com/wsn/promosocket?",
  PORN_CONFIG: {
    ID: {
      SPACE: "1",
      YB: "9",
      SP: "13",
      GAY: "7",
      LES: "8"
    }
  }
};

/**
 * 币发BIFA Beta環境
 */
export const site_100003 = {
  ...preset,
  ROUTER_TPL: "porn1",
  MOBILE_WEB_TPL: "porn1",
  VERSION: getVersion("porn1"),
  SITE_NAME: "币发BIFA",
  YABO_API_DOMAIN: "https://ybbe2.qghco.com/api",
  YABO_GOLANG_API_DOMAIN: "https://ybbe2.qghco.com/api-v2",
  BBOS_DOMIAN: "https://xbb.qghco.com/elibomApi/WebService",
  ACTIVES_BOUNS_WEBSOCKET: "wss://ybbe2.qghco.com/ws/promosocket",
  ACTIVES_BOUNS_WEBSOCKETV2: "wss://ybbe2.qghco.com/wsn/promosocket?",
  PORN_CONFIG: {
    ID: {
      SPACE: "1",
      YB: "9",
      SP: "13",
      GAY: "7",
      LES: "8"
    }
  }
};

/**
 * 亿元 正式站
 */
export const site_41 = {
  ...preset,
  ROUTER_TPL: "ey1",
  MOBILE_WEB_TPL: "ey1",
  VERSION: getVersion("ey1"),
  SITE_NAME: "亿元",
  YABO_API_DOMAIN: "https://cxbb.chessrunroll.com/api",
  YABO_GOLANG_API_DOMAIN: "https://cxbb.chessrunroll.com/api-v2",
  ACTIVES_BOUNS_WEBSOCKETV2: "wss://cxbb.chesspink.com/wsn/promosocket?",
  CDN_HEADER: "x-cdn-ey"
};

/**
 * 亿元 正式站Demo環境
 */
// cxbb.chesspink.com
// cxbb.casterchess.com
// cxbb.chessrunroll.com
// cxbb.sdkchess.com
// cxbb.jellychess.com
// cxbb.mangochess.com
// cxbb.lemonchess.com
// cxbb.pomelochess.com
// cxbb.litchichess.com
// cxbb.pearchess.com
export const site_74 = {
  ...preset,
  ROUTER_TPL: "ey1",
  MOBILE_WEB_TPL: "ey1",
  VERSION: getVersion("ey1"),
  SITE_NAME: "亿元",
  YABO_API_DOMAIN: "https://cxbb.mangochess.com/api",
  YABO_GOLANG_API_DOMAIN: "https://cxbb.mangochess.com/api-v2",
  ACTIVES_BOUNS_WEBSOCKETV2: "wss://cxbb.chesspink.com/wsn/promosocket?"
};

/**
 * 亿元 Beta環境
 */
export const site_100004 = {
  ...preset,
  ROUTER_TPL: "ey1",
  MOBILE_WEB_TPL: "ey1",
  VERSION: getVersion("ey1"),
  SITE_NAME: "亿元",
  YABO_API_DOMAIN: "https://eybe2.77num.com/api",
  YABO_GOLANG_API_DOMAIN: "https://eybe2.77num.com/api-v2",
  BBOS_DOMIAN: "https://xbb.qghco.com/elibomApi/WebService",
  ACTIVES_BOUNS_WEBSOCKETV2: "wss://eybe2.77num.com/wsn/promosocket?"
};
/* eslint-enable camelcase */

/**
 * 泡泡直播 正式站正式環境
 */
export const site_80 = {
  ...preset,
  ROUTER_TPL: "sg1",
  MOBILE_WEB_TPL: "sg1", // 手機網頁版模版
  VERSION: getVersion("sg1"),
  SITE_NAME: "泡泡直播",
  ACTIVES_BOUNS_WEBSOCKETV2:
    "wss://yaboapi.iguanagingercake.com/wsn/promosocket?",
  YABO_GOLANG_API_DOMAIN: "https://yaboapi.lysywh.cn:9443/api-v2",
  PORN_CONFIG: {
    ID: {
      SPACE: "12",
      YB: "9",
      SP: "13",
      GAY: "7",
      LES: "8"
    }
  },
  CDN_HEADER: "x-cdn-ey"
};

/**
 * 泡泡直播 正式站Demo環境
 */
export const site_81 = {
  ...preset,
  ROUTER_TPL: "sg1",
  MOBILE_WEB_TPL: "sg1",
  VERSION: getVersion("sg1"),
  SITE_NAME: "泡泡直播",
  YABO_API_DOMAIN: "https://yaboapi.canarycherrytart.com/api",
  YABO_GOLANG_API_DOMAIN: "https://yaboapi.lysywh.cn:9443/api-v2",
  ACTIVES_BOUNS_WEBSOCKETV2:
    "wss://yaboapi.iguanagingercake.com/wsn/promosocket?",
  PORN_CONFIG: {
    ID: {
      SPACE: "12",
      YB: "9",
      SP: "13",
      GAY: "7",
      LES: "8"
    }
  }
};

/**
 * 泡泡直播 Beta環境
 */
export const site_100009 = {
  ...preset,
  ROUTER_TPL: "sg1",
  MOBILE_WEB_TPL: "sg1",
  VERSION: getVersion("sg1"),
  SITE_NAME: "泡泡直播",
  // todo待beta domain完成
  BBOS_DOMIAN: "https://xbb.qghco.com/elibomApi/WebService",
  YABO_API_DOMAIN: "https://ybbe2.qghco.com/api",
  YABO_GOLANG_API_DOMAIN: "https://ybbe2.qghco.com/api-v2",
  ACTIVES_BOUNS_WEBSOCKET: "wss://ybbe2.qghco.com/ws/promosocket",
  ACTIVES_BOUNS_WEBSOCKETV2: "wss://ybbe2.qghco.com/wsn/promosocket?",
  PORN_CONFIG: {
    ID: {
      SPACE: "12",
      YB: "9",
      SP: "13",
      GAY: "7",
      LES: "8"
    }
  }
};

/**
 * 澳博国际 正式站正式環境
 */
export const site_92 = {
  ...preset,
  ROUTER_TPL: "aobo1",
  MOBILE_WEB_TPL: "porn1", // 手機網頁版模版
  VERSION: getVersion("aobo1"),
  SITE_NAME: "澳博国际",
  ACTIVES_BOUNS_WEBSOCKETV2:
    "wss://yaboapi.iguanagingercake.com/wsn/promosocket?",
  YABO_GOLANG_API_DOMAIN: "https://yaboapi.lysywh.cn:9443/api-v2",
  PORN_CONFIG: {
    ID: {
      SPACE: "16",
      YB: "9",
      AV: "17"
    }
  },
  CDN_HEADER: "x-cdn-ab"
};

/**
 * 澳博国际 Demo環境
 */
export const site_93 = {
  ...preset,
  ROUTER_TPL: "aobo1",
  MOBILE_WEB_TPL: "porn1",
  VERSION: getVersion("aobo1"),
  SITE_NAME: "澳博国际",
  YABO_API_DOMAIN: "https://yaboapi.canarycherrytart.com/api",
  // YABO_GOLANG_API_DOMAIN: "https://yaboapi.canarycherrytart.com/api-v2",
  YABO_GOLANG_API_DOMAIN: "https://yaboapi.pcxgqij.cn:9443/api-v2",
  ACTIVES_BOUNS_WEBSOCKETV2:
    "wss://yaboapi.iguanagingercake.com/wsn/promosocket?",
  PORN_CONFIG: {
    ID: {
      SPACE: "16",
      YB: "9",
      YB: "17"
    }
  }
};

/**
 * 51国际 正式站正式環境
 */
export const site_94 = {
  ...preset,
  ROUTER_TPL: "sp1",
  MOBILE_WEB_TPL: "porn1",
  VERSION: getVersion("sp1"),
  SITE_NAME: "51国际",
  ACTIVES_BOUNS_WEBSOCKETV2:
    "wss://yaboapi.iguanagingercake.com/wsn/promosocket?",
  YABO_GOLANG_API_DOMAIN: "https://yaboapi.dormousepie.com/api-v2",
  // PORN_CONFIG: {
  //   ID: {
  //     SPACE: "16",
  //     YB: "17"
  //   }
  // }
  CDN_HEADER: "x-cdn-sp51"
};

/**
 * 51国际 Demo環境
 */
export const site_95 = {
  ...preset,
  ROUTER_TPL: "sp1",
  MOBILE_WEB_TPL: "porn1",
  VERSION: getVersion("sp1"),
  SITE_NAME: "51国际",
  YABO_API_DOMAIN: "https://yaboapi.canarycherrytart.com/api",
  YABO_GOLANG_API_DOMAIN: "https://yaboapi.dormousepie.com/api-v2",
  ACTIVES_BOUNS_WEBSOCKETV2:
    "wss://yaboapi.iguanagingercake.com/wsn/promosocket?"
  // PORN_CONFIG: {
  //   ID: {
  //     SPACE: "16",
  //     YB: "17"
  //   }
  // }
};
