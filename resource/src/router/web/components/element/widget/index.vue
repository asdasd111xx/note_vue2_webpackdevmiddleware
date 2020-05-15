<template>
    <div
        ref="widget"
        :style="bgStyle"
        class="element-wrap is-widget"
    >
        <widget-view
            ref="widget-view"
            :selected-index.sync="selectedIndex"
            :view-data.sync="caseData"
            :widget-status.sync="widgetStatus"
            :enable="hasWidgetControl"
            :present-status="presentStatus"
            class="content"
        >
            <template v-if="isBackEnd" slot="append-element">
                <empty-tips v-if="!caseData.length" :mode="mode" />
                <status-bar
                    :mode.sync="mode"
                    :present-status.sync="presentStatus"
                    :on-setting="onSetting"
                    :on-copy="onCopy"
                    :on-sync="onSync"
                    class="status-bar-wrap"
                />
                <div
                    :class="['btn-save', isEdited && 'is-edited']"
                    @click="() => { onSaveClick(); }"
                >
                    {{ saveBtnText }}
                </div>
            </template>
        </widget-view>
        <transition
            name="fade-drag-height"
            enter-active-class="fadeInDown"
            leave-active-class="fadeOutUp"
        >
            <drag-height
                v-if="hasWidgetControl"
                :case-data="caseData"
                :wrap-style.sync="wrapStyle"
                :widget-refs="$refs['widget-view']"
            />
        </transition>
        <transition
            name="fade-list"
            enter-active-class="fadeInDown"
            leave-active-class="fadeOutUp"
        >
            <div
                v-if="hasWidgetControl && widgetEditIndex !== '' && widgetEditIndex === elementIndex"
                class="control-bar"
                @mousedown.stop
                @keydown.stop
            >
                <widget-list
                    :case-data.sync="caseData"
                    class="widget-list"
                />
                <widget-edit
                    v-if="widgetStatus.type"
                    :key="selectedIndex"
                    :selected-index.sync="selectedIndex"
                    :case-data.sync="caseData"
                    :widget-refs="$refs['widget-view']"
                    :status="widgetStatus"
                    class="widget-edit"
                />
            </div>
        </transition>
        <widget-setting
            v-if="isSettingShow"
            :settings.sync="wrapStyle"
            @close="isSettingShow = false"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import isNil from 'lodash/isNil';
import isObjectLike from 'lodash/isObjectLike';
import positionTrans from '@/lib/position_trans';
import isJsonStr from '@/lib/isJsonStr';
import widgetView from '../../widgetView';
import emptyTips from './emptyTips';
import statusBar from './statusBar';
import widgetSetting from './widgetSetting';
import widgetList from './widgetList';
import widgetEdit from './widgetEdit';
import dragHeight from './dragHeight';
import { widgetsData } from '../../widgetView/widget/setting';

export default {
    components: {
        widgetView,
        emptyTips,
        statusBar,
        widgetSetting,
        widgetList,
        widgetEdit,
        dragHeight
    },
    props: {
        element: {
            type: Object,
            default: () => {}
        },
        elementIndex: {
            type: Number,
            required: true
        },
        widgetEditIndex: {
            type: [String, Number],
            required: true
        }
    },
    data() {
        return {
            mode: 'view',
            present: 'logout',
            clonedCaseData: cloneDeep(this.element.case.data),
            caseSetting: cloneDeep(this.element.case.setting),
            selectedIndex: -1,
            widgetStatus: {},
            isEdited: false,
            isHover: false,
            timer: null,
            counter: 30,
            isSaving: false,
            isSettingShow: false
        };
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            cdnDomain: 'getCdnDomain',
            lang: 'getLang',
            curLang: 'getCurLang',
            webInfo: 'getWebInfo',
            memInfo: 'getMemInfo',
            pageData: 'getPageData',
            loginStatus: 'getLoginStatus'
        }),
        caseData: {
            get() {
                /**
                 * 重要！！！務必留意
                 * 新增部件的時候，widget 資訊並無多語系，但為了符合現行資料儲存格式
                 * 儲存資料到 this.element.case.data 時要以多語系的方式儲存
                 * 當頁面重整時會取得有語系的 widget 資料，故要將 widget 資訊轉為無語系的格式
                 */
                return this.clonedCaseData.map((data) => {
                    const dataType = data.type[this.curLang] || data.type;
                    return {
                        ...Object
                            .keys(data)
                            .reduce((init, key) => {
                                if (key === 'key') {
                                    return {
                                        ...init,
                                        [key]: data[key][this.curLang]
                                    };
                                }
                                if (isNil(widgetsData[dataType].widget[key])) {
                                    return {
                                        ...init,
                                        [key]: Object
                                            .keys(this.lang)
                                            .reduce((langInit, langKey) => ({
                                                ...langInit,
                                                [langKey]: isJsonStr(data[key][langKey]) ? JSON.parse(data[key][langKey]) : data[key][langKey]
                                            }), {})
                                    };
                                }
                                return {
                                    ...init,
                                    [key]: isJsonStr(data[key][this.curLang]) ? JSON.parse(data[key][this.curLang]) : data[key][this.curLang]
                                };
                            }, {})
                    };
                });
            },
            set(value) {
                /**
                 * 為了與 this.element.case.data 的格式一致
                 * 設定的資料，widget 資訊要再轉為有多語系的形式存入
                 */
                this.clonedCaseData = value.map((data) => ({
                    ...Object
                        .keys(data)
                        .reduce((init, key) => ({
                            ...init,
                            [key]: Object
                                .keys(this.lang)
                                .reduce((langInit, langKey) => ({
                                    ...langInit,
                                    [langKey]: (() => {
                                        if (key === 'key') {
                                            return data[key];
                                        }

                                        const resultVal = isNil(widgetsData[data.type].widget[key]) ? data[key][langKey] : data[key];
                                        return isObjectLike(resultVal) ? JSON.stringify(resultVal) : resultVal;
                                    })()
                                }), {})
                        }), {})
                }));
                this.isEdited = true;
            }
        },
        wrapStyle: {
            get() {
                return this.caseSetting.wrapStyle ? JSON.parse(this.caseSetting.wrapStyle) : {};
            },
            set(value) {
                this.$set(this.caseSetting, 'wrapStyle', JSON.stringify(value));

                // 重新計算 vue-draggable-resizable 對父層邊界的限制
                (this.$refs['widget-view'].$refs.vdr || []).forEach((curDom) => {
                    curDom.checkParentSize();
                });

                this.isEdited = true;
            }
        },
        /**
         * 模塊背景 css 樣式
         * @method bgStyle
         * @returns {object} css 樣式物件
         */
        bgStyle() {
            return {
                ...this.wrapStyle,
                'background-image': this.wrapStyle['background-image'] ? `url('${this.$getCdnPath(this.cdnDomain + this.wrapStyle['background-image'])}')` : '',
                'background-position': this.wrapStyle['background-position'] ? positionTrans(this.wrapStyle['background-position']) : ''
            };
        },
        hasWidgetControl() {
            return this.isBackEnd && this.mode === 'edit';
        },
        saveBtnText() {
            if (!this.isEdited) {
                return this.$text('S_NOT_EDIT', { locale: this.memInfo.config.lang || 'zh-cn' });
            }

            if (this.isSaving) {
                return this.$text('S_SAVING', { locale: this.memInfo.config.lang || 'zh-cn' });
            }
            return this.$text('S_SAVE_AFTER_SECONDS', { locale: this.memInfo.config.lang || 'zh-cn', replace: `${this.counter}` });
        },
        presentStatus: {
            get() {
                if (!this.isBackEnd) {
                    return this.loginStatus ? 'login' : 'logout';
                }
                return this.present;
            },
            set(status) {
                this.present = status;
            }
        }
    },
    watch: {
        mode(value) {
            if (value === 'edit') {
                this.$emit('update:widgetEditIndex', this.elementIndex);
            }
        },
        widgetEditIndex(value) {
            this.$nextTick(() => {
                if (this.elementIndex !== value) {
                    this.mode = 'view';
                }
            });
        },
        // eslint-disable-next-line
        'caseData.length'() {
            // 移除 newWidget 的 key，僅作為新增時明顯標示用
            // 不要改成 this.$nextTick()，新增的第一筆會無法正確運作
            setTimeout(() => {
                this.caseData = this.caseData.map((data) => ({
                    ...Object.keys(data).reduce((init, key) => {
                        if (key === 'newWidget') {
                            return init;
                        }
                        return {
                            ...init,
                            [key]: data[key]
                        };
                    }, {})
                }));
            }, 500);
        },
        isEdited(nowValue) {
            if (nowValue) {
                this.timer = setInterval(() => {
                    if (this.counter <= 0) {
                        clearInterval(this.timer);
                        this.timer = null;
                        this.counter = 30;
                        this.onSaveClick(true);
                        this.isEdited = false;
                        return;
                    }
                    this.counter -= 1;
                }, 1000);
                return;
            }

            clearInterval(this.timer);
            this.timer = null;
            this.counter = 30;
        }
    },
    created() {
        if (this.isBackEnd && Object.keys(this.caseSetting).length === 0) {
            this.initCase();
        }
    },
    methods: {
        ...mapActions([
            'actionCaseSave',
            'actionGetLayout',
            'actionElementCopy'
        ]),
        onSetting() {
            this.isSettingShow = true;
        },
        /**
         * 複製資料至其它頁面
         * @method onCopy
         * @param {number} pageId - 目標頁面 id
         */
        onCopy(pageId) {
            const copyCase = () => {
                this.actionGetLayout({ setNowPage: false, pageId }).then(() => {
                    const copyElement = cloneDeep(this.element);
                    const pageData = this.pageData[pageId].data ? cloneDeep(this.pageData[pageId].data) : [];
                    copyElement.i = '';
                    copyElement.case.data = cloneDeep(this.clonedCaseData);
                    pageData.push(copyElement);

                    const data = {
                        delete_id: [],
                        gridInfo: pageData,
                        page_id: pageId
                    };
                    this.actionElementCopy({ data }).then((response) => {
                        if (response.status !== 'Y') {
                            this.$swal({
                                title: response.message || this.$t('S_CONTACT_SERVICE', this.memInfo.config.lang || 'zh-cn'),
                                type: 'error'
                            });
                        }
                    });
                });
            };

            if (this.isEdited) {
                this.$swal({
                    type: 'warning',
                    // text: this.$t('S_DEPLOY_CONFIRMATION', this.memInfo.config.lang || 'zh-cn'),
                    text: '要先储存才能执行此动作，是否储存？',
                    showCancelButton: true
                }).then((result) => {
                    if (!result.value) {
                        return;
                    }

                    this.onSaveClick().then(copyCase);
                });
                return;
            }

            copyCase();
        },
        onSync(targetLang) {
            this.$swal({
                type: 'warning',
                // text: this.$t('S_DEPLOY_CONFIRMATION', this.memInfo.config.lang || 'zh-cn'),
                text: '执行此动作后统会自动储存，是否继续同步？',
                showCancelButton: true
            }).then((result) => {
                if (!result.value) {
                    return;
                }

                this.clonedCaseData = cloneDeep(this.clonedCaseData
                    .map((data) => Object.keys(data).reduce((init, key) => ({
                        ...init,
                        [key]: {
                            ...data[key],
                            [targetLang]: data[key][this.curLang]
                        }
                    }), {})));

                this.isEdited = true;
                this.onSaveClick();
            });
        },
        initCase() {
            if (!this.isBackEnd) {
                return;
            }

            const eleData = '';
            const fieldData = [];
            const contentData = [];

            if (!eleData) {
                return;
            }

            // 組 api 資料
            eleData.data.forEach((data) => {
                const fields = {};
                const fieldContent = {};

                Object.keys(this.lang).forEach((lang) => {
                    Object.keys(data).forEach((fieldName) => {
                        if (!fields[fieldName]) {
                            fields[fieldName] = {};
                        }

                        fields[fieldName][lang] = data[fieldName];
                    });
                });
                fieldData.push(fields);
                contentData.push(fieldContent);
            });

            this.clonedCaseData = [
                ...this.clonedCaseData,
                ...fieldData
            ];

            this.caseSetting = {
                ...this.element.case.setting,
                wrapStyle: JSON.stringify(eleData.setting)
            };

            this.onCaseSave({
                content: [...contentData],
                field: this.caseData,
                setting: this.caseSetting
            }).then((status) => {
                if (status === 'Y') {
                    this.isEdited = false;
                }
            });
        },
        onSaveClick(isAutoSave) {
            if (this.isEdited) {
                this.isSaving = true;
                return this.onCaseSave({
                    field: this.clonedCaseData,
                    setting: this.caseSetting,
                    loading: !isAutoSave
                }).then((status) => {
                    this.isSaving = false;

                    if (!isAutoSave && status === 'Y') {
                        this.isEdited = false;
                    }
                });
            }

            return Promise((resolve) => resolve());
        },
        onCaseSave(updateData) {
            return this.actionCaseSave({
                case_id: this.element.i,
                content: this.element.case.content,
                field: this.element.case.data,
                setting: this.element.case.setting,
                loading: true,
                ...updateData
            }).then((response) => {
                // 重新計算 vue-draggable-resizable 對父層邊界的限制
                (this.$refs['widget-view'].$refs.vdr || []).forEach((curDom) => {
                    curDom.checkParentSize();
                });

                if (response.status !== 'Y') {
                    this.$swal({
                        title: response.message || this.$t('S_CONTACT_SERVICE'),
                        type: 'error'
                    });
                }

                return response.status;
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.element-wrap {
    position: relative;

    &:hover {
        .status-bar-wrap {
            opacity: 1;
        }
    }

    .status-bar-wrap {
        opacity: 0;
        transition: opacity .5s ease;
    }

    .btn-save {
        position: absolute;
        right: 20px;
        top: 15px;
        background: url('/static/image/element/widget/ui/icon_save.png') 10px 7px no-repeat #DDD;
        padding: 0 8px 0 20px;
        height: 30px;
        line-height: 2.5;
        font-size: 12px;
        color: #FFF;
        border-radius: 4px;
        text-align: center;
        text-indent: 10px;

        &.is-edited {
            background-color: #00B5AD;
            cursor: pointer;
        }
    }

    .empty-tip {
        position: absolute;
        top: 50%;
        margin-top: -22px;
        width: 100%;
        line-height: normal;
        text-align: center;
        font-size: 32px;
        color: #999;
        letter-spacing: .5em;
    }

    .control-bar {
        position: absolute;
        z-index: 100;
        background: #F7F7F7;
        padding: 12px 0;
        width: 100%;
        min-height: 120px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    }
}
</style>
