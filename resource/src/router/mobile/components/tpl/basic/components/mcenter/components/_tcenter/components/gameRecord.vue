<template>
    <div class="content-main">
        <div v-if="headerConfigValue[$route.name].hasRouter">
            <top-links />
        </div>
        <transition name="fade" mode="out-in">
            <game-record :header-config.sync="headerConfigValue" />
        </transition>
    </div>
</template>

<script>
import gameRecord from '@/router/mobile/components/themeMcenter/gameRecord/';
import topLinks from './common/topLinks';

export default {
    components: {
        gameRecord,
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
