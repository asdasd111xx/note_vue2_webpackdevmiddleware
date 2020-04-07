<template>
    <!-- 大圖與小圖板塊 -->
    <div class="tpl-wrap clearfix">
        <!-- 小圖板塊 -->
        <element-draggable
            v-if="element.case.data.length"
            :element="element"
            :class="['element-small', 'clearfix', `theme-${element.theme}`, isBackEnd ? 'back' : 'front']"
        >
            <template v-for="(caseData, index) in element.case.data">
                <elementWrap
                    v-if="index !== 0"
                    :key="`case-${index}`"
                    :index="index"
                    :element="element"
                    :config="config"
                    @click="changePage(caseData)"
                >
                    <template slot="element">
                        <div class="image-box">
                            <img :src="caseData.image[curLang] ? $getCdnPath(`${cdnDomain}${caseData.image[curLang]}`) : ''" />
                        </div>
                    </template>
                </elementWrap>
            </template>
        </element-draggable>
        <!-- 大圖板塊 -->
        <sizeImage
            :element="element"
            :config="config"
            :change-page="changePage"
            :class="['element-large', `theme-${element.theme}`, isBackEnd ? 'back' : 'front']"
        />
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import elementWrap from '../../../common/new/elementWrap';
import elementDraggable from '../../../common/new/elementDraggable';
import sizeImage from '../sizeImage';

/**
 * 大圖與小圖版塊預設
 * @module element/image/image02/template/themeDefault
 * @param {object} config -模塊設定檔
 * @param {object} element -模塊資料
 */
export default {
    components: {
        elementWrap,
        elementDraggable,
        sizeImage
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            cdnDomain: 'getCdnDomain',
            curLang: 'getCurLang'
        }),
        sizeData() {
            return this.element.case.data[0];
        }
    },
    methods: {
        ...mapActions(['actionChangePage']),
        /**
         * 更新後端圖片資料
         * @method changePage
         */
        changePage(caseData) {
            if (this.isBackEnd) {
                return;
            }
            this.actionChangePage({
                page: caseData.linkTo[this.$i18n.locale],
                type: caseData.linkType[this.$i18n.locale],
                config: {
                    linkItem: (caseData.linkItem ? caseData.linkItem[this.$i18n.locale] : '')
                }
            });
        }
    }
};
</script>

<style lang="scss" scoped>
@import "~@/css/variable.scss";
.tpl-wrap {
    box-sizing: border-box;
    padding: 64px 6% 50px;
    .element-small {
        width: 100%;
        .element {
            position: relative;
            float: left;
            width: 50%;
            cursor: pointer;
            &:first-child {
                margin-bottom: 1px;
            }
        }
    }
    .image-box {
        img {
            display: block;
            width: 100%;
        }
    }
}
@media screen and (min-width: $sidebar + $phone) {
    .tpl-wrap {
        padding: 64px 10% 60px;
        .element-small {
            float: right;
            width: 33.3%;
            &.theme-B {
                float: left;
            }
            .element {
                display: block;
                float: none;
                width: 100%;
            }
        }
    }
}

@media screen and (min-width: $sidebar + 900px) {
    .tpl-wrap {
        margin: 0 auto;
        padding: 80px 0 60px;
        width: 900px;
        .element-small {
            width: 300px;
        }
    }
}
</style>
