<template>
    <mobile-container class="theme-basic">
        <div slot="content" class="content-main">
            <information />
        </div>
    </mobile-container>
</template>

<script>
import information from '@/router/mobile/components/common/mcenter/theme1/information';
import mobileContainer from '../../../../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        information
    }
};
</script>

<style lang="scss" scoped>
    .content-main {
        position: relative;
        padding: 65px 0 45px;
        background: #EEE;
        min-height: calc(100vh);
    }
</style>
