<template>
    <theme1
        :game-info="gameInfo"
        :show-vendor="showVendor"
        :show-jackpot="showJackpot"
        :show-favor="showFavor"
        :show-button="showButton"
    />
</template>

<script>
export default {
    components: {
        theme1: () => import(/* webpackChunkName: 'theme1' */'./template/theme1')
    },
    props: {
        gameInfo: {
            type: Object,
            required: true
        },
        showVendor: {
            type: Boolean,
            default: true
        },
        showJackpot: {
            type: Boolean,
            default: true
        },
        showFavor: {
            type: Boolean,
            default: true
        },
        showButton: {
            type: Boolean,
            default: true
        }
    }
};
</script>
