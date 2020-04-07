/* 忘記密碼 */
import agent from '@/api/agent';
import member from '@/api/member';
import joinMemInfo from '@/config/joinMemInfo';

export default {
    data() {
        return {
            username: '',
            email: '',
            msg: {
                username: '',
                email: ''
            }
        };
    },
    methods: {
        /**
         * 驗證使用者帳號
         * @method
         */
        validateUserName() {
            const reg = joinMemInfo.username.regExp;

            if (this.username === '') {
                this.msg.username = this.$text('S_JM_FIELD_REQUIRE', '该栏位不得为空');
                return;
            }

            if (!reg.test(this.username)) {
                this.msg.username = joinMemInfo.username.errorMsg;
                return;
            }

            this.msg.username = '';
        },
        /**
         * 驗證信箱格式
         * @method
         */
        validateEmail() {
            const reg = joinMemInfo.email.regExp;

            if (this.email === '') {
                this.msg.email = this.$text('S_JM_FIELD_REQUIRE', '该栏位不得为空');
                return;
            }

            if (!reg.test(this.email) || this.email.length < 12 || this.email.length > 100) {
                this.msg.email = joinMemInfo.email.errorMsg;
                return;
            }

            this.msg.email = '';
        },
        submit(type) {
            if (this.msg.username || this.msg.email) {
                alert(this.$t('S_CHECK_FAIL'));
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
        }
    }
};
