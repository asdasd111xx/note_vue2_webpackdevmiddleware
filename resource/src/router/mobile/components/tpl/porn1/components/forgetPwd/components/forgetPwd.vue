<template>
    <div>
        <slot
            :msg="msg"
            :verification="verification"
            :send-email="sendEmail"
            :current-method="currentMethod"
            :change-current-method="changeCurrentMethod"
            :send="send"
        />
    </div>
</template>

<script>
import agent from '@/api/agent';
import member from '@/api/member';
import joinMemInfo from '@/config/joinMemInfo';

export default {
    props: {
        username: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        keyring: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        // eslint-disable-next-line vue/prop-name-casing
        confirm_password: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            currentMethod: 'phoneStatus1',
            resetKeyring: '',
            msg: {
                username: '',
                email: '',
                keyring: '',
                password: '',
                confirm_password: ''
            }
        };
    },
    watch: {
        currentMethod() {
            this.msg = {
                username: '',
                email: '',
                keyring: '',
                password: '',
                confirm_password: ''
            };
        }
    },
    methods: {
        verification(target) {
            const data = joinMemInfo[target];
            const re = data.regExp;
            const errormMsg = data.errorMsg;

            this.$nextTick(() => {
                if (!this[target]) {
                    this.msg[target] = this.$text('S_JM_FIELD_REQUIRE', '该栏位不得为空');
                    return;
                }
                if ((re && !re.test(this[target]))
                    || (target === 'confirm_password' && this.password !== this.confirm_password)
                    || (data.minimum && this[target].length < data.minimum)
                    || (data.maximum && this[target].length > data.maximum)
                ) {
                    this.msg[target] = errormMsg;
                    return;
                }

                this.msg[target] = '';
            });
        },
        sendEmail(type) {
            if (this.msg.username || this.msg.email) {
                alert(this.$text('S_CHECK_FAIL', '验证失败'));
                return;
            }

            const url = '/mobile/resetpwd';
            const data = {
                params: {
                    username: this.username,
                    email: this.email,
                    callback: url
                },
                success: (response) => {
                    if (response.result === 'ok') {
                        alert(this.$text('FORGET_PWD_SEND', '确认信已发送，请至信箱查看。'));
                    }
                }
            };

            // 忘記密碼 - 代理會員
            if (type === 'agent') {
                agent.pwdForget(data);
                return;
            }

            // 忘記密碼 - 會員
            member.pwdForget(data);
        },
        send(type) {
            if (this.currentMethod === 'phoneStatus1') {
                this.sendSms(type);
                return;
            }

            if (this.currentMethod === 'phoneStatus2') {
                this.verifySms(type);
                return;
            }

            this.resetPwd(type);
        },
        sendSms(type) {
            if (this.msg.username) {
                alert(this.$text('S_CHECK_FAIL', '验证失败'));
                return;
            }

            const data = {
                params: {
                    username: this.username
                },
                success: (response) => {
                    if (response.result === 'ok') {
                        this.currentMethod = 'phoneStatus2';
                    }
                }
            };

            // 忘記密碼發送簡訊 - 代理會員
            if (type === 'agent') {
                agent.pwdForgetMobile(data);
                return;
            }

            // 忘記密碼發送簡訊 - 會員
            member.pwdForgetMobile(data);
        },
        verifySms(type) {
            if (this.msg.keyring) {
                alert(this.$text('S_CHECK_FAIL', '验证失败'));
                return;
            }
            const data = {
                params: {
                    username: this.username,
                    keyring: this.keyring
                },
                success: (response) => {
                    if (response.result === 'ok') {
                        this.resetKeyring = response.ret.keyring;
                        this.currentMethod = 'phoneStatus3';
                    }
                },
                fail: () => {
                    this.msg.keyring = '';
                }
            };

            // 忘記密碼驗證簡訊 - 代理會員
            if (type === 'agent') {
                agent.pwdMobileVerify(data);
                return;
            }

            // 忘記密碼驗證簡訊 - 會員
            member.pwdMobileVerify(data);
        },
        resetPwd(type) {
            if (this.msg.password || this.msg.confirm_password) {
                alert(this.$text('S_CHECK_FAIL', '验证失败'));
                return;
            }

            const data = {
                params: {
                    username: this.username,
                    new_password: this.password,
                    confirm_password: this.confirm_password,
                    keyring: this.resetKeyring
                },
                success: (response) => {
                    if (response.result === 'ok') {
                        this.$router.push(`/mobile/${type === 'agent' ? 'aglogin' : 'login'}`);
                    }
                }
            };

            // 忘記密碼簡訊重設密碼 - 代理會員
            if (type === 'agent') {
                agent.pwdResetMobile(data);
                return;
            }

            // 忘記密碼簡訊重設密碼 - 會員
            member.pwdResetMobile(data);
        },
        changeCurrentMethod(method) {
            this.currentMethod = method;
        }
    }
};
</script>
