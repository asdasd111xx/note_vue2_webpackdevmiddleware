<template>
    <div class="ui form clearfix">
        <div class="field">
            <label>
                <span class="ui teal label">
                    {{ $text('S_RECOMMEND_SIZE', {
                        text: '建议尺寸',
                        locale: memInfo.config.lang || 'zh-cn'
                    }) }}：1000 x 500 px
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
        <case-control
            v-if="isBackEnd"
            :info="{index: index}"
            class="element-control-wrap"
            @removeCase="removeCase"
        />
        <dropzone
            v-if="list.includes('dropzone')"
            :id="`js-dropzone-${index}`"
            :styles="dropStyle"
            :types="['jpg', 'jpeg', 'gif', 'png']"
            :cur-image="bgImgVal"
            :on-complete="onComplete"
            :on-remove="onRemove"
            class="dropzone-block"
        >
            <img :src="$getCdnPath('/static/image/common/upload-horizontal.png')" class="image" />
            <p class="type-list">JPG JPEG GIF PNG</p>
        </dropzone>
        <div class="link-setting">
            <site-link
                v-if="list.includes('links')"
                :theme="$style"
                :title="title"
                :value-type.sync="linkType"
                :value-to.sync="linkTo"
                :value-item.sync="linkItem"
                class="ui form three column grid setting-form"
            />
        </div>
        <article-inline
            :info="{index}"
            :value="caseData.text[curLang]"
            :on-focus="onTextFocus"
            :on-change="onTextChange"
            :on-blur="onTextBlur"
            class="article-inline"
        />
    </div>
</template>

<script>
/* global $ */
import { mapGetters, mapActions } from 'vuex';
import dropzone from '@/components/dropzone';
import caseControl from '../../common/caseControl';
import articleInline from '../../common/articleInline';

export default {
    components: {
        caseControl,
        dropzone,
        articleInline,
        siteLink: () => import(/* webpackChunkName: 'siteLink' */'@/components/siteLink')
    },
    props: {
        caseData: {
            type: Object,
            default: () => ({})
        },
        index: {
            type: Number,
            default: 0
        },
        list: {
            type: Array,
            default: () => ([])
        },
        isBlur: {
            type: Boolean,
            default: true
        },
        changeBlur: {
            type: Function,
            default: () => {}
        },
        removeCase: {
            type: Function,
            required: true
        },
        onLinkChange: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            dropStyle: {
                width: '204px',
                height: '48px'
            },
            links: {
                linkType: '',
                linkTo: '',
                linkItem: ''
            },
            title: {
                type: this.$text('S_LINK_TYPE', { text: '连结类型' }),
                to: this.$text('S_LINK', { text: '连结' })
            }
        };
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang',
            isBackEnd: 'getIsBackEnd',
            formValues: 'getFormValues',
            page: 'getPage',
            memInfo: 'getMemInfo'
        }),
        bgImgVal: {
            get() {
                return this.caseData.image[this.curLang];
            },
            set(val) {
                this.caseData.image[this.curLang] = val;
            }
        },
        linkType: {
            get() {
                return this.links.linkType;
            },
            set(value) {
                this.links.linkType = value;
            }
        },
        linkTo: {
            get() {
                return String(this.links.linkTo);
            },
            set(value) {
                this.links.linkTo = value;
            }
        },
        linkItem: {
            get() {
                return String(this.links.linkItem);
            },
            set(value) {
                this.links.linkItem = value;
            }
        }
    },
    watch: {
        // eslint-disable-next-line
        'links.linkType'() {
            const { caseData } = this;
            let linkType;

            if (this.list.includes('links')) {
                try {
                    linkType = caseData.linkType[this.curLang];
                } catch (err) {
                    linkType = 'internal';
                }
            }
            this.onLinkChange(this.links, this.index, this.curLang);
            return linkType;
        },
        // eslint-disable-next-line
        'links.linkTo'() {
            const { caseData } = this;
            let linkTo;

            if (this.list.includes('links')) {
                try {
                    linkTo = caseData.linkTo[this.curLang];
                } catch (err) {
                    linkTo = this.page[0].page_id;
                }
            }
            this.onLinkChange(this.links, this.index, this.curLang);
            return linkTo;
        },
        // eslint-disable-next-line
        'links.linkItem'() {
            const { caseData } = this;
            let linkItem;

            if (this.list.includes('links')) {
                try {
                    linkItem = caseData.linkItem[this.curLang];
                } catch (err) {
                    linkItem = '';
                }
            }
            this.onLinkChange(this.links, this.index, this.curLang);
            return linkItem;
        }
    },
    created() {
        this.links.linkType = this.caseData.linkType[this.curLang];
        this.links.linkTo = this.caseData.linkTo[this.curLang];
        this.links.linkItem = this.caseData.linkItem[this.curLang];
    },
    mounted() {
        if (this.isBackEnd) {
            this.$on('onLinkChange', this.onLinkChange);
        }
    },
    methods: {
        ...mapActions([
            'actionUpdateStyleForm',
            'updateSliderCase'
        ]),
        updateFormValue(obj) {
            this.actionUpdateStyleForm({
                type: 'slider01',
                data: obj,
                index: this.index
            });
        },
        onBgImgChang(val) {
            this.bgImgVal = val;
        },
        /**
         * 代入 dropzone 組件的 onComplete 事件
         * @param {Number} id - 上傳圖片的 ID
         * @param {String} name - 上傳圖片的檔名
         * @param {Object} response - 上傳圖片回傳的資料
         */
        onComplete(id, name, response) {
            if (response.status === 'N') {
                this.$swal({
                    text: response.message,
                    type: 'error'
                });
                return;
            }

            this.onBgImgChang(response.data.link);
        },
        /**
         * 代入 dropzone 組件的 onRemove 事件
         */
        onRemove() {
            this.onBgImgChang('');
        },
        onTextFocus() {
            this.changeBlur(false);
        },
        onTextChange() {
            $(window).trigger('resize');
        },
        // 離焦時更新 title
        onTextBlur(e, content) {
            this.caseData.text[this.curLang] = content;
            this.changeBlur(true);
        }
    }
};
</script>

<style lang="scss" scoped>
.element-control-wrap,
.dropzone-block,
.link-setting {
    float: left;
}

.element-control-wrap,
.dropzone-block {
    margin-top: 12px;
}

.dropzone-block {
    width: 204px;
    height: 48px;
    margin-left: 10px;

    /deep/ {
        .default-block {
            width: inherit;
            text-align: center;
            padding: 8px 6px 0;

            img {
                display: inline-block;
                vertical-align: middle;
            }

            .type-list {
                display: inline-block;
                vertical-align: middle;
                width: 120px;
                color: #D2D2D2;
                font-size: 14px;
                margin: 0;
            }
        }
    }
}

.link-setting {
    margin: 0 0 10px 25px;

    /deep/ .ui.grid {
        margin: 0;

        .field.column {
            width: auto;
            margin: 0 10px 0 0;
            padding: 0;
        }
    }

    select {
        margin-right: 12px;
        border-radius: 5px;
        outline: none;
    }
}

.article-inline {
    clear: both;
    padding: 10px;
    padding-bottom: 0;
    border: 1px solid #E4E4E4;
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
        min-width: 120px;
        margin-right: 16px;
        padding: 0;
    }
}
.title {
    margin-bottom: 4px;
    font-weight: bold;
}
</style>
