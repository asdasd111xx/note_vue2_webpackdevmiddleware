<template>
    <mobile-container
        class="container"
        :header-config="headerConfig"
        :hasFooter="false"
    >
        <div slot="content" class="ag-login-wrap clearfix">
            <div v-if="webInfo.m_logo" class="ag-login-logo">
                <img :src="$getCdnPath(`${cdnDomain}${webInfo.m_logo}`)" />
            </div>
            <div class="ag-login-form-wrap">
                <div class="ag-login-form-title">{{ $text('S_AGENT_LOGIN', '代理登入') }}</div>
                <!-- 帳號 -->
                <span class="ag-login-unit ag-login-unit-username">
                    <input
                        ref="username"
                        v-model="username"
                        :title="$t('S_ACCOUNT')"
                        :placeholder="$t('S_ACCOUNT')"
                        class="ag-login-input"
                        maxlength="20"
                        tabindex="1"
                        @keydown.13="loginCheck"
                        @input="onRemeberMe"
                    />
                    <span class="input-icon" />
                </span>
                <!-- 密碼 -->
                <span class="ag-login-unit ag-login-unit-password">
                    <input
                        ref="password"
                        v-model="password"
                        :title="$t('S_PASSWORD')"
                        :placeholder="$t('S_PASSWORD')"
                        class="ag-login-input"
                        type="password"
                        maxlength="12"
                        tabindex="2"
                        @keydown.13="loginCheck"
                        @input="onRemeberMe"
                    />
                    <span class="input-icon" />
                    <img
                        class="pwd-eye"
                        :src="`/static/image/_new/login/btn_eye_${passwordVisible ? 'n' : 'd'}.png`"
                        @click.stop="toggleVisible"
                    />
                    <!-- 忘記密碼 -->
                    <span class="ag-login-unit-link">
                        <router-link :to="'/mobile/forgetpwd/member'">{{ $t('S_PASSWORD_FORGET') }}</router-link>
                    </span>
                </span>
                <!-- 驗證碼 -->
                <span v-if="memInfo.config.login_captcha_type === 1" class="ag-login-unit ag-login-unit-captcha clearfix">
                    <input
                        ref="login-captcha"
                        v-model="captcha"
                        :title="$t('S_RELOAD_PIC')"
                        :placeholder="$t('S_CHECK_CODE')"
                        class="ag-login-input"
                        maxlength="4"
                        tabindex="3"
                        @keydown.13="loginCheck"
                    />
                    <span class="input-icon" />
                    <div class="redo-wrap" @click="clickCaptcha">
                        <icon class="captcha-reform" name="redo-alt" />
                    </div>
                    <img
                        v-if="captchaImg"
                        :src="captchaImg"
                        class="captcha-img"
                        @click="clickCaptcha"
                    />
                </span>
                <div class="ag-login-deposit-username clearfix" @click="onRemeberMe">
                    <div class="icon-wrap" @click="depositStatus = !depositStatus">
                        <img :src="`/static/image/_new/common/icon_${depositStatus? '': 'no'}remember.png`" />
                    </div>
                    <span class="deposit-text">{{ $text('S_REMEMBER_ME', '记住我') }}</span>
                </div>
                <!-- 滑動驗證 -->
                <slide-verification
                    v-if="memInfo.config.login_captcha_type === 2"
                    :is-enable="isSlideAble"
                    :page-status="`login`"
                    :success-fuc="slideLogin"
                />
                <div v-else class="ag-login-bottom-wrap clearfix">
                    <!-- 立即加盟鈕 -->
                    <div class="ag-login-button ag-login-join-mem">
                        <router-link to="/mobile/joinagent">{{ $text('S_CEP_JOINAGENT', '立即加盟') }}</router-link>
                    </div>
                    <!-- 登入鈕 -->
                    <div class="ag-login-button ag-login-submit" @click="loginCheck">{{ $t('S_LOGIN') }}</div>
                </div>
                <div class="ag-go-first">
                    <router-link to="/mobile">{{ $text('S_FIRST_LOOK', '先去逛逛') }}</router-link>
                </div>
                <div class="ag-login-member-link clearfix">
                    <!-- 會員註冊鈕 -->
                    <div class="ag-member-link-button">
                        <router-link to="/mobile/joinmember">{{ $text('S_MEMBER_REGISTER', '会员注册') }}</router-link>
                    </div>
                    <!-- 會員登入鈕 -->
                    <div class="ag-member-link-button">
                        <router-link to="/mobile/login">{{ $text('S_MEMBER_LOGIN', '会员登入') }}</router-link>
                    </div>
                </div>
            </div>
            <security-check
                v-if="checkItem"
                :check-item.sync="checkItem"
                :theme="$styleSecurityCheck"
                :on-login="login"
            />
        </div>
        <div slot="footer" />
    </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import agLoginForm from '@/mixins/agLoginForm';
import slideVerification from '@/components/slideVerification';
import mobileContainer from '../../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        securityCheck: () => import(/* webpackChunkName: 'securityCheck' */'@/router/web/components/common/securityCheck'),
        slideVerification
    },
    mixins: [agLoginForm],
    props: {
        redirect: {
            type: String,
            default: '/mobile/agcenter'
        }
    },
    data() {
        return {
            headerConfig: {
                prev: true,
                onClick: () => { this.$router.back(); },
                hasClose: true,
                title: this.$text('S_AGENT_LOGIN', '代理登入')
            },
            depositStatus: false
        };
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            cdnDomain: 'getCdnDomain',
            siteConfig: 'getSiteConfig'
        }),
        mobileColor() {
            return this.$cookie.get('MOBILE_COLOR') || this.siteConfig.MOBILE_COLOR;
        },
        isSlideAble() {
            if (!this.username || !this.password) {
                return false;
            }

            return true;
        }
    },
    created() {
        this.username = localStorage.getItem('aglogin-username') || '';
        this.password = window.atob(localStorage.getItem('aglogin-password') || '');
        this.depositStatus = localStorage.getItem('aglogin-depositStatus') || false;
    },
    methods: {
        /**
         * 儲存帳號
         * @method onRemeberMe
         */
        onRemeberMe() {
            if (this.isBackEnd) {
                return;
            }

            if (!this.depositStatus) {
                localStorage.removeItem('aglogin-username');
                localStorage.removeItem('aglogin-password');
                localStorage.removeItem('aglogin-depositStatus');
                return;
            }

            localStorage.setItem('aglogin-username', this.username);
            localStorage.setItem('aglogin-password', window.btoa(this.password));
            localStorage.setItem('aglogin-depositStatus', this.depositStatus);
        },
        slideLogin(loginInfo) {
            this.loginCheck({ captcha_text: loginInfo.data }, loginInfo.slideFuc);
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
    z-index: 999;
}

.content {
    position: relative;
    margin: 194px auto 0;
    border-radius: 4px;
    background: #222;
    padding-bottom: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
    max-width: 340px;
    color: #FFF;
    font-size: 14px;
}

.title {
    margin-bottom: 16px;
    padding: 15px 20%;
    background: #493535;
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
        display: block;
        background-color: #56433C;
        border: none;
        border-radius: 8px;
        width: 100%;
        height: 40px;
        text-indent: 10px;
        outline: none;
        color: #FFF;

        &::-webkit-input-placeholder {
            color: #FFF;
        }
    }
}

.submit {
    margin: 0 auto;
    border-radius: 8px;
    background: #F2C925;
    width: 80%;
    height: 40px;
    line-height: 40px;
    color: #493535;
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
    color: #F94444;
}

.mask {
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    width: 100%;
    height: 100%;
}

// 藍紫色系
:global(.bluePurple) :local {
    .content {
        background: #1B1A44;

        .title {
            background: #6A69F5;
        }
    }

    .field input {
        background: #6A69F5;
    }

    .submit {
        background: #CE5CEF;
        color: #FFF;
    }

    .mask {
        background-color: rgba(0, 0, 0, 0.8);
    }
}
</style>
