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
import { getCookie, setCookie } from "@/lib/cookie";

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
import { thousandsCurrency } from "@/lib/thousandsCurrency";
import { v4 as uuidv4 } from "uuid";
import version from "@/config/version.json";

let memstatus = true;
let agentstatus = true;

// Webview介接(客端、廳主端)
export const actionSetWebview = ({ commit }) => {
  commit(types.SETWEBVIEW);
};

// 設定後台資料
export const actionSetWebInfo = ({ state, commit, dispatch }, domain) => {
  // PWA/H5 平台
  if (Vue.cookie.get("platform") !== "pwa") Vue.cookie.set("platform", "h");

  // cache 10分鐘
  const timestamp = Math.floor(Date.parse(new Date()) / 600000);
  // 模式：一般/預覽
  const mode = state.preview ? "view" : "comm";
  const status = Vue.cookie.get("newsite") ? "New" : "";
  let configInfo = {};

  if (state.webDomain) {
    configInfo =
      siteConfigTest[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial.preset;
  }

  // 維護domain需另外傳遞
  let _domain = domain || state.webDomain;
  return goLangApiRequest({
    method: "get",
    url: `${configInfo.YABO_GOLANG_API_DOMAIN}/xbb/Common/List?t=${Date.now()}`,
    headers: {
      "x-domain": _domain
    }
  })
    .then(res => {
      const { errorCode, status, data } = res;

      if (status === "000" && errorCode === "00") {
        commit(types.SETWEBINFO, data);

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
      }
    })
    .catch(error => {
      // 無預覽檔案，強制導回一般模式
      if (state.preview) {
        alert("错误讯息 : 无版面编辑资料，请先进入编辑页后再进行预览！");
        window.location.href = "/";
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
        state.mobileInfo.service.url,
        "",
        `width=${state.mobileInfo.service.width}, height=${state.mobileInfo.service.height}`
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
      state.mobileInfo.service.url,
      "",
      `width=${state.mobileInfo.service.url.width}, height=${state.mobileInfo.service.url.height}`
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
  return common.systemTime({
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
    await axios({
      method: "get",
      url: "/getcid"
    })
      .then(res => {
        // if (getCookie("cid") != res.data.cid) {
        //   setCookie("cidd", res.data.cid);
        // }
      })
      .catch(res => {});
    // dispatch("actionSetSystemTime");
    // 暫時移除
    // dispatch('actionSetAppDownloadInfo');

    // 取得當前廳號
    await dispatch("actionSetWebDomain");
    await dispatch("actionSetUserdata");
    await dispatch("actionSetWebInfo", state.webDomain.domain);
    await dispatch("actionGetMobileInfo");
    dispatch("actionGetMemInfoV3");

    await getLang(state.mobileInfo && state.mobileInfo.language, "zh-cn");

    // 設定網站設定檔資訊 (start)
    let configInfo;

    if (state.webDomain) {
      configInfo =
        siteConfigTest[`site_${state.webDomain.domain}`] ||
        siteConfigOfficial[`site_${state.webDomain.domain}`] ||
        siteConfigOfficial.preset;
    }

    let allDomainList = [];
    await goLangApiRequest({
      method: "get",
      url: configInfo.YABO_GOLANG_API_DOMAIN + "/xbb/Domain/List"
    }).then(res => {
      if (res.status === "000") {
        allDomainList = res.data;
      }
    });
    let domainNotSucess = true;
    let domainIdx = 0;
    while (domainNotSucess && domainIdx < allDomainList.length) {
      await goLangApiRequest({
        method: "post",
        url: `${allDomainList[domainIdx]}/api-v2/xbb/Captcha`,
        params: {
          lang: "zh-cn"
        }
      }).then(res => {
        if (res && res.status === "000" && res.data) {
          configInfo.YABO_GOLANG_API_DOMAIN = `${allDomainList[domainIdx]}/api-v2`;
          configInfo.ACTIVES_BOUNS_WEBSOCKET = `${allDomainList[
            domainIdx
          ].replace("https", "wss")}`;
          domainIdx += 1;
          domainNotSucess = false;
        } else {
          domainIdx += 1;
        }
      });
    }
    dispatch("actionSetSiteConfig", configInfo);
    dispatch("actionSetNews");

    if (["porn1", "sg1"].includes(state.webDomain.site)) {
      dispatch("actionSetRechargeConfig");
    }
    dispatch("actionSetSystemDomain");
    dispatch("actionSetDomainConfigV2");
    dispatch("actionSetVersion");

    // dispatch("actionSetPost");

    if (state.loginStatus) {
      const params = {
        // logo: state.mobileInfo.og_img
        //   ? `${state.mobileInfo.cdn_domain}${state.webInfo.og_img}`
        //   : "",
        // mlogo: state.mobileInfo.og_img
        //   ? `${state.mobileInfo.cdn_domain}${state.webInfo.og_img}`
        //   : "",
        // title: encodeURI(state.memInfo.config.domain_name[state.curLang]),
        // favicon: state.mobileInfo.fav_icon
        //   ? `${state.mobileInfo.cdn_domain}${state.webInfo.fav_icon}`
        //   : ""
      };

      // dispatch('actionSetVip');
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
      mcenter.deposit(params, {
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

  let configInfo = {};
  if (state.webDomain) {
    configInfo =
      siteConfigTest[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial.preset;
  }

  const hasLogin = getCookie("cid");
  if (hasLogin) {
    goLangApiRequest({
      method: "post",
      url: `${configInfo.YABO_GOLANG_API_DOMAIN}/xbb/Payment/UserBank/List`
    }).then(res => {
      commit(types.SET_HASBANK, res.data.length > 0);
    });
  }
  //判斷uuid
  let uuidAccount = "";
  let getUuidAccountCookie = localStorage.getItem("uuidAccount");
  if (getUuidAccountCookie) {
    uuidAccount = getUuidAccountCookie;
  } else {
    uuidAccount = uuidv4();
    localStorage.setItem("uuidAccount", uuidAccount);
  }

  if (!document.querySelector('script[data-name="esabgnixob"]')) {
    let script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("data-name", "esabgnixob");
    script.onload = e => {
      //訪客註冊
      if (state.webDomain.site === "ey1" && hasLogin) {
        dispatch("actionSetUserWithdrawCheck");
      }
      if (state.webDomain.site != "ey1") {
        goLangApiRequest({
          method: "put",
          url:
            configInfo.YABO_GOLANG_API_DOMAIN + "/cxbb/Account/guestregister",
          params: {
            account: uuidAccount
          }
        })
          .then(res => {
            if (res.status === "000") {
              let guestCid = res.data.cid;
              let guestUserid = res.data.userid;
              localStorage.setItem("guestCid", guestCid);
              localStorage.setItem("guestUserid", guestUserid);
            } else {
              dispatch("actionSetGlobalMessage", {
                msg: res.msg,
                code: res.code
              });
            }
          })
          .catch(error => {
            if (error.status != "000") {
              dispatch("actionSetGlobalMessage", {
                msg: error.msg,
                code: res.code
              });
            }
          });
      }
    };

    if (window.location.host.includes("localhost")) {
      script.setAttribute(
        "src",
        "https://yb01.66boxing.com/mobile/esabgnixob.js"
      );
    } else {
      script.setAttribute("src", "esabgnixob.js");
    }

    document.head.appendChild(script);
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
      let configInfo;

      if (state.webDomain) {
        configInfo =
          siteConfigTest[`site_${state.webDomain.domain}`] ||
          siteConfigOfficial[`site_${state.webDomain.domain}`] ||
          siteConfigOfficial.preset;
      }

      // 設置正式環境cdn圖片路徑
      let cdnRoot = "";
      if (headers[configInfo.CDN_HEADER]) {
        cdnRoot = `https://${headers[configInfo.CDN_HEADER].split(",")[0]}`;
      }
      commit(types.SETCDNROOT, cdnRoot);
      // let domain = data.ret.user.domain.toString();
      // switch (domain) {
      //   case "9999894":
      //   case "93":
      //   case "92":
      //     configInfo = siteConfigOfficial[`site_92`];
      //     break;
      //   case "500023":
      //   case "41":
      //   case "74":
      //   case "100004":
      //     configInfo = siteConfigOfficial[`site_41`];
      //     break;
      //   case "500035":
      //   case "80":
      //   case "81":
      //   case "100009":
      //     configInfo = siteConfigOfficial[`site_80`];
      //     break;
      //   case "500015":
      //   case "69":
      //   case "67":
      //   case "100003":
      //   default:
      //     configInfo = siteConfigOfficial[`site_67`];
      //     break;
      // }
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

export const actionSetVersion = ({ commit, state }) => {
  let platform = Vue.cookie.get("platform")
    ? String(Vue.cookie.get("platform"))
        .toUpperCase()
        .charAt(0)
    : "H";
  let version = `${state.siteConfig.VERSION} ${platform}`;
  commit(types.SETVERSION, version);
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
export const actionSetUserBalance = ({ commit, dispatch, state }) => {
  return goLangApiRequest({
    method: "get",
    url: state.siteConfig.YABO_GOLANG_API_DOMAIN + "/xbb/Vendor/All/Balance",
    params: {
      lang: "zh-cn"
    }
  })
    .then(res => {
      if (res && res.status === "000" && res.data) {
        commit(types.SETUSERBALANCE, res.data);
      } else {
        const data = res && res.data;
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
          if (res) {
            dispatch("actionSetGlobalMessage", {
              msg: res.msg,
              code: res.code
            });
          }
        }
      }
    })
    .catch(error => {});
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

// 會員端-設定跑馬燈 (首頁)
export const actionSetNews = ({ commit }) =>
  member.news({
    success: response => {
      commit(types.SETNEWS, response.ret);
    }
  });

// 會員端-設定跑馬燈 (充值/提現)
export const actionSetAnnouncementList = ({ commit, state }, { type }) => {
  let configInfo = {};

  if (state.webDomain) {
    configInfo =
      siteConfigTest[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial.preset;
  }

  return goLangApiRequest({
    method: "get",
    url: configInfo.YABO_GOLANG_API_DOMAIN + "/xbb/Announcement/List",
    params: {
      configType: type,
      active: 1
    }
  })
    .then(res => {
      const { data, status, errorCode, msg } = res;

      if (errorCode !== "00" || status !== "000") {
        if (msg) {
          dispatch("actionSetGlobalMessage", {
            msg
          });
        }

        // errorCode: "01" status: "000" = 意指查詢動作執行成功，但無資料返回的情境
        commit(types.SET_ANNOUNCEMENTLIST, []);
        return;
      }

      commit(types.SET_ANNOUNCEMENTLIST, data);
      return;
    })
    .catch(error => {
      const { msg, code } = error.response.data;
      dispatch("actionSetGlobalMessage", {
        msg,
        code
      });
    });
};
// 會員端-設定公告
export const actionSetPost = ({ commit, state }, postType = 1) => {
  return goLangApiRequest({
    method: "get",
    url: `${state.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Player/Announcement`,
    params: {
      page: +postType //0 首頁與優惠頁, 1首頁, 2優惠頁
    }
  })
    .then(res => {
      if (res && res.data && res.data.ret) {
        commit(types.SETPOST, res.data);
      }
    })
    .catch(error => {});
};

// 會員端-加入最愛的遊戲列表
export const actionSetFavoriteGame = ({ commit, state }, vendor = "") => {
  return goLangApiRequest({
    method: "post",
    url: `${state.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Favorite/Game`,
    params: {
      firstResult: 0,
      maxResults: 100,
      vendor: vendor
    }
  })
    .then(res => {
      if (res && res.data && res.data.ret) {
        commit(types.SETFAVORITEGAME, res.data.ret);
      } else {
        commit(types.SETFAVORITEGAME, []);
      }
    })
    .catch(error => {});
};

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
            siteConfigOfficial[`site_${state.webDomain.domain}`] ||
            siteConfigOfficial.preset;
        } else {
          configInfo =
            siteConfigTest[`site_${state.webDomain.domain}`] ||
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
export const actionGetMobileInfo = ({ commit, state, dispatch }, datatpl) => {
  let configInfo = {};

  if (state.webDomain) {
    configInfo =
      siteConfigTest[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial.preset;
  }
  document.title = configInfo.SITE_NAME;
  let manifest = document.createElement("link");
  manifest.rel = "manifest";
  manifest.href = `/static/tpl/analytics/${state.webDomain.site}/manifest.json`;
  manifest.setAttribute("data-name", "manifest");

  if (!document.querySelector('script[data-name="manifest"]')) {
    document.querySelector("head").append(manifest);
  }

  return goLangApiRequest({
    method: "get",
    url: configInfo.YABO_GOLANG_API_DOMAIN + "/xbb/Common/Jackfruit/List"
  })
    .then(res => {
      const { result, data } = res.data;
      if (result === "ok") {
        commit(types.SETMOBILEINFO, { ...data, alias: state.webDomain });
      }
    })
    .catch(error => {
      dispatch("actionSetGlobalMessage", {
        msg: error.response?.data?.msg,
        code: error.response?.data?.code
      });
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
      siteConfigOfficial.preset;
  }

  let reqHeaders = {};
  if (data && data.reqHeaders) {
    reqHeaders["cid"] = data.reqHeaders.cid;
  }

  let domain = new Promise(resolve => {
    goLangApiRequest({
      method: "get",
      url: configInfo.YABO_GOLANG_API_DOMAIN + "/xbb/Domain/Hostnames/V2",
      headers: {
        ...reqHeaders
      },
      params: {
        // 1:代理獨立網址, 2:會員pwa, 3:會員推廣頁, 4:代理登入頁, 5:代理pwa, 6:落地頁, 7:前導頁
        clientType: 6
      }
    }).then(res => {
      if (res && res.data) {
        return resolve(res.data[0]);
      } else {
        return resolve("");
      }
    });
  });

  let agentCode = new Promise(resolve => {
    goLangApiRequest({
      method: "get",
      url: configInfo.YABO_GOLANG_API_DOMAIN + "/xbb/Player/Promotion",
      headers: {
        ...reqHeaders
      },
      params: {
        // 1:代理獨立網址, 2:會員pwa, 3:會員推廣頁, 4:代理登入頁, 5:代理pwa, 6:落地頁, 7:前導頁
        clientType: 3
      }
    }).then(res => {
      if (res && res.data) {
        // 縮網址推廣連結
        commit(types.SET_PROMOTION_LINK, res.data.url);
        return resolve(res.data.code);
      } else {
        return resolve("");
      }
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
      siteConfigOfficial.preset;
  }

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

export const actionSetRechargeConfig = ({ commit, state }, data) => {
  let configInfo = {};

  if (state.webDomain) {
    configInfo =
      siteConfigTest[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial.preset;
  }
  if (!["porn1", "sg1", "aobo1"].includes(configInfo.MOBILE_WEB_TPL)) {
    return Promise.resolve(null);
  }

  const hasLogin = getCookie("cid");
  if (!hasLogin) {
    return Promise.resolve(null);
  }

  return axios({
    method: "get",
    url: "/api/v1/c/recharge/config"
  }).then(res => {
    if (res && res.data && res.data.result === "ok") {
      commit(types.SET_RECHARGECONFIG, res.data.ret);
      return res.data.ret;
    }
  });
};

export const actionSetRechargeBonusConfig = ({ commit }, data) => {
  const hasLogin = getCookie("cid");
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

export const actionSetShowRedEnvelope = ({ commit }, data) => {
  commit(types.SET_REDENVELOPE, data);
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
        const user_bank = goLangApiRequest({
          method: "post",
          url: `${configInfo.YABO_GOLANG_API_DOMAIN}/xbb/Payment/UserBank/List`
        }).then(res => {
          if (
            res &&
            res.data &&
            res.data.result === "ok" &&
            res.data.length > 0
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

export const actionSetUserLevels = ({ commit, dispatch }) => {
  return axios({
    method: "get",
    url: "/api/v1/c/levels/by_user"
  })
    .then(response => {
      const { ret, result } = response.data;

      if (!response || result !== "ok") {
        return;
      }

      commit(types.SET_USER_LEVELS, ret);
    })
    .catch(error => {
      dispatch("actionSetGlobalMessage", {
        msg: error.response?.data?.msg,
        code: error.response?.data?.code
      });
    });
};

export const actionGetMemInfoV3 = ({ state, dispatch, commit }) => {
  const hasLogin = getCookie("cid");
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
      siteConfigTest[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial.preset;
  }

  let site = configInfo.MOBILE_WEB_TPL;
  let regex = "";
  let val = data.value.replace(" ", "").trim();

  switch (data.target) {
    case "username":
      val = val
        .replace(/[\W]/g, "")
        .replace(/\_/g, "")
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

    case "login_password":
      val = val.replace(/[^A-Za-z0-9._\-!@#$&+=|*]/g, "").substring(0, 12);
      break;

    case "password":
    case "new_password":
    case "confirm_password":
      // val = val.replace(/[^\a-\z\A-\Z0-9\._\!@#$&=|\-\=\+]/g, "");
      val = val
        .replace(/[\W]/g, "")
        .replace(/\_/g, "")
        .substring(0, 12);
      // .toLowerCase();
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
      val = val.replace(/[^0-9]/g, "").substring(0, 13);
      // 輸入金額轉千分位
      // val = val
      //   .toString()
      //   .replace(
      //     /^(-?\d+?)((?:\d{3})+)(?=\.\d+$|$)/,
      //     (all, pre, groupOf3Digital) =>
      //       pre + groupOf3Digital.replace(/\d{3}/g, ",$&")
      //   );
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

    case "search_video":
      regex = /[^\u3000\u3400-\u4DBF\u4E00-\u9FFF[0-9a-zA-Z]/g;
      val = val.replace(regex, "");
      break;

    // case "USDT-address":
    //   val = val.substring(0, 42);
    //   break;
  }

  return val;
};

export const actionSetSystemDomain = ({ commit, state }, data) => {
  let configInfo;

  if (state.webDomain) {
    configInfo =
      siteConfigTest[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial[`site_${state.webDomain.domain}`] ||
      siteConfigTest[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial.preset;
  }

  if (!["porn1", "sg1"].includes(configInfo.MOBILE_WEB_TPL)) {
    return;
  }

  const getV2Token = uri => {
    let bodyFormData = new FormData();
    let spaceID =
      (configInfo.PORN_CONFIG &&
        configInfo.PORN_CONFIG.ID &&
        configInfo.PORN_CONFIG.ID.SPACE) ||
      "";

    bodyFormData.append("spaceId", spaceID);
    bodyFormData.append(
      "secretKey",
      "4dqDdQMC@Kab7bNs%Hs+kZB5F?t#zmzftbgk4PUzN+6@hb8GC?qK?k$AyhYNSXf2"
    );

    if (!uri) {
      return;
    }

    axios
      .post(`${uri}/api/v1/video/getspaceIdJWT`, bodyFormData)
      .then(function(res) {
        if (res.data && res.data.result && res.data.status === 100) {
          Vue.cookie.set("s_jwt", res.data.result);
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  return goLangApiRequest({
    method: "get",
    url: `${
      configInfo.YABO_GOLANG_API_DOMAIN
    }/cxbb/System/domain?t=${Date.now()}`
  }).then(res => {
    if (res && res.data) {
      commit(types.SET_SYSTEMDOMAIN, res.data);

      let domainListV2 = res.data.filter(
        i => i.name === "XXX-DOMAIN-URL-V2" && i.type === "du"
      );

      if (domainListV2 && domainListV2.length > 0) {
        let tmp = domainListV2[Math.floor(Math.random() * domainListV2.length)];

        let value = "";
        if (tmp) {
          value = tmp.value;
        }

        if (value && value.length > 0) {
          setCookie("s_enable", 1);
          commit(types.SET_PORNDOMAIN, value);
          getV2Token(value);
          return;
        }
      }

      console.log("not found v2");
      setCookie("s_enable", "");
      let domainList = res.data.filter(
        i => i.name === "XXX-DOMAIN-URL" && i.type === "du"
      );

      // 使用隨機一組domain
      let result =
        domainList[Math.floor(Math.random() * domainList.length)].value;
      if (domainList && domainList.length > 0) {
        commit(types.SET_PORNDOMAIN, result);
      } else {
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

export const actionSetWebDomain = ({ commit }) => {
  return axios({
    method: "get",
    url: "/conf/domain",
    timeout: 5000
  })
    .then(res => {
      let result = {
        domain: "",
        site: ""
      };

      console.log(
        "%c [conf/domain]:",
        "background: #222; color: yellow; font-size:14px",
        {
          ...res.data,
          version: version.find(i => i.site === "porn1").version
        }
      );
      const site = (res && res.data && String(res.data.site)) || "";
      const domain = (res && res.data && String(res.data.domain)) || "";
      if (!site || !domain) {
        window.location.href = "/500";
        return;
      }
      result["site"] = site;
      result["domain"] = domain;
      commit(types.SET_WEB_DOMAIN, result);
      return result;
    })
    .catch(res => {
      console.log("[conf/domain]:", res);
      window.location.href = "/500";
    });
};

// SWAG設定
export const actionSetSwagConfig = ({ commit, state, dispatch }, data) => {
  return;

  // let configInfo;
  // if (state.webDomain) {
  //   configInfo =
  //     siteConfigTest[`site_${state.webDomain.domain}`] ||
  //     siteConfigOfficial[`site_${state.webDomain.domain}`] ||
  //     siteConfigOfficial.preset;
  // }

  // return bbosRequest({
  //   method: "get",
  //   url: configInfo.BBOS_DOMIAN + "/Ext/Swag/Domain/Config",
  //   reqHeaders: {
  //     Vendor: state.webDomain.domain
  //   },
  //   params: {
  //     lang: "zh-cn"
  //   }
  // }).then(res => {
  //   if (res.errorCode !== "00" || res.status !== "000") {
  //     return res;
  //   }
  //   commit(types.SET_SWAG_CONFIG, res.data);
  // });
};

export const actionSetSwagBalance = ({ commit, state }, data) => {
  return;

  // const hasLogin = getCookie("cid");
  // if (!hasLogin) {
  //   return;
  // }

  // let configInfo = {};
  // if (state.webDomain) {
  //   configInfo =
  //     siteConfigTest[`site_${state.webDomain.domain}`] ||
  //     siteConfigOfficial[`site_${state.webDomain.domain}`] ||
  //     siteConfigOfficial.preset;
  // }

  // return bbosRequest({
  //   method: "get",
  //   url: configInfo.BBOS_DOMIAN + "/Ext/Swag/Vendor/Quota",
  //   reqHeaders: {
  //     Vendor: state.webDomain.domain
  //   },
  //   params: {
  //     lang: "zh-cn"
  //   }
  // }).then(res => {
  //   if (res.errorCode !== "00" || res.status !== "000") {
  //     return;
  //   }
  //   commit(types.SET_SWAG_BALANCE, res.data);
  // });
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
          msg
        });
        return Promise.resolve(false);
      }

      return Promise.resolve(data);
    })
    .catch(error => {
      const { msg } = error.response.data;
      dispatch("actionSetGlobalMessage", {
        msg
      });
    });
};

/**
 * 取得維護一覽表
 * @method actionGetServiceMaintain
 */
export const actionGetServiceMaintain = ({ state, dispatch }) => {
  let configInfo = {};

  if (state.webDomain) {
    configInfo =
      siteConfigTest[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial.preset;
  }

  return axios({
    method: "get",
    url: "/api/v1/c/service/maintain/list"
  })
    .then(res => {
      const { result, ret, msg, code } = res.data;
      const target = null;

      if (result !== "ok") {
        dispatch("actionSetGlobalMessage", {
          msg,
          code
        });
        return Promise.resolve(false);
      }

      return Promise.resolve(ret);
    })
    .catch(error => {
      const { msg, code } = error.response.data;
      dispatch("actionSetGlobalMessage", {
        msg,
        code
      });
    });
};

// 取得外部網址連結　C02.272
export const getCustomerServiceUrl = ({ state }, params) => {
  let configInfo = {};

  if (state.webDomain) {
    configInfo =
      siteConfigTest[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial[`site_${state.webDomain.domain}`] ||
      siteConfigOfficial.preset;
  }

  return goLangApiRequest({
    method: "get",
    url: `${configInfo.YABO_GOLANG_API_DOMAIN}/xbb/Link/External/Url`,
    params: {
      lang: "zh-cn",
      ...params
    }
  })
    .then(res => {
      const { status, data, msg, errorCode } = res;

      if (status !== "000" && errorCode !== "00") {
        dispatch("actionSetGlobalMessage", {
          msg,
          code
        });
        return Promise.reject("error");
      }

      return Promise.resolve(data);
    })
    .catch(error => {
      const { msg, code } = error.response.data;
      dispatch("actionSetGlobalMessage", {
        msg,
        code
      });
    });
};

export const actionSetUserWithdrawCheck = ({ state, commit, dispatch }) => {
  let withdraw_info_before_bet = false;
  let ub_before_bet_mode = 0;

  const getDomainConfigV2 = () => {
    return axios({
      method: "get",
      url: "/api/v2/c/domain-config"
    })
      .then(res => {
        if (res && res.data && res.data.ret) {
          // 投注/轉帳前需設定提現資料
          withdraw_info_before_bet = res.data.ret.withdraw_info_before_bet;

          // 投注/轉帳前需綁定銀行卡其他條件
          ub_before_bet_mode = res.data.ret.ub_before_bet_mode;
        }
      })
      .catch(error => {
        const msg = error?.response?.data?.msg;
        const code = error?.response?.data?.code;

        dispatch("actionSetGlobalMessage", {
          msg,
          code
        });
      });
  };

  return getDomainConfigV2().then(() => {
    axios({
      method: "get",
      url: "/api/v2/c/withdraw/check"
    })
      .then(res => {
        const { ret, result, msg, code } = res.data;

        if (!res || result !== "ok") {
          dispatch("actionSetGlobalMessage", {
            msg,
            code
          });
          return;
        }

        // 當開關都沒開，帳戶資料預設為 true
        if (!withdraw_info_before_bet && ub_before_bet_mode === 0) {
          commit(types.SET_USER_WITHDRAWCHECKSTATUS, {
            account: true
            // bank: true
          });

          return;
        }

        // 綁定銀行卡或錢包，目前不會再次呼叫 actionSetUserWithdrawCheck
        // 只有在帳戶資料的頁面觸發此方法

        let isAccountPassed = true;
        let isBankPassed = ret.bank;

        // Bank 綁定狀態
        if (isBankPassed) {
          commit(types.SET_USER_WITHDRAWCHECKSTATUS, {
            bank: true
          });
        } else {
          commit(types.SET_USER_WITHDRAWCHECKSTATUS, {
            bank: false
          });
        }

        // Loop 帳戶欄位
        Object.keys(ret).forEach(item => {
          // 有帳戶欄位未填過
          if (!ret[item] && item !== "bank") {
            isAccountPassed = false;
          }
        });

        if (isAccountPassed) {
          commit(types.SET_USER_WITHDRAWCHECKSTATUS, {
            account: true
          });
        } else {
          commit(types.SET_USER_WITHDRAWCHECKSTATUS, {
            account: false
          });
        }
      })
      .catch(error => {
        const msg = error?.response?.data?.msg;
        const code = error?.response?.data?.code;
        dispatch("actionSetGlobalMessage", {
          msg,
          code
        });
      });
  });
};

// 取得429發送太頻繁字串
export const actionGetToManyRequestMsg = ({ state }, response) => {
  if (response && Number(response.status) === 429) {
    if (response.data && response.data.message) {
      console.log(response.data.message);
      return i18n.t(
        response.data.message
          .toString()
          .toUpperCase()
          .replace(/ /g, "_")
      );
    } else {
      return response;
    }
  }
};

// 取得廳設定 C02.233
export const actionSetDomainConfigV2 = ({ state, dispatch, commit }, data) => {
  if (!state.loginStatus) {
    return;
  }

  return goLangApiRequest({
    method: "get",
    url: `${state.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Domain/Config/V2`
  }).then(res => {
    if (res && res.data) {
      commit(types.SET_DOMAINCONFIG, res.data);
    }
  });
};

export const actionGetLayeredURL = ({ state }, eventCode) => {
  return goLangApiRequest({
    method: "get",
    url: `${state.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Domain/Hostnames/V2`,
    params: {
      // 1:代理獨立網址, 2:會員pwa, 3:會員推廣頁, 4:代理登入頁, 5:代理pwa, 6:落地頁, 7:前導頁
      clientType: 0,
      withLevelHostname: true
    }
  })
    .then(res => {
      const { data, status, errorCode, msg } = res;

      if (errorCode !== "00" || status !== "000") {
        dispatch("actionSetGlobalMessage", {
          msg
        });
        return Promise.resolve(false);
      }

      return Promise.resolve(data);
    })
    .catch(error => {
      const { msg } = error.response.data;
      dispatch("actionSetGlobalMessage", {
        msg
      });
    });
};
// 取得BundleID APP下載開關
export const actionSetLCFSystemConfig = (
  { state, dispatch, commit },
  target = "lcf"
) => {
  return goLangApiRequest({
    method: "get",
    url: `${state.siteConfig.YABO_GOLANG_API_DOMAIN}/cxbb/System/config/lcf`
  }).then(res => {
    if (res && res.data) {
      commit(types.SET_LCFSYSTEMCONFIG, res.data);
    }
  });
};
