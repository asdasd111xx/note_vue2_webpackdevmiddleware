<template>
    <div class="login-form-wrap clearfix">
        <!-- 帳號 -->
        <span class="login-unit login-unit-username">
            <input
                v-model="username"
                :title="$t('S_ACCOUNT')"
                :placeholder="$t('S_ACCOUNT')"
                class="login-input"
                maxlength="20"
                tabindex="1"
                @keydown.13="loginCheck"
            />
        </span>
        <!-- 密碼 -->
        <span class="login-unit login-unit-password">
            <input
                v-model="password"
                :title="$t('S_PASSWORD')"
                :placeholder="$t('S_PASSWORD')"
                class="login-input"
                type="password"
                maxlength="12"
                tabindex="2"
                @keydown.13="loginCheck"
            />
            <!-- hover提示 協議與規則 -->
            <transition :name="'slide-fade'">
                <div
                    v-if="promptStatus.isShow && isActive"
                    class="prompt-text"
                    @mouseenter="isActive = true"
                    @mouseleave="isActive = false"
                >
                    <span>{{ $text('S_CLICK_LOGIN_AGREE', '点击登入表示同意') }}</span>
                    <span class="prompt-link" @click="promptHandler">{{ $text('S_AGREEMENTS_RULES', '协议与规则') }}</span>
                </div>
            </transition>
        </span>
        <!-- 驗證碼 -->
        <span class="login-unit login-unit-captcha">
            <input
                v-model="captcha"
                :title="$t('S_RELOAD_PIC')"
                :placeholder="$t('S_CHECK_CODE')"
                class="login-input"
                maxlength="4"
                tabindex="3"
                @focus="getCaptcha"
                @keydown.13="loginCheck"
            />
            <img
                v-if="captchaImg"
                :src="captchaImg"
                height="25"
                @click="getCaptcha"
            />
        </span>
        <!-- 忘記密碼 -->
        <span
            v-if="isShowPwForget"
            :title="$t('S_PASSWORD_FORGET')"
            class="links-forget"
            @click="$emit('setPop', { type: 'memPwdForget' })"
        >
            {{ $t('S_PASSWORD_FORGET') }} ?
        </span>
        <!-- 登入鈕 -->
        <div
            class="login-submit"
            @mouseenter="isActive = true"
            @mouseleave="isActive = false"
            @click="loginCheck"
        >
            {{ loginText ? loginText : $t('S_LOGIN') }}
        </div>
        <security-check
            v-if="checkItem"
            :check-item.sync="checkItem"
            :on-login="login"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import loginForm from '@/mixins/loginForm';

export default {
    components: {
        securityCheck: () => import(/* webpackChunkName: 'securityCheck' */'@/router/web/components/common/securityCheck')
    },
    mixins: [loginForm],
    props: {
        isShowPwForget: {
            type: Boolean,
            default: false
        },
        loginText: {
            type: String,
            default: null
        },
        promptStatus: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            isActive: false
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd'
        })
    },
    methods: {
        ...mapActions([
            'actionSetPop',
            'actionChangePage'
        ]),
        setPop(data) {
            if (this.isBackEnd) {
                return;
            }
            this.actionSetPop(data);
        },
        promptHandler() {
            if (!this.promptStatus.pid) {
                this.actionChangePage({
                    page: 'agreement',
                    type: 'static'
                });

                return;
            }

            this.actionChangePage({
                page: this.promptStatus.pid,
                type: 'custom'
            });
        }
    }
};
</script>
