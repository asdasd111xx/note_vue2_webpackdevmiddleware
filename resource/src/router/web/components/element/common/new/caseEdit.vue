<template>
    <div
        v-if="isBackEnd"
        ref="component-modal"
        class="ui modal small"
    >
        <div class="header">
            <i class="edit outline large icon" /> {{ $t('S_EDIT', memInfo.config.lang || 'zh-cn') }}
            <div class="modal-close" />
        </div>
        <div class="content">
            <template v-for="(fieldInfo, index) in popupFields">
                <!-- 文字輸入框 -->
                <input-text
                    v-if="fieldInfo.type === 'text'"
                    :key="`${fieldInfo.type}-${fieldInfo.name}-${index}`"
                    :value="fieldData(fieldInfo)"
                    :edit-index="editIndex"
                    :field-config="popupFields[index]"
                    :element="element"
                    @input="updateFieldData(fieldInfo, $event)"
                />
                <!-- 圖文編輯器 -->
                <div
                    v-if="fieldInfo.type === 'ckeditor'"
                    v-show="checkSwitcher(fieldInfo.type)"
                    :key="`${fieldInfo.type}-${fieldInfo.name}-${index}`"
                >
                    <input-ckeditor
                        :value="fieldData(fieldInfo)"
                        :edit-index="editIndex"
                        :field-config="popupFields[index]"
                        :element="element"
                        @input="updateFieldData(fieldInfo, $event)"
                    />
                </div>
                <!-- 圖片上傳 -->
                <image-upload
                    v-if="fieldInfo.type === 'imageUpload'"
                    :key="`${fieldInfo.type}-${fieldInfo.name}-${index}`"
                    :value="fieldData(fieldInfo)"
                    :edit-index="editIndex"
                    :field-config="popupFields[index]"
                    :element="element"
                    @input="updateFieldData(fieldInfo, $event)"
                />
                <!-- 圖片上傳(有 hover) -->
                <image-hover-upload
                    v-if="fieldInfo.type === 'imageHoverUpload'"
                    :key="`${fieldInfo.type}-${fieldInfo.objKey}-${index}`"
                    :value="fieldData(fieldInfo)"
                    :edit-index="editIndex"
                    :field-config="popupFields[index]"
                    :element="element"
                    @input="updateFieldData(fieldInfo, $event)"
                />
                <!-- 連結設定 -->
                <select-link-field
                    v-if="fieldInfo.type === 'link'"
                    v-show="checkSwitcher(fieldInfo.type)"
                    :key="`${fieldInfo.type}-${fieldInfo.objKey}-${index}`"
                    :value="fieldData(fieldInfo)"
                    :edit-index="editIndex"
                    :field-config="popupFields[index]"
                    :element="element"
                    @input="updateFieldData(fieldInfo, $event)"
                />
                <!-- 顏色選擇器 -->
                <input-color-picker
                    v-if="fieldInfo.type === 'colorPicker'"
                    :key="`${fieldInfo.type}-${fieldInfo.name}-${index}`"
                    :value="fieldData(fieldInfo)"
                    :edit-index="editIndex"
                    :field-config="popupFields[index]"
                    :element="element"
                    @input="updateFieldData(fieldInfo, $event)"
                />
                <!-- 顏色選擇器(有 hover) -->
                <input-color-picker-double
                    v-if="fieldInfo.type === 'colorPickerDouble'"
                    :key="`${fieldInfo.type}-${fieldInfo.objKey}-${index}`"
                    :value="fieldData(fieldInfo)"
                    :edit-index="editIndex"
                    :field-config="popupFields[index]"
                    :element="element"
                    @input="updateFieldData(fieldInfo, $event)"
                />
                <!-- 顯示欄位切換 -->
                <radio-switcher
                    v-if="fieldInfo.type === 'switcher'"
                    :key="`${fieldInfo.type}-${fieldInfo.name}-${index}`"
                    :value="fieldData(fieldInfo)"
                    :edit-index="editIndex"
                    :field-config="popupFields[index]"
                    :element="element"
                    @input="updateFieldData(fieldInfo, $event)"
                />
                <!-- 表單參數設定選單 -->
                <dropdown-setting
                    v-if="fieldInfo.type === 'dropdownSetting'"
                    :key="`${fieldInfo.type}-${fieldInfo.name}-${index}`"
                    :value="fieldData(fieldInfo)"
                    :edit-index="editIndex"
                    :field-config="popupFields[index]"
                    :element="element"
                    @input="updateFieldData(fieldInfo, $event)"
                />
                <!-- 輪播圖片以及連結設定 -->
                <slider-image-upload
                    v-if="fieldInfo.type === 'sliderImageUpload'"
                    :key="`${fieldInfo.type}-${fieldInfo.name}-${index}`"
                    :value="fieldData(fieldInfo)"
                    :edit-index="editIndex"
                    :field-config="popupFields[index]"
                    :element="element"
                    @input="updateFieldData(fieldInfo, $event)"
                />
                <!-- 項目間距 -->
                <item-margin
                    v-if="fieldInfo.type === 'itemSpace'"
                    :key="`${fieldInfo.type}-${fieldInfo.objKey}-${index}`"
                    :value="fieldData(fieldInfo)"
                    :edit-index="editIndex"
                    :field-config="popupFields[index]"
                    :element="element"
                    @input="updateFieldData(fieldInfo, $event)"
                />
            </template>
        </div>
        <div class="actions">
            <div :class="['ui', 'button', 'primary', { disabled: submitting }]" @click="onComfirm">{{ $t('S_CONFIRM', memInfo.config.lang || 'zh-cn') }}</div>
            <button
                class="ui small button"
                type="button"
                @click="onClose"
            >
                {{ $t('S_CLOSE', memInfo.config.lang || 'zh-cn') }}
            </button>
        </div>
    </div>
</template>

<script>
/* global $ */
import { mapGetters, mapActions } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import inputCkeditor from './fields/inputCkeditor';
import imageUpload from './fields/imageUpload';
import imageHoverUpload from './fields/imageHoverUpload';
import selectLinkField from './fields/selectLinkField';
import inputColorPicker from './fields/inputColorPicker';
import inputColorPickerDouble from './fields/inputColorPickerDouble';
import inputText from './fields/inputText';
import radioSwitcher from './fields/radioSwitcher';
import sliderImageUpload from './fields/sliderImageUpload';
import dropdownSetting from './fields/dropdownSetting';
import itemMargin from './fields/itemSpace';

/**
 * 模塊編輯共用表單
 * @module element/common/casePanel
 * @param {string|number} editIndex - 當前編輯項目在 case data 的索引值
 * @param {object} config - 模塊設定檔
 * @param {object} element - 模塊資料
 */
export default {
    components: {
        inputText,
        inputCkeditor,
        imageUpload,
        imageHoverUpload,
        selectLinkField,
        inputColorPicker,
        inputColorPickerDouble,
        radioSwitcher,
        itemMargin,
        sliderImageUpload,
        dropdownSetting
    },
    props: {
        editIndex: {
            type: [String, Number],
            required: true
        },
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => ({})
        },
        reRender: {
            type: Function,
            default: null
        }
    },
    data() {
        const caseField = {};
        const switcher = {};
        let switcherName = '';
        const popupFields = this.config.popupEdit[this.editIndex] || this.config.popupEdit.common;

        // 建立欄位資料
        popupFields.forEach((fieldInfo) => {
            // 有設定顯示欄位切換 switcher 時，設定顯示資料
            if (fieldInfo.type === 'switcher') {
                switcherName = fieldInfo.name;
                fieldInfo.fields.forEach((field) => {
                    switcher[field.type] = false;
                });
            }

            // 多個 name 值，設定檔必須要設定 objKey
            if (fieldInfo.names) {
                Object.keys(fieldInfo.names).forEach((linkKey) => {
                    if (process.env.NODE_ENV === 'development' && !fieldInfo.objKey) {
                        // eslint-disable-next-line
                        console.error('config 使用多欄位，但未設定 objKey');
                    }

                    if (!caseField[fieldInfo.objKey]) {
                        caseField[fieldInfo.objKey] = {};
                    }

                    caseField[fieldInfo.objKey][fieldInfo.names[linkKey]] = '';
                });
                return;
            }

            caseField[fieldInfo.name] = '';
        });

        return {
            caseField,
            switcher,
            switcherName,
            submitting: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            lang: 'getLang',
            curLang: 'getCurLang',
            page: 'getPage',
            isBackEnd: 'getIsBackEnd'
        }),
        /**
         * 取得彈跳視窗表單呈現類型，判斷是特例內容或是一般內容
         * @method popupFields
         * @returns {object} 模塊設定檔表單呈現類型資訊
         */
        popupFields() {
            return this.config.popupEdit[this.editIndex] || this.config.popupEdit.common;
        },
        /**
         * 取得 switcher 的狀態
         * @method switchStatus
         * @returns {object} 表單是否呈現資訊
         */
        switchStatus() {
            const result = {};

            Object.keys(this.switcher).forEach((fieldName) => {
                result[fieldName] = this.caseField[this.switcherName] === fieldName;
            });
            return result;
        }
    },
    mounted() {
        // modal 初始設定
        $(this.$refs['component-modal']).modal({
            autofocus: false,
            closable: false,
            onVisible: () => {
                setTimeout(() => {
                    $(window).trigger('resize');
                }, 100);
            },
            onHidden: () => {
                this.$emit('close');
            }
        });
        $(this.$refs['component-modal']).modal('show');
    },
    beforeDestroy() {
        this.onClose();
        $(this.$refs['component-modal']).modal('destroy');
    },
    methods: {
        ...mapActions([
            'actionCaseSave'
        ]),
        /**
         * 送出表單
         * @method onComfirm
         */
        onComfirm() {
            // 防連點
            if (this.submitting) {
                return;
            }

            // 檢查 vee-validate 驗證
            this.$validator.validateAll('form-page').then((res) => {
                if (!res) {
                    return;
                }
                // ====== 表單驗證 - START ====== //
                let hasError = false;
                this.popupFields.every((fieldInfo) => {
                    if (!Object.keys(this.config.validate).length) {
                        return false;
                    }

                    // 驗證資料暫存
                    const validateFields = {};

                    // 多欄位
                    if (fieldInfo.names) {
                        Object.keys(fieldInfo.names).forEach((nameKey) => {
                            if (!this.config.validate[fieldInfo.names[nameKey]]) {
                                return;
                            }

                            validateFields[fieldInfo.names[nameKey]] = this.caseField[fieldInfo.objKey][fieldInfo.names[nameKey]];
                        });
                    }

                    // 單欄位
                    if (fieldInfo.name && this.config.validate[fieldInfo.name]) {
                        validateFields[fieldInfo.name] = this.caseField[fieldInfo.name];
                    }

                    Object.keys(validateFields).every((nameKey) => {
                        // 檢查必填
                        if (this.config.validate[nameKey].required && validateFields[nameKey] === '') {
                            hasError = true;
                            this.$swal({
                                title: this.$t(this.config.validate[nameKey].required.msg, this.memInfo.config.lang || 'zh-cn'),
                                type: 'warning'
                            });
                            return false;
                        }
                        return true;
                    });
                    // 針對輪播圖, 檢查必填
                    if (fieldInfo.type === 'sliderImageUpload' && this.config.validate[fieldInfo.name]) {
                        Object.keys(this.config.validate[fieldInfo.name]).every((key) => {
                            this.caseField[fieldInfo.name].every((obj) => {
                                if (this.config.validate[fieldInfo.name][key].required && obj[key] === '') {
                                    hasError = true;
                                    this.$swal({
                                        title: this.$t(this.config.validate[fieldInfo.name][key].required.msg, this.memInfo.config.lang || 'zh-cn'),
                                        type: 'warning'
                                    });
                                    return false;
                                }
                                return true;
                            });
                            return true;
                        });
                    }

                    // 有一個欄位錯誤即中斷迴圈
                    return !hasError;
                });

                if (hasError) {
                    return;
                }
                // ====== 表單驗證 - END ====== //

                // 防連點
                this.submitting = true;

                // 組送出資料，壓平物件內容
                const fieldData = cloneDeep(this.element.case.data).map((item, i) => {
                    if (this.editIndex !== i) {
                        return item;
                    }

                    const result = item;

                    this.popupFields.forEach((fieldInfo) => {
                        if (fieldInfo.type === 'ckeditor' || fieldInfo.setting) {
                            return;
                        }

                        if (fieldInfo.names) {
                            Object.keys(fieldInfo.names).forEach((nameKey) => {
                                result[fieldInfo.names[nameKey]] = {
                                    ...result[fieldInfo.names[nameKey]],
                                    [this.curLang]: this.caseField[fieldInfo.objKey][fieldInfo.names[nameKey]]
                                };
                            });
                            return;
                        }
                        result[fieldInfo.name] = {
                            ...result[fieldInfo.name],
                            [this.curLang]: fieldInfo.type !== 'sliderImageUpload' ? this.caseField[fieldInfo.name] : JSON.stringify(this.caseField[fieldInfo.name])
                        };
                    });

                    return result;
                });

                const contentData = cloneDeep(this.element.case.content).map((item, i) => {
                    if (this.editIndex !== i) {
                        return item;
                    }

                    const result = item;

                    this.popupFields.forEach((fieldInfo) => {
                        if (fieldInfo.type !== 'ckeditor') {
                            return;
                        }
                        result[this.curLang] = this.caseField[fieldInfo.name];
                    });

                    return result;
                });

                // 更新 Element Case Setting
                let originalSettings = { ...this.element.case.setting };
                this.popupFields.forEach((fieldInfo) => {
                    if (!fieldInfo.setting) {
                        return;
                    }

                    if (fieldInfo.names) {
                        Object.keys(fieldInfo.names).forEach((nameKey) => {
                            originalSettings = {
                                ...originalSettings,
                                [fieldInfo.names[nameKey]]: this.caseField[fieldInfo.objKey][fieldInfo.names[nameKey]]
                            };
                        });
                        return;
                    }

                    originalSettings = {
                        ...originalSettings,
                        [fieldInfo.name]: this.caseField[fieldInfo.name]
                    };
                });

                this.actionCaseSave({
                    case_id: this.element.i,
                    content: contentData,
                    field: fieldData,
                    setting: originalSettings
                }).then((response) => {
                    if (response.status !== 'Y') {
                        this.$swal({
                            title: response.message || this.$t('S_CONTACT_SERVICE', this.memInfo.config.lang || 'zh-cn'),
                            type: 'error'
                        });
                    } else {
                        this.onClose();

                        if (this.reRender) {
                            this.reRender();
                        }
                    }
                    this.submitting = false;
                });
            });
        },
        /**
         * field 類型為 switcher 的欄位開關驗證
         * @method checkSwitcher
         * @param {string} fieldType - 欄位類型
         * @returns {boolean} 是否呈現欄位
         */
        checkSwitcher(fieldType) {
            if (typeof this.switchStatus[fieldType] === 'undefined') {
                return true;
            }
            return this.switchStatus[fieldType];
        },
        /**
         * 關閉 semantic modal
         * @method onClose
         */
        onClose() {
            $(this.$refs['component-modal']).modal('hide');
        },
        /**
         * 綁定資料
         * @method fieldData
         * @param {fieldInfo} - 欄位資料
         * @returns {String, Object, Array} 依類型決定資料型態
         */
        fieldData(fieldInfo) {
            if (fieldInfo.objKey) {
                return this.caseField[fieldInfo.objKey];
            }

            return this.caseField[fieldInfo.name];
        },
        /**
         * 更新綁定資料
         * @method updateFieldData
         * @param {fieldInfo} - 欄位資料
         * @param {value} - 更新資料
         * @returns {String, Object, Array} 依類型決定資料型態
         */
        updateFieldData(fieldInfo, value) {
            if (fieldInfo.objKey) {
                this.caseField[fieldInfo.objKey] = value;
                return;
            }

            this.caseField[fieldInfo.name] = value;
        }
    }
};
</script>

<style lang="scss" scoped>
.content {
    > div {
        margin-bottom: 14px;
    }
}
</style>
