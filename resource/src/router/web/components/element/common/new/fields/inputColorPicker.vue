<template>
    <div class="ui form clearfix">
        <div class="field clearfix">
            <label>
                {{ $t(fieldConfig.title || 'S_BACKGROUND_COLOR', memInfo.config.lang || 'zh-cn') }}
            </label>
            <div class="color-picker-wrap">
                <div class="default-color" @click="setColor('')">{{ $t('S_USE_DEFAULT_COLOR', memInfo.config.lang || 'zh-cn') }}</div>
                <div class="palette clearfix">
                    <span
                        v-for="color in palette"
                        :key="`palette-${color}`"
                        :style="{ backgroundColor: color }"
                        :class="{ 'is-active': value === color.toUpperCase() }"
                        @click="setColor(color)"
                    >
                        <i class="check icon" />
                    </span>
                </div>
                <div class="custom-color">
                    <div :style="{ backgroundColor: value }" class="color-block" />
                    <div class="field-wrap">
                        <input
                            :value="value"
                            type="text"
                            maxlength="7"
                            @input="setColor($event.target.value)"
                        />
                        <div v-show="errorMsg !== ''" class="ui pointing red basic label">{{ errorMsg }}</div>
                    </div>
                </div>
                <!-- disable 時的遮罩 -->
                <div v-if="disabled" class="disabled-mask" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

/**
 * 色彩選擇器
 * @module element/field/inputColorPicker
 * @param {boolean} disabled - 停用狀態時，呈現欄位遮罩
 * @param {string|number} editIndex - 當前編輯項目索引值
 * @param {object} fieldConfig - 模塊當前欄位設定值
 * @param {object} element - 模塊資料
 * @param {object} value - 表單的值，雙向綁定
 */
export default {
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
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
            palette: ['#A7BAC1', '#78797B', '#FA8C97', '#F3D479', '#82D496', '#566996'],
            errorMsg: ''
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        })
    },
    watch: {
        /**
         * 驗證色碼格式
         * @method value
         * @param { string } color - 色碼
         */
        value(color) {
            this.$emit('input', color);

            // 空為預設顏色、色碼驗證：# 開頭，且 a-f 及 0-9 的文字組成3或6碼
            if (color === '' || /^#[a-fA-F\d]{3}([a-fA-F\d]{3})?$/g.test(color)) {
                this.errorMsg = '';
                return;
            }

            // 驗證錯誤處理
            this.errorMsg = this.$t('S_INCORRECT_COLOR_CODE_FORMAT', this.memInfo.config.lang || 'zh-cn');
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
        /**
         * 設定顏色
         * @method setColor
         * @param { string } color - 色碼
         */
        setColor(color) {
            this.$emit('input', color);
        },
        defaultValSet(settingState, fieldName) {
            if (settingState) {
                return this.element.case.setting[fieldName];
            }

            return this.element.case.data[this.editIndex][fieldName][this.curLang];
        }
    }
};
</script>

<style lang="scss" scoped>
.color-picker-wrap {
    background-color: #FFF;
    position: relative;
    padding: 12px 14px;
    width: 224px;
    height: 146px;
    border: 1px solid rgba(34, 36, 38, 0.35);
    box-shadow: 3px 3px 3px #ccc;

    .disabled-mask {
        background-color: rgba(251, 251, 251, 0.6);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .default-color {
        margin-bottom: 12px;
        width: 194px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 5px;
        border: 1px solid #E1E1E1;
        cursor: pointer;
    }

    .palette {
        margin-bottom: 12px;
        text-align: center;

        span {
            display: inline-block;
            margin: 0 3px;
            width: 26px;
            height: 26px;
            border-radius: 26px;
            vertical-align: top;
            cursor: pointer;

            &.is-active i,
            &:hover i {
                display: block;
            }

            i {
                display: none;
                width: 26px;
                height: 26px;
                line-height: 26px;
                color: #FFF;
                font-family: 'Icons';
                font-weight: normal;
            }

        }
    }

    .custom-color {
        .color-block {
            display: inline-block;
            margin-right: 6px;
            width: 66px;
            height: 30px;
            border-radius: 5px;
            vertical-align: top;
        }

        .field-wrap {
            display: inline-block;
            vertical-align: top;

            input {
                display: block;
                width: 118px;
                height: 30px;
                text-align: center;
                border-radius: 5px;
                border: 1px solid #E1E1E1;
            }

            .ui.basic.red.label {
                padding: 7px;
                z-index: 1;
            }
        }
    }
}
</style>
