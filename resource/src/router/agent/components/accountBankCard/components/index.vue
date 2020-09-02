<template>
    <iframe
        id="js-set-height"
        :src="!onlineService.url ? '/payment/user_bank' : `/payment/user_bank?url=${encodeURIComponent(onlineService.url)}`"
        height="500"
        frameborder="0"
    />
</template>

<script>
import {
    mapGetters
} from 'vuex';
import agValidate from '@/lib/agValidate';

export default {
    computed: {
        ...mapGetters({
            agentInfo: 'getAgentInfo',
            agentUserLevels: 'getAgentUserLevels',
            onlineService: 'getOnlineService'
        })
    },
    created() {
        const isContact = !this.agentUserLevels.bank && !this.agentUserLevels.virtual_bank && !this.agentUserLevels.bind_user;
        const withdrawOnly = !this.agentUserLevels.bank && !this.agentUserLevels.virtual_bank && this.agentUserLevels.bind_user;
        if ((isContact || withdrawOnly) && this.$route.path === '/mobile/agcenter/bankCard') {
            this.$router.push('/mobile/agcenter/accountData');
            return;
        }

        agValidate('accountBankCard').then((res) => {
            if (!res.status) {
                if (this.$route.path === '/mobile/agcenter/bankCard') {
                    this.$router.push({ path: '/mobile/agcenter/accountData' });
                    return;
                }

                this.$router.push({ path: '/agent/accountData' });
            }
        });
    }
};
</script>

<style lang="scss" scoped>
iframe {
    width: 100%;
}
</style>
