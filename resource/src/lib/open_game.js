import game from '@/api/game';
import { getCookie } from '@/lib/cookie';
import isMobileFuc from '@/lib/is_mobile';
// eslint-disable-next-line import/no-cycle
import store from '@/store';

/**
 * 遊戲另開視窗
 * @param {object} params - 覆蓋預設設定資料
 */
// openGame({ kind: game.kind, vendor: game.vendor, code: game.code, gameType: game.type });
export default (params, success = () => { }, fail = () => { }) => {
  localStorage.setItem("is-open-game", true);
  console.log(params)
  let width = 1024;

  // IM電競 在 IE 瀏覽器最小寬度要 1280
  if (params.kind === 1 && params.vendor === 'tgp') {
    width = 1280;
  }

  const settings = {
    vendor: '',
    kind: '',
    code: '',
    width,
    height: 768,
    ...params
  };

  if (!settings.vendor || !settings.kind) {
    fail({ data: { msg: 'vendor 遗失' } });
    setTimeout(() => {
      localStorage.removeItem("is-open-game");
    }, 1500)
    return;
  }

  const { vendor, kind, code, gameType } = params;
  const temp = { kind };

  if (code) {
    temp.code = code;
  }

  if (vendor === "bbin") {
    temp.mobile = "1";
  }

  let newWindow = '';
  let isWebview = getCookie("platform") === "H";

  switch (vendor) {
    case 'evo':
    case 'allwin':
      break;
    default:
      if (!isWebview) {
        newWindow = window.open('', '', '_blank', true);
        setTimeout(() => {
          newWindow.location = "/game/loading/true";
        }, 200)
      }
  }

  return game.gameLink({
    params: temp,
    errorAlert: false,
    success: (response) => {
      console.log(response);
      const { result, ret } = response;
      let query = '';

      if (result !== 'ok') {
        fail({ data: { msg: 'open game fail' } });
        return;
      }

      if (!isMobileFuc() && (vendor === 'sp' || vendor === 'mg')) {
        localStorage.setItem("open-game-link", ret + query);
        return;
      }

      /* 補各自遊戲參數 */
      // 80桌參數
      if (vendor === "lg_live" && String(kind) === "2" && gameType && gameType === "R") {
        query += '&customize=yabo&tableType=3310';
      }

      // ISB參數
      if (vendor && vendor.toUpperCase() === 'ISB') {
        query += '&allowFullScreen=false';
      }

      //Xbb lg_casino lg_yb_casino 外開參數
      if (vendor && vendor.toUpperCase().includes('LG')) {
        query += '&pageOption=1';
      }

      localStorage.setItem("open-game-link", ret.url + query);

      // 開啟遊戲時強制關閉下方最愛遊戲框
      store.dispatch('actionSetCollectionStatus', false);

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

            if (vendor === "evo") {
              localStorage.setItem('iframe-third-url', link);
              localStorage.setItem('iframe-third-url-title', 'EVO视讯');
            }
            else if (vendor === "allwin") {
              localStorage.setItem('iframe-third-url', link);
              localStorage.setItem('iframe-third-url-title', '500万彩票');
            } else {
              newWindow.location = link;
            }

            console.log('openWindow:', newWindow);
          }
        } catch (e) {
          newWindow ? newWindow.close() : '';
          console.log(e);
          console.log('另开视窗失败 请关闭阻挡弹出式视窗');
          // window.open(link, '', '_blank', true);
        }
        success();

        switch (vendor) {
          case 'evo':
          case 'allwin':
            window.location.href = `/mobile/iframe/game?vendor=${settings.vendor}&kind=${settings.kind}&hasFooter=false&hasHeader=true`;
            return;
        }

        setTimeout(() => {
          localStorage.removeItem('is-open-game');
        }, 1500);
      }, 200)
    },
    fail: (res) => {
      newWindow ? newWindow.close() : '';
      console.log('launch 失敗');
      console.log(res);
      fail(res);

      setTimeout(() => {
        localStorage.removeItem('iframe-third-url');
        localStorage.removeItem("is-open-game");
      }, 3000)
    }
  }, vendor);
};
