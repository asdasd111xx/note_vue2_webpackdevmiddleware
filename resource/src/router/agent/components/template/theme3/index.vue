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
        <div v-if="popType === 'note'" class="note-content">
            <note :position="popData" />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import popNews from '@/router/web/components/common/popNews';
import pageHeader from './pageHeader';
import pageList from './pageList';

export default {
    components: {
        note: () => import(/* webpackChunkName: 'note' */'../../common/note'),
        elePop: () => import(/* webpackChunkName: 'elePop' */'@/router/web/components/tpl/common/pop'),
        pageHeader,
        popNews,
        pageList
    },
    props: {
        logout: {
            type: Function,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            popData: 'getPopData',
            popType: 'getPopType'
        }),
        currentPage() {
            return this.$route.path.split('/')[2];
        }
    }
};
</script>

<style lang="scss" src="../../../css/template/theme3/index.scss" scoped></style>
