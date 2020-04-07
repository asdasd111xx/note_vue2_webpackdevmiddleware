<template>
    <theme1
        v-if="theme === '1'"
        :class="commonClass"
        :list-style="finalListStyle"
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
        listStyle: {
            type: Object,
            default: () => ({
                animateName: ''
            })
        }
    },
    data() {
        return {
            commonClass: ['mem-info-wrap', 'clearfix'],
            finalListStyle: {
                animateName: this.listStyle.animateName || 'fade'
            }
        };
    }
};
</script>
