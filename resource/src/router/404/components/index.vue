<template>
    <div class="error404">
        <div class="image">
            <img :src="$getCdnPath('/static/image/404error.png')" />
            <img :src="$getCdnPath('/static/image/oops.png')" class="oops" />
        </div>
        <div class="text">{{ $t('ROUTER_404_TEXT') }}</div>
    </div>
</template>

<script>
import Vue from 'vue';
import getLang from '@/lib/getLang';

export default {
    beforeRouteEnter(to, from, next) {
        getLang({ [Vue.cookie.get('lang') || 'zh-cn']: '' }).then(() => {
            next();
        });
    }
};
</script>

<style lang="scss" src="@/css/router/404.scss"></style>
