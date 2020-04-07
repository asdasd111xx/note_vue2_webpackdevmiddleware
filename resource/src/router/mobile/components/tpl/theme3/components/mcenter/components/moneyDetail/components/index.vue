<template>
    <mobile-container class="theme-basic">
        <div slot="content" class="content-main">
            <money-detail />
        </div>
    </mobile-container>
</template>

<script>
import moneyDetail from '@/router/mobile/components/common/mcenter/theme1/moneyDetail';
import mobileContainer from '../../../../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        moneyDetail
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
