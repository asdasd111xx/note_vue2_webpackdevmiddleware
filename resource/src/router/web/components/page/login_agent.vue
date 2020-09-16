<template>
    <div class="ag-login-wrap">
        <div v-show="!checkItem" class="ag-login-container pop-class">
            <div class="title">
                {{ $text('S_LOGIN', '登入') }}
            </div>
            <div class="content">
                <div class="cheader" />
                <div class="cbody">
                    <div class="field">
                        <input
                            v-model="username"
                            :placeholder="$t('S_ACCOUNT')"
                            type="text"
                            tabindex="5"
                            @keydown.13="submitCheck"
                        />
                    </div>
                    <div class="field password">
                        <input
                            v-model="password"
                            :placeholder="$t('S_PASSWORD')"
                            type="password"
                            tabindex="6"
                            @keydown.13="submitCheck"
                        />
                    </div>
                    <div v-if="memInfo.config.login_captcha_type === constants.CAPTCHA_GRAPH" class="field captcha">
                        <input
                            ref="login-captcha"
                            v-model="captcha"
                            :placeholder="$t('S_CHECK_CODE')"
                            type="text"
                            maxlength="4"
                            tabindex="7"
                            @keydown.13="submitCheck"
                        />
                        <img
                            v-if="captchaImg"
                            :src="captchaImg"
                            class="captcha-img"
                            @click="clickCaptcha"
                        />
                        <div class="redo-wrap" @click="clickCaptcha">
                            <icon class="captcha-reform" name="redo-alt" />
                        </div>
                    </div>
                    <div v-if="memInfo.config.login_captcha_type === constants.CAPTCHA_SLIDE" class="slide-field">
                        <!-- 滑動驗證 -->
                        <slide-verification
                            :is-enable="isSlideAble"
                            :success-fuc="externalLogin"
                            :page-status="`login`"
                            class="slide-verification-wrap"
                        />
                    </div>
                    <div
                        v-else
                        class="submit-btn"
                        @click="submitCheck"
                    >
                        {{ $t('S_JM_SURE_SEND') }}
                    </div>
                    <div class="forgetpwd-btn" @click="actionSetPop({ type: 'agPwdForget' })">{{ $t('S_PASSWORD_FORGET') }}</div>
                </div>
                <div class="cfooter">
                    <div
                        v-if="memInfo.config.agent_register"
                        class="join-btn"
                        @click="actionChangePage({ page: 'joinAgent', type: '' });actionSetPop()"
                    >
                        {{ $t('S_CEP_JOINAGENT') }}
                    </div>
                </div>
            </div>
        </div>
        <security-check
            v-if="checkItem"
            :check-item.sync="checkItem"
            :on-login="login"
            tpl="template2"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import agLoginForm from '@/mixins/agLoginForm';

export default {
    components: {
        securityCheck: () => import(/* webpackChunkName: 'securityCheck' */'@/router/web/components/common/securityCheck')
    },
    mixins: [agLoginForm],
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        })
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionSetPop'
        ])
    }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";

.slide-verification-wrap {
    background: #E8E8E8;
}

.ag-login-wrap {
    padding-top: 180px;
    height: 100%;
    background: #2B2E39;
}

.ag-login-container {
    position: relative;
    width: 98%;
    max-width: 430px;
    margin: 0 auto;
    padding: 50px 0;
    background: url('/static/image/agent/agcenter_login_bg.png') 50% 0 repeat-y;
    color: #000;
    background: #FFF;
    text-align: center;
    .close-btn {
        position: absolute;
        top: 15px;
        right: 15px;
        width: 30px;
        height: 30px;
        line-height: 30px;
        font-size: 60px;
        font-family: initial;
        color: #8190AA;
        cursor: pointer;
        transition: all .3s ease;
        &:hover {
            transform:rotate(90deg);
        }
    }
    .title {
        margin: 0 auto 35px;
        width: 190px;
        height: 70px;
        line-height: 70px;
        font-size: 36px;
        color: #2B2E39;
    }
    .content {
        margin: 0 auto;
        width: 277px;
    }
    .cheader {
        background: url('/static/image/agent/agcenter_login_top.png') 50% 0 no-repeat;
        height: 73px;
    }
    .cbody {
        padding: 20px 0;
        background: url('/static/image/agent/agcenter_login_body_y.png') 50% 0 repeat-y;
        .slide-field {
            width: 82%;
            height: 40px;
            line-height: 40px;
            margin: 0 auto;
        }
        .field {
            position: relative;
            margin: 0 auto;
            padding: 0 10px;
            width: 82%;
            height: 40px;
            line-height: 40px;
            border-bottom: 1px solid #EDEDED;

            input {
                display: block;
                border: none;
                background: transparent;
                width: 100%;
                height: 40px;
                line-height: 40px;
                color: #313F52;
                font-size: 16px;
                outline: none;

                &::-webkit-input-placeholder { /* Chrome/Opera/Safari */
                    color: #999;
                }
                &::placeholder {
                    color: #999;
                }
            }
            &.password {
                margin: 20px auto;
            }
            &.captcha {
                margin-bottom: 40px;
            }
        }
    }
    .redo-wrap {
        position: absolute;
        top: 12px;
        right: 4px;
    }
    .captcha-reform {
        display: block;
        width: 16px;
        height: 16px;
        color: #000;
        cursor: pointer;
    }
    .captcha-img {
        position: absolute;
        top: 0;
        right: 25px;
        height: 40px;
        background: #F3F3F3;
        cursor: pointer;
    }
    .submit-btn {
        margin: 0 auto;
        padding: 0 20px;
        background: url('/static/image/agent/agcenter_login_btn.png') 50% 0 no-repeat;
        width: 202px;
        height: 72px;
        line-height: 72px;
        color: #2B2E39;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
            color: #FF8989;
        }
    }
    .forgetpwd-btn {
        margin: 10px auto;
        width: 182px;
        cursor: pointer;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        &:hover {
            color: #FF8989;
            text-decoration: underline;
        }
    }
    .cfooter {
        position: relative;
        top: -5px;
        background: url('/static/image/agent/agcenter_login_bottom.png') 50% 100% no-repeat;
        height: 55px;
    }
    .join-btn {
        display: inline-block;
        margin: 0 auto;
        max-width: 180px;
        height: 48px;
        line-height: 48px;
        color: #2B2E39;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        cursor: pointer;
        &:hover {
            color: #FF8989;
        }
    }
}
</style>
