//首頁的福利，遊戲，泡泡的體育，都會用到
//????什麼情況   let isWebview = getCookie("platform") === "H";
//vender:遊戲商，kind:種類(gameCategory.js)

//打開方式
//內嵌 1.gameType===event  1.泡泡直播間開遊戲
//內嵌 2.gameType!==event  直接router.push( `/mobile/iframe/game?vendor=${vendor}&kind=${kind}&code=${code}&title=${gameTitle}`);
//外開 newWindow = window.open("", "_blank", option);

//jdb電子-幸運龍為例
//<game-item> 按遊戲圖標觸發 openGame({vendor: 'jdb', kind: 3, code: '39001', gameName: '幸运龙'})
//會先經過內嵌檢查 embedGame = {alias: "JDB电子", category: "slots", kind: 3, vendor: "jdb", vendor_abridge: "JDB"}
//(line:116) return game.gameLink( 取得遊戲連結 -> localStorage.setItem("open-game-link", ret.url + query);
//line:213  router.push(`/mobile/iframe/game?vendor=${vendor}&kind=${kind}&code=${code}&title=${gameTitle}`);
//進入後再開啟本專案的iframe <iframe :src=localStorage.getItem("iframe-third-url");> （resource/src/router/game/components/index.vue）
//拿localStorage.getItem("open-game-link") ->location.replace('url')

import axios from "axios";
import game from "@/api/game";
import { getCookie } from "@/lib/cookie";
import { getEmbedGameVendor } from "./game_option";
import goLangApiRequest from "@/api/goLangApiRequest";
import isMobileFuc from "@/lib/is_mobile";
import router from "@/router";
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

  const { vendor, kind, code, gameType, gameName, getGames } = params;

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
  let option = `width=800, height=600, scrollbars=yes, resizable=yes, location=no, menubar=no, toolbar=no`;
  // 是否調整內嵌
  let embedGame = getEmbedGameVendor(vendor, kind, code);

  if (embedGame) {
    gameTitle = embedGame.alias || vendor.toUpperCase();
  }

  if (!embedGame && !isWebview && gameType !== "event") {
    newWindow = window.open("", "_blank", option);
    setTimeout(() => {
      newWindow.location = "/game/loading/true";
    }, 200);
  }

  let reqs = [];

  const getGameName = () => {
    if (code != "") {
      return goLangApiRequest({
        method: "post",
        url: `${store.state.siteConfig.YABO_GOLANG_API_DOMAIN}/xbb/Games`,
        params: {
          lang: "zh-cn",
          kind: kind,
          vendor: vendor,
          code: code,
          firstResult: 0,
          maxResults: 20
        }
      }).then(res => {
        if (res && res.data && res.data.ret && res.data.ret[0]) {
          gameTitle = res.data.ret[0].name;
        }
      });
    }
  };

  // 泡泡直播固定標題
  // if (vendor === "sigua_ly") {
  //   gameTitle = "絲瓜直播";
  // }

  // 是否強制取得遊戲標題
  if (getGames) {
    reqs.push(getGameName());
  }

  axios.all(reqs).then(() => {
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
          // 20210625 移除
          // if (
          //   vendor === "lg_live" &&
          //   String(kind) === "2" &&
          //   gameType &&
          //   gameType === "sdk"
          // ) {
          //   query += "&customize=yabo&tableType=3310";
          // }

          // ISB參數
          if (vendor && vendor.toUpperCase() === "ISB") {
            query += "&allowFullScreen=false";
          }

          //cq9=>請在url後面添加&leaveUrl=close 就可以正常關閉，若是要回到上一頁的行為，則是串成 &leaveUrl=back
          if (vendor === "cq9") {
            query += "&leaveUrl=close";
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

          let link = `/game/${vendor}/${kind}`;

          if (code) {
            link += `/${code}`;
          }

          setTimeout(() => {
            let isWebview = getCookie("platform") === "H";

            if (isWebview) {
              router.replace(link);
            } else {
              if (embedGame || gameType === "event") {
                localStorage.setItem("iframe-third-url", link);
                localStorage.setItem("iframe-third-url-title", gameTitle);
                if (
                  window.location.pathname.includes("casino") ||
                  window.location.pathname.includes("card")
                ) {
                  const origin = `${window.location.pathname.replace(
                    "/mobile/",
                    ""
                  )}${window.location.search}`;
                  localStorage.setItem("iframe-third-origin", origin);
                }
              } else {
                newWindow.location.replace(link);
              }
            }

            success(response); //以jdb為例，若玩家直接輸入網址進入common/iframe 會拿不到localStorage.getItem("iframe-third-url");
            //那就會在common/iframe 呼叫open_game.js 在successFun直接 this.src = localStorage.getItem("iframe-third-url");

            if (
              embedGame &&
              !localStorage.getItem("reload-game") &&
              gameType !== "event"
            ) {
              if (
                store.state.siteConfig.ROUTER_TPL === "sg1" &&
                vendor === "ai"
              ) {
                router.push(
                  `/mobile/iframe/game?vendor=${vendor}&kind=${kind}&code=${code}&title=${gameTitle}&hasFooter=true&hasHeader=false`
                );
                return;
              }

              router.push(
                `/mobile/iframe/game?vendor=${vendor}&kind=${kind}&code=${code}&title=${gameTitle}`
              );
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
  });
};
