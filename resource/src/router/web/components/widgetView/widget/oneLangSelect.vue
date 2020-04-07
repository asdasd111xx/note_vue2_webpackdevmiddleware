<template>
    <widget-container :is-new="!!widgetsInfo[currentIndex].newWidget">
        <div :class="$style['lang-wrap']">
            <div
                :class="[$style['lang-current'], 'clearfix']"
                :style="getContainerStyle"
                @click="isShow = !isShow"
            >
                <div :class="mainClass(curLang)">
                    <img :src="`/static/image/lang/flag/${widgetsInfo[currentIndex].shape[curLang]}/${widgetsInfo[currentIndex].pattern[curLang]}/${curLang.split('-')[1] || curLang}.png`" />
                </div>
                <div :class="$style['lang-title']">{{ lang[curLang] }}</div>
            </div>
            <transition name="slide-down">
                <div
                    v-if="isShow"
                    :class="[$style['lang-select']]"
                    :style="getSeclectStyle"
                >
                    <template v-for="langInfo in resultLang">
                        <div
                            :key="langInfo.type"
                            :class="[$style['lang-box'], 'clearfix']"
                            :style="isTypeHover === langInfo.type ? fontHoverStyle : ''"
                            @mouseenter="isTypeHover = langInfo.type"
                            @mouseleave="isTypeHover = ''"
                            @click="setLanguage(langInfo.type)"
                        >
                            <div :class="mainClass(langInfo.type)">
                                <img :src="`/static/image/lang/flag/${widgetsInfo[currentIndex].shape[curLang]}/${widgetsInfo[currentIndex].pattern[curLang]}/${langInfo.type.split('-')[1] || langInfo.type}.png`" />
                            </div>
                            <div :class="$style['lang-title']">{{ langInfo.name }}</div>
                        </div>
                    </template>
                </div>
            </transition>
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
            isShow: false,
            isTypeHover: ''
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            curLang: 'getCurLang',
            lang: 'getLang',
            cdnDomain: 'getCdnDomain'
        }),
        resultLang() {
            const allLanguage = ['zh-tw', 'zh-cn', 'en', 'ja', 'vi'];
            return allLanguage
                .filter((langType) => this.lang[langType])
                .map((langType) => ({ type: langType, name: this.lang[langType] }));
        },
        getContainerStyle() {
            const {
                borderWidth, borderColor, rotate, fontColor, bgColor, image
            } = this.widgetsInfo[this.currentIndex];
            const bgImg = image[this.curLang]
                ? this.cdnDomain + image[this.curLang]
                : '/static/image/element/widget/ui/arrowdown_icon.png';

            return {
                border: `${borderWidth}px solid rgba(${borderColor.r}, ${borderColor.g}, ${borderColor.b}, ${borderColor.a})`,
                transform: `rotate(${rotate}deg)`,
                color: `rgba(${fontColor.r}, ${fontColor.g}, ${fontColor.b}, ${fontColor.a})`,
                'background-color': `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a})`,
                'background-image': `url(${this.$getCdnPath(bgImg)})`,
                'background-position': image[this.curLang] ? '100% 0' : '94% 10px',
                'background-repeat': 'no-repeat'
            };
        },
        getSeclectStyle() {
            const {
                borderWidth, borderColor, fontColor, bgColor
            } = this.widgetsInfo[this.currentIndex];

            return {
                'border-style': 'solid',
                'border-color': `rgba(${borderColor.r}, ${borderColor.g}, ${borderColor.b}, ${borderColor.a})`,
                'border-width': `0 ${borderWidth}px ${borderWidth}px ${borderWidth}px`,
                color: `rgba(${fontColor.r}, ${fontColor.g}, ${fontColor.b}, ${fontColor.a})`,
                'background-color': `rgba(${bgColor.r}, ${bgColor.g}, ${bgColor.b}, ${bgColor.a})`
            };
        },
        fontHoverStyle() {
            const color = this.widgetsInfo[this.currentIndex].fontHoverColor;

            return {
                color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
            };
        }
    },
    methods: {
        ...mapActions([
            'actionChangePage',
            'actionSetLang'
        ]),
        setLanguage(targetLang) {
            if (this.isBackEnd || this.curLang === targetLang) {
                return;
            }
            this.actionSetLang(targetLang);
        },
        mainClass(lang) {
            return [
                this.$style['lang-icon'],
                this.$style[this.widgetsInfo[this.currentIndex].shape[this.curLang]],
                lang
            ];
        }
    }
};
</script>

<style lang="scss" module>
.lang-wrap {
    position: relative;
}

.lang-current {
    padding: 0 6px;
    cursor: pointer;
}

.lang-icon {
    display: inline-block;
    vertical-align: middle;
    width: 20px;
    height: 20px;
    margin-right: 6px;
    cursor: pointer;
    background-repeat: no-repeat;
    background-size: cover;

    img {
        display: block;
        width: inherit;
        height: inherit;
    }
}

.lang-title {
    display: inline-block;
    vertical-align: middle;
    font-size: 15px;
}

.lang-select {
    position: absolute;
    z-index: 2;
    box-sizing: border-box;
    width: 100%;
    padding: 0 6px;
    left: 0;
}

.lang-box {
    cursor: pointer;
}

.square {
    height: 14px;
}
</style>
