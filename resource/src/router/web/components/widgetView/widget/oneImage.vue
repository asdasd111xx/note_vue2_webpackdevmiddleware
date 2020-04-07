<template>
    <widget-container :is-new="!!widgetsInfo[currentIndex].newWidget">
        <div
            :class="mainClass"
            :style="getContainerStyle"
            @click="onClick"
            @mouseenter="isHover = true"
            @mouseleave="isHover = false"
        />
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
    data() {
        return {
            isHover: false
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            cdnDomain: 'getCdnDomain',
            curLang: 'getCurLang'
        }),
        getContainerStyle() {
            const {
                image,
                imageHover,
                borderWidth,
                borderColor,
                rotate
            } = this.widgetsInfo[this.currentIndex];
            const defaultImg = this.isBackEnd ? '/static/image/element/widget/ui/preset_image.jpg' : '';
            let imagePath = image[this.curLang]
                ? this.cdnDomain + image[this.curLang]
                : defaultImg;

            if (this.isHover && imageHover[this.curLang]) {
                imagePath = this.cdnDomain + imageHover[this.curLang];
            }

            return {
                'background-image': `url('${imagePath}')`,
                border: `${borderWidth}px solid rgba(${borderColor.r}, ${borderColor.g}, ${borderColor.b}, ${borderColor.a})`,
                transform: `rotate(${rotate}deg)`
            };
        },
        mainClass() {
            const hasLink = this.widgetsInfo[this.currentIndex].linkType[this.curLang] !== 'nolink';

            return [
                this.$style.widget,
                {
                    [this.$style['has-link']]: !this.isBackEnd && hasLink
                }
            ];
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
}
</style>
