import i18n from '@/config/i18n';
import store from '@/store';
import oneImage from './oneImage';
import oneFlash from './oneFlash';
import oneText from './oneText';
import oneTextLink from './oneTextLink';
import oneLang from './oneLang';
import oneLangSelect from './oneLangSelect';
import adSlider from './adSlider';
import marqueeNews from './marqueeNews';
import oneJackpot from './oneJackpot';
// import formLoginAccount from './formLoginAccount';
// import formLoginPassword from './formLoginPassword';
// import formLoginCaptcha from './formLoginCaptcha';
// import formLoginSubmit from './formLoginSubmit';
// import formLoginCode from './formLoginCode';


const widgetsData = {
    oneImage,
    oneText,
    oneTextLink,
    oneLang,
    oneLangSelect,
    adSlider,
    marqueeNews,
    oneFlash,
    oneJackpot
    // formLoginAccount,
    // formLoginPassword,
    // formLoginCaptcha,
    // formLoginSubmit,
    // formLoginCode
};

const getWidgetList = () => {
    const doc = {
        oneTextLink: i18n.t('S_ADD_TEXT_LINK', store.state.memInfo.config.lang || 'zh-cn'),
        oneImage: i18n.t('S_ADD_IMAGE', store.state.memInfo.config.lang || 'zh-cn'),
        oneText: i18n.t('S_ADD_TEXT', store.state.memInfo.config.lang || 'zh-cn'),
        oneLang: i18n.t('S_ADD_LANG', store.state.memInfo.config.lang || 'zh-cn'),
        oneLangSelect: i18n.t('S_ADD_LANG_SELECT', store.state.memInfo.config.lang || 'zh-cn'),
        adSlider: i18n.t('S_ADD_SLIDE2', store.state.memInfo.config.lang || 'zh-cn'),
        marqueeNews: i18n.t('S_HOT_NEWS_2', store.state.memInfo.config.lang || 'zh-cn'),
        oneFlash: i18n.t('S_ADD_FLASH', store.state.memInfo.config.lang || 'zh-cn'),
        oneJackpot: i18n.t('S_ADD_JACKPOT', store.state.memInfo.config.lang || 'zh-cn')
        // formLoginAccount: `${i18n.t('S_MEMBER_LOGIN', store.state.memInfo.config.lang || 'zh-cn')} - ${i18n.t('S_ACCOUNT', store.state.memInfo.config.lang || 'zh-cn')}`,
        // formLoginPassword: `${i18n.t('S_MEMBER_LOGIN', store.state.memInfo.config.lang || 'zh-cn')} - ${i18n.t('S_PASSWORD', store.state.memInfo.config.lang || 'zh-cn')}`,
        // formLoginCaptcha: `${i18n.t('S_MEMBER_LOGIN', store.state.memInfo.config.lang || 'zh-cn')} - ${i18n.t('S_CHECK_CODE', store.state.memInfo.config.lang || 'zh-cn')}`,
        // formLoginSubmit: `${i18n.t('S_MEMBER_LOGIN', store.state.memInfo.config.lang || 'zh-cn')} - ${i18n.t('S_LOGIN', store.state.memInfo.config.lang || 'zh-cn')}`,
        // formLoginCode: `${i18n.t('S_MEMBER_LOGIN', store.state.memInfo.config.lang || 'zh-cn')} - ${i18n.t('S_CHECK_CODE_IMG', store.state.memInfo.config.lang || 'zh-cn')}`
    };

    return Object.keys(widgetsData).map((type) => ({
        category: widgetsData[type].widget.category,
        type,
        name: doc[type] || type
    }));
};

export { widgetsData, getWidgetList };
