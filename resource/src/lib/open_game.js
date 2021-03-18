import game from "@/api/game";
import { getCookie } from "@/lib/cookie";
import { getEmbedGameVendor } from "./game_option";
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

  console.log("[OPEN GAME]", params);

  const { vendor, kind, code, gameType, gameName } = params;
  // IM電競 在 IE 瀏覽器最小寬度要 1280
  // if (params.kind === 1 && params.vendor === "tgp") {
  //   width = 1280;
  // }

  if (!vendor || !kind) {
    fail({ data: { msg: "vendor fail" } });
    return;
  }

  const temp = { kind };

  if (code) {
    temp.code = code;
  }

  if (vendor === "bbin") {
    temp.mobile = "1";
  }

  let newWindow = "";
  let isWebview = getCookie("platform") === "H";
  let gameTitle = "";
  let option = `width=1024, height=768, scrollbars=yes, resizable=yes,location=no, menubar=no, toolbar=no`;
  // 是否調整內嵌
  let embedGame = getEmbedGameVendor(vendor);

  if (embedGame) {
    gameTitle = gameName || embedGame.alias || vendor.toUpperCase();
  }

  if (!embedGame && !isWebview) {
    newWindow = window.open("", gameTitle, option);
    setTimeout(() => {
      newWindow.location = "/game/loading/true";
    }, 200);
  }

  //XBB棋牌須額外修改platform=AIO 移除上滑全屏遮罩
  // if (vendor === "lg_card" || vendor === "lg_yb_card") {
  // }
  temp.is_pwa = 1;

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

        localStorage.setItem(
          "open-game-link",
          ret.url.replace("exit_option=3", "exit_option=1") + query
        );

        // 開啟遊戲時強制關閉下方最愛遊戲框
        store.dispatch("actionSetCollectionStatus", false);

        let link = `/game/${vendor}/${kind}`;

        if (code) {
          link += `/${code}`;
        }

        setTimeout(() => {
          let isWebview = getCookie("platform") === "H";
          if (isWebview) {
            window.location.replace(link);
          } else {
            if (embedGame) {
              localStorage.setItem("iframe-third-url", link);
              localStorage.setItem("iframe-third-url-title", gameTitle);
            } else {
              newWindow.location.replace(link);
            }
          }

          success();

          if (embedGame) {
            window.location.href = `/mobile/iframe/game?vendor=${vendor}&kind=${kind}&code=${code}`;
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
