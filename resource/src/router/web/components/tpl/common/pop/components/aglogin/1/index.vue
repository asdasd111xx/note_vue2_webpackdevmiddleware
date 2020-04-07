<template>
    <transition name="fade">
        <div>
            <div v-show="!checkItem" class="ag-login-wrap pop-class">
                <div class="close-btn" @click="actionSetPop()">×</div>
                <div :class="['title', curLang]" />
                <div class="content">
                    <div class="cheader" />
                    <div class="cbody">
                        <div class="field">
                            <input
                                v-model="username"
                                :placeholder="$t('S_ACCOUNT')"
                                type="text"
                                tabindex="5"
                                @keydown.13="loginCheck"
                            />
                        </div>
                        <div class="field password">
                            <input
                                v-model="password"
                                :placeholder="$t('S_PASSWORD')"
                                type="password"
                                tabindex="6"
                                @keydown.13="loginCheck"
                            />
                        </div>
                        <div class="field captcha">
                            <input
                                v-model="captcha"
                                :placeholder="$t('S_CHECK_CODE')"
                                type="text"
                                maxlength="4"
                                tabindex="7"
                                @focus="getCaptcha"
                                @keydown.13="loginCheck"
                            />
                            <img
                                v-if="captchaImg"
                                :src="captchaImg"
                                height="40"
                                @click="getCaptcha"
                            />
                        </div>
                        <div class="submit-btn" @click="loginCheck">{{ $t('S_JM_SURE_SEND') }}</div>
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
    </transition>
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

<style lang="scss" src="../../../css/aglogin/1/index.scss" scoped></style>
