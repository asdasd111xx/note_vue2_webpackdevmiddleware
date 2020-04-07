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
    MOBILE_COLOR: 'yellow' // 手機網頁版色系
};

/* ---------- ↓ 測試站 ---------- */

/**
 * RD1 測試站
 */
export const site_129 = {
    ...preset,
    TESTER: 'Y' // 可使用 Cookies 測試設定客製首頁
};

/**
 * QA 測試站
 */
export const site_43 = {
    ...preset,
    MOBILE_WEB_TPL: 'brilliant', // 手機網頁版模版
    MOBILE_COLOR: 'bluePurple', // 手機網頁版色系
    TESTER: 'Y' // 可使用 Cookies 測試設定客製首頁
};

/**
 * GM 測試站
 */
export const site_47 = {
    ...preset,
    MOBILE_WEB_TPL: 'brilliant', // 手機網頁版模版
    MOBILE_COLOR: 'bluePurple' // 手機網頁版色系
};

/**
 * 無限層廳 測試站
 */
export const site_177 = {
    ...preset,
    CUSTOMIZE_HOME_TPL_PATH: [8], // 有客製首頁的模版編號
    MCENTER_COLOR: 'brilliant', // 會員中心及代理中心色系
    JOIN_MEMBER_THEME: 'brilliant'
};

/**
 * 威尼斯人貴賓廳 測試站
 */
export const site_500000 = {
    ...preset,
    CUSTOMIZE_HOME_TPL_PATH: [17], // 有客製首頁的模版編號
    MCENTER_COLOR: 'theme3', // 會員中心及代理中心色系
    MOBILE_WEB_TPL: 'theme3', // 手機網頁版模版
    MOBILE_BET_THEME: '500000' // 手機下注頁
};


/**
 * 日本 測試站
 */
export const site_110 = {
    ...preset,
    MOBILE_WEB_TPL: 'basic', // 手機網頁版模版
    MOBILE_COLOR: 'blue' // 手機網頁版色系
};

export const site_123 = site_110;

/**
 * knight casino 測試站
 */
export const site_37 = site_110;

/**
 * 必博 測試站
 */
export const site_500011 = {
    ...preset,
    CUSTOMIZE_HOME_TPL_PATH: [18], // 有客製首頁的模版編號
    MCENTER_COLOR: 'miller', // 會員中心及代理中心色系
    MOBILE_WEB_TPL: 'miller', // 手機網頁版模版
    JOIN_MEMBER_THEME: 'miller'
};

/**
 * 領先國際 測試站
 */
export const site_500013 = {
    ...preset,
    CUSTOMIZE_HOME_TPL_PATH: [19], // 有客製首頁的模版編號
    MOBILE_WEB_TPL: 'brilliant', // 手機網頁版模版
    MOBILE_COLOR: 'bluePurple' // 手機網頁版色系
};

/**
 * 亞博直播 測試站
 */
export const site_500015 = {
    ...preset,
    MOBILE_WEB_TPL: 'porn1', // 手機網頁版模版
    IS_PWA: true
};
/* eslint-enable camelcase */
