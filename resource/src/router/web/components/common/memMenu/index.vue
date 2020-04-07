<template>
    <theme1
        v-if="theme === '1'"
        :class="commonClass"
        :mcenter-item-list="mcenterItemListResult"
    />
</template>

<script>
export default {
    components: {
        theme1: () => import(/* webpackChunkName: 'theme1' */'./template/theme1')
    },
    props: {
        theme: {
            type: String,
            default: '1'
        },
        mcenterItemList: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            commonClass: ['mem-menu-wrap', 'clearfix'],
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
