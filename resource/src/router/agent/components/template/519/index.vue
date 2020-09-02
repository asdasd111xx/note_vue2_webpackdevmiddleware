<template>
    <div :class="`agcenter-container ${$i18n.locale}`">
        <div class="agcenter-info clearfix">
            <div class="agcenter-logout" @click="logout">{{ $t('S_RETURN_MEM') }} ({{ $t('S_LOGOUT') }})</div>
            <select-lang :theme="1" class="lang-wrap" />
        </div>
        <div class="agcenter-wrap clearfix">
            <page-list :theme="$stylePageList" />
            <div class="agcenter-content-wrap">
                <div class="agcenter-content">
                    <div :class="`agcenter-content-main page-${currentPage} theme-519`">
                        <slot />
                    </div>
                </div>
            </div>
        </div>
        <marquee-news :theme="$styleMarqueeNews" />
        <ele-pop />
        <pop-news />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import popNews from '@/router/web/components/common/popNews';
import selectLang from '@/router/web/components/tpl/common/header/lang';
import marqueeNews from '../common/marqueeNews';
import pageList from '../common/pageList';

export default {
    components: {
        elePop: () => import(/* webpackChunkName: 'elePop' */'@/router/web/components/tpl/common/pop'),
        popNews,
        selectLang,
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

        }),
        currentPage() {
            return this.$route.path.split('/')[2];
        }
    }
};
</script>

<style lang="scss" src="../../../css/template/519/index.scss" scoped></style>
<style lang="scss" src="../../../css/template/519/common/marqueeNews.module.scss" module="$styleMarqueeNews"></style>
<style lang="scss" src="../../../css/template/519/common/pageList.module.scss" module="$stylePageList"></style>
<style lang="scss" src="../../../css/template/519/common/topInfo.module.scss" module="$styleTopInfo"></style>
