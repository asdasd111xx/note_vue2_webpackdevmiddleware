<template>
    <mobile-container :header-config="headerConfig">
        <div slot="content">
            <div :class="`agcenter-wrap agcenter-bg theme-${siteConfig.MOBILE_WEB_TPL}`">
                <div class="agcenter-content-main">
                    <bank-card />
                </div>
            </div>
        </div>
    </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import bankCard from '@/router/agent/components/accountBankCard/components';
import mobileContainer from '../../../../common/mobileContainer';

export default {
    components: {
        bankCard,
        mobileContainer
    },
    data() {
        return {
            headerConfig: {
                prev: true,
                onClick: () => { this.$router.back(); },
                title: this.$text('S_BIND_BANK', '绑定银行卡'),
            },
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
