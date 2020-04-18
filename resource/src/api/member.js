import * as apiUrl from '../config/api';

import ajax from '../lib/ajax';
import ajax2 from '../lib/ajax2';
import axios from 'axios';

export default {
    // 會員-登入後-額度
    balance(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MCENTER_BALANCE_ALL,
            errorAlert: false,
            ...args
        });
    },
    // 會員資料
    data(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MEMBER,
            errorAlert: false,
            ...args
        });
    },
    // 加入會員
    join(args) {
        return ajax2({
            method: 'post',
            url: apiUrl.API_MEMBER,
            ...args
        });
    },
    // 加入會員-欄位設定
    joinConfig(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_JOINMEM_CONFIG,
            errorAlert: false,
            ...args
        });
    },
    // 會員登入
    login(args) {
        return ajax2({
            method: 'put',
            url: apiUrl.API_LOGIN,
            errorAlert: false,
            ...args
        });
    },
    // 會員登出
    logout(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_LOGOUT,
            // errorAlert: false,
            ...args
        }).then((response) => {
            if (response && response.result === 'ok') {
                // GA流量統計
                window.dataLayer.push({
                    ga_uid: undefined
                });
            }
        });
    },
    // 會員忘記密碼
    pwdForget(args) {
        return ajax({
            method: 'post',
            url: apiUrl.API_PWD_FORGET,
            ...args
        });
    },
    // 會員忘記密碼-手機簡訊
    pwdForgetMobile(args) {
        return ajax({
            method: 'post',
            url: apiUrl.API_PWD_FORGET_MOBILE,
            ...args
        });
    },
    // 會員忘記密碼驗證簡訊
    pwdMobileVerify(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_PWD_MOBILE_VERIFY,
            ...args
        });
    },
    // 會員重設密碼
    pwdReset(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_PWD_RESET,
            errorAlert: false,
            ...args
        });
    },
    // 會員重設密碼-簡訊
    pwdResetMobile(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_PWD_MOBILE_RESET,
            ...args
        });
    },
    // 會員跑馬燈
    news(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_GET_NEWS,
            errorAlert: false,
            ...args
        });
    },
    // 會員公告
    post(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_GET_POST,
            errorAlert: false,
            ...args
        });
    },
    // 聯絡我們
    contact(postData) {
        return axios.post(apiUrl.API_CONTACT, postData);
    },
    // 彈跳公告訊息
    announcement(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MEMBER_ANNOUNCEMENT,
            errorAlert: false,
            ...args
        });
    }
};
