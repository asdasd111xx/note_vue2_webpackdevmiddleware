<template>
    <transition name="fade">
        <div class="agent-pwd-forget-wrap pop-class clearfix">
            <div
                v-if="memInfo.config.agent_login"
                class="pre"
                @click="actionSetPop({ type: 'agLogin' })"
            >
                <icon
                    name="arrow-left"
                    width="30"
                    height="30"
                />
            </div>
            <div :title="$t('S_PASSWORD_FORGET')" class="title">{{ $t('S_PASSWORD_FORGET') }}</div>
            <div class="content">
                <div class="cheader" />
                <div class="cbody">
                    <div class="field">
                        <input
                            v-model="username"
                            :title="$t('S_ACCOUNT')"
                            :placeholder="$t('S_ACCOUNT')"
                            type="text"
                            @input="verification('username')"
                        />
                        <div class="tip">{{ tips[0] }}</div>
                    </div>
                    <div class="field">
                        <input
                            v-model="email"
                            :title="$t('S_E_MAIL')"
                            :placeholder="$t('S_E_MAIL')"
                            type="text"
                            @input="verification('email')"
                        />
                        <!-- eslint-disable vue/no-v-html -->
                        <div class="tip" v-html="tips[1]" />
                        <!-- eslint-enable vue/no-v-html -->
                    </div>
                    <div class="submit" @click="pwdSubmit()">{{ $t('S_JM_SURE_SEND') }}</div>
                    <div class="text-msg">{{ $t('FORGET_PWD_MSG') }}</div>
                </div>
                <div class="cfooter" />
            </div>
        </div>
    </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import agent from '@/api/agent';
import joinMemInfo from '@/config/joinMemInfo';

export default {
    data() {
        return {
            fieldStatus: '',
            username: '',
            email: '',
            url: '',
            tips: []
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        })
    },
    methods: {
        ...mapActions([
            'actionSetPop'
        ]),
        verification(target) {
            const re = joinMemInfo[target].regExp;
            // 帳戶
            if (target === 'username') {
                if (!re.test(this.username)) {
                    this.tips[0] = this.$t('S_USERNAME_ERROR');
                    if (this.username === '') {
                        this.tips[0] = this.$t('S_JM_FIELD_REQUIRE');
                    }
                } else {
                    this.tips[0] = '';
                }
            }
            // 信箱
            if (target === 'email') {
                if (!re.test(this.email) || (target === 'email' && (this.email.length < 12 || this.email.length > 100))) {
                    this.tips[1] = this.$text('S_JM_EMAIL_FORMAT_UNAVAILABLE', {
                        text: 'E-mail 格式不正确',
                        replace: [{
                            target: '%s', value: '<br/>'
                        }]
                    });
                    if (this.email === '') {
                        this.tips[1] = this.$t('S_JM_FIELD_REQUIRE');
                    }
                } else {
                    this.tips[1] = '';
                }
            }
        },
        pwdSubmit() {
            if (this.tips[0] !== '' || this.tips[1] !== '') {
                alert(this.$t('S_CHECK_FAIL'));
                return;
            }
            const pwdInfo = {
                username: this.username,
                email: this.email,
                callback: this.url
            };
            agent.pwdForget({
                params: pwdInfo,
                success: (response) => {
                    if (response.result === 'ok') {
                        alert(this.$t('FORGET_PWD_SEND'));
                        this.actionSetPop();
                    }
                }
            });
        }
    }
};
</script>

<style lang="scss" src="../../../css/ag_pwd_forget/1/index.scss" scoped></style>
