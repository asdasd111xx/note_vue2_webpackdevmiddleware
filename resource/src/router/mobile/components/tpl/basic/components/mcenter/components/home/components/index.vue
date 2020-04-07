<template>
    <div class="mcenter-wrap theme-basic">
        <transition name="fade" mode="out-in">
            <div class="content-main">
                <home />
            </div>
        </transition>
    </div>
</template>

<script>
import home from '@/router/mobile/components/common/mcenter/theme1/home';

export default {
    components: {
        home
    }
};
</script>

<style lang="scss" scoped>
.mcenter-wrap {
    position: relative;
    width: 100%;
    min-height: calc(100vh - 121px);
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
</style>
