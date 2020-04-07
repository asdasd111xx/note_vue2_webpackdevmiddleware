<template>
    <div :style="bgStyle" :class="['element', isBackEnd ? 'is-back' : 'is-front']">
        <div
            class="element-btn clearfix"
            @click="$emit('click')"
        >
            <slot name="element" />
            <case-panel
                v-if="isBackEnd && config.casePanel && !readOnly"
                :index="index"
                :config="config"
                :element="element"
            />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

/**
 * 模塊項目共用外框
 * @module element/common/elementWrap
 * @param {number} index - 該項目在 element data 的索引值
 * @param {object} config - 模塊設定檔
 * @param {object} element - 模塊資料
 */
export default {
    components: {
        casePanel: () => import(/* webpackChunkName: 'casePanel' */'./casePanel')
    },
    props: {
        index: {
            type: Number,
            required: true
        },
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            curLang: 'getCurLang',
            readOnly: 'getReadOnly'
        }),
        bgStyle() {
            const fieldSetting = this.element.case.data[this.index];

            return {
                'padding-top': fieldSetting.paddingTop && fieldSetting.paddingTop[this.curLang] ? `${fieldSetting.paddingTop[this.curLang]}%` : '',
                'padding-right': fieldSetting.paddingRight && fieldSetting.paddingRight[this.curLang] ? `${fieldSetting.paddingRight[this.curLang]}%` : '',
                'padding-bottom': fieldSetting.paddingBottom && fieldSetting.paddingBottom[this.curLang] ? `${fieldSetting.paddingBottom[this.curLang]}%` : '',
                'padding-left': fieldSetting.paddingLeft && fieldSetting.paddingLeft[this.curLang] ? `${fieldSetting.paddingLeft[this.curLang]}%` : ''
            };
        }
    }
};
</script>
