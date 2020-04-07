<template>
    <div class="forget-pwd-wrap">
        <div class="forget-pwd-unit">
            <input
                v-model="username"
                :placeholder="$t('S_ACCOUNT')"
                type="text"
                @input="validateUserName"
            />
            <div v-if="msg.username !== ''" class="tip">{{ msg.username }}</div>
        </div>
        <div class="forget-pwd-unit">
            <input
                v-model="email"
                :placeholder="$t('S_E_MAIL')"
                type="text"
                @input="validateEmail"
            />
            <!-- eslint-disable vue/no-v-html -->
            <div
                v-if="msg.email !== ''"
                class="tip"
                v-html="msg.email"
            />
            <!-- eslint-enable vue/no-v-html -->
        </div>
        <div class="forget-pwd-submit" @click="submit($route.params.type)">{{ $t('S_JM_SURE_SEND') }}</div>
        <div class="forget-pwd-msg">{{ $t('FORGET_PWD_MSG') }}</div>
    </div>
</template>

<script>
import forgetPwd from '@/mixins/forgetPwd';

export default {
    mixins: [forgetPwd]
};
</script>

<style lang="scss" src="../css/index.scss" scoped></style>
