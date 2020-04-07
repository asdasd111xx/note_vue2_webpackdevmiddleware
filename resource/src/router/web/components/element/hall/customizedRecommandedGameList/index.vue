<template>
    <!-- 廳主推薦模塊 -->
    <main-wrap
        :key="element.i"
        :class="`is-${config.name}`"
        :element="element"
        :config="config"
        :on-ready="onReady"
    >
        <theme-default
            v-if="!isBackEnd && isReady"
            :element="element"
            :config="config"
            :self-store="$observables"
            :store-methods="games.getMethods($observables, $root)"
        />
        <!-- 前台網站設置不現實預設游戲，僅顯示提示語 -->
        <div v-else class="reminder">
            <p>{{ $t('S_CUSTOMIZED_GAMELIST_REMINDER_1', memInfo.config.lang || 'zh-cn') }}</p>
            <p>{{ $t('S_CUSTOMIZED_GAMELIST_REMINDER_2', memInfo.config.lang || 'zh-cn') }}。</p>
        </div>
    </main-wrap>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import { mapGetters } from 'vuex';
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
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            memInfo: 'getMemInfo'
        })
    },
    methods: {
        onReady() {
            this.isReady = true;
        }
    }
};
</script>

<style lang="scss" scoped>
.reminder {
    color: #F9BF44;
    height: 145px;
    padding-top: 40px;
    text-align: center;

    p {
        margin: 0;
        line-height: 36px;
    }
}
</style>
