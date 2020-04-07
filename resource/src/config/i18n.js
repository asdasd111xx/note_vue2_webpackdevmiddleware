import Vue from 'vue';
import VueI18n from 'vue-i18n';
import VueCookie from 'vue-cookie';

Vue.use(VueI18n);

// 預設語系
if (VueCookie.get('lang') === null) {
    let lang;
    if (navigator.languages && navigator.languages.length) {
        // latest versions of Chrome and Firefox set this correctly
        [lang] = navigator.languages;
    } else if (navigator.userLanguage) {
        // IE only
        lang = navigator.userLanguage;
    } else {
        // latest versions of Chrome, Firefox, and Safari set this correctly
        lang = navigator.language;
    }

    lang = lang.toLowerCase();

    switch (true) {
        case /^en-/.test(lang):
            lang = 'en';
            break;
        case /^vi$|^vi-/.test(lang):
            lang = 'vi';
            break;
        case /^ja$|^ja-/.test(lang):
            lang = 'ja';
            break;
        case /^zh-tw$|^zh-hk$/.test(lang):
            lang = 'zh-tw';
            break;
        default:
            lang = 'zh-cn';
            break;
    }

    VueCookie.set('lang', lang);
}

export default new VueI18n({
    locale: VueCookie.get('lang')
});
