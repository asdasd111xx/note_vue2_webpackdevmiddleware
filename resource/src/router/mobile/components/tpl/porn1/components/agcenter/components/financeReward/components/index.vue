<template>
    <mobile-container :header-config="headerConfig">
        <div slot="content">
            <div :class="`agcenter-wrap agcenter-bg theme-${siteConfig.MOBILE_WEB_TPL}`">
                <div class="agcenter-content-main">
                    <finance-reward />
                </div>
            </div>
        </div>
    </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import financeReward from '@/router/agent/components/financeReward/components';
import mobileContainer from '../../../../common/mobileContainer';

export default {
    components: {
        financeReward,
        mobileContainer
    },
    data() {
        return {
            headerConfig: {
                prev: true,
                onClick: () => { this.$router.back(); },
                title: this.$text('S_COMMISSION_DETAILS', '佣金明细'),
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
