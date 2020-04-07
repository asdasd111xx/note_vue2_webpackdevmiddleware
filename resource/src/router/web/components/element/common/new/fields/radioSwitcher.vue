<template>
    <div class="ui form clearfix">
        <div class="inline fields clearfix">
            <label>{{ $t(fieldConfig.title, memInfo.config.lang || 'zh-cn') }}：</label>
            <div
                v-for="fieldInfo in fieldConfig.fields"
                :key="`switcher-${fieldInfo.type}`"
                class="field"
            >
                <div class="ui radio checkbox">
                    <input
                        :id="`switcher-${fieldInfo.type}`"
                        :value="fieldInfo.type"
                        :checked="value === fieldInfo.type"
                        type="radio"
                        name="switcher"
                        @change="$emit('input', $event.target.value)"
                    />
                    <label :for="`switcher-${fieldInfo.type}`">
                        {{ $t(fieldInfo.title, memInfo.config.lang || 'zh-cn') }}
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

/**
 * radio button 切換呈現表單
 * @module element/field/radioSwitcher
 * @param {string|number} editIndex - 當前編輯項目索引值
 * @param {object} fieldConfig - 模塊當前欄位設定值
 * @param {object} element - 模塊資料
 * @param {object} value - 表單的值，雙向綁定
 */
export default {
    props: {
        editIndex: {
            type: [String, Number],
            required: true
        },
        fieldConfig: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => ({})
        },
        value: {
            type: String,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        })
    },
    mounted() {
        let tmpVal = '';

        try {
            tmpVal = this.defaultValSet(this.fieldConfig.setting, this.fieldConfig.name);
        } catch (err) {
            tmpVal = '';
        }

        const hasVal = this.fieldConfig.fields.some((fieldInfo) => fieldInfo.type === tmpVal);
        this.$emit('input', hasVal ? tmpVal : this.fieldConfig.fields[0].type);
    },
    methods: {
        defaultValSet(settingState, fieldName) {
            if (settingState) {
                return this.element.case.setting[fieldName];
            }

            return this.element.case.data[this.editIndex][fieldName][this.curLang];
        }
    }
};
</script>
