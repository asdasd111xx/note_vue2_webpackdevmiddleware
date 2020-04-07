<template>
    <div class="content-main">
        <div v-if="headerConfigValue[$route.name].hasRouter">
            <top-links />
        </div>
        <transition name="fade" mode="out-in">
            <management :header-config.sync="headerConfigValue" />
        </transition>
    </div>
</template>

<script>
import management from '@/router/mobile/components/themeMcenter/management/';
import topLinks from './common/topLinks';

export default {
    components: {
        management,
        topLinks
    },
    props: {
        headerConfig: {
            type: Object,
            default: null
        }
    },
    computed: {
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

<style lang="scss" scoped>
.content-main {
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
}
</style>
