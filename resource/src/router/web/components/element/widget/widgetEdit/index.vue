<template>
    <transition
        name="widget-edit"
        enter-active-class="fadeIn"
        leave-active-class="fadeOut"
    >
        <div class="widget-edit-wrap clearfix">
            <component
                :is="status.type"
                :key="`widget-${selectedIndex}`"
                v-bind="{ selectedIndex, caseData, status, updateCase }"
            >
                <!-- 左側 icon 控制項 -->
                <side-control slot="side-control" v-bind="{ caseData, status, updateIndex, updateCase, widgetRefs }" />
                <!-- 層級調整 -->
                <field-z-index slot="field-z-index" v-bind="{ caseData, status, updateIndex, updateCase, widgetRefs }" />
                <!-- 座標及大小 -->
                <field-vector slot="field-vector" v-bind="{ caseData, status, updateCase, widgetRefs }" />
                <!-- 區塊相關設定 -->
                <field-box slot="field-box" v-bind="{ caseData, status, updateCase }" />
            </component>
        </div>
    </transition>
</template>

<script>
export default {
    components: {
        sideControl: () => import(/* webpackChunkName: 'sideControl' */'./fields/sideControl'),
        fieldZIndex: () => import(/* webpackChunkName: 'fieldZIndex' */'./fields/fieldZIndex'),
        fieldVector: () => import(/* webpackChunkName: 'fieldVector' */'./fields/fieldVector'),
        fieldBox: () => import(/* webpackChunkName: 'fieldBox' */'./fields/fieldBox'),
        oneImage: () => import(/* webpackChunkName: 'oneImage' */'./form/oneImage'),
        oneFlash: () => import(/* webpackChunkName: 'oneFlash' */'./form/oneFlash'),
        oneText: () => import(/* webpackChunkName: 'oneText' */'./form/oneText'),
        oneTextLink: () => import(/* webpackChunkName: 'oneTextLink' */'./form/oneTextLink'),
        oneLang: () => import(/* webpackChunkName: 'oneLang' */'./form/oneLang'),
        oneLangSelect: () => import(/* webpackChunkName: 'oneLangSelect' */'./form/oneLangSelect'),
        oneJackpot: () => import(/* webpackChunkName: 'oneJackpot' */'./form/oneJackpot'),
        adSlider: () => import(/* webpackChunkName: 'adSlider' */'./form/adSlider/'),
        marqueeNews: () => import(/* webpackChunkName: 'marqueeNews' */'./form/marqueeNews'),
        siteCopyright: () => import(/* webpackChunkName: 'siteCopyright' */'./form/siteCopyright'),
        formLoginAccount: () => import(/* webpackChunkName: 'formLoginAccount' */'./form/formLoginAccount'),
        formLoginPassword: () => import(/* webpackChunkName: 'formLoginPassword' */'./form/formLoginPassword'),
        formLoginCaptcha: () => import(/* webpackChunkName: 'formLoginCaptcha' */'./form/formLoginCaptcha'),
        formLoginSubmit: () => import(/* webpackChunkName: 'formLoginSubmit' */'./form/formLoginSubmit'),
        formLoginCode: () => import(/* webpackChunkName: 'formLoginCode' */'./form/formLoginCode')
    },
    props: {
        selectedIndex: {
            type: Number,
            required: true
        },
        caseData: {
            type: Array,
            default: () => []
        },
        status: {
            type: Object,
            required: true
        },
        widgetRefs: {
            type: [Object, Array],
            required: true
        }
    },
    methods: {
        updateCase(caseData) {
            this.$emit('update:caseData', caseData);
        },
        updateIndex(index) {
            this.$emit('update:selectedIndex', index);
        }
    }
};
</script>

<style lang="scss" scoped>
.widget-edit-wrap {
    position: relative;
    background: #FFF;
    margin: 0 auto;
    padding: 16px 16px 16px 70px;
    width: 960px;
    border: 1px solid #D7DBE2;
    font-size: 12px;
}
</style>
