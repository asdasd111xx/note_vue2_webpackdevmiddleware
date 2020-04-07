<template>
    <join-agent :has-title="false" :theme="$style" />
</template>

<script>
import joinAgent from '@/router/web/components/page/join_agent';

export default {
    components: {
        joinAgent
    }
};
</script>

<style src="../../../css/join/joinMem_mobile.module.scss" lang="scss" module>
