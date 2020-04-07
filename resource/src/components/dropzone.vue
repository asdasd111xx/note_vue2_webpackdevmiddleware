<template>
    <div class="image-upload-wrap">
        <label>
            <dropzone v-if="uploader" :uploader="uploader">
                <div :style="dropWrapStyle" class="drop-wrap">
                    <div v-show="curImage" class="images-block">
                        <div v-if="imagesUrl && types.includes('swf') && !detectFlashState" class="missing-flash-tip">
                            <p>{{ $t('S_CURRENT_BROWSER_FLASH_NOT_SUPPORT', memInfo.config.lang || 'zh-cn') }}</p>
                        </div>
                        <template v-else>
                            <!-- 圖片管理功能 -->
                            <div class="uploaded-block ui tiny icon buttons">
                                <!-- 圖片預覽 -->
                                <template v-if="preview">
                                    <Viewer
                                        :options="viewerOption"
                                        class="images-viewer"
                                        @inited="viewerInit"
                                    >
                                        <img :src="imagesUrl" />
                                    </Viewer>
                                    <div
                                        :title="$t('S_PREVIEW', memInfo.config.lang || 'zh-cn')"
                                        class="preview-btn ui button"
                                        @click="handlePreview"
                                    >
                                        <i class="image icon" />
                                    </div>
                                </template>
                                <!-- 圖片刪除 -->
                                <div
                                    :title="$t('S_DELETE', memInfo.config.lang || 'zh-cn')"
                                    class="delete-btn ui button"
                                    @click="handleRemove"
                                >
                                    <i class="trash alternate icon" />
                                </div>
                            </div>
                            <!-- 預覽的 Flash -->
                            <object
                                v-if="imagesUrl && types.includes('swf')"
                                :data="imagesUrl"
                                type="application/x-shockwave-flash"
                                class="preview-flash"
                            />
                            <!-- 預覽的圖片 -->
                            <img
                                v-else
                                :src="imagesUrl"
                                :style="{
                                    'width': Number.isNaN(+previewWidth) ? previewWidth : `${previewWidth}px`,
                                    'height': Number.isNaN(+previewHeight) ? previewHeight : `${previewHeight}px`,
                                }"
                                class="img-pic"
                            />
                            <!-- 關閉預覽 -->
                            <template v-if="uploadedInfo && !preview">
                                <!-- 自定義上傳後區塊 -->
                                <slot v-if="$slots['uploaded']" name="uploaded" />
                                <!-- 預設上傳後區塊 -->
                                <div v-else class="img-info">
                                    <div class="align-set">
                                        <i class="check circle icon" />Uploaded!
                                    </div>
                                </div>
                            </template>
                        </template>
                    </div>
                    <!-- 上傳區塊 -->
                    <div v-show="(!uploadedInfo && !preview) || (uploadedInfo && !curImage)" class="default-block">
                        <slot />
                    </div>
                    <input
                        ref="input"
                        type="file"
                        @change="handleUpload"
                    />
                    <!-- 關閉視窗按鈕 -->
                    <slot name="closeBtn" />
                </div>
            </dropzone>
        </label>
    </div>
</template>

<script>
/**
 * 共用元件 - 圖片拖拉上傳
 * @param {Boolean} [preview=true] - 是否要顯示圖片預覽
 * @param {Boolean} [uploaded-info=true] - 是否要顯示圖片上傳資訊
 * @param {Object} [styles={}] - 拖拉上傳外框樣式設定
 * @param {Array} [types=[]] - 上傳的檔案類型
 * @param {Object} [params={}] - 發送請求時額外提供的參數
 * @param {String} [cur-image=''] - 圖片路徑
 * @param {Function} [on-complete=() => {}] - 請求完成(並非請求成功)
 * @param {Function} [on-error=() => {}] - 請求失敗
 * @param {Function} [on-remove=() => {}] - 移除圖片
 *
 * @slot {Slot} name:無 - 上傳區塊
 * @slot {Slot} name:uploaded - 上傳後區塊
 */

import Vue from 'vue';
import { mapGetters } from 'vuex';
import FineUploaderTraditional from 'fine-uploader-wrappers';
import Dropzone from 'vue-fineuploader/dropzone';
import Viewer from 'v-viewer/src/component';
import flashViewer from './flashViewer';

const FlashViewerComponent = Vue.extend(flashViewer);

export default {
    components: {
        Dropzone,
        Viewer
    },
    props: {
        // 是否提供預覽
        preview: {
            type: Boolean,
            default: true
        },
        // 預覽圖寬
        previewWidth: {
            type: [String, Number],
            default: 'inherit'
        },
        // 預覽圖高
        previewHeight: {
            type: [String, Number],
            default: 'inherit'
        },
        // 是否提供上傳完成樣式
        uploadedInfo: {
            type: Boolean,
            default: true
        },
        // 樣式
        styles: {
            type: Object,
            default() {
                return {};
            }
        },
        // 檔案類型
        types: {
            type: Array,
            default() {
                return [];
            }
        },
        // 發送請求時額外提供的參數
        params: {
            type: Object,
            default() {
                return {};
            }
        },
        // 當前顯示圖片
        curImage: {
            type: String,
            default: ''
        },
        // 上傳檔案最大大小
        maxSize: {
            type: Number,
            default: 0
        },
        // 上傳圖片最大寬度
        maxWidth: {
            type: Number,
            default: 0
        },
        // 上傳圖片最大高度
        maxHeight: {
            type: Number,
            default: 0
        },
        // 上傳圖片最小寬度
        minWidth: {
            type: Number,
            default: 0
        },
        // 上傳圖片最小高度
        minHeight: {
            type: Number,
            default: 0
        },
        // 請求完成(並非請求成功)
        onComplete: {
            type: Function,
            required: true,
            default: () => {}
        },
        // 請求失敗
        onError: {
            type: Function,
            default: null
        },
        // 移除圖片
        onRemove: {
            type: Function,
            required: true,
            default: () => {}
        }
    },
    data() {
        return {
            uploader: null,
            defaultStyle: {
                width: '200px',
                height: '200px',
                color: '#999',
                'background-color': '#FFF',
                border: '2px dashed #E1E1E1',
                'border-radius': '5px'
            },
            viewerOption: {
                title: false,
                navbar: false,
                toolbar: false,
                tooltip: false,
                movable: false,
                zoomable: false,
                rotatable: false,
                scalable: false,
                keyboard: false
            }
        };
    },
    computed: {
        ...mapGetters({
            cdnDomain: 'getCdnDomain',
            memInfo: 'getMemInfo',
            nowtpl: 'getNowtpl'
        }),
        dropWrapStyle() {
            return {
                ...this.defaultStyle,
                ...this.styles
            };
        },
        imagesUrl() {
            if (!this.curImage) {
                return '';
            }

            return this.$getCdnPath(`${this.cdnDomain}/${this.curImage}`);
        },
        detectFlashState() {
            if (window.ActiveXObject) {
                try {
                    // eslint-disable-next-line
                    if (new ActiveXObject('ShockwaveFlash.ShockwaveFlash')) {
                        return true;
                    }
                } catch (e) {
                    return !!navigator.plugins['Shockwave Flash'];
                }
            }

            return !!navigator.plugins['Shockwave Flash'];
        }
    },
    created() {
        this.uploader = new FineUploaderTraditional({
            options: {
                core: {
                    multiple: false
                },
                concurrent: {
                    enabled: true
                },
                request: {
                    filenameParam: 'filename',
                    inputName: 'image',
                    endpoint: '',
                    customHeaders: {},
                    requireSuccessJson: false
                },
                validation: {
                    allowedExtensions: this.types,
                    sizeLimit: this.maxSize,
                    image: {
                        maxWidth: this.maxWidth,
                        minWidth: this.minWidth,
                        maxHeight: this.maxHeight,
                        minHeight: this.minHeight
                    }
                },
                callbacks: {
                    onComplete: this.onComplete,
                    onError: this.onError || ((id, name, errorReason, xhrOrXdr) => {
                        const errorText = (typeof (xhrOrXdr) !== 'undefined') ? this.$t('S_CONTACT_SERVICE', this.memInfo.config.lang || 'zh-cn') : errorReason;
                        this.$refs.input.value = '';
                        this.$swal({
                            text: errorText,
                            type: 'error'
                        });
                    })
                },
                messages: {
                    typeError: this.$t('S_FILE_FORMAT_ERROR', this.memInfo.config.lang || 'zh-cn'),
                    sizeError: `${this.$t('S_UPLOAD_FILE_SIZE_LIMIT', this.memInfo.config.lang || 'zh-cn')} 2MB`,
                    noFilesError: this.$t('S_FILE_NO_FILE', this.memInfo.config.lang || 'zh-cn'),
                    maxWidthImageError: `${this.$text(this.maxWidth === this.minWidth ? 'S_SIZE_LIMITATION' : 'S_SIZE_MAX', {
                        text: this.maxWidth === this.minWidth ? '尺寸限制： %s x %s' : '尺寸上限： %s x %s',
                        locale: this.memInfo.config.lang || 'zh-cn',
                        replace: [
                            { target: '%s', value: this.maxWidth },
                            { target: '%s', value: this.maxHeight }
                        ]
                    })}`,
                    maxHeightImageError: `${this.$text(this.maxHeight === this.minHeight ? 'S_SIZE_LIMITATION' : 'S_SIZE_MAX', {
                        text: this.maxWidth === this.minWidth ? '尺寸限制： %s x %s' : '尺寸上限： %s x %s',
                        locale: this.memInfo.config.lang || 'zh-cn',
                        replace: [
                            { target: '%s', value: this.maxWidth },
                            { target: '%s', value: this.maxHeight }
                        ]
                    })}`,
                    minWidthImageError: `${this.$text((this.maxWidth === this.minWidth) ? 'S_SIZE_LIMITATION' : 'S_SIZE_MIN', {
                        text: this.maxWidth === this.minWidth ? '尺寸限制： %s x %s' : '尺寸下限： %s x %s',
                        locale: this.memInfo.config.lang || 'zh-cn',
                        replace: [
                            { target: '%s', value: this.minWidth },
                            { target: '%s', value: this.minHeight }
                        ]
                    })}`,
                    minHeightImageError: `${this.$text(this.maxHeight === this.minHeight ? 'S_SIZE_LIMITATION' : 'S_SIZE_MIN', {
                        text: this.maxWidth === this.minWidth ? '尺寸限制： %s x %s' : '尺寸下限： %s x %s',
                        locale: this.memInfo.config.lang || 'zh-cn',
                        replace: [
                            { target: '%s', value: this.minWidth },
                            { target: '%s', value: this.minHeight }
                        ]
                    })}`
                }
            }
        });

        // 設定上傳路徑及參數
        this.uploader.methods.setEndpoint(`${this.cdnDomain}/api/upload-template`);
        this.uploader.methods.setParams({ template_id: this.nowtpl, ...this.params });
        if (process.env.NODE_ENV === 'development') {
            this.uploader.methods.setEndpoint('/api/upload-template');
        }
    },
    methods: {
        viewerInit(viewer) {
            this.$viewer = viewer;
        },
        handlePreview(e) {
            e.preventDefault();

            if (!this.types.includes('swf')) {
                this.$viewer.show();
                return;
            }

            if (this.types.includes('swf') && !document.querySelector('.flash-viewer-container')) {
                const flashPreviewer = new FlashViewerComponent({
                    propsData: {
                        flashHeight: this.maxHeight,
                        flashUrl: this.imagesUrl
                    }
                });
                flashPreviewer.$mount('');
                document.body.appendChild(flashPreviewer.$el);
                return;
            }

            if (this.types.includes('swf') && !!document.querySelector('.flash-viewer-container')) {
                document.querySelector('.flash-viewer-container object').setAttribute('data', this.imagesUrl);
                document.querySelector('.flash-viewer-container').style.display = 'block';
            }
        },
        handleRemove(e) {
            e.preventDefault();
            this.onRemove();
            this.$refs.input.value = '';
        },
        handleUpload(e) {
            if (e.target.value) {
                this.uploader.methods.addFiles(e.target);
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.image-upload-wrap {
    position: relative;

    .images-block {
        width: inherit;
        height: inherit;
        border-radius: inherit;

        .missing-flash-tip {
            text-align: center;
            padding-top: 84px;
        }
        .images-viewer {
            display: none;
        }
        .uploaded-block {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
            padding: 5px;

            .preview-btn {
                padding: 5px;
                color: #FFF;
                background-color: #1F88BE;
            }
            .delete-btn {
                padding: 5px;
                color: #FFF;
                background-color: #DD4B39;
            }
        }
        .img-pic {
            display: block;
            border-radius: inherit;
        }
        .img-info {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 0;
            display: block;
            width: inherit;
            height: inherit;
            font-size: 14px;
            word-break: break-all;

            &:before {
                content: '';
                display: inline-block;
                height: inherit;
                vertical-align: middle;
            }
            .align-set {
                padding: 0 10px;
                display: inline-block;
                width: inherit;
                color: #C0C0C0;
                font-size: 20px;
                text-align: center;
                vertical-align: middle;
            }
        }
        .preview-flash {
            width: inherit;
            height: inherit;
        }
    }

    .default-block {
        position: absolute;
        top: 0;
        width: 100%;
    }

    > label {
        display: inline-block;
        width: 100%;
        cursor: pointer;
    }

    input[type="file"] {
        width: 1px;
        height: 1px;
        opacity: 0;
    }
}
</style>
