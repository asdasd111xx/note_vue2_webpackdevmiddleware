import * as moment from "moment-timezone";

import axios from "axios";
import { getCookie } from "@/lib/cookie";
import goLangApiRequest from "@/api/goLangApiRequest";
import i18n from "@/config/i18n";
import { lib_useGlobalWithdrawCheck } from "@/lib/withdrawCheckMethod";
import links from "@/config/links";
import openGame from "@/lib/open_game";
import router from "@/router";
import store from "@/store";

export default target => {
  const curLang = store.state.curLang || "zh-cn";
  const linkType = target?.linkType?.[curLang] || target?.linkType;
  const linkTo = target?.linkTo?.[curLang] || target?.linkTo;
  const linkItem = target?.linkItem?.[curLang];
  localStorage.removeItem("iframe-third-url-title");

  if (process.env.NODE_ENV === "development") {
    console.log(target);
    console.log(
      "linkType:",
      linkType,
      "linkTo:",
      linkTo,
      "linkItem:",
      linkItem
    );
  }

  // 空白連結
  if (!linkType || linkType === "nolink") {
    return;
  }

  let linkTitle = target?.linkTitle ? target?.linkTitle : "优惠活动";
  // switch (store.state.webDomain.site) {
  //   case "porn1":
  //   case "ey1":
  //   case "sg1":
  //     // linkTitle = '币发BIFA';
  //     // linkTitle = '亿元娱乐';
  //     // linkTitle = '丝瓜直播';
  //     linkTitle = "优惠活动";
  //     break;
  //   default:
  //     break;
  // }

  let newWindow;

  // 外部連結 不 視為優小秘 20210521
  if (linkType === "external") {
    newWindow = window.open(`${linkTo}`, "_blank");
    return;
  }

  // 優小祕
  if (linkType === "mi" && linkTo) {
    // 未知用途
    // window.open(
    //   `/popcontrol/promo/${JSON.stringify({ linkItem })}`,
    //   "_blank"
    // );

    axios({
      method: "get",
      url: "/api/v1/c/link/customize",
      params: {
        code: "promotion",
        client_uri: linkTo
      }
    })
      .then(res => {
        if (res && res.data && res.data.ret && res.data.ret.uri) {
          localStorage.setItem("iframe-third-url", res.data.ret.uri);
          localStorage.setItem("iframe-third-url-title", linkTitle);
          localStorage.setItem("iframe-third-origin", `home`);
          window.location.href = `/mobile/iframe/promotion`;
        }
      })
      .catch(error => {
        if (newWindow) {
          newWindow.close();
        }
        if (error && error.data && error.data.msg) {
          store.dispatch("actionSetGlobalMessage", { msg: error.data.msg });
        }
      });

    return;
  }

  //  固定連結
  if (linkType === "static") {
    // 活動頁面
    if (/^festival*/g.test(linkTo)) {
      const festivalControl = (name, stime, etime, key) => {
        // 判斷是否登入 (此活動頁需登入後才可開啟)
        if (!store.state.loginStatus) {
          alert(i18n.t("S_LOGIN_TIPS"));
          return;
        }

        const now = moment(store.state.systemTime).tz("Asia/Shanghai");
        const start = moment(stime).tz("Asia/Shanghai");
        const end = moment(etime).tz("Asia/Shanghai");

        // 活動已結束
        if (now.isAfter(end)) {
          alert(i18n.t("S_PROMOTION_END"));
          return;
        }

        // 活動進行中
        if (now.isBetween(start, end)) {
          newWindow = window.open(
            `/popcontrol/festival/${key.vendor}/${key.id}`,
            "_blank"
          );
        }
      };

      // 活動連結判斷
      const festival = links.static.filter(casino => casino.stime);

      festival.some(key => {
        if (linkTo === key.value) {
          festivalControl(linkTo, key.stime, key.etime, key);
          return true;
        }
        return false;
      });
      return;
    }

    // 在線客服
    if (/^service*/g.test(linkTo)) {
      let url = store.state.mobileInfo.service.url;
      window.open(url);

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

    return;
  }

  if (linkType === "internal") {
    switch (linkTo) {
      case "join":
        if (store.state.loginStatus) {
          return;
        }
        if (getCookie("platform") === "h") {
          store.dispatch("actionGetLayeredURL").then(res => {
            if (res.indexOf(window.location.host) != -1 || res.length < 1) {
              router.push(`/mobile/joinmember`);
            } else {
              window.location.replace(`https://${res[0]}/mobile/joinmember`);
            }
          });
        } else {
          router.push(`/mobile/joinmember`);
        }
        return;
      case "discount":
      case "promotion":
        router.push("/mobile/promotion");
        return;
      // ?
      case "home":
        // router.push("/mobile/home");
        return;

      case "service":
        router.push("/mobile/service?prev=false");
        return;

      // 需登入
      case "deposit":
      case "withdraw":
      case "bank-rebate":
        if (!store.state.loginStatus) {
          router.push("/mobile/login");
          return;
        }

        router.push(`/mobile/mcenter/${linkTo.replace("-", "")}`);
        return;

      case "wallet":
        if (!store.state.loginStatus) {
          router.push("/mobile/login");
          return;
        }
        router.push(`/mobile/mcenter/wallet?redirect=home`);
        return;

      case "cgPay":
      case "mobileBet":
      default:
        return;
    }
  }

  if (linkType === "event") {
    switch (linkTo) {
      case "event":
        router.push("/mobile/activity/all/");
        return;

      default:
        console.log(linkTo);

        if (!store.state.loginStatus) {
          router.push("/mobile/login");
          return;
        }

        const eventID = linkTo;
        let newWindow = window.open();
        goLangApiRequest({
          method: "post",
          url:
            store.state.siteConfig.YABO_GOLANG_API_DOMAIN +
            `/xbb/Vendor/all/Event`,
          params: {
            lang: "zh-cn"
          }
        })
          .then(res => {
            if (res && res.status === "000") {
              // 1.尚未開始 2.活動預告 3.活動中 4.結果查詢 5.已結束
              // 1,5 不顯示
              if (res.data.ret.events && res.data.ret.events.length > 0) {
                let result = res.data;
                let activityEvents = result.ret.events
                  .filter(i => i.display)
                  .filter(
                    i => +i.status === 2 || +i.status === 3 || +i.status === 4
                  );

                const target = activityEvents.find(i => i.id === eventID);

                if (!target.is_secure || target.is_secure === "false") {
                  let url = target.url;
                  if (url.indexOf("://") === -1) {
                    url = `https://${url}`;
                  }
                  newWindow.location.href = url;
                  return;
                } else {
                  newWindow.location.href = target.url;
                }
              }
            }

            if (res && res.status !== "000") {
              newWindow.close();
              store.dispatch("actionSetGlobalMessage", {
                msg: res.msg,
                code: res.code
              });
            }
          })
          .catch(error => {
            newWindow.close();
            if (error && error.data && error.data.msg) {
              store.dispatch("actionSetGlobalMessage", {
                msg: error.data.msg,
                code: error.data.code
              });
            }
          });

        return;
    }
  }

  // 遊戲需登入
  let hasTrial = false;
  let kind = "";
  let code = linkItem || "";
  let vendor = linkTo;

  switch (linkType) {
    case "sport":
      kind = 1;
      break;

    case "live":
      kind = 2;
      break;

    case "casino":
      kind = 3;
      break;

    case "lottery":
      kind = 4;
      break;

    case "card":
      kind = 5;
      break;

    case "mahjong":
      kind = 6;
      break;

    default:
      break;
  }

  const hasHall = [3, 5, 6];
  function getTrialList() {
    if (hasHall.includes(kind) && !linkItem) {
      let trialList = JSON.parse(localStorage.getItem("trial-game-list")) || [];
      hasTrial = trialList.find(i => i.vendor === vendor && i.mobile_trial);
    }

    // return  goLangApiRequest({
    //   method: "get",
    //   url: `${store.state.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Vendor/Trial/List`
    // }).then(res => {
    //   let trialList = res.data;
    //   hasTrial = trialList.find(
    //     i => i.vendor === vendor && +i.kind === +game.kind && i.mobile_trial
    //   );
    // });
  }

  if (!store.state.loginStatus) {
    getTrialList();
  }

  // 有遊戲大廳的遊戲
  if (store.state.loginStatus || (!store.state.loginStatus && hasTrial)) {
    if (hasHall.includes(kind) && !linkItem) {
      switch (kind) {
        case 3:
          router.push(
            `/mobile/casino/${vendor}${hasTrial ? "?label=trial" : ""}`
          );
          break;
        case 5:
          router.push(
            `/mobile/card/${vendor}${hasTrial ? "?label=trial" : ""}`
          );
          break;
        case 6:
          router.push(
            `/mobile/mahjong/${vendor}${hasTrial ? "?label=trial" : ""}`
          );
          break;
        default:
          return;
      }
      return;
    }
  }

  if (!store.state.loginStatus && vendor != "sigua_ly") {
    router.push("/mobile/login");
    return;
  }

  const gameList = [
    "sport",
    "live",
    "casino",
    "card",
    "lottery",
    "mahjong",
    "lg_yb_casino",
    "lg_yb_card"
  ];

  // 遊戲連結
  if (gameList.includes(linkType)) {
    // 熱門
    switch (linkTo) {
      case "lg_yb_card":
      case "lg_yb_casino":
        if (!linkItem) {
          router.push(`/mobile/hotLobby/${linkTo}`);
          return;
        }

      default:
        break;
    }

    let notVipGame = JSON.parse(
      localStorage.getItem("needFilterGameData")
    ).find(filterData => {
      return filterData.gameCode === code;
    });
    // console.log(notVipGame);

    if (linkTo === "lg_yb_card" && notVipGame) {
      store.dispatch("actionSetGlobalMessage", { msg: "VIP等级不足" });
      return;
    }

    const gameData = store.state.gameData["_allGame"];
    let activedGame = gameData.some(i => {
      if (i.vendor === linkTo && i.kind === kind) {
        linkTitle = i.alias;
        return true;
      }
    });
    // let activedGame = Object.keys(gameData).some(obj => {
    //   if (gameData[obj].vendor === linkTo && gameData[obj].kind === kind) {
    //     linkTitle = gameData[obj].alias;
    //     return true;
    //   }
    // });

    if (!activedGame) {
      console.log("游戏未开放");
      return;
    }

    // 當前平台維護狀態
    const isVendorMaintain = () => {
      let isMaintain = false;
      let list = JSON.parse(localStorage.getItem("vendorMaintainList"));

      isMaintain = list.some(item => {
        return (
          item.vendor === linkTo.toUpperCase() ||
          item.vendor === linkTo.toLowerCase()
        );
      });

      return isMaintain;
    };

    // 0421 進入遊戲前檢查withdrawcheck
    if (!store.state.withdrawCheckStatus.account && !isVendorMaintain()) {
      lib_useGlobalWithdrawCheck("home");
      return;
    }

    const openGameSuccessFunc = res => {};

    const openGameFailFunc = res => {
      if (res && res.data) {
        let data = res.data;
        store.dispatch("actionSetGlobalMessage", {
          msg: data.msg,
          code: data.code,
          origin: "home"
        });
      }
    };

    openGame(
      {
        kind: kind,
        vendor: vendor,
        code: code,
        getGames: true
      },
      openGameSuccessFunc,
      openGameFailFunc
    );
  }
};
