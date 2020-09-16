<template>
    <div :class="['agcenter-bg', $i18n.locale]">
        <page-header :logout="logout" />
        <div ref="agcenter-wrap" class="agcenter-wrap clearfix">
            <page-list :style="{ 'min-height': navHeight }" />
            <div class="agcenter-content-wrap">
                <div class="agcenter-content">
                    <div :class="['agcenter-content-main', `page-${currentPage}`]">
                        <slot />
                    </div>
                </div>
            </div>
        </div>
        <page-footer />
        <ele-pop />
        <pop-news />
        <!-- 代理中心及會員中心彈窗 -->
        <pop-note />
    </div>
</template>

<script>
import popNews from '@/router/web/components/common/popNews';
import pageHeader from './pageHeader';
import pageFooter from './pageFooter';
import popNote from '../common/popNote';

export default {
    components: {
        elePop: () => import(/* webpackChunkName: 'elePop' */'@/router/web/components/tpl/common/pop'),
        pageList: () => import(/* webpackChunkName: 'pageList' */'./pageList'),
        pageHeader,
        pageFooter,
        popNews,
        popNote
    },
    props: {
        logout: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            navHeight: 'auto'
        };
    },
    computed: {
        currentPage() {
            return this.$route.path.split('/')[2];
        }
    },
    watch: {
        // eslint-disable-next-line
        '$route.path'(value) {
            this.getHeight();
        }
    },
    mounted() {
        this.getHeight();
    },
    methods: {
        getHeight() {
            // 因元件更新會有延遲，暫時以此方式抓取高度
            setTimeout(() => {
                this.navHeight = `${this.$refs['agcenter-wrap'].offsetHeight}px`;
            }, 500);
        }
    }
};
</script>

<style lang="scss" src="../../../css/template/miller/index.scss" scoped></style>
