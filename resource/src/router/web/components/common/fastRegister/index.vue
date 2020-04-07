<template>
    <fast-register
        :template="template"
        :theme="theme"
        :field="field"
        :text="finalText"
        :on-close="onClose"
    />
</template>

<script>
import fastRegister from './fastRegister';

export default {
    components: {
        fastRegister
    },
    props: {
        template: {
            type: String,
            default: '1'
        },
        text: {
            type: Object,
            default: () => ({})
        },
        theme: {
            type: Object,
            default: () => ({})
        },
        onClose: {
            type: Function,
            default: () => ({})
        }
    },
    data() {
        return {
            field: {
                username: { max: 20 },
                password: { max: 12 },
                captcha_text: { max: 4 }
            },
            finalText: {
                username: this.$t('S_ACCOUNT'),
                password: this.$t('S_PASSWORD'),
                confirm_password: this.$t('S_PWD_CONFIRM'),
                captcha_text: this.$t('S_CHECK_CODE'),
                reloadPic: this.$t('S_RELOAD_PIC'),
                join: this.$t('S_REGISTER'),
                ...this.text
            }
        };
    }
};
</script>
