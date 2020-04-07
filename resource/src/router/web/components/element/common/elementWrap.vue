<template>
    <div
        :class="mainClass"
        :style="{
            'background-color': element.case.setting['background-color'] || '',
            'background-position': element.case.setting['background-position'] ? bgPosition(element.case.setting['background-position']) : '',
            'background-repeat': element.case.setting['background-repeat'] || '',
            'background-image': element.case.setting['background-image'] ? `url(${$getCdnPath(cdnDomain + element.case.setting['background-image'])})` : ''
        }"
    >
        <!-- 板塊控制項目 -->
        <div v-if="isBackEnd && !readOnly" class="control-wrap">
            <div ref="dropdown-setting" class="ui icon circular teal mini top left pointing dropdown button">
                <icon name="wrench" />
                <div class="menu">
                    <div
                        v-if="bgSettingButton"
                        class="item"
                        @click="$emit('setting')"
                    >
                        <icon name="cogs" />
                        {{ $t('S_SETTINGS', memInfo.config.lang || 'zh-cn') }}
                    </div>
                    <div v-if="true" class="item">
                        <i class="dropdown icon" />
                        <span class="text">
                            <icon name="copy" />
                            {{ $t('S_COPY_TO', memInfo.config.lang || 'zh-cn') }}
                        </span>
                        <div class="right menu">
                            <div
                                v-for="(item,key) in pageOptions"
                                :key="key"
                                class="item"
                                @click="onCopy(item)"
                            >
                                {{ item.name[memInfo.config.lang || 'zh-cn'] }}
                            </div>
                        </div>
                    </div>
                    <div v-if="syncButton" class="item">
                        <i class="dropdown icon" />
                        <span>
                            <icon name="clone" />
                            {{ $t('S_SYNCHRONIZED_TO', memInfo.config.lang || 'zh-cn') }}
                        </span>
                        <div class="right menu">
                            <div
                                v-for="lang in langOptions"
                                :key="lang.type"
                                class="item"
                                @click="onSync(lang.type)"
                            >
                                {{ lang.name }}
                            </div>
                        </div>
                    </div>
                    <div v-if="themeButton" class="item">
                        <i class="dropdown icon" />
                        <span>
                            <icon name="th" />
                            {{ $t('S_LAYOUT', memInfo.config.lang || 'zh-cn') }} {{ element.theme }}
                        </span>
                        <div class="right menu">
                            <div
                                v-for="themeType in theme"
                                :key="`theme-${themeType}`"
                                class="item"
                                @click="$emit('toggleTheme', element.i, themeType)"
                            >
                                {{ themeType }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="content">
            <slot />
        </div>
        <!-- 版塊設定 -->
        <element-setting
            :setting-index="isSetting"
            :element="element"
            :list="['background']"
            @close="onSettingClose"
        />
    </div>
</template>

<script>
/* global $ */
/**
 * 共用元件 - 版塊共用外框
 * @param {Number} modelId - 版型 ID
 * @param {String} modelStyleColor - 版型色系
 * @param {Object} [element={}] - 版塊資訊
 *
 * @slot {Slot} name:無 - 版塊內容區塊
 */

import { mapGetters, mapActions } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import positionTrans from '@/lib/position_trans';
import elementSetting from './elementSetting';

export default {
    components: {
        elementSetting
    },
    props: {
        modelId: {
            type: Number,
            required: true
        },
        modelStyleColor: {
            type: String,
            required: true
        },
        element: {
            type: Object,
            default: () => {}
        },
        elementName: {
            type: String,
            default: ''
        },
        bgSettingButton: {
            type: Boolean,
            default: true
        },
        copyButton: {
            type: Boolean,
            default: true
        },
        syncButton: {
            type: Boolean,
            default: true
        },
        themeButton: {
            type: Boolean,
            default: true
        },
        theme: {
            type: Array,
            default: () => ['A', 'B']
        }
    },
    data() {
        return {
            isSetting: ''
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            isBackEnd: 'getIsBackEnd',
            cdnDomain: 'getCdnDomain',
            nowpage: 'getNowpage',
            pageData: 'getPageData',
            curLang: 'getCurLang',
            lang: 'getLang',
            page: 'getPage',
            allLanguage: 'getAllLanguage',
            readOnly: 'getReadOnly'
        }),
        langOptions() {
            return this.allLanguage
                .filter((lang) => this.lang[lang.type] && lang.type !== this.curLang);
        },
        pageOptions() {
            return this.page.filter((item) => item.linkTo === undefined && item.page_id !== this.nowpage);
        },
        mainClass() {
            return [
                'element-wrap',
                `tpl-${this.modelId}`,
                this.modelStyleColor,
                `element-${this.elementName || 'normal'}`
            ];
        }
    },
    mounted() {
        if (this.isBackEnd) {
            this.$on('toggleTheme', this.toggleTheme);
            this.$on('setting', this.onSetting);
            $(this.$refs['dropdown-setting']).dropdown({ on: 'hover', action: 'nothing' });
        }
    },
    beforeDestroy() {
        if (this.isBackEnd) {
            // 卸載下拉選單
            $(this.$refs['dropdown-setting']).dropdown('destroy');
        }
    },
    methods: {
        ...mapActions([
            'actionGetLayout',
            'actionElementSave',
            'actionCaseSave',
            'actionElementCopy'
        ]),
        onSetting() {
            this.isSetting = this.element.i;
        },
        onSettingClose() {
            this.isSetting = '';
        },
        onSync(copyTo) {
            const resultElement = cloneDeep(this.element);

            resultElement.case.data = resultElement.case.data.map((data, index) => {
                const result = cloneDeep(data);

                Object.keys(this.element.case.data[index])
                    .forEach((field) => {
                        result[field][copyTo] = data[field][this.curLang];
                    });
                return result;
            });

            resultElement.case.content = resultElement.case.content.map((data) => {
                const result = cloneDeep(data);

                result[copyTo] = data[this.curLang];

                return result;
            });

            this.actionCaseSave({
                case_id: resultElement.i,
                content: [...resultElement.case.content],
                field: [...resultElement.case.data],
                setting: { ...resultElement.case.setting }
            }).then((response) => {
                if (response.status !== 'Y') {
                    this.$swal({
                        title: response.message || this.$t('S_CONTACT_SERVICE', this.memInfo.config.lang || 'zh-cn'),
                        type: 'error'
                    });
                }
            });
        },
        onCopy(copyTo) {
            const copyData = cloneDeep(this.element);
            copyData.i = '';
            const pageData = this.pageData[copyTo.page_id].data ? cloneDeep(this.pageData[copyTo.page_id].data) : [];
            pageData.push(copyData);
            const data = {
                delete_id: [],
                gridInfo: pageData,
                page_id: copyTo.page_id
            };
            this.actionElementCopy({ data }).then((response) => {
                if (response.status !== 'Y') {
                    this.$swal({
                        title: response.message || this.$t('S_CONTACT_SERVICE'),
                        type: 'error'
                    });
                }
            });
        },
        // 切換佈局
        toggleTheme(caseId, theme) {
            const data = {
                delete_id: [],
                gridInfo: [
                    ...this.pageData[this.nowpage].data.map((info) => {
                        const result = cloneDeep(info);
                        if (result.i === caseId) {
                            return {
                                ...result,
                                theme
                            };
                        }
                        return { ...result };
                    })
                ],
                page_id: this.nowpage
            };
            this.actionElementSave({ data }).then((response) => {
                if (response.status !== 'Y') {
                    this.$swal({
                        text: response.message || this.$t('S_CONTACT_SERVICE', this.memInfo.config.lang || 'zh-cn'),
                        type: 'error'
                    });
                }
            });
        },
        // 背景圖定位
        bgPosition(val) {
            return positionTrans(val);
        }
    }
};
</script>

<style lang="scss" scoped>
    .element-wrap {
        position: relative;
        box-sizing: border-box;

        &:hover {
            /* 修正「複製至」功能太長，被下面模塊 control wrap 蓋到 */
            z-index: 6;

            .control-wrap {
                opacity: 1;
            }
        }

        .control-wrap {
            position: absolute;
            z-index: 5;
            top: 10px;
            left: 14px;
            opacity: 0;
            transition: opacity .3s;
        }
    }

</style>
