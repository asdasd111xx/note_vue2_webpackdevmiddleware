<template>
    <div :class="`agcenter-wrap agcenter-bg theme-${siteConfig.MOBILE_WEB_TPL}`">
        <div class="agcenter-content-main">
            <game-record />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import gameRecord from '@/router/agent/components/reportGameRecord/components';

export default {
    components: {
        gameRecord
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        })
    }
};
</script>

<style lang="scss">
.agcenter-wrap {
    background-color: #FFF;
    padding: 0;
    min-height: calc(100vh - 44px);

    @import '~@/router/agent/css/index.scss';

    .agcenter-content-main {
        padding: 18px 5.3% 56px;
    }
}
</style>
