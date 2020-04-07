<template>
    <div :class="`normal-page join-wrap theme-${siteConfig.PWD_RESET_COLOR}`">
        <div class="join">
            <div v-if="hasTitle" class="join-title pwd">
                <div class="join-title-icon" />
                {{ $t('S_PASSWORD_RESET') }}
            </div>
            <div class="field-frame-wrap">
                <div
                    v-for="field in pwdResetInfo"
                    :key="field.key"
                    class="field-wrap"
                >
                    <div class="clearfix">
                        <label :for="field.key">
                            {{ $t(field.text) }}<span class="join-star">*</span>
                        </label>
                        <div class="field-right">
                            <input
                                :id="field.key"
                                :type="field.type"
                                :name="field.key"
                                class="join-input"
                                @input="verification($event.target.id, $event.target.value)"
                            />
                            <div class="pwd-reset-tip" />
                        </div>
                    </div>
                </div>
            </div>
            <div class="join-line" />
            <div class="join-btn-wrap pwd">
                <div class="join-btn" @click="pwdResetSubmit()">
                    {{ $t('S_JM_SURE_SEND') }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* global $ */
import { mapGetters, mapActions } from 'vuex';
import member from '@/api/member';
import agent from '@/api/agent';

export default {
    props: {
        hasTitle: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            pwdResetInfo: 'getPwdResetInfo',
            siteConfig: 'getSiteConfig'
        })
    },
    methods: {
        verification(id, value) {
            const data = this.pwdResetInfo[id];
            const re = new RegExp(data.regExp);
            const $tip = $(`#${data.key}`).parents('.field-wrap').children('.pwd-reset-tip');
            let msg = this.$t(data.errorMsg);

            if (id === 'username') {
                msg = this.$t(data.errorMsg).replace('%x', '4').replace('%y', '20');
            }
            if (id === 'password') {
                msg = this.$t(data.errorMsg).replace('%x', '6').replace('%y', '12');
            }
            if (Array.isArray(data.errorMsg)) {
                msg = `${this.$t(data.errorMsg[0])}，${this.$t(data.errorMsg[1])}`;
            }
            if (id === 'chkPwd' || id === 'email') {
                msg = this.$text(data.errorMsg, {
                    text: data.defaultErrMsg,
                    replace: [{
                        target: '%s', value: '<br/>'
                    }]
                });
            }

            if (!re.test(value)
               || (id === 'chkPwd' && (value !== $('#password').val() || value === ''))
               || (id === 'email' && (value.length < 12 || value.length > 100))
            ) {
                $tip.html(`✘ ${msg}`).show();
                if (value === '') {
                    $tip.html(`✘  ${this.$t('S_JM_FIELD_REQUIRE')}`).show();
                }
            } else {
                $tip.html('').hide();
            }
        },
        pwdResetSubmit() {
            for (let i = 0; i < $('.pwd-reset-input').length; i += 1) {
                const $tip = $('.pwd-reset-input').eq(i).parents('.field-wrap').children('.pwd-reset-tip');
                if ($tip.is(':visible')
                   || (($('.pwd-reset-input').eq(i).val() === '' || $('.pwd-reset-input').eq(i).val().replace(/(^\s*)|(\s*$)/g, '') === ''))) {
                    alert(this.$t('S_CHECK_FAIL'));
                    return;
                }
            }
            const pwdInfo = {
                username: $('#username').val(),
                new_password: $('#password').val(),
                confirm_password: $('#chkPwd').val(),
                email: $('#email').val(),
                keyring: this.$route.query.kr
            };
            if (this.$route.query.type === 'member') {
                member.pwdReset({
                    params: pwdInfo,
                    success: () => {
                        alert(this.$t('S_CR_SUCCESS'));

                        // For Moblie
                        if (this.$route.name === 'resetPwd') {
                            window.location.href = '/mobile';
                            return;
                        }

                        window.location.href = '/';
                        this.actionChangePage({ page: this.webInfo.pageData[this.webInfo.page[0].pid].pid, type: 'custom' });
                    }
                });
            }
            if (this.$route.query.type === 'agent') {
                agent.pwdReset({
                    params: pwdInfo,
                    success: () => {
                        alert(this.$t('S_CR_SUCCESS'));

                        // For Moblie
                        if (this.$route.name === 'resetPwd') {
                            window.location.href = '/mobile';
                            return;
                        }

                        window.location.href = '/';
                        this.actionChangePage({ page: this.webInfo.pageData[this.webInfo.page[0].pid].pid, type: 'custom' });
                    }
                });
            }
        },
        ...mapActions([
            'actionChangePage'
        ])
    }
};
</script>

<style lang="scss" src="@/css/page/join.scss" scoped></style>
