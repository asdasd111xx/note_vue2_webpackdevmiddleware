<template>
    <mobile-container :header-config="headerConfig" class="theme-basic">
        <div slot="content" class="content-main">
            <div :class="`agcenter-wrap agcenter-bg theme-${siteConfig.MOBILE_WEB_TPL}`">
                <div class="agcenter-content-main">
                    <post />
                </div>
            </div>
        </div>
    </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import post from '@/router/agent/components/infoPost/components';
import mobileContainer from '../../../../common/mobileContainer';

export default {
    components: {
        post,
        mobileContainer
    },
    data() {
        return {
            headerConfig: {
                prev: true,
                onClick: () => { this.$router.back(); },
                title: this.$text('S_AGENT', '代理中心'),
            }
        };
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
