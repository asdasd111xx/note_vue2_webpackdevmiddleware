<template>
    <div :class="['agcenter-bg', $i18n.locale]">
        <page-header :logout="logout" />
        <div class="agcenter-wrap clearfix">
            <page-list />
            <div class="agcenter-content-wrap">
                <div class="agcenter-content">
                    <div :class="['agcenter-content-main', `page-${currentPage}`]">
                        <slot />
                    </div>
                </div>
            </div>
        </div>
        <ele-pop />
        <pop-news />
        <!-- 代理中心及會員中心彈窗 -->
        <pop-note />
    </div>
</template>

<script>
import popNews from '@/router/web/components/common/popNews';
import pageHeader from './pageHeader';
import pageList from './pageList';
import popNote from '../common/popNote';

export default {
    components: {
        elePop: () => import(/* webpackChunkName: 'elePop' */'@/router/web/components/tpl/common/pop'),
        pageHeader,
        popNews,
        pageList,
        popNote
    },
    props: {
        logout: {
            type: Function,
            required: true
        }
    },
    computed: {
        currentPage() {
            return this.$route.path.split('/')[2];
        }
    }
};
</script>

<style lang="scss" src="../../../css/template/theme3/index.scss" scoped></style>
