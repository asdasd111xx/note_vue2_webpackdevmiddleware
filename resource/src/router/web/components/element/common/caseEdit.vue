<template>
    <div
        v-if="isBackEnd"
        ref="component-modal"
        class="ui modal small"
    >
        <div class="header">
            <i class="edit outline large icon" /> {{ $t('S_EDIT', memInfo.config.lang || 'zh-cn') }}
            <div class="modal-close" />
        </div>
        <div class="ui form content">
            <div class="field clearfix">
                <label>
                    {{ $t('S_IMG_UPLOAD', memInfo.config.lang || 'zh-cn') }}
                    <span v-if="recommendSize.length === 2" class="ui teal label">{{ recommendSizeMsg }}</span>
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
                <div v-if="list.includes('dropzone')" class="dropzone-out">
                    <dropzone
                        :cur-image="image"
                        :on-complete="(id, name, response) => onUpload('image', id, name, response)"
                        :on-remove="() => onRemove('image')"
                    >
                        <img :src="$getCdnPath('/static/image/common/upload-straight.png')" class="image" />
                        <p class="type-list">JPG JPEG GIF PNG</p>
                    </dropzone>
                    <span v-if="list.includes('dropzoneHover')">{{ `※ ${$t('S_IMAGE_DROP_IN', memInfo.config.lang || 'zh-cn')}` }}</span>
                </div>
                <div v-if="list.includes('dropzoneHover')" class="dropzone-in">
                    <dropzone
                        :cur-image="imageHover"
                        :on-complete="(id, name, response) => onUpload('imageHover', id, name, response)"
                        :on-remove="() => onRemove('imageHover')"
                    >
                        <img :src="$getCdnPath('/static/image/common/upload-straight.png')" class="image" />
                        <p class="type-list">JPG JPEG GIF PNG</p>
                    </dropzone>
                    <span>{{ `※ ${$t('S_IMAGE_DROP_OUT', memInfo.config.lang || 'zh-cn')}` }}</span>
                </div>
            </div>
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
        <div class="actions">
            <div :class="['ui', 'button', 'primary', { disabled: submitting }]" @click="onComfirm">{{ $t('S_CONFIRM', memInfo.config.lang || 'zh-cn') }}</div>
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

export default {
    components: {
        dropzone,
        siteLink: () => import(/* webpackChunkName: 'siteLink' */'@/components/siteLink')
    },
    props: {
        editIndex: {
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
        },
        recommendSize: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            links: {
                linkType: '',
                linkTo: '',
                linkItem: ''
            },
            title: {
                type: this.$text('S_LINK_TYPE', { text: '连结类型' }),
                to: this.$text('S_LINK', { text: '连结' })
            },
            image: '',
            imageHover: '',
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
        recommendSizeMsg() {
            if (this.recommendSize.length === 2) {
                return `${this.$t('S_RECOMMEND_SIZE', this.memInfo.config.lang || 'zh-cn')}: ${this.recommendSize.join('x')}`;
            }
            return [];
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
                return this.links.linkTo;
            },
            set(value) {
                this.links.linkTo = value;
            }
        },
        linkItem: {
            get() {
                return this.links.linkItem;
            },
            set(value) {
                this.links.linkItem = value;
            }
        }
    },
    watch: {
        editIndex() {
            const caseData = this.element.case.data;
            let image;
            let imageHover;
            let linkType;
            let linkTo;
            let linkItem;

            if (this.editIndex === '') {
                $(this.$refs['component-modal']).modal('hide');
                return;
            }

            if (this.list.includes('dropzone')) {
                try {
                    image = caseData[this.editIndex].image[this.curLang];
                } catch (err) {
                    image = '';
                }

                this.image = image;
            }

            if (this.list.includes('dropzoneHover')) {
                try {
                    imageHover = caseData[this.editIndex].imageHover[this.curLang];
                } catch (err) {
                    imageHover = '';
                }

                this.imageHover = imageHover;
            }

            if (this.list.includes('links')) {
                try {
                    linkType = caseData[this.editIndex].linkType[this.curLang];
                } catch (err) {
                    linkType = 'internal';
                }

                try {
                    linkTo = caseData[this.editIndex].linkTo[this.curLang];
                } catch (err) {
                    linkTo = this.page[0].page_id;
                }

                try {
                    linkItem = caseData[this.editIndex].linkItem[this.curLang];
                } catch (err) {
                    linkItem = '';
                }

                this.links.linkType = linkType;
                this.links.linkTo = linkTo;
                this.links.linkItem = linkItem;
            }

            $(this.$refs['component-modal']).modal('show');
        }
    },
    mounted() {
        // modal 初始設定
        $(this.$refs['component-modal']).modal({
            autofocus: false,
            closable: false,
            onVisible: () => {
                setTimeout(() => {
                    $(window).trigger('resize');
                }, 100);
            },
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
        onUpload(type, id, name, response) {
            if (response.status === 'Y') {
                this[type] = response.data.link;
            }
        },
        onRemove(type) {
            this[type] = '';
        },
        onComfirm() {
            if (this.submitting) {
                return;
            }

            this.$validator.validateAll('form-page').then((res) => {
                if (!res) {
                    return;
                }

                if (this.image === '') {
                    this.$swal({
                        title: this.$t('S_IMG_NOT_UPLOAD', this.memInfo.config.lang || 'zh-cn'),
                        type: 'warning'
                    });
                    return;
                }

                this.updateField({
                    field: [...this.element.case.data.map((item, i) => {
                        const result = { ...item };

                        if (this.editIndex === i) {
                            if (this.list.includes('links')) {
                                result.linkType = {
                                    ...result.linkType,
                                    [this.curLang]: this.links.linkType
                                };

                                result.linkTo = {
                                    ...result.linkTo,
                                    [this.curLang]: this.links.linkTo
                                };

                                result.linkItem = {
                                    ...result.linkItem,
                                    [this.curLang]: this.links.linkItem
                                };
                            }

                            if (this.list.includes('dropzone')) {
                                result.image = {
                                    ...result.image,
                                    [this.curLang]: this.image
                                };
                            }

                            if (this.list.includes('dropzoneHover')) {
                                result.imageHover = {
                                    ...result.imageHover,
                                    [this.curLang]: this.imageHover
                                };
                            }

                            return result;
                        }

                        return result;
                    })]
                });
            });
        },
        onClose() {
            this.$emit('close');
        },
        updateField(data) {
            this.submitting = true;
            this.actionCaseSave({
                case_id: this.element.i,
                content: [{}],
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
    > div {
        margin-bottom: 12px;
    }
}

.field {
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
}
</style>

<style lang="scss" module>
.site-link-wrap {
    .field {
        width: 33%;
        margin-bottom: 16px;
        padding: 16px;
    }
}
.title {
    margin-bottom: 4px;
    font-weight: bold;
}
</style>
