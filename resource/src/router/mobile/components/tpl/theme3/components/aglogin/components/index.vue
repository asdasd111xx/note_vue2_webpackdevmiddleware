<template>
    <div :class="$style['login-wrap']">
        <div :class="$style['login-logo']" @click="$router.push('/mobile')" />
        <div :class="$style['login-cotainer']">
            <div :class="$style['login-main']">
                <div :class="$style['login-header']">{{ $t('S_AGENT_LOGIN') }}</div>
                <div :class="$style['login-form']">
                    <!-- 帳號 -->
                    <div :class="[$style['form-item'], $style.username]">
                        <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/login/username.png')" :class="$style.icon" />
                        <input
                            v-model="username"
                            :title="$t('S_ACCOUNT')"
                            :placeholder="$t('S_ACCOUNT')"
                            type="text"
                            maxlength="20"
                            tabindex="1"
                            @keydown.13="login"
                        />
                    </div>
                    <!-- 密碼 -->
                    <div :class="[$style['form-item'], $style.password]">
                        <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/login/password.png')" :class="$style.icon" />
                        <input
                            v-model="password"
                            :title="$t('S_PASSWORD')"
                            :placeholder="$t('S_PASSWORD')"
                            type="password"
                            maxlength="12"
                            tabindex="2"
                            @keydown.13="login"
                            @change="onSavePassword"
                        />
                    </div>
                    <!-- 驗證碼 -->
                    <div :class="[$style['form-item'], $style.captcha]">
                        <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/login/captcha.png')" :class="$style.icon" />
                        <img
                            v-if="captchaImg"
                            :src="captchaImg"
                            :class="$style['login-captcha-img']"
                            @click="getCaptcha"
                        />
                        <input
                            v-model="captcha"
                            :title="$t('S_RELOAD_PIC')"
                            :placeholder="$t('S_CHECK_CODE')"
                            type="text"
                            maxlength="4"
                            tabindex="3"
                            @focus="getCaptcha"
                            @keydown.13="loginCheck"
                        />
                    </div>
                </div>
                <div :class="[$style['login-assist'], 'clearfix']">
                    <!-- 記住密碼 -->
                    <div :class="[$style['form-item'], $style['remember'], 'clearfix']">
                        <button @click="onSavePassword">
                            <span :class="$style['remember-icon']" @click="depositStatus = !depositStatus">
                                <img
                                    v-if="depositStatus"
                                    :src="$getCdnPath('/static/image/mobile/tpl/theme3/login/remember.png')"
                                    :class="[$style.icon]"
                                />
                                <i
                                    v-if="!depositStatus"
                                    :class="$style['not-remember-icon']"
                                />
                            </span>
                            <span :class="$style['remember-text']">{{ $t('S_SAVE_PASSWORD') }}</span>
                        </button>
                    </div>
                    <!-- 忘記密碼 -->
                    <div :class="[$style['form-item'], $style['forget']]">
                        <router-link to="/mobile/forgetpwd/agent" tag="button">{{ $t('S_PASSWORD_FORGET') }}?</router-link>
                    </div>
                </div>
                <div :class="$style['login-footer']">
                    <!-- 登入 -->
                    <button
                        :class="$style['login-button']"
                        tabindex="4"
                        @click="loginCheck"
                    >
                        {{ $t('S_LOGON') }}
                    </button>
                    <!-- 先去逛逛 -->
                    <router-link to="/mobile" tag="button">{{ $t('S_GO_VISIT_FIRST') }}</router-link>
                </div>
            </div>
            <!-- 代理註冊 -->
            <div :class="$style['login-register']">
                <div :class="$style['form-item']" @click="$router.push('/mobile/joinagent')">
                    <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/login/join.png')" :class="$style.icon" />
                    <span>{{ $t('S_AGENT_JOIN') }}</span>
                </div>
            </div>
            <security-check
                v-if="checkItem"
                :check-item.sync="checkItem"
                :theme="$styleSecurityCheck"
                :on-login="login"
            />
        </div>
    </div>
</template>

<script>
import loginForm from '@/mixins/agLoginForm';

export default {
    components: {
        securityCheck: () => import(/* webpackChunkName: 'securityCheck' */'@/router/web/components/common/securityCheck')
    },
    mixins: [loginForm],
    props: {
        redirect: {
            type: String,
            default: '/mobile'
        }
    },
    data() {
        return {
            depositStatus: false
        };
    },
    created() {
        this.password = localStorage.getItem('password') || '';
        this.depositStatus = localStorage.getItem('depositStatus') || false;
    },
    methods: {
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
        },
        /**
         * 儲存密碼
         * @method onSavePassword
         * @return void
         */
        onSavePassword() {
            if (!this.depositStatus) {
                localStorage.removeItem('password');
                localStorage.removeItem('depositStatus');
                return;
            }

            localStorage.setItem('password', this.password);
            localStorage.setItem('depositStatus', this.depositStatus);
        }
    }
};
</script>

<style lang="scss" module>
.login-wrap {
    height: 100%;
    padding: 50px 15px 0;
    background-image: url('/static/image/mobile/tpl/theme3/login/bg.png');
    background-size: cover;
    background-repeat: no-repeat;
}

.login-logo {
    text-align: center;
    width: 200px;
    height: 61px;
    margin: 0 auto 25px;
    background-image: url('/static/image/mobile/tpl/theme3/login/logo.png');
    background-size: cover;
}

.icon {
    width: 25px;
    height: 25px;
    display: inline-block;
    vertical-align: middle;
}

.login-cotainer {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: stretch;
    font-size: 12px;
    color: #F8F1EB;

    button {
        color: #F8F1EB;
        display: inline-block;
        vertical-align: middle;
        border: 0;
        padding: 0;
        margin: 0;
        background: rgba(0,0,0,0);

        &:focus {
            outline: 0;
        }
    }
}

.login-main {
    border-radius: 10px 0 0 10px;
    background-color: rgba(248, 241, 235, .18);
    flex: 1;
    padding: 0 15px 35px;
    box-sizing: border-box;
}

.login-header {
    text-align: center;
    color: #fff;
    margin: 40px 0 15px;
    font-size: 15px;
}

.login-form {
    .form-item {
        height: 40px;
        width: 100%;
        border: 0;
        border-radius: 40px;
        box-sizing: border-box;
        background-color: rgba(0,0,0,.3);
        overflow: hidden;
        padding: 0px 25px 0 40px;
        align-items: center;
        justify-content: center;
        position: relative;

        & + .form-item {
            margin-top: 10px;
        }

        &.captcha {
            padding: 0px 90px 0 40px;
        }

        img {
            position: absolute;
            top: 7px;
            left: 8px;

            &.login-captcha-img {
                width: 80px;
                right: 5px;
                left: auto;
            }
        }

        input {
            width: 100%;
            color: #F8F1EB;
            border: 0;
            background: transparent;
            height: 40px;
            line-height: 40px;
            font-size: 14px;

            &:focus {
                outline: 0;
            }
        }
    }
}

.login-assist {
    margin: 10px 0 25px;
    line-height: 20px;
    justify-content: space-between;

    .form-item {
        width: 45%;
        float: right;
        overflow: hidden;
        text-align: right;

        &.remember {
            float: left;
            text-align: left;

            .remember-icon {
                float: left;
                width: 20px;
                display: block;
            }

            .not-remember-icon {
                border: 2px solid #F8F1EB;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                display: block;
            }

            .remember-text {
                line-height: 20px;
                float: left;
                margin: 0px 0 0px 4px;
                display: block;
                width: calc(100% - 24px);
            }

            .icon {
                width: 20px;
                height: 20px;
            }
        }

        button {
            padding: 5px 10px;
            height: 30px;
        }
    }
}

.login-register {
    flex: 0 0 3rem;
    border-radius: 0 .6rem .6rem 0;
    background-color: rgba(0,0,0,.4);
    box-sizing: border-box;
    position: relative;

    .form-item {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }

    img {
        margin: 0 0 10px 2px;
    }

    span {
        display: block;
        text-align: center;
        line-height: 17px;
        max-width: 13px;
        word-break: break-all;
        margin: 0 auto;
    }
}

.login-footer {
    button {
        display: block;
        height: 40px;
        width: 100%;
        line-height: 40px;
        font-size: 14px;
        text-align: center;
    }

    .login-button {
        color: #9C6E54;
        background-image: linear-gradient(90deg, #efdfae, #edbf6a);
        border-radius: 40px;
        margin: 0 0 10px 0;
    }
}

</style>
<style lang="scss" module="$styleSecurityCheck">
.container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 999;
}

.content {
    position: relative;
    margin: 194px auto 0;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.9);
    padding-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    max-width: 340px;
    color: #272727;
    font-size: 14px;
}

.title {
    margin-bottom: 16px;
    padding: 15px 20%;
    background: #272727;
    width: 100%;
    font-size: 20px;
    line-height: 20px;
    text-align: center;
    color: #FFF;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.field {
    margin: 0 auto 16px;
    width: 80%;

    .field-title {
        line-height: 3;
    }

    input {
        border: 1px solid #9C6E54;
        display: block;
        background-color: rgba(255,255,255,0.5);
        border-radius: 8px;
        width: 100%;
        height: 40px;
        text-indent: 10px;
        outline: none;
        color: #272727;

        &::-webkit-input-placeholder {
            color: #9C6E54;
        }
    }
}

.submit {
    margin: 0 auto;
    border-radius: 8px;
    background-image: linear-gradient(90deg, #efdfae, #edbf6a);
    width: 80%;
    height: 40px;
    line-height: 40px;
    color: #9C6E54;
    cursor: pointer;
    text-align: center;
}

.close {
    position: absolute;
    top: 5px;
    right: 10px;
    width: 40px;
    height: 40px;
    line-height: 36px;
    font-size: 26px;
    text-align: center;
    color: #FFF;
    cursor: pointer;
    transition: all .3s ease;

    &:hover {
        transform:rotate(90deg);
    }
}

.tip {
    margin: 20px auto 0;
    width: 80%;
    font-size: 15px;
    text-align: center;
    color: #f6ad2a;
}

.mask {
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
}

</style>
