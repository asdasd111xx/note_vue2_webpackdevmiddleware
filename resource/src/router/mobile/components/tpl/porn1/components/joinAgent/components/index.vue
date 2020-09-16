<template>
    <mobile-container
        :class="$style.container"
        :header-config="headerConfig"
        :hasFooter="false"
    >
        <join-agent
            slot="content"
            :has-title="false"
            :theme="$style"
        />
    </mobile-container>
</template>

<script>
import { mapGetters } from 'vuex';
import joinAgent from '@/router/web/components/page/join_agent';
import mobileContainer from '../../common/mobileContainer';

export default {
    components: {
        joinAgent,
        mobileContainer
    },
    data() {
        return {
            headerConfig: {
                prev: true,
                onClick: () => { this.$router.back(); },
                hasClose: true,
                title: this.$text('S_AGENT_JOIN', '代理注册')
            }
        };
    },
    computed: {
        ...mapGetters({
            loginStatus: 'getLoginStatus',
            webInfo: 'getWebInfo'
        })
    }
};
</script>

<style src="../css/index.module.scss" lang="scss" module>
