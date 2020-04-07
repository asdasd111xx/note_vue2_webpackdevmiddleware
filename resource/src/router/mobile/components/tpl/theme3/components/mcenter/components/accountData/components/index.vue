<template>
    <mobile-container class="theme-brilliant">
        <div slot="content" class="content-main">
            <account />
        </div>
    </mobile-container>
</template>

<script>
import account from '@/router/mobile/components/common/mcenter/theme1/account';
import mobileContainer from '../../../../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        account
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
