<template>
    <div class="ui form clearfix">
        <div class="field clearfix">
            <label>
                {{ $t(fieldConfig.title || 'S_IMG_UPLOAD', memInfo.config.lang || 'zh-cn') }}
                <span v-if="fieldConfig.size.length === 2" class="ui teal label">{{ recommendSizeMsg }}</span>
                <span class="tip-text left">
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
            </label>
            <div class="dropzone-out">
                <dropzone
                    :cur-image="value[fieldConfig.names.normal]"
                    :on-complete="(id, name, response) => onUpload(fieldConfig.names.normal, response)"
                    :on-remove="() => onRemove(fieldConfig.names.normal)"
                    :types="['jpg', 'jpeg', 'gif', 'png']"
                    :max-width="fieldConfig.sizeLimit ? fieldConfig.sizeLimit[0] : 0"
                    :max-height="fieldConfig.sizeLimit ? fieldConfig.sizeLimit[1] : 0"
                >
                    <img :src="$getCdnPath('/static/image/common/upload-straight.png')" class="image" />
                    <p class="type-list">JPG JPEG GIF PNG</p>
                </dropzone>
                <span>{{ `※ ${$t('S_IMAGE_DROP_IN', memInfo.config.lang || 'zh-cn')}` }}</span>
            </div>
            <div class="dropzone-in">
                <dropzone
                    :cur-image="value[fieldConfig.names.hover]"
                    :on-complete="(id, name, response) => onUpload(fieldConfig.names.hover, response)"
                    :on-remove="() => onRemove(fieldConfig.names.hover)"
                    :types="['jpg', 'jpeg', 'gif', 'png']"
                    :max-width="fieldConfig.sizeLimit ? fieldConfig.sizeLimit[0] : 0"
                    :max-height="fieldConfig.sizeLimit ? fieldConfig.sizeLimit[1] : 0"
                >
                    <img :src="$getCdnPath('/static/image/common/upload-straight.png')" class="image" />
                    <p class="type-list">JPG JPEG GIF PNG</p>
                </dropzone>
                <span>{{ `※ ${$t('S_IMAGE_DROP_OUT', memInfo.config.lang || 'zh-cn')}` }}</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dropzone from '@/components/dropzone';

/**
 * 圖片上傳表單(含hover圖片)
 * @module element/field/imageHoverUpload
 * @param {string|number} editIndex - 當前編輯項目索引值
 * @param {object} fieldConfig - 該欄位設定值
 * @param {object} element - 模塊資料
 * @param {string} value - 表單的值
 */
export default {
    components: {
        dropzone
    },
    props: {
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
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        }),
        /**
         * 測試 recommendSizeMsg
         * @method recommendSizeMsg
         * @returns {string} 圖片建議尺寸文字內容
         */
        recommendSizeMsg() {
            if (this.fieldConfig.size && this.fieldConfig.size.length === 2) {
                return `${this.$t(this.fieldConfig.sizeReminder || 'S_RECOMMEND_SIZE', this.memInfo.config.lang || 'zh-cn')}: ${this.fieldConfig.size.join('x')}`;
            }
            return [];
        }
    },
    mounted() {
        const initVal = {};

        Object.keys(this.fieldConfig.names).forEach((nameKey) => {
            const fieldName = this.fieldConfig.names[nameKey];
            try {
                initVal[fieldName] = this.defaultValSet(this.fieldConfig.setting, fieldName);
            } catch (err) {
                initVal[fieldName] = '';
            }
        });

        this.$emit('input', initVal);
    },
    methods: {
        /**
         * 圖片上傳
         * @function onUpload
         * @param {string} type - 上傳類型
         * @param {number} id - 當前檔案 id
         * @param {string} name - 檔案名稱
         * @param {object} response - 上傳後 server 回傳資料
         */
        onUpload(name, response) {
            if (response.status === 'Y') {
                this.$emit('input', {
                    ...this.value,
                    [name]: response.data.link
                });
            }
        },
        /**
         * 移除圖片
         * @method onRemove
         */
        onRemove(name) {
            this.$emit('input', {
                ...this.value,
                [name]: ''
            });
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
.dropzone-out {
    float: left;
    margin-right: 10px;

    span {
        display: block;
        font-size: 12px;
        text-align: center;
    }
}

.dropzone-in {
    float: left;

    span {
        display: block;
        font-size: 12px;
        text-align: center;
    }
}

.dropzone-in,
.dropzone-out {
    /deep/ {
        .default-block {
            width: inherit;
            text-align: center;
            padding-top: 46px;

            img {
                display: block;
                margin: 0 auto 8px;
            }

            .type-list {
                color: #D2D2D2;
                font-size: 14px;
                margin: 0;
            }
        }
    }
}

.field {
    .tip-text {
        font-size: 13px;
        font-weight: normal;
        color: #131304;

        &.left {
            margin-left: 8px;
        }
    }

    .tip-size {
        font-size: 13px;
        font-weight: bold;
        color: #1783D2;
        text-decoration: underline;
    }
}
</style>
