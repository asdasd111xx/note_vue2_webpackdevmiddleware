<template>
    <main-wrap
        :key="element.i"
        :class="`is-${config.name}`"
        :element="element"
        :config="config"
    >
        <!-- 捕魚大廳版塊 -->
        <theme-default
            :config="config"
            :theme="element.theme"
            :self-store="$observables"
            :store-methods="fisharea.getMethods($observables)"
        />
    </main-wrap>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import config from './config';
import fisharea from './js/fisharea';
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
    subscriptions() {
        return cloneDeep(fisharea.props);
    },
    data() {
        return {
            config,
            fisharea
        };
    }
};
</script>
