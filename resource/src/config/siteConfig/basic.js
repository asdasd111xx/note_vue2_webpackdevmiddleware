/* eslint-disable camelcase */
/**
 * 網站設定檔預設值
 */
import version from "@/config/version.json";

export const basic = {
  CUSTOMIZE_HOME_TPL_PATH: [], // 有客製首頁的模版編號
  MCENTER_COLOR: "basic", // 會員中心及代理中心色系
  JOIN_MEMBER_THEME: "default", // 加入會員 / 加入代理樣式

  MOBILE_WEB_TPL: "porn1", // 手機網頁版模版
  IS_MOBILE: true // 是否為PWA站 手機版
};

// 統一版本號
export const getVersion = tpl => {
  let _tpl = version.find(i => i.site === "normal");
  if (_tpl) {
    return _tpl.version;
  }
  return "";
};
