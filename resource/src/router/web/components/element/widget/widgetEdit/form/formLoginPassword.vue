<template>
    <div :class="$style['form-login-password']">
        <div :class="$style.title">[ {{ $text('S_PASSWORD', { locale: memInfo.config.lang || 'zh-cn' }) }} ]</div>
        <slot name="side-control" />
        <slot name="field-z-index" />
        <slot name="field-vector" />
        <slot name="field-box" />
        <div :class="$style['switch-wrap']">
            <field-checkbox :title="$text('S_USE_BG', { locale: memInfo.config.lang || 'zh-cn' })" :value.sync="useImage" />
        </div>
        <div :class="$style['setting-wrap']">
            <div :class="$style['field-wrap']">
                <div :class="[$style['field-title']]">{{ $text('S_FONT', { locale: memInfo.config.lang || 'zh-cn' }) }}</div>
                <input
                    v-model="placeholderText"
                    :class="$style.input"
                    type="text"
                />
            </div>
            <field-select
                :class="$style['select']"
                :title="$text('S_FONT_SIZE', { locale: memInfo.config.lang || 'zh-cn' })"
                :options="fontSizeOptions"
                :value.sync="fontSize"
            />
            <field-select
                :class="$style['select']"
                :title="$text('S_INPUT_BORDER_SETTING', { locale: memInfo.config.lang || 'zh-cn' })"
                :options="radiusOptions"
                :value.sync="radius"
            />
        </div>
        <div :class="$style['setting-wrap']">
            <color-picker
                :class="$style['color-picker']"
                :title="$text('S_INPUT_COLOR', { locale: memInfo.config.lang || 'zh-cn' })"
                :value-color.sync="fontColor"
            />
            <color-picker
                v-if="useImage !== 'Y'"
                :class="$style['color-picker']"
                :title="$text('S_INPUT_BG_COLOR', { locale: memInfo.config.lang || 'zh-cn' })"
                :value-color.sync="bgColor"
            />
        </div>
        <div v-if="useImage === 'Y'" :class="$style['image-uploader']">
            <dropzone
                :cur-image="caseData[selectedIndex].image"
                :types="uploadType"
                :styles="dzStyle"
                :on-complete="(id, name, response) => { setCase('image', response.data.link); }"
                :on-remove="() => { setCase('image', ''); }"
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
</template>

<script>
import { mapGetters } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import range from 'lodash/range';
import dropzone from '@/components/dropzone';
import fieldCheckbox from '../fields/fieldCheckbox';
import fieldSelect from '../fields/fieldSelect';
import colorPicker from '../fields/colorPicker';

export default {
    components: {
        fieldCheckbox,
        fieldSelect,
        colorPicker,
        dropzone
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
        const optionCreater = (size) => ({ label: `${size} px`, value: `${size}` });
        const fontSizeOptions = range(12, 37).map(optionCreater);
        const radiusOptions = range(0, 33).map(optionCreater);

        return {
            fontSizeOptions,
            radiusOptions,
            element: null,
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
        useImage: {
            get() { return this.caseData[this.selectedIndex].useImage; },
            set(value) { this.setCase('useImage', value); }
        },
        placeholderText: {
            get() { return this.caseData[this.selectedIndex].placeholderText[this.curLang]; },
            set(value) {
                const cloneData = cloneDeep(this.caseData);

                cloneData[this.selectedIndex].placeholderText[this.curLang] = value;
                this.updateCase(cloneData);
            }
        },
        fontSize: {
            get() { return this.caseData[this.selectedIndex].fontSize; },
            set(value) { this.setCase('fontSize', value); }
        },
        fontColor: {
            get() { return this.caseData[this.selectedIndex].fontColor; },
            set(value) { this.setCase('fontColor', value); }
        },
        radius: {
            get() { return this.caseData[this.selectedIndex].radius; },
            set(value) { this.setCase('radius', value); }
        },
        bgColor: {
            get() { return this.caseData[this.selectedIndex].bgColor; },
            set(value) { this.setCase('bgColor', value); }
        }
    },
    methods: {
        setCase(key, value) {
            const cloneData = cloneDeep(this.caseData);

            cloneData[this.selectedIndex][key] = value;
            this.updateCase(cloneData);
        }
    }
};
</script>

<style lang="scss" module>
.title {
    float: left;
    margin-bottom: 8px;
    width: 100%;
    font-size: 18px;
}

.switch-wrap {
    float: left;
    margin-right: 20px;
}

.setting-wrap {
    float: left;
    margin-right: 20px;
    margin-bottom: 8px;
}

.field-wrap {
    margin-bottom: 8px;
}

.field-title {
    font-size: 13px;
    line-height: normal;
}

.select {
    margin-bottom: 8px;
    width: 104px;
}

.input {
    padding-left: 13px;
    width: 104px;
    height: 38px;
    color: #35495E;
    border: 1px solid #E8E8E8;
    border-radius: 5px;
    font-size: 13px;
    outline: none;
}

.color-picker {
    margin-bottom: 8px;
}

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
</style>
