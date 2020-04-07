import * as apiUrl from '../config/api';
import ajax from '../lib/ajax';

export default {
    // 後台設定
    backstageSetting(args) {
        return ajax({
            method: 'get',
            cache: true,
            errorAlert: false,
            ...args
        });
    },
    // 語系
    lang(args) {
        return ajax({
            method: 'get',
            cache: true,
            errorAlert: false,
            ...args
        });
    },
    // 驗證碼
    captcha(args) {
        return ajax({
            method: 'post',
            url: apiUrl.API_CAPTCHA,
            errorAlert: false,
            ...args
        });
    },
    // 系統時間
    systemTime(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_SYSTEM_TIME,
            errorAlert: false,
            ...args
        });
    },
    // opcode對照文字 (目前 會員中心-資金明細-類別名稱 使用)
    opcode(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_OPCODE_TEXT,
            errorAlert: false,
            ...args
        });
    },
    // 會員.代理-登入後-是否綁定銀行卡
    bankCardCheck(args) {
        return ajax({
            method: 'get',
            url: apiUrl.API_BANK_CARD_CHECK,
            errorAlert: false,
            ...args
        });
    },
    image(args, imgId = '') {
        if (!imgId) {
            return false;
        }

        return ajax({
            method: 'get',
            url: `${apiUrl.API_IMG}/${imgId}`,
            errorAlert: false,
            ...args
        });
    }
};
