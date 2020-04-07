<template>
    <div :class="$style['page-wrap']">
        <div :class="$style['login-wrap']">
            <div :class="$style['img-wrap']">
                <img :src="$getCdnPath('/static/image/tpl/17/customPage/join/text.png')" />
            </div>
            <div :class="$style['img-wrap']">
                <img :src="$getCdnPath('/static/image/tpl/17/customPage/logo.png')" />
            </div>
            <div :class="$style['form-wrap']">
                <div :class="$style['field-wrap']">
                    <div :class="$style['login-input-wrap']">
                        <span :class="$style['icon-wrap']">
                            <img :src="$getCdnPath('/static/image/tpl/17/customPage/join/user.png')" />
                        </span><!--
                            帳號
                        --><input
                            v-model="username"
                            :title="text.username"
                            :placeholder="text.username"
                            :class="$style['login-input']"
                        />
                    </div>
                </div>
                <div :class="$style['field-wrap']">
                    <div :class="$style['login-input-wrap']">
                        <span :class="$style['icon-wrap']">
                            <img :src="$getCdnPath('/static/image/tpl/17/customPage/join/password.png')" />
                        </span><!--
                            密碼
                        --><input
                            v-model="password"
                            :title="text.password"
                            :placeholder="text.password"
                            :class="$style['login-input']"
                            type="password"
                        />
                    </div>
                </div>
                <div :class="$style['field-wrap']">
                    <div :class="[$style['login-input-wrap'], $style['captcha-wrap']]">
                        <span :class="$style['icon-wrap']">
                            <img :src="$getCdnPath('/static/image/tpl/17/customPage/join/valid_code.png')" />
                        </span><!--
                            驗證碼
                        --><input
                            v-model="captcha"
                            :title="text.reloadPic"
                            :placeholder="text.captcha_text"
                            :class="$style['login-input']"
                            @focus="getCaptcha"
                            @keydown.13="loginCheck"
                        />
                        <img
                            v-if="captchaImg"
                            :src="captchaImg"
                            :class="$style['captcha-img']"
                            @click="getCaptcha"
                        />
                    </div>
                </div>
                <div :class="$style['login-btn']" @click="loginCheck">
                    {{ text.login }}
                </div>
                <div :class="[$style['login-text'], 'clearfix']">
                    <div :class="$style.text" @click="changePage({ page: webInfo.alias === '500000' ? '31313' : webInfo.alias === '48' ? '10484' : '10516' })">{{ $text('S_PASSWORD_FORGET', '忘记密码') }}?</div>
                    <div :class="$style.text" @click="changePage({ page: webInfo.alias === '500000' ? '32424' : webInfo.alias === '48' ? '10491' : '10524' })">{{ $text('S_JOIN_NOW', '立即注册') }}</div>
                </div>
            </div>
        </div>
        <security-check
            v-if="checkItem"
            :check-item.sync="checkItem"
            :on-login="login"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import agLoginForm from '@/mixins/agLoginForm';

export default {
    components: {
        securityCheck: () => import(/* webpackChunkName: 'securityCheck' */'../../../../common/securityCheck')
    },
    mixins: [agLoginForm],
    props: {
        changePage: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            text: {
                username: this.$text('S_ACCOUNT', '帐号'),
                password: this.$text('S_PASSWORD', '密码'),
                captcha_text: this.$text('S_CHECK_CODE', '验证码'),
                reloadPic: this.$text('S_RELOAD_PIC', '( 点选此处产生新验证码 )'),
                login: this.$text('S_LOGON', '登录')
            }
        };
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo'
        })
    }
};
</script>

<style lang="scss" src="./css/pageAgentLogin.module.scss" module></style>
