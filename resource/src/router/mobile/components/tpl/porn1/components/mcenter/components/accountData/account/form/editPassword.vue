<template>
    <div>
        <slot
            :tip="tip"
            :on-input="onInput"
            :on-submit="onSubmit"
        />
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import mcenter from '@/api/mcenter';

export default {
    props: {
        oldPw: {
            type: String,
            required: true
        },
        newPw: {
            type: String,
            required: true
        },
        confirmPw: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            tip: {
                oldPw: '',
                newPw: '',
                confirmPw: ''
            }
        };
    },
    methods: {
        ...mapActions(['actionSetUserdata']),
        onInput(e, target) {
            this.$emit(`update:${target}`, e.target.value);

            this.$nextTick(() => {
                const re = new RegExp(/^[a-z0-9._\-!@#$&*+=|]{6,12}$/);

                // 新密碼不符合格式
                if (target === 'newPw' && !re.test(this[target])) {
                    this.tip[target] = this.$text('S_PASSWORD_ERROR');
                    return;
                }

                if (this[target] === '') {
                    this.tip[target] = this.$t('S_JM_FIELD_REQUIRE');
                    return;
                }

                this.tip[target] = '';

                if (target === 'oldPw') {
                    return;
                }

                // 新密碼或確認新密碼有異動,且確認新密碼不為空
                if (this.confirmPw !== '' && (this.newPw !== this.confirmPw)) {
                    this.tip.confirmPw = this.$text('S_JM_PASSWD_CONFIRM_ERROR', {
                        text: '确认密码错误，请重新输入',
                        replace: [{
                            target: '%s', value: '<br/>'
                        }]
                    });
                    return;
                }
                this.tip.confirmPw = '';
            });
        },
        onSubmit() {
            let hasError = false;

            ['oldPw', 'newPw', 'confirmPw'].forEach((fieldName) => {
                if (this.tip[fieldName] || !this[fieldName] || this[fieldName].replace(/(^\s*)|(\s*$)/g, '') === '') {
                    hasError = true;
                }
            });

            if (hasError) {
                alert(this.$t('S_CHECK_FAIL'));
                return Promise.resolve('error');
            }

            return mcenter.accountPassword({
                params: {
                    old_password: this.oldPw,
                    new_password: this.newPw,
                    confirm_password: this.confirmPw
                },
                success: () => {
                    alert(this.$t('S_EDIT_SUCCESS'));
                    this.actionSetUserdata(true);
                    window.location.reload();
                }
            });
        }
    }
};
</script>
