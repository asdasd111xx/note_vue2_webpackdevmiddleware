<template>
    <ele1
        v-if="showNote"
        :has-bank-card="hasBankCard"
        :position="position"
    />
</template>

<script>
import { mapGetters } from 'vuex';
import common from '@/api/common';

export default {
    components: {
        ele1: () => import(/* webpackChunkName: 'ele1' */'./1')
    },
    props: {
        position: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            showNote: false,
            hasBankCard: false
        };
    },
    computed: {
        ...mapGetters({
            webInfo: 'getWebInfo',
            agentInfo: 'getAgentInfo'
        })
    },
    created() {
        // 綁定銀行卡內無常用帳號
        common.bankCardCheck({
            success: (response) => {
                this.showNote = true;

                if (!this.agentInfo.user.name) {
                    this.hasBankCard = false;
                    return;
                }
                if (response.ret === false) {
                    this.hasBankCard = true;
                }
            },
            fail: () => {
                this.showNote = true;

                if (!this.agentInfo.user.name) {
                    this.hasBankCard = false;
                }
            }
        });
    }
};
</script>
