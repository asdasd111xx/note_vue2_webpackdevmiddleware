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
    IS_PWA: false // 是否為PWA站
};

/* ---------- ↓ 正式站 ---------- */
/**
 * 威尼斯人貴賓廳 正式站正式環境
 */
export const site_48 = {
    ...preset,
    CUSTOMIZE_HOME_TPL_PATH: [17], // 有客製首頁的模版編號
    MCENTER_COLOR: 'theme3', // 會員中心及代理中心色系
    MOBILE_WEB_TPL: 'theme3', // 手機網頁版模版
    MOBILE_BET_THEME: '500000' // 手機下注頁
};

/**
 * 威尼斯人貴賓廳 正式站正式環境
 */
export const site_50 = site_48;

/**
 * 輝煌貴賓會正式站測試環境
 */
export const site_30 = {
    ...preset,
    CUSTOMIZE_HOME_TPL_PATH: [8], // 有客製首頁的模版編號
    MCENTER_COLOR: 'brilliant', // 會員中心及代理中心色系
    JOIN_MEMBER_THEME: 'brilliant'
};

/**
 * 輝煌貴賓會正式站正式環境
 */
export const site_32 = site_30;


/**
 * wonder casino正式站
 */
export const site_29 = {
    ...preset,
    MOBILE_WEB_TPL: 'basic', // 手機網頁版模版
    MOBILE_COLOR: 'blue' // 手機網頁版色系
};

/**
 * wonder casino正式站測試環境
 */
export const site_21 = site_29;

/**
 * 寶馬正式站
 */
export const site_57 = {
    ...preset,
    MOBILE_WEB_TPL: 'brilliant', // 手機網頁版模版
    MOBILE_COLOR: 'bluePurple' // 手機網頁版色系
};

/**
 * 寶馬正式站測試環境
 */
export const site_58 = site_57;

/**
 * 寶馬線上娛樂 正式
 */
export const site_63 = {
    ...preset,
    MOBILE_WEB_TPL: 'brilliant', // 手機網頁版模版
    MOBILE_COLOR: 'bluePurple' // 手機網頁版色系
};

/**
 * 寶馬線上娛樂 DEMO
 */
export const site_64 = site_63;


/**
 * 皇家正式站
 */
export const site_54 = {
    ...preset,
    MOBILE_WEB_TPL: 'brilliant', // 手機網頁版模版
    MOBILE_COLOR: 'bluePurple' // 手機網頁版色系
};

/**
 * 皇家正式站測試環境
 */
export const site_55 = site_54;

/**
 * 必博 正式站正式環境
 */
export const site_52 = {
    ...preset,
    CUSTOMIZE_HOME_TPL_PATH: [18], // 有客製首頁的模版編號
    MCENTER_COLOR: 'miller', // 會員中心及代理中心色系
    MOBILE_WEB_TPL: 'miller', // 手機網頁版模版
    JOIN_MEMBER_THEME: 'miller'
};

/**
 * 必博 正式站測試環境
 */
export const site_53 = site_52;

/**
 * 領先國際 phatplay 正式站
 */
export const site_47 = {
    ...preset,
    CUSTOMIZE_HOME_TPL_PATH: [19], // 有客製首頁的模版編號
    MOBILE_WEB_TPL: 'brilliant', // 手機網頁版模版
    MOBILE_COLOR: 'bluePurple' // 手機網頁版色系
};

/**
 * 領遊正式站別列表
 */
export const site_8 = {
    ...preset,
    MOBILE_WEB_TPL: 'brilliant', // 手機網頁版模版
    MOBILE_COLOR: 'bluePurple' // 手機網頁版色系
};

/**
 * 亞博直播 正式站正式環境
 */
export const site_67 = {
    ...preset,
    MOBILE_WEB_TPL: 'porn1', // 手機網頁版模版
    IS_PWA: true
};

/**
 * 亞博直播 正式站Demo環境
 */
export const site_69 = {
    ...preset,
    MOBILE_WEB_TPL: 'porn1', // 手機網頁版模版
    IS_PWA: true
};

/**
 * VX88正式站
 * https://vx88.688lg.com/
 */
export const site_70 = {
    ...preset,
    CUSTOMIZE_HOME_TPL_PATH: [19], // 有客製首頁的模版編號
    MOBILE_WEB_TPL: 'brilliant', // 手機網頁版模版
    MOBILE_COLOR: 'bluePurple' // 手機網頁版色系
};

/**
 * VX88Demo 正式站Demo環境
 * https://vx8t.688lg.com/
 */
export const site_71 = site_70;

/**
 * 領遊站別列表
 */
export const site_41 = site_8;
export const site_38 = site_8;
export const site_17 = site_8;
export const site_33 = site_8;
export const site_46 = site_8;
export const site_45 = site_8;
/* eslint-enable camelcase */
