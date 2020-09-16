<template>
    <div class="top-link clearfix">
        <div :class="{ 'link-item': true, 'has-promotion': !agentInfo.user.show_promotion }" @click="onListClick(0)">
            <img :src="$getCdnPath('/static/image/porn1/agent/mcenter/icon_proxylist_n.png')" />
            <img :src="$getCdnPath('/static/image/porn1/agent/mcenter/icon_proxylist_h.png')" class="is-active" />
            {{ $t('S_COMMISSION_DETAILS') }}
        </div>
        <div
            v-if="agentInfo.user.show_promotion"
            class="link-item"
            @click="onListClick(1)"
        >
            <img :src="$getCdnPath('/static/image/porn1/agent/mcenter/icon_memberlist_n.png')" />
            <img :src="$getCdnPath('/static/image/porn1/agent/mcenter/icon_memberlist_h.png')" class="is-active" />
            {{ $t('S_MEMBER_LIST') }}
        </div>
        <div :class="{ 'link-item': true, 'has-promotion': !agentInfo.user.show_promotion }" @click="onListClick(2)">
            <img :src="$getCdnPath('/static/image/porn1/agent/mcenter/icon_withdrawals_n.png')" />
            <img :src="$getCdnPath('/static/image/porn1/agent/mcenter/icon_withdrawals_h.png')" class="is-active" />
            {{ $t('S_ACCOUNT_WITHDRAW') }}
        </div>
    </div>
</template>

<style lang="scss" src="../css/topLink.scss" scoped></style>

<script>
import { mapActions, mapGetters } from 'vuex';
import * as axios from 'axios';
import agValidate from '@/lib/agValidate';

export default {
    data() {
        return {
            list: [
                { path: '/mobile/agcenter/financeReward', pageName: 'financeReward' }, // 佣金明細
                { path: '/mobile/agcenter/reportMember', pageName: 'reportMember' }, // 會員列表
                { path: '/mobile/agcenter/financeWithdraw', pageName: 'financeWithdraw' } // 取款
            ]
        };
    },
    computed: {
        ...mapGetters({
            agentUserLevels: 'getAgentUserLevels',
            agentInfo: 'getAgentInfo'
        })
    },
    methods: {
        ...mapActions([
            'actionSetAgentdata',
            'actionSetPop',
            'actionSetSystemTime'
        ]),
        onListClick(listIndex) {
            const isContact = !this.agentUserLevels.bank && !this.agentUserLevels.virtual_bank && !this.agentUserLevels.bind_user;
            if (listIndex === 2 && isContact) {
                alert(this.$t('S_MISTAKE_CONTACT_CUSTOM_SERVICE'));
                return;
            }

            const item = this.list[listIndex];

            if (item.pageName !== 'financeWithdraw' && item.pageName !== 'accountBankCard') {
                this.$router.push(item.path);
                return;
            }

            axios.all([this.actionSetAgentdata()]).then(() => {
                this.actionSetSystemTime();

                agValidate(item.pageName).then((res) => {
                    // 取款是否另開
                    if (res.message === 'withdrawIsEmbed') {
                        window.open(this.withdrawUrl, '_blank');
                        return;
                    }

                    // 帳號為停權狀態
                    if (res.message === 'isBankrupt') {
                        alert(this.$i18n.t('S_BANKRUPT_TIP'));
                        return;
                    }

                    // 未設定姓名, 未設定取款密碼, 綁定銀行卡內無常用帳號
                    if (res.message === 'noName' || res.message === 'noPassword' || res.message === 'noCommonAccount' || res.message === 'mobileDidNotPass') {
                        this.actionSetPop({ type: 'note' });
                        return;
                    }

                    this.$router.push(item.path);
                });
            });
        }
    }
};
</script>


<style lang="scss" src="../css/topLink.scss" scoped></style>
