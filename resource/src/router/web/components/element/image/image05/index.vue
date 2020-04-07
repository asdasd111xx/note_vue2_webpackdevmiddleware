<template>
    <!-- 1+2 大小圖 -->
    <main-wrap
        :key="element.i"
        :element="element"
        :config="config"
        :class="`is-${config.name}`"
    >
        <theme-default :element="element" :config="config" />
    </main-wrap>
</template>

<script>
import config from './config';

import themeDefault from './theme/themeDefault';

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
            /**
             * @param {object} config - 模塊設定檔
             */
            config
        };
    }
};
</script>
