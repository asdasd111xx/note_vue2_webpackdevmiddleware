<template>
    <theme-miller
        v-if="theme === 'themeMiller'"
        :theme="theme"
        :game-info="gameInfo"
        :show-vendor="showVendor"
        :show-jackpot="showJackpot"
        :show-favor="showFavor"
        :show-button="showButton"
    />
    <theme1
        v-else
        :theme="theme"
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
        theme1: () => import(/* webpackChunkName: 'theme1' */'./template/theme1'),
        themeMiller: () => import(/* webpackChunkName: 'themeMiller' */'./template/themeMiller')
    },
    props: {
        theme: {
            type: String,
            required: true
        },
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
