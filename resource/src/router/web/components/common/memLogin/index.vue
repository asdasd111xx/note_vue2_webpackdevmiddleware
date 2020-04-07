<template>
    <theme1
        v-if="theme === '1'"
        :class="commonClass"
        :sort="sort"
        :field="field"
        :text="finalText"
        :link="finalLink"
        :close-mem-login="closeMemLogin"
    />
</template>

<script>
export default {
    components: {
        theme1: () => import(/* webpackChunkName: 'theme1' */'./template/theme1')
    },
    props: {
        theme: {
            type: String,
            default: '1'
        },
        sort: {
            type: Array,
            default: () => ['username', 'password', 'captcha', 'forgetPw', 'submit', 'join']
        },
        text: {
            type: Object,
            default: () => ({})
        },
        link: {
            type: Object,
            default: () => ({})
        },
        closeMemLogin: {
            type: Function,
            default: null
        }
    },
    data() {
        return {
            commonClass: ['login-form', 'clearfix'],
            field: {
                username: { max: 20 },
                password: { max: 12 },
                captcha: { max: 4 }
            },
            finalLink: {
                forgetPw: false, // 忘記密碼
                join: false, // 加入會員
                ...this.link
            }
        };
    },
    computed: {
        finalText() {
            return {
                username: this.$t('S_ACCOUNT'),
                password: this.$t('S_PASSWORD'),
                captcha: this.$t('S_CHECK_CODE'),
                reloadPic: this.$t('S_RELOAD_PIC'),
                login: this.$t('S_LOGIN'),
                forgetPw: this.$t('S_PASSWORD_FORGET'),
                join: this.$t('S_FREE_MEMBER_OPEN'),
                line: '|',
                ...this.text
            };
        }
    }
};
</script>
