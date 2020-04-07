<template>
    <div
        ref="component-modal"
        class="ui modal small"
    >
        <div class="header">
            <i class="edit outline large icon" /> 版塊背景設定
            <div class="modal-close" />
        </div>
        <div class="ui form content">
            <!-- 背景圖設定 -->
            <div class="ui form content image">
                <div class="field">
                    <label>{{ $t('S_BACKGROUND_UPLOAD', memInfo.config.lang || 'zh-cn') }}</label>
                    <dropzone
                        :styles="dropStyle"
                        :types="['jpg', 'jpeg', 'gif', 'png']"
                        :cur-image="backgroundData.image"
                        :on-complete="onUpload"
                        :on-remove="onRemove"
                        class="image-upload"
                    >
                        <img :src="$getCdnPath('/static/image/common/upload-straight.png')" class="image" />
                        <p class="type-list">JPG JPEG GIF PNG</p>
                        <p class="reminder">
                            <span class="tip-text">{{ $text('S_UPLOAD_FILE_SIZE_SUGGEST', { locale: memInfo.config.lang || 'zh-cn' }) }}</span>
                            <span class="tip-size">500 KB</span>
                            ，
                            <span class="tip-text">{{ $text('S_UPLOAD_FILE_SIZE_LIMIT', { locale: memInfo.config.lang || 'zh-cn' }) }}</span>
                            <span class="tip-size">2 MB</span>
                        </p>
                    </dropzone>
                </div>
            </div>
            <div class="ui form content clearfix">
                <!-- 背景颜色設定 -->
                <div class="field bg-color">
                    <label>{{ $t('S_BACKGROUND_COLOR', memInfo.config.lang || 'zh-cn') }}</label>
                    <color-picker
                        :color-val="backgroundData.color || ''"
                        :on-change="(val) => { onBgChange('color', val) }"
                    />
                </div>
                <!-- 背景 對齊/並排 設定 -->
                <div class="field bg-position-repeat">
                    <label>{{ $t('S_BACKGROUND_ALIGN', memInfo.config.lang || 'zh-cn') }}</label>
                    <position-site
                        :align-val="backgroundData.position"
                        :disabled="!backgroundData.image"
                        :on-change="(val) => { onBgChange('position', val) }"
                    />
                    <label class="bg-repeat-label">{{ $t('S_BACKGROUND_REPEAT', memInfo.config.lang || 'zh-cn') }}</label>
                    <semantic-dropdown
                        :options="bgRepeatOption"
                        :disabled="!backgroundData.image"
                        :on-change="(val) => { onBgChange('repeat', val) }"
                    />
                </div>
            </div>
            <!-- 背景隨頁面捲動 (先不加) -->
            <!-- <div class="ui form content">
                <div class="field">
                    <label>{{ $t('S_BACKGROUND_SCROLL') }}</label>
                </div>
                <div class="ui toggle checkbox scroll-checkbox">
                    <input
                        v-model="backgroundData.scroll"
                        :disabled="!backgroundData.image"
                        :class="!backgroundData.image ? 'disabled' : ''"
                        type="checkbox"
                    />
                    <label />
                </div>
            </div> -->
        </div>
        <!-- 模塊與模塊的距離設定 -->
        <moudle-space
            v-if="config.mainPopupEdit.spaceEdit"
            v-model="moduleSpace"
            :element="element"
        />
        <div class="actions">
            <div
                :class="['ui', 'button', 'primary', { disabled: submitting }]"
                @click="onComfirm"
            >
                {{ $t('S_CONFIRM', memInfo.config.lang || 'zh-cn') }}
            </div>
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
import dropzone from '@/components/dropzone';
import colorPicker from '@/components/colorPicker';
import positionSite from '@/components/positionSite';
import semanticDropdown from '@/components/semanticDropdown';

/**
 * 模塊主體設定(背景樣式設定)
 * @module element/common/mainSetting
 * @param {string|number} settingIndex - 當前設定項目索引值
 * @param {object} element - 模塊資料
 */
export default {
    components: {
        colorPicker,
        positionSite,
        semanticDropdown,
        dropzone,
        moudleSpace: () => import(/* webpackChunkName: 'moudleSpace' */'./fields/moudleSpace')
    },
    props: {
        settingIndex: {
            type: [String, Number],
            required: true
        },
        element: {
            type: Object,
            default: () => ({})
        },
        config: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            backgroundData: {
                color: this.element.case.setting['background-color'] || '',
                position: this.element.case.setting['background-position'] || 'ct',
                repeat: this.element.case.setting['background-repeat'] || 'no-repeat',
                image: this.element.case.setting['background-image'] || ''
            },
            dropStyle: {
                width: '600px',
                height: '250px',
                'border-radius': '3px'
            },
            moduleSpace: {
                'margin-top': this.element.case.setting['margin-top'] || '0',
                'margin-bottom': this.element.case.setting['margin-bottom'] || '0',
                'padding-top': this.element.case.setting['padding-top'] || '0',
                'padding-bottom': this.element.case.setting['padding-bottom'] || '0',
                'padding-left': this.element.case.setting['padding-left'] || '0',
                'padding-right': this.element.case.setting['padding-right'] || '0'
            },
            submitting: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        /**
         * 取得背景重複方式
         * @method bgRepeatOption
         * @returns {array} 給下拉選單使用的 option
         */
        bgRepeatOption() {
            const { repeat } = this.backgroundData;

            return [
                {
                    name: this.$t('S_DISPLAY_NOT_SIDE_BY_SIDE', this.memInfo.config.lang || 'zh-cn'),
                    value: 'no-repeat',
                    selected: (repeat === '' || repeat === 'no-repeat')
                },
                {
                    name: this.$t('S_DISPLAY_SIDE_BY_SIDE', this.memInfo.config.lang || 'zh-cn'),
                    value: 'repeat',
                    selected: repeat === 'repeat'
                },
                {
                    name: this.$t('S_DISPLAY_H_SIDE_BY_SIDE', this.memInfo.config.lang || 'zh-cn'),
                    value: 'repeat-x',
                    selected: repeat === 'repeat-x'
                },
                {
                    name: this.$t('S_DISPLAY_V_SIDE_BY_SIDE', this.memInfo.config.lang || 'zh-cn'),
                    value: 'repeat-y',
                    selected: repeat === 'repeat-y'
                }
            ];
        }
    },
    mounted() {
        // modal 初始設定
        $(this.$refs['component-modal']).modal({
            autofocus: false,
            closable: false,
            onHidden: () => { this.$emit('close'); }
        });

        try {
            this.backgroundData = {
                color: this.element.case.setting['background-color'],
                position: this.element.case.setting['background-position'],
                repeat: this.element.case.setting['background-repeat'],
                image: this.element.case.setting['background-image']
            };
        } catch (err) {
            this.backgroundData = {
                color: '',
                position: '',
                repeat: '',
                image: ''
            };
        }

        $(this.$refs['component-modal']).modal('show');
    },
    beforeDestroy() {
        $(this.$refs['component-modal']).modal('destroy');
    },
    methods: {
        ...mapActions([
            'actionCaseSave'
        ]),
        /**
         * 背景更新，設定 data 資料
         * @method onBgChange
         * @param {string} prop - 背景資料的 key 值
         * @param {string} val - 更新背景資料的值
         */
        onBgChange(prop, val) {
            this.backgroundData = {
                ...this.backgroundData,
                [prop]: val
            };
        },
        /**
         * 上傳圖片
         * @method onUpload
         * @param {string} type - 上傳類型
         * @param {number} id - 當前檔案 id
         * @param {string} name - 檔案名稱
         * @param {object} response - 上傳後 server 回傳資料
         */
        onUpload(id, name, response) {
            if (response.status === 'Y') {
                this.backgroundData = {
                    ...this.backgroundData,
                    image: response.data.link
                };
            }
        },
        /**
         * 移除圖片
         * @method onRemove
         */
        onRemove() {
            this.backgroundData = {
                ...this.backgroundData,
                image: ''
            };
        },
        /**
         * 送出表單
         * @method onComfirm
         */
        onComfirm() {
            if (this.submitting) {
                return;
            }
            this.submitting = true;
            this.actionCaseSave({
                case_id: this.settingIndex,
                content: [...this.element.case.content],
                field: [...this.element.case.data],
                setting: {
                    ...this.element.case.setting,
                    'background-color': this.backgroundData.color,
                    'background-position': this.backgroundData.position,
                    'background-repeat': this.backgroundData.repeat,
                    'background-image': this.backgroundData.image,
                    'margin-top': this.moduleSpace['margin-top'],
                    'margin-bottom': this.moduleSpace['margin-bottom'],
                    'padding-top': this.moduleSpace['padding-top'],
                    'padding-bottom': this.moduleSpace['padding-bottom'],
                    'padding-left': this.moduleSpace['padding-left'],
                    'padding-right': this.moduleSpace['padding-right']
                }
            }).then((response) => {
                if (response.status !== 'Y') {
                    this.$swal({
                        title: response.message || this.$t('S_CONTACT_SERVICE', this.memInfo.config.lang || 'zh-cn'),
                        type: 'error'
                    });
                } else {
                    this.onClose();
                }
                this.submitting = false;
            });
        },
        /**
         * 關閉 semantic modal
         * @method onClose
         */
        onClose() {
            $(this.$refs['component-modal']).modal('hide');
        }
    }
};
</script>

<style lang="scss" scoped>
.content {
    /deep/ {
        .style-bg-color-dropdown {
            border: none;
        }
    }

    &.image {
        margin-bottom: 30px;
    }

    &.ui.form {
        .field {
            &.bg-color,
            &.bg-position-repeat {
                float: left;
                margin-bottom: 0;
                clear: none;
            }

            &.bg-color {
                margin-right: 30px;
            }

            &.bg-position-repeat {
                min-width: 346px;

                .bg-repeat-label {
                    margin-top: 16px;
                }
            }
        }
    }

    .scroll-checkbox {
        input {
            &.disabled {
                cursor: no-drop;
            }
        }
    }

    .image-upload {
        /deep/ {
            .default-block {
                width: inherit;
                text-align: center;
                padding-top: 59px;

                img {
                    display: block;
                    margin: 0 auto 8px;
                }

                .type-list {
                    color: #D2D2D2;
                    font-size: 14px;
                    margin: 0;
                }

                .reminder {
                    margin: 14px auto 0;

                    .tip-text {
                        font-size: 13px;
                        color: #131304;
                    }

                    .tip-size {
                        font-size: 13px;
                        font-weight: bold;
                        color: #1783D2;
                        text-decoration: underline;
                    }
                }
            }
        }
    }
}
</style>
