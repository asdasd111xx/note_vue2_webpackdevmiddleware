<template>
    <div class="ui form clearfix">
        <div class="field clearfix">
            <label>
                {{ $t(fieldConfig.title || 'S_TITLE', memInfo.config.lang || 'zh-cn') }}
            </label>
            <div :style="fieldStyle" :class="inputClass">
                <input
                    :value="value"
                    :maxlength="maxLength"
                    type="text"
                    @input="onInput"
                />
                <div v-show="unit" class="ui label label">px</div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

/**
 * 文字輸入框表單
 * @module element/field/inputText
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
    data() {
        return {
            fieldStyle: { width: `${this.fieldConfig.width}px` },
            maxLength: this.fieldConfig.maxLength || 50,
            unit: this.fieldConfig.unit || false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        }),
        inputClass() {
            if (this.unit) {
                return ['ui', 'right', 'labeled', 'small', 'field', 'input'];
            }

            return ['field'];
        }
    },
    mounted() {
        try {
            this.$emit('input', this.defaultValSet(this.fieldConfig.setting, this.fieldConfig.name));
        } catch (err) {
            this.$emit('input', '');
        }
    },
    methods: {
        defaultValSet(settingState, fieldName) {
            if (settingState) {
                return this.element.case.setting[fieldName];
            }

            return this.element.case.data[this.editIndex][fieldName][this.curLang];
        },
        onInput(e) {
            const { validate } = this.fieldConfig;
            const oldVal = this.value;
            const newVal = e.target.value;

            this.$emit('input', newVal);

            // 輸入框是否有驗證
            if (!validate) {
                return;
            }

            // 注意︰輸入框的input事件即便return或使用preventDefault依然會把值塞到輸入框裡
            // 造成輸入框的值與value不同
            // 這裡第二次的input事件來將正確的值寫入到value裡
            Object.keys(validate).forEach((key) => {
                if (!validate[key]) {
                    return;
                }

                switch (key) {
                    // 限數字
                    case 'number': {
                        if (/^[0-9]*$/g.test(newVal)) {
                            this.$nextTick(() => {
                                this.$emit('input', `${+newVal}`);
                            });
                            break;
                        }

                        this.$nextTick(() => {
                            this.$emit('input', `${+oldVal}`);
                        });
                        break;
                    }
                    default: {
                        break;
                    }
                }
            });
        }
    }
};
</script>
