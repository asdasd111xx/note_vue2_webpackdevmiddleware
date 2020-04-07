<template>
    <mobile-container class="theme-basic">
        <div slot="content" class="content-main">
            <balance-trans />
        </div>
    </mobile-container>
</template>

<script>
import balanceTrans from '@/router/mobile/components/common/mcenter/theme1/balanceTran';
import mobileContainer from '../../../../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        balanceTrans
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
