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
            username: '',
            password: '',
            captcha: '',
            captchaImg: '',
            depositStatus: false,
            checkItem: '',
            aid: '' // repcatcha
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
            'actionIsLogin'
        ]),
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
        loginCheck(loginInfo, callBackFuc, errorCB) {

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
                        this.login(loginInfo, callBackFuc, errorCB);
                    },
                    fail: (res) => {
                    }
                });
                return;
            }

            this.login(loginInfo, callBackFuc, errorCB);
        },
        /**
         * 會員登入
         * @method login
         */
        login(validate = {}, callBackFuc, errorCB) {

            if (this.isBackEnd) {
                return null;
            }
            return bbosRequest({
                method: 'put',
                url: this.siteConfig.BBOS_DOMIAN + '/Login',
                reqHeaders: {
                    'Vendor': this.memInfo.user.domain,
                },
                params: {
                    username: this.username,
                    password: this.password,
                    captcha: this.captcha,
                    aid: this.aid || getCookie('aid') || '',
                    ...validate
                },
                fail: (res) => {
                    if (errorCB) {
                        res.data ? errorCB(res.data) : errorCB(res);
                    }
                }
            }).then((res) => {
                this.$refs.puzzleVer.ret = null;

                if (res && res.data && res.data && res.data.cookie && res.data.cookie.cid) {
                    try {
                        let cookie = res.data.cookie;
                        for (let [key, value] of Object.entries(cookie)) {
                            setCookie(key, value);
                        }
                    } catch (e) {
                        //若不支持至少保留cid cookie
                        setCookie('cid', res.data.cookie.cid);
                    }

                    ajax({
                        method: 'get',
                        url: apis.API_MEMBER_ANNOUNCEMENT,
                        errorAlert: false,
                        success: (response) => {
                            if (response.result === 'ok') {
                                response.ret.forEach((post) => {
                                    // 登入公告
                                    // alert(post.content);
                                });
                            }
                        }
                    }).then(() => {
                        this.actionIsLogin(true);
                        if (this.redirect) {
                            window.location.href = this.redirect;
                            return;
                        }
                        window.location.reload();
                    });
                    return;
                }

                if (res && res.status !== '000') {
                    if (errorCB) {
                        res.data ? errorCB(res.data) : errorCB(res);
                    }
                }

                // if (res.data && res.data.code === 'C10004') {
                //     if (this.redirect) {
                //         window.location.href = this.redirect;
                //         return;
                //     }

                //     window.location.reload();
                // }

                if (callBackFuc) {
                    callBackFuc.reset();
                }

                this.captcha = '';
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
