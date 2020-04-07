// eslint-disable-next-line import/no-cycle
import store from '@/store';

/**
 * 遊戲另開視窗
 * @param {object} params - 覆蓋預設設定資料
 */
export default (params) => {
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

    // 開啟遊戲時強制關閉下方最愛遊戲框
    store.dispatch('actionSetCollectionStatus', false);

    let link = `/game/${settings.vendor}/${settings.kind}`;
    const option = `width=${settings.width},height=${settings.height}${settings.kind === 4 ? ',scrollbars=yes, resizable=yes' : ''}`;

    if (settings.code) {
        link += `/${settings.code}`;
    }

    window.open(link, '', option);
};
