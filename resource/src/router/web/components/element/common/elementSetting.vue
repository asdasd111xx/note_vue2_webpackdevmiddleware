<template>
    <div
        v-if="isBackEnd"
        ref="component-modal"
        class="ui modal small"
    >
        <div class="header">
            <i class="edit outline large icon" /> {{ $t('S_ELEMENT_BACKGROUND_SETTING', memInfo.config.lang || 'zh-cn') }}
            <div class="modal-close" />
        </div>
        <div v-if="list.includes('background')" class="ui form content">
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
                    >
                        <img :src="$getCdnPath('/static/image/common/upload-straight.png')" class="image" />
                        <p class="type-list">JPG JPEG GIF PNG</p>
                        <p class="reminder">
                            <span class="tip-text">
                                {{ $text('S_UPLOAD_FILE_SIZE_SUGGEST', {
                                    text: '上传档案大小建议为',
                                    locale: memInfo.config.lang || 'zh-cn'
                                }) }}
                            </span>
                            <span class="tip-size">500 KB</span>
                            ，
                            <span class="tip-text">
                                {{ $text('S_UPLOAD_FILE_SIZE_LIMIT', {
                                    text: '最大档案限制不得超过',
                                    locale: memInfo.config.lang || 'zh-cn'
                                }) }}
                            </span>
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
                        v-if="settingIndex !== ''"
                        :color-val="backgroundData.color || ''"
                        :on-change="onBgColorChang"
                    />
                </div>
                <!-- 背景 對齊/並排 設定 -->
                <div class="field bg-position-repeat">
                    <label>{{ $t('S_BACKGROUND_ALIGN', memInfo.config.lang || 'zh-cn') }}</label>
                    <position-site
                        :align-val="backgroundData.position"
                        :disabled="bgSetDisabled"
                        :on-change="onBgPositionChang"
                    />
                    <label class="bg-repeat-label">{{ $t('S_BACKGROUND_REPEAT', memInfo.config.lang || 'zh-cn') }}</label>
                    <semantic-dropdown
                        :options="bgRepeatOption"
                        :disabled="bgSetDisabled"
                        :on-change="onBgRepeatChang"
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
                        :disabled="bgSetDisabled"
                        :class="bgSetDisabled ? 'disabled' : ''"
                        type="checkbox"
                    />
                    <label />
                </div>
            </div> -->
        </div>
        <div class="actions">
            <div :class="['ui', 'button', 'primary', { disabled: submitting }]" @click="onComfirm">{{ $t('S_CONFIRM', memInfo.config.lang || 'zh-cn' ) }}</div>
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

export default {
    components: {
        colorPicker,
        positionSite,
        semanticDropdown,
        dropzone
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
        list: {
            type: Array,
            default: () => []
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
            submitting: false
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            curLang: 'getCurLang',
            page: 'getPage',
            isBackEnd: 'getIsBackEnd'
        }),
        bgSetDisabled() {
            return !this.backgroundData.image;
        },
        bgRepeatVal() {
            return this.backgroundData.repeat;
        },
        bgRepeatOption() {
            return [
                {
                    name: this.$t('S_DISPLAY_NOT_SIDE_BY_SIDE', this.memInfo.config.lang || 'zh-cn'),
                    value: 'no-repeat',
                    selected: (this.bgRepeatVal === '' || this.bgRepeatVal === 'no-repeat')
                },
                {
                    name: this.$t('S_DISPLAY_SIDE_BY_SIDE', this.memInfo.config.lang || 'zh-cn'),
                    value: 'repeat',
                    selected: this.bgRepeatVal === 'repeat'
                },
                {
                    name: this.$t('S_DISPLAY_H_SIDE_BY_SIDE', this.memInfo.config.lang || 'zh-cn'),
                    value: 'repeat-x',
                    selected: this.bgRepeatVal === 'repeat-x'
                },
                {
                    name: this.$t('S_DISPLAY_V_SIDE_BY_SIDE', this.memInfo.config.lang || 'zh-cn'),
                    value: 'repeat-y',
                    selected: this.bgRepeatVal === 'repeat-y'
                }
            ];
        }
    },
    watch: {
        settingIndex() {
            let backgroundData;

            if (this.settingIndex === '') {
                $(this.$refs['component-modal']).modal('hide');
                return;
            }

            if (this.list.includes('background')) {
                try {
                    backgroundData = {
                        color: this.element.case.setting['background-color'],
                        position: this.element.case.setting['background-position'],
                        repeat: this.element.case.setting['background-repeat'],
                        image: this.element.case.setting['background-image']
                    };
                } catch (err) {
                    backgroundData = {
                        color: '',
                        position: '',
                        repeat: '',
                        image: ''
                    };
                }

                this.backgroundData = backgroundData;
            }

            $(this.$refs['component-modal']).modal('show');
        }
    },
    mounted() {
        // modal 初始設定
        $(this.$refs['component-modal']).modal({
            autofocus: false,
            closable: false,
            onHidden: this.onClose
        });
    },
    beforeDestroy() {
        $(this.$refs['component-modal']).modal('destroy');
    },
    methods: {
        ...mapActions([
            'actionCaseSave'
        ]),
        onBgColorChang(val) {
            this.backgroundData = {
                ...this.backgroundData,
                color: val
            };
        },
        onBgPositionChang(val) {
            this.backgroundData = {
                ...this.backgroundData,
                position: val
            };
        },
        onBgRepeatChang(val) {
            this.backgroundData = {
                ...this.backgroundData,
                repeat: val
            };
        },
        onUpload(id, name, response) {
            if (response.status === 'Y') {
                this.backgroundData = {
                    ...this.backgroundData,
                    image: response.data.link
                };
            }
        },
        onRemove() {
            this.backgroundData = {
                ...this.backgroundData,
                image: ''
            };
        },
        onComfirm() {
            if (this.submitting) {
                return;
            }
            this.updateField({
                setting: {
                    ...this.element.case.setting,
                    'background-color': this.backgroundData.color,
                    'background-position': this.backgroundData.position,
                    'background-repeat': this.backgroundData.repeat,
                    'background-image': this.backgroundData.image
                }
            });
        },
        onClose() {
            this.$emit('close');
        },
        updateField(data) {
            this.submitting = true;
            this.actionCaseSave({
                case_id: this.settingIndex,
                content: [...this.element.case.content],
                field: [...this.element.case.data],
                setting: { ...this.element.case.setting },
                ...data
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
