import Vue from 'vue';
import common from '@/api/common';
import i18n from '@/config/i18n';

// 取語系字典檔
export default function getLang(lang = {}, defaultLang = 'zh-cn') {
    const langList = Object.keys(lang);

    // 當前語系不在後台開放的語系列表中，改呈現簡體
    if (langList.indexOf(i18n.locale) === -1) {
        Vue.cookie.set('lang', defaultLang);

        // 後台沒有語系資料(尚未建版)不予 reload
        if (langList.length !== 0) {
            window.location.reload();
        }
    }

    return common.lang({
        url: `/i18n/${i18n.locale}.json`,
        params: {
            v: process.env.TIMESTAMP
        },
        success: (response) => {
            i18n.setLocaleMessage(i18n.locale, response);
        }
    });
}
