<template>
    <semantic-modal
        :has-close="true"
        :on-hidden="onEditCancel"
        :on-confirm="onSliderSave"
        :title="$t('S_EDIT')"
        icon-name="icon-set"
    >
        <div class="ui form content">
            <div class="slider-style-wrap clearfix">
                <div
                    v-for="(items, type) in slickDefault"
                    :key="type"
                    class="typeSelect"
                >
                    <span>{{ items.title }}</span>
                    <select
                        class="ui selection dropdown"
                        @change="onSettingChange(type, $event.target.value)"
                    >
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
                v-if="isShow"
                v-model="sliderDnd"
                :options="{handle: '.sort-icon'}"
                class="element-box"
            >
                <slider-item
                    v-for="(caseData, index) in sliderDnd"
                    :key="`dropzone-slider-${index}`"
                    :case-data="caseData"
                    :index="index"
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
import { mapGetters } from 'vuex';
import cloneDeep from 'lodash/cloneDeep';
import draggable from 'vuedraggable';
import { getElementInfo } from '@/lib/element_default';
import config from '../../config';

export default {
    components: {
        semanticModal: () => import(/* webpackChunkName: 'emanticModal' */'@/components/semanticModal'),
        sliderItem: () => import(/* webpackChunkName: 'liderItem' */'./sliderItem'),
        draggable
    },
    props: {
        element: {
            type: Object,
            default: () => ({})
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
            isShow: true,
            config
        };
    },
    computed: {
        ...mapGetters({
            lang: 'getLang',
            curLang: 'getCurLang',
            isBackEnd: 'getIsBackEnd',
            webInfo: 'getWebInfo'
        }),
        sliderDnd: {
            get() {
                return this.sliderData.case.data[1].slider[this.curLang];
            },
            set(sort) {
                this.sliderData.case.data[1].slider[this.curLang] = sort;
                this.isShow = false;

                this.$nextTick(() => {
                    this.isShow = true;
                });
            }
        }
    },
    created() {
        this.sliderData = cloneDeep(this.element);

        Object.keys(this.sliderData.case.data[1].slider).forEach((lang) => {
            this.sliderData.case.data[1].slider[lang] = JSON.parse(this.sliderData.case.data[1].slider[lang]);
        });
    },
    methods: {
        // 新增項目
        addCase() {
            if (!this.isBackEnd) {
                return;
            }

            const eleData = getElementInfo(this.config.name, this.webInfo.model, this.webInfo.style_color);
            const initData = {};

            Object.keys(eleData.data[1].slider[0]).forEach((objKey) => {
                if (!initData[objKey]) {
                    initData[objKey] = '';
                }
                initData[objKey] = eleData.data[1].slider[0][objKey];
            });

            // 組 api 資料
            this.sliderDnd = [
                ...this.sliderData.case.data[1].slider[this.curLang],
                initData
            ];

            $(window).trigger('resize');
        },
        // 移除項目
        removeCase(index) {
            const resultData = this.sliderData.case.data[1].slider[this.curLang].filter((item, i) => index !== i);

            this.sliderDnd = resultData;
        },
        onSliderSave() {
            const tempSetting = this.sliderData.case.setting;
            const tempData = this.sliderData.case.data[1].slider[this.curLang];

            const options = {}; // 給 slick 元件使用
            const field = {};
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

            tempData.forEach((data) => {
                if (isImgEmpty || data.sliderImg === '') {
                    isImgEmpty = true;
                    return;
                }

                if (data.linkTo === 'ky' && data.linkItem === '') {
                    isKyItemEmpty = true;
                    return;
                }

                if (!field[this.curLang]) {
                    field[this.curLang] = [];
                }

                field[this.curLang].push(data);
            });


            Object.keys(this.lang).forEach((lang) => {
                field[lang] = JSON.stringify(field[lang]) || JSON.stringify(this.sliderData.case.data[1].slider[lang]);
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
            this.onSliderUpdate(field, setting, options);
        },
        onEditCancel() {
            this.sliderData = cloneDeep(this.element);
            this.closeEdit();
        },
        onLinkChange(links, index) {
            const sliderData = this.sliderData.case.data[1].slider[this.curLang];

            sliderData[index].linkType = links.linkType;
            sliderData[index].linkTo = links.linkTo;
            sliderData[index].linkItem = links.linkItem;
        },
        onSettingChange(type, value) {
            this.sliderData.case.setting[type] = value;
        }
    }
};
</script>

<style lang="scss" scoped>
.ui.selection.dropdown {
    height: 48px;
}

.typeSelect{
    width: 50%;
    float: left;
    padding: 15px 5px;
    border-bottom: 1px solid #E4E4E4;
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
