<template>
    <div class="ui form item clearfix">
        <div class="field">
            <label>
                <span class="ui teal label">
                    {{ $text('S_RECOMMEND_SIZE', {
                        text: '建议尺寸',
                        locale: memInfo.config.lang || 'zh-cn'
                    }) }}：1920 x 530 px
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
            class="itemDropzone"
            @removeCase="removeCase"
        />
        <div class="ui grid itemContent">
            <div class="five wide column">
                <div class="field">
                    <label class="title">{{ $t('S_LARGE_IMAGE') }}</label>
                    <dropzone
                        v-if="list.includes('dropzone')"
                        :id="`js-dropzone-${index}`"
                        :styles="dropStyle"
                        :types="['jpg', 'jpeg', 'gif', 'png']"
                        :cur-image="largeImg"
                        :on-complete="onComplete.bind(this,'largeImg')"
                        :on-remove="onRemove.bind(this,'largeImg')"
                        class="dropzone-block"
                    >
                        <img :src="$getCdnPath('/static/image/common/upload-horizontal.png')" class="image" />
                        <p class="type-list">JPG JPEG GIF PNG</p>
                    </dropzone>
                </div>
            </div>
            <div class="five wide column">
                <div class="field">
                    <label class="title">{{ $t('S_SMALL_IMAGE') }}</label>
                    <dropzone
                        v-if="list.includes('dropzone')"
                        :id="`js-dropzone-${index}`"
                        :styles="dropStyle"
                        :types="['jpg', 'jpeg', 'gif', 'png']"
                        :cur-image="smallImg"
                        :on-complete="onComplete.bind(this,'smallImg')"
                        :on-remove="onRemove.bind(this,'smallImg')"
                        class="dropzone-block"
                    >
                        <img :src="$getCdnPath('/static/image/common/upload-horizontal.png')" class="image" />
                        <p class="type-list">JPG JPEG GIF PNG</p>
                    </dropzone>
                </div>
            </div>
        </div>
        <div class="ui grid itemContent">
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
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import dropzone from '@/components/dropzone';
import caseControl from '../../common/caseControl';

export default {
    components: {
        caseControl,
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
            default: 0
        },
        list: {
            type: Array,
            default: () => ([])
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
                width: '100%',
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
        largeImg: {
            get() {
                return this.caseData.largeImg[this.curLang];
            },
            set(val) {
                this.caseData.largeImg[this.curLang] = val;
            }
        },
        smallImg: {
            get() {
                return this.caseData.smallImg[this.curLang];
            },
            set(val) {
                this.caseData.smallImg[this.curLang] = val;
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
        'links.linkType': function () {
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
        'links.linkTo': function () {
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
        'links.linkItem': function () {
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
        onComplete(params, id, name, response) {
            if (response.status === 'N') {
                this.$swal({
                    text: response.message,
                    type: 'error'
                });
                return;
            }
            this[params] = response.data.link;
        },
        /**
         * 代入 dropzone 組件的 onRemove 事件
         */
        onRemove(params) {
            this[params] = '';
        }
    }
};
</script>

<style lang="scss" scoped>
.item {
    position: relative;
}

.element-control-wrap.itemDropzone {
    margin-top: 80px;
}

.itemContent {
    padding-left: 15px;
}

.element-control-wrap,
.dropzone-block,
.link-setting {
    float: left;
}

.element-control-wrap,
.dropzone-block {
    margin-top: 22px;
}

.title {
    text-align: center;
}

.dropzone-block {
    width: 100%;
    height: 48px;
    margin-top: 10px;

    /deep/ {
        .default-block {
            width: inherit;
            height: inherit;
            text-align: center;
            padding: 8px 6px 0;

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

.link-setting {
    width: 647px;

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
