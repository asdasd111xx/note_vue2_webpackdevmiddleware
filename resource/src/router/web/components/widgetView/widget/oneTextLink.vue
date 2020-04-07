<template>
    <widget-container :is-new="!!widgetsInfo[currentIndex].newWidget">
        <div
            :class="mainClass"
            :style="getContainerStyle"
            @click="onClick"
            @mouseover="isHover = true"
            @mouseleave="isHover = false"
        >
            {{ widgetsInfo[currentIndex].text[curLang] || $text('S_KEYIN_TEXT', '请输入文字') }}
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
    data() {
        return {
            isHover: false
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            curLang: 'getCurLang'
        }),
        mainClass() {
            const hasLink = this.widgetsInfo[this.currentIndex].linkType[this.curLang] !== 'nolink';
            return [
                this.$style.widget,
                {
                    [this.$style['has-link']]: !this.isBackEnd && hasLink
                }
            ];
        },
        getContainerStyle() {
            const {
                borderWidth, borderColor, textColor, textHover, fontSize, rotate, linkType
            } = this.widgetsInfo[this.currentIndex];
            const isPointer = linkType[this.curLang] !== 'nolink' ? 'pointer' : '';
            const nowTextColor = !this.isHover ? textColor : textHover;
            const resultFontSize = fontSize ? fontSize[this.curLang] : '16';

            return {
                border: `${borderWidth}px solid rgba(${borderColor.r}, ${borderColor.g}, ${borderColor.b}, ${borderColor.a})`,
                color: `rgba(${nowTextColor.r}, ${nowTextColor.g}, ${nowTextColor.b}, ${nowTextColor.a})`,
                'font-size': `${resultFontSize}px`,
                transform: `rotate(${rotate}deg)`,
                cursor: isPointer,
                'line-height': '30px'
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
    height: inherit;
    box-sizing: border-box;

    &.has-link {
        cursor: pointer;
    }

    p {
        line-height: normal;
    }
}
</style>
