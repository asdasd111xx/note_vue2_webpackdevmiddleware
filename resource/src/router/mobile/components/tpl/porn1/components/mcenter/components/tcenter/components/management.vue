<template>
    <mobile-container :class="$style.container" :hasFooter="false">
        <div slot="content" class="content-wrap">
            <tcenter func="management" />
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
@import "@/css/variable.scss";

div.container {
    padding-top: 43px;
    background-color: $main_background_white1;
}
</style>
