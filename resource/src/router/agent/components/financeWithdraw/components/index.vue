<template>
    <iframe
        v-if="period"
        id="js-set-height"
        :src="`/payment/agent_withdraw?stage=forward&reward_id=${period}`"
        height="500"
        frameborder="0"
    />
    <iframe
        v-else
        id="js-set-height"
        :src="withdrawUrl"
        height="500"
        frameborder="0"
    />
</template>

<script>
import { mapGetters } from 'vuex';
import agValidate from '@/lib/agValidate';
import agcenter from '@/api/agcenter';

export default {
    data() {
        return {
            withdrawUrl: ''
        };
    },
    computed: {
        ...mapGetters({
            period: 'getAgcenterWdPeriod',
            agentInfo: 'getAgentInfo',
            agentUserLevels: 'getAgentUserLevels',
            memInfo: 'getMemInfo',
            webInfo: 'getWebInfo',
            curLang: 'getCurLang',
            isWebview: 'getIsWebview'
        })
    },
    created() {
        const isContact = !this.agentUserLevels.bank && !this.agentUserLevels.virtual_bank && !this.agentUserLevels.bind_user;
        if (isContact && this.$route.path === '/mobile/agcenter/financeWithdraw') {
            this.$router.push('/mobile/agcenter/accountData');
            return;
        }

        agValidate('financeWithdraw').then((res) => {
            if (!res.status) {
                let isMobileView;

                try {
                    isMobileView = this.$route.matched[0].meta.isMobile;
                } catch (e) {
                    isMobileView = false;
                }

                if (isMobileView) {
                    this.$router.push({ path: '/mobile/agcenter/accountData' });
                    return;
                }

                this.$router.push({ path: '/agent/accountData' });
            }
        });

        const params = {
            logo: this.webInfo.logo ? `${this.webInfo.cdn_domain}${this.webInfo.logo}` : '',
            mlogo: this.webInfo.m_logo ? `${this.webInfo.cdn_domain}${this.webInfo.m_logo}` : '',
            title: encodeURI(this.agentInfo.config.domain_name[this.curLang]),
            favicon: this.webInfo.fav_icon ? `${this.webInfo.cdn_domain}${this.webInfo.fav_icon}` : ''
        };
        const webviewWithdraw = this.isWebview ? { window_open_self: 1 } : {};

        agcenter.withdraw(
            {
                ...params,
                ...webviewWithdraw
            },
            {
                success: (response) => {
                    if (response.result === 'ok') {
                        this.withdrawUrl = response.ret.uri;
                        return;
                    }

                    console.log('API ERROR', response.msg);
                }
            }
        );
    }
};
</script>

<style lang="scss" scoped>
iframe {
    width: 100%;
    min-height: 700px;
}
</style>
