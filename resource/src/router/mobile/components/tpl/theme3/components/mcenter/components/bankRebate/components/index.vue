<template>
    <mobile-container class="theme-basic">
        <div slot="content" class="content-main">
            <bank-rebate />
        </div>
    </mobile-container>
</template>

<script>
import bankRebate from '@/router/mobile/components/common/mcenter/theme1/bankRebate';
import mobileContainer from '../../../../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        bankRebate
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
