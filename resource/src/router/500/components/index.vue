<template>
    <div class="error500">
        <div class="image">
            <img :src="$getCdnPath('/static/image/500error.png')" />
            <img :src="$getCdnPath('/static/image/oops.png')" class="oops" />
        </div>
        <div class="text">{{ $text('ROUTER_500_TEXT', { text: '内部伺服器错误' }) }}</div>
    </div>
</template>

<script>
import Vue from 'vue';
import member from '@/api/member';
import getLang from '@/lib/getLang';

export default {
    beforeRouteEnter(to, from, next) {
        getLang({ [Vue.cookie.get('lang') || 'zh-cn']: '' }).then(() => {
            member.data({
                success: () => {
                    next({ path: '/' });
                },
                fail: () => {
                    next();
                }
            });
        });
    }
};
</script>

<style lang="scss" src="@/css/router/500.scss"></style>
