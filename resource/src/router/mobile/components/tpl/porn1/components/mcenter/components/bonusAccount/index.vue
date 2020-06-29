<template>
    <mobile-container>
        <div slot="content" :class="$style['content-wrap']">
            <bonus-account />
        </div>
    </mobile-container>
</template>

<script>
import bonusAccount from '@/router/mobile/components/common/mcenter/theme1/bonusAccount';
import mobileContainer from '../../../common/new/mobileContainer';

export default {
    components: {
        mobileContainer,
        bonusAccount
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
