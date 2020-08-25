<template>
    <ele1
        v-if="theme === 1"
        :logout-text="logoutText"
        :animate-name="animateName"
        :mcenter-item-list="mcenterItemListResult"
    />
</template>

<script>
export default {
    components: {
        ele1: () => import(/* webpackChunkName: 'ele1' */'./1')
    },
    props: {
        theme: {
            type: Number,
            default: null
        },
        logoutText: {
            type: String,
            default: ''
        },
        animateName: {
            type: String,
            default: 'fade'
        },
        mcenterItemList: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            mcenterItemListResult: {
                accountData: {
                    text: 'S_MEM_CENTER',
                    hasLine: true
                },
                deposit: {
                    text: 'S_ONLINE_DEPOSIT',
                    hasLine: true
                },
                withdraw: {
                    text: 'S_ONLINE_WITHDRAW',
                    hasLine: true
                },
                bankBalanceTran: {
                    text: 'S_TRAN_BALANCE',
                    hasLine: true
                },
                ...this.mcenterItemList
            }
        };
    }
};
</script>
