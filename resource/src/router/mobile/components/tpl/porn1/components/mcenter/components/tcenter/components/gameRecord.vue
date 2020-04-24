<template>
    <mobile-container :class="$style.container">
        <div slot="content" class="content-wrap">
            <tcenter func="gameRecord" />
        </div>
    </mobile-container>
</template>

<script>
import tcenter from '@/components/mcenter/components/tcenter';
import mobileContainer from '../../../../common/new/mobileContainer';

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
