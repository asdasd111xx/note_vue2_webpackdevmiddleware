import * as moment from "moment-timezone";

import axios from "axios";
import i18n from "@/config/i18n";
import links from "@/config/links";
import openGame from "@/lib/open_game";
import router from "@/router";
import store from "@/store";

export default target => {
  const curLang = store.state.curLang || "zh-cn";
  const linkType = target.linkType[curLang];
  const linkTo = target.linkTo[curLang];
  const linkItem = target.linkItem[curLang];

  if (process.env.NODE_ENV === "development") {
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

  let linkTitle = "";
  switch (store.state.webDomain.site) {
    case "porn1":
    case "ey1":
    case "sg1":
      // linkTitle = '鸭博娱乐';
      // linkTitle = '亿元娱乐';
      // linkTitle = '丝瓜直播';
      linkTitle = "优惠活动";
      break;
    default:
      break;
  }

  let newWindow;

  // 外部連結
  // 優小祕
  if ((linkType === "external" || linkType === "mi") && linkTo) {
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

    return;
  }

  if (linkType === "internal") {
    switch (linkTo) {
      case "join":
        if (store.state.loginStatus) {
          return;
        }
        router.push("/mobile/joinmember");
        return;

      case "promotion":
        router.push("/mobile/promotion");
        return;
      // ?
      case "home":
        router.push("/mobile/home");
        return;

      case "service":
        let url = store.state.webInfo.on_service_url;
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

      // 需登入
      case "deposit":
      case "withdraw":
      case "bankRebate":
        if (!store.state.loginStatus) {
          router.push(`/mobile/login`);
          return;
        }

        router.push(`/mobile/mcenter/${linkTo}`);
        return;

      case "cgPay":
        if (!store.state.loginStatus) {
          if (store.state.webDomain.site === "ey1") {
            router.push("/mobile/login");
          } else {
            router.push("/mobile/joinmember");
          }
          return;
        }

        router.push(
          "/mobile/mcenter/bankcard?redirect=home&type=wallet&wallet=CGPay"
        );
        return;

      case "mobileBet":
        return;
    }
  }

  // 遊戲需登入
  if (!store.state.loginStatus) {
    if (store.state.webDomain.site === "ey1") {
      router.push("/mobile/login");
    } else {
      router.push("/mobile/joinmember");
    }
    return;
  }

  const gameList = [
    "live",
    "casino",
    "card",
    "lottery",
    "mahjong",
    "lg_ey_casino",
    "lg_yb_casino",
    "lg_sg_casino",
    "lg_yb_card",
    "lg_ey_card",
    "lg_sg_card"
  ];

  // 遊戲連結
  if (gameList.includes(linkType)) {
    // 熱門
    switch (linkTo) {
      case "lg_yb_card":
      case "lg_ey_card":
      case "lg_sg_card":
      case "lg_yb_casino":
      case "lg_ey_casino":
      case "lg_sg_casino":
        router.push(`/mobile/hotLobby/${linkTo}`);
        return;
      default:
        break;
    }

    let kind = "";
    let code = linkItem || "";
    let vendor = linkTo;
    switch (linkType) {
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

    const gameData = store.state.gameData;
    let activedGame = Object.keys(gameData).some(obj => {
      if (gameData[obj].vendor === linkTo && gameData[obj].kind === kind) {
        linkTitle = gameData[obj].alias;
        return true;
      }
    });

    if (!activedGame) {
      console.log("游戏未开放");
      return;
    }

    // 有遊戲大廳的遊戲
    const hasHall = [3, 5];
    if (hasHall.includes(kind) && !linkItem) {
      switch (kind) {
        case 3:
          router.push(`/mobile/casino/${vendor}`);
          break;
        case 5:
          router.push(`/mobile/card/${vendor}`);
          break;
        // case 6:
        //   router.push(`/mobile/mahjong/${vendor}`);
        //   break;
        default:
      }
      return;
    }

    // 0421 進入遊戲前檢查withdrawcheck
    if (!store.state.isWithdrawChecked) {
      store.dispatch("actionSetGlobalMessage", {
        type: "withdrawcheck",
        origin: "home"
      });
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
        kind: kind || "",
        vendor: vendor || "",
        code: code || "",
        gameName: linkTitle || ""
      },
      openGameSuccessFunc,
      openGameFailFunc
    );
  }
};
