<template>
    <ele1
        v-if="theme === 1"
        :is-show-pw-forget="isShowPwForget"
        :login-text="loginText"
        :prompt-status="promptStatus"
    />
</template>

<script>
export default {
    components: {
        ele1: () => import(/* webpackChunkName: 'ele1' */'./1')
    },
    props: {
        theme: {
            type: Number,
            default: null
        },
        isShowPwForget: {
            type: Boolean,
            default: false
        },
        loginText: {
            type: String,
            default: null
        },
        promptStatus: {
            type: Object,
            default: () => ({
                isShow: false,
                pid: ''
            })
        }
    }
};
</script>
