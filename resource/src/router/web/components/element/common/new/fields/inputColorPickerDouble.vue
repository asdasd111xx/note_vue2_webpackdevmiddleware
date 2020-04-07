<template>
    <div class="ui form clearfix">
        <div class="field clearfix display-arrangement">
            <label>
                {{ $t(fieldConfig.title.first || 'S_BACKGROUND_COLOR', memInfo.config.lang || 'zh-cn') }}
            </label>
            <div class="color-picker-wrap">
                <div class="default-color" @click="setColor('', fieldConfig.names.normal)">{{ $t('S_USE_DEFAULT_COLOR', memInfo.config.lang || 'zh-cn') }}</div>
                <div class="palette clearfix">
                    <span
                        v-for="color in palette"
                        :key="`palette-${color}`"
                        :style="{ backgroundColor: color }"
                        :class="{ 'is-active': initVal[fieldConfig.names.normal] === color.toUpperCase() }"
                        @click="setColor(color, fieldConfig.names.normal)"
                    >
                        <i class="check icon" />
                    </span>
                </div>
                <div class="custom-color">
                    <div :style="{ backgroundColor: initVal[fieldConfig.names.normal] }" class="color-block" />
                    <div class="field-wrap">
                        <input
                            :value="initVal[fieldConfig.names.normal]"
                            type="text"
                            maxlength="7"
                            @input="setColor($event.target.value, fieldConfig.names.normal)"
                        />
                        <div v-show="errorMsg[fieldConfig.names.normal] !== ''" class="ui pointing red basic label">{{ errorMsg[fieldConfig.names.normal] }}</div>
                    </div>
                </div>
                <!-- disable 時的遮罩 -->
                <div v-if="disabled" class="disabled-mask" />
            </div>
        </div>
        <div class="field clearfix display-arrangement">
            <label>
                {{ $t(fieldConfig.title.second || 'S_BACKGROUND_COLOR', memInfo.config.lang || 'zh-cn') }}
            </label>
            <div class="color-picker-wrap">
                <div class="default-color" @click="setColor('', fieldConfig.names.hover)">{{ $t('S_USE_DEFAULT_COLOR', memInfo.config.lang || 'zh-cn') }}</div>
                <div class="palette clearfix">
                    <span
                        v-for="color in palette"
                        :key="`palette-${color}`"
                        :style="{ backgroundColor: color }"
                        :class="{ 'is-active': initVal[fieldConfig.names.hover] === color.toUpperCase() }"
                        @click="setColor(color, fieldConfig.names.hover)"
                    >
                        <i class="check icon" />
                    </span>
                </div>
                <div class="custom-color">
                    <div :style="{ backgroundColor: initVal[fieldConfig.names.hover] }" class="color-block" />
                    <div class="field-wrap">
                        <input
                            :value="initVal[fieldConfig.names.hover]"
                            type="text"
                            maxlength="7"
                            @input="setColor($event.target.value, fieldConfig.names.hover)"
                        />
                        <div v-show="errorMsg[fieldConfig.names.hover] !== ''" class="ui pointing red basic label">{{ errorMsg[fieldConfig.names.hover] }}</div>
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
 * @module element/field/inputColorPickerDouble
 * @param {boolean} disabled - 停用狀態時，呈現欄位遮罩
 * @param {string|number} editIndex - 當前編輯項目索引值
 * @param {object} fieldConfig - 模塊當前欄位設定值
 * @param {object} element - 模塊資料
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
        }
    },
    data() {
        return {
            palette: ['#A7BAC1', '#78797B', '#FA8C97', '#F3D479', '#82D496', '#566996'],
            errorMsg: {
                [this.fieldConfig.names.normal]: '',
                [this.fieldConfig.names.hover]: ''
            },
            initVal: {},
            errorState: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        })
    },
    created() {
        Object.keys(this.fieldConfig.names).forEach((nameKey) => {
            const fieldName = this.fieldConfig.names[nameKey];
            try {
                this.initVal[fieldName] = this.defaultValSet(this.fieldConfig.setting, fieldName);
            } catch (err) {
                this.initVal[fieldName] = '';
            }
        });

        this.$emit('input', this.initVal);
    },
    methods: {
        /**
         * 設定顏色
         * @method setColor
         * @param { string } color - 色碼
         */
        setColor(color, fieldName) {
            this.initVal = {
                ...this.initVal,
                [fieldName]: color
            };

            Object.keys(this.fieldConfig.names).forEach((nameKey) => {
                const fieldColor = this.fieldConfig.names[nameKey];
                // 空為預設顏色、色碼驗證：# 開頭，且 a-f 及 0-9 的文字組成3或6碼
                if (this.initVal[fieldColor] === '' || /^#[a-fA-F\d]{3}([a-fA-F\d]{3})?$/g.test(this.initVal[fieldColor])) {
                    this.errorMsg[fieldColor] = '';
                    return;
                }

                this.errorState = true;
                // 驗證錯誤處理
                this.errorMsg[fieldColor] = this.$t('S_INCORRECT_COLOR_CODE_FORMAT', this.memInfo.config.lang || 'zh-cn');
            });

            if (!this.errorState) {
                this.$emit('input', this.initVal);
            }

            this.errorState = false;
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
.display-arrangement {
    display: inline-block;
    padding-right: 15px;

    .color-picker-wrap {
        background-color: #FFF;
        position: relative;
        margin-bottom: 14px;
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
}

</style>
