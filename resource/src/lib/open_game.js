import game from '@/api/game';
import isMobileFuc from '@/lib/is_mobile';
// eslint-disable-next-line import/no-cycle
import store from '@/store';

/**
 * 遊戲另開視窗
 * @param {object} params - 覆蓋預設設定資料
 */
// openGame({ kind: game.kind, vendor: game.vendor, code: game.code, gameType: game.type });
export default (params, fail = () => { }) => {
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
        if (process.env.NODE_ENV === 'development') {
            console.error('未傳 vendor 或 kind');
        }
        return;
    }

    const { vendor, kind, code } = params;
    const temp = { kind };

    if (code) {
        temp.code = code;
    }

    game.gameLink({
        params: temp,
        errorAlert: false,
        success: (response) => {
            console.log(response);
            const { result, ret } = response;
            let query = '';

            if (result !== 'ok') {
                return;
            }

            if (!isMobileFuc() && (vendor === 'sp' || vendor === 'mg')) {
                localStorage.setItem("open-game-link", ret + query);
                return;
            }

            // 80桌參數
            if (vendor === "lg_live" && kind === "2" && this.$route.query && this.$route.query.q === "R") {
                query = '&customize=yabo&tableType=3310';
            }

            localStorage.setItem("open-game-link", ret.url + query);

            // 開啟遊戲時強制關閉下方最愛遊戲框
            store.dispatch('actionSetCollectionStatus', false);

            let link = `/game/${settings.vendor}/${settings.kind}`;
            const option = `width=${settings.width},height=${settings.height}${settings.kind === 4 ? ',scrollbars=yes, resizable=yes' : ''}`;

            if (settings.code) {
                link += `/${settings.code}`;
            }

            if (params.gameType) {
                link += `/${settings.code}?q=${params.gameType}`;
            }
            setTimeout(() => {
                window.open(link, '', option);
            })
        },
        fail: (res) => {
            fail(res);
        }
    }, vendor);
};
