// 代理中心驗證

import store from '@/store';
import common from '@/api/common';
import agcenter from '@/api/agcenter';
import exceptionList from '@/config/exceptionList';

const validate = (page) => new Promise((resolve) => {
    // 帳號為停權狀態
    if (store.state.agentInfo.user.bankrupt === '1') {
        resolve({ status: false, message: 'isBankrupt' });
    }

    // 未設定姓名
    if (!store.state.agentInfo.user.name) {
        resolve({ status: false, message: 'noName' });
    }

    // 未通過手機實名認證
    if (page === 'financeWithdraw' && !store.state.mobileCheck) {
        resolve({ status: false, message: 'mobileDidNotPass' });
    }

    if (page !== 'financeWithdraw') {
        resolve({ status: true });
    }

    // 未設定取款密碼
    const isException = () => {
        const { wonderCasino, knightCasino } = exceptionList;
        return wonderCasino.concat(knightCasino).includes(store.state.webInfo.alias);
    };
    if (!(isException() || store.state.agentInfo.user.has_withdraw_password)) {
        resolve({ status: false, message: 'noPassword' });
    }

    // 取會員連動帳號
    agcenter.accountMemUsername({
        success: () => {
            resolve({ status: true });
        },
        fail: () => {
            // 綁定銀行卡內無常用帳號
            common.bankCardCheck({
                success: (data) => {
                    // 綁定銀行卡內無常用帳號
                    if (data.ret === false) {
                        resolve({ status: false, message: 'noCommonAccount' });
                    }
                    resolve({ status: true });
                },
                fail: () => {
                    resolve({ status: false, message: 'noCommonAccount' });
                }
            });
        }
    });
});

export default validate;
