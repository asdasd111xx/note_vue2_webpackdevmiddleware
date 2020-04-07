<template>
    <!-- 大圖與小圖板塊 -->
    <main-wrap
        :key="element.i"
        :element="element"
        :config="config"
    >
        <!-- 主題內容 -->
        <theme-default :element="element" :config="config" />
    </main-wrap>
</template>

<script>
import config from './config';
import themeDefault from './template/themeDefault';


/**
 * 共用模塊主要外框
 * @module element/image/index
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
            /**
             * @param {object} config - 模塊設定檔
             */
            config
        };
    }
};
</script>
