import { mapGetters, mapActions } from 'vuex';
import ajax from '@/lib/ajax';
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
            'actionSetAgentLogin'
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
        loginCheck() {
            if (this.isBackEnd) {
                return;
            }

            if (this.memInfo.config.login_security) {
                ajax({
                    method: 'put',
                    url: apis.API_AGENT_LOGIN_CHECK,
                    params: {
                        username: this.username
                    },
                    success: (res) => {
                        if (res.ret && res.ret.check) {
                            this.checkItem = res.ret.check_item;
                            return;
                        }
                        this.login();
                    }
                });
                return;
            }
            this.login();
        },
        /**
         * 會員登入
         * @method login
         */
        login(validate = {}) {
            if (this.isBackEnd) {
                return null;
            }

            return ajax({
                method: 'put',
                url: apis.API_AGENT_LOGIN,
                params: {
                    username: this.username,
                    password: this.password,
                    captcha_text: this.captcha,
                    ...validate
                },
                success: () => {
                    ajax({
                        method: 'get',
                        url: apis.API_AGENT_ANNOUNCEMENT,
                        errorAlert: false,
                        success: (response) => {
                            if (response.result === 'ok') {
                                response.ret.forEach((post) => {
                                    alert(post.content);
                                });
                            }
                        }
                    }).then(() => {
                        this.actionSetAgentLogin(true);
                        if (this.redirect) {
                            window.location.href = this.redirect;
                            return;
                        }
                        window.location.href = '/agent';
                    });
                },
                fail: (res) => {
                    if (res.data.code === 'C10004') {
                        if (this.redirect) {
                            window.location.href = this.redirect;
                            return;
                        }
                        window.location.reload();
                    }
                    this.captcha = '';
                }
            }).then(() => {
                this.checkItem = '';
            });
        }
    }
};
