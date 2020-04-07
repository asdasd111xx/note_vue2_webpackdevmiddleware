<template>
    <mobile-container>
        <div slot="content" :class="$style['content-wrap']">
            <money-detail />
        </div>
    </mobile-container>
</template>

<script>
import moneyDetail from '@/router/mobile/components/common/mcenter/theme1/moneyDetail';
import mobileContainer from '../../../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        moneyDetail
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
