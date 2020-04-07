<template>
    <div class="login-form-wrap clearfix">
        <!-- 帳號 -->
        <div class="login-unit login-unit-username">
            <input
                v-model="username"
                :title="$t('S_ACCOUNT')"
                :placeholder="$t('S_ACCOUNT')"
                class="login-input"
                maxlength="20"
                tabindex="1"
                @keydown.13="loginCheck"
            />
        </div>
        <!-- 密碼 -->
        <div class="login-unit login-unit-password">
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
            <!-- 忘記密碼 -->
            <span
                :title="$t('S_PASSWORD_FORGET')"
                class="links-forget"
                @click="$emit('setPop', { type: 'memPwdForget' })"
            >
                {{ i18nList.forgetPwd[language] }} ?
            </span>
        </div>
        <!-- 驗證碼 -->
        <div class="login-unit login-unit-captcha">
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
                width="54"
                height="24"
                @click="getCaptcha"
            />
        </div>
        <!-- 登入鈕 -->
        <div
            class="login-submit"
            @mouseenter="isActive = true"
            @mouseleave="isActive = false"
            @click="loginCheck"
        />
        <!-- hover提示 協議與規則 -->
        <transition :name="'slide-fade'">
            <div
                v-if="isActive"
                class="prompt-text"
                @mouseenter="isActive = true"
                @mouseleave="isActive = false"
            >
                <span>{{ $text('S_CLICK_LOGIN_AGREE', '点击登入表示同意') }}</span>
                <span class="prompt-link" @click="promptHandler">{{ $text('S_AGREEMENTS_RULES', '协议与规则') }}</span>
            </div>
        </transition>
        <!-- 加入會員 -->
        <span
            :title="$t('S_FREE_MEMBER_OPEN')"
            class="links-join"
            @click="$emit('changePage', { page: 'join', type: '' })"
        />
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
import i18nList from '../config/lang';

export default {
    components: {
        securityCheck: () => import(/* webpackChunkName: 'securityCheck' */'@/router/web/components/common/securityCheck')
    },
    mixins: [loginForm],
    data() {
        return {
            i18nList,
            isActive: false
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            curLang: 'getCurLang'
        }),
        language() {
            const openLang = ['zh-tw', 'zh-cn', 'en'];
            return openLang.includes(this.curLang) ? this.curLang : 'zh-cn';
        }
    },
    mounted() {
        // 前台才動作
        if (!this.isBackEnd) {
            this.$on('setPop', this.setPop);
            this.$on('changePage', this.changePage);
        }
    },
    methods: {
        ...mapActions([
            'actionSetPop',
            'actionChangePage'
        ]),
        setPop(data) {
            this.actionSetPop(data);
        },
        changePage(data) {
            this.actionChangePage(data);
        },
        promptHandler() {
            this.actionChangePage({
                page: 6050,
                type: 'custom'
            });
        }
    }
};
</script>

<style lang="scss" src="../css/loginForm.scss" scoped />
