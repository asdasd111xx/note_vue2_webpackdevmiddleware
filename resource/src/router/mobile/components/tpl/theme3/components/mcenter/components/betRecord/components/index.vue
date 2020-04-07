<template>
    <mobile-container class="theme-basic">
        <div slot="content" class="content-main">
            <bet-record />
        </div>
    </mobile-container>
</template>

<script>
import betRecord from '@/router/mobile/components/common/mcenter/theme1/betRecord';
import mobileContainer from '../../../../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        betRecord
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
