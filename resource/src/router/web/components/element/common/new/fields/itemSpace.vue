<template>
    <!-- 項目與項目的距離設定 -->
    <div class="ui form content clearfix">
        <div class="field bg-color">
            <label>{{ $t('S_ITEM_SPACE', memInfo.config.lang || 'zh-cn') }}</label>
            <div class="equal width fields">
                <div class="ui right labeled mini field input">
                    <div class="ui label label">{{ $t('S_TOP_SPACE', memInfo.config.lang || 'zh-cn') }}</div>
                    <input
                        v-model="value.paddingTop"
                        type="text"
                        @input="onVerification(value.paddingTop, 'paddingTop')"
                    />
                    <div class="ui label label">％</div>
                </div>
                <div class="ui right labeled mini field input">
                    <div class="ui label label">{{ $t('S_BOTTOM_SPACE', memInfo.config.lang || 'zh-cn') }}</div>
                    <input
                        v-model="value.paddingBottom"
                        type="text"
                        @input="onVerification(value.paddingBottom, 'paddingBottom')"
                    />
                    <div class="ui label label">％</div>
                </div>
            </div>
            <div class="equal width fields">
                <div class="ui right labeled mini field input">
                    <div class="ui label label">{{ $t('S_LEFT_SPACE', memInfo.config.lang || 'zh-cn') }}</div>
                    <input
                        v-model="value.paddingLeft"
                        type="text"
                        @input="onVerification(value.paddingLeft, 'paddingLeft')"
                    />
                    <div class="ui label label">％</div>
                </div>
                <div class="ui right labeled mini field input">
                    <div class="ui label label">{{ $t('S_RIGHT_SPACE', memInfo.config.lang || 'zh-cn') }}</div>
                    <input
                        v-model="value.paddingRight"
                        type="text"
                        @input="onVerification(value.paddingRight, 'paddingRight')"
                    />
                    <div class="ui label label">％</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

/**
 * 文字輸入框表單
 * @module element/field/itemSpace
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
            type: Object,
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
        const initVal = {};

        Object.keys(this.fieldConfig.names).forEach((nameKey) => {
            const fieldName = this.fieldConfig.names[nameKey];

            try {
                initVal[fieldName] = this.defaultValSet(this.fieldConfig.setting, fieldName) || '0';
            } catch (err) {
                initVal[fieldName] = '0';
            }
        });

        this.$emit('input', initVal);
    },
    methods: {
        /**
         * 驗證有效值
         * @method onVerification
         * @param {string} num - 當前值
         * @param {number} key - 當前key
         * @returns {string} 回傳驗證後的值
         */
        onVerification(num, key) {
            let newValue = +num.replace(/\D/g, '');

            if (newValue > 100) {
                newValue = 100;
            }

            this.$emit('input', {
                ...this.value,
                [key]: newValue.toString()
            });
        },
        defaultValSet(settingState, fieldName) {
            if (settingState) {
                return this.element.case.setting[this.fieldConfig.objKey][fieldName];
            }

            return this.element.case.data[this.editIndex][fieldName][this.curLang];
        }
    }
};
</script>

<style lang="scss" scoped>
.equal.width.fields {
    width: 85%;
    margin: 5px 0;

    .field.input {
        margin-right: 2px;
        padding-left: 0;

        input {
            text-align: right;
        }
    }
}
</style>
