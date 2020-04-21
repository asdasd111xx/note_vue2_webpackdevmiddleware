import * as apiUrl from './config';

import ajax from '../../lib/ajax';

let DOMAIN = apiUrl.PORN1_DOMAIN;

export default {
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    //     聯繫我們
    // ＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
    // 客服中心
    contactus(args) {
        return ajax({
            method: 'get',
            url: DOMAIN + apiUrl.CONTACT_US,
            errorAlert: false,
            ...args
        });
    },
};
