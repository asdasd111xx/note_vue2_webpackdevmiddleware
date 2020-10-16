import { mapActions, mapGetters } from 'vuex';

import { API_FIRST_LEVEL_REGISTER } from '@/config/api';
import ajax from '@/lib/ajax';
import isMobile from '@/lib/is_mobile';

export default {
    provide() {
        return {
            $validator: this.$validator
        };
    },
    data() {
        return {
            isShow: false,
            allInput: ['username', 'password', 'confirm_password', 'name'],
            allText: {
                // 會員帳號
                username: {
                    type: 'text',
                    maxLength: '20',
                    placeholder: 'S_NAME',
                    tips: 'S_USERNAME_ERROR',
                    message: '',
                    error: false
                },
                // 密碼
                password: {
                    type: 'password',
                    maxLength: '12',
                    placeholder: 'SS_LOGIN_PW',
                    tips: 'S_PASSWORD_ERROR',
                    message: '',
                    error: false
                },
                // 確認密碼
                confirm_password: {
                    type: 'password',
                    maxLength: '12',
                    placeholder: 'S_PWD_CONFIRM',
                    tips: 'S_JM_PASSWD_CONFIRM_ERROR',
                    message: '',
                    error: false
                },
                // 會員姓名
                name: {
                    type: 'text',
                    maxLength: '',
                    placeholder: 'S_MEMBER_NAME',
                    tips: 'S_NO_SYMBOL_DIGIT_CHEN',
                    message: 'S_REGISTER_TIPS',
                    error: false
                }
            },
            allValue: {
                username: '',
                password: '',
                confirm_password: '',
                name: '',
                //驗證碼
                captcha: ''
            },
            msg: ''
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        })
    },
    methods: {
        ...mapActions([
            'actionSetGlobalMessage',
            'actionVerificationFormData'
        ]),

        /**
         * 取得 Class
         * @method mainClass
         * @param {String} key - 欄位名稱
         * @returns {Object} Class Object
         */
        mainClass(key) {
            return {
                [this.$style.tips]: this.allText[key].tips,
                [this.$style.message]: this.allText[key].message,
                [this.$style.error]: this.allText[key].error
            };
        },
        /**
         * 輸入驗證
         * @method onInput
         * @param {String} value - 值
         * @param {String} key - 欄位名稱
         */
        onInput(value, key) {
            const { allValue, allText } = this;
            const reg = {
                username: /^[a-z1-9][a-z0-9]{3,19}$/,
                password: /^[a-z0-9._\-!@#$&*+=|]{6,12}$/,
                confirm_password: /^[a-z0-9._\-!@#$&*+=|]{6,12}$/,
            };
            if (key === "username" || key === "password" || key === "confirm_password" || key === "name") {
                this.actionVerificationFormData({ target: key, value: value }).then((val => {
                    allValue[key] = val;
                    if (reg[key] && !reg[key].test(allValue[key])) {
                        allText[key].error = true;
                        return;
                    }
                }));
            }

            if (['password', 'confirm_password'].includes(key)) {
                if (allValue.confirm_password) {
                    allText.password.error = false;
                    allText.confirm_password.error = allValue.password !== allValue.confirm_password;
                    return;
                }

                allText.password.error = false;
                return;
            }

            allText[key].error = false;
        },
        /**
         * 註冊
         * @method onSubmit
         */
        onSubmit() {
            // 廳主未開放註冊
            if (!this.memInfo.config.infinity_register) {
                return;
            }

            this.$validator.validateAll('form-page').then((response) => {
                if (!response) {
                    this.msg = this.$text('S_JM_MSG_COMPLETE');
                    Object.keys(this.allValue).forEach((key) => {
                        if (this.allValue[key]) {
                            return;
                        }

                        this.allText[key].error = true;
                    });
                    return;
                }

                if (this.allInput.some((key) => this.allText[key].error)) {
                    return;
                }

                if (this.allValue.password !== this.allValue.confirm_password) {
                    return;
                }

                ajax({
                    method: 'post',
                    url: API_FIRST_LEVEL_REGISTER,
                    errorAlert: false,
                    params: {
                        ...this.allValue,
                        code: this.agentCode,
                        created_by: 2
                    },
                    success: ({ result }) => {
                        if (result !== 'ok') {
                            return;
                        }

                        this.msg = this.$text('S_CREATE_SECCESS', '新增成功');

                        if (isMobile()) {
                            this.allValue = {
                                username: '',
                                password: '',
                                confirm_password: '',
                                name: ''
                            };
                            this.isShow = false;

                            return;
                        }

                        this.$emit('close');
                    },
                    fail: ({ data }) => {
                        if (data.errors) {
                            if (data.errors.username) {
                                this.msg = this.$text(data.errors.username);
                                return;
                            }

                            if (data.errors.password) {
                                this.msg = this.$text(data.errors.password);
                                return;
                            }

                            if (data.errors.confirm_password) {
                                this.msg = this.$text(data.errors.confirm_password);
                                return;
                            }

                            this.msg = this.$text(data.errors.name);
                            return;
                        }

                        this.msg = this.$text(data.msg);
                    }
                });
            });
        },
        onShowPassword() {
            let curType = document.querySelector(`input[data-key="password"]`).type;
            document.querySelector(`input[data-key="password"]`).type = curType === 'password' ? 'text' : 'password';
            document.querySelector(`input[data-key="confirm_password"]`).type = curType === 'password' ? 'text' : 'password';
        }
    }
};
