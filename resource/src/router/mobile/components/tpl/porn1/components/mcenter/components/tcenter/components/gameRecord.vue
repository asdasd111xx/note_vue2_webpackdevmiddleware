<template>
    <mobile-container :class="$style.container">
        <div slot="content" class="content-wrap">
            <tcenter func="gameRecord" />
        </div>
    </mobile-container>
</template>

<script>
import tcenter from '@/router/mobile/components/common/mcenter/theme1/tcenter';
import mobileContainer from '../../../../common/mobileContainer';

export default {
    components: {
        mobileContainer,
        tcenter
    }
};
</script>

<style lang="scss" module>
div.container {
    padding-top: 65px;
    background-color: #FFF;
}
</style>
