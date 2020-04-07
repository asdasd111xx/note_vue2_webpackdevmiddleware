<template>
    <div :class="`${config.name}-wrap`">
        <slider
            v-if="isShow"
            :type="'swiper'"
            :slider-data="elementDnd"
            :options="sliderOptions"
            :custom-panel="customPanel"
        >
            <template slot="swiper" scope="{ data }">
                <img
                    v-if="data.image"
                    :src="$getCdnPath(`${cdnDomain}${data.image}`)"
                    :class="['swiper-img', isBackEnd ? 'isBackEnd' : 'isFrontEnd']"
                    @click="changePage(data)"
                />
            </template>
        </slider>

        <!-- 左右箭頭 -->
        <template v-if="elementDnd.length > 1">
            <div
                slot="button-prev"
                :class="`swiper-button swiper-button-prev-${element.i} prev ${customPanel.navigation ? navigationPos : ''}`"
                :style="{
                    'background-image': `url(${$getCdnPath(cdnDomain + swiperPrevBtnImg)})`
                }"
                @mouseover="btnPrevHover = true"
                @mouseout="btnPrevHover = false"
            />
            <div
                slot="button-next"
                :class="`swiper-button swiper-button-next-${element.i} next ${customPanel.navigation ? navigationPos : ''}`"
                :style="{
                    'background-image': `url(${$getCdnPath(cdnDomain + swiperNextBtnImg)})`
                }"
                @mouseover="btnNextHover = true"
                @mouseout="btnNextHover = false"
            />
        </template>
        <!-- 分頁器 -->
        <template v-if="elementDnd.length !== 1">
            <div slot="pagination" :class="`swiper-pagination page-${element.i} ${customPanel.pagination ? paginationPos : ''}`" />
        </template>

        <div
            v-if="isBackEnd && !readOnly"
            class="btn-edit"
            @click.stop="isEditing = true"
        >
            {{ $t('S_EDIT', memInfo.config.lang || 'zh-cn') }}
        </div>
        <case-edit
            v-if="isBackEnd && isEditing && !readOnly"
            :config="config"
            :element="element"
            :edit-index="isEditing ? 0 : ''"
            @close="rerender"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import slider from '../../../common/new/slider';
import caseEdit from '../../../common/new/caseEdit';

export default {
    components: {
        slider,
        caseEdit
    },
    props: {
        element: {
            type: Object,
            default: () => ({})
        },
        config: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            isShow: true,
            isEditing: false,
            // customPanel
            customPanel: {
                pagination: true,
                navigation: true
            },
            btnPrevHover: false,
            btnNextHover: false
        };
    },
    computed: {
        ...mapGetters({
            curLang: 'getCurLang',
            memInfo: 'getMemInfo',
            cdnDomain: 'getCdnDomain',
            isBackEnd: 'getIsBackEnd',
            readOnly: 'getReadOnly'
        }),
        elementDnd() {
            if (this.element.case.data[0]) {
                return JSON.parse(this.element.case.data[0].slider[this.curLang]);
            }

            return [];
        },
        caseSetting() {
            return this.element.case.setting;
        },
        navigationPos() {
            return `navigation-pos-${this.element.case.setting.navigationPos}`;
        },
        paginationPos() {
            return `pagination-pos-${this.element.case.setting.paginationPos}`;
        },
        swiperNextBtnImg() {
            if (this.customPanel.navigation) {
                if (!this.btnNextHover) {
                    return this.element.case.setting.rightBtnImg;
                }

                return this.element.case.setting.rightBtnImgHover;
            }

            // default IMG
            if (!this.btnPrevHover) {
                return '/image/element/slider/slider05/default/n_arrow_r.png';
            }

            return '/image/element/slider/slider05/default/n_arrow_r_over.png';
        },
        swiperPrevBtnImg() {
            if (this.customPanel.navigation) {
                if (!this.btnPrevHover) {
                    return this.element.case.setting.leftBtnImg;
                }

                return this.element.case.setting.leftBtnImgHover;
            }

            // default IMG
            if (!this.btnPrevHover) {
                return '/image/element/slider/slider05/default/n_arrow_l.png';
            }

            return '/image/element/slider/slider05/default/n_arrow_l_over.png';
        },
        sliderOptions() {
            const that = this;
            return {
                autoplay: this.elementDnd.length === 1 ? false : {
                    delay: 3000,
                    disableOnInteraction: false
                },
                effect: this.element.case.setting.effect || 'slide',
                noSwiping: this.elementDnd.length === 1,
                noSwipingClass: this.elementDnd.length === 1 ? 'swiper-slide' : '',
                navigation: {
                    prevEl: `.swiper-button-prev-${this.element.i}`,
                    nextEl: `.swiper-button-next-${this.element.i}`
                },
                pagination: {
                    el: `.page-${this.element.i}`,
                    type: 'bullets',
                    clickable: true,
                    bulletClass: 'pagination-bullet',
                    bulletActiveClass: 'pagination-bullet-active',
                    renderBullet(index) {
                        return `
                            <button
                                class='pagination-bullet'
                                style='background: ${index !== this.realIndex ? that.caseSetting.paginationColor || '#3C3C3C' : that.caseSetting.paginationColorActive || '#FFF'};'
                            />
                        `;
                    }
                },
                on: {
                    slideChangeTransitionStart() {
                        const paginationBullets = this.pagination.bullets;
                        if (paginationBullets) {
                            for (let i = 0; i < paginationBullets.length; i += 1) {
                                paginationBullets[i].style.background = that.caseSetting.paginationColor || '#3C3C3C';

                                if (i === this.realIndex) {
                                    paginationBullets[i].style.background = that.caseSetting.paginationColorActive || '#FFF';
                                }
                            }
                        }
                    }
                }
            };
        }
    },
    mounted() {
        this.rerender();
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
        rerender() {
            this.isEditing = false;
            this.isShow = false;
            this.$nextTick(() => {
                this.isShow = true;
            });
        },
        changePage(data) {
            if (!this.isBackEnd) {
                this.actionChangePage({
                    page: data.linkTo,
                    type: data.linkType,
                    config: {
                        linkItem: (data.linkItem ? data.linkItem : '')
                    }
                });
            }
        }
    }
};
</script>

<style lang="scss" scoped>
@import "src/css/variable.scss";

.slider05-wrap {
    position: relative;
    overflow: hidden;
    min-height: 100px;

    .btn-edit {
        font-size: 14px;
        line-height: 35px;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 120px;
        height: 35px;
        margin: -17px 0 0 -60px;
        cursor: pointer;
        transition: opacity .5s;
        text-align: center;
        opacity: 0;
        color: #FFF;
        border: 1px solid #FDFDFD;
        border-radius: 3px;
        background: #2F2F2F;
    }

    &:hover {
        .btn-edit {
            z-index: 3;
            opacity: 1;
        }
    }

    .swiper-img {
        width: 100%;
        display: block;

        &.isBackEnd {
            cursor: auto;
        }

        &.isFrontEnd {
            cursor: pointer;
        }
    }

    /deep/ .swiper-pagination {
        width: 100%;
        bottom: 14px;
        z-index: 1;

        .pagination-bullet {
            width: 11px;
            height: 11px;
            margin: 0 4px;
            border-radius: 100%;
            cursor: pointer;
        }

        &.pagination-pos-left {
            text-align: left;
            padding-left: 84px;
        }

        &.pagination-pos-right {
            text-align: right;
            padding-right: 84px;
        }

        &.pagination-pos-none {
            display: none;
        }
    }

    .swiper-button {
        width: 84px;
        height: 84px;
        cursor: pointer;
        outline: none;
        background-size: auto;
        background-repeat: no-repeat;
        z-index: 2;

        &.prev {
            left: 0;
            position: absolute;

            &.navigation-pos-top {
                top: 0%;
                margin-top: 0;
                background-position: left top;
            }

            &.navigation-pos-middle {
                top: 50%;
                margin-top: -42px;
                background-position: left center;
            }

            &.navigation-pos-bottom {
                top: auto;
                bottom: 0;
                background-position: left bottom;
            }

            &.navigation-pos-centerBottom {
                top: auto;
                bottom: 0;
                left: 50%;
                margin-left: 2px;
                background-position: right bottom;
            }

            &.navigation-pos-none {
                display: none;
            }
        }

        &.next {
            right: 0;
            position: absolute;

            &.navigation-pos-top {
                top: 0%;
                margin-top: 0;
                background-position: right top;
            }

            &.navigation-pos-middle {
                top: 50%;
                margin-top: -42px;
                background-position: right center;
            }

            &.navigation-pos-bottom {
                top: auto;
                bottom: 0;
                background-position: right bottom;
            }

            &.navigation-pos-centerBottom {
                top: auto;
                bottom: 0;
                left: 50%;
                margin-left: 85px;
                background-position: left bottom;
            }

            &.navigation-pos-none {
                display: none;
            }
        }
    }
}
</style>
