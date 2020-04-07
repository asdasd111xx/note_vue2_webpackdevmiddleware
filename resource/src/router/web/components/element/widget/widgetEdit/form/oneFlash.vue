<template>
    <div class="form-one-flash">
        <slot name="side-control" />
        <slot name="field-z-index" />
        <slot name="field-vector" />
        <slot name="field-box" />
        <div :class="$style['image-uploader']">
            <dropzone
                :cur-image="caseData[selectedIndex].image[curLang]"
                :types="['jpg', 'jpeg', 'gif', 'png']"
                :styles="dzStyle"
                :on-complete="(id, name, response) => { onImageUpload('image', response.data.link); }"
                :on-remove="() => { onImageRemove('image'); }"
            >
                <div :class="$style['icon-upload-cloud']" />
                <div :class="$style['uploader-text']">
                    <div>{{ $text('S_UPLOAD_IMG_HERE', { locale: memInfo.config.lang || 'zh-cn' }) }}</div>
                    <div>{{ $text('S_OR', { locale: memInfo.config.lang || 'zh-cn' }) }}</div>
                </div>
                <div :class="$style['btn-upload']">{{ $text('S_UPLOAD_FILE', { locale: memInfo.config.lang || 'zh-cn' }) }}</div>
            </dropzone>
        </div>
        <div class="flash-uploader">
            <dropzone
                :cur-image="caseData[selectedIndex].flash[curLang]"
                :types="['swf']"
                :styles="dzStyle"
                :on-complete="(id, name, response) => { onImageUpload('flash', response.data.link); }"
                :on-remove="() => { onImageRemove('flash'); }"
            >
                <div :class="$style['icon-upload-cloud']" />
                <div :class="$style['uploader-text']">
                    <div>{{ $text('S_UPLOAD_FLASH_HERE', { locale: memInfo.config.lang || 'zh-cn' }) }}</div>
                    <div>{{ $text('S_OR', { locale: memInfo.config.lang || 'zh-cn' }) }}</div>
                </div>
                <div :class="$style['btn-upload']">{{ $text('S_UPLOAD_FILE', { locale: memInfo.config.lang || 'zh-cn' }) }}</div>
            </dropzone>
        </div>
        <div :class="$style['site-link-box']">
            <div :class="$style['site-link-title']">{{ $t('S_LINK', memInfo.config.lang || 'zh-cn') }}</div>
            <site-link
                :theme="$styleLinks"
                :value-type.sync="linkType"
                :value-to.sync="linkTo"
                :value-item.sync="linkItem"
                :rel-login="true"
            />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import dropzone from '@/components/dropzone';

export default {
    components: {
        dropzone,
        siteLink: () => import(/* webpackChunkName: 'siteLink' */'@/components/siteLink')
    },
    props: {
        selectedIndex: {
            type: Number,
            required: true
        },
        caseData: {
            type: Array,
            default: () => []
        },
        status: {
            type: Object,
            required: true
        },
        updateCase: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            dzStyle: {
                width: '190px',
                height: '159px',
                border: 'none'
            }
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        }),
        linkType: {
            get() {
                return this.caseData[this.selectedIndex].linkType[this.curLang];
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].linkType[this.curLang] = value;
                this.updateCase(cloneData);
            }
        },
        linkTo: {
            get() {
                return this.caseData[this.selectedIndex].linkTo[this.curLang];
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].linkTo[this.curLang] = value;
                this.updateCase(cloneData);
            }
        },
        linkItem: {
            get() {
                return this.caseData[this.selectedIndex].linkItem[this.curLang];
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].linkItem[this.curLang] = value;
                this.updateCase(cloneData);
            }
        }
    },
    methods: {
        onImageUpload(fieldKey, path) {
            const cloneData = cloneDeep(this.caseData);
            cloneData[this.selectedIndex][fieldKey][this.curLang] = path;
            this.updateCase(cloneData);
        },
        onImageRemove(fieldKey) {
            const cloneData = cloneDeep(this.caseData);
            cloneData[this.selectedIndex][fieldKey][this.curLang] = '';
            this.updateCase(cloneData);
        }
    }
};
</script>

<style lang="scss" module>
.image-uploader {
    position: relative;
    float: left;
    margin-right: 20px;
    width: 192px;
    height: 161px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #C0C0C0;
}

.icon-upload-cloud {
    background: url('/static/image/element/widget/ui/bg_upload.png') 0 0 no-repeat;
    margin: 32px auto 8px;
    width: 50px;
    height: 36px;
}

.uploader-text {
    line-height: 1.3;
    font-size: 13px;
    color: #ACDEDC;
}

.btn-upload {
    background: url('/static/image/element/widget/ui/icon_arrow.png') 12px 6px no-repeat #00B5AD;
    display: inline-block;
    width: 90px;
    height: 26px;
    line-height: 2.2;
    font-size: 12px;
    color: #FFF;
    border-radius: 13px;
    text-indent: 12px;
}

.site-link-box {
    clear: left;
    float: left;
    margin-top: 12px;
    padding: 10px 12px;
    width: 172px;
    min-height: 170px;
    border-radius: 2px;
    border: 1px solid #D5D5D5;
}
</style>

<style lang="scss" module="$styleLinks">
.field {
    margin-bottom: 14px;
    width: 100%;

    &:last-child {
        margin-bottom: 0
    }

    :global(.ui.input) {
        width: inherit;
    }
}
</style>

<style lang="scss" scoped>
.flash-uploader {
    position: relative;
    float: left;
    width: 192px;
    height: 161px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #C0C0C0;

    /deep/ {
        .image-upload-wrap {
            .images-block {
                .missing-flash-tip {
                    padding-top: 72px;
                }
            }
        }
    }
}
</style>
