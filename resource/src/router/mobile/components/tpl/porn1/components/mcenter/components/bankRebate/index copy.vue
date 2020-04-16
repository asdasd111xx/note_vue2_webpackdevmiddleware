<template>
    <mobile-container>
        <div slot="content" :class="$style['content-wrap']">
            <bank-rebate />
        </div>
    </mobile-container>
</template>

<script>
import bankRebate from '@/router/mobile/components/common/mcenter/theme1/bankRebate';
import mobileContainer from '../../../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        bankRebate
    }
};
</script>

<style lang="scss" module>
.content-wrap {
    position: relative;
    padding: 65px 0 45px;
    background: #EEE;
    min-height: calc(100vh);
}
</style>
