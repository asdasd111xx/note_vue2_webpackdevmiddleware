<template>
    <transition name="fade">
        <div class="member-pwd-forget-wrap clearfix">
            <div class="title-icon" />
            <div class="close-icon" @click="actionSetPop()" />
            <div :title="$t('S_PASSWORD_FORGET')" class="title">
                {{ $t('S_PASSWORD_FORGET') }}
            </div>
            <div class="field-wrap">
                <div class="field-input-wrap field-username">
                    <input
                        v-model="username"
                        :title="$t('S_ACCOUNT')"
                        :placeholder="$t('S_ACCOUNT')"
                        :class="username ? '' : 'notext-input'"
                        type="text"
                        @input="verification('username')"
                    />
                </div>
                <div class="tip">{{ tips.username }}</div>
            </div>
            <div class="field-wrap">
                <div class="field-input-wrap field-email">
                    <input
                        v-model="email"
                        :title="$t('S_E_MAIL')"
                        :placeholder="$t('S_E_MAIL')"
                        :class="email ? '' : 'notext-input'"
                        type="text"
                        @input="verification('email')"
                    />
                </div>
                <div class="tip">{{ tips.email }}</div>
            </div>
            <div class="submit" @click="pwdSubmit()">{{ $t('S_JM_SURE_SEND') }}</div>
            <div class="text-msg">{{ $t('FORGET_PWD_MSG') }}</div>
        </div>
    </transition>
</template>

<script>
import { mapActions } from 'vuex';
import member from '@/api/member';
import joinMemInfo from '@/config/joinMemInfo';

export default {
    data() {
        return {
            fieldStatus: '',
            username: '',
            email: '',
            tips: {}
        };
    },
    methods: {
        ...mapActions([
            'actionSetPop'
        ]),
        verification(target) {
            const re = joinMemInfo[target].regExp;

            if (!this[target]) {
                this.tips[target] = this.$t('S_JM_FIELD_REQUIRE');
                return;
            }

            // 帳戶
            if (target === 'username' && !re.test(this.username)) {
                this.tips[target] = this.$t('S_USERNAME_ERROR');
                return;
            }

            // 信箱
            if (target === 'email') {
                if (!re.test(this.email) || (this.email.length < 12 || this.email.length > 100)) {
                    this.tips[target] = this.$text('S_JM_EMAIL_FORMAT_UNAVAILABLE', {
                        text: 'E-mail 格式不正确',
                        replace: [{
                            target: '%s', value: '<br/>'
                        }]
                    });
                    return;
                }
            }
            this.tips[target] = '';
        },
        pwdSubmit() {
            if (this.tips.username !== '' || this.tips.email !== '') {
                alert(this.$t('S_CHECK_FAIL'));
                return;
            }

            const pwdInfo = {
                username: this.username,
                email: this.email,
                callback: `${window.location.host}/?page=pwdreset&type=member&kr=`
            };

            member.pwdForget({
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

<style lang="scss" src="../../../css/mem_pwd_forget/519/index.scss" scoped></style>
