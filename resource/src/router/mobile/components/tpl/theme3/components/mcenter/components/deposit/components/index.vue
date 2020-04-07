<template>
    <mobile-container class="theme-basic">
        <div slot="content" class="content-main">
            <depsoit />
        </div>
    </mobile-container>
</template>

<script>
import depsoit from '@/router/mobile/components/common/mcenter/theme1/deposit';
import mobileContainer from '../../../../common/mobileContainer';

export default {
    components: {
        depsoit,
        mobileContainer
    }
};
</script>

<style lang="scss" scoped>
.mcenter-wrap {
    position: relative;
    width: 100%;
    min-height: calc(100vh - 99px);
    margin: 0 auto;
    padding-top: 0;
    background: #EEE;
}

// transition
.fade-enter-active,
.fade-leave-active {
    transition-duration: .3s;
    transition-property: opacity;
    transition-timing-function: ease;
}

.fade-enter,
.fade-leave-active {
    opacity: 0
}

.content-main {
    position: relative;
    min-height: calc(100vh);
    padding: 65px 0 45px;
    background-color: #EEE;
}
</style>
