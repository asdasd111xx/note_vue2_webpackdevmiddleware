<template>
    <div
        v-if="element.i !== 'static'"
        :class="['element-wrap', `theme-${element.theme}`, `tpl-${webInfo.model}`, webInfo.style_color]"
        :style="bgStyle"
    >
        <!-- 模塊主要內容 -->
        <div :style="contentBgStyle" class="content">
            <slot />
        </div>
        <!-- 板塊控制項目 -->
        <main-panel
            v-if="isBackEnd && config.mainPanel && !readOnly"
            :config="config"
            :element="element"
            class="main-panel"
        />
    </div>
    <div v-else>
        <slot />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import positionTrans from '@/lib/position_trans';

/**
 * 共用模塊主要外框
 * @module element/common/mainWrap
 * @param {object} config - 模塊設定檔
 * @param {object} element - 模塊資料
 * @param {function} onReady - 取得資料後要執行的動作
 */
export default {
    components: {
        mainPanel: () => import(/* webpackChunkName: 'mainPanel' */'./mainPanel')
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => ({})
        },
        onReady: {
            type: Function,
            default: () => {}
        }
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            cdnDomain: 'getCdnDomain',
            lang: 'getLang',
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo',
            readOnly: 'getReadOnly'
        }),
        /**
         * 模塊背景 css 樣式
         * @method bgStyle
         * @returns {object} css 樣式物件
         */
        bgStyle() {
            const settings = this.element.case.setting;

            return {
                'background-color': settings['background-color'] || '',
                'background-position': settings['background-position'] ? positionTrans(settings['background-position']) : '',
                'background-repeat': settings['background-repeat'] || '',
                'background-image': settings['background-image'] ? `url(${this.$getCdnPath(`${this.cdnDomain}${settings['background-image']}`)})` : '',
                'margin-top': settings['margin-top'] ? `${settings['margin-top']}px` : '0',
                'margin-bottom': settings['margin-bottom'] ? `${settings['margin-bottom']}px` : '0'
            };
        },
        /**
         * 模塊內容 css 樣式
         * @method contentBgStyle
         * @returns {object} css 樣式物件
         */
        contentBgStyle() {
            const settings = this.element.case.setting;

            return {
                'padding-top': settings['padding-top'] ? `${settings['padding-top']}px` : '0',
                'padding-bottom': settings['padding-bottom'] ? `${settings['padding-bottom']}px` : '0',
                'padding-left': settings['padding-left'] ? `${settings['padding-left']}px` : '0',
                'padding-right': settings['padding-right'] ? `${settings['padding-right']}px` : '0'
            };
        }
    },
    created() {
        // 非模塊狀態下不執行相關初始化動作
        // 如手機版電子大廳
        if (this.element.i === 'static') {
            return;
        }

        if (this.isBackEnd && Object.keys(this.element.case.setting).length === 0) {
            this.initCase();
            return;
        }

        this.onReady();
    },
    mounted() {
        // 非模塊狀態下不執行相關初始化動作
        // 如手機版電子大廳
        if (this.element.i === 'static') {
            return;
        }

        this.checkData();
    },
    methods: {
        ...mapActions([
            'actionCaseSave'
        ]),
        /**
         * 新增預設資料
         * @method initCase
         */
        initCase() {
            if (!this.isBackEnd) {
                this.onReady();
                return;
            }

            const eleData = '';
            const fieldData = [];
            const contentData = [];

            if (!eleData) {
                return;
            }

            if (this.config.caseLang) {
                // 組 api 資料
                eleData.data.forEach((data, index) => {
                    const fields = {};
                    const fieldContent = {};

                    Object.keys(this.lang).forEach((lang) => {
                        // 判斷是否為特例資料
                        const tmpFields = this.config.fields[index] || this.config.fields.common;

                        tmpFields.forEach((fieldName) => {
                            if (!fields[fieldName] && typeof fieldName === 'string') {
                                fields[fieldName] = {};
                            }

                            // ckeditor 資料另存欄位
                            if (typeof fieldName !== 'string' && fieldName.type === 'ckeditor') {
                                fieldContent[lang] = data[fieldName.name];
                                return;
                            }

                            if (typeof (data[fieldName]) === 'object') {
                                fields[fieldName][lang] = JSON.stringify(data[fieldName]);
                                return;
                            }
                            fields[fieldName][lang] = data[fieldName];
                        });
                    });
                    fieldData.push(fields);
                    contentData.push(fieldContent);
                });
            } else {
                fieldData.push(...eleData.data);
            }

            this.actionCaseSave({
                case_id: this.element.i,
                content: [...contentData],
                field: [
                    ...this.element.case.data,
                    ...fieldData
                ],
                setting: {
                    ...this.element.case.setting,
                    ...eleData.setting
                }
            }).then((response) => {
                this.onReady();

                if (response.status !== 'Y') {
                    this.$swal({
                        title: response.message || this.$t('S_CONTACT_SERVICE', this.memInfo.config.lang || 'zh-cn'),
                        type: 'error'
                    });
                }
            });
        },
        /**
         * 檢查各欄位資訊是否相同
         * 當有需求需要增加欄位，透過此方法確保欄位的 key 值存在，並給予預設
         * @method checkData
         */
        checkData() {
            const tmpData = getElementInfo(this.config.name, this.webInfo.model, this.webInfo.style_color);

            if (!tmpData) {
                return;
            }

            const defaultData = tmpData.data;
            const caseData = cloneDeep(this.element.case.data);
            let willSend = false;

            caseData.forEach((data, caseIndex) => {
                const configFields = (this.config.fields[caseIndex] || this.config.fields.common)
                    .filter((fieldName) => !fieldName.type);

                if (Object.keys(data).length === configFields.length) {
                    return;
                }

                // 特例索引值資料處理
                if (this.config.fields[caseIndex]) {
                    configFields.forEach((fieldName) => {
                        if (!data[fieldName] && defaultData[caseIndex][fieldName]) {
                            caseData[caseIndex][fieldName] = {};
                            Object.keys(this.lang).forEach((lang) => {
                                caseData[caseIndex][fieldName][lang] = defaultData[caseIndex][fieldName];
                            });
                            willSend = true;
                        }
                    });
                    return;
                }

                // 過濾特例索引值，確保後續處理取時取第 0 筆是正確的欄位
                const commonData = defaultData.filter((fieldName, index) => !this.config.fields[index]);

                configFields.forEach((fieldName) => {
                    if (!data[fieldName] && commonData[0][fieldName]) {
                        caseData[caseIndex][fieldName] = {};
                        Object.keys(this.lang).forEach((lang) => {
                            caseData[caseIndex][fieldName][lang] = commonData[0][fieldName];
                        });
                        willSend = true;
                    }
                });
            });

            if (!willSend) {
                return;
            }

            if (this.isBackEnd) {
                this.actionCaseSave({
                    case_id: this.element.i,
                    content: [...this.element.case.content],
                    field: [...caseData],
                    setting: { ...this.element.case.setting }
                }).then((response) => {
                    if (response.status !== 'Y') {
                        this.$swal({
                            title: response.message || this.$t('S_CONTACT_SERVICE', this.memInfo.config.lang || 'zh-cn'),
                            type: 'error'
                        });
                    }
                });
                return;
            }
            this.element.case.data = caseData;
        }
    }
};
</script>

<style lang="scss" scoped>
.element-wrap {
    position: relative;
    box-sizing: border-box;

    &:hover {
        .main-panel {
            opacity: 1;
        }
    }

    .main-panel {
        position: absolute;
        z-index: 7;
        top: 10px;
        left: 14px;
        opacity: 0;
        transition: opacity .3s;
    }
}
</style>
