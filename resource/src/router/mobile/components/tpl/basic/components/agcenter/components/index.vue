<template>
    <div :class="`agcenter-wrap agcenter-bg theme-${theme}`">
        <router-view :theme="theme" />
    </div>
</template>

<script>
export default {
    props: {
        theme: {
            type: String,
            required: true
        }
    }
};
</script>


<style lang="scss">
.agcenter-wrap {
    background-color: #FFF;
    padding: 0;
    min-height: calc(100vh - 44px);

    @import '~@/router/agent/css/index.scss';

    .agcenter-content-main {
        padding: 18px 5.3% 56px;
    }
}
</style>
