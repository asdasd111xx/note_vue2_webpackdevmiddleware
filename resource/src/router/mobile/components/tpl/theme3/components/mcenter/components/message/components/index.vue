<template>
    <mobile-container class="theme-basic">
        <div slot="content" class="content-main">
            <message />
        </div>
    </mobile-container>
</template>

<script>
import message from '@/components/mcenter/components/message';
import mobileContainer from '../../../../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        message
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
