<template>
    <div class="tpl-wrap clearfix">
        <!-- 大圖板塊 -->
        <sizeImg
            v-if="element.case.data[0]"
            :element="element"
            :config="config"
            :index="0"
            :change-page="changePage"
        />
        <!-- 小圖板塊 -->
        <element-draggable
            v-if="element.case.data.length"
            :element="element"
            class="image-wrap clearfix"
        >
            <template v-for="(caseData, index) in element.case.data">
                <element-wrap
                    v-if="index !== 0"
                    :key="`case-${index}`"
                    :index="index"
                    :element="element"
                    :config="config"
                    class="subImg"
                    @click="changePage(caseData)"
                >
                    <template slot="element">
                        <img :src="$getCdnPath(`${cdnDomain}${caseData.image[curLang]}`)" class="imgout" />
                        <img :src="caseData.imageHover[curLang] ? $getCdnPath(`${cdnDomain}${caseData.imageHover[curLang]}`) : $getCdnPath(`${cdnDomain}${caseData.image[curLang]}`)" class="imgin" />
                    </template>
                </element-wrap>
            </template>
        </element-draggable>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import elementWrap from '../../../common/new/elementWrap';
import elementDraggable from '../../../common/new/elementDraggable';
import sizeImg from './sizeImg';

/**
 * 大圖與小圖版塊預設
 * @module element/image/image05/template/themeDefault
 * @param {object} config -模塊設定檔
 * @param {object} element -模塊資料
 */
export default {
    components: {
        elementWrap,
        elementDraggable,
        sizeImg
    },
    props: {
        config: {
            type: Object,
            required: true
        },
        element: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        ...mapGetters({
            isBackEnd: 'getIsBackEnd',
            cdnDomain: 'getCdnDomain',
            curLang: 'getCurLang'
        })
    },
    methods: {
        ...mapActions([
            'actionChangePage'
        ]),
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
.subImg{
    position: relative;
    width: 25%;
    float: left;

    img {
        width: 100%;
        cursor: pointer;

        &.imgout {
            display: block;
        }

        &.imgin {
            display: none;
        }
    }

    &:hover {
        .imgout {
            display: none;
        }

        .imgin {
            display: block;
        }
    }
}

.element-wrap {
    position: relative;
    box-sizing: border-box;
}

@media screen and (max-width: $sidebar + $pad) {
    .subImg{
        width: 50%;
        float: left;
    }
}
</style>
