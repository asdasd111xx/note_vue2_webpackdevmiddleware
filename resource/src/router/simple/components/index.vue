<template>
    <component :is="$route.params.pid" />
</template>

<script>

import store from '@/store';
import bonus from './bonus';

export default {
    components: {
        bonus,
        pcDeposit: () => import(/* webpackChunkName: 'pcdeposit' */ './pcDeposit'),
        mobileDeposit: () => import(/* webpackChunkName: 'mobileDeposit' */ './mobileDeposit')
    },
    beforeRouteEnter(to, from, next) {
        store.dispatch('actionMemInit').then(() => { next(); });
    }
};
</script>
