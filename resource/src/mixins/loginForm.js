import * as apis from '@/config/api';

import { mapActions, mapGetters } from 'vuex';

import ajax from '@/lib/ajax';
import ajax2 from '@/lib/ajax2';

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
            checkItem: ''
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
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

            ajax({
                method: 'post',
                url: apis.API_CAPTCHA,
                errorAlert: false,
                success: (response) => {
                    this.captchaImg = response.ret;
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
            return ajax2({
                method: 'put',
                url: apis.API_LOGIN,
                errorAlert: false,
                params: {
                    username: this.username,
                    password: this.password,
                    captcha_text: this.captcha,
                    ...validate
                },
                fail: (res) => {
                    if (errorCB)
                        errorCB(res.data)
                }
            }).then((res) => {

                if (res && res.result === 'ok') {
                    ajax({
                        method: 'get',
                        url: apis.API_MEMBER_ANNOUNCEMENT,
                        errorAlert: false,
                        success: (response) => {
                            if (response.result === 'ok') {
                                response.ret.forEach((post) => {
                                    alert(post.content);
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

                if (res && res.result === 'error') {
                    if (errorCB)
                        errorCB(res)
                }

                if (res.code === 'C10004') {
                    if (this.redirect) {
                        window.location.href = this.redirect;
                        return;
                    }

                    window.location.reload();
                }

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
                localStorage.removeItem('depositStatus');
                return;
            }

            localStorage.setItem('username', this.username);
            localStorage.setItem('depositStatus', this.depositStatus);
        }
    }
};
