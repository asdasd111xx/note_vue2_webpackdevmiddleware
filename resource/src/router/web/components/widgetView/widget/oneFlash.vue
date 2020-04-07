<template>
    <widget-container :is-new="!!widgetsInfo[currentIndex].newWidget">
        <div v-bind="getContainerStyle" @click="onClick">
            <object
                v-if="isFlash"
                v-bind="flashProps"
                type="application/x-shockwave-flash"
            >
                <param name="quality" value="high" />
            </object>
        </div>
    </widget-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import widgetContainer from './common/widgetContainer';

export default {
    components: {
        widgetContainer
    },
    props: {
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
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            cdnDomain: 'getCdnDomain',
            curLang: 'getCurLang'
        }),
        isFlash() {
            let detectFlashState;
            if (window.ActiveXObject) {
                try {
                    // eslint-disable-next-line
                    if (new ActiveXObject('ShockwaveFlash.ShockwaveFlash')) {
                        detectFlashState = true;
                    }
                } catch (e) {
                    detectFlashState = !!navigator.plugins['Shockwave Flash'];
                }
            }

            detectFlashState = !!navigator.plugins['Shockwave Flash'];
            return this.widgetsInfo[this.currentIndex].flash[this.curLang] && detectFlashState;
        },
        flashProps() {
            const { w, h, flash } = this.widgetsInfo[this.currentIndex];
            const imagePath = flash[this.curLang] ? `${this.cdnDomain}${flash[this.curLang]}` : '';

            return {
                data: imagePath,
                width: w,
                height: h,
                class: this.$style.flash
            };
        },
        getContainerStyle() {
            const {
                image,
                borderWidth,
                borderColor,
                rotate
            } = this.widgetsInfo[this.currentIndex];
            const defaultImg = this.isBackEnd ? '/static/image/element/widget/ui/preset_image.jpg' : '';
            const imagePath = image[this.curLang]
                ? this.cdnDomain + image[this.curLang]
                : defaultImg;
            const hasLink = this.widgetsInfo[this.currentIndex].linkType[this.curLang] !== 'nolink';

            return {
                class: [
                    this.$style.widget,
                    {
                        [this.$style['flash-box']]: !this.isBackEnd && this.isFlash,
                        [this.$style['has-link']]: !this.isBackEnd && hasLink
                    }
                ],
                style: {
                    'background-image': `url('${imagePath}')`,
                    border: `${borderWidth}px solid rgba(${borderColor.r}, ${borderColor.g}, ${borderColor.b}, ${borderColor.a})`,
                    transform: `rotate(${rotate}deg)`
                }
            };
        }
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        onClick() {
            if (this.isBackEnd) {
                return;
            }

            const curInfo = this.widgetsInfo[this.currentIndex];

            this.actionChangePage({
                type: curInfo.linkType[this.curLang],
                page: curInfo.linkTo[this.curLang],
                config: {
                    linkItem: curInfo.linkItem[this.curLang]
                }
            });
        }
    }
};
</script>

<style lang="scss" module>
.widget {
    background-size: 100% 100%;
    height: inherit;
    box-sizing: border-box;

    &.has-link {
        cursor: pointer;
    }

    &.flash-box {
        &:before {
            content: "";
            position: absolute;
            cursor: pointer;
            width: 100%;
            height: 100%;
        }
    }
}

.flash {
    width: 100%;
    height: 100%;
}
</style>
