<template>
    <div>
        <jackpot-default
            v-if="parseFloat(jackpot[curVendor].jpMajor).toString() === 'NaN'"
            :key="`${curVendor}-default`"
            :theme="theme"
            :cur-vendor="curVendor"
        />
        <jackpot-major
            v-if="parseFloat(jackpot[curVendor].jpMajor).toString() !== 'NaN'"
            :key="`${curVendor}-major`"
            :theme="theme"
            :cur-vendor="curVendor"
        />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        jackpotDefault: () => import(/* webpackChunkName: 'jackpotDefault' */'./jackpotDefault'),
        jackpotMajor: () => import(/* webpackChunkName: 'jackpotMajor' */'./jackpotMajor')
    },
    props: {
        theme: {
            type: String,
            required: true
        },
        curVendor: {
            type: String,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            jackpot: 'getJackpot'
        })
    }
};
</script>
