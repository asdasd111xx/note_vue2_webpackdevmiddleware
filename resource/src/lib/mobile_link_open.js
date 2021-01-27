import * as moment from "moment-timezone";

import Vue from "vue";
import axios from "axios";
import i18n from "@/config/i18n";
import links from "@/config/links";
import mcenterPageAuthControl from "@/lib/mcenterPageAuthControl";
import member from "@/api/member";
import openGame from "@/lib/open_game";
import router from "@/router";
import store from "@/store";

export default target => {
  const { linkType, linkTo, linkItem } = target;

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

  // 空白連結
  if (!linkType || linkType === "nolink") {
    return;
  }
  let newWindow = "";
  // 外部連結
  if (linkType === "external") {
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

          if (store.state.webDomain.site !== "ey1") {
            window.location.href = `/mobile/iframe/promotion`;
          } else {
            newWindow = window.open(res.data.ret.uri + "&v=m", "_blank");
          }
        }
      })
      .catch(error => {
        // newWindow.close();
        if (error && error.data && error.data.msg) {
          this.actionSetGlobalMessage({ msg: error.data.msg });
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

    // 優小祕
    if (linkTo === "promotion" && linkItem) {
      localStorage.setItem(
        "iframe-third-url",
        `/popcontrol/promo/${JSON.stringify({ linkItem })}`
      );
      localStorage.setItem("iframe-third-url-title", linkTitle);
      localStorage.setItem("iframe-third-origin", `home`);

      if (store.state.webDomain.site !== "ey1") {
        window.location.href = `/mobile/iframe/promotion`;
      } else {
        newWindow = window.open(
          `/popcontrol/promo/${JSON.stringify({ linkItem })}`,
          "_blank"
        );
      }

      return;
    }

    // 加入會員
    if (linkTo === "join") {
      if (store.state.loginStatus) {
        return;
      }
      router.push("/mobile/joinmember");
      return;
    }

    // 在線客服

    if (linkTo.includes("service")) {
      let url = store.state.webInfo.on_service_url;
      newWindow = window.open(
        url,
        "",
        `toolbar=yes, width=${store.state.webInfo.on_service_w}, height=${store.state.webInfo.on_service_h}`
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

    // 手機下注
    if (linkTo === "mobileBet") {
      if (store.state.loginStatus || store.state.appInfo.unsafe_download) {
        newWindow = window.open(store.state.qrcodeInfo.url);
        return;
      }
      router.push("/mobile/login");
      return;
    }

    // 存款
    if (linkTo === "deposit") {
      Vue.prototype.$depositLink(true);
      return;
    }

    // 取款
    if (linkTo === "withdraw") {
      if (!store.state.loginStatus) {
        alert(i18n.t("S_LOGIN_TIPS"));
        return;
      }

      mcenterPageAuthControl(linkTo).then(response => {
        if (response && response.status) {
          router.push("/mobile/mcenter/withdraw");
        }
      });

      return;
    }

    // 返水
    if (linkTo === "bankRebate") {
      if (!store.state.loginStatus) {
        alert(i18n.t("S_LOGIN_TIPS"));
        return;
      }

      router.push("/mobile/mcenter/bankRebate");
      return;
    }

    // 代理登入
    if (linkTo === "agLogin") {
      if (!store.state.memInfo.config.agent_login) {
        return;
      }

      if (store.state.loginStatus) {
        if (window.confirm(i18n.t("S_LOGOUT_AGENT_CONFIRM"))) {
          member.logout({
            success: () => {
              store.dispatch("actionSetUserdata", true);
              router.push("/mobile/agLogin");
            }
          });
        }

        return;
      }
    }

    if (linkTo === "domain") {
      newWindow = window.open("/mobile/domain", "_blank");
      return;
    }

    if (linkTo === "cgPay") {
      if (!store.state.loginStatus) {
        router.push("/mobile/login");
        return;
      }

      router.push(
        "/mobile/mcenter/bankcard?redirect=home&type=wallet&wallet=CGPay"
      );
      return;
    }

    // 優惠活動、加入代理、電子大廳
    router.push(`/mobile/${linkTo}`);
    return;
  }

  // 遊戲連結
  if (linkType === "games") {
    if (!store.state.gameData[linkTo]) {
      console.log("游戏未开放");
      return;
    }

    const { vendor, kind } = store.state.gameData[linkTo];
    const code = linkItem;
    if (!store.state.loginStatus) {
      router.push("/mobile/login");
      return;
    }

    // 有遊戲大廳的遊戲
    // if (hasHall.includes(kind) && (linkItem === '' || typeof linkItem === 'undefined')) {
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

    const openGameSuccessFunc = res => {};

    const openGameFailFunc = res => {
      if (res && res.data) {
        let data = res.data;
        alert(data.msg);
        // this.actionSetGlobalMessage({
        //   msg: data.msg,
        //   code: data.code,
        //   origin: "home"
        // });
      }
    };

    openGame(
      {
        kind: kind || "",
        vendor: vendor || "",
        code: code || "",
        gameName: localStorage.getItem("iframe-third-url-title") || ""
      },
      openGameSuccessFunc,
      openGameFailFunc
    );
  }
};
