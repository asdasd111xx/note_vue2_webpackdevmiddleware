<template>
    <widget-container :is-new="!!widgetsInfo[currentIndex].newWidget">
        <!-- eslint-disable vue/no-v-html -->
        <div
            :class="mainClass"
            :style="getContainerStyle()"
            @click="onClick"
            v-html="content"
        />
        <!-- eslint-enable vue/no-v-html -->
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
            curLang: 'getCurLang'
        }),
        content() {
            const html = this.widgetsInfo[this.currentIndex].text[this.curLang];
            if (this.isBackEnd && html.replace(/(<([^>]+)>)/ig, '').trim() === '') {
                return `<p>${this.$text('S_KEYIN_TEXT', '请输入文字')}</p>`;
            }
            return html;
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
        getContainerStyle() {
            const { borderWidth, borderColor, rotate } = this.widgetsInfo[this.currentIndex];

            return {
                border: `${borderWidth}px solid rgba(${borderColor.r}, ${borderColor.g}, ${borderColor.b}, ${borderColor.a})`,
                transform: `rotate(${rotate}deg)`
            };
        },
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
