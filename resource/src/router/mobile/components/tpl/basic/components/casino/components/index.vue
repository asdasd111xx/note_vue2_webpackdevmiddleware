<template>
    <div class="casino-wrap">
        <casino />
    </div>
</template>

<script>
import casino from '@/router/web/components/element/hall/casino';

export default {
    components: {
        casino
    }
};
</script>

<style lang="scss" scoped>
.casino-wrap {
    min-height: calc(100vh - 85px);
    background-color: #272637;
}
</style>
