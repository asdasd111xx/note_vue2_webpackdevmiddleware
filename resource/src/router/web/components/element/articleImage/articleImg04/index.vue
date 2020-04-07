<template>
    <main-wrap
        :key="element.i"
        :class="`is-${config.name}`"
        :element="element"
        :config="config"
        :on-ready="onReady"
    >
        <template v-if="isReady">
            <!-- 營銷圖文板塊 -->
            <theme-default :element="element" :config="config" />
        </template>
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
            config,
            isReady: false
        };
    },
    methods: {
        onReady() {
            this.isReady = true;
        }
    }
};
</script>
