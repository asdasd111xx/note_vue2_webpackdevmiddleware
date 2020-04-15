import * as apiUrl from '../config/api';

import ajax from '../lib/ajax';

export default {
    // 帳戶安全程度
    percent(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MCENTER_PERCENT,
            errorAlert: false,
            ...args
        });
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     帳戶資料
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 【帳戶資料】-設定資料 (個人姓名.微信)
    accountDataSet(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_MEMBER,
            errorAlert: false,
            ...args
        });
    },
    // 【帳戶資料】-發送信箱驗證碼-秒數倒數
    accountMailSec(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MAIL_CHECK_SEC,
            errorAlert: false,
            ...args
        });
    },
    // 【帳戶資料】-發送電話驗證碼-秒數倒數
    accountPhoneSec(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_PHONE_CHECK_SEC,
            errorAlert: false,
            ...args
        });
    },
    // 【帳戶資料】-發送信箱驗證碼
    accountMailSend(args) {
        return ajax({
            method: 'post',
            url: apiUrl.API_MAIL_CHECK,
            ...args
        });
    },
    // 【帳戶資料】-發送電話驗證碼
    accountPhoneSend(args) {
        return ajax({
            method: 'post',
            url: apiUrl.API_PHONE_CHECK,
            ...args
        });
    },
    // 【帳戶資料】-綁定信箱 + 修改資料
    accountMailCheck(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_MAIL_CHECK,
            ...args
        });
    },
    // 【帳戶資料】-綁定電話 + 修改資料
    accountPhoneCheck(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_PHONE_CHECK,
            ...args
        });
    },
    // 【帳戶資料】-修改信箱 (無開驗證)
    accountMailEdit(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_MAIL_EDIT,
            ...args
        });
    },
    // 【帳戶資料】-修改電話 (無開驗證)
    accountPhoneEdit(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_PHONE_EDIT,
            ...args
        });
    },
    // 【帳戶資料】-修改密碼
    accountPassword(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_PWD_CHANGE,
            ...args
        });
    },
    // 【帳戶資料】-修改取款密碼
    accountWdPassword(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_WITHDRAW_PWD_CHANGE,
            ...args
        });
    },
    // 【驗證】- 會員 手機驗證
    mobileCheck(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MOBILE_CHECK,
            errorAlert: false,
            ...args
        });
    },
    // 【帳戶資料】- 會員VIP資料
    accountVIP(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_VIP_USER,
            errorAlert: false,
            ...args
        });
    },
    // 【帳戶資料】- 顯示/隱藏收貨地址
    showAddress(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MCENTER_USER_CONFIG,
            errorAlert: false,
            ...args
        });
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     存、取款
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 【存、取款】-登入前會員存款頁判斷是否為內嵌頁
    depositBeforeLogin(params, args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MCENTER_DEPOSIT_BEFORE_LOGIN,
            params,
            errorAlert: false,
            ...args
        });
    },
    // 【存、取款】-登入後會員存款頁判斷是否為內嵌頁
    deposit(params, args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MCENTER_DEPOSIT,
            params,
            errorAlert: false,
            ...args
        });
    },
    // 【存、取款】-登入後會員取款頁判斷是否為內嵌頁
    withdraw(params, args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_WITHDRAW,
            params,
            errorAlert: false,
            ...args
        });
    },
    // 【我的返水】-登入後會員我的返水頁判斷是否為內嵌頁
    rebate(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_REBATE,
            errorAlert: false,
            ...args
        });
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     額度轉換
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 【額度轉換】-手動轉換-確定轉帳
    balanceTran(args, source, target) {
        return ajax({
            method: 'put',
            url: `${apiUrl.API_MCENTER_BALANCE}/${source}/target/${target}`,
            ...args
        });
    },
    // 【額度轉換】-一鍵歸戶
    balanceTranBack(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_MCENTER_BALANCE_BACK,
            ...args
        });
    },
    // 【額度轉換】-最後開啟平台
    lastVendor(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MCENTER_RECENTLY_OPENED,
            errorAlert: false,
            ...args
        });
    },
    // 【額度轉換】-啟用免轉錢包
    balanceTranAutoEnable(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_MCENTER_ENABLE_AUTOTRANSFER,
            ...args
        });
    },
    // 【額度轉換】-關閉免轉錢包
    balanceTranAutoClose(args) {
        return ajax({
            method: 'put',
            url: apiUrl.API_MCENTER_CLOSE_AUTOTRANSFER,
            ...args
        });
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     紅利帳戶
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 【紅利帳戶】-取得紅利資料
    bonusAccount(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MCENTER_BONUS,
            ...args
        });
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     我的返水
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 【我的返水】-實時返水-初始資料
    bankRebateInit(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MCENTER_REBATE_INITIAL,
            errorAlert: false,
            ...args
        });
    },
    // 【我的返水】-實時返水-試算
    bankRebateCaculate(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MCENTER_REBATE_CACULATE,
            ...args
        });
    },
    // 【我的返水】-實時返水-領取
    bankRebateReceive(args) {
        return ajax({
            method: 'post',
            url: apiUrl.API_MCENTER_REBATE_RECEIVE,
            ...args
        });
    },
    // 【我的返水】-實時返水-領取
    bankRebateReceiveEntry(args, id) {
        return ajax({
            method: 'get',
            url: `${apiUrl.API_MCENTER_REBATE_RECEIVE_ENTRY}/${id}`,
            ...args
        });
    },
    // 【我的返水】-返水歷史
    bankRebateHistory(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MCENTER_REBATE_HISTORY,
            errorAlert: false,
            ...args
        });
    },
    // 【我的返水】-實時返水-取得當前維護平台
    bankRebateMaintains(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MCENTER_MAINTAINS,
            errorAlert: false,
            ...args
        });
    },
    // 【我的返水】-返水歷史-取得當前系統時間
    bankRebateDateTime(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MCENTER_DATETIME,
            errorAlert: false,
            ...args
        });
    },
    // 【我的返水】-取得會員今日,昨日,最近一週返水派發總額
    bankRebateSubTotal(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MCENTER_REBATE_SUBTOTAL,
            errorAlert: false,
            ...args
        });
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     資金明細
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 【資金明細】
    moneyDetail(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MCENTER_MONEY_DETAIL,
            ...args
        });
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     投注記錄
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 【投注記錄】-取投住總額
    betRecordTotal(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MCENTER_BETRECORD_TOTAL,
            ...args
        });
    },
    // 【投注記錄】-取全部
    betRecord(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MCENTER_BETRECORD_ALL,
            ...args
        });
    },
    // 【投注記錄】-第二層 (指定 kind + vendor)
    betRecordDetail(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_MCENTER_BETRECORD_GAMECODE,
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
            url: apiUrl.API_MCENTER_MESSAGE,
            errorAlert: false,
            ...args
        });
    },
    // 【站內信】-指定單則內容
    messageContent(args, id) {
        return ajax({
            method: 'get',
            url: `${apiUrl.API_MCENTER_MESSAGE_CONTENT}/${id}`,
            ...args
        });
    },
    // 【站內信】-指定單則刪除
    messageDelete(args, id) {
        return ajax({
            method: 'delete',
            url: `${apiUrl.API_MCENTER_MESSAGE_CONTENT}/${id}`,
            ...args
        });
    },
    // 【站內信】-多則刪除
    messagesDelete(args) {
        console.log('asa-------', args, ...args);
        return ajax({
            method: 'delete',
            url: apiUrl.API_MCENTER_MESSAGES_CONTENT,
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
            url: apiUrl.API_MCENTER_FEEDBACK_RECORD,
            errorAlert: false,
            ...args
        });
    },
    // 【意見反饋】- 發送紀錄
    backRecord(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_FEEDBACK_REPLIED_LIST,
            errorAlert: false,
            ...args
        });
    },
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     VIP
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 【VIP】-取得vip參數檔清單
    vipConfigList(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_VIP_CONFIG_LIST,
            errorAlert: false,
            ...args
        });
    },
    // 【VIP】-依vip分類回傳所有等級清單(不分⾴)
    vipLevelList(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_VIP_LEVEL_LIST,
            errorAlert: false,
            ...args
        });
    },
    // 【VIP】-取得vip使⽤者詳細資料
    vipUserDetail(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_VIP_USER,
            errorAlert: false,
            ...args
        });
    }
};
