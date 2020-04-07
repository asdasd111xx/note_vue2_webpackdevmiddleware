<template>
    <div class="ui form clearfix">
        <div class="field">
            <label>
                <span class="ui teal label">
                    {{ $text('S_RECOMMEND_SIZE', {
                        text: '建议尺寸',
                        locale: memInfo.config.lang || 'zh-cn'
                    }) }}：{{ `${fieldConfigSetting.size[0]} x ${fieldConfigSetting.size[1]}` }}
                </span>
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
        </div>
        <div class="element-control-wrap">
            <div class="remove-icon" @click="removeCase(index)" />
            <div class="sort-icon" />
        </div>
        <div class="dropzone-block-wrap">
            <dropzone
                :styles="{ width: '100%', height: '53px' }"
                :types="['jpg', 'jpeg', 'gif', 'png']"
                :cur-image="caseData.image"
                :on-complete="onNormalComplete"
                :on-remove="onNormalRemove"
                class="dropzone-block"
            >
                <img :src="$getCdnPath('/static/image/common/upload-horizontal.png')" class="image" />
                <p class="type-list">JPG JPEG GIF PNG</p>
            </dropzone>
            <dropzone
                v-if="'imageHover' in caseData"
                :styles="{ width: '100%', height: '53px' }"
                :types="['jpg', 'jpeg', 'gif', 'png']"
                :cur-image="caseData.imageHover"
                :on-complete="onHoverComplete"
                :on-remove="onHoverRemove"
                class="dropzone-block"
            >
                <img :src="$getCdnPath('/static/image/common/upload-horizontal.png')" class="image" />
                <p class="type-list">JPG JPEG GIF PNG</p>
            </dropzone>
        </div>
        <div class="link-setting">
            <site-link
                :theme="$style"
                :title="title"
                :value-type.sync="linkType"
                :value-to.sync="linkTo"
                :value-item.sync="linkItem"
                class="ui form three column grid setting-form"
            />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import dropzone from '@/components/dropzone';

export default {
    components: {
        dropzone,
        siteLink: () => import(/* webpackChunkName: 'siteLink' */'@/components/siteLink')
    },
    props: {
        caseData: {
            type: Object,
            default: () => ({})
        },
        index: {
            type: Number,
            required: true
        },
        removeCase: {
            type: Function,
            required: true
        },
        onLinkChange: {
            type: Function,
            required: true
        },
        onImageChange: {
            type: Function,
            required: true
        },
        fieldConfigSetting: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            fieldConfig: {
                names: {
                    type: 'linkType',
                    to: 'linkTo',
                    item: 'linkItem'
                }
            },
            title: {
                type: this.$text('S_LINK_TYPE', { text: '连结类型' }),
                to: this.$text('S_LINK', { text: '连结' })
            }
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo'
        }),
        linkType: {
            get() {
                return this.caseData[this.fieldConfig.names.type];
            },
            set(value) {
                this.caseData[this.fieldConfig.names.type] = value;
            }
        },
        linkTo: {
            get() {
                return String(this.caseData[this.fieldConfig.names.to]);
            },
            set(value) {
                this.caseData[this.fieldConfig.names.to] = value;
            }
        },
        linkItem: {
            get() {
                return String(this.caseData[this.fieldConfig.names.item]);
            },
            set(value) {
                this.caseData[this.fieldConfig.names.item] = value;
            }
        }
    },
    methods: {
        /**
         * 代入 dropzone 組件的 onComplete 事件
         * @param {Number} id - 上傳圖片的 ID
         * @param {String} name - 上傳圖片的檔名
         * @param {Object} response - 上傳圖片回傳的資料
         */
        onNormalComplete(id, name, response) {
            if (response.status === 'N') {
                this.$swal({
                    text: response.message,
                    type: 'error'
                });
                return;
            }

            this.onImageChange('image', response.data, this.index);
        },
        /**
         * 代入 dropzone 組件的 onComplete 事件
         * @param {Number} id - 上傳圖片的 ID
         * @param {String} name - 上傳圖片的檔名
         * @param {Object} response - 上傳圖片回傳的資料
         */
        onHoverComplete(id, name, response) {
            if (response.status === 'N') {
                this.$swal({
                    text: response.message,
                    type: 'error'
                });
                return;
            }

            this.onImageChange('imageHover', response.data, this.index);
        },
        /**
         * 代入 dropzone 組件的 onRemove 事件
         */
        onNormalRemove() {
            this.onImageChange('image', { width: 0, height: 0, link: '' }, this.index);
        },
        /**
         * 代入 dropzone 組件的 onRemove 事件
         */
        onHoverRemove() {
            this.onImageChange('imageHover', { width: 0, height: 0, link: '' }, this.index);
        }
    }
};
</script>

<style lang="scss" scoped>
.element-control-wrap,
.dropzone-block-wrap,
.link-setting {
    float: left;
}

.element-control-wrap {
    margin-top: 12px;

    .sort-icon {
        background: url('/static/image/common/icon_block.png') 50% 50% #333 no-repeat;
        margin-bottom: 3px;
        width: 22px;
        height: 22px;
        border-radius: 3px;
        cursor: move;
    }
    .remove-icon {
        background: url('/static/image/common/btn_close2.png') 50% 50% #333 no-repeat;
        margin-bottom: 3px;
        width: 22px;
        height: 22px;
        border-radius: 3px;
        cursor: pointer;
    }
}

.dropzone-block-wrap {
    width: 25%;
    margin-left: 10px;

    /deep/ {
        .default-block {
            width: inherit;
            text-align: center;
            padding: 8px 9px 0;

            img {
                display: inline-block;
                vertical-align: middle;
            }

            .type-list {
                display: inline-block;
                vertical-align: middle;
                width: 110px;
                color: #D2D2D2;
                font-size: 14px;
                margin: 0;
            }
        }
    }
}

.dropzone-block {
    height: 48px;
    margin-top: 9px;
}

.link-setting {
    margin-left: 13px;
    width: 66%;

    /deep/ .ui.grid {
        margin: 0;
    }

    select {
        margin-right: 12px;
        border-radius: 5px;
        outline: none;
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

<style lang="scss" module>
.site-link-wrap {
    .field {
        width: 29%;
        margin: 0 10px 0 0;
        padding: 0;
    }
}

.title {
    margin-bottom: 4px;
    font-weight: bold;
}
</style>
