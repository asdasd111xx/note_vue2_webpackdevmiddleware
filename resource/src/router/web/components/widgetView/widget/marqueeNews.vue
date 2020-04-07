<template>
    <widget-container :is-new="!!widgetsInfo[currentIndex].newWidget">
        <div
            :class="[$style['news-content-box'], $style[`direction-${direction}`]]"
            :style="getContainerStyle()"
            @mouseenter="isHover = true"
            @mouseleave="isHover = false"
        >
            <news
                :key="`direction-${direction}`"
                :style="getNewsStyle()"
                :speed="speed"
                :direction="direction"
            />
        </div>
    </widget-container>
</template>

<script>
/**
 * 小部件 - 最新消息
 * @param {Number} currentIndex - 部件序號
 * @param {Array} widgetsInfo - 模塊資訊
 * @param {Function} updateInfo - 更新定位 (此部件無需求使用)
 */

import { mapGetters } from 'vuex';
import widgetContainer from './common/widgetContainer';
import news from '../../common/news';

export default {
    components: {
        widgetContainer,
        news
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
            curLang: 'getCurLang'
        }),
        speed() {
            return +this.widgetsInfo[this.currentIndex].speed[this.curLang];
        },
        direction() {
            return this.widgetsInfo[this.currentIndex].direction[this.curLang];
        }
    },
    methods: {
        /**
         * 設定部件邊框、旋轉樣式
         * @returns {Object} 邊框、旋轉 css 樣式
         */
        getContainerStyle() {
            const { borderWidth, borderColor, rotate } = this.widgetsInfo[this.currentIndex];

            return {
                border: `${borderWidth}px solid rgba(${borderColor.r}, ${borderColor.g}, ${borderColor.b}, ${borderColor.a})`,
                transform: `rotate(${rotate}deg)`
            };
        },
        /**
         * 設定部件文字樣式
         * @returns {Object} 文字 css 樣式
         */
        getNewsStyle() {
            const widgetsInfo = this.widgetsInfo[this.currentIndex];
            const setColor = widgetsInfo.color[this.curLang];
            const setColorhover = widgetsInfo.colorHover[this.curLang];
            const color = (this.isHover) ? setColorhover : setColor;

            return {
                'line-height': (['left', 'right'].includes(widgetsInfo.direction[this.curLang])) ? `${widgetsInfo.h}px` : `${widgetsInfo.fontSize[this.curLang]}px`,
                color: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
                'font-size': `${widgetsInfo.fontSize[this.curLang]}px`
            };
        }
    }
};
</script>

<style lang="scss" module>
.widget {
    background-size: 100% 100%;
    height: inherit;
    box-sizing: border-box;
}

.news-content-box {
    position: relative;
    height: inherit;

    :global(.news-content-wrap) {
        height: inherit;
    }
    :global(.news-content) {
        height: inherit;
    }

    &.direction-up,
    &.direction-down {
        :global(.news-content) {
            white-space: normal;
        }
    }
}
</style>
