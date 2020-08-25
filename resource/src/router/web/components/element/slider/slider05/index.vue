<template>
    <!-- 輪播圖板塊 -->
    <main-wrap
        :key="element.i"
        :element="element"
        :class="`is-${config.name} theme-${element.theme}`"
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

<style lang="scss" scoped>
.theme-C {
    /deep/ {
        .content {
            width: auto !important;
        }
    }
}

.theme-B {
    /deep/ {
        .content {
            width: 960px !important;
        }
    }
}
</style>
