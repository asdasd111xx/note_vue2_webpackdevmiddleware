import exceptionList from '@/config/exceptionList';
import i18n from '@/config/i18n';
import store from '@/store';

const getNameFormat = () => { // 真實姓名
    const { wonderCasino, knightCasino } = exceptionList;
    if (wonderCasino.concat(knightCasino).includes(store.state.webInfo.alias)) {
        return {
            regex: /^[a-zA-Z\- ]*$/,
            error: i18n.t('S_ONLY_TYPE_ENGLISH_DASH_SPACE').replace('%s', '<br/>')
        };
    }

    if (store.state.memInfo.cash.currency === 'VND') {
        return {
            regex: /^[^,:;!@#$%^&*?<>()+=`|[\]{}\\"/.~\-_']+$/,
            error: i18n.t('S_NO_SYMBOL')
        };
    }

    return {
        regex: /^[^0-9，:;！@#$%^&*?<>()+=`|[\]{}\\"/.\s~\-_']*$/,
        error: i18n.t('S_NO_SYMBOL_DIGIT_CHEN')
    };
};

const enableUserNameDigit = store.state.memInfo.config.username_digit;

// 加入會員 欄位資料
export default {
    username: {
        key: 'username',
        text: 'S_ACCOUNT',
        type: 'text',
        placeholder: '请输入4-20码英文小写、数字',
        isRequired: true,
        hasVerify: false,
        show: true,
        regExp: enableUserNameDigit ? /^[a-z1-9][a-z0-9]{3,19}$/ : /^[a-z][a-z0-9]{3,19}$/,
        errorMsg: enableUserNameDigit
            ? i18n.t('S_ENABLE_NUM_CHAR').replace('%s', '4').replace('%s', '20')
            : i18n.t('S_USERNAME_ERROR').replace('%s', '<br/>')
    },
    password: {
        key: 'password',
        text: 'S_PASSWORD',
        type: 'password',
        placeholder: '请输入6-12位字母或数字',
        isRequired: true,
        hasVerify: false,
        show: true,
        regExp: /^[a-z0-9._\-!@#$&*+=|]{6,12}$/,
        errorMsg: i18n.t('S_PASSWORD_ERROR')
    },
    confirm_password: {
        key: 'confirm_password',
        text: 'S_PWD_CONFIRM',
        type: 'password',
        placeholder: '请输入6-12位字母或数字',
        isRequired: true,
        hasVerify: false,
        show: true,
        regExp: '',
        errorMsg: i18n.t('S_PASSWD_CONFIRM_ERROR').replace('%s', '<br/>')
    },
    introducer: {
        key: 'introducer',
        text: 'S_INTRODUCER',
        type: 'text',
        isRequired: false,
        hasVerify: false,
        show: false,
        regExp: '',
        errorMsg: ''
    },
    name: {
        key: 'name',
        text: 'S_REAL_NAME',
        type: 'text',
        isRequired: false,
        hasVerify: false,
        show: true,
        regExp: getNameFormat().regex,
        errorMsg: getNameFormat().error
    },
    alias: {
        key: 'alias',
        text: 'S_NICKNAME',
        type: 'text',
        isRequired: false,
        hasVerify: false,
        show: true,
        minimum: 1,
        maximum: 30,
        regExp: /^[^，:;！@#$%^&*?<>()+=`|[\]{}\\"/.~\-_']*$/,
        errorMsg: i18n.t('S_NO_SYMBOL')
    },
    email: {
        key: 'email',
        text: 'S_E_MAIL',
        type: 'text',
        isRequired: true,
        hasVerify: false,
        show: true,
        minimum: 12,
        maximum: 100,
        regExp: /^[A-Za-z0-9.\-_]+@[A-Za-z0-9.-]+\.[A-Za-z]+$/,
        errorMsg: i18n.t('S_JM_EMAIL_FORMAT_UNAVAILABLE').replace('%s', '<br/>')
    },
    phone: {
        key: 'phone',
        text: 'S_TEL',
        type: 'text',
        isRequired: false,
        hasVerify: false,
        show: true,
        minimum: 7,
        maximum: 15,
        regExp: /^[0-9]+$/,
        errorMsg: i18n.t('S_JM_PHONE_RMB')
    },
    birthday: {
        key: 'birthday',
        text: 'S_BIRTHDAY_DATE',
        type: 'text',
        isRequired: false,
        hasVerify: false,
        show: true,
        regExp: '',
        errorMsg: ''
    },
    gender: {
        key: 'gender',
        text: 'S_GENDER',
        type: 'select',
        isRequired: false,
        hasVerify: false,
        show: true,
        regExp: '',
        errorMsg: ''
    },
    qq_num: {
        key: 'qq_num',
        text: 'S_QQ',
        type: 'text',
        isRequired: false,
        hasVerify: false,
        show: true,
        regExp: /^[0-9]+$/,
        errorMsg: i18n.t('S_JM_AGENT_INPUT_NUMBER')
    },
    weixin: {
        key: 'weixin',
        text: 'WECHAT',
        type: 'text',
        isRequired: false,
        hasVerify: false,
        show: true,
        regExp: /^[A-Za-z0-9_+-.@]{5,100}$/,
        errorMsg: i18n.t('WEIXIN_REGULAR_TEXT')
    },
    line: {
        key: 'line',
        text: 'S_LINE',
        type: 'text',
        isRequired: false,
        hasVerify: false,
        show: true,
        regExp: /^[a-z0-9_\-.]{4,20}$/,
        errorMsg: i18n.t('S_LINE_REGULAR_TEXT')
    },
    facebook: {
        key: 'facebook',
        text: 'S_FACEBOOK',
        type: 'text',
        isRequired: false,
        hasVerify: false,
        show: true,
        regExp: '',
        errorMsg: ''
    },
    skype: {
        key: 'skype',
        text: 'S_SKYPE',
        type: 'text',
        isRequired: false,
        hasVerify: false,
        show: true,
        regExp: '',
        errorMsg: ''
    },
    zalo: {
        key: 'zalo',
        text: 'S_ZALO',
        type: 'text',
        isRequired: false,
        hasVerify: false,
        show: true,
        regExp: '',
        errorMsg: ''
    },
    withdraw_password: {
        key: 'withdraw_password',
        text: 'S_DAW_DRWAL_PASSWORD',
        type: 'select',
        isRequired: false,
        hasVerify: false,
        show: true,
        minimum: 4,
        regExp: '',
        errorMsg: i18n.t('S_JM_MSG_COMPLETE')
    },
    captcha_text: {
        key: 'captcha_text',
        text: 'S_CHECK_CODE',
        type: 'text',
        isRequired: true,
        hasVerify: false,
        show: true,
        regExp: '',
        errorMsg: ''
    }
};
