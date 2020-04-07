<template>
    <!-- 自訂連結與純圖版塊 -->
    <main-wrap
        :key="element.i"
        :class="`is-${config.name}`"
        :element="element"
        :config="config"
    >
        <theme-default
            :element="element"
            :config="config"
        />
    </main-wrap>
</template>

<script>
import config from './config';
import themeDefault from './template/themeDefault';

export default {
    components: {
        themeDefault,
        mainWrap: () => import(/* webpackChunkName: 'mainWrap' */'../../common/new/mainWrap')
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
