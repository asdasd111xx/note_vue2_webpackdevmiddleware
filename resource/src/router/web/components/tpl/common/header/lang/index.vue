<template>
    <component
        :is="`ele${theme}`"
        v-if="isShowLang"
    />
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        ele1: () => import(/* webpackChunkName: 'ele1' */'./1'),
        ele2: () => import(/* webpackChunkName: 'ele2' */'./2'),
        ele3: () => import(/* webpackChunkName: 'ele3' */'./3') // select 下拉樣式
    },
    props: {
        theme: {
            type: Number,
            default: null
        }
    },
    computed: {
        ...mapGetters({
            lang: 'getLang'
        }),
        isShowLang() {
            return Object.keys(this.lang).length > 1;
        }
    }
};
</script>
