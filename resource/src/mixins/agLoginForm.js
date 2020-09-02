import { mapGetters, mapActions } from 'vuex';
import ajax from '@/lib/ajax';
import ajax2 from '@/lib/ajax2';
import * as apis from '@/config/api';
import * as constants from '@/config/constant';
import slideVerification from '@/components/slideVerification';
import createPuzzle from '@/lib/puzzleVerification';

export default {
    components: {
        slideVerification
    },
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
            captchaValue: '',
            captchaImg: '',
            passwordVisible: false,
            checkItemColumn: '',
            loginInfoData: {},
            callBackFuc: null,
            constants
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            memInfo: 'getMemInfo'
        }),
        checkItem: {
            get() {
                return this.checkItemColumn;
            },
            set(val) {
                this.checkItemColumn = val;
                if (val) {
                    return;
                }
                if (this.memInfo.config.login_captcha_type === constants.CAPTCHA_SLIDE) {
                    if (this.callBackFuc) {
                        this.callBackFuc.reset();
                        this.loginInfoData = {};
                        this.callBackFuc = null;
                    }
                }
            }
        },
        captcha: {
            get() {
                return this.captchaValue;
            },
            set(value) {
                this.captchaValue = value;
                this.captchaValue = this.captchaValue.replace(/[^A-Za-z0-9]/g, '');
            }
        },
        /**
         * 滑動驗證是否啟動
         */
        isSlideAble() {
            return !!(this.username && this.password);
        }
    },
    created() {
        if (this.memInfo.config.login_captcha_type === constants.CAPTCHA_GRAPH) {
            this.getCaptcha();
        }
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
                params: { scene: 'agent-login' },
                errorAlert: false,
                success: (response) => {
                    this.captchaImg = response.ret;
                }
            });
        },
        clickCaptcha() {
            this.getCaptcha();
            if (this.$refs['login-captcha']) {
                this.$refs['login-captcha'].focus();
            }
        },
        loginCheck() {
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

            return ajax2({
                method: 'put',
                url: apis.API_AGENT_LOGIN,
                params: {
                    username: this.username,
                    password: this.password,
                    captcha_text: this.captcha,
                    ...validate,
                    ...this.loginInfoData
                }
            }).then((res) => {
                if (res && res.result === 'ok') {
                    // GA流量統計
                    window.dataLayer.push({
                        dep: 2,
                        event: 'ga_click',
                        eventCategory: 'user_login',
                        eventAction: 'user_login',
                        eventLabel: 'agent_login'
                    });

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
                    return;
                }

                if (res.data && res.data.code === 'C10004') {
                    if (this.redirect) {
                        window.location.href = this.redirect;
                        return;
                    }
                    window.location.reload();
                }

                this.checkItem = '';

                this.captcha = '';
                if (this.memInfo.config.login_captcha_type === constants.CAPTCHA_GRAPH) {
                    const captchaErrorCode = ['C00006', 'C00007', 'C00011', 'C00016', 'C00018', 'C00024'];
                    if (res.data && captchaErrorCode.includes(res.data.code)) {
                        this.clickCaptcha();
                    } else {
                        this.getCaptcha();
                    }
                }

                this.loginInfoData = {};
                if (this.callBackFuc) {
                    this.callBackFuc.reset();
                    this.callBackFuc = null;
                }
            });
        },
        toggleVisible() {
            this.passwordVisible = !this.passwordVisible;
            this.$refs.password.type = this.passwordVisible ? 'text' : 'password';
        },
        /**
         * 圖形驗證與拼圖驗證分流
         * @method submitCheck
         */
        submitCheck(loginInfo) {
            if (this.isBackEnd) {
                return;
            }

            if (!this.isSlideAble) {
                alert(this.$text('S_LOGIN_ERROR', '帐号或密码错误'));
                return;
            }

            if ((this.memInfo.config.login_captcha_type === constants.CAPTCHA_SLIDE
                || this.memInfo.config.login_captcha_type === constants.CAPTCHA_PUZZLE)
                && loginInfo.type === 'keydown') {
                return;
            }

            if (this.memInfo.config.login_captcha_type === constants.CAPTCHA_PUZZLE) {
                createPuzzle(this.externalLogin);
                return;
            }

            this.loginCheck();
        },
        /**
         * 滑動/圖形驗證登入
         * @param {Object} loginInfo 滑動/圖形驗證參數
         * @method externalLogin
         */
        externalLogin(loginInfo) {
            if (this.isBackEnd) {
                return;
            }

            this.loginInfoData = { captcha_text: loginInfo.data };
            this.callBackFuc = loginInfo.slideFuc;
            this.loginCheck();
        }
    }
};
