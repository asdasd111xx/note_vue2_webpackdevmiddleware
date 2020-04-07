<template>
    <!-- 麻將大廳模塊 -->
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
import elementDefault from '@/config/elementDefault';
import config from './config';
import themeDefault from './template/themeDefault';
import mainWrap from '../../common/new/mainWrap';

export default {
    components: {
        mainWrap,
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
            elementDefault,
            config
        };
    }
};
</script>
