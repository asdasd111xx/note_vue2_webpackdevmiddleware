<template>
    <div class="ui form item clearfix">
        <div class="field">
            <label>
                <span class="ui teal label">
                    {{ $text('S_RECOMMEND_SIZE', {
                        text: '建议尺寸',
                        locale: memInfo.config.lang || 'zh-cn'
                    }) }}：785 x 198 px
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
            <div class="row">
                <div class="five wide column field">
                    <label class="title">{{ $t('S_SLIDE') }}</label>
                    <dropzone
                        v-if="list.includes('dropzone')"
                        :id="`js-dropzone-${index}`"
                        :styles="dropStyle"
                        :types="['jpg', 'jpeg', 'gif', 'png']"
                        :cur-image="sliderImg"
                        :on-complete="onComplete.bind(this,'sliderImg')"
                        :on-remove="onRemove.bind(this,'sliderImg')"
                        class="dropzone-block"
                    >
                        <img :src="$getCdnPath('/static/image/common/upload-horizontal.png')" class="image" />
                        <p class="type-list">JPG JPEG GIF PNG</p>
                    </dropzone>
                </div>
                <div class="five wide column field">
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
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    components: {
        dropzone: () => import(/* webpackChunkName: 'dropzone' */'@/components/dropzone'),
        siteLink: () => import(/* webpackChunkName: 'iteLink' */'@/components/siteLink'),
        caseControl: () => import(/* webpackChunkName: 'caseControl' */'../../../../common/caseControl')
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
                height: '42px'
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
            page: 'getPage',
            memInfo: 'getMemInfo'
        }),
        sliderImg: {
            get() {
                return this.caseData.sliderImg;
            },
            set(val) {
                this.caseData.sliderImg = val;
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
                    linkType = caseData.linkType;
                } catch (err) {
                    linkType = 'internal';
                }
            }
            this.onLinkChange(this.links, this.index);
            return linkType;
        },
        // eslint-disable-next-line
        'links.linkTo': function () {
            const { caseData } = this;
            let linkTo;

            if (this.list.includes('links')) {
                try {
                    linkTo = caseData.linkTo;
                } catch (err) {
                    linkTo = this.page[0].page_id;
                }
            }
            this.onLinkChange(this.links, this.index);
            return linkTo;
        },
        // eslint-disable-next-line
        'links.linkItem': function () {
            const { caseData } = this;
            let linkItem;

            if (this.list.includes('links')) {
                try {
                    linkItem = caseData.linkItem;
                } catch (err) {
                    linkItem = '';
                }
            }
            this.onLinkChange(this.links, this.index);
            return linkItem;
        }
    },
    created() {
        this.links.linkType = this.caseData.linkType;
        this.links.linkTo = this.caseData.linkTo;
        this.links.linkItem = this.caseData.linkItem;
    },
    mounted() {
        if (this.isBackEnd) {
            this.$on('onLinkChange', this.onLinkChange);
        }
    },
    methods: {
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
.drop-tip{
    .txt{
        margin: 0px;
    }
}
.item{
    position: relative;
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

.dropzone-block {
    width: 100%;
    height: 46px;
    margin-top: 0;

    /deep/ {
        .default-block {
            width: inherit;
            height: inherit;
            text-align: center;
            padding: 3px 6px 0;

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
    width: 455px;

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
