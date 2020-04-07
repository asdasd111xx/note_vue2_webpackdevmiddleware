<template>
    <div>
        <div class="login-modal-bg" />
        <div class="login-modal-wrap" @click="isExpand = false">
            <div class="login-container">
                <div class="login-main clearfix">
                    <div v-if="pageStatus !== 'forget'" class="login-banner" />
                    <div class="login-content">
                        <div class="login-header">
                            <button
                                class="login-close"
                                @click="$emit('closeModal')"
                            />
                        </div>
                        <div class="login-body animate-toggle">
                            <transition name="slide-fade" mode="out-in">
                                <div :key="`${pageStatus}-member`" class="login-member">
                                    <div v-if="pageStatus === 'login'" class="clearfix">
                                        <div class="login-title-box" @click="resetValue()">
                                            <h2 :class="{'active': !mobileLogin }" class="login-member-title">
                                                {{ $text('S_USERNAME_LOGIN', '用户名登录') }}
                                            </h2>
                                        </div>
                                        <!-- 1/20 afra告知隱藏 -->
                                        <!-- <div
                                            class="login-title-box"
                                            @click="()=>{
                                                mobileLogin = true;
                                                resetErrorMsg();
                                            }"
                                        >
                                            <h2 :class="{'active': mobileLogin }" class="login-member-title">
                                                {{ $text('S_MOBILE_LOGIN', '手机登录') }}
                                            </h2>
                                        </div> -->
                                    </div>
                                    <h2 v-if="pageStatus === 'register'" class="login-register-title">
                                        {{ $text('S_WELCOME_REGISTER_LDSPORT_SPORTS', '欢迎注册必博体育') }}
                                    </h2>
                                    <div v-if="pageStatus === 'forget'" class="forget-title-box">
                                        <h2 class="login-forget-title">
                                            {{ $text('S_PASSWORD_FORGET', '忘记密码') }}
                                        </h2>
                                        <p class="login-forget-subtitle">
                                            {{ $text('FORGET_PWD_MSG', '若未设置邮箱，请联系线上客服') }}
                                        </p>
                                    </div>
                                    <div v-if="mobileLogin" class="mobile-login-wrap">
                                        <div class="area-code-wrap clearfix">
                                            <div
                                                :class="{'expand': isExpand}"
                                                class="area-code"
                                                @click.stop="isExpand= !isExpand"
                                            >
                                                <span>+{{ codeView }}</span>
                                            </div>
                                            <!-- 下拉選單 -->
                                            <transition
                                                enter-class="fade-enter"
                                                enter-active-class="fade-enter-active"
                                                leave-active-class="fade-leave-active"
                                                name="fade"
                                            >
                                                <div v-if="isExpand" class="area-code-list-wrap">
                                                    <div
                                                        v-for="list in areaCode"
                                                        :key="`code-${list.code}`"
                                                        class="area-code-list"
                                                        @click="selectAreaCode(list.code)"
                                                    >
                                                        +{{ list.code }} {{ list.cn }} {{ list.en }}
                                                    </div>
                                                </div>
                                            </transition>
                                            <input
                                                v-model="phoneNumber"
                                                :placeholder="$text('S_ENTER_NUMBER', '输入手机号')"
                                                :class="{'error': !phoneNumber && phoneCheck}"
                                                class="form-item-input"
                                                type="text"
                                                maxlength="10"
                                                @blur="phoneCheck = true"
                                            />
                                            <span v-if="!phoneNumber && phoneCheck && mobileLogin" class="phone-error">{{ $text('S_JM_FIELD_REQUIRE', '该栏位不得为空') }}</span>
                                        </div>
                                        <div class="mobile-captcha-wrap clearfix">
                                            <input
                                                v-model="keyring"
                                                :placeholder="$text('S_MOBILE_CAPTCHA', '请输入手机验证码')"
                                                :class="{'error': !keyring && captchaCheck}"
                                                class="form-item-input"
                                                type="text"
                                                maxlength="4"
                                                @blur="captchaCheck = true"
                                            />
                                            <span v-if="!keyring && captchaCheck && mobileLogin" class="captcha-error">{{ $text('S_JM_FIELD_REQUIRE', '该栏位不得为空') }}</span>
                                            <div class="send-captcha-btn" @click="sendCaptcha()">
                                                {{ $text('S_SEND_CHECK_CODE', '发送验证码') }}
                                            </div>
                                        </div>
                                        <div class="login-btn-send" @click="loginByMobile()">
                                            {{ $text('S_LOGIN_TITLE', '登录') }}
                                        </div>
                                    </div>
                                    <div class="login-form">
                                        <form @submit.prevent="onSubmit">
                                            <div class="form-group">
                                                <div class="form-item">
                                                    <label
                                                        v-if="pageStatus === 'forget'"
                                                        for="forget-account"
                                                        class="form-forget-label"
                                                    >
                                                        {{ $text('S_PLEASE_ENTER_USER_NAME', '请输入用户名') }}
                                                    </label>
                                                    <input
                                                        v-if="pageStatus === 'login' && !mobileLogin"
                                                        v-model="formData.username"
                                                        :class="{'error' : errorMsg.username}"
                                                        :placeholder="$text('S_USERNAME_LOGIN', '用户名登录')"
                                                        class="form-item-input"
                                                        type="text"
                                                        autocomplete="off"
                                                        maxlength="20"
                                                        @input="onInput($event, 'username')"
                                                        @blur="remind('username')"
                                                        @focus="loginInput = 'username'"
                                                    />
                                                    <input
                                                        v-if="pageStatus === 'register'"
                                                        v-model="formData.username"
                                                        :class="{'error' : tips.username}"
                                                        :placeholder="$text('S_PLEASE_ENTER_USER_NAME', '请输入用户名')"
                                                        class="form-item-input"
                                                        type="text"
                                                        autocomplete="off"
                                                        maxlength="20"
                                                        @input="onInput($event, 'username')"
                                                    />
                                                    <input
                                                        v-if="pageStatus === 'forget'"
                                                        id="forget-account"
                                                        v-model="forgetData.username"
                                                        :class="{'error' : tips.username}"
                                                        :placeholder="$text('S_PLEASE_ENTER_USER_NAME', '请输入用户名')"
                                                        class="form-item-input"
                                                        type="text"
                                                        autocomplete="off"
                                                        maxlength="20"
                                                        @input="verification('username', forgetData.username)"
                                                    />
                                                    <span v-if="errorMsg.username && !mobileLogin" class="form-error">{{ errorMsg.username }}</span>
                                                    <span v-if="tips.username && !mobileLogin" class="form-error">{{ tips.username }}</span>
                                                </div>
                                            </div>
                                            <div class="form-group">
                                                <div class="form-item">
                                                    <input
                                                        v-if="pageStatus !== 'forget' && !mobileLogin"
                                                        v-model="formData.password"
                                                        :class="{'error' : errorMsg.password}"
                                                        :placeholder="$text('S_PLEASE_ENTER_YOUR_PASSWORD', '请输入密码')"
                                                        class="form-item-input"
                                                        type="password"
                                                        autocomplete="off"
                                                        maxlength="12"
                                                        @input="onInput($event, 'password')"
                                                        @blur="remind('password')"
                                                        @focus="loginInput = 'password'"
                                                    />
                                                    <span v-if="errorMsg.password && !mobileLogin" class="form-error">{{ errorMsg.password }}</span>
                                                    <label
                                                        v-if="pageStatus === 'forget'"
                                                        for="forget-email"
                                                        class="form-forget-label"
                                                    >
                                                        {{ $text('S_PLEASE_ENTER_YOUR_MAIL', '请输入信箱') }}
                                                    </label>
                                                    <input
                                                        v-if="pageStatus === 'forget'"
                                                        id="forget-email"
                                                        v-model="forgetData.email"
                                                        :class="{'error' : tips.email}"
                                                        :placeholder="$text('S_PLEASE_ENTER_YOUR_MAIL', '请输入信箱')"
                                                        class="form-item-input"
                                                        type="text"
                                                        autocomplete="off"
                                                        @input="verification('email', forgetData.email)"
                                                    />
                                                    <span v-if="tips.email" class="form-error">{{ tips.email }}</span>
                                                </div>
                                            </div>
                                            <div v-if="pageStatus === 'register'" class="form-group">
                                                <div class="form-item">
                                                    <input
                                                        v-model="formData.confirm_password"
                                                        :class="{'error' : errorMsg.confirm_password}"
                                                        :placeholder="$text('S_PWD_CONFIRM', '确认密码')"
                                                        class="form-item-input"
                                                        type="password"
                                                        autocomplete="off"
                                                        maxlength="12"
                                                        @input="onInput($event, 'confirm_password')"
                                                    />
                                                    <span v-if="errorMsg.confirm_password" class="form-error">{{ errorMsg.confirm_password }}</span>
                                                </div>
                                            </div>
                                            <div v-if="memInfo.config.login_captcha_type === 1 || memInfo.config.register_captcha_type === 1" class="form-group">
                                                <div class="form-item form-captcha">
                                                    <input
                                                        v-if="pageStatus === 'login' && !mobileLogin && memInfo.config.login_captcha_type === 1"
                                                        v-model="formData.captcha_text"
                                                        :placeholder="$text('S_CHECK_CODE', '验证码')"
                                                        class="form-item-input"
                                                        type="text"
                                                        autocomplete="off"
                                                        maxlength="4"
                                                        @focus="getCaptcha"
                                                        @keydown.13="login"
                                                    />
                                                    <input
                                                        v-if="pageStatus === 'register' && memInfo.config.register_captcha_type === 1"
                                                        v-model="formData.captcha_text"
                                                        :placeholder="$text('S_CHECK_CODE', '验证码')"
                                                        class="form-item-input"
                                                        type="text"
                                                        autocomplete="off"
                                                        maxlength="4"
                                                        @focus="getCaptcha"
                                                    />
                                                    <img
                                                        v-if="captchaImg && !mobileLogin"
                                                        :src="captchaImg"
                                                        class="login-captcha-img"
                                                        @click="getCaptcha"
                                                    />
                                                </div>
                                            </div>
                                            <p v-if="pageStatus === 'register'" class="login-register-text">
                                                {{ $text('S_AGREE_TERMS_SERVICE', '注册即代表同意相关服务条款和隐私政策') }}
                                            </p>
                                            <div
                                                v-if="!mobileLogin && (pageStatus === 'login' && memInfo.config.login_captcha_type === 2) || (pageStatus === 'register' && memInfo.config.register_captcha_type === 2)"
                                                :class="[{'register-btn-space' : pageStatus === 'register'}, 'form-group-slide']"
                                            >
                                                <!-- 滑動驗證 -->
                                                <slide-verification
                                                    :is-enable="isSlideAble"
                                                    :page-status="pageStatus"
                                                    :success-fuc="pageStatus === 'login' ? login : register"
                                                />
                                            </div>
                                            <div
                                                v-else-if="!mobileLogin"
                                                :class="{'register-btn-space' : pageStatus === 'register'}"
                                                class="login-btn-box"
                                            >
                                                <button type="submit" class="login-btn-send">
                                                    <span>{{ submitBtn }}</span>
                                                </button>
                                            </div>
                                        </form>
                                        <div
                                            :class="{'register-link-space' : pageStatus === 'register'}"
                                            class="login-assist clearfix"
                                        >
                                            <button
                                                v-if="pageStatus === 'login' && !mobileLogin"
                                                class="login-assist-btn login-assist-left"
                                                @click="pageStatus = 'forget'"
                                            >
                                                {{ $text('S_PASSWORD_FORGET', '忘记密码') }}
                                            </button>
                                            <button
                                                v-if="pageStatus === 'login'"
                                                :class="{'mobile-login': mobileLogin}"
                                                class="login-assist-btn login-assist-right"
                                                @click="()=>{
                                                    pageStatus = 'register';
                                                    resetValue();
                                                }"
                                            >
                                                {{ $text('S_GO_TO_REGISTER', '还没有帐号？前去注册') }}
                                            </button>
                                            <button
                                                v-if="pageStatus === 'register'"
                                                class="login-assist-btn"
                                                @click="pageStatus = 'login'"
                                            >
                                                {{ $text('S_GO_TO_LOGIN', '已有帐号？前去登录') }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </transition>
                        </div>
                        <div class="login-footer">
                            <div
                                class="custom-service"
                                @click="openCustomerService"
                            >
                                <span>
                                    <icon
                                        name="headset"
                                        width="16"
                                        height="16"
                                    />
                                </span>
                                <span>{{ $text('S_ONLINE_CUSTOMER_SERVICE', '7x24 在线客服') }}</span>
                            </div>
                        </div>
                    </div>
                    <div v-if="pageStatus !== 'forget'" class="login-shadow" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import common from '@/api/common';
import member from '@/api/member';
import joinMemInfo from '@/config/joinMemInfo';
import { API_MOBILE_CAPTCHA, API_MOBILE_LOGIN } from '@/config/api';
import ajax from '@/lib/ajax';
import slideVerification from '@/components/slideVerification';

export default {
    components: {
        slideVerification
    },
    data() {
        const fields = {
            username: '',
            password: '',
            confirm_password: '',
            captcha_text: ''
        };
        return {
            pageStatus: 'login',
            captchaImg: '',
            formData: { ...fields },
            forgetData: {
                username: '',
                email: ''
            },
            errorMsg: { ...fields },
            finalValue: { ...fields },
            tips: {},
            loginInput: '',
            mobileLogin: false,
            isExpand: false,
            codeView: '86',
            areaCode: [
                { code: '86', cn: '中国大陆', en: 'China' },
                { code: '852', cn: '中国香港', en: 'Hong Kong' },
                { code: '853', cn: '中国澳门', en: 'Macao' },
                { code: '886', cn: '中国台湾', en: 'Taiwan' }
            ],
            phoneNumber: '',
            keyring: '',
            phoneCheck: false,
            captchaCheck: false,
            objectDefault: fields,
            isAjax: false
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            onlineService: 'getOnlineService',
            memInfo: 'getMemInfo'
        }),
        submitBtn() {
            const text = {
                login: this.$text('S_LOGIN_TITLE', '登录'),
                register: this.$text('S_JOIN_NOW', '立即注册'),
                forget: this.$text('S_JM_SURE_SEND', '确认送出')

            };
            return text[this.pageStatus];
        },
        isSlideAble() {
            if (this.pageStatus === 'login' && this.formData.username && this.formData.password) {
                return true;
            }

            if (this.pageStatus === 'register') {
                let checkResult = true;
                const slideField = Object.keys(this.formData).filter((key) => key !== 'captcha_text');

                slideField.forEach((fieldName) => {
                    if (!this.formData[fieldName] || this.errorMsg[fieldName]) {
                        checkResult = false;
                    }
                });

                return checkResult;
            }

            return false;
        }
    },
    watch: {
        pageStatus() {
            this.captchaImg = '';
            Object.keys(this.errorMsg).forEach((fieldName) => {
                this.errorMsg[fieldName] = '';
            });

            Object.keys(this.formData).forEach((fieldName) => {
                this.formData[fieldName] = '';
            });

            Object.keys(this.finalValue).forEach((fieldName) => {
                this.finalValue[fieldName] = '';
            });

            Object.keys(this.forgetData).forEach((fieldName) => {
                this.forgetData[fieldName] = '';
            });
        },
        finalValue() {
            if (this.pageStatus !== 'register') return;
            const msg = {};

            Object.keys(this.errorMsg).forEach((fieldName) => {
                if (this.finalValue[fieldName] === '') {
                    this.errorMsg[fieldName] = this.errorMsg[fieldName] !== '' ? this.$text('S_JM_FIELD_REQUIRE', '该栏位不得为空') : '';
                    return;
                }

                if (joinMemInfo[fieldName].regExp && !joinMemInfo[fieldName].regExp.test(this.finalValue[fieldName])) {
                    msg[fieldName] = this.$t(joinMemInfo[fieldName].errorMsg);
                    return;
                }

                if (fieldName === 'confirm_password' && this.finalValue.password !== this.finalValue.confirm_password) {
                    msg[fieldName] = this.$text('S_PASSWD_CONFIRM_ERROR', '确认密码预设要跟密码一致');
                    return;
                }

                msg[fieldName] = '';
            });

            this.errorMsg = {
                ...this.errorMsg,
                ...msg
            };
        },
        formData: {
            handler() {
                if (this.pageStatus === 'login') {
                    this.errorMsg[this.loginInput] = this.formData[this.loginInput] === '' ? this.$text('S_JM_FIELD_REQUIRE', '該欄位不得為空') : '';
                }
            },
            deep: true
        }
    },
    methods: {
        ...mapActions([
            'actionSetPop',
            'actionChangePage'
        ]),
        getCaptcha() {
            common.captcha({
                success: (response) => {
                    this.captchaImg = response.ret;
                }
            });
        },
        onSubmit() {
            if (this.pageStatus === 'login') this.login();
            if (this.pageStatus === 'register') this.register();
            if (this.pageStatus === 'forget') this.pwdSubmit();
        },
        login(captchaInfo) {
            if (this.isAjax) {
                return;
            }

            const captchaData = this.memInfo.config.login_captcha_type === 2 ? captchaInfo.data : this.formData.captcha_text;
            this.isAjax = true;

            member.login({
                params: {
                    username: this.formData.username,
                    password: this.formData.password,
                    captcha_text: captchaData
                }
            }).then((response) => {
                if (response && response.result === 'ok') {
                    member.announcement({
                        success: (res) => {
                            if (res.result === 'ok') {
                                res.ret.forEach((post) => {
                                    alert(post.content);
                                });
                            }
                        }
                    }).then(() => {
                        this.isAjax = false;
                        window.location.reload();
                    });
                    return;
                }

                if (captchaInfo && captchaInfo.slideFuc) {
                    captchaInfo.slideFuc.reset();
                }

                this.isAjax = false;
                this.formData.captcha_text = '';
            });
        },
        register(captchaInfo) {
            let checkResult = true;
            const slideField = this.memInfo.config.register_captcha_type === 2 ? Object.keys(this.formData).filter((key) => key !== 'captcha_text') : Object.keys(this.formData);

            slideField.forEach((fieldName) => {
                if (!this.formData[fieldName] || this.errorMsg[fieldName]) {
                    checkResult = false;
                }
            });

            if (!checkResult) {
                alert(this.$text('S_CHECK_CODE_ERROR', '验证码错误'));
                this.formData.captcha_text = '';

                if (captchaInfo && captchaInfo.slideFuc) {
                    captchaInfo.slideFuc.reset();
                }

                return;
            }

            if (this.memInfo.config.register_captcha_type === 2) {
                this.formData.captcha_text = captchaInfo.data;
            }

            member.join({
                errorAlert: true,
                params: {
                    ...this.formData,
                    speedy: true
                }
            }).then((response) => {
                if (response && response.result === 'ok') {
                    alert(this.$t('S_CR_SUCCESS'));

                    // GA流量統計
                    window.dataLayer.push({
                        dep: 2,
                        event: 'ga_click',
                        eventCategory: 'sign_up',
                        eventAction: 'sign_up',
                        eventLabel: 'sign_up',
                        ga_hall_id: 3820325,
                        ga_domain_id: this.memInfo.user.domain
                    });

                    window.location.reload();
                    return;
                }


                Object.keys(response.errors).forEach((key) => {
                    this.errorMsg[key] = response.errors[key];
                });

                if (captchaInfo && captchaInfo.slideFuc) {
                    captchaInfo.slideFuc.reset();
                }

                this.formData.captcha_text = '';
            });
        },
        onInput(e, fieldName) {
            this.finalValue = {
                ...this.finalValue,
                [fieldName]: e.target.value
            };
        },
        // 忘記密碼專用驗證
        verification(target, targetValue) {
            const re = joinMemInfo[target].regExp;

            if (!targetValue) {
                this.tips[target] = this.$t('S_JM_FIELD_REQUIRE');
                return;
            }

            if (target === 'username' && !re.test(targetValue)) {
                this.tips[target] = this.$t('S_USERNAME_ERROR');
                return;
            }

            if (target === 'email') {
                if (!re.test(targetValue) || (targetValue.length < 12 || targetValue.length > 100)) {
                    this.tips[target] = this.$text('S_JM_EMAIL_FORMAT_UNAVAILABLE', 'E-mail 格式不正确');
                    return;
                }
            }
            this.tips[target] = '';
        },
        pwdSubmit() {
            if (this.tips.username !== '' || this.tips.email !== '') {
                alert(this.$t('S_CHECK_FAIL'));
                return;
            }

            const pwdInfo = {
                username: this.forgetData.username,
                email: this.forgetData.email
            };

            member.pwdForget({
                params: pwdInfo,
                success: (response) => {
                    if (response.result === 'ok') {
                        alert(this.$t('FORGET_PWD_SEND'));
                        this.actionSetPop();
                    }
                }
            });
        },
        remind(data) {
            if (this.pageStatus !== 'login') return;
            if (this.formData[data] === '') {
                this.errorMsg[data] = this.$text('S_JM_FIELD_REQUIRE', '該欄位不得為空');
            }
        },
        openCustomerService() {
            if (this.onlineService.url) {
                this.actionChangePage({ page: 'service', type: 'static' });
            }
        },
        selectAreaCode(code) {
            this.codeView = code;
            this.isExpand = !this.isExpand;
        },
        sendCaptcha() {
            if (!this.phoneNumber) {
                return;
            }

            const phone = `${this.codeView}-${this.phoneNumber}`;

            ajax({
                method: 'put',
                url: API_MOBILE_CAPTCHA,
                params: {
                    phone
                },
                errorAlert: false
            });
        },
        loginByMobile(loginInfo = {}) {
            if (!this.phoneNumber || !this.codeView) {
                return;
            }

            const phone = `${this.codeView}-${this.phoneNumber}`;
            const keyring = `${this.keyring}`;

            ajax({
                method: 'put',
                url: API_MOBILE_LOGIN,
                params: {
                    phone,
                    keyring,
                    captcha_text: JSON.stringify(loginInfo)
                },
                errorAlert: false,
                success: (res) => {
                    if (res.result === 'ok') {
                        this.$router.push('/mobile');
                        return;
                    }
                    window.location.reload();
                }
            });
        },
        resetValue() {
            this.phoneNumber = '';
            this.keyring = '';
            this.mobileLogin = false;
            this.phoneCheck = false;
            this.captchaCheck = false;
            this.resetErrorMsg();
        },
        resetErrorMsg() {
            this.errorMsg = { ...this.objectDefault };
        }
    }
};
</script>

<style lang="scss" src="../css/login.scss" scoped />
