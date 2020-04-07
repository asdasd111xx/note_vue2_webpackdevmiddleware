<template>
    <mobile-container :header-setting="headerSetting" :class="$style.container">
        <div slot="content" :class="`agcenter-wrap agcenter-bg theme-${siteConfig.MOBILE_WEB_TPL}`">
            <div class="agcenter-content-main">
                <account-data />
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
        mobileContainer,
        accountData
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        }),
        headerSetting() {
            return {
                left: { show: true },
                center: { show: true, typeText: true, text: '用户信息' },
                right: { show: true }
            };
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~@/router/agent/css/index.scss';

.agcenter-wrap {
    min-height: 100%;
}

.agcenter-content-main {
    padding: 18px 5.3% 56px;
}
</style>

<style lang="scss" module>
div.container {
    padding: 48px 0 45px;
    background-color: #FFF;
}
</style>
