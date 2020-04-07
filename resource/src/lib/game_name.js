import store from '@/store';
import i18n from '@/config/i18n';

/* 取遊戲名稱 */
export default (vendor, kind = '') => {
    // 主帳戶餘額
    if (vendor === '--') {
        return i18n.t('S_MAIN_BALANCE');
    }

    const { gameData } = store.state;
    let text = '';

    if (!kind && vendor === 'bbin') {
        return i18n.t('S_N_BBIN');
    }

    if (!kind && vendor === 'fg') {
        return i18n.t('S_FG');
    }

    Object.keys(gameData).forEach((key) => {
        if (gameData[key].vendor === vendor && (!kind || gameData[key].kind === +kind)) {
            text = gameData[key].alias;
        }
    });
    return text;
};
