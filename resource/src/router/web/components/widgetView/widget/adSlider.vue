<template>
    <widget-container :is-new="!!widgetsInfo[currentIndex].newWidget">
        <slider-show
            :key="widgetsInfo[currentIndex].slides[curLang].length"
            :class="slideClass"
            :autoplay="true"
            :nav-button="widgetsInfo[currentIndex].navBtn === 'Y'"
            :pagination="widgetsInfo[currentIndex].pageBtn === 'Y'"
            :delay="widgetsInfo[currentIndex].slides[curLang].map(info => +info.delay)"
            :prev-btn.sync="prevBtn"
            :next-btn.sync="nextBtn"
            :pagintaion-btn.sync="pagintaionBtn"
            :is-draggable="isActive"
            :cur-index.sync="curIndex"
        >
            <div
                v-for="(slide, index) in widgetsInfo[currentIndex].slides[curLang]"
                :key="index"
                :slot="`swiper-${index}`"
                :class="$style['slider-content']"
                @click="onSlideClick"
            >
                <img v-if="!!slide.image" :src="cdnDomain + slide.image" />
                <img v-else-if="isBackEnd" src="/static/image/element/widget/ui/preset_image.jpg" />
            </div>
        </slider-show>
    </widget-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import sliderShow from '@/components/sliderShow';
import widgetContainer from './common/widgetContainer';

export default {
    components: {
        sliderShow,
        widgetContainer
    },
    props: {
        isActive: {
            type: Boolean,
            default: false
        },
        currentIndex: {
            type: Number,
            required: true
        },
        widgetsInfo: {
            type: Array,
            default: () => []
        },
        updateInfo: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            curIndex: 0
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            curLang: 'getCurLang',
            cdnDomain: 'getCdnDomain'
        }),
        slideClass() {
            try {
                return [
                    this.$style['slide-wrap'],
                    {
                        [this.$style['has-link']]: this.widgetsInfo[this.currentIndex].slides[this.curLang][this.curIndex].linkType !== 'nolink'
                    }
                ];
            } catch (error) {
                return this.$style['slide-wrap'];
            }
        },
        prevBtn: {
            get() {
                const info = this.widgetsInfo[this.currentIndex];
                return {
                    w: +info.prevW,
                    h: +info.prevH,
                    x: +info.prevX,
                    y: +info.prevY,
                    image: info.prevImage,
                    imageHover: info.prevImageHover
                };
            },
            set(value) {
                this.updateInfo({
                    prevX: value.x,
                    prevY: value.y,
                    prevW: value.w,
                    prevH: value.h
                });
            }
        },
        nextBtn: {
            get() {
                const info = this.widgetsInfo[this.currentIndex];
                return {
                    w: +info.nextW,
                    h: +info.nextH,
                    x: +info.nextX,
                    y: +info.nextY,
                    image: info.nextImage,
                    imageHover: info.nextImageHover
                };
            },
            set(value) {
                this.updateInfo({
                    nextX: value.x,
                    nextY: value.y,
                    nextW: value.w,
                    nextH: value.h
                });
            }
        },
        pagintaionBtn: {
            get() {
                const info = this.widgetsInfo[this.currentIndex];
                return {
                    w: +info.pageW,
                    h: +info.pageH,
                    x: +info.pageX,
                    y: +info.pageY,
                    pageColor: info.pageColor,
                    pageCurrentColor: info.pageCurrentColor
                };
            },
            set(value) {
                this.updateInfo({
                    pageX: value.x,
                    pageY: value.y,
                    pageW: value.w,
                    pageH: value.h
                });
            }
        }
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        onSlideClick() {
            if (this.isBackEnd) {
                return;
            }

            const curInfo = this.widgetsInfo[this.currentIndex].slides[this.curLang][this.curIndex];

            this.actionChangePage({
                type: curInfo.linkType,
                page: curInfo.linkTo,
                config: {
                    linkItem: curInfo.linkItem
                }
            });
        }
    }
};
</script>

<style lang="scss" module>
.widget {
    height: inherit;
    box-sizing: border-box;

    p {
        line-height: normal;
    }
}

.slide-wrap {
    &.has-link {
        cursor: pointer;
    }
}

.slider-content {
    width: 100%;
    height: inherit;

    &.has-link {
        cursor: pointer;
    }

    img {
        width: inherit;
        height: inherit;
    }
}
</style>
