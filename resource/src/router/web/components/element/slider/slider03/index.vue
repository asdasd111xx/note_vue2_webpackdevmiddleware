<template>
    <element-wrap
        :model-id="model"
        :model-style-color="styleColor"
        :element="element"
        class="is-slider03"
    >
        <div /><!-- 拔了存檔整個會不見，不知道為什麼… -->
        <div v-if="isShow" :class="`slick-wrap theme-${element.theme}`">
            <!-- 電腦版 -->
            <slick
                ref="slick"
                :options="slickOptions"
                @reInit="reInit"
            >
                <div
                    v-for="(caseData, index) in element.case.data"
                    :key="`slick-item-${index}`"
                    :class="`slick-item slick-item-${index}`"
                    @click="$emit('changePage',
                                  { page: caseData.linkTo[$i18n.locale],
                                    type: caseData.linkType[$i18n.locale],
                                    config:{
                                        linkItem: (caseData.linkItem ? caseData.linkItem[$i18n.locale] : '')
                                    }
                                  })"
                >
                    <img
                        :src="$getCdnPath(`${cdnDomain}${caseData.largeImg[curLang]}`)"
                        class="computer-img"
                    />
                    <!-- 小圖 -->
                    <img
                        :src="caseData.smallImg[curLang] ? $getCdnPath(`${cdnDomain}${caseData.smallImg[curLang]}`) : ''"
                        class="small-img"
                    />
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
        <sliderEdit
            v-if="isBackEnd && elementDnd.length > 0 && isEdit && !readOnly"
            :element="element"
            :model="model"
            :style-color="styleColor"
            :on-edit="onEdit"
            :close-edit="closeEdit"
            :on-slider-update="onSliderUpdate"
        />
        <!-- eslint-disable vue/html-indent -->
        <v-style>
            [{{ this.$options._scopeId }}].slick-wrap .slick-arrow.slick-prev {
                background: url({{ $getCdnPath('/static/image/element/slider/slider01/default/arrow_l.png') }}) 0 0 no-repeat;
            }

            [{{ this.$options._scopeId }}].slick-wrap .slick-arrow.slick-next {
                background: url({{ $getCdnPath('/static/image/element/slider/slider01/default/arrow_r.png') }}) 0 0 no-repeat;
            }

            [{{ this.$options._scopeId }}].slick-wrap .slick-dots li button {
                background: url({{ $getCdnPath('/static/image/element/slider/slider01/default/ctrl.png') }}) 100% 0 no-repeat;
            }
        </v-style>
        <!-- eslint-enable vue/html-indent -->
    </element-wrap>
</template>


<script>
import { mapGetters, mapActions } from 'vuex';
import { getElementInfo } from '@/lib/element_default';
import slick from '@/components/lib/slickCarousel';
import sliderEdit from './sliderEdit';
import elementWrap from '../../common/elementWrap';

export default {
    components: {
        elementWrap,
        slick,
        sliderEdit
    },
    props: {
        element: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            model: 5,
            styleColor: 'dark-grey',
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
                responsive: [ // 響應式設計
                    {
                        breakpoint: 480,
                        settings: {
                            arrows: true,
                            dots: false
                        }
                    }
                ],
                zIndex: 2
            },
            isShow: true,
            isEdit: false,
            isSetting: ''
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

            const eleData = getElementInfo('slider03', this.webInfo.model, this.webInfo.style_color);
            const fieldData = [];

            eleData.data.forEach((data, index) => {
                const fields = {
                    title: {},
                    largeImg: {},
                    smallImg: {},
                    linkType: {},
                    linkTo: {},
                    linkItem: {}
                };
                Object.keys(this.lang).forEach((lang) => {
                    fields.title[lang] = data.title;
                    fields.largeImg[lang] = data.largeImg;
                    fields.smallImg[lang] = data.smallImg;
                    fields.linkType[lang] = data.linkType;
                    fields.linkTo[lang] = this.page[0].page_id;
                    fields.linkItem[lang] = data.linkItem;
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
        },
        onSetting() {
            this.isSetting = this.element.i;
        },
        onSettingClose() {
            this.isSetting = '';
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";

/deep/ {
    .slick-wrap {
        position: relative;
        overflow: hidden;

        .slick-list {
            margin: 0 auto;

            .slick-track {
                &:before,
                &:after {
                    clear: both;
                    display: table;
                    content: '';
                }
            }
        }

        .slick-arrow {
            position: absolute;
            z-index: 4;
            width: 60px;
            height: 60px;
            outline: none;
            cursor: pointer;

            &.slick-prev {
                &:hover {
                    background-position: 0 100%;
                }
            }

            &.slick-next {
                right: 0;

                &:hover {
                    background-position: 0 100%;
                }
            }
        }

        .slick-dots {
            position: absolute;
            top: 90%;
            margin: 0;
            padding: 0;

            li {
                display: inline-block;
                position: relative;
                z-index: 3;
                margin: 0 5px;

                button {
                    display: block;
                    width: 12px;
                    height: 12px;
                    font-size: 0;
                    outline: none;
                    cursor: pointer;
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
                top: 50%;
            }

            .slick-dots {
                right: 0;
                left: 0;
                text-align: center;
            }
        }

        &.theme-B {
            .slick-arrow {
                top: 85%;
            }

            .slick-dots {
                right: 70px;
                left: 70px;
                text-align: right;
            }
        }

        .slick-item {
            position: relative;
            overflow: hidden;
            float: left;
            width: 100%;

            .small-img {
                position: absolute;
                top: 50%;
                left: 10%;
                width: 30%;
                opacity: 0;
                transition: all 2s ease-in-out;
                transform: translate(-100%);
            }

            img {
                display: block;
                width: 100%;
            }

            &.slick-active {
                .small-img {
                    opacity: 1;
                    transform: translate(0);
                }
            }
        }

        .btn-edit {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 120px;
            height: 35px;
            line-height: 35px;
            margin: -17px 0 0 -60px;
            border: 1px solid #FDFDFD;
            border-radius: 3px;
            background: #2F2F2F;
            color: #FFF;
            font-size: 14px;
            text-align: center;
            opacity: 0;
            transition: opacity .5s;
            cursor: pointer;
        }

        &:hover {
            .btn-edit {
                z-index: 3;
                opacity: 1;
            }
        }
    }
}
</style>
