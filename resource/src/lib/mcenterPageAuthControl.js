import * as axios from 'axios';
import ajax from '@/lib/ajax';
import i18n from '@/config/i18n';
import common from '@/api/common';
import exceptionList from '@/config/exceptionList';
import { API_COMMISSION_LINK } from '@/config/api';
// eslint-disable-next-line import/no-cycle
import store from '../store';

export default (page) => axios.all([store.dispatch('actionSetUserdata')]).then(() => {
    store.dispatch('actionSetSystemTime');

    // 會員強制修改密碼機制
    if (store.state.memInfo.user.password_reset) {
        return { status: false };
    }

    // 帳號為停權狀態, 且點擊頁面為 綁定銀行卡、存款、取款、額度轉換
    if (store.state.memInfo.user.bankrupt === '1' && store.state.mcenterpage !== page && (page === 'accountBankCard' || page === 'deposit' || page === 'withdraw' || page === 'bankBalanceTran')) {
        alert(i18n.t('S_BANKRUPT_TIP'));
        return { status: false };
    }

    // 頁面為綁定銀行卡、存款、取款 且 未設定姓名
    // 頁面為取款 且 未設定取款密碼
    // 頁面為取款 且 手機驗證沒有通過
    const isException = () => {
        const { wonderCasino, knightCasino } = exceptionList;
        return wonderCasino.concat(knightCasino).includes(store.state.webInfo.alias);
    };
    if (((page === 'accountBankCard' || page === 'withdraw') && !store.state.memInfo.user.name)
            || (page === 'withdraw' && (!(isException() || store.state.memInfo.user.has_withdraw_password) || !store.state.mobileCheck))) {
        store.dispatch('actionSetPop', {
            type: 'note',
            data: 'member'
        });
        return { status: false };
    }

    // 頁面為取款
    if (page === 'withdraw') {
        let isStatusError = false;
        return common.bankCardCheck({
            success: (response) => {
                // 綁定銀行卡內無常用帳號
                if (response.ret === false) {
                    store.dispatch('actionSetPop', {
                        type: 'note',
                        data: 'member'
                    });
                    isStatusError = true;
                }
            }
        }).then(() => ({ status: !isStatusError }));
    }

    // 頁面為我的佣金
    if (page === 'commission') {
        if (!store.state.memInfo.config.wage) {
            return { status: true };
        }
        const newWin = window.open('');
        return ajax({
            method: 'get',
            url: API_COMMISSION_LINK,
            success: (response) => {
                if (!response.ret.uri) {
                    newWin.close();
                    return { status: true };
                }

                newWin.location = response.ret.uri;
                return { status: true };
            },
            fail: () => {
                newWin.close();
            }
        });
    }

    return { status: true };
});
