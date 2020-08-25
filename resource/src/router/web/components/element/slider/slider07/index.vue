<template>
    <main-wrap
        :key="element.i"
        :class="`is-${config.name}`"
        :element="element"
        :config="config"
    >
        <!-- 3D透視輪播圖板塊 -->
        <theme-default
            v-if="isShow"
            :element="element"
            :config="config"
            :re-render="reRender"
        />
    </main-wrap>
</template>

<script>
import config from './config';
import themeDefault from './template/themeDefault';


/**
 * 3D透視輪播圖板塊
 * @module element/slider/slider07
 * @param {object} element - 模塊資料
 * @param {object} config - 模塊設定檔
 * @param {function} reRender - 重新渲染模塊方法
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
            config,
            isShow: true
        };
    },
    methods: {
        /**
         * 重新渲染元件
         * @method reRender
         */
        reRender() {
            this.isShow = false;

            this.$nextTick(() => {
                this.isShow = true;
            });
        }
    }
};
</script>
