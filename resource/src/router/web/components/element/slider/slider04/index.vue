<template>
    <!-- 彩金與輪播圖版塊 -->
    <main-wrap
        :key="element.i"
        :class="`is-${config.name}`"
        :element="element"
        :config="config"
    >
        <theme-default :element="element" />
    </main-wrap>
</template>

<script>
import config from './config';

import themeDefault from './template/themeDefault';

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

<style lang="scss" scoped>
.slider-wrap {
    position: relative;
    padding-left: 214px;
}
</style>
