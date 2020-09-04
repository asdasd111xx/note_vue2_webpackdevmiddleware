<template>
    <mobile-container :header-config="headerConfig">
        <div slot="content">
            <div :class="`agcenter-wrap agcenter-bg theme-${siteConfig.MOBILE_WEB_TPL}`">
                <div class="agcenter-content-main">
                    <account-data />
                </div>
            </div>
        </div>
    </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import accountData from '@/router/agent/components/accountData/components';
import mobileContainer from '../../../../common/mobileContainer';

export default {
    components: {
        accountData,
        mobileContainer
    },
    data() {
        return {
            headerConfig: {
                prev: true,
                onClick: () => { this.$router.back(); },
                title: this.$text('S_ACCOUNT_DATA', '帐户资料'),
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

<style lang="scss" scoped>
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
