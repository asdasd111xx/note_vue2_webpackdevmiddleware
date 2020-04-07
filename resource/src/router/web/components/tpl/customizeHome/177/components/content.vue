<template>
    <div class="content-wrap">
        <first-game />
    </div>
</template>

<script>
export default {
    components: {
        firstGame: () => import(/* webpackChunkName: 'firstGame' */'./firstGame')
    }
};
</script>

<style lang="scss" src="../css/content.scss" scoped />
