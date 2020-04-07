<template>
    <div :class="$style['wrap']">
        <slot name="side-control" />
        <slot name="field-z-index" />
        <slot name="field-vector" />
        <div :class="$style['slide-element-setting']">
            <field-checkbox
                :class="$style.checkbox"
                :value="caseData[selectedIndex].navBtn"
                :title="$text('S_LEFT_RIGHT_ARROW', { locale: memInfo.config.lang || 'zh-cn' })"
                @update:value="(value) => { update('navBtn', value) }"
            />
            <field-checkbox
                :class="$style.checkbox"
                :value="caseData[selectedIndex].pageBtn"
                :title="$text('S_SHOW_PAGINATION', { locale: memInfo.config.lang || 'zh-cn' })"
                @update:value="(value) => { update('pageBtn', value) }"
            />
        </div>
        <template v-if="caseData[selectedIndex].navBtn === 'Y'">
            <div :class="$style['prev-vector-wrap']">
                <pair-input
                    ref="xy"
                    :value="[caseData[selectedIndex].prevX, caseData[selectedIndex].prevY]"
                    :placeholder="['X', 'Y']"
                    :title="$text('S_POSITION', { locale: memInfo.config.lang || 'zh-cn' })"
                    :on-input="(e, index) => { onVectorChange(index ? 'prevY' : 'prevX', e.target.value); }"
                    :on-blur="(e) => { onVectorBlur(e.target.value, ['prevX', 'prevY']); }"
                />
                <pair-input
                    ref="wh"
                    :value="[caseData[selectedIndex].prevW, caseData[selectedIndex].prevH]"
                    :placeholder="['W', 'H']"
                    :title="$text('S_SIZE', { locale: memInfo.config.lang || 'zh-cn' })"
                    :on-input="(e, index) => { onVectorChange(index ? 'prevH' : 'prevW', e.target.value); }"
                    :on-blur="(e) => { onVectorBlur(e.target.value, ['prevW', 'prevH']); }"
                />
            </div>
            <image-uploader
                :class="$style['image-uploader-wrap']"
                :image-path="caseData[selectedIndex].prevImage"
                :title="$text('S_PREV_PIC_OF_BTN', { locale: memInfo.config.lang || 'zh-cn' })"
                @update:imagePath="(path) => { update('prevImage', path) }"
            />
            <image-uploader
                :class="$style['image-uploader-wrap']"
                :image-path="caseData[selectedIndex].prevImageHover"
                :title="$text('S_PREV_HOVER_PIC_OF_BTN', { locale: memInfo.config.lang || 'zh-cn' })"
                @update:imagePath="(path) => { update('prevImageHover', path) }"
            />
            <div :class="$style['next-vector-wrap']">
                <pair-input
                    ref="xy"
                    :value="[caseData[selectedIndex].nextX, caseData[selectedIndex].nextY]"
                    :placeholder="['X', 'Y']"
                    :title="$text('S_POSITION', { locale: memInfo.config.lang || 'zh-cn' })"
                    :on-input="(e, index) => { onVectorChange(index ? 'nextY' : 'nextX', e.target.value); }"
                    :on-blur="(e) => { onVectorBlur(e.target.value, ['nextX', 'nextY']); }"
                />
                <pair-input
                    ref="wh"
                    :value="[caseData[selectedIndex].nextW, caseData[selectedIndex].nextH]"
                    :placeholder="['W', 'H']"
                    :title="$text('S_SIZE', { locale: memInfo.config.lang || 'zh-cn' })"
                    :on-input="(e, index) => { onVectorChange(index ? 'nextH' : 'nextW', e.target.value); }"
                    :on-blur="(e) => { onVectorBlur(e.target.value, ['nextW', 'nextH']); }"
                />
            </div>
            <image-uploader
                :class="$style['image-uploader-wrap']"
                :image-path="caseData[selectedIndex].nextImage"
                :title="$text('S_NEXT_PIC_OF_BTN', { locale: memInfo.config.lang || 'zh-cn' })"
                @update:imagePath="(path) => { update('nextImage', path) }"
            />
            <image-uploader
                :class="$style['image-uploader-wrap']"
                :image-path="caseData[selectedIndex].nextImageHover"
                :title="$text('S_NEXT_HOVER_PIC_OF_BTN', { locale: memInfo.config.lang || 'zh-cn' })"
                @update:imagePath="(path) => { update('nextImageHover', path) }"
            />
        </template>
        <template v-if="caseData[selectedIndex].pageBtn === 'Y'">
            <div :class="$style['page-vector-wrap']">
                <pair-input
                    ref="xy"
                    :value="[caseData[selectedIndex].pageX, caseData[selectedIndex].pageY]"
                    :placeholder="['X', 'Y']"
                    :title="$text('S_POSITION', { locale: memInfo.config.lang || 'zh-cn' })"
                    :on-input="(e, index) => { onVectorChange(index ? 'pageY' : 'pageX', e.target.value); }"
                    :on-blur="(e) => { onVectorBlur(e.target.value, ['pageX', 'pageY']); }"
                />
                <pair-input
                    ref="wh"
                    :value="[caseData[selectedIndex].pageW, caseData[selectedIndex].pageH]"
                    :placeholder="['W', 'H']"
                    :title="$text('S_SIZE', { locale: memInfo.config.lang || 'zh-cn' })"
                    :on-input="(e, index) => { onVectorChange(index ? 'pageH' : 'pageW', e.target.value); }"
                    :on-blur="(e) => { onVectorBlur(e.target.value, ['pageW', 'pageH']); }"
                />
            </div>
            <div :class="$style['pagination-color-setting']">
                <color-picker
                    :value-color="caseData[selectedIndex].pageColor"
                    :title="$text('S_PAGINATINO_COLOR', { locale: memInfo.config.lang || 'zh-cn' })"
                    @update:valueColor="(color) => { update('pageColor', color) }"
                />
            </div>
            <div :class="$style['pagination-color-setting']">
                <color-picker
                    :value-color="caseData[selectedIndex].pageCurrentColor"
                    :title="$text('S_PAGINATINO_CURRENT_COLOR', { locale: memInfo.config.lang || 'zh-cn' })"
                    @update:valueColor="(color) => { update('pageCurrentColor', color) }"
                />
            </div>
        </template>
        <div :class="$style['slide-edit-box']">
            <multi-edit :data.sync="slides" :handle-class="`.${$style['icon-move']}`">
                <div
                    v-for="(slide, index) in slides"
                    :key="index"
                    :class="$style['slide-box']"
                >
                    <div :class="$style['list-control-wrap']">
                        <div :class="`${$style.icon} ${$style['icon-move']}`">
                            <icon scale=".9" name="arrows-alt" />
                        </div>
                        <div :class="$style.icon" @click="removeSlide(index)">
                            <icon scale=".9" name="trash-alt" />
                        </div>
                    </div>
                    <image-uploader
                        :class="$style['image-uploader-wrap']"
                        :image-path="slide.image"
                        :title="$text('S_SLIDE_SHOW', { locale: memInfo.config.lang || 'zh-cn' })"
                        @update:imagePath="(path) => { updateSlide(index, 'image', path) }"
                    />
                    <div :class="$style['site-link-box']">
                        <div :class="$style['site-link-title']">{{ $t('S_LINK', memInfo.config.lang || 'zh-cn') }}</div>
                        <site-link
                            :theme="$styleLinks"
                            :value-type="slide.linkType"
                            :value-to="slide.linkTo"
                            :value-item="slide.linkItem"
                            :rel-login="true"
                            @update:valueType="(value) => { updateSlide(index, 'linkType', value); }"
                            @update:valueTo="(value) => { updateSlide(index, 'linkTo', value); }"
                            @update:valueItem="(value) => { updateSlide(index, 'linkItem', value); }"
                        />
                    </div>
                    <div :class="$style['other-setting']">
                        <div>
                            <div>{{ $text('S_DELAY_TIME', { locale: memInfo.config.lang || 'zh-cn' }) }}</div>
                            <div :class="`ui small input ${$style['input-delay']}`">
                                <input
                                    ref="input"
                                    :value="slide.delay"
                                    type="text"
                                    maxlength="2"
                                    @input="(e) => { onDelayChange(index, e.target.value) }"
                                    @blur="(e) => { updateSlide(index, 'delay', slide.delay) }"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </multi-edit>
            <div :class="$style['btn-add']" @click="addSlide">
                <icon name="plus" scale="0.5" />
                {{ $text('S_ADD01', { text: '新增', locale: memInfo.config.lang || 'zh-cn' }) }}
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import isInt from 'validator/lib/isInt';
import 'vue-awesome/icons/plus';
import imageUploader from './imageUploader';
import fieldCheckbox from '../../fields/fieldCheckbox';
import multiEdit from '../../fields/multiEdit';
import pairInput from '../../fields/pairInput';
import colorPicker from '../../fields/colorPicker';

export default {
    components: {
        multiEdit,
        siteLink: () => import(/* webpackChunkName: 'siteLink' */'@/components/siteLink'),
        fieldCheckbox,
        pairInput,
        colorPicker,
        imageUploader
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
            element: null,
            dzStyle: {
                width: '190px',
                height: '168px',
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
        slides: {
            get() {
                return this.caseData[this.selectedIndex].slides[this.curLang];
            },
            set(result) {
                const cloneData = cloneDeep(this.caseData);
                cloneData[this.selectedIndex].slides[this.curLang] = result;
                this.updateCase(cloneData);
            }
        }
    },
    methods: {
        addSlide() {
            this.slides = [
                ...this.slides,
                {
                    linkType: 'nolink',
                    linkTo: '',
                    linkItem: '',
                    image: '',
                    delay: '3'
                }
            ];
        },
        removeSlide(index) {
            this.slides = this.slides.filter((slide, i) => i !== index);
        },
        onDelayChange(index, value) {
            if (isInt(value, { allow_leading_zeroes: false, min: 0 })) {
                this.updateSlide(index, 'delay', value);
            }
        },
        onVectorChange(key, value) {
            if (isInt(value, { allow_leading_zeroes: false, min: 0 })) {
                this.update(key, value);
            }
        },
        onVectorBlur(value, keys) {
            if (isInt(value, { allow_leading_zeroes: false, min: 0 })) {
                keys.forEach((key) => {
                    this.update(key, this.caseData[this.selectedIndex][key]);
                });
            }
        },
        update(target, value) {
            const cloneData = cloneDeep(this.caseData);
            cloneData[this.selectedIndex][target] = value;
            this.updateCase(cloneData);
        },
        updateSlide(index, target, value) {
            this.slides = this.slides.map((slide, i) => {
                if (i === index) {
                    return { ...this.slides[index], [target]: value };
                }
                return slide;
            });
        }
    }
};
</script>

<style lang="scss" module>
.slide-element-setting {
    position: relative;
    top: 22px;
    float: left;

    .checkbox {
        display: block;
        margin-bottom: 6px;
    }
}

.prev-vector-wrap,
.next-vector-wrap,
.page-vector-wrap {
    clear: left;
    float: left;
    margin-right: 14px;
}

.pagination-color-setting {
    float: left;
}

.slide-edit-box {
    clear: left;
    float: left;
    margin-top: 14px;
    width: 100%;
}

.slide-wrap {

}

.btn-add {
    float: left;
    background-color: #00B5AD;
    margin-bottom: 8px;
    padding: 0 6px;
    height: 30px;
    line-height: 30px;
    font-size: 13px;
    text-align: center;
    border: 1px solid #D5D5D5;
    border-radius: 2px;
    color: #FFF;
    cursor: pointer;
}

.slide-box {
    position: relative;
    float: left;
    clear: left;
    margin-bottom: 4px;
    padding: 6px;
    width: 100%;
    border: 2px dashed #EEE;
}

/* 輪播編輯左側控制項目 */
.list-control-wrap {
    position: absolute;
    top: -2px;
    left: -38px;
    padding: 14px 0;
    width: 38px;
    border: 2px dashed #EEE;
    text-align: center;

    .icon {
        display: block;
        margin: 0 auto 14px;
        color: #79879C;
        cursor: pointer;

        &.icon-move {
            cursor: move;
        }

        &:last-child {
            margin-bottom: 0;
        }

        > svg {
            display: block;
            margin: 0 auto;
        }
    }
}

/* 輪播圖上傳 */
.image-uploader-wrap {
    position: relative;
    float: left;
    margin-right: 20px;
}

/* 連結設定 */
.site-link-box {
    position: relative;
    top: 22px;
    float: left;
    margin-right: 20px;
    padding: 10px 12px;
    width: 172px;
    min-height: 170px;
    border-radius: 2px;
    border: 1px solid #D5D5D5;
}

/* 其它設定 */
.other-setting {
    float: left;
}

.input-delay {
    width: 72px;
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
