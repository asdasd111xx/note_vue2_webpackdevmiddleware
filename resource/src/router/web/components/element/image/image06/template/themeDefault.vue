<template>
    <div class="tpl-wrap clearfix">
        <div class="game-list-wrap clearfix">
            <element-draggable
                v-if="element.case.data.length"
                :element="element"
            >
                <element-wrap
                    v-for="(caseData, index) in element.case.data"
                    :key="`case-${index}`"
                    :index="index"
                    :element="element"
                    :config="config"
                    class="game-pic"
                >
                    <template slot="element">
                        <div @mouseenter="sortIndex = index">
                            <img v-if="sortIndex !== index" :src="$getCdnPath(`${cdnDomain}${caseData.image[curLang]}`)" />
                            <img v-else :src="caseData.imageHover[curLang] ? $getCdnPath(`${cdnDomain}${caseData.imageHover[curLang]}`) : $getCdnPath(`${cdnDomain}${caseData.image[curLang]}`)" />
                        </div>
                    </template>
                </element-wrap>
            </element-draggable>
        </div>
        <div class="big-img-wrap" @click="changePage(element.case.data[sortIndex])">
            <img v-if="element.case.data.length" :src="$getCdnPath(`${cdnDomain}${element.case.data[sortIndex].bigImage[curLang]}`)" />
        </div>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import elementWrap from '../../../common/new/elementWrap';
import elementDraggable from '../../../common/new/elementDraggable';

/**
 * 4+1大小圖
 * @module element/image/image06/template/themeDefault
 * @param {object} config -模塊設定檔
 * @param {object} element -模塊資料
 */
export default {
    components: {
        elementWrap,
        elementDraggable
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
    data() {
        return {
            sortIndex: 0
        };
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

.game-list-wrap {
    float: left;
    width: 26%;

    .theme-B & {
        float: right;
    }

    .element {
        position: relative;
        margin-bottom: 13px;
        cursor: pointer;

        img {
            display: block;
            width: 100%;
        }
    }
}

.big-img-wrap {
    position: relative;
    float: right;
    width: 72%;
    cursor: pointer;

    .theme-B & {
        float: left;
    }

    img {
        display: block;
        width: 100%;
    }
}
</style>
