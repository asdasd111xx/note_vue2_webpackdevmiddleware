<template>
    <div>
        <slot
            :old-email="oldEmail"
            :new-email="newEmail"
            :check-code="checkCode"
            :send-btn="sendBtn"
            :countdown-sec="countdownSec"
            :on-send="onSend"
            :on-submit="onSubmit"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import member from '@/api/member';
import mcenter from '@/api/mcenter';

export default {
    props: {
        info: {
            type: Object,
            required: true
        },
        oldValue: {
            type: String,
            required: true
        },
        newValue: {
            type: String,
            required: true
        },
        codeValue: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            timer: '',
            countdownSec: 0
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        fieldValue() {
            return this.memInfo.email.email;
        },
        oldEmail() {
            return {
                label: this.$text('S_ORIGINAL_EMAIL'),
                isShow: this.fieldValue && this.info.status === 'already'
            };
        },
        newEmail() {
            return {
                label: this.fieldValue && this.info.status === 'already'
                    ? this.$text('S_NEW_EMAIL')
                    : this.$text('SS_E_MAIL'),
                isShow: true
            };
        },
        checkCode() {
            return {
                label: this.$text('S_CHECK_CODE'),
                isShow: this.info.verification
            };
        },
        sendBtn() {
            return {
                label: this.countdownSec
                    ? this.$text('S_SEND_CHECK_CODE_ALREADY')
                    : this.$text('S_SEND_CHECK_CODE'),
                isShow: this.info.verification,
                countdownSec: this.countdownSec
            };
        }
    },
    created() {
        // 取驗證倒數秒數
        member.joinConfig({
            success: (response) => {
                // 從舊版複製過來，不良的寫法，後續再優化
                this.info.verification = response.ret.email.code;

                if (response.ret.email.code) {
                    mcenter.accountMailSec({
                        success: (data) => {
                            if (data.ret > 0) {
                                this.countdownSec = data.ret;
                                this.locker();
                            }
                        }
                    });
                }
            }
        });
    },
    methods: {
        ...mapActions(['actionSetUserdata']),
        locker() {
            if (this.countdownSec === 0) {
                this.countdownSec = 30;
            }

            this.timer = setInterval(() => {
                if (this.countdownSec === 0) {
                    clearInterval(this.timer);
                    return;
                }
                this.countdownSec -= 1;
            }, 1000);
        },
        onSend() {
            if (this.countdownSec) {
                return Promise.resolve({ status: false });
            }

            const getOldEmail = () => {
                if (this.fieldValue) {
                    return this.info.status === 'ok' ? this.newValue : this.oldValue;
                }

                return '';
            };

            const result = {
                status: false,
                msg: ''
            };

            return mcenter.accountMailSend({
                params: {
                    old_email: getOldEmail(),
                    email: this.newValue
                },
                success: () => {
                    this.actionSetUserdata(true);
                    this.locker();
                    result.status = true;
                    result.msg = this.$text('S_SEND_CHECK_CODE_MAIL');
                }
            }).then(() => result).catch(() => result);
        },
        onSubmit() {
            const result = {
                status: false,
                msg: ''
            };

            // 驗證信箱
            if (this.info.verification) {
                return mcenter.accountMailCheck({
                    params: {
                        email: this.newValue,
                        keyring: this.codeValue
                    },
                    success: () => {
                        this.actionSetUserdata(true);
                        result.status = true;
                        result.msg = this.$text('S_CR_SUCCESS');
                    }
                }).then(() => result).catch(() => result);
            }

            // 不驗證直接設定信箱
            return mcenter.accountMailEdit({
                params: {
                    email: this.newValue
                },
                success: () => {
                    this.actionSetUserdata(true);
                    result.status = true;
                    result.message(this.$text('S_EDIT_SUCCESS'));
                }
            }).then(() => result).catch(() => result);
        }
    }
};
</script>
