<template>
    <div :class="containerClass">
        <slot />
        <transition name="fade">
            <div v-if="isNew" class="mask" />
        </transition>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        isNew: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd'
        }),
        containerClass() {
            return [
                'widget-container',
                {
                    'is-backend': this.isBackEnd
                }
            ];
        }
    }
};
</script>

<style lang="scss" scoped>
.widget-container {
    border: 1px dashed transparent;
    width: 100%;
    height: 100%;
    box-sizing: content-box;
    user-select: none;
    transition: border .8s;

    &.is-backend:hover {
        border: 1px dashed rgba(204, 204, 204, .6);
    }

    .mask {
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        z-index: 20;
        background-color: #C66;
        opacity: .8;
    }
}
</style>
