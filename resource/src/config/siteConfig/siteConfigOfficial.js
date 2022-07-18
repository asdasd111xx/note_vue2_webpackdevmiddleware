/* eslint-disable camelcase */
/**
 * 網站設定檔預設值
 */
import { basic, getVersion } from "./basic";

export const preset = {
  ...basic,
  BBOS_DOMIAN: "https://bbos.canarycherrytart.com/elibomApi/WebService",
  YABO_API_DOMAIN: "https://yaboapi.armadillobrulee.com/api",
  YABO_GOLANG_API_DOMAIN: "https://yaboapi.armadillobrulee.com/api-v2",
  ACTIVES_BOUNS_WEBSOCKET: "",
  CDN_HEADER: "",
  LOCAL_JSON_DOMAIN: [
    "https://s3.ap-northeast-1.amazonaws.com/dnk5hpuy67",
    "https://cos.ap-nanjing.myqcloud.com/dnk5hpuy67-1305726917",
    "https://dnk5hpuy67.oss-cn-hangzhou.aliyuncs.com",
    "https://d15xg0jxmcsiyp.cloudfront.net"
  ],
  LOCAL_BASE_DOMAIN: [
    "https://yaboapi.armadillobrulee.com",
    "https://armadillobrulee.com"
  ]
};

/**
 * 币发BIFA 正式站正式環境
 */
export const site_67 = {
  ...preset,
  ROUTER_TPL: "porn1",
  MOBILE_WEB_TPL: "porn1", // 手機網頁版模版
  VERSION: getVersion("porn1"),
  SITE_NAME: "币发BIFA",
  PORN_CONFIG: {
    ID: {
      SPACE: "1",
      FREE_SPACE: "18",
      YV: "9",
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
  YABO_API_DOMAIN: "https://yaboapi.armadillobrulee.com/api",
  YABO_GOLANG_API_DOMAIN: "https://yaboapi.dormousepie.com/api-v2",
  PORN_CONFIG: {
    ID: {
      SPACE: "1",
      FREE_SPACE: "18",
      YV: "9",
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
  BBOS_DOMIAN: "https://xbb.qghco.com/elibomApi/WebService",
  YABO_API_DOMAIN: "https://ybbe2.777vendor.com/api",
  YABO_GOLANG_API_DOMAIN: "https://ybbe2.777vendor.com/api-v2",
  ACTIVES_BOUNS_WEBSOCKET: "wss://ybbe2.777vendor.com",
  PORN_CONFIG: {
    ID: {
      SPACE: "1",
      FREE_SPACE: "18",
      YV: "9",
      SP: "13",
      GAY: "7",
      LES: "8"
    }
  },
  LOCAL_JSON_DOMAIN: [
    "https://s3.ap-northeast-1.amazonaws.com/be5c100003",
    "https://cos.ap-nanjing.myqcloud.com/be5c100003-1305726917",
    "https://be5c100003.oss-cn-hangzhou.aliyuncs.com"
  ],
  LOCAL_BASE_DOMAIN: ["https://ybbe2.777vendor.com"]
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
  YABO_GOLANG_API_DOMAIN: "",
  CDN_HEADER: "x-cdn-ey",
  LOCAL_JSON_DOMAIN: [
    "https://s3.ap-northeast-1.amazonaws.com/xv2ysd6b58",
    "https://cos.ap-chongqing.myqcloud.com/xv2ysd6b58-1305726917",
    "https://xv2ysd6b58.oss-cn-shanghai.aliyuncs.com"
  ],
  LOCAL_BASE_DOMAIN: [
    "https://cxbb.chesspink.com",
    "https://cxbb.chessrunroll.com"
  ]
};

/**
 * 亿元 正式站Demo環境
 */
export const site_74 = {
  ...preset,
  ROUTER_TPL: "ey1",
  MOBILE_WEB_TPL: "ey1",
  VERSION: getVersion("ey1"),
  SITE_NAME: "亿元",
  YABO_API_DOMAIN: "https://cxbb.mangochess.com/api",
  YABO_GOLANG_API_DOMAIN: "https://cxbb.mangochess.com/api-v2"
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
  LOCAL_JSON_DOMAIN: [
    "https://s3.ap-northeast-1.amazonaws.com/sk6esbbeta",
    "https://cos.ap-chongqing.myqcloud.com/sk6esbbeta-1305726917",
    "https://sk6esbbeta.oss-cn-shanghai.aliyuncs.com"
  ],
  LOCAL_BASE_DOMAIN: ["https://eybe2.77num.com"]
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
  PORN_CONFIG: {
    ID: {
      SPACE: "12",
      FREE_SPACE: "18",
      YV: "9",
      SP: "13",
      GAY: "7",
      LES: "8"
    }
  },
  CDN_HEADER: "x-cdn-sg"
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
  YABO_API_DOMAIN: "https://yaboapi.armadillobrulee.com/api",
  YABO_GOLANG_API_DOMAIN: "https://yaboapi.dormousepie.com/api-v2",
  PORN_CONFIG: {
    ID: {
      SPACE: "12",
      FREE_SPACE: "18",
      YV: "9",
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
  YABO_API_DOMAIN: "https://ybbe2.777vendor.com/api",
  YABO_GOLANG_API_DOMAIN: "https://ybbe2.777vendor.com/api-v2",
  ACTIVES_BOUNS_WEBSOCKET: "wss://ybbe2.777vendor.com",
  PORN_CONFIG: {
    ID: {
      SPACE: "12",
      FREE_SPACE: "18",
      YV: "9",
      SP: "13",
      GAY: "7",
      LES: "8"
    }
  },
  LOCAL_JSON_DOMAIN: [""],
  LOCAL_BASE_DOMAIN: ["https://ybbe2.777vendor.com"]
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
  PORN_CONFIG: {
    ID: {
      SPACE: "16",
      YV: "9",
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
  YABO_API_DOMAIN: "https://yaboapi.armadillobrulee.com/api",
  PORN_CONFIG: {
    ID: {
      SPACE: "16",
      YV: "9",
      AV: "17"
    }
  }
};

/**
 * 51体育 正式站正式環境
 */
export const site_94 = {
  ...preset,
  ROUTER_TPL: "sp1",
  MOBILE_WEB_TPL: "porn1",
  VERSION: getVersion("sp1"),
  SITE_NAME: "51体育",
  CDN_HEADER: "x-cdn-sp51"
};

/**
 * 51体育 Demo環境
 */
export const site_95 = {
  ...preset,
  ROUTER_TPL: "sp1",
  MOBILE_WEB_TPL: "porn1",
  VERSION: getVersion("sp1"),
  SITE_NAME: "51体育",
  YABO_API_DOMAIN: "https://yaboapi.armadillobrulee.com/api",
  YABO_GOLANG_API_DOMAIN: "https://yaboapi.dormousepie.com/api-v2"
};

/**
 * GM正式站 正式站正式環境
 */
export const site_100 = {
  ...preset,
  ROUTER_TPL: "aobo1",
  MOBILE_WEB_TPL: "porn1", // 手機網頁版模版
  VERSION: getVersion("aobo1"),
  SITE_NAME: "GM正式站",
  PORN_CONFIG: {
    ID: {
      SPACE: "16",
      YV: "9",
      AV: "17"
    }
  },
  CDN_HEADER: "x-cdn-ab"
};

/**
 * 66VIP推廣站 正式站正式環境
 */
export const site_101 = {
  ...preset,
  ROUTER_TPL: "aobo1",
  MOBILE_WEB_TPL: "porn1", // 手機網頁版模版
  VERSION: getVersion("aobo1"),
  SITE_NAME: "66VIP推廣站",
  PORN_CONFIG: {
    ID: {
      SPACE: "16",
      YV: "9",
      AV: "17"
    }
  },
  CDN_HEADER: "x-cdn-ab"
};
