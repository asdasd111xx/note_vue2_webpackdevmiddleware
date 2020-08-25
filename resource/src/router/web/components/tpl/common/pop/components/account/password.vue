<template>
    <div>
        <div
            v-for="(item, index) in allField"
            :key="index"
            class="account-pop-field main-input"
        >
            <div class="pwd-field clearfix">
                <input
                    v-model="item.value"
                    :title="$t(item.text)"
                    :placeholder="$t(item.text)"
                    class="pwd-input"
                    type="password"
                    name="password"
                    @input="verification(index)"
                />
            </div>
            <!-- eslint-disable vue/no-v-html -->
            <div class="pwd-tip" v-html="item.tip" />
            <!-- eslint-enable vue/no-v-html -->
        </div>
        <div class="account-pop-btn" @click="pwdSubmit()">{{ $t('S_JM_SURE_SEND') }}</div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import mcenter from '@/api/mcenter';
import agcenter from '@/api/agcenter';

export default {
    props: {
        select: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            allField: {
                oldPwd: {
                    value: '',
                    text: 'S_OLD_PWD',
                    tip: ''
                },
                newPwd: {
                    value: '',
                    text: 'S_NEW_PWD',
                    tip: ''
                },
                confirmPwd: {
                    value: '',
                    text: 'S_CHK_PWD',
                    tip: ''
                }
            }
        };
    },
    methods: {
        verification(key) {
            const re = new RegExp(/^[a-z0-9._\-!@#$&*+=|]{6,12}$/);

            // 新密碼不符合格式
            if (key === 'newPwd' && !re.test(this.allField.newPwd.value)) {
                this.allField.newPwd.tip = this.$t('S_PASSWORD_ERROR');
            }

            if (this.allField[key].value === '') {
                this.allField[key].tip = this.$t('S_JM_FIELD_REQUIRE');
                return;
            }

            this.allField[key].tip = '';

            // 新密碼或確認新密碼有異動,且確認新密碼不為空
            if ((key === 'newPwd' || key === 'confirmPwd') && this.allField.confirmPwd.value !== '') {
                if (this.allField.newPwd.value !== this.allField.confirmPwd.value) {
                    this.allField.confirmPwd.tip = this.$text('S_JM_PASSWD_CONFIRM_ERROR', {
                        text: '确认密码错误，请重新输入',
                        replace: [{
                            target: '%s', value: '<br/>'
                        }]
                    });
                } else {
                    this.allField.confirmPwd.tip = '';
                }
            }
        },
        pwdSubmit() {
            this.checkFail = false;

            Object.keys(this.allField).forEach((index) => {
                if (this.allField[index].tip
                    || !this.allField[index].value
                    || this.allField[index].value.replace(/(^\s*)|(\s*$)/g, '') === ''
                ) {
                    this.checkFail = true;
                }
            });

            if (this.checkFail) {
                alert(this.$t('S_CHECK_FAIL'));
                return;
            }

            let apiSelect;
            if (this.select.position === 'member') {
                apiSelect = mcenter;
            } else {
                apiSelect = agcenter;
            }

            apiSelect.accountPassword({
                params: {
                    old_password: this.allField.oldPwd.value,
                    new_password: this.allField.newPwd.value,
                    confirm_password: this.allField.confirmPwd.value
                },
                success: () => {
                    alert(this.$t('S_EDIT_SUCCESS'));
                    this.actionSetPop();
                    if (this.select.position === 'member') {
                        this.actionSetUserdata(true);
                        window.location.reload();
                    } else {
                        this.actionSetAgentdata(true);
                    }
                }
            });
        },
        ...mapActions([
            'actionSetPop',
            'actionSetUserdata',
            'actionSetAgentdata'
        ])
    }
};
</script>
