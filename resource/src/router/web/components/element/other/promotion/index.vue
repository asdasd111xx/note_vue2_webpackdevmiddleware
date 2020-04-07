<template>
    <!-- 優惠活動版塊 -->
    <main-wrap
        :key="element.i"
        :class="`is-${config.name}`"
        :element="element"
        :config="config"
        :on-ready="onReady"
    >
        <template v-if="isReady">
            <theme-default :element="element" :config="config" />
        </template>
    </main-wrap>
</template>

<script>
import config from './config';
import themeDefault from './template/themeDefault';
import mainWrap from './components/mainWrap';

export default {
    components: {
        themeDefault,
        mainWrap
    },
    props: {
        element: {
            type: Object,
            default: null
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
