import * as apis from '@/config/api';

import { getCookie, setCookie } from '@/lib/cookie';
import { mapActions, mapGetters } from 'vuex';

import ajax from '@/lib/ajax';
import bbosRequest from "@/api/bbosRequest";

export default {
    props: {
        redirect: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            isLoading: false,
            username: '',
            password: '',
            captcha: '',
            captchaImg: '',
            depositStatus: false,
            checkItem: '',
            aid: '', // repcatcha
            errMsg: ''
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            siteConfig: 'getSiteConfig',
            memInfo: 'getMemInfo'
        })
    },
    methods: {
        ...mapActions([
            'actionIsLogin',
            'actionSetGlobalMessage'
        ]),
        // 圖形驗證格式
        captchaVerification(val) {
            this.captcha = val.replace(/[\W\_]/g, '');
        },
        /**
         * 取得驗證碼圖片
         * @method getCaptcha
         */
        getCaptcha() {
            if (this.isBackEnd) {
                return;
            }
            bbosRequest({
                method: 'post',
                url: this.siteConfig.BBOS_DOMIAN + '/Captcha',
                reqHeaders: {
                    'Vendor': this.memInfo.user.domain
                },
                params: {
                    "lang": "zh-cn",
                    "format": "png",
                },
            }).then((res) => {
                if (res.data && res.data.data) {
                    this.captchaImg = res.data.data;
                    this.aid = res.data.cookie.aid;
                    setCookie('aid', res.data.cookie.aid);
                }
            });
        },
        loginCheck(loginInfo, callBackFuc) {
            if (this.isBackEnd) {
                return;
            }

            if (this.memInfo.config.login_security) {
                ajax({
                    method: 'put',
                    url: apis.API_LOGIN_CHECK,
                    params: {
                        username: this.username
                    },
                    errorAlert: false,
                    success: (res) => {
                        if (res.ret && res.ret.check) {
                            this.checkItem = res.ret.check_item;
                            return;
                        }
                        this.login(loginInfo, callBackFuc);
                    },
                    fail: (res) => {
                        console.log(res)
                    }
                });
                return;
            }

            this.login(loginInfo, callBackFuc);
        },
        /**
         * 會員登入
         * @method login
         */
        login(validate = {}, callBackFuc) {
            if (this.isBackEnd || this.isLoading) {
                return null;
            }

            this.isLoading = true;
            const platform = getCookie('platform');
            return bbosRequest({
                method: 'put',
                url: this.siteConfig.BBOS_DOMIAN + '/Login',
                reqHeaders: {
                    'Vendor': this.memInfo.user.domain,
                    'kind': platform === "H" ? 'h' : 'pwa'
                },
                params: {
                    username: this.username,
                    password: this.password,
                    captcha: this.captcha,
                    aid: this.aid || getCookie('aid') || '',
                    host: window.location.host,
                    ...validate
                },
            }).then((res) => {
                this.isLoading = false;

                // 重置驗證碼
                if (this.$refs.puzzleVer) this.$refs.puzzleVer.ret = null;

                this.captcha = '';
                this.getCaptcha();

                if (res && res.data && res.data && res.data.cookie && res.data.cookie.cid) {
                    try {
                        let cookie = res.data.cookie;
                        for (let [key, value] of Object.entries(cookie)) {
                            setCookie(key, value);
                        }
                    } catch (e) {
                        setCookie('cid', res.data.cookie.cid);
                    }

                    this.actionIsLogin(true);
                    if (this.redirect) {
                        window.location.href = this.redirect;
                        return;
                    }
                    window.location.reload(true);
                    // 登入公告
                    // ajax({
                    //     method: 'get',
                    //     url: apis.API_MEMBER_ANNOUNCEMENT,
                    //     errorAlert: false,
                    //     success: (response) => {
                    //         if (response.result === 'ok') {
                    //             response.ret.forEach((post) => {
                    //             });
                    //         }
                    //     }
                    // }).then(() => {
                    // });

                    return;
                }

                if (res && res.status !== '000') {
                    if (res.msg) {
                        this.errMsg = res.msg;
                        return;
                    }

                    this.errMsg = res.status;
                }

                if (callBackFuc) {
                    callBackFuc.reset();
                }
            });
        },
        /**
         * 儲存帳號
         * @method onSaveAccount
         */
        onSaveAccount() {
            if (this.isBackEnd) {
                return;
            }

            if (!this.depositStatus) {
                localStorage.removeItem('username');
                localStorage.removeItem('password');
                localStorage.removeItem('depositStatus');
                return;
            }

            localStorage.setItem('username', this.username);
            localStorage.setItem('password', this.password);
            localStorage.setItem('depositStatus', this.depositStatus);
        }
    }
};
