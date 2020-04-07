<template>
    <div
        v-show="isReady"
        ref="side-wrap"
        :class="`float-side-wrap side-${side}`"
    >
        <div
            v-for="(item, index) in floatItems"
            :ref="`item-${index}`"
            :key="index"
            class="item-box clearfix"
        >
            <floating-type1
                v-if="item.theme === '1'"
                :item-index="index"
                :item-data="item"
                :float-side="side"
                @onReady="onChildReady"
            />
            <floating-type2
                v-if="item.theme === '2'"
                :item-index="index"
                :item-data="item"
                :float-side="side"
                @onReady="onChildReady"
            />
            <floating-type3
                v-if="item.theme === '3'"
                :item-index="index"
                :item-data="item"
                :float-side="side"
                @onReady="onChildReady"
            />
        </div>
    </div>
</template>

<script>
/* global $ */
import { mapGetters } from 'vuex';

export default {
    components: {
        floatingType1: () => import(/* webpackChunkName: 'floatingType1' */'./theme/floatingType1.vue'),
        floatingType2: () => import(/* webpackChunkName: 'floatingType2' */'./theme/floatingType2.vue'),
        floatingType3: () => import(/* webpackChunkName: 'floatingType3' */'./theme/floatingType3.vue')
    },
    props: {
        floatItems: {
            type: Array,
            default: () => []
        },
        side: {
            type: String,
            required: true
        }
    },
    data() {
        return {
            floatTop: 150,
            topInfo: [],
            isChildReady: this.floatItems.map(() => false)
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            floatEditStyleState: 'getFloatEditStyleState'
        }),
        isReady() {
            return this.isFloatingShow && this.isChildReady.every((isReady) => isReady);
        },
        isFloatingShow() {
            return this.isBackEnd ? this.floatEditStyleState : true;
        }
    },
    watch: {
        // eslint-disable-next-line
        isReady() {
            this.topInfo = this.floatItems.map((info, index) => {
                if (index === 0) {
                    return 0;
                }
                $(this.$refs['side-wrap']).css('display', 'block');
                return $(this.$refs[`item-${index - 1}`]).height();
            });
            this.onScroll();
        }
    },
    created() {
        window.addEventListener('scroll', this.onScroll);
    },
    destroyed() {
        window.removeEventListener('scroll', this.onScroll);
    },
    methods: {
        onScroll() {
            const doc = document.documentElement;
            const top = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
            let itemTop = this.floatTop;

            this.topInfo.forEach((topPx, index) => {
                itemTop += topPx;
                this.$refs[`item-${index}`][0].style.top = `${itemTop + top}px`;
            });
        },
        onChildReady(itemIndex) {
            this.isChildReady = this.isChildReady.map((isReady, index) => {
                if (itemIndex === index) {
                    return true;
                }

                return isReady;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import '~@/css/variable.scss';

.float-side-wrap {
    display: none;
    overflow:hidden;

    .item-box {
        position: absolute;
        z-index: 100;
        transition: top 1s ease;
    }

    .mobile-show & {
        display: block;
    }

    &.side-left {
        .item-box {
            left: 0;
        }
    }

    &.side-right {
        .item-box {
            right: 0;
        }
    }

}

@media screen and (min-width: $pad + $sidebar) {
    .float-side-wrap {
        display: block;
    }
}
</style>
