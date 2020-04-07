<template>
    <!-- 4+1大小圖 -->
    <main-wrap
        :key="element.i"
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
 * 共用模塊主要外框
 * @module element/image/index
 * @param {object} element - 模塊資料
 */
export default {
    components: {
        mainWrap: () => import(/* webpackChunkName: 'mainWrap' */'../../common/new/mainWrap'),
        themeDefault
    },
    props: {
        element: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            config
        };
    }
};
</script>
