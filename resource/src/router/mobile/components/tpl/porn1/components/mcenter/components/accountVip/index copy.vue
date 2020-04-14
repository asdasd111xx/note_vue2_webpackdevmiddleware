<template>
    <mobile-container>
        <div slot="header" />
        <div slot="content" :class="$style['content-wrap']">
            <vip />
        </div>
    </mobile-container>
</template>

<script>
import vip from '@/router/mobile/components/common/mcenter/theme1/vip';
import mobileContainer from '../../../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        vip
    }
};
</script>

<style lang="scss" module>
.content-wrap {
    padding: 65px 0 45px;
    background: #EEE;
    min-height: calc(100vh);
}
</style>
