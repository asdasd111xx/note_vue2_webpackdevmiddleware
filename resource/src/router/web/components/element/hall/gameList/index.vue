<template>
    <!-- 自訂遊戲版塊 -->
    <main-wrap
        :key="element.i"
        :class="`is-${config.name}`"
        :element="element"
        :config="config"
        :on-ready="onReady"
    >
        <theme-default
            v-if="isReady"
            :element="element"
            :config="config"
            :self-store="$observables"
            :store-methods="games.getMethods($observables, $root)"
        />
    </main-wrap>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import config from './config';
import games from './js/games';
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
        return cloneDeep(games.props);
    },
    data() {
        return {
            config,
            games,
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
