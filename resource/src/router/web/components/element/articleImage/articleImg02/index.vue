<template>
    <!-- 純文本與多圖版塊 -->
    <main-wrap
        :key="element.i"
        :class="`is-${config.name}`"
        :element="element"
        :config="config"
    >
        <theme-default :element="element" :config="config" />
    </main-wrap>
</template>

<script>
import config from './config';
import themeDefault from './template/themeDefault';


/**
 * 多圖版塊主要外框
 * @module element/articleImage/index
 * @param {object} config - 模塊設定檔
 * @param {object} element - 模塊資料
 */
export default {
    components: {
        themeDefault,
        mainWrap: () => import(/* webpackChunkName: 'mainWrap' */'../../common/new/mainWrap')
    },
    props: {
        element: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            config
        };
    }
};
</script>
