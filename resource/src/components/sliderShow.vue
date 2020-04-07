<template>
    <div :class="`${$style.wrap} wrap-${_uid}`">
        <swiper ref="swiper" :options="swiperOptions">
            <swiperSlide
                v-for="(slot, key) in resultSlides"
                :key="key"
                :class="$style['swiper-wrapper']"
            >
                <slot :name="key" />
            </swiperSlide>
        </swiper>
        <div v-if="navButton && Object.keys(resultSlides).length > 1" class="drag-cancel">
            <vue-draggable-resizable
                ref="vdr-prev"
                :class="$style['vdr-nav-btn']"
                :z="20"
                :w="prevBtn.w"
                :h="prevBtn.h"
                :x="prevBtn.x"
                :y="prevBtn.y"
                :min-width="20"
                :min-height="20"
                :max-width="200"
                :max-height="200"
                :on-drag-start="onDragStart"
                @dragging="() => { onNavBtnChange('vdr-prev', 'prevBtn') }"
                @resizing="() => { onNavBtnChange('vdr-prev', 'prevBtn') }"
            >
                <div :class="$style['btn-prev']" @click="() => { onSlideBtnClick(activeIndex - 1); }" />
            </vue-draggable-resizable>
            <vue-draggable-resizable
                ref="vdr-next"
                :class="$style['vdr-nav-btn']"
                :z="20"
                :w="nextBtn.w"
                :h="nextBtn.h"
                :x="nextBtn.x"
                :y="nextBtn.y"
                :min-width="20"
                :min-height="20"
                :max-width="200"
                :max-height="200"
                :on-drag-start="onDragStart"
                @dragging="() => { onNavBtnChange('vdr-next', 'nextBtn') }"
                @resizing="() => { onNavBtnChange('vdr-next', 'nextBtn') }"
            >
                <div :class="$style['btn-next']" @click="() => { onSlideBtnClick(activeIndex + 1); }" />
            </vue-draggable-resizable>
        </div>
        <div v-if="pagination && Object.keys(resultSlides).length" class="drag-cancel">
            <vue-draggable-resizable
                ref="vdr-pagination"
                :class="$style['vdr-nav-btn']"
                :z="20"
                :w="pagintaionBtn.w"
                :h="pagintaionBtn.h"
                :x="pagintaionBtn.x"
                :y="pagintaionBtn.y"
                :min-width="20"
                :min-height="20"
                :max-width="1000"
                :max-height="80"
                :on-drag-start="onDragStart"
                @dragging="() => { onNavBtnChange('vdr-pagination', 'pagintaionBtn') }"
                @resizing="() => { onNavBtnChange('vdr-pagination', 'pagintaionBtn') }"
            >
                <div :class="$style['swiper-pagination']">
                    <span
                        v-for="(slot, key, index) in resultSlides"
                        :key="key"
                        :class="[$style['swiper-pagination-bullet'], { [$style['swiper-pagination-bullet-active']]: index === activeIndex }]"
                        @click="() => { onSlideBtnClick(index); }"
                    />
                </div>
            </vue-draggable-resizable>
        </div>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .wrap-{{ _uid }} .{{ $style['btn-prev'] }} {
                background-image: url({{ $getCdnPath(cdnDomain + (prevBtn.image || '/image/element/widget/slider/default/n_arrow_l.png')) }});
            }

            .wrap-{{ _uid }} .{{ $style['btn-prev'] }}:hover {
                background-image: url({{ $getCdnPath(cdnDomain + (prevBtn.imageHover || prevBtn.image || '/image/element/widget/slider/default/n_arrow_l_over.png')) }});
            }

            .wrap-{{ _uid }} .{{ $style['btn-next'] }} {
                background-image: url({{ $getCdnPath(cdnDomain + (nextBtn.image || '/image/element/widget/slider/default/n_arrow_r.png')) }});
            }

            .wrap-{{ _uid }} .{{ $style['btn-next'] }}:hover {
                background-image: url({{ $getCdnPath(cdnDomain + (nextBtn.imageHover || nextBtn.image || '/image/element/widget/slider/default/n_arrow_r_over.png')) }});
            }

            .wrap-{{ _uid }} .{{ $style['swiper-pagination'] }} .{{ $style['swiper-pagination-bullet'] }} {
                background: rgba({{ pagintaionBtn.pageColor.r }}, {{ pagintaionBtn.pageColor.g }}, {{ pagintaionBtn.pageColor.b }}, {{ pagintaionBtn.pageColor.a }})
            }

            .wrap-{{ _uid }} .{{ $style['swiper-pagination'] }} .{{ $style['swiper-pagination-bullet'] }}.{{ $style['swiper-pagination-bullet-active'] }},
            .wrap-{{ _uid }} .{{ $style['swiper-pagination'] }} .{{ $style['swiper-pagination-bullet'] }}:hover {
                background: rgba({{ pagintaionBtn.pageCurrentColor.r }}, {{ pagintaionBtn.pageCurrentColor.g }}, {{ pagintaionBtn.pageCurrentColor.b }}, {{ pagintaionBtn.pageCurrentColor.a }})
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import _ from 'lodash';
import { swiper, swiperSlide } from 'vue-awesome-swiper';
import VueDraggableResizable from 'vue-draggable-resizable';

export default {
    components: {
        swiper,
        swiperSlide,
        VueDraggableResizable
    },
    props: {
        keyPrefix: {
            type: String,
            default: ''
        },
        curIndex: {
            type: Number,
            default: 0
        },
        autoplay: {
            type: Boolean,
            default: false
        },
        navButton: {
            type: Boolean,
            default: false
        },
        pagination: {
            type: Boolean,
            default: false
        },
        delay: {
            type: [Number, Array],
            default: 5
        },
        prevBtn: {
            type: Object,
            default: () => ({
                image: '',
                imageHover: '',
                w: 50,
                h: 50,
                x: 0,
                y: 0
            })
        },
        nextBtn: {
            type: Object,
            default: () => ({
                image: '',
                imageHover: '',
                w: 50,
                h: 50,
                x: 0,
                y: 0
            })
        },
        pagintaionBtn: {
            type: Object,
            default: () => ({
                w: 50,
                h: 50,
                x: 0,
                y: 0
            })
        },
        isDraggable: {
            type: Boolean,
            default: false
        }
    },
    data() {
        const autoplay = this.autoplay ? {
            delay: (this.delay[0] || this.delay) * 1000,
            stopOnLastSlide: false,
            disableOnInteraction: false
        } : false;

        return {
            slideIndex: 0,
            swiperOptions: {
                autoplay,
                allowTouchMove: false,
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev'
                },
                on: {
                    slideChangeTransitionStart: () => {
                        this.activeIndex = this.swiper.activeIndex;
                        if (_.isArray(this.delay)) {
                            this.swiper.params.autoplay.delay = this.delay[this.swiper.activeIndex] * 1000;
                        }
                    }
                }
            }
        };
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain'
        }),
        activeIndex: {
            get() {
                return this.slideIndex;
            },
            set(i) {
                this.$emit('update:curIndex', i);
                this.slideIndex = i;
            }
        },
        resultSlides() {
            return Object.keys(this.$slots).reduce((init, slotName) => {
                const reg = new RegExp(`^${this.keyPrefix}`);
                if (this.keyPrefix && !reg.test(slotName)) {
                    return init;
                }

                return {
                    ...init,
                    [slotName]: this.$slots[slotName]
                };
            }, {});
        },
        swiper() {
            return this.$refs.swiper.swiper;
        }
    },
    methods: {
        onNavBtnChange(ref, target) {
            this.$nextTick(() => {
                const curWidget = this.$refs[ref];
                const [x, y, w, h] = [curWidget.left, curWidget.top, curWidget.width, curWidget.height];

                this.$emit(`update:${target}`, {
                    ...this[target],
                    x,
                    y,
                    w,
                    h
                });
            });
        },
        onDragStart() {
            return this.isDraggable;
        },
        onSlideBtnClick(index) {
            if (index >= Object.keys(this.resultSlides).length) {
                this.swiper.slideTo(0);
                return;
            }

            if (index < 0) {
                this.swiper.slideTo(Object.keys(this.resultSlides).length - 1);
                return;
            }

            this.swiper.slideTo(index);
        }
    }
};
</script>


<style lang="scss" module>
.wrap {
    height: 100%;

    > :global(.swiper-container) {
        height: inherit;
    }

    .swiper-wrapper {
        height: inherit;
    }

    .vdr-nav-btn {
        border: none;
    }
}

.swiper-pagination {
    display: block;
    text-align: center;

    .swiper-pagination-bullet {
        display: inline-block;
        background: #CCC;
        margin: 0 6px;
        width: 12px;
        height: 12px;
        outline: none;
        border-radius: 100%;
        cursor: pointer;

        &.swiper-pagination-bullet-active {
            background: #007AFF;
        }
    }
}

.btn-prev,
.btn-next {
    height: inherit;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    cursor: pointer;
}
</style>
