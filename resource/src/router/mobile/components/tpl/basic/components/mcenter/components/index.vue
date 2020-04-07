<template>
    <div :class="`mcenter-wrap theme-basic`">
        <mcenter-header />
        <transition name="fade" mode="out-in">
            <router-view :header-config.sync="headerConfigValue" />
        </transition>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        mcenterHeader: () => import(/* webpackChunkName: 'mcenterHeader' */'@/router/mobile/components/common/mcenter/theme1/header')
    },
    props: {
        headerConfig: {
            type: Object,
            default: null
        }
    },
    computed: {
        ...mapGetters({
            siteConfig: 'getSiteConfig'
        }),
        headerConfigValue: {
            get() {
                return this.headerConfig;
            },
            set(value) {
                this.$emit('update:headerConfig', value);
            }
        }
    }
};
</script>


<style lang="scss">
@import '~@/css/variable.scss';

.mcenter-wrap {
    position: relative;
    width: 100%;
    min-height: calc(100vh - 121px);
    margin: 0 auto;
    padding-top: 0;
    background: #292929;
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
