import { mapGetters, mapActions } from 'vuex';
import ajax from '@/lib/ajax';
import ajax2 from '@/lib/ajax2';
import * as apis from '@/config/api';

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
                    success: (res) => {
                        if (res.ret && res.ret.check) {
                            this.checkItem = res.ret.check_item;
                            return;
                        }
                        this.login(loginInfo, callBackFuc);
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
            if (this.isBackEnd) {
                return null;
            }
            return ajax2({
                method: 'put',
                url: apis.API_LOGIN,
                params: {
                    username: this.username,
                    password: this.password,
                    captcha_text: this.captcha,
                    ...validate
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
