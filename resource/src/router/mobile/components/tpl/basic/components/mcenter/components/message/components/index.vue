<template>
    <div :class="`mcenter-wrap theme-basic`">
        <mcenter-header :header-setting="headerSetting" />
        <transition name="fade" mode="out-in">
            <div class="content-main">
                <message />
            </div>
        </transition>
    </div>
</template>

<script>
import mcenterHeader from '@/router/mobile/components/common/mcenter/theme1/header';
import message from '@/components/mcenter/components/message';

export default {
    components: {
        message,
        mcenterHeader
    },
    data() {
        return {
            headerSetting: {
                title: this.$text('S_MEM_CENTER', '会员中心'),
                leftBtns: {
                    icon: 'arrow',
                    onClick: () => this.$router.push('/mobile/mcenter')
                }
            }
        };
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
    padding: 20px 0 50px;
}
</style>
