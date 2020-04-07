<template>
    <div
        ref="fixed"
        :class="className"
    >
        <div class="fixed-block">
            <slot />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import fixedJs from '@/lib/fixed';

/**
 * 共用元件 - Fixed
 * @param {String} className - 包裹 class 名稱
 */
export default {
    props: {
        className: {
            type: String,
            default: 'fixed-wrap'
        }
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd'
        })
    },
    mounted() {
        fixedJs(!this.isBackEnd, this.$refs.fixed);
    }
};
</script>
