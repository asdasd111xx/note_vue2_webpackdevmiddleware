<template>
    <div :class="`agcenter-bg ${$i18n.locale}`">
        <marquee-news />
        <div class="agcenter-wrap clearfix">
            <page-list />
            <div class="agcenter-content-wrap">
                <div class="agcenter-info clearfix">
                    <ele-lang />
                    <div class="agcenter-logout" @click="logout">{{ $t('S_RETURN_MEM') }} ({{ $t('S_LOGOUT') }})</div>
                </div>
                <div class="agcenter-content">
                    <div :class="`agcenter-content-main page-${currentPage} theme-basic`">
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
import eleLang from '@/router/web/components/tpl/common/header/old_lang';
import marqueeNews from '../common/marqueeNews';
import pageList from '../common/pageList';

export default {
    components: {
        note: () => import(/* webpackChunkName: 'note' */'../../common/note'),
        elePop: () => import(/* webpackChunkName: 'elePop' */'@/router/web/components/tpl/common/pop'),
        popNews,
        eleLang,
        marqueeNews,
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

<style lang="scss" src="../../../css/template/basic/index.scss" scoped></style>
