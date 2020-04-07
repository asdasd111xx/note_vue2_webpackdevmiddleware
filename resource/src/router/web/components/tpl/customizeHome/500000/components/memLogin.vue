<template>
    <div>
        <!-- 帳號 -->
        <div :class="$style['input-wrap']">
            <input
                v-model="username"
                :title="text.username"
                :placeholder="text.username"
                :maxlength="field.username.max"
                :class="$style['login-input']"
                tabindex="1"
                type="text"
                @keydown.13="loginCheck"
            />
        </div><!--
            密碼
        --><div :class="$style['input-wrap']">
            <input
                v-model="password"
                :title="text.password"
                :placeholder="text.password"
                :maxlength="field.password.max"
                :class="$style['login-input']"
                type="password"
                tabindex="2"
                @keydown.13="loginCheck"
            />
            <!-- 忘記密碼 -->
            <span :class="$style.forgetPw" @click="actionChangePage({page: '31313'})">{{ text.forgetPw }}</span>
        </div><!--
            驗證碼
        --><div :class="$style['input-wrap']">
            <input
                v-model="captcha"
                :title="text.reloadPic"
                :placeholder="text.captcha"
                :maxlength="field.captcha.max"
                :class="$style['login-input']"
                tabindex="3"
                @focus="getCaptcha"
                @keydown.13="loginCheck"
            />
            <img
                v-if="captchaImg"
                :src="captchaImg"
                :class="$style.image"
                @click="getCaptcha"
            />
        </div><!--
            登入鈕
        --><div :class="$style.login" @click="loginCheck">
            <div :class="$style.text">{{ text.login }}</div>
            <span />
        </div><!--
            加入會員
        --><div :class="$style.join" @click="actionChangePage({page: '31312'})">
            <div :class="$style.text">{{ text.join }}</div>
            <span />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import loginForm from '@/mixins/loginForm';

export default {
    mixins: [loginForm],
    data() {
        return {
            text: {
                username: this.$text('S_ACCOUNT', '帐号'),
                password: this.$text('S_PASSWORD', '密码'),
                captcha: this.$text('S_CHECK_CODE', '验证码'),
                reloadPic: this.$text('( 点选此处产生新验证码 )'),
                login: this.$text('S_LOGON', '登录'),
                forgetPw: this.$text('S_FORGET', '忘记?'),
                join: this.$text('S_REGISTER', '注册')
            },
            field: {
                username: { max: 20 },
                password: { max: 12 },
                captcha: { max: 4 }
            }
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd'
        })
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ])
    }
};
</script>

<style lang="scss" module>
.input-wrap {
    display: inline-block;
    position: relative;
    vertical-align: middle;
}

.login-input {
    display: inline-block;
    width: 130px;
    height: 28px;
    margin-right: 10px;
    padding-left: 10px;
    border: 1px solid #666;
    border-radius: 5px;
    color: #C0C0C0;
    background-color: #222;

    &::placeholder {
        color: #C0C0C0;
    }

    &:focus {
        border: 1px solid #E0EDFC;
        box-shadow: inset 0 0 10px hsla(0,0%,100%,.5);
        transition: transform .5s ease-in-out;
        outline: aliceblue;
    }
}

.forgetPw {
    display: inline-block;
    position: absolute;
    top: 0;
    right: 16px;
    font-size: 10px;
    cursor: pointer;
}

.image {
    position: absolute;
    top: 7px;
    right: 15px;
    width: 62px;
}

.login,
.join {
    position: relative;
    display: inline-block;
    width: 72px;
    height: 28px;
    line-height: 28px;
    text-align: center;
    color: #FFF;
    border-radius: 4px;
    overflow: hidden;
    vertical-align: middle;
    cursor: pointer;

    > span {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 0;
        display: inline-block;
        width: inherit;
        height: inherit;
        border-radius: 1330px;
        transform: scale(0);
        transition: transform .5s ease-in-out;
    }

    &:hover {
        color: #FFF;

        span {
            background-color: #955D2C;
            transform: scale(3);
        }
    }
}

.text {
    position: relative;
    z-index: 1;
}

.login {
    margin-right: 10px;
    background-color: #BA8C4E;
}

.join {
    background-color: #FFF;
    color: #333;
}
</style>
