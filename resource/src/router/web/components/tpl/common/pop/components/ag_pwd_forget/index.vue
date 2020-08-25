<template>
    <ele1 />
</template>

<script>
export default {
    components: {
        ele1: () => import(/* webpackChunkName: 'ele1' */'./1')
    }
};
</script>
