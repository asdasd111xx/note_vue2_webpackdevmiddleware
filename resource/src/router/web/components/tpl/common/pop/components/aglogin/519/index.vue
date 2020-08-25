<template>
    <transition name="fade">
        <div :class="$style['popup-wrap']">
            <div :class="$style['ag-login-wrap']">
                <div :class="$style['top-icon']" />
                <div :class="$style.close" @click="actionSetPop()" />
                <div :class="$style.title">{{ $t('S_AGENT_LOGIN') }}</div>
                <div :class="$style['form-wrap']">
                    <div :class="$style.field">
                        <input
                            :class="$style['input-username']"
                            :placeholder="$t('S_ACCOUNT')"
                            :value="username"
                            type="text"
                            @input="$emit('update:username', $event.target.value)"
                            @keydown.13="submit"
                        />
                    </div>
                    <div :class="$style.field">
                        <input
                            :class="$style['input-password']"
                            :placeholder="$t('S_PASSWORD')"
                            :value="password"
                            type="password"
                            @input="$emit('update:password', $event.target.value)"
                            @keydown.13="submit"
                        />
                    </div>
                    <div :class="$style.field">
                        <input
                            :class="$style['input-captcha']"
                            :placeholder="$t('S_CHECK_CODE')"
                            :value="captcha"
                            type="text"
                            maxlength="4"
                            @input="$emit('update:captcha', $event.target.value)"
                            @focus="getCaptcha"
                            @keydown.13="submit"
                        />
                        <img
                            v-if="captchaImg"
                            :src="captchaImg"
                            :class="$style['img-captcha']"
                            @click="getCaptcha"
                        />
                    </div>
                    <div :class="$style.submit" @click="submit">{{ $t('S_LOGIN') }}</div>
                    <div
                        v-if="memInfo.config.agent_register"
                        :class="$style['join-agent']"
                        @click="onJoinAgent"
                    >
                        {{ $t('S_CEP_JOINAGENT') }}
                    </div>
                    <div :class="$style['forget-pw-wrap']">
                        <span :class="$style['forget-pw']" @click="actionSetPop({ type: 'agPwdForget' })">
                            {{ $t('S_PASSWORD_FORGET') }} ?
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import common from '@/api/common';

export default {
    props: {
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        captcha: {
            type: String,
            required: true
        },
        submit: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            captchaImg: ''
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        })
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionSetPop'
        ]),
        getCaptcha() {
            common.captcha({
                success: (response) => {
                    this.captchaImg = response.ret;
                }
            });
        },
        onJoinAgent() {
            this.actionChangePage({ page: 'joinAgent', type: '' });
            this.actionSetPop();
        }
    }
};
</script>

<style lang="scss" module>
// animate
:global(.popup-enter) .mask,
:global(.popup-leave-active) .mask {
    opacity: 0;
}

:global(.popup-enter) .ag-login-wrap {
    transform: scale(0.9);
    opacity: 0;
}
:global(.popup-leave-active) .ag-login-wrap {
    transform: scale(1.1);
    opacity: 0;
}

.popup-wrap {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    transition: opacity .3s ease;
}

.mask {
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .5);
    width: 100%;
    height: 100%;
    transition: opacity .3s ease;
}

.ag-login-wrap {
    position: fixed;
    z-index: 999;
    bottom: 14%;
    left: 36%;
    background-color: rgba(25, 31, 48, 0.9);
    padding: 93px 51px 64px;
    width: 440px;
    margin: 194px auto 0;
    border: 2px solid #F3F2F1;
}

.top-icon {
    position: absolute;
    top: -39px;
    left: 50%;
    background: url('/static/image/common/519/login_icon03.png') 0 0 no-repeat;
    margin-left: -41px;
    width: 82px;
    height: 78px;
}

.close {
    position: absolute;
    top: -16px;
    left: 407px;
    width: 42px;
    height: 42px;
    cursor: pointer;
    background: url('/static/image/common/519/login_icon04.png') 0 0 no-repeat;

    &:hover {
        background: url('/static/image/common/519/login_icon04_hover.png') 0 0 no-repeat;
    }
}

.title {
    margin-bottom: 32px;
    color: #DBB969;
    line-height: normal;
    text-align: center;
    font-size: 26px;
    font-weight: bold;
}

.form-wrap {
    font-size: 20px;
}

.field {
    position: relative;
    background-color: rgba(255, 255, 255, .2);
    margin-bottom: 15px;
    height: 41px;
    border-radius: 5px;
}

.field-input {
    background-color: transparent;
    padding-left: 52px;
    width: 100%;
    height: inherit;
    border: none;
    outline: none;
    color: #C0C0C0;
}

.input-username {
    composes: field-input;
    background: url('/static/image/common/519/login_icon01.png') 16px 50% no-repeat;
}

.input-password {
    composes: field-input;
    background: url('/static/image/common/519/login_icon02.png') 16px 50% no-repeat;
}

.input-captcha {
    composes: field-input;
    padding-left: 0;
    text-align: center;

}

.img-captcha {
    position: absolute;
    right: 8px;
    top: 8px;
    width: 73px;
    height: 24px;
}

.form-btn {
    background: #FFF;
    margin-top: 25px;
    height: 50px;
    line-height: 50px;
    border-radius: 20px;
    color: #000;
    cursor: pointer;
    text-align: center;
}

.submit {
    composes: form-btn;
    background: linear-gradient(to bottom, white 0%, #CA8C54 100%);

    &:hover {
        background: #CA8C54;
        color: #FFF;
    }
}

.join-agent {
    composes: form-btn;
    background: linear-gradient(to bottom, #CF9661 0%, #995f49 100%);
    color: #000;

    &:hover {
        background: #995F49;
        color: #FFF;
    }
}

.forget-pw-wrap {
    margin-top: 19px;
    color: #C0C0C0;
    font-size: 15px;
    text-align: center;

    .forget-pw {
        cursor: pointer;
    }
}
</style>
