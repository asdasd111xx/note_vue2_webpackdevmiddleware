<template>
    <div>
        <slot name="side-control" />
        <slot name="field-z-index" />
        <slot name="field-vector" />
        <slot name="field-box" />
        <div :class="$style['image-design-wrap']">
            <div>{{ $text('S_ARROW', '箭头') }}</div>
            <div :class="$style['image-uploader']">
                <dropzone
                    :cur-image="caseData[selectedIndex].image[curLang]"
                    :types="uploadType"
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
        </div>
        <div :class="$style['design-wrap']">
            <div :class="$style['lang-set-wrap']">
                <field-select
                    :value.sync="shapeType"
                    :options="shapeList"
                    :title="$text('S_SHAPE', '形状')"
                    class="select-set-wrap"
                />
            </div>
            <div :class="$style['lang-set-wrap']">
                <field-select
                    :value.sync="patternItem"
                    :options="patternList"
                    :title="$text('S_STYLE', '樣式')"
                    class="select-set-wrap"
                />
            </div>
            <div :class="[$style['color-wrap'], $style['first']]">
                <color-picker :value-color.sync="fontColor" :title="$text('S_COLOR_FONT', '字体颜色')" />
            </div>
            <div :class="$style['color-wrap']">
                <color-picker :value-color.sync="fontHoverColor" :title="$text('S_HOVER_COLOR', '滑入颜色')" />
            </div>
            <div :class="$style['color-wrap']">
                <color-picker :value-color.sync="bgColor" :title="$text('S_BG_COLOR', '背景颜色')" />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import dropzone from '@/components/dropzone';
import colorPicker from '../fields/colorPicker';
import fieldSelect from '../fields/fieldSelect';

export default {
    components: {
        colorPicker,
        dropzone,
        fieldSelect
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
            shapeList: [
                {
                    label: this.$text('S_CYCLE', '圆形'),
                    value: 'cycle'
                },
                {
                    label: this.$text('S_SQUARE', '方形'),
                    value: 'square'
                }
            ],
            patternList: [
                {
                    label: 'a',
                    value: 'a'
                },
                {
                    label: 'b',
                    value: 'b'
                },
                {
                    label: 'c',
                    value: 'c'
                },
                {
                    label: 'd',
                    value: 'd'
                }
            ],
            dzStyle: {
                width: '190px',
                height: '159px',
                border: 'none'
            },
            uploadType: ['jpg', 'jpeg', 'gif', 'png']
        };
    },
    computed: {
        ...mapGetters({
            memInfo: 'getMemInfo',
            curLang: 'getCurLang'
        }),
        shapeType: {
            get() {
                return this.caseData[this.selectedIndex].shape[this.curLang];
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].shape[this.curLang] = value;
                this.updateCase(cloneData);
            }
        },
        patternItem: {
            get() {
                return this.caseData[this.selectedIndex].pattern[this.curLang];
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].pattern[this.curLang] = value;
                this.updateCase(cloneData);
            }
        },
        fontColor: {
            get() {
                return this.caseData[this.selectedIndex].fontColor;
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].fontColor = value;
                this.updateCase(cloneData);
            }
        },
        fontHoverColor: {
            get() {
                return this.caseData[this.selectedIndex].fontHoverColor;
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].fontHoverColor = value;
                this.updateCase(cloneData);
            }
        },
        bgColor: {
            get() {
                return this.caseData[this.selectedIndex].bgColor;
            },
            set(value) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].bgColor = value;
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

<style lang="scss" scoped>
    /deep/.select-set-wrap {
        .multiselect__select {
            width: auto;
        }

        .multiselect__tags {
            padding-right: 25px;
        }
    }
</style>

<style lang="scss" module>
.image-design-wrap {
    float: left;
}

.image-uploader {
    position: relative;
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

.design-wrap {
    float: left;
    width: 192px;
}

.lang-set-wrap {
    float: left;
    min-width: 74px;
    margin-right: 20px;
}

.color-wrap {
    position: relative;
    float: left;
    margin: 5px 10px 0 0;
}

.first {
    clear: left;
}
</style>
