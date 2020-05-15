<template>
    <element-wrap
        :model-id="model"
        :model-style-color="styleColor"
        :element="element"
        class="is-slider02"
    >
        <div /><!-- 拔了存檔整個會不見，不知道為什麼… -->
        <div v-if="isShow" class="slick-container">
            <div :class="`slick-wrap theme-${element.theme}`">
                <slick
                    ref="slick"
                    :options="slickOptions"
                    @reInit="reInit"
                >
                    <div
                        v-for="(caseData, index) in element.case.data"
                        :key="`slick-item-${index}`"
                        :class="`slick-item slick-item-${index}`"
                        :style="{
                            cursor: isBackEnd ? 'auto' : 'pointer'
                        }"
                        @click="$emit('changePage', {
                            page: caseData.linkTo[$i18n.locale],
                            type: caseData.linkType[$i18n.locale],
                            config: {
                                linkItem: (caseData.linkItem ? caseData.linkItem[$i18n.locale] : '')
                            }
                        })"
                    >
                        <img :src="$getCdnPath(`${cdnDomain}${caseData.image[curLang]}`)" alt="" />
                        <!-- eslint-disable vue/no-v-html -->
                        <div class="slick-item-text" v-html="caseData.text[curLang]" />
                        <!-- eslint-enable vue/no-v-html -->
                    </div>
                </slick>
                <div
                    v-if="isBackEnd && !readOnly"
                    class="btn-edit"
                    @click="$emit('edit')"
                >
                    {{ $t('S_EDIT', memInfo.config.lang || 'zh-cn') }}
                </div>
            </div>
        </div>
        <sliderEdit
            v-if="isBackEnd && elementDnd.length > 0 && isEdit && !readOnly"
            :element="element"
            :model="model"
            :style-color="styleColor"
            :on-edit="onEdit"
            :close-edit="closeEdit"
            :on-slider-update="onSliderUpdate"
        />
        <v-style :style-data="styleData" />
    </element-wrap>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import slick from '@/components/lib/slickCarousel';
import sliderEdit from './sliderEdit';
import imageConfig from './config/imageConfig';
import elementWrap from '../../common/elementWrap';

export default {
    components: {
        slick,
        sliderEdit,
        elementWrap
    },
    props: {
        element: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            model: 6,
            styleColor: 'beige',
            // slick預設值 (依照英文首字母排序)
            slickOptions: {
                accessibility: false, // 導航功能 (false時邊框會消失 比較正常)
                arrows: true, // 左右箭頭
                autoplay: false, // 自動播放
                autoplaySpeed: 3000, // 自動播放時間
                centerMode: false, // 居中模式
                centerPadding: '50px', // 居中模式時的 slide padding
                dots: true, // 頁籤
                draggable: true, // PC可否拖曳
                fade: false, // 是否使用fade效果
                infinite: true, // 無限循環模式
                initialSlide: 0, // 起始圖片編號
                pauseOnHover: true, // hover時是否暫停自動播放
                prevArrow: '<div class="slick-arrow slick-prev"></div>', // 上一張按鈕
                nextArrow: '<div class="slick-arrow slick-next"></div>', // 下一張按鈕
                slidesToShow: 1, // 輪播顯示數量
                slidesToScroll: 1, // 每次滾動數量
                speed: 1000, // 滾動速度
                rtl: false, // 改變滾動方向
                waitForAnimate: true, // 點擊時是否等待動畫結束
                variableWidth: false, // 禁用幻燈片寬度自動計算
                // responsive: [              // 響應式設計
                //     {
                //         breakpoint: 480,
                //         settings: {
                //             arrows: true,
                //             dots: false
                //         }
                //     }
                // ],
                zIndex: 2
            },
            isShow: true,
            isEdit: false,
            // eslint-disable-next-line
            styleData: imageConfig(this.$options._scopeId)
        };
    },
    computed: {
        ...mapGetters({
            lang: 'getLang',
            nowpage: 'getNowpage',
            page: 'getPage',
            pageData: 'getPageData',
            curLang: 'getCurLang',
            isBackEnd: 'getIsBackEnd',
            memInfo: 'getMemInfo',
            webInfo: 'getWebInfo',
            formValues: 'getFormValues',
            cdnDomain: 'getCdnDomain',
            readOnly: 'getReadOnly'
        }),
        elementDnd: {
            get() {
                return [...this.element.case.data];
            },
            set(sort) {
                this.actionCaseSave({
                    case_id: this.element.i,
                    content: [],
                    field: [...sort],
                    setting: this.element.case.setting
                }).then((response) => {
                    if (response.status !== 'Y') {
                        this.$swal({
                            title: response.message || this.$t('S_CONTACT_SERVICE'),
                            type: 'error'
                        });
                    }
                });
            }
        }
    },
    created() {
        if (this.isBackEnd && this.elementDnd.length === 0) {
            this.model = Number(this.webInfo.model);
            this.styleColor = this.webInfo.style_color;

            this.defaultCase();
        } else {
            const { slickOptions } = this;
            const { setting } = this.element.case;
            const option = {
                fade: setting.effect === 'fade' || false,
                dots: setting.mode === 'dots' || false
            };
            this.slickOptions = Object.assign(slickOptions, option);
            this.model = Number(setting.model);
            this.styleColor = setting.style_color || this.styleColor;
        }
        this.slickOptions.autoplay = true;
    },
    mounted() {
        if (this.isBackEnd) {
            this.$on('edit', this.onEdit);
        } else {
            this.$on('changePage', this.changePage);
        }
        this.$nextTick(() => {
            this.$refs.slick.reSlick();
        });
    },
    methods: {
        ...mapActions([
            'actionElementSave',
            'actionCaseSave',
            'actionUpdateStyleForm',
            'actionReupdateStyleForm',
            'actionChangePage'
        ]),
        rerender() {
            this.isShow = false;
            this.$nextTick(() => {
                this.isShow = true;
            });
        },
        // 新增項目
        defaultCase() {
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
                    fields.image[lang] = data.image;
                    fields.linkType[lang] = data.linkType;
                    fields.linkTo[lang] = this.page[0].page_id;
                    fields.linkItem[lang] = data.linkItem;
                    fields.text[lang] = data.text;
                });
                fieldData[index] = fields;
            });

            this.updateField({
                field: [
                    ...this.element.case.data,
                    ...fieldData
                ],
                setting: {
                    ...this.element.case.setting,
                    ...eleData.setting,
                    model: this.webInfo.model,
                    style_color: this.webInfo.style_color,
                    effect: 'slide',
                    mode: 'dots'
                }
            });
        },
        updateField(data) {
            this.actionCaseSave({
                case_id: this.element.i,
                content: [],
                field: [...this.element.case.data],
                setting: { ...this.element.case.setting },
                ...data
            }).then((response) => {
                if (response.status !== 'Y') {
                    this.$swal({
                        title: response.message || this.$t('S_CONTACT_SERVICE'),
                        type: 'error'
                    });
                    return;
                }
                this.closeEdit();
                this.rerender();
            });
        },
        reInit() {
            // Helpful if you have to deal with v-for to update dynamic lists
            this.$nextTick(() => {
                this.$refs.slick.reSlick();
            });
        },
        onSliderUpdate(field, setting, options) {
            this.slickOptions = Object.assign(this.slickOptions, options);
            this.updateField({
                field: [
                    ...field
                ],
                setting: {
                    ...this.element.case.setting,
                    ...setting
                }
            });
        },
        onEdit() {
            this.isEdit = true;
        },
        closeEdit() {
            this.isEdit = false;
        },
        changePage(data) {
            this.actionChangePage(data);
        }
    }
};
</script>

<style lang="scss" scoped>
.element-wrap {
    position: relative;

     /deep/ .control-wrap {
        z-index: 4;
    }

    .slick-container {
        padding-top: 40px;

         /deep/  {
            .slick-wrap {
                position: relative;
                overflow: hidden;
                max-width: 1000px;
                margin: 0 auto;

                .slick-list {
                    position: relative;
                    z-index: 1;
                    margin: 0 auto;

                    .slick-track {
                        .slick-item {
                            float: left;

                            img {
                                display: block;
                                width: 100%;
                            }

                            .slick-item-text {
                                overflow: hidden;
                                height: 140px;
                                padding: 5px;

                                p {
                                    margin: 0;
                                }
                            }
                        }

                        &:before,
                        &:after {
                            display: table;
                            clear: both;
                            content: "";
                        }
                    }
                }

                .slick-arrow {
                    position: absolute;
                    z-index: 3;
                    width: 60px;
                    height: 60px;
                    cursor: pointer;
                    outline: none;

                    &.slick-prev {
                        background-position: 0 0;
                        background-repeat: no-repeat;

                        &:hover {
                            background-position: 0 100%;
                        }
                    }

                    &.slick-next {
                        right: 0;
                        background-position: 0 0;
                        background-repeat: no-repeat;

                        &:hover {
                            background-position: 0 100%;
                        }
                    }
                }

                .slick-dots {
                    position: absolute;
                    right: 60px;
                    bottom: 155px;
                    left: 60px;
                    margin: 0;
                    padding: 0;
                    text-align: center;

                    li {
                        position: relative;
                        z-index: 3;
                        display: inline-block;
                        margin: 0 6px;

                        button {
                            font-size: 0;
                            display: block;
                            width: 12px;
                            height: 12px;
                            cursor: pointer;
                            outline: none;
                            background-position: 100% 0;
                            background-repeat: no-repeat;
                        }

                        &.slick-active,
                        &:hover {
                            button {
                                background-position: 0 0;
                            }
                        }
                    }
                }

                .btn-edit {
                    font-size: 14px;
                    line-height: 35px;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 120px;
                    height: 35px;
                    margin: -87px 0 0 -60px;
                    cursor: pointer;
                    transition: opacity .5s;
                    text-align: center;
                    opacity: 0;
                    color: #FFF;
                    border: 1px solid #FDFDFD;
                    border-radius: 3px;
                    background: #2F2F2F;
                }

                &.theme-A {
                    .slick-arrow {
                        bottom: 145px;
                    }

                    .slick-dots {
                        text-align: center;
                    }
                }

                &.theme-B {
                    .slick-arrow {
                        bottom: 145px;
                    }

                    .slick-dots {
                        text-align: right;
                    }
                }

                &:hover {
                    .btn-edit {
                        z-index: 3;
                        opacity: 1;
                    }
                }
            }
        }
    }

    &.beige {
        .slick-container {
             /deep/  {
                .slick-wrap {
                    .slick-arrow {
                        width: 30px;
                        height: 30px;

                        &.slick-prev {
                            left: 15px;
                            background-position: 0 0;
                            background-repeat: no-repeat;

                            &:hover {
                                background-position: 0 0;
                            }
                        }

                        &.slick-next {
                            right: 15px;
                            background-position: 0 100%;
                            background-repeat: no-repeat;

                            &:hover {
                                background-position: 0 100%;
                            }
                        }
                    }

                    .slick-dots {
                        li {
                            button {
                                background-position: 100% 0;
                                background-repeat: no-repeat;
                            }

                            &.slick-active,
                            &:hover {
                                button {
                                    background-position: 0 0;
                                }
                            }
                        }
                    }

                    &.theme-A {
                        .slick-arrow {
                            bottom: 58%;
                        }

                        .slick-dots {
                            text-align: center;
                        }
                    }

                    &.theme-B {
                        .slick-arrow {
                            bottom: 145px;
                        }

                        .slick-dots {
                            text-align: right;
                        }
                    }
                }
            }
        }
    }

    &.turquoise {
        .slick-container {
             /deep/  {
                .slick-wrap {
                    .slick-arrow {
                        width: 30px;
                        height: 30px;

                        &.slick-prev {
                            left: 15px;
                            background-position: 0 0;
                            background-repeat: no-repeat;

                            &:hover {
                                background-position: 0 0;
                            }
                        }

                        &.slick-next {
                            right: 15px;
                            background-position: 0 100%;
                            background-repeat: no-repeat;

                            &:hover {
                                background-position: 0 100%;
                            }
                        }
                    }

                    .slick-dots {
                        li {
                            button {
                                background-position: 100% 0;
                                background-repeat: no-repeat;
                            }

                            &.slick-active,
                            &:hover {
                                button {
                                    background-position: 0 0;
                                }
                            }
                        }
                    }

                    &.theme-A {
                        .slick-arrow {
                            bottom: 50%;
                        }

                        .slick-dots {
                            text-align: center;
                        }
                    }

                    &.theme-B {
                        .slick-arrow {
                            bottom: 145px;
                        }

                        .slick-dots {
                            text-align: right;
                        }
                    }
                }
            }
        }
    }
}

</style>
