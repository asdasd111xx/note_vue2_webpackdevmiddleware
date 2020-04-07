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
            <div class="dropzone">
                <dropzone
                    :cur-image="value"
                    :types="['jpg', 'jpeg', 'gif', 'png']"
                    :on-complete="(id, name, response) => onUpload('image', id, name, response)"
                    :on-remove="() => onRemove('image')"
                >
                    <img :src="$getCdnPath('/static/image/common/upload-straight.png')" class="image" />
                    <p class="type-list">JPG JPEG GIF PNG</p>
                </dropzone>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dropzone from '@/components/dropzone';

/**
 * 圖片上傳表單
 * @module element/field/imageUpload
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
            type: String,
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
                return `${this.$t('S_RECOMMEND_SIZE', this.memInfo.config.lang || 'zh-cn')}: ${this.fieldConfig.size.join('x')}`;
            }
            return '';
        }
    },
    mounted() {
        try {
            this.$emit('input', this.defaultValSet(this.fieldConfig.setting, this.fieldConfig.name));
        } catch (err) {
            this.$emit('input', '');
        }
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
        onUpload(type, id, name, response) {
            if (response.status === 'Y') {
                this.$emit('input', response.data.link);
            }
        },
        /**
         * 移除圖片
         * @method onRemove
         */
        onRemove() {
            this.$emit('input', '');
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
.field {
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

    .dropzone {
        float: left;
    }
}
</style>
