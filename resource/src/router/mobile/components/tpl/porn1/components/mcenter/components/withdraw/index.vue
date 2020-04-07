<template>
    <mobile-container>
        <div slot="content" :class="$style['content-wrap']">
            <withdraw />
        </div>
    </mobile-container>
</template>

<script>
import withdraw from '@/router/mobile/components/common/mcenter/theme1/withdraw';
import mobileContainer from '../../../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        withdraw
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
