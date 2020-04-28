import * as apiUrl from '../config/api';

import ajax from '../lib/ajax';

export default {
    // 代理資料
    data(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_AGENT,
            errorAlert: false,
            ...args
        });
    },
    // 加入代理
    join(args) {
        return ajax({
            method: 'post',
            url: apiUrl.API_AGENT,
            errorAlert: false,
            ...args
        });
    },
    // 加入代理-欄位設定
    joinConfig(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_AGENT_CONFIG,
            errorAlert: false,
            ...args
        });
    },
    // 代理登入
    login(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_AGENT_LOGIN,
            errorAlert: false,
            ...args
        });
    },
    // 代理登出
    logout(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_AGENT_LOGOUT,
            // errorAlert: false,
            ...args
        });
    },
    // 代理忘記密碼
    pwdForget(args) {
        return ajax({
            method: 'post',
            url: apiUrl.API_AGENT_PWD_FORGET,
            errorAlert: false,
            ...args
        });
    },
    // 會員忘記密碼-手機簡訊
    pwdForgetMobile(args) {
        return ajax({
            method: 'post',
            url: apiUrl.API_AGENT_PWD_FORGET_MOBILE,
            errorAlert: false,
            ...args
        });
    },
    // 會員忘記密碼驗證簡訊
    pwdMobileVerify(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_AGENT_PWD_MOBILE_VERIFY,
            errorAlert: false,
            ...args
        });
    },
    // 會員重設密碼-簡訊
    pwdResetMobile(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_AGENT_PWD_MOBILE_RESET,
            errorAlert: false,
            ...args
        });
    },
    // 代理重設密碼
    pwdReset(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_AGENT_PWD_RESET,
            errorAlert: false,
            ...args
        });
    },
    // 代理跑馬燈
    news(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_AGENT_NEWS,
            errorAlert: false,
            ...args
        });
    },
    // 代理公告
    post(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_AGENT_POST,
            errorAlert: false,
            ...args
        });
    },
    // 使用者層級
    userLevels(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_AGCENTER_USER_LEVELS,
            errorAlert: false,
            ...args
        });
    },
    // 彈跳公告訊息
    announcement(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_AGENT_ANNOUNCEMENT,
            errorAlert: false,
            ...args
        });
    }
};
