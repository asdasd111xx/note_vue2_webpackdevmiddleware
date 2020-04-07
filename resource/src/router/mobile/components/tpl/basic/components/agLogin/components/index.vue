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
        </span>
        <!-- 驗證碼 -->
        <span class="login-unit login-unit-captcha clearfix">
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
        <!-- 忘記密碼、加入會員 -->
        <span class="login-unit login-unit-link">
            <router-link :to="'/mobile/forgetpwd/agent'">{{ $t('S_PASSWORD_FORGET') }}</router-link>
        </span>
        <!-- 登入鈕 -->
        <div class="login-submit" @click="loginCheck">{{ $t('S_LOGIN') }}</div>
        <!-- 立即加盟、代理登入 -->
        <div class="login-btn-wrap clearfix">
            <router-link
                class="join-agent-link"
                to="/mobile/joinagent"
            >
                {{ $t('S_CEP_JOINAGENT') }}
            </router-link>
        </div>
        <security-check
            v-if="checkItem"
            :check-item.sync="checkItem"
            :theme="$styleSecurityCheck"
            :on-login="login"
        />
    </div>
</template>

<script>
import agLoginForm from '@/mixins/agLoginForm';

/**
 * 登入共用元件
 */
export default {
    components: {
        securityCheck: () => import(/* webpackChunkName: 'securityCheck' */'@/router/web/components/common/securityCheck')
    },
    mixins: [agLoginForm],
    props: {
        redirect: {
            type: String,
            default: '/mobile/agcenter'
        }
    }
};
</script>

<style src="../css/index.scss" lang="scss" scoped></style>
<style lang="scss" module="$styleSecurityCheck">
.container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: left;
    z-index: 999;
}

.content {
    position: relative;
    margin: 194px auto 0;
    border-radius: 4px;
    background: #FFF;
    padding-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    max-width: 340px;
    font-size: 14px;
}

.title {
    margin-bottom: 16px;
    padding: 15px 20%;
    background: #00347D;
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
        color: #000;
    }

    input {
        display: block;
        background-color: #F5F5F5;
        border: none;
        border-radius: 8px;
        width: 100%;
        height: 40px;
        text-indent: 10px;
        outline: none;
    }
}

.submit {
    margin: 0 auto;
    border-radius: 8px;
    background: #00347D;
    width: 80%;
    height: 40px;
    line-height: 40px;
    color: #FFF;
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
    font-size: 36px;
    text-align: center;
    color: #FADCB2;
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
    color: #FF5454;
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
