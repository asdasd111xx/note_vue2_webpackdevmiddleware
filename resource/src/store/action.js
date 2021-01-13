import * as axios from "axios";
import * as moment from "moment-timezone";
import * as siteConfigOfficial from "@/config/siteConfig/siteConfigOfficial";
import * as siteConfigTest from "@/config/siteConfig/siteConfigTest";
import * as types from "./mutations_type";

import {
  API_AGENT_USER_CONFIG,
  API_GETAPPINFO,
  API_MCENTER_USER_CONFIG,
  API_QRCODE
} from "@/config/api";

import EST from "@/lib/EST";
import Vue from "vue";
import agcenter from "@/api/agcenter";
import agent from "@/api/agent";
import ajax from "@/lib/ajax";
import bbosRequest from "@/api/bbosRequest";
import common from "@/api/common";
import { errorAlarm } from "@/lib/error_console";
import game from "@/api/game";
import getLang from "@/lib/getLang";
import goLangApiRequest from "@/api/goLangApiRequest";
import i18n from "@/config/i18n";
import links from "@/config/links";
import mcenter from "@/api/mcenter";
// eslint-disable-next-line import/no-cycle
import mcenterPageAuthControl from "@/lib/mcenterPageAuthControl";
import member from "@/api/member";
// eslint-disable-next-line import/no-cycle
import openGame from "@/lib/open_game";
import router from "../router";
import version from "@/config/version.json";
import yaboRequest from "@/api/yaboRequest";

let memstatus = true;
let agentstatus = true;

// Webview介接(客端、廳主端)
export const actionSetWebview = ({ commit }) => {
  commit(types.SETWEBVIEW);
};

// 設定後台資料
export const actionSetWebInfo = ({ state, commit, dispatch }, domain) => {
  let platform = "G";
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams && urlParams.get("platform")) {
    platform = urlParams.get("platform");
  }
  Vue.cookie.set("platform", platform);

  // cache 10分鐘
  const timestamp = Math.floor(Date.parse(new Date()) / 600000);
  // 模式：一般/預覽
  const mode = state.preview ? "view" : "comm";
  const status = Vue.cookie.get("newsite") ? "New" : "";

  return common.backstageSetting({
    url: `/tpl/${domain}/${mode}${status}.json`,
    params: {
      v: timestamp
    },
    success: response => {
      // 超過預覽時間，強制導回一般模式
      if (
        response.view_time &&
        Vue.moment() - Vue.moment(response.view_time) > 600000
      ) {
        alert("错误讯息 : 此预览已超过10分钟有效期!");
        window.location.href = "/";
        return;
      }

      commit(types.SETWEBINFO, response);
      if (Vue.cookie.get("page") === "joinAgent" && state.loginStatus) {
        if (response.pageData[response.page[0].pid].page_type !== "custom") {
          dispatch("actionChangePage", {
            page: response.pageData[response.page[0].pid].page_type,
            type: "custom"
          });
          return;
        }
        dispatch("actionChangePage", {
          page: response.pageData[response.page[0].pid].pid,
          type: "custom"
        });
      }
    },
    fail: () => {
      // 無預覽檔案，強制導回一般模式
      if (state.preview) {
        alert("错误讯息 : 无版面编辑资料，请先进入编辑页后再进行预览！");
        window.location.href = "/";
      }
    }
  });
};

// 設定為預覽模式
export const actionSetPreview = ({ commit }, status) => {
  commit(types.SETPREVIEW, status);
};

// 設定當前語系
export const actionSetLang = (_, lang) => {
  Vue.cookie.set("lang", lang);
  if (window.location.pathname.split("/")[1] === "mobile") {
    window.location.href = "/mobile";
    return;
  }
  window.location.reload();
};

// 設定遊戲資料
export const actionSetGameData = ({ commit }) =>
  game.gameSwitch({
    success: response => {
      commit(types.SETGAMEDATA, response.ret);
    }
  });

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     客端 page
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 客端-設定當前頁
export const actionChangePage = (
  { state, commit, dispatch },
  { page, type, config = {}, subPage } = {}
) => {
  // 自訂頁面不存在
  if (type === "custom" && !state.webInfo.pageData[page]) {
    errorAlarm("PAGE DOES NOT EXIST", [`PAGE ID:${page}`]);
    return;
  }

  if (type === "nolink") return;

  if (type === "external") {
    if (config.height && config.width) {
      window.open(
        page,
        "_blank",
        `height=${config.height},width=${config.width}`
      );
      return;
    }

    window.open(page, "_blank");
    return;
  }

  if (type === "static") {
    if (page === "logOut") {
      if (!state.loginStatus) {
        return;
      }

      member.logout({
        success: () => {
          window.location.reload();
        }
      });
      return;
    }

    if (page === "forgetPW") {
      if (state.loginStatus) {
        return;
      }

      dispatch("actionSetPop", { type: "memPwdForget" });
      return;
    }

    if (page === "join") {
      if (state.loginStatus) {
        return;
      }

      dispatch("actionChangePage", { page: "join", type: "" });
      return;
    }

    const festivalControl = (name, stime, etime, key) => {
      // 判斷是否登入 (此活動頁需登入後才可開啟)
      if (!state.loginStatus) {
        alert(i18n.t("S_LOGIN_TIPS"));
        return;
      }

      const now = moment(state.systemTime).tz("Asia/Shanghai");
      const start = moment(stime).tz("Asia/Shanghai");
      const end = moment(etime).tz("Asia/Shanghai");

      // 活動已結束
      if (now.isAfter(end)) {
        alert(i18n.t("S_PROMOTION_END"));
        return;
      }
      // 活動進行中
      if (now.isBetween(start, end)) {
        window.open(`/popcontrol/festival/${key.vendor}/${key.id}`, "_blank");
      }
    };

    if (page === "service") {
      window.open(
        state.webInfo.on_service_url,
        "",
        `width=${state.webInfo.on_service_w}, height=${state.webInfo.on_service_h}`
      );
      // 在線客服流量分析事件
      window.dataLayer.push({
        dep: 2,
        event: "ga_click",
        eventCategory: "online_service",
        eventAction: "online_service_contact",
        eventLabel: "online_service_contact"
      });
      return;
    }

    // 活動頁面
    if (/^festival*/g.test(page)) {
      // 活動連結判斷
      const festival = links.static.filter(casino => casino.stime);

      festival.some(key => {
        if (page === key.value) {
          festivalControl(page, key.stime, key.etime, key);
          return true;
        }
        return false;
      });
      return;
    }

    if (page === "mobileBet") {
      window.open("/mobileBet", "mobileBet");
      return;
    }

    if (page === "domain") {
      window.open("/domain", "_blank");
      return;
    }
  }

  if (type === "games") {
    const info = state.gameData[page];

    // page type = 電子 並且無設定小遊戲code, 則導轉大廳
    if (info.kind === 3 && !config.linkItem) {
      if (state.casinoLoadingStatus) {
        return;
      }
      commit(types.CHANGEPAGE, "casino");
      commit(types.SETCASINOVENDOR, info.vendor);
      dispatch("actionSetUserdata");
      commit(types.SETPOP, { type: "", data: "" });
      window.scrollTo(0, 0);
      router.push({ path: `/page/casino/${info.vendor}` });
      return;
    }

    // page type = 棋牌 並且無設定小遊戲code, 則導轉大廳
    if (info.kind === 5 && !(config && config.linkItem)) {
      commit(types.CHANGEPAGE, "card");
      dispatch("actionSetUserdata");
      commit(types.SETPOP, {
        type: "",
        data: ""
      });
      window.scrollTo(0, 0);
      router.push({ path: `/page/card/${info.vendor}` });
      return;
    }

    // page type = 麻將 並且無設定小遊戲code, 則導轉大廳
    if (info.kind === 6 && !(config && config.linkItem)) {
      commit(types.CHANGEPAGE, "mahjong");
      dispatch("actionSetUserdata");
      commit(types.SETPOP, {
        type: "",
        data: ""
      });
      window.scrollTo(0, 0);
      router.push({ path: `/page/mahjong/${info.vendor}` });
      return;
    }

    if (!state.loginStatus) {
      alert(i18n.t("S_LOGIN_TIPS"));
      return;
    }

    // 非電子大廳 window open，有指定遊戲id則直接開啟小遊戲
    openGame({
      vendor: info.vendor,
      kind: info.kind,
      code: config.linkItem || ""
    });
    return;
  }

  if (page === "promotion") {
    if (config.linkItem && config.linkItem !== "") {
      window.open(
        `/popcontrol/promo/${JSON.stringify({ linkItem: config.linkItem })}`,
        "_blank"
      );
      return;
    }
  }

  if (page === "joinAgent") {
    if (!state.memInfo.config.agent_login) {
      return;
    }

    let checkPage = page;
    if (type !== "static") {
      let agentPageId;
      let dataLength;

      // 取得 custom 代理頁的 pid, 及判斷頁面是否有元件
      Object.keys(state.webInfo.pageData).forEach(pageId => {
        if (state.webInfo.pageData[pageId].page_key === page) {
          agentPageId = pageId;
          dataLength = state.webInfo.pageData[pageId].case.length;
        }
      });

      // 取得 pid 且頁面資料不為空
      if (agentPageId && dataLength > 0) {
        checkPage = agentPageId;
      }
    }
    if (checkPage === "joinAgent" && state.loginStatus) {
      if (window.confirm(i18n.t("S_LOGOUT_AGENT_CONFIRM"))) {
        member.logout({
          success: () => {
            commit(types.CHANGEPAGE, page);
            dispatch("actionSetUserdata", true);
            commit(types.SETPOP, { type: "", data: "" });
            window.scrollTo(0, 0);
            router.push({ path: "/page/joinAgent" });
          }
        });
      }
      return;
    }
    commit(types.CHANGEPAGE, checkPage);
    dispatch("actionSetUserdata");
    commit(types.SETPOP, { type: "", data: "" });
    window.scrollTo(0, 0);
    router.push({ path: "/page/joinAgent" });
    return;
  }

  // 首頁、優惠頁彈跳公告
  if (
    String(page) === String(state.webInfo.page[0].pid) ||
    page === "promotion"
  ) {
    // 會員首次登入強制修改密碼，不顯示彈跳公告
    if (state.loginStatus && state.memInfo.user.password_reset) {
      return;
    }

    // 代理會員首次登入強制修改密碼，不顯示彈跳公告
    if (state.agentIsLogin && state.agentInfo.user.password_reset) {
      return;
    }

    const postType =
      String(page) === String(state.webInfo.page[0].pid) ? "1" : "2";
    const pagePath = page === "promotion" ? `/page/${page}` : "/";
    dispatch("actionSetPost", postType).then(() => {
      dispatch("actionSetPop", {
        type: "post",
        data: state.post.list
      });
    });

    commit(types.CHANGEPAGE, page);
    router.push({ path: pagePath });
    dispatch("actionSetUserdata");
    window.scrollTo(0, 0);
    return;
  }

  if (
    type === "static" &&
    (page === "deposit" || page === "withdraw" || page === "bankRebate")
  ) {
    // 登入前
    if (!state.loginStatus && (page === "withdraw" || page === "bankRebate")) {
      alert(i18n.t("S_LOGIN_TIPS"));
      return;
    }

    // 登入後 - 取款
    if (page === "withdraw") {
      mcenterPageAuthControl(page).then(response => {
        if (response && response.status) {
          router.push({ path: "/page/mcenter/withdraw" });
        }
      });
      return;
    }

    // 登入後 - 返水
    if (page === "bankRebate") {
      dispatch("actionEnterMCenterThirdPartyLink", {
        type: "links",
        page
      }).then(pageName => {
        if (pageName) {
          router.push({ path: `/page/mcenter/${pageName}` });
        }
      });
      return;
    }

    Vue.prototype.$depositLink(false);
    return;
  }

  // 若連結為電子大廳頁
  if (page === "casino") {
    // 若無一款遊戲開放
    if (
      !Object.keys(state.gameData).some(
        key =>
          state.gameData[key].kind === 3 && state.gameData[key].switch === "Y"
      )
    ) {
      return;
    }

    commit(types.CHANGEPAGE, page);
    commit(types.SETCASINOVENDOR, subPage || "");
    router.push({ path: `/page/${page}/${subPage || ""}` });
    return;
  }

  // 若連結為代理登入
  if (type === "static" && page === "agLogin") {
    if (!state.memInfo.config.agent_login) {
      return;
    }

    dispatch("actionSetPop", { type: page });
    window.scrollTo(0, 0);
    return;
  }

  if (page === "mcenter") {
    router.push({ path: `/page/mcenter/${subPage || "accountData"}` });
    commit(types.CHANGEPAGE, page);
    dispatch("actionSetUserdata");
    commit(types.SETPOP, { type: "", data: "" });
    window.scrollTo(0, 0);
    return;
  }

  if (type === "webview") {
    commit(types.CHANGEPAGE, page);
  }

  if (page === "service") {
    window.open(
      state.webInfo.on_service_url,
      "",
      `width=${state.webInfo.on_service_w}, height=${state.webInfo.on_service_h}`
    );
    // 在線客服流量分析事件
    window.dataLayer.push({
      dep: 2,
      event: "ga_click",
      eventCategory: "online_service",
      eventAction: "online_service_contact",
      eventLabel: "online_service_contact"
    });
    return;
  }

  if (page === "pwdreset") {
    commit(types.CHANGEPAGE, page);
    dispatch("actionSetUserdata");
    commit(types.SETPOP, { type: "", data: "" });
    window.scrollTo(0, 0);

    if (["500000", "48", "50"].includes(state.memInfo.user.domain)) {
      // 威尼斯電腦版重置密碼導頁
      const link = {
        500000: "37762",
        48: "12340",
        58: "12339"
      };

      const pageId = link[state.memInfo.user.domain];
      commit(types.CHANGEPAGE, pageId);
      router.push({
        path: `/page/${pageId}?kr=${config.kr}&type=${config.type}`
      });
      return;
    }
    router.push({ path: `/page/${page}?kr=${config.kr}&type=${config.type}` });
    return;
  }

  // page_type 為 custom (internal) 或 static
  commit(types.CHANGEPAGE, page);
  dispatch("actionSetUserdata");
  commit(types.SETPOP, { type: "", data: "" });
  window.scrollTo(0, 0);
  router.push({ path: `/page/${page}` });
};
// 客端-優惠頁-設定全部資料
export const actionSetPromotion = ({ commit }, promotion) => {
  commit(types.SETPROMOTION, promotion);
};
// 客端-電子頁-設定API讀取狀態
export const actionSetCasinoLoadingStatus = ({ commit }, status) => {
  commit(types.SETCASINOLOADINGSTATUS, status);
};

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     會員、代理 共用
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 會員、代理共用-設定系統時間
export const actionSetSystemTime = ({ commit }, func = () => {}) => {
  common.systemTime({
    success: response => {
      if (response.result === "ok") {
        commit(types.SETSYSTEMTIME, response.ret);
        func();
      }
    }
  });
};
// 會員、代理共用-設定彈出視窗
export const actionSetPop = (
  { state, commit, dispatch },
  { type = "", data = "" } = {}
) => {
  // 會員登入的狀態下, 點擊代理登入, 強制登出會員
  if (type === "agLogin" && state.loginStatus) {
    if (window.confirm(i18n.t("S_LOGOUT_AGENT_CONFIRM"))) {
      member.logout({
        success: () => {
          dispatch("actionSetUserdata", true);
          commit(types.SETPOP, { type, data });
        }
      });
    }
    return;
  }
  commit(types.SETPOP, { type, data });
};

// 會員、代理共用-最新消息彈出視窗
export const actionNewsPopControl = ({ commit }, data) => {
  commit(types.NEWSPOPCONTROL, data);
};
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     MEM 會員相關
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 會員端初始
export const actionMemInit = ({ state, dispatch, commit, store }) => {
  // 設定系統環境為客端
  commit(types.SETENV, "mem");

  return (async () => {
    dispatch("actionSetSystemTime");
    // 暫時移除
    // dispatch('actionSetAppDownloadInfo');

    await dispatch("actionSetWebDomain");
    await dispatch("actionSetUserdata");
    await dispatch("actionSetWebInfo", state.webDomain.domain);
    await dispatch("actionGetMemInfoV3");
    await dispatch("actionGetMobileInfo");

    const defaultLang =
      ["47", "70", "71"].includes(state.memInfo.user.domain) &&
      state.webInfo.is_production
        ? "vi"
        : "zh-cn";
    await getLang(state.webInfo.language, defaultLang);

    // 設定網站設定檔資訊 (start)
    let configInfo;

    if (state.webDomain) {
      configInfo =
        siteConfigTest[`site_${state.webDomain.domain}`] ||
        siteConfigOfficial[`site_${state.webDomain.domain}`] ||
        siteConfigTest[`site_${state.webInfo.alias}`] ||
        siteConfigOfficial.preset;
    }

    dispatch("actionSetSiteConfig", configInfo);
    dispatch("actionSetNews");
    dispatch("actionSetRechargeConfig");
    dispatch("actionSetSystemDomain");
    dispatch("actionSetBBOSDomain");

    if (state.loginStatus) {
      const params = {
        logo: state.webInfo.logo
          ? `${state.webInfo.cdn_domain}${state.webInfo.logo}`
          : "",
        mlogo: state.webInfo.m_logo
          ? `${state.webInfo.cdn_domain}${state.webInfo.m_logo}`
          : "",
        title: encodeURI(state.memInfo.config.domain_name[state.curLang]),
        favicon: state.webInfo.fav_icon
          ? `${state.webInfo.cdn_domain}${state.webInfo.fav_icon}`
          : ""
      };

      // dispatch('actionSetVip');
      dispatch("actionSetPost");
      dispatch("actionSetUserBalance");
      dispatch("actionSetUserConfig");
      // 取得會員我的返水
      mcenter.rebate({
        success: response => {
          if (response.result === "ok") {
            commit(types.SETMCENTERREBATE, {
              embed: response.ret.embed,
              url: response.ret.uri
            });
            return;
          }

          console.log("API ERROR", response.msg);
        }
      });
      // 取得會員取款-手機驗證通過或者不需要驗證
      mcenter.mobileCheck({
        success: response => {
          commit(types.SETMOBILECHECK, {
            status: response.result === "ok"
          });
        }
      });
      // 取得會員存款連結
      await mcenter.deposit(params, {
        success: response => {
          if (response.result === "ok") {
            dispatch("actionSetMcenterDeposit", response.ret);
            return;
          }

          console.log("API ERROR", response.msg);
        }
      });
    }
  })();
};
// 會員端-設定會員資訊
export const actionSetUserdata = (
  { state, dispatch, commit },
  forceUpdate = false
) => {
  // 強制更新, memstatus 變更為 true
  memstatus = forceUpdate || memstatus;

  // 限制三秒內不能重複取
  if (!memstatus) return false;
  memstatus = false;

  setTimeout(() => {
    memstatus = true;
  }, 1000);

  const hasLogin = Vue.cookie.get("cid");
  if (hasLogin) {
    axios({
      method: "get",
      url: "/api/v1/c/player/user_bank/list"
    })
      .then(res => {
        if (res && res.data && res.data.result === "ok") {
          commit(types.SET_HASBANK, res.data.ret.length > 0);
        }
      })
      .catch(error => {
        if (error.response && error.response.data.code === "M00001") {
          dispatch("actionSetGlobalMessage", {
            msg: error.response.data.msg,
            code: error.response.data.code
          });
        }
      });
  }

  return member.data({
    timeout: 10000,
    success: response => {
      const temp = { ...response.ret };
      temp.user.last_login = temp.user.last_login
        ? EST(temp.user.last_login)
        : "--";
      commit(types.SETMEMINFO, temp);
      // 設定遊戲開關
      commit(types.SETGAMEDATA, temp.vendors);
      if (temp.user.id === 0 && temp.user.username === "unknown") {
        commit(types.ISLOGIN, false);
        return;
      }
      commit(types.ISLOGIN, true);
    },
    headers: (headers, data) => {
      let domain = data.ret.user.domain.toString();
      let configInfo;
      switch (domain) {
        case "500023":
        case "41":
        case "74":
        case "100004":
          configInfo = siteConfigOfficial[`site_41`];
          break;
        case "500035":
        case "80":
        case "81":
          configInfo = siteConfigOfficial[`site_80`];
          break;
        case "500015":
        case "69":
        case "67":
        case "100003":
        default:
          configInfo = siteConfigOfficial[`site_67`];
          break;
      }

      let cdnRoot = "";
      if (!["41", "80", "67"].includes(domain)) {
        commit(types.SETCDNROOT, "");
        return;
      }

      // 設置cdn圖片路徑
      if (headers["x-cdn-ey"] && configInfo.MOBILE_WEB_TPL === "ey1") {
        cdnRoot = `https://${headers["x-cdn-ey"].split(",")[0]}`;
      }

      if (headers["x-cdn-yb"] && configInfo.MOBILE_WEB_TPL === "porn1") {
        cdnRoot = `https://${headers["x-cdn-yb"].split(",")[0]}`;
      }

      if (headers["x-cdn-sg"] && configInfo.MOBILE_WEB_TPL === "sg1") {
        cdnRoot = `https://${headers["x-cdn-sg"].split(",")[0]}`;
      }

      commit(types.SETCDNROOT, cdnRoot);
    },
    fail: response => {
      // 連線逾時
      if (typeof response === "string") {
        window.location.href = "/timeout";
        return;
      }
      const code = response.status;
      const statusLink = {
        401: "/no_service", // 非服務區
        404: "/404", // 請求頁面不存在
        500: "/500", // 內部伺服器錯誤
        502: "/upup", // 維護
        503: "/upup" // 維護
      };

      Object.keys(statusLink).forEach(key => {
        // 獨立頁面不需判斷狀態
        if (window.location.pathname.includes("/mobile/webview")) {
          return;
        }

        if (code === +key) {
          window.location.href = statusLink[code];
        }
      });
    }
  });
};
// 會員端-設定登入狀態
export const actionIsLogin = ({ commit }, isLogin) => {
  // GA流量統計
  if (isLogin) {
    window.dataLayer.push({
      dep: 2,
      event: "ga_click",
      eventCategory: "user_login",
      eventAction: "user_login",
      eventLabel: "user_login"
    });
  }

  commit(types.ISLOGIN, isLogin);
};
// 會員端-設定會員餘額
export const actionSetUserBalance = ({ commit, dispatch }) => {
  axios({
    method: "get",
    url: "/api/v1/c/vendor/all/balance"
  })
    .then(res => {
      if (res && res.data && res.data.result === "ok") {
        commit(types.SETUSERBALANCE, res.data);
      }
    })
    .catch(error => {
      const data = error && error.response && error.response.data;
      if (data && data.code === "M00001") {
        dispatch("actionSetGlobalMessage", {
          msg: data.msg,
          cb: () => {
            member.logout().then(() => {
              window.location.href = "/mobile/login?logout=true";
            });
          }
        });
      } else {
        dispatch("actionSetGlobalMessage", {
          msg: data.msg,
          code: data.code
        });
      }
    });
};
// 會員端-設定APP下載資訊
export const actionSetAppDownloadInfo = ({ commit }) => {
  ajax({
    method: "get",
    url: API_GETAPPINFO,
    errorAlert: false
  }).then(response => {
    if (response && response.result === "ok") {
      commit(types.SET_APP_DOWNLOAD_INFO, response.ret);
    }
  });
};
// 會員端-設定APP QR Code
export const actionSetAppQrcode = ({ commit }) =>
  ajax({
    method: "post",
    url: API_QRCODE,
    errorAlert: false,
    params: { path: "mobileBet" },
    success: response => {
      if (response.result !== "ok") {
        return;
      }

      commit(types.SET_APP_QRCODE, response.ret);
    }
  });

// 會員端-設定跑馬燈
export const actionSetNews = ({ commit }) =>
  member.news({
    success: response => {
      commit(types.SETNEWS, response.ret);
    }
  });
// 會員端-設定公告
export const actionSetPost = ({ commit }, postType = 1) =>
  member.post({
    params: {
      page: postType // page參數: 1(預設)：首頁+首頁＆優惠頁，2：優惠頁+首頁＆優惠頁
    },
    success: response => {
      commit(types.SETPOST, response);
    }
  });

// 會員端-加入最愛的遊戲列表
export const actionSetFavoriteGame = ({ commit }, vendor = "") =>
  game.favoriteGame({
    params: {
      max_results: 1000,
      vendor
    },
    success: response => {
      commit(types.SETFAVORITEGAME, response.ret);
    },
    fail: () => {
      commit(types.SETFAVORITEGAME, []);
    }
  });

// 會員端-設定下方遊戲框顯示狀態
export const actionSetCollectionStatus = ({ commit }, status) => {
  commit(types.SET_COLLECTION_STATUS, status);
};

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     AGENT 代理相關
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 代理端初始
export const actionAgentInit = ({ state, dispatch, commit }, next) => {
  // 設定系統環境為代理客端
  commit(types.SETENV, "agent");
  // 依序執行
  axios
    .all([
      (async () => {
        dispatch("actionSetSystemTime");
        await dispatch("actionSetAgentdata");
        if (!state.agentIsLogin) return;
        await dispatch("actionSetWebInfo", state.agentInfo.user.domain);

        const defaultLang =
          ["47", "70", "71"].includes(state.agentInfo.user.domain) &&
          state.webInfo.is_production
            ? "vi"
            : "zh-cn";
        await getLang(state.webInfo.language, defaultLang);
        await dispatch("actionSetAgentPost");

        // 設定網站設定檔資訊 (start)
        let configInfo;
        if (state.webInfo.is_production) {
          configInfo =
            siteConfigOfficial[`site_${state.webInfo.alias}`] ||
            siteConfigOfficial.preset;
        } else {
          configInfo =
            siteConfigTest[`site_${state.webInfo.alias}`] ||
            siteConfigTest.preset;
        }

        dispatch("actionSetSiteConfig", configInfo);
        // 設定網站設定檔資訊 (end)

        await agcenter.mobileCheck({
          success: response => {
            commit(types.SETMOBILECHECK, {
              status: response.result === "ok"
            });
          }
        });
        await agent.userLevels({
          success: response => {
            commit(types.SET_AGENT_USER_LEVELS, response.ret);
          }
        });
        dispatch("actionSetAgentUserConfig");
        dispatch("actionSetGameData");
        dispatch("actionSetAgentNews");
      })()
    ])
    .then(() => {
      if (!next) {
        return;
      }
      next();
    });
};
// 代理端-設定代理資訊
export const actionSetAgentdata = ({ state, commit }, forceUpdate = false) => {
  // 如果強制更新, agentstatus 變更為 true
  agentstatus = forceUpdate || agentstatus;

  // 限制三秒內不能重複取
  if (!agentstatus) return false;
  agentstatus = false;
  setTimeout(() => {
    agentstatus = true;
  }, 3000);

  return agent.data({
    success: response => {
      const temp = { ...response.ret };

      // 當環境為客端，且代理為登入狀態即登出代理
      if (state.env === "mem") {
        agent.logout({
          success: () => {
            this.$router.push({ path: "/agent/accountData" });
          }
        });
      }

      temp.user.last_login = temp.user.last_login
        ? EST(temp.user.last_login)
        : "--";
      commit(types.SETAGENTMEMINFO, temp);
      commit(types.SETAGENTLOGIN, true);
    },
    fail: () => {
      if (window.location.pathname === "/agent") {
        window.location.href = "/";
      }
    }
  });
};
// 代理端-設定登入狀態
export const actionSetAgentLogin = ({ commit }, isLogin) => {
  commit(types.SETAGENTLOGIN, isLogin);
};
// 代理端-設定跑馬燈
export const actionSetAgentNews = ({ commit }) =>
  agent.news({
    success: response => {
      commit(types.SETAGENTNEWS, response.ret);
    }
  });
// 代理端-設定公告
export const actionSetAgentPost = ({ commit }) =>
  agent.post({
    success: response => {
      commit(types.SETAGENTPOST, response);
    }
  });

// 會員返水頁
export const actionEnterMCenterThirdPartyLink = (
  { state, commit },
  { type, page }
) => {
  // 嵌入本站 (iframe)
  if (state.mcenterRebateEmbed) {
    if (type === "links") {
      commit(types.CHANGEPAGE, "mcenter");
    }

    return page;
  }

  window.open(state.mcenterRebate, "_blank");
  return null;
};

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     MCENTER 會員中心
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 會員中心-設定未讀訊息
export const actionSetMcenterMsgCount = ({ state, commit }) => {
  if (!state.loginStatus) return;

  let num = 0;
  mcenter.message({
    success: response => {
      Object.keys(response.ret).forEach(index => {
        if (!response.ret[index].read) {
          num += 1;
        }
      });
      commit(types.SETMCENTERMSGCOUNT, num);
    }
  });
};
// 會員中心-設定我的返水-當前頁籤 (返水歷史/實時返水)
export const actionSetMcenterBankRebate = (
  { commit },
  { type = "", interval = "" } = {}
) => {
  commit(types.SETMCENTERBANKREBATE, { type, interval });
};

// 會員中心-設定存款連結以及内嵌參數
export const actionSetMcenterDeposit = ({ commit }, data) => {
  commit(types.SET_MCENTER_DEPOSIT, data);
};
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     AGCENTER 代理中心
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 代理中心-設定未讀訊息
export const actionSetAgcenterMsgCount = ({ state, commit }) => {
  if (!state.agentIsLogin) return;
  let num = 0;
  agcenter.message({
    success: response => {
      Object.keys(response.ret).forEach(index => {
        if (!response.ret[index].read) {
          num += 1;
        }
      });
      commit(types.SETAGCENTERMSGCOUNT, num);
    }
  });
};
// 代理中心-設定代理會員連動帳號, 塞入agentInfo
export const actionSetAgcenterMemUsername = ({ commit }) => {
  agcenter.accountMemUsername({
    success: response => {
      commit(types.SETAGCENTERMEMUSERNAME, response.ret.username);
    }
  });
};
// 代理中心-設定代理連結(推廣網址)、合營連結, 塞入agentInfo
export const actionSetAgcenterLinks = ({ state, commit }) => {
  const getHostName = new Promise(resolve => {
    if (state.isWebview) {
      return ajax({
        method: "get",
        url: "/api/v1/c/hostnames",
        errorAlert: false
      }).then(res => {
        resolve(`https://${res.ret[0]}`);
      });
    }

    return resolve(window.location.origin);
  });

  Promise.all([getHostName, agcenter.accountLinks()]).then(
    ([hostNameRes, accountLinkRes]) => {
      commit(types.SETAGCENTERLINKS, {
        intrLink: accountLinkRes.ret.code
          ? `${hostNameRes}/a/${accountLinkRes.ret.code}`
          : "",
        outLink: accountLinkRes.ret.url || ""
      });
    }
  );
};
// 代理中心-設定取款選定期數
export const actionSetAgcenterWdPeriod = ({ commit }, obj) => {
  commit(types.SETAGCENTERWDPERIOD, obj);
};

export const actionContactUs = (_, postData) =>
  new Promise(resolve =>
    member
      .contact(postData)
      .then(res => {
        resolve(res);
      })
      .catch(err => {
        resolve(err.response);
      })
  );

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     手機資料
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
export const actionGetMobileInfo = ({ commit, state }, datatpl) => {
  // const status = Vue.cookie.get("newsite") ? "New" : "";
  const status = "";
  let manifest = document.createElement("link");
  manifest.rel = "manifest";
  manifest.href = `/static/tpl/analytics/${state.webDomain.domain}/manifest.json`;
  manifest.setAttribute("data-name", "manifest");

  if (!document.querySelector('script[data-name="manifest"]')) {
    document.querySelector("head").append(manifest);
  }

  return ajax({
    url: `/tpl/${state.webDomain.domain}/mobile${status}.json`,
    method: "get",
    success: response => {
      const { result, data } = response;

      if (result === "ok") {
        commit(types.SETMOBILEINFO, data);
      }
    }
  });
};

// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
//     電子彩金
// ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
// 設定電子彩金資料
export const actionSetJackpot = ({ commit }, postData) => {
  commit(types.SETJACKPOT, postData);
};
// 抓取電子彩金資料
export const actionGetJackpot = (
  { state, commit, dispatch },
  { casinoType, count = 0 }
) => {
  ajax({
    method: "get",
    url: `/api/v1/c/vendor/jackpot_list?vendor=${casinoType}`,
    errorAlert: false,
    success: response => {
      if (response.result === "ok") {
        commit(types.SETJACKPOT, {
          ...state.jackpot,
          [casinoType]: {
            ...state.jackpot[casinoType],
            ...response.ret
          }
        });
      }
    },
    fail: () => {
      setTimeout(() => {
        if (count >= 3) {
          return;
        }

        dispatch("actionGetJackpot", {
          casinoType,
          count: count + 1
        });
      }, 3000);
    }
  });
};

// 設定網站設定檔
export const actionSetSiteConfig = ({ commit }, data) => {
  commit(types.SETSITECONFIG, data);
};

// 推播中心資料
export const actionNoticeData = ({ commit }, data) => {
  commit(types.SETNOTICEDATA, data);
};

export const actionSetVip = ({ commit }) => {
  mcenter.accountVIP({
    success: response => {
      commit(types.SET_VIP, response.ret);
    }
  });
};

// 這裡使用髒髒的方法 取得會員取款-手機驗證通過或者不需要驗證
export const actionSetWithdrawCheck = ({ commit }) => {
  mcenter.mobileCheck({
    success: response => {
      commit(types.SETMOBILECHECK, {
        status: response.result === "ok"
      });
    }
  });
};

// 設定Loading
export const actionSetIsLoading = ({ commit }, data) => {
  commit(types.SET_ISLOADING, data);
};

// 設定會員中心-個人資料-手機/姓名/信箱 綁定成功訊息
export const actionSetＭcenterBindMessage = ({ commit }, data) => {
  commit(types.SET_MCENTER_BIND_MESSAGE, data);
};

// 設定推廣連結
export const actionSetAgentLink = ({ state, commit }, data) => {
  let configInfo = {};
  if (state.webDomain) {
    configInfo =
      siteConfigTest[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial[`site_${state.webDomain.domain}`] ||
      siteConfigTest[`site_${state.webInfo.alias}`] ||
      siteConfigOfficial.preset;
  }

  let reqHeaders = {};
  if (data && data.reqHeaders) {
    reqHeaders["cid"] = data.reqHeaders.cid;
  }

  let domain = new Promise(resolve => {
    bbosRequest({
      method: "get",
      url: configInfo.BBOS_DOMIAN + "/Domain/Hostnames",
      reqHeaders: {
        Vendor: state.memInfo.user.domain,
        ...reqHeaders
      },
      params: {
        lang: "zh-cn"
      }
    }).then(res => {
      if (res.errorCode !== "00" || res.status !== "000") {
        return;
      }
      return resolve(res.data[0]);
    });
  });

  let agentCode = new Promise(resolve => {
    bbosRequest({
      method: "get",
      url: configInfo.BBOS_DOMIAN + "/Player/Promotion",
      reqHeaders: {
        Vendor: state.memInfo.user.domain,
        ...reqHeaders
      },
      params: {
        lang: "zh-cn"
      }
    }).then(res => {
      if (res.errorCode !== "00" || res.status !== "000") {
        return;
      }
      commit(types.SET_PROMOTION_LINK, res.data.url);
      return resolve(res.data.code);
    });
  });

  Promise.all([domain, agentCode]).then(([domain, agentCode]) => {
    commit(types.SET_AGENTLINK, { domain, agentCode });
  });
};

// 鴨脖配置
export const actionSetYaboConfig = ({ state, dispatch, commit }, next) => {
  let configInfo = {};

  if (state.webDomain) {
    configInfo =
      siteConfigTest[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial[`site_${state.webDomain.domain}`] ||
      siteConfigTest[`site_${state.webInfo.alias}`] ||
      siteConfigOfficial.preset;
  }
  // return yaboRequest({
  //   method: 'get',
  //   url: configInfo.YABO_API_DOMAIN + '/system/switch',
  // }).then((res) => {
  //   console.log("api switch test");
  //   if (res && res.data) {
  //     commit(types.SET_YABOCONFIG, res.data);
  //   }
  // });

  return goLangApiRequest({
    method: "get",
    url: configInfo.YABO_GOLANG_API_DOMAIN + "/cxbb/System/switch"
  }).then(res => {
    if (res && res.data) {
      commit(types.SET_YABOCONFIG, res.data);
    }
  });
};

export const actionSetGlobalMessage = ({ commit }, data) => {
  commit(types.SET_GLOBALMESSAGE, data);
};

export const actionSetRechargeConfig = ({ commit }, data) => {
  const hasLogin = Vue.cookie.get("cid");
  if (!hasLogin) {
    return;
  }
  axios({
    method: "get",
    url: "/api/v1/c/recharge/config"
  }).then(res => {
    if (res && res.data && res.data.result === "ok") {
      commit(types.SET_RECHARGECONFIG, res.data.ret);
    }
  });
};

export const actionSetRechargeBonusConfig = ({ commit }, data) => {
  const hasLogin = Vue.cookie.get("cid");
  if (!hasLogin) {
    return;
  }
  return axios({
    method: "get",
    url: "/api/v1/c/recharge/bonus/config"
  }).then(res => {
    if (res && res.data && res.data.result === "ok") {
      commit(types.SET_RECHARGEBONUSCONFIG, res.data.ret);
    }
  });
};

export const actionSetVideoBounsPageStatus = ({ commit }, data) => {
  commit(types.SET_VIDEO_BOUNS_PAGE_STATUS, data);
};

export const actionGetRechargeStatus = ({ state, dispatch, commit }, data) => {
  if (window.CHECKRECHARGETSTATUS) {
    return;
  }
  window.CHECKRECHARGETSTATUS = true;
  setTimeout(() => {
    window.CHECKRECHARGETSTATUS = undefined;
  }, 1200);

  const info = state.memInfoV3.user;
  if (!!info.bankrupt) {
    dispatch("actionSetGlobalMessage", {
      msg: "您的钱包已停权，请联系线上客服！"
    });
    return;
  }

  if (!!info.locked || !!info.tied) {
    dispatch("actionSetGlobalMessage", {
      msg: "请先登入",
      cb: () => {
        member.logout().then(() => {
          window.location.href = "/mobile/login?logout=true";
        });
      }
    });

    return;
  }

  return axios({
    method: "get",
    url: "/api/v1/c/recharge/config"
  })
    .then(res => {
      const config = res.data.ret;

      let bank_required = config.bank_required;
      let enable = config.enable;
      let enabled_by_deposit = config.enabled_by_deposit;
      let enabled_by_withdraw = config.enabled_by_withdraw;

      if (!enable) {
        dispatch("actionSetGlobalMessage", { msg: "额度转让升级中" });
        return;
      }

      const params = [];
      let bank_required_result = {};
      let deposit_result = {};
      let withdraw_result = {};

      if (bank_required) {
        const user_bank = axios({
          method: "get",
          url: "/api/v1/c/player/user_bank/list"
        })
          .then(res => {
            if (
              res &&
              res.data &&
              res.data.result === "ok" &&
              res.data.ret.length > 0
            ) {
              bank_required_result = {
                status: "ok"
              };
            } else {
              bank_required_result = {
                status: "bindcard",
                code: "C50099",
                type: "bindcard"
              };
            }
          })
          .catch(error => {
            bank_required_result = {
              status: "bindcard",
              code: "C50099",
              type: "bindcard"
            };
          });

        params.push(user_bank);
      }

      if (enabled_by_deposit || enabled_by_withdraw) {
        const userStat = axios({
          method: "get",
          url: "/api/v1/c/user-stat/deposit-withdraw"
        })
          .then(res => {
            if (res && res.data && Number(res.data.ret.deposit_count) > 0) {
              deposit_result = {
                status: "ok"
              };
            } else {
              deposit_result = {
                code: "recharge_deposit",
                msg: "只需充值一次 开通转让功能"
              };
            }

            if (res && res.data && Number(res.data.ret.withdraw_count) > 0) {
              withdraw_result = {
                status: "ok"
              };
            } else {
              withdraw_result = {
                code: "recharge_withdraw",
                msg: "只需提现一次 开通转让功能"
              };
            }
          })
          .catch(error => {
            deposit_result = {
              code: "recharge_deposit",
              msg: "只需充值一次 开通转让功能"
            };

            withdraw_result = {
              code: "recharge_withdraw",
              msg: "只需提现一次 开通转让功能"
            };
          });

        params.push(userStat);
      }

      return Promise.all(params).then(() => {
        let result = null;
        if (bank_required && bank_required_result.status !== "ok") {
          result = bank_required_result;
        } else if (enabled_by_deposit && deposit_result.status !== "ok") {
          result = deposit_result;
        } else if (enabled_by_withdraw && withdraw_result.status !== "ok") {
          result = withdraw_result;
        }

        if (result) {
          dispatch("actionSetGlobalMessage", {
            code: result.code,
            origin: data ? data : "home",
            type: result.type,
            msg: result.msg
          });
          return result;
        }

        // 不用檢查銀行卡及充值
        if (!bank_required && !enabled_by_deposit) {
          if (data !== "recharge") {
            window.location.href = "/mobile/mcenter/creditTrans";
          }
          return "ok";
        }

        if (data !== "recharge") {
          window.location.href = "/mobile/mcenter/creditTrans";
        }
        return "ok";
      });
    })
    .catch(error => {
      if (error.response.data.code === "M00001") {
        dispatch("actionSetGlobalMessage", {
          msg: "请先登入",
          cb: () => {
            member.logout().then(() => {
              window.location.href = "/mobile/login?logout=true";
            });
          }
        });
      } else {
        dispatch("actionSetGlobalMessage", {
          msg: error.response.data.msg,
          code: error.response.data.code
        });
      }

      return "error";
    });
};

export const actionSetUserLevels = ({ commit }) => {
  return axios({
    method: "get",
    url: "/api/v1/c/levels/by_user"
  }).then(response => {
    const { ret, result } = response.data;

    if (!response || result !== "ok") {
      return;
    }

    commit(types.SET_USER_LEVELS, ret);
  });
};

export const actionGetMemInfoV3 = ({ state, dispatch, commit }) => {
  const hasLogin = Vue.cookie.get("cid");
  if (!hasLogin || window.CHECKV3PLAYERSTATUS) {
    return;
  }
  window.CHECKV3PLAYERSTATUS = true;

  setTimeout(() => {
    window.CHECKV3PLAYERSTATUS = undefined;
  }, 1200);

  return axios({
    method: "get",
    url: "/api/v3/c/player"
  })
    .then(res => {
      if (res && res.data && res.data.result === "ok") {
        commit(types.SETMEMINFOV3, res.data.ret);
      }
    })
    .catch(error => {
      if (
        error.response.data.code === "M00001" ||
        error.response.data.code === "C600001"
      ) {
        dispatch("actionSetGlobalMessage", {
          msg: error.response.data.msg,
          cb: () => {
            member.logout().then(() => {});
          }
        });
      }
    });
};
// 輸入欄位共用驗證
export const actionVerificationFormData = (
  { state, dispatch, commit },
  data
) => {
  let configInfo = {};

  if (state.webDomain) {
    configInfo =
      siteConfigTest[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial[`site_${state.webDomain.domain}`] ||
      siteConfigTest[`site_${state.webInfo.alias}`] ||
      siteConfigOfficial.preset;
  }

  let site = configInfo.MOBILE_WEB_TPL;
  let regex = "";
  let val = data.value.replace(" ", "").trim();

  switch (data.target) {
    case "username":
      val = val
        .replace(/[\W]/g, "")
        .substring(0, 20)
        .toLowerCase();
      break;

    case "phone":
      let maxLength = 11;
      switch (site) {
        case "ey1":
          maxLength = 0;
          break;
        case "porn1":
        default:
          maxLength = 11;
          break;
      }

      val = val.replace(/[^0-9]/g, "");

      if (maxLength) {
        val = val.substring(0, maxLength);
      }

      break;

    case "password":
    case "confirm_password":
      val = val
        .replace(/[\W]/g, "")
        .substring(0, 50)
        .toLowerCase();
      break;

    case "name":
      regex = /[^\u3000\u3400-\u4DBF\u4E00-\u9FFF.．·]/g;
      //   const regex = /^[^A-Za-z0-9\uFF10-\uFF19\uFF41-\uFF5A\uFF21-\uFF3A，:;！@#$%^&*?<>()+=`|[\]{}\\"/\s~\-_']*$/;

      val = val.replace(regex, "").substring(0, 20);
      break;

    case "alias":
      regex = /[，:;！@#$%^&*?<>()+=`|[\]{}\\"/.~\-_']*/g;
      val = val.replace(regex, "").substring(0, 20);
      break;

    case "graphicVerification":
      regex = /[^0-9a-zA-Z]/g;

      val = val.replace(regex, "").substring(0, 4);
      break;

    case "bankCard":
      val = val.replace(/[^0-9]/g, "").substring(0, 36);
      break;

    case "code":
      val = val.replace(/[^0-9]/g, "").substring(0, 6);
      break;

    case "money":
      val = val.replace(/[^0-9.]/g, "").substring(0, 13);
      break;

    case "withdrawPwd":
      val = val.replace(/[^0-9]/g, "").substring(0, 4);
      break;

    case "address":
      val = val.substring(0, 100);
      break;

    case "mail":
      regex = /[，:;！@#$%^&*?<>()+=`|[\]{}\\"/.~\-_']*/g;
      val = val.replace(regex, "").substring(0, 20);
      break;
    // case "USDT-address":
    //   val = val.substring(0, 42);
    //   break;
  }

  return val;
};

export const actionSetBBOSDomain = ({ commit, state }, data) => {
  let configInfo;

  if (state.webDomain) {
    configInfo =
      siteConfigTest[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial[`site_${state.webDomain.domain}`] ||
      siteConfigTest[`site_${state.webInfo.alias}`] ||
      siteConfigOfficial.preset;
  }

  return bbosRequest({
    method: "get",
    url: configInfo.BBOS_DOMIAN + "/Domain/List",
    reqHeaders: {
      Vendor: state.memInfo.user.domain
    },
    params: {
      lang: "zh-tw"
    }
  }).then(res => {
    if (res && res.data) {
      commit(types.SET_BBOSDOMAIN, res.data[0]);
    }
  });
};

export const actionSetSystemDomain = ({ commit, state }, data) => {
  let configInfo;

  if (state.webDomain) {
    configInfo =
      siteConfigTest[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial[`site_${state.webDomain.domain}`] ||
      siteConfigTest[`site_${state.webInfo.alias}`] ||
      siteConfigOfficial.preset;
  }

  // return yaboRequest({
  //   method: 'get',
  //   url: configInfo.YABO_API_DOMAIN + '/system/domain',
  // }).then((res) => {
  //   if (res && res.data) {
  //     commit(types.SET_SYSTEMDOMAIN, res.data);
  //     let domainList = res.data.filter(i => i.name === "XXX-DOMAIN-URL" && i.type === "du");

  //     // 暫時先取第一組
  //     if (domainList && domainList.length > 0) {
  //       commit(types.SET_PORNDOMAIN, domainList[0].value);
  //     }
  //   }
  // });

  return goLangApiRequest({
    method: "get",
    url: configInfo.YABO_GOLANG_API_DOMAIN + "/cxbb/System/domain"
  }).then(res => {
    if (res && res.data) {
      commit(types.SET_SYSTEMDOMAIN, res.data);
      let domainList = res.data.filter(
        i => i.name === "XXX-DOMAIN-URL" && i.type === "du"
      );

      // 暫時先取第一組
      if (domainList && domainList.length > 0) {
        commit(types.SET_PORNDOMAIN, domainList[0].value);
      }
    }
  });
};

// 會員端-帳戶資料欄位開關
export const actionSetUserConfig = ({ commit }) =>
  ajax({
    method: "get",
    url: API_MCENTER_USER_CONFIG,
    errorAlert: false,
    success: response => {
      if (response && response.result === "ok") {
        commit(types.SET_MCENTER_USER_CONFIG, response.ret);
      }
    }
  });

// 代理端-帳戶資料欄位開關
export const actionSetAgentUserConfig = ({ commit }) =>
  ajax({
    method: "get",
    url: API_AGENT_USER_CONFIG,
    errorAlert: false,
    success: response => {
      if (response && response.result === "ok") {
        commit(types.SET_AGENT_USER_CONFIG, response.ret);
      }
    }
  });

export const actionSetWebDomain = ({ commit }) =>
  axios({
    method: "get",
    url: "/conf/domain"
  })
    .then(res => {
      let result = {
        domain: "",
        site: "porn1"
      };

      console.log("[conf/domain]:", {
        ...res.data,
        version: version.find(i => i.site === res.data.site).version
      });
      const site = (res && res.data && String(res.data.site)) || "";
      const domain = (res && res.data && String(res.data.domain)) || "";
      result["site"] = site;
      result["domain"] = domain;
      commit(types.SET_WEB_DOMAIN, result);
    })
    .catch(res => {
      console.log("[conf/domain]:", res);
      commit(types.SET_WEB_DOMAIN, { site: "porn1", domain: "67" });
    });

// SWAG設定
export const actionSetSwagConfig = ({ commit, state, dispatch }, data) => {
  let configInfo;
  if (state.webInfo.is_production) {
    configInfo =
      siteConfigOfficial[`site_${state.webInfo.alias}`] ||
      siteConfigOfficial.preset;
  } else {
    configInfo =
      siteConfigTest[`site_${state.webInfo.alias}`] || siteConfigTest.preset;
  }

  return bbosRequest({
    method: "get",
    url: configInfo.BBOS_DOMIAN + "/Ext/Swag/Domain/Config",
    reqHeaders: {
      Vendor: state.memInfo.user.domain
    },
    params: {
      lang: "zh-cn"
    }
  }).then(res => {
    if (res.errorCode !== "00" || res.status !== "000") {
      // dispatch("actionSetGlobalMessage", {
      //   msg: res.msg,
      //   code: res.code
      // });
      return;
    }
    commit(types.SET_SWAG_CONFIG, res.data);
  });
};

export const actionSetSwagBalance = ({ commit, state }, data) => {
  const hasLogin = Vue.cookie.get("cid");
  if (!hasLogin) {
    return;
  }
  let configInfo;
  if (state.webInfo.is_production) {
    configInfo =
      siteConfigOfficial[`site_${state.webInfo.alias}`] ||
      siteConfigOfficial.preset;
  } else {
    configInfo =
      siteConfigTest[`site_${state.webInfo.alias}`] || siteConfigTest.preset;
  }

  return bbosRequest({
    method: "get",
    url: configInfo.BBOS_DOMIAN + "/Ext/Swag/Vendor/Quota",
    reqHeaders: {
      Vendor: state.memInfo.user.domain
    },
    params: {
      lang: "zh-cn"
    }
  }).then(res => {
    if (res.errorCode !== "00" || res.status !== "000") {
      return;
    }
    commit(types.SET_SWAG_BALANCE, res.data);
  });
};

/**
 * 取得會員可用出款帳戶 C04.27
 * @method actionGetWithdrawAccount
 */
export const actionGetWithdrawAccount = ({ state, dispatch }) => {
  let configInfo = {};

  if (state.webDomain) {
    configInfo =
      siteConfigTest[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial[`site_${state.webDomain.domain}`] ||
      siteConfigTest[`site_${state.webInfo.alias}`] ||
      siteConfigOfficial.preset;
  }

  return goLangApiRequest({
    method: "get",
    url:
      configInfo.YABO_GOLANG_API_DOMAIN + "/xbb/Ext/Withdraw/User/Account/List",
    params: {
      lang: "zh-cn"
    }
  })
    .then(res => {
      const { data, status, errorCode, msg } = res;

      if (errorCode !== "00" || status !== "000") {
        dispatch("actionSetGlobalMessage", {
          msg: msg
        });
        return;
      }

      return Promise.resolve(data);
    })
    .catch(error => {
      const { msg } = error.response.data;
      dispatch("actionSetGlobalMessage", {
        msg: msg
      });
    });
};
