<template>
    <div class="top-info clearfix">
        <div class="logo">
            <span v-if="!webInfo.m_logo">LOGO</span>
            <img
                v-else
                :src="$getCdnPath(logoPath)"
                tag="img"
            />
        </div>
        <div class="info">
            <div class="user-name">{{ agentInfo.user.show_alias ? agentInfo.user.alias : agentInfo.user.username }}</div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            cdnDomain: 'getCdnDomain',
            agentInfo: 'getAgentInfo'
        }),
        logoPath() {
            return `${this.cdnDomain}${this.webInfo.m_logo}`;
        }
    }
};
</script>

<style lang="scss" src="../css/topInfo.scss" scoped></style>
