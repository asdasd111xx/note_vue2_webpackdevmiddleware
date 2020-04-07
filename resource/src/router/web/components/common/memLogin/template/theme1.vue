<template>
    <div>
        <template v-for="item in sort">
            <!-- 帳號 -->
            <div
                v-if="item === 'username'"
                :key="item"
                class="login-input login-input--username"
            >
                <input
                    v-model="username"
                    :title="text.username"
                    :placeholder="text.username"
                    :maxlength="field.username.max"
                    class="login-input__input"
                    tabindex="1"
                    @keydown.13="loginCheck"
                />
            </div>
            <!-- 密碼 -->
            <div
                v-if="item === 'password'"
                :key="item"
                class="login-input login-input--password"
            >
                <input
                    v-model="password"
                    :title="text.password"
                    :placeholder="text.password"
                    :maxlength="field.password.max"
                    class="login-input__input"
                    type="password"
                    tabindex="2"
                    @keydown.13="loginCheck"
                />
            </div>
            <!-- 驗證碼 -->
            <div
                v-if="item === 'captcha'"
                :key="item"
                class="login-input login-input--captcha"
            >
                <input
                    v-model="captcha"
                    :title="text.reloadPic"
                    :placeholder="text.captcha"
                    :maxlength="field.captcha.max"
                    class="login-input__input"
                    tabindex="3"
                    @focus="getCaptcha"
                    @keydown.13="loginCheck"
                />
                <img
                    v-if="captchaImg"
                    :src="captchaImg"
                    class="login-input__image"
                    @click="getCaptcha"
                />
            </div>
            <!-- 忘記密碼 -->
            <div
                v-if="link.forgetPw && item === 'forgetPw'"
                :key="item"
                :title="text.forgetPw"
                class="login-btn login-btn--forget"
                @click="forgetPw({ type: 'memPwdForget' })"
            >
                {{ text.forgetPw }}
            </div>
            <!-- 登入鈕 -->
            <div
                v-if="item === 'submit'"
                :key="item"
                :class="`login-btn login-btn--submit lang-${CurLang}`"
                @click="loginCheck"
            >
                {{ text.login }}
            </div>
            <!-- 加入會員 -->
            <div
                v-if="link.join && item === 'join'"
                :key="item"
                class="login-btn login-btn--join"
                @click="onJoin"
            >
                {{ text.join }}
            </div>
            <!-- 分隔線 -->
            <div
                v-if="item === 'line'"
                :key="item"
                class="space-line"
            >
                {{ text.line }}
            </div>
        </template>
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
        sort: {
            type: Array,
            required: true
        },
        field: {
            type: Object,
            required: true
        },
        text: {
            type: Object,
            required: true
        },
        link: {
            type: Object,
            required: true
        },
        closeMemLogin: {
            type: Function,
            default: null
        }
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            CurLang: 'getCurLang'
        })
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionSetPop'
        ]),
        onJoin() {
            this.actionChangePage({ page: 'join', type: '' });
            this.onClose();
        },
        forgetPw(data) {
            if (this.isBackEnd) {
                return;
            }
            this.actionSetPop(data);
            this.onClose();
        },
        onClose() {
            if (!this.closeMemLogin) {
                return;
            }

            this.closeMemLogin();
        }
    }
};
</script>
