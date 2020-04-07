<template>
    <div
        ref="component-modal"
        class="ui modal small"
    >
        <div class="header">
            <i class="edit outline large icon" /> 版塊背景設定
        </div>
        <div class="ui form content">
            <!-- 背景圖設定 -->
            <div class="ui form content image">
                <div class="field">
                    <label>{{ $t('S_BACKGROUND_UPLOAD', memInfo.config.lang || 'zh-cn') }}</label>
                    <dropzone
                        :styles="dropzoneStyle"
                        :types="['jpg', 'jpeg', 'gif', 'png']"
                        :cur-image="clonedSettings['background-image']"
                        :on-complete="onUpload"
                        :on-remove="onRemove"
                    />
                </div>
            </div>
            <div class="ui form content clearfix">
                <!-- 背景颜色設定 -->
                <div class="field bg-color">
                    <label>{{ $t('S_BACKGROUND_COLOR', memInfo.config.lang || 'zh-cn') }}</label>
                    <color-picker
                        :color-val="clonedSettings['background-color'] || ''"
                        :on-change="(val) => { onBgChange('background-color', val) }"
                    />
                </div>
                <!-- 背景 對齊/並排 設定 -->
                <div class="field bg-position-repeat">
                    <label>{{ $t('S_BACKGROUND_ALIGN', memInfo.config.lang || 'zh-cn') }}</label>
                    <position-site
                        :align-val="clonedSettings['background-position']"
                        :disabled="!clonedSettings['background-image']"
                        :on-change="(val) => { onBgChange('background-position', val) }"
                    />
                    <label class="bg-repeat-label">{{ $t('S_BACKGROUND_REPEAT', memInfo.config.lang || 'zh-cn') }}</label>
                    <semantic-dropdown
                        :options="bgRepeatOption"
                        :disabled="!clonedSettings['background-image']"
                        :on-change="(val) => { onBgChange('background-repeat', val) }"
                    />
                </div>
            </div>
        </div>
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
import cloneDeep from 'lodash/cloneDeep';
import { mapGetters, mapActions } from 'vuex';
import dropzone from '@/components/dropzone';
import colorPicker from '@/components/colorPicker';
import positionSite from '@/components/positionSite';
import semanticDropdown from '@/components/semanticDropdown';

/**
 * 模塊主體設定(背景樣式設定)
 * @module element/common/mainSetting
 * @param {Object} settings - 模塊設置功能資料
 */
export default {
    components: {
        colorPicker,
        positionSite,
        semanticDropdown,
        dropzone
    },
    props: {
        settings: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            clonedSettings: cloneDeep(this.settings),
            dropzoneStyle: {
                width: '600px',
                height: '250px',
                'border-radius': '3px'
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
            const repeat = this.clonedSettings['background-repeat'];

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

        $(this.$refs['component-modal']).modal('show');
    },
    beforeDestroy() {
        this.$emit('close');
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
            this.$set(this.clonedSettings, prop, val);
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
                this.$set(this.clonedSettings, 'background-image', response.data.link);
            }
        },
        /**
         * 移除圖片
         * @method onRemove
         */
        onRemove() {
            this.$set(this.clonedSettings, 'background-image', '');
        },
        /**
         * 送出表單
         * @method onComfirm
         */
        onComfirm() {
            this.$emit('update:settings', this.clonedSettings);
            this.onClose();
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
}
</style>
