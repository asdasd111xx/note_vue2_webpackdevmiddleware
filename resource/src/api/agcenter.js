import * as apiUrl from '../config/api';
import ajax from '../lib/ajax';

export default {
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     帳戶資料
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 【帳戶資料】-設定資料 (個人姓名.出生日期.性別.QQ.微信)
    accountDataSet(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_AGENT,
            ...args
        });
    },
    // 【帳戶資料】-發送信箱驗證碼-秒數倒數
    accountMailSec(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_AGCENTER_MAIL_CHECK_SEC,
            errorAlert: false,
            ...args
        });
    },
    // 【帳戶資料】-發送電話驗證碼-秒數倒數
    accountPhoneSec(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_AGCENTER_PHONE_CHECK_SEC,
            errorAlert: false,
            ...args
        });
    },
    // 【帳戶資料】-發送信箱驗證碼
    accountMailSend(args) {
        return ajax({
            method: 'post',
            url: apiUrl.API_AGCENTER_MAIL_CHECK,
            ...args
        });
    },
    // 【帳戶資料】-發送電話驗證碼
    accountPhoneSend(args) {
        return ajax({
            method: 'post',
            url: apiUrl.API_AGCENTER_PHONE_CHECK,
            ...args
        });
    },
    // 【帳戶資料】-綁定信箱 + 修改資料
    accountMailCheck(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_AGCENTER_MAIL_CHECK,
            ...args
        });
    },
    // 【帳戶資料】-綁定電話 + 修改資料
    accountPhoneCheck(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_AGCENTER_PHONE_CHECK,
            ...args
        });
    },
    // 【帳戶資料】-修改信箱 (無開驗證)
    accountMailEdit(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_AGCENTER_MAIL_EDIT,
            ...args
        });
    },
    // 【帳戶資料】-修改電話 (無開驗證)
    accountPhoneEdit(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_AGCENTER_PHONE_EDIT,
            ...args
        });
    },
    // 【帳戶資料】-修改密碼
    accountPassword(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_AGCENTER_PWD_CHANGE,
            ...args
        });
    },
    // 【帳戶資料】-修改取款密碼
    accountWdPassword(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_AGCENTER_WD_PWD_CHANGE,
            ...args
        });
    },
    // 【帳戶資料】-取得會員連動帳號
    accountMemUsername(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_AGCENTER_MEM_USERNAME,
            errorAlert: false,
            ...args
        });
    },
    // 【帳戶資料】-設定會員連動帳號
    accountMemUsernameSet(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_AGCENTER_MEM_USERNAME,
            ...args
        });
    },
    // 【帳戶資料】-取得連結資料 (代理連結.合營連結)
    accountLinks(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_AGCENTER_OUT_LINK,
            errorAlert: false,
            ...args
        });
    },
    // 【帳戶資料】-設定合營連結
    accountLinkSet(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_AGCENTER_OUT_LINK,
            ...args
        });
    },
    // 【驗證】- 代理 手機驗證
    mobileCheck(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MOBILE_CHECK,
            errorAlert: false,
            ...args
        });
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     取款
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 【取款】-代理取款頁判斷是否為內嵌頁
    withdraw(params, args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_WITHDRAW,
            params,
            errorAlert: false,
            ...args
        });
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     佣金明細
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 【佣金明細】-所有資料
    reward(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_AGCENTER_REWARD,
            errorAlert: false,
            ...args
        });
    },
    // 【佣金明細】-指定期數
    rewardDetail(args, id) {
        return ajax({
            method: 'get',
            url: `${apiUrl.API_AGCENTER_REWARD_DETIAL}/${id}`,
            ...args
        });
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     報表中心
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 取該代理的下層會員列表
    memberList(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MCENTER_MEMBER_LIST,
            ...args
        });
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     會員遊戲紀錄
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 【會員遊戲紀錄】-第一層
    gameRecord(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_AGCENTER_RECORD,
            ...args
        });
    },
    // 【會員遊戲紀錄】-第二層
    gameRecordMember(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_AGCENTER_RECORD_MEMBER,
            ...args
        });
    },
    // 【會員遊戲紀錄】-第三層
    gameRecordDetail(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_AGCENTER_RECORD_DETIAL,
            ...args
        });
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     站內信
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 【站內信】-所有資料
    message(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_AGCENTER_MESSAGE,
            errorAlert: false,
            ...args
        });
    },
    // 【站內信】-指定單則內容
    messageContent(args, id) {
        return ajax({
            method: 'get',
            url: `${apiUrl.API_AGCENTER_MESSAGE_CONTENT}/${id}`,
            ...args
        });
    },
    // 【站內信】-指定單則刪除
    messageDelete(args, id) {
        return ajax({
            method: 'delete',
            url: `${apiUrl.API_AGCENTER_MESSAGE_CONTENT}/${id}`,
            ...args
        });
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     意見反饋
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 【意見反饋】- 發送紀錄
    feedbackRecord(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_AGCENTER_FEEDBACK_RECORD,
            errorAlert: false,
            ...args
        });
    }
};
