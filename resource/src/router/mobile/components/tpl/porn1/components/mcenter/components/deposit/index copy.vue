<template>
    <mobile-container>
        <div slot="content" :class="$style['content-wrap']">
            <depsoit />
        </div>
    </mobile-container>
</template>

<script>
import depsoit from '@/router/mobile/components/common/mcenter/theme1/deposit';
import mobileContainer from '../../../common/mobileContainer';

export default {
    components: {
        depsoit,
        mobileContainer
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
