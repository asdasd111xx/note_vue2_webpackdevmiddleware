<template>
    <div :class="$style.container">
        <slot v-if="!isWebview && headerSetting" name="header">
            <m-header :header-setting="headerSetting" />
        </slot>
        <slot name="content" />
        <template v-if="!isWebview && path[1] !== 'agcenter'">
            <m-footer />
        </template>
        <ele-pop />
        <!-- 代理中心及會員中心彈窗 -->
        <div v-if="popType === 'note'" :class="[$style['note-content'], 'theme-theme3']">
            <agent-note v-if="path[1] === 'agcenter'" :position="popData" />
            <note v-else :position="popData" />
        </div>
        <pop-news />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        mHeader: () => import(/* webpackChunkName: 'mHeader' */'./mHeader'),
        mFooter: () => import(/* webpackChunkName: 'mFooter' */'./mFooter'),
        elePop: () => import(/* webpackChunkName: 'elePop' */'@/router/web/components/tpl/common/pop'),
        note: () => import(/* webpackChunkName: 'note' */'@/components/mcenter/components/common/note'),
        popNews: () => import(/* webpackChunkName: 'popNews' */'@/router/web/components/common/popNews'),
        agentNote: () => import(/* webpackChunkName: 'note' */'@/router/agent/components/common/note')
    },
    props: {
        headerSetting: {
            type: Object,
            default: null
        }
    },
    computed: {
        ...mapGetters({
            isWebview: 'getIsWebview',
            popType: 'getPopType',
            popData: 'getPopData'
        }),
        path() {
            return this.$route.path.split('/').filter((path) => path);
        }
    }
};
</script>

<style lang="scss" module>
.container {
    min-width: 320px;
    width: 100%;
    min-height: 100%;
    background-color: #000;
}
</style>
