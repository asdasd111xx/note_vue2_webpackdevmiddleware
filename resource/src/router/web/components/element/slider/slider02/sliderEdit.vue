<template>
    <semantic-modal
        :has-close="true"
        :on-hidden="onEditCancel"
        :on-confirm="onSliderSave"
        :title="$t('S_EDIT', memInfo.config.lang || 'zh-cn')"
        icon-name="icon-set"
    >
        <div class="ui form content">
            <div class="slider-style-wrap clearfix">
                <div
                    v-for="(items, type) in slickDefault"
                    :key="type"
                    :class="`slider-item slider-style-${type} clearfix`"
                >
                    <span>{{ items.title }}</span>
                    <select :id="`js-slider-${type}`" @change="onSettingChange(type, $event.target.value)">
                        <option
                            v-for="(item, key) in items.config"
                            :key="key"
                            :value="key"
                            :selected="sliderData.case.setting[type] === key ? 'selected' : ''"
                        >
                            {{ item }}
                        </option>
                    </select>
                </div>
            </div>
            <draggable
                v-model="sliderDnd"
                :options="{handle: '.sort-icon'}"
                class="element-box"
            >
                <slider-item
                    v-for="(caseData, index) in sliderData.case.data"
                    :key="`dropzone-${index}-${token}`"
                    :case-data="caseData"
                    :index="index"
                    :is-blur="isBlur"
                    :change-blur="changeBlur"
                    :list="['dropzone', 'links']"
                    :remove-case="removeCase"
                    :on-link-change="onLinkChange"
                    class="dropzone-items clearfix"
                />
            </draggable>
            <button
                type="button"
                class="slider-btn-add"
                @click="addCase"
            >
                {{ $t('S_ADD_SLIDE') }}
            </button>
        </div>
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            .slider-btn-add[{{ this.$options._scopeId }}] {
                background: url({{ $getCdnPath('/static/image/common/icon_add.png') }}) 0 50% no-repeat;
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </semantic-modal>
</template>

<script>
/* global $ */
import { mapGetters, mapActions } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import draggable from 'vuedraggable';
import semanticModal from '@/components/semanticModal';
import sliderItem from './sliderItem';

export default {
    components: {
        draggable,
        sliderItem,
        semanticModal
    },
    props: {
        element: {
            type: Object,
            default: () => ({})
        },
        model: {
            type: Number,
            required: true
        },
        styleColor: {
            type: String,
            default: ''
        },
        onSliderUpdate: {
            type: Function,
            required: true
        },
        onEdit: {
            type: Function,
            required: true
        },
        closeEdit: {
            type: Function,
            required: true
        }
    },
    data() {
        return {
            sliderData: {},
            // 輪播樣式選項
            slickDefault: {
                effect: {
                    title: this.$t('S_SLIDE_EFFECT'),
                    config: {
                        slide: this.$t('S_SLIDE_LEFT'),
                        fade: this.$t('S_SLIDE_FADE')
                    }
                },
                mode: {
                    title: this.$t('S_CHANGE_STYLE'),
                    config: {
                        default: this.$t('S_DEFAULT_STYLE'),
                        dots: this.$t('S_CONTROL_DOT')
                    }
                }
            },
            isOnSave: false,
            token: 0,
            isBlur: true,
            isSaveClick: false
        };
    },
    computed: {
        ...mapGetters({
            lang: 'getLang',
            curLang: 'getCurLang',
            nowpage: 'getNowpage',
            pageData: 'getPageData',
            isBackEnd: 'getIsBackEnd',
            memInfo: 'getMemInfo',
            webInfo: 'getWebInfo',
            formValues: 'getFormValues',
            cdnDomain: 'getCdnDomain'
        }),
        sliderDnd: {
            get() {
                return [...this.sliderData.case.data];
            },
            set(sort) {
                this.sliderData = {
                    ...this.sliderData,
                    case: {
                        ...this.sliderData.case,
                        data: [...sort]
                    }
                };
                this.token += 1;
            }
        }
    },
    created() {
        this.sliderData = cloneDeep(this.element);
    },
    mounted() {
        $(window).trigger('resize');
    },
    methods: {
        ...mapActions([
            'actionUpdateStyleForm'
        ]),
        // 新增項目
        addCase() {
            if (!this.isBackEnd) {
                return;
            }
            const eleData = '';
            const fieldData = [];

            eleData.data.forEach((data, index) => {
                const fields = {
                    title: {},
                    image: {},
                    linkType: {},
                    linkTo: {},
                    linkItem: {},
                    text: {}
                };
                Object.keys(this.lang).forEach((lang) => {
                    fields.title[lang] = data.title;
                    fields.image[lang] = '';
                    fields.linkType[lang] = data.linkType;
                    fields.linkTo[lang] = data.linkTo;
                    fields.linkItem[lang] = data.linkItem;
                    fields.text[lang] = data.text;
                });
                fieldData[index] = fields;
            });

            this.sliderData = {
                ...this.sliderData,
                case: {
                    ...this.sliderData.case,
                    data: [
                        ...this.sliderData.case.data,
                        ...fieldData
                    ]
                }
            };

            $(window).trigger('resize');
        },
        // 移除項目
        removeCase(index) {
            this.sliderDnd = [...this.sliderData.case.data.filter((item, i) => index !== i)];
        },
        onSliderSave() {
            // 判斷輸入欄位是否onBlur
            this.isSaveClick = true;
            if (!this.isBlur) return;

            // 防止連續Click
            if (this.isOnSave) return;
            this.isOnSave = true;

            const tempSetting = this.sliderData.case.setting;
            const tempData = this.sliderData.case.data;
            const { curLang } = this;

            const options = {}; // 給 slick 元件使用
            const field = [];
            let setting = {}; // 給 api 使用
            let isImgEmpty = false;
            let isKyItemEmpty = false;

            if (tempData.length < 1) {
                this.$swal({
                    title: this.$t('S_SLIDE_NO_IMAGE'),
                    text: this.$t('S_SLIDE_LEAST_QUANTITY'),
                    type: 'warning'
                });
                return;
            }

            tempData.forEach((data, index) => {
                if (isImgEmpty || data.image[curLang] === '') {
                    isImgEmpty = true;
                    return;
                }
                if (data.linkTo[curLang] === 'ky' && data.linkItem[curLang] === '') {
                    isKyItemEmpty = true;
                    return;
                }
                const fields = {
                    title: {},
                    image: {},
                    linkType: {},
                    linkTo: {},
                    linkItem: {},
                    text: {}
                };
                Object.keys(this.lang).forEach((lang) => {
                    fields.title[lang] = data.title[lang];
                    fields.image[lang] = data.image[lang];
                    fields.linkType[lang] = data.linkType[lang];
                    fields.linkTo[lang] = data.linkTo[lang];
                    fields.linkItem[lang] = data.linkItem[lang];
                    fields.text[lang] = data.text[lang];
                });
                field[index] = fields;
            });

            if (isImgEmpty) {
                this.$swal({
                    title: this.$t('S_IMAGE_NO_UPLOAD'),
                    text: this.$t('S_IMAGE_IS_NULL'),
                    type: 'warning'
                });
                return;
            }

            if (isKyItemEmpty) {
                this.$swal({
                    title: this.$t('S_LINK_TIP'),
                    text: this.$t('S_LINK_KY_NO_SET'),
                    type: 'warning'
                });
                this.isOnSave = false;
                return;
            }

            setting = {
                effect: tempSetting.effect,
                mode: tempSetting.mode
            };

            Object.keys(setting).forEach((key) => {
                const value = setting[key];
                switch (key) {
                    case 'effect':
                        options.fade = value === 'fade' || false;
                        break;
                    case 'mode':
                        options.dots = value === 'dots' || false;
                        break;
                    default:
                        options.fade = false;
                        options.dots = false;
                        break;
                }
            });

            this.isSaveClick = false;
            this.onSliderUpdate(field, setting, options);
            this.isOnSave = false;
        },
        onEditCancel() {
            this.sliderData = cloneDeep(this.element);
            this.closeEdit();
        },
        onLinkChange(links, index, lang) {
            const sliderData = this.sliderData.case.data;
            sliderData[index].linkType[lang] = links.linkType;
            sliderData[index].linkTo[lang] = links.linkTo;
            sliderData[index].linkItem[lang] = links.linkItem;
        },
        onSettingChange(type, value) {
            this.sliderData.case.setting[type] = value;
        },
        changeBlur(value) {
            this.isBlur = value;
            if (value && this.isSaveClick) {
                this.onSliderSave();
            }
        }
    }
};
</script>

<style lang="scss" scoped>
.slider-style-wrap {
    .slider-item {
        float: left;
        margin-right: 20px;

        span, select {
            float: left;
        }

        span {
            line-height: 42px;
        }

        select {
            width: auto;
            margin-left: 10px;
        }
    }
}

.dropzone-items {
    padding: 10px 0 20px;
    border-bottom: 1px solid #E4E4E4;

    &:last-child {
        border-bottom: none;
    }
}

.slider-btn-add {
    line-height: 24px;
    padding-left: 29px;
    outline: none;
}

select {
    border-radius: 5px;
    outline: none;
}
</style>
