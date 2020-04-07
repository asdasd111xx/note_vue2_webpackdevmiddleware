<template>
    <div :class="$style['login-wrap']">
        <div :class="$style['login-logo']" @click="$router.push('/mobile')" />
        <div :class="[$style['login-cotainer'], 'clearfix']">
            <div :class="$style['login-register']" @click="$router.push('/mobile/login')">
                <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/login/username.png')" :class="$style.icon" />
                <span>{{ $text('S_BACK_TO_LOGIN', '返回登录') }}</span>
            </div>
            <div :class="$style['login-main']">
                <div :class="$style['login-header']">{{ $text('S_REGISTER', '注册') }}</div>
                <join-member :theme="$style">
                    <template slot="join-header" />
                </join-member>
            </div>
        </div>
    </div>
</template>

<script>
import joinMember from '@/router/web/components/page/join_member';

export default {
    components: {
        joinMember
    }
};
</script>

<style lang="scss" src="../css/index.module.scss" module></style>
