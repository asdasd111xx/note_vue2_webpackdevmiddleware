<template>
    <div
        ref="marquee-container"
        :class="$style['marquee-container']"
        @mouseleave="leavePlay"
        @mouseenter="enterPause"
        @click="togglePopup"
    >
        <div
            ref="marquee-mainbox"
            :class="[$style['marquee-content'], {[$style['is-horizontal']] : !isVertical}]"
        >
            <span
                v-for="item in data"
                :key="item.id"
                ref="marquee-text"
                @click="onCustomEvent($event, item)"
            >
                {{ item.content }} &nbsp;&nbsp;&nbsp;&nbsp;
            </span>
        </div>
    </div>
</template>

<script>
import anime from 'animejs/lib/anime.es';
import isMobile from '@/lib/is_mobile';

export default {
    props: {
        duration: {
            type: Number,
            required: true
        },
        data: {
            type: Array,
            required: true
        },
        direction: {
            type: String,
            required: true
        },
        viewFullContent: {
            type: Boolean,
            default: true
        },
        togglePopup: {
            type: Function,
            default: () => {}
        },
        customEvent: {
            type: Function,
            default: null
        }
    },
    data() {
        return {
            animation: '',
            elWidth: '',
            elHeight: '',
            totalWidth: '',
            totalHeight: ''
        };
    },
    computed: {
        isVertical() {
            return ['up', 'down'].includes(this.direction);
        }
    },
    mounted() {
        this.init();
        this.initAnime();
    },
    methods: {
        enterPause() {
            if (!this.viewFullContent || isMobile()) {
                return;
            }
            this.animation.pause();
        },
        leavePlay() {
            if (!this.viewFullContent || isMobile()) {
                return;
            }
            this.animation.play();
        },
        init() {
            const { width, height } = this.$refs['marquee-container'].getBoundingClientRect();
            const newsElement = this.$refs['marquee-mainbox'];
            const directionList = {
                left: 'right',
                right: 'left',
                down: 'top',
                up: 'bottom'
            };

            this.elWidth = width;
            this.elHeight = height;
            this.totalWidth = this.$refs['marquee-text'].reduce((pre, next) => pre + next.offsetWidth, 0);
            this.totalHeight = newsElement.offsetHeight;
            newsElement.style[directionList[this.direction]] = `-${this.isVertical ? this.totalHeight : this.totalWidth}px`;

            if (!this.isVertical) {
                newsElement.style.width = `${this.totalWidth}px`;
            }
        },
        initAnime() {
            const distance = this.isVertical ? this.totalHeight + this.elHeight : this.totalWidth + this.elWidth;
            const reverseDirection = ['left', 'up'].includes(this.direction) ? -1 : 1;

            this.animation = anime({
                targets: this.$refs['marquee-mainbox'],
                duration: this.duration * distance,
                autoplay: true,
                loop: true,
                easing: 'linear',
                translateX: this.isVertical ? 0 : distance * reverseDirection,
                translateY: this.isVertical ? distance * reverseDirection : 0
            });
        },
        onCustomEvent(e, info) {
            if (!this.customEvent) {
                return;
            }

            e.stopPropagation();
            this.togglePopup(info);
        }
    }
};
</script>

<style lang="scss" module>
.marquee-container {
    height: 100%;
    position: relative;
    overflow: hidden;
    cursor: pointer;

    .marquee-content {
        position: absolute;

        &.is-horizontal {
            white-space: nowrap;
        }
    }

    img {
        vertical-align: middle;
    }
}
</style>
