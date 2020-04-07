<template>
    <mobile-container>
        <div slot="content" :class="$style['content-wrap']">
            <bet-record />
        </div>
    </mobile-container>
</template>

<script>
import betRecord from '@/router/mobile/components/common/mcenter/theme1/betRecord';
import mobileContainer from '../../../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        betRecord
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
