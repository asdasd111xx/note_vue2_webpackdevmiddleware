<template>
    <div>
        <slot />
    </div>
</template>

<script>
/* global $ */
import '@/lib/slick';

export default {
    props: {
        options: {
            type: Object,
            default() {
                return {};
            }
        }
    },
    mounted() {
        this.create();
    },
    destroyed() {
        $(this.$el).slick('unslick');
    },
    methods: {
        create() {
            const $slick = $(this.$el);

            $slick.on('afterChange', this.onAfterChange);
            $slick.on('beforeChange', this.onBeforeChange);
            $slick.on('breakpoint', this.onBreakpoint);
            $slick.on('destroy', this.onDestroy);
            $slick.on('edge', this.onEdge);
            $slick.on('init', this.onInit);
            $slick.on('reInit', this.onReInit);
            $slick.on('setPosition', this.onSetPosition);
            $slick.on('swipe', this.onSwipe);
            $slick.on('lazyLoaded', this.onLazyLoaded);
            $slick.on('lazyLoadError', this.onLazyLoadError);
            $slick.slick(this.options);
        },
        destroy() {
            const $slick = $(this.$el);
            $slick.off('afterChange', this.onAfterChange);
            $slick.off('beforeChange', this.onBeforeChange);
            $slick.off('breakpoint', this.onBreakpoint);
            $slick.off('destroy', this.onDestroy);
            $slick.off('edge', this.onEdge);
            $slick.off('init', this.onInit);
            $slick.off('reInit', this.onReInit);
            $slick.off('setPosition', this.onSetPosition);
            $slick.off('swipe', this.onSwipe);
            $slick.off('lazyLoaded', this.onLazyLoaded);
            $slick.off('lazyLoadError', this.onLazyLoadError);
            $(this.$el).slick('unslick');
        },
        reSlick() {
            this.destroy();
            this.create();
        },
        next() {
            $(this.$el).slick('slickNext');
        },
        prev() {
            $(this.$el).slick('slickPrev');
        },
        pause() {
            $(this.$el).slick('slickPause');
        },
        play() {
            $(this.$el).slick('slickPlay');
        },
        goTo(index, dontAnimate) {
            $(this.$el).slick('slickGoTo', index, dontAnimate);
        },
        currentSlide() {
            return $(this.$el).slick('slickCurrentSlide');
        },
        add(element, index, addBefore) {
            $(this.$el).slick('slickAdd', element, index, addBefore);
        },
        remove(index, removeBefore) {
            $(this.$el).slick('slickRemove', index, removeBefore);
        },
        filter(filterData) {
            $(this.$el).slick('slickFilter', filterData);
        },
        unfilter() {
            $(this.$el).slick('slickUnfilter');
        },
        getOption(option) {
            $(this.$el).slick('slickGetOption', option);
        },
        setOption(option, value, refresh) {
            $(this.$el).slick('slickSetOption', option, value, refresh);
        },
        setPosition() {
            $(this.$el).slick('setPosition');
        },
        // Events
        onAfterChange(event, slickData, currentSlide) {
            this.$emit('afterChange', event, slickData, currentSlide);
        },
        onBeforeChange(event, slickData, currentSlide, nextSlide) {
            this.$emit('beforeChange', event, slickData, currentSlide, nextSlide);
        },
        onBreakpoint(event, slickData, breakpoint) {
            this.$emit('breakpoint', event, slickData, breakpoint);
        },
        onDestroy(event, slickData) {
            this.$emit('destroy', event, slickData);
        },
        onEdge(event, slickData, direction) {
            this.$emit('edge', event, slickData, direction);
        },
        onInit(event, slickData) {
            this.$emit('init', event, slickData);
        },
        onReInit(event, slickData) {
            this.$emit('reInit', event, slickData);
        },
        onSetPosition(event, slickData) {
            this.$emit('setPosition', event, slickData);
        },
        onSwipe(event, slickData, direction) {
            this.$emit('swipe', event, slickData, direction);
        },
        onLazyLoaded(event, slickData, image, imageSource) {
            this.$emit('lazyLoaded', event, slickData, image, imageSource);
        },
        onLazyLoadError(event, slickData, image, imageSource) {
            this.$emit('lazyLoadError', event, slickData, image, imageSource);
        }
    }
};
</script>
