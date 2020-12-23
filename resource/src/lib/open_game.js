import game from "@/api/game";
import { getCookie } from "@/lib/cookie";
import isMobileFuc from "@/lib/is_mobile";
// eslint-disable-next-line import/no-cycle
import store from "@/store";

/**
 * 遊戲另開視窗
 * @param {object} params - 覆蓋預設設定資料
 */
// openGame({ kind: game.kind, vendor: game.vendor, code: game.code, gameType: game.type });
export default (params, success = () => {}, fail = () => {}) => {
  localStorage.setItem("is-open-game", true);
  setTimeout(() => {
    localStorage.removeItem("is-open-game");
  }, 2000);

  console.log(params);
  let width = 1024;

  // IM電競 在 IE 瀏覽器最小寬度要 1280
  if (params.kind === 1 && params.vendor === "tgp") {
    width = 1280;
  }

  const settings = {
    vendor: "",
    kind: "",
    code: "",
    width,
    height: 768,
    gameName: "",
    ...params
  };

  if (!settings.vendor || !settings.kind) {
    fail({ data: { msg: "vendor 遗失" } });
    return;
  }

  const { vendor, kind, code, gameType, gameName } = params;
  const temp = { kind };

  if (code) {
    temp.code = code;
  }

  if (vendor === "bbin") {
    temp.mobile = "1";
  }

  let newWindow = "";
  let isWebview = getCookie("platform") === "H";
  let isIframeSite = ["evo", "allwin", "sigua_ly"].includes(vendor);
  let gameTitle = "";
  let option = `width=1024, height=768, scrollbars=yes, resizable=yes,location=no, menubar=no, toolbar=no`;
  if (vendor === "evo") {
    gameTitle = "EVO视讯";
  } else if (vendor === "allwin") {
    gameTitle = "500万彩票";
  } else if (vendor === "sigua_ly") {
    gameTitle = "丝瓜直播";
  }

  gameTitle = gameName || gameTitle;

  if (!isIframeSite && !isWebview) {
    newWindow = window.open("", gameTitle, option);
    setTimeout(() => {
      newWindow.location = "/game/loading/true";
    }, 200);
  }

  //XBB棋牌須額外修改platform=AIO 移除上滑全屏遮罩
  if (vendor === "lg_card" || vendor === "lg_yb_card") {
    temp.isPWA = 1;
  }

  return game.gameLink(
    {
      params: temp,
      errorAlert: false,
      redirect: false,
      success: response => {
        console.log(response);
        const { result, ret } = response;
        let query = "";

        if (result !== "ok") {
          fail({ data: { msg: "open game fail" } });
          return;
        }

        if (!isMobileFuc() && (vendor === "sp" || vendor === "mg")) {
          localStorage.setItem("open-game-link", ret + query);
          return;
        }

        /* 補各自遊戲參數 */
        // 80桌參數
        if (
          vendor === "lg_live" &&
          String(kind) === "2" &&
          gameType &&
          gameType === "sdk"
        ) {
          query += "&customize=yabo&tableType=3310";
        }

        // ISB參數
        if (vendor && vendor.toUpperCase() === "ISB") {
          query += "&allowFullScreen=false";
        }
        // //XBB棋牌須額外修改platform=AIO 移除上滑全屏遮罩
        // if (vendor === "lg_card" || vendor === "lg_yb_card") {
        //   localStorage.setItem(
        //     "open-game-link",
        //     ret.url.replace("platform=web", "platform=AIO") + query
        //   );
        // } else {
        //   localStorage.setItem("open-game-link", ret.url + query);
        // }

        localStorage.setItem("open-game-link", ret.url + query);

        // 開啟遊戲時強制關閉下方最愛遊戲框
        store.dispatch("actionSetCollectionStatus", false);

        let link = `/game/${settings.vendor}/${settings.kind}`;
        // const option = `width=${settings.width},height=${settings.height}${settings.kind === 4 ? ',scrollbars=yes, resizable=yes' : ''}`;

        if (settings.code) {
          link += `/${settings.code}`;
        }

        setTimeout(() => {
          try {
            let isWebview = getCookie("platform") === "H";
            if (isWebview) {
              window.location.href = link;
            } else {
              if (isIframeSite) {
                localStorage.setItem("iframe-third-url", link);
                localStorage.setItem("iframe-third-url-title", gameTitle);
              } else {
                newWindow.location = link;
              }

              console.log("openWindow:", newWindow);
            }
          } catch (e) {
            newWindow ? newWindow.close() : "";
            console.log(e);
            console.log("另开视窗失败 请关闭阻挡弹出式视窗");
            // window.open(link, '', '_blank', true);
          }
          success();

          if (isIframeSite) {
            window.location.href = `/mobile/iframe/game?vendor=${settings.vendor}&kind=${settings.kind}`;
            return;
          }
        }, 200);
      },
      fail: res => {
        newWindow ? newWindow.close() : "";
        console.log("launch 失敗");
        console.log(res);
        fail(res);

        setTimeout(() => {
          localStorage.removeItem("iframe-third-url");
          localStorage.removeItem("is-open-game");
        }, 3000);
      }
    },
    vendor
  );
};
