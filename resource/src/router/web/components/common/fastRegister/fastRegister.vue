<template>
    <component
        :is="templateName"
        :theme="theme"
        :field="field"
        :text="text"
        :field-value.sync="fieldValue"
        :error-msg="errorMsg"
        :on-submit="onRegister"
        :on-close="onClose"
    >
        <template slot="title-icon">
            <slot name="title-icon" />
        </template>
        <template slot="close-icon">
            <slot name="close-icon" />
        </template>
    </component>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import member from '@/api/member';
import joinMemInfo from '@/config/joinMemInfo';

export default {
    components: {
        template1: () => import(/* webpackChunkName: 'template1' */'./template/template1'),
        template2: () => import(/* webpackChunkName: 'template2' */'./template/template2')
    },
    props: {
        template: {
            type: String,
            required: true
        },
        theme: {
            type: Object,
            required: true
        },
        field: {
            type: Object,
            required: true
        },
        text: {
            type: Object,
            required: true
        },
        onClose: {
            type: Function,
            required: true
        }
    },
    data() {
        const fields = {
            username: '',
            password: '',
            confirm_password: '',
            captcha_text: ''
        };
        return {
            fieldValue: { ...fields },
            errorMsg: { ...fields }
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        templateName() {
            return `template${this.template}`;
        }
    },
    watch: {
        fieldValue() {
            /* 欄位為空 */
            // if (this.fieldValue[fieldName] === '') {
            //     this.errorMsg[fieldName] = this.$t('S_JM_FIELD_REQUIRE');
            //     return;
            // }
            const msg = {};

            Object.keys(this.errorMsg).forEach((fieldName) => {
                if (this.fieldValue[fieldName] === '') {
                    return;
                }

                /* 全部驗證 */
                if (joinMemInfo[fieldName].regExp && !joinMemInfo[fieldName].regExp.test(this.fieldValue[fieldName])) {
                    msg[fieldName] = this.$t(joinMemInfo[fieldName].errorMsg);
                    return;
                }

                /* 密碼與確認密碼驗證 */
                if (fieldName === 'confirm_password' && this.fieldValue.password !== this.fieldValue.confirm_password) {
                    msg[fieldName] = this.$text('S_PASSWD_CONFIRM_ERROR', '确认密码预设要跟密码一致');
                    return;
                }

                msg[fieldName] = '';
            });

            this.errorMsg = {
                ...this.errorMsg,
                ...msg
            };
        }
    },
    methods: {
        ...mapActions([
            'actionSetUserBalance',
            'actionChangePage'
        ]),
        /**
         * 註冊
         * @method onRegister
         */
        onRegister(registerInfo) {
            let checkResult = true;
            const slideField = this.memInfo.config.register_captcha_type === 2 ? Object.keys(this.fieldValue).filter((key) => key !== 'captcha_text') : this.fieldValue;

            slideField.forEach((fieldName) => {
                if (!this.fieldValue[fieldName] || this.errorMsg[fieldName]) {
                    checkResult = false;
                }
            });

            if (this.memInfo.config.register_captcha_type === 2) {
                this.fieldValue.captcha_text = registerInfo.data;
            }

            if (!checkResult) {
                alert(this.$t('S_JM_MSG_COMPLETE'));
                this.fieldValue.captcha_text = '';
                return;
            }

            member.join({
                params: {
                    ...this.fieldValue,
                    speedy: true
                }
            }).then((response) => {
                if (response && response.result === 'ok') {
                    alert(this.$t('S_CR_SUCCESS'));

                    // GA流量統計
                    window.dataLayer.push({
                        dep: 2,
                        event: 'ga_click',
                        eventCategory: 'sign_up',
                        eventAction: 'sign_up',
                        eventLabel: 'sign_up',
                        ga_hall_id: 3820325,
                        ga_domain_id: this.memInfo.user.domain
                    });

                    window.location.reload();
                    return;
                }

                const msg = {};

                Object.keys(response.errors).forEach((key) => {
                    msg[key] = response.errors[key];
                });

                this.errorMsg = {
                    ...this.errorMsg,
                    ...msg
                };

                registerInfo.slideFuc.reset();
                this.fieldValue.captcha_text = '';
            });
        }
    }
};
</script>
