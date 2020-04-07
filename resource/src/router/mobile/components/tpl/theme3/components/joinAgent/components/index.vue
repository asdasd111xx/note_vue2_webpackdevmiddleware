<template>
    <div :class="$style['login-wrap']">
        <div :class="$style['login-logo']" @click="$router.push('/mobile')" />
        <div :class="[$style['login-cotainer'], 'clearfix']">
            <div :class="$style['login-register']">
                <div :class="$style['form-item']" @click="$router.push('/mobile/agLogin')">
                    <img :src="$getCdnPath('/static/image/mobile/tpl/theme3/login/username.png')" :class="$style.icon" />
                    <span>{{ $text('S_BACK_TO_LOGIN', '返回登录') }}</span>
                </div>
            </div>
            <div :class="$style['login-main']">
                <div :class="$style['login-header']">{{ $text('S_AGENT_LOGIN', '代理登入') }}</div>
                <join-agent :theme="$style" :has-title="false">
                    <template slot="join-header" />
                </join-agent>
            </div>
        </div>
    </div>
</template>

<script>
import joinAgent from '@/router/web/components/page/join_agent';

export default {
    components: {
        joinAgent
    }
};
</script>


<style lang="scss" src="../css/index.module.scss" module />
