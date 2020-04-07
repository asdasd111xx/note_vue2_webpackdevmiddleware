<template>
    <div :class="`mcenter-wrap theme-basic`">
        <transition name="fade" mode="out-in">
            <div class="content-main">
                <depsoit />
            </div>
        </transition>
    </div>
</template>

<script>
import depsoit from '@/router/mobile/components/common/mcenter/theme1/deposit';

export default {
    components: {
        depsoit
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

.content-main {
    position: relative;
    min-height: 683px;
    background-color: #EFEEEE;
}
</style>
